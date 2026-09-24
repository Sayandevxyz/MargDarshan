from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any, List

from backend.app.core.database import get_db
from backend.app.api.deps import get_current_user, require_role
from backend.app.models.models import (
    User, ReviewTask, Application, Student, Verification, StageEvent, Notification, AuditLog
)
from backend.app.schemas.schemas import OfficerDecisionRequest

router = APIRouter(prefix="/officer", tags=["Officer Operations"])

@router.get("/reviews")
def get_verification_queue(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tasks = db.query(ReviewTask).order_by(ReviewTask.created_at.desc()).all()
    queue = []
    for t in tasks:
        app = t.application
        student = app.student if app else None
        
        # Calculate age in days
        created = t.created_at or datetime.now(timezone.utc)
        age_days = (datetime.now(timezone.utc) - created.replace(tzinfo=timezone.utc if created.tzinfo is None else None)).days
        age_str = f"{max(1, age_days)} days" if age_days > 0 else "Today"

        verif = t.verification
        source = verif.source if verif else "UDISE+"
        conf = f"{int(verif.confidence * 100)}%" if verif else "74%"

        queue.append({
            "id": t.id,
            "application_id": app.id if app else "",
            "application_no": app.application_no if app else "APP-2026-00192",
            "student_name": student.name if student else "Anita Murmu",
            "student_apaar": student.apaar_id if student else "APAAR-2026-DEMO-002",
            "district": student.district if student else "Bastar",
            "issue": t.reason,
            "source": source,
            "confidence": conf,
            "confidence_val": verif.confidence if verif else 0.74,
            "priority": t.priority,
            "status": t.status,
            "age": age_str,
            "created_at": t.created_at.strftime("%d %b %Y") if t.created_at else ""
        })
    return queue

@router.get("/reviews/{id}")
def get_review_detail(
    id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = db.query(ReviewTask).filter(ReviewTask.id == id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Review task not found")

    app = task.application
    student = app.student if app else None
    verif = task.verification

    # Fuzzy breakdown explanation
    fuzzy_evidence = {}
    if verif and verif.evidence_json and "fuzzy_breakdown" in verif.evidence_json:
        fuzzy_evidence = verif.evidence_json

    docs = []
    if student:
        for d in student.documents:
            if d.is_active:
                docs.append({
                    "id": d.id,
                    "doc_type": d.doc_type,
                    "filename": d.original_filename,
                    "is_verified": d.is_verified,
                    "extracted_data": d.extracted_data or {},
                    "issued_on": d.issued_on,
                    "expires_on": d.expires_on,
                    "hash": d.document_hash[:10] + "..."
                })

    return {
        "task_id": task.id,
        "application_id": app.id if app else "",
        "application_no": app.application_no if app else "",
        "status": task.status,
        "priority": task.priority,
        "reason": task.reason,
        "assigned_officer": task.assigned_officer,
        "student": {
            "id": student.id if student else "",
            "name": student.name if student else "",
            "apaar_id": student.apaar_id if student else "",
            "category": student.category if student else "ST",
            "state": student.state if student else "",
            "district": student.district if student else "",
            "mobile": student.mobile if student else "",
            "institution": student.institution.name if (student and student.institution) else "Govt Higher Secondary School"
        },
        "verification": {
            "source": verif.source if verif else "UDISE+",
            "field": verif.field if verif else "name",
            "result": verif.result if verif else "MISMATCH",
            "confidence": round(verif.confidence * 100, 1) if verif else 74.0,
            "evidence": fuzzy_evidence or {
                "fuzzy_breakdown": {"name_score": 71.0, "dob_score": 100.0, "guardian_score": 68.0, "institution_score": 95.0},
                "fuzzy_details": {"submitted_name": student.name if student else "Anita Murmu", "source_name": "Anita M Murmu"}
            }
        },
        "documents": docs
    }

@router.post("/reviews/{id}/decision")
def submit_officer_decision(
    id: str,
    req: OfficerDecisionRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    action = req.action.upper()
    remarks = req.remarks.strip()

    # Section 22: Require remarks before rejection
    if action == "REJECT" and not remarks:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mandatory remarks are required before rejecting an application."
        )

    task = db.query(ReviewTask).filter(ReviewTask.id == id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Review task not found")

    app = task.application
    student = app.student if app else None

    previous_state = app.status if app else "UNDER_REVIEW"

    if action == "APPROVE":
        task.status = "RESOLVED"
        task.resolution = "APPROVED"
        task.officer_remarks = remarks or "Officer verified demographic/caste record authenticity."
        task.resolved_at = datetime.now(timezone.utc)

        if app:
            app.status = "VERIFIED"
            app.current_stage = "Officer Approved & Verified"
            app.health_score = 92
            
            db.add(StageEvent(
                application_id=app.id,
                stage="Officer Manual Review",
                status="COMPLETED",
                actor=f"Welfare Officer ({user.name})",
                remarks=task.officer_remarks
            ))

            if student and student.user_id:
                db.add(Notification(
                    user_id=student.user_id,
                    title="Verification Approved",
                    message="Your application was manually reviewed and approved by the welfare officer.",
                    priority="NORMAL",
                    channel="PUSH",
                    action_url=f"/applications/{app.id}"
                ))

    elif action == "REJECT":
        task.status = "RESOLVED"
        task.resolution = "REJECTED"
        task.officer_remarks = remarks
        task.resolved_at = datetime.now(timezone.utc)

        if app:
            app.status = "REJECTED"
            app.current_stage = "Application Rejected"
            app.health_score = 30

            # Explainable Rejection (Section 23)
            db.add(StageEvent(
                application_id=app.id,
                stage="Officer Review Decision",
                status="FAILED",
                actor=f"Welfare Officer ({user.name})",
                remarks=f"Rejected: {remarks}. What you can do: 1. Review reasons, 2. Upload requested evidence, 3. Re-apply."
            ))

            if student and student.user_id:
                db.add(Notification(
                    user_id=student.user_id,
                    title="Application Action Required",
                    message=f"Application not approved: {remarks}. Please see explainable feedback.",
                    priority="CRITICAL",
                    channel="SMS",
                    action_url=f"/applications/{app.id}"
                ))

    elif action == "REQUEST_CORRECTION":
        task.status = "PENDING"
        task.resolution = "CORRECTION_REQUESTED"
        task.officer_remarks = remarks or "Please upload an updated document showing matching spelling."

        if app:
            app.status = "ACTION_REQUIRED"
            app.current_stage = "Correction Requested"
            app.deficiency_count += 1
            app.health_score = 55

            db.add(StageEvent(
                application_id=app.id,
                stage="Correction Requested",
                status="FLAGGED",
                actor=f"Welfare Officer ({user.name})",
                remarks=task.officer_remarks
            ))

            if student and student.user_id:
                db.add(Notification(
                    user_id=student.user_id,
                    title="Action Required on Application",
                    message=f"Officer request: {task.officer_remarks}",
                    priority="CRITICAL",
                    channel="WHATSAPP",
                    action_url=f"/applications/{app.id}"
                ))

    elif action == "ESCALATE":
        task.status = "ESCALATED"
        task.resolution = "ESCALATED_TO_STATE"
        task.priority = "High"
        task.officer_remarks = remarks or "Escalated to State Tribal Development Commissioner for policy determination."

    # Audit log
    db.add(AuditLog(
        user_id=user.id,
        user_name=user.name,
        role="OFFICER",
        action=f"OFFICER_DECISION_{action}",
        resource=f"ReviewTask:{task.id}",
        previous_state=previous_state,
        new_state=app.status if app else action,
        remarks=remarks
    ))

    db.commit()

    return {
        "status": "SUCCESS",
        "action_taken": action,
        "review_id": task.id,
        "application_status": app.status if app else "UNKNOWN",
        "message": f"Officer decision '{action}' recorded successfully."
    }

import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any, List

from backend.app.core.database import get_db
from backend.app.api.deps import get_current_user
from backend.app.models.models import (
    User, Student, Application, Scheme, StageEvent, Document, AuditLog
)
from backend.app.schemas.schemas import ApplicationCreateRequest
from backend.app.analytics.engine import compute_predictive_delay

router = APIRouter(prefix="/applications", tags=["Applications"])

@router.post("")
def create_application(
    req: ApplicationCreateRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.user_id == user.id).first()
    if not student:
        raise HTTPException(status_code=400, detail="Student profile required to create an application.")

    scheme = db.query(Scheme).filter(Scheme.code == req.scheme_code.upper()).first()
    if not scheme:
        raise HTTPException(status_code=404, detail=f"Scheme '{req.scheme_code}' not found.")

    # Check for active scholarship conflict (Section 25: ST student can only avail one scholarship at a time)
    active_apps = db.query(Application).filter(
        Application.student_id == student.id,
        Application.status.in_(["VERIFIED", "SANCTIONED", "PAYMENT_PROCESSING", "DISBURSED"])
    ).all()

    has_conflict = len(active_apps) > 0
    conflict_warning = None
    if has_conflict:
        existing = active_apps[0]
        conflict_warning = {
            "title": "Scholarship Conflict Detected",
            "message": f"You currently hold an active scholarship: {existing.scheme.name if existing.scheme else 'Active Scheme'}. "
                       f"Under Ministry of Tribal Affairs guidelines, a student may only avail one scholarship at a time. "
                       f"You may continue drafting this application, but you must choose before final sanction.",
            "current_scheme": existing.scheme.name if existing.scheme else "Current Scheme",
            "attempted_scheme": scheme.name
        }

    # Generate new application
    app_no = f"APP-DEMO-2026-{str(uuid.uuid4().int)[:5]}"
    application = Application(
        application_no=app_no,
        student_id=student.id,
        scheme_id=scheme.id,
        academic_year=req.academic_year,
        status="SUBMITTED",
        current_stage="Application Submitted",
        health_score=75,
        submitted_at=datetime.now(timezone.utc)
    )
    db.add(application)
    db.flush()

    # Initial stage event (Section 12: Application Timeline)
    stage1 = StageEvent(
        application_id=application.id,
        stage="Application Submitted",
        status="COMPLETED",
        actor="Student",
        remarks="Application successfully filed with initial document bundle."
    )
    stage2 = StageEvent(
        application_id=application.id,
        stage="Identity & Cross-Verification",
        status="IN_PROGRESS",
        actor="MargDarshan Verification Engine",
        remarks="Automated adapter checks scheduled across UIDAI, UDISE+/AISHE, and e-District."
    )
    db.add(stage1)
    db.add(stage2)

    # Document reuse logic (Section 15: If student has already verified documents, reuse them!)
    if req.documents_to_reuse:
        for doc_id in req.documents_to_reuse:
            doc = db.query(Document).filter(Document.id == doc_id, Document.student_id == student.id).first()
            if doc:
                doc.is_active = True

    # Audit log
    db.add(AuditLog(
        user_id=user.id,
        user_name=student.name,
        role=user.role,
        action="CREATE_APPLICATION",
        resource=f"Application:{app_no}",
        previous_state=None,
        new_state="SUBMITTED",
        remarks=f"Application created for scheme {scheme.code} with conflict flag: {has_conflict}"
    ))

    db.commit()
    db.refresh(application)

    return {
        "status": "CREATED",
        "application_id": application.id,
        "application_no": application.application_no,
        "scheme": scheme.name,
        "conflict_warning": conflict_warning,
        "message": "Application submitted successfully."
    }

@router.get("/{id}")
def get_application_details(
    id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    app = db.query(Application).filter(Application.id == id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    student = app.student
    stages = [
        {
            "id": s.id,
            "stage": s.stage,
            "status": s.status,
            "timestamp": s.timestamp.strftime("%d %b %Y, %I:%M %p") if s.timestamp else "",
            "actor": s.actor,
            "remarks": s.remarks
        }
        for s in app.stages
    ]

    verifs = [
        {
            "id": v.id,
            "field": v.field,
            "source": v.source,
            "result": v.result,
            "confidence": round(v.confidence * 100, 1),
            "decision": v.decision,
            "evidence": v.evidence_json or {}
        }
        for v in app.verifications
    ]

    return {
        "id": app.id,
        "application_no": app.application_no,
        "student": {
            "name": student.name,
            "apaar_id": student.apaar_id,
            "category": student.category,
            "district": student.district,
            "state": student.state,
            "institution": student.institution.name if student.institution else "Govt Model School",
            "current_course": student.current_course
        },
        "scheme": {
            "code": app.scheme.code if app.scheme else "",
            "name": app.scheme.name if app.scheme else "",
            "benefits": app.scheme.benefits_summary if app.scheme else ""
        },
        "academic_year": app.academic_year,
        "status": app.status,
        "current_stage": app.current_stage,
        "health_score": app.health_score,
        "submitted_at": app.submitted_at.strftime("%d %b %Y") if app.submitted_at else "",
        "stages": stages,
        "verifications": verifs
    }

@router.get("/{id}/predictive-delay")
def get_application_delay_prediction(
    id: str,
    db: Session = Depends(get_db)
):
    return compute_predictive_delay(db, id)

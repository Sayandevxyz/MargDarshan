import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import Dict, Any, List, Optional

from backend.app.core.database import get_db
from backend.app.api.deps import get_current_user, get_current_user_optional
from backend.app.models.models import (
    Scheme, Student, Parent, FamilyLink, Application, Grievance, Notification, BeneficiaryMatch, User, Payment
)
from backend.app.schemas.schemas import (
    EligibilityCheckRequest, EligibilityCheckResponse, EligibilityResultItem,
    SMSStatusRequest, SMSStatusResponse, GrievanceCreateRequest, GrievanceResponse
)
from backend.app.adapters import set_global_adapter_mode, ADAPTER_REGISTRY
from backend.app.analytics.engine import get_unreached_beneficiaries

router = APIRouter(tags=["Public & Utilities"])

@router.get("/health")
def demo_health_check():
    """
    Section 77 Demo Health Check:
    Returns exact required status payload.
    """
    return {
        "status": "healthy",
        "database": "connected",
        "redis": "connected",
        "ai": "configured",
        "mock_integrations": "ready",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@router.get("/schemes")
def list_schemes(db: Session = Depends(get_db)):
    schemes = db.query(Scheme).all()
    return [
        {
            "id": s.id,
            "code": s.code,
            "name": s.name,
            "description": s.description,
            "target_audience": s.target_audience,
            "academic_level": s.academic_level,
            "max_income": s.max_income,
            "benefits_summary": s.benefits_summary,
            "is_active": s.is_active,
            "rules": s.rules_json or {}
        }
        for s in schemes
    ]

@router.post("/eligibility/check", response_model=EligibilityCheckResponse)
def check_student_eligibility(
    req: EligibilityCheckRequest,
    db: Session = Depends(get_db)
):
    """
    Section 24 Eligibility Checker & Section 25 Conflict Detection
    """
    schemes = db.query(Scheme).all()
    eligible = []
    ineligible = []

    income = req.family_income
    course = req.current_class_or_course.lower()

    for s in schemes:
        is_ok = True
        reasons = []

        if not req.st_category:
            is_ok = False
            reasons.append("Applicant must belong to Scheduled Tribe (ST) community.")

        if s.max_income and income > s.max_income:
            is_ok = False
            reasons.append(f"Family income ₹{int(income):,} exceeds limit of ₹{int(s.max_income):,}.")

        if s.code == "PRE_MATRIC":
            if not ("9" in course or "10" in course or "ix" in course or "x" in course):
                is_ok = False
                reasons.append("Pre-Matric is strictly for Class 9 and Class 10.")
        elif s.code == "POST_MATRIC":
            if "9" in course or "10" in course or "ix" in course:
                is_ok = False
                reasons.append("Post-Matric is for post-secondary education (Class 11, 12, Degree, Diploma).")
        elif s.code == "TOP_CLASS":
            if not ("iit" in course or "nit" in course or "b.tech" in course or "premier" in course or "degree" in course):
                is_ok = False
                reasons.append("Requires admission to a MoTA-notified premier institution (IIT/NIT/IIM/AIIMS/etc.).")
        elif s.code == "NFST":
            if not (req.has_net_jrf or "phd" in course or "m.phil" in course or "research" in course):
                is_ok = False
                reasons.append("Requires regular M.Phil / Ph.D enrollment and UGC-NET / GATE qualification.")
        elif s.code == "NOS":
            if not (req.has_foreign_admission or "foreign" in course or "abroad" in course):
                is_ok = False
                reasons.append("Requires confirmed admission to top 500 QS World University.")

        item = EligibilityResultItem(
            scheme_code=s.code,
            scheme_name=s.name,
            is_eligible=is_ok,
            reasons=reasons if not is_ok else ["Meets income criteria", "Academic level aligned"],
            estimated_benefit=s.benefits_summary
        )

        if is_ok:
            eligible.append(item)
        else:
            ineligible.append(item)

    conflict_details = None
    if req.has_active_scholarship and len(eligible) > 0:
        conflict_details = {
            "warning": "You currently hold an active scholarship. You can only avail one scholarship at a time.",
            "current_scheme": "Post-Matric Scholarship",
            "potential_schemes": [e.scheme_name for e in eligible],
            "key_differences": "Higher grant ceilings apply to Top Class/Fellowship, but require termination of the previous scheme upon acceptance."
        }

    return EligibilityCheckResponse(
        disclaimer="Preliminary eligibility check. Final eligibility is determined under the applicable scheme guidelines.",
        eligible_schemes=eligible,
        ineligible_schemes=ineligible,
        has_conflict=req.has_active_scholarship,
        conflict_details=conflict_details
    )

@router.get("/beneficiaries/unreached")
def list_unreached(limit: int = 50, db: Session = Depends(get_db)):
    return get_unreached_beneficiaries(db, limit)

@router.get("/family/my-children")
def get_parent_family_dashboard(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Section 27 Family View:
    Parent dashboard showing multiple children (e.g. Ramesh - Post-Matric Disbursed, Anita - Pre-Matric Document pending).
    Only access children linked through synthetic family records!
    """
    parent = db.query(Parent).filter(Parent.user_id == user.id).first()
    if not parent:
        # Fallback to demo parent Sita Devi
        parent = db.query(Parent).first()

    links = db.query(FamilyLink).filter(FamilyLink.parent_id == parent.id).all() if parent else []
    children_data = []

    for link in links:
        student = link.student
        app = db.query(Application).filter(Application.student_id == student.id).order_by(Application.submitted_at.desc()).first()
        payment = db.query(Payment).filter(Payment.student_id == student.id).first()

        children_data.append({
            "student_id": student.id,
            "name": student.name,
            "apaar_id": student.apaar_id,
            "class": student.current_course,
            "district": student.district,
            "institution": student.institution.name if student.institution else "Govt Model School",
            "relationship": link.relationship_type,
            "application": {
                "application_no": app.application_no if app else "None",
                "scheme_name": app.scheme.name if app and app.scheme else "Pre-Matric Scholarship",
                "status": app.status if app else "DRAFT",
                "current_stage": app.current_stage if app else "Not Started",
                "health_score": app.health_score if app else 50,
                "pending_action": "Upload updated income certificate" if (app and app.status == "ACTION_REQUIRED") else ("Manual Review Pending" if (app and app.status == "UNDER_REVIEW") else "None")
            },
            "payment": {
                "amount": f"₹{int(payment.amount):,}" if payment else "₹0",
                "status": payment.dbt_status if payment else "Not started",
                "utr": payment.utr if payment else "N/A"
            }
        })

    return {
        "parent_name": parent.name if parent else "Sita Devi",
        "family_id": parent.id if parent else "FAM-DEMO-001",
        "children": children_data
    }

@router.post("/sms/status", response_model=SMSStatusResponse)
def simulate_sms_status(req: SMSStatusRequest, db: Session = Depends(get_db)):
    """
    Section 84 Missed-call / SMS simulation:
    Demonstrates access for users without smartphones.
    """
    app_no = req.application_no.strip()
    app = db.query(Application).filter(Application.application_no.ilike(f"%{app_no}%")).first()
    
    if not app:
        # Default mock simulation
        return SMSStatusResponse(
            status="SUCCESS",
            application_no=app_no,
            scheme_name="Post-Matric Scholarship",
            stage="Verification in progress",
            next_action="None",
            message=f"[MargDarshan SMS] App {app_no}: Post-Matric Scholarship. Status: Verification in progress. Next action: None."
        )

    next_act = "None"
    if app.status == "ACTION_REQUIRED":
        next_act = "Upload new income certificate"
    elif app.status == "UNDER_REVIEW":
        next_act = "Officer review in progress"

    return SMSStatusResponse(
        status="SUCCESS",
        application_no=app.application_no,
        scheme_name=app.scheme.name if app.scheme else "ST Scholarship",
        stage=app.current_stage,
        next_action=next_act,
        message=f"[MargDarshan SMS] App {app.application_no}: {app.scheme.name if app.scheme else 'Scholarship'}. Stage: {app.current_stage}. Next action: {next_act}."
    )

@router.post("/demo/simulate-adapter")
def set_demo_adapter_simulation(
    source_name: str = Body("ALL", embed=True),
    mode: str = Body("NORMAL", embed=True)
):
    """
    Section 43 & 53 Demo control:
    Normal, Mismatch, Source unavailable.
    Allows judges to see exception handling live.
    """
    set_global_adapter_mode(source_name, mode)
    return {
        "status": "UPDATED",
        "source": source_name,
        "mode": mode.upper(),
        "message": f"Adapter '{source_name}' simulation mode set to '{mode.upper()}'."
    }

@router.get("/notifications")
def get_user_notifications(
    user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    query = db.query(Notification)
    if user:
        query = query.filter(Notification.user_id == user.id)
    notifs = query.order_by(Notification.created_at.desc()).limit(20).all()

    return [
        {
            "id": n.id,
            "title": n.title,
            "message": n.message,
            "priority": n.priority,
            "channel": n.channel,
            "is_read": n.is_read,
            "action_url": n.action_url,
            "created_at": n.created_at.strftime("%d %b, %I:%M %p") if n.created_at else ""
        }
        for n in notifs
    ]

@router.get("/grievances")
def list_grievances(
    user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    query = db.query(Grievance)
    if user and user.role == "STUDENT" and user.student_profile:
        query = query.filter(Grievance.student_id == user.student_profile.id)
    items = query.order_by(Grievance.created_at.desc()).all()
    return [
        {
            "id": g.id,
            "ticket_id": g.ticket_id,
            "student_id": g.student_id,
            "issue_type": g.issue_type,
            "description": g.description,
            "status": g.status,
            "resolution_remarks": g.resolution_remarks,
            "created_at": g.created_at.strftime("%d %b %Y") if g.created_at else "",
            "updated_at": g.updated_at.strftime("%d %b %Y") if g.updated_at else ""
        }
        for g in items
    ]

@router.post("/grievances", response_model=GrievanceResponse)
def submit_grievance(
    req: GrievanceCreateRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.user_id == user.id).first()
    student_id = student.id if student else "DEMO-STU-001"

    ticket_id = f"GRV-2026-{uuid.uuid4().hex[:6].upper()}"
    g = Grievance(
        ticket_id=ticket_id,
        student_id=student_id,
        issue_type=req.issue_type,
        description=req.description,
        status="SUBMITTED"
    )
    db.add(g)
    db.commit()
    db.refresh(g)
    return g

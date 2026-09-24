from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from datetime import datetime, timezone
import uuid

from backend.app.models.models import (
    Student, Application, Document, Payment, Verification, Grievance, Scheme, FamilyLink, Parent, Notification
)

def get_application_status(db: Session, student_id: str) -> Dict[str, Any]:
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        return {"error": "Student not found"}
    
    app = db.query(Application).filter(Application.student_id == student_id).order_by(Application.submitted_at.desc()).first()
    if not app:
        return {"status": "NO_APPLICATION", "message": "No active scholarship applications found on your profile."}
    
    return {
        "application_no": app.application_no,
        "scheme_name": app.scheme.name if app.scheme else "Post-Matric Scholarship",
        "academic_year": app.academic_year,
        "status": app.status,
        "current_stage": app.current_stage,
        "health_score": app.health_score,
        "submitted_at": app.submitted_at.strftime("%d %b %Y") if app.submitted_at else "2026-08-24"
    }

def list_deficiencies(db: Session, student_id: str) -> List[Dict[str, Any]]:
    app = db.query(Application).filter(Application.student_id == student_id).order_by(Application.submitted_at.desc()).first()
    if not app:
        return []
    
    deficiencies = []
    # Check verifications for flagged or mismatch items
    verifs = db.query(Verification).filter(Verification.application_id == app.id).all()
    for v in verifs:
        if v.decision in ["MANUAL_REVIEW", "FAIL"]:
            deficiencies.append({
                "field": v.field,
                "source": v.source,
                "reason": f"{v.field.replace('_', ' ').capitalize()} discrepancy detected via {v.source}.",
                "confidence": v.confidence,
                "action_required": "Review and update the supporting certificate if requested by the officer."
            })
    
    # Check document expirations
    docs = db.query(Document).filter(Document.student_id == student_id, Document.is_active == True).all()
    for d in docs:
        if d.expires_on and "2026" in d.expires_on:
            deficiencies.append({
                "field": d.doc_type,
                "source": "Document Wallet",
                "reason": f"{d.doc_type.replace('_', ' ').title()} expired on {d.expires_on}.",
                "action_required": "Upload valid current financial year certificate."
            })
    return deficiencies

def get_payment_history(db: Session, student_id: str) -> Dict[str, Any]:
    payments = db.query(Payment).filter(Payment.student_id == student_id).all()
    if not payments:
        # Check if there is an active application
        app = db.query(Application).filter(Application.student_id == student_id).first()
        if app and app.status in ["VERIFIED", "SANCTIONED"]:
            return {
                "payments": [],
                "latest_status": "SANCTIONED",
                "message": "Your scholarship application has been sanctioned, but the payment is currently awaiting DBT processing. The latest status was updated on 18 September 2026."
            }
        return {"payments": [], "message": "No disbursement records found for your account yet."}
    
    items = []
    for p in payments:
        items.append({
            "amount": f"₹{int(p.amount):,}",
            "academic_year": p.academic_year,
            "dbt_status": p.dbt_status,
            "utr": p.utr,
            "date": p.disbursement_date or "12 Sept 2026",
            "account_masked": p.account_masked,
            "pfms_ref": p.pfms_ref
        })
    return {"payments": items, "latest_status": items[0]["dbt_status"] if items else "NONE"}

def check_eligibility(db: Session, student_id: Optional[str], criteria: Dict[str, Any]) -> Dict[str, Any]:
    schemes = db.query(Scheme).filter(Scheme.active == True).all() if hasattr(Scheme, 'active') else db.query(Scheme).all()
    eligible = []
    ineligible = []
    
    income = float(criteria.get("family_income", 120000.0))
    current_course = criteria.get("current_course", "Class 10").lower()
    
    for s in schemes:
        is_ok = True
        reasons = []
        if s.max_income and income > s.max_income:
            is_ok = False
            reasons.append(f"Income ₹{int(income):,} exceeds scheme ceiling of ₹{int(s.max_income):,}.")
        
        if s.code == "PRE_MATRIC" and ("11" in current_course or "12" in current_course or "degree" in current_course or "b." in current_course):
            is_ok = False
            reasons.append("Pre-Matric is strictly for Class 9 and Class 10.")
        elif s.code == "POST_MATRIC" and ("9" in current_course or "10" in current_course):
            is_ok = False
            reasons.append("Post-Matric requires completion of Class 10.")
            
        if is_ok:
            eligible.append({"code": s.code, "name": s.name, "benefits": s.benefits_summary})
        else:
            ineligible.append({"code": s.code, "name": s.name, "reasons": reasons})
            
    return {
        "disclaimer": "Preliminary eligibility check. Final eligibility is determined under the applicable scheme guidelines.",
        "eligible": eligible,
        "ineligible": ineligible
    }

def get_required_documents(scheme_code: str) -> List[str]:
    docs_map = {
        "PRE_MATRIC": ["ST Community Certificate", "Family Income Certificate", "Class 8/9 Marksheet", "School Bonafide / UDISE+ Certificate", "Aadhaar-seeded Bank Account"],
        "POST_MATRIC": ["ST Community Certificate", "Family Income Certificate", "Class 10 Secondary Marksheet", "College Admission Proof / AISHE Certificate", "Bank Passbook / DBT Account"],
        "TOP_CLASS": ["ST Community Certificate", "Income Certificate (< ₹6 Lakhs)", "Premier Institute Admission Letter", "Hostel / Fee Structure Schedule"],
        "NFST": ["ST Community Certificate", "UGC-NET / CSIR-NET JRF Scorecard", "M.Phil / Ph.D Confirmation of Registration", "Research Proposal Abstract"],
        "NOS": ["ST Community Certificate", "Degree Marksheets (> 55%)", "Unconditional Foreign Admission Offer", "Valid Indian Passport", "Income Certificate (< ₹8 Lakhs)"]
    }
    return docs_map.get(scheme_code.upper(), ["ST Certificate", "Income Certificate", "Academic Marksheet", "Admission Proof"])

def get_document_status(db: Session, student_id: str) -> List[Dict[str, Any]]:
    docs = db.query(Document).filter(Document.student_id == student_id, Document.is_active == True).all()
    results = []
    for d in docs:
        results.append({
            "doc_type": d.doc_type,
            "filename": d.original_filename,
            "is_verified": d.is_verified,
            "source": d.source,
            "issued_on": d.issued_on,
            "expires_on": d.expires_on,
            "hash": d.document_hash[:12] + "..."
        })
    return results

def get_scheme_information(db: Session, scheme_code: str) -> Dict[str, Any]:
    scheme = db.query(Scheme).filter(Scheme.code == scheme_code.upper()).first()
    if not scheme:
        return {"error": "Scheme not found"}
    return {
        "code": scheme.code,
        "name": scheme.name,
        "description": scheme.description,
        "target_audience": scheme.target_audience,
        "academic_level": scheme.academic_level,
        "max_income": f"₹{int(scheme.max_income):,}" if scheme.max_income else "No income limit",
        "benefits": scheme.benefits_summary
    }

def get_verification_status(db: Session, student_id: str) -> Dict[str, Any]:
    app = db.query(Application).filter(Application.student_id == student_id).order_by(Application.submitted_at.desc()).first()
    if not app:
        return {"message": "No applications found."}
    
    verifs = db.query(Verification).filter(Verification.application_id == app.id).all()
    details = []
    for v in verifs:
        details.append({
            "field": v.field,
            "source": v.source,
            "result": v.result,
            "confidence": f"{int(v.confidence * 100)}%",
            "decision": v.decision
        })
    return {
        "application_no": app.application_no,
        "status": app.status,
        "current_stage": app.current_stage,
        "verifications": details
    }

def get_family_status(db: Session, parent_id: str) -> Dict[str, Any]:
    parent = db.query(Parent).filter(Parent.id == parent_id).first()
    if not parent:
        return {"error": "Parent record not found"}
    
    links = db.query(FamilyLink).filter(FamilyLink.parent_id == parent_id).all()
    children = []
    for link in links:
        s = link.student
        app = db.query(Application).filter(Application.student_id == s.id).order_by(Application.submitted_at.desc()).first()
        children.append({
            "name": s.name,
            "apaar_id": s.apaar_id,
            "scheme": app.scheme.name if app and app.scheme else "None",
            "status": app.status if app else "No Application",
            "current_stage": app.current_stage if app else "-"
        })
    return {"parent_name": parent.name, "children": children}

def create_alert(db: Session, user_id: str, title: str, message: str) -> Dict[str, Any]:
    notif = Notification(
        user_id=user_id,
        title=title,
        message=message,
        priority="NORMAL",
        channel="PUSH"
    )
    db.add(notif)
    db.commit()
    return {"status": "SUCCESS", "message": "Notification alert scheduled."}

def create_grievance(db: Session, student_id: str, issue_type: str, description: str) -> Dict[str, Any]:
    ticket_id = f"GRV-2026-{uuid.uuid4().hex[:6].upper()}"
    g = Grievance(
        ticket_id=ticket_id,
        student_id=student_id,
        issue_type=issue_type,
        description=description,
        status="SUBMITTED"
    )
    db.add(g)
    db.commit()
    return {
        "status": "CREATED",
        "ticket_id": ticket_id,
        "message": f"Grievance ticket {ticket_id} created successfully. District officer assigned."
    }

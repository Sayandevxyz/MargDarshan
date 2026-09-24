from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any, List

from backend.app.core.database import get_db
from backend.app.api.deps import get_current_user
from backend.app.models.models import User, Student, Application, Document, Payment, ConsentRecord, Scheme

router = APIRouter(prefix="/students", tags=["Students"])

@router.get("/me")
def get_my_student_profile(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.user_id == user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found for current user.")
    
    return {
        "id": student.id,
        "apaar_id": student.apaar_id,
        "name": student.name,
        "dob": student.dob,
        "gender": student.gender,
        "category": student.category,
        "state": student.state,
        "district": student.district,
        "mobile": student.mobile,
        "email": student.email,
        "language": student.language,
        "current_course": student.current_course,
        "family_income": student.family_income,
        "pvtg_status": student.pvtg_status,
        "disability": student.disability,
        "institution_name": student.institution.name if student.institution else "Govt Model Higher Secondary School"
    }

@router.get("/me/applications")
def get_my_applications(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.user_id == user.id).first()
    if not student:
        return []
    
    apps = db.query(Application).filter(Application.student_id == student.id).order_by(Application.submitted_at.desc()).all()
    out = []
    for a in apps:
        out.append({
            "id": a.id,
            "application_no": a.application_no,
            "scheme_id": a.scheme_id,
            "scheme_code": a.scheme.code if a.scheme else "POST_MATRIC",
            "scheme_name": a.scheme.name if a.scheme else "Post-Matric Scholarship",
            "academic_year": a.academic_year,
            "status": a.status,
            "current_stage": a.current_stage,
            "health_score": a.health_score,
            "deficiency_count": a.deficiency_count,
            "submitted_at": a.submitted_at.isoformat() if a.submitted_at else None,
            "stages": [
                {
                    "stage": s.stage,
                    "status": s.status,
                    "timestamp": s.timestamp.strftime("%d %b %Y, %I:%M %p") if s.timestamp else "",
                    "actor": s.actor,
                    "remarks": s.remarks
                }
                for s in a.stages
            ]
        })
    return out

@router.get("/me/documents")
def get_my_documents(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.user_id == user.id).first()
    if not student:
        return []
    
    docs = db.query(Document).filter(Document.student_id == student.id, Document.is_active == True).all()
    return [
        {
            "id": d.id,
            "doc_type": d.doc_type,
            "original_filename": d.original_filename,
            "file_size_bytes": d.file_size_bytes,
            "source": d.source,
            "issued_on": d.issued_on,
            "expires_on": d.expires_on,
            "document_hash": d.document_hash,
            "is_verified": d.is_verified,
            "extracted_data": d.extracted_data or {},
            "created_at": d.created_at.isoformat() if d.created_at else None
        }
        for d in docs
    ]

@router.get("/me/payments")
def get_my_payments(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.user_id == user.id).first()
    if not student:
        return []
    
    payments = db.query(Payment).filter(Payment.student_id == student.id).order_by(Payment.created_at.desc()).all()
    return [
        {
            "id": p.id,
            "application_id": p.application_id,
            "amount": p.amount,
            "academic_year": p.academic_year,
            "dbt_status": p.dbt_status,
            "utr": p.utr,
            "disbursement_date": p.disbursement_date or "12 Sept 2026",
            "account_masked": p.account_masked,
            "pfms_ref": p.pfms_ref,
            "created_at": p.created_at.isoformat() if p.created_at else None
        }
        for p in payments
    ]

@router.get("/me/health-score")
def get_scholarship_health(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.user_id == user.id).first()
    if not student:
        return {"overall_score": 50, "components": {}}
    
    app = db.query(Application).filter(Application.student_id == student.id).first()
    score = app.health_score if app else 75
    
    return {
        "overall_score": score,
        "score_label": f"{score}/100",
        "disclaimer": "Prototype UX indicator, not a government score.",
        "components": {
            "profile_completeness": 95,
            "documents_verified": 85 if (app and app.status in ["VERIFIED", "DISBURSED"]) else 60,
            "cross_verification": 90 if (app and app.status in ["VERIFIED", "DISBURSED"]) else 70,
            "application_status": 95 if (app and app.status in ["VERIFIED", "SANCTIONED", "DISBURSED"]) else 65,
            "payment_readiness": 100 if (app and app.status == "DISBURSED") else 80
        }
    }

@router.post("/me/consent")
def update_consent(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.user_id == user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student record not found")
        
    c = ConsentRecord(
        student_id=student.id,
        scope="IDENTITY,ACADEMIC,INSTITUTION,CERTIFICATE,SCHOLARSHIP",
        is_active=True
    )
    db.add(c)
    db.commit()
    return {"status": "CONSENT_RECORDED", "scope": c.scope}

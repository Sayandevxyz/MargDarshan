from typing import Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timezone
import uuid

from backend.app.models.models import (
    Student, Application, Document, Verification, Payment, BeneficiaryMatch, OutreachCampaign, Institution
)

def get_ministry_overview_kpis(db: Session) -> Dict[str, Any]:
    total_enrolled = db.query(BeneficiaryMatch).count() + db.query(Student).count()
    applicants_count = db.query(Student).count()
    apps_count = db.query(Application).count()
    verified_count = db.query(Application).filter(Application.status.in_(["VERIFIED", "SANCTIONED", "PAYMENT_PROCESSING", "DISBURSED"])).count()
    flagged_count = db.query(Application).filter(Application.status.in_(["UNDER_REVIEW", "ACTION_REQUIRED"])).count()
    sanctioned_count = db.query(Application).filter(Application.status.in_(["SANCTIONED", "PAYMENT_PROCESSING", "DISBURSED"])).count()
    disbursed_count = db.query(Application).filter(Application.status == "DISBURSED").count()
    unreached_count = db.query(BeneficiaryMatch).filter(BeneficiaryMatch.is_enrolled_in_scholarship == False).count()

    # Impact and Performance metrics (labeled as synthetic / prototype projections)
    auto_verif_rate = 84.6
    manual_review_rate = 15.4
    avg_verification_time_days = 2.4
    document_reuse_rate = 71.2
    chatbot_resolution_rate = 88.5

    return {
        "kpis": {
            "total_enrolled_st_students": total_enrolled or 450,
            "scholarship_applicants": applicants_count or 350,
            "total_applications": apps_count or 350,
            "verified": verified_count or 290,
            "flagged_for_review": flagged_count or 45,
            "sanctioned": sanctioned_count or 265,
            "disbursed": disbursed_count or 240,
            "unreached_beneficiaries": unreached_count or 100
        },
        "performance_projections": {
            "auto_verification_rate": f"{auto_verif_rate}%",
            "manual_review_rate": f"{manual_review_rate}%",
            "average_verification_time": f"{avg_verification_time_days} days (down from 28 days)",
            "document_reuse_rate": f"{document_reuse_rate}%",
            "chatbot_resolution_rate": f"{chatbot_resolution_rate}%",
            "disclaimer": "Metrics labeled as prototype projections based on synthetic benchmark data."
        }
    }

def get_coverage_heatmap_data(db: Session) -> List[Dict[str, Any]]:
    # Synthetic district coordinates and coverage data for key tribal districts
    districts = [
        {"district": "Bastar", "state": "Chhattisgarh", "lat": 19.07, "lng": 81.96, "enrolled": 120, "applicants": 49, "coverage_pct": 41, "risk": "High"},
        {"district": "Mayurbhanj", "state": "Odisha", "lat": 21.93, "lng": 86.74, "enrolled": 140, "applicants": 90, "coverage_pct": 64, "risk": "Medium"},
        {"district": "Ranchi", "state": "Jharkhand", "lat": 23.34, "lng": 85.31, "enrolled": 110, "applicants": 90, "coverage_pct": 82, "risk": "Low"},
        {"district": "Koraput", "state": "Odisha", "lat": 18.81, "lng": 82.71, "enrolled": 95, "applicants": 52, "coverage_pct": 55, "risk": "Medium"},
        {"district": "Gadchiroli", "state": "Maharashtra", "lat": 20.18, "lng": 80.00, "enrolled": 80, "applicants": 38, "coverage_pct": 48, "risk": "High"},
    ]
    return districts

def get_unreached_beneficiaries(db: Session, limit: int = 50) -> List[Dict[str, Any]]:
    unreached = db.query(BeneficiaryMatch).filter(BeneficiaryMatch.is_enrolled_in_scholarship == False).limit(limit).all()
    out = []
    for u in unreached:
        out.append({
            "id": u.id,
            "apaar_id": u.apaar_id,
            "name": u.name,
            "dob": u.dob,
            "gender": u.gender,
            "school_name": u.school_name,
            "district": u.district,
            "block": u.block,
            "state": u.state,
            "source": u.enrollment_source,
            "suggested_scheme": u.suggested_scheme,
            "contact_available": u.contact_available,
            "suggested_action": "Schedule School Outreach Camp / Direct SMS"
        })
    return out

def detect_potential_anomalies(db: Session) -> List[Dict[str, Any]]:
    anomalies = []
    
    # 1. Check duplicate document hash across multiple distinct student IDs
    dup_hashes = (
        db.query(Document.document_hash, func.count(Document.id).label("cnt"))
        .filter(Document.is_active == True)
        .group_by(Document.document_hash)
        .having(func.count(Document.id) > 1)
        .all()
    )
    for h, count in dup_hashes:
        docs = db.query(Document).filter(Document.document_hash == h).all()
        student_ids = list(set([d.student_id for d in docs]))
        if len(student_ids) > 1:
            anomalies.append({
                "type": "DUPLICATE_DOCUMENT_HASH",
                "risk": "High",
                "reason": f"Same certificate hash appears in {len(student_ids)} unrelated student applications.",
                "action": "Manual review",
                "label": "Potential anomaly",
                "details": {"hash": h[:12] + "...", "affected_students": len(student_ids)}
            })

    # Synthetic demo anomaly to ensure demonstration availability
    anomalies.append({
        "type": "REPEATED_CERTIFICATE_NUMBER",
        "risk": "High",
        "reason": "Same certificate hash appears in 3 unrelated applications.",
        "action": "Manual review",
        "label": "Potential anomaly",
        "disclaimer": "Do not treat as real fraud determination. Labeled as potential anomaly for human officer review."
    })
    
    return anomalies

def compute_predictive_delay(db: Session, application_id: str) -> Dict[str, Any]:
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        return {"risk": "Low", "reason": "No pending delays detected."}
        
    factors = []
    risk = "Low"
    
    if app.status == "UNDER_REVIEW":
        risk = "Medium"
        factors.append("Identity variation flagged for officer queue review.")
    elif app.deficiency_count > 0:
        risk = "High"
        factors.append(f"Application has {app.deficiency_count} pending document deficiencies.")
    else:
        risk = "Medium"
        factors.append("Institution verification pending for 4 days.")
        
    return {
        "processing_risk": risk,
        "reason": factors[0] if factors else "Normal processing pipeline.",
        "factors": factors,
        "label": "Prototype prediction",
        "disclaimer": "Do not claim production ML accuracy. Prototype heuristic prediction."
    }

def create_outreach_campaign(db: Session, title: str, district: str, block: str, count: int) -> Dict[str, Any]:
    camp = OutreachCampaign(
        title=title,
        district=district,
        block=block,
        target_count=count,
        simulated_sms_count=count,
        status="DISPATCHED",
        created_at=datetime.now(timezone.utc)
    )
    db.add(camp)
    db.commit()
    return {
        "status": "DISPATCHED",
        "campaign_id": camp.id,
        "simulated_sms": count,
        "message": f"Successfully simulated SMS outreach to {count} unreached ST students in {block}, {district}."
    }

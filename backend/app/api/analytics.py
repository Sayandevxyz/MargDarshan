from fastapi import APIRouter, Depends, Body
from sqlalchemy.orm import Session
from typing import Dict, Any, List, Optional

from backend.app.core.database import get_db
from backend.app.api.deps import get_current_user
from backend.app.models.models import User, AuditLog
from backend.app.analytics.engine import (
    get_ministry_overview_kpis,
    get_coverage_heatmap_data,
    get_unreached_beneficiaries,
    detect_potential_anomalies,
    create_outreach_campaign
)

router = APIRouter(prefix="/analytics", tags=["Ministry Analytics"])

@router.get("/overview")
def get_overview(db: Session = Depends(get_db)):
    return get_ministry_overview_kpis(db)

@router.get("/coverage")
def get_coverage(db: Session = Depends(get_db)):
    return get_coverage_heatmap_data(db)

@router.get("/anomalies")
def get_anomalies(db: Session = Depends(get_db)):
    return detect_potential_anomalies(db)

@router.get("/audit-logs")
def get_audit_logs(limit: int = 50, db: Session = Depends(get_db)):
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit).all()
    return [
        {
            "id": l.id,
            "timestamp": l.timestamp.strftime("%d %b %Y, %I:%M:%S %p") if l.timestamp else "",
            "user_name": l.user_name,
            "role": l.role,
            "action": l.action,
            "resource": l.resource,
            "previous_state": l.previous_state,
            "new_state": l.new_state,
            "ip_address": l.ip_address,
            "remarks": l.remarks
        }
        for l in logs
    ]

@router.post("/outreach")
def trigger_outreach_campaign(
    title: str = Body(..., embed=True),
    district: str = Body(..., embed=True),
    block: str = Body(..., embed=True),
    count: int = Body(50, embed=True),
    db: Session = Depends(get_db)
):
    return create_outreach_campaign(db, title, district, block, count)

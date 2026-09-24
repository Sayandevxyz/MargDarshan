from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import Dict, Any

from backend.app.core.database import get_db
from backend.app.api.deps import get_current_user
from backend.app.models.models import User, Application, Verification
from backend.app.verification.orchestrator import run_application_verification

router = APIRouter(prefix="/verification", tags=["Verification"])

@router.get("/{application_id}")
def get_verification_status(
    application_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    verifications = db.query(Verification).filter(Verification.application_id == application_id).all()
    results = []
    for v in verifications:
        results.append({
            "id": v.id,
            "field": v.field,
            "source": v.source,
            "result": v.result,
            "confidence": round(v.confidence * 100, 1),
            "decision": v.decision,
            "evidence": v.evidence_json or {},
            "verified_at": v.verified_at.strftime("%d %b %Y, %I:%M %p") if v.verified_at else ""
        })

    return {
        "application_id": app.id,
        "application_no": app.application_no,
        "status": app.status,
        "current_stage": app.current_stage,
        "health_score": app.health_score,
        "verifications": results
    }

@router.post("/run")
async def trigger_verification_run(
    application_id: str = Body(..., embed=True),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        res = await run_application_verification(db, application_id)
        return res
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Verification orchestrator failed: {str(e)}")

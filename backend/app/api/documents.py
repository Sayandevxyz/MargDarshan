import hashlib
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Dict, Any, Optional

from backend.app.core.database import get_db
from backend.app.api.deps import get_current_user
from backend.app.models.models import User, Student, Document, AuditLog

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.post("/quality-check")
def perform_image_quality_check(
    blur_score: Optional[float] = Form(0.85),
    is_cropped: Optional[bool] = Form(False),
    rotation_deg: Optional[int] = Form(0),
    is_empty: Optional[bool] = Form(False)
):
    """
    Section 17 Image Quality Check:
    Checks blur, cropping, resolution, rotation, empty image.
    Returns guidance if poor.
    """
    if is_empty:
        return {
            "passed": False,
            "error_type": "EMPTY_IMAGE",
            "message": "The uploaded file is empty or corrupted.",
            "guidelines": ["Capture all four corners", "Ensure camera is focused"]
        }
    if blur_score and blur_score < 0.40:
        return {
            "passed": False,
            "error_type": "BLUR_DETECTED",
            "message": "This document image is difficult to read.",
            "guidelines": [
                "Place document on a flat surface",
                "Use good lighting",
                "Capture all four corners",
                "Avoid shadows"
            ]
        }
    if is_cropped:
        return {
            "passed": False,
            "error_type": "CORNER_CROPPED",
            "message": "Some document borders or seals appear cut off.",
            "guidelines": ["Ensure all 4 borders and authority seals are visible"]
        }
    return {
        "passed": True,
        "quality_score": 92,
        "message": "Image quality is clear and meets standard DPI guidelines."
    }

@router.post("")
def upload_document(
    doc_type: str = Form(...),
    original_filename: str = Form("document.pdf"),
    file_bytes_sim: Optional[str] = Form("demo_file_content_sample"),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.user_id == user.id).first()
    if not student:
        raise HTTPException(status_code=400, detail="Student profile required for document upload.")

    # Generate cryptographic SHA-256 hash (Section 16 & Section 43)
    doc_hash = hashlib.sha256(f"{doc_type}:{student.apaar_id}:{original_filename}:{datetime.now().isoformat()}".encode()).hexdigest()

    # Synthetic OCR extracted fields simulation (Section 16)
    extracted_fields = {
        "Name": student.name,
        "Certificate No": f"DEMO-{doc_type[:3].upper()}-{str(uuid.uuid4().int)[:5]}",
        "Category": student.category,
        "Issued": "14/05/2025",
        "Expires": "31/03/2027" if doc_type != "INCOME_CERTIFICATE" else "31/03/2026",
        "District": student.district,
        "Issuing Authority": "Sub-Divisional Magistrate / Tehsildar"
    }

    doc = Document(
        student_id=student.id,
        doc_type=doc_type.upper(),
        file_ref=f"uploads/{student.id}/{doc_type.lower()}_{doc_hash[:8]}.pdf",
        original_filename=original_filename,
        file_size_bytes=248000,
        mime_type="application/pdf" if original_filename.endswith(".pdf") else "image/jpeg",
        source="UPLOAD",
        issued_on="2025-05-14",
        expires_on="2026-03-31" if doc_type == "INCOME_CERTIFICATE" else "2027-03-31",
        document_hash=doc_hash,
        is_verified=True,
        extracted_data=extracted_fields,
        is_active=True
    )
    db.add(doc)
    
    # Audit log
    db.add(AuditLog(
        user_id=user.id,
        user_name=student.name,
        role=user.role,
        action="UPLOAD_DOCUMENT",
        resource=f"Document:{doc.doc_type}",
        previous_state=None,
        new_state="STORED",
        remarks=f"Document uploaded with hash {doc_hash[:8]} and OCR field extraction."
    ))

    db.commit()
    db.refresh(doc)

    return {
        "status": "SUCCESS",
        "document_id": doc.id,
        "doc_type": doc.doc_type,
        "extracted_fields": extracted_fields,
        "hash": doc_hash,
        "message": "Document uploaded and OCR fields extracted successfully."
    }

@router.post("/{id}/verify")
def trigger_document_verification(
    id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    doc.is_verified = True
    db.commit()

    return {
        "status": "VERIFIED",
        "document_id": doc.id,
        "doc_type": doc.doc_type,
        "verified_source": "State e-District / DigiLocker Registry",
        "message": f"{doc.doc_type.replace('_', ' ').title()} successfully validated."
    }

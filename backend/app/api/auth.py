from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any

from backend.app.core.database import get_db
from backend.app.core.security import create_access_token
from backend.app.models.models import User, Student, Parent
from backend.app.schemas.schemas import LoginRequest, OTPVerifyRequest, TokenResponse, DemoLoginRequest

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login")
def request_login_otp(req: LoginRequest, db: Session = Depends(get_db)):
    identifier = req.identifier.strip().lower()
    user = db.query(User).filter((User.email == identifier) | (User.phone == identifier)).first()
    
    # Return simulated demo OTP guidance (Section 8: For demo: OTP = 123456)
    return {
        "status": "OTP_SENT",
        "identifier": identifier,
        "message": "Demo OTP generated. Enter 123456 to verify.",
        "demo_otp": "123456"
    }

@router.post("/otp", response_model=TokenResponse)
def verify_otp(req: OTPVerifyRequest, db: Session = Depends(get_db)):
    if req.otp != "123456" and req.otp != "000000":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid OTP. For prototype demo, use OTP 123456."
        )
    
    identifier = req.identifier.strip().lower()
    user = db.query(User).filter((User.email == identifier) | (User.phone == identifier)).first()
    if not user:
        # Auto-create demo student user if not found
        user = User(
            email=identifier if "@" in identifier else f"student_{identifier[-4:]}@demo.margdarshan.in",
            phone=identifier if "@" not in identifier else "9876543210",
            name="Rahul Munda",
            role="STUDENT"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token(data={"sub": user.id, "email": user.email, "role": user.role})
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "role": user.role
        }
    }

@router.post("/demo-login", response_model=TokenResponse)
def demo_quick_login(req: DemoLoginRequest, db: Session = Depends(get_db)):
    persona_emails = {
        "student_1": "student@demo.margdarshan.in",        # Ramesh Kumar (Clean)
        "student_2": "anita@demo.margdarshan.in",          # Anita Murmu (Name mismatch)
        "parent_1": "parent@demo.margdarshan.in",          # Sita Devi (Parent with 2 children)
        "conflict_student": "arjun@demo.margdarshan.in",    # Arjun Hembram (Conflict test)
        "hindi_student": "meena@demo.margdarshan.in",      # Meena (Hindi SAATHI)
        "officer_1": "officer@demo.margdarshan.in",        # Welfare Officer Bastar/Mayurbhanj
        "admin_1": "admin@demo.margdarshan.in",            # Ministry Analyst / Admin
    }
    
    email = persona_emails.get(req.persona_id, "student@demo.margdarshan.in")
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Demo account '{email}' not seeded. Please ensure database seed is loaded."
        )
        
    token = create_access_token(data={"sub": user.id, "email": user.email, "role": user.role})
    
    # Retrieve student or parent profile info if available
    profile_data = {}
    if user.role == "STUDENT" and user.student_profile:
        profile_data = {
            "student_id": user.student_profile.id,
            "apaar_id": user.student_profile.apaar_id,
            "district": user.student_profile.district,
            "state": user.student_profile.state,
            "current_course": user.student_profile.current_course
        }
    elif user.role == "PARENT" and user.parent_profile:
        profile_data = {
            "parent_id": user.parent_profile.id,
            "district": user.parent_profile.district,
            "state": user.parent_profile.state
        }

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "profile": profile_data
        }
    }

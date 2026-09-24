from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- Auth Schemas ---
class LoginRequest(BaseModel):
    identifier: str  # email or phone
    role: Optional[str] = "STUDENT"

class OTPVerifyRequest(BaseModel):
    identifier: str
    otp: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class DemoLoginRequest(BaseModel):
    persona_id: str  # student_1, student_2, parent_1, conflict_student, hindi_student, officer_1, admin_1

# --- Student Schemas ---
class StudentBase(BaseModel):
    apaar_id: str
    name: str
    dob: str
    gender: str = "MALE"
    category: str = "ST"
    state: str
    district: str
    mobile: str
    email: Optional[str] = None
    language: str = "English"
    current_course: str = "Class 10"
    family_income: float = 120000.0
    pvtg_status: bool = False
    disability: bool = False

class StudentResponse(StudentBase):
    id: str
    user_id: Optional[str] = None
    institution_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ConsentRequest(BaseModel):
    scope: str = "IDENTITY,ACADEMIC,INSTITUTION,CERTIFICATE,SCHOLARSHIP"
    consent_given: bool = True

# --- Scheme Schemas ---
class SchemeResponse(BaseModel):
    id: str
    code: str
    name: str
    description: str
    target_audience: str
    academic_level: str
    max_income: Optional[float]
    benefits_summary: str
    is_active: bool
    rules_json: Dict[str, Any] = {}

    class Config:
        from_attributes = True

# --- Application Schemas ---
class ApplicationCreateRequest(BaseModel):
    scheme_code: str
    academic_year: str = "2026-27"
    documents_to_reuse: Optional[List[str]] = []
    course_name: Optional[str] = None
    institution_name: Optional[str] = None

class StageEventResponse(BaseModel):
    id: str
    stage: str
    status: str
    timestamp: datetime
    actor: str
    remarks: Optional[str] = ""

    class Config:
        from_attributes = True

class ApplicationResponse(BaseModel):
    id: str
    application_no: str
    student_id: str
    scheme_id: str
    scheme_code: Optional[str] = None
    scheme_name: Optional[str] = None
    academic_year: str
    status: str
    current_stage: str
    health_score: int
    deficiency_count: int
    flags_json: List[str] = []
    submitted_at: datetime
    updated_at: datetime
    stages: List[StageEventResponse] = []

    class Config:
        from_attributes = True

# --- Document Schemas ---
class DocumentResponse(BaseModel):
    id: str
    student_id: str
    doc_type: str
    file_ref: str
    original_filename: str
    file_size_bytes: int
    mime_type: str
    source: str
    issued_on: Optional[str]
    expires_on: Optional[str]
    document_hash: str
    is_verified: bool
    extracted_data: Dict[str, Any] = {}
    created_at: datetime

    class Config:
        from_attributes = True

class DocumentVerifySimRequest(BaseModel):
    doc_type: str
    extracted_fields: Dict[str, Any]

# --- Verification & Officer Review Schemas ---
class VerificationResponse(BaseModel):
    id: str
    application_id: str
    field: str
    source: str
    result: str
    confidence: float
    decision: str
    evidence_json: Dict[str, Any] = {}
    verified_at: datetime

    class Config:
        from_attributes = True

class ReviewTaskResponse(BaseModel):
    id: str
    verification_id: Optional[str]
    application_id: str
    application_no: Optional[str] = None
    student_name: Optional[str] = None
    assigned_officer: str
    reason: str
    priority: str
    status: str
    resolution: Optional[str]
    officer_remarks: Optional[str]
    created_at: datetime
    confidence: Optional[float] = None
    source: Optional[str] = None

    class Config:
        from_attributes = True

class OfficerDecisionRequest(BaseModel):
    action: str  # APPROVE, REJECT, REQUEST_CORRECTION, ESCALATE
    remarks: str

# --- Payment Schemas ---
class PaymentResponse(BaseModel):
    id: str
    application_id: str
    student_id: str
    amount: float
    academic_year: str
    dbt_status: str
    utr: str
    disbursement_date: Optional[str]
    account_masked: str
    pfms_ref: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- Grievance Schemas ---
class GrievanceCreateRequest(BaseModel):
    issue_type: str
    description: str

class GrievanceResponse(BaseModel):
    id: str
    ticket_id: str
    student_id: str
    issue_type: str
    description: str
    status: str
    resolution_remarks: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# --- Chatbot Schemas ---
class ChatMessageRequest(BaseModel):
    message: str
    language: Optional[str] = "en"
    session_id: Optional[str] = None

class ChatMessageResponse(BaseModel):
    response: str
    language: str
    tools_called: List[str] = []
    citations: List[Dict[str, Any]] = []
    action_buttons: List[Dict[str, str]] = []
    fallback_mode: bool = False

# --- Eligibility Check Schemas ---
class EligibilityCheckRequest(BaseModel):
    current_class_or_course: str
    institution_name: Optional[str] = None
    st_category: bool = True
    family_income: float
    is_pvtg: bool = False
    has_net_jrf: bool = False
    has_foreign_admission: bool = False
    has_disability: bool = False
    has_active_scholarship: bool = False

class EligibilityResultItem(BaseModel):
    scheme_code: str
    scheme_name: str
    is_eligible: bool
    reasons: List[str] = []
    estimated_benefit: str

class EligibilityCheckResponse(BaseModel):
    disclaimer: str = "Preliminary eligibility check. Final eligibility is determined under the applicable scheme guidelines."
    eligible_schemes: List[EligibilityResultItem]
    ineligible_schemes: List[EligibilityResultItem]
    has_conflict: bool = False
    conflict_details: Optional[Dict[str, Any]] = None

# --- SMS / Missed Call Simulation ---
class SMSStatusRequest(BaseModel):
    application_no: str

class SMSStatusResponse(BaseModel):
    status: str
    message: str
    application_no: str
    scheme_name: str
    stage: str
    next_action: str

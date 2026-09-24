import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

def gen_uuid():
    return str(uuid.uuid4())

def utc_now():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=gen_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, index=True, nullable=True)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False, default="STUDENT")  # STUDENT, PARENT, OFFICER, INSTITUTION, ADMIN, MINISTRY_ANALYST
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)

    student_profile = relationship("Student", back_populates="user", uselist=False)
    parent_profile = relationship("Parent", back_populates="user", uselist=False)
    notifications = relationship("Notification", back_populates="user")
    chat_sessions = relationship("ChatSession", back_populates="user")


class Institution(Base):
    __tablename__ = "institutions"

    id = Column(String, primary_key=True, default=gen_uuid)
    aishe_code = Column(String, index=True, nullable=True)
    udise_code = Column(String, index=True, nullable=True)
    name = Column(String, nullable=False)
    state = Column(String, nullable=False)
    district = Column(String, nullable=False)
    institution_type = Column(String, default="COLLEGE")  # SCHOOL, COLLEGE, PREMIER_IIT_NIT
    is_verified = Column(Boolean, default=True)


class Student(Base):
    __tablename__ = "students"

    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    apaar_id = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    dob = Column(String, nullable=False)  # YYYY-MM-DD
    gender = Column(String, default="MALE")
    category = Column(String, default="ST")
    state = Column(String, nullable=False)
    district = Column(String, nullable=False)
    mobile = Column(String, nullable=False)
    email = Column(String, nullable=True)
    language = Column(String, default="English")
    institution_id = Column(String, ForeignKey("institutions.id"), nullable=True)
    current_course = Column(String, default="Class 10")
    family_income = Column(Float, default=120000.0)
    pvtg_status = Column(Boolean, default=False)
    disability = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="student_profile")
    institution = relationship("Institution")
    applications = relationship("Application", back_populates="student")
    documents = relationship("Document", back_populates="student")
    family_links = relationship("FamilyLink", back_populates="student")
    grievances = relationship("Grievance", back_populates="student")
    consent_records = relationship("ConsentRecord", back_populates="student")


class Parent(Base):
    __tablename__ = "parents"

    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    name = Column(String, nullable=False)
    mobile = Column(String, nullable=False)
    email = Column(String, nullable=True)
    state = Column(String, default="Odisha")
    district = Column(String, default="Mayurbhanj")
    created_at = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="parent_profile")
    family_links = relationship("FamilyLink", back_populates="parent")


class FamilyLink(Base):
    __tablename__ = "family_links"

    id = Column(String, primary_key=True, default=gen_uuid)
    parent_id = Column(String, ForeignKey("parents.id"), nullable=False)
    student_id = Column(String, ForeignKey("students.id"), nullable=False)
    relationship_type = Column(String, default="Parent")  # Mother, Father, Guardian

    parent = relationship("Parent", back_populates="family_links")
    student = relationship("Student", back_populates="family_links")


class Scheme(Base):
    __tablename__ = "schemes"

    id = Column(String, primary_key=True, default=gen_uuid)
    code = Column(String, unique=True, index=True, nullable=False)  # PRE_MATRIC, POST_MATRIC, TOP_CLASS, NFST, NOS
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    target_audience = Column(String, nullable=False)
    academic_level = Column(String, nullable=False)
    max_income = Column(Float, nullable=True)
    benefits_summary = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True)
    rules_json = Column(JSON, default=dict)


class Application(Base):
    __tablename__ = "applications"

    id = Column(String, primary_key=True, default=gen_uuid)
    application_no = Column(String, unique=True, index=True, nullable=False)
    student_id = Column(String, ForeignKey("students.id"), nullable=False)
    scheme_id = Column(String, ForeignKey("schemes.id"), nullable=False)
    academic_year = Column(String, default="2026-27")
    status = Column(String, default="SUBMITTED")  # DRAFT, SUBMITTED, VERIFICATION, ACTION_REQUIRED, UNDER_REVIEW, VERIFIED, SANCTIONED, PAYMENT_PROCESSING, DISBURSED, REJECTED, WITHDRAWN
    current_stage = Column(String, default="Application Submitted")
    health_score = Column(Integer, default=70)
    deficiency_count = Column(Integer, default=0)
    flags_json = Column(JSON, default=list)
    submitted_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    student = relationship("Student", back_populates="applications")
    scheme = relationship("Scheme")
    stages = relationship("StageEvent", back_populates="application", order_by="StageEvent.timestamp")
    verifications = relationship("Verification", back_populates="application")
    review_tasks = relationship("ReviewTask", back_populates="application")
    payments = relationship("Payment", back_populates="application")


class StageEvent(Base):
    __tablename__ = "stage_events"

    id = Column(String, primary_key=True, default=gen_uuid)
    application_id = Column(String, ForeignKey("applications.id"), nullable=False)
    stage = Column(String, nullable=False)  # Application Submitted, Identity Verified, Document Verified, Institution Verified, Scheme Verification, Sanctioned, Disbursed
    status = Column(String, nullable=False)  # COMPLETED, IN_PROGRESS, PENDING, FLAGGED, FAILED
    timestamp = Column(DateTime, default=utc_now)
    actor = Column(String, default="System")  # System, UIDAI, DigiLocker, Officer, DBT PFMS
    remarks = Column(Text, default="")

    application = relationship("Application", back_populates="stages")


class Document(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, default=gen_uuid)
    student_id = Column(String, ForeignKey("students.id"), nullable=False)
    doc_type = Column(String, nullable=False)  # ST_CERTIFICATE, INCOME_CERTIFICATE, DOMICILE_CERTIFICATE, ACADEMIC_MARKSHEET, ADMISSION_PROOF, DISABILITY_CERTIFICATE, IDENTITY_DOCUMENT, NET_JRF_CERTIFICATE, FOREIGN_ADMISSION_LETTER, PASSPORT
    file_ref = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)
    file_size_bytes = Column(Integer, default=102400)
    mime_type = Column(String, default="application/pdf")
    source = Column(String, default="UPLOAD")  # UPLOAD, DIGILOCKER, E_DISTRICT
    issued_on = Column(String, nullable=True)
    expires_on = Column(String, nullable=True)
    document_hash = Column(String, index=True, nullable=False)
    is_verified = Column(Boolean, default=False)
    extracted_data = Column(JSON, default=dict)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)

    student = relationship("Student", back_populates="documents")


class Verification(Base):
    __tablename__ = "verifications"

    id = Column(String, primary_key=True, default=gen_uuid)
    application_id = Column(String, ForeignKey("applications.id"), nullable=False)
    field = Column(String, nullable=False)  # name, dob, guardian, caste, institution, income
    source = Column(String, nullable=False)  # UIDAI, DigiLocker, UDISE+, AISHE, APAAR, e-District, UGC_NTA
    result = Column(String, default="MATCH")  # MATCH, MISMATCH, NOT_FOUND, UNAVAILABLE
    confidence = Column(Float, default=1.0)
    decision = Column(String, default="AUTO_PASS")  # AUTO_PASS, MANUAL_REVIEW, FAIL, RETRY_PENDING
    evidence_json = Column(JSON, default=dict)
    verified_at = Column(DateTime, default=utc_now)

    application = relationship("Application", back_populates="verifications")
    review_task = relationship("ReviewTask", back_populates="verification", uselist=False)


class ReviewTask(Base):
    __tablename__ = "review_tasks"

    id = Column(String, primary_key=True, default=gen_uuid)
    verification_id = Column(String, ForeignKey("verifications.id"), nullable=True)
    application_id = Column(String, ForeignKey("applications.id"), nullable=False)
    assigned_officer = Column(String, default="Officer Bastar/Mayurbhanj")
    reason = Column(String, nullable=False)
    priority = Column(String, default="Medium")  # High, Medium, Low
    status = Column(String, default="PENDING")  # PENDING, RESOLVED, ESCALATED
    resolution = Column(String, nullable=True)  # APPROVED, REJECTED, CORRECTION_REQUESTED
    officer_remarks = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)
    resolved_at = Column(DateTime, nullable=True)

    verification = relationship("Verification", back_populates="review_task")
    application = relationship("Application", back_populates="review_tasks")


class Payment(Base):
    __tablename__ = "payments"

    id = Column(String, primary_key=True, default=gen_uuid)
    application_id = Column(String, ForeignKey("applications.id"), nullable=False)
    student_id = Column(String, ForeignKey("students.id"), nullable=False)
    amount = Column(Float, nullable=False)
    academic_year = Column(String, default="2026-27")
    dbt_status = Column(String, default="DISBURSED")  # SANCTIONED, PAYMENT_INITIATED, BANK_PROCESSING, DISBURSED, FAILED
    utr = Column(String, unique=True, index=True, nullable=False)
    disbursement_date = Column(String, nullable=True)
    account_masked = Column(String, default="XXXX-XXXX-4921")
    pfms_ref = Column(String, default="PFMS-2026-99210")
    created_at = Column(DateTime, default=utc_now)

    application = relationship("Application", back_populates="payments")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    priority = Column(String, default="NORMAL")  # CRITICAL, NORMAL, INFORMATIONAL
    channel = Column(String, default="PUSH")  # PUSH, SMS, WHATSAPP, EMAIL
    is_read = Column(Boolean, default=False)
    action_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="notifications")


class Grievance(Base):
    __tablename__ = "grievances"

    id = Column(String, primary_key=True, default=gen_uuid)
    ticket_id = Column(String, unique=True, index=True, nullable=False)
    student_id = Column(String, ForeignKey("students.id"), nullable=False)
    issue_type = Column(String, nullable=False)  # Payment Pending, Verification Delayed, Certificate Rejected, Other
    description = Column(Text, nullable=False)
    status = Column(String, default="SUBMITTED")  # SUBMITTED, UNDER_REVIEW, ACTION_REQUIRED, RESOLVED, CLOSED
    resolution_remarks = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    student = relationship("Student", back_populates="grievances")


class SourceRecord(Base):
    __tablename__ = "source_records"

    id = Column(String, primary_key=True, default=gen_uuid)
    source_name = Column(String, index=True, nullable=False)  # UIDAI, DIGILOCKER, UDISE, AISHE, APAAR, EDISTRICT
    entity_type = Column(String, nullable=False)
    identifier = Column(String, index=True, nullable=False)
    payload_json = Column(JSON, default=dict)


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    title = Column(String, default="Scholarship Assistance")
    created_at = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="chat_sessions")
    messages = relationship("ChatMessage", back_populates="session", order_by="ChatMessage.created_at")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(String, primary_key=True, default=gen_uuid)
    session_id = Column(String, ForeignKey("chat_sessions.id"), nullable=False)
    role = Column(String, nullable=False)  # user, assistant, system
    content = Column(Text, nullable=False)
    tool_calls_json = Column(JSON, default=list)
    citations_json = Column(JSON, default=list)
    created_at = Column(DateTime, default=utc_now)

    session = relationship("ChatSession", back_populates="messages")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, default=gen_uuid)
    timestamp = Column(DateTime, default=utc_now)
    user_id = Column(String, nullable=True)
    user_name = Column(String, default="System")
    role = Column(String, default="SYSTEM")
    action = Column(String, nullable=False)
    resource = Column(String, nullable=False)
    previous_state = Column(Text, nullable=True)
    new_state = Column(Text, nullable=True)
    ip_address = Column(String, default="127.0.0.1")
    remarks = Column(Text, default="")


class OutreachCampaign(Base):
    __tablename__ = "outreach_campaigns"

    id = Column(String, primary_key=True, default=gen_uuid)
    title = Column(String, nullable=False)
    district = Column(String, nullable=False)
    block = Column(String, nullable=False)
    target_count = Column(Integer, default=0)
    simulated_sms_count = Column(Integer, default=0)
    status = Column(String, default="ACTIVE")
    created_at = Column(DateTime, default=utc_now)


class BeneficiaryMatch(Base):
    __tablename__ = "beneficiary_matches"

    id = Column(String, primary_key=True, default=gen_uuid)
    apaar_id = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    dob = Column(String, nullable=False)
    gender = Column(String, default="FEMALE")
    school_name = Column(String, nullable=False)
    district = Column(String, nullable=False)
    block = Column(String, nullable=False)
    state = Column(String, nullable=False)
    enrollment_source = Column(String, default="UDISE+")
    is_enrolled_in_scholarship = Column(Boolean, default=False)
    suggested_scheme = Column(String, default="Pre-Matric Scholarship")
    contact_available = Column(Boolean, default=True)


class ConsentRecord(Base):
    __tablename__ = "consent_records"

    id = Column(String, primary_key=True, default=gen_uuid)
    student_id = Column(String, ForeignKey("students.id"), nullable=False)
    scope = Column(String, default="IDENTITY,ACADEMIC,INSTITUTION,CERTIFICATE,SCHOLARSHIP")
    granted_at = Column(DateTime, default=utc_now)
    ip_address = Column(String, default="127.0.0.1")
    is_active = Column(Boolean, default=True)

    student = relationship("Student", back_populates="consent_records")

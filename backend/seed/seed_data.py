import os
import random
import uuid
import json
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session

from backend.app.core.database import SessionLocal, Base, engine
from backend.app.models.models import (
    User, Student, Parent, FamilyLink, Scheme, Application, StageEvent,
    Document, Verification, ReviewTask, Payment, Notification, Grievance,
    Institution, SourceRecord, BeneficiaryMatch, ConsentRecord, AuditLog
)

DISTRICTS = [
    {"name": "Bastar", "state": "Chhattisgarh"},
    {"name": "Mayurbhanj", "state": "Odisha"},
    {"name": "Ranchi", "state": "Jharkhand"},
    {"name": "Koraput", "state": "Odisha"},
    {"name": "Gadchiroli", "state": "Maharashtra"}
]

FIRST_NAMES_MALE = ["Ramesh", "Arjun", "Birsa", "Mangal", "Suresh", "Ravi", "Karan", "Sunil", "Amit", "Dev"]
FIRST_NAMES_FEMALE = ["Anita", "Meena", "Shanti", "Pooja", "Sunita", "Lakshmi", "Kavita", "Rupa", "Gita", "Sarita"]
LAST_NAMES = ["Kumar", "Murmu", "Hembram", "Tudu", "Munda", "Soren", "Marandi", "Baski", "Kisku", "Besra"]

def seed_database():
    print("Beginning MargDarshan seed generation...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()

    # 1. Seed the 5 MoTA Schemes
    schemes_data = [
        {
            "code": "PRE_MATRIC",
            "name": "Pre-Matric Scholarship for ST Students",
            "target_audience": "Scheduled Tribe students studying in Classes IX and X",
            "academic_level": "Secondary (Classes 9-10)",
            "max_income": 250000.0,
            "description": "Centrally sponsored scholarship to minimize transition dropouts between elementary and secondary education.",
            "benefits_summary": "Monthly maintenance allowance plus ₹1,000 annual book/ad-hoc grant.",
            "rules": {"min_class": 9, "max_class": 10, "doc_reqs": ["ST_CERTIFICATE", "INCOME_CERTIFICATE", "MARKSHEET"]}
        },
        {
            "code": "POST_MATRIC",
            "name": "Post-Matric Scholarship for ST Students",
            "target_audience": "ST students pursuing post-matriculation or post-secondary education",
            "academic_level": "Higher Secondary, Diploma, Degree, PG, Ph.D.",
            "max_income": 250000.0,
            "description": "Flagship scheme covering mandatory tuition fees and monthly stipends across 4 course categories.",
            "benefits_summary": "100% compulsory course fee reimbursement + monthly maintenance allowance up to ₹1,200/mo.",
            "rules": {"min_class": 11, "doc_reqs": ["ST_CERTIFICATE", "INCOME_CERTIFICATE", "MARKSHEET", "ADMISSION_PROOF"]}
        },
        {
            "code": "TOP_CLASS",
            "name": "Top Class Education Scholarship for ST Students",
            "target_audience": "Meritorious ST students admitted to notified premier institutes (IITs, NITs, IIMs, AIIMS)",
            "academic_level": "Premier Professional Undergraduate & Postgraduate",
            "max_income": 600000.0,
            "description": "Full financial support covering full fees and living grants for premier Indian institutions.",
            "benefits_summary": "Full tuition fees + ₹3,000/mo living grant + ₹5,000/yr book grant + ₹45,000 one-time computer grant.",
            "rules": {"doc_reqs": ["ST_CERTIFICATE", "INCOME_CERTIFICATE", "ADMISSION_PROOF", "FEE_SCHEDULE"]}
        },
        {
            "code": "NFST",
            "name": "National Fellowship for ST Students (NFST)",
            "target_audience": "Scholars pursuing regular and full-time M.Phil. and Ph.D. degrees",
            "academic_level": "Doctoral & Research (M.Phil / Ph.D.)",
            "max_income": None,
            "description": "Research fellowship providing financial independence to tribal scholars qualified in UGC-NET / GATE.",
            "benefits_summary": "₹37,000/mo JRF, ₹42,000/mo SRF + Contingency grant up to ₹25,000/yr + HRA.",
            "rules": {"doc_reqs": ["ST_CERTIFICATE", "NET_JRF_CERTIFICATE", "ADMISSION_PROOF"]}
        },
        {
            "code": "NOS",
            "name": "National Overseas Scholarship for ST Candidates",
            "target_audience": "Meritorious ST candidates admitted to top 500 QS World Ranked international universities",
            "academic_level": "Master's & Ph.D. Overseas",
            "max_income": 800000.0,
            "description": "International scholarship providing global academic opportunities to indigenous students.",
            "benefits_summary": "Full overseas tuition fees + approx $15,400/yr maintenance allowance + visa & airfare.",
            "rules": {"doc_reqs": ["ST_CERTIFICATE", "INCOME_CERTIFICATE", "PASSPORT", "FOREIGN_ADMISSION_LETTER"]}
        }
    ]

    scheme_map = {}
    for s_info in schemes_data:
        s = Scheme(
            code=s_info["code"],
            name=s_info["name"],
            target_audience=s_info["target_audience"],
            academic_level=s_info["academic_level"],
            max_income=s_info["max_income"],
            description=s_info["description"],
            benefits_summary=s_info["benefits_summary"],
            rules_json=s_info["rules"]
        )
        db.add(s)
        db.flush()
        scheme_map[s.code] = s

    # 2. Seed Institutions
    inst_data = [
        {"name": "Govt High School Baripada", "state": "Odisha", "district": "Mayurbhanj", "type": "SCHOOL", "udise": "21070100201"},
        {"name": "Eklavya Model Residential School Bastar", "state": "Chhattisgarh", "district": "Bastar", "type": "SCHOOL", "udise": "22140200101"},
        {"name": "Birsa Munda College Ranchi", "state": "Jharkhand", "district": "Ranchi", "type": "COLLEGE", "aishe": "C-25101"},
        {"name": "Mayurbhanj Degree College", "state": "Odisha", "district": "Mayurbhanj", "type": "COLLEGE", "aishe": "C-29302"},
        {"name": "National Institute of Technology Rourkela", "state": "Odisha", "district": "Sundargarh", "type": "PREMIER_IIT_NIT", "aishe": "U-0355"},
        {"name": "Indian Institute of Technology Kharagpur", "state": "West Bengal", "district": "Paschim Medinipur", "type": "PREMIER_IIT_NIT", "aishe": "U-0573"},
        {"name": "Govt Polytechnic Gadchiroli", "state": "Maharashtra", "district": "Gadchiroli", "type": "COLLEGE", "aishe": "C-41002"}
    ]
    institutions = []
    for idata in inst_data:
        inst = Institution(
            name=idata["name"],
            state=idata["state"],
            district=idata["district"],
            institution_type=idata["type"],
            udise_code=idata.get("udise"),
            aishe_code=idata.get("aishe")
        )
        db.add(inst)
        db.flush()
        institutions.append(inst)

    # 3. Seed Officer & Admin Users
    officer_user = User(
        email="officer@demo.margdarshan.in",
        phone="9876543201",
        name="Welfare Officer Bastar/Mayurbhanj",
        role="OFFICER"
    )
    admin_user = User(
        email="admin@demo.margdarshan.in",
        phone="9876543202",
        name="Ministry Analyst MoTA",
        role="ADMIN"
    )
    db.add(officer_user)
    db.add(admin_user)
    db.flush()

    # 4. Seed the 5 Demo Personas (Section 54 & 105)
    
    # --- Persona 1: Ramesh Kumar (Clean Post-Matric -> Auto-verified -> Disbursed) ---
    p1_user = User(email="student@demo.margdarshan.in", phone="9876543210", name="Ramesh Kumar", role="STUDENT")
    db.add(p1_user)
    db.flush()

    p1_student = Student(
        user_id=p1_user.id,
        apaar_id="APAAR-2026-DEMO-001",
        name="Ramesh Kumar",
        dob="2005-04-12",
        gender="MALE",
        category="ST",
        state="Odisha",
        district="Mayurbhanj",
        mobile="9876543210",
        email=p1_user.email,
        language="English",
        institution_id=institutions[3].id,
        current_course="B.Sc. Computer Science (1st Year)",
        family_income=140000.0,
        pvtg_status=False
    )
    db.add(p1_student)
    db.flush()

    p1_app = Application(
        application_no="APP-DEMO-2026-00191",
        student_id=p1_student.id,
        scheme_id=scheme_map["POST_MATRIC"].id,
        academic_year="2026-27",
        status="DISBURSED",
        current_stage="Scholarship Disbursed",
        health_score=94,
        submitted_at=datetime.now(timezone.utc) - timedelta(days=25)
    )
    db.add(p1_app)
    db.flush()

    # P1 Stages
    db.add(StageEvent(application_id=p1_app.id, stage="Application Submitted", status="COMPLETED", actor="Student", timestamp=datetime.now(timezone.utc) - timedelta(days=25), remarks="Application submitted online with required documents."))
    db.add(StageEvent(application_id=p1_app.id, stage="Identity Verified", status="COMPLETED", actor="UIDAI / APAAR Gateway", timestamp=datetime.now(timezone.utc) - timedelta(days=23), remarks="Demographic and biometric match confirmed."))
    db.add(StageEvent(application_id=p1_app.id, stage="Document Verified", status="COMPLETED", actor="DigiLocker / e-District", timestamp=datetime.now(timezone.utc) - timedelta(days=20), remarks="ST Certificate and Income Certificate verified."))
    db.add(StageEvent(application_id=p1_app.id, stage="Institution Verified", status="COMPLETED", actor="Mayurbhanj Degree College (AISHE)", timestamp=datetime.now(timezone.utc) - timedelta(days=15), remarks="Enrolled course & fee schedule validated."))
    db.add(StageEvent(application_id=p1_app.id, stage="Scheme Verification", status="COMPLETED", actor="MargDarshan Rules Engine", timestamp=datetime.now(timezone.utc) - timedelta(days=10), remarks="Eligible. Income ceiling check passed."))
    db.add(StageEvent(application_id=p1_app.id, stage="Sanctioned", status="COMPLETED", actor="District Welfare Officer", timestamp=datetime.now(timezone.utc) - timedelta(days=7), remarks="Sanction order #SANC-2026-9921 issued."))
    db.add(StageEvent(application_id=p1_app.id, stage="Disbursed", status="COMPLETED", actor="DBT PFMS Gateway", timestamp=datetime.now(timezone.utc) - timedelta(days=2), remarks="Direct Benefit Transfer credited to Aadhaar-linked bank account."))

    # P1 Documents
    p1_st_doc = Document(
        student_id=p1_student.id,
        doc_type="ST_CERTIFICATE",
        file_ref="uploads/p1/st_cert.pdf",
        original_filename="caste_certificate_ramesh.pdf",
        document_hash="a1b2c3d4e5f60001000100010001000100010001000100010001000100010001",
        is_verified=True,
        issued_on="2024-06-10",
        expires_on="2034-06-10",
        source="DIGILOCKER",
        extracted_data={"Name": "Ramesh Kumar", "Certificate No": "DEMO-ST-83921", "Category": "ST", "District": "Mayurbhanj"}
    )
    p1_inc_doc = Document(
        student_id=p1_student.id,
        doc_type="INCOME_CERTIFICATE",
        file_ref="uploads/p1/income_cert.pdf",
        original_filename="income_certificate_2026.pdf",
        document_hash="a1b2c3d4e5f60001000100010001000100010001000100010001000100010002",
        is_verified=True,
        issued_on="2025-05-10",
        expires_on="2027-03-31",
        source="E_DISTRICT",
        extracted_data={"Name": "Ramesh Kumar", "Annual Income": 140000, "Valid Till": "31/03/2027"}
    )
    db.add(p1_st_doc)
    db.add(p1_inc_doc)

    # P1 Verifications (Auto-passed 94%)
    db.add(Verification(application_id=p1_app.id, field="name", source="UDISE+", result="MATCH", confidence=0.96, decision="AUTO_PASS", evidence_json={"fuzzy_breakdown": {"name_score": 92.0, "dob_score": 100.0, "guardian_score": 84.0, "institution_score": 96.0}}))
    db.add(Verification(application_id=p1_app.id, field="caste", source="e-District", result="MATCH", confidence=0.98, decision="AUTO_PASS", evidence_json={"status": "VALID_ST"}))
    db.add(Verification(application_id=p1_app.id, field="income", source="DigiLocker", result="MATCH", confidence=0.95, decision="AUTO_PASS", evidence_json={"status": "UNDER_CEILING"}))

    # P1 Payment
    p1_payment = Payment(
        application_id=p1_app.id,
        student_id=p1_student.id,
        amount=18500.0,
        academic_year="2026-27",
        dbt_status="DISBURSED",
        utr="DEMO-UTR-98214",
        disbursement_date="12 Sept 2026",
        account_masked="XXXX-XXXX-4921",
        pfms_ref="PFMS-2026-99210"
    )
    db.add(p1_payment)

    # --- Persona 2: Anita Murmu (Name mismatch -> Flagged -> Officer review pending) ---
    p2_user = User(email="anita@demo.margdarshan.in", phone="9876543211", name="Anita Murmu", role="STUDENT")
    db.add(p2_user)
    db.flush()

    p2_student = Student(
        user_id=p2_user.id,
        apaar_id="APAAR-2026-DEMO-002",
        name="Anita Murmu",
        dob="2009-08-15",
        gender="FEMALE",
        category="ST",
        state="Chhattisgarh",
        district="Bastar",
        mobile="9876543211",
        email=p2_user.email,
        language="Hindi",
        institution_id=institutions[1].id,
        current_course="Class 10",
        family_income=95000.0,
        pvtg_status=True
    )
    db.add(p2_student)
    db.flush()

    p2_app = Application(
        application_no="APP-DEMO-2026-00192",
        student_id=p2_student.id,
        scheme_id=scheme_map["PRE_MATRIC"].id,
        academic_year="2026-27",
        status="UNDER_REVIEW",
        current_stage="Officer Verification Review",
        health_score=68,
        deficiency_count=1,
        submitted_at=datetime.now(timezone.utc) - timedelta(days=4)
    )
    db.add(p2_app)
    db.flush()

    # P2 Stages
    db.add(StageEvent(application_id=p2_app.id, stage="Application Submitted", status="COMPLETED", actor="Student", timestamp=datetime.now(timezone.utc) - timedelta(days=4), remarks="Submitted."))
    db.add(StageEvent(application_id=p2_app.id, stage="Identity Verified", status="COMPLETED", actor="UIDAI", timestamp=datetime.now(timezone.utc) - timedelta(days=3), remarks="Demographic records matched."))
    db.add(StageEvent(application_id=p2_app.id, stage="Verification Flagged", status="FLAGGED", actor="Verification Engine", timestamp=datetime.now(timezone.utc) - timedelta(days=2), remarks="Name spelling variation: Submitted 'Anita Murmu', UDISE+ record 'Anita M Murmu' (Overall 74%). Assigned to Officer Queue."))

    # P2 Verification with 74% fuzzy match (Section 20 & 21)
    p2_verif = Verification(
        application_id=p2_app.id,
        field="name",
        source="UDISE+",
        result="MISMATCH",
        confidence=0.74,
        decision="MANUAL_REVIEW",
        evidence_json={
            "fuzzy_breakdown": {"name_score": 71.0, "dob_score": 100.0, "guardian_score": 68.0, "institution_score": 95.0},
            "fuzzy_details": {"submitted_name": "Anita Murmu", "source_name": "Anita M Murmu", "submitted_dob": "2009-08-15", "source_dob": "2009-08-15"}
        }
    )
    db.add(p2_verif)
    db.flush()

    # Officer review task for Anita
    db.add(ReviewTask(
        verification_id=p2_verif.id,
        application_id=p2_app.id,
        assigned_officer="Officer Bastar/Mayurbhanj",
        reason="Name mismatch (74% fuzzy score)",
        priority="Medium",
        status="PENDING",
        created_at=datetime.now(timezone.utc) - timedelta(days=2)
    ))

    # P2 Document: expired income certificate to show Section 13 & 37 Pending Action Engine
    p2_doc_inc = Document(
        student_id=p2_student.id,
        doc_type="INCOME_CERTIFICATE",
        file_ref="uploads/p2/income_expired.pdf",
        original_filename="income_cert_2025.pdf",
        document_hash="b2c3d4e5f6000200020002000200020002000200020002000200020002000201",
        is_verified=False,
        issued_on="2024-03-10",
        expires_on="2026-03-31",
        source="UPLOAD",
        extracted_data={"Name": "Anita Murmu", "Annual Income": 95000, "Valid Till": "31/03/2026"}
    )
    db.add(p2_doc_inc)

    # --- Persona 3: Parent Sita Devi with two children (Ramesh & Anita) ---
    p3_user = User(email="parent@demo.margdarshan.in", phone="9876543220", name="Sita Devi", role="PARENT")
    db.add(p3_user)
    db.flush()

    p3_parent = Parent(
        user_id=p3_user.id,
        name="Sita Devi",
        mobile="9876543220",
        email=p3_user.email,
        state="Odisha",
        district="Mayurbhanj"
    )
    db.add(p3_parent)
    db.flush()

    # Link both children
    db.add(FamilyLink(parent_id=p3_parent.id, student_id=p1_student.id, relationship_type="Mother"))
    db.add(FamilyLink(parent_id=p3_parent.id, student_id=p2_student.id, relationship_type="Mother"))

    # --- Persona 4: Arjun Hembram (Conflict student: Post-Matric active, applying for Top Class) ---
    p4_user = User(email="arjun@demo.margdarshan.in", phone="9876543212", name="Arjun Hembram", role="STUDENT")
    db.add(p4_user)
    db.flush()

    p4_student = Student(
        user_id=p4_user.id,
        apaar_id="APAAR-2026-DEMO-003",
        name="Arjun Hembram",
        dob="2004-11-20",
        gender="MALE",
        category="ST",
        state="Jharkhand",
        district="Ranchi",
        mobile="9876543212",
        email=p4_user.email,
        language="English",
        institution_id=institutions[4].id,
        current_course="B.Tech Computer Science (NIT Rourkela)",
        family_income=280000.0,
        pvtg_status=False
    )
    db.add(p4_student)
    db.flush()

    # Existing active Post-Matric application
    p4_app = Application(
        application_no="APP-DEMO-2026-00193",
        student_id=p4_student.id,
        scheme_id=scheme_map["POST_MATRIC"].id,
        academic_year="2026-27",
        status="SANCTIONED",
        current_stage="Sanction Issued",
        health_score=88,
        submitted_at=datetime.now(timezone.utc) - timedelta(days=40)
    )
    db.add(p4_app)

    # --- Persona 5: Meena (Hindi student inquiry: "मेरी छात्रवृत्ति का भुगतान अभी तक क्यों नहीं आया?") ---
    p5_user = User(email="meena@demo.margdarshan.in", phone="9876543213", name="Meena Baski", role="STUDENT")
    db.add(p5_user)
    db.flush()

    p5_student = Student(
        user_id=p5_user.id,
        apaar_id="APAAR-2026-DEMO-004",
        name="Meena Baski",
        dob="2006-02-14",
        gender="FEMALE",
        category="ST",
        state="Chhattisgarh",
        district="Bastar",
        mobile="9876543213",
        email=p5_user.email,
        language="Hindi",
        institution_id=institutions[1].id,
        current_course="Class 12 Science",
        family_income=110000.0,
        pvtg_status=False
    )
    db.add(p5_student)
    db.flush()

    p5_app = Application(
        application_no="APP-DEMO-2026-00194",
        student_id=p5_student.id,
        scheme_id=scheme_map["POST_MATRIC"].id,
        academic_year="2026-27",
        status="SANCTIONED",
        current_stage="Awaiting DBT Processing",
        health_score=86,
        submitted_at=datetime.now(timezone.utc) - timedelta(days=12)
    )
    db.add(p5_app)

    # 5. Generate 350+ Synthetic Students across districts (Section 55)
    print("Generating 350+ synthetic students across 5 districts...")
    statuses = ["VERIFIED", "DISBURSED", "SANCTIONED", "UNDER_REVIEW", "ACTION_REQUIRED", "SUBMITTED"]
    all_synthetic_students_json = []

    for idx in range(10, 360):
        gender = "MALE" if random.random() > 0.5 else "FEMALE"
        first = random.choice(FIRST_NAMES_MALE if gender == "MALE" else FIRST_NAMES_FEMALE)
        last = random.choice(LAST_NAMES)
        name = f"{first} {last}"
        dist_choice = random.choice(DISTRICTS)
        apaar_num = f"APAAR-2026-SYN-{str(idx).zfill(4)}"
        income = round(random.uniform(60000, 320000), 2)
        inst = random.choice(institutions)
        sch_choice = random.choice(list(scheme_map.values()))

        synth_u = User(
            email=f"syn_{idx}@demo.margdarshan.in",
            phone=f"98765{str(idx).zfill(5)}",
            name=name,
            role="STUDENT"
        )
        db.add(synth_u)
        db.flush()

        synth_stu = Student(
            user_id=synth_u.id,
            apaar_id=apaar_num,
            name=name,
            dob=f"200{random.randint(4, 9)}-0{random.randint(1, 9)}-{random.randint(10, 28)}",
            gender=gender,
            category="ST",
            state=dist_choice["state"],
            district=dist_choice["name"],
            mobile=synth_u.phone,
            email=synth_u.email,
            institution_id=inst.id,
            current_course="Class 10" if sch_choice.code == "PRE_MATRIC" else "Bachelor of Arts",
            family_income=income,
            pvtg_status=(random.random() < 0.15)
        )
        db.add(synth_stu)
        db.flush()

        app_status = random.choice(statuses)
        app_no = f"APP-SYN-2026-{str(idx).zfill(5)}"
        synth_app = Application(
            application_no=app_no,
            student_id=synth_stu.id,
            scheme_id=sch_choice.id,
            academic_year="2026-27",
            status=app_status,
            current_stage=f"Stage: {app_status.title()}",
            health_score=random.randint(65, 96),
            submitted_at=datetime.now(timezone.utc) - timedelta(days=random.randint(5, 60))
        )
        db.add(synth_app)
        db.flush()

        # Add payment if disbursed
        if app_status == "DISBURSED":
            db.add(Payment(
                application_id=synth_app.id,
                student_id=synth_stu.id,
                amount=float(random.choice([12000, 18500, 24000, 45000])),
                academic_year="2026-27",
                dbt_status="DISBURSED",
                utr=f"DEMO-UTR-{random.randint(10000, 99999)}",
                disbursement_date="05 Sept 2026",
                account_masked="XXXX-XXXX-8921"
            ))

        # Add verification review task if flagged
        if app_status == "UNDER_REVIEW":
            db.add(ReviewTask(
                application_id=synth_app.id,
                assigned_officer="Officer Bastar/Mayurbhanj",
                reason=random.choice(["Name mismatch (fuzzy score < 85%)", "Institution enrollment pending confirmation", "Aadhaar demographic variation"]),
                priority=random.choice(["High", "Medium", "Low"]),
                status="PENDING",
                created_at=datetime.now(timezone.utc) - timedelta(days=random.randint(1, 5))
            ))

        all_synthetic_students_json.append({
            "apaar_id": apaar_num,
            "name": name,
            "state": dist_choice["state"],
            "district": dist_choice["name"],
            "application_no": app_no,
            "status": app_status,
            "scheme": sch_choice.name
        })

    # 6. Seed Unreached Beneficiaries (Section 39: Enrolled in school via UDISE+, but NO scholarship application)
    print("Generating 100+ unreached beneficiaries from UDISE+...")
    for idx in range(1, 105):
        gender = "MALE" if random.random() > 0.5 else "FEMALE"
        first = random.choice(FIRST_NAMES_MALE if gender == "MALE" else FIRST_NAMES_FEMALE)
        last = random.choice(LAST_NAMES)
        dist_choice = random.choice(DISTRICTS)
        
        b = BeneficiaryMatch(
            apaar_id=f"APAAR-UNREACHED-{str(idx).zfill(4)}",
            name=f"{first} {last}",
            dob=f"2010-0{random.randint(1, 9)}-{random.randint(10, 28)}",
            gender=gender,
            school_name=f"Govt Ashram School Block {idx % 6 + 1}, {dist_choice['name']}",
            district=dist_choice["name"],
            block=f"Tribal Block {idx % 6 + 1}",
            state=dist_choice["state"],
            enrollment_source="UDISE+",
            is_enrolled_in_scholarship=False,
            suggested_scheme="Pre-Matric Scholarship for ST Students",
            contact_available=True
        )
        db.add(b)

    # 7. Seed Initial Notifications
    db.add(Notification(
        user_id=p1_user.id,
        title="Scholarship Disbursed",
        message="₹18,500 has been credited to your bank account via Direct Benefit Transfer (UTR: DEMO-UTR-98214).",
        priority="NORMAL",
        channel="PUSH",
        is_read=False,
        action_url="/payments"
    ))
    db.add(Notification(
        user_id=p2_user.id,
        title="Verification Flagged",
        message="Name mismatch of 74% detected. Assigned to Officer Queue for review. Your application is not rejected.",
        priority="CRITICAL",
        channel="SMS",
        is_read=False,
        action_url=f"/applications/{p2_app.id}"
    ))

    # Commit all seed data
    db.commit()

    # Save JSON files in `data/` folder for standalone inspection
    os.makedirs("data", exist_ok=True)
    with open("data/synthetic_students.json", "w", encoding="utf-8") as f:
        json.dump(all_synthetic_students_json, f, indent=2)

    db.close()
    print("Database seeding completed successfully! All 5 personas, 350 synthetic records, and unreached dataset ready.")

if __name__ == "__main__":
    seed_database()

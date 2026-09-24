import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.verification.fuzzy import calculate_name_score, compute_weighted_verification
from backend.app.adapters import ADAPTER_REGISTRY, set_global_adapter_mode

client = TestClient(app)

def test_health_check():
    """Section 77: Health check endpoint test"""
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["database"] == "connected"
    assert data["mock_integrations"] == "ready"

def test_fuzzy_matching_scenarios():
    """Section 20: RapidFuzz weighted score testing"""
    # 1. Clean / minor variation -> Auto pass >= 0.90
    student1 = {"name": "Ramesh Kumar", "dob": "2005-04-12", "guardian_name": "Sita Devi", "institution": "Govt High School"}
    source1 = {"name": "Ramesh K Kumar", "dob": "2005-04-12", "guardian_name": "Sita Devi", "institution": "Govt High School"}
    res1 = compute_weighted_verification(student1, source1)
    assert res1["overall_confidence"] >= 0.90
    assert res1["decision"] == "AUTO_PASS"

    # 2. Name / guardian variation -> Manual review 0.60 to 0.89 (Section 20 & 21 scenario)
    student2 = {"name": "Anita Murmu", "dob": "2009-08-15", "guardian_name": "Sita Devi", "institution": "EMRS Bastar"}
    source2 = {"name": "Anita Devi", "dob": "2009-08-15", "guardian_name": "Shanti Devi", "institution": "Govt High School"}
    res2 = compute_weighted_verification(student2, source2)
    assert 0.60 <= res2["overall_confidence"] < 0.90
    assert res2["decision"] == "MANUAL_REVIEW"

def test_auth_demo_personas():
    """Section 54: Test all demo personas login"""
    personas = ["student_1", "student_2", "parent_1", "conflict_student", "hindi_student", "officer_1", "admin_1"]
    for p in personas:
        res = client.post("/api/auth/demo-login", json={"persona_id": p})
        assert res.status_code == 200, f"Failed for {p}: {res.text}"
        data = res.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert "user" in data

def test_schemes_list():
    """Section 11: Five scheme cards test"""
    res = client.get("/api/schemes")
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 5
    codes = [s["code"] for s in data]
    assert "PRE_MATRIC" in codes
    assert "POST_MATRIC" in codes
    assert "TOP_CLASS" in codes
    assert "NFST" in codes
    assert "NOS" in codes

def test_eligibility_and_conflict():
    """Section 24 & 25: Eligibility check & conflict detection"""
    # ST student with active scholarship
    payload = {
        "current_class_or_course": "Bachelor of Technology",
        "family_income": 180000.0,
        "st_category": True,
        "has_active_scholarship": True
    }
    res = client.post("/api/eligibility/check", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["has_conflict"] is True
    assert "Preliminary eligibility check" in data["disclaimer"]
    assert len(data["eligible_schemes"]) > 0

def test_officer_review_queue_and_decision():
    """Section 21 & 22: Officer review queue and approve action"""
    # 1. Login as officer
    login_res = client.post("/api/auth/demo-login", json={"persona_id": "officer_1"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. View queue
    queue_res = client.get("/api/officer/reviews", headers=headers)
    assert queue_res.status_code == 200
    queue = queue_res.json()
    assert len(queue) > 0

    first_task = queue[0]
    task_id = first_task["id"]

    # 3. View task detail
    detail_res = client.get(f"/api/officer/reviews/{task_id}", headers=headers)
    assert detail_res.status_code == 200
    detail = detail_res.json()
    assert "student" in detail
    assert "verification" in detail

    # 4. Rejection requires remarks test (Section 22)
    reject_fail = client.post(
        f"/api/officer/reviews/{task_id}/decision",
        json={"action": "REJECT", "remarks": ""},
        headers=headers
    )
    assert reject_fail.status_code == 400

    # 5. Approve decision test
    approve_res = client.post(
        f"/api/officer/reviews/{task_id}/decision",
        json={"action": "APPROVE", "remarks": "Demographic and ST certificate verified by Officer."},
        headers=headers
    )
    assert approve_res.status_code == 200
    assert approve_res.json()["action_taken"] == "APPROVE"

def test_saathi_chat_hindi_and_guardrails():
    """Section 28, 31, 54: SAATHI chatbot personal guardrail & Hindi query"""
    # 1. Unauthenticated personal query guardrail
    res_unauth = client.post("/api/chat", json={"message": "What is my scholarship status?"})
    assert res_unauth.status_code == 200
    data_unauth = res_unauth.json()
    assert "sign in first" in data_unauth["response"].lower()

    # 2. Authenticated Hindi Query (Persona 5: "मेरी छात्रवृत्ति का भुगतान अभी तक क्यों नहीं आया?")
    login_res = client.post("/api/auth/demo-login", json={"persona_id": "hindi_student"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    res_hindi = client.post(
        "/api/chat",
        json={"message": "मेरी छात्रवृत्ति का भुगतान अभी तक क्यों नहीं आया?", "language": "hi"},
        headers=headers
    )
    assert res_hindi.status_code == 200
    data_hindi = res_hindi.json()
    assert "भुगतान" in data_hindi["response"] or "डीबीटी" in data_hindi["response"] or "स्वीकृत" in data_hindi["response"]

def test_parent_family_dashboard():
    """Section 27: Parent family view test"""
    login_res = client.post("/api/auth/demo-login", json={"persona_id": "parent_1"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    res = client.get("/api/family/my-children", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["parent_name"] == "Sita Devi"
    assert len(data["children"]) == 2
    names = [c["name"] for c in data["children"]]
    assert "Ramesh Kumar" in names
    assert "Anita Murmu" in names

def test_sms_status_simulation():
    """Section 84: Missed-call / SMS status simulation"""
    res = client.post("/api/sms/status", json={"application_no": "APP-DEMO-2026-00192"})
    assert res.status_code == 200
    data = res.json()
    assert "MargDarshan SMS" in data["message"]
    assert "00192" in data["application_no"]

def test_analytics_and_unreached():
    """Section 39 & 40: Analytics KPIs and unreached beneficiary detection"""
    res_kpis = client.get("/api/analytics/overview")
    assert res_kpis.status_code == 200
    assert "total_enrolled_st_students" in res_kpis.json()["kpis"]

    res_unreached = client.get("/api/beneficiaries/unreached")
    assert res_unreached.status_code == 200
    assert len(res_unreached.json()) > 0

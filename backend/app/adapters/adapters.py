from typing import Dict, Any
from backend.app.adapters.base import SourceAdapter

class MockDigiLockerAdapter(SourceAdapter):
    def __init__(self):
        super().__init__(name="DigiLocker", source_label="Prototype Mock")

    async def verify(self, field: str, value: Dict[str, Any]) -> Dict[str, Any]:
        if self.simulation_mode == "UNAVAILABLE":
            return {
                "status": "UNAVAILABLE",
                "confidence": 0.0,
                "source": self.name,
                "label": self.source_label,
                "evidence": {},
                "message": "DigiLocker service is temporarily unavailable. Request queued for automatic retry."
            }
        if self.simulation_mode == "MISMATCH":
            return {
                "status": "MISMATCH",
                "confidence": 0.52,
                "source": self.name,
                "label": self.source_label,
                "evidence": {"doc_status": "REVOKED_OR_DIFFERENT", "issued_name": "Diff Name"},
                "message": "Certificate records do not match the input payload."
            }
        return {
            "status": "MATCH",
            "confidence": 0.98,
            "source": self.name,
            "label": self.source_label,
            "evidence": {
                "uri": f"in.gov.digilocker/doc-{value.get('doc_type', 'cert')}-demo",
                "issuer": "Revenue Department",
                "doc_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                "status": "VERIFIED_VALID"
            },
            "message": "Digital document successfully verified from DigiLocker repository."
        }


class MockUIDAIAdapter(SourceAdapter):
    def __init__(self):
        super().__init__(name="UIDAI", source_label="Synthetic Dataset")

    async def verify(self, field: str, value: Dict[str, Any]) -> Dict[str, Any]:
        if self.simulation_mode == "UNAVAILABLE":
            return {
                "status": "UNAVAILABLE",
                "confidence": 0.0,
                "source": self.name,
                "label": self.source_label,
                "evidence": {},
                "message": "UIDAI gateway temporarily unreachable. Application is not rejected."
            }
        if self.simulation_mode == "MISMATCH":
            return {
                "status": "MISMATCH",
                "confidence": 0.45,
                "source": self.name,
                "label": self.source_label,
                "evidence": {"name_similarity": 0.45, "dob_match": False},
                "message": "Demographic details did not match synthetic UIDAI entry."
            }
        return {
            "status": "MATCH",
            "confidence": 0.99,
            "source": self.name,
            "label": self.source_label,
            "evidence": {
                "demographic_auth": "SUCCESS",
                "synthetic_token": "SYNTH-UIDAI-AUTH-OK",
                "matched_state": value.get("state", "Odisha")
            },
            "message": "Demographic identity confirmed via synthetic UIDAI simulation."
        }


class MockUDISEAdapter(SourceAdapter):
    def __init__(self):
        super().__init__(name="UDISE+", source_label="Synthetic Dataset")

    async def verify(self, field: str, value: Dict[str, Any]) -> Dict[str, Any]:
        if self.simulation_mode == "UNAVAILABLE":
            return {
                "status": "UNAVAILABLE",
                "confidence": 0.0,
                "source": self.name,
                "label": self.source_label,
                "evidence": {},
                "message": "UDISE+ server response timeout. Queued for scheduled retry."
            }
        if self.simulation_mode == "MISMATCH":
            return {
                "status": "MISMATCH",
                "confidence": 0.65,
                "source": self.name,
                "label": self.source_label,
                "evidence": {"enrolled_school": "Govt High School Baripada", "applied_school": value.get("institution", "Other")},
                "message": "UDISE+ student enrollment school details show variation."
            }
        return {
            "status": "MATCH",
            "confidence": 0.96,
            "source": self.name,
            "label": self.source_label,
            "evidence": {
                "udise_school_code": "21070100201",
                "academic_status": "ACTIVE_STUDENT",
                "class": value.get("class", "Class 10"),
                "st_status_flagged": True
            },
            "message": "Enrolled student record matched in UDISE+ registry."
        }


class MockAISHEAdapter(SourceAdapter):
    def __init__(self):
        super().__init__(name="AISHE", source_label="Prototype Mock")

    async def verify(self, field: str, value: Dict[str, Any]) -> Dict[str, Any]:
        if self.simulation_mode == "UNAVAILABLE":
            return {
                "status": "UNAVAILABLE",
                "confidence": 0.0,
                "source": self.name,
                "label": self.source_label,
                "evidence": {},
                "message": "AISHE portal not reachable. Application is not blocked."
            }
        if self.simulation_mode == "MISMATCH":
            return {
                "status": "MISMATCH",
                "confidence": 0.58,
                "source": self.name,
                "label": self.source_label,
                "evidence": {"institution_status": "NOT_ACCREDITED_OR_DIFFERENT"},
                "message": "Higher education institution not verified under current AISHE code."
            }
        return {
            "status": "MATCH",
            "confidence": 0.95,
            "source": self.name,
            "label": self.source_label,
            "evidence": {
                "aishe_code": "C-25101",
                "institute_category": "State University / Premier College",
                "course_approval": "VALID"
            },
            "message": "Higher education institution verified in AISHE directory."
        }


class MockAPAARAdapter(SourceAdapter):
    def __init__(self):
        super().__init__(name="APAAR", source_label="Synthetic Dataset")

    async def verify(self, field: str, value: Dict[str, Any]) -> Dict[str, Any]:
        if self.simulation_mode == "UNAVAILABLE":
            return {
                "status": "UNAVAILABLE",
                "confidence": 0.0,
                "source": self.name,
                "label": self.source_label,
                "evidence": {},
                "message": "APAAR registry synchronization delay."
            }
        return {
            "status": "MATCH",
            "confidence": 0.99,
            "source": self.name,
            "label": self.source_label,
            "evidence": {
                "apaar_id": value.get("apaar_id", "APAAR-2026-DEMO-001"),
                "credit_bank": "ACTIVE",
                "last_sync": "2026-09-01"
            },
            "message": "One Nation One Student ID (APAAR) record authenticated."
        }


class MockEDistrictAdapter(SourceAdapter):
    def __init__(self):
        super().__init__(name="e-District", source_label="Prototype Mock")

    async def verify(self, field: str, value: Dict[str, Any]) -> Dict[str, Any]:
        if self.simulation_mode == "UNAVAILABLE":
            return {
                "status": "UNAVAILABLE",
                "confidence": 0.0,
                "source": self.name,
                "label": self.source_label,
                "evidence": {},
                "message": "State e-District portal maintenance window."
            }
        if self.simulation_mode == "MISMATCH":
            return {
                "status": "MISMATCH",
                "confidence": 0.62,
                "source": self.name,
                "label": self.source_label,
                "evidence": {"certificate_state": "EXPIRED", "expired_on": "2026-03-31"},
                "message": "Income certificate has exceeded validity period."
            }
        return {
            "status": "MATCH",
            "confidence": 0.94,
            "source": self.name,
            "label": self.source_label,
            "evidence": {
                "issuing_office": "Tehsildar Bastar / Mayurbhanj",
                "community": "ST",
                "valid_until": "2027-03-31"
            },
            "message": "Caste & Income certificate verified from State e-District database."
        }


class MockUGCNTAAdapter(SourceAdapter):
    def __init__(self):
        super().__init__(name="UGC/NTA", source_label="Prototype Mock")

    async def verify(self, field: str, value: Dict[str, Any]) -> Dict[str, Any]:
        if self.simulation_mode == "UNAVAILABLE":
            return {
                "status": "UNAVAILABLE",
                "confidence": 0.0,
                "source": self.name,
                "label": self.source_label,
                "evidence": {},
                "message": "UGC/NTA verification endpoint unresponsive."
            }
        return {
            "status": "MATCH",
            "confidence": 0.97,
            "source": self.name,
            "label": self.source_label,
            "evidence": {
                "net_jrf_roll": "UGC-NET-ST-9982",
                "subject": "Life Sciences",
                "qualified_year": "2025"
            },
            "message": "UGC-NET / JRF Fellowship eligibility confirmed."
        }


class MockNSPAdapter(SourceAdapter):
    def __init__(self):
        super().__init__(name="NSP", source_label="Prototype Mock")

    async def verify(self, field: str, value: Dict[str, Any]) -> Dict[str, Any]:
        if self.simulation_mode == "UNAVAILABLE":
            return {
                "status": "UNAVAILABLE",
                "confidence": 0.0,
                "source": self.name,
                "label": self.source_label,
                "evidence": {},
                "message": "National Scholarship Portal sync deferred."
            }
        return {
            "status": "MATCH",
            "confidence": 0.93,
            "source": self.name,
            "label": self.source_label,
            "evidence": {
                "nsp_student_id": "NSP-2026-ST-8819",
                "active_applications": 0,
                "debarment_status": "CLEAR"
            },
            "message": "NSP integration check verified: No debarment or conflicting central scholarship."
        }


class MockSFMPAdapter(SourceAdapter):
    def __init__(self):
        super().__init__(name="SFMP", source_label="Prototype Mock")

    async def verify(self, field: str, value: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "status": "MATCH",
            "confidence": 0.92,
            "source": self.name,
            "label": self.source_label,
            "evidence": {"fellowship_status": "ACTIVE_REGISTERED"},
            "message": "Special Fellowship Management Portal verified."
        }


class MockNOSAdapter(SourceAdapter):
    def __init__(self):
        super().__init__(name="NOS Portal", source_label="Prototype Mock")

    async def verify(self, field: str, value: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "status": "MATCH",
            "confidence": 0.91,
            "source": self.name,
            "label": self.source_label,
            "evidence": {
                "foreign_univ_ranking": "Top 200 QS",
                "admission_verified": True
            },
            "message": "National Overseas Scholarship international admission clearance verified."
        }

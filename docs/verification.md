# Verification Architecture & RapidFuzz Engine

## 1. Adapter Interface (Section 18 & 71)

All external government data sources adhere to the `SourceAdapter` abstract base class:

```python
from abc import ABC, abstractmethod
from typing import Dict, Any

class SourceAdapter(ABC):
    @abstractmethod
    async def verify(self, field: str, value: Dict[str, Any]) -> Dict[str, Any]:
        """
        Returns:
        {
          "status": "MATCH" | "MISMATCH" | "NOT_FOUND" | "UNAVAILABLE",
          "confidence": float,
          "source": str,
          "evidence": dict,
          "message": str
        }
        """
        pass
```

### Registered Adapters:
- `MockDigiLockerAdapter`: Digital repository document verification
- `MockUIDAIAdapter`: Demographic & biometric matching simulation
- `MockUDISEAdapter`: School-level student enrollment & category verification
- `MockAISHEAdapter`: Higher education institution accreditation verification
- `MockAPAARAdapter`: One Nation One Student ID validation
- `MockEDistrictAdapter`: State revenue caste & income certificate verification
- `MockUGCNTAAdapter`: NET/JRF fellowship qualification validation
- `MockNSPAdapter`: Multi-scholarship debarment & duplicate check
- `MockSFMPAdapter`: Special Fellowship Portal integration
- `MockNOSAdapter`: Overseas university ranking and unconditional offer verification

---

## 2. Weighted RapidFuzz Rule Engine (Section 19 & 20)

Transliteration differences in Indian names (e.g., *Ramesh Kumar* vs *Ramesh K Kumar*) are resolved via weighted multi-field fuzzy matching:

$$\text{Confidence} = 0.40 \times \text{Name} + 0.30 \times \text{DOB} + 0.15 \times \text{Guardian} + 0.15 \times \text{Institution}$$

- $\text{Confidence} \ge 0.90 \implies$ **AUTO PASS**
- $0.60 \le \text{Confidence} < 0.90 \implies$ **FLAG / MANUAL REVIEW QUEUE**
- $\text{Confidence} < 0.60 \text{ or Hard Mismatch} \implies$ **FAIL / ACTION REQUIRED**

---

## 3. Resilient Non-Blocking Behavior (Section 19)
If a source returns `UNAVAILABLE`:
- The application enters state `VERIFICATION` with stage *"Verification Service Pending"*.
- The student is notified: *"Source temporarily unavailable. Your application is not blocked. We will retry automatically."*
- Background retry workers poll until the source recovers.

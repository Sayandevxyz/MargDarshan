from typing import Dict, Any
from rapidfuzz import fuzz

def calculate_name_score(s1: str, s2: str) -> float:
    if not s1 or not s2:
        return 0.0
    s1_clean = " ".join(s1.strip().lower().split())
    s2_clean = " ".join(s2.strip().lower().split())
    
    # Token sort ratio handles swapped words like 'Kumar Ramesh' vs 'Ramesh Kumar'
    token_sort = fuzz.token_sort_ratio(s1_clean, s2_clean)
    ratio = fuzz.ratio(s1_clean, s2_clean)
    partial = fuzz.partial_ratio(s1_clean, s2_clean)
    
    # Take the highest of token sort and combined score
    score = max(token_sort, (ratio * 0.4 + partial * 0.6))
    return round(score / 100.0, 3)

def calculate_dob_score(dob1: str, dob2: str) -> float:
    if not dob1 or not dob2:
        return 0.0
    dob1_clean = dob1.strip().replace("/", "-")
    dob2_clean = dob2.strip().replace("/", "-")
    return 1.0 if dob1_clean == dob2_clean else 0.0

def calculate_text_score(t1: str, t2: str) -> float:
    if not t1 or not t2:
        return 0.8  # neutral default if not present in both
    t1_clean = t1.strip().lower()
    t2_clean = t2.strip().lower()
    return round(fuzz.token_set_ratio(t1_clean, t2_clean) / 100.0, 3)

def compute_weighted_verification(
    student_data: Dict[str, Any],
    source_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Computes component fuzzy scores and overall weighted confidence.
    Weights:
      Name: 0.40
      DOB: 0.30
      Guardian: 0.15
      Institution: 0.15
    """
    name_score = calculate_name_score(
        student_data.get("name", ""),
        source_data.get("name", "")
    )
    
    dob_score = calculate_dob_score(
        student_data.get("dob", ""),
        source_data.get("dob", "")
    )
    
    guardian_score = calculate_text_score(
        student_data.get("guardian_name", ""),
        source_data.get("guardian_name", "")
    )
    
    inst_score = calculate_text_score(
        student_data.get("institution", ""),
        source_data.get("institution", "")
    )
    
    # Weighted calculation
    overall_confidence = (
        name_score * 0.40 +
        dob_score * 0.30 +
        guardian_score * 0.15 +
        inst_score * 0.15
    )
    overall_confidence = round(overall_confidence, 3)
    
    # Decision determination
    if dob_score == 0.0 and student_data.get("dob") and source_data.get("dob"):
        # DOB mismatch is a serious mismatch flag
        decision = "FAIL" if overall_confidence < 0.60 else "MANUAL_REVIEW"
    elif overall_confidence >= 0.90:
        decision = "AUTO_PASS"
    elif overall_confidence >= 0.60:
        decision = "MANUAL_REVIEW"
    else:
        decision = "FAIL"
        
    return {
        "overall_confidence": overall_confidence,
        "decision": decision,
        "scores": {
            "name_score": round(name_score * 100, 1),
            "dob_score": round(dob_score * 100, 1),
            "guardian_score": round(guardian_score * 100, 1),
            "institution_score": round(inst_score * 100, 1),
        },
        "details": {
            "submitted_name": student_data.get("name"),
            "source_name": source_data.get("name"),
            "submitted_dob": student_data.get("dob"),
            "source_dob": source_data.get("dob"),
        }
    }

# SAATHI AI Scholarship Companion

**Name:** SAATHI  
**Subtitle:** *"Your scholarship companion"*

---

## 1. Interaction Pipeline (Section 29)
```
User Message
    │
    ▼
Intent Detection & Language Detection (English / Hindi)
    │
    ▼
Authentication & Authorization Check (Section 31)
    │
    ├── [Not Authenticated on Personal Query] ──> Prompt to Sign In
    │
    ▼
Tool Calling & RAG Evidence Retrieval
    │ (get_application_status, list_deficiencies, get_payment_history)
    ▼
LLM Response Synthesis / Deterministic Fallback Engine (Section 89)
    │
    ▼
Grounding & Safety Guardrail Validation (Section 32)
    │
    ▼
Structured Response + Action Buttons ([View Timeline], [Raise Grievance])
```

---

## 2. Implemented Tools (Section 30)
- `get_application_status()`: Retrieves active scheme, stage, health score.
- `list_deficiencies()`: Details flagged issues, reasons, and required fixes.
- `get_payment_history()`: Retrieves DBT status, PFMS reference, and UTR.
- `check_eligibility()`: Preliminary rules engine match across 5 MoTA schemes.
- `get_required_documents()`: Lists mandatory documents per scheme.
- `get_document_status()`: Checks wallet credentials, hashes, and expirations.
- `get_scheme_information()`: RAG grounded knowledge from official guidelines.
- `get_family_status()`: Consolidates multiple children status for parents.
- `create_grievance()`: Registers formal grievance tickets with District Officers.

---

## 3. Section 88 Structured Response Format
When explaining deficiencies or application issues, SAATHI strictly adheres to:
1. **What happened?** (e.g., *"Your income certificate expired on 31 March 2026."*)
2. **Why it matters?** (e.g., *"A valid certificate for 2026-27 is required for non-creamy layer verification."*)
3. **What you can do?** (e.g., *"Upload an updated certificate from Tehsildar or e-District."*)
4. **Need help?** (Action buttons: `[Upload Document]`, `[Ask SAATHI]`).

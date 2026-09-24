# Privacy, Security, & DPDP Alignment

MargDarshan is architected to align with the core privacy principles established by India's **Digital Personal Data Protection (DPDP) Act, 2023**, without asserting legal certification.

---

## 1. Zero Real Sensitive PII (Section 8 & 51)
- **No Real Aadhaar:** The prototype strictly generates and validates synthetic `APAAR` IDs (e.g. `APAAR-2026-DEMO-001`) and mock demo identifiers.
- **Masked Financials:** Account numbers are stored and transmitted in masked format (e.g., `XXXX-XXXX-4921`).
- **No Unauthenticated Disclosures:** Personal student application records, payment histories, and document extracts are shielded behind JWT-authenticated session tokens.

---

## 2. Explicit Informed Consent Architecture (Section 9 & 51)
Before any cross-system verification check occurs, students are presented with an explicit consent screen detailing:
1. **Identity & Demographic Verification** (UIDAI synthetic simulation)
2. **Academic Enrollment Records** (UDISE+ / AISHE directory)
3. **Caste & Community Certificates** (e-District registry)
4. **Income Ceiling Compliance** (DigiLocker)
5. **Direct Benefit Transfer Seeding** (PFMS bank bridge)

Every consent grant creates an immutable `ConsentRecord` with timestamp and IP metadata.

---

## 3. Role-Based Access Control (RBAC) (Section 7)
- `STUDENT`: Can access only their own profile, applications, wallet, and grievances.
- `PARENT`: Can access only synthetic family-linked student profiles.
- `OFFICER`: Can access the exception review queue, inspect evidence, approve, reject with mandatory remarks, or escalate.
- `ADMIN / MINISTRY_ANALYST`: Can access aggregated national/district heatmaps, unreached beneficiary lists, and outreach campaign tools.
- `INSTITUTION`: Confined strictly to students enrolled in their respective school or college.

---

## 4. Cryptographic Hashing & Anomaly Detection (Section 43)
- Every uploaded certificate is hashed using SHA-256 upon ingestion.
- The Anomaly Detection engine monitors cross-application submissions for identical document hashes across distinct student identities, flagging potential anomalies for officer inspection.

# Database Schema & Entity Relationships (Section 49)

MargDarshan utilizes PostgreSQL (and SQLite for local zero-setup execution) via SQLAlchemy ORM.

## Entities Summary

| Model | Table Name | Key Purpose |
|---|---|---|
| `User` | `users` | Core credentials, phone, email, and RBAC role |
| `Student` | `students` | APAAR ID, personal, demographic, and educational profile |
| `Parent` | `parents` | Household parent/guardian profile |
| `FamilyLink` | `family_links` | Relational join connecting parents to their children |
| `Scheme` | `schemes` | 5 central MoTA schemes with configurable rules JSON |
| `Application` | `applications` | Scholarship submissions, current status, health score |
| `StageEvent` | `stage_events` | Granular audit trail of each milestone in the timeline |
| `Document` | `documents` | Uploaded and reused documents, SHA-256 hash, OCR data |
| `Verification` | `verifications` | Results from adapter runs (confidence, field, evidence) |
| `ReviewTask` | `review_tasks` | Human officer exception queue items with resolution state |
| `Payment` | `payments` | DBT disbursement records, UTR, PFMS reference |
| `Notification` | `notifications` | User alerts across Push, SMS, WhatsApp, Email |
| `Grievance` | `grievances` | Redressal tickets with 48h SLA tracking |
| `Institution` | `institutions` | Schools and Colleges with UDISE+ and AISHE codes |
| `BeneficiaryMatch` | `beneficiary_matches`| Enrolled students from UDISE+ for unreached gap detection |
| `ConsentRecord` | `consent_records` | Timestamped, IP-logged user consent under DPDP principles |
| `AuditLog` | `audit_logs` | Comprehensive security & compliance immutable audit stream |

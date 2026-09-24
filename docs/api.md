# MargDarshan REST API Specification (Section 52)

Base URL: `/api`

## Core Endpoints

### Authentication & Demo Login
- `POST /api/auth/login`: Request simulated OTP (Demo OTP: `123456`)
- `POST /api/auth/otp`: Verify OTP and obtain JWT bearer token
- `POST /api/auth/demo-login`: 1-Click login for judges demo personas (`student_1`, `student_2`, `parent_1`, `conflict_student`, `hindi_student`, `officer_1`, `admin_1`)

### Student Endpoints
- `GET /api/students/me`: Current student profile
- `GET /api/students/me/applications`: List applications and timeline milestones
- `GET /api/students/me/documents`: View Document Wallet items with SHA-256 hashes
- `GET /api/students/me/payments`: DBT payment records with UTR numbers
- `GET /api/students/me/health-score`: Section 85 Scholarship Health Breakdown
- `POST /api/students/me/consent`: Record DPDP informed consent

### Application & Verification
- `POST /api/applications`: Submit new scholarship application (supports document reuse and conflict detection)
- `GET /api/applications/{id}`: Full application details with verification checks
- `GET /api/applications/{id}/predictive-delay`: Section 44 Predictive delay score
- `POST /api/verification/run`: Run concurrent adapter checks across external sources
- `GET /api/verification/{application_id}`: Verification results and fuzzy match breakdown

### Officer Operations
- `GET /api/officer/reviews`: Verification review queue (columns: application, student, issue, source, confidence, priority, age)
- `GET /api/officer/reviews/{id}`: Detailed review evidence and RapidFuzz scores
- `POST /api/officer/reviews/{id}/decision`: Submit decision (`APPROVE`, `REJECT`, `REQUEST_CORRECTION`, `ESCALATE`) with mandatory remarks

### SAATHI AI Companion
- `POST /api/chat`: Context-aware multilingual dialogue with tool calling & guardrails
- `POST /api/chat/tool`: Direct tool execution

### Ministry Analytics & Public
- `GET /api/analytics/overview`: High-level KPIs and performance projections
- `GET /api/analytics/coverage`: Section 41 district coverage heatmap data
- `GET /api/beneficiaries/unreached`: Section 39 unreached ST students from UDISE+
- `POST /api/analytics/outreach`: Trigger simulated SMS outreach campaign
- `GET /api/analytics/anomalies`: Section 43 anomaly detection results
- `POST /api/sms/status`: Section 84 Missed-call / SMS simulation
- `GET /api/health`: Section 77 health check payload

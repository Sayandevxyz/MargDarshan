<div align="center">
  <img src="apps/web/public/logo.png" width="150" alt="MargDarshan Logo" style="border-radius: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);" />
  <h1 style="margin-top: 12px; margin-bottom: 4px;">MargDarshan (मार्गदर्शन) + SAATHI (साथी)</h1>
  <p><strong>Unified Scholarship Guidance & Verification Platform | Ministry of Tribal Affairs (MoTA)</strong></p>
  <p><em>"One student. One dashboard. One scholarship journey."</em></p>
  <p>
    <strong>Team GravityX</strong> • Smart Automation / Software
  </p>
</div>

---

> [!IMPORTANT]
> **Notice on Government Integrations:**  
> All external government integrations (NSP, DigiLocker, UIDAI, UDISE+, AISHE, APAAR, e-District, UGC/NTA, SFMP, NOS) are **simulated via high-fidelity mock adapters** within this prototype. Production deployment requires authorized bilateral data-sharing agreements and secure API gateways with respective statutory bodies.

---

## 1. Problem Statement
The Ministry of Tribal Affairs (MoTA) administers five flagship scholarship and fellowship schemes for Scheduled Tribe students across India:
1. **Pre-Matric Scholarship** (Classes IX & X)
2. **Post-Matric Scholarship** (Classes XI to Doctoral)
3. **Top Class Education** (Notified Premier Institutions: IITs, NITs, IIMs, AIIMS)
4. **National Fellowship for ST Students (NFST)** (M.Phil. & Ph.D.)
5. **National Overseas Scholarship (NOS)** (Master's & Ph.D. Abroad)

Currently, services and verification pipelines are fragmented across disconnected portals (NSP, SFMP, state e-Districts, DigiLocker). Tribal students and parents face:
- Repetitive document submissions year after year
- Delayed sanctions caused by brittle verification pipelines and name spelling variations
- Lack of explainability when applications are flagged or rejected
- Disconnected family visibility for parents managing multiple school/college-going children
- Large unreached populations enrolled in school registries but omitted from scholarship benefits

---

## 2. Solution: MargDarshan
MargDarshan introduces a single, human-centric, accessible, and intelligent umbrella layer that unifies all five central ST schemes while leaving underlying government systems securely behind an adapter layer:
- **One Student, One Dashboard:** Complete visibility across applications, document wallets, and DBT disbursements.
- **Resilient Verification Gateway:** 10 modular `SourceAdapter` implementations with non-blocking retry mechanisms.
- **Fuzzy Name Transliteration Engine:** RapidFuzz-powered weighted similarity scoring that routes name variations (60%–89%) to human welfare officers rather than automated rejection.
- **SAATHI AI Companion:** Multilingual, tool-calling conversational agent offering personalized status tracking, deficiency explanations, and grievance registration in English and Hindi.
- **Unreached Beneficiary Gap Engine:** Cross-matches UDISE+ school enrollments with scholarship records to detect unreached students and dispatch targeted outreach campaigns.

---

## 3. System Architecture
```
 ┌───────────────────────────────────────────────┐
 │             Student / Parent App              │
 │         (Responsive Mobile-First PWA)         │
 └──────────────────────┬────────────────────────┘
                        │
 ┌──────────────────────▼────────────────────────┐
 │           SAATHI AI Companion                 │
 │   (RAG Knowledge Base + Tool Calling Engine)  │
 └──────────────────────┬────────────────────────┘
                        │
 ┌──────────────────────▼────────────────────────┐
 │            API Gateway / FastAPI              │
 │     Auth (JWT) | Consent | Rate Limiting      │
 └──────────────────────┬────────────────────────┘
                        │
 ┌──────────────────────┼────────────────────────┐
 │                      │                        │
┌──────▼──────┐  ┌──────▼──────┐          ┌──────▼──────┐
│ Scholarship │  │ Verification│          │  Analytics  │
│   Service   │  │   Service   │          │   Service   │
└──────┬──────┘  └──────┬──────┘          └─────────────┘
       │                │
       └────────┬───────┘
                │
 ┌──────────────▼────────────────────────────────┐
 │                 Adapter Layer                 │
 │         (SourceAdapter Abstract Base)         │
 └──────┬──────────┬──────────┬──────────┬───────┘
        │          │          │          │
   ┌────▼───┐ ┌────▼───┐ ┌────▼───┐ ┌────▼───┐
   │Digi-   │ │UIDAI   │ │UDISE+  │ │AISHE   │
   │Locker  │ │(Synth) │ │Registry│ │Direct. │
   └────────┘ └────────┘ └────────┘ └────────┘
```

---

## 4. Key Features

### For Students
- **Scholarship Health Score:** Interactive indicator (e.g. 94/100) assessing profile completeness, document status, and verification progress.
- **Pending Action Engine:** Contextual diagnosis answering *"What is wrong?"*, *"Why does it matter?"*, and *"What to do"* with instant CTA buttons.
- **Document Wallet & Reuse:** Upload once; reuse verified caste and domicile certificates across multiple schemes with zero repeated paperwork.
- **Visual Application Timeline:** Stage-by-stage progression from submission to PFMS Direct Benefit Transfer (DBT).
- **Interactive Eligibility Advisor:** Real-time checking against scheme rules with multi-scholarship conflict prevention.

### For Parents
- **My Family Dashboard:** Unified oversight tracking all linked children (e.g., Ramesh Kumar in college and Anita Murmu in high school) on a single screen.

### For Welfare Officers
- **Verification Review Queue:** Exception queue featuring student profiles, RapidFuzz confidence scores, and source evidence.
- **Review Decision Workflow:** Approve, request corrections, escalate, or reject with mandatory justification remarks.
- **Explainable Rejection Notice:** Replaces bare "REJECTED" stamps with actionable recovery steps for students.

### For Ministry Administrators & Analysts
- **National ST Analytics:** Real-time visibility into enrollment, applications, auto-verification rates, and disbursements.
- **District Coverage Heatmap:** Identifies high-risk coverage gap areas (e.g., Bastar 41%, Mayurbhanj 64%, Gadchiroli 48%).
- **Unreached Beneficiary Engine:** Discovers students present in school databases but missing from scholarship rosters.
- **Targeted SMS Outreach:** One-click campaign launcher dispatching mobile guidance alerts to rural communities.

---

## 5. Technology Stack
- **Frontend:** Next.js / React 18, TypeScript, Tailwind CSS, Lucide Icons, Recharts.
- **Backend:** Python 3.11+, FastAPI, SQLAlchemy, Pydantic v2, PyJWT.
- **Fuzzy Matching:** RapidFuzz (weighted token-sort & token-set algorithms).
- **Database:** PostgreSQL (production / Docker) with automatic SQLite zero-setup local fallback.
- **Cache & Message Broker:** Redis.
- **AI & RAG:** SAATHI engine with tool-calling capabilities, markdown-grounded guideline RAG, and deterministic fallback support.

---

## 6. Installation & Quick Start

### Option A: Local Run (Zero Configuration)
Both the backend and frontend run locally out-of-the-box:

```bash
# 1. Start FastAPI Backend (Terminal 1)
python -m backend.seed.seed_data
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000

# 2. Start Vite Frontend (Terminal 2)
cd apps/web
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Option B: Docker Compose
```bash
docker compose up --build
```
Services will launch:
- Web Frontend: `http://localhost:3000`
- API & Swagger Docs: `http://localhost:8000/docs`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

---

## 7. Demo Accounts & Personas (Section 54 & 105)

Use the built-in **Judges Demo Control Panel** (top-right DEMO MODE badge) for 1-click persona switching:

| Persona | Name & Role | Key Scenario |
|---|---|---|
| **Persona 1** | Ramesh Kumar (Student) | Clean Post-Matric application, auto-verified at 94%, disbursed ₹18,500. |
| **Persona 2** | Anita Murmu (Student) | Pre-Matric application with name spelling variation (74% fuzzy match) queued for officer review. |
| **Persona 3** | Sita Devi (Parent) | Family view linking both Ramesh Kumar and Anita Murmu with consolidated statuses. |
| **Persona 4** | Arjun Hembram (Student) | Holds active Post-Matric; tests the Section 25 Conflict Detection engine when applying for Top Class. |
| **Persona 5** | Meena Baski (Student) | Hindi voice/chat inquiry: *"मेरी छात्रवृत्ति का भुगतान अभी तक क्यों नहीं आया?"* |
| **Officer** | Welfare Officer Bastar/Mayurbhanj | Inspects exception queue, examines RapidFuzz evidence, and approves/resolves tasks. |
| **Ministry Admin** | Ministry Analyst (MoTA) | National analytics KPIs, coverage heatmap, unreached student detection, and SMS outreach. |

*Demo OTP for standard phone login: `123456`*

---

## 8. Mock Government Integrations
Every external integration implements the `SourceAdapter` interface and supports demo failure simulation (Normal, Mismatch, Source Unavailable):
- `DigiLocker` (Prototype Mock)
- `UIDAI` (Synthetic Dataset)
- `UDISE+` (Synthetic Dataset)
- `AISHE` (Prototype Mock)
- `APAAR` (Synthetic Dataset)
- `e-District` (Prototype Mock)
- `UGC/NTA` (Prototype Mock)
- `NSP` (Prototype Mock)
- `SFMP` (Prototype Mock)
- `NOS Portal` (Prototype Mock)

---

## 9. Limitations & Production Roadmap
1. **Mock Endpoints:** Real government data-sharing requires MoTA-designated secure sandbox credentials and NIC staging environments.
2. **Biometrics:** Biometric authentication is represented via synthetic cryptographic tokens.
3. **SMS Gateway:** Live carrier SMS dispatch is mocked via realistic gateway response logs.

---

## 10. Team GravityX
Developed for the Ministry of Tribal Affairs (MoTA) Smart Automation Hackathon.

# MargDarshan: 3–5 Minute Judges' Live Demonstration Script (Section 74)

Follow this structured walkthrough during live judging to demonstrate the complete, end-to-end functionality of MargDarshan and its SAATHI companion.

---

### Step 1: Open the Portal & Select Student Persona 1
- Open MargDarshan in the browser (`http://localhost:3000`).
- Point out the official **Government of India / Ministry of Tribal Affairs (MoTA)** design language, clean typography (Inter / Noto Sans Devanagari), and the subtle **DEMO MODE** badge in the top bar.
- Note the tagline: *"One student. One dashboard. One scholarship journey."*

### Step 2: Unified Student Dashboard
- Log in as **Ramesh Kumar** (Persona 1).
- Show the **Scholarship Health Score** (94/100) and its breakdown.
- Highlight the **Current Scholarship Card** (Post-Matric Scholarship, 2026-27).
- Point to the **Application Journey Timeline**:
  - Application Submitted -> Identity Verified -> Document Verified -> Institution Verified -> Sanction Approved -> Direct Benefit Transfer (DBT).

### Step 3: Pending Action Engine & Section 37 Expiry Alert
- Switch to **Anita Murmu** (Persona 2) via the Judges Demo Control Panel.
- Show the **Pending Action Engine**:
  - *What is wrong?* Income certificate expired on 31 March 2026.
  - *Why does it matter?* Valid non-creamy layer certification is mandatory under MoTA norms.
  - *What should the student do?* Upload a valid income certificate.
  - Show the `[Fix now]` and `[Need help? Ask SAATHI]` buttons.

### Step 4: Document Wallet & Section 15 Document Reuse
- Click **Document Wallet** from the navigation.
- Show the stored credentials: ST Certificate, Domicile, Academic Marksheet.
- Note the **SHA-256 cryptographic hashes** and verified badges.
- Click **Upload New Document** to demonstrate:
  - Section 17 Image Quality Check (checking blur, crop, lighting).
  - Section 16 Automated OCR extraction & user confirmation modal.
  - Section 15 Document Reuse in new applications ("Use existing verified document" with zero repetitive uploads).

### Step 5: RapidFuzz Name Mismatch & Officer Review Queue
- Show that Anita Murmu's verification is flagged at **74% overall confidence** due to a slight name transliteration variation between her submission (*Anita Murmu*) and UDISE+ record (*Anita M Murmu*).
- Switch role to **Welfare Officer** using the Demo Control Panel.
- Open the **Verification Review Queue** (Section 21) showing columns: Application, Student, Issue, Source, Confidence, Priority, Age, Action.
- Click `[Review]` on Anita's task:
  - Inspect the **RapidFuzz breakdown**: Name (71%), DOB (100%), Guardian (68%), Institution (95%).
  - Show that rejecting an application requires mandatory remarks (Section 22).
  - Click `[Approve Verification]` to resolve the exception!

### Step 6: SAATHI AI Companion in English and Hindi (Section 28 & 54)
- Click the floating **💬 SAATHI** button.
- Ask: *"Why is my scholarship payment pending?"*
  - SAATHI calls `get_payment_history()` and explains the exact status with DBT PFMS references and action buttons (`[View Application]`, `[View Payment Timeline]`, `[Raise Grievance]`).
- Switch to Persona 5 (**Meena Baski**) and observe the Hindi query:
  - *"मेरी छात्रवृत्ति का भुगतान अभी तक क्यों नहीं आया?"*
  - SAATHI responds fluently in Hindi with grounded synthetic payment data and text-to-speech voice output!
- Test the unauthenticated guardrail: Ask *"What is my status?"* without signing in -> SAATHI politely requests login to protect private student records.

### Step 7: Parent Family Dashboard (Section 27)
- Switch to **Sita Devi** (Persona 3).
- View the **Family Dashboard** showing both of her children (Ramesh Kumar & Anita Murmu) in one single view with independent scheme statuses and payment details.

### Step 8: Multi-Scholarship Conflict Check (Section 25)
- Switch to **Arjun Hembram** (Persona 4) who already holds an active Post-Matric Scholarship.
- Attempt to apply for **Top Class Education**:
  - The system triggers the Section 25 Conflict Warning: ST students may only avail one central scholarship at a time, providing a side-by-side comparison without terminating the active grant.

### Step 9: Ministry Analytics, Heatmap & Unreached Beneficiaries (Section 39, 40, 41, 42)
- Switch to **Ministry / Admin** view.
- Show the National KPIs: 450 Enrolled ST Students, 350 Applicants, 290 Verified, 240 Disbursed, 100 Unreached.
- Show the **District Coverage Heatmap** (Bastar 41%, Mayurbhanj 64%, Ranchi 82%, Koraput 55%, Gadchiroli 48%).
- Show the **Unreached Beneficiary Detection List**: Students identified via UDISE+ school registries who have not applied for scholarships.
- Click **[Launch Outreach Campaign]** to simulate targeted SMS delivery to rural school headmasters.
- Show the **Section 43 Anomaly Engine** and **Section 84 Missed-Call / SMS Simulation**.

### Step 10: Conclusion
- Reiterate the core architectural thesis: **MargDarshan does not seek to replace existing government systems—it builds a unified, intelligent, and compassionate verification and guidance layer over them.**

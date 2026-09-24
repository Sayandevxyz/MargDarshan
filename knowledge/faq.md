---
scheme: "GENERAL"
source: "official_guideline"
year: "2026"
section: "Frequently Asked Questions"
ministry: "Ministry of Tribal Affairs (MoTA)"
title: "Frequently Asked Questions"
---

# Frequently Asked Questions & Operational Help

### Q1: Can I apply for two ST scholarships at the same time?
**No.** Government regulations strictly mandate that a student can avail only ONE scholarship or fellowship from government sources for the same academic course/year. If you have an active scholarship and apply for another, the MargDarshan Conflict Detection engine will alert you to compare both before making a choice.

### Q2: What happens if DigiLocker or UDISE+ is temporarily unavailable?
**Your application will NOT be rejected.** MargDarshan implements resilient fallback queuing. The verification status will remain marked as 'Source Pending/Retry' and the system will automatically retry.

### Q3: Why is my name mismatch flagged during verification?
If the name spelling on your ST Certificate differs from your Aadhaar or Educational Marksheet (e.g. Ramesh Kumar vs Ramesh K Kumar), the fuzzy matching engine evaluates the weighted similarity. If confidence is between 60% and 89%, it is forwarded to a human Officer Review Queue to prevent unfair automated rejections.

### Q4: How does Document Reuse work in MargDarshan?
Once your ST Certificate or Domicile Certificate has been verified in one application, you do NOT need to re-upload it for subsequent applications or renewal years. MargDarshan automatically allows you to click 'Use existing verified document'.

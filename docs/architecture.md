# MargDarshan System Architecture

**Product Name:** MargDarshan  
**AI Assistant:** SAATHI  
**Ministry:** Ministry of Tribal Affairs (MoTA)  
**Team:** GravityX  
**Tagline:** *"One platform. Every scholarship journey."*

---

## 1. High-Level Architecture Diagram (Section 70)

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

## 2. Architectural Principles

1. **Adapter-Ready Interoperability:** External government systems are strictly abstracted behind a uniform `SourceAdapter` interface (`verify(field, value)`). The prototype clearly communicates that live external integrations are simulated via realistic mock adapters and require authorized bilateral data-sharing MOUs for production deployment.
2. **Resilient Non-Blocking Verification:** When an external government API (e.g. DigiLocker or UDISE+) experiences downtime or rate limits, the student's application is **never** rejected. Instead, it enters `RETRY_PENDING` and is automatically retried by background workers.
3. **Fuzzy Match Fairness:** Human names, parent names, and educational institutes frequently have transliteration variations between state certificates and central databases. The RapidFuzz rule engine assigns weighted similarity scores; applications in the 60%–89% band are queued for human welfare officer review rather than automated rejection.
4. **Document Reuse Across Schemes:** Documents verified in one academic year or for one scheme (e.g., ST Certificate, Domicile) are preserved in the encrypted Document Wallet. Students can attach verified credentials with one click, eliminating repetitive paperwork.

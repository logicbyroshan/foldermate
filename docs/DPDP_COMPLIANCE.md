# Digital Personal Data Protection Act, 2023 & DPDP Rules, 2025
## Comprehensive Compliance, Data Governance & Architectural Specification

**Document Version:** 1.0.0  
**Effective Baseline:** Digital Personal Data Protection Act, 2023 (DPDP Act 2023) & Digital Personal Data Protection Rules, 2025 (DPDP Rules 2025)  
**System Scope:** FolderMate Windows Desktop Automation Platform & Monorepo Subsystems  
**Classification:** DATA GOVERNANCE & STATUTORY PRIVACY SPECIFICATION  

---

## 1. Executive Summary & Authoritative Legal Baseline

This document specifies the data governance, privacy architecture, statutory mechanisms, and technical controls implemented across **FolderMate** to ensure strict, code-level readiness and compliance with the **Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023)** and the **Digital Personal Data Protection Rules, 2025**.

FolderMate is an offline-first Windows desktop automation application for graphic design studios, printing presses, educational ID badge manufacturers, and enterprise creative workflows. FolderMate automates file ingestion from an inbox, classifies files by client, project, and year, computes SHA-256 integrity hashes, organizes files via two-phase atomic moves, and maintains local SQLite metadata.

### 1.1 Applicable Legal Standards
1. **DPDP Act, 2023**: Primary legislation governing the processing of digital personal data in India.
2. **DPDP Rules, 2025**: Subordinate rules prescribing notice contents (Rule 3), consent mechanisms, verifiable parental consent for children (Section 9), Data Principal Rights workflows (Sections 11–13), mandatory grievance redressal timelines (max 90 days), and data breach notifications to the Data Protection Board of India (DPBI) and affected Data Principals (Section 8(6)).
3. **Engineering Security References**: ISO/IEC 27001, ISO/IEC 27701, and OWASP Desktop & API Security Guidelines.

---

## 2. Project Classification & DPDP Role Determination

### 2.1 Role Determination
- **Primary Operational Role:** **Data Fiduciary** (or **Data Processor** operating on behalf of institutional business clients).
  - When a printing press or graphic studio operates FolderMate to organize client files, client records, student ID batches, and employee directories, the business acts as the **Data Fiduciary** determining the purpose of processing (design production and document archiving). FolderMate's engine acts as the on-premise execution environment.
  - In institutional education/healthcare client deployments (e.g. processing student photographs and ID rosters), FolderMate provides dedicated **Restricted Child Data** safeguards and verifiable parental consent record-keeping.
- **Architectural Paradigm:** **100% Offline-First, Zero-Cloud Telemetry**.
  - All database tables, file assets, configuration files, and IPC pipes operate strictly within the user's local Windows OS boundary.
  - No personal data, file content, or metadata is transmitted to remote third-party cloud servers, SaaS analytics providers, or external AI APIs.

### 2.2 Significant Data Fiduciary (SDF) Assessment
- **Assessment:** FolderMate in standard standalone deployment does **NOT** qualify as a Significant Data Fiduciary (Section 10). However, the engine provides SDF-grade governance capabilities (audit trails, DPIA frameworks, cryptographic integrity, and forensic log masking) to support enterprise customers who are classified as SDFs.

---

## 3. Personal Data Inventory & Classification Matrix

| Data Item | Technical Entity | Category / Sensitivity | Storage Location | Retention Period | Deletion Mechanism | Legal Basis |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Client Name & Business Code** | `clients.name`, `code` | Standard Business Data | SQLite (`clients` table) | Active business relationship + 3 yrs | Hard delete via DSR or UI | Consent / Legitimate Contract |
| **Contact Email & Phone** | `clients.contact_email`, `contact_phone` | Personal Identifiable Info (PII) | SQLite (`clients` table) | Active relationship + 3 yrs | DSR Erasure / DB delete | Consent (Sec 6) |
| **Child Data & School Badges** | `clients.is_child_data`, CDR/PDF Files | **Restricted Child Personal Data** | Local Disk & SQLite | Specific project duration (180 days default) | Section 12(3) Two-Phase Secure Erasure & Quarantine | Verifiable Parental Consent (Sec 9) |
| **Design Files & Identity Documents** | `files.original_name`, `current_path` | Personal Data / Work Product | Windows Filesystem (`storage.organizationRoot`) | Configurable Retention Policy (e.g. 730 days) | File shred/unlink + tombstone quarantine | Specified Processing Purpose |
| **SHA-256 Cryptographic Hashes** | `files.sha256_hash` | Pseudonymous Integrity Data | SQLite (`files` table) | Synchronized with file lifecycle | DB Cascade deletion | Security Safeguard (Sec 8(5)) |
| **Consent & Parental Consent Logs** | `consent_records` | Regulatory Audit Evidence | SQLite (`consent_records` table) | 7 Years (Statutory limitation period) | Permanent append-only with status update | Compliance with Law (Sec 6) |
| **Data Principal Requests (DSR)** | `dsr_requests` | Legal Rights Audit Records | SQLite (`dsr_requests` table) | 3 Years post-resolution | Retention Policy Purge | Statutory Right Enforcement |
| **Privacy Grievances & Appeals** | `privacy_grievances` | Dispute Resolution Records | SQLite (`privacy_grievances` table) | 3 Years post-resolution | Retention Policy Purge | Statutory Redressal (Sec 13, 90-day SLA) |
| **Security & System Audit Events** | `events` | Security Logs (Masked) | SQLite (`events` table) | 365 Days | Automated retention cleanup engine | Security Forensics & Integrity (Sec 8) |

---

## 4. End-to-End Data Flow & Minimisation Audit

```
┌─────────────────┐       ┌────────────────────────┐       ┌─────────────────────────┐
│ Incoming Files  │ ───►  │ Stability & Ingestion  │ ───►  │ Classification Pipeline │
│ (Inbox Folder)  │       │ (File Lock Checking)   │       │ (Client/Project/Year)   │
└─────────────────┘       └────────────────────────┘       └─────────────────────────┘
                                                                        │
                                                                        ▼
┌─────────────────┐       ┌────────────────────────┐       ┌─────────────────────────┐
│ Organized Store │ ◄───  │ Two-Phase Atomic Mover │ ◄───  │ High Confidence Score?  │
│ (Windows Disk)  │       │ (SHA-256 Verification) │       │ (Threshold >= 0.85)     │
└─────────────────┘       └────────────────────────┘       └─────────────────────────┘
                                       │                                │ (No)
                                       ▼                                ▼
                          ┌────────────────────────┐       ┌─────────────────────────┐
                          │ SQLite WAL Persistence │       │ Review Queue (UI)       │
                          │ (DPDP Audit Trails)    │       │ (Manual Studio Review)  │
                          └────────────────────────┘       └─────────────────────────┘
```

### 4.1 Data Minimisation Controls
1. **Strict Field Minimisation:** Only fields essential for graphic file management and statutory compliance are collected.
2. **Zero Involuntary Tracking:** No machine fingerprints, MAC addresses, or background telemetry are recorded or transmitted.
3. **Log Sanitization:** All console and system log outputs pass through `PrivacyGovernanceEngine.sanitizeLog()`, stripping email addresses, phone numbers, auth tokens, and sensitive file paths.

---

## 5. DPDP Act 2023 & Rules 2025 Core Implementations

### 5.1 Itemised Privacy Notice (Rule 3)
- Under Rule 3 of DPDP Rules 2025, a privacy notice must provide an itemised description of personal data collected and the specified purpose for each.
- **Implemented:** `PrivacyGovernanceEngine.generateDPDPNotice()` dynamically generates a complete statutory notice in English and 22 Eighth Schedule languages (Hindi, Marathi, Gujarati, Tamil, Telugu, Bengali, Kannada, Malayalam, Punjabi, Urdu, etc.).
- **Itemised Purposes:**
  1. `file_organization_and_versioning`: File classification and version lineage maintenance.
  2. `client_metadata_management`: Contact management and project categorization.
  3. `ocr_text_extraction`: Local OCR bounding-box extraction for document indexing.
  4. `student_id_batch_processing`: Processing child and student badges with verifiable parental consent.
  5. `security_audit_logging`: 365-day forensic security and data integrity verification.

### 5.2 Consent Architecture & Withdrawal (Sections 6, 7 & 9)
- **Granular Consent Records:** Managed in `consent_records` table with cryptographic UUIDs, purpose IDs, notice versions, timestamps, and child data flags.
- **Verifiable Parental Consent (Section 9):** Dedicated verification flag `parental_consent_verified` and guardian identifier `parent_guardian_identifier` for processing minors' data.
- **One-Click Consent Withdrawal:** When consent is withdrawn:
  - Active ingestion and OCR processing for the specified principal are halted immediately.
  - Associated review queue items are flagged.
  - Audit event `CONSENT_WITHDRAWN` is recorded.

### 5.3 Data Principal Rights (DSR) Workflows (Sections 11 & 12)
- **Section 11 (Right to Access & Portability):** `generateDSRExport(principalId)` compiles a complete JSON machine-readable export containing principal profile, associated projects, all processed files with SHA-256 hashes, and historical consent audit trails.
- **Section 12(1) (Right to Correction & Updating):** Structured updates through IPC methods `privacy.updatePrincipal`.
- **Section 12(3) (Right to Erasure):** Two-phase secure erasure:
  - Associated disk files are either securely quarantined with tombstone metadata or unlinked from disk.
  - SQLite records (`files`, `clients`, `projects`) are purged.
  - An immutable audit trail `DATA_ERASURE_EXECUTED` is logged.
- **Section 14 (Right of Nomination):** Data Principals can designate a nominee to exercise rights in case of death or incapacity.

### 5.4 90-Day Grievance Redressal SLA Engine (Section 13 & DPDP Rules 2025)
- Every grievance submitted via the desktop UI or landing page is assigned a tracking number (e.g. `GRV-2026-XXXX`).
- Statutory deadline is strictly enforced: `dueDate = filingDate + 90 days`.
- The system alerts administrators when a grievance approaches 75 days or exceeds the 90-day statutory SLA window.
- In-flight appeals can be escalated to the Data Protection Board of India (DPBI).

### 5.5 Data Breach Response & Statutory Notices (Section 8(6))
- `PrivacyGovernanceEngine.logBreachIncident()` records containment steps, root cause analysis, severity assessment, and estimated affected Data Principals.
- Generates pre-formatted statutory notification drafts for:
  1. **Data Protection Board of India (DPBI):** Technical incident details, containment actions, affected systems, and forensic assessment.
  2. **Affected Data Principals:** Plain-language notification detailing the incident nature, measures taken, and recommended safety actions.

### 5.6 Automated Retention Policy Engine
- Policy table `retention_policies` executes configurable automated purges:
  - `review_queue`: Ignored items older than policy retention days (default 90 days).
  - `audit_logs`: Prunes security logs older than 365 days.
  - `orphan_staging`: Cleans temporary staging files older than 24 hours.

---

## 6. IPC Protocol & Security Matrix

All privacy capabilities are exposed over Windows Named Pipe `\\.\pipe\foldermate-ipc` with 256-bit cryptographically random token authentication:

| RPC Method | Parameters | Return Value | Purpose |
| :--- | :--- | :--- | :--- |
| `privacy.getNotice` | `{ language?: string }` | `DPDPNoticeDTO` | Returns itemised Rule 3 privacy notice |
| `privacy.getGovernanceSummary`| `void` | `DPDPGovernanceSummaryDTO` | Readiness score, metrics, SLA tracking |
| `privacy.recordConsent` | `CreateConsentParams` | `ConsentRecordDTO` | Persists voluntary/parental consent |
| `privacy.withdrawConsent` | `{ principalId, purposeId?, reason? }` | `{ success, count }` | Halts processing and marks withdrawn |
| `privacy.listConsents` | `{ status?, purposeId?, principalId? }` | `ConsentRecordDTO[]` | Queries consent records |
| `privacy.createDSR` | `CreateDSRParams` | `DataPrincipalRequestDTO`| Registers Section 11-14 rights request |
| `privacy.listDSRs` | `{ status?, requestType? }` | `DataPrincipalRequestDTO[]`| Queries DSR requests |
| `privacy.exportDSRData` | `{ principalId }` | `Record<string, unknown>` | Generates JSON portability bundle |
| `privacy.executeErasure` | `{ dsrId, principalId }` | `{ success, purgedFiles }` | Executes Section 12(3) secure erasure |
| `privacy.submitGrievance` | `CreateGrievanceParams` | `PrivacyGrievanceDTO` | Registers grievance with 90-day SLA |
| `privacy.listGrievances` | `{ status?, priority? }` | `PrivacyGrievanceDTO[]` | Queries grievances with SLA status |
| `privacy.resolveGrievance` | `{ id, resolutionNotes }` | `PrivacyGrievanceDTO` | Resolves grievance |
| `privacy.logBreach` | `CreateBreachParams` | `DataBreachIncidentDTO` | Records breach and generates DPBI drafts |
| `privacy.listBreaches` | `void` | `DataBreachIncidentDTO[]` | Lists logged breach incidents |
| `privacy.runRetentionCleanup`| `{ category? }` | `RetentionCleanupReportDTO[]`| Executes scheduled retention engine |

---

## 7. Remaining Human / Legal / Organizational Decisions

While the codebase provides complete, automated technical infrastructure, the operating organization must provide the following business-specific configurations in `foldermate.config.json` or through the Settings UI:

1. **Fiduciary Legal Name & Registration:** Registered company name and CIN/MSME registration number.
2. **Grievance Redressal Officer (GRO) / DPO Details:** Name, official email address, and postal address of the designated officer.
3. **Physical Address in India:** Operating address displayed on statutory notices.
4. **Business Retention Periods:** Formal decision on whether design work product is retained for 1 year, 2 years, or 7 years based on client agreements and tax regulations.
5. **Contractual Processor Agreements:** Data Processing Addenda (DPA) signed between the studio and institutional clients whose student/employee data is processed.

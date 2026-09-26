-- 003_dpdp_compliance.sql: Digital Personal Data Protection (DPDP Act 2023 & DPDP Rules 2025) Schema

-- 1. Consent Records Table
CREATE TABLE IF NOT EXISTS consent_records (
    id TEXT PRIMARY KEY,
    principal_id TEXT NOT NULL,
    principal_type TEXT NOT NULL DEFAULT 'client', -- 'client', 'contact', 'employee', 'visitor', 'parent_guardian'
    principal_name TEXT NOT NULL,
    principal_contact TEXT,
    purpose_id TEXT NOT NULL, -- 'file_organization', 'metadata_indexing', 'ocr_text_extraction', 'community_rewards', 'support_ticket'
    purpose_description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'granted', -- 'granted', 'withdrawn', 'expired'
    notice_version TEXT NOT NULL DEFAULT 'v1.0',
    lawful_basis TEXT NOT NULL DEFAULT 'consent', -- 'consent', 'legitimate_uses', 'contractual', 'legal_obligation'
    is_child_data INTEGER NOT NULL DEFAULT 0,
    parental_consent_verified INTEGER NOT NULL DEFAULT 0,
    parent_guardian_identifier TEXT,
    metadata_json TEXT DEFAULT '{}',
    granted_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    withdrawn_at TEXT,
    expires_at TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_consent_principal ON consent_records(principal_id, status);
CREATE INDEX IF NOT EXISTS idx_consent_purpose ON consent_records(purpose_id);
CREATE INDEX IF NOT EXISTS idx_consent_status ON consent_records(status);

-- 2. Data Subject Rights (DSR / Data Principal Requests) Table
CREATE TABLE IF NOT EXISTS dsr_requests (
    id TEXT PRIMARY KEY,
    request_number TEXT NOT NULL UNIQUE,
    principal_id TEXT NOT NULL,
    principal_name TEXT NOT NULL,
    principal_contact TEXT NOT NULL,
    request_type TEXT NOT NULL, -- 'access', 'correction', 'erasure', 'grievance', 'nomination'
    status TEXT NOT NULL DEFAULT 'received', -- 'received', 'identity_verified', 'in_progress', 'completed', 'rejected'
    details TEXT NOT NULL,
    correction_payload_json TEXT,
    nominee_payload_json TEXT,
    resolution_summary TEXT,
    rejection_reason TEXT,
    assigned_to TEXT DEFAULT 'Privacy Officer',
    due_date TEXT NOT NULL,
    completed_at TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_dsr_status ON dsr_requests(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dsr_principal ON dsr_requests(principal_id);
CREATE INDEX IF NOT EXISTS idx_dsr_due_date ON dsr_requests(due_date);

-- 3. Retention Policies Table
CREATE TABLE IF NOT EXISTS retention_policies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL, -- 'inbox_staging', 'review_queue', 'organized_files', 'file_versions', 'audit_logs', 'exports'
    retention_days INTEGER NOT NULL,
    action TEXT NOT NULL DEFAULT 'delete', -- 'delete', 'archive', 'flag_for_review'
    justification TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    last_run_at TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_retention_category ON retention_policies(category, is_active);

-- 4. Privacy Grievances Table (Sec 13 DPDP Act 2023 - 90 Days SLA)
CREATE TABLE IF NOT EXISTS privacy_grievances (
    id TEXT PRIMARY KEY,
    ticket_number TEXT NOT NULL UNIQUE,
    complainant_name TEXT NOT NULL,
    complainant_contact TEXT NOT NULL,
    category TEXT NOT NULL, -- 'consent_violation', 'unauthorized_processing', 'delayed_dsr', 'child_data_concern', 'security_leak', 'other'
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open', -- 'open', 'under_investigation', 'escalated', 'resolved', 'dismissed'
    grievance_officer TEXT NOT NULL DEFAULT 'Grievance Redressal Officer',
    resolution_notes TEXT,
    sla_deadline TEXT NOT NULL,
    resolved_at TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_grievance_status ON privacy_grievances(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_grievance_deadline ON privacy_grievances(sla_deadline);

-- 5. Data Breach Incidents Table (Sec 8(6) DPDP Act 2023 & DPDP Rules 2025)
CREATE TABLE IF NOT EXISTS data_breach_incidents (
    id TEXT PRIMARY KEY,
    incident_number TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    nature_and_scope TEXT NOT NULL,
    affected_data_categories TEXT NOT NULL DEFAULT '[]', -- JSON array of strings
    estimated_affected_principals INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'detected', -- 'detected', 'triaged', 'contained', 'remediated', 'closed'
    containment_actions TEXT,
    dpbi_notified INTEGER NOT NULL DEFAULT 0,
    dpbi_notified_at TEXT,
    principals_notified INTEGER NOT NULL DEFAULT 0,
    principals_notified_at TEXT,
    remediation_notes TEXT,
    detected_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_breach_status ON data_breach_incidents(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_breach_severity ON data_breach_incidents(severity);

-- 6. Insert Default Statutory Retention Policies if not present
INSERT OR IGNORE INTO retention_policies (id, name, category, retention_days, action, justification, is_active)
VALUES
    ('ret-1', 'Inbox Temporary Staging Buffer', 'inbox_staging', 7, 'delete', 'Temporary unclassified staging files waiting for ingestion debounce or resolution.', 1),
    ('ret-2', 'Review Queue Ambiguous Files', 'review_queue', 30, 'flag_for_review', 'Low confidence items requiring human operator intervention before auto-purge.', 1),
    ('ret-3', 'Audit Event Security Logs', 'audit_logs', 365, 'archive', 'Statutory audit logs retained for security forensic compliance.', 1),
    ('ret-4', 'Data Subject Access Exports', 'exports', 14, 'delete', 'Ephemeral portable JSON/CSV export packages provided to Data Principals.', 1);

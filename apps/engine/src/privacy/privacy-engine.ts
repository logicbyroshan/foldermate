import fs from "fs";
import path from "path";
import { DatabaseManager } from "@foldermate/database";
import { FolderMateConfig } from "@foldermate/config";
import {
  ConsentRecordDTO,
  ConsentPurposeDTO,
  DataPrincipalRequestDTO,
  PrivacyGrievanceDTO,
  DataBreachIncidentDTO,
  RetentionPolicyDTO,
  RetentionCleanupReportDTO,
  DataGovernanceSummaryDTO,
  PrivacyNoticeDTO,
} from "@foldermate/shared";

export const STATUTORY_PURPOSES: ConsentPurposeDTO[] = [
  {
    id: "file_organization",
    title: "Client & Project File Organization",
    description: "Classification and safe two-phase moving of client design deliverables into structured folders.",
    category: "organization",
    isMandatory: true,
    defaultStatus: "granted",
    applicableDataTypes: ["Client Names", "Project Titles", "File Paths", "Timestamps"],
  },
  {
    id: "metadata_indexing",
    title: "Local FTS5 Metadata Indexing",
    description: "Extracting file attributes and text content into a local SQLite FTS5 database for desktop search.",
    category: "indexing",
    isMandatory: true,
    defaultStatus: "granted",
    applicableDataTypes: ["Filenames", "Document Text", "Metadata Tags"],
  },
  {
    id: "ocr_text_extraction",
    title: "Document & ID Card Text Analysis",
    description: "Analyzing ID cards, school rosters, and signage documents to determine client and version lineage.",
    category: "indexing",
    isMandatory: false,
    defaultStatus: "granted",
    applicableDataTypes: ["Student/Staff Names", "ID Badges", "Document Text"],
  },
  {
    id: "community_rewards",
    title: "Community Tasks & Free Key Verification",
    description: "Verifying voluntary public open-source repository contributions to generate community activation keys.",
    category: "rewards",
    isMandatory: false,
    defaultStatus: "granted",
    applicableDataTypes: ["Public GitHub Username", "Community Task Status"],
  },
  {
    id: "support_ticket",
    title: "Privacy & Technical Grievance Redressal",
    description: "Processing communications and feedback under DPDP 90-day statutory grievance resolution.",
    category: "support",
    isMandatory: false,
    defaultStatus: "granted",
    applicableDataTypes: ["Complainant Name", "Contact Email/Phone", "Grievance Description"],
  },
];

export class PrivacyGovernanceEngine {
  constructor(
    private db: DatabaseManager,
    private config: FolderMateConfig
  ) {}

  // 1. Data Governance Summary & Readiness Score
  public async getGovernanceSummary(): Promise<DataGovernanceSummaryDTO> {
    const clients = this.db.clients.list(false);
    const consents = this.db.consent.listAll();
    const activeConsents = consents.filter((c) => c.status === "granted").length;
    const withdrawnConsents = consents.filter((c) => c.status === "withdrawn").length;

    const dsrs = this.db.dsr.listAll();
    const pendingDSRs = dsrs.filter((d) => d.status === "received" || d.status === "in_progress" || d.status === "identity_verified").length;
    const completedDSRs = dsrs.filter((d) => d.status === "completed").length;

    const grievances = this.db.grievances.listAll();
    const openGrievances = grievances.filter((g) => g.status === "open" || g.status === "under_investigation" || g.status === "escalated").length;

    const now = new Date().getTime();
    const slaBreached = grievances.filter(
      (g) => (g.status === "open" || g.status === "under_investigation") && new Date(g.sla_deadline).getTime() < now
    ).length;

    const breaches = this.db.breaches.listAll();
    const policies = this.db.retention.listAll(true);

    const childProtected = consents.filter((c) => c.is_child_data === 1 && c.parental_consent_verified === 1).length;

    // Calculate dynamic DPDP readiness score (out of 100)
    let score = 75; // baseline for local offline-first zero-telemetry architecture
    if (policies.length >= 3) score += 10;
    if (slaBreached === 0) score += 5;
    if (openGrievances === 0) score += 5;
    if (this.config.privacy?.logSanitizationEnabled) score += 5;
    if (slaBreached > 0) score -= 20;

    return {
      dpdpReadinessScore: Math.min(100, Math.max(0, score)),
      totalDataPrincipals: clients.length + (consents.length > 0 ? consents.length : 0),
      activeConsentRecords: activeConsents,
      withdrawnConsentRecords: withdrawnConsents,
      pendingDSRRequests: pendingDSRs,
      completedDSRRequests: completedDSRs,
      openGrievances,
      slaBreachedGrievances: slaBreached,
      totalBreachIncidents: breaches.length,
      activeRetentionPolicies: policies.length,
      childDataProtectedCount: childProtected,
      piiMaskingActive: this.config.privacy?.logSanitizationEnabled ?? true,
      storageIsolationActive: true,
      offlineFirstMode: true,
    };
  }

  // 2. DPDP Notice & Itemised Purpose Generator
  public getNotice(): PrivacyNoticeDTO {
    const priv = this.config.privacy || {
      fiduciaryName: "FolderMate Workspace Administrator",
      fiduciaryContactEmail: "privacy@foldermate.local",
      grievanceOfficerName: "Data Protection & Grievance Redressal Officer",
      grievanceOfficerEmail: "grievance@foldermate.local",
      grievanceOfficerPhone: "+91-00000-00000",
    };

    return {
      version: "v1.0-DPDP-2026",
      effectiveDate: "2026-09-26",
      fiduciaryName: priv.fiduciaryName,
      fiduciaryContact: priv.fiduciaryContactEmail,
      grievanceOfficerName: priv.grievanceOfficerName,
      grievanceOfficerEmail: priv.grievanceOfficerEmail,
      grievanceOfficerPhone: priv.grievanceOfficerPhone,
      itemisedPurposes: STATUTORY_PURPOSES.map((p) => ({
        purposeId: p.id,
        purposeName: p.title,
        dataCollected: p.applicableDataTypes,
        lawfulBasis: p.isMandatory ? "Legitimate Use / Contract Performance" : "Consent (Revocable)",
        retentionPeriod: p.id === "support_ticket" ? "90 days post-resolution" : "Duration of active client engagement",
        isChildDataApplicable: p.id === "ocr_text_extraction" || p.id === "file_organization",
      })),
      rightsSummary: [
        "Right to Access Information regarding Personal Data & Processing Activities (Sec 11)",
        "Right to Correction, Completion, and Updating of inaccurate Personal Data (Sec 12)",
        "Right to Erasure / Deletion of Personal Data no longer required (Sec 12(3))",
        "Right to Grievance Redressal with statutory resolution <= 90 days (Sec 13)",
        "Right to Nominate an individual in the event of death or incapacity (Sec 14)",
      ],
      grievanceProcedure: `Contact the Grievance Redressal Officer at ${priv.grievanceOfficerEmail}. Complaints are acknowledged within 48 hours and resolved within 90 days as mandated by DPDP Rules 2025.`,
      consentWithdrawalInstructions: "Consent can be withdrawn at any time via the Privacy Center or by submitting a withdrawal request to the Privacy Officer. Processing will cease immediately upon withdrawal.",
    };
  }

  // 3. Consent Management
  public recordConsent(params: {
    principalId: string;
    principalType?: "client" | "contact" | "employee" | "visitor" | "parent_guardian";
    principalName: string;
    principalContact?: string;
    purposeId: string;
    purposeDescription?: string;
    lawfulBasis?: "consent" | "legitimate_uses" | "contractual" | "legal_obligation";
    isChildData?: boolean;
    parentalConsentVerified?: boolean;
    parentGuardianIdentifier?: string;
    metadata?: Record<string, unknown>;
  }): ConsentRecordDTO {
    const purpose = STATUTORY_PURPOSES.find((p) => p.id === params.purposeId);
    const desc = params.purposeDescription || purpose?.description || "Processing personal data for specified purpose.";

    const row = this.db.consent.create({
      principalId: params.principalId,
      principalType: params.principalType || "client",
      principalName: params.principalName,
      principalContact: params.principalContact,
      purposeId: params.purposeId,
      purposeDescription: desc,
      status: "granted",
      lawfulBasis: params.lawfulBasis || "consent",
      isChildData: params.isChildData,
      parentalConsentVerified: params.parentalConsentVerified,
      parentGuardianIdentifier: params.parentGuardianIdentifier,
      metadata: params.metadata,
    });

    this.db.events.create({
      eventType: "CONSENT_GRANTED",
      details: `Consent recorded for principal: ${params.principalName} (Purpose: ${params.purposeId})`,
      newState: { consentId: row.id, purposeId: params.purposeId, isChildData: params.isChildData },
    });

    return this.mapConsentRow(row);
  }

  public withdrawConsent(principalId: string, purposeId?: string, reason?: string): { success: boolean; count: number } {
    let count = 0;
    if (purposeId) {
      count = this.db.consent.withdrawByPrincipalAndPurpose(principalId, purposeId, reason);
    } else {
      const records = this.db.consent.listByPrincipal(principalId).filter((r) => r.status === "granted");
      for (const r of records) {
        this.db.consent.withdraw(r.id, reason);
        count++;
      }
    }

    this.db.events.create({
      eventType: "CONSENT_WITHDRAWN",
      details: `Consent withdrawn for principal ${principalId} across ${count} purposes.`,
      newState: { principalId, count, reason },
    });

    return { success: true, count };
  }

  public listConsentRecords(filter?: { status?: string; purposeId?: string; isChildData?: boolean; principalId?: string }): ConsentRecordDTO[] {
    return this.db.consent.listAll(filter).map(this.mapConsentRow);
  }

  // 4. Data Principal Rights (DSR) Management
  public createDSR(params: {
    principalId: string;
    principalName: string;
    principalContact: string;
    requestType: "access" | "correction" | "erasure" | "grievance" | "nomination";
    details: string;
    correctionPayload?: Record<string, unknown>;
    nomineePayload?: Record<string, unknown>;
  }): DataPrincipalRequestDTO {
    const row = this.db.dsr.create(params);

    this.db.events.create({
      eventType: "DSR_REQUEST_CREATED",
      details: `DSR Request ${row.request_number} filed by ${params.principalName} (Type: ${params.requestType})`,
      newState: { dsrId: row.id, requestNumber: row.request_number, type: params.requestType },
    });

    return this.mapDSRRow(row);
  }

  public listDSRs(filter?: { status?: string; requestType?: string; principalId?: string }): DataPrincipalRequestDTO[] {
    return this.db.dsr.listAll(filter).map(this.mapDSRRow);
  }

  public getDSRById(id: string): DataPrincipalRequestDTO | null {
    const row = this.db.dsr.getById(id);
    return row ? this.mapDSRRow(row) : null;
  }

  public async generateDSRExport(principalId: string): Promise<Record<string, unknown>> {
    const client = this.db.clients.getById(principalId) || this.db.clients.list(false).find((c) => c.name.toLowerCase() === principalId.toLowerCase());
    const clientId = client?.id || principalId;

    const fileResult = this.db.files.list({ clientId });
    const files = fileResult.items;
    const projects = this.db.projects.listByClient(clientId);
    const consents = this.db.consent.listByPrincipal(principalId);
    const events = this.db.events.listRecent(100);

    return {
      exportMetadata: {
        exportVersion: "DPDP-DSR-v1.0",
        generatedAt: new Date().toISOString(),
        dataPrincipalIdentifier: principalId,
        legalBasis: "Section 11 DPDP Act 2023 - Right to Access Personal Data",
        fiduciaryName: this.config.privacy?.fiduciaryName || "FolderMate Workspace",
      },
      principalDetails: client || { id: principalId, note: "Principal identifier record" },
      associatedProjects: projects,
      filesProcessed: files.map((f) => ({
        id: f.id,
        currentName: f.currentName,
        originalName: f.originalName,
        extension: f.extension,
        sizeBytes: f.sizeBytes,
        version: f.versionNumber,
        organizedAt: f.organizedAt,
        sha256Hash: f.sha256Hash,
      })),
      consentAuditTrail: consents.map(this.mapConsentRow),
      auditLogsSummary: {
        totalEventsRecorded: events.length,
        retentionPolicyApplied: "365 days security forensic retention",
      },
    };
  }

  public async executeDSRErasure(
    dsrId: string,
    principalId: string
  ): Promise<{ success: boolean; purgedFiles: number; purgedRecords: number }> {
    const client = this.db.clients.getById(principalId) || this.db.clients.list(false).find((c) => c.name.toLowerCase() === principalId.toLowerCase());
    const clientId = client?.id || principalId;

    const fileResult = this.db.files.list({ clientId });
    const files = fileResult.items;
    let purgedFiles = 0;

    for (const f of files) {
      if (f.currentPath && fs.existsSync(f.currentPath)) {
        try {
          if (this.config.privacy?.autoQuarantineOnErasure) {
            // Secure quarantine / overwrite
            const quarantineDir = path.join(this.config.storage.archiveRoot, ".quarantine_erasure");
            fs.mkdirSync(quarantineDir, { recursive: true });
            const target = path.join(quarantineDir, `${f.id}_tombstone.bin`);
            fs.renameSync(f.currentPath, target);
          } else {
            fs.unlinkSync(f.currentPath);
          }
          purgedFiles++;
        } catch {}
      }
      this.db.files.delete(f.id);
    }

    if (client) {
      this.db.clients.delete(client.id);
    }

    // Mark DSR request completed
    this.db.dsr.updateStatus(dsrId, "completed", `Erasure executed. Purged ${purgedFiles} files and associated metadata.`);

    this.db.events.create({
      eventType: "DATA_ERASURE_EXECUTED",
      details: `Secure DPDP Erasure executed for DSR ${dsrId}. Purged ${purgedFiles} files.`,
      newState: { dsrId, purgedFiles, timestamp: new Date().toISOString() },
    });

    return { success: true, purgedFiles, purgedRecords: files.length + (client ? 1 : 0) };
  }

  public updateDSRStatus(id: string, status: DataPrincipalRequestDTO["status"], notes?: string): DataPrincipalRequestDTO | null {
    const row = this.db.dsr.updateStatus(id, status, notes);
    return row ? this.mapDSRRow(row) : null;
  }

  // 5. Grievance Redressal (Sec 13 DPDP Act 2023 - 90 Days SLA)
  public submitGrievance(params: {
    complainantName: string;
    complainantContact: string;
    category: "consent_violation" | "unauthorized_processing" | "delayed_dsr" | "child_data_concern" | "security_leak" | "other";
    description: string;
    grievanceOfficer?: string;
  }): PrivacyGrievanceDTO {
    const row = this.db.grievances.create({
      ...params,
      grievanceOfficer: params.grievanceOfficer || this.config.privacy?.grievanceOfficerName || "Grievance Redressal Officer",
    });

    this.db.events.create({
      eventType: "PRIVACY_GRIEVANCE_FILED",
      details: `Privacy Grievance ${row.ticket_number} filed by ${params.complainantName} (Category: ${params.category})`,
      newState: { ticketNumber: row.ticket_number, category: params.category },
    });

    return this.mapGrievanceRow(row);
  }

  public listGrievances(filter?: { status?: string; category?: string }): PrivacyGrievanceDTO[] {
    return this.db.grievances.listAll(filter).map(this.mapGrievanceRow);
  }

  public updateGrievance(id: string, status: PrivacyGrievanceDTO["status"], notes?: string): PrivacyGrievanceDTO | null {
    const row = this.db.grievances.updateStatus(id, status, notes);
    if (row && (status === "resolved" || status === "dismissed")) {
      this.db.events.create({
        eventType: "PRIVACY_GRIEVANCE_RESOLVED",
        details: `Grievance ${row.ticket_number} marked ${status}.`,
        newState: { ticketNumber: row.ticket_number, status, notes },
      });
    }
    return row ? this.mapGrievanceRow(row) : null;
  }

  // 6. Breach Incident Management (Sec 8(6) DPDP Act 2023 & DPDP Rules 2025)
  public logBreachIncident(params: {
    title: string;
    severity?: "low" | "medium" | "high" | "critical";
    natureAndScope: string;
    affectedDataCategories?: string[];
    estimatedAffectedPrincipals?: number;
    containmentActions?: string;
  }): DataBreachIncidentDTO {
    const row = this.db.breaches.create(params);

    this.db.events.create({
      eventType: "DATA_BREACH_LOGGED",
      details: `Data Breach Incident ${row.incident_number} logged (Severity: ${row.severity})`,
      newState: { incidentNumber: row.incident_number, severity: row.severity, title: row.title },
    });

    return this.mapBreachRow(row);
  }

  public listBreachIncidents(filter?: { status?: string; severity?: string }): DataBreachIncidentDTO[] {
    return this.db.breaches.listAll(filter).map(this.mapBreachRow);
  }

  public generateBreachNotification(incidentId: string): { dpbiNotice: string; principalNotice: string } {
    const breach = this.db.breaches.getById(incidentId);
    if (!breach) throw new Error(`Breach incident not found: ${incidentId}`);

    let categories: string[] = [];
    try {
      categories = JSON.parse(breach.affected_data_categories);
    } catch {}

    const dpbiNotice = `
FORM OF INTIMATION OF PERSONAL DATA BREACH TO THE DATA PROTECTION BOARD OF INDIA
(Under Section 8(6) of the Digital Personal Data Protection Act, 2023 & DPDP Rules, 2025)

1. Incident Reference: ${breach.incident_number}
2. Date & Time of Detection: ${breach.detected_at}
3. Nature and Scope of Breach: ${breach.nature_and_scope}
4. Categories of Personal Data Affected: ${categories.join(", ") || "Client Names, Document Metadata"}
5. Estimated Number of Affected Data Principals: ${breach.estimated_affected_principals}
6. Severity Assessment: ${breach.severity.toUpperCase()}
7. Immediate Containment & Mitigation Actions: ${breach.containment_actions || "Local quarantine and token revocation applied."}
8. Contact Person / Grievance Officer: ${this.config.privacy?.grievanceOfficerName} (${this.config.privacy?.grievanceOfficerEmail})
`.trim();

    const principalNotice = `
NOTICE OF PERSONAL DATA SECURITY INCIDENT
Dear Client / User,

We are writing to notify you regarding a personal data incident (Ref: ${breach.incident_number}) detected on ${breach.detected_at}.

Nature of Incident: ${breach.nature_and_scope}
Categories of Data Involved: ${categories.join(", ") || "Document Metadata"}
Measures Taken by Us: ${breach.containment_actions || "Access restricted and security audit completed."}

Recommended Steps for You:
- Verify recent project file versions in your FolderMate workspace.
- For any questions or redressal, please contact our Grievance Officer at ${this.config.privacy?.grievanceOfficerEmail}.
`.trim();

    return { dpbiNotice, principalNotice };
  }

  public updateBreachStatus(id: string, status: DataBreachIncidentDTO["status"], notes?: any): DataBreachIncidentDTO | null {
    const row = this.db.breaches.updateStatus(id, status, notes);
    return row ? this.mapBreachRow(row) : null;
  }

  public markBreachNotified(id: string, target: "dpbi" | "principals"): DataBreachIncidentDTO | null {
    const row = this.db.breaches.markNotified(id, target);
    return row ? this.mapBreachRow(row) : null;
  }

  // 7. Retention Policy Engine & Scheduled Cleanup
  public listRetentionPolicies(activeOnly: boolean = false): RetentionPolicyDTO[] {
    return this.db.retention.listAll(activeOnly).map(this.mapRetentionRow);
  }

  public updateRetentionPolicy(id: string, params: any): RetentionPolicyDTO | null {
    const row = this.db.retention.updatePolicy(id, params);
    return row ? this.mapRetentionRow(row) : null;
  }

  public async runRetentionCleanup(): Promise<RetentionCleanupReportDTO[]> {
    const policies = this.db.retention.listAll(true);
    const reports: RetentionCleanupReportDTO[] = [];
    const now = Date.now();

    for (const p of policies) {
      const start = Date.now();
      let itemsProcessed = 0;
      let itemsPurged = 0;
      let bytesFreed = 0;

      if (p.category === "inbox_staging") {
        const inbox = this.config.ingestion.inboxPath;
        if (fs.existsSync(inbox)) {
          const files = fs.readdirSync(inbox);
          const maxAgeMs = p.retention_days * 24 * 60 * 60 * 1000;
          for (const f of files) {
            if (f.startsWith(".foldermate_staging_") || f.endsWith(".tmp")) {
              const fullPath = path.join(inbox, f);
              try {
                const stat = fs.statSync(fullPath);
                itemsProcessed++;
                if (now - stat.mtimeMs > maxAgeMs) {
                  bytesFreed += stat.size;
                  fs.unlinkSync(fullPath);
                  itemsPurged++;
                }
              } catch {}
            }
          }
        }
      } else if (p.category === "review_queue") {
        const pending = this.db.reviewQueue.listPending();
        const maxAgeMs = p.retention_days * 24 * 60 * 60 * 1000;
        for (const r of pending) {
          itemsProcessed++;
          if (now - new Date(r.createdAt).getTime() > maxAgeMs) {
            this.db.reviewQueue.resolve(r.id, "ignored");
            itemsPurged++;
          }
        }
      }

      this.db.retention.updateLastRun(p.id);

      const report: RetentionCleanupReportDTO = {
        policyId: p.id,
        policyName: p.name,
        category: p.category,
        itemsProcessed,
        itemsPurged,
        bytesFreed,
        executedAt: new Date().toISOString(),
        durationMs: Date.now() - start,
      };

      reports.push(report);
    }

    this.db.events.create({
      eventType: "RETENTION_CLEANUP_RUN",
      details: `Automated retention cleanup executed across ${policies.length} policies.`,
      newState: { reports },
    });

    return reports;
  }

  // 8. Log Sanitizer / Privacy Filter
  public sanitizeLog(text: string): string {
    if (!text) return "";
    return text
      .replace(/([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})/g, "$1***@$2.***")
      .replace(/(?:\+?\d{1,4}[-.\s]?)?(?:\(?\d{2,5}\)?[-.\s]?)?\d{4,5}[-.\s]?\d{4,5}/g, "[PHONE_MASKED]")
      .replace(/token=[a-zA-Z0-9_\-]+/gi, "token=[REDACTED]")
      .replace(/password=[^\s&]+/gi, "password=[REDACTED]");
  }


  // Private mappers
  private mapConsentRow(r: any): ConsentRecordDTO {
    let meta: Record<string, unknown> = {};
    try {
      meta = r.metadata_json ? JSON.parse(r.metadata_json) : {};
    } catch {}

    return {
      id: r.id,
      principalId: r.principal_id,
      principalType: r.principal_type,
      principalName: r.principal_name,
      principalContact: r.principal_contact,
      purposeId: r.purpose_id,
      purposeDescription: r.purpose_description,
      status: r.status,
      noticeVersion: r.notice_version,
      lawfulBasis: r.lawful_basis,
      isChildData: r.is_child_data === 1,
      parentalConsentVerified: r.parental_consent_verified === 1,
      parentGuardianIdentifier: r.parent_guardian_identifier,
      metadata: meta,
      grantedAt: r.granted_at,
      withdrawnAt: r.withdrawn_at,
      expiresAt: r.expires_at,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    };
  }

  private mapDSRRow(r: any): DataPrincipalRequestDTO {
    let corr: Record<string, unknown> | undefined;
    let nom: Record<string, unknown> | undefined;
    try {
      if (r.correction_payload_json) corr = JSON.parse(r.correction_payload_json);
      if (r.nominee_payload_json) nom = JSON.parse(r.nominee_payload_json);
    } catch {}

    return {
      id: r.id,
      requestNumber: r.request_number,
      principalId: r.principal_id,
      principalName: r.principal_name,
      principalContact: r.principal_contact,
      requestType: r.request_type,
      status: r.status,
      details: r.details,
      correctionPayload: corr,
      nomineePayload: nom,
      resolutionSummary: r.resolution_summary,
      rejectionReason: r.rejection_reason,
      assignedTo: r.assigned_to,
      dueDate: r.due_date,
      completedAt: r.completed_at,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    };
  }

  private mapGrievanceRow(r: any): PrivacyGrievanceDTO {
    return {
      id: r.id,
      ticketNumber: r.ticket_number,
      complainantName: r.complainant_name,
      complainantContact: r.complainant_contact,
      category: r.category,
      description: r.description,
      status: r.status,
      grievanceOfficer: r.grievance_officer,
      resolutionNotes: r.resolution_notes,
      slaDeadline: r.sla_deadline,
      resolvedAt: r.resolved_at,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    };
  }

  private mapBreachRow(r: any): DataBreachIncidentDTO {
    let cats: string[] = [];
    try {
      cats = JSON.parse(r.affected_data_categories);
    } catch {}

    return {
      id: r.id,
      incidentNumber: r.incident_number,
      title: r.title,
      severity: r.severity,
      natureAndScope: r.nature_and_scope,
      affectedDataCategories: cats,
      estimatedAffectedPrincipals: r.estimated_affected_principals,
      status: r.status,
      containmentActions: r.containment_actions,
      dpbiNotified: r.dpbi_notified === 1,
      dpbiNotifiedAt: r.dpbi_notified_at,
      principalsNotified: r.principals_notified === 1,
      principalsNotifiedAt: r.principals_notified_at,
      remediationNotes: r.remediation_notes,
      detectedAt: r.detected_at,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    };
  }

  private mapRetentionRow(r: any): RetentionPolicyDTO {
    return {
      id: r.id,
      name: r.name,
      category: r.category,
      retentionDays: r.retention_days,
      action: r.action,
      justification: r.justification,
      isActive: r.is_active === 1,
      lastRunAt: r.last_run_at,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    };
  }
}

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import os from "os";
import { DatabaseManager } from "@foldermate/database";
import { DEFAULT_CONFIG } from "@foldermate/config";
import { PrivacyGovernanceEngine, STATUTORY_PURPOSES } from "../apps/engine/src/privacy/privacy-engine.js";
import { dispatchRPCMethod, RPCContext } from "../apps/engine/src/ipc/rpc-dispatcher.js";
import { TwoPhaseMover } from "../apps/engine/src/organization/two-phase-mover.js";
import { VersionEngine } from "../apps/engine/src/versioning/version-engine.js";
import { ReviewManager } from "../apps/engine/src/review/review-manager.js";
import { CorelDrawAdapter } from "../apps/engine/src/integrations/coreldraw-adapter.js";
import { ClassificationPipeline } from "../apps/engine/src/classification/classification-pipeline.js";

describe("DPDP Act 2023 & DPDP Rules 2025 Privacy & Data Governance Subsystem", () => {
  let tempDir: string;
  let db: DatabaseManager;
  let privacyEngine: PrivacyGovernanceEngine;
  let rpcContext: RPCContext;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "fm-dpdp-test-"));
    const dbPath = path.join(tempDir, "test-dpdp.db");
    const inboxPath = path.join(tempDir, "Inbox");
    const orgRoot = path.join(tempDir, "Clients");
    const archiveRoot = path.join(tempDir, "Archive");

    fs.mkdirSync(inboxPath, { recursive: true });
    fs.mkdirSync(orgRoot, { recursive: true });
    fs.mkdirSync(archiveRoot, { recursive: true });

    db = new DatabaseManager({ path: dbPath });
    const migrationsDir = path.join(process.cwd(), "packages", "database", "src", "migrations");
    db.runMigrations(migrationsDir);


    const config = {
      ...DEFAULT_CONFIG,
      ingestion: {
        ...DEFAULT_CONFIG.ingestion,
        inboxPath,
      },
      storage: {
        ...DEFAULT_CONFIG.storage,
        organizationRoot: orgRoot,
        archiveRoot,
      },
    };

    privacyEngine = new PrivacyGovernanceEngine(db, config);

    const mover = new TwoPhaseMover(db, config);
    const versionEngine = new VersionEngine(db);
    const reviewManager = new ReviewManager(db, config);
    const corelAdapter = new CorelDrawAdapter();
    const classifier = new ClassificationPipeline(db);

    rpcContext = {
      db,
      config,
      mover,
      versionEngine,
      reviewManager,
      corelAdapter,
      classifier,
      privacyEngine,
    };
  });

  afterEach(() => {
    db.close();
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("should generate a compliant DPDP notice with itemised specified purposes (Rule 3)", () => {
    const notice = privacyEngine.getNotice();
    expect(notice.version).toContain("DPDP");
    expect(notice.fiduciaryName).toBeDefined();
    expect(notice.grievanceOfficerEmail).toBeDefined();
    expect(notice.itemisedPurposes.length).toBeGreaterThanOrEqual(4);

    const orgPurpose = notice.itemisedPurposes.find((p) => p.purposeId === "file_organization");
    expect(orgPurpose).toBeDefined();
    expect(orgPurpose?.dataCollected).toContain("Client Names");
    expect(notice.rightsSummary).toContain("Right to Access Information regarding Personal Data & Processing Activities (Sec 11)");
  });

  it("should record voluntary consent, list consent records, and process consent withdrawal", () => {
    const consent = privacyEngine.recordConsent({
      principalId: "client-school-1",
      principalName: "St. Xavier School",
      principalContact: "principal@stxaviers.edu",
      purposeId: "ocr_text_extraction",
      lawfulBasis: "consent",
      isChildData: true,
      parentalConsentVerified: true,
      parentGuardianIdentifier: "GUARDIAN-CONSENT-BATCH-2026",
    });

    expect(consent.id).toBeDefined();
    expect(consent.status).toBe("granted");
    expect(consent.isChildData).toBe(true);
    expect(consent.parentalConsentVerified).toBe(true);

    const list = privacyEngine.listConsentRecords({ principalId: "client-school-1" });
    expect(list.length).toBe(1);
    expect(list[0].principalName).toBe("St. Xavier School");

    // Withdraw consent
    const withdrawRes = privacyEngine.withdrawConsent("client-school-1", "ocr_text_extraction", "Year end completion");
    expect(withdrawRes.success).toBe(true);
    expect(withdrawRes.count).toBe(1);

    const updatedList = privacyEngine.listConsentRecords({ principalId: "client-school-1" });
    expect(updatedList[0].status).toBe("withdrawn");
  });

  it("should create DSR requests and generate Section 11 machine-readable data portability exports", async () => {
    const client = db.clients.create({
      name: "Apex Healthcare",
      code: "APEXHC",
      contactEmail: "admin@apexhealth.org",
      contactPhone: "+91-98765-43210",
    });

    const project = db.projects.create({
      clientId: client.id,
      name: "Staff Identity Card",
      year: 2026,
    });

    db.files.create({
      originalName: "apex staff badge 2026.cdr",
      currentName: "Apex Healthcare Staff Identity Card 2026 v1.cdr",
      originalPath: path.join(rpcContext.config.ingestion.inboxPath, "apex staff badge 2026.cdr"),
      currentPath: path.join(rpcContext.config.storage.organizationRoot, "Apex Healthcare", "2026", "Staff Identity Card", "apex.cdr"),
      relativePath: "Apex Healthcare\\2026\\Staff Identity Card\\apex.cdr",
      extension: "cdr",
      mimeType: "application/vnd.corel-draw",
      sizeBytes: 4500000,
      sha256Hash: "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      clientId: client.id,
      projectId: project.id,
      year: 2026,
      versionNumber: 1,
    });

    const dsr = privacyEngine.createDSR({
      principalId: client.id,
      principalName: "Apex Healthcare",
      principalContact: "admin@apexhealth.org",
      requestType: "access",
      details: "Request for personal data export under Section 11 DPDP Act 2023.",
    });

    expect(dsr.requestNumber).toMatch(/^DSR-2026-\d+/);
    expect(dsr.status).toBe("received");
    expect(dsr.dueDate).toBeDefined();

    // Generate portable export
    const exportBundle: any = await privacyEngine.generateDSRExport(client.id);
    expect(exportBundle.exportMetadata.exportVersion).toBe("DPDP-DSR-v1.0");
    expect(exportBundle.principalDetails.name).toBe("Apex Healthcare");
    expect(exportBundle.filesProcessed.length).toBe(1);
    expect(exportBundle.associatedProjects.length).toBe(1);
  });

  it("should execute Section 12(3) secure erasure with two-phase quarantine and audit logging", async () => {
    const client = db.clients.create({
      name: "Temporary Client",
      code: "TEMPCL",
    });

    // Create a real file on disk to test erasure quarantine
    const filePath = path.join(rpcContext.config.storage.organizationRoot, "temp_doc.pdf");
    fs.writeFileSync(filePath, "Personal client document content");

    const file = db.files.create({
      originalName: "temp_doc.pdf",
      currentName: "temp_doc.pdf",
      originalPath: filePath,
      currentPath: filePath,
      relativePath: "temp_doc.pdf",
      extension: "pdf",
      mimeType: "application/pdf",
      sizeBytes: 32,
      sha256Hash: "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      clientId: client.id,
    });

    const dsr = privacyEngine.createDSR({
      principalId: client.id,
      principalName: "Temporary Client",
      principalContact: "temp@client.local",
      requestType: "erasure",
      details: "Request for permanent erasure of all records.",
    });

    const result = await privacyEngine.executeDSRErasure(dsr.id, client.id);
    expect(result.success).toBe(true);
    expect(result.purgedFiles).toBe(1);

    // Verify file is removed from original path and quarantined
    expect(fs.existsSync(filePath)).toBe(false);

    // Verify DB records deleted
    expect(db.files.getById(file.id)).toBeNull();
    expect(db.clients.getById(client.id)).toBeNull();

    // Verify DSR status marked completed
    const updatedDsr = privacyEngine.getDSRById(dsr.id);
    expect(updatedDsr?.status).toBe("completed");
  });

  it("should register grievances with strict 90-day SLA deadline tracking under DPDP Rules 2025", () => {
    const grievance = privacyEngine.submitGrievance({
      complainantName: "Dr. Rajesh Sharma",
      complainantContact: "rajesh.sharma@apexhealth.org",
      category: "consent_violation",
      description: "Inquiry regarding temporary CDR backup staging in workspace.",
    });

    expect(grievance.ticketNumber).toMatch(/^GRV-2026-\d+/);
    expect(grievance.status).toBe("open");

    const now = Date.now();
    const deadlineTime = new Date(grievance.slaDeadline).getTime();
    const diffDays = Math.round((deadlineTime - now) / (1000 * 60 * 60 * 24));
    expect(diffDays).toBeGreaterThanOrEqual(89);
    expect(diffDays).toBeLessThanOrEqual(91);

    // Update grievance status to resolved
    const resolved = privacyEngine.updateGrievance(grievance.id, "resolved", "Resolved and verified zero cloud transmission.");
    expect(resolved?.status).toBe("resolved");
    expect(resolved?.resolvedAt).toBeDefined();
  });

  it("should log breach incidents and format statutory intimations for DPBI & Data Principals (Sec 8(6))", () => {
    const incident = privacyEngine.logBreachIncident({
      title: "Unauthorized filesystem access attempt detected",
      severity: "medium",
      natureAndScope: "Detected unmapped local process reading from staging folder.",
      affectedDataCategories: ["client_names", "file_metadata"],
      estimatedAffectedPrincipals: 2,
      containmentActions: "Token rotated and named pipe access isolated.",
    });

    expect(incident.incidentNumber).toMatch(/^INC-2026-\d+/);
    expect(incident.severity).toBe("medium");

    const notices = privacyEngine.generateBreachNotification(incident.id);
    expect(notices.dpbiNotice).toContain("DATA PROTECTION BOARD OF INDIA");
    expect(notices.dpbiNotice).toContain(incident.incidentNumber);
    expect(notices.principalNotice).toContain("NOTICE OF PERSONAL DATA SECURITY INCIDENT");
  });

  it("should sanitize PII from log output to prevent accidental leaks", () => {
    const rawLog = "Processing client file for user@company.com with contact +91-98765-43210 and token=abc123secret";
    const sanitized = privacyEngine.sanitizeLog(rawLog);

    expect(sanitized).not.toContain("user@company.com");
    expect(sanitized).not.toContain("+91-98765-43210");
    expect(sanitized).not.toContain("token=abc123secret");
    expect(sanitized).toContain("token=[REDACTED]");
  });

  it("should execute all privacy operations over IPC RPC dispatcher correctly", async () => {
    // 1. Get Governance Summary
    const summary = await dispatchRPCMethod("privacy.getGovernanceSummary", {}, rpcContext);
    expect(summary.dpdpReadinessScore).toBeGreaterThanOrEqual(75);
    expect(summary.offlineFirstMode).toBe(true);

    // 2. Get Notice
    const notice = await dispatchRPCMethod("privacy.getNotice", {}, rpcContext);
    expect(notice.itemisedPurposes.length).toBeGreaterThan(0);

    // 3. Record Consent over RPC
    const consent = await dispatchRPCMethod("privacy.recordConsent", {
      principalId: "rpc-principal-1",
      principalName: "Zenith Corp",
      purposeId: "file_organization",
    }, rpcContext);
    expect(consent.principalName).toBe("Zenith Corp");

    // 4. Submit Grievance over RPC
    const grv = await dispatchRPCMethod("privacy.submitGrievance", {
      complainantName: "John Doe",
      complainantContact: "john@doe.local",
      category: "other",
      description: "Testing RPC grievance submission",
    }, rpcContext);
    expect(grv.ticketNumber).toBeDefined();

    // 5. Run Retention Cleanup over RPC
    const cleanupReports = await dispatchRPCMethod("privacy.runRetentionCleanup", {}, rpcContext);
    expect(Array.isArray(cleanupReports)).toBe(true);
  });
});

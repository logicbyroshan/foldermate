export type FileStatus =
  | "detected"
  | "checking_lock"
  | "stable"
  | "analyzing"
  | "classifying"
  | "needs_review"
  | "queued_for_move"
  | "staging"
  | "verifying_hash"
  | "organized"
  | "archived"
  | "trashed"
  | "failed_rollback"
  | "ignored";

export type ReviewQueueStatus = "pending" | "resolved" | "ignored";

export type EventType =
  | "FILE_DETECTED"
  | "FILE_LOCK_WAITING"
  | "FILE_STABLE"
  | "FILE_ANALYSIS_STARTED"
  | "FILE_ANALYZED"
  | "CLASSIFICATION_COMPLETED"
  | "REVIEW_REQUIRED"
  | "ORGANIZATION_STARTED"
  | "FILE_STAGED"
  | "HASH_VERIFIED"
  | "FILE_ORGANIZED"
  | "VERSION_INCREMENTED"
  | "DUPLICATE_DETECTED"
  | "FILE_OPERATION_FAILED"
  | "FILE_RESTORED"
  | "COREL_CONNECTED"
  | "COREL_DISCONNECTED"
  | "COREL_OPERATION_COMPLETED"
  // DPDP Governance Audit Events
  | "CONSENT_GRANTED"
  | "CONSENT_WITHDRAWN"
  | "DSR_REQUEST_CREATED"
  | "DSR_REQUEST_COMPLETED"
  | "DSR_REQUEST_REJECTED"
  | "DATA_ERASURE_EXECUTED"
  | "PRIVACY_GRIEVANCE_FILED"
  | "PRIVACY_GRIEVANCE_RESOLVED"
  | "DATA_BREACH_LOGGED"
  | "RETENTION_CLEANUP_RUN";

export interface ClientDTO {
  id: string;
  name: string;
  code: string;
  aliases: string[];
  notes?: string | null;
  isActive: boolean;
  contactEmail?: string | null;
  contactPhone?: string | null;
  isChildData?: boolean;
  dataClassification?: "STANDARD" | "PII" | "RESTRICTED_CHILD_DATA";
  createdAt: string;
  updatedAt: string;
}

export interface ProjectDTO {
  id: string;
  clientId: string;
  name: string;
  code?: string | null;
  category?: string;
  year: number;
  status?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  description?: string | null;
  defaultNamingTemplateId?: string | null;
  defaultFolderTemplateId?: string | null;
  createdAt: string;
}

export interface FileRecordDTO {
  id: string;
  originalName: string;
  currentName: string;
  originalPath: string;
  currentPath: string;
  relativePath: string;
  extension: string;
  mimeType: string;
  sizeBytes: number;
  sha256Hash: string;
  clientId?: string | null;
  projectId?: string | null;
  categoryId?: string | null;
  year?: number | null;
  versionNumber: number;
  status: FileStatus;
  confidenceScore: number;
  sourceApp?: string | null;
  isArchived: boolean;
  isQuarantinedForErasure?: boolean;
  containsPii?: boolean;
  isChildData?: boolean;
  organizedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FileVersionDTO {
  id: string;
  fileId: string;
  versionNumber: number;
  parentVersionId?: string | null;
  filePath: string;
  sha256Hash: string;
  sizeBytes: number;
  changeSummary?: string | null;
  createdBy?: string;
  isApproved: boolean;
  isLatest: boolean;
  createdAt: string;
}

export interface FileRelationshipDTO {
  id: string;
  sourceFileId: string;
  targetFileId: string;
  relationshipType: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface ReviewQueueItemDTO {
  id: string;
  fileId?: string | null;
  originalPath: string;
  originalName: string;
  proposedClientId?: string | null;
  proposedClientName?: string | null;
  proposedProjectId?: string | null;
  proposedProjectName?: string | null;
  proposedYear?: number | null;
  proposedVersion: number;
  proposedTargetPath?: string | null;
  confidenceScore: number;
  reasons: string[];
  status: ReviewQueueStatus;
  createdAt: string;
  resolvedAt?: string | null;
}

export interface FileEventDTO {
  id: string;
  fileId?: string | null;
  eventType: EventType;
  oldState?: Record<string, unknown> | null;
  newState?: Record<string, unknown> | null;
  details?: string | null;
  durationMs?: number | null;
  errorMessage?: string | null;
  createdAt: string;
}

export interface SearchResultItemDTO {
  fileId: string;
  filename: string;
  originalFilename: string;
  clientName?: string;
  projectName?: string;
  categoryName?: string;
  year?: number;
  version: number;
  path: string;
  extension: string;
  sizeBytes: number;
  rank: number;
}

export type LicenseType = "COMMUNITY" | "SPONSOR" | "VIP" | "TRIAL";

export interface LicenseStatus {
  isActivated: boolean;
  licenseType: LicenseType;
  key?: string;
  activatedAt?: string;
  sponsorTier?: string;
  donorName?: string;
  features: {
    unlimitedOrganize: boolean;
    folderCustomization: boolean;
    versionLineage: boolean;
    corelDrawBridge: boolean;
    priorityUpdates: boolean;
  };
}

export interface CommunityTask {
  id: string;
  title: string;
  description: string;
  category: "github" | "blog" | "linkedin" | "x" | "community";
  actionUrl: string;
  actionLabel: string;
  isCompleted: boolean;
}

export interface ActivationPayload {
  key: string;
  licenseType?: LicenseType;
  donorName?: string;
}

// ----------------------------------------------------
// DPDP Act 2023 & DPDP Rules 2025 Data Governance DTOs
// ----------------------------------------------------

export type ConsentStatus = "granted" | "withdrawn" | "expired";

export interface ConsentRecordDTO {
  id: string;
  principalId: string;
  principalType: "client" | "contact" | "employee" | "visitor" | "parent_guardian";
  principalName: string;
  principalContact?: string | null;
  purposeId: string;
  purposeDescription: string;
  status: ConsentStatus;
  noticeVersion: string;
  lawfulBasis: "consent" | "legitimate_uses" | "contractual" | "legal_obligation";
  isChildData: boolean;
  parentalConsentVerified: boolean;
  parentGuardianIdentifier?: string | null;
  metadata?: Record<string, unknown>;
  grantedAt: string;
  withdrawnAt?: string | null;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ConsentPurposeDTO {
  id: string;
  title: string;
  description: string;
  category: "essential" | "organization" | "indexing" | "rewards" | "support";
  isMandatory: boolean;
  defaultStatus: ConsentStatus;
  applicableDataTypes: string[];
}

export type DSRType = "access" | "correction" | "erasure" | "grievance" | "nomination";
export type DSRStatus = "received" | "identity_verified" | "in_progress" | "completed" | "rejected";

export interface DataPrincipalRequestDTO {
  id: string;
  requestNumber: string;
  principalId: string;
  principalName: string;
  principalContact: string;
  requestType: DSRType;
  status: DSRStatus;
  details: string;
  correctionPayload?: Record<string, unknown>;
  nomineePayload?: Record<string, unknown>;
  resolutionSummary?: string | null;
  rejectionReason?: string | null;
  assignedTo: string;
  dueDate: string;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type GrievanceCategory =
  | "consent_violation"
  | "unauthorized_processing"
  | "delayed_dsr"
  | "child_data_concern"
  | "security_leak"
  | "other";

export type GrievanceStatus = "open" | "under_investigation" | "escalated" | "resolved" | "dismissed";

export interface PrivacyGrievanceDTO {
  id: string;
  ticketNumber: string;
  complainantName: string;
  complainantContact: string;
  category: GrievanceCategory;
  description: string;
  status: GrievanceStatus;
  grievanceOfficer: string;
  resolutionNotes?: string | null;
  slaDeadline: string; // 90 days statutory SLA under DPDP Rules 2025
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type BreachSeverity = "low" | "medium" | "high" | "critical";
export type BreachStatus = "detected" | "triaged" | "contained" | "remediated" | "closed";

export interface DataBreachIncidentDTO {
  id: string;
  incidentNumber: string;
  title: string;
  severity: BreachSeverity;
  natureAndScope: string;
  affectedDataCategories: string[];
  estimatedAffectedPrincipals: number;
  status: BreachStatus;
  containmentActions?: string | null;
  dpbiNotified: boolean;
  dpbiNotifiedAt?: string | null;
  principalsNotified: boolean;
  principalsNotifiedAt?: string | null;
  remediationNotes?: string | null;
  detectedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface RetentionPolicyDTO {
  id: string;
  name: string;
  category: "inbox_staging" | "review_queue" | "organized_files" | "file_versions" | "audit_logs" | "exports";
  retentionDays: number;
  action: "delete" | "archive" | "flag_for_review";
  justification: string;
  isActive: boolean;
  lastRunAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RetentionCleanupReportDTO {
  policyId: string;
  policyName: string;
  category: string;
  itemsProcessed: number;
  itemsPurged: number;
  bytesFreed: number;
  executedAt: string;
  durationMs: number;
}

export interface DataGovernanceSummaryDTO {
  dpdpReadinessScore: number; // 0 - 100
  totalDataPrincipals: number;
  activeConsentRecords: number;
  withdrawnConsentRecords: number;
  pendingDSRRequests: number;
  completedDSRRequests: number;
  openGrievances: number;
  slaBreachedGrievances: number;
  totalBreachIncidents: number;
  activeRetentionPolicies: number;
  childDataProtectedCount: number;
  piiMaskingActive: boolean;
  storageIsolationActive: boolean;
  offlineFirstMode: boolean;
}

export interface PrivacyNoticeDTO {
  version: string;
  effectiveDate: string;
  fiduciaryName: string;
  fiduciaryContact: string;
  grievanceOfficerName: string;
  grievanceOfficerEmail: string;
  grievanceOfficerPhone: string;
  itemisedPurposes: Array<{
    purposeId: string;
    purposeName: string;
    dataCollected: string[];
    lawfulBasis: string;
    retentionPeriod: string;
    isChildDataApplicable: boolean;
  }>;
  rightsSummary: string[];
  grievanceProcedure: string;
  consentWithdrawalInstructions: string;
}



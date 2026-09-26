import { z } from "zod";

export const ClientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Client name is required").max(120),
  code: z.string().min(1, "Client code is required").max(20),
  aliases: z.array(z.string()).default([]),
  notes: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  contactEmail: z.string().email().nullable().optional(),
  contactPhone: z.string().nullable().optional(),
  isChildData: z.boolean().default(false),
  dataClassification: z.enum(["STANDARD", "PII", "RESTRICTED_CHILD_DATA"]).default("STANDARD"),
});

export const ProjectSchema = z.object({
  id: z.string().uuid().optional(),
  clientId: z.string().uuid(),
  name: z.string().min(1, "Project name is required").max(120),
  code: z.string().max(30).nullable().optional(),
  category: z.string().default("General"),
  year: z.number().int().min(1900).max(2100),
  status: z.enum(["active", "completed", "archived"]).default("active"),
  metadata: z.record(z.unknown()).default({}),
});

export const FileRecordSchema = z.object({
  id: z.string().uuid().optional(),
  originalName: z.string().min(1),
  currentName: z.string().min(1),
  originalPath: z.string().min(1),
  currentPath: z.string().min(1),
  relativePath: z.string().min(1),
  extension: z.string().min(1),
  mimeType: z.string().min(1),
  sizeBytes: z.number().int().nonnegative(),
  sha256Hash: z.string().length(64),
  clientId: z.string().uuid().nullable().optional(),
  projectId: z.string().uuid().nullable().optional(),
  categoryId: z.string().uuid().nullable().optional(),
  year: z.number().int().nullable().optional(),
  versionNumber: z.number().int().positive().default(1),
  status: z.string().default("organized"),
  confidenceScore: z.number().min(0.0).max(1.0).default(1.0),
  sourceApp: z.string().nullable().optional(),
  isArchived: z.boolean().default(false),
  isQuarantinedForErasure: z.boolean().default(false),
  containsPii: z.boolean().default(false),
  isChildData: z.boolean().default(false),
  organizedAt: z.string().nullable().optional(),
});

export const ResolveReviewItemSchema = z.object({
  reviewQueueId: z.string().uuid(),
  clientId: z.string().uuid(),
  projectId: z.string().uuid(),
  year: z.number().int().min(1900).max(2100),
  versionNumber: z.number().int().positive().default(1),
  learnAlias: z.boolean().default(true),
  customName: z.string().optional(),
});

// DPDP Zod Validation Schemas
export const RecordConsentSchema = z.object({
  principalId: z.string().min(1),
  principalType: z.enum(["client", "contact", "employee", "visitor", "parent_guardian"]).default("client"),
  principalName: z.string().min(1),
  principalContact: z.string().optional(),
  purposeId: z.string().min(1),
  purposeDescription: z.string().min(1),
  noticeVersion: z.string().default("v1.0"),
  lawfulBasis: z.enum(["consent", "legitimate_uses", "contractual", "legal_obligation"]).default("consent"),
  isChildData: z.boolean().default(false),
  parentalConsentVerified: z.boolean().default(false),
  parentGuardianIdentifier: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
  expiresAt: z.string().optional(),
});

export const CreateDSRRequestSchema = z.object({
  principalId: z.string().min(1),
  principalName: z.string().min(1),
  principalContact: z.string().min(1),
  requestType: z.enum(["access", "correction", "erasure", "grievance", "nomination"]),
  details: z.string().min(1),
  correctionPayload: z.record(z.unknown()).optional(),
  nomineePayload: z.record(z.unknown()).optional(),
});

export const CreateGrievanceSchema = z.object({
  complainantName: z.string().min(1),
  complainantContact: z.string().min(1),
  category: z.enum(["consent_violation", "unauthorized_processing", "delayed_dsr", "child_data_concern", "security_leak", "other"]),
  description: z.string().min(1),
  grievanceOfficer: z.string().optional(),
});

export const CreateBreachIncidentSchema = z.object({
  title: z.string().min(1),
  severity: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  natureAndScope: z.string().min(1),
  affectedDataCategories: z.array(z.string()).default([]),
  estimatedAffectedPrincipals: z.number().int().nonnegative().default(0),
  containmentActions: z.string().optional(),
});

export const CreateRetentionPolicySchema = z.object({
  name: z.string().min(1),
  category: z.enum(["inbox_staging", "review_queue", "organized_files", "file_versions", "audit_logs", "exports"]),
  retentionDays: z.number().int().positive(),
  action: z.enum(["delete", "archive", "flag_for_review"]).default("delete"),
  justification: z.string().min(1),
  isActive: z.boolean().default(true),
});


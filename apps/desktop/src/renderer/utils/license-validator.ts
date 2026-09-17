import { LicenseType, CommunityTask } from "@foldermate/shared";

/**
 * Offline License Validator & Cryptographic Key Generator for FolderMate
 * Offline-first design with checksum verification.
 */

// Simple robust checksum calculation for offline verification
function computeSegmentChecksum(str: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }
  return hash.toString(16).toUpperCase().padStart(4, "0").slice(-4);
}

/**
 * Generates a valid unique Community License Key
 */
export function generateCommunityKey(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let part1 = "";
  let part2 = "";
  for (let i = 0; i < 4; i++) {
    part1 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  for (let i = 0; i < 4; i++) {
    part2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const check = computeSegmentChecksum(`COMMUNITY-${part1}-${part2}`);
  return `FM-COMMUNITY-${part1}-${part2}-${check}`;
}

/**
 * Generates a valid Sponsor Universal Key
 */
export function generateSponsorKey(tier: "SPONSOR" | "VIP" = "SPONSOR"): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let part1 = "";
  let part2 = "";
  for (let i = 0; i < 4; i++) {
    part1 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  for (let i = 0; i < 4; i++) {
    part2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const check = computeSegmentChecksum(`${tier}-${part1}-${part2}`);
  return `FM-${tier}-${part1}-${part2}-${check}`;
}

export interface ValidationResult {
  isValid: boolean;
  type: LicenseType;
  tier?: string;
  error?: string;
}

/**
 * Validates any FolderMate key (Community, Sponsor, VIP, or Universal Lifetime Keys)
 */
export function validateLicenseKey(rawKey: string): ValidationResult {
  if (!rawKey) {
    return { isValid: false, type: "TRIAL", error: "Key cannot be empty" };
  }

  const normalized = rawKey.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "");

  // Universal Golden / Master sponsor keys for dev / supporters
  if (
    normalized === "FM-SPONSOR-GOLD-LIFETIME-VIP" ||
    normalized === "FM-SUPERCHAT-HERO-UNLIMITED" ||
    normalized === "FM-PATRON-SUPPORTER-PERMANENT"
  ) {
    return {
      isValid: true,
      type: "VIP",
      tier: "Universal Lifetime Hero",
    };
  }

  const parts = normalized.split("-");

  if (parts.length < 4 || parts[0] !== "FM") {
    return {
      isValid: false,
      type: "TRIAL",
      error: "Invalid license format. Expected format: FM-COMMUNITY-XXXX-XXXX-XXXX or FM-SPONSOR-XXXX-XXXX-XXXX",
    };
  }

  const kind = parts[1]; // COMMUNITY, SPONSOR, or VIP

  if (kind === "COMMUNITY") {
    if (parts.length !== 5) {
      return { isValid: false, type: "TRIAL", error: "Invalid community key length" };
    }
    const part1 = parts[2];
    const part2 = parts[3];
    const check = parts[4];
    const expectedCheck = computeSegmentChecksum(`COMMUNITY-${part1}-${part2}`);
    if (check !== expectedCheck) {
      return { isValid: false, type: "TRIAL", error: "Invalid community license checksum" };
    }
    return { isValid: true, type: "COMMUNITY", tier: "Community Single-Device" };
  }

  if (kind === "SPONSOR" || kind === "VIP") {
    if (parts.length !== 5) {
      return { isValid: false, type: "TRIAL", error: "Invalid sponsor key length" };
    }
    const part1 = parts[2];
    const part2 = parts[3];
    const check = parts[4];
    const expectedCheck = computeSegmentChecksum(`${kind}-${part1}-${part2}`);
    if (check !== expectedCheck) {
      return { isValid: false, type: "TRIAL", error: "Invalid sponsor license checksum" };
    }
    return {
      isValid: true,
      type: kind as LicenseType,
      tier: kind === "VIP" ? "Lifetime VIP Patron" : "Universal Project Sponsor",
    };
  }

  return { isValid: false, type: "TRIAL", error: "Unrecognized license type" };
}

/**
 * Available Community Tasks for free activation
 */
export const DEFAULT_COMMUNITY_TASKS: CommunityTask[] = [
  {
    id: "task-star",
    title: "Star the GitHub Repository",
    description: "Give a star to FolderMate on GitHub to support open-source development and help others discover it.",
    category: "github",
    actionUrl: "https://github.com/FolderMate/FolderMate",
    actionLabel: "Star on GitHub ★",
    isCompleted: false,
  },
  {
    id: "task-blog",
    title: "Read Blog & Leave a Comment",
    description: "Read our announcement blog post and drop a friendly comment or feedback about your workflow.",
    category: "blog",
    actionUrl: "https://blog.foldermate.io/announcing-foldermate-windows",
    actionLabel: "Read & Comment 📝",
    isCompleted: false,
  },
  {
    id: "task-gh-follow",
    title: "Follow the Creator on GitHub",
    description: "Follow the creator on GitHub to stay updated with future releases, updates, and open tools.",
    category: "github",
    actionUrl: "https://github.com/roshan",
    actionLabel: "Follow GitHub 👤",
    isCompleted: false,
  },
  {
    id: "task-linkedin",
    title: "LinkedIn Post & Follow (No GitHub Required)",
    description: "If you don't have GitHub, follow our LinkedIn page and like or comment on the launch post.",
    category: "linkedin",
    actionUrl: "https://www.linkedin.com/company/foldermate",
    actionLabel: "Engage on LinkedIn 💼",
    isCompleted: false,
  },
  {
    id: "task-x",
    title: "Follow & Retweet on X / Twitter",
    description: "Follow @foldermate_app on X and like or retweet the release announcement.",
    category: "x",
    actionUrl: "https://x.com/foldermate_app",
    actionLabel: "Engage on X 🐦",
    isCompleted: false,
  },
  {
    id: "task-share",
    title: "Share with Design Team / Community",
    description: "Share the FolderMate download link with your design team or print studio community.",
    category: "community",
    actionUrl: "https://foldermate.io",
    actionLabel: "Share Website 🚀",
    isCompleted: false,
  },
];

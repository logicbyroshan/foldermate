import path from "path";
import { sanitizeWindowsFilename, sanitizeFolderPath } from "./sanitizer.js";

export interface TemplateContext {
  clientName?: string | null;
  clientCode?: string | null;
  projectName?: string | null;
  projectCode?: string | null;
  categoryName?: string | null;
  year?: number | null;
  month?: number | null;
  date?: number | null;
  versionNumber?: number | null;
  originalName?: string | null;
  extension?: string | null;
}

export const FILE_TYPE_FOLDER_NAMES: Record<string, string> = {
  cdr: "CDR - CorelDRAW Designs",
  psd: "PSD - Photoshop Documents",
  ai: "AI - Illustrator Artwork",
  indd: "INDD - InDesign Layouts",
  eps: "EPS - Vector Graphics",
  pdf: "PDF - Deliverables",
  png: "Images & Assets",
  jpg: "Images & Assets",
  jpeg: "Images & Assets",
  webp: "Images & Assets",
  svg: "Images & Assets",
  xlsx: "Spreadsheets & Data",
  xls: "Spreadsheets & Data",
  csv: "Spreadsheets & Data",
  docx: "Word Documents",
  doc: "Word Documents",
  zip: "Archives & Packages",
  rar: "Archives & Packages",
  "7z": "Archives & Packages",
};

export function getFileTypeFolderName(extension?: string | null): string {
  const cleanExt = (extension || "").toLowerCase().replace(".", "");
  return FILE_TYPE_FOLDER_NAMES[cleanExt] || "Other Files";
}

export function canonicalizeFilename(
  rawName: string,
  knownClients?: { name: string; code?: string; aliases?: string[] }[]
): string {
  const trimmed = rawName.trim();
  const ext = trimmed.includes(".") ? trimmed.split(".").pop()!.toLowerCase() : "cdr";
  const base = trimmed.includes(".") ? trimmed.slice(0, trimmed.lastIndexOf(".")) : trimmed;
  const lower = base.toLowerCase();

  // 1. Detect Client
  let matchedClientName = "General";
  if (knownClients && knownClients.length > 0) {
    const found = knownClients.find(
      (c) =>
        lower.includes(c.name.toLowerCase()) ||
        (c.code && lower.includes(c.code.toLowerCase())) ||
        (c.aliases && c.aliases.some((a) => lower.includes(a.toLowerCase())))
    );
    if (found) {
      matchedClientName = found.name;
    }
  }

  // 2. Detect Year
  const yearMatch = base.match(/\b(202[0-9]|203[0-9]|201[0-9])\b/);
  const year = yearMatch ? Number(yearMatch[1]) : new Date().getFullYear();

  // 3. Detect Version
  const versionMatch = base.match(/\bv(?:er(?:sion)?)?[\s_-]?([0-9]+)\b/i);
  const version = versionMatch ? Number(versionMatch[1]) : 1;

  // 4. Detect Category / Project
  let project = "Project Deliverable";
  if (/\b(id|badge|card)\b/i.test(lower)) {
    project = "Student ID Card";
  } else if (/\b(sign|signage|board|banner)\b/i.test(lower)) {
    project = "Signage & Display";
  } else if (/\b(brochure|catalog|magazine|mag|booklet)\b/i.test(lower)) {
    project = "Annual Brochure";
  } else if (/\b(logo|branding|identity)\b/i.test(lower)) {
    project = "Brand Identity";
  } else if (/\b(report|financial|statement)\b/i.test(lower)) {
    project = "Annual Report";
  } else {
    const cleaned = base
      .replace(/\b(202[0-9]|203[0-9]|201[0-9])\b/g, "")
      .replace(/\bv(?:er(?:sion)?)?[\s_-]?[0-9]+\b/gi, "")
      .replace(/\b(final|draft|ok|new|copy|print|v\d+)\b/gi, "")
      .replace(/[\-_.]+/g, " ")
      .trim();
    if (cleaned.length > 2) {
      project = cleaned
        .split(" ")
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
    }
  }

  return `${matchedClientName} ${project} ${year} v${version}.${ext}`;
}

export class TemplateEngine {
  /**
   * Expands a filename template with context values and applies Windows filename sanitization.
   */
  public renderFilename(templateString: string, context: TemplateContext): string {
    const tokens = this.extractTokens(context);
    let result = templateString;

    for (const [key, value] of Object.entries(tokens)) {
      const regex = new RegExp(`\\{${key}\\}`, "gi");
      result = result.replace(regex, value);
    }

    // Clean up any double spaces or orphan separators
    result = result.replace(/\s+/g, " ").trim();

    // Ensure extension is preserved/appended
    const ext = context.extension ? (context.extension.startsWith(".") ? context.extension : `.${context.extension}`) : "";
    let baseName = result;

    if (ext && baseName.toLowerCase().endsWith(ext.toLowerCase())) {
      baseName = baseName.slice(0, -ext.length);
    }

    const sanitizedBase = sanitizeWindowsFilename(baseName);
    return `${sanitizedBase}${ext}`;
  }

  /**
   * Expands a folder hierarchy template with context values and applies safe folder path sanitization.
   */
  public renderFolderPath(templateString: string, context: TemplateContext): string {
    const tokens = this.extractTokens(context);
    let result = templateString;

    for (const [key, value] of Object.entries(tokens)) {
      const regex = new RegExp(`\\{${key}\\}`, "gi");
      result = result.replace(regex, value);
    }

    return sanitizeFolderPath(result);
  }

  private extractTokens(ctx: TemplateContext): Record<string, string> {
    const now = new Date();
    const year = ctx.year ?? now.getFullYear();
    const month = ctx.month ?? (now.getMonth() + 1);
    const date = ctx.date ?? now.getDate();
    const version = ctx.versionNumber ?? 1;

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const fileType = getFileTypeFolderName(ctx.extension);
    const cleanExt = (ctx.extension || "").toLowerCase().replace(".", "");

    return {
      Client: ctx.clientName || "General",
      ClientCode: ctx.clientCode || (ctx.clientName ? ctx.clientName.replace(/\s+/g, "").toUpperCase().slice(0, 6) : "GEN"),
      Project: ctx.projectName || "Default",
      ProjectCode: ctx.projectCode || "PRJ",
      Category: ctx.categoryName || "General",
      FileType: fileType,
      Format: cleanExt.toUpperCase(),
      Year: String(year),
      Month: String(month).padStart(2, "0"),
      MonthName: monthNames[month - 1] || "Jan",
      Date: String(date).padStart(2, "0"),
      Version: String(version),
      VersionPadded: String(version).padStart(2, "0"),
      OriginalName: ctx.originalName ? path.parse(ctx.originalName).name : "file",
      Extension: ctx.extension || "",
    };
  }
}

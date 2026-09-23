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

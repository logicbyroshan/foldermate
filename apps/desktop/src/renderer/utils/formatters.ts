/**
 * Reusable Formatting Utilities
 * Provides standardized file size, date, and extension color formatting.
 */

export function formatFileSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return "18.5 MB";
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

export function getExtBadgeColors(ext: string): { extColor: string; extBg: string } {
  const e = (ext || "").toLowerCase().replace(".", "");
  switch (e) {
    case "cdr":
      return { extColor: "#f59e0b", extBg: "rgba(245, 158, 11, 0.15)" };
    case "pdf":
      return { extColor: "#ef4444", extBg: "rgba(239, 68, 68, 0.15)" };
    case "ai":
      return { extColor: "#f97316", extBg: "rgba(249, 115, 22, 0.15)" };
    case "psd":
      return { extColor: "#3b82f6", extBg: "rgba(59, 130, 246, 0.15)" };
    case "xlsx":
    case "xls":
    case "csv":
      return { extColor: "#10b981", extBg: "rgba(16, 185, 129, 0.15)" };
    case "png":
    case "jpg":
    case "jpeg":
    case "webp":
      return { extColor: "#06b6d4", extBg: "rgba(6, 182, 212, 0.15)" };
    case "docx":
    case "doc":
      return { extColor: "#2563eb", extBg: "rgba(37, 99, 235, 0.15)" };
    case "zip":
    case "rar":
    case "7z":
      return { extColor: "#eab308", extBg: "rgba(234, 179, 8, 0.15)" };
    default:
      return { extColor: "#8b5cf6", extBg: "rgba(139, 92, 246, 0.15)" };
  }
}

export function formatRelativeDate(dateInput?: string | Date): string {
  if (!dateInput) return "Today, 12:45 PM";
  try {
    const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return "Today, 12:45 PM";
    const now = new Date();
    const isToday =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();
    if (isToday) {
      return `Today, ${d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
    }
    return d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "Today, 12:45 PM";
  }
}

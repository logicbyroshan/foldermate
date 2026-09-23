import React from "react";
import {
  Star,
  User,
  Briefcase,
  Layers,
  Tag,
  Heart,
  Shield,
  Lock,
  Code,
  Image as ImageIcon,
  Music,
  Palette,
  Check,
  Sparkles,
  FileText,
  Archive,
  HardDrive,
  Database,
  Cloud,
  Server,
  Zap,
} from "lucide-react";

export type FolderEmblem =
  | "none"
  | "star"
  | "client"
  | "briefcase"
  | "project"
  | "tag"
  | "heart"
  | "shield"
  | "lock"
  | "code"
  | "image"
  | "music"
  | "palette"
  | "check"
  | "sparkles"
  | "archive"
  | "document";

export interface FolderVisualIconProps {
  color?: string;
  emblem?: FolderEmblem | string;
  size?: number | "sm" | "md" | "lg" | "xl";
  className?: string;
  style?: React.CSSProperties;
  isOpen?: boolean;
}

export const EMBLEM_ICON_MAP: Record<string, React.ComponentType<{ size?: number | string; color?: string }>> = {
  star: Star,
  client: User,
  briefcase: Briefcase,
  project: Layers,
  tag: Tag,
  heart: Heart,
  shield: Shield,
  lock: Lock,
  code: Code,
  image: ImageIcon,
  music: Music,
  palette: Palette,
  check: Check,
  sparkles: Sparkles,
  archive: Archive,
  document: FileText,
};

export const FolderVisualIcon: React.FC<FolderVisualIconProps> = ({
  color = "#f59e0b",
  emblem = "none",
  size = "md",
  className = "",
  style,
  isOpen = false,
}) => {
  let pixelSize = 22;
  if (typeof size === "number") {
    pixelSize = size;
  } else {
    switch (size) {
      case "sm": pixelSize = 16; break;
      case "md": pixelSize = 22; break;
      case "lg": pixelSize = 48; break;
      case "xl": pixelSize = 64; break;
    }
  }

  const EmblemComponent = emblem && emblem !== "none" ? EMBLEM_ICON_MAP[emblem] : null;
  const emblemSize = Math.max(10, Math.round(pixelSize * 0.38));

  const folderGradId = `folder-grad-${color.replace(/[^a-zA-Z0-9]/g, "")}-${pixelSize}`;

  return (
    <div
      className={`folder-visual-wrap ${className}`}
      style={{
        position: "relative",
        width: pixelSize,
        height: pixelSize,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        ...style,
      }}
    >
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={folderGradId} x1="3" y1="5" x2="29" y2="27" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color} stopOpacity="0.82" />
          </linearGradient>
        </defs>
        {/* Back flap */}
        <path
          d="M3 6.5C3 5.67157 3.67157 5 4.5 5H12L15 7.5H27.5C28.3284 7.5 29 8.17157 29 9V25C29 25.8284 28.3284 26.5 27.5 26.5H4.5C3.67157 26.5 3 25.8284 3 25V6.5Z"
          fill={`url(#${folderGradId})`}
          stroke="#000000"
          strokeOpacity="0.08"
          strokeWidth="0.8"
        />
        {/* Inner white paper sheet */}
        <path
          d="M6 8.5H26V12.5H6V8.5Z"
          fill="#ffffff"
          opacity="0.95"
        />
        {/* Front flap (Windows 11 Fluent 3D angle with top highlight) */}
        {isOpen ? (
          <path
            d="M2 12.5C2 11.6716 2.67157 11 3.5 11H28.5C29.3284 11 30 11.6716 30 12.5L28 26.5H4L2 12.5Z"
            fill={color}
            stroke="#ffffff"
            strokeWidth="0.8"
            strokeOpacity="0.4"
          />
        ) : (
          <path
            d="M3 10C3 9.17157 3.67157 8.5 4.5 8.5H27.5C28.3284 8.5 29 9.17157 29 10V25C29 25.8284 28.3284 26.5 27.5 26.5H4.5C3.67157 26.5 3 25.8284 3 25V10Z"
            fill={color}
            stroke="#000000"
            strokeOpacity="0.08"
            strokeWidth="0.8"
          />
        )}
      </svg>

      {/* Emblem Overlay */}
      {EmblemComponent && (
        <div
          style={{
            position: "absolute",
            bottom: pixelSize >= 32 ? "14%" : "10%",
            right: pixelSize >= 32 ? "12%" : "6%",
            backgroundColor: "#ffffff",
            borderRadius: "50%",
            padding: pixelSize >= 32 ? 2.5 : 1,
            boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <EmblemComponent size={emblemSize} color={color} />
        </div>
      )}
    </div>
  );
};

export type DriveEmblem =
  | "hard-drive"
  | "database"
  | "server"
  | "cloud"
  | "shield"
  | "star"
  | "lock"
  | "zap";

export const DRIVE_EMBLEM_MAP: Record<string, React.ComponentType<{ size?: number | string; color?: string }>> = {
  "hard-drive": HardDrive,
  database: Database,
  server: Server,
  cloud: Cloud,
  shield: Shield,
  star: Star,
  lock: Lock,
  zap: Zap,
};

export interface DriveVisualIconProps {
  color?: string;
  emblem?: DriveEmblem | string;
  size?: number | "sm" | "md" | "lg";
  className?: string;
  style?: React.CSSProperties;
}

export const DriveVisualIcon: React.FC<DriveVisualIconProps> = ({
  color = "#f59e0b",
  emblem = "hard-drive",
  size = "md",
  className = "",
  style,
}) => {
  let pixelSize = 22;
  if (typeof size === "number") {
    pixelSize = size;
  } else {
    switch (size) {
      case "sm": pixelSize = 16; break;
      case "md": pixelSize = 22; break;
      case "lg": pixelSize = 44; break;
    }
  }

  const EmblemComponent = DRIVE_EMBLEM_MAP[emblem] || HardDrive;

  return (
    <div
      className={`drive-visual-wrap ${className}`}
      style={{
        position: "relative",
        width: pixelSize,
        height: pixelSize,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "var(--radius-sm)",
        backgroundColor: `${color}18`,
        border: `1px solid ${color}40`,
        color: color,
        flexShrink: 0,
        ...style,
      }}
    >
      <EmblemComponent size={Math.round(pixelSize * 0.65)} color={color} />
    </div>
  );
};

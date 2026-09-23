import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "amber" | "success" | "warning" | "danger" | "info" | "neutral" | "emerald" | "zinc";
  size?: "sm" | "md";
  dot?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  dot = false,
  style,
  className = "",
}) => {
  const variantStyles: Record<string, { bg: string; text: string; border: string; dotColor?: string }> = {
    default: {
      bg: "var(--bg-elevated)",
      text: "var(--text-secondary)",
      border: "var(--border-subtle)",
      dotColor: "var(--text-muted)",
    },
    zinc: {
      bg: "#f1f5f9",
      text: "#334155",
      border: "#cbd5e1",
      dotColor: "#64748b",
    },
    emerald: {
      bg: "var(--status-success-bg)",
      text: "var(--status-success-text)",
      border: "rgba(22, 163, 74, 0.3)",
      dotColor: "var(--status-success)",
    },
    amber: {
      bg: "var(--accent-amber-subtle)",
      text: "var(--accent-amber-text)",
      border: "rgba(217, 119, 6, 0.3)",
      dotColor: "var(--accent-amber)",
    },
    success: {
      bg: "var(--status-success-bg)",
      text: "var(--status-success-text)",
      border: "rgba(22, 163, 74, 0.3)",
      dotColor: "var(--status-success)",
    },
    warning: {
      bg: "var(--status-warning-bg)",
      text: "var(--status-warning-text)",
      border: "rgba(217, 119, 6, 0.3)",
      dotColor: "var(--status-warning)",
    },
    danger: {
      bg: "var(--status-danger-bg)",
      text: "var(--status-danger-text)",
      border: "rgba(220, 38, 38, 0.3)",
      dotColor: "var(--status-danger)",
    },
    info: {
      bg: "var(--status-info-bg)",
      text: "var(--status-info-text)",
      border: "rgba(2, 132, 199, 0.3)",
      dotColor: "var(--status-info)",
    },
    neutral: {
      bg: "#f8fafc",
      text: "#475569",
      border: "#e2e8f0",
      dotColor: "#64748b",
    },
  };

  const v = variantStyles[variant] || variantStyles.default;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: size === "sm" ? "2px 6px" : "3px 8px",
        fontSize: size === "sm" ? 10 : 11,
        fontWeight: 600,
        borderRadius: "var(--radius-md)",
        backgroundColor: v.bg,
        color: v.text,
        border: `1px solid ${v.border}`,
        lineHeight: 1.2,
        whiteSpace: "nowrap",
        letterSpacing: "0.01em",
        ...style,
      }}
      className={`foldermate-badge ${className}`}
    >
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: v.dotColor,
          }}
        />
      )}
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: string; style?: React.CSSProperties }> = ({ status, style }) => {
  const norm = status.toLowerCase();
  let variant: BadgeProps["variant"] = "default";

  if (["organized", "active", "resolved", "completed", "approved"].includes(norm)) {
    variant = "success";
  } else if (["pending", "review", "needs_review", "checking_lock"].includes(norm)) {
    variant = "amber";
  } else if (["archived", "ignored", "inactive"].includes(norm)) {
    variant = "neutral";
  } else if (["failed", "error", "corrupted"].includes(norm)) {
    variant = "danger";
  }

  return (
    <Badge variant={variant} dot style={style}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
};

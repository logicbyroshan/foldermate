import React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "amber";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "secondary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  className = "",
  disabled,
  style,
  ...props
}) => {
  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { height: 30, padding: "0 10px", fontSize: 12, borderRadius: "var(--radius-sm)", gap: 6 },
    md: { height: 34, padding: "0 12px", fontSize: 13, borderRadius: "var(--radius-md)", gap: 8 },
    lg: { height: 40, padding: "0 16px", fontSize: 14, borderRadius: "var(--radius-md)", gap: 8 },
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: "var(--brand-primary, #d97706)",
      color: "#ffffff",
      fontWeight: 600,
      border: "1px solid var(--brand-primary-strong, #b45309)",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.08)",
    },
    amber: {
      backgroundColor: "var(--accent-amber-subtle, #fef3c7)",
      color: "var(--accent-amber-text, #92400e)",
      fontWeight: 600,
      border: "1px solid rgba(217, 119, 6, 0.3)",
    },
    secondary: {
      backgroundColor: "var(--bg-elevated, #ffffff)",
      color: "var(--text-primary, #0f172a)",
      fontWeight: 500,
      border: "1px solid var(--border-medium, #cbd5e1)",
    },
    ghost: {
      backgroundColor: "transparent",
      color: "var(--text-secondary, #334155)",
      fontWeight: 500,
      border: "1px solid transparent",
    },
    danger: {
      backgroundColor: "var(--status-danger-bg, #fee2e2)",
      color: "var(--status-danger-text, #b91c1c)",
      fontWeight: 600,
      border: "1px solid rgba(220, 38, 38, 0.28)",
    },
  };

  return (
    <button
      type={props.type || "button"}
      disabled={disabled || isLoading}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled || isLoading ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "background-color 0.15s ease, border-color 0.15s ease, transform 0.15s ease",
        outline: "none",
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
      className={`foldermate-btn ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 size={size === "sm" ? 14 : 16} className="animate-spin" />
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
};

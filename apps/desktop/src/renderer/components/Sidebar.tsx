import React from "react";
import {
  LayoutDashboard,
  Search,
  Inbox,
  Users,
  Sliders,
  Settings,
  FolderSync,
  FolderTree,
} from "lucide-react";
import { Badge } from "./ui/Badge.js";
import { LicenseStatus } from "@foldermate/shared";
import { Star, Heart, Key, ShieldCheck } from "lucide-react";

export type NavView = "dashboard" | "search" | "review" | "clients" | "rules" | "settings";

interface SidebarProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  pendingReviewCount: number;
  engineConnected: boolean;
  licenseStatus?: LicenseStatus | null;
  onOpenActivation?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  pendingReviewCount,
  engineConnected,
  licenseStatus,
  onOpenActivation,
}) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "search", label: "Search Files", icon: Search },
    { id: "review", label: "Review Queue", icon: Inbox, badge: pendingReviewCount },
    { id: "clients", label: "Client Folders", icon: FolderTree },
    { id: "rules", label: "Rules & Folders", icon: Sliders },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside
      style={{
        width: "clamp(160px, 18vw, 200px)",
        minWidth: 160,
        height: "100vh",
        backgroundColor: "var(--bg-surface)",
        borderRight: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "12px 8px 10px",
        position: "relative",
      }}
    >
      <div>
        {/* Brand Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "2px 4px 14px 4px" }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 0,
              background: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "visible",
              boxShadow: "none",
            }}
          >
            <img
              src="/logo.png?v=2"
              alt="FolderMate logo"
              style={{
                width: 34,
                height: 34,
                display: "block",
                objectFit: "contain",
              }}
            />
          </div>
          <div>
            <h1 style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.2px", color: "var(--text-primary)" }}>
              FolderMate
            </h1>
            <p style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500 }}>
              Background Organizer
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id as NavView)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "7px 9px",
                  borderRadius: "var(--radius-sm)",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: isActive ? "rgba(247,199,29,0.10)" : "transparent",
                  color: isActive ? "var(--accent-amber-text)" : "var(--text-secondary)",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 13,
                  transition: "all 0.14s cubic-bezier(0.16, 1, 0.3, 1)",
                  textAlign: "left",
                  outline: "none",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "var(--bg-hover)";
                  if (!isActive) e.currentTarget.style.color = "var(--text-primary)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                  if (!isActive) e.currentTarget.style.color = "var(--text-secondary)";
                }}
              >
                {/* Active left accent bar */}
                {isActive && (
                  <div style={{
                    position: "absolute", left: 0, top: "20%", bottom: "20%",
                    width: 2, borderRadius: 2,
                    background: "linear-gradient(180deg, var(--brand-primary), var(--brand-secondary))",
                  }} />
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Icon size={17} color={isActive ? "var(--accent-amber)" : "currentColor"} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <Badge variant="amber" size="sm">
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Area: License & Engine Daemon Status */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {/* License Status Badge */}
        <div
          onClick={onOpenActivation}
          className="glass-panel"
          style={{
            padding: "6px 8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            backgroundColor: licenseStatus?.isActivated
              ? licenseStatus.licenseType === "VIP" || licenseStatus.licenseType === "SPONSOR"
                ? "rgba(247, 199, 29, 0.08)"
                : "rgba(16, 185, 129, 0.06)"
              : "rgba(239, 68, 68, 0.08)",
            border: `1px solid ${
              licenseStatus?.isActivated
                ? licenseStatus.licenseType === "VIP" || licenseStatus.licenseType === "SPONSOR"
                  ? "var(--border-focus)"
                  : "rgba(16, 185, 129, 0.25)"
                : "rgba(239, 68, 68, 0.3)"
            }`,
            borderRadius: "var(--radius-sm)",
            transition: "all 0.12s ease",
          }}
          title={licenseStatus?.isActivated ? "Click to view license details" : "Click to activate FolderMate"}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {licenseStatus?.isActivated ? (
              licenseStatus.licenseType === "VIP" ? (
                <Star size={13} color="var(--accent-amber)" fill="var(--accent-amber)" />
              ) : licenseStatus.licenseType === "SPONSOR" ? (
                <Heart size={13} color="#f43f5e" fill="#f43f5e" />
              ) : (
                <ShieldCheck size={13} color="var(--status-success)" />
              )
            ) : (
              <Key size={13} color="var(--status-danger)" />
            )}
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: licenseStatus?.isActivated
                  ? licenseStatus.licenseType === "VIP" || licenseStatus.licenseType === "SPONSOR"
                    ? "var(--accent-amber-text)"
                    : "var(--status-success-text)"
                  : "var(--status-danger-text)",
              }}
            >
              {licenseStatus?.isActivated
                ? licenseStatus.licenseType === "VIP"
                  ? "VIP Patron"
                  : licenseStatus.licenseType === "SPONSOR"
                  ? "Project Sponsor"
                  : "Community Key"
                : "Activate License"}
            </span>
          </div>

          <span style={{ fontSize: 9, color: "var(--text-muted)", fontWeight: 500 }}>
            {licenseStatus?.isActivated ? "Active" : "Locked"}
          </span>
        </div>

        {/* Engine Daemon Status */}
        <div
          className="glass-panel"
          style={{
            padding: "7px 9px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            backgroundColor: "var(--bg-elevated)",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: engineConnected ? "var(--status-success)" : "var(--status-danger)",
              boxShadow: engineConnected ? "0 0 8px var(--status-success)" : "0 0 8px var(--status-danger)",
            }}
          />
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-primary)" }}>
              {engineConnected ? "Daemon Active" : "Daemon Offline"}
            </div>
            <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
              Win32 Named Pipe
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

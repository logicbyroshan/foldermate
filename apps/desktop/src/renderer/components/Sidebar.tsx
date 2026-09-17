import React from "react";
import {
  Home,
  FolderTree,
  Search,
  Inbox,
  Users,
  Sliders,
  Settings,
  Activity,
  Keyboard,
  HardDrive,
  Star,
  Heart,
  Key,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "./ui/Badge.js";
import { LicenseStatus } from "@foldermate/shared";

export type NavView =
  | "home"
  | "explorer"
  | "clients"
  | "search"
  | "review"
  | "automation"
  | "shortcuts"
  | "rules"
  | "settings"
  | "dashboard";

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
  const sections = [
    {
      title: "EXPLORER",
      items: [
        { id: "home", label: "Home", icon: Home },
        { id: "explorer", label: "Files & Folders", icon: HardDrive },
        { id: "clients", label: "Client Directories", icon: FolderTree },
        { id: "search", label: "Search Files", icon: Search },
      ],
    },
    {
      title: "AUTOMATION & SAFETY",
      items: [
        { id: "review", label: "Review Queue", icon: Inbox, badge: pendingReviewCount },
        { id: "automation", label: "Background Daemon", icon: Activity },
        { id: "rules", label: "Folder Customizer", icon: Sliders },
      ],
    },
    {
      title: "SYSTEM",
      items: [
        { id: "shortcuts", label: "Keyboard Shortcuts", icon: Keyboard },
        { id: "settings", label: "Settings", icon: Settings },
      ],
    },
  ];

  return (
    <aside className="explorer-sidebar">
      <div>
        {/* Brand Header */}
        <div className="sidebar-brand-header">
          <div className="brand-logo-wrap">
            <img
              src="/logo.png?v=2"
              alt="FolderMate logo"
              style={{
                width: 32,
                height: 32,
                display: "block",
                objectFit: "contain",
              }}
            />
          </div>
          <div>
            <h1 className="brand-name">FolderMate</h1>
            <p className="brand-sub">Windows Background Utility</p>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="sidebar-nav-container">
          {sections.map((section, sIdx) => (
            <div key={section.title} className="sidebar-section">
              <div className="sidebar-section-title">{section.title}</div>
              <div className="sidebar-section-items">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    currentView === item.id ||
                    (item.id === "home" && currentView === "dashboard");

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectView(item.id as NavView)}
                      className={`sidebar-nav-item ${isActive ? "active" : ""}`}
                    >
                      {isActive && <div className="active-accent-bar" />}
                      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <Icon size={16} className="nav-icon" />
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
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Area: License & Engine Daemon Status */}
      <div className="sidebar-footer-area">
        {/* License Status Badge */}
        <div
          onClick={onOpenActivation}
          className="sidebar-license-badge"
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
            <span className="license-type-text">
              {licenseStatus?.isActivated
                ? licenseStatus.licenseType === "VIP"
                  ? "VIP Patron"
                  : licenseStatus.licenseType === "SPONSOR"
                  ? "Project Sponsor"
                  : "Community Key"
                : "Activate License"}
            </span>
          </div>

          <span className="license-status-tag">
            {licenseStatus?.isActivated ? "Active" : "Locked"}
          </span>
        </div>

        {/* Engine Daemon Status */}
        <div className="sidebar-daemon-status">
          <div
            className={`daemon-indicator-dot ${engineConnected ? "online" : "offline"}`}
          />
          <div>
            <div className="daemon-title">
              {engineConnected ? "Daemon Active" : "Daemon Offline"}
            </div>
            <div className="daemon-subtitle">Win32 Named Pipe</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

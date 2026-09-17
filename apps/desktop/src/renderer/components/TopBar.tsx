import React from "react";
import { Search, Play, FolderOpen, Heart, Star, ShieldCheck, Key } from "lucide-react";
import { CorelStatusWidget } from "./CorelStatusWidget.js";
import { Button } from "./ui/Button.js";
import { Badge } from "./ui/Badge.js";
import { LicenseStatus } from "@foldermate/shared";

interface TopBarProps {
  onSearchFocus: () => void;
  onScanNow: () => void;
  onOpenInbox: () => void;
  onOpenStorage: () => void;
  onOpenCommandPalette: () => void;
  licenseStatus?: LicenseStatus | null;
  onOpenActivation?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onSearchFocus,
  onScanNow,
  onOpenInbox,
  onOpenStorage,
  onOpenCommandPalette,
  licenseStatus,
  onOpenActivation,
}) => {
  return (
    <header
      style={{
        height: 56,
        borderBottom: "1px solid var(--border-subtle)",
        backgroundColor: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 18px",
        userSelect: "none",
      }}
    >
      {/* Search Bar Trigger */}
      <div
        onClick={onOpenCommandPalette}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-subtle)",
          padding: "6px 12px",
          borderRadius: "var(--radius-sm)",
          cursor: "pointer",
          width: 320,
          color: "var(--text-muted)",
          fontSize: 12,
          transition: "border-color 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--border-medium)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border-subtle)";
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Search size={14} color="var(--text-muted)" />
          <span>Quick actions & search...</span>
        </div>
        <kbd
          style={{
            padding: "2px 5px",
            fontSize: 10,
            fontWeight: 600,
            color: "var(--text-muted)",
            backgroundColor: "var(--bg-elevated)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-sm)",
            lineHeight: 1.2,
          }}
        >
          Ctrl+K
        </kbd>
      </div>

      {/* Center / Right Integrations & Action Buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Supporter / License Badge */}
        {licenseStatus && (
          <button
            onClick={onOpenActivation}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              borderRadius: "var(--radius-sm)",
              border: `1px solid ${
                licenseStatus.isActivated
                  ? licenseStatus.licenseType === "VIP" || licenseStatus.licenseType === "SPONSOR"
                    ? "var(--border-focus)"
                    : "rgba(16, 185, 129, 0.3)"
                  : "rgba(239, 68, 68, 0.35)"
              }`,
              backgroundColor: licenseStatus.isActivated
                ? licenseStatus.licenseType === "VIP" || licenseStatus.licenseType === "SPONSOR"
                  ? "var(--accent-amber-subtle)"
                  : "rgba(16, 185, 129, 0.08)"
                : "rgba(239, 68, 68, 0.1)",
              color: licenseStatus.isActivated
                ? licenseStatus.licenseType === "VIP" || licenseStatus.licenseType === "SPONSOR"
                  ? "var(--accent-amber-text)"
                  : "var(--status-success-text)"
                : "var(--status-danger-text)",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s ease",
              outline: "none",
            }}
            title={licenseStatus.isActivated ? "Click to view license & supporter details" : "Click to activate FolderMate"}
          >
            {licenseStatus.isActivated ? (
              licenseStatus.licenseType === "VIP" ? (
                <>
                  <Star size={12} color="var(--accent-amber)" fill="var(--accent-amber)" />
                  <span>VIP Patron</span>
                </>
              ) : licenseStatus.licenseType === "SPONSOR" ? (
                <>
                  <Heart size={12} color="#f43f5e" fill="#f43f5e" />
                  <span>Sponsor Supporter</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={12} color="var(--status-success)" />
                  <span>Community Active</span>
                </>
              )
            ) : (
              <>
                <Key size={12} color="var(--status-danger)" />
                <span>Activate License</span>
              </>
            )}
          </button>
        )}

        <CorelStatusWidget />

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Button
            size="sm"
            variant="amber"
            leftIcon={<Play size={13} fill="currentColor" />}
            onClick={onScanNow}
          >
            Scan Inbox
          </Button>

          <Button
            size="sm"
            variant="secondary"
            leftIcon={<FolderOpen size={13} />}
            onClick={onOpenInbox}
          >
            Inbox
          </Button>

          <Button
            size="sm"
            variant="secondary"
            leftIcon={<FolderOpen size={13} />}
            onClick={onOpenStorage}
          >
            Storage
          </Button>
        </div>
      </div>
    </header>
  );
};

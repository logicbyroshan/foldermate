import React, { useState, useEffect } from "react";
import {
  Settings as SettingsIcon,
  Save,
  Folder,
  Shield,
  Palette,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  Layers,
  Cpu,
  Heart,
  Star,
  Key,
  ShieldCheck,
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import {
  Button,
  Input,
  Select,
  Card,
  Badge,
  useToast,
} from "../components/ui/index.js";
import { LicenseStatus } from "@foldermate/shared";

interface SettingsProps {
  licenseStatus?: LicenseStatus | null;
  onOpenActivation?: () => void;
  onLicenseUpdated?: () => void;
  themePreference?: "follow-windows" | "light" | "dark";
  onSetThemePreference?: (pref: "follow-windows" | "light" | "dark") => void;
}

export const Settings: React.FC<SettingsProps> = ({
  licenseStatus,
  onOpenActivation,
  onLicenseUpdated,
  themePreference = "follow-windows",
  onSetThemePreference,
}) => {
  const [inboxPath, setInboxPath] = useState("C:\\FolderMate\\Inbox");
  const [organizationRoot, setOrganizationRoot] = useState("D:\\Clients");
  const [archiveRoot, setArchiveRoot] = useState("D:\\Archive");
  const [safeMode, setSafeMode] = useState(true);
  const [corelEnabled, setCorelEnabled] = useState(true);
  const [collisionPolicy, setCollisionPolicy] = useState("AUTO_INCREMENT");
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const loadConfig = async () => {
      try {
        if ((window as any).foldermate) {
          const cfg = await (window as any).foldermate.call("settings.get");
          if (cfg?.ingestion?.inboxPath) setInboxPath(cfg.ingestion.inboxPath);
          if (cfg?.storage?.organizationRoot) setOrganizationRoot(cfg.storage.organizationRoot);
          if (cfg?.storage?.archiveRoot) setArchiveRoot(cfg.storage.archiveRoot);
          if (cfg?.storage?.safeMode !== undefined) setSafeMode(cfg.storage.safeMode);
          if (cfg?.storage?.collisionPolicy) setCollisionPolicy(cfg.storage.collisionPolicy);
          if (cfg?.coreldraw?.enabled !== undefined) setCorelEnabled(cfg.coreldraw.enabled);
        }
      } catch (err: any) {
        console.error("Failed to load settings:", err);
      }
    };
    loadConfig();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if ((window as any).foldermate) {
        await (window as any).foldermate.call("settings.update", {
          ingestion: { inboxPath },
          storage: { organizationRoot, archiveRoot, safeMode, collisionPolicy },
          coreldraw: { enabled: corelEnabled },
        });
        showToast("System configuration updated and applied to background engine.", "success");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to update configuration.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 900 }}>
      {/* Header bar */}
      <Card
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "var(--bg-surface-elevated)",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
            <SettingsIcon size={18} color="var(--accent-amber)" />
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>
              System Configuration
            </h2>
          </div>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Control directory boundaries, safety journals, version collision logic, and COM automation bridges.
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Save size={14} />}
          onClick={handleSave}
          isLoading={isSaving}
        >
          Save Configuration
        </Button>
      </Card>

      {/* License & Community Support Section */}
      <Card
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          background: licenseStatus?.isActivated && (licenseStatus.licenseType === "VIP" || licenseStatus.licenseType === "SPONSOR")
            ? "linear-gradient(135deg, rgba(247, 199, 29, 0.08), rgba(16, 24, 39, 0.95))"
            : "var(--bg-surface)",
          border: licenseStatus?.isActivated && (licenseStatus.licenseType === "VIP" || licenseStatus.licenseType === "SPONSOR")
            ? "1px solid var(--border-focus)"
            : "1px solid var(--border-subtle)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-subtle)", paddingBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {licenseStatus?.isActivated ? (
              licenseStatus.licenseType === "VIP" ? (
                <Star size={18} color="var(--accent-amber)" fill="var(--accent-amber)" />
              ) : licenseStatus.licenseType === "SPONSOR" ? (
                <Heart size={18} color="#f43f5e" fill="#f43f5e" />
              ) : (
                <ShieldCheck size={18} color="var(--status-success)" />
              )
            ) : (
              <Key size={18} color="var(--status-danger)" />
            )}
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                License & Community Support
              </h3>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                Offline activation status, community credits, and project sponsorship perks.
              </span>
            </div>
          </div>

          <Badge
            variant={
              licenseStatus?.isActivated
                ? licenseStatus.licenseType === "VIP" || licenseStatus.licenseType === "SPONSOR"
                  ? "amber"
                  : "success"
                : "danger"
            }
            size="md"
          >
            {licenseStatus?.isActivated
              ? licenseStatus.sponsorTier || licenseStatus.licenseType
              : "Unactivated"}
          </Badge>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ padding: "12px 14px", backgroundColor: "var(--bg-canvas)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 2 }}>Current Active Key</div>
            <code className="mono-font" style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 600 }}>
              {licenseStatus?.key ? `${licenseStatus.key.slice(0, 16)}••••••••` : "No key installed"}
            </code>
          </div>

          <div style={{ padding: "12px 14px", backgroundColor: "var(--bg-canvas)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 2 }}>Activated Date / Tier</div>
            <div style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 600 }}>
              {licenseStatus?.activatedAt
                ? new Date(licenseStatus.activatedAt).toLocaleDateString()
                : "Not activated yet"}
              {licenseStatus?.donorName ? ` • Supporter: ${licenseStatus.donorName}` : ""}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <Button
              variant="amber"
              size="sm"
              leftIcon={<Heart size={13} />}
              onClick={() => window.open("https://github.com/sponsors/FolderMate", "_blank")}
            >
              Sponsor on GitHub 💖
            </Button>

            <Button
              variant="secondary"
              size="sm"
              leftIcon={<ExternalLink size={13} />}
              onClick={() => window.open("https://buymeacoffee.com/foldermate", "_blank")}
            >
              Superchat / Tip ☕
            </Button>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Key size={13} />}
              onClick={onOpenActivation}
            >
              {licenseStatus?.isActivated ? "Change / Upgrade License Key" : "Activate License Now"}
            </Button>

            {licenseStatus?.isActivated && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<RotateCcw size={13} />}
                onClick={async () => {
                  if (confirm("Reset local license to test activation wizard?")) {
                    if ((window as any).foldermate) {
                      await (window as any).foldermate.call("system.resetLicense");
                      onLicenseUpdated?.();
                      showToast("License reset to unactivated state for testing", "info");
                    }
                  }
                }}
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Appearance & Windows Theme Section */}
      <Card style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid var(--border-subtle)", paddingBottom: 12 }}>
          <Palette size={18} color="var(--accent-amber)" />
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
              Appearance & Windows System Theme
            </h3>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
              Configure light/dark themes and automatic Windows OS system preference synchronization.
            </span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          <button
            type="button"
            onClick={() => onSetThemePreference?.("follow-windows")}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              padding: "12px 14px",
              borderRadius: "var(--radius-md)",
              border: themePreference === "follow-windows" ? "1.5px solid var(--brand-primary)" : "1px solid var(--border-subtle)",
              backgroundColor: themePreference === "follow-windows" ? "var(--bg-selected)" : "var(--bg-surface)",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.1s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginBottom: 4 }}>
              <strong style={{ fontSize: 13, color: "var(--text-primary)" }}>Follow Windows</strong>
              {themePreference === "follow-windows" && <Badge variant="amber" size="sm">Active</Badge>}
            </div>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
              Automatically tracks Windows 11 light or dark system theme.
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSetThemePreference?.("light")}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              padding: "12px 14px",
              borderRadius: "var(--radius-md)",
              border: themePreference === "light" ? "1.5px solid var(--brand-primary)" : "1px solid var(--border-subtle)",
              backgroundColor: themePreference === "light" ? "var(--bg-selected)" : "var(--bg-surface)",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.1s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginBottom: 4 }}>
              <strong style={{ fontSize: 13, color: "var(--text-primary)" }}>Light Theme</strong>
              {themePreference === "light" && <Badge variant="amber" size="sm">Active</Badge>}
            </div>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
              Crisp Windows Explorer clean light palette with dark text.
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSetThemePreference?.("dark")}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              padding: "12px 14px",
              borderRadius: "var(--radius-md)",
              border: themePreference === "dark" ? "1.5px solid var(--brand-primary)" : "1px solid var(--border-subtle)",
              backgroundColor: themePreference === "dark" ? "var(--bg-selected)" : "var(--bg-surface)",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.1s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginBottom: 4 }}>
              <strong style={{ fontSize: 13, color: "var(--text-primary)" }}>Dark Theme</strong>
              {themePreference === "dark" && <Badge variant="amber" size="sm">Active</Badge>}
            </div>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
              Deep neutral dark mode with FolderMate signature gold accents.
            </span>
          </button>
        </div>
      </Card>

      {/* Directory Paths Section */}
      <Card style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid var(--border-subtle)", paddingBottom: 12 }}>
          <Folder size={18} color="var(--accent-amber)" />
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
              Directory Boundaries
            </h3>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
              Absolute Windows filesystem locations used by the background file watcher and organizer.
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Input
            label="WATCHED INBOX DIRECTORY"
            value={inboxPath}
            onChange={(e) => setInboxPath(e.target.value)}
            className="mono-font"
            placeholder="e.g. C:\FolderMate\Inbox"
          />

          <Input
            label="ORGANIZATION STORAGE ROOT (LIBRARY)"
            value={organizationRoot}
            onChange={(e) => setOrganizationRoot(e.target.value)}
            className="mono-font"
            placeholder="e.g. D:\Clients"
          />

          <Input
            label="ARCHIVE STORAGE ROOT"
            value={archiveRoot}
            onChange={(e) => setArchiveRoot(e.target.value)}
            className="mono-font"
            placeholder="e.g. D:\Archive"
          />
        </div>
      </Card>

      {/* Safety & Version Policies */}
      <Card style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid var(--border-subtle)", paddingBottom: 12 }}>
          <Shield size={18} color="var(--status-success)" />
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
              Safety & Version Collision Policies
            </h3>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
              Protects against accidental overwrites and ensures non-destructive transactions.
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 14px",
              backgroundColor: "var(--bg-surface)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 6 }}>
                <span>Safe Mode (Archival Journal Protection)</span>
                <Badge variant="success" size="sm">Recommended</Badge>
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                Moves original inbox files to <code className="mono-font" style={{ color: "var(--accent-amber)" }}>_Archived</code> staging rather than unrecoverable deletion.
              </div>
            </div>
            <input
              type="checkbox"
              checked={safeMode}
              onChange={(e) => setSafeMode(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: "var(--accent-amber)", cursor: "pointer" }}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 14px",
              backgroundColor: "var(--bg-surface)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div style={{ maxWidth: 450 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                Collision Resolution Strategy
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                Determines action when a destination file already exists with matching name.
              </div>
            </div>
            <div style={{ width: 220 }}>
              <Select
                value={collisionPolicy}
                onChange={(val) => setCollisionPolicy(val)}
                options={[
                  { label: "Auto-Increment (v+1)", value: "AUTO_INCREMENT" },
                  { label: "Route to Review Queue", value: "PROMPT_REVIEW" },
                  { label: "Overwrite Destination", value: "OVERWRITE" },
                ]}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* CorelDRAW COM Automation */}
      <Card style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid var(--border-subtle)", paddingBottom: 12 }}>
          <Palette size={18} color="var(--accent-amber)" />
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
              CorelDRAW COM Bridge
            </h3>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
              Automates active document detection, page counts, metadata extraction, and version exports.
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 14px",
            backgroundColor: "var(--bg-surface)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 6 }}>
              <span>Enable CorelDRAW Automation Adapter</span>
              {corelEnabled && <Badge variant="amber" size="sm">Active</Badge>}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
              Communicates with running CorelDRAW instances via Windows COM interface without background polling.
            </div>
          </div>
          <input
            type="checkbox"
            checked={corelEnabled}
            onChange={(e) => setCorelEnabled(e.target.checked)}
            style={{ width: 18, height: 18, accentColor: "var(--accent-amber)", cursor: "pointer" }}
          />
        </div>
      </Card>
    </div>
  );
};

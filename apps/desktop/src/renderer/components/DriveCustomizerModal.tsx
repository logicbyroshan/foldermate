import React, { useState } from "react";
import { Modal } from "./ui/Modal.js";
import { Button } from "./ui/Button.js";
import { DriveVisualIcon, DriveEmblem, DRIVE_EMBLEM_MAP } from "./ui/FolderVisualIcon.js";
import {
  HardDrive,
  Check,
  ExternalLink,
  Search,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  FolderSync,
  Sparkles,
  Inbox,
  FolderOpen,
  History,
  Lock,
} from "lucide-react";
import { useToast } from "./ui/Toast.js";

export interface ManagedDrive {
  letter: string;
  label: string;
  totalGb: number;
  freeGb: number;
  isControlled: boolean;
  color?: string;
  emblem?: DriveEmblem | string;
  rootFolder?: string;
}

export const DRIVE_PRESET_COLORS = [
  { name: "Gold Amber", hex: "#f59e0b" },
  { name: "Sapphire Blue", hex: "#3b82f6" },
  { name: "Emerald Green", hex: "#10b981" },
  { name: "Royal Purple", hex: "#8b5cf6" },
  { name: "Crimson Rose", hex: "#f43f5e" },
  { name: "Sky Cyan", hex: "#06b6d4" },
  { name: "Slate Neutral", hex: "#64748b" },
  { name: "Warm Orange", hex: "#f97316" },
];

export const DRIVE_EMBLEMS: { id: DriveEmblem; label: string }[] = [
  { id: "hard-drive", label: "Drive" },
  { id: "database", label: "Database" },
  { id: "server", label: "Server" },
  { id: "shield", label: "Protected" },
  { id: "star", label: "Primary" },
  { id: "lock", label: "Secure" },
  { id: "zap", label: "Fast" },
  { id: "cloud", label: "Cloud" },
];

interface DriveCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  drives?: ManagedDrive[];
  activeDriveLetter?: string;
  onAssignDrive: (drive: ManagedDrive) => void;
  onReindexDrive: (driveLetter: string) => void;
}

export const DriveCustomizerModal: React.FC<DriveCustomizerModalProps> = ({
  isOpen,
  onClose,
  drives = [
    {
      letter: "D:",
      label: "Data Storage",
      totalGb: 512,
      freeGb: 348,
      isControlled: true,
      color: "#f59e0b",
      emblem: "hard-drive",
      rootFolder: "D:\\Clients",
    },
    {
      letter: "C:",
      label: "Local OS Disk",
      totalGb: 256,
      freeGb: 88,
      isControlled: false,
      color: "#64748b",
      emblem: "database",
      rootFolder: "C:\\FolderMate",
    },
    {
      letter: "E:",
      label: "Design Volume",
      totalGb: 1024,
      freeGb: 780,
      isControlled: false,
      color: "#10b981",
      emblem: "server",
      rootFolder: "E:\\Clients",
    },
  ],
  activeDriveLetter = "D:",
  onAssignDrive,
  onReindexDrive,
}) => {
  const { showToast } = useToast();
  const [selectedLetter, setSelectedLetter] = useState(
    activeDriveLetter.startsWith("C") ? "D:" : activeDriveLetter
  );
  const currentDrive = drives.find((d) => d.letter === selectedLetter) || drives[0];

  const [driveLabel, setDriveLabel] = useState(currentDrive?.label || "Data Storage");
  const [driveColor, setDriveColor] = useState(currentDrive?.color || "#f59e0b");
  const [driveEmblem, setDriveEmblem] = useState<DriveEmblem>(
    (currentDrive?.emblem as DriveEmblem) || "hard-drive"
  );
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [isIndexing, setIsIndexing] = useState(false);
  const [showPartitionGuide, setShowPartitionGuide] = useState(false);

  const handleSelectDrive = (d: ManagedDrive) => {
    if (d.letter.toUpperCase().startsWith("C")) {
      showToast(
        "Drive C: is your Windows System OS Drive. To protect Windows system files, FolderMate cannot manage C: as a full drive. Please select D:, E:, or create a new partition.",
        "warning"
      );
      return;
    }
    setSelectedLetter(d.letter);
    setDriveLabel(d.label);
    setDriveColor(d.color || "#f59e0b");
    setDriveEmblem((d.emblem as DriveEmblem) || "hard-drive");
  };

  const handleApplyDrive = async () => {
    if (selectedLetter.toUpperCase().startsWith("C")) {
      showToast("Cannot assign Windows System Drive C:. Please select a non-C drive partition.", "error");
      return;
    }

    setIsProvisioning(true);
    try {
      const updatedDrive: ManagedDrive = {
        ...currentDrive,
        letter: selectedLetter,
        label: driveLabel.trim() || "Data Storage",
        color: driveColor,
        emblem: driveEmblem,
        isControlled: true,
        rootFolder: `${selectedLetter}\\Clients`,
      };

      if ((window as any).foldermate) {
        await (window as any).foldermate.call("drives.assign", {
          driveLetter: selectedLetter,
          label: driveLabel.trim(),
          color: driveColor,
          emblem: driveEmblem,
        });
      }

      onAssignDrive(updatedDrive);
      showToast(
        `Drive ${selectedLetter} successfully assigned to FolderMate! Existing files moved to ${selectedLetter}\\Old\\, and fresh Inbox & Clients folders are ready.`,
        "success"
      );
      onClose();
    } catch (err: any) {
      showToast(`Failed to assign drive: ${err.message}`, "error");
    } finally {
      setIsProvisioning(false);
    }
  };

  const handleIndexDrive = async () => {
    setIsIndexing(true);
    try {
      if ((window as any).foldermate) {
        await (window as any).foldermate.call("drives.reindex", { driveLetter: selectedLetter });
      }
      onReindexDrive(selectedLetter);
      showToast(`Successfully indexed all files and folders in Drive ${selectedLetter}!`, "success");
    } catch (err: any) {
      showToast(`Drive indexing error: ${err.message}`, "error");
    } finally {
      setIsIndexing(false);
    }
  };

  const handleOpenDiskManagement = () => {
    try {
      if ((window as any).foldermate?.openCommand) {
        (window as any).foldermate.openCommand("diskmgmt.msc");
      }
      showToast("Launching Windows Disk Management console (diskmgmt.msc)...", "info");
    } catch {
      showToast("Press Windows Key + R, type 'diskmgmt.msc' and press Enter to partition drives.", "info");
    }
  };

  const usedGb = currentDrive.totalGb - currentDrive.freeGb;
  const usedPercent = Math.round((usedGb / currentDrive.totalGb) * 100);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Drive Setup & Partition Manager"
      subtitle="Select a non-C drive partition to manage, preserve existing files into Old/, and initialize autonomous organization"
      maxWidth={680}
      footer={
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleIndexDrive}
            isLoading={isIndexing}
            leftIcon={<Search size={13} />}
            title="Scan and index all files across this entire drive into local search"
          >
            Index All Drive Files
          </Button>

          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleApplyDrive}
              isLoading={isProvisioning}
              leftIcon={<Check size={14} />}
            >
              Manage &amp; Provision Drive {selectedLetter}
            </Button>
          </div>
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Step 1: Drive Volume Selection */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
              1. Select Drive Partition to Manage (C: is Protected)
            </label>
            <button
              type="button"
              className="win11-link-btn"
              onClick={() => setShowPartitionGuide((prev) => !prev)}
              style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}
            >
              <HelpCircle size={12} />
              <span>{showPartitionGuide ? "Hide Guide" : "Create Partition from Main Disk?"}</span>
            </button>
          </div>

          {showPartitionGuide && (
            <div
              style={{
                padding: "12px 14px",
                backgroundColor: "rgba(245, 158, 11, 0.06)",
                border: "1px solid rgba(245, 158, 11, 0.3)",
                borderRadius: "var(--radius-md)",
                marginBottom: 12,
                fontSize: 12,
                color: "var(--text-secondary)",
                lineHeight: 1.5,
              }}
            >
              <strong style={{ color: "#b45309" }}>
                How to Create a Dedicated Partition for FolderMate:
              </strong>
              <ol style={{ paddingLeft: 18, marginTop: 4 }}>
                <li>Open Windows Disk Management (click the button below or run <code>diskmgmt.msc</code>).</li>
                <li>Right-click your main drive (e.g. <code>C:</code>) and choose <em>"Shrink Volume..."</em> to free up space (e.g., 50–100 GB).</li>
                <li>Right-click the newly created unallocated space and choose <em>"New Simple Volume..."</em>.</li>
                <li>Assign it a drive letter (such as <code>D:</code> or <code>E:</code>) and format as NTFS.</li>
                <li>Return here and select your new partition to let FolderMate manage it cleanly!</li>
              </ol>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleOpenDiskManagement}
                leftIcon={<ExternalLink size={12} />}
                style={{ marginTop: 6 }}
              >
                Launch Windows Disk Management
              </Button>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {drives.map((d) => {
              const isSelected = selectedLetter === d.letter;
              const isSystemC = d.letter.toUpperCase().startsWith("C");

              return (
                <div
                  key={d.letter}
                  onClick={() => handleSelectDrive(d)}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "var(--radius-md)",
                    border: isSelected
                      ? "1.5px solid var(--brand-primary)"
                      : isSystemC
                      ? "1px dashed var(--border-subtle)"
                      : "1px solid var(--border-subtle)",
                    backgroundColor: isSelected
                      ? "var(--bg-selected)"
                      : isSystemC
                      ? "rgba(100, 116, 139, 0.05)"
                      : "var(--bg-canvas)",
                    cursor: isSystemC ? "not-allowed" : "pointer",
                    opacity: isSystemC ? 0.65 : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    transition: "all 0.1s ease",
                  }}
                  title={isSystemC ? "System OS Drive (Protected — FolderMate cannot manage C:)" : `Select ${d.letter}`}
                >
                  <DriveVisualIcon color={isSystemC ? "#64748b" : d.color || "#f59e0b"} emblem={d.emblem || "hard-drive"} size={30} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <strong style={{ fontSize: 13, color: isSystemC ? "var(--text-muted)" : "var(--text-primary)" }}>
                        {d.label} ({d.letter})
                      </strong>
                      {isSystemC ? (
                        <span
                          style={{
                            fontSize: 9,
                            padding: "1px 5px",
                            borderRadius: 4,
                            backgroundColor: "rgba(220, 38, 38, 0.1)",
                            color: "#dc2626",
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                          }}
                        >
                          <Lock size={9} /> SYSTEM OS
                        </span>
                      ) : d.isControlled ? (
                        <span
                          style={{
                            fontSize: 10,
                            padding: "1px 5px",
                            borderRadius: 4,
                            backgroundColor: "var(--status-success-bg)",
                            color: "var(--status-success-text)",
                            fontWeight: 700,
                          }}
                        >
                          ACTIVE
                        </span>
                      ) : null}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                      {d.freeGb} GB free of {d.totalGb} GB
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: How FolderMate Works on this Drive */}
        <div
          style={{
            padding: "12px 14px",
            backgroundColor: "rgba(59, 130, 246, 0.05)",
            border: "1px solid rgba(59, 130, 246, 0.2)",
            borderRadius: "var(--radius-md)",
            fontSize: 12,
            lineHeight: 1.5,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, color: "#1d4ed8", marginBottom: 6 }}>
            <FolderSync size={15} />
            <span>Autonomous Full Drive Architecture for {selectedLetter}\</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 4 }}>
            <div style={{ background: "#ffffff", padding: "8px 10px", borderRadius: 6, border: "1px solid #e2e8f0" }}>
              <div style={{ fontWeight: 600, color: "#475569", display: "flex", alignItems: "center", gap: 4 }}>
                <History size={13} color="#64748b" />
                <span>1. Safe Legacy Move</span>
              </div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                All existing folders &amp; files on {selectedLetter}\ are safely moved into <code>{selectedLetter}\Old\</code>. No files deleted.
              </div>
            </div>

            <div style={{ background: "#ffffff", padding: "8px 10px", borderRadius: 6, border: "1px solid #e2e8f0" }}>
              <div style={{ fontWeight: 600, color: "#047857", display: "flex", alignItems: "center", gap: 4 }}>
                <Sparkles size={13} color="#10b981" />
                <span>2. Clean Workspace</span>
              </div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                Introduces <code>Inbox\</code>, <code>Clients\</code>, <code>Review\</code>, <code>Archive\</code>, and <code>Old\</code>.
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Drive Appearance Customization */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 8 }}>
            2. Customize Drive Appearance &amp; Label
          </label>

          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <input
              type="text"
              value={driveLabel}
              onChange={(e) => setDriveLabel(e.target.value)}
              placeholder="e.g. Data Storage or FolderMate Work"
              style={{
                flex: 1,
                height: 34,
                padding: "0 10px",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--bg-canvas)",
                color: "var(--text-primary)",
                fontSize: 13,
                outline: "none",
              }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="color"
                value={driveColor}
                onChange={(e) => setDriveColor(e.target.value)}
                style={{ width: 34, height: 34, border: "none", borderRadius: 4, cursor: "pointer", backgroundColor: "transparent" }}
                title="Pick custom drive accent color"
              />
            </div>
          </div>

          {/* Color Presets */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 6, marginBottom: 12 }}>
            {DRIVE_PRESET_COLORS.map((preset) => (
              <button
                key={preset.hex}
                type="button"
                onClick={() => setDriveColor(preset.hex)}
                style={{
                  height: 28,
                  borderRadius: 5,
                  backgroundColor: preset.hex,
                  border: driveColor === preset.hex ? "2.5px solid #0f172a" : "1px solid rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title={preset.name}
              >
                {driveColor === preset.hex && <Check size={14} color="#ffffff" strokeWidth={3} />}
              </button>
            ))}
          </div>

          {/* Drive Emblems */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 6 }}>
            {DRIVE_EMBLEMS.map((em) => {
              const EmblemComp = DRIVE_EMBLEM_MAP[em.id] || HardDrive;
              const isSelected = driveEmblem === em.id;
              return (
                <button
                  key={em.id}
                  type="button"
                  onClick={() => setDriveEmblem(em.id)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    padding: "6px 2px",
                    borderRadius: 6,
                    border: isSelected ? "1.5px solid var(--brand-primary)" : "1px solid var(--border-subtle)",
                    backgroundColor: isSelected ? "var(--bg-selected)" : "var(--bg-canvas)",
                    cursor: "pointer",
                  }}
                  title={em.label}
                >
                  <EmblemComp size={15} color={isSelected ? driveColor : "var(--text-secondary)"} />
                  <span style={{ fontSize: 9.5, fontWeight: isSelected ? 700 : 500, color: "var(--text-primary)" }}>
                    {em.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};

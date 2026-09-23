import React, { useState } from "react";
import { Modal } from "./ui/Modal.js";
import { Button } from "./ui/Button.js";
import { DriveVisualIcon, DriveEmblem, DRIVE_EMBLEM_MAP } from "./ui/FolderVisualIcon.js";
import {
  HardDrive,
  Check,
  RotateCcw,
  Sparkles,
  ExternalLink,
  FolderTree,
  Search,
  Database,
  Shield,
  Layers,
  HelpCircle,
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
  { name: "Sky Blue", hex: "#0284c7" },
  { name: "Emerald Green", hex: "#16a34a" },
  { name: "Royal Purple", hex: "#7c3aed" },
  { name: "Crimson Red", hex: "#dc2626" },
  { name: "Slate Neutral", hex: "#475569" },
  { name: "Indigo Deep", hex: "#4f46e5" },
  { name: "Cyan Teal", hex: "#0891b2" },
];

export const DRIVE_EMBLEMS: { id: DriveEmblem; label: string }[] = [
  { id: "hard-drive", label: "Drive" },
  { id: "database", label: "Database" },
  { id: "server", label: "Server" },
  { id: "cloud", label: "Cloud" },
  { id: "shield", label: "Protected" },
  { id: "star", label: "Primary" },
  { id: "lock", label: "Secure" },
  { id: "zap", label: "Fast" },
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
      label: "Local Disk",
      totalGb: 256,
      freeGb: 92,
      isControlled: false,
      color: "#0284c7",
      emblem: "database",
      rootFolder: "C:\\FolderMate\\Inbox",
    },
  ],
  activeDriveLetter = "D:",
  onAssignDrive,
  onReindexDrive,
}) => {
  const { showToast } = useToast();
  const [selectedLetter, setSelectedLetter] = useState(activeDriveLetter);
  const currentDrive = drives.find((d) => d.letter === selectedLetter) || drives[0];

  const [driveLabel, setDriveLabel] = useState(currentDrive?.label || "Data Storage");
  const [driveColor, setDriveColor] = useState(currentDrive?.color || "#f59e0b");
  const [driveEmblem, setDriveEmblem] = useState<DriveEmblem>((currentDrive?.emblem as DriveEmblem) || "hard-drive");
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [isIndexing, setIsIndexing] = useState(false);
  const [showPartitionGuide, setShowPartitionGuide] = useState(false);

  const handleSelectDrive = (d: ManagedDrive) => {
    setSelectedLetter(d.letter);
    setDriveLabel(d.label);
    setDriveColor(d.color || "#f59e0b");
    setDriveEmblem((d.emblem as DriveEmblem) || "hard-drive");
  };

  const handleApplyDrive = async () => {
    setIsProvisioning(true);
    try {
      const updatedDrive: ManagedDrive = {
        ...currentDrive,
        letter: selectedLetter,
        label: driveLabel.trim() || "FolderMate Storage",
        color: driveColor,
        emblem: driveEmblem,
        isControlled: true,
        rootFolder: `${selectedLetter}\\${driveLabel.trim() || "FolderMate Storage"}`,
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
        `Assigned Drive ${selectedLetter} to FolderMate. Provisioned root folder: ${selectedLetter}\\${driveLabel}\\`,
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
      showToast("Launching Windows Disk Management console...", "info");
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
      title="Controlled Drive & Partition Manager"
      subtitle="Assign a dedicated drive volume, customize drive appearance, and provision organized workspaces"
      maxWidth={660}
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
              Save &amp; Control Drive
            </Button>
          </div>
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {/* Drive Selection Cards */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
              1. Select Drive Volume to Control
            </label>
            <button
              type="button"
              className="win11-link-btn"
              onClick={() => setShowPartitionGuide((prev) => !prev)}
              style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}
            >
              <HelpCircle size={12} />
              <span>{showPartitionGuide ? "Hide Partition Guide" : "Create New Partition?"}</span>
            </button>
          </div>

          {showPartitionGuide && (
            <div
              style={{
                padding: "12px 14px",
                backgroundColor: "var(--bg-canvas)",
                border: "1px solid var(--border-medium)",
                borderRadius: "var(--radius-md)",
                marginBottom: 12,
                fontSize: 12,
                color: "var(--text-secondary)",
                lineHeight: 1.5,
              }}
            >
              <strong>How to Create a Dedicated Partition for FolderMate:</strong>
              <ol style={{ paddingLeft: 18, marginTop: 4 }}>
                <li>Open Windows Disk Management (click button below or run <code>diskmgmt.msc</code>).</li>
                <li>Right-click your main drive (e.g. C:) and select <em>"Shrink Volume..."</em> to free up space (e.g. 50-100 GB).</li>
                <li>Right-click the newly unallocated space and choose <em>"New Simple Volume..."</em>.</li>
                <li>Assign it a drive letter (such as <code>D:</code> or <code>E:</code>) and format as NTFS.</li>
                <li>Return here and select your new drive to assign it to FolderMate!</li>
              </ol>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleOpenDiskManagement}
                leftIcon={<ExternalLink size={12} />}
                style={{ marginTop: 8 }}
              >
                Launch Windows Disk Management
              </Button>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {drives.map((d) => {
              const isSelected = selectedLetter === d.letter;
              return (
                <div
                  key={d.letter}
                  onClick={() => handleSelectDrive(d)}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "var(--radius-md)",
                    border: isSelected ? "1.5px solid var(--brand-primary)" : "1px solid var(--border-subtle)",
                    backgroundColor: isSelected ? "var(--bg-selected)" : "var(--bg-canvas)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    transition: "all 0.1s ease",
                  }}
                >
                  <DriveVisualIcon color={d.color || "#f59e0b"} emblem={d.emblem || "hard-drive"} size={32} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <strong style={{ fontSize: 13, color: "var(--text-primary)" }}>
                        {d.label} ({d.letter})
                      </strong>
                      {d.isControlled && (
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
                      )}
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

        {/* Selected Drive Capacity Bar & Preview */}
        <div
          style={{
            padding: "14px 16px",
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>
              Drive Capacity ({selectedLetter})
            </span>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
              {usedGb} GB used ({usedPercent}%) • {currentDrive.freeGb} GB available
            </span>
          </div>
          <div style={{ width: "100%", height: 6, backgroundColor: "var(--border-subtle)", borderRadius: 3, overflow: "hidden" }}>
            <div
              style={{
                width: `${usedPercent}%`,
                height: "100%",
                backgroundColor: driveColor,
                borderRadius: 3,
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>

        {/* SECTION 2: Drive Appearance Customization */}
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
                title="Pick drive color"
              />
            </div>
          </div>

          {/* Color Presets */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 6, marginBottom: 14 }}>
            {DRIVE_PRESET_COLORS.map((preset) => (
              <button
                key={preset.hex}
                type="button"
                onClick={() => setDriveColor(preset.hex)}
                style={{
                  height: 30,
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
                    padding: "8px 4px",
                    borderRadius: 6,
                    border: isSelected ? "1.5px solid var(--brand-primary)" : "1px solid var(--border-subtle)",
                    backgroundColor: isSelected ? "var(--bg-selected)" : "var(--bg-canvas)",
                    cursor: "pointer",
                  }}
                  title={em.label}
                >
                  <EmblemComp size={16} color={isSelected ? driveColor : "var(--text-secondary)"} />
                  <span style={{ fontSize: 10, fontWeight: isSelected ? 700 : 500, color: "var(--text-primary)" }}>
                    {em.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: Provisioned Folder Architecture */}
        <div
          style={{
            padding: "12px 14px",
            backgroundColor: "var(--bg-canvas)",
            border: "1px dashed var(--border-medium)",
            borderRadius: "var(--radius-md)",
            fontSize: 11,
            color: "var(--text-secondary)",
          }}
        >
          <strong style={{ color: "var(--text-primary)" }}>
            Automatically Provisioned Folder Structure on {selectedLetter}\:
          </strong>
          <div style={{ marginTop: 6, fontFamily: "monospace", display: "flex", flexDirection: "column", gap: 3 }}>
            <div>📁 {selectedLetter}\{driveLabel || "FolderMate"}\</div>
            <div style={{ paddingLeft: 16 }}>├── 📥 Inbox\ <span style={{ color: "var(--text-muted)" }}>— Active watcher folder for new incoming files</span></div>
            <div style={{ paddingLeft: 16 }}>├── 📁 Clients\ <span style={{ color: "var(--text-muted)" }}>— Classified client directories &amp; project work</span></div>
            <div style={{ paddingLeft: 16 }}>├── 📦 Archive\ <span style={{ color: "var(--text-muted)" }}>— Historical completed &amp; cold storage</span></div>
            <div style={{ paddingLeft: 16 }}>└── ⚠️ Review\ <span style={{ color: "var(--text-muted)" }}>— Low-confidence or ambiguous quarantine files</span></div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

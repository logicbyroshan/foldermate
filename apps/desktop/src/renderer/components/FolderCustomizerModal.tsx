import React, { useState } from "react";
import { Modal } from "./ui/Modal.js";
import { Button } from "./ui/Button.js";
import { FolderVisualIcon, FolderEmblem, EMBLEM_ICON_MAP } from "./ui/FolderVisualIcon.js";
import { Palette, Sparkles, Check, RotateCcw } from "lucide-react";
import { useToast } from "./ui/Toast.js";

export const FOLDER_PRESET_COLORS = [
  { name: "Folder Amber", hex: "#f59e0b" },
  { name: "Sky Blue", hex: "#0284c7" },
  { name: "Emerald Green", hex: "#16a34a" },
  { name: "Crimson Red", hex: "#dc2626" },
  { name: "Royal Purple", hex: "#7c3aed" },
  { name: "Cyan Teal", hex: "#0891b2" },
  { name: "Fuchsia Pink", hex: "#c026d3" },
  { name: "Coral Orange", hex: "#ea580c" },
  { name: "Indigo Deep", hex: "#4f46e5" },
  { name: "Rose Blush", hex: "#e11d48" },
  { name: "Lime Bright", hex: "#65a30d" },
  { name: "Slate Neutral", hex: "#475569" },
  { name: "Dark Bronze", hex: "#78350f" },
  { name: "Midnight Charcoal", hex: "#1e293b" },
];

export const FOLDER_EMBLEMS: { id: FolderEmblem; label: string }[] = [
  { id: "none", label: "None" },
  { id: "star", label: "Star" },
  { id: "client", label: "Client" },
  { id: "briefcase", label: "Briefcase" },
  { id: "project", label: "Project" },
  { id: "tag", label: "Tag" },
  { id: "shield", label: "Shield" },
  { id: "lock", label: "Lock" },
  { id: "code", label: "Code" },
  { id: "image", label: "Image" },
  { id: "palette", label: "Design" },
  { id: "check", label: "Approved" },
  { id: "sparkles", label: "Active" },
  { id: "archive", label: "Archive" },
  { id: "document", label: "Document" },
];

interface FolderCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  folderId?: string;
  folderName: string;
  folderPath?: string;
  currentColor?: string;
  currentEmblem?: string;
  onApply: (folderId: string, color: string, emblem: string) => void;
}

export const FolderCustomizerModal: React.FC<FolderCustomizerModalProps> = ({
  isOpen,
  onClose,
  folderId = "",
  folderName,
  folderPath = "",
  currentColor = "#f59e0b",
  currentEmblem = "none",
  onApply,
}) => {
  const { showToast } = useToast();
  const [selectedColor, setSelectedColor] = useState(currentColor || "#f59e0b");
  const [selectedEmblem, setSelectedEmblem] = useState<FolderEmblem>((currentEmblem as FolderEmblem) || "none");
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async () => {
    setIsApplying(true);
    try {
      if ((window as any).foldermate) {
        await (window as any).foldermate.call("folders.customize", {
          folderId,
          folderPath,
          color: selectedColor,
          emblem: selectedEmblem,
        });
      }
      onApply(folderId, selectedColor, selectedEmblem);
      showToast(`Customized "${folderName}" with custom color and emblem`, "success");
      onClose();
    } catch (err: any) {
      showToast(`Failed to customize folder: ${err.message}`, "error");
    } finally {
      setIsApplying(false);
    }
  };

  const handleReset = () => {
    setSelectedColor("#f59e0b");
    setSelectedEmblem("none");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Customize Folder Appearance"
      subtitle={`Configure colors and visual icon emblems for "${folderName}"`}
      maxWidth={580}
      footer={
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
          <Button variant="ghost" size="sm" onClick={handleReset} leftIcon={<RotateCcw size={13} />}>
            Reset to Default
          </Button>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="md" onClick={handleApply} isLoading={isApplying} leftIcon={<Check size={14} />}>
              Apply Customization
            </Button>
          </div>
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {/* Live Folder Preview Card */}
        <div
          style={{
            padding: "20px 24px",
            backgroundColor: "var(--bg-canvas)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <FolderVisualIcon color={selectedColor} emblem={selectedEmblem} size={64} />
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>{folderName}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
              {folderPath || `D:\\Clients\\${folderName}`}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
              <span
                style={{
                  fontSize: 11,
                  padding: "2px 8px",
                  borderRadius: 4,
                  backgroundColor: `${selectedColor}18`,
                  color: selectedColor,
                  fontWeight: 600,
                  border: `1px solid ${selectedColor}40`,
                }}
              >
                Hex: {selectedColor.toUpperCase()}
              </span>
              {selectedEmblem !== "none" && (
                <span
                  style={{
                    fontSize: 11,
                    padding: "2px 8px",
                    borderRadius: 4,
                    backgroundColor: "var(--bg-surface)",
                    color: "var(--text-secondary)",
                    fontWeight: 600,
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  Emblem: {selectedEmblem.toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 1: Folder Color Palette & Custom Hex */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
              1. Choose Folder Color
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Custom Color:</span>
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                style={{
                  width: 26,
                  height: 26,
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  backgroundColor: "transparent",
                }}
                title="Pick custom color"
              />
              <input
                type="text"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                style={{
                  width: 78,
                  height: 26,
                  fontSize: 11,
                  fontFamily: "monospace",
                  padding: "0 6px",
                  border: "1px solid var(--border-medium)",
                  borderRadius: 4,
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
            {FOLDER_PRESET_COLORS.map((preset) => (
              <button
                key={preset.hex}
                type="button"
                onClick={() => setSelectedColor(preset.hex)}
                style={{
                  height: 38,
                  borderRadius: 6,
                  backgroundColor: preset.hex,
                  border: selectedColor === preset.hex ? "2.5px solid #0f172a" : "1px solid rgba(0,0,0,0.12)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  transition: "transform 0.1s ease",
                }}
                title={preset.name}
              >
                {selectedColor === preset.hex && <Check size={16} color="#ffffff" strokeWidth={3} />}
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 2: Emblem Icon Overlay */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 8 }}>
            2. Choose Icon Emblem Overlay (Optional)
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
            {FOLDER_EMBLEMS.map((em) => {
              const EmblemComp = em.id !== "none" ? EMBLEM_ICON_MAP[em.id] : null;
              const isSelected = selectedEmblem === em.id;

              return (
                <button
                  key={em.id}
                  type="button"
                  onClick={() => setSelectedEmblem(em.id)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    padding: "10px 6px",
                    borderRadius: 8,
                    border: isSelected ? "1.5px solid var(--brand-primary)" : "1px solid var(--border-subtle)",
                    backgroundColor: isSelected ? "var(--bg-selected)" : "var(--bg-canvas)",
                    cursor: "pointer",
                    transition: "all 0.1s ease",
                  }}
                >
                  {EmblemComp ? (
                    <EmblemComp size={18} color={isSelected ? "var(--brand-primary)" : "var(--text-secondary)"} />
                  ) : (
                    <span style={{ fontSize: 12, color: "var(--text-muted)", height: 18, display: "flex", alignItems: "center" }}>
                      —
                    </span>
                  )}
                  <span style={{ fontSize: 11, fontWeight: isSelected ? 700 : 500, color: "var(--text-primary)" }}>
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

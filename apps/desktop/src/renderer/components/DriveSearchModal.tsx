import React, { useState, useEffect, useRef } from "react";
import { Modal } from "./ui/Modal.js";
import { Button } from "./ui/Button.js";
import { FileFormatIcon } from "./ui/FileFormatIcon.js";
import {
  Search,
  FolderOpen,
  ExternalLink,
  GitBranch,
  Calendar,
  Filter,
  X,
  HardDrive,
} from "lucide-react";
import { useToast } from "./ui/Toast.js";

interface DriveSearchFile {
  id: string;
  name: string;
  extension: string;
  path: string;
  sizeBytes?: number;
  formattedSize?: string;
  clientName?: string;
  projectName?: string;
  year?: number;
  version?: number;
  modifiedAt?: string;
}

interface DriveSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: any[];
  controlledDriveLetter?: string;
  onOpenFile?: (file: any) => void;
  onShowInExplorer?: (path: string) => void;
}

export const DriveSearchModal: React.FC<DriveSearchModalProps> = ({
  isOpen,
  onClose,
  files = [],
  controlledDriveLetter = "D:",
  onOpenFile,
  onShowInExplorer,
}) => {
  const { showToast } = useToast();
  const [query, setQuery] = useState("");
  const [selectedFormat, setSelectedFormat] = useState<string>("ALL");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const normalizedFiles: DriveSearchFile[] = files.map((f) => {
    const ext = (f.extension || f.ext || f.filename?.split(".").pop() || "").toLowerCase();
    const size = f.fileSizeBytes || f.sizeBytes || 0;
    const formatted = size >= 1024 * 1024
      ? `${(size / (1024 * 1024)).toFixed(1)} MB`
      : size >= 1024
      ? `${(size / 1024).toFixed(1)} KB`
      : `${size} B`;

    return {
      id: f.id || f.filename,
      name: f.filename || f.name || f.currentName,
      extension: ext,
      path: f.path || f.targetPath || `${controlledDriveLetter}\\Clients\\${f.filename}`,
      sizeBytes: size,
      formattedSize: formatted,
      clientName: f.clientName,
      projectName: f.projectName,
      year: f.year,
      version: f.version || f.versionNumber || 1,
      modifiedAt: f.modifiedDate || f.modifiedAt || "Today, 12:45 PM",
    };
  });

  const filtered = normalizedFiles.filter((item) => {
    if (selectedFormat !== "ALL") {
      if (selectedFormat === "IMAGE" && !["png", "jpg", "jpeg", "webp", "svg"].includes(item.extension)) {
        return false;
      } else if (selectedFormat !== "IMAGE" && item.extension !== selectedFormat.toLowerCase()) {
        return false;
      }
    }

    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.name?.toLowerCase().includes(q) ||
      item.clientName?.toLowerCase().includes(q) ||
      item.projectName?.toLowerCase().includes(q) ||
      item.extension?.toLowerCase().includes(q) ||
      item.path?.toLowerCase().includes(q)
    );
  });

  const handleOpen = (item: DriveSearchFile) => {
    if (onOpenFile) {
      onOpenFile(item);
    } else {
      showToast(`Opening "${item.name}"...`, "info");
    }
  };

  const handleReveal = (item: DriveSearchFile) => {
    if (onShowInExplorer) {
      onShowInExplorer(item.path);
    } else {
      showToast(`Revealing "${item.path}" in Windows Explorer`, "info");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Instant Drive Search (Spotlight)"
      subtitle={`Search across all indexed files on controlled Drive ${controlledDriveLetter}\\`}
      maxWidth={720}
      footer={
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
            Found {filtered.length} files • Press <kbd>ESC</kbd> to exit
          </span>
          <Button variant="secondary" size="md" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Search Input Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 14px",
            border: "1.5px solid var(--border-medium)",
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--bg-canvas)",
          }}
        >
          <Search size={18} color="var(--brand-primary)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by filename, client name, project, or extension (e.g. Apex ID Card, .cdr)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              fontSize: 14,
              color: "var(--text-primary)",
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "var(--text-muted)", marginRight: 4 }}>Filter:</span>
          {["ALL", "cdr", "psd", "ai", "pdf", "IMAGE", "xlsx"].map((fmt) => {
            const isSelected = selectedFormat === fmt;
            return (
              <button
                key={fmt}
                type="button"
                onClick={() => setSelectedFormat(fmt)}
                style={{
                  padding: "3px 10px",
                  borderRadius: 14,
                  fontSize: 11,
                  fontWeight: 600,
                  border: isSelected ? "1px solid var(--brand-primary)" : "1px solid var(--border-subtle)",
                  backgroundColor: isSelected ? "var(--bg-selected)" : "var(--bg-surface)",
                  color: isSelected ? "var(--accent-amber-text)" : "var(--text-secondary)",
                  cursor: "pointer",
                }}
              >
                {fmt === "ALL" ? "All Files" : fmt.toUpperCase()}
              </button>
            );
          })}
        </div>

        {/* Results List */}
        <div style={{ maxHeight: 380, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
              No files matching "{query}" found in Drive {controlledDriveLetter}\
            </div>
          ) : (
            filtered.map((file) => (
              <div
                key={file.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  backgroundColor: "var(--bg-canvas)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  gap: 12,
                  transition: "background 0.1s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
                  <FileFormatIcon extension={file.extension} size={28} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--text-primary)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={file.name}
                      >
                        {file.name}
                      </span>
                      {file.version && (
                        <span
                          style={{
                            fontSize: 10,
                            padding: "1px 5px",
                            borderRadius: 4,
                            backgroundColor: "var(--bg-surface)",
                            border: "1px solid var(--border-subtle)",
                            color: "var(--text-muted)",
                          }}
                        >
                          v{file.version}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        marginTop: 2,
                      }}
                      title={file.path}
                    >
                      {file.clientName ? `${file.clientName} \\ ` : ""}{file.path}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", minWidth: 60, textAlign: "right" }}>
                    {file.formattedSize}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReveal(file)}
                    title="Show in Windows Explorer"
                    style={{ padding: "4px 8px" }}
                  >
                    <FolderOpen size={13} />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleOpen(file)}
                    leftIcon={<ExternalLink size={12} />}
                  >
                    Open
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};

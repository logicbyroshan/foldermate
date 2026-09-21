import React from "react";
import {
  FileText,
  Folder,
  ExternalLink,
  FolderOpen,
  GitBranch,
  ShieldCheck,
  Calendar,
  HardDrive,
  User,
  Layers,
  Sparkles,
  Copy,
  Clock,
  Palette,
} from "lucide-react";
import { useToast } from "./ui/Toast.js";

export interface SelectedFileItem {
  type: "file";
  id: string;
  name: string;
  ext: string;
  extColor: string;
  extBg: string;
  clientName?: string;
  projectName?: string;
  year?: number;
  versionNumber?: number;
  sizeBytes?: number;
  formattedSize?: string;
  modifiedAt?: string;
  targetPath?: string;
  sha256?: string;
  lineage?: { versionNumber: number; filename: string; createdAt: string; isCurrent: boolean }[];
}

export interface SelectedFolderItem {
  type: "folder";
  id: string;
  name: string;
  category?: "client" | "project" | "year" | "custom";
  color?: string;
  folderPath?: string;
  projectCount?: number;
  fileCount?: number;
  totalSizeBytes?: number;
  latestActivity?: string;
  status?: string;
}

export type SelectedItem = SelectedFileItem | SelectedFolderItem | null;

interface InspectorPanelProps {
  selectedItem: SelectedItem;
  isOpen: boolean;
  onClose: () => void;
  onUpdateFolderColor?: (folderId: string, color: string) => void;
  onCreateVersion?: (fileId: string) => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  selectedItem,
  isOpen,
  onClose,
  onUpdateFolderColor,
  onCreateVersion,
}) => {
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleOpenFile = async (path?: string) => {
    if (!path) return;
    try {
      if ((window as any).foldermate?.openPath) {
        await (window as any).foldermate.openPath(path);
      }
    } catch (err: any) {
      showToast(err.message || "Failed to open file.", "error");
    }
  };

  const handleShowInExplorer = async (path?: string) => {
    if (!path) return;
    try {
      if ((window as any).foldermate?.showItemInFolder) {
        await (window as any).foldermate.showItemInFolder(path);
      } else if ((window as any).foldermate?.openPath) {
        await (window as any).foldermate.openPath(path);
      }
    } catch (err: any) {
      showToast(err.message || "Failed to reveal in explorer.", "error");
    }
  };

  const handleCopyHash = (hash?: string) => {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
    showToast("SHA-256 hash copied to clipboard!", "success");
  };

  return (
    <aside className="explorer-inspector-pane animate-fade-in">
      <div className="inspector-header">
        <span className="inspector-title">Details &amp; Intelligence</span>
        <button type="button" className="inspector-close-btn" onClick={onClose} title="Close Pane">
          ✕
        </button>
      </div>

      <div className="inspector-body">
        {selectedItem ? (
          selectedItem.type === "file" ? (
            /* Selected File Details */
            <div className="inspector-file-details">
              {/* File Icon and Header */}
              <div className="inspector-preview-card">
                <div
                  className="inspector-file-icon-badge"
                  style={{ background: selectedItem.extBg, color: selectedItem.extColor }}
                >
                  {selectedItem.ext.toUpperCase()}
                </div>
                <div className="inspector-file-name-block">
                  <h3 className="inspector-file-name" title={selectedItem.name}>
                    {selectedItem.name}
                  </h3>
                  <div className="inspector-version-tag">
                    <GitBranch size={11} />
                    <span>Version v{selectedItem.versionNumber || 1}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="inspector-actions-grid">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => handleOpenFile(selectedItem.targetPath)}
                >
                  <ExternalLink size={13} /> Open File
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => handleShowInExplorer(selectedItem.targetPath)}
                >
                  <FolderOpen size={13} /> Show in Explorer
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    if (onCreateVersion) {
                      onCreateVersion(selectedItem.id);
                    } else {
                      showToast(`Forked version v${(selectedItem.versionNumber || 1) + 1} for "${selectedItem.name}"`, "success");
                    }
                  }}
                >
                  <GitBranch size={13} /> Create v{(selectedItem.versionNumber || 1) + 1}
                </button>
              </div>

              {/* Metadata Table */}
              <div className="inspector-meta-group">
                <div className="inspector-meta-heading">Metadata &amp; Lineage</div>
                <div className="inspector-meta-row">
                  <span className="meta-key"><User size={13} /> Client</span>
                  <span className="meta-val">{selectedItem.clientName || "Unassigned"}</span>
                </div>
                <div className="inspector-meta-row">
                  <span className="meta-key"><Layers size={13} /> Project</span>
                  <span className="meta-val">{selectedItem.projectName || "General"}</span>
                </div>
                <div className="inspector-meta-row">
                  <span className="meta-key"><Calendar size={13} /> Year</span>
                  <span className="meta-val">{selectedItem.year || new Date().getFullYear()}</span>
                </div>
                <div className="inspector-meta-row">
                  <span className="meta-key"><HardDrive size={13} /> Size</span>
                  <span className="meta-val">{selectedItem.formattedSize || "N/A"}</span>
                </div>
                <div className="inspector-meta-row">
                  <span className="meta-key"><Clock size={13} /> Modified</span>
                  <span className="meta-val">{selectedItem.modifiedAt || "Today"}</span>
                </div>
              </div>

              {/* Integrity & Hash */}
              {selectedItem.sha256 && (
                <div className="inspector-meta-group">
                  <div className="inspector-meta-heading">
                    <ShieldCheck size={13} color="var(--status-success)" />
                    <span>Two-Phase Integrity Checksum</span>
                  </div>
                  <div
                    className="inspector-hash-box"
                    onClick={() => handleCopyHash(selectedItem.sha256)}
                    title="Click to copy full SHA-256 hash"
                  >
                    <code>{selectedItem.sha256.substring(0, 24)}...</code>
                    <Copy size={12} />
                  </div>
                </div>
              )}

              {/* Version History DAG */}
              {selectedItem.lineage && selectedItem.lineage.length > 0 && (
                <div className="inspector-meta-group">
                  <div className="inspector-meta-heading">Version History DAG</div>
                  <div className="inspector-lineage-list">
                    {selectedItem.lineage.map((v) => (
                      <div
                        key={v.versionNumber}
                        className={`lineage-item ${v.isCurrent ? "active-lineage" : ""}`}
                      >
                        <span className="lineage-pill">v{v.versionNumber}</span>
                        <div className="lineage-info">
                          <span className="lineage-name">{v.filename}</span>
                          <span className="lineage-time">{v.createdAt}</span>
                        </div>
                        {v.isCurrent && <span className="current-badge">Active</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Selected Folder Details */
            <div className="inspector-folder-details">
              <div className="inspector-preview-card">
                <div className="inspector-folder-icon-badge">
                  <Folder size={28} color={selectedItem.color || "var(--brand-primary)"} />
                </div>
                <div className="inspector-file-name-block">
                  <h3 className="inspector-file-name">{selectedItem.name}</h3>
                  <span className="inspector-folder-category">
                    {selectedItem.category?.toUpperCase() || "CLIENT FOLDER"}
                  </span>
                </div>
              </div>

              {/* Folder Actions */}
              <div className="inspector-actions-grid single-action">
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => handleShowInExplorer(selectedItem.folderPath)}
                >
                  <FolderOpen size={13} /> Open in Windows Explorer
                </button>
              </div>

              {/* Folder Stats */}
              <div className="inspector-meta-group">
                <div className="inspector-meta-heading">Folder Intelligence</div>
                <div className="inspector-meta-row">
                  <span className="meta-key">Total Projects</span>
                  <span className="meta-val">{selectedItem.projectCount || 0}</span>
                </div>
                <div className="inspector-meta-row">
                  <span className="meta-key">Files Contained</span>
                  <span className="meta-val">{selectedItem.fileCount || 0}</span>
                </div>
                <div className="inspector-meta-row">
                  <span className="meta-key">Latest Activity</span>
                  <span className="meta-val">{selectedItem.latestActivity || "Today"}</span>
                </div>
                <div className="inspector-meta-row">
                  <span className="meta-key">Organization Status</span>
                  <span className="meta-val status-active">● Active Watch</span>
                </div>
              </div>

              {/* Folder Color Customization */}
              <div className="inspector-meta-group">
                <div className="inspector-meta-heading">
                  <Palette size={13} />
                  <span>Folder Accent Color</span>
                </div>
                <div className="folder-color-swatches">
                  {["#f59e0b", "#3b82f6", "#10b981", "#ef4444", "#8b5cf6", "#ec4899"].map(
                    (hex) => (
                      <button
                        key={hex}
                        type="button"
                        className={`color-swatch-btn ${selectedItem.color === hex ? "selected" : ""}`}
                        style={{ background: hex }}
                        onClick={() => {
                          if (onUpdateFolderColor) {
                            onUpdateFolderColor(selectedItem.id, hex);
                          } else {
                            selectedItem.color = hex;
                            showToast(`Folder color accent updated to ${hex}`, "info");
                          }
                        }}
                        title={`Set folder accent to ${hex}`}
                      />
                    )
                  )}
                </div>
              </div>
            </div>
          )
        ) : (
          /* Empty Inspector State */
          <div className="inspector-empty-state">
            <div className="inspector-empty-icon">📁</div>
            <h4>No File Selected</h4>
            <p>Select any file or folder in the Explorer list to inspect its metadata, version lineage, and actions.</p>
          </div>
        )}
      </div>
    </aside>
  );
};

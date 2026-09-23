import React, { useState } from "react";
import {
  FileText,
  Folder,
  ExternalLink,
  FolderOpen,
  GitBranch,
  ShieldCheck,
  Palette,
  X,
  Eye,
  Sparkles,
  Copy,
  Clock,
  Layers,
  Info,
} from "lucide-react";
import { useToast, FileFormatIcon, FilePreviewCanvas } from "./ui/index.js";

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

type InspectorTab = "preview" | "intelligence";

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
  const [activeTab, setActiveTab] = useState<InspectorTab>("preview");

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
      {/* ── Inspector Header ── */}
      <div className="inspector-header">
        <div className="inspector-title">
          {selectedItem ? (
            <>
              <FileFormatIcon
                extension={selectedItem.type === "file" ? selectedItem.ext : ""}
                size={16}
              />
              <span
                className="inspector-title-name"
                title={selectedItem.name}
              >
                {selectedItem.name}
              </span>
            </>
          ) : (
            <>
              <Info size={14} className="inspector-title-icon" color="var(--brand-primary)" />
              <span>Details &amp; Intelligence</span>
            </>
          )}
        </div>
        <button
          type="button"
          className="inspector-close-btn"
          onClick={onClose}
          title="Close Details Pane (Ctrl+I)"
        >
          <X size={15} />
        </button>
      </div>

      {/* ── Two-Tab Strip ── */}
      {selectedItem && (
        <div className="inspector-tab-strip">
          <button
            type="button"
            className={`inspector-tab-btn ${activeTab === "preview" ? "active" : ""}`}
            onClick={() => setActiveTab("preview")}
          >
            <Eye size={13} />
            <span>Preview</span>
          </button>
          <button
            type="button"
            className={`inspector-tab-btn ${activeTab === "intelligence" ? "active" : ""}`}
            onClick={() => setActiveTab("intelligence")}
          >
            <Sparkles size={13} />
            <span>Intelligence</span>
          </button>
        </div>
      )}

      {/* ── Tab Body ── */}
      <div className="inspector-body">
        {selectedItem ? (
          selectedItem.type === "file" ? (
            activeTab === "preview" ? (
              /* ══════════════════════════════════════
                 TAB 1 — PREVIEW (File visual canvas)
                 ══════════════════════════════════════ */
              <div className="inspector-tab-content animate-fade-in">
                {/* Mini identity row */}
                <div className="inspector-preview-identity">
                  <FileFormatIcon extension={selectedItem.ext} size="sm" />
                  <div className="inspector-preview-identity-text">
                    <span className="preview-identity-ext">
                      {selectedItem.ext.toUpperCase()} File
                    </span>
                    <span className="preview-identity-size">
                      {selectedItem.formattedSize ||
                        (selectedItem.sizeBytes
                          ? `${(selectedItem.sizeBytes / (1024 * 1024)).toFixed(1)} MB`
                          : "—")}
                    </span>
                  </div>
                  <span className="preview-identity-version">
                    v{selectedItem.versionNumber || 1}
                  </span>
                </div>

                {/* Full Preview Canvas */}
                <FilePreviewCanvas
                  filename={selectedItem.name}
                  extension={selectedItem.ext}
                  clientName={selectedItem.clientName}
                  projectName={selectedItem.projectName}
                  year={selectedItem.year}
                  versionNumber={selectedItem.versionNumber}
                  formattedSize={selectedItem.formattedSize}
                  sizeBytes={selectedItem.sizeBytes}
                  modifiedAt={selectedItem.modifiedAt}
                  targetPath={selectedItem.targetPath}
                  sha256={selectedItem.sha256}
                />

                {/* Open / Show actions pinned below preview */}
                <div className="inspector-preview-actions">
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
                </div>
              </div>
            ) : (
              /* ══════════════════════════════════════
                 TAB 2 — INTELLIGENCE (Metadata / Actions)
                 ══════════════════════════════════════ */
              <div className="inspector-tab-content animate-fade-in inspector-file-details">
                {/* File Card Header */}
                <div className="inspector-preview-card">
                  <FileFormatIcon extension={selectedItem.ext} size="lg" />
                  <div className="inspector-file-name-block">
                    <h3 className="inspector-file-name" title={selectedItem.name}>
                      {selectedItem.name}
                    </h3>
                    <div className="inspector-version-tag">
                      <GitBranch size={11} />
                      <span>Version v{selectedItem.versionNumber || 1}</span>
                      <span className="dot-sep">•</span>
                      <span>
                        {selectedItem.formattedSize ||
                          (selectedItem.sizeBytes
                            ? `${(selectedItem.sizeBytes / (1024 * 1024)).toFixed(1)} MB`
                            : "—")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Classification Metadata */}
                <div className="inspector-meta-group">
                  <div className="inspector-meta-heading">
                    <Layers size={13} color="var(--brand-primary)" />
                    <span>Classification</span>
                  </div>
                  <div className="inspector-meta-row">
                    <span className="meta-key">Client</span>
                    <span className="meta-val">{selectedItem.clientName || "—"}</span>
                  </div>
                  <div className="inspector-meta-row">
                    <span className="meta-key">Project</span>
                    <span className="meta-val">{selectedItem.projectName || "—"}</span>
                  </div>
                  <div className="inspector-meta-row">
                    <span className="meta-key">Year</span>
                    <span className="meta-val">{selectedItem.year || "—"}</span>
                  </div>
                  <div className="inspector-meta-row">
                    <span className="meta-key">Modified</span>
                    <span className="meta-val">{selectedItem.modifiedAt || "—"}</span>
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
                        showToast(
                          `Forked version v${(selectedItem.versionNumber || 1) + 1} for "${selectedItem.name}"`,
                          "success"
                        );
                      }
                    }}
                  >
                    <GitBranch size={13} /> Create v{(selectedItem.versionNumber || 1) + 1}
                  </button>
                </div>

                {/* Storage Location */}
                <div className="inspector-meta-group">
                  <div className="inspector-meta-heading">
                    <Folder size={13} />
                    <span>Storage Location</span>
                  </div>
                  <div
                    className="inspector-meta-row"
                    style={{ flexDirection: "column", alignItems: "flex-start", gap: 4 }}
                  >
                    <span className="meta-key">Target Path</span>
                    <code
                      className="meta-val code-font"
                      style={{ fontSize: 11, wordBreak: "break-all", textAlign: "left", whiteSpace: "normal" }}
                    >
                      {selectedItem.targetPath ||
                        (selectedItem.clientName
                          ? `Clients\\${selectedItem.clientName}`
                          : "Inbox")}
                    </code>
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
                    <div className="inspector-meta-heading">
                      <Clock size={13} />
                      <span>Version History DAG</span>
                    </div>
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
            )
          ) : (
            /* ══════════════════════════════════════
               FOLDER SELECTED (tab layout too)
               ══════════════════════════════════════ */
            activeTab === "preview" ? (
              <div className="inspector-tab-content animate-fade-in">
                {/* Folder visual preview */}
                <div className="inspector-folder-preview-art">
                  <div
                    className="inspector-folder-big-icon"
                    style={{ color: selectedItem.color || "var(--brand-primary)" }}
                  >
                    <Folder size={64} color={selectedItem.color || "#f59e0b"} strokeWidth={1.2} />
                  </div>
                  <div className="inspector-folder-preview-label">
                    <span className="folder-preview-name">{selectedItem.name}</span>
                    <span className="folder-preview-category">
                      {selectedItem.category?.toUpperCase() || "CLIENT FOLDER"}
                    </span>
                  </div>
                </div>

                {/* Folder Color Customization in preview tab */}
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

                <div className="inspector-preview-actions">
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    style={{ width: "100%" }}
                    onClick={() => handleShowInExplorer(selectedItem.folderPath)}
                  >
                    <FolderOpen size={13} /> Open in Windows Explorer
                  </button>
                </div>
              </div>
            ) : (
              /* Folder — Intelligence tab */
              <div className="inspector-tab-content animate-fade-in inspector-folder-details">
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

                <div className="inspector-actions-grid single-action">
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => handleShowInExplorer(selectedItem.folderPath)}
                  >
                    <FolderOpen size={13} /> Open in Windows Explorer
                  </button>
                </div>

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
          )
        ) : (
          /* ── Empty State ── */
          <div className="inspector-empty-state">
            <div className="inspector-empty-icon">📁</div>
            <h4>No File Selected</h4>
            <p>Select any file or folder in the Explorer list to inspect its preview and intelligence.</p>
          </div>
        )}
      </div>
    </aside>
  );
};

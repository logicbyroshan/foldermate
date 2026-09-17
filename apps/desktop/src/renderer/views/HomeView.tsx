import React from "react";
import {
  Inbox,
  FolderTree,
  FolderOpen,
  Archive,
  AlertCircle,
  FileCheck2,
  Clock,
  ArrowRight,
  Sparkles,
  GitBranch,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { SelectedItem, SelectedFileItem } from "../components/InspectorPanel.js";
import { ExplorerFileEntry } from "./ExplorerView.js";

interface HomeViewProps {
  recentFiles: ExplorerFileEntry[];
  pendingReviewCount: number;
  onNavigateToView: (view: string, targetPath?: string) => void;
  onSelectItem: (item: SelectedItem) => void;
  onOpenFile: (file: ExplorerFileEntry) => void;
  onScanNow: () => void;
  recentEvents: { id: string; type: string; title: string; subtitle: string; time: string }[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  recentFiles,
  pendingReviewCount,
  onNavigateToView,
  onSelectItem,
  onOpenFile,
  onScanNow,
  recentEvents,
}) => {
  const quickAccessFolders = [
    {
      id: "inbox",
      name: "Inbox (Watcher)",
      path: "C:\\FolderMate\\Inbox",
      icon: Inbox,
      color: "#f59e0b",
      badge: "Active Watch",
      onClick: () => onNavigateToView("explorer", "inbox"),
    },
    {
      id: "clients",
      name: "Organized Clients",
      path: "D:\\Clients",
      icon: FolderTree,
      color: "#3b82f6",
      badge: "Root Storage",
      onClick: () => onNavigateToView("clients"),
    },
    {
      id: "review",
      name: "Review Queue",
      path: "Needs Confirmation",
      icon: AlertCircle,
      color: "#ef4444",
      badge: `${pendingReviewCount} Pending`,
      onClick: () => onNavigateToView("review"),
    },
    {
      id: "archive",
      name: "Cold Archive",
      path: "D:\\Archive",
      icon: Archive,
      color: "#8b5cf6",
      badge: "Safe Store",
      onClick: () => onNavigateToView("explorer", "archive"),
    },
  ];

  return (
    <div className="home-view-root animate-fade-in">
      {/* Needs Review Callout Banner (if pending items exist) */}
      {pendingReviewCount > 0 && (
        <div className="home-alert-banner">
          <div className="alert-left">
            <AlertCircle size={20} color="var(--brand-primary)" />
            <div className="alert-text">
              <strong>{pendingReviewCount} Ambiguous files need confirmation</strong>
              <p>FolderMate held these files safely in the Review Queue rather than guessing.</p>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => onNavigateToView("review")}
          >
            Review Files <ArrowRight size={13} />
          </button>
        </div>
      )}

      {/* Quick Access Section */}
      <section className="home-section">
        <div className="section-title-row">
          <span className="section-title">Quick Access</span>
          <button
            type="button"
            className="btn btn-outline btn-xs"
            onClick={onScanNow}
            title="Scan Inbox folder now"
          >
            <Sparkles size={12} /> Trigger Scan Now
          </button>
        </div>

        <div className="quick-access-grid">
          {quickAccessFolders.map((q) => {
            const Icon = q.icon;
            return (
              <div
                key={q.id}
                className="quick-access-card"
                onClick={q.onClick}
                role="button"
                tabIndex={0}
              >
                <div className="quick-access-icon" style={{ background: `${q.color}22` }}>
                  <Icon size={20} color={q.color} />
                </div>
                <div className="quick-access-details">
                  <span className="quick-access-name">{q.name}</span>
                  <span className="quick-access-path">{q.path}</span>
                </div>
                <span className="quick-access-pill">{q.badge}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Files Section */}
      <section className="home-section">
        <div className="section-title-row">
          <span className="section-title">Recent Files</span>
          <button
            type="button"
            className="section-link-btn"
            onClick={() => onNavigateToView("search")}
          >
            Search all files →
          </button>
        </div>

        <div className="explorer-details-table-wrapper home-table-wrapper">
          <table className="explorer-table">
            <thead>
              <tr>
                <th className="col-name">Name</th>
                <th className="col-type">Format</th>
                <th className="col-client">Client / Project</th>
                <th className="col-date">Date Modified</th>
                <th className="col-size" style={{ textAlign: "right" }}>Size</th>
                <th className="col-status" style={{ textAlign: "center" }}>Version</th>
              </tr>
            </thead>
            <tbody>
              {recentFiles.map((file) => (
                <tr
                  key={file.id}
                  className="explorer-row file-row"
                  onClick={() =>
                    onSelectItem({
                      type: "file",
                      id: file.id,
                      name: file.name,
                      ext: file.ext,
                      extColor: file.extColor,
                      extBg: file.extBg,
                      clientName: file.clientName,
                      projectName: file.projectName,
                      year: file.year,
                      versionNumber: file.versionNumber,
                      sizeBytes: file.sizeBytes,
                      formattedSize: file.formattedSize,
                      modifiedAt: file.modifiedAt,
                      targetPath: file.targetPath,
                      sha256: file.sha256,
                      lineage: file.lineage,
                    })
                  }
                  onDoubleClick={() => onOpenFile(file)}
                >
                  <td className="col-name">
                    <div className="row-name-content">
                      <span
                        className="file-format-badge"
                        style={{ background: file.extBg, color: file.extColor }}
                      >
                        {file.ext.toUpperCase()}
                      </span>
                      <span className="entry-name-label">{file.name}</span>
                    </div>
                  </td>
                  <td className="col-type">
                    <span className="type-badge file-badge">{file.ext.toUpperCase()}</span>
                  </td>
                  <td className="col-client">
                    <span className="client-subtext">
                      {file.clientName ? `${file.clientName} / ${file.projectName || "General"}` : "Unassigned"}
                    </span>
                  </td>
                  <td className="col-date">{file.modifiedAt || "Today"}</td>
                  <td className="col-size" style={{ textAlign: "right" }}>
                    {file.formattedSize || "—"}
                  </td>
                  <td className="col-status" style={{ textAlign: "center" }}>
                    <span className="version-tag-pill">v{file.versionNumber || 1}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Live Background Activity Log */}
      <section className="home-section">
        <div className="section-title-row">
          <span className="section-title">Background Activity</span>
          <span className="activity-live-badge">● Live Daemon Events</span>
        </div>

        <div className="home-activity-list">
          {recentEvents.map((evt) => {
            const t = (evt.type || "").toLowerCase();
            return (
              <div key={evt.id} className="activity-item">
                <div className="activity-icon-badge">
                  {t === "organized" ? (
                    <FileCheck2 size={14} color="var(--status-success)" />
                  ) : t === "review" ? (
                    <AlertCircle size={14} color="var(--brand-primary)" />
                  ) : (
                    <ShieldCheck size={14} color="var(--status-info)" />
                  )}
                </div>
                <div className="activity-info">
                  <span className="activity-title">{evt.title}</span>
                  <span className="activity-subtitle">{evt.subtitle}</span>
                </div>
                <span className="activity-time">{evt.time}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

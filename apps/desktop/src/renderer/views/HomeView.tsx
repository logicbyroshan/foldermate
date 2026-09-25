import React from "react";
import {
  Inbox,
  FolderTree,
  Archive,
  AlertCircle,
  Pin,
  ArrowRight,
  Monitor,
  Download,
  FileText,
  FileImage,
  FileSpreadsheet,
} from "lucide-react";
import { SelectedItem } from "../components/InspectorPanel.js";
import { ExplorerFileEntry } from "../types/explorer.js";
import { FileFormatIcon } from "../components/ui/index.js";

interface HomeViewProps {
  recentFiles: ExplorerFileEntry[];
  pendingReviewCount: number;
  onNavigateToView: (view: string, targetPath?: string) => void;
  onSelectItem: (item: SelectedItem) => void;
  onOpenFile: (file: ExplorerFileEntry) => void;
  onScanNow: () => void;
  recentEvents?: { id: string; type: string; title: string; subtitle: string; time: string }[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  recentFiles,
  pendingReviewCount,
  onNavigateToView,
  onSelectItem,
  onOpenFile,
}) => {
  const quickAccessFolders = [
    {
      id: "inbox",
      name: "Inbox",
      path: "C:\\FolderMate\\Inbox",
      icon: Inbox,
      color: "#f59e0b",
      badge: "Watch Folder",
      onClick: () => onNavigateToView("explorer", "C:\\FolderMate\\Inbox"),
    },
    {
      id: "clients",
      name: "Clients",
      path: "D:\\Clients",
      icon: FolderTree,
      color: "#3b82f6",
      badge: "Root Storage",
      onClick: () => onNavigateToView("clients", "D:\\Clients"),
    },
    {
      id: "desktop",
      name: "Desktop",
      path: "C:\\Users\\Public\\Desktop",
      icon: Monitor,
      color: "#06b6d4",
      badge: "User Folder",
      onClick: () => onNavigateToView("explorer", "D:\\Clients"),
    },
    {
      id: "downloads",
      name: "Downloads",
      path: "C:\\Users\\Downloads",
      icon: Download,
      color: "#10b981",
      badge: "System",
      onClick: () => onNavigateToView("explorer", "C:\\FolderMate\\Inbox"),
    },
    {
      id: "documents",
      name: "Documents",
      path: "D:\\Clients\\Projects",
      icon: FileText,
      color: "#8b5cf6",
      badge: "Storage",
      onClick: () => onNavigateToView("clients", "D:\\Clients"),
    },
    {
      id: "archive",
      name: "Archive",
      path: "D:\\Archive",
      icon: Archive,
      color: "#64748b",
      badge: "Cold Store",
      onClick: () => onNavigateToView("explorer", "D:\\Archive"),
    },
  ];

  const getFormatIcon = (ext: string) => {
    const e = (ext || "").toLowerCase().replace(".", "");
    switch (e) {
      case "cdr":
      case "ai":
      case "psd":
      case "png":
      case "jpg":
        return <FileImage size={15} color="var(--brand-primary)" />;
      case "xlsx":
      case "xls":
      case "csv":
        return <FileSpreadsheet size={15} color="#10b981" />;
      default:
        return <FileText size={15} color="#3b82f6" />;
    }
  };

  return (
    <div className="win11-home-view animate-fade-in">
      {/* Windows 11 Info Notice (only if Review Queue items need confirmation) */}
      {pendingReviewCount > 0 && (
        <div className="win11-info-bar">
          <div className="info-bar-left">
            <AlertCircle size={16} className="info-bar-icon" />
            <span className="info-bar-message">
              <strong>Review Queue:</strong> {pendingReviewCount} incoming files require classification approval before routing.
            </span>
          </div>
          <button
            type="button"
            className="win11-info-bar-btn"
            onClick={() => onNavigateToView("review")}
          >
            Review Files <ArrowRight size={13} />
          </button>
        </div>
      )}

      {/* SECTION 1: QUICK ACCESS PINNED FOLDERS */}
      <section className="win11-section">
        <div className="win11-section-header">
          <span className="win11-section-title">Quick access</span>
          <span className="win11-section-sub">Pinned folders</span>
        </div>

        <div className="win11-quick-access-grid">
          {quickAccessFolders.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                className="win11-quick-tile"
                onClick={item.onClick}
                role="button"
                tabIndex={0}
                title={`Open ${item.path}`}
              >
                <div className="quick-tile-icon-wrap" style={{ background: `${item.color}18` }}>
                  <IconComponent size={20} color={item.color} />
                </div>
                <div className="quick-tile-info">
                  <div className="quick-tile-name-row">
                    <span className="quick-tile-name">{item.name}</span>
                    <Pin size={11} className="pin-icon" />
                  </div>
                  <span className="quick-tile-path">{item.path}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: FAVORITES & RECENT FILES */}
      <section className="win11-section">
        <div className="win11-section-header">
          <span className="win11-section-title">Recent files</span>
          <button
            type="button"
            className="win11-link-btn"
            onClick={() => onNavigateToView("search")}
          >
            Search all indexed files →
          </button>
        </div>

        <div className="win11-details-table-wrapper">
          <table className="win11-table">
            <thead>
              <tr>
                <th className="th-name">Name</th>
                <th className="th-date">Date modified</th>
                <th className="th-type">Type</th>
                <th className="th-size" style={{ textAlign: "right" }}>Size</th>
                <th className="th-path">Folder location</th>
              </tr>
            </thead>
            <tbody>
              {recentFiles.map((file) => (
                <tr
                  key={file.id}
                  className="win11-table-row"
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
                  <td className="td-name">
                    <div className="file-entry-cell">
                      <FileFormatIcon extension={file.ext} size="sm" />
                      <span className="file-entry-label" title={file.name}>
                        {file.name}
                      </span>
                    </div>
                  </td>
                  <td className="td-date">{file.modifiedAt || "Today"}</td>
                  <td className="td-type">
                    <span className="file-format-desc">
                      {file.ext.toUpperCase()} Document
                    </span>
                  </td>
                  <td className="td-size" style={{ textAlign: "right" }}>
                    {file.formattedSize || (file.sizeBytes ? `${(file.sizeBytes / (1024 * 1024)).toFixed(1)} MB` : "—")}
                  </td>
                  <td className="td-path">
                    <span className="file-location-path">
                      {file.targetPath || (file.clientName ? `Clients\\${file.clientName}` : "Inbox")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

import React, { useState, useMemo } from "react";
import {
  Folder,
  FileText,
  ChevronRight,
  GitBranch,
  ExternalLink,
  FolderOpen,
  ArrowUpDown,
  FileCode,
  FileSpreadsheet,
  FileImage,
  FileArchive,
} from "lucide-react";
import { SelectedItem, SelectedFileItem, SelectedFolderItem } from "../components/InspectorPanel.js";
import { ViewMode } from "../components/ExplorerHeader.js";

export interface ExplorerFolderEntry {
  id: string;
  name: string;
  type: "folder";
  color?: string;
  clientCode?: string;
  projectCount?: number;
  fileCount?: number;
  totalSize?: string;
  modifiedAt?: string;
  folderPath?: string;
}

export interface ExplorerFileEntry {
  id: string;
  name: string;
  type: "file";
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

export type ExplorerEntry = ExplorerFolderEntry | ExplorerFileEntry;

interface ExplorerViewProps {
  entries: ExplorerEntry[];
  currentLocationName: string;
  viewMode: ViewMode;
  searchQuery: string;
  selectedItem: SelectedItem;
  onSelectItem: (item: SelectedItem) => void;
  onOpenFolder: (folder: ExplorerFolderEntry) => void;
  onOpenFile: (file: ExplorerFileEntry) => void;
  onRefresh?: () => void;
}

type SortField = "name" | "type" | "modifiedAt" | "size";
type SortDirection = "asc" | "desc";

export const ExplorerView: React.FC<ExplorerViewProps> = ({
  entries,
  currentLocationName,
  viewMode,
  searchQuery,
  selectedItem,
  onSelectItem,
  onOpenFolder,
  onOpenFile,
}) => {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedEntries = useMemo(() => {
    let result = entries;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          (e.type === "file" && (e.clientName?.toLowerCase().includes(q) || e.projectName?.toLowerCase().includes(q)))
      );
    }

    return [...result].sort((a, b) => {
      // Folders always precede files in Windows File Explorer
      if (a.type !== b.type) {
        return a.type === "folder" ? -1 : 1;
      }

      let cmp = 0;
      if (sortField === "name") {
        cmp = a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" });
      } else if (sortField === "type") {
        const typeA = a.type === "folder" ? "Folder" : (a as ExplorerFileEntry).ext;
        const typeB = b.type === "folder" ? "Folder" : (b as ExplorerFileEntry).ext;
        cmp = typeA.localeCompare(typeB);
      } else if (sortField === "modifiedAt") {
        cmp = (a.modifiedAt || "").localeCompare(b.modifiedAt || "");
      } else if (sortField === "size") {
        const sizeA = (a as ExplorerFileEntry).sizeBytes || 0;
        const sizeB = (b as ExplorerFileEntry).sizeBytes || 0;
        cmp = sizeA - sizeB;
      }

      return sortDirection === "asc" ? cmp : -cmp;
    });
  }, [entries, searchQuery, sortField, sortDirection]);

  const getFormatIcon = (ext: string, color: string) => {
    switch (ext.toLowerCase()) {
      case "cdr":
      case "ai":
      case "psd":
      case "svg":
      case "png":
      case "jpg":
        return <FileImage size={15} color={color} />;
      case "pdf":
      case "doc":
      case "docx":
        return <FileText size={15} color={color} />;
      case "xlsx":
      case "csv":
        return <FileSpreadsheet size={15} color={color} />;
      case "zip":
      case "rar":
        return <FileArchive size={15} color={color} />;
      default:
        return <FileCode size={15} color={color} />;
    }
  };

  return (
    <div className="explorer-view-root">
      {filteredAndSortedEntries.length === 0 ? (
        <div className="explorer-empty-folder">
          <div className="empty-folder-icon">📁</div>
          <h3>This folder is empty</h3>
          <p>
            {searchQuery
              ? `No files or folders match "${searchQuery}".`
              : "Drop design files into your Inbox to organize them automatically."}
          </p>
        </div>
      ) : viewMode === "details" ? (
        /* Details Table View (Default Windows Explorer Mode) */
        <div className="explorer-details-table-wrapper">
          <table className="explorer-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("name")} className="col-name sortable">
                  <div className="th-content">
                    <span>Name</span>
                    {sortField === "name" && (
                      <span className="sort-arrow">{sortDirection === "asc" ? "▲" : "▼"}</span>
                    )}
                  </div>
                </th>
                <th onClick={() => handleSort("type")} className="col-type sortable">
                  <div className="th-content">
                    <span>Type</span>
                    {sortField === "type" && (
                      <span className="sort-arrow">{sortDirection === "asc" ? "▲" : "▼"}</span>
                    )}
                  </div>
                </th>
                <th className="col-client">Client / Project</th>
                <th onClick={() => handleSort("modifiedAt")} className="col-date sortable">
                  <div className="th-content">
                    <span>Date modified</span>
                    {sortField === "modifiedAt" && (
                      <span className="sort-arrow">{sortDirection === "asc" ? "▲" : "▼"}</span>
                    )}
                  </div>
                </th>
                <th onClick={() => handleSort("size")} className="col-size sortable" style={{ textAlign: "right" }}>
                  <div className="th-content" style={{ justifyContent: "flex-end" }}>
                    <span>Size</span>
                    {sortField === "size" && (
                      <span className="sort-arrow">{sortDirection === "asc" ? "▲" : "▼"}</span>
                    )}
                  </div>
                </th>
                <th className="col-status" style={{ textAlign: "center" }}>Version</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedEntries.map((entry) => {
                const isSelected = selectedItem?.id === entry.id;

                if (entry.type === "folder") {
                  return (
                    <tr
                      key={entry.id}
                      className={`explorer-row folder-row ${isSelected ? "selected" : ""}`}
                      onClick={() =>
                        onSelectItem({
                          type: "folder",
                          id: entry.id,
                          name: entry.name,
                          color: entry.color,
                          folderPath: entry.folderPath,
                          projectCount: entry.projectCount,
                          fileCount: entry.fileCount,
                          latestActivity: entry.modifiedAt,
                        })
                      }
                      onDoubleClick={() => onOpenFolder(entry)}
                    >
                      <td className="col-name">
                        <div className="row-name-content">
                          <Folder
                            size={18}
                            color={entry.color || "var(--brand-primary)"}
                            className="folder-icon"
                          />
                          <span className="entry-name-label">{entry.name}</span>
                        </div>
                      </td>
                      <td className="col-type">
                        <span className="type-badge folder-badge">Folder</span>
                      </td>
                      <td className="col-client">
                        <span className="client-subtext">
                          {entry.projectCount ? `${entry.projectCount} Projects` : "Folder"}
                        </span>
                      </td>
                      <td className="col-date">{entry.modifiedAt || "Yesterday"}</td>
                      <td className="col-size" style={{ textAlign: "right" }}>
                        {entry.totalSize || "—"}
                      </td>
                      <td className="col-status" style={{ textAlign: "center" }}>
                        <span className="folder-pill">
                          {entry.fileCount !== undefined ? `${entry.fileCount} files` : "Folder"}
                        </span>
                      </td>
                    </tr>
                  );
                }

                // File Row
                const file = entry as ExplorerFileEntry;
                return (
                  <tr
                    key={file.id}
                    className={`explorer-row file-row ${isSelected ? "selected" : ""}`}
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
                      <span className="type-badge file-badge">
                        {file.ext.toUpperCase()} File
                      </span>
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
                      <span className="version-tag-pill">
                        v{file.versionNumber || 1}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : viewMode === "list" ? (
        /* Compact Multi-Column List View */
        <div className="explorer-list-view">
          {filteredAndSortedEntries.map((entry) => {
            const isSelected = selectedItem?.id === entry.id;
            const isFolder = entry.type === "folder";

            return (
              <div
                key={entry.id}
                className={`explorer-list-item ${isSelected ? "selected" : ""}`}
                onClick={() => {
                  if (isFolder) {
                    onSelectItem({
                      type: "folder",
                      id: entry.id,
                      name: entry.name,
                      color: entry.color,
                      folderPath: (entry as ExplorerFolderEntry).folderPath,
                      fileCount: (entry as ExplorerFolderEntry).fileCount,
                    });
                  } else {
                    const f = entry as ExplorerFileEntry;
                    onSelectItem({
                      type: "file",
                      id: f.id,
                      name: f.name,
                      ext: f.ext,
                      extColor: f.extColor,
                      extBg: f.extBg,
                      clientName: f.clientName,
                      projectName: f.projectName,
                      versionNumber: f.versionNumber,
                      formattedSize: f.formattedSize,
                      targetPath: f.targetPath,
                      sha256: f.sha256,
                    });
                  }
                }}
                onDoubleClick={() => {
                  if (isFolder) onOpenFolder(entry as ExplorerFolderEntry);
                  else onOpenFile(entry as ExplorerFileEntry);
                }}
              >
                {isFolder ? (
                  <Folder size={18} color={(entry as ExplorerFolderEntry).color || "var(--brand-primary)"} />
                ) : (
                  <span
                    className="file-format-badge-sm"
                    style={{ background: (entry as ExplorerFileEntry).extBg, color: (entry as ExplorerFileEntry).extColor }}
                  >
                    {(entry as ExplorerFileEntry).ext.toUpperCase()}
                  </span>
                )}
                <span className="list-item-name">{entry.name}</span>
              </div>
            );
          })}
        </div>
      ) : (
        /* Icons Grid View */
        <div className="explorer-icons-grid">
          {filteredAndSortedEntries.map((entry) => {
            const isSelected = selectedItem?.id === entry.id;
            const isFolder = entry.type === "folder";

            return (
              <div
                key={entry.id}
                className={`explorer-icon-card ${isSelected ? "selected" : ""}`}
                onClick={() => {
                  if (isFolder) {
                    onSelectItem({
                      type: "folder",
                      id: entry.id,
                      name: entry.name,
                      color: entry.color,
                      folderPath: (entry as ExplorerFolderEntry).folderPath,
                      fileCount: (entry as ExplorerFolderEntry).fileCount,
                    });
                  } else {
                    const f = entry as ExplorerFileEntry;
                    onSelectItem({
                      type: "file",
                      id: f.id,
                      name: f.name,
                      ext: f.ext,
                      extColor: f.extColor,
                      extBg: f.extBg,
                      clientName: f.clientName,
                      projectName: f.projectName,
                      versionNumber: f.versionNumber,
                      formattedSize: f.formattedSize,
                      targetPath: f.targetPath,
                      sha256: f.sha256,
                    });
                  }
                }}
                onDoubleClick={() => {
                  if (isFolder) onOpenFolder(entry as ExplorerFolderEntry);
                  else onOpenFile(entry as ExplorerFileEntry);
                }}
              >
                <div className="icon-card-visual">
                  {isFolder ? (
                    <Folder size={44} color={(entry as ExplorerFolderEntry).color || "var(--brand-primary)"} />
                  ) : (
                    <div
                      className="icon-card-file-badge"
                      style={{ background: (entry as ExplorerFileEntry).extBg, color: (entry as ExplorerFileEntry).extColor }}
                    >
                      {(entry as ExplorerFileEntry).ext.toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="icon-card-label" title={entry.name}>
                  {entry.name}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Explorer Bottom Status Bar */}
      <footer className="explorer-status-bar">
        <span>{filteredAndSortedEntries.length} items</span>
        {selectedItem && (
          <span className="status-selection-info">
            Selected: <strong>{selectedItem.name}</strong>
          </span>
        )}
      </footer>
    </div>
  );
};

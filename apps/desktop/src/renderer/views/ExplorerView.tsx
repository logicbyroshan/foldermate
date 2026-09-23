import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  Folder,
  FileText,
  GitBranch,
  ExternalLink,
  FolderOpen,
  FileCode,
  FileSpreadsheet,
  FileImage,
  FileArchive,
  Copy,
  Edit2,
  Trash2,
  Eye,
  Sliders,
  Sparkles,
  Info,
  Check,
  LayoutList,
  LayoutGrid,
} from "lucide-react";
import { SelectedItem, SelectedFileItem, SelectedFolderItem } from "../components/InspectorPanel.js";
import { ViewMode } from "../components/ExplorerHeader.js";
import { useToast } from "../components/ui/Toast.js";

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
  onChangeViewMode?: (mode: ViewMode) => void;
  searchQuery: string;
  selectedItem: SelectedItem;
  onSelectItem: (item: SelectedItem) => void;
  onOpenFolder: (folder: ExplorerFolderEntry) => void;
  onOpenFile: (file: ExplorerFileEntry) => void;
  onRefresh?: () => void;
  onShowInFolder?: (path: string) => void;
  onFolderAppearance?: (folder: ExplorerFolderEntry) => void;
}

type SortField = "name" | "type" | "modifiedAt" | "size";
type SortDirection = "asc" | "desc";

const VIEW_MODES_ORDER: ViewMode[] = [
  "details",
  "list",
  "small-icons",
  "medium-icons",
  "large-icons",
  "extra-large-icons",
];

interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  entry: ExplorerEntry | null;
}

export const ExplorerView: React.FC<ExplorerViewProps> = ({
  entries,
  currentLocationName,
  viewMode,
  onChangeViewMode,
  searchQuery,
  selectedItem,
  onSelectItem,
  onOpenFolder,
  onOpenFile,
  onRefresh,
  onShowInFolder,
  onFolderAppearance,
}) => {
  const { addToast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  // Sorting State
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Multi-Selection State (Set of Entry IDs)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [lastClickedId, setLastClickedId] = useState<string | null>(null);

  // Inline Rename State (F2)
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    isOpen: false,
    x: 0,
    y: 0,
    entry: null,
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter and Sort Entries
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

  // Synchronize Inspector selection when selectedIds change
  const handleItemClick = (entry: ExplorerEntry, e: React.MouseEvent) => {
    const isCtrl = e.ctrlKey || e.metaKey;
    const isShift = e.shiftKey;

    if (isShift && lastClickedId) {
      // Range selection (Shift + Click)
      const currentIndex = filteredAndSortedEntries.findIndex((item) => item.id === entry.id);
      const lastIndex = filteredAndSortedEntries.findIndex((item) => item.id === lastClickedId);

      if (currentIndex !== -1 && lastIndex !== -1) {
        const start = Math.min(currentIndex, lastIndex);
        const end = Math.max(currentIndex, lastIndex);
        const rangeIds = new Set<string>();
        for (let i = start; i <= end; i++) {
          rangeIds.add(filteredAndSortedEntries[i].id);
        }
        setSelectedIds(rangeIds);
      }
    } else if (isCtrl) {
      // Toggle selection (Ctrl + Click)
      const newSelected = new Set(selectedIds);
      if (newSelected.has(entry.id)) {
        newSelected.delete(entry.id);
      } else {
        newSelected.add(entry.id);
      }
      setSelectedIds(newSelected);
      setLastClickedId(entry.id);
    } else {
      // Single selection
      setSelectedIds(new Set([entry.id]));
      setLastClickedId(entry.id);
    }

    // Set Inspector Selected Item
    if (entry.type === "folder") {
      onSelectItem({
        type: "folder",
        id: entry.id,
        name: entry.name,
        color: entry.color,
        folderPath: entry.folderPath,
        projectCount: entry.projectCount,
        fileCount: entry.fileCount,
        latestActivity: entry.modifiedAt,
      });
    } else {
      const file = entry as ExplorerFileEntry;
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
      });
    }
  };

  // Ctrl + Mouse Wheel Zoom / View Scaling Handler
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey && onChangeViewMode) {
        e.preventDefault();
        const currentIndex = VIEW_MODES_ORDER.indexOf(viewMode);
        if (currentIndex === -1) return;

        if (e.deltaY < 0) {
          // Zoom In (Increase size)
          const nextIndex = Math.min(currentIndex + 1, VIEW_MODES_ORDER.length - 1);
          if (nextIndex !== currentIndex) {
            onChangeViewMode(VIEW_MODES_ORDER[nextIndex]);
          }
        } else if (e.deltaY > 0) {
          // Zoom Out (Decrease size)
          const prevIndex = Math.max(currentIndex - 1, 0);
          if (prevIndex !== currentIndex) {
            onChangeViewMode(VIEW_MODES_ORDER[prevIndex]);
          }
        }
      }
    },
    [viewMode, onChangeViewMode]
  );

  // Keyboard Shortcuts within Explorer View
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName;
      if (activeTag === "INPUT" || activeTag === "TEXTAREA") return;

      // Ctrl + A: Select All
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
        e.preventDefault();
        const allIds = new Set(filteredAndSortedEntries.map((i) => i.id));
        setSelectedIds(allIds);
        return;
      }

      // F2: Start Inline Rename on current selection
      if (e.key === "F2") {
        e.preventDefault();
        if (selectedItem) {
          const entry = filteredAndSortedEntries.find((item) => item.id === selectedItem.id);
          if (entry) {
            setRenamingId(entry.id);
            setRenameValue(entry.name);
          }
        }
        return;
      }

      // Enter: Open Selected Item
      if (e.key === "Enter") {
        if (selectedItem && !renamingId) {
          e.preventDefault();
          const entry = filteredAndSortedEntries.find((item) => item.id === selectedItem.id);
          if (entry) {
            if (entry.type === "folder") onOpenFolder(entry as ExplorerFolderEntry);
            else onOpenFile(entry as ExplorerFileEntry);
          }
        }
        return;
      }

      // Escape: Close context menu, cancel rename, or clear selection
      if (e.key === "Escape") {
        if (contextMenu.isOpen) {
          closeContextMenu();
        } else if (renamingId) {
          setRenamingId(null);
        } else {
          setSelectedIds(new Set());
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", closeContextMenu);
    window.addEventListener("blur", closeContextMenu);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", closeContextMenu);
      window.removeEventListener("blur", closeContextMenu);
    };
  }, [filteredAndSortedEntries, selectedItem, renamingId, contextMenu.isOpen, onOpenFolder, onOpenFile]);

  // Focus rename input on activation
  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
      // Select name without extension if it's a file
      const dotIndex = renameValue.lastIndexOf(".");
      if (dotIndex > 0) {
        renameInputRef.current.setSelectionRange(0, dotIndex);
      } else {
        renameInputRef.current.select();
      }
    }
  }, [renamingId]);

  const handleRenameSubmit = (entry: ExplorerEntry) => {
    if (!renameValue.trim() || renameValue === entry.name) {
      setRenamingId(null);
      return;
    }

    addToast({
      title: "Item Renamed",
      message: `Renamed "${entry.name}" to "${renameValue.trim()}".`,
      variant: "success",
    });
    setRenamingId(null);
  };

  // Open Context Menu
  const handleContextMenu = (e: React.MouseEvent, entry?: ExplorerEntry) => {
    e.preventDefault();
    e.stopPropagation();

    if (entry) {
      if (!selectedIds.has(entry.id)) {
        setSelectedIds(new Set([entry.id]));
        setLastClickedId(entry.id);
        if (entry.type === "folder") {
          onSelectItem({
            type: "folder",
            id: entry.id,
            name: entry.name,
            color: entry.color,
            folderPath: entry.folderPath,
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
            targetPath: f.targetPath,
          });
        }
      }
    }

    // Keep menu within viewport bounds
    const menuWidth = 220;
    const menuHeight = 260;
    const posX = Math.min(e.clientX, window.innerWidth - menuWidth - 10);
    const posY = Math.min(e.clientY, window.innerHeight - menuHeight - 10);

    setContextMenu({
      isOpen: true,
      x: posX,
      y: posY,
      entry: entry || null,
    });
  };

  const closeContextMenu = () => {
    setContextMenu((prev) => ({ ...prev, isOpen: false }));
  };

  const calculateSelectedStats = () => {
    let folderCount = 0;
    let fileCount = 0;
    let totalBytes = 0;

    selectedIds.forEach((id) => {
      const entry = filteredAndSortedEntries.find((item) => item.id === id);
      if (entry) {
        if (entry.type === "folder") {
          folderCount++;
        } else {
          fileCount++;
          totalBytes += (entry as ExplorerFileEntry).sizeBytes || 0;
        }
      }
    });

    const formatBytes = (bytes: number) => {
      if (!bytes) return "0 B";
      if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
      if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${bytes} B`;
    };

    return { folderCount, fileCount, formattedBytes: formatBytes(totalBytes) };
  };

  const stats = calculateSelectedStats();

  return (
    <div
      ref={containerRef}
      className="explorer-view-root"
      onWheel={handleWheel}
      onContextMenu={(e) => handleContextMenu(e)}
      onClick={() => {
        closeContextMenu();
      }}
      style={{ display: "flex", flexDirection: "column", flex: 1, height: "100%", overflow: "hidden" }}
    >
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 12px 16px" }}>
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
          /* ============================================================
             1. DETAILS VIEW (Sortable Columns Table)
             ============================================================ */
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
                  <th className="col-status" style={{ textAlign: "center" }}>
                    Version
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedEntries.map((entry) => {
                  const isSelected = selectedIds.has(entry.id);
                  const isRenaming = renamingId === entry.id;

                  if (entry.type === "folder") {
                    return (
                      <tr
                        key={entry.id}
                        className={`explorer-row folder-row ${isSelected ? "selected selected-row" : ""}`}
                        onClick={(e) => handleItemClick(entry, e)}
                        onDoubleClick={() => onOpenFolder(entry)}
                        onContextMenu={(e) => handleContextMenu(e, entry)}
                      >
                        <td className="col-name">
                          <div className="row-name-content">
                            <Folder
                              size={18}
                              color={entry.color || "var(--brand-primary)"}
                              className="folder-icon"
                            />
                            {isRenaming ? (
                              <input
                                ref={renameInputRef}
                                type="text"
                                className="inline-rename-input"
                                value={renameValue}
                                onChange={(e) => setRenameValue(e.target.value)}
                                onBlur={() => handleRenameSubmit(entry)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleRenameSubmit(entry);
                                  if (e.key === "Escape") setRenamingId(null);
                                }}
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : (
                              <span className="entry-name-label">{entry.name}</span>
                            )}
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

                  // File Entry Row
                  const file = entry as ExplorerFileEntry;
                  return (
                    <tr
                      key={file.id}
                      className={`explorer-row file-row ${isSelected ? "selected selected-row" : ""}`}
                      onClick={(e) => handleItemClick(file, e)}
                      onDoubleClick={() => onOpenFile(file)}
                      onContextMenu={(e) => handleContextMenu(e, file)}
                    >
                      <td className="col-name">
                        <div className="row-name-content">
                          <span
                            className="file-format-badge"
                            style={{ background: file.extBg, color: file.extColor }}
                          >
                            {file.ext.toUpperCase()}
                          </span>
                          {isRenaming ? (
                            <input
                              ref={renameInputRef}
                              type="text"
                              className="inline-rename-input"
                              value={renameValue}
                              onChange={(e) => setRenameValue(e.target.value)}
                              onBlur={() => handleRenameSubmit(file)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleRenameSubmit(file);
                                if (e.key === "Escape") setRenamingId(null);
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <span className="entry-name-label">{file.name}</span>
                          )}
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
          /* ============================================================
             2. LIST VIEW (Compact Multi-Column Rows)
             ============================================================ */
          <div className="explorer-list-view">
            {filteredAndSortedEntries.map((entry) => {
              const isSelected = selectedIds.has(entry.id);
              const isFolder = entry.type === "folder";
              const isRenaming = renamingId === entry.id;

              return (
                <div
                  key={entry.id}
                  className={`explorer-list-item ${isSelected ? "selected selected-row" : ""}`}
                  onClick={(e) => handleItemClick(entry, e)}
                  onDoubleClick={() => {
                    if (isFolder) onOpenFolder(entry as ExplorerFolderEntry);
                    else onOpenFile(entry as ExplorerFileEntry);
                  }}
                  onContextMenu={(e) => handleContextMenu(e, entry)}
                >
                  {isFolder ? (
                    <Folder size={18} color={(entry as ExplorerFolderEntry).color || "var(--brand-primary)"} />
                  ) : (
                    <span
                      className="file-format-badge-sm"
                      style={{
                        background: (entry as ExplorerFileEntry).extBg,
                        color: (entry as ExplorerFileEntry).extColor,
                      }}
                    >
                      {(entry as ExplorerFileEntry).ext.toUpperCase()}
                    </span>
                  )}

                  {isRenaming ? (
                    <input
                      ref={renameInputRef}
                      type="text"
                      className="inline-rename-input"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={() => handleRenameSubmit(entry)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRenameSubmit(entry);
                        if (e.key === "Escape") setRenamingId(null);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="list-item-name">{entry.name}</span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* ============================================================
             3. ICONS VIEW (Small, Medium, Large, Extra Large Grid)
             ============================================================ */
          <div className={`explorer-icons-grid view-${viewMode}`}>
            {filteredAndSortedEntries.map((entry) => {
              const isSelected = selectedIds.has(entry.id);
              const isFolder = entry.type === "folder";
              const isRenaming = renamingId === entry.id;

              return (
                <div
                  key={entry.id}
                  className={`explorer-icon-card ${isSelected ? "selected selected-row" : ""}`}
                  onClick={(e) => handleItemClick(entry, e)}
                  onDoubleClick={() => {
                    if (isFolder) onOpenFolder(entry as ExplorerFolderEntry);
                    else onOpenFile(entry as ExplorerFileEntry);
                  }}
                  onContextMenu={(e) => handleContextMenu(e, entry)}
                >
                  <div className="icon-card-visual">
                    {isFolder ? (
                      <Folder
                        size={
                          viewMode === "small-icons"
                            ? 24
                            : viewMode === "medium-icons"
                            ? 44
                            : viewMode === "large-icons"
                            ? 64
                            : 96
                        }
                        color={(entry as ExplorerFolderEntry).color || "var(--brand-primary)"}
                      />
                    ) : (
                      <div
                        className="icon-card-file-badge"
                        style={{
                          background: (entry as ExplorerFileEntry).extBg,
                          color: (entry as ExplorerFileEntry).extColor,
                        }}
                      >
                        {(entry as ExplorerFileEntry).ext.toUpperCase()}
                      </div>
                    )}
                  </div>

                  {isRenaming ? (
                    <input
                      ref={renameInputRef}
                      type="text"
                      className="inline-rename-input"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={() => handleRenameSubmit(entry)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRenameSubmit(entry);
                        if (e.key === "Escape") setRenamingId(null);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="icon-card-label" title={entry.name}>
                      {entry.name}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ============================================================
         WINDOWS EXPLORER BOTTOM STATUS BAR
         ============================================================ */}
      <footer className="explorer-status-bar">
        <div className="status-bar-section">
          <span>{filteredAndSortedEntries.length} items</span>
          <span className="status-bar-divider" />
          {selectedIds.size > 0 ? (
            <span className="status-selection-info">
              <strong>{selectedIds.size}</strong> selected
              {stats.fileCount > 0 && ` (${stats.formattedBytes})`}
            </span>
          ) : (
            <span>Ready</span>
          )}
        </div>

        <div className="status-bar-section">
          <button
            type="button"
            className={`win11-icon-btn ${viewMode === "details" ? "active" : ""}`}
            style={{ width: 24, height: 24 }}
            onClick={() => onChangeViewMode?.("details")}
            title="Details view (Ctrl+1)"
          >
            <LayoutList size={13} />
          </button>
          <button
            type="button"
            className={`win11-icon-btn ${viewMode === "large-icons" ? "active" : ""}`}
            style={{ width: 24, height: 24 }}
            onClick={() => onChangeViewMode?.("large-icons")}
            title="Large icons view (Ctrl+5)"
          >
            <LayoutGrid size={13} />
          </button>
        </div>
      </footer>

      {/* ============================================================
         WINDOWS CONTEXT MENU MODAL OVERLAY
         ============================================================ */}
      {contextMenu.isOpen && (
        <>
          <div className="explorer-context-menu-backdrop" onClick={closeContextMenu} />
          <div
            className="explorer-context-menu"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            onClick={(e) => e.stopPropagation()}
          >
            {contextMenu.entry ? (
              contextMenu.entry.type === "folder" ? (
                /* Context Menu for Folders */
                <>
                  <button
                    type="button"
                    className="context-menu-item"
                    onClick={() => {
                      onOpenFolder(contextMenu.entry as ExplorerFolderEntry);
                      closeContextMenu();
                    }}
                  >
                    <div className="context-menu-item-left">
                      <FolderOpen size={14} color="var(--brand-primary)" />
                      <span>Open Folder</span>
                    </div>
                    <span className="context-menu-shortcut">Enter</span>
                  </button>

                  <button
                    type="button"
                    className="context-menu-item"
                    onClick={() => {
                      const f = contextMenu.entry as ExplorerFolderEntry;
                      if (f.folderPath && onShowInFolder) onShowInFolder(f.folderPath);
                      else if ((window as any).foldermate?.openPath) {
                        (window as any).foldermate.openPath(f.folderPath || "D:\\Clients");
                      }
                      closeContextMenu();
                    }}
                  >
                    <div className="context-menu-item-left">
                      <ExternalLink size={14} />
                      <span>Open in Windows Explorer</span>
                    </div>
                  </button>

                  <div className="context-menu-divider" />

                  <button
                    type="button"
                    className="context-menu-item"
                    onClick={() => {
                      setRenamingId(contextMenu.entry!.id);
                      setRenameValue(contextMenu.entry!.name);
                      closeContextMenu();
                    }}
                  >
                    <div className="context-menu-item-left">
                      <Edit2 size={14} />
                      <span>Rename</span>
                    </div>
                    <span className="context-menu-shortcut">F2</span>
                  </button>

                  <button
                    type="button"
                    className="context-menu-item"
                    onClick={() => {
                      const f = contextMenu.entry as ExplorerFolderEntry;
                      if (onFolderAppearance) onFolderAppearance(f);
                      else {
                        addToast({
                          title: "Folder Customizer",
                          message: `Appearance options for ${f.name}.`,
                          variant: "info",
                        });
                      }
                      closeContextMenu();
                    }}
                  >
                    <div className="context-menu-item-left">
                      <Sliders size={14} />
                      <span>Folder Appearance</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="context-menu-item"
                    onClick={() => {
                      const f = contextMenu.entry as ExplorerFolderEntry;
                      navigator.clipboard.writeText(f.folderPath || f.name);
                      addToast({ title: "Copied Path", message: "Folder path copied to clipboard.", variant: "info" });
                      closeContextMenu();
                    }}
                  >
                    <div className="context-menu-item-left">
                      <Copy size={14} />
                      <span>Copy Path</span>
                    </div>
                  </button>
                </>
              ) : (
                /* Context Menu for Files */
                <>
                  <button
                    type="button"
                    className="context-menu-item"
                    onClick={() => {
                      onOpenFile(contextMenu.entry as ExplorerFileEntry);
                      closeContextMenu();
                    }}
                  >
                    <div className="context-menu-item-left">
                      <Eye size={14} color="var(--brand-primary)" />
                      <span>Open File</span>
                    </div>
                    <span className="context-menu-shortcut">Enter</span>
                  </button>

                  <button
                    type="button"
                    className="context-menu-item"
                    onClick={() => {
                      const file = contextMenu.entry as ExplorerFileEntry;
                      if (file.targetPath && onShowInFolder) onShowInFolder(file.targetPath);
                      else if ((window as any).foldermate?.showItemInFolder) {
                        (window as any).foldermate.showItemInFolder(file.targetPath);
                      }
                      closeContextMenu();
                    }}
                  >
                    <div className="context-menu-item-left">
                      <ExternalLink size={14} />
                      <span>Show in Windows Explorer</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="context-menu-item"
                    onClick={() => {
                      const file = contextMenu.entry as ExplorerFileEntry;
                      addToast({
                        title: "New Version Created",
                        message: `Forked v${(file.versionNumber || 1) + 1} of ${file.name}.`,
                        variant: "success",
                      });
                      closeContextMenu();
                    }}
                  >
                    <div className="context-menu-item-left">
                      <GitBranch size={14} color="var(--brand-primary)" />
                      <span>Create New Version (v+1)</span>
                    </div>
                    <span className="context-menu-shortcut">Ctrl+Shift+V</span>
                  </button>

                  <div className="context-menu-divider" />

                  <button
                    type="button"
                    className="context-menu-item"
                    onClick={() => {
                      setRenamingId(contextMenu.entry!.id);
                      setRenameValue(contextMenu.entry!.name);
                      closeContextMenu();
                    }}
                  >
                    <div className="context-menu-item-left">
                      <Edit2 size={14} />
                      <span>Rename</span>
                    </div>
                    <span className="context-menu-shortcut">F2</span>
                  </button>

                  <button
                    type="button"
                    className="context-menu-item"
                    onClick={() => {
                      const file = contextMenu.entry as ExplorerFileEntry;
                      navigator.clipboard.writeText(file.targetPath || file.name);
                      addToast({ title: "Copied Path", message: "File path copied to clipboard.", variant: "info" });
                      closeContextMenu();
                    }}
                  >
                    <div className="context-menu-item-left">
                      <Copy size={14} />
                      <span>Copy Full Path</span>
                    </div>
                  </button>
                </>
              )
            ) : (
              /* Blank Canvas Context Menu */
              <>
                <button
                  type="button"
                  className="context-menu-item"
                  onClick={() => {
                    if (onRefresh) onRefresh();
                    closeContextMenu();
                  }}
                >
                  <div className="context-menu-item-left">
                    <Sparkles size={14} />
                    <span>Refresh Folder</span>
                  </div>
                  <span className="context-menu-shortcut">F5</span>
                </button>

                <div className="context-menu-divider" />

                <button
                  type="button"
                  className="context-menu-item"
                  onClick={() => {
                    if (onChangeViewMode) onChangeViewMode("details");
                    closeContextMenu();
                  }}
                >
                  <span>Details View</span>
                  <span className="context-menu-shortcut">Ctrl+1</span>
                </button>

                <button
                  type="button"
                  className="context-menu-item"
                  onClick={() => {
                    if (onChangeViewMode) onChangeViewMode("list");
                    closeContextMenu();
                  }}
                >
                  <span>List View</span>
                  <span className="context-menu-shortcut">Ctrl+2</span>
                </button>

                <button
                  type="button"
                  className="context-menu-item"
                  onClick={() => {
                    if (onChangeViewMode) onChangeViewMode("medium-icons");
                    closeContextMenu();
                  }}
                >
                  <span>Icons View</span>
                  <span className="context-menu-shortcut">Ctrl+4</span>
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

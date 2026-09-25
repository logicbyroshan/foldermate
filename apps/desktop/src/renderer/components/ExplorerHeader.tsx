import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  RotateCw,
  Search,
  LayoutList,
  List,
  LayoutGrid,
  SidebarClose,
  SidebarOpen,
  PauseCircle,
  PlayCircle,
  HardDrive,
  Folder,
  FolderPlus,
  Plus,
  ChevronRight,
  ChevronDown,
  Scissors,
  Copy,
  Clipboard,
  Edit2,
  Trash2,
  ArrowUpDown,
  Sparkles,
  Sliders,
  Users,
  MoreHorizontal,
  Check,
  X,
} from "lucide-react";
import { LicenseStatus } from "@foldermate/shared";
import { ViewMode, BreadcrumbItem } from "../types/explorer.js";

export type { ViewMode, BreadcrumbItem };

interface ExplorerHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  onNavigateBreadcrumb: (index: number) => void;
  onNavigateAddress?: (path: string) => void;
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
  onGoUp: () => void;
  onRefresh: () => void;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isInspectorOpen: boolean;
  onToggleInspector: () => void;
  engineStatus: {
    status: "running" | "paused" | "offline";
    uptimeSeconds?: number;
    inboxPath?: string;
  };
  onPauseAutomation?: (duration: "1h" | "tomorrow" | "indefinite") => void;
  onResumeAutomation?: () => void;
  licenseStatus?: LicenseStatus | null;
  onOpenActivation?: () => void;
  onOpenCommandPalette: () => void;
  onNewFolder?: () => void;
  onNewClient?: () => void;
  onNewProject?: () => void;
  onScanNow?: () => void;
  hasSelection?: boolean;
  onOpenDriveManager?: () => void;
  onOpenFolderCustomizer?: () => void;
  onOpenDriveSearch?: () => void;
  controlledDriveLetter?: string;
  appMode?: "foreground" | "background";
  onToggleAppMode?: () => void;
  sortField?: "name" | "type" | "modifiedAt" | "size";
  onSortBy?: (field: "name" | "type" | "modifiedAt" | "size") => void;
}

export const ExplorerHeader: React.FC<ExplorerHeaderProps> = ({
  breadcrumbs,
  onNavigateBreadcrumb,
  onNavigateAddress,
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
  onGoUp,
  onRefresh,
  viewMode,
  onChangeViewMode,
  searchQuery,
  onSearchChange,
  isInspectorOpen,
  onToggleInspector,
  engineStatus,
  onPauseAutomation,
  onResumeAutomation,
  licenseStatus,
  onOpenActivation,
  onOpenCommandPalette,
  onNewFolder,
  onNewClient,
  onNewProject,
  onScanNow,
  hasSelection = false,
  onOpenDriveManager,
  onOpenFolderCustomizer,
  onOpenDriveSearch,
  controlledDriveLetter = "D:",
  appMode = "foreground",
  onToggleAppMode,
  sortField = "name",
  onSortBy,
}) => {
  const [isAddressInputMode, setIsAddressInputMode] = useState(false);
  const [rawAddress, setRawAddress] = useState("");
  const [isPauseMenuOpen, setIsPauseMenuOpen] = useState(false);
  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);
  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const addressInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const viewMenuRef = useRef<HTMLDivElement>(null);
  const newMenuRef = useRef<HTMLDivElement>(null);
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const pauseMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const fullPathString = breadcrumbs.map((b) => b.label).join("\\");

  const handleAddressBarClick = () => {
    setRawAddress(fullPathString || "D:\\Clients");
    setIsAddressInputMode(true);
  };

  const submitAddress = () => {
    setIsAddressInputMode(false);
    if (rawAddress.trim() && onNavigateAddress) {
      onNavigateAddress(rawAddress.trim());
    }
  };

  useEffect(() => {
    if (isAddressInputMode && addressInputRef.current) {
      addressInputRef.current.focus();
      addressInputRef.current.select();
    }
  }, [isAddressInputMode]);

  // Click-outside and Escape listeners for dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isViewMenuOpen && viewMenuRef.current && !viewMenuRef.current.contains(e.target as Node)) {
        setIsViewMenuOpen(false);
      }
      if (isNewMenuOpen && newMenuRef.current && !newMenuRef.current.contains(e.target as Node)) {
        setIsNewMenuOpen(false);
      }
      if (isSortMenuOpen && sortMenuRef.current && !sortMenuRef.current.contains(e.target as Node)) {
        setIsSortMenuOpen(false);
      }
      if (isPauseMenuOpen && pauseMenuRef.current && !pauseMenuRef.current.contains(e.target as Node)) {
        setIsPauseMenuOpen(false);
      }
      if (isMoreMenuOpen && moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsViewMenuOpen(false);
        setIsNewMenuOpen(false);
        setIsSortMenuOpen(false);
        setIsPauseMenuOpen(false);
        setIsMoreMenuOpen(false);
        if (isAddressInputMode) setIsAddressInputMode(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "l") {
        e.preventDefault();
        handleAddressBarClick();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isViewMenuOpen, isNewMenuOpen, isSortMenuOpen, isPauseMenuOpen, isMoreMenuOpen, isAddressInputMode]);

  return (
    <header className="win11-header">
      {/* TIER 1: WINDOWS 11 FLUENT COMMAND BAR */}
      <div className="win11-command-bar">
        {/* + New Button & Dropdown */}
        <div ref={newMenuRef} className="command-bar-dropdown-wrap">
          <button
            type="button"
            className="win11-btn primary-new-btn"
            onClick={() => {
              setIsNewMenuOpen((prev) => !prev);
              setIsViewMenuOpen(false);
              setIsSortMenuOpen(false);
              setIsPauseMenuOpen(false);
              setIsMoreMenuOpen(false);
            }}
            title="Create new folder or file (Ctrl+Shift+N)"
          >
            <Plus size={16} />
            <span>New</span>
            <ChevronDown size={11} className="btn-chevron" />
          </button>

          {isNewMenuOpen && (
            <div className="win11-dropdown animate-fade-in" style={{ width: 230 }}>
              <button
                type="button"
                className="win11-dropdown-item"
                onClick={() => {
                  setIsNewMenuOpen(false);
                  onNewFolder?.();
                }}
              >
                <FolderPlus size={15} color="#f59e0b" />
                <span>Folder</span>
                <span className="dropdown-shortcut">Ctrl+Shift+N</span>
              </button>
              <button
                type="button"
                className="win11-dropdown-item"
                onClick={() => {
                  setIsNewMenuOpen(false);
                  onNewProject?.();
                }}
              >
                <Folder size={15} color="#3b82f6" />
                <span>Project Folder</span>
              </button>
              <button
                type="button"
                className="win11-dropdown-item"
                onClick={() => {
                  setIsNewMenuOpen(false);
                  onNewClient?.();
                }}
              >
                <Users size={15} color="var(--brand-primary)" />
                <span>Client Workspace</span>
              </button>
            </div>
          )}
        </div>

        <div className="win11-command-divider" />

        {/* Windows Standard File Operations: Cut, Copy, Paste, Rename, Delete */}
        <div className="win11-command-group">
          <button
            type="button"
            className="win11-icon-btn"
            title="Cut (Ctrl+X)"
            disabled={!hasSelection}
            onClick={() => document.execCommand?.("cut")}
          >
            <Scissors size={15} />
          </button>

          <button
            type="button"
            className="win11-icon-btn"
            title="Copy (Ctrl+C)"
            disabled={!hasSelection}
            onClick={() => document.execCommand?.("copy")}
          >
            <Copy size={15} />
          </button>

          <button
            type="button"
            className="win11-icon-btn"
            title="Paste (Ctrl+V)"
            onClick={() => document.execCommand?.("paste")}
          >
            <Clipboard size={15} />
          </button>

          <button
            type="button"
            className="win11-icon-btn"
            title="Rename (F2)"
            disabled={!hasSelection}
          >
            <Edit2 size={15} />
          </button>

          <button
            type="button"
            className="win11-icon-btn"
            title="Delete (Del)"
            disabled={!hasSelection}
          >
            <Trash2 size={15} />
          </button>
        </div>

        <div className="win11-command-divider" />

        {/* Sort Dropdown */}
        <div ref={sortMenuRef} className="command-bar-dropdown-wrap">
          <button
            type="button"
            className="win11-btn"
            onClick={() => {
              setIsSortMenuOpen((prev) => !prev);
              setIsViewMenuOpen(false);
              setIsNewMenuOpen(false);
              setIsPauseMenuOpen(false);
              setIsMoreMenuOpen(false);
            }}
            title="Sort items"
          >
            <ArrowUpDown size={14} />
            <span>Sort</span>
            <ChevronDown size={11} className="btn-chevron" />
          </button>

          {isSortMenuOpen && (
            <div className="win11-dropdown animate-fade-in" style={{ width: 190 }}>
              <div className="dropdown-label">Sort by</div>
              <button
                type="button"
                className={`win11-dropdown-item ${sortField === "name" ? "active" : ""}`}
                onClick={() => {
                  onSortBy?.("name");
                  setIsSortMenuOpen(false);
                }}
              >
                {sortField === "name" ? <Check size={13} /> : <span className="item-spacer" />}
                <span>Name</span>
              </button>
              <button
                type="button"
                className={`win11-dropdown-item ${sortField === "modifiedAt" ? "active" : ""}`}
                onClick={() => {
                  onSortBy?.("modifiedAt");
                  setIsSortMenuOpen(false);
                }}
              >
                {sortField === "modifiedAt" ? <Check size={13} /> : <span className="item-spacer" />}
                <span>Date modified</span>
              </button>
              <button
                type="button"
                className={`win11-dropdown-item ${sortField === "type" ? "active" : ""}`}
                onClick={() => {
                  onSortBy?.("type");
                  setIsSortMenuOpen(false);
                }}
              >
                {sortField === "type" ? <Check size={13} /> : <span className="item-spacer" />}
                <span>Type</span>
              </button>
              <button
                type="button"
                className={`win11-dropdown-item ${sortField === "size" ? "active" : ""}`}
                onClick={() => {
                  onSortBy?.("size");
                  setIsSortMenuOpen(false);
                }}
              >
                {sortField === "size" ? <Check size={13} /> : <span className="item-spacer" />}
                <span>Size</span>
              </button>
            </div>
          )}
        </div>

        {/* View Mode Layout Dropdown */}
        <div ref={viewMenuRef} className="command-bar-dropdown-wrap">
          <button
            type="button"
            className="win11-btn"
            onClick={() => {
              setIsViewMenuOpen((prev) => !prev);
              setIsSortMenuOpen(false);
              setIsNewMenuOpen(false);
              setIsPauseMenuOpen(false);
              setIsMoreMenuOpen(false);
            }}
            title="View options and scaling"
          >
            <LayoutList size={14} />
            <span>View</span>
            <ChevronDown size={11} className="btn-chevron" />
          </button>

          {isViewMenuOpen && (
            <div className="win11-dropdown animate-fade-in" style={{ width: 220 }}>
              <div className="dropdown-label">Layout</div>
              <button
                type="button"
                className={`win11-dropdown-item ${viewMode === "details" ? "active" : ""}`}
                onClick={() => {
                  onChangeViewMode("details");
                  setIsViewMenuOpen(false);
                }}
              >
                {viewMode === "details" ? <Check size={13} /> : <span className="item-spacer" />}
                <LayoutList size={14} />
                <span>Details</span>
                <span className="dropdown-shortcut">Ctrl+1</span>
              </button>
              <button
                type="button"
                className={`win11-dropdown-item ${viewMode === "list" ? "active" : ""}`}
                onClick={() => {
                  onChangeViewMode("list");
                  setIsViewMenuOpen(false);
                }}
              >
                {viewMode === "list" ? <Check size={13} /> : <span className="item-spacer" />}
                <List size={14} />
                <span>List</span>
                <span className="dropdown-shortcut">Ctrl+2</span>
              </button>
              <button
                type="button"
                className={`win11-dropdown-item ${viewMode === "small-icons" ? "active" : ""}`}
                onClick={() => {
                  onChangeViewMode("small-icons");
                  setIsViewMenuOpen(false);
                }}
              >
                {viewMode === "small-icons" ? <Check size={13} /> : <span className="item-spacer" />}
                <LayoutGrid size={13} />
                <span>Small icons</span>
                <span className="dropdown-shortcut">Ctrl+3</span>
              </button>
              <button
                type="button"
                className={`win11-dropdown-item ${viewMode === "medium-icons" ? "active" : ""}`}
                onClick={() => {
                  onChangeViewMode("medium-icons");
                  setIsViewMenuOpen(false);
                }}
              >
                {viewMode === "medium-icons" ? <Check size={13} /> : <span className="item-spacer" />}
                <LayoutGrid size={15} />
                <span>Medium icons</span>
                <span className="dropdown-shortcut">Ctrl+4</span>
              </button>
              <button
                type="button"
                className={`win11-dropdown-item ${viewMode === "large-icons" ? "active" : ""}`}
                onClick={() => {
                  onChangeViewMode("large-icons");
                  setIsViewMenuOpen(false);
                }}
              >
                {viewMode === "large-icons" ? <Check size={13} /> : <span className="item-spacer" />}
                <LayoutGrid size={17} />
                <span>Large icons</span>
                <span className="dropdown-shortcut">Ctrl+5</span>
              </button>
              <button
                type="button"
                className={`win11-dropdown-item ${viewMode === "extra-large-icons" ? "active" : ""}`}
                onClick={() => {
                  onChangeViewMode("extra-large-icons");
                  setIsViewMenuOpen(false);
                }}
              >
                {viewMode === "extra-large-icons" ? <Check size={13} /> : <span className="item-spacer" />}
                <LayoutGrid size={19} />
                <span>Extra large icons</span>
                <span className="dropdown-shortcut">Ctrl+6</span>
              </button>

              <div className="dropdown-divider" />
              <div className="dropdown-label">Show</div>
              <button
                type="button"
                className="win11-dropdown-item"
                onClick={() => {
                  onToggleInspector();
                  setIsViewMenuOpen(false);
                }}
              >
                {isInspectorOpen ? <Check size={13} /> : <span className="item-spacer" />}
                <span>Details pane</span>
                <span className="dropdown-shortcut">Ctrl+I</span>
              </button>
            </div>
          )}
        </div>

        {/* More Options Dropdown */}
        <div ref={moreMenuRef} className="command-bar-dropdown-wrap">
          <button
            type="button"
            className="win11-icon-btn"
            onClick={() => {
              setIsMoreMenuOpen((prev) => !prev);
              setIsViewMenuOpen(false);
              setIsSortMenuOpen(false);
              setIsNewMenuOpen(false);
              setIsPauseMenuOpen(false);
            }}
            title="More options"
          >
            <MoreHorizontal size={15} />
          </button>

          {isMoreMenuOpen && (
            <div className="win11-dropdown animate-fade-in" style={{ width: 220 }}>
              <button
                type="button"
                className="win11-dropdown-item"
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  onScanNow?.();
                }}
              >
                <Sparkles size={14} color="var(--brand-primary)" />
                <span>Scan Inbox Now</span>
              </button>
              <button
                type="button"
                className="win11-dropdown-item"
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  onOpenCommandPalette();
                }}
              >
                <span>Command Palette</span>
                <span className="dropdown-shortcut">Ctrl+K</span>
              </button>
            </div>
          )}
        </div>

        <div className="win11-command-divider" />

        {/* Drive Manager Quick Action */}
        {onOpenDriveManager && (
          <button
            type="button"
            className="win11-btn"
            onClick={onOpenDriveManager}
            title="Controlled Drive Manager (Ctrl+Shift+D) - Assign drive volume, setup partition, or customize icon"
          >
            <HardDrive size={14} color="var(--brand-primary)" />
            <span>Drive {controlledDriveLetter}</span>
          </button>
        )}

        {/* Folder Appearance Quick Action */}
        {onOpenFolderCustomizer && (
          <button
            type="button"
            className="win11-btn"
            onClick={onOpenFolderCustomizer}
            title="Customize Folder (Ctrl+Shift+C) - Pick colors and emblem icons"
          >
            <Sliders size={14} color="#f59e0b" />
            <span>Folder Style</span>
          </button>
        )}

        {/* Find File Spotlight Quick Action */}
        {onOpenDriveSearch && (
          <button
            type="button"
            className="win11-btn"
            onClick={onOpenDriveSearch}
            title="Instant Drive Search (Ctrl+Shift+F) - Find any file across entire controlled drive"
          >
            <Search size={14} color="#0284c7" />
            <span>Find File</span>
          </button>
        )}

        {/* Details Pane Toggle on Command Bar Right */}
        <button
          type="button"
          className={`win11-btn right-btn ${isInspectorOpen ? "active-pane" : ""}`}
          onClick={onToggleInspector}
          title={isInspectorOpen ? "Hide Details pane (Ctrl+I)" : "Show Details pane (Ctrl+I)"}
        >
          {isInspectorOpen ? <SidebarClose size={15} /> : <SidebarOpen size={15} />}
          <span>Details</span>
        </button>

        {/* Dual Mode Foreground/Background Indicator */}
        {onToggleAppMode && (
          <button
            type="button"
            className="win11-btn"
            onClick={onToggleAppMode}
            title={
              appMode === "background"
                ? "Running as Background Daemon. Click to switch to Foreground Explorer mode."
                : "Running in Foreground Explorer mode. Click to test Background Daemon mode."
            }
            style={{
              fontSize: 11,
              padding: "4px 8px",
              background: appMode === "background" ? "rgba(100, 116, 139, 0.1)" : "rgba(22, 163, 74, 0.1)",
              borderColor: appMode === "background" ? "rgba(100, 116, 139, 0.3)" : "rgba(22, 163, 74, 0.3)",
              color: appMode === "background" ? "#475569" : "#15803d",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: appMode === "background" ? "#64748b" : "#16a34a",
                display: "inline-block",
                marginRight: 4,
              }}
            />
            <span>{appMode === "background" ? "Background" : "Foreground"}</span>
          </button>
        )}

        {/* Subtle Engine Heartbeat Dropdown */}
        <div ref={pauseMenuRef} className="command-bar-dropdown-wrap">
          <button
            type="button"
            className={`win11-engine-indicator status-${engineStatus.status}`}
            onClick={() => {
              setIsPauseMenuOpen((prev) => !prev);
              setIsViewMenuOpen(false);
              setIsNewMenuOpen(false);
              setIsSortMenuOpen(false);
              setIsMoreMenuOpen(false);
            }}
            title="Daemon Status"
          >
            <span className="engine-pulse-dot" />
            <span className="engine-pulse-text">
              {engineStatus.status === "running" ? "Watching Inbox" : "Paused"}
            </span>
          </button>

          {isPauseMenuOpen && (
            <div className="win11-dropdown animate-fade-in" style={{ right: 0, width: 260 }}>
              <div className="dropdown-label">
                <strong>Background Automation Daemon</strong>
              </div>
              <div className="dropdown-info-text">
                Watcher: <code>{engineStatus.inboxPath || "C:\\FolderMate\\Inbox"}</code>
              </div>
              <div className="dropdown-divider" />
              {engineStatus.status === "paused" ? (
                <button
                  type="button"
                  className="win11-dropdown-item"
                  onClick={() => {
                    onResumeAutomation?.();
                    setIsPauseMenuOpen(false);
                  }}
                >
                  <PlayCircle size={15} color="var(--status-success)" />
                  <span>Resume Automation</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="win11-dropdown-item"
                    onClick={() => {
                      onPauseAutomation?.("1h");
                      setIsPauseMenuOpen(false);
                    }}
                  >
                    <PauseCircle size={15} />
                    <span>Pause for 1 Hour</span>
                  </button>
                  <button
                    type="button"
                    className="win11-dropdown-item"
                    onClick={() => {
                      onPauseAutomation?.("tomorrow");
                      setIsPauseMenuOpen(false);
                    }}
                  >
                    <PauseCircle size={15} />
                    <span>Pause until Tomorrow</span>
                  </button>
                  <button
                    type="button"
                    className="win11-dropdown-item danger"
                    onClick={() => {
                      onPauseAutomation?.("indefinite");
                      setIsPauseMenuOpen(false);
                    }}
                  >
                    <PauseCircle size={15} />
                    <span>Pause Indefinitely</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* TIER 2: NAVIGATION & ADDRESS BAR */}
      <div className="win11-nav-bar">
        {/* Back / Forward / Up / Refresh */}
        <div className="win11-nav-actions">
          <button
            type="button"
            className="win11-nav-btn"
            disabled={!canGoBack}
            onClick={onGoBack}
            title="Back (Alt+Left)"
          >
            <ArrowLeft size={15} />
          </button>
          <button
            type="button"
            className="win11-nav-btn"
            disabled={!canGoForward}
            onClick={onGoForward}
            title="Forward (Alt+Right)"
          >
            <ArrowRight size={15} />
          </button>
          <button
            type="button"
            className="win11-nav-btn"
            disabled={breadcrumbs.length <= 1}
            onClick={onGoUp}
            title="Up to Parent (Alt+Up)"
          >
            <ArrowUp size={15} />
          </button>
          <button
            type="button"
            className="win11-nav-btn"
            onClick={onRefresh}
            title="Refresh (F5 / Ctrl+R)"
          >
            <RotateCw size={14} />
          </button>
        </div>

        {/* Windows 11 Address Bar (Click to edit text path) */}
        <div className="win11-address-bar" onClick={handleAddressBarClick}>
          <div className="address-bar-icon">
            <HardDrive size={15} color="var(--brand-primary)" />
          </div>

          {!isAddressInputMode ? (
            <div className="win11-breadcrumbs">
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={crumb.id || idx}>
                    <button
                      type="button"
                      className={`win11-breadcrumb-item ${isLast ? "current" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateBreadcrumb(idx);
                      }}
                    >
                      {crumb.label}
                    </button>
                    {!isLast && (
                      <span className="win11-breadcrumb-sep">
                        <ChevronRight size={12} />
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          ) : (
            <input
              ref={addressInputRef}
              type="text"
              className="win11-address-input"
              value={rawAddress}
              onChange={(e) => setRawAddress(e.target.value)}
              onBlur={submitAddress}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  submitAddress();
                } else if (e.key === "Escape") {
                  setIsAddressInputMode(false);
                }
              }}
            />
          )}

          <div className="address-shortcut-hint">Ctrl+L</div>
        </div>

        {/* Search Box */}
        <div className="win11-search-box">
          <Search size={14} className="search-icon" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search in folder... (Ctrl+F)"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="win11-search-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange("")}
              title="Clear search"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

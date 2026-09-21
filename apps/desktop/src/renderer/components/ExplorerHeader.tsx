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
  CheckCircle2,
  HardDrive,
  Folder,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { LicenseStatus } from "@foldermate/shared";

export type ViewMode =
  | "details"
  | "list"
  | "small-icons"
  | "medium-icons"
  | "large-icons"
  | "extra-large-icons";

export interface BreadcrumbItem {
  id: string;
  label: string;
  type?: "root" | "client" | "project" | "folder";
}

interface ExplorerHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  onNavigateBreadcrumb: (index: number) => void;
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
}

export const ExplorerHeader: React.FC<ExplorerHeaderProps> = ({
  breadcrumbs,
  onNavigateBreadcrumb,
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
}) => {
  const [isAddressInputMode, setIsAddressInputMode] = useState(false);
  const [rawAddress, setRawAddress] = useState("");
  const [isPauseMenuOpen, setIsPauseMenuOpen] = useState(false);
  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const fullPathString = breadcrumbs.map((b) => b.label).join(" \\ ");

  const handleAddressBarClick = () => {
    setRawAddress(fullPathString);
    setIsAddressInputMode(true);
  };

  useEffect(() => {
    if (isAddressInputMode && addressInputRef.current) {
      addressInputRef.current.focus();
      addressInputRef.current.select();
    }
  }, [isAddressInputMode]);

  return (
    <header className="explorer-header">
      {/* Top Row: Navigation Controls, Breadcrumbs Address Bar, View Mode, Search */}
      <div className="explorer-toolbar-row">
        {/* Navigation History Buttons */}
        <div className="explorer-nav-buttons">
          <button
            type="button"
            className="explorer-tool-btn"
            disabled={!canGoBack}
            onClick={onGoBack}
            title="Back (Alt+Left)"
          >
            <ArrowLeft size={15} />
          </button>
          <button
            type="button"
            className="explorer-tool-btn"
            disabled={!canGoForward}
            onClick={onGoForward}
            title="Forward (Alt+Right)"
          >
            <ArrowRight size={15} />
          </button>
          <button
            type="button"
            className="explorer-tool-btn"
            disabled={breadcrumbs.length <= 1}
            onClick={onGoUp}
            title="Up to Parent (Alt+Up or Backspace)"
          >
            <ArrowUp size={15} />
          </button>
          <button
            type="button"
            className="explorer-tool-btn"
            onClick={onRefresh}
            title="Refresh (Ctrl+R / F5)"
          >
            <RotateCw size={14} />
          </button>
        </div>

        {/* Interactive Breadcrumb / Address Bar */}
        <div className="explorer-address-bar" onClick={handleAddressBarClick}>
          <div className="address-bar-icon">
            <HardDrive size={14} color="var(--brand-primary)" />
          </div>

          {!isAddressInputMode ? (
            <div className="breadcrumbs-list">
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={crumb.id || idx}>
                    <button
                      type="button"
                      className={`breadcrumb-item ${isLast ? "current" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateBreadcrumb(idx);
                      }}
                    >
                      {crumb.label}
                    </button>
                    {!isLast && (
                      <span className="breadcrumb-separator">
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
              className="address-raw-input"
              value={rawAddress}
              onChange={(e) => setRawAddress(e.target.value)}
              onBlur={() => setIsAddressInputMode(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "Escape") {
                  setIsAddressInputMode(false);
                }
              }}
            />
          )}

          <div className="address-bar-hint">Ctrl+L</div>
        </div>

        {/* Global Instant Search Box */}
        <div className="explorer-search-box">
          <Search size={14} className="search-box-icon" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search current folder... (Ctrl+F)"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-box-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-box-clear"
              onClick={() => onSearchChange("")}
            >
              ✕
            </button>
          )}
        </div>

        {/* View Mode Selectors: Details, List, Icons with Dropdown */}
        <div className="explorer-view-modes" style={{ position: "relative" }}>
          <button
            type="button"
            className={`view-mode-btn ${viewMode === "details" ? "active" : ""}`}
            onClick={() => onChangeViewMode("details")}
            title="Details View (Ctrl+1)"
          >
            <LayoutList size={15} />
          </button>
          <button
            type="button"
            className={`view-mode-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => onChangeViewMode("list")}
            title="List View (Ctrl+2)"
          >
            <List size={15} />
          </button>
          <button
            type="button"
            className={`view-mode-btn ${viewMode.includes("icons") ? "active" : ""}`}
            onClick={() => {
              if (viewMode === "small-icons") onChangeViewMode("medium-icons");
              else if (viewMode === "medium-icons") onChangeViewMode("large-icons");
              else if (viewMode === "large-icons") onChangeViewMode("extra-large-icons");
              else onChangeViewMode("medium-icons");
            }}
            title="Icons View (Ctrl+3 / Ctrl+Wheel to zoom)"
          >
            <LayoutGrid size={15} />
          </button>
          <button
            type="button"
            className={`view-mode-btn ${isViewMenuOpen ? "active" : ""}`}
            onClick={() => setIsViewMenuOpen(!isViewMenuOpen)}
            title="All View Options & Zoom (Ctrl + Mouse Wheel)"
            style={{ width: 18 }}
          >
            <ChevronDown size={12} />
          </button>

          {isViewMenuOpen && (
            <div
              className="engine-pause-dropdown animate-fade-in"
              style={{ width: 220, right: 0, top: "100%", marginTop: 4, zIndex: 1000 }}
            >
              <div className="dropdown-header">
                <strong>View Layout & Scaling</strong>
                <span>Ctrl + Mouse Wheel zooms</span>
              </div>
              <div className="dropdown-divider" />
              <button
                type="button"
                className={`dropdown-item ${viewMode === "details" ? "primary" : ""}`}
                onClick={() => {
                  onChangeViewMode("details");
                  setIsViewMenuOpen(false);
                }}
              >
                <LayoutList size={14} /> Details (Ctrl+1)
              </button>
              <button
                type="button"
                className={`dropdown-item ${viewMode === "list" ? "primary" : ""}`}
                onClick={() => {
                  onChangeViewMode("list");
                  setIsViewMenuOpen(false);
                }}
              >
                <List size={14} /> List (Ctrl+2)
              </button>
              <button
                type="button"
                className={`dropdown-item ${viewMode === "small-icons" ? "primary" : ""}`}
                onClick={() => {
                  onChangeViewMode("small-icons");
                  setIsViewMenuOpen(false);
                }}
              >
                <LayoutGrid size={13} /> Small Icons (Ctrl+3)
              </button>
              <button
                type="button"
                className={`dropdown-item ${viewMode === "medium-icons" ? "primary" : ""}`}
                onClick={() => {
                  onChangeViewMode("medium-icons");
                  setIsViewMenuOpen(false);
                }}
              >
                <LayoutGrid size={15} /> Medium Icons (Ctrl+4)
              </button>
              <button
                type="button"
                className={`dropdown-item ${viewMode === "large-icons" ? "primary" : ""}`}
                onClick={() => {
                  onChangeViewMode("large-icons");
                  setIsViewMenuOpen(false);
                }}
              >
                <LayoutGrid size={18} /> Large Icons (Ctrl+5)
              </button>
              <button
                type="button"
                className={`dropdown-item ${viewMode === "extra-large-icons" ? "primary" : ""}`}
                onClick={() => {
                  onChangeViewMode("extra-large-icons");
                  setIsViewMenuOpen(false);
                }}
              >
                <LayoutGrid size={22} /> Extra Large Icons (Ctrl+6)
              </button>
            </div>
          )}
        </div>

        {/* Inspector Pane Toggle */}
        <button
          type="button"
          className={`explorer-tool-btn ${isInspectorOpen ? "active-tool" : ""}`}
          onClick={onToggleInspector}
          title={isInspectorOpen ? "Hide Details Pane" : "Show Details Pane"}
        >
          {isInspectorOpen ? <SidebarClose size={15} /> : <SidebarOpen size={15} />}
        </button>

        {/* Engine Status & Pause/Resume Dropdown */}
        <div className="engine-status-wrapper">
          <button
            type="button"
            className={`engine-status-pill status-${engineStatus.status}`}
            onClick={() => setIsPauseMenuOpen(!isPauseMenuOpen)}
            title="FolderMate Background Daemon Status"
          >
            <span className="status-live-dot" />
            <span className="status-label">
              {engineStatus.status === "running"
                ? "Engine Active"
                : engineStatus.status === "paused"
                ? "Engine Paused"
                : "Engine Offline"}
            </span>
          </button>

          {isPauseMenuOpen && (
            <div className="engine-pause-dropdown animate-fade-in">
              <div className="dropdown-header">
                <strong>Background Automation</strong>
                <span>{engineStatus.status === "running" ? "Watching Inbox" : "Automation is paused"}</span>
              </div>
              <div className="dropdown-divider" />
              {engineStatus.status === "running" ? (
                <>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => {
                      onPauseAutomation?.("1h");
                      setIsPauseMenuOpen(false);
                    }}
                  >
                    <PauseCircle size={14} /> Pause for 1 hour
                  </button>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => {
                      onPauseAutomation?.("tomorrow");
                      setIsPauseMenuOpen(false);
                    }}
                  >
                    <PauseCircle size={14} /> Pause until tomorrow
                  </button>
                  <button
                    type="button"
                    className="dropdown-item danger"
                    onClick={() => {
                      onPauseAutomation?.("indefinite");
                      setIsPauseMenuOpen(false);
                    }}
                  >
                    <PauseCircle size={14} /> Pause indefinitely
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="dropdown-item primary"
                  onClick={() => {
                    onResumeAutomation?.();
                    setIsPauseMenuOpen(false);
                  }}
                >
                  <PlayCircle size={14} /> Resume Organization
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

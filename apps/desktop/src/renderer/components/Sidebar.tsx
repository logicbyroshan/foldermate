import React, { useState } from "react";
import {
  Home,
  Folder,
  FolderOpen,
  FolderTree,
  Search,
  Inbox,
  Settings,
  HardDrive,
  Star,
  Heart,
  Key,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Archive,
  AlertCircle,
  Keyboard,
  Activity,
  Sliders,
} from "lucide-react";
import { LicenseStatus } from "@foldermate/shared";
import { DriveVisualIcon, FolderVisualIcon } from "./ui/FolderVisualIcon.js";

export type NavView =
  | "home"
  | "explorer"
  | "clients"
  | "search"
  | "review"
  | "automation"
  | "shortcuts"
  | "rules"
  | "settings"
  | "dashboard";

interface SidebarProps {
  currentView: NavView;
  currentPath: string;
  onSelectView: (view: NavView) => void;
  onNavigatePath: (path: string) => void;
  pendingReviewCount: number;
  engineConnected: boolean;
  licenseStatus?: LicenseStatus | null;
  onOpenActivation?: () => void;
  clients?: { id: string; name: string; color?: string; emblem?: string }[];
  controlledDrive?: {
    letter: string;
    label: string;
    color?: string;
    emblem?: string;
    totalGb?: number;
    freeGb?: number;
  };
  onOpenDriveCustomizer?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  currentPath,
  onSelectView,
  onNavigatePath,
  pendingReviewCount,
  engineConnected,
  licenseStatus,
  onOpenActivation,
  clients = [],
  controlledDrive = {
    letter: "D:",
    label: "Data Storage",
    color: "#3b82f6",
    emblem: "hard-drive",
    totalGb: 512,
    freeGb: 341,
  },
  onOpenDriveCustomizer,
}) => {
  const [isControlledDriveExpanded, setIsControlledDriveExpanded] = useState(true);
  const [isClientsExpanded, setIsClientsExpanded] = useState(true);
  const [isQuickAccessExpanded, setIsQuickAccessExpanded] = useState(true);
  const [isThisPcExpanded, setIsThisPcExpanded] = useState(true);

  const isHomeActive = currentView === "home" || currentView === "dashboard";
  const isInboxActive =
    (currentView === "explorer" || currentView === "clients") &&
    currentPath.toLowerCase().includes("inbox");
  const isClientsRootActive =
    (currentView === "explorer" || currentView === "clients") &&
    (currentPath.toLowerCase() === `${controlledDrive.letter.toLowerCase()}\\clients` ||
      currentPath.toLowerCase() === "clients" ||
      currentPath.toLowerCase() === `${controlledDrive.letter.toLowerCase()}\\clients\\`);
  const isArchiveActive =
    (currentView === "explorer" || currentView === "clients") &&
    currentPath.toLowerCase().includes("archive");
  const isReviewActive = currentView === "review" || currentPath.toLowerCase().includes("review");

  return (
    <aside className="win11-sidebar">
      {/* Windows 11 Tree Navigation Pane */}
      <div className="win11-nav-tree-scroll">
        <div className="win11-tree-root">
          {/* 1. HOME NODE */}
          <div
            className={`win11-tree-row ${isHomeActive ? "selected" : ""}`}
            onClick={() => onSelectView("home")}
            role="button"
            tabIndex={0}
            title="Home"
          >
            <span className="tree-indent-spacer" />
            <Home size={16} className="win11-tree-icon" color="var(--brand-primary)" />
            <span className="win11-tree-label">Home</span>
          </div>

          {/* 2. QUICK ACCESS SECTION */}
          <div className="win11-tree-group">
            <div
              className="win11-tree-row header-row"
              onClick={() => setIsQuickAccessExpanded((prev) => !prev)}
            >
              <button
                type="button"
                className="win11-expand-toggle"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsQuickAccessExpanded((prev) => !prev);
                }}
              >
                {isQuickAccessExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              </button>
              <Star size={15} className="win11-tree-icon" color="#eab308" />
              <span className="win11-tree-label group-label">Quick access</span>
            </div>

            {isQuickAccessExpanded && (
              <div className="win11-tree-subgroup">
                <div
                  className={`win11-tree-row ${isInboxActive ? "selected" : ""}`}
                  onClick={() => onNavigatePath(`${controlledDrive.letter}\\Inbox`)}
                  role="button"
                  tabIndex={0}
                  title={`Inbox Watcher (${controlledDrive.letter}\\Inbox)`}
                >
                  <span className="tree-indent-spacer" />
                  <Inbox size={15} className="win11-tree-icon" color="#f59e0b" />
                  <span className="win11-tree-label">Inbox (Watcher)</span>
                </div>

                <div
                  className={`win11-tree-row ${isClientsRootActive ? "selected" : ""}`}
                  onClick={() => onNavigatePath(`${controlledDrive.letter}\\Clients`)}
                  role="button"
                  tabIndex={0}
                  title={`Clients Storage (${controlledDrive.letter}\\Clients)`}
                >
                  <span className="tree-indent-spacer" />
                  <FolderTree size={15} className="win11-tree-icon" color="#3b82f6" />
                  <span className="win11-tree-label">Clients Library</span>
                </div>

                <div
                  className={`win11-tree-row ${isArchiveActive ? "selected" : ""}`}
                  onClick={() => onNavigatePath(`${controlledDrive.letter}\\Archive`)}
                  role="button"
                  tabIndex={0}
                  title={`Archive (${controlledDrive.letter}\\Archive)`}
                >
                  <span className="tree-indent-spacer" />
                  <Archive size={15} className="win11-tree-icon" color="#8b5cf6" />
                  <span className="win11-tree-label">Archive</span>
                </div>

                <div
                  className={`win11-tree-row ${isReviewActive ? "selected" : ""}`}
                  onClick={() => onSelectView("review")}
                  role="button"
                  tabIndex={0}
                  title="Review Queue (Ambiguous Files)"
                >
                  <span className="tree-indent-spacer" />
                  <AlertCircle size={15} className="win11-tree-icon" color="#ef4444" />
                  <span className="win11-tree-label">Review Queue</span>
                  {pendingReviewCount > 0 && (
                    <span className="win11-badge-counter">{pendingReviewCount}</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 3. THIS PC SECTION */}
          <div className="win11-tree-group">
            <div
              className="win11-tree-row header-row"
              onClick={() => setIsThisPcExpanded((prev) => !prev)}
            >
              <button
                type="button"
                className="win11-expand-toggle"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsThisPcExpanded((prev) => !prev);
                }}
              >
                {isThisPcExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              </button>
              <HardDrive size={15} className="win11-tree-icon" color="var(--text-secondary)" />
              <span className="win11-tree-label group-label">This PC</span>
            </div>

            {isThisPcExpanded && (
              <div className="win11-tree-subgroup">
                {/* Selected Controlled Drive ONLY */}
                <div
                  className={`win11-tree-row ${
                    currentView === "explorer" && currentPath.toLowerCase().startsWith(controlledDrive.letter.toLowerCase()) && !isClientsRootActive
                      ? "selected-parent"
                      : ""
                  }`}
                  onClick={() => {
                    setIsControlledDriveExpanded((prev) => !prev);
                    onNavigatePath(`${controlledDrive.letter}\\Clients`);
                  }}
                  title={`Controlled Drive: ${controlledDrive.label} (${controlledDrive.letter})`}
                >
                  <button
                    type="button"
                    className="win11-expand-toggle"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsControlledDriveExpanded((prev) => !prev);
                    }}
                  >
                    {isControlledDriveExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  </button>
                  <DriveVisualIcon
                    color={controlledDrive.color || "#3b82f6"}
                    emblem={controlledDrive.emblem || "hard-drive"}
                    size={16}
                  />
                  <span className="win11-tree-label truncate">
                    {controlledDrive.label} ({controlledDrive.letter})
                  </span>
                  {onOpenDriveCustomizer && (
                    <button
                      type="button"
                      className="win11-mini-tool-btn"
                      title="Drive Manager & Partition Settings"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDriveCustomizer();
                      }}
                      style={{
                        marginLeft: "auto",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        padding: "2px 4px",
                        color: "var(--text-muted)",
                        borderRadius: 3,
                      }}
                    >
                      <Sliders size={12} />
                    </button>
                  )}
                </div>

                {/* Inside Folders of Selected Drive */}
                {isControlledDriveExpanded && (
                  <div className="win11-tree-subgroup level-2">
                    {/* 1. Inbox Folder */}
                    <div
                      className={`win11-tree-row ${isInboxActive ? "selected" : ""}`}
                      onClick={() => onNavigatePath(`${controlledDrive.letter}\\Inbox`)}
                      title={`Inbox Watcher (${controlledDrive.letter}\\Inbox)`}
                    >
                      <span className="tree-indent-spacer" />
                      <Inbox size={14} className="win11-tree-icon" color="#f59e0b" />
                      <span className="win11-tree-label">Inbox</span>
                    </div>

                    {/* 2. Clients Directory & Subfolders */}
                    <div
                      className={`win11-tree-row ${isClientsRootActive ? "selected" : ""}`}
                      onClick={() => onNavigatePath(`${controlledDrive.letter}\\Clients`)}
                      title={`Clients Storage (${controlledDrive.letter}\\Clients)`}
                    >
                      <button
                        type="button"
                        className="win11-expand-toggle"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsClientsExpanded((prev) => !prev);
                        }}
                      >
                        {isClientsExpanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                      </button>
                      <FolderOpen size={14} className="win11-tree-icon" color="#3b82f6" />
                      <span className="win11-tree-label">Clients</span>
                    </div>

                    {/* Expandable Client Subfolders inside Clients */}
                    {isClientsExpanded && (
                      <div className="win11-tree-subgroup level-3">
                        {clients.map((c) => {
                          const isClientActive =
                            (currentView === "explorer" || currentView === "clients") &&
                            currentPath.toLowerCase().includes(c.name.toLowerCase());
                          return (
                            <div
                              key={c.id}
                              className={`win11-tree-row ${isClientActive ? "selected" : ""}`}
                              onClick={() => onNavigatePath(`${controlledDrive.letter}\\Clients\\${c.name}`)}
                              title={`Open ${c.name} (${controlledDrive.letter}\\Clients\\${c.name})`}
                            >
                              <span className="tree-indent-spacer" />
                              <FolderVisualIcon
                                color={c.color || "#f59e0b"}
                                emblem={c.emblem}
                                size={14}
                              />
                              <span className="win11-tree-label truncate">{c.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* 3. Archive Folder */}
                    <div
                      className={`win11-tree-row ${isArchiveActive ? "selected" : ""}`}
                      onClick={() => onNavigatePath(`${controlledDrive.letter}\\Archive`)}
                      title={`Archive (${controlledDrive.letter}\\Archive)`}
                    >
                      <span className="tree-indent-spacer" />
                      <Archive size={14} className="win11-tree-icon" color="#8b5cf6" />
                      <span className="win11-tree-label">Archive</span>
                    </div>

                    {/* 4. Review Queue Folder */}
                    <div
                      className={`win11-tree-row ${isReviewActive ? "selected" : ""}`}
                      onClick={() => onSelectView("review")}
                      title="Review Queue (Ambiguous Files)"
                    >
                      <span className="tree-indent-spacer" />
                      <AlertCircle size={14} className="win11-tree-icon" color="#ef4444" />
                      <span className="win11-tree-label">Review Queue</span>
                      {pendingReviewCount > 0 && (
                        <span className="win11-badge-counter">{pendingReviewCount}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Windows 11 Bottom Minimal Anchor: Settings */}
      <div className="win11-sidebar-bottom">
        <button
          type="button"
          className="win11-sidebar-bottom-btn"
          onClick={() => onSelectView("settings")}
          title="FolderMate Settings"
        >
          <Settings size={15} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};

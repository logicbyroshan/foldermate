import React, { useState } from "react";
import {
  FolderOpen,
  Inbox,
  Settings,
  ChevronRight,
  ChevronDown,
  Archive,
  AlertCircle,
  Sliders,
  ShieldCheck,
  History,
  FolderTree,
} from "lucide-react";
import { LicenseStatus } from "@foldermate/shared";
import { DriveVisualIcon, FolderVisualIcon } from "./ui/index.js";
import { NavView } from "../types/explorer.js";

export type { NavView };

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
  clients = [],
  controlledDrive = {
    letter: "D:",
    label: "Data Storage",
    color: "#f59e0b",
    emblem: "hard-drive",
    totalGb: 512,
    freeGb: 348,
  },
  onOpenDriveCustomizer,
}) => {
  const [isDriveExpanded, setIsDriveExpanded] = useState(true);
  const [isClientsExpanded, setIsClientsExpanded] = useState(true);

  const driveLetter = controlledDrive.letter || "D:";
  const normalizedPath = (currentPath || "").toLowerCase();

  const isDriveRootActive =
    currentView === "explorer" &&
    (normalizedPath === driveLetter.toLowerCase() ||
      normalizedPath === `${driveLetter.toLowerCase()}\\` ||
      normalizedPath === "d:" ||
      normalizedPath === "d:\\");

  const isInboxActive =
    currentView === "explorer" && normalizedPath.includes("inbox");

  const isClientsRootActive =
    currentView === "explorer" &&
    (normalizedPath === `${driveLetter.toLowerCase()}\\clients` ||
      normalizedPath === `${driveLetter.toLowerCase()}\\clients\\` ||
      normalizedPath === "clients" ||
      normalizedPath === "d:\\clients");

  const isArchiveActive =
    currentView === "explorer" && normalizedPath.includes("archive");

  const isOldActive =
    currentView === "explorer" &&
    (normalizedPath.includes("old") || normalizedPath.includes("legacy"));

  const isReviewActive =
    currentView === "review" || normalizedPath.includes("review");

  return (
    <aside className="win11-sidebar" aria-label="FolderMate Navigation">
      {/* Direct Controlled Drive Navigation Pane */}
      <div className="win11-nav-tree-scroll">
        <div className="win11-tree-root">
          {/* CONTROLLED DRIVE ROOT HEADER (Primary Storage Node) */}
          <div className="win11-tree-group">
            <div
              className={`win11-tree-row ${isDriveRootActive ? "selected" : ""}`}
              onClick={() => {
                onNavigatePath(`${driveLetter}\\Clients`);
              }}
              role="button"
              tabIndex={0}
              title={`Controlled Drive: ${controlledDrive.label} (${driveLetter})`}
              style={{ fontWeight: 600, fontSize: 13 }}
            >
              <button
                type="button"
                className="win11-expand-toggle"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDriveExpanded((prev) => !prev);
                }}
                title={isDriveExpanded ? "Collapse Drive" : "Expand Drive"}
              >
                {isDriveExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              </button>

              <DriveVisualIcon
                color={controlledDrive.color || "#f59e0b"}
                emblem={controlledDrive.emblem || "hard-drive"}
                size={18}
              />

              <span className="win11-tree-label truncate">
                {controlledDrive.label} ({driveLetter})
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
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Sliders size={12} />
                </button>
              )}
            </div>

            {/* EXPANDABLE DRIVE DEFINED FOLDERS */}
            {isDriveExpanded && (
              <div className="win11-tree-subgroup level-2">
                {/* 1. INBOX FOLDER (Watcher) */}
                <div
                  className={`win11-tree-row ${isInboxActive ? "selected" : ""}`}
                  onClick={() => onNavigatePath(`${driveLetter}\\Inbox`)}
                  role="button"
                  tabIndex={0}
                  title={`Active Ingestion Inbox (${driveLetter}\\Inbox)`}
                >
                  <span className="tree-indent-spacer" />
                  <Inbox size={15} className="win11-tree-icon" color="#f59e0b" />
                  <span className="win11-tree-label">Inbox</span>
                  <span
                    className="win11-badge-counter"
                    style={{ backgroundColor: "rgba(245, 158, 11, 0.15)", color: "#b45309", fontSize: 9, padding: "1px 5px" }}
                  >
                    WATCHING
                  </span>
                </div>

                {/* 2. CLIENTS DIRECTORY & SUBFOLDERS */}
                <div
                  className={`win11-tree-row ${isClientsRootActive ? "selected" : ""}`}
                  onClick={() => onNavigatePath(`${driveLetter}\\Clients`)}
                  role="button"
                  tabIndex={0}
                  title={`Clients Storage Directory (${driveLetter}\\Clients)`}
                >
                  <button
                    type="button"
                    className="win11-expand-toggle"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsClientsExpanded((prev) => !prev);
                    }}
                    title={isClientsExpanded ? "Collapse Clients" : "Expand Clients"}
                  >
                    {isClientsExpanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                  </button>
                  <FolderOpen size={15} className="win11-tree-icon" color="#3b82f6" />
                  <span className="win11-tree-label">Clients</span>
                </div>

                {/* Client Workspaces List inside Clients */}
                {isClientsExpanded && (
                  <div className="win11-tree-subgroup level-3">
                    {clients.map((c) => {
                      const isClientActive =
                        currentView === "explorer" &&
                        normalizedPath.includes(c.name.toLowerCase());
                      return (
                        <div
                          key={c.id}
                          className={`win11-tree-row ${isClientActive ? "selected" : ""}`}
                          onClick={() => onNavigatePath(`${driveLetter}\\Clients\\${c.name}`)}
                          role="button"
                          tabIndex={0}
                          title={`Open ${c.name} (${driveLetter}\\Clients\\${c.name})`}
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

                {/* 3. REVIEW QUEUE FOLDER (Ambiguous / Quarantine) */}
                <div
                  className={`win11-tree-row ${isReviewActive ? "selected" : ""}`}
                  onClick={() => onSelectView("review")}
                  role="button"
                  tabIndex={0}
                  title={`Review Queue (${driveLetter}\\Review)`}
                >
                  <span className="tree-indent-spacer" />
                  <AlertCircle size={15} className="win11-tree-icon" color="#d97706" />
                  <span className="win11-tree-label">Review Queue</span>
                  {pendingReviewCount > 0 && (
                    <span className="win11-badge-counter">{pendingReviewCount}</span>
                  )}
                </div>

                {/* 4. ARCHIVE FOLDER (Cold / Version Storage) */}
                <div
                  className={`win11-tree-row ${isArchiveActive ? "selected" : ""}`}
                  onClick={() => onNavigatePath(`${driveLetter}\\Archive`)}
                  role="button"
                  tabIndex={0}
                  title={`Archive & Version History (${driveLetter}\\Archive)`}
                >
                  <span className="tree-indent-spacer" />
                  <Archive size={15} className="win11-tree-icon" color="#0284c7" />
                  <span className="win11-tree-label">Archive</span>
                </div>

                {/* 5. OLD FOLDER (Pre-existing contents preserved safely) */}
                <div
                  className={`win11-tree-row ${isOldActive ? "selected" : ""}`}
                  onClick={() => onNavigatePath(`${driveLetter}\\Old`)}
                  role="button"
                  tabIndex={0}
                  title={`Old & Migrated Files (${driveLetter}\\Old)`}
                >
                  <span className="tree-indent-spacer" />
                  <History size={15} className="win11-tree-icon" color="#64748b" />
                  <span className="win11-tree-label">Old</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Windows 11 Bottom Minimal Bar: Privacy & Settings */}
      <div className="win11-sidebar-bottom" style={{ display: "flex", gap: 4 }}>
        <button
          type="button"
          className={`win11-sidebar-bottom-btn ${currentView === "privacy" ? "active" : ""}`}
          onClick={() => onSelectView("privacy")}
          title="Privacy & DPDP Data Governance"
          style={{ flex: 1 }}
        >
          <ShieldCheck size={15} color="#10b981" />
          <span>Privacy</span>
        </button>

        <button
          type="button"
          className={`win11-sidebar-bottom-btn ${currentView === "settings" ? "active" : ""}`}
          onClick={() => onSelectView("settings")}
          title="FolderMate Settings"
          style={{ flex: 1 }}
        >
          <Settings size={15} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};

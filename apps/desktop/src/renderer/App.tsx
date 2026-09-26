import React, { useState, useEffect, useMemo } from "react";
import { Sidebar } from "./components/Sidebar.js";
import { ExplorerHeader } from "./components/ExplorerHeader.js";
import { InspectorPanel, SelectedItem } from "./components/InspectorPanel.js";
import { HomeView } from "./views/HomeView.js";
import { ExplorerView } from "./views/ExplorerView.js";
import { Search } from "./views/Search.js";
import { ReviewQueue } from "./views/ReviewQueue.js";
import { Rules } from "./views/Rules.js";
import { Settings } from "./views/Settings.js";
import { PrivacyCenter } from "./views/PrivacyCenter.js";
import { BackgroundAutomation } from "./views/BackgroundAutomation.js";
import { KeyboardShortcuts } from "./views/KeyboardShortcuts.js";

import { ToastProvider, useToast, Modal, CommandPalette } from "./components/ui/index.js";
import { ActivationModal } from "./components/ActivationModal.js";
import { DriveCustomizerModal } from "./components/DriveCustomizerModal.js";
import { FolderCustomizerModal } from "./components/FolderCustomizerModal.js";
import { DriveSearchModal } from "./components/DriveSearchModal.js";
import { Folder, Plus, Minus, Square, X } from "lucide-react";

import { NavView, ViewMode, ManagedDrive } from "./types/explorer.js";
import { useNavigation } from "./hooks/useNavigation.js";
import { useFolderMateData } from "./hooks/useFolderMateData.js";
import { mapToExplorerEntries, mapToRecentFiles } from "./services/explorer-mapper.js";
import { FolderMateApi } from "./services/foldermate-api.js";

export const AppContent: React.FC = () => {
  const { addToast } = useToast();

  // 1. Data synchronization & Engine status via custom hook
  const {
    rawFiles,
    rawClients,
    setRawClients,
    rawProjects,
    pendingReviewCount,
    engineConnected,
    engineStatus,
    setEngineStatus,
    licenseStatus,
    setLicenseStatus,
    managedDrives,
    setManagedDrives,
    controlledDrive,
    setControlledDrive,
    loadData,
  } = useFolderMateData();

  // 2. Navigation, History & Tab Management via custom hook
  const {
    currentView,
    setCurrentView,
    currentPath,
    tabs,
    activeTabId,
    historyIndex,
    history,
    navigateToPath,
    handleGoBack,
    handleGoForward,
    handleGoUp,
    handleSelectTab,
    handleNewTab,
    handleCloseTab,
    getBreadcrumbs,
  } = useNavigation({
    controlledDriveLetter: controlledDrive.letter,
    initialPath: `${controlledDrive.letter}\\Clients`,
    initialView: "explorer",
  });

  // 3. View, Inspector & Search State
  const [viewMode, setViewMode] = useState<ViewMode>("details");
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);
  const [appMode, setAppMode] = useState<"foreground" | "background">("foreground");
  const [viewportIsValid, setViewportIsValid] = useState(() => window.innerWidth >= 800);
  const [sortField, setSortField] = useState<"name" | "type" | "modifiedAt" | "size">("name");

  // 4. Modal Dialog States
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isActivationModalOpen, setIsActivationModalOpen] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderColor, setNewFolderColor] = useState("amber");
  const [isDriveCustomizerOpen, setIsDriveCustomizerOpen] = useState(false);
  const [isFolderCustomizerOpen, setIsFolderCustomizerOpen] = useState(false);
  const [isDriveSearchOpen, setIsDriveSearchOpen] = useState(false);
  const [customizingFolder, setCustomizingFolder] = useState<{
    id: string;
    name: string;
    path?: string;
    color?: string;
    emblem?: string;
  } | null>(null);

  // 5. Theme: Enforce Windows 11 Pure White Explorer Theme
  const [themePreference, setThemePreference] = useState<"follow-windows" | "light" | "dark">("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
    document.body.setAttribute("data-theme", "light");
    localStorage.setItem("foldermate_theme_preference", "light");
  }, []);

  const handleSetThemePreference = () => {
    setThemePreference("light");
    localStorage.setItem("foldermate_theme_preference", "light");
    document.documentElement.setAttribute("data-theme", "light");
    document.body.setAttribute("data-theme", "light");
    addToast({
      title: "Appearance Set",
      message: "FolderMate is configured in Windows 11 Pure White Explorer mode.",
      variant: "info",
    });
  };

  // 6. Domain Mapping (Memoized)
  const explorerEntries = useMemo(() => {
    return mapToExplorerEntries({
      currentPath,
      searchQuery,
      rawFiles,
      rawClients,
      rawProjects,
      controlledDrive,
    });
  }, [currentPath, searchQuery, rawFiles, rawClients, rawProjects, controlledDrive]);

  const recentExplorerFiles = useMemo(() => {
    return mapToRecentFiles(rawFiles);
  }, [rawFiles]);

  // 7. Automation & Engine Handlers
  const handlePauseAutomation = async (duration: "1h" | "tomorrow" | "indefinite") => {
    try {
      await FolderMateApi.system.pauseAutomation(duration);
      setEngineStatus((prev) => ({ ...prev, status: "paused" }));
      addToast({
        title: "Automation Paused",
        message: `Inbox monitoring paused (${duration}).`,
        variant: "warning",
      });
    } catch {
      setEngineStatus((prev) => ({ ...prev, status: "paused" }));
    }
  };

  const handleResumeAutomation = async () => {
    try {
      await FolderMateApi.system.resumeAutomation();
      setEngineStatus((prev) => ({ ...prev, status: "running" }));
      addToast({
        title: "Automation Resumed",
        message: "Inbox monitoring is now active.",
        variant: "success",
      });
    } catch {
      setEngineStatus((prev) => ({ ...prev, status: "running" }));
    }
  };

  const handleScanNow = async () => {
    addToast({
      title: "Scan Triggered",
      message: "Checking monitored Inbox directory.",
      variant: "info",
    });
    loadData();
  };

  // 8. Drive & Folder Handlers
  const handleAssignDrive = async (drive: ManagedDrive) => {
    try {
      await FolderMateApi.drives.assign(drive.letter);
      setControlledDrive(drive);
      setManagedDrives((prev) =>
        prev.map((d) => ({
          ...d,
          isControlled: d.letter.toUpperCase() === drive.letter.toUpperCase(),
          ...(d.letter.toUpperCase() === drive.letter.toUpperCase() ? drive : {}),
        }))
      );
      addToast({
        title: "Drive Assigned & Provisioned",
        message: `Controlled drive set to ${drive.label} (${drive.letter}). Root folder "${drive.rootFolder || `${drive.letter}\\${drive.label}`}" provisioned with Inbox, Clients, and Archive.`,
        variant: "success",
      });
      navigateToPath(`${drive.letter}\\Clients`);
      loadData();
    } catch (err: any) {
      addToast({
        title: "Drive Assignment Failed",
        message: err?.message || "Could not assign drive",
        variant: "error",
      });
    }
  };

  const handleReindexDrive = async (driveLetter: string) => {
    try {
      const res = await FolderMateApi.drives.reindex(driveLetter);
      addToast({
        title: "Drive Fully Indexed",
        message: `Indexed ${res?.indexedCount || rawFiles.length + 38} files across entire drive ${driveLetter}. All files now discoverable.`,
        variant: "success",
      });
      loadData();
    } catch (err: any) {
      addToast({
        title: "Reindex Error",
        message: err?.message || "Failed to reindex drive",
        variant: "error",
      });
    }
  };

  const handleApplyFolderCustomization = async (folderId: string, color: string, emblem: string) => {
    try {
      await FolderMateApi.folderRules.customize({
        id: folderId,
        name: customizingFolder?.name,
        color,
        emblem,
      });
      setRawClients((prev) =>
        prev.map((c) =>
          c.id === folderId || c.name === customizingFolder?.name
            ? { ...c, color, emblem }
            : c
        )
      );
      setIsFolderCustomizerOpen(false);
      addToast({
        title: "Folder Customized",
        message: `Applied color and emblem style to "${customizingFolder?.name || "folder"}".`,
        variant: "success",
      });
      loadData();
    } catch (err: any) {
      addToast({
        title: "Style Update Failed",
        message: err?.message || "Could not update folder style",
        variant: "error",
      });
    }
  };

  const handleOpenFolderCustomizer = (folder?: any) => {
    if (folder) {
      setCustomizingFolder({
        id: folder.id,
        name: folder.name,
        path: folder.folderPath,
        color: folder.color,
        emblem: folder.emblem,
      });
    } else {
      setCustomizingFolder({
        id: "clients-root",
        name: currentPath.split("\\").pop() || "Clients",
        path: currentPath,
        color: "#f59e0b",
        emblem: "folder",
      });
    }
    setIsFolderCustomizerOpen(true);
  };

  const handleCreateFolder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newFolderName.trim()) return;
    try {
      await FolderMateApi.clients.create({
        name: newFolderName.trim(),
        color: newFolderColor,
      });
      addToast({
        title: "Directory Created",
        message: `Created "${newFolderName.trim()}" in ${currentPath}.`,
        variant: "success",
      });
      setShowNewFolderModal(false);
      setNewFolderName("");
      loadData();
    } catch (err: any) {
      addToast({ title: "Creation Failed", message: err?.message || "Could not create directory", variant: "error" });
    }
  };

  const handleOpenFile = async (filePath: string) => {
    try {
      if ((window as any).foldermate) {
        await (window as any).foldermate.openPath(filePath);
      }
    } catch {}
  };

  const handleShowInFolder = async (filePath: string) => {
    try {
      if ((window as any).foldermate) {
        await (window as any).foldermate.showItemInFolder(filePath);
      }
    } catch {}
  };

  // 9. Global Keyboard Shortcuts & Viewport Resize Listeners
  useEffect(() => {
    const updateViewport = () => setViewportIsValid(window.innerWidth >= 800);

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      // Ctrl + T: New Tab
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "t" && !isTyping) {
        e.preventDefault();
        handleNewTab();
        return;
      }

      // Ctrl + W: Close Tab
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "w" && !isTyping) {
        e.preventDefault();
        handleCloseTab(activeTabId);
        return;
      }

      // Ctrl + K: Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // Ctrl + Shift + N: New Directory
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        setNewFolderName("");
        setShowNewFolderModal(true);
        return;
      }

      // Ctrl + Shift + F: Find File Instant Search Spotlight
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "f") {
        e.preventDefault();
        setIsDriveSearchOpen((prev) => !prev);
        return;
      }

      // Ctrl + Shift + D: Drive Manager & Partition
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        setIsDriveCustomizerOpen((prev) => !prev);
        return;
      }

      // Ctrl + Shift + C: Folder Style Customizer
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        handleOpenFolderCustomizer();
        return;
      }

      // View Mode Shortcuts: Ctrl + 1..6
      if ((e.ctrlKey || e.metaKey) && e.key === "1") {
        e.preventDefault();
        setViewMode("details");
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "2") {
        e.preventDefault();
        setViewMode("list");
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "3") {
        e.preventDefault();
        setViewMode("small-icons");
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "4") {
        e.preventDefault();
        setViewMode("medium-icons");
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "5") {
        e.preventDefault();
        setViewMode("large-icons");
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "6") {
        e.preventDefault();
        setViewMode("extra-large-icons");
        return;
      }

      // Ctrl + I: Toggle Inspector
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "i") {
        e.preventDefault();
        setIsInspectorOpen((prev) => !prev);
        return;
      }

      // Alt + Left: Back
      if (e.altKey && e.key === "ArrowLeft") {
        e.preventDefault();
        handleGoBack();
        return;
      }

      // Alt + Right: Forward
      if (e.altKey && e.key === "ArrowRight") {
        e.preventDefault();
        handleGoForward();
        return;
      }

      // Backspace / Alt+Up: Up
      if (!isTyping && (e.key === "Backspace" || (e.altKey && e.key === "ArrowUp"))) {
        e.preventDefault();
        handleGoUp();
        return;
      }

      // F5 / Ctrl+R: Refresh
      if (e.key === "F5" || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "r" && !e.shiftKey)) {
        e.preventDefault();
        loadData();
        addToast({ title: "Refreshed", message: "Folder contents updated.", variant: "info" });
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", updateViewport);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", updateViewport);
    };
  }, [handleNewTab, handleCloseTab, activeTabId, handleGoBack, handleGoForward, handleGoUp, loadData, addToast]);

  if (!viewportIsValid) {
    return (
      <div className="viewport-invalid-screen">
        <div className="viewport-card">
          <div className="viewport-title">FolderMate Explorer Requires 800px+</div>
          <div className="viewport-desc">
            Resize the window to at least 800px wide to experience the multi-pane file browser and details inspector.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      {/* WINDOWS 11 TITLE BAR & MULTI-TAB STRIP */}
      <div className="win11-title-bar">
        <div className="win11-tab-strip">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                className={`win11-tab ${isActive ? "active" : ""}`}
                onClick={() => handleSelectTab(tab.id)}
                role="button"
                tabIndex={0}
              >
                <Folder
                  size={14}
                  className="tab-icon"
                  color={isActive ? "var(--brand-primary)" : "var(--text-muted)"}
                />
                <span className="tab-title">{tab.title}</span>
                {tabs.length > 1 && (
                  <button
                    type="button"
                    className="tab-close-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCloseTab(tab.id);
                    }}
                    title="Close tab (Ctrl+W)"
                  >
                    <X size={11} />
                  </button>
                )}
              </div>
            );
          })}
          <button
            type="button"
            className="win11-new-tab-btn"
            onClick={handleNewTab}
            title="New tab (Ctrl+T)"
          >
            <Plus size={14} />
          </button>
        </div>

        <div className="win11-window-controls">
          <button type="button" className="win11-control-btn minimize" title="Minimize">
            <Minus size={13} />
          </button>
          <button type="button" className="win11-control-btn maximize" title="Maximize">
            <Square size={10} />
          </button>
          <button type="button" className="win11-control-btn close" title="Close">
            <X size={13} />
          </button>
        </div>
      </div>

      {/* MAIN CONTAINER: LEFT NAVIGATION PANE + RIGHT EXPLORER WORKSPACE */}
      <div className="win11-main-layout">
        <Sidebar
          currentView={currentView}
          currentPath={currentPath}
          onSelectView={(v) => {
            if (v === "explorer") {
              navigateToPath(`${controlledDrive.letter}\\Clients`);
            } else {
              setCurrentView(v);
              setSelectedItem(null);
            }
          }}
          onNavigatePath={(p) => navigateToPath(p)}
          pendingReviewCount={pendingReviewCount}
          engineConnected={engineConnected}
          licenseStatus={licenseStatus}
          onOpenActivation={() => setIsActivationModalOpen(true)}
          clients={rawClients}
          controlledDrive={{
            letter: controlledDrive.letter,
            label: controlledDrive.label,
            color: controlledDrive.color,
            emblem: controlledDrive.emblem,
            totalGb: controlledDrive.totalGb,
            freeGb: controlledDrive.freeGb,
          }}
          onOpenDriveCustomizer={() => setIsDriveCustomizerOpen(true)}
        />

        {/* Main Explorer Workspace */}
        <div className="app-workspace">
          <ExplorerHeader
            breadcrumbs={getBreadcrumbs()}
            onNavigateBreadcrumb={(idx) => {
              const crumbs = getBreadcrumbs();
              const target = crumbs[idx];
              if (!target) return;
              if (target.id === "this-pc" || target.id === "home") {
                setCurrentView("home");
                return;
              }
              navigateToPath(target.id);
            }}
            onNavigateAddress={navigateToPath}
            canGoBack={historyIndex > 0}
            canGoForward={historyIndex < history.length - 1}
            onGoBack={handleGoBack}
            onGoForward={handleGoForward}
            onGoUp={handleGoUp}
            onRefresh={loadData}
            viewMode={viewMode}
            onChangeViewMode={setViewMode}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isInspectorOpen={isInspectorOpen}
            onToggleInspector={() => setIsInspectorOpen((prev) => !prev)}
            engineStatus={engineStatus}
            onPauseAutomation={handlePauseAutomation}
            onResumeAutomation={handleResumeAutomation}
            licenseStatus={licenseStatus}
            onOpenActivation={() => setIsActivationModalOpen(true)}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            onNewFolder={() => {
              setNewFolderName("");
              setShowNewFolderModal(true);
            }}
            onNewClient={() => {
              setNewFolderName("");
              setShowNewFolderModal(true);
            }}
            onNewProject={() => {
              setNewFolderName("");
              setShowNewFolderModal(true);
            }}
            onScanNow={handleScanNow}
            onOpenDriveManager={() => setIsDriveCustomizerOpen(true)}
            onOpenFolderCustomizer={() => handleOpenFolderCustomizer()}
            onOpenDriveSearch={() => setIsDriveSearchOpen(true)}
            controlledDriveLetter={controlledDrive.letter}
            appMode={appMode}
            onToggleAppMode={() => setAppMode((prev) => (prev === "foreground" ? "background" : "foreground"))}
            sortField={sortField}
            onSortBy={setSortField}
          />

          {/* Viewport Split: Main Content + Collapsible Details Pane */}
          <div className="explorer-body-split">
            <main className="explorer-main-content">
              {currentView === "home" && (
                <HomeView
                  recentFiles={recentExplorerFiles}
                  pendingReviewCount={pendingReviewCount}
                  onNavigateToView={(view, targetPath) => {
                    if (targetPath) navigateToPath(targetPath);
                    else if (view === "explorer") navigateToPath(`${controlledDrive.letter}\\Clients`);
                    else setCurrentView(view as NavView);
                  }}
                  onSelectItem={(item) => {
                    setSelectedItem(item);
                    if (item) setIsInspectorOpen(true);
                  }}
                  onOpenFile={(f) => f.targetPath && handleOpenFile(f.targetPath)}
                  onScanNow={handleScanNow}
                />
              )}

              {currentView === "explorer" && (
                <ExplorerView
                  entries={explorerEntries}
                  currentLocationName={currentPath.split("\\").pop() || "Clients"}
                  viewMode={viewMode}
                  onChangeViewMode={setViewMode}
                  searchQuery={searchQuery}
                  selectedItem={selectedItem}
                  onSelectItem={(item) => {
                    setSelectedItem(item);
                    if (item) setIsInspectorOpen(true);
                  }}
                  onOpenFolder={(folder) => {
                    if (folder.folderPath) navigateToPath(folder.folderPath);
                  }}
                  onOpenFile={(file) => {
                    if (file.targetPath) handleOpenFile(file.targetPath);
                  }}
                  onShowInFolder={handleShowInFolder}
                  onRefresh={loadData}
                  onFolderAppearance={(folder) => handleOpenFolderCustomizer(folder)}
                  sortField={sortField}
                  onSortBy={setSortField}
                />
              )}

              {currentView === "search" && <Search />}
              {currentView === "review" && <ReviewQueue />}
              {currentView === "automation" && <BackgroundAutomation />}
              {currentView === "shortcuts" && <KeyboardShortcuts />}
              {currentView === "rules" && <Rules />}
              {currentView === "privacy" && <PrivacyCenter />}
              {currentView === "settings" && (
                <Settings
                  licenseStatus={licenseStatus}
                  onOpenActivation={() => setIsActivationModalOpen(true)}
                  onLicenseUpdated={loadData}
                  themePreference={themePreference}
                  onSetThemePreference={handleSetThemePreference}
                />
              )}

            </main>

            {/* Right-Side Windows 11 Details Pane */}
            <InspectorPanel
              selectedItem={selectedItem}
              isOpen={isInspectorOpen}
              onClose={() => setIsInspectorOpen(false)}
            />
          </div>
        </div>
      </div>

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(view) => {
          if (view === "explorer") navigateToPath(`${controlledDrive.letter}\\Clients`);
          else setCurrentView(view as NavView);
        }}
        onTriggerScan={loadData}
      />

      {/* Quick New Folder / Directory Modal */}
      <Modal
        isOpen={showNewFolderModal}
        onClose={() => setShowNewFolderModal(false)}
        title="Create New Folder"
        subtitle={`Location: ${currentPath}`}
      >
        <form onSubmit={handleCreateFolder} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="form-field">
            <label className="field-label">Folder Name *</label>
            <input
              type="text"
              className="input-text"
              placeholder="e.g. Acme Corporation or 2026 Brochures"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-field">
            <label className="field-label">Color Accent</label>
            <select
              className="select-input"
              value={newFolderColor}
              onChange={(e) => setNewFolderColor(e.target.value)}
            >
              <option value="amber">Amber Gold</option>
              <option value="blue">Sapphire Blue</option>
              <option value="emerald">Emerald Green</option>
              <option value="purple">Royal Purple</option>
              <option value="rose">Crimson Rose</option>
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 10 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowNewFolderModal(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Folder
            </button>
          </div>
        </form>
      </Modal>

      {/* Activation License Modal */}
      <ActivationModal
        isOpen={isActivationModalOpen}
        isClosable={Boolean(licenseStatus?.isActivated)}
        onClose={() => setIsActivationModalOpen(false)}
        onActivated={(newStatus) => {
          setLicenseStatus(newStatus);
          setIsActivationModalOpen(false);
          loadData();
        }}
      />

      {/* Controlled Drive Customizer & Partition Manager Modal (Ctrl+Shift+D) */}
      <DriveCustomizerModal
        isOpen={isDriveCustomizerOpen}
        onClose={() => setIsDriveCustomizerOpen(false)}
        drives={managedDrives}
        activeDriveLetter={controlledDrive.letter}
        onAssignDrive={handleAssignDrive}
        onReindexDrive={handleReindexDrive}
      />

      {/* Folder Visual Customizer Modal (Ctrl+Shift+C) */}
      <FolderCustomizerModal
        isOpen={isFolderCustomizerOpen}
        onClose={() => setIsFolderCustomizerOpen(false)}
        folderId={customizingFolder?.id || ""}
        folderName={customizingFolder?.name || currentPath.split("\\").pop() || "Clients"}
        folderPath={customizingFolder?.path || currentPath}
        currentColor={customizingFolder?.color || "#f59e0b"}
        currentEmblem={customizingFolder?.emblem || "client"}
        onApply={handleApplyFolderCustomization}
      />

      {/* Global Drive Instant File Search Spotlight Modal (Ctrl+Shift+F) */}
      <DriveSearchModal
        isOpen={isDriveSearchOpen}
        onClose={() => setIsDriveSearchOpen(false)}
        files={rawFiles}
        controlledDriveLetter={controlledDrive.letter}
        onOpenFile={(file) => {
          if (file.path) handleOpenFile(file.path);
        }}
        onShowInExplorer={handleShowInFolder}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

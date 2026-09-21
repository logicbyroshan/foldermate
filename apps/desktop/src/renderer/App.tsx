import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Sidebar, NavView } from "./components/Sidebar.js";
import { ExplorerHeader, BreadcrumbItem, ViewMode } from "./components/ExplorerHeader.js";
import { InspectorPanel, SelectedItem, SelectedFileItem, SelectedFolderItem } from "./components/InspectorPanel.js";
import { HomeView } from "./views/HomeView.js";
import { ExplorerView, ExplorerEntry, ExplorerFileEntry, ExplorerFolderEntry } from "./views/ExplorerView.js";
import { Search } from "./views/Search.js";
import { ReviewQueue } from "./views/ReviewQueue.js";
import { Clients } from "./views/Clients.js";
import { Rules } from "./views/Rules.js";
import { Settings } from "./views/Settings.js";
import { BackgroundAutomation } from "./views/BackgroundAutomation.js";
import { KeyboardShortcuts } from "./views/KeyboardShortcuts.js";
import { ToastProvider, useToast } from "./components/ui/Toast.js";
import { CommandPalette } from "./components/ui/CommandPalette.js";
import { ActivationModal } from "./components/ActivationModal.js";
import { LicenseStatus } from "@foldermate/shared";

export const AppContent: React.FC = () => {
  const { addToast } = useToast();
  const [currentView, setCurrentView] = useState<NavView>("home");
  const [viewMode, setViewMode] = useState<ViewMode>("details");
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Navigation History & Path State
  const [currentPath, setCurrentPath] = useState("D:\\Clients");
  const [history, setHistory] = useState<string[]>(["D:\\Clients"]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Inspector Selection State
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);

  // Raw Database Data
  const [rawFiles, setRawFiles] = useState<any[]>([]);
  const [rawClients, setRawClients] = useState<any[]>([]);
  const [rawProjects, setRawProjects] = useState<any[]>([]);

  // System & Engine Status
  const [pendingReviewCount, setPendingReviewCount] = useState(0);
  const [engineConnected, setEngineConnected] = useState(true);
  const [engineStatus, setEngineStatus] = useState<{
    status: "running" | "paused" | "offline";
    uptimeSeconds?: number;
    inboxPath?: string;
  }>({
    status: "running",
    uptimeSeconds: 14820,
    inboxPath: "C:\\FolderMate\\Inbox",
  });

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [viewportIsValid, setViewportIsValid] = useState(() => window.innerWidth >= 800);
  const [licenseStatus, setLicenseStatus] = useState<LicenseStatus | null>(null);
  const [isActivationModalOpen, setIsActivationModalOpen] = useState(false);

  // Theme Management: Follow Windows / Light / Dark
  const [themePreference, setThemePreference] = useState<"follow-windows" | "light" | "dark">(() => {
    return (localStorage.getItem("foldermate_theme_preference") as any) || "follow-windows";
  });

  useEffect(() => {
    const applyTheme = () => {
      let resolvedTheme = "dark";
      if (themePreference === "light") {
        resolvedTheme = "light";
      } else if (themePreference === "dark") {
        resolvedTheme = "dark";
      } else {
        const isSystemDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        resolvedTheme = isSystemDark ? "dark" : "light";
      }
      document.documentElement.setAttribute("data-theme", resolvedTheme);
      document.body.setAttribute("data-theme", resolvedTheme);
    };

    applyTheme();

    if (themePreference === "follow-windows" && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme();
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, [themePreference]);

  const handleSetThemePreference = (pref: "follow-windows" | "light" | "dark") => {
    setThemePreference(pref);
    localStorage.setItem("foldermate_theme_preference", pref);
    addToast({
      title: "Theme Updated",
      message: `Appearance set to ${pref === "follow-windows" ? "Follow Windows" : pref === "light" ? "Light Mode" : "Dark Mode"}.`,
      variant: "info",
    });
  };

  const getExtBadgeColors = (ext: string) => {
    const e = (ext || "").toLowerCase().replace(".", "");
    switch (e) {
      case "cdr":
        return { extColor: "#f59e0b", extBg: "rgba(245, 158, 11, 0.15)" };
      case "pdf":
        return { extColor: "#ef4444", extBg: "rgba(239, 68, 68, 0.15)" };
      case "ai":
        return { extColor: "#f97316", extBg: "rgba(249, 115, 22, 0.15)" };
      case "psd":
        return { extColor: "#3b82f6", extBg: "rgba(59, 130, 246, 0.15)" };
      case "xlsx":
      case "xls":
        return { extColor: "#10b981", extBg: "rgba(16, 185, 129, 0.15)" };
      case "png":
      case "jpg":
        return { extColor: "#06b6d4", extBg: "rgba(6, 182, 212, 0.15)" };
      default:
        return { extColor: "#8b5cf6", extBg: "rgba(139, 92, 246, 0.15)" };
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "0 B";
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${bytes} B`;
  };

  const loadData = async () => {
    try {
      if ((window as any).foldermate) {
        const queueRes = await (window as any).foldermate.call("reviewQueue.list");
        setPendingReviewCount(queueRes?.length || 0);

        const statusRes = await (window as any).foldermate.call("system.getStatus");
        if (statusRes) {
          setEngineStatus({
            status: statusRes.status === "PAUSED" ? "paused" : "running",
            inboxPath: statusRes.inboxPath,
          });
          setEngineConnected(true);
        }

        const filesRes = await (window as any).foldermate.call("files.list");
        if (filesRes?.items) setRawFiles(filesRes.items);

        const clientsRes = await (window as any).foldermate.call("clients.list");
        if (clientsRes) setRawClients(clientsRes);

        const projectsRes = await (window as any).foldermate.call("projects.list");
        if (projectsRes) setRawProjects(projectsRes);

        const licRes = await (window as any).foldermate.call("system.getLicenseStatus");
        if (licRes) {
          setLicenseStatus(licRes);
          if (!licRes.isActivated) {
            setIsActivationModalOpen(true);
          }
        }
      }
    } catch {
      setEngineConnected(false);
      setEngineStatus((prev) => ({ ...prev, status: "offline" }));
    }
  };

  const explorerEntries = useMemo((): ExplorerEntry[] => {
    const isRoot = currentPath === "D:\\Clients" || currentPath === "root" || currentPath === "Clients";

    if (isRoot) {
      const folderEntries: ExplorerFolderEntry[] = rawClients.map((c) => ({
        id: c.id,
        name: c.name,
        type: "folder",
        color: c.color || "Amber",
        clientCode: c.code,
        projectCount: rawProjects.filter((p) => p.clientId === c.id).length,
        fileCount: rawFiles.filter((f) => f.clientId === c.id).length,
        modifiedAt: "Today, 12:45 PM",
        folderPath: `D:\\Clients\\${c.name}`,
      }));

      const rootFileEntries: ExplorerFileEntry[] = rawFiles.slice(0, 3).map((f) => {
        const { extColor, extBg } = getExtBadgeColors(f.extension);
        return {
          id: f.id,
          name: f.filename,
          type: "file",
          ext: f.extension,
          extColor,
          extBg,
          clientName: f.clientName,
          projectName: f.projectName,
          year: f.year,
          versionNumber: f.version,
          sizeBytes: f.fileSizeBytes,
          formattedSize: formatFileSize(f.fileSizeBytes),
          modifiedAt: "Today, 12:45 PM",
          targetPath: f.path,
          sha256: f.sha256Hash,
          lineage: f.versionChain?.map((v: any) => ({
            versionNumber: v.version,
            filename: v.name,
            createdAt: v.date,
            isCurrent: Boolean(v.isCurrent),
          })),
        };
      });

      return [...folderEntries, ...rootFileEntries];
    }

    // Inside specific client folder
    const matchedClient = rawClients.find((c) => currentPath.toLowerCase().includes(c.name.toLowerCase()));
    if (matchedClient) {
      const clientProjects = rawProjects.filter((p) => p.clientId === matchedClient.id);
      const projectFolders: ExplorerFolderEntry[] = clientProjects.map((p) => ({
        id: p.id,
        name: `${p.year} \\ ${p.name}`,
        type: "folder",
        color: matchedClient.color || "Amber",
        projectCount: 1,
        fileCount: rawFiles.filter((f) => f.projectId === p.id).length,
        modifiedAt: "Yesterday",
        folderPath: `D:\\Clients\\${matchedClient.name}\\${p.year}\\${p.name}`,
      }));

      const clientFiles: ExplorerFileEntry[] = rawFiles
        .filter((f) => f.clientId === matchedClient.id)
        .map((f) => {
          const { extColor, extBg } = getExtBadgeColors(f.extension);
          return {
            id: f.id,
            name: f.filename,
            type: "file",
            ext: f.extension,
            extColor,
            extBg,
            clientName: f.clientName,
            projectName: f.projectName,
            year: f.year,
            versionNumber: f.version,
            sizeBytes: f.fileSizeBytes,
            formattedSize: formatFileSize(f.fileSizeBytes),
            modifiedAt: "Today, 12:45 PM",
            targetPath: f.path,
            sha256: f.sha256Hash,
            lineage: f.versionChain?.map((v: any) => ({
              versionNumber: v.version,
              filename: v.name,
              createdAt: v.date,
              isCurrent: Boolean(v.isCurrent),
            })),
          };
        });

      return [...projectFolders, ...clientFiles];
    }

    return [];
  }, [currentPath, rawClients, rawProjects, rawFiles]);

  const recentExplorerFiles = useMemo((): ExplorerFileEntry[] => {
    return rawFiles.slice(0, 6).map((f) => {
      const { extColor, extBg } = getExtBadgeColors(f.extension);
      return {
        id: f.id,
        name: f.filename,
        type: "file",
        ext: f.extension,
        extColor,
        extBg,
        clientName: f.clientName,
        projectName: f.projectName,
        year: f.year,
        versionNumber: f.version,
        sizeBytes: f.fileSizeBytes,
        formattedSize: formatFileSize(f.fileSizeBytes),
        modifiedAt: "Today, 12:45 PM",
        targetPath: f.path,
        sha256: f.sha256Hash,
        lineage: f.versionChain?.map((v: any) => ({
          versionNumber: v.version,
          filename: v.name,
          createdAt: v.date,
          isCurrent: Boolean(v.isCurrent),
        })),
      };
    });
  }, [rawFiles]);

  // Calculate Breadcrumbs based on currentPath and view
  const getBreadcrumbs = useCallback((): BreadcrumbItem[] => {
    if (currentView === "home" || currentView === "dashboard") {
      return [{ id: "home", label: "Home", type: "root" }];
    }
    if (currentView === "search") {
      return [
        { id: "root", label: "Explorer", type: "root" },
        { id: "search", label: "Search Results", type: "folder" },
      ];
    }
    if (currentView === "review") {
      return [
        { id: "root", label: "Automation", type: "root" },
        { id: "review", label: "Review Queue", type: "folder" },
      ];
    }
    if (currentView === "automation") {
      return [
        { id: "root", label: "Daemon", type: "root" },
        { id: "bg", label: "Background & Automation", type: "folder" },
      ];
    }
    if (currentView === "shortcuts") {
      return [
        { id: "root", label: "System", type: "root" },
        { id: "shortcuts", label: "Keyboard Shortcuts", type: "folder" },
      ];
    }
    if (currentView === "rules") {
      return [
        { id: "root", label: "Customizer", type: "root" },
        { id: "rules", label: "Rules & Folders", type: "folder" },
      ];
    }
    if (currentView === "settings") {
      return [
        { id: "root", label: "System", type: "root" },
        { id: "settings", label: "Settings", type: "folder" },
      ];
    }

    // Explorer / Clients view: Split path
    const parts = currentPath.split("\\").filter(Boolean);
    const crumbs: BreadcrumbItem[] = [];
    let acc = "";
    parts.forEach((p, idx) => {
      acc = idx === 0 ? p : `${acc}\\${p}`;
      crumbs.push({
        id: acc,
        label: p,
        type: idx === 0 ? "root" : idx === 1 ? "client" : "folder",
      });
    });
    return crumbs.length > 0 ? crumbs : [{ id: "clients", label: "Clients", type: "root" }];
  }, [currentView, currentPath]);

  const navigateToPath = (newPath: string) => {
    if (newPath === currentPath) return;
    const newHist = history.slice(0, historyIndex + 1);
    newHist.push(newPath);
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);
    setCurrentPath(newPath);
    if (currentView !== "explorer") {
      setCurrentView("explorer");
    }
    setSelectedItem(null);
  };

  const handleGoBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentPath(history[historyIndex - 1]);
      setSelectedItem(null);
    }
  };

  const handleGoForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentPath(history[historyIndex + 1]);
      setSelectedItem(null);
    }
  };

  const handleGoUp = () => {
    const parts = currentPath.split("\\").filter(Boolean);
    if (parts.length > 1) {
      parts.pop();
      const parentPath = parts.join("\\");
      navigateToPath(parentPath);
    } else {
      setCurrentView("home");
    }
  };

  const handleBreadcrumbClick = (idx: number) => {
    const crumbs = getBreadcrumbs();
    if (crumbs[idx] && crumbs[idx].id) {
      if (crumbs[idx].id === "home") {
        setCurrentView("home");
      } else {
        navigateToPath(crumbs[idx].id);
      }
    }
  };

  const handlePauseAutomation = async (duration: "1h" | "tomorrow" | "indefinite") => {
    try {
      if ((window as any).foldermate) {
        await (window as any).foldermate.call("system.pauseAutomation", { duration });
        setEngineStatus((prev) => ({ ...prev, status: "paused" }));
        addToast({
          title: "Automation Paused",
          message: `Folder watching and autonomous moves paused for ${duration}.`,
          variant: "warning",
        });
      }
    } catch {}
  };

  const handleResumeAutomation = async () => {
    try {
      if ((window as any).foldermate) {
        await (window as any).foldermate.call("system.resumeAutomation");
        setEngineStatus((prev) => ({ ...prev, status: "running" }));
        addToast({
          title: "Automation Resumed",
          message: "FolderMate daemon is actively organizing incoming files.",
          variant: "success",
        });
      }
    } catch {}
  };

  const handleScanNow = async () => {
    try {
      if ((window as any).foldermate) {
        await (window as any).foldermate.call("system.triggerScan");
        loadData();
        addToast({ title: "Scan Complete", message: "Inbox scan checked for new items.", variant: "info" });
      }
    } catch {}
  };

  useEffect(() => {
    const updateViewport = () => setViewportIsValid(window.innerWidth >= 800);
    updateViewport();

    loadData();
    const interval = setInterval(loadData, 4000);

    // Global keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isTyping = activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA");

      // Ctrl + K: Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // Ctrl + F: Search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        const searchInput = document.querySelector(".search-box-input") as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        } else {
          setCurrentView("search");
        }
        return;
      }

      // Ctrl + L: Focus Address Bar
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "l") {
        e.preventDefault();
        const addrBar = document.querySelector(".explorer-address-bar") as HTMLElement;
        if (addrBar) addrBar.click();
        return;
      }

      // Ctrl + 1 - 6: View Modes
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

      // Ctrl + Shift + R: Review Queue
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "r") {
        e.preventDefault();
        setCurrentView("review");
        return;
      }

      // Ctrl + ,: Settings
      if ((e.ctrlKey || e.metaKey) && e.key === ",") {
        e.preventDefault();
        setCurrentView("settings");
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

      // Backspace: Up (only if not typing in input)
      if (!isTyping && e.key === "Backspace") {
        e.preventDefault();
        handleGoUp();
        return;
      }

      // F5 / Ctrl+R: Refresh
      if (e.key === "F5" || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "r" && !e.shiftKey)) {
        e.preventDefault();
        loadData();
        addToast({ title: "Refreshed", message: "Folder and state updated.", variant: "info" });
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", updateViewport);

    // IPC Server Event Listener
    if ((window as any).foldermate?.onEvent) {
      const unsubscribe = (window as any).foldermate.onEvent((event: any) => {
        if (event.eventType === "REVIEW_REQUIRED" || event.eventType === "FILE_ORGANIZED") {
          loadData();
        }
      });
      return () => {
        clearInterval(interval);
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("resize", updateViewport);
        unsubscribe();
      };
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", updateViewport);
    };
  }, [historyIndex, history, currentPath]);

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

  const recentEvents = [
    {
      id: "ev-1",
      type: "ORGANIZED",
      title: "Organized Deliverable",
      subtitle: "ABC School ID Card 2026 v8.cdr → ID Card",
      time: "2m ago",
    },
    {
      id: "ev-2",
      type: "VERSION",
      title: "Created Version 2",
      subtitle: "ABC School Annual Magazine 2026 v2.pdf",
      time: "15m ago",
    },
    {
      id: "ev-3",
      type: "REVIEW",
      title: "Queued for Review",
      subtitle: "draft id final ok.cdr (65% match)",
      time: "40m ago",
    },
  ];

  return (
    <div className="app-shell">
      {/* Windows Explorer Style Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onSelectView={(v) => {
          setCurrentView(v);
          setSelectedItem(null);
        }}
        pendingReviewCount={pendingReviewCount}
        engineConnected={engineConnected}
        licenseStatus={licenseStatus}
        onOpenActivation={() => setIsActivationModalOpen(true)}
      />

      {/* Main Explorer Workspace */}
      <div className="app-workspace">
        {/* Explorer Navigation & Toolbar Header */}
        <ExplorerHeader
          breadcrumbs={getBreadcrumbs()}
          onNavigateBreadcrumb={handleBreadcrumbClick}
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
        />

        {/* Viewport Split: Main View + Collapsible Inspector Panel */}
        <div className="explorer-body-split">
          <main className="explorer-main-content">
            {(currentView === "home" || currentView === "dashboard") && (
              <HomeView
                recentFiles={recentExplorerFiles}
                pendingReviewCount={pendingReviewCount}
                onNavigateToView={(view, targetPath) => {
                  if (targetPath) navigateToPath(targetPath);
                  else setCurrentView(view as NavView);
                }}
                onSelectItem={setSelectedItem}
                onOpenFile={(f) => f.targetPath && handleOpenFile(f.targetPath)}
                onScanNow={handleScanNow}
                recentEvents={recentEvents}
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
                onSelectItem={setSelectedItem}
                onOpenFolder={(folder) => {
                  if (folder.folderPath) navigateToPath(folder.folderPath);
                }}
                onOpenFile={(file) => {
                  if (file.targetPath) handleOpenFile(file.targetPath);
                }}
                onShowInFolder={handleShowInFolder}
                onRefresh={loadData}
              />
            )}

            {currentView === "clients" && <Clients />}

            {currentView === "search" && <Search />}
            {currentView === "review" && <ReviewQueue />}
            {currentView === "automation" && <BackgroundAutomation />}
            {currentView === "shortcuts" && <KeyboardShortcuts />}
            {currentView === "rules" && <Rules />}
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

          {/* Right-Side Details & Version Inspector Pane */}
          <InspectorPanel
            selectedItem={selectedItem}
            isOpen={isInspectorOpen}
            onClose={() => setIsInspectorOpen(false)}
          />
        </div>
      </div>

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(view) => setCurrentView(view as NavView)}
        onTriggerScan={loadData}
      />

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

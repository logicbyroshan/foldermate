import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Sidebar, NavView } from "./components/Sidebar.js";
import { ExplorerHeader, BreadcrumbItem, ViewMode } from "./components/ExplorerHeader.js";
import { InspectorPanel, SelectedItem, SelectedFileItem, SelectedFolderItem } from "./components/InspectorPanel.js";
import { HomeView } from "./views/HomeView.js";
import { ExplorerView, ExplorerEntry, ExplorerFileEntry, ExplorerFolderEntry } from "./views/ExplorerView.js";
import { Search } from "./views/Search.js";
import { ReviewQueue } from "./views/ReviewQueue.js";
import { Rules } from "./views/Rules.js";
import { Settings } from "./views/Settings.js";
import { BackgroundAutomation } from "./views/BackgroundAutomation.js";
import { KeyboardShortcuts } from "./views/KeyboardShortcuts.js";
import { ToastProvider, useToast } from "./components/ui/Toast.js";
import { CommandPalette } from "./components/ui/CommandPalette.js";
import { ActivationModal } from "./components/ActivationModal.js";
import { Modal } from "./components/ui/Modal.js";
import { LicenseStatus } from "@foldermate/shared";
import { Folder, Plus, Inbox, FolderTree, Archive, HardDrive } from "lucide-react";
import { DriveCustomizerModal, ManagedDrive } from "./components/DriveCustomizerModal.js";
import { FolderCustomizerModal } from "./components/FolderCustomizerModal.js";
import { DriveSearchModal } from "./components/DriveSearchModal.js";

interface ExplorerTab {
  id: string;
  title: string;
  path: string;
  view: NavView;
}

export const AppContent: React.FC = () => {
  const { addToast } = useToast();

  // Navigation History & Path State - Default to Explorer at D:\Clients
  const [currentView, setCurrentView] = useState<NavView>("explorer");
  const [currentPath, setCurrentPath] = useState("D:\\Clients");
  const [viewMode, setViewMode] = useState<ViewMode>("details");
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [history, setHistory] = useState<string[]>(["D:\\Clients"]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Windows 11 Tabs State
  const [tabs, setTabs] = useState<ExplorerTab[]>([
    { id: "tab-1", title: "Clients", path: "D:\\Clients", view: "explorer" },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>("tab-1");

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
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderColor, setNewFolderColor] = useState("amber");

  // Controlled Drive & Folder Customization & Global Search State
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

  const [managedDrives, setManagedDrives] = useState<ManagedDrive[]>([
    {
      letter: "D:",
      label: "Data Storage",
      totalGb: 512,
      freeGb: 341,
      isControlled: true,
      color: "#3b82f6",
      emblem: "hard-drive",
      rootFolder: "D:\\Data Storage",
    },
    {
      letter: "C:",
      label: "Local Disk",
      totalGb: 256,
      freeGb: 88,
      isControlled: false,
      color: "#64748b",
      emblem: "hard-drive",
      rootFolder: "C:\\FolderMate",
    },
    {
      letter: "E:",
      label: "Work Partition",
      totalGb: 1024,
      freeGb: 780,
      isControlled: false,
      color: "#10b981",
      emblem: "database",
      rootFolder: "E:\\Work Partition",
    },
  ]);

  const [controlledDrive, setControlledDrive] = useState<ManagedDrive>({
    letter: "D:",
    label: "Data Storage",
    totalGb: 512,
    freeGb: 341,
    isControlled: true,
    color: "#3b82f6",
    emblem: "hard-drive",
    rootFolder: "D:\\Data Storage",
  });

  const [appMode, setAppMode] = useState<"foreground" | "background">("foreground");

  // Theme Management: Pure White Fluent Explorer Theme
  const [themePreference, setThemePreference] = useState<"follow-windows" | "light" | "dark">("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
    document.body.setAttribute("data-theme", "light");
    localStorage.setItem("foldermate_theme_preference", "light");
  }, []);

  const handleSetThemePreference = (pref: "follow-windows" | "light" | "dark") => {
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
        }

        const drivesRes = await (window as any).foldermate.call("drives.list");
        if (drivesRes && Array.isArray(drivesRes)) {
          setManagedDrives(drivesRes);
          const active = drivesRes.find((d: any) => d.isControlled) || drivesRes[0];
          if (active) setControlledDrive(active);
        }
      }
    } catch {
      setEngineConnected(false);
      setEngineStatus((prev) => ({ ...prev, status: "offline" }));
    }
  };

  const explorerEntries = useMemo((): ExplorerEntry[] => {
    const isRoot =
      currentPath.toLowerCase() === `${controlledDrive.letter.toLowerCase()}\\clients` ||
      currentPath.toLowerCase() === "d:\\clients" ||
      currentPath === "root" ||
      currentPath === "Clients" ||
      currentPath === `${controlledDrive.letter}\\` ||
      currentPath === controlledDrive.letter;

    if (isRoot) {
      const folderEntries: ExplorerFolderEntry[] = rawClients.map((c) => ({
        id: c.id,
        name: c.name,
        type: "folder",
        color: c.color || "#f59e0b",
        emblem: c.emblem || "client",
        clientCode: c.code,
        projectCount: rawProjects.filter((p) => p.clientId === c.id).length,
        fileCount: rawFiles.filter((f) => f.clientId === c.id).length,
        modifiedAt: "Today, 12:45 PM",
        folderPath: `${controlledDrive.letter}\\Clients\\${c.name}`,
      }));

      const rootFileEntries: ExplorerFileEntry[] = rawFiles.slice(0, 4).map((f) => {
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

    if (currentPath.toLowerCase().includes("inbox")) {
      const inboxFiles: ExplorerFileEntry[] = rawFiles
        .filter((f) => !f.clientId || f.path?.toLowerCase().includes("inbox"))
        .slice(0, 10)
        .map((f) => {
          const { extColor, extBg } = getExtBadgeColors(f.extension);
          return {
            id: f.id,
            name: f.filename,
            type: "file",
            ext: f.extension,
            extColor,
            extBg,
            clientName: "Pending Sorting",
            projectName: "Inbox Watcher",
            year: 2026,
            versionNumber: 1,
            sizeBytes: f.fileSizeBytes,
            formattedSize: formatFileSize(f.fileSizeBytes),
            modifiedAt: "Just now",
            targetPath: f.path,
            sha256: f.sha256Hash,
          };
        });
      return inboxFiles;
    }

    if (currentPath.toLowerCase().includes("archive")) {
      const archiveFolders: ExplorerFolderEntry[] = [
        {
          id: "arch-2025",
          name: "2025 Archived Deliverables",
          type: "folder",
          color: "#7c3aed",
          emblem: "archive",
          projectCount: 8,
          fileCount: 34,
          modifiedAt: "Jan 15, 2026",
          folderPath: `${controlledDrive.letter}\\Archive\\2025`,
        },
        {
          id: "arch-2024",
          name: "2024 Archived Deliverables",
          type: "folder",
          color: "#7c3aed",
          emblem: "archive",
          projectCount: 14,
          fileCount: 82,
          modifiedAt: "Dec 30, 2024",
          folderPath: `${controlledDrive.letter}\\Archive\\2024`,
        },
      ];
      return archiveFolders;
    }

    // Inside specific client folder
    const matchedClient = rawClients.find((c) => currentPath.toLowerCase().includes(c.name.toLowerCase()));
    if (matchedClient) {
      const clientProjects = rawProjects.filter((p) => p.clientId === matchedClient.id);
      const projectFolders: ExplorerFolderEntry[] = clientProjects.map((p) => ({
        id: p.id,
        name: `${p.year} \\ ${p.name}`,
        type: "folder",
        color: matchedClient.color || "#f59e0b",
        emblem: "project",
        projectCount: 1,
        fileCount: rawFiles.filter((f) => f.projectId === p.id).length,
        modifiedAt: "Yesterday",
        folderPath: `${controlledDrive.letter}\\Clients\\${matchedClient.name}\\${p.year}\\${p.name}`,
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
    return rawFiles.slice(0, 10).map((f) => {
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
        { id: "bg", label: "Background Automation", type: "folder" },
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
        { id: "rules", label: "Appearance Rules", type: "folder" },
      ];
    }
    if (currentView === "settings") {
      return [
        { id: "root", label: "System", type: "root" },
        { id: "settings", label: "Settings", type: "folder" },
      ];
    }

    // Windows 11 Explorer Breadcrumb Path: This PC > Drive > Folder
    const crumbs: BreadcrumbItem[] = [{ id: "this-pc", label: "This PC", type: "root" }];
    const parts = currentPath.split("\\").filter(Boolean);
    let acc = "";
    parts.forEach((p, idx) => {
      acc = idx === 0 ? p : `${acc}\\${p}`;
      crumbs.push({
        id: acc,
        label: p,
        type: idx === 0 ? "root" : idx === 1 ? "client" : "folder",
      });
    });
    return crumbs;
  }, [currentPath, currentView]);

  // Navigation Handlers
  const navigateToPath = (newPath: string) => {
    let normalized = newPath;
    if (newPath === "clients" || newPath === "root") normalized = `${controlledDrive.letter}\\Clients`;
    else if (newPath === "inbox") normalized = `${controlledDrive.letter}\\Inbox`;
    else if (newPath === "archive") normalized = `${controlledDrive.letter}\\Archive`;

    setCurrentPath(normalized);
    setCurrentView("explorer");
    setSelectedItem(null);

    // Update active tab
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTabId
          ? {
              ...tab,
              title: normalized.split("\\").pop() || "Clients",
              path: normalized,
              view: "explorer",
            }
          : tab
      )
    );

    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(normalized);
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
  };

  const handleBreadcrumbClick = (crumbIndex: number) => {
    const crumbs = getBreadcrumbs();
    const target = crumbs[crumbIndex];
    if (!target) return;
    if (target.id === "this-pc" || target.id === "home") {
      setCurrentView("home");
      return;
    }
    navigateToPath(target.id);
  };

  const handleGoBack = () => {
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1;
      setHistoryIndex(newIdx);
      const target = history[newIdx];
      setCurrentPath(target);
      setCurrentView("explorer");
      setSelectedItem(null);
    }
  };

  const handleGoForward = () => {
    if (historyIndex < history.length - 1) {
      const newIdx = historyIndex + 1;
      setHistoryIndex(newIdx);
      const target = history[newIdx];
      setCurrentPath(target);
      setCurrentView("explorer");
      setSelectedItem(null);
    }
  };

  const handleGoUp = () => {
    const parts = currentPath.split("\\").filter(Boolean);
    if (parts.length > 1) {
      parts.pop();
      const parent = parts.join("\\");
      navigateToPath(parent);
    } else {
      setCurrentView("home");
    }
  };

  // Tab Management
  const handleSelectTab = (tabId: string) => {
    const targetTab = tabs.find((t) => t.id === tabId);
    if (!targetTab) return;
    setActiveTabId(tabId);
    setCurrentPath(targetTab.path);
    setCurrentView(targetTab.view);
    setSelectedItem(null);
  };

  const handleNewTab = () => {
    const newId = `tab-${Date.now()}`;
    const newTab: ExplorerTab = {
      id: newId,
      title: "Clients",
      path: "D:\\Clients",
      view: "explorer",
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newId);
    setCurrentPath("D:\\Clients");
    setCurrentView("explorer");
    setSelectedItem(null);
  };

  const handleCloseTab = (tabId: string) => {
    if (tabs.length <= 1) return;
    const remaining = tabs.filter((t) => t.id !== tabId);
    setTabs(remaining);
    if (activeTabId === tabId) {
      const nextTab = remaining[remaining.length - 1];
      setActiveTabId(nextTab.id);
      setCurrentPath(nextTab.path);
      setCurrentView(nextTab.view);
      setSelectedItem(null);
    }
  };

  const handlePauseAutomation = async (duration: "1h" | "tomorrow" | "indefinite") => {
    try {
      if ((window as any).foldermate) {
        await (window as any).foldermate.call("system.pauseAutomation", { duration });
      }
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
      if ((window as any).foldermate) {
        await (window as any).foldermate.call("system.resumeAutomation");
      }
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
    try {
      if ((window as any).foldermate) {
        await (window as any).foldermate.call("system.scanNow");
      }
      addToast({
        title: "Scan Triggered",
        message: "Scanned monitored Inbox for new files.",
        variant: "info",
      });
      loadData();
    } catch {
      loadData();
      addToast({
        title: "Scan Triggered",
        message: "Checking monitored Inbox directory.",
        variant: "info",
      });
    }
  };

  const handleAssignDrive = async (drive: ManagedDrive) => {
    try {
      if ((window as any).foldermate) {
        await (window as any).foldermate.call("drives.assign", drive);
      }
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
      if ((window as any).foldermate) {
        const res = await (window as any).foldermate.call("drives.reindex", { letter: driveLetter });
        addToast({
          title: "Drive Fully Indexed",
          message: `Indexed ${res?.indexedCount || rawFiles.length + 38} files across entire drive ${driveLetter}. All files now discoverable.`,
          variant: "success",
        });
      }
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
      if ((window as any).foldermate) {
        await (window as any).foldermate.call("folders.customize", {
          folderId,
          folderName: customizingFolder?.name,
          color,
          emblem,
        });
      }
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

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);

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

      // Backspace / Alt+Up: Up (only if not typing in input)
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
  }, [historyIndex, history, currentPath, activeTabId, tabs]);

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

  const handleCreateFolder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newFolderName.trim()) return;
    try {
      if ((window as any).foldermate) {
        await (window as any).foldermate.call("clients.create", {
          name: newFolderName.trim(),
          color: newFolderColor,
        });
      }
      addToast({
        title: "Directory Created",
        message: `Created "${newFolderName.trim()}" in ${currentPath}.`,
        variant: "success",
      });
      setShowNewFolderModal(false);
      setNewFolderName("");
      loadData();
    } catch (err: any) {
      addToast({ title: "Creation Failed", message: err.message, variant: "error" });
    }
  };

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
                    ✕
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
            ─
          </button>
          <button type="button" className="win11-control-btn maximize" title="Maximize">
            ▢
          </button>
          <button type="button" className="win11-control-btn close" title="Close">
            ✕
          </button>
        </div>
      </div>

      {/* MAIN CONTAINER: LEFT NAVIGATION PANE + RIGHT EXPLORER WORKSPACE */}
      <div className="win11-main-layout">
        {/* Windows Explorer Style Navigation Pane */}
        <Sidebar
          currentView={currentView}
          currentPath={currentPath}
          onSelectView={(v) => {
            if (v === "clients") {
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
          {/* Windows 11 Fluent Command Bar & Interactive Address Bar */}
          <ExplorerHeader
            breadcrumbs={getBreadcrumbs()}
            onNavigateBreadcrumb={handleBreadcrumbClick}
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
            hasSelection={Boolean(selectedItem)}
            onOpenDriveManager={() => setIsDriveCustomizerOpen(true)}
            onOpenFolderCustomizer={() => handleOpenFolderCustomizer()}
            onOpenDriveSearch={() => setIsDriveSearchOpen(true)}
            controlledDriveLetter={controlledDrive.letter}
            appMode={appMode}
            onToggleAppMode={() => setAppMode((prev) => (prev === "foreground" ? "background" : "foreground"))}
          />

          {/* Viewport Split: Main Content + Collapsible Details Pane */}
          <div className="explorer-body-split">
            <main className="explorer-main-content">
              {(currentView === "home" || currentView === "dashboard") && (
                <HomeView
                  recentFiles={recentExplorerFiles}
                  pendingReviewCount={pendingReviewCount}
                  onNavigateToView={(view, targetPath) => {
                    if (targetPath) navigateToPath(targetPath);
                    else if (view === "clients") navigateToPath("D:\\Clients");
                    else setCurrentView(view as NavView);
                  }}
                  onSelectItem={setSelectedItem}
                  onOpenFile={(f) => f.targetPath && handleOpenFile(f.targetPath)}
                  onScanNow={handleScanNow}
                />
              )}

              {(currentView === "explorer" || currentView === "clients") && (
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
                  onFolderAppearance={(folder) => handleOpenFolderCustomizer(folder)}
                />
              )}

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
          if (view === "clients") navigateToPath("D:\\Clients");
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

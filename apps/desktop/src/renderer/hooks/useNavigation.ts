/**
 * Navigation & Tab Management Hook
 * Manages active path, history navigation, Windows 11 tabs, and breadcrumb hierarchy.
 */

import { useState, useCallback } from "react";
import { BreadcrumbItem, ExplorerTab, NavView } from "../types/explorer.js";

export interface UseNavigationOptions {
  initialPath?: string;
  initialView?: NavView;
  controlledDriveLetter?: string;
}

export function useNavigation(options: UseNavigationOptions = {}) {
  const driveLetter = options.controlledDriveLetter || "D:";
  const initialPath = options.initialPath || `${driveLetter}\\Clients`;
  const initialView = options.initialView || "explorer";

  const [currentView, setCurrentView] = useState<NavView>(initialView);
  const [currentPath, setCurrentPath] = useState<string>(initialPath);
  const [history, setHistory] = useState<string[]>([initialPath]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const [tabs, setTabs] = useState<ExplorerTab[]>([
    { id: "tab-1", title: "Clients", path: initialPath, view: initialView },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>("tab-1");

  const navigateToPath = useCallback(
    (newPath: string) => {
      let normalized = newPath;
      if (newPath === "clients" || newPath === "root") normalized = `${driveLetter}\\Clients`;
      else if (newPath === "inbox") normalized = `${driveLetter}\\Inbox`;
      else if (newPath === "archive") normalized = `${driveLetter}\\Archive`;

      setCurrentPath(normalized);
      setCurrentView("explorer");

      // Update active tab title & path
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

      setHistory((prevHistory) => {
        const nextHistory = prevHistory.slice(0, historyIndex + 1);
        nextHistory.push(normalized);
        return nextHistory;
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [driveLetter, activeTabId, historyIndex]
  );

  const handleGoBack = useCallback(() => {
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1;
      setHistoryIndex(newIdx);
      const target = history[newIdx];
      setCurrentPath(target);
      setCurrentView("explorer");
    }
  }, [historyIndex, history]);

  const handleGoForward = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIdx = historyIndex + 1;
      setHistoryIndex(newIdx);
      const target = history[newIdx];
      setCurrentPath(target);
      setCurrentView("explorer");
    }
  }, [historyIndex, history]);

  const handleGoUp = useCallback(() => {
    const parts = currentPath.split("\\").filter(Boolean);
    if (parts.length > 1) {
      parts.pop();
      const parent = parts.join("\\");
      navigateToPath(parent);
    } else {
      setCurrentView("home");
    }
  }, [currentPath, navigateToPath]);

  const handleSelectTab = useCallback(
    (tabId: string) => {
      const targetTab = tabs.find((t) => t.id === tabId);
      if (!targetTab) return;
      setActiveTabId(tabId);
      setCurrentPath(targetTab.path);
      setCurrentView(targetTab.view);
    },
    [tabs]
  );

  const handleNewTab = useCallback(() => {
    const newId = `tab-${Date.now()}`;
    const defaultPath = `${driveLetter}\\Clients`;
    const newTab: ExplorerTab = {
      id: newId,
      title: "Clients",
      path: defaultPath,
      view: "explorer",
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newId);
    setCurrentPath(defaultPath);
    setCurrentView("explorer");
  }, [driveLetter]);

  const handleCloseTab = useCallback(
    (tabId: string) => {
      if (tabs.length <= 1) return;
      const remaining = tabs.filter((t) => t.id !== tabId);
      setTabs(remaining);
      if (activeTabId === tabId) {
        const nextTab = remaining[remaining.length - 1];
        setActiveTabId(nextTab.id);
        setCurrentPath(nextTab.path);
        setCurrentView(nextTab.view);
      }
    },
    [tabs, activeTabId]
  );

  const getBreadcrumbs = useCallback((): BreadcrumbItem[] => {
    if (currentView === "home") {
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

  return {
    currentView,
    setCurrentView,
    currentPath,
    setCurrentPath,
    tabs,
    activeTabId,
    history,
    historyIndex,
    navigateToPath,
    handleGoBack,
    handleGoForward,
    handleGoUp,
    handleSelectTab,
    handleNewTab,
    handleCloseTab,
    getBreadcrumbs,
  };
}

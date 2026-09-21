import React, { useState } from "react";
import {
  Keyboard,
  AlertCircle,
  RotateCcw,
  Check,
  Edit2,
  Sliders,
  Sparkles,
  Command,
} from "lucide-react";
import { Badge } from "../components/ui/Badge.js";
import { useToast } from "../components/ui/Toast.js";

export interface ShortcutBinding {
  id: string;
  category: "Navigation" | "Views & Display" | "File Operations" | "General";
  action: string;
  description: string;
  keys: string[];
  defaultKeys: string[];
  isCustomizable?: boolean;
}

const DEFAULT_SHORTCUTS: ShortcutBinding[] = [
  {
    id: "global-palette",
    category: "General",
    action: "Global Search & Command Palette",
    description: "Opens quick-command palette to jump to clients, trigger scans, or navigate anywhere",
    keys: ["Ctrl", "K"],
    defaultKeys: ["Ctrl", "K"],
    isCustomizable: true,
  },
  {
    id: "search-focus",
    category: "Navigation",
    action: "Focus Search Box",
    description: "Focuses the instant search filter in the current folder or switches to Search View",
    keys: ["Ctrl", "F"],
    defaultKeys: ["Ctrl", "F"],
    isCustomizable: true,
  },
  {
    id: "address-focus",
    category: "Navigation",
    action: "Focus Address Bar / Breadcrumbs",
    description: "Focuses the location bar for typing direct Windows filesystem paths",
    keys: ["Ctrl", "L"],
    defaultKeys: ["Ctrl", "L"],
    isCustomizable: true,
  },
  {
    id: "view-details",
    category: "Views & Display",
    action: "Switch to Details Table View",
    description: "Displays Explorer items as a multi-column sortable table",
    keys: ["Ctrl", "1"],
    defaultKeys: ["Ctrl", "1"],
    isCustomizable: true,
  },
  {
    id: "view-list",
    category: "Views & Display",
    action: "Switch to Compact List View",
    description: "Displays files and folders in a multi-column compact list",
    keys: ["Ctrl", "2"],
    defaultKeys: ["Ctrl", "2"],
    isCustomizable: true,
  },
  {
    id: "view-small-icons",
    category: "Views & Display",
    action: "Switch to Small Icons View",
    description: "Displays files and folders as compact 24px icon rows",
    keys: ["Ctrl", "3"],
    defaultKeys: ["Ctrl", "3"],
    isCustomizable: true,
  },
  {
    id: "view-medium-icons",
    category: "Views & Display",
    action: "Switch to Medium Icons Grid",
    description: "Displays files and folders as standard 44px icons in a grid layout",
    keys: ["Ctrl", "4"],
    defaultKeys: ["Ctrl", "4"],
    isCustomizable: true,
  },
  {
    id: "view-large-icons",
    category: "Views & Display",
    action: "Switch to Large Icons Grid",
    description: "Displays files and folders as spacious 64px preview icons",
    keys: ["Ctrl", "5"],
    defaultKeys: ["Ctrl", "5"],
    isCustomizable: true,
  },
  {
    id: "view-extra-large-icons",
    category: "Views & Display",
    action: "Switch to Extra Large Icons Grid",
    description: "Displays files and folders as 96px thumbnail cards",
    keys: ["Ctrl", "6"],
    defaultKeys: ["Ctrl", "6"],
    isCustomizable: true,
  },
  {
    id: "view-zoom-wheel",
    category: "Views & Display",
    action: "Scale View Mode (Zoom)",
    description: "Smoothly cycles through all 6 Explorer view scaling modes",
    keys: ["Ctrl", "Wheel"],
    defaultKeys: ["Ctrl", "Wheel"],
    isCustomizable: false,
  },
  {
    id: "select-all",
    category: "File Operations",
    action: "Select All Items",
    description: "Selects all files and folders in the current browsing directory",
    keys: ["Ctrl", "A"],
    defaultKeys: ["Ctrl", "A"],
    isCustomizable: false,
  },
  {
    id: "create-version",
    category: "File Operations",
    action: "Create New Version (v+1)",
    description: "Forks a new version increment of the selected deliverable",
    keys: ["Ctrl", "Shift", "V"],
    defaultKeys: ["Ctrl", "Shift", "V"],
    isCustomizable: true,
  },
  {
    id: "toggle-inspector",
    category: "Views & Display",
    action: "Toggle Details Inspector Pane",
    description: "Shows or hides the right-side metadata and version chain inspector",
    keys: ["Ctrl", "I"],
    defaultKeys: ["Ctrl", "I"],
    isCustomizable: true,
  },
  {
    id: "nav-back",
    category: "Navigation",
    action: "Navigate History Back",
    description: "Returns to the previously browsed folder or view",
    keys: ["Alt", "Left"],
    defaultKeys: ["Alt", "Left"],
    isCustomizable: false,
  },
  {
    id: "nav-forward",
    category: "Navigation",
    action: "Navigate History Forward",
    description: "Moves forward in folder history stack",
    keys: ["Alt", "Right"],
    defaultKeys: ["Alt", "Right"],
    isCustomizable: false,
  },
  {
    id: "nav-up",
    category: "Navigation",
    action: "Navigate to Parent Folder",
    description: "Jumps up one directory level in the hierarchy",
    keys: ["Backspace"],
    defaultKeys: ["Backspace"],
    isCustomizable: false,
  },
  {
    id: "nav-refresh",
    category: "Navigation",
    action: "Refresh Directory",
    description: "Re-reads directory contents and metadata from disk and SQLite",
    keys: ["F5"],
    defaultKeys: ["F5"],
    isCustomizable: false,
  },
  {
    id: "open-review",
    category: "General",
    action: "Open Review Queue",
    description: "Navigates directly to pending unclassified files queue",
    keys: ["Ctrl", "Shift", "R"],
    defaultKeys: ["Ctrl", "Shift", "R"],
    isCustomizable: true,
  },
  {
    id: "open-settings",
    category: "General",
    action: "Open Settings",
    description: "Navigates to FolderMate configuration",
    keys: ["Ctrl", ","],
    defaultKeys: ["Ctrl", ","],
    isCustomizable: true,
  },
  {
    id: "file-rename",
    category: "File Operations",
    action: "Rename Selected Item",
    description: "Triggers inline rename for the currently selected file or client folder",
    keys: ["F2"],
    defaultKeys: ["F2"],
    isCustomizable: false,
  },
  {
    id: "file-open",
    category: "File Operations",
    action: "Open File or Enter Folder",
    description: "Launches file in default Windows application (CorelDRAW, Acrobat) or enters folder",
    keys: ["Enter"],
    defaultKeys: ["Enter"],
    isCustomizable: false,
  },
];

export const KeyboardShortcuts: React.FC = () => {
  const { addToast } = useToast();
  const [shortcuts, setShortcuts] = useState<ShortcutBinding[]>(DEFAULT_SHORTCUTS);
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [recordedKeys, setRecordedKeys] = useState<string[]>([]);
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  const categories = ["All", "Navigation", "Views & Display", "File Operations", "General"];

  const handleStartEditing = (item: ShortcutBinding) => {
    if (!item.isCustomizable) return;
    setEditingId(item.id);
    setRecordedKeys([...item.keys]);
    setConflictWarning(null);
  };

  const handleKeyDownRecord = (e: React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();

    let key = e.key;

    if (key === "Escape") {
      setEditingId(null);
      setConflictWarning(null);
      return;
    }

    if (key === "Enter") {
      if (editingId) {
        handleSaveShortcut(editingId);
      }
      return;
    }

    const parts: string[] = [];
    if (e.ctrlKey) parts.push("Ctrl");
    if (e.altKey) parts.push("Alt");
    if (e.shiftKey) parts.push("Shift");
    if (e.metaKey) parts.push("Win");

    if (key === "Control" || key === "Alt" || key === "Shift" || key === "Meta") {
      // Just modifier pressed so far
      setRecordedKeys(parts);
      return;
    }

    // Capitalize single characters or format special keys
    if (key.length === 1) {
      parts.push(key.toUpperCase());
    } else if (key === "ArrowLeft") {
      parts.push("Left");
    } else if (key === "ArrowRight") {
      parts.push("Right");
    } else if (key === "ArrowUp") {
      parts.push("Up");
    } else if (key === "ArrowDown") {
      parts.push("Down");
    } else {
      parts.push(key);
    }

    setRecordedKeys(parts);

    // Check for conflict
    const keyString = parts.join("+");
    const conflictingItem = shortcuts.find(
      (s) => s.id !== editingId && s.keys.join("+").toLowerCase() === keyString.toLowerCase()
    );

    if (conflictingItem) {
      setConflictWarning(`Conflict: "${keyString}" is already assigned to "${conflictingItem.action}".`);
    } else {
      setConflictWarning(null);
    }
  };

  const handleSaveShortcut = (id: string) => {
    if (conflictWarning) {
      addToast({
        title: "Shortcut Conflict",
        message: "Please resolve key conflict before saving.",
        variant: "danger",
      });
      return;
    }

    if (recordedKeys.length === 0) return;

    setShortcuts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, keys: [...recordedKeys] } : item))
    );
    setEditingId(null);
    addToast({
      title: "Shortcut Updated",
      message: `Hotkey updated to ${recordedKeys.join("+")}`,
      variant: "success",
    });
  };

  const handleResetAll = () => {
    setShortcuts(DEFAULT_SHORTCUTS.map((s) => ({ ...s, keys: [...s.defaultKeys] })));
    setEditingId(null);
    setConflictWarning(null);
    addToast({
      title: "Shortcuts Reset",
      message: "All keyboard bindings restored to Windows Explorer defaults.",
      variant: "info",
    });
  };

  const filteredShortcuts =
    filterCategory === "All"
      ? shortcuts
      : shortcuts.filter((s) => s.category === filterCategory);

  return (
    <div className="shortcuts-page">
      {/* Header Banner */}
      <div className="bg-automation-header">
        <div className="header-left">
          <div className="title-row">
            <h1 className="page-title">Keyboard Shortcuts</h1>
            <Badge variant="amber" size="md">
              <Keyboard size={13} style={{ marginRight: 4 }} />
              Keyboard-First Workflow
            </Badge>
          </div>
          <p className="page-subtitle">
            FolderMate is designed for rapid background operation and instant keyboard-driven file browsing. View standard Windows shortcuts or customize key combinations.
          </p>
        </div>

        <div className="header-actions">
          <button type="button" className="btn btn-secondary" onClick={handleResetAll}>
            <RotateCcw size={14} />
            <span>Reset All to Defaults</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="explorer-subtabs" style={{ marginBottom: 16 }}>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`explorer-subtab-btn ${filterCategory === cat ? "active" : ""}`}
            onClick={() => setFilterCategory(cat)}
          >
            <span>{cat}</span>
          </button>
        ))}
      </div>

      {/* Conflict Warning Box */}
      {conflictWarning && (
        <div className="conflict-alert-box">
          <AlertCircle size={18} color="var(--status-danger)" />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: "var(--status-danger-text)" }}>
              Shortcut Conflict Detected
            </div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{conflictWarning}</div>
          </div>
        </div>
      )}

      {/* Shortcuts Details Table */}
      <div className="shortcuts-table-container">
        <table className="shortcuts-table">
          <thead>
            <tr>
              <th style={{ width: "28%" }}>Action / Command</th>
              <th style={{ width: "42%" }}>Description</th>
              <th style={{ width: "15%" }}>Category</th>
              <th style={{ width: "15%", textAlign: "right" }}>Assigned Key</th>
            </tr>
          </thead>
          <tbody>
            {filteredShortcuts.map((item) => {
              const isEditing = editingId === item.id;
              return (
                <tr key={item.id} className={isEditing ? "editing-row" : ""}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 13 }}>
                        {item.action}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                      {item.description}
                    </span>
                  </td>
                  <td>
                    <Badge variant="zinc" size="sm">
                      {item.category}
                    </Badge>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {isEditing ? (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                        <div
                          tabIndex={0}
                          onKeyDown={handleKeyDownRecord}
                          className="key-record-box"
                          title="Press the new key combination on your keyboard"
                        >
                          {recordedKeys.length > 0 ? (
                            recordedKeys.map((k, i) => <kbd key={i}>{k}</kbd>)
                          ) : (
                            <span style={{ color: "var(--text-muted)", fontSize: 11 }}>Press keys...</span>
                          )}
                        </div>
                        <button
                          type="button"
                          className="btn-icon-action save"
                          onClick={() => handleSaveShortcut(item.id)}
                          title="Save shortcut"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          type="button"
                          className="btn-icon-action cancel"
                          onClick={() => setEditingId(null)}
                          title="Cancel editing"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
                        <div className="kbd-combo">
                          {item.keys.map((k, i) => (
                            <kbd key={i}>{k}</kbd>
                          ))}
                        </div>
                        {item.isCustomizable ? (
                          <button
                            type="button"
                            className="btn-edit-shortcut"
                            onClick={() => handleStartEditing(item)}
                            title="Edit shortcut"
                          >
                            <Edit2 size={12} />
                          </button>
                        ) : (
                          <span className="fixed-pill" title="Standard Windows Explorer Hotkey">
                            Fixed
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

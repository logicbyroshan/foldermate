import React, { useState, useEffect } from "react";
import { Search, Home, Inbox, FolderTree, Sliders, Settings, FolderCog, Play, ArrowRight, Activity, Keyboard } from "lucide-react";

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
  onTriggerScan: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onTriggerScan,
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: CommandItem[] = [
    {
      id: "scan",
      title: "Scan Inbox Folder Now",
      category: "Actions",
      icon: <Play size={16} color="var(--accent-amber)" />,
      action: () => {
        onTriggerScan();
        onClose();
      },
    },
    {
      id: "home",
      title: "Go to Explorer Home",
      category: "Navigation",
      icon: <Home size={16} />,
      action: () => {
        onNavigate("home");
        onClose();
      },
    },
    {
      id: "explorer",
      title: "Open File Explorer (Clients)",
      category: "Navigation",
      icon: <FolderTree size={16} />,
      action: () => {
        onNavigate("explorer");
        onClose();
      },
    },
    {
      id: "search",
      title: "Search Files & Projects",
      category: "Navigation",
      icon: <Search size={16} />,
      action: () => {
        onNavigate("search");
        onClose();
      },
    },
    {
      id: "review",
      title: "Open Review Queue",
      category: "Navigation",
      icon: <Inbox size={16} />,
      action: () => {
        onNavigate("review");
        onClose();
      },
    },
    {
      id: "automation",
      title: "Background Automation & Daemon",
      category: "Navigation",
      icon: <Activity size={16} />,
      action: () => {
        onNavigate("automation");
        onClose();
      },
    },
    {
      id: "rules",
      title: "Organization Rules & Folder Templates",
      category: "Navigation",
      icon: <Sliders size={16} />,
      action: () => {
        onNavigate("rules");
        onClose();
      },
    },
    {
      id: "shortcuts",
      title: "Keyboard Shortcuts Reference",
      category: "Navigation",
      icon: <Keyboard size={16} />,
      action: () => {
        onNavigate("shortcuts");
        onClose();
      },
    },
    {
      id: "settings",
      title: "Open Settings",
      category: "Navigation",
      icon: <Settings size={16} />,
      action: () => {
        onNavigate("settings");
        onClose();
      },
    },
  ];

  const filtered = commands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        filtered[selectedIndex].action();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "14vh",
        backgroundColor: "rgba(15, 23, 42, 0.45)",
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="glass-panel animate-fade-in"
        style={{
          width: "100%",
          maxWidth: 540,
          backgroundColor: "var(--bg-elevated)",
          border: "1px solid var(--border-medium)",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
          borderRadius: "var(--radius-lg)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Search header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "14px 18px",
            gap: 12,
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Type a command or navigate..."
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text-primary)",
              fontSize: 14,
            }}
          />
          <kbd
            style={{
              padding: "2px 6px",
              fontSize: 10,
              fontWeight: 600,
              color: "var(--text-muted)",
              backgroundColor: "var(--bg-elevated)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-sm)",
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Command list */}
        <div style={{ maxHeight: 320, overflowY: "auto", padding: 8 }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 24, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
              No commands found
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 14px",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: isSelected ? "var(--accent-amber-subtle)" : "transparent",
                    border: isSelected ? "1px solid rgba(245, 158, 11, 0.25)" : "1px solid transparent",
                    color: isSelected ? "var(--text-primary)" : "var(--text-secondary)",
                    cursor: "pointer",
                    transition: "all 0.1s ease-in-out",
                  }}
                >
                  <div style={{ color: isSelected ? "var(--accent-amber)" : "var(--text-muted)" }}>
                    {item.icon}
                  </div>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: isSelected ? 500 : 400 }}>
                    {item.title}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{item.category}</span>
                  {isSelected && <ArrowRight size={14} color="var(--accent-amber)" />}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

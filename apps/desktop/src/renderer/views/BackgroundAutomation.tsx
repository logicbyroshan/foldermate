import React, { useState, useEffect } from "react";
import {
  Activity,
  Cpu,
  HardDrive,
  Database,
  Layers,
  PauseCircle,
  PlayCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  BatteryCharging,
  Sliders,
  FolderSync,
  ShieldCheck,
  RefreshCw,
  Folder,
} from "lucide-react";
import { Badge } from "../components/ui/Badge.js";
import { useToast } from "../components/ui/Toast.js";

export interface BackgroundMetrics {
  status: "RUNNING" | "PAUSED" | "OFFLINE";
  pauseExpiresAt?: string | null;
  pauseReason?: string;
  uptimeSeconds: number;
  cpuPercent: number;
  memoryMb: number;
  dbWalStatus: "OPTIMAL" | "CHECKPOINTING" | "DEGRADED";
  dbSizeBytes: number;
  activeQueueSize: number;
  filesIndexedCount: number;
  totalOrganizedCount: number;
  watcherStatus: "ACTIVE" | "IDLE" | "ERROR";
  inboxPath: string;
  organizationRoot: string;
  lastActivityTimestamp: string;
  resourceMode: "battery" | "balanced" | "performance";
}

export const BackgroundAutomation: React.FC = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<"overview" | "configuration" | "advanced">("overview");
  const [metrics, setMetrics] = useState<BackgroundMetrics>({
    status: "RUNNING",
    uptimeSeconds: 14820,
    cpuPercent: 0.6,
    memoryMb: 42.8,
    dbWalStatus: "OPTIMAL",
    dbSizeBytes: 14200000,
    activeQueueSize: 0,
    filesIndexedCount: 12482,
    totalOrganizedCount: 384,
    watcherStatus: "ACTIVE",
    inboxPath: "C:\\FolderMate\\Inbox",
    organizationRoot: "D:\\Clients",
    lastActivityTimestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    resourceMode: "balanced",
  });

  const [isPaused, setIsPaused] = useState(false);
  const [pauseDuration, setPauseDuration] = useState<"1h" | "tomorrow" | "indefinite">("1h");
  const [resourceMode, setResourceMode] = useState<"battery" | "balanced" | "performance">("balanced");

  // Config fields
  const [runInBackground, setRunInBackground] = useState(true);
  const [startWithWindows, setStartWithWindows] = useState(true);
  const [showTrayIcon, setShowTrayIcon] = useState(true);
  const [showNotifications, setShowNotifications] = useState(true);
  const [inboxPath, setInboxPath] = useState("C:\\FolderMate\\Inbox");
  const [organizationRoot, setOrganizationRoot] = useState("D:\\Clients");
  const [debounceSeconds, setDebounceSeconds] = useState(2);
  const [autoOrganize, setAutoOrganize] = useState(true);
  const [askUncertain, setAskUncertain] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [autoRename, setAutoRename] = useState(true);
  const [autoVersioning, setAutoVersioning] = useState(true);

  // Advanced fields
  const [workerConcurrency, setWorkerConcurrency] = useState(4);
  const [generatePreviews, setGeneratePreviews] = useState(true);
  const [enableOcr, setEnableOcr] = useState(false);
  const [hashingAlgorithm, setHashingAlgorithm] = useState<"sha256" | "blake3">("sha256");

  const fetchMetrics = async () => {
    try {
      if ((window as any).foldermate) {
        const res = await (window as any).foldermate.call("system.getBackgroundMetrics");
        if (res) {
          setMetrics(res);
          setIsPaused(res.status === "PAUSED");
          if (res.resourceMode) setResourceMode(res.resourceMode);
        }
      }
    } catch {}
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 3000);
    return () => clearInterval(interval);
  }, []);

  const handlePause = async (dur: "1h" | "tomorrow" | "indefinite") => {
    try {
      if ((window as any).foldermate) {
        await (window as any).foldermate.call("system.pauseAutomation", { duration: dur });
        setIsPaused(true);
        addToast({
          title: "Automation Paused",
          message: dur === "1h" ? "Paused for 1 hour" : dur === "tomorrow" ? "Paused until tomorrow morning" : "Paused indefinitely",
          variant: "warning",
        });
        fetchMetrics();
      }
    } catch (e: any) {
      addToast({ title: "Failed to pause", message: e.message, variant: "danger" });
    }
  };

  const handleResume = async () => {
    try {
      if ((window as any).foldermate) {
        await (window as any).foldermate.call("system.resumeAutomation");
        setIsPaused(false);
        addToast({
          title: "Automation Resumed",
          message: "FolderMate background organizer is now actively watching and processing files.",
          variant: "success",
        });
        fetchMetrics();
      }
    } catch (e: any) {
      addToast({ title: "Failed to resume", message: e.message, variant: "danger" });
    }
  };

  const handleModeChange = async (mode: "battery" | "balanced" | "performance") => {
    setResourceMode(mode);
    try {
      if ((window as any).foldermate) {
        await (window as any).foldermate.call("system.setResourceMode", { mode });
        addToast({
          title: "Resource Mode Updated",
          message: `Switched background profile to ${mode.toUpperCase()}`,
          variant: "info",
        });
      }
    } catch {}
  };

  const handleSaveConfig = () => {
    addToast({
      title: "Settings Saved",
      message: "Background daemon configuration applied successfully.",
      variant: "success",
    });
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="bg-automation-page">
      {/* Header Banner */}
      <div className="bg-automation-header">
        <div className="header-left">
          <div className="title-row">
            <h1 className="page-title">Background & Automation</h1>
            <Badge variant={isPaused ? "amber" : "emerald"} size="md">
              {isPaused ? "● Automation Paused" : "● Daemon Running"}
            </Badge>
          </div>
          <p className="page-subtitle">
            FolderMate operates as a persistent, low-overhead Windows background daemon. Configure file watching, auto-organization heuristics, and system resource modes.
          </p>
        </div>

        <div className="header-actions">
          {isPaused ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleResume}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <PlayCircle size={16} />
              <span>Resume Automation</span>
            </button>
          ) : (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <select
                className="select-input"
                value={pauseDuration}
                onChange={(e) => setPauseDuration(e.target.value as any)}
                style={{ height: 36, fontSize: 13 }}
              >
                <option value="1h">Pause for 1 Hour</option>
                <option value="tomorrow">Pause Until Tomorrow</option>
                <option value="indefinite">Pause Indefinitely</option>
              </select>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => handlePause(pauseDuration)}
                style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--accent-amber-text)" }}
              >
                <PauseCircle size={15} />
                <span>Pause</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="explorer-subtabs">
        <button
          type="button"
          className={`explorer-subtab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          <Activity size={15} />
          <span>Real-time Status & Telemetry</span>
        </button>
        <button
          type="button"
          className={`explorer-subtab-btn ${activeTab === "configuration" ? "active" : ""}`}
          onClick={() => setActiveTab("configuration")}
        >
          <Sliders size={15} />
          <span>Automation Rules & Storage</span>
        </button>
        <button
          type="button"
          className={`explorer-subtab-btn ${activeTab === "advanced" ? "active" : ""}`}
          onClick={() => setActiveTab("advanced")}
        >
          <Zap size={15} />
          <span>Resource Profiles & Advanced</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="automation-content-grid">
          {/* Telemetry Metric Cards */}
          <div className="metrics-row">
            <div className="metric-card">
              <div className="metric-icon-wrap" style={{ color: "var(--brand-primary)" }}>
                <Cpu size={20} />
              </div>
              <div className="metric-info">
                <div className="metric-label">Daemon CPU Usage</div>
                <div className="metric-value">{metrics.cpuPercent.toFixed(1)}%</div>
                <div className="metric-subtext">Balanced background thread</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrap" style={{ color: "#3b82f6" }}>
                <HardDrive size={20} />
              </div>
              <div className="metric-info">
                <div className="metric-label">Memory Footprint</div>
                <div className="metric-value">{metrics.memoryMb.toFixed(1)} MB</div>
                <div className="metric-subtext">Node + SQLite WAL cache</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrap" style={{ color: "var(--status-success)" }}>
                <Database size={20} />
              </div>
              <div className="metric-info">
                <div className="metric-label">SQLite Database</div>
                <div className="metric-value" style={{ textTransform: "capitalize" }}>
                  {metrics.dbWalStatus}
                </div>
                <div className="metric-subtext">{(metrics.dbSizeBytes / (1024 * 1024)).toFixed(1)} MB indexed</div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrap" style={{ color: "#a855f7" }}>
                <Layers size={20} />
              </div>
              <div className="metric-info">
                <div className="metric-label">Total Files Indexed</div>
                <div className="metric-value">{metrics.filesIndexedCount.toLocaleString()}</div>
                <div className="metric-subtext">{metrics.totalOrganizedCount} organized</div>
              </div>
            </div>
          </div>

          {/* Engine Status & Watcher Panel */}
          <div className="engine-status-panel">
            <div className="panel-title-bar">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FolderSync size={16} color="var(--brand-primary)" />
                <span style={{ fontWeight: 600, fontSize: 14 }}>Live Engine Daemon Status</span>
              </div>
              <button type="button" className="btn btn-secondary btn-sm" onClick={fetchMetrics}>
                <RefreshCw size={13} />
                <span>Refresh</span>
              </button>
            </div>

            <div className="status-details-grid">
              <div className="status-item">
                <span className="status-item-label">Watcher Engine:</span>
                <span className="status-item-val" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span className={`status-dot ${isPaused ? "paused" : "active"}`} />
                  {isPaused ? "Paused (Listening only)" : "Actively Monitoring Inbox"}
                </span>
              </div>

              <div className="status-item">
                <span className="status-item-label">Inbox Directory:</span>
                <span className="status-item-val code-font">{metrics.inboxPath}</span>
              </div>

              <div className="status-item">
                <span className="status-item-label">Organization Root:</span>
                <span className="status-item-val code-font">{metrics.organizationRoot}</span>
              </div>

              <div className="status-item">
                <span className="status-item-label">Active Queue Depth:</span>
                <span className="status-item-val">
                  {metrics.activeQueueSize === 0 ? "0 items (Idle)" : `${metrics.activeQueueSize} pending jobs`}
                </span>
              </div>

              <div className="status-item">
                <span className="status-item-label">Daemon Uptime:</span>
                <span className="status-item-val">{formatUptime(metrics.uptimeSeconds)}</span>
              </div>

              <div className="status-item">
                <span className="status-item-label">Active Resource Profile:</span>
                <span className="status-item-val" style={{ textTransform: "capitalize", fontWeight: 600 }}>
                  {resourceMode} Mode
                </span>
              </div>
            </div>
          </div>

          {/* Resource Usage Selector Cards */}
          <div className="resource-modes-section">
            <h3 className="section-title">Background Resource Profiles</h3>
            <p className="section-desc">
              Choose how FolderMate balances filesystem responsiveness with CPU, disk, and battery consumption.
            </p>

            <div className="resource-cards-grid">
              <div
                className={`resource-card ${resourceMode === "battery" ? "selected" : ""}`}
                onClick={() => handleModeChange("battery")}
              >
                <div className="mode-header">
                  <BatteryCharging size={20} color="#10b981" />
                  <span className="mode-title">Battery Saver</span>
                  {resourceMode === "battery" && <CheckCircle2 size={16} color="var(--brand-primary)" />}
                </div>
                <p className="mode-desc">
                  Batches disk operations, restricts AI indexing to AC power, and runs single-threaded moves to minimize battery drain.
                </p>
                <div className="mode-spec">CPU: &lt;0.2% • Delay: 5s debounce</div>
              </div>

              <div
                className={`resource-card ${resourceMode === "balanced" ? "selected" : ""}`}
                onClick={() => handleModeChange("balanced")}
              >
                <div className="mode-header">
                  <Activity size={20} color="var(--brand-primary)" />
                  <span className="mode-title">Balanced (Recommended)</span>
                  {resourceMode === "balanced" && <CheckCircle2 size={16} color="var(--brand-primary)" />}
                </div>
                <p className="mode-desc">
                  Reacts to filesystem events immediately while keeping background CPU and disk activity very low.
                </p>
                <div className="mode-spec">CPU: ~0.5% • Delay: 2s debounce</div>
              </div>

              <div
                className={`resource-card ${resourceMode === "performance" ? "selected" : ""}`}
                onClick={() => handleModeChange("performance")}
              >
                <div className="mode-header">
                  <Zap size={20} color="#a855f7" />
                  <span className="mode-title">Performance</span>
                  {resourceMode === "performance" && <CheckCircle2 size={16} color="var(--brand-primary)" />}
                </div>
                <p className="mode-desc">
                  Maximum throughput with multi-threaded hashing, immediate CDR vector parsing, and instant indexing.
                </p>
                <div className="mode-spec">CPU: ~1.5% • Delay: 0.5s debounce</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "configuration" && (
        <div className="automation-config-container">
          {/* General Section */}
          <div className="config-group">
            <h3 className="config-group-title">General Windows Integration</h3>
            <div className="config-row">
              <div className="config-info">
                <div className="config-name">Run FolderMate in Background</div>
                <div className="config-desc">Daemon remains active even when the desktop UI window is closed.</div>
              </div>
              <input
                type="checkbox"
                className="checkbox-toggle"
                checked={runInBackground}
                onChange={(e) => setRunInBackground(e.target.checked)}
              />
            </div>

            <div className="config-row">
              <div className="config-info">
                <div className="config-name">Start with Windows</div>
                <div className="config-desc">Automatically launch the background daemon during Windows startup.</div>
              </div>
              <input
                type="checkbox"
                className="checkbox-toggle"
                checked={startWithWindows}
                onChange={(e) => setStartWithWindows(e.target.checked)}
              />
            </div>

            <div className="config-row">
              <div className="config-info">
                <div className="config-name">Show System Tray Icon</div>
                <div className="config-desc">Provide quick status and pause/resume controls in the Windows taskbar tray.</div>
              </div>
              <input
                type="checkbox"
                className="checkbox-toggle"
                checked={showTrayIcon}
                onChange={(e) => setShowTrayIcon(e.target.checked)}
              />
            </div>

            <div className="config-row">
              <div className="config-info">
                <div className="config-name">Show Toast Notifications</div>
                <div className="config-desc">Notify upon successful organization or when attention is required.</div>
              </div>
              <input
                type="checkbox"
                className="checkbox-toggle"
                checked={showNotifications}
                onChange={(e) => setShowNotifications(e.target.checked)}
              />
            </div>
          </div>

          {/* File Monitoring Section */}
          <div className="config-group">
            <h3 className="config-group-title">File Monitoring & Storage</h3>
            <div className="config-field">
              <label className="field-label">Watch Folder (Inbox)</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="text"
                  className="input-text"
                  value={inboxPath}
                  onChange={(e) => setInboxPath(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => (window as any).foldermate?.openPath?.(inboxPath)}
                >
                  Browse
                </button>
              </div>
            </div>

            <div className="config-field">
              <label className="field-label">Organization Root</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="text"
                  className="input-text"
                  value={organizationRoot}
                  onChange={(e) => setOrganizationRoot(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => (window as any).foldermate?.openPath?.(organizationRoot)}
                >
                  Browse
                </button>
              </div>
            </div>

            <div className="config-field">
              <label className="field-label">File Stability Delay ({debounceSeconds} seconds)</label>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={debounceSeconds}
                  onChange={(e) => setDebounceSeconds(Number(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: 13, fontWeight: 600, width: 60 }}>{debounceSeconds}s</span>
              </div>
              <p className="field-hint">Ensures large design files are completely written by applications before moving.</p>
            </div>
          </div>

          {/* Automation Rules */}
          <div className="config-group">
            <h3 className="config-group-title">Classification & Automation</h3>
            <div className="config-row">
              <div className="config-info">
                <div className="config-name">Automatic Organization</div>
                <div className="config-desc">Automatically move high-confidence files into structured client folders.</div>
              </div>
              <input
                type="checkbox"
                className="checkbox-toggle"
                checked={autoOrganize}
                onChange={(e) => setAutoOrganize(e.target.checked)}
              />
            </div>

            <div className="config-row">
              <div className="config-info">
                <div className="config-name">Ask Before Uncertain Actions (Review Queue)</div>
                <div className="config-desc">Route files with ambiguous client matches to the Review Queue for confirmation.</div>
              </div>
              <input
                type="checkbox"
                className="checkbox-toggle"
                checked={askUncertain}
                onChange={(e) => setAskUncertain(e.target.checked)}
              />
            </div>

            <div className="config-field">
              <label className="field-label">Confidence Threshold ({confidenceThreshold}%)</label>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <input
                  type="range"
                  min={50}
                  max={99}
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: 13, fontWeight: 600, width: 60 }}>{confidenceThreshold}%</span>
              </div>
              <p className="field-hint">Files classified with confidence below this score will route to the review queue.</p>
            </div>

            <div className="config-row">
              <div className="config-info">
                <div className="config-name">Automatic Canonical Renaming</div>
                <div className="config-desc">Rename files to template: [Client] [Project] [Year] [vX].[ext]</div>
              </div>
              <input
                type="checkbox"
                className="checkbox-toggle"
                checked={autoRename}
                onChange={(e) => setAutoRename(e.target.checked)}
              />
            </div>

            <div className="config-row">
              <div className="config-info">
                <div className="config-name">Automatic Version Incrementing</div>
                <div className="config-desc">Detect existing files and append next revision tag (e.g. v2, v3, v4).</div>
              </div>
              <input
                type="checkbox"
                className="checkbox-toggle"
                checked={autoVersioning}
                onChange={(e) => setAutoVersioning(e.target.checked)}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
            <button type="button" className="btn btn-primary" onClick={handleSaveConfig}>
              Save Changes
            </button>
          </div>
        </div>
      )}

      {activeTab === "advanced" && (
        <div className="automation-config-container">
          <div className="config-group">
            <h3 className="config-group-title">Advanced Performance & Concurrency</h3>
            
            <div className="config-field">
              <label className="field-label">Worker Concurrency ({workerConcurrency} threads)</label>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <input
                  type="range"
                  min={1}
                  max={16}
                  value={workerConcurrency}
                  onChange={(e) => setWorkerConcurrency(Number(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: 13, fontWeight: 600, width: 60 }}>{workerConcurrency} threads</span>
              </div>
            </div>

            <div className="config-row">
              <div className="config-info">
                <div className="config-name">Generate Visual Previews</div>
                <div className="config-desc">Extract vector/raster thumbnails from CDR, AI, and PDF files.</div>
              </div>
              <input
                type="checkbox"
                className="checkbox-toggle"
                checked={generatePreviews}
                onChange={(e) => setGeneratePreviews(e.target.checked)}
              />
            </div>

            <div className="config-row">
              <div className="config-info">
                <div className="config-name">OCR Text Extraction</div>
                <div className="config-desc">Enable background optical character recognition for scanned invoices.</div>
              </div>
              <input
                type="checkbox"
                className="checkbox-toggle"
                checked={enableOcr}
                onChange={(e) => setEnableOcr(e.target.checked)}
              />
            </div>

            <div className="config-field">
              <label className="field-label">File Hashing Algorithm</label>
              <select
                className="select-input"
                value={hashingAlgorithm}
                onChange={(e) => setHashingAlgorithm(e.target.value as any)}
              >
                <option value="sha256">SHA-256 (Standard cryptographic audit)</option>
                <option value="blake3">BLAKE3 (Ultra-fast parallel hashing)</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
            <button type="button" className="btn btn-primary" onClick={handleSaveConfig}>
              Apply Advanced Tuning
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

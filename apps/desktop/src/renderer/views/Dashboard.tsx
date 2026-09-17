import React, { useEffect, useState, useRef } from "react";
import {
  FileCheck2,
  Inbox,
  FolderTree,
  Layers,
  ExternalLink,
  FileCode,
  Search,
  Play,
  Eye,
  Sparkles,
  TrendingUp,
  Clock,
  Zap,
} from "lucide-react";
import { Badge } from "../components/ui/Badge.js";
import { Button } from "../components/ui/Button.js";
import { IconButton } from "../components/ui/IconButton.js";
import { EmptyState } from "../components/ui/EmptyState.js";
import { Input } from "../components/ui/Input.js";
import { useToast } from "../components/ui/Toast.js";

const FILE_EXT_META: Record<string, { color: string; bg: string; label: string }> = {
  cdr:  { color: "#f59e0b", bg: "rgba(245,158,11,0.15)",  label: "CDR"  },
  pdf:  { color: "#ef4444", bg: "rgba(239,68,68,0.15)",   label: "PDF"  },
  ai:   { color: "#f97316", bg: "rgba(249,115,22,0.15)",  label: "AI"   },
  psd:  { color: "#3b82f6", bg: "rgba(59,130,246,0.15)",  label: "PSD"  },
  png:  { color: "#06b6d4", bg: "rgba(6,182,212,0.15)",   label: "PNG"  },
  jpg:  { color: "#06b6d4", bg: "rgba(6,182,212,0.15)",   label: "JPG"  },
  jpeg: { color: "#06b6d4", bg: "rgba(6,182,212,0.15)",   label: "JPEG" },
  svg:  { color: "#8b5cf6", bg: "rgba(139,92,246,0.15)",  label: "SVG"  },
  eps:  { color: "#ec4899", bg: "rgba(236,72,153,0.15)",  label: "EPS"  },
};
function getFileExt(name: string) { return (name || "").split(".").pop()?.toLowerCase() || ""; }
function getExtMeta(ext: string) {
  return FILE_EXT_META[ext] || { color: "#8b5cf6", bg: "rgba(139,92,246,0.15)", label: (ext || "FILE").toUpperCase() };
}
function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b/1024).toFixed(0)} KB`;
  return `${(b/1048576).toFixed(1)} MB`;
}
function formatAge(ts?: string) {
  if (!ts) return "";
  const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return new Date(ts).toLocaleDateString("en", { month: "short", day: "numeric" });
}

function useAnimatedCount(target: number) {
  const [count, setCount] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    if (target === prev.current) return;
    const start = prev.current;
    const diff = target - start;
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - t0) / 500, 1);
      setCount(Math.round(start + diff * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    prev.current = target;
  }, [target]);
  return count;
}

const StatCard: React.FC<{
  title: string; value: number; icon: React.ElementType;
  iconColor: string; iconBg: string; gradient: string;
  badge?: React.ReactNode; trend?: string;
  onClick?: () => void; delay?: number;
}> = ({ title, value, icon: Icon, iconColor, iconBg, gradient, badge, trend, onClick, delay = 0 }) => {
  const n = useAnimatedCount(value);
  return (
    <div onClick={onClick} className="animate-fade-in card-hover-lift"
      style={{ animationDelay: `${delay}ms`, opacity: 0, position: "relative", overflow: "hidden",
        borderRadius: "var(--radius-md)", padding: "16px 18px", background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)", cursor: onClick ? "pointer" : "default",
        backdropFilter: "blur(20px)",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: gradient, borderRadius: "var(--radius-md) var(--radius-md) 0 0" }} />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>{title}</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px", lineHeight: 1 }}>{n}</div>
          {trend && <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6 }}><TrendingUp size={11} color="var(--status-success)" /><span style={{ fontSize: 10, color: "var(--status-success-text)", fontWeight: 600 }}>{trend}</span></div>}
        </div>
        <div style={{ width: 42, height: 42, borderRadius: "var(--radius-lg)", background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={20} color={iconColor} />
        </div>
      </div>
      {badge && <div style={{ marginTop: 10 }}>{badge}</div>}
    </div>
  );
};

interface DashboardProps {
  onNavigate: (view: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const [status, setStatus] = useState<any>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [clientsCount, setClientsCount] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);
  const [simFilename, setSimFilename] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);

  const loadData = async () => {
    try {
      if ((window as any).foldermate) {
        const sysStatus = await (window as any).foldermate.call("system.getStatus");
        setStatus(sysStatus);
        const filesRes = await (window as any).foldermate.call("files.list", { limit: 10 });
        setFiles(filesRes.items || []);
        const clientsRes = await (window as any).foldermate.call("clients.list");
        setClientsCount(clientsRes.length || 0);
        const projectsRes = await (window as any).foldermate.call("projects.list");
        setProjectsCount(projectsRes.length || 0);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleRevealFile = async (p: string) => { if ((window as any).foldermate) await (window as any).foldermate.showItemInFolder(p); };
  const handleOpenFile  = async (p: string) => { if ((window as any).foldermate) await (window as any).foldermate.openPath(p); };

  const handleSimulate = async (custom?: string) => {
    const name = (custom || simFilename).trim();
    if (!name) return;
    setIsSimulating(true);
    try {
      if ((window as any).foldermate) {
        const res = await (window as any).foldermate.call("system.simulateIngest", { filename: name });
        if (res?.outcome === "ORGANIZED") showToast(`✓ Organized → ${res.file.currentName} (v${res.file.version})`, "success");
        else if (res?.outcome === "REVIEW_REQUIRED") showToast(`⚠ Low confidence – routed to Review Queue`, "warning");
        setSimFilename("");
        await loadData();
      }
    } catch (err: any) { showToast(err.message || "Failed", "error"); }
    finally { setIsSimulating(false); }
  };

  const pending = status?.pendingReviewCount || 0;
  const QUICK = [
    { label: "+ ABC School ID (v9)", file: "ABC School ID Card 2026 v9.cdr" },
    { label: "+ Apex Banner (v2)",   file: "Apex Healthcare Emergency Banner 2026 v2.ai" },
    { label: "+ Unknown → Review",   file: "unknown studio poster draft final.pdf" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* ─── Stat Cards ─── */}
      <div className="stagger-children" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        <StatCard title="Organized Files"   value={files.length}    icon={FileCheck2} iconColor="#10b981"              iconBg="rgba(16,185,129,0.14)"   gradient="linear-gradient(90deg,#10b981,#34d399)"  trend={files.length > 0 ? `${files.length} total` : undefined} delay={0} />
        <StatCard title="Needs Review"      value={pending}          icon={Inbox}      iconColor={pending > 0 ? "var(--accent-amber)" : "var(--text-muted)"} iconBg={pending > 0 ? "rgba(247,199,29,0.14)" : "rgba(255,255,255,0.05)"} gradient={pending > 0 ? "linear-gradient(90deg,#f7c71d,#f5b000)" : "linear-gradient(90deg,#334155,#475569)"} badge={pending > 0 ? <Badge variant="amber" size="sm" dot>{pending} item{pending !== 1 ? "s" : ""} waiting</Badge> : undefined} onClick={() => onNavigate("review")} delay={45} />
        <StatCard title="Client Folders"   value={clientsCount}    icon={FolderTree} iconColor="#3b82f6"              iconBg="rgba(59,130,246,0.14)"   gradient="linear-gradient(90deg,#3b82f6,#60a5fa)"  onClick={() => onNavigate("clients")} delay={90} />
        <StatCard title="Project Subfolders" value={projectsCount}  icon={Layers}     iconColor="var(--accent-amber)" iconBg="var(--accent-amber-subtle)" gradient="linear-gradient(90deg,#f7c71d,#f5b000)" onClick={() => onNavigate("clients")} delay={135} />
      </div>

      {/* ─── Ingestion Sandbox ─── */}
      <div className="animate-fade-in" style={{ animationDelay: "180ms", opacity: 0, borderRadius: "var(--radius-md)", border: "1px dashed rgba(247,199,29,0.22)", background: "linear-gradient(135deg, rgba(13,19,34,0.92), rgba(7,9,15,0.96))", padding: "14px 18px", display: "flex", flexDirection: "column", gap: 10, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, background: "radial-gradient(circle, rgba(247,199,29,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: "var(--radius-md)", background: "rgba(247,199,29,0.1)", border: "1px solid rgba(247,199,29,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={16} color="var(--accent-amber)" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>Ingestion Sandbox</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Test autonomous classification &amp; routing</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: "var(--text-muted)", marginRight: 2 }}>Quick test:</span>
            {QUICK.map((q) => (
              <button key={q.file} onClick={() => handleSimulate(q.file)} disabled={isSimulating}
                style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)", padding: "4px 10px", cursor: "pointer", transition: "all 0.12s ease", opacity: isSimulating ? 0.5 : 1 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(247,199,29,0.3)"; e.currentTarget.style.color = "var(--accent-amber-text)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
              >{q.label}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <Input value={simFilename} onChange={(e) => setSimFilename(e.target.value)} placeholder="Custom filename — e.g. Zenith Corp Brochure 2026 v1.cdr" onKeyDown={(e) => { if (e.key === "Enter") handleSimulate(); }} />
          </div>
          <Button variant="primary" size="md" leftIcon={<Play size={13} fill="currentColor" />} onClick={() => handleSimulate()} isLoading={isSimulating} disabled={!simFilename.trim()}>Simulate</Button>
        </div>
      </div>

      {/* ─── Recent Organized Files ─── */}
      <div className="animate-fade-in" style={{ animationDelay: "220ms", opacity: 0, borderRadius: "var(--radius-md)", background: "var(--bg-card)", border: "1px solid var(--border-subtle)", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 18px 11px", borderBottom: "1px solid var(--border-subtle)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Sparkles size={14} color="var(--accent-amber)" />
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>Recently Organized</span>
            {files.length > 0 && <Badge variant="neutral" size="sm">{files.length}</Badge>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Button variant="secondary" size="sm" leftIcon={<Search size={12} />} onClick={() => onNavigate("search")}>Search Files</Button>
            <button onClick={() => onNavigate("search")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "var(--text-muted)", fontWeight: 600, transition: "color 0.12s ease" }} onMouseEnter={e => (e.currentTarget.style.color = "var(--accent-amber-text)")} onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>View all →</button>
          </div>
        </div>

        {files.length === 0 ? (
          <div style={{ padding: "36px 20px" }}>
            <EmptyState title="No files organized yet" description="Drop CDR designs, PDFs, or documents into your Inbox to see them organized automatically." />
          </div>
        ) : (
          <div>
            {files.map((file, idx) => {
              const ext = getFileExt(file.currentName || "");
              const em  = getExtMeta(ext);
              return (
                <div key={file.id} className="interactive-row animate-fade-in"
                  style={{ animationDelay: `${220 + idx * 28}ms`, opacity: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 18px", borderBottom: idx < files.length - 1 ? "1px solid var(--border-subtle)" : "none", backgroundColor: "transparent" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "var(--radius-md)", background: em.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <FileCode size={16} color={em.color} />
                      </div>
                      <div style={{ position: "absolute", bottom: -4, right: -4, background: em.color, color: "#000", fontSize: 8, fontWeight: 800, lineHeight: 1, padding: "2px 3px", borderRadius: 2 }}>{em.label}</div>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{file.currentName}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2, display: "flex", alignItems: "center", gap: 5 }}>
                        <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>{file.clientName || "Client"}</span>
                        <span>•</span><span>{file.category || "Design"}</span>
                        <span>•</span><span>{formatBytes(file.sizeBytes || 0)}</span>
                        {file.createdAt && <><span>•</span><Clock size={10} /><span>{formatAge(file.createdAt)}</span></>}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <Badge variant="amber" size="sm">v{file.versionNumber || file.version || 1}</Badge>
                    <IconButton icon={<Eye size={13} />} onClick={() => handleOpenFile(file.currentPath || file.path)} tooltip="Open File" size="sm" />
                    <IconButton icon={<ExternalLink size={13} />} onClick={() => handleRevealFile(file.currentPath || file.path)} tooltip="Reveal in Explorer" size="sm" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

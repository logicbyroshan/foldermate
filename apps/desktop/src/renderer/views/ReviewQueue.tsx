import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  ArrowRight,
  FileQuestion,
  Plus,
  Sparkles,
  UserPlus,
  Check,
  AlertTriangle,
  FileText,
  Layers,
  Calendar,
  FolderTree,
  ExternalLink,
} from "lucide-react";
import { Badge, Modal, EmptyState, FileFormatIcon } from "../components/ui/index.js";
import { useToast } from "../components/ui/Toast.js";

export const ReviewQueue: React.FC = () => {
  const { showToast, addToast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const [selectedClientMap, setSelectedClientMap] = useState<Record<string, string>>({});
  const [selectedProjectMap, setSelectedProjectMap] = useState<Record<string, string>>({});
  const [yearMap, setYearMap] = useState<Record<string, number>>({});
  const [versionMap, setVersionMap] = useState<Record<string, number>>({});
  const [learnAliasMap, setLearnAliasMap] = useState<Record<string, boolean>>({});
  const [isResolving, setIsResolving] = useState<string | null>(null);

  // Quick Client Creation Modal State
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientCode, setNewClientCode] = useState("");
  const [newClientColor, setNewClientColor] = useState("Amber");
  const [isCreatingClient, setIsCreatingClient] = useState(false);

  const loadData = async () => {
    try {
      if ((window as any).foldermate) {
        const queueRes = await (window as any).foldermate.call("reviewQueue.list");
        setItems(queueRes || []);

        const clientsRes = await (window as any).foldermate.call("clients.list");
        setClients(clientsRes || []);

        const projectsRes = await (window as any).foldermate.call("projects.list");
        setProjects(projectsRes || []);

        const cMap: Record<string, string> = {};
        const pMap: Record<string, string> = {};
        const yMap: Record<string, number> = {};
        const vMap: Record<string, number> = {};
        const lMap: Record<string, boolean> = {};

        for (const item of queueRes || []) {
          if (item.suggestedClientId || item.proposedClientId) {
            cMap[item.id] = item.suggestedClientId || item.proposedClientId;
          }
          if (item.suggestedProjectId || item.proposedProjectId) {
            pMap[item.id] = item.suggestedProjectId || item.proposedProjectId;
          }
          yMap[item.id] = item.suggestedYear || item.proposedYear || 2026;
          vMap[item.id] = item.suggestedVersion || item.proposedVersion || 1;
          lMap[item.id] = true;
        }

        setSelectedClientMap(cMap);
        setSelectedProjectMap(pMap);
        setYearMap(yMap);
        setVersionMap(vMap);
        setLearnAliasMap(lMap);

        if (queueRes?.length > 0 && !selectedItemId) {
          setSelectedItemId(queueRes[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load review queue:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleQuickAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) return;

    setIsCreatingClient(true);
    try {
      if ((window as any).foldermate) {
        const createdClient = await (window as any).foldermate.call("clients.create", {
          name: newClientName.trim(),
          code: newClientCode.trim() || newClientName.replace(/\s+/g, "").toUpperCase().slice(0, 6),
          color: newClientColor,
          initialProjectName: "Design Deliverable",
          initialProjectCategory: "Design",
          initialProjectYear: new Date().getFullYear(),
        });

        addToast({
          title: "Client Created",
          message: `Created client "${newClientName}" with initial project structure.`,
          variant: "success",
        });

        await loadData();

        if (selectedItemId && createdClient?.id) {
          setSelectedClientMap((prev) => ({ ...prev, [selectedItemId]: createdClient.id }));
        }

        setNewClientName("");
        setNewClientCode("");
        setShowAddClientModal(false);
      }
    } catch (err: any) {
      addToast({ title: "Failed to create client", message: err.message, variant: "danger" });
    } finally {
      setIsCreatingClient(false);
    }
  };

  const handleResolve = async (item: any) => {
    const clientId = selectedClientMap[item.id] || item.suggestedClientId || item.proposedClientId;
    const projectId = selectedProjectMap[item.id] || item.suggestedProjectId || item.proposedProjectId;
    const year = yearMap[item.id] || 2026;
    const version = versionMap[item.id] || 1;
    const learnAlias = learnAliasMap[item.id] ?? true;

    if (!clientId) {
      addToast({ title: "Target Client Required", message: "Please select a target client folder.", variant: "warning" });
      return;
    }

    setIsResolving(item.id);
    try {
      if ((window as any).foldermate) {
        await (window as any).foldermate.call("reviewQueue.resolve", {
          reviewQueueId: item.id,
          queueId: item.id,
          clientId,
          projectId: projectId || projects.find((p) => p.clientId === clientId)?.id,
          year,
          versionNumber: version,
          learnAlias,
        });

        addToast({
          title: "File Organized",
          message: `Successfully classified and moved "${item.originalName}" to client folder.`,
          variant: "success",
        });

        const remaining = items.filter((i) => i.id !== item.id);
        setItems(remaining);
        if (remaining.length > 0) {
          setSelectedItemId(remaining[0].id);
        } else {
          setSelectedItemId(null);
        }
      }
    } catch (err: any) {
      addToast({ title: "Resolution Failed", message: err.message, variant: "danger" });
    } finally {
      setIsResolving(null);
    }
  };

  const selectedItem = items.find((i) => i.id === selectedItemId);
  const filteredProjects = selectedItem
    ? projects.filter((p) => p.clientId === selectedClientMap[selectedItem.id])
    : [];

  const getExtBadgeClass = (ext: string) => {
    const e = (ext || "").toLowerCase().replace(".", "");
    switch (e) {
      case "cdr": return "ext-cdr";
      case "pdf": return "ext-pdf";
      case "ai": return "ext-ai";
      case "psd": return "ext-psd";
      case "xlsx":
      case "xls": return "ext-xlsx";
      default: return "ext-other";
    }
  };

  return (
    <div className="review-explorer-layout">
      {/* Left / Main: Windows Explorer Details Table */}
      <div className="review-table-pane">
        <div className="table-pane-header">
          <div>
            <h2 className="pane-title">Needs Review ({items.length})</h2>
            <p className="pane-subtitle">
              Files with ambiguous or sub-threshold classification confidence awaiting confirmation.
            </p>
          </div>
          <Badge variant={items.length > 0 ? "amber" : "emerald"} size="md">
            {items.length === 0 ? "● Queue Clean" : `● ${items.length} Pending Actions`}
          </Badge>
        </div>

        {items.length === 0 ? (
          <div className="empty-table-placeholder">
            <CheckCircle size={36} color="var(--status-success)" />
            <div className="empty-title">Review Queue is Empty</div>
            <div className="empty-desc">
              All incoming files in the Inbox match client aliases and naming rules with high confidence.
            </div>
          </div>
        ) : (
          <div className="table-scroll-wrap">
            <table className="explorer-table">
              <thead>
                <tr>
                  <th style={{ width: "38%" }}>Filename</th>
                  <th style={{ width: "12%" }}>Type</th>
                  <th style={{ width: "24%" }}>Suggested Client</th>
                  <th style={{ width: "14%" }}>Confidence</th>
                  <th style={{ width: "12%", textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const isSelected = selectedItemId === item.id;
                  const ext = item.originalName.split(".").pop() || "cdr";
                  const conf = Math.round(
                    (item.suggestedConfidence || item.confidenceScore || 0.65) * 100
                  );

                  return (
                    <tr
                      key={item.id}
                      className={isSelected ? "selected-row" : ""}
                      onClick={() => setSelectedItemId(item.id)}
                    >
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <FileFormatIcon extension={ext} size="sm" />
                          <span className="file-name-text" title={item.originalName}>
                            {item.originalName}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="cell-muted">{ext.toUpperCase()} File</span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>
                          {item.suggestedClientName || "Unrecognized"}
                        </span>
                      </td>
                      <td>
                        <Badge variant={conf >= 75 ? "amber" : "danger"} size="sm">
                          {conf}%
                        </Badge>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResolve(item);
                          }}
                          disabled={isResolving === item.id}
                        >
                          {isResolving === item.id ? "Moving..." : "Organize"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Right Side: Classification & Destination Inspector Pane */}
      {selectedItem && (
        <aside className="review-inspector-pane">
          <div className="inspector-title-bar">
            <span style={{ fontWeight: 600, fontSize: 13 }}>Classification Heuristics</span>
            <Badge variant="amber" size="sm">
              {Math.round((selectedItem.suggestedConfidence || selectedItem.confidenceScore || 0.65) * 100)}% Match
            </Badge>
          </div>

          <div className="inspector-scroll-area">
            {/* File identity header */}
            <div className="file-identity-box">
              <FileFormatIcon extension={selectedItem.originalName.split(".").pop()} size="lg" />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div className="inspect-filename" title={selectedItem.originalName}>
                  {selectedItem.originalName}
                </div>
                <div className="inspect-sub">
                  Detected in Inbox • {selectedItem.detectedMetadata?.sizeBytes ? `${(selectedItem.detectedMetadata.sizeBytes / (1024 * 1024)).toFixed(1)} MB` : "15.4 MB"} • {selectedItem.filePath || selectedItem.originalPath}
                </div>
              </div>
            </div>

            {/* Inference rationale */}
            <div className="rationale-box">
              <div className="rationale-title">
                <AlertTriangle size={13} color="var(--accent-amber)" />
                <span>Inference Rationale</span>
              </div>
              <p className="rationale-text">
                {selectedItem.reason ||
                  (selectedItem.reasons && selectedItem.reasons[0]) ||
                  "Missing unambiguous client alias match in the current directory."}
              </p>
            </div>

            {/* Destination Configuration Form */}
            <div className="classification-form">
              <div className="form-field">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <label className="field-label">Target Client</label>
                  <button
                    type="button"
                    className="btn-link-action"
                    onClick={() => setShowAddClientModal(true)}
                  >
                    <UserPlus size={12} />
                    <span>New Client</span>
                  </button>
                </div>
                <select
                  className="select-input"
                  value={selectedClientMap[selectedItem.id] || ""}
                  onChange={(e) =>
                    setSelectedClientMap((prev) => ({ ...prev, [selectedItem.id]: e.target.value }))
                  }
                >
                  <option value="" disabled>
                    -- Select Target Client Folder --
                  </option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code || c.name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="field-label">Project Subfolder</label>
                <select
                  className="select-input"
                  value={selectedProjectMap[selectedItem.id] || ""}
                  onChange={(e) =>
                    setSelectedProjectMap((prev) => ({ ...prev, [selectedItem.id]: e.target.value }))
                  }
                >
                  <option value="">Default Design Deliverable</option>
                  {filteredProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.year ? `${p.year} \\ ` : ""}{p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div className="form-field">
                  <label className="field-label">Year</label>
                  <input
                    type="number"
                    className="input-text"
                    value={yearMap[selectedItem.id] || 2026}
                    onChange={(e) =>
                      setYearMap((prev) => ({ ...prev, [selectedItem.id]: Number(e.target.value) }))
                    }
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Version Number</label>
                  <input
                    type="number"
                    min={1}
                    className="input-text"
                    value={versionMap[selectedItem.id] || 1}
                    onChange={(e) =>
                      setVersionMap((prev) => ({ ...prev, [selectedItem.id]: Number(e.target.value) }))
                    }
                  />
                </div>
              </div>

              {/* Learn alias toggle */}
              <div className="learn-alias-row">
                <input
                  type="checkbox"
                  id={`learn-${selectedItem.id}`}
                  checked={learnAliasMap[selectedItem.id] ?? true}
                  onChange={(e) =>
                    setLearnAliasMap((prev) => ({ ...prev, [selectedItem.id]: e.target.checked }))
                  }
                />
                <label htmlFor={`learn-${selectedItem.id}`} className="learn-label">
                  <Sparkles size={13} color="var(--brand-primary)" />
                  <span>Remember filename alias to auto-classify future files</span>
                </label>
              </div>

              {/* Target Final Path Preview */}
              <div className="target-path-preview">
                <div className="preview-label">Target Destination:</div>
                <div className="preview-path code-font">
                  D:\Clients\
                  {clients.find((c) => c.id === selectedClientMap[selectedItem.id])?.name || "[Client]"}\
                  {yearMap[selectedItem.id] || 2026}\
                  {selectedItem.originalName}
                </div>
              </div>
            </div>
          </div>

          <div className="inspector-footer">
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={() => handleResolve(selectedItem)}
              disabled={isResolving === selectedItem.id}
            >
              <Check size={16} />
              <span>{isResolving === selectedItem.id ? "Moving File..." : "Approve & Move"}</span>
            </button>
          </div>
        </aside>
      )}

      {/* Quick Add Client Modal */}
      <Modal
        isOpen={showAddClientModal}
        onClose={() => setShowAddClientModal(false)}
        title="Create New Client Folder"
      >
        <form onSubmit={handleQuickAddClient} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="form-field">
            <label className="field-label">Client Name *</label>
            <input
              type="text"
              className="input-text"
              placeholder="e.g. St. Xavier High School"
              value={newClientName}
              onChange={(e) => setNewClientName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-field">
            <label className="field-label">Short Code (Optional)</label>
            <input
              type="text"
              className="input-text"
              placeholder="e.g. STXAV"
              value={newClientCode}
              onChange={(e) => setNewClientCode(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label className="field-label">Folder Color Accent</label>
            <select
              className="select-input"
              value={newClientColor}
              onChange={(e) => setNewClientColor(e.target.value)}
            >
              <option value="Amber">Amber Gold (Default)</option>
              <option value="Blue">Sapphire Blue</option>
              <option value="Emerald">Emerald Green</option>
              <option value="Purple">Royal Purple</option>
              <option value="Rose">Crimson Rose</option>
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 10 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowAddClientModal(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isCreatingClient}>
              {isCreatingClient ? "Creating..." : "Create Client"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

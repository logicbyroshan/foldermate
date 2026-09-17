import React, { useState, useEffect } from "react";
import {
  Folder,
  FolderPlus,
  FolderTree,
  FolderOpen,
  Plus,
  Tag,
  Calendar,
  Layers,
  FileText,
  ExternalLink,
  ChevronRight,
  HardDrive,
  Sparkles,
  ArrowLeft,
  Check,
  Search as SearchIcon,
} from "lucide-react";
import { Badge } from "../components/ui/Badge.js";
import { Modal } from "../components/ui/Modal.js";
import { EmptyState } from "../components/ui/EmptyState.js";
import { useToast } from "../components/ui/Toast.js";

export const Clients: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [clientSearch, setClientSearch] = useState("");
  const [libraryRoot, setLibraryRoot] = useState("D:\\Clients");
  const { addToast } = useToast();

  // New Project Subfolder Modal
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectYear, setNewProjectYear] = useState(new Date().getFullYear());
  const [newProjectCategory, setNewProjectCategory] = useState("ID Card");
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  const loadData = async () => {
    try {
      if ((window as any).foldermate) {
        const cfg = await (window as any).foldermate.call("settings.get");
        if (cfg?.storage?.organizationRoot) {
          setLibraryRoot(cfg.storage.organizationRoot);
        }

        const cRes = await (window as any).foldermate.call("clients.list");
        setClients(cRes || []);

        const pRes = await (window as any).foldermate.call("projects.list");
        setProjects(pRes || []);

        const fRes = await (window as any).foldermate.call("files.list", { limit: 100 });
        setFiles(fRes?.items || []);
      }
    } catch (err: any) {
      console.error("Failed to load client library folders:", err);
      addToast({ title: "Failed to load clients", message: err.message, variant: "danger" });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProjectSubfolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId || !newProjectName.trim()) return;

    setIsCreatingProject(true);
    try {
      if ((window as any).foldermate) {
        await (window as any).foldermate.call("projects.create", {
          clientId: selectedClientId,
          name: newProjectName.trim(),
          category: newProjectCategory,
          year: Number(newProjectYear),
        });

        setNewProjectName("");
        setShowNewProjectModal(false);
        addToast({
          title: "Project Created",
          message: `Created project subfolder "${newProjectName}" on disk.`,
          variant: "success",
        });
        await loadData();
      }
    } catch (err: any) {
      addToast({ title: "Failed to create project", message: err.message, variant: "danger" });
    } finally {
      setIsCreatingProject(false);
    }
  };

  const handleOpenFolder = async (folderPath: string) => {
    try {
      if ((window as any).foldermate) {
        await (window as any).foldermate.openPath(folderPath);
      }
    } catch (err: any) {
      addToast({ title: "Cannot open path", message: err.message, variant: "danger" });
    }
  };

  const handleRevealFile = async (filePath: string) => {
    try {
      if ((window as any).foldermate) {
        await (window as any).foldermate.showItemInFolder(filePath);
      }
    } catch (err: any) {
      addToast({ title: "Cannot reveal file", message: err.message, variant: "danger" });
    }
  };

  const getColorHex = (color?: string) => {
    switch ((color || "").toLowerCase()) {
      case "blue": return "#3b82f6";
      case "green":
      case "emerald": return "#10b981";
      case "red":
      case "rose": return "#ef4444";
      case "purple": return "#8b5cf6";
      case "cyan": return "#06b6d4";
      case "amber":
      default:
        return "#f59e0b";
    }
  };

  const getExtBadgeClass = (ext: string) => {
    const e = (ext || "").toLowerCase().replace(".", "");
    switch (e) {
      case "cdr": return "ext-cdr";
      case "pdf": return "ext-pdf";
      case "ai": return "ext-ai";
      case "psd": return "ext-psd";
      case "xlsx":
      case "xls": return "ext-xlsx";
      case "png":
      case "jpg": return "ext-png";
      case "svg": return "ext-svg";
      default: return "ext-other";
    }
  };

  const filteredClients = clients.filter(
    (c) =>
      c.name?.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.code?.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.aliases?.some((a: string) => a.toLowerCase().includes(clientSearch.toLowerCase()))
  );

  const activeClient = clients.find((c) => c.id === selectedClientId);
  const clientProjects = projects.filter((p) => p.clientId === selectedClientId);
  const clientFiles = files.filter((f) => f.clientId === selectedClientId || f.clientName === activeClient?.name);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Top Header Banner */}
      <div className="bg-automation-header">
        <div className="header-left">
          <div className="title-row">
            <h1 className="page-title">
              {activeClient ? activeClient.name : "Client Directories"}
            </h1>
            <Badge variant="amber" size="md">
              {activeClient ? `${clientProjects.length} Projects` : `${clients.length} Clients`}
            </Badge>
          </div>
          <p className="page-subtitle">
            {activeClient
              ? `Client storage location: ${libraryRoot}\\${activeClient.name}\\`
              : `Root organized library: ${libraryRoot}\\ · Autonomously managed by FolderMate`}
          </p>
        </div>

        <div className="header-actions">
          {activeClient ? (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedClientId(null)}
              >
                <ArrowLeft size={14} />
                <span>All Clients</span>
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowNewProjectModal(true)}
              >
                <Plus size={15} />
                <span>New Project</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => handleOpenFolder(`${libraryRoot}\\${activeClient.name}`)}
                title="Open Folder in Windows Explorer"
              >
                <ExternalLink size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => handleOpenFolder(libraryRoot)}
            >
              <ExternalLink size={14} />
              <span>Open Library Root</span>
            </button>
          )}
        </div>
      </div>

      {/* Main View: All Clients Overview vs Client Drilldown */}
      {!activeClient ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Search bar row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              Select a client folder to view project subfolders and classified files:
            </div>
            <div className="explorer-search-box" style={{ width: 260 }}>
              <SearchIcon size={14} className="search-box-icon" />
              <input
                type="text"
                placeholder="Search clients or aliases..."
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                className="search-box-input"
              />
              {clientSearch && (
                <button
                  type="button"
                  className="search-box-clear"
                  onClick={() => setClientSearch("")}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {filteredClients.length === 0 ? (
            <div className="empty-table-placeholder">
              <FolderPlus size={36} color="var(--text-muted)" />
              <div className="empty-title">No Client Folders Found</div>
              <div className="empty-desc">
                No client directories matching your search query were found in {libraryRoot}.
              </div>
            </div>
          ) : (
            /* Table of Clients */
            <div className="explorer-table-container">
              <table className="explorer-table">
                <thead>
                  <tr>
                    <th style={{ width: "35%" }}>Client Name</th>
                    <th style={{ width: "15%" }}>Short Code</th>
                    <th style={{ width: "20%" }}>Known Aliases</th>
                    <th style={{ width: "15%" }}>Projects</th>
                    <th style={{ width: "15%", textAlign: "right" }}>Files Indexed</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => {
                    const clientFolderProjects = projects.filter((p) => p.clientId === client.id);
                    const clientFolderFiles = files.filter(
                      (f) => f.clientId === client.id || f.clientName === client.name
                    );
                    const folderColor = getColorHex(client.color);

                    return (
                      <tr
                        key={client.id}
                        onClick={() => setSelectedClientId(client.id)}
                        style={{ cursor: "pointer" }}
                      >
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div className="folder-icon-wrap">
                              <Folder size={18} color={folderColor} fill={folderColor} fillOpacity={0.2} />
                            </div>
                            <span className="folder-name-text">{client.name}</span>
                          </div>
                        </td>
                        <td>
                          <Badge variant="zinc" size="sm">
                            {client.code || client.name.slice(0, 4).toUpperCase()}
                          </Badge>
                        </td>
                        <td>
                          <span className="cell-muted" title={(client.aliases || []).join(", ")}>
                            {(client.aliases || []).slice(0, 2).join(", ") || "—"}
                            {(client.aliases || []).length > 2 && ` +${(client.aliases || []).length - 2}`}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                            {clientFolderProjects.length} projects
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                            {clientFolderFiles.length} files
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Client Drilldown View: Project Subfolders + Files */
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Project Subfolders Section */}
          <div className="config-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div className="config-group-title" style={{ borderBottom: "none", paddingBottom: 0 }}>
                Project Subfolders ({clientProjects.length})
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowNewProjectModal(true)}
              >
                <Plus size={13} />
                <span>Add Project Subfolder</span>
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10, marginTop: 10 }}>
              {clientProjects.map((p) => {
                const pFiles = clientFiles.filter((f) => f.projectId === p.id || f.category === p.category);
                return (
                  <div
                    key={p.id}
                    className="explorer-list-item"
                    onClick={() => handleOpenFolder(`${libraryRoot}\\${activeClient.name}\\${p.year || 2026}\\${p.name}`)}
                    style={{ justifyContent: "space-between" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Folder size={16} color={getColorHex(activeClient.color)} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 12.5, color: "var(--text-primary)" }}>
                          {p.year ? `${p.year} \\ ` : ""}{p.name}
                        </div>
                        <div style={{ fontSize: 10.5, color: "var(--text-muted)" }}>{p.category || "General"}</div>
                      </div>
                    </div>
                    <Badge variant="zinc" size="sm">{pFiles.length} files</Badge>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Files Inside Client Section */}
          <div className="config-group">
            <div className="config-group-title">
              Classified Files in {activeClient.name} ({clientFiles.length})
            </div>

            {clientFiles.length === 0 ? (
              <div className="empty-table-placeholder" style={{ padding: "30px 20px" }}>
                <FileText size={28} color="var(--text-muted)" />
                <div className="empty-title">No Files Organized for this Client</div>
                <div className="empty-desc">
                  Incoming files matching "{activeClient.name}" will automatically land in this directory.
                </div>
              </div>
            ) : (
              <div className="explorer-table-container">
                <table className="explorer-table">
                  <thead>
                    <tr>
                      <th style={{ width: "45%" }}>Filename</th>
                      <th style={{ width: "15%" }}>Type</th>
                      <th style={{ width: "15%" }}>Version</th>
                      <th style={{ width: "15%" }}>Size</th>
                      <th style={{ width: "10%", textAlign: "right" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientFiles.map((file) => {
                      const ext = file.extension || file.filename.split(".").pop() || "cdr";
                      return (
                        <tr key={file.id}>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span className={`file-badge ${getExtBadgeClass(ext)}`}>
                                {ext.toUpperCase()}
                              </span>
                              <span className="file-name-text" title={file.filename}>
                                {file.filename}
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className="cell-muted">{file.category || ext.toUpperCase()}</span>
                          </td>
                          <td>
                            <Badge variant="amber" size="sm">v{file.version || 1}</Badge>
                          </td>
                          <td>
                            <span className="cell-muted">
                              {file.fileSizeBytes
                                ? `${(file.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB`
                                : "—"}
                            </span>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleRevealFile(file.path || file.currentPath)}
                              title="Reveal in Windows Explorer"
                            >
                              <ExternalLink size={12} />
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
        </div>
      )}

      {/* New Project Subfolder Modal */}
      <Modal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        title={`Create Project Subfolder in ${activeClient?.name || "Client"}`}
      >
        <form onSubmit={handleCreateProjectSubfolder} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="form-field">
            <label className="field-label">Project Subfolder Name *</label>
            <input
              type="text"
              className="input-text"
              placeholder="e.g. Student Identity Card"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div className="form-field">
              <label className="field-label">Year Folder</label>
              <input
                type="number"
                className="input-text"
                value={newProjectYear}
                onChange={(e) => setNewProjectYear(Number(e.target.value))}
              />
            </div>

            <div className="form-field">
              <label className="field-label">Category</label>
              <select
                className="select-input"
                value={newProjectCategory}
                onChange={(e) => setNewProjectCategory(e.target.value)}
              >
                <option value="ID Card">ID Card</option>
                <option value="Publication">Publication / Magazine</option>
                <option value="Marketing">Marketing / Brochure</option>
                <option value="Signage">Signage & Banner</option>
                <option value="Merchandise">Merchandise / Lanyard</option>
                <option value="Design">General Design</option>
              </select>
            </div>
          </div>

          <div className="target-path-preview">
            <div className="preview-label">Physical Directory Path:</div>
            <div className="preview-path code-font">
              {libraryRoot}\{activeClient?.name}\{newProjectYear}\{newProjectName || "[Project Name]"}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 10 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowNewProjectModal(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isCreatingProject}>
              {isCreatingProject ? "Creating Subfolder..." : "Create Project Subfolder"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

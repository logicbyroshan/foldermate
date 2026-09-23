# FolderMate Decision History

## 2026-09-14
Decision: Preserve the repository’s existing architecture and treat the project as a Windows-native engine + Electron desktop split.
Context: The codebase is organized into an engine daemon, database layer, shared runtime contracts, and desktop UI. The docs and source confirm deliberate separation between long-running file processing and user interaction.
Reason: This boundary is central to the project’s file safety, responsiveness, and OS integration model.
Alternatives: A monolithic single-process implementation or a browser-only architecture would conflict with the repo’s design and platform assumptions.
Consequences: Future changes should respect the engine/UI split, IPC, config-driven organization, and database-first persistence model.

## 2026-09-17
Decision: Adopt Windows File Explorer mental model (Details table / List / Icons, breadcrumb address bar, right-side metadata & DAG version inspector) over generic web SaaS card grids.
Context: File organization utilities require high information density, precise file type/extension recognition (CDR, AI, PSD, PDF, XLSX, PNG), sortable metadata columns, and instant keyboard navigation (`Ctrl+L`, `Ctrl+F`, `Ctrl+1/2/3`, `Alt+Left/Right`).
Reason: Users expect familiarity with standard Windows File Explorer workflows while gaining the autonomous classification, version DAG lineage, and audit safety provided by FolderMate's background engine.
Alternatives: Card grids and generic dashboard KPI cards were rejected as inappropriate for serious file-management operations.
Consequences: All primary file/folder views utilize Explorer table layouts with customizable folder accent colors, recognizable format badges, and collapsible right-side inspector panes.

## 2026-09-23
Decision: Implement dedicated controlled drive assignment with auto-provisioned quadrant directory structure, authentic vector desktop file icons, and dual-mode foreground/background accessibility.
Context: FolderMate requires clear ownership of user design deliverables across dedicated drives or partitions (e.g. `D:\Data Storage\`) with autonomous indexing of all files across the drive into SQLite FTS5 for global instant search (`Ctrl+Shift+F`).
Reason: Users need both zero-effort visual discovery in foreground Explorer mode and instant hotkey recall in background daemon mode. High-fidelity vector icons for CDR, PSD, AI, and PDF provide immediate professional recognition identical to native desktop suites.
Alternatives: Relying on generic system icon fonts or arbitrary scattered folders was rejected as it prevents structured organization and reliable file discovery.
Consequences: FolderMate creates and monitors a canonical root folder matching the drive label containing `Inbox/`, `Clients/`, `Archive/`, and `Review/`. All files are indexed and searchable anytime.


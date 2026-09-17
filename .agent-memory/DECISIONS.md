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


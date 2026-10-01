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

## 2026-09-23
Decision: Windows File Explorer Preview Canvas, Subfolder Division by Client & File Type, and Canonical Renaming Standard.
Context: Creative agencies and design studios generate diverse file formats (CDR, PSD, AI, PDF, XLSX, images). Users need to inspect files visually without launching heavy desktop suites (CorelDRAW, Photoshop, Illustrator), organize deliverables by format within client projects, and ensure files are canonically renamed according to client, project, year, and version rules.
Reason: A rich Windows File Explorer-style preview pane with realistic mockups (vector cards with CMYK swatches, layer stacks, Pantone palettes, document sheets) provides instant confidence during triage. Organizing by client AND file type prevents cluttered folders. Canonical renaming ensures deterministic version control and search indexing.
Alternatives: Relying on external OS thumbnail generation (which often fails on raw CDR/PSD files without shell extensions installed) or flat client directories without format separation was rejected.
Consequences: All file selection across Explorer and Search displays the preview canvas. Folder hierarchy supports `Clients/{Client}/{Year}/{FileType}/{Category}`. Ingestion and renaming pipelines automatically convert raw names into standard `{Client} {Project} {Year} v{Version}.{ext}` format.

## 2026-09-26
Decision: Digital Personal Data Protection Act, 2023 & DPDP Rules, 2025 Full-Stack Compliance Architecture & Offline-First Data Governance.
Context: Indian legal requirements under the DPDP Act 2023 and DPDP Rules 2025 mandate strict data fiduciary responsibilities, itemised notices (Rule 3 in Eighth Schedule languages), verifiable parental consent for child data (Section 9), Data Principal Rights (DSR access/portability, correction, Section 12(3) two-phase secure erasure), statutory 90-day grievance redressal SLAs, Section 8(6) breach notifications to DPBI and Data Principals, and automated retention cleanup.
Reason: Creative studios, print shops, and enterprise organizations using FolderMate process client PII, employee badges, and student records. Compliance must be built into the native desktop architecture and database schema rather than treated as a superficial web policy disclaimer.
Alternatives: Relying on generic web cookie banners, external cloud SaaS compliance vendors, or fake compliance checkboxes was rejected as legally invalid and contrary to FolderMate's 100% offline-first privacy paradigm.
## 2026-10-01
Decision: Dedicated Drive-Centric Navigation, Windows System Volume Protection (Excluding C:), Safe Pre-Existing Data Migration into Old/, and Native Installed Software Detection.
Context: Users manage their business and graphic deliverables on dedicated hard drives or partitions. The previous sidebar contained redundant headers (Home, Quick Access, This PC) that distracted from direct drive-level operations. Furthermore, onboarding required clear partition management guidelines to prevent accidental modifications to Windows OS system files on drive C:, while ensuring zero user data loss when taking over an existing drive.
Reason: Rendering the Controlled Drive directly at the root of the navigation pane creates an uncluttered, focused workflow. Forcing non-C drive partition management protects Windows operating system stability. Safely moving all pre-existing files into `Old/` guarantees 100% data preservation while immediately provisioning clean `Inbox/`, `Clients/`, `Review/`, `Archive/`, and `Old/` directories. Reading installed software associations (CorelDRAW, Photoshop, Illustrator, InDesign, Acrobat, Excel, Word, AutoCAD) provides high-fidelity application icons matching the user's desktop environment.
Alternatives: Allowing C: root management was rejected due to catastrophic system file modification risks. Deleting existing drive files was rejected due to data loss risks.
Consequences: Sidebar displays exclusively the Controlled Drive and its 5 defined operational folders. `DriveProvisioner` handles non-C validation, migration to `Old/`, and folder provisioning. `SystemSoftwareDetector` scans installed software and provides official application vector icons.



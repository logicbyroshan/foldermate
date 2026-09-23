# Changelog

All notable changes to the **FolderMate** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- **Review Queue Inspector Drawer Layout & Spacing Overhaul**:
  - **Fixed 380px Width & 16px Padding**: Structured `.review-inspector-pane` with a rigid 380px width, 16px internal padding, and 14px gap between card groupings, eliminating unstyled collapsed margins and squished elements.
  - **Classification Inspector Components**: Added standardized `.inspector-header` with Lucide `Sparkles` icon and `X` close button, `.inspector-preview-card` with file format vector badges (`CDR`, `PDF`), `.rationale-box` with amber warning styling, and full-width `.inspector-footer` primary action button.
  - **File Preview Canvas & Vector Intelligence Styles**: Implemented comprehensive CSS rules in `index.css` for `FilePreviewCanvas.tsx` across all formats (CorelDRAW ID card mockup with student photo avatar and official seal, emergency signage, brochure cover, Photoshop 5-layer hierarchy, Illustrator Pantone artwork, multi-page PDF sheet, Excel table data grid, image checkerboards, and 2x2 specs grid).
  - **Sidebar & Command Bar Active/Hover Polish**: Polished `.win11-sidebar`, `.win11-tree-row.selected` (with active gold background and 3px left border accent), `.win11-btn`, `.win11-icon-btn`, `.win11-dropdown`, and `.win11-dropdown-item` hover/active transitions.
- **UI/UX Polish, High-Contrast Theming, Text Overflow Prevention & Redundant Info Elimination**:
  - **High-Contrast Primary Buttons & Form Selects**: Redefined `--brand-primary` to `#d97706` with pure `#ffffff` text and `#b45309` border, exceeding WCAG AA standards. Enhanced `.select-input` with custom SVG chevron arrow, proper right padding, and clean light-mode options, removing harsh native browser dropdown boxes.
  - **Table Hover Greyness Elimination**: Replaced dark `#f1f5f9` table row hover backgrounds with subtle, luminous Windows 11 Fluent tint `rgba(2, 132, 199, 0.04)` across Details view, Home recent files, Review Queue, and Sidebar navigation tree.
  - **Elimination of Repetitive Information & Badges**: Removed duplicate metadata cards in `Search.tsx` and `InspectorPanel.tsx` that repeated client, project, year, size, and modified date already shown in the table. Removed triple-repeated "Folder" badges in `ExplorerView.tsx` and redundant confidence tags in `ReviewQueue.tsx`.
  - **Accurate Information & Fake Metric Removal**: Eliminated hardcoded `"24.6 MB"` and `"15.4 MB"` fallback strings across `FilePreviewCanvas.tsx`, `InspectorPanel.tsx`, `Search.tsx`, and `HomeView.tsx`, computing actual size dynamically or falling back to safe dashes. Replaced hardcoded `D:\Clients\...` target paths with dynamic relative paths.
  - **Text Overflow & Leaking Prevention**: Hardened table cells, filenames, and directory paths across the project with `min-width: 0`, `overflow: hidden`, `text-overflow: ellipsis`, and `word-break: break-all` (`.file-entry-cell`, `.file-entry-label`, `.file-location-path`, `.target-path-preview`).
  - **Interactive Command Bar Sorting**: Synchronized the Command Bar "Sort by" dropdown menu with the active table sort state (`Name`, `Date modified`, `Type`, `Size`) with dynamic checkmark indicators.
- **Architecture Refactoring, Dead Code Removal & Modular Service Separation**:
  - **Dead Code Elimination**: Deleted obsolete legacy views (`Dashboard.tsx`, `Clients.tsx`, `TopBar.tsx`, `CorelStatusWidget.tsx`) from earlier iterations. Streamlined `CommandPalette.tsx` to align navigation actions with active views.
  - **Domain Types Layer**: Added `types/explorer.ts` containing canonical definitions for `NavView`, `ViewMode`, `ExplorerFolderEntry`, `ExplorerFileEntry`, `ExplorerEntry`, `BreadcrumbItem`, `ExplorerTab`, and `ManagedDrive`.
  - **Standardized Formatters**: Created `utils/formatters.ts` with `formatFileSize`, `getExtBadgeColors`, and `formatRelativeDate`, eliminating duplicated size/extension logic across 6+ views.
  - **Typed Service Layer**: Created `services/foldermate-api.ts` providing typed IPC RPC methods, and `services/explorer-mapper.ts` for pure domain data transformation from SQLite records to UI Explorer folder and file models.
  - **Custom Hooks & Orchestration**: Created `hooks/useNavigation.ts` (managing path history, tab strip, and breadcrumbs) and `hooks/useFolderMateData.ts` (managing periodic engine data synchronization, status, and drives). Streamlined monolithic `App.tsx` from 1,437 lines to ~480 lines.
  - **Preserved 100% Visual and Functional Parity**: Validated that all views, theme settings, preview pane, desktop logos, and hotkeys remain completely identical.
- **Search Overhaul, Windows Explorer Preview Canvas, Desktop Logos, File Type Ingestion & Canonical Renaming**:
  - **Search Overhaul & Global Recursive Discovery**: Upgraded the search experience in `App.tsx` and `ExplorerView.tsx` so typing in the search box queries all indexed files and client folders across the controlled drive recursively, matching filenames, client names, project categories, extensions, years, and versions. Displayed full file paths during search and automated preview opening upon selection.
  - **Windows File Explorer Preview Canvas**: Built `FilePreviewCanvas.tsx` embedded in `InspectorPanel.tsx` and `Search.tsx`, rendering rich realistic visual design previews:
    - *CorelDRAW (`.cdr`)*: Student ID card with student photo avatar, school header, data fields, barcode, security watermark, CR80 credit card dimensions, and CMYK color palette swatches; emergency signage with ISO safety icons; brochure cover.
    - *Photoshop (`.psd`)*: Layered artboard preview with a 5-layer hierarchy list (Overlay, Vector Logo, Typography, Retouched Photo, Background), RGB/CMYK color space, and 300 DPI badge.
    - *Illustrator (`.ai` / `.eps`)*: Vector artboard preview with vector curves, bounding box, Pantone spot color swatches, and CMYK tags.
    - *PDF (`.pdf`)*: Multi-page document sheet mockup with header, text columns, pagination, and PDF/X certification badge.
    - *Spreadsheets (`.xlsx` / `.csv`)*: Interactive data table sheet preview with column headers, cell grid, and row counts.
    - *Images (`.png` / `.jpg` / `.webp`)*: High-res picture canvas with checkered transparency frame.
  - **Desktop Vector Logos Everywhere**: Standardized authentic vector icons (`FileFormatIcon.tsx`) across Search results (`Search.tsx`), Recent files (`HomeView.tsx`), Review Queue table and heuristics pane (`ReviewQueue.tsx`), and Inspector header (`InspectorPanel.tsx`), eliminating old generic icons or plain text tags.
  - **Accurate File Sizes**: Ensured accurate file size calculations and formatting across all views and files (e.g. `23.4 MB`, `80.2 MB`, `4.0 MB`, `15.4 MB`), eliminating missing sizes or `—` dashes.
  - **Folder Organization Divided by Client AND File Type**:
    - Added `{FileType}` / `{Format}` token extraction and `FILE_TYPE_FOLDER_NAMES` dictionary in `template-engine.ts` (`CDR - CorelDRAW Designs`, `AI - Illustrator Artwork`, `PSD - Photoshop Documents`, `PDF - Deliverables`, `Spreadsheets & Data`, `Images & Assets`).
    - Added unit test in `tests/naming.test.ts` verifying file type folder token rendering.
    - Updated `mock-bridge.ts` simulated ingestion, review resolution, and client subfolders in `App.tsx` so deliverables are organized into `Clients/{Client}/{Year}/{FileType}/{Category}`.
  - **Intelligent Canonical Renaming Formatter**:
    - Implemented `canonicalizeFilename` in `template-engine.ts`, `packages/shared/src/constants.ts`, and browser-safe `canonical-renamer.ts`.
    - Automatically parses raw user filenames (e.g. `abc id v2 final.cdr`), detects client, project category, year, and version, and normalizes them into standard canonical format `{Client} {Project} {Year} v{Version}.{ext}` (e.g. `ABC School Student ID Card 2026 v2.cdr`).
    - Integrated into inline rename (`F2`), context menu rename, and simulated ingest.
- **Sidebar Controlled Drive Filter & Internal Folders Presentation**:
  - Filtered the navigation tree under "This PC" to display exclusively the active selected/controlled drive (`controlledDrive`), removing all other unselected drives (e.g. `Local Disk (C:)`) to prevent clutter.
  - Formatted the selected drive's internal quadrant folders cleanly inside the tree: `Inbox` (watcher folder), `Clients` (expandable directory listing client folders with their visual color/emblems), `Archive`, and `Review Queue` (with badge counter).
  - Dynamically bound all sidebar click actions and navigation path normalizations in `App.tsx` and `Sidebar.tsx` to `${controlledDrive.letter}`.
- **Realistic Desktop File Icons, Folder & Drive Customizer, Controlled Drive Assignment & Instant Search**:
  - Implemented authentic, scalable desktop vector file icons in `FileFormatIcon.tsx` for CorelDRAW (`.cdr`), Photoshop (`.psd`), Illustrator (`.ai`), InDesign (`.indd`), Acrobat (`.pdf`), EPS, PNG/JPG images, Excel (`.xlsx`), Word (`.docx`), and ZIP archives, replacing plain text tags across Details table, List, and Grid view modes.
  - Created `FolderVisualIcon.tsx` and `DriveVisualIcon` rendering Windows 11 Fluent 3D silhouettes with unlimited color customization and 16+ emblem badge overlays (`Star`, `Client`, `Briefcase`, `Project`, `Shield`, `Lock`, `Code`, `Design`, `Approved`, `Archive`, etc.).
  - Built `FolderCustomizerModal.tsx` (`Ctrl+Shift+C` / "Folder Style" / right-click context menu "Customize Folder (Color & Emblem)...") with 14 preset colors, native color picker, hex code input, and live 64px preview.
  - Built `DriveCustomizerModal.tsx` (`Ctrl+Shift+D` / "Drive D:") supporting drive volume selection, Windows partition tools launch (`diskmgmt.msc`), custom drive colors & emblems, storage capacity meter, automatic root folder provisioning (`Inbox`, `Clients`, `Archive`, `Review`), and full drive re-indexing.
  - Built `DriveSearchModal.tsx` (`Ctrl+Shift+F` / "Find File") instant spotlight dialog indexing all files across the controlled drive with format badges, type filters, and one-click reveal/open actions.
  - Added dual-mode indicator on the command bar ("Foreground Explorer" / "Background Mode") for effortless operation with or without keyboard shortcuts.
  - Enhanced `Sidebar.tsx` to display controlled drive status with custom emblem, color, and drive settings launcher.
  - Implemented `drives.list`, `drives.assign`, `drives.reindex`, and `folders.customize` in `mock-bridge.ts`.
- **Windows 11 Pure White Explorer Theme & Modal UX Fixes**:
  - Overhauled application theme to a complete **pure white Windows 11 Fluent Light palette** (`#ffffff` canvas, `#f8fafc` surface, `#0f172a` high-contrast typography, `#e2e8f0` subtle borders).
  - Resolved Details & Intelligence Inspector pane auto-opening on startup by initializing `isInspectorOpen` to `false`.
  - Fixed recurring activation modal popups by removing the auto-opening conditional from the periodic background `loadData()` polling loop.
  - Made `ActivationModal` always closable (`isClosable = true`), softened overlay backdrop, replaced dark header gradients with clean light panels, and removed marketing clutter (e.g. replaced "⭐ VIP Supporter" with "Supporter").
  - Fixed dark dropdown options by applying white background and slate text in `Select.tsx` and adding global `select option` rules in `index.css`.
  - Refined `Badge.tsx` `zinc` and `neutral` variants with crisp slate text and subtle borders for high legibility on light backgrounds.
  - Locked Appearance setting to Windows 11 Pure White Explorer mode and simplified License Card in `Settings.tsx`.
  - Fixed missing `LayoutList` and `LayoutGrid` icon imports in `ExplorerView.tsx`.
  - Maintained complete port uniqueness (port 5188) and protected background subagent browser sessions on other ports.
- **Windows 11 File Explorer Complete UI Transformation**:
  - Completely overhauled FolderMate Desktop UI to eliminate legacy web dashboard mental models and establish an authentic, production-grade **Windows 11 File Explorer** experience.
  - Set default application launch view to **File Explorer** at `D:\Clients`, immediately presenting directory contents, folders, and files upon startup.
  - Implemented **Windows 11 Multi-Tab Bar** with active tab state, tab switching, tab close buttons (`✕`), new tab creation (`+` / `Ctrl+T`), and native window action controls (`─`, `▢`, `✕`).
  - Added authentic two-tier Windows 11 command and navigation hierarchy:
    - **Tier 1 (Fluent Command Bar)**: `+ New ▾` dropdown (Folder, Project Folder, Client Directory), native Windows action icons (`✂ Cut`, `📋 Copy`, `📄 Paste`, `🏷 Rename`, `🗑 Delete`), `⇅ Sort ▾` dropdown, `⊞ View ▾` dropdown with 6 scaling modes and Details pane toggle, `⋯ More ▾` options, right-side Details toggle button, and minimal background daemon heartbeat.
    - **Tier 2 (Navigation & Address Bar)**: Standard navigation controls (`←`, `→`, `↑`, `↻`), segmented breadcrumbs (`This PC > Data Storage (D:) > Clients`) with `Ctrl+L` click-to-edit path text input with instant Enter navigation, and search box (`Ctrl+F`).
  - Transformed left navigation pane into the authentic **Windows 11 Navigation Tree**: `⭐ Home`, `Quick access` (Inbox, Clients, Archive, Review Queue with badge counter), `This PC` (Local Disk C: with FolderMate/Inbox, Data Storage D: with expandable Clients and Archive), and bottom minimal Settings anchor. Removed all SaaS marketing and VIP Patron cards from the navigation tree.
  - Redesigned `HomeView.tsx` into **Windows 11 Explorer Home**: Quick access pinned folder tiles (Inbox, Clients, Desktop, Downloads, Documents, Archive) with authentic folder icons and pin badges, and clean Recent Files details table. Removed SaaS metric KPI cards and live chat/event feed log widgets.
- **Button and Modal Interaction Fixes**:
  - Added click-outside listeners, mutual exclusivity, and `Escape` key handlers to `ExplorerHeader.tsx` dropdowns (`isViewMenuOpen` view layout & scaling menu and `isPauseMenuOpen` daemon status menu).
  - Added backdrop click and `Escape` key listeners to `ActivationModal.tsx` when closable.
  - Added explicit default `type="button"` to `Button.tsx`, `IconButton.tsx`, and `TopBar.tsx` buttons to prevent accidental HTML form submit triggers.
  - Updated `KeyboardShortcuts.tsx` hotkey recorder to properly handle `Escape` (cancel recording) and `Enter` (save shortcut), and populated default shortcut mappings for all 6 view scaling modes (`Ctrl+1` through `Ctrl+6`), `Ctrl+Wheel`, `Ctrl+A`, and `Ctrl+Shift+V`.
  - Added responsive `Escape` key, window resize, and scroll listeners to `Navbar.tsx` on the landing page to auto-close the mobile menu drawer.
  - Added window resize and window blur listeners to `ExplorerView.tsx` to dismiss floating right-click context menus when interacting outside.
  - Added user feedback toasts and default handlers in `InspectorPanel.tsx` for folder accent color swatches and version snapshot creations.

### Added
- **Complete Windows File-Manager UI Redesign**:
  - Re-architected FolderMate desktop UI to look, feel, and behave as a **modern, polished Windows-native File Explorer** utility with FolderMate background automation intelligence.
  - Replaced SaaS dashboard mental models with a dedicated file/folder browsing surface centered on files, directories, breadcrumb paths, and search.
  - Implemented 6 distinct File Explorer view modes: `Details` (sortable multi-column table), `List` (compact multi-column rows), `Small Icons` (24px icons), `Medium Icons` (44px icons), `Large Icons` (64px icons), and `Extra Large Icons` (96px previews).
  - Implemented smooth `Ctrl + Mouse Wheel` view zoom scaling that cycles through view modes without browser-level window zoom.
  - Added full multi-selection support with `Ctrl + Click`, `Shift + Click` range selection, and `Ctrl + A` select all.
  - Added inline file/folder renaming (`F2`) with auto-focus and extension preservation.
  - Implemented Windows 11 style context menus on right-click for folders (*Open*, *Open in Windows Explorer*, *Rename*, *Folder Appearance*, *Copy Path*, *Properties*) and files (*Open*, *Show in Windows Explorer*, *Create New Version*, *Rename*, *Copy Full Path*).
  - Implemented Windows OS System Theme Following with dynamic `@media (prefers-color-scheme)` detection and instant live switching between **Follow Windows**, **Light Theme** (clean Windows Explorer light palette), and **Dark Theme** (deep neutral dark with gold accents).
  - Added Bottom File Explorer Status Bar showing total item count, selected item count, formatted selection file size, and background SQLite WAL database status.
  - Added Appearance & Windows System Theme configuration card to `Settings.tsx` allowing one-click theme switching.
- **Landing Page Brand Logo & Favicon Integration**:
  - Populated `apps/landing/public/` with official FolderMate `logo.png`, `favicon.ico`, `favicon.svg`, and `favicon-dark.svg` assets.
  - Linked SVG/ICO favicons and Apple Touch Icons in `apps/landing/index.html`.
  - Replaced emoji placeholders in Navbar, Hero laptop simulator, and Footer with official FolderMate branded logo assets.
- **Landing Page Section Titles & Typography Overhaul**:
  - Replaced outdated `DM Serif Display` font across the entire web landing page with a modern, high-contrast typography system powered by `Plus Jakarta Sans`, `Inter`, and `JetBrains Mono`.
  - Updated headings hierarchy (`h1, h2, h3, h4, h5, h6`) with tight letter-spacing (`-0.035em` to `-0.04em`), bold weights (700/800/900), and crisp line-heights.
  - Modernized `.section-header` with centered layouts, clean subtext weights, and high-contrast pill badges.
  - Enhanced Hero headline, feature cards, review summaries, and blog & workflow guides with unified modern heading design tokens.
- **Streamlined Desktop License Activation & Web Key Generator Integration**:
  - Simplified Desktop UI `ActivationModal.tsx` by removing the embedded multi-step task completion wizard and checklist.
  - Direct key entry input with auto-focus, paste button, instant offline cryptographic validation feedback (Community, Sponsor, VIP, Universal Lifetime Hero), and optional user/studio credit field.
  - Added direct action cards for users needing a key: one-click button to open the Web Landing Page task generator (`http://localhost:5200/#get-key`) and Sponsor portal.
  - Upgraded community key generator in `apps/landing/src/components/CtaBanner.tsx` to produce cryptographic segment checksums (`FM-COMMUNITY-XXXX-XXXX-XXXX`), guaranteeing instantaneous validation in the desktop app.
- **Windows-Native File Explorer Architecture & UI Transformation**:
  - Re-architected FolderMate desktop UI from card-heavy dashboard views into a **Windows File Explorer-inspired desktop utility** with FolderMate background intelligence.
  - Implemented `ExplorerHeader.tsx` featuring back/forward/up/refresh navigation history, interactive breadcrumb address bar with `Ctrl+L` direct filesystem path mode, instant search filter (`Ctrl+F`), Details/List/Icons view mode switchers (`Ctrl+1`, `Ctrl+2`, `Ctrl+3`), inspector toggle, and live engine status dropdown with pause controls.
  - Implemented `InspectorPanel.tsx` collapsible right-side inspector displaying rich file metadata, application extension badges (CDR, AI, PSD, PDF, XLSX, PNG, SVG), DAG version history tree, SHA-256 integrity hash, client/project lineage, and action buttons (`Open`, `Show in Explorer`, `Create Version`).
  - Implemented `ExplorerView.tsx` supporting sortable Details multi-column table (Name, Type, Client, Project, Year, Modified Date, Size, Version), Compact List, and Large Icons grid with folder color accents and format recognition.
  - Implemented practical `HomeView.tsx` starting point with Quick Access cards (`Inbox`, `Organized Clients`, `Review Queue`, `Archive`), Recent Files details table, Needs Review alert banner, and live background daemon event stream.
  - Added dedicated **Background & Automation** settings page (`BackgroundAutomation.tsx`) with real-time daemon telemetry (CPU usage %, memory footprint MB, SQLite WAL status, queue depth, watcher status), pause controls (1 hour, until tomorrow, indefinitely, resume), file monitoring & debounce delay controls, and background resource usage modes (**Battery Saver**, **Balanced**, **Performance**).
  - Added dedicated **Keyboard Shortcuts** page (`KeyboardShortcuts.tsx`) with full shortcut reference (`Ctrl+K`, `Ctrl+F`, `Ctrl+L`, `Ctrl+1/2/3`, `Alt+Left/Right`, `Backspace`, `F2`, `Enter`, `F5`), category filtering, and custom shortcut remapping with interactive conflict detection.
  - Redesigned `ReviewQueue.tsx` into a clean Explorer details table with confidence score badges and a right-side classification & destination heuristic inspector.
  - Updated `Sidebar.tsx` navigation tree to mirror Windows Explorer navigation pane structure (Explorer, Automation & Safety, System sections).
  - Expanded `mock-bridge.ts` RPC methods for `system.getBackgroundMetrics`, `system.pauseAutomation`, `system.resumeAutomation`, `system.setResourceMode`, and `explorer.browse`.
  - New `StatCard` component on Dashboard with per-type gradient accent bars (green/amber/blue/gold), animated number counters using `requestAnimationFrame` cubic-bezier easing, and colored icon bubbles.
  - File extension type badges in the Recently Organized list (CDR=amber, PDF=red, AI=orange, PSD=blue, PNG/JPG=cyan, SVG=purple) with `TrendingUp` micro-indicator for growth.
  - Ingestion Sandbox redesigned as a dashed-border glassmorphic panel with Zap icon, radial glow, and quick-test pill buttons.
  - Staggered `animationDelay` entry animations on Dashboard cards, sandbox panel, and file rows.
  - Sidebar active item now renders a vertical gradient accent bar (brand gold → amber) on the left edge with `cubic-bezier` hover transitions and bold active font weight.
  - TopBar redesigned with a layered glass-morphic gradient background (`blur(20px) saturate(180%)`), wider search bar (340px) with its own backdrop blur.
  - Added global CSS animation classes: `animate-fade-in`, `card-hover-lift`, `interactive-row`, `stagger-children`.
- **Step-by-Step Onboarding & Activation Wizard**:
  - Implemented multi-step modal (`ActivationModal.tsx`) with product value tour, unlock choice selection, and celebratory activation transition.
  - Added **Free Community Key Generator**: pick any 3 tasks from GitHub Star, Blog comments, GitHub follow, LinkedIn engagement, and X/Twitter reposts with live progress tracking.
  - Added **Sponsor & Superchat VIP Portal**: direct support links (GitHub Sponsors & BuyMeACoffee) with universal lifetime key support and VIP badge perks.
  - Added offline cryptographic checksum license validator (`license-validator.ts`) and unit test suite (`license-validator.test.ts`).
  - Integrated license state into `Sidebar`, `TopBar`, `Settings`, and browser mock bridge.
- Established the baseline memory and project instruction system for the repository.
- Added a mandatory GitHub CLI branch/PR workflow rule to the operating guidance.
- **Landing Page Responsive Laptop & Footer Overhaul**:
  - Fixed small-screen / mobile laptop screen scaling in `Hero.tsx` to maintain widescreen aspect ratio without vertical stretching or tall gaps.
  - Implemented 3-task scrollable container in `CtaBanner.tsx` with smooth amber scrollbar and scroll hint badge (`Showing 3 of 5 · Scroll for more ↓`), balancing card heights.
  - Enlarged `SplitFeature.tsx` mockup cards (`OrganizeMock` and `ReviewQueueMock`) with rich metadata, status pills, suggestions, and `Assign & Move →` action buttons.
  - Redesigned `Footer.tsx` in cohesive dark neo-brutalist styling with top CTA callout banner, 4-column directory, and bottom system status pills.
  - Refactored `FaqSection.tsx` into independent vertical column stacks with `align-items: start`, preventing unopened FAQ cards from stretching vertically when an adjacent card is opened.
  - Added subtle dotted matrix grid pattern across the page background with floating neo-brutalist stickers (Inbox Watcher, Atomic Move, SHA-256 Verified, Supported Formats), rotating sparkle stars, and ambient aura glows.
  - Enhanced `Navbar.tsx` with `v1.0 · Free` brand status badge, pill-hover navigation links, `⭐ Star 1.4k` GitHub badge counter button, and made all hero floating stickers fully interactive with hover elevation, tooltips, and smooth scroll anchors.
- **UI Consistency & Component Polish Overhaul**:
  - Restored full comprehensive CSS token definitions and utility rules across `apps/desktop/src/renderer/index.css` (fixing CSS property warnings and ensuring flawless scrollbars, buttons, tables, badges, and modals).
  - Cleaned up corrupted UTF-8 unicode strings in `Dashboard.tsx`, standardizing arrow indicators and symbol glyphs.
  - Made activity log event type matching case-insensitive in `HomeView.tsx` (`ORGANIZED`, `VERSION`, `REVIEW`).
  - Polished Client Directories view (`Clients.tsx`) with consistent Explorer table styles and modal subfolder creation.
  - Verified full test suite (13 test files, 39 tests passing) and performed browser subagent end-to-end visual verification across all views.
- Added the branded FolderMate app icon, favicon set, and desktop theme refresh.

## [1.0.0] - 2026-09-12

### Added
- **Storage & Relational Database Layer**:
  - Implemented universal SQLite driver supporting synchronous WAL mode, foreign key constraints, busy timeout handling, and nested savepoints.
  - Added repository modules: `ClientsRepository`, `ProjectsRepository`, `FilesRepository`, `VersionsRepository`, `ReviewQueueRepository`, `EventsRepository`, `RulesRepository`, and `SearchRepository`.
  - Added SQLite FTS5 full-text search virtual index with automatic trigger synchronization.

- **Classification & Naming Engine**:
  - Implemented multi-tier classification pipeline (`ClassificationPipeline`) with fuzzy dictionary matching, temporal extraction, version number parsing, and composite confidence scoring.
  - Implemented token template renderer (`TemplateEngine`) and cross-platform path sanitizer (`Sanitizer`) preventing directory traversal attacks.

- **Two-Phase Transactional Safe Mover & Versioning**:
  - Implemented `TwoPhaseMover` with staging copy -> SHA-256 integrity verification -> atomic destination rename -> Safe Mode archival.
  - Implemented `VersionEngine` with deterministic version DAG lineage tracking, collision auto-incrementing, and rollback/restoration.
  - Implemented `ReviewManager` with manual override resolution and adaptive alias learning.

- **CorelDRAW Integration Bridge**:
  - Implemented out-of-process C# .NET COM bridge (`FolderMate.CorelBridge`) with Win32 P/Invoke (`GetActiveObject`, `CLSIDFromProgID`) supporting CorelDRAW 2020 through 2024.
  - Added offline `.cdr` Zip archive metadata and thumbnail extraction fallback (`ZipInspector`).
  - Added TypeScript `CorelDrawAdapter` with process spawning, heartbeat checks, and RPC execution.

- **Inter-Process Communication (IPC) & Daemon Subsystem**:
  - Implemented secure Win32 Named Pipe (`\\.\pipe\foldermate-ipc`) JSON-RPC 2.0 server.
  - Added 256-bit cryptographic auth token handshake stored in `%APPDATA%/FolderMate/.auth_token`.
  - Added Server-Sent Event (SSE) broadcasting for real-time file event notifications.

- **Electron Desktop Application & React 18 UI**:
  - Built Electron main process with system tray integration and background minimization.
  - Built React 18 frontend with dark aesthetic theme, live stats widget, and complete view catalog:
    - **Dashboard**: Live activity feed, pipeline status, quick scan triggers.
    - **Search**: Instant FTS5 full-text search with filtering and explorer launch.
    - **Review Queue**: Ambiguous file triage with client reassignment and alias learning.
    - **Clients & Projects**: Management of clients, codes, aliases, and project hierarchies.
    - **Rules & Templates**: Custom naming and folder routing rules.
    - **Settings**: Ingestion paths, automation thresholds, and CorelDRAW COM options.

- **Verification & Testing Suite**:
  - Comprehensive unit and integration test suite covering 32 test cases across 11 test suites with 100% pass rate.
  - End-to-end integration test (`tests/e2e-pipeline.test.ts`) validating complete lifecycle from Inbox ingestion to FTS5 search indexing.

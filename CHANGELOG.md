# Changelog

All notable changes to the **FolderMate** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- **Premium UI Visual Overhaul** (PR #13):
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

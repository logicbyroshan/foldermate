# FolderMate Current State

## Current implementation state
The repository is a Windows-oriented file organization platform with a working monorepo structure.

Major implementation areas are present:
- file ingestion and organization pipeline in the engine
- SQLite persistence and FTS5 indexing
- rules/classification/versioning/review subsystems
- IPC-based communication between engine and desktop UI
- Electron desktop shell and React renderer
- Standalone neo-brutalist landing page (`apps/landing`) at `http://localhost:5200`
- Windows folder customization and CorelDRAW adapter integration

## Completed major functionality
- Engine bootstrap and runtime orchestration exist.
- Repository and database abstractions are in place.
- Classification pipeline, versioning, and review queue logic exist.
- IPC auth handshake and RPC dispatch are implemented.
- Desktop shell and renderer infrastructure are present.
- Multi-step Onboarding, Free Community Tasks Key Generator, and Supporter VIP Activation system implemented.
- Production-grade Standalone Landing Page at `apps/landing` featuring full-width realistic laptop screen showcase, single-line hero headline, mobile nav drawer, 6 customer reviews, 3 workflow guide blogs, and interactive 3-task activation key generator.
- Documentation and ADRs are included in the repo.

## Work in progress / active risks
- Platform-specific Windows behavior still requires real Windows validation.
- CorelDRAW integration is not fully verifiable in a non-CorelDRAW environment.
- Runtime startup and environment assumptions may differ across user machines.

## Current priorities
- Preserve architecture and repo conventions.
- Keep the memory system synchronized with actual implementation.
- Use minimal, targeted changes for future work.
- Maintain a polished, branded desktop shell and web landing page consistent with the FolderMate identity.

## Recent important changes
- Initial bootstrap documentation and persistent project memory system were created.
- Added the branded desktop shell assets, theme palette, and app icon/favicons for the production-ready app identity.
- Built the interactive Onboarding Wizard with Free Community Tasks (Star repo, comment on blog, follow LinkedIn/X), offline cryptographic key validation, and Supporter/Sponsor lifetime VIP key portals.
- **PR #13**: Comprehensive UI visual overhaul — animated StatCards with gradient accent bars and counter animations, file extension type badges (CDR/PDF/AI/PSD/PNG etc), refactored Ingestion Sandbox, vertical gold accent bar on active sidebar items, glassmorphic TopBar with `saturate(180%)` blur.
- **PR #15 & #16**: Standalone neo-brutalist Landing Page (`apps/landing`) featuring single-line hero headline, mobile drawer navigation, live odometer file counter, customer reviews grid, workflow guides blog section, and interactive 3-task activation key generator.
- **PR #18 & #19**: Full-width realistic laptop screen showcase mockup in Hero section (with real FolderMate sidebar, stat cards, watcher banner, and file ingestion table), section spacing overhaul, and removal of odometer card.
- **PR #20**: Responsive laptop screen scaling (preventing vertical elongation on small screens), 3-task scrollable list in Key Generator with custom scrollbar and scroll hint, enlarged split feature mockup cards with rich metadata and action buttons, and cohesive neo-brutalist dark footer.
- **PR #24**: FAQ accordion layout refactored into two independent vertical columns (`.faq-column`) with `align-items: start`, eliminating row-height stretching and preventing unopened cards from expanding into tall empty boxes when adjacent cards open.
- **PR #25**: Enriched landing page background with a subtle neo-brutalist dotted grid matrix, floating animated feature badges (Inbox Watcher with pulse, 2-Phase Atomic Move, SHA-256 Verified, Supported Formats), rotating sparkle stars (✦, ★), and soft warm ambient aura glows.
- **PR #26**: Enhanced Navbar with `v1.0 · Free` status badge, pill-hover navigation links, `⭐ Star 1.4k` GitHub counter button, and made all floating background stickers fully interactive with hover physics, tooltips, and smooth-scroll anchors.
- **PR #27 (Current)**: **Windows-Native File Explorer Architecture & UI Transformation**:
  - Replaced card-based dashboards with Windows File Explorer paradigm + FolderMate background automation intelligence.
  - Added `ExplorerHeader` with breadcrumbs, address bar, history navigation (`Alt+Left/Right`), view switcher (`Ctrl+1/2/3`), and search filter (`Ctrl+F`).
  - Added `InspectorPanel` details pane displaying format badges, version DAG tree, SHA-256 hash, client metadata, and file actions.
  - Added `ExplorerView` with sortable Details table, Compact list, and Icons grid views.
  - Added `BackgroundAutomation` with live daemon metrics (CPU, Memory, SQLite WAL, Queue depth), pause controls (1h/tomorrow/indefinite), and resource profiles (Battery Saver, Balanced, Performance).
  - Added `KeyboardShortcuts` with custom key remapping and real-time conflict detection.
  - Refactored `ReviewQueue` into Explorer table with right-side classification heuristics inspector.

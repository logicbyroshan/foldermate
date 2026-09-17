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
- Production-grade Standalone Landing Page at `apps/landing` modeled after trypixie.io neo-brutalist aesthetic with single-line hero headline, mobile nav drawer, 6 customer reviews, 3 workflow guide blogs, and interactive 3-task activation key generator.
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

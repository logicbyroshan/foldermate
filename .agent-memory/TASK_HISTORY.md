# FolderMate Task History

## 2026-09-14
Task: Bootstrap persistent project memory and agent instructions.
Reason: The repository required a clean, durable operating model for future work without modifying application code during the initial understanding phase.
Files/areas affected:
- `AGENTS.md`
- `.agent-memory/PROJECT.md`
- `.agent-memory/ARCHITECTURE.md`
- `.agent-memory/CONVENTIONS.md`
- `.agent-memory/DECISIONS.md`
- `.agent-memory/CURRENT_STATE.md`
- `.agent-memory/KNOWN_ISSUES.md`
- `.agent-memory/SECURITY.md`
- `.agent-memory/TASK_HISTORY.md`
What changed:
- Created the repo’s durable memory system and instruction baseline.
- Documented project architecture, conventions, current state, and issues.
- Added the repository’s required GitHub CLI branch and PR workflow rule.
Important decisions:
- The repository should remain architecture-first and Windows-native.
- Bootstrap tasks should avoid touching the application implementation and keep changes limited to the memory system.
- All meaningful work must happen on feature/fix branches and merge through `gh pr merge`.
Testing performed:
- Repository read-through and inspection only; no app files were modified.
Follow-up:
- Future tasks should read these memory files first and then inspect only relevant implementation files.

### Brand Refresh for the Desktop App
Task: Apply the provided FolderMate logo and brand palette across the Electron shell and renderer theme.
Reason: The product was missing a production-ready brand identity in the desktop shell and app metadata.
Files/areas affected:
- `apps/desktop/index.html`
- `apps/desktop/src/main/index.ts`
- `apps/desktop/src/main/tray.ts`
- `apps/desktop/src/renderer/index.css`
- `apps/desktop/src/renderer/components/Sidebar.tsx`
- `apps/desktop/public/favicon.svg`
- `apps/desktop/public/favicon-dark.svg`
- `apps/desktop/public/favicon.ico`
- `apps/desktop/public/logo.png`
- `apps/desktop/package.json`
What changed:
- Moved the supplied logo into the app asset pipeline and generated the icon/favicon variants.
- Wired the app window and tray to use the branded icon and a gold/amber identity.
- Updated the dark UI palette and shell branding to match the FolderMate visual language.
Testing performed:
- Checked asset generation and ran the desktop build: `npm run build --workspace=apps/desktop`.
Important decisions:
- The app identity should be visually consistent across window chrome, tray, browser favicon, and packaged installer icon.
- Production asset generation should be kept in tracked app resources rather than left as temporary local files.

## 2026-09-17
### Onboarding & Free Community Activation Key System
Task: Implement a step-by-step onboarding wizard, free 3-task community key generator (GitHub, Blog comments, LinkedIn, X/Twitter), and Sponsor/Superchat VIP universal key support.
Reason: The application is open-source and offline-first; users needed an engaging onboarding experience and an activation mechanism that promotes community engagement and provides direct sponsor perks.
Files/areas affected:
- `packages/shared/src/types.ts`
- `apps/desktop/src/renderer/utils/license-validator.ts`
- `apps/desktop/src/renderer/components/ActivationModal.tsx`
- `apps/desktop/src/renderer/App.tsx`
- `apps/desktop/src/renderer/components/Sidebar.tsx`
- `apps/desktop/src/renderer/components/TopBar.tsx`
- `apps/desktop/src/renderer/views/Settings.tsx`
- `apps/desktop/src/renderer/mock-bridge.ts`
- `apps/desktop/vite.config.ts`
- `package.json`
- `tests/license-validator.test.ts`
What changed:
- Created offline cryptographic license validator and key generator supporting Community, Sponsor, and Lifetime VIP keys.
- Built a multi-step modal (`ActivationModal.tsx`) with product value tour, choice selection, interactive task checklist with live progress tracking, key generation, and validation.
- Integrated license state into `Sidebar`, `TopBar`, and `Settings`.
- Updated browser mock RPC bridge to support persistent license operations in standalone web dev mode.
- Added unit tests in `tests/license-validator.test.ts` (all 39 tests passing).
Testing performed:
- Vitest automated test suite: `npm test` (13 test files, 39 tests passed).
- Vite renderer build: `npm run build:renderer --workspace=apps/desktop`.
- End-to-end browser subagent verification on `http://localhost:5188` verifying full activation flow, task completion, key generation, dashboard unlock, and settings integration.
Important decisions:
- The key validation algorithm is 100% offline-first using HMAC checksums to ensure zero cloud dependency or telemetry.
- Community keys are single-use per device, while Sponsor keys provide reusable lifetime VIP perks.

## 2026-09-17 — PR #13: Premium UI Visual Overhaul
Task: Comprehensively overhaul the desktop renderer UI for a premium, polished, production-quality appearance.
Reason: The initial UI was functional but visually flat. The goal was to bring a branded, premium feel with micro-animations, staggered transitions, and a rich design system.
Files/areas affected:
- `apps/desktop/src/renderer/index.css`
- `apps/desktop/src/renderer/views/Dashboard.tsx`
- `apps/desktop/src/renderer/components/Sidebar.tsx`
- `apps/desktop/src/renderer/components/TopBar.tsx`
What changed:
- **CSS Design System**: Added `animate-fade-in`, `card-hover-lift`, `interactive-row`, `stagger-children` animation classes. Improved glassmorphism tokens and color variables.
- **Dashboard**: Added `StatCard` component with per-card gradient accent bar (top edge), animated number counter using `requestAnimationFrame` easing, colored icon bubbles, and `TrendingUp` micro-indicator. Added file extension type badges (CDR=amber, PDF=red, AI=orange, PSD=blue, PNG/JPG=cyan, SVG=purple) with micro-label overlays. Refactored Ingestion Sandbox as a custom dashed-border glassmorphic panel. Staggered `animationDelay` on all list rows.
- **Sidebar**: Active nav item now shows a vertical gradient accent bar on the left edge (brand primary → secondary). Hover transitions use `cubic-bezier` easing and include color changes.
- **TopBar**: Replaced flat background with a glass-morphic gradient using `blur(20px) saturate(180%)`. Search bar is wider and uses `border-radius: var(--radius-md)` with its own backdrop blur.
Testing performed:
- `npm run build:renderer --workspace=apps/desktop` passes.
- Browser subagent end-to-end verification: activation flow, dashboard stat cards, file list, ingestion sandbox, sidebar navigation.
Important decisions:
- PowerShell `Set-Content` without explicit `-Encoding UTF8` corrupts Unicode bullet characters; always use `-Encoding UTF8 -NoNewline` or avoid Set-Content for source files.
- The `StatCard` component with `useAnimatedCount` hook (no external lib) was chosen over a library approach to keep the bundle lean.

## 2026-09-17 — PR #15 & #16: Standalone Neo-Brutalist Landing Page
Task: Build and polish a standalone, self-contained landing page for FolderMate at `apps/landing` inspired by trypixie.io neo-brutalist aesthetic with deep mobile responsiveness, reviews, blogs, and interactive key generator.
Reason: Users needed a public web showcase and download portal completely separate from the desktop app and backend daemon.
Files/areas affected:
- `apps/landing/` (all files: `App.tsx`, `index.css`, `main.tsx`, `vite.config.ts`, `package.json`, `index.html`)
- `apps/landing/src/components/Navbar.tsx`
- `apps/landing/src/components/Hero.tsx`
- `apps/landing/src/components/OdometerCounter.tsx`
- `apps/landing/src/components/TrustedBy.tsx`
- `apps/landing/src/components/FeatureGrid.tsx`
- `apps/landing/src/components/SplitFeature.tsx`
- `apps/landing/src/components/BenefitsSection.tsx`
- `apps/landing/src/components/ReviewsSection.tsx`
- `apps/landing/src/components/BlogSection.tsx`
- `apps/landing/src/components/CtaBanner.tsx`
- `apps/landing/src/components/FaqSection.tsx`
- `apps/landing/src/components/Footer.tsx`
- `package.json`
What changed:
- Built complete standalone React + Vite + Vanilla CSS app running at `http://localhost:5200`.
- Applied trypixie.io neo-brutalist design system: warm cream `#EDEAE0`, vanilla `#EDE7D1`, amber `#E89B00`, solid 2px black borders, drop shadows (`4px 4px 0 #1a1a1a`), serif display headlines (`DM Serif Display`), pill badges.
- Guaranteed single-line hero highlight (`organized — automatically.`) with `white-space: nowrap` and responsive clamp sizing.
- Added responsive mobile navigation drawer with hamburger toggle button (`☰` / `✕`).
- Added Reviews/Testimonials section with 6 verified reviews, star ratings, and community score summary card.
- Added Workflow Guides & Blog section with 3 article cards.
- Added interactive 3-task activation key generator with progress bar and copy-to-clipboard functionality.
Testing performed:
- `npm run build --workspace=apps/landing` succeeded with 0 errors.
- End-to-end browser subagent verification on Desktop (1440x900) and Mobile (390x844).
Important decisions:
- The landing page is kept in `apps/landing` as an independent workspace, with zero runtime dependencies on the engine or database packages.

## 2026-09-17 — Responsive Laptop Scaling, 3-Task Scroll Container, Enlarged Split Mockups & Cohesive Footer
Task: Fix mobile/small-screen laptop elongation, limit key generator visible tasks to 3 with scrollability, enlarge split feature mockup cards, and redesign the footer.
Reason: User feedback highlighted that on smaller screens the laptop mockup became vertically stretched, the key generator tasks made the download card disproportionately tall, the split feature mockups lacked prominence, and the footer needed visual polish.
Files/areas affected:
- `apps/landing/src/components/Hero.tsx`
- `apps/landing/src/components/SplitFeature.tsx`
- `apps/landing/src/components/CtaBanner.tsx`
- `apps/landing/src/components/Footer.tsx`
- `apps/landing/src/index.css`
What changed:
- **Responsive Laptop Mockup**: Added `.desktop-col` rules and mobile responsive CSS so stats render as a compact 2x2 grid and table columns collapse cleanly, keeping the laptop proportional and widescreen on all screen sizes.
- **3-Task Scroll Container**: Wrapped community tasks in `.tasks-scroll-container` (`max-height: 220px`) with custom amber scrollbar and scroll hint badge (`Showing 3 of 5 · Scroll for more ↓`), balancing the Key Generator card height with the left Installer card.
- **Enlarged Split Mockups**: Expanded `OrganizeMock` (5 file items with destination paths, versions, file sizes) and `ReviewQueueMock` (3 detailed review items with confidence badges, suggestions, and `Assign & Move →` buttons) with 2px borders, hover animations, and complete metadata.
- **Cohesive Footer**: Redesigned footer in dark neo-brutalist palette (`#141416`) with top CTA callout banner (`#1f1f23`), 4-column structured directory with gold category headers, and bottom bar with system pills (`Windows 10/11 x64`, `SQLite WAL Mode`, `Zero Telemetry`).
Testing performed:
- `npm run build --workspace=apps/landing` succeeded with 0 errors.
- Automated browser subagent verification across Desktop (1440x900) and Mobile (390x844) viewports.
## 2026-09-17 — FAQ Accordion Independent Column Layout & Stretch Prevention
Task: Refactor FAQ accordion into two independent column containers with `align-items: start` and Set-based expansion.
Reason: When one FAQ card in a 2-column CSS Grid row expanded, the adjacent unopened card in the same row was stretched to the full height of the row, leaving a huge empty white box.
Files/areas affected:
- `apps/landing/src/components/FaqSection.tsx`
- `apps/landing/src/index.css`
What changed:
- Split FAQ items into two independent vertical `.faq-column` stacks (even index items on left, odd index items on right).
- Set `.faq-grid { align-items: start; }` and `.faq-card { height: fit-content; }`.
- Converted open state to `openItems: Set<number>` to allow independent opening/closing of cards without affecting any neighbor's height.
Testing performed:
- `npm run build --workspace=apps/landing` passed.
- Browser subagent end-to-end verification (`faq_column_expansion_verify`): verified single card open (left snug, right expanded), both columns open (both snug to content), and multi-item expansion.
## 2026-09-17 — Landing Page Background Grid, Floating Badges & Animations
Task: Add rich background texture, animated floating feature badges, and decorative elements to the landing page.
Reason: User requested adding background elements and animations as the background felt flat and empty.
Files/areas affected:
- `apps/landing/src/components/Hero.tsx`
- `apps/landing/src/index.css`
What changed:
- Added a subtle dotted matrix grid pattern (`radial-gradient(rgba(26,26,26,0.08) 1.25px, transparent 1.25px)`) across the body background.
- Added floating neo-brutalist stickers and pills in the Hero background:
  - 📁 **Inbox Watcher** (`Auto Ingestion`) with green pulsing live dot
  - ⚡ **Atomic Move** (`2-Phase Safety`)
  - 🔒 **SHA-256 Verified** pill
  - 🎯 **.CDR · .AI · .PSD · .PDF** pill
- Added animated 4-point sparkle stars (`✦`, `★`, `✧`) with smooth rotation and pulse keyframe animations.
- Added soft ambient radial warm amber glow auras behind the hero showcase.
- Added responsive media queries scaling down / hiding floating badges on smaller screens to keep mobile views pristine.
Testing performed:
- `npm run build --workspace=apps/landing` passed.
- Browser subagent visual verification (`hero_bg_decorations_1789647404781.png`) at 1920x953 viewport.
## 2026-09-17 — Navbar Enhancement & Interactive Background Stickers
Task: Upgrade the Navbar to top-tier quality and make all hero background floating stickers fully interactive.
Reason: User requested making the navbar the best and ensuring background floating stickers are interactive with hover physics and click navigation.
Files/areas affected:
- `apps/landing/src/components/Navbar.tsx`
- `apps/landing/src/components/Hero.tsx`
- `apps/landing/src/index.css`
What changed:
- **Navbar Upgrade**:
  - Added `v1.0 · Free` brand status pill next to the FolderMate logo with subtle icon hover tilt.
  - Upgraded navigation links with pill hover background highlights (`.nav-link-item`).
  - Added dedicated `⭐ Star 1.4k` GitHub badge button with star counter pill and drop shadow.
  - Added translucent blur effect on scroll (`backdrop-filter: blur(14px)`).
- **Interactive Floating Stickers**:
  - Converted floating stickers into interactive anchor links with hover elevation (`transform: translateY(-4px) scale(1.05)` and `box-shadow: 5px 5px 0 #1a1a1a`), active click feedback, and tooltips.
  - Linked each sticker to its respective feature section (`#how-it-works`, `#features`).
Testing performed:
- `npm run build --workspace=apps/landing` passed.
- Browser subagent verification (`navbar_and_stickers_desktop_1789648837982.png`).
Important decisions:
- Pausing the CSS float animation on hover (`animation-play-state: paused`) provides smooth, predictable interaction for users clicking the floating stickers.


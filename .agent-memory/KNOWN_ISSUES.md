# FolderMate Known Issues

## Baseline repository issues (recorded at bootstrap)
- The project is Windows-specific and therefore some runtime validation is environment-dependent.
- Real CorelDRAW integration behavior requires a Windows machine with the actual application installed.
- Some startup or runtime issues may only appear in specific local environment setups, not in static code inspection alone.
- Repo-level documentation describes a strong architecture, but the actual runtime environment and host configuration must still be checked when operating on a given machine.

## Issue format
Each issue should record:
- short description
- impact
- affected components
- status (`open` / `resolved`)

## Open issues
### 1. Windows-only validation requirement
- Impact: Native file-system and integration behavior cannot be fully validated in a non-Windows environment.
- Affected components: engine, folder customization, CorelDRAW bridge, Windows path logic
- Status: open

### 2. Environment-specific runtime configuration
- Impact: Local machine paths, app data directories, and IPC environment assumptions may need machine-specific adjustment.
- Affected components: config loader, engine bootstrap, named-pipe runtime
- Status: open

## Resolved items
### 3. Root lint command failed due to missing eslint
- Impact: `npm run lint` threw `'eslint' is not recognized`.
- Affected components: root `package.json`, root toolchain
- Status: resolved (standardized to `tsc --noEmit` across project)

### 4. Engine type and constructor signature discrepancies
- Impact: TypeScript typechecking reported errors in `VersionEngine` instantiation, `CorelDrawAdapter.dispose()`, and `reviewQueue.create`.
- Affected components: engine bootstrap, file pipeline, review manager
- Status: resolved

### 5. Abandoned component and unused imports
- Impact: Unreferenced `OdometerCounter.tsx` component in `apps/landing` and 40+ unused imports across desktop and engine.
- Affected components: `apps/landing`, `apps/desktop`, `apps/engine`
- Status: resolved


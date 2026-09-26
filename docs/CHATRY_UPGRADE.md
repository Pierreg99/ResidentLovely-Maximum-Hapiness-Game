# CHATRY Upgrade Branch

Branch: `chatry`
Base: `main@95b531c8f48cc2572ac13ec4615bedae19206a42`

## Scope

- Preserve the existing Three.js ESM game architecture.
- Improve GitHub Pages deployment reliability.
- Add client-side runtime diagnostics without exposing secrets.
- Improve accessibility and keyboard/touch discoverability.
- Keep heavy visual systems graceful on constrained devices.
- Keep all changes isolated to `chatry`.

## Acceptance contract

1. `main` is not modified by this branch.
2. GitHub Pages workflow can deploy from `chatry` when manually selected, while existing `main` deployment behavior remains unchanged.
3. The root game exposes a small diagnostic surface through `window.__residentLovelyDiagnostics()`.
4. Diagnostics report WebGL support, DPR, viewport, reduced-motion preference, service-worker status, and current version metadata.
5. Diagnostics do not contain credentials, storage contents, or user-identifying data.
6. Documentation accurately describes the branch and its changes.

## Non-goals

- No framework migration.
- No destructive rewrite of the 3D engine.
- No forced CDN dependency.
- No merge to `main`.

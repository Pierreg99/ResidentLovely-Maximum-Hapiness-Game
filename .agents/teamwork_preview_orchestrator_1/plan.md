# Plan: Resident Lovely Graphics Upgrade & World Map Expansion

## Goal
Implement a complete graphics upgrade and map expansion from 18 to 32 sectors for Resident Lovely: Maximum Happiness in full compliance with the reference spec `/data/data/com.termux/files/home/projects/cryo-omega/docs/superpowers/specs/2026-08-28--resident-lovely-graphic-map-expansion.md`.

## Execution Tracks
1. **Survey Track (Phase 0)**:
   - Explorer 1 (Spec Miner): Deep-read the spec at `/data/data/com.termux/files/home/projects/cryo-omega/docs/superpowers/specs/2026-08-28--resident-lovely-graphic-map-expansion.md` and extract exact schemas, sector list (S01-S32), shader specifications, backdrop requirements, map layout, prop requirements.
   - Explorer 2 (Codebase Investigator): Investigate existing game structure in `/data/data/com.termux/files/home/projects/resident-lovely-game` (`src/world/rooms.js`, `src/world/scene.js`, `src/main.js`, `index.html`, etc.), test setup, existing shader setup, package.json / dependencies.
   - Explorer 3 (Test & Infrastructure Analyzer): Investigate existing tests (`tests/test_e2e_shaders_fx.py`, test runners, Three.js headless/mocking setup, verification harnesses) to establish testing requirements.

2. **Milestones Decomposed**:
   - M1: Modular Sector Registry (`src/world/sectors.js`) & complete migration of rooms.js, scene.js, main.js.
   - M2: Illustrated 2.5D Backdrop System (`src/world/backdrops.js`, `assets/backdrops/*.svg`, gradient fallback).
   - M3: Per-Sector GLSL Surface Shaders (`src/world/shaders/surface-shaders.js` with 8 GLSL materials, sector-flag enforcement, standard material fallback).
   - M4: Holographic Blueprint Map v2 (SVG generation, 7 tabs, animated paths, info panel, <=200 DOM nodes).
   - M5: New Chamber Geometry (S19-S32 3D mesh geometry, walls, ceiling, 2+ decorative props, collision & room transitions).
   - M6 / E2E Track: Comprehensive E2E Testing Suite (Tiers 1-4) + Adversarial Hardening (Tier 5) + Forensic Audit.

3. **Gating & Standards**:
   - Zero emojis anywhere.
   - Strict Native ESM.
   - 100% tests passing including `tests/test_e2e_shaders_fx.py`.
   - Forensic integrity audit with CLEAN verdict.

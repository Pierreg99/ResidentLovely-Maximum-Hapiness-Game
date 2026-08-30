# BRIEFING — 2026-08-28T02:00:21Z

## Mission
Discover, probe, extract, and document the complete specification for the Resident Lovely Game Graphics & Map Expansion (18 -> 32 sectors), covering modular sector registry, 2.5D backdrops, GLSL surface shaders, Blueprint Map v2, and chamber geometry for S19-S32.

## [LOCK] My Identity
- Archetype: Explorer / Spec Miner
- Roles: Specification Mining, Interface Extraction, Edge Case Discovery, Schema Definition
- Working directory: /data/data/com.termux/files/home/projects/resident-lovely-game/.agents/teamwork_preview_spec_miner_survey_1
- Original parent: eecc4e3c-80d2-4a35-9fef-73c8d489bd5c
- Milestone: M1 — Specification Survey & Feature Extraction

## [LOCK] Key Constraints
- Zero Emojis across all code, assets, docs, and markdown files (NEXUS PRIVE v6.0 rule).
- Read-only role: do NOT implement game code, only survey and specify.
- 5-component handoff report (Observation, Logic Chain, Caveats, Conclusion, Verification Method).
- Cover all 32 sectors (S01-S32), 8 GLSL materials, 2.5D backdrop system, 7-tab blueprint map, and S19-S32 3D chamber geometry.

## Current Parent
- Conversation ID: eecc4e3c-80d2-4a35-9fef-73c8d489bd5c
- Updated: 2026-08-28T02:00:21Z

## Task Summary
- **What to build**: Specification survey (`survey_spec.md` and `handoff.md`) covering all 5 core requirements (R1-R5).
- **Success criteria**: Full sector registry schema for 32 sectors, backdrop specs, shader specs, map specs, and chamber geometry specs with comprehensive feature tables and edge cases.
- **Interface contracts**: `src/world/sectors.js`, `src/world/backdrops.js`, `src/world/shaders/surface-shaders.js`, `src/systems/minimap.js`, `src/world/rooms.js`, `src/world/scene.js`, `src/main.js`.
- **Code layout**: Native ESM in `src/`, tests in `tests/`.

## Key Decisions Made
- Thoroughly inspect all existing codebase files (`rooms.js`, `scene.js`, `main.js`, `minimap.js`, `test_e2e_shaders_fx.py`) to map existing S01-S18 data, then synthesize the full S01-S32 dataset matching the reference spec.

## Artifact Index
- `.agents/teamwork_preview_spec_miner_survey_1/survey_spec.md` — Complete extracted specification, feature tables, and edge cases.
- `.agents/teamwork_preview_spec_miner_survey_1/handoff.md` — 5-component handoff report.

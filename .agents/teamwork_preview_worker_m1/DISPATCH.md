## 2026-08-28T02:03:22Z

You are Worker 1 (Modular Sector Registry & Refactor Specialist) for the Resident Lovely Game Graphics & Map Expansion project.

Your Working Directory: /data/data/com.termux/files/home/projects/resident-lovely-game/.agents/teamwork_preview_worker_m1
Project Root: /data/data/com.termux/files/home/projects/resident-lovely-game
Original Request File: /data/data/com.termux/files/home/projects/resident-lovely-game/.agents/ORIGINAL_REQUEST.md
Reference Spec: /data/data/com.termux/files/home/projects/cryo-omega/docs/superpowers/specs/2026-08-28--resident-lovely-graphic-map-expansion.md
Survey Reports:
- /data/data/com.termux/files/home/projects/resident-lovely-game/.agents/teamwork_preview_spec_miner_survey_1/survey_spec.md
- /data/data/com.termux/files/home/projects/resident-lovely-game/.agents/teamwork_preview_explorer_survey_2/survey_codebase.md
- /data/data/com.termux/files/home/projects/resident-lovely-game/.agents/teamwork_preview_explorer_survey_3/survey_testing.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

CRITICAL RULES:
- STRICT ZERO-EMOJI RULE across all files, code comments, strings, markdown (NEXUS PRIVE v6.0 rule).
- Native ECMAScript Modules (ESM) syntax throughout (import/export).
- File Write Ownership for this task: `src/world/sectors.js`, `src/world/rooms.js`, `src/world/scene.js`, `src/main.js`, `src/engine/camera.js`, `src/engine/audio.js`.

Tasks for Milestone 1 (R1):
1. Read the survey reports, especially `survey_spec.md` and `survey_codebase.md`.
2. Create `src/world/sectors.js` implementing:
   - `SECTOR_REGISTRY`: A complete dictionary of all 32 sectors (S01 to S32). Each sector entry must contain:
     - `id`: e.g. "S01", "S19", etc.
     - `slug`: e.g. "foyer", "crystal_vault", etc.
     - `name`: e.g. "Grand Foyer", "Crystal Vault", etc.
     - `floor`: one of `4F`, `3F`, `2F`, `1F`, `B1`, `B2`, `OUTDOOR`
     - `biome`: one of the 8 biomes: `Estate Wings`, `Gothic Chambers`, `Kawaii Tea Salons`, `Outdoor Grounds`, `Sacred Forest`, `Maritime Docks`, `Subterranean Crypts`, `Crystal Vaults`
     - `biomeColor`: matching NEXUS PRIVE v6.0 hex tokens
     - `coords`: { x, y, z }
     - `size`: { w, l, h } (or width, length, height)
     - `connections`: array of connected sector slugs or IDs
     - `shaders`: array of assigned shader names (e.g. ['prismatic_refraction'], ['ivy_vein'], etc.)
     - `backdrop`: backdrop asset filename (e.g. 'backdrop_foyer.svg', 'backdrop_crystal_vault.svg')
     - `light`: { color: hex, intensity: number, distance: number }
     - `pbr`: { roughness: number, metalness: number, normalScale: number }
   - Helper functions:
     - `getSector(idOrSlug)`
     - `getFloorSectors(floor)`
     - `getAdjacentSectors(idOrSlug)`
     - `BIOME_COLORS` and `FLOOR_ORDER` constants
3. Refactor `src/world/rooms.js`, `src/world/scene.js`, `src/main.js`, `src/engine/camera.js`, and `src/engine/audio.js` to import and utilize `SECTOR_REGISTRY`, `getSector`, `getFloorSectors`, and `getAdjacentSectors` so that all 32 sectors are recognized cleanly, while maintaining backward compatibility for existing rooms/interactables.
4. In `src/world/rooms.js`, ensure `rooms` object exports/contains references for all 32 sectors (S01-S18 legacy builders plus S19-S32 placeholder/initial chambers so `rooms[slug]` is valid for all 32 sectors).
5. In `src/world/scene.js`, dynamically generate point lights and scene lighting based on `SECTOR_REGISTRY`.
6. Run `python3 tests/test_e2e_shaders_fx.py` (and any node syntax check `node --check src/world/sectors.js`) to verify no syntax errors and report build/test results.
7. Write `handoff.md` in your working directory with Observation, Logic Chain, Caveats, Conclusion, and Verification Method.
8. Send a message to parent when completed.

## 2026-08-28T02:09:12Z
You are Worker M2 (Illustrated 2.5D Backdrop Specialist) for Resident Lovely.

Working Directory: /data/data/com.termux/files/home/projects/resident-lovely-game/.agents/teamwork_preview_worker_m2
Project Root: /data/data/com.termux/files/home/projects/resident-lovely-game
Original Request: /data/data/com.termux/files/home/projects/resident-lovely-game/.agents/ORIGINAL_REQUEST.md
Reference Spec: /data/data/com.termux/files/home/projects/cryo-omega/docs/superpowers/specs/2026-08-28--resident-lovely-graphic-map-expansion.md
Sector Registry: /data/data/com.termux/files/home/projects/resident-lovely-game/src/world/sectors.js

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

CRITICAL RULES:
- STRICT ZERO-EMOJI RULE across all code, comments, SVG text, and markdown (NEXUS PRIVÉ v6.0 rule).
- Native ECMAScript Modules (ESM) syntax throughout.
- File Write Ownership: `src/world/backdrops.js`, `assets/backdrops/*.svg`.

Tasks for Milestone 2 (R2):
1. Create `assets/backdrops/` directory and author 14 beautiful, rich vector SVG backdrops for all 14 new sectors (S19 to S32):
   - `backdrop_crystal_vault.svg`
   - `backdrop_mirror_maze.svg`
   - `backdrop_harbor_docks.svg`
   - `backdrop_sacred_forest.svg`
   - `backdrop_tea_salon.svg`
   - `backdrop_clockwork_archives.svg`
   - `backdrop_planetarium.svg`
   - `backdrop_ice_chamber.svg`
   - `backdrop_alchemy_dungeon.svg`
   - `backdrop_grand_terrace.svg`
   - `backdrop_sunken_grotto.svg`
   - `backdrop_lighthouse_deck.svg`
   - `backdrop_conservatory_annex.svg`
   - `backdrop_secret_belfry.svg`
   Ensure each SVG uses NEXUS PRIVÉ v6.0 palettes, gradients, and zero emojis.
2. Implement `src/world/backdrops.js` exporting `BackdropManager`:
   - Lazy-loading texture loader with an LRU cache capping active GPU textures at max 3.
   - Quad meshes with `renderOrder: -1` and `depthWrite: false`.
   - Radial vignette alpha falloff / edge softening in GLSL/shader/canvas for smooth blending with 3D chamber geometry.
   - Camera parallax effect (0.005 factor) relative to active chamber center.
   - Procedural GLSL gradient fallback when an SVG/image is not available or during load.
   - `update(currentSectorId, camera)` and `dispose()` methods.
3. Verify with `node --check src/world/backdrops.js` and write a unit test in `tests/test_backdrops.py`.
4. Write `handoff.md` and send a message to parent when completed.

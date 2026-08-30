## 2026-08-28T02:09:13Z
You are Worker M3 (GLSL Surface Shader & Realism Specialist) for Resident Lovely.

Working Directory: /data/data/com.termux/files/home/projects/resident-lovely-game/.agents/teamwork_preview_worker_m3
Project Root: /data/data/com.termux/files/home/projects/resident-lovely-game
Original Request: /data/data/com.termux/files/home/projects/resident-lovely-game/.agents/ORIGINAL_REQUEST.md
Reference Spec: /data/data/com.termux/files/home/projects/cryo-omega/docs/superpowers/specs/2026-08-28--resident-lovely-graphic-map-expansion.md
Sector Registry: /data/data/com.termux/files/home/projects/resident-lovely-game/src/world/sectors.js

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

CRITICAL RULES:
- STRICT ZERO-EMOJI RULE across all code, comments, shader strings, and markdown (NEXUS PRIVÉ v6.0 rule).
- Native ECMAScript Modules (ESM) syntax throughout.
- File Write Ownership: `src/world/shaders/surface-shaders.js`, `src/world/shaders/`.

Tasks for Milestone 3 (R3):
1. Create `src/world/shaders/surface-shaders.js` implementing:
   - All 8 custom GLSL surface materials:
     1. `ivy_vein`
     2. `bioluminescent_floor`
     3. `prismatic_refraction`
     4. `flowing_river`
     5. `star_trail_sky`
     6. `ice_crack_floor`
     7. `mechanical_gear_wall`
     8. `infinite_mirror`
   - Complete vertex and fragment shaders for each, with proper uniforms (`uTime`, `uResolution`, `uColor`, `uAdjacentInfluence`, etc.).
   - `SurfaceShaderManager` class managing shader materials, compile cache, and updates.
   - Throttling & performance: active sector + 1 adjacent sector execution flag, keeping frame time <= 5.0ms.
   - Graceful fallback: returns standard `MeshStandardMaterial` if shader compilation is unsupported or throttled.
   - PBR normal perturbation helpers and volumetric lighting shaft helpers.
   - Post-processing helper (UnrealBloomPass config: threshold 0.85, strength 0.4, radius 0.6, FXAA).
2. Verify with `node --check src/world/shaders/surface-shaders.js` and write a unit test in `tests/test_surface_shaders.py`.
3. Write `handoff.md` and send a message to parent when completed.

## 2026-08-28T01:59:58Z

Project Orchestrator for the Resident Lovely: Maximum Happiness 3D Game Graphics Upgrade & World Map Expansion (18 to 32 sectors).

Workspace Directory: /data/data/com.termux/files/home/projects/resident-lovely-game
Working Directory: /data/data/com.termux/files/home/projects/resident-lovely-game/.agents/teamwork_preview_orchestrator_1
Original Request File: /data/data/com.termux/files/home/projects/resident-lovely-game/.agents/ORIGINAL_REQUEST.md
Reference Spec: /data/data/com.termux/files/home/projects/cryo-omega/docs/superpowers/specs/2026-08-28--resident-lovely-graphic-map-expansion.md

Requirements:
- R1: Modular Sector Registry (`src/world/sectors.js`, migrate all 18 hardcoded sector references in `src/world/rooms.js`, `src/world/scene.js`, and `src/main.js`, add 14 new sectors S19-S32, helper functions `getSector`, `getFloorSectors`, `getAdjacentSectors`).
- R2: Illustrated 2.5D Backdrop System (`src/world/backdrops.js`, lazy loading, max 3 active, SVG/PNG assets in `assets/backdrops/` for all 14 new sectors, GLSL gradient fallback, renderOrder -1, depthWrite false).
- R3: Per-Sector GLSL Surface Shaders (`src/world/shaders/surface-shaders.js` with 8 GLSL materials: ivy_vein, bioluminescent_floor, prismatic_refraction, flowing_river, star_trail_sky, ice_crack_floor, mechanical_gear_wall, infinite_mirror; sector-flag enforcement: active + 1 adjacent only, MeshStandardMaterial fallback, frame time <= 5.0ms).
- R4: Holographic Blueprint Map v2 (SVG auto-generated from sector registry, 7-tab floor selector: 4F, 3F, 2F, 1F, B1, B2, OUTDOOR, biome-specific fills, animated dashed connection paths, clicking sector shows info panel, max 200 SVG DOM nodes per floor view).
- R5: New Chamber Geometry for 14 sectors S19-S32 (floor plane, 4 walls, ceiling, 2+ decorative props as 3D mesh geometry, point light, collision and room-transition mechanics).
- Ensure zero emojis across all code, assets, and markdown files (NEXUS PRIVÉ v6.0 rule).
- Ensure native ESM throughout.
- Verify all tests pass including `tests/test_e2e_shaders_fx.py` and any new verification scripts.
- Send a message when completed all requirements and verified implementation.

## 2026-08-28T02:00:54Z

ADDITIONAL DIRECTIVE: Maximal 3D Realism — upgrade all rendering to highest possible visual fidelity within Three.js r128 + native ESM:
1. PBR Materials on all 32 sectors (roughnessMap, metalnessMap, normalMap with procedural GLSL perturbation, aoMap).
2. Volumetric Lighting (god-rays/volumetric shafts in Haunted Conservatory, Sacred Forest Trail, Harbor Docks).
3. Shadow Quality (PCFSoftShadowMap at 2048x2048 for directional sun, bias tuning per sector).
4. Environment Reflections (CubeCamera / PMREMGenerator for high-gloss surfaces in Crystal Vault, Mirror Maze Gallery, Reflection Pool; update interval every 4 frames).
5. Particle Density (double petal counts outdoors, rain particles in Harbor Docks, floating spore motes in Sacred Forest Trail and Crystal Grotto).
6. Post-Processing (UnrealBloomPass threshold=0.85, strength=0.4, radius=0.6, FXAA, frame time <= 5ms).
7. Backdrop Integration (depth-of-field edge softening GLSL alpha falloff, subtle camera parallax offset factor 0.005).

## 2026-08-28T02:01:23Z

CRYO OMEGA UI/UX PRO MAX INTELLIGENCE PACK:
1. Design System & Tokens: Reference audit & spec at /data/data/com.termux/files/home/projects/cryo-omega/audits/resident-lovely-ui-ux-pro-max-2026-08-28.md. Background: #05070a, #0f172a surface container with 16px blur. Accents: #22d3ee, #f59e0b, #10b981, #ef4444.
2. 8 Biome Chromatic Tokens: Estate Wings (#22d3ee), Gothic Chambers (#7c3aed), Kawaii Tea Salons (#f472b6), Outdoor Grounds (#10b981), Sacred Forest (#065f46), Maritime Docks (#0284c7), Subterranean Crypts (#78350f), Crystal Vaults (#a78bfa).
3. Blueprint Map v2 UX: 7 floor tabs (4F, 3F, 2F, 1F, B1, B2, OUTDOOR), SVG viewport clipping (<= 180 DOM nodes), animated player beacon, bi-directional sector flyout, CRT scanline overlay.
4. Backdrop Edge Feathering: Radial vignette alpha falloff in src/world/backdrops.js.
5. Strict Zero-Emoji: Geometric tokens ([LOCKED], [LOCKED], [LOCKED], [LOCKED], [LOCKED], •, [LOCKED]) and vector SVGs.

## 2026-08-28T02:16:33Z

USER APPROVAL CONFIRMED — Graphic Overhaul (Hybrid B+C, Maximal 3D Realistic) is OFFICIALLY AUTHORIZED.
Status: USER-APPROVED 2026-08-28T02:16Z
Directives to finalize and verify:
1. Run full test suite: `python3 -m unittest discover -s /data/data/com.termux/files/home/projects/resident-lovely-game/tests/`
2. Fix any failures (priority: zero-emoji violations).
3. Sync final deliverables to `~/projects/cryo-omega/webby/resident-lovely/` bidirectionally.
4. Report final verification and completion once all checks pass.

# [LOCKED] RESIDENT LOVELY: GRAPHICS & MAP EXPANSION
## Test & Infrastructure Survey Report (Explorer 3)
**Date**: 2026-08-28  
**Standard**: NEXUS PRIVÉ v6.0 / Zero-Emoji Protocol  
**Scope**: Test Suite Architecture, Verification Environment, Assertion Requirements, and Expansion Plan (R1–R5)

---

## 1. Executive Summary

This report provides a comprehensive analysis of the testing infrastructure, verification environments, and automated test suites for the **Resident Lovely Game: Graphics Upgrade & World Map Expansion (18 to 32 sectors)**.

### Key Findings at a Glance:
1. **Verification Framework**: Standalone Python 3.14.6 `unittest` test suite at `tests/test_e2e_shaders_fx.py` utilizing opaque-box source code inspection, regex/AST parsing, mathematical GLSL and physics simulation oracles (`ShaderMathOracle`), and filesystem audits.
2. **Execution Environment**: Native Termux Linux environment. Python 3.14.6 and Node.js v24.18.0 (with npm/npx) are available; browser-based automation tools (Playwright / Puppeteer) are not present. The mathematical oracle engine provides deterministic, sub-second execution without headless browser overhead.
3. **Current Test Status**: 94 / 95 tests pass. The single failing test (`test_scenario_5_mobile_thermal_and_zero_emoji_stress`) is caused by `get_all_workspace_files()` traversing `.agents/` where system-generated `BRIEFING.md` files contain the `[LOCKED]` Unicode character (`0x1f512`). Excluding `.agents/` restores 100% pass rate.
4. **Expansion Impact (R1–R5)**: The expansion introduces 5 major requirements (Modular Sector Registry, 2.5D Backdrop Sprites, 8 GLSL Surface Shaders, Holographic Blueprint Map v2, and 14 New Chamber Geometries). These require extending the test suite from 95 tests to ~145+ tests across the 4-tier testing hierarchy.

---

## 2. Test Environment & Tooling Inventory

| Component | Version / Path | Purpose & Availability |
|---|---|---|
| **Python Runtime** | `3.14.6` (`/data/data/com.termux/files/usr/bin/python3`) | Primary automated test runner for all unit, boundary, pairwise, and scenario tests |
| **Node.js Runtime** | `v24.18.0` (`/data/data/com.termux/files/usr/bin/node`) | Available for JS syntax validation / static scripts if needed |
| **Test Runner** | `python3 tests/test_e2e_shaders_fx.py` | Native `unittest.TextTestRunner` with formatted summary report |
| **Test Execution Time** | ~0.090s – 0.350s | High-speed, lightweight CPU simulation avoiding heavy browser overhead |
| **Browser Automation** | None (No Playwright / Puppeteer) | Verified via `which` and `pip list`; testing relies on static analysis + mathematical oracle |

---

## 3. Analysis of Existing Test Suite (`tests/test_e2e_shaders_fx.py`)

The existing test suite comprises **95 test methods** structured across 4 distinct tiers:

### 3.1 Tier Structure & Inventory
1. **Tier 1: Feature Coverage (40 tests)**:
   - Covers 8 features (F1..F8) with 5 dedicated tests each:
     - `F1`: Dynamic Sunset Skybox & Celestial Dome (ShaderMaterial, gradient uniforms, stardust noise, vertex/fragment GLSL, animation update).
     - `F2`: Planar Water Ripple & Reflection Shader (factory function, Gerstner displacement, normal perturbation, Fresnel reflection, Voronoi caustics).
     - `F3`: Multi-Chamber Water Integration (Reflection Pool, Solarium Fountain, Courtyard Greenhouse, water registry, animation loop).
     - `F4`: Wind Petal Turbulence Physics & Collision (3D sinusoidal gusts, ground collision damping, outdoor spawning, particle state lifecycle, 96-mesh bounded pool).
     - `F5`: Crystal Chandelier Sparkle Glints in Foyer (octahedron prisms, sparkle glint cross meshes, anchor (0, 9.5, 0), oscillating scale/opacity, gold/crystal colors).
     - `F6`: Performance Telemetry & Mobile WebGL Budget (DPR clamping to 1.5x, single directional shadow map 1024x1024, ACESFilmic tone mapping, frame calculation < 5.0ms, `window.__perfMetrics` hook).
     - `F7`: Strict Zero-Emoji Compliance (zero emojis in JS, HTML, CSS, Markdown, verified approved geometric tokens).
     - `F8`: Webby Build Synchronization (directory existence, CSS/assets sync, index.html sync, manifest/service-worker sync, subfolder presence).

2. **Tier 2: Boundary & Corner Cases (40 tests)**:
   - 5 boundary tests per feature (BVA F1..F8):
     - Time overflow modulo handling ($t = 10^7$s).
     - Elevation bounds at zenith (+1.0) and nadir (-1.0).
     - Wave constructive interference amplitude bounds ($\le 0.25$).
     - Fresnel zero-vector fallback.
     - Particle zero/negative delta and large delta clamping (max 0.1s).
     - Chandelier glint scale bounds $[0.0, 1.5]$ and opacity bounds $[0.0, 1.0]$.
     - High-DPI ($2\times, 3\times, 4\times \to 1.5\times$) and Low-DPI ($1.0\times \to 1.0\times$) clamping.
     - Shadow bias precision ($-0.0005$) and linear fog ratio ($35/110$m).

3. **Tier 3: Pairwise Cross-Feature Interactions (10 tests)**:
   - Multi-subsystem interactions: Room transition + water active, camera mode switch + petal physics, weapon firing + water ripples, chandelier glints + caustic floor, dynamic outdoor lighting, minimap radar rendering + stardust motes, inventory alchemy + telemetry, companion squad + water sectors, boss arena + destructibles, quick turn + camera pitch.

4. **Tier 4: Real-World Estate Application Scenarios (5 tests)**:
   - `Scenario 1`: Outdoor Grounds Traversal (`gatehouse` [LOCKED] `reflection_pool` [LOCKED] `rose_maze` [LOCKED] `gazebo`).
   - `Scenario 2`: Solarium Garden Water Meditation (`garden` [LOCKED] `greenhouse` tea pavilion).
   - `Scenario 3`: Grand Foyer Evening Atmosphere (`foyer` piano [LOCKED] chandelier sparkle [LOCKED] caustic floor [LOCKED] 2F mezzanine).
   - `Scenario 4`: Full Estate 18-Sector Cycle (`foyer` through `crypt`).
   - `Scenario 5`: Mobile WebGL 60 FPS Thermal Simulation (1,000 frames) & Exhaustive Zero-Emoji Scan.

---

## 4. Current Defect & Failure Root Cause

### Diagnostic Output:
```
FAIL: test_scenario_5_mobile_thermal_and_zero_emoji_stress
AssertionError: 9 != 0 : Exhaustive workspace zero-emoji scan found violations:
[('/data/data/com.termux/files/home/projects/resident-lovely-game/.agents/sentinel/BRIEFING.md', 6, '[LOCKED]', '0x1f512'),
 ('/data/data/com.termux/files/home/projects/resident-lovely-game/.agents/teamwork_preview_orchestrator_1/BRIEFING.md', 6, '[LOCKED]', '0x1f512'),
 ...]
```

### Analysis:
- `get_all_workspace_files(root_dir)` in `tests/test_e2e_shaders_fx.py` filters `.git` and `__pycache__`, but omits `.agents/`.
- Per Teamwork protocol, agent `BRIEFING.md` templates use `[LOCKED]` to denote append-only sections.
- **Resolution**: Update `get_all_workspace_files` to exclude `.agents` alongside `.git` and `__pycache__`.

---

## 5. Requirements R1–R5: Verification Architecture & Test Specifications

Below is the detailed test specification required to verify each expansion requirement:

### 5.1 Requirement R1: Modular Sector Registry (`src/world/sectors.js`)
- **Specification**:
  - `src/world/sectors.js` exports `SECTOR_REGISTRY` (array of exactly 32 sector definitions).
  - Helper functions exported: `getSector(id)`, `getFloorSectors(floor)`, `getAdjacentSectors(id)`.
  - Schema per sector:
    ```javascript
    {
      id: 'foyer',           // S01..S32 or canonical slug
      sectorId: 'S01',       // S01..S32
      name: 'Château Foyer',
      coords: [0, 0, 0],
      floor: '1F',           // '4F' | '3F' | '2F' | '1F' | 'B1' | 'B2' | 'OUTDOOR'
      biome: 'estate',       // 'estate'|'gothic'|'kawaii'|'outdoor'|'maritime'|'subterranean'|'crystal'|'forest'
      connections: ['library', 'garden', 'greenhouse', 'observatory', 'clocktower', 'lab'],
      happiness: 100,
      backdrop: 'assets/backdrops/S01-foyer.png',
      shader: 'ivy_vein'
    }
    ```
- **Test Invariants**:
  1. `len(SECTOR_REGISTRY) == 32`.
  2. All 18 legacy coordinates preserved exactly.
  3. All 14 new sector coordinates match spec (S19 `(-90,0,0)`, S20 `(-90,0,45)`, S21 `(-90,0,-45)`, S22 `(0,0,180)`, S23 `(90,0,135)`, S24 `(-90,0,135)`, S25 `(45,0,180)`, S26 `(-45,0,180)`, S27 `(0,36,0)`, S28 `(-45,24,0)`, S29 `(45,24,-45)`, S30 `(0,-42,-45)`, S31 `(45,-42,-45)`, S32 `(-45,-42,-45)`).
  4. `getSector('invalid')` returns `null`/`undefined`.
  5. `getFloorSectors('1F')` returns all 1F sectors (9 sectors total: 6 legacy + 3 new).
  6. `getFloorSectors('4F')` returns 4F sectors (Moonlit Rooftop, Clock Tower Belfry).
  7. `getFloorSectors('B2')` returns B2 sectors (Underground River Cavern, Crystal Vault, Ancient Ruins, Whispering Crypt).
  8. `getAdjacentSectors('foyer')` returns array of valid sector objects.
  9. No hardcoded sector coordinates remain in `rooms.js`, `scene.js`, or `main.js`.

---

### 5.2 Requirement R2: Illustrated 2.5D Backdrop System (`src/world/backdrops.js`)
- **Specification**:
  - `src/world/backdrops.js` exports `createSectorBackdrop(sectorId)` and backdrop management functions (`loadBackdrop`, `disposeBackdrop`).
  - Active texture memory pool restricted to **maximum 3 textures**.
  - Mesh geometry: `THREE.PlaneGeometry` quad placed behind 3D room contents.
  - Rendering properties: `renderOrder: -1` (or lower), `depthWrite: false`, `transparent: true` to prevent z-fighting with chamber geometry.
  - Procedural GLSL fallback gradient active when texture is missing or still loading.
  - Asset inventory: Vector SVG / PNG assets present in `assets/backdrops/` for all 14 new sectors (S19–S32) and existing sectors.
- **Test Invariants**:
  1. `createSectorBackdrop` returns a `THREE.Mesh` with `THREE.PlaneGeometry`.
  2. `material.depthWrite === false` and `mesh.renderOrder <= -1`.
  3. Memory pool manager tracks `activeTextures.length <= 3`.
  4. Entering a 4th room disposes the oldest cached backdrop texture.
  5. Fallback GLSL shader material handles missing backdrop paths gracefully without throwing WebGL errors.
  6. Filesystem check confirms presence of backdrop assets in `assets/backdrops/`.

---

### 5.3 Requirement R3: Per-Sector GLSL Surface Shaders (`src/world/shaders/surface-shaders.js`)
- **Specification**:
  - `src/world/shaders/surface-shaders.js` exports shader material factories for 8 distinct surface types:
    1. `ivy_vein`
    2. `bioluminescent_floor`
    3. `prismatic_refraction`
    4. `flowing_river`
    5. `star_trail_sky`
    6. `ice_crack_floor`
    7. `mechanical_gear_wall`
    8. `infinite_mirror`
  - Sector-flag throttling: **Only active sector + 1 adjacent sector** evaluate active GLSL surface shaders.
  - Off-screen / distant sectors automatically fall back to lightweight `THREE.MeshStandardMaterial`.
  - Frame computation time budget: $\le 5.0$ms on mobile devices (60 FPS target).
- **Test Invariants**:
  1. All 8 shader materials exported and instantiate valid `THREE.ShaderMaterial` instances.
  2. Each shader material exposes `uTime`, uniform colors, and custom uniforms.
  3. Throttling controller verifies active shader count $\le 2$ (current + 1 adjacent).
  4. Inactive rooms bind `MeshStandardMaterial` fallback.
  5. Mathematical shader evaluation oracle validates execution speed of all 8 shaders under $0.5$ms per simulated frame.

---

### 5.4 Requirement R4: Holographic Blueprint Map v2 (`src/systems/minimap.js` / `map.js`)
- **Specification**:
  - Auto-generated SVG blueprint dynamically constructed from `SECTOR_REGISTRY`.
  - 7 floor selection tabs: `4F`, `3F`, `2F`, `1F`, `B1`, `B2`, `OUTDOOR`.
  - Biome-specific fill tokens:
    - `estate`: `#22d3ee`
    - `gothic`: `#7c3aed`
    - `kawaii`: `#f472b6`
    - `outdoor`: `#10b981`
    - `maritime`: `#0284c7`
    - `subterranean`: `#78350f`
    - `crystal`: `#a78bfa`
    - `forest`: `#059669`
  - Animated dashed connection paths (`stroke-dasharray`, `@keyframes`).
  - Interactive sector inspection updates HUD telemetry (`tel-room-title`, `tel-joy-percent`, `tel-quest-state`, `tel-grump-count`).
  - DOM node budget guard: Maximum 200 SVG DOM elements per active floor view (using floor filtering and viewport clipping).
- **Test Invariants**:
  1. Blueprint map generator renders all 32 sectors across 7 floor views without hardcoding SVG node positions.
  2. Tab clicking correctly switches visible SVG layer to corresponding floor.
  3. Biome fill colors match defined hex tokens for all 32 sectors.
  4. Total SVG DOM node count per floor view $\le 200$.
  5. Clicking any of the 32 sector nodes populates telemetry card correctly.

---

### 5.5 Requirement R5: New Chamber Geometry for 14 Sectors (S19–S32)
- **Specification**:
  - 14 new chamber builders implemented in `src/world/rooms.js` (or modular room files):
    - `S19`: Haunted Conservatory
    - `S20`: Tea Salon
    - `S21`: Music Parlor
    - `S22`: Village District
    - `S23`: Sacred Forest Trail
    - `S24`: Harbor Docks
    - `S25`: Moonlit Meadow
    - `S26`: Crystal Grotto
    - `S27`: Moonlit Rooftop
    - `S28`: Clock Tower Belfry
    - `S29`: Mirror Maze Gallery
    - `S30`: Underground River Cavern
    - `S31`: Crystal Vault
    - `S32`: Ancient Ruins
  - Each chamber features:
    - Floor plane
    - 4 perimeter walls
    - Ceiling
    - $\ge 2$ unique 3D decorative props (e.g., grand harp, tea cart, crystal stalagmites, dock pier, clock bells).
  - Point lights configured in `src/world/scene.js` with `castShadow: false`.
  - Room transition boundaries and collision mechanics connected in `src/main.js`.
- **Test Invariants**:
  1. All 32 sector groups exist in `rooms` object.
  2. Each chamber geometry contains floor, walls, ceiling, and $\ge 2$ child mesh props.
  3. Point lights for all 32 sectors exist in `scene.js` and have `castShadow === false`.
  4. Room transitions in `main.js` correctly handle navigation into and out of all 14 new sectors.

---

### 5.6 Cross-Cutting Requirements (NEXUS PRIVÉ v6.0 & Webby)
- **Zero-Emoji Protocol**:
  - 0 emojis across all files in `src/`, `assets/`, `css/`, `index.html`, `design/`, `docs/`, `PROJECT.md`, `README.md`, `ROADMAP.md`, `CHANGELOG.md`, `TEST_INFRA.md`, `TEST_READY.md`.
  - Approved geometric glyphs only: `[LOCKED]`, `[LOCKED]`, `[LOCKED]`, `[LOCKED]`, `[LOCKED]`, `•`, `[LOCKED]`, `[LOCKED]`, `[LOCKED]`, `[LOCKED]`, `[LOCKED]`, `[LOCKED]`, `[LOCKED]`, `[LOCKED]`, `[LOCKED]`, `[LOCKED]`, `[LOCKED]`, `[LOCKED]`, `[LOCKED]`.
- **Native ESM Compliance**:
  - All new files (`sectors.js`, `backdrops.js`, `surface-shaders.js`, etc.) must use native ES modules (`import` / `export`).
  - No CommonJS `require()` or `module.exports`.
- **Webby Build Synchronization**:
  - All updated source files, new modules, and backdrop assets synchronized to `/data/data/com.termux/files/home/projects/cryo-omega/webby/` and `webby/resident-lovely/`.

---

## 6. Recommended Test Expansion Plan

To verify R1–R5 cleanly, the test suite should be expanded into a unified suite (`tests/test_e2e_shaders_fx.py` or modular test runner) with the following structure:

| Test Suite Module | Target Scope | Planned Test Count |
|---|---|:---:|
| **Tier 1: Feature Coverage** | F1–F8 Legacy Shaders + FX | 40 |
| | R1: Sector Registry (`sectors.js`, helpers, coordinates) | 10 |
| | R2: Backdrop Sprites (`backdrops.js`, pool $\le 3$, fallback) | 8 |
| | R3: Surface Shaders (8 GLSL shaders, sector-flagging) | 10 |
| | R4: Blueprint Map v2 (7 tabs, SVG auto-gen, $\le 200$ nodes) | 8 |
| | R5: Chamber Geometry (S19–S32 geometry, props, lights) | 14 |
| **Tier 2: Boundary & Corner Cases** | BVA across Legacy + R1–R5 | 45 |
| **Tier 3: Pairwise Interactions** | Cross-feature multi-sector state transitions | 12 |
| **Tier 4: Real-World Scenarios** | 32-Sector Full Traversal & Stress Cycles | 6 |
| **Total Automated Tests** | **Exhaustive Multi-Tier Verification** | **153 Tests** |

---

## 7. Immediate Action Items for Implementers

1. **Fix Emoji Scan in Existing Test**: Update `get_all_workspace_files()` in `tests/test_e2e_shaders_fx.py` to add `'.agents'` to the directory skip list.
2. **Refactor Scenario 4 in Test Suite**: Update `test_scenario_4_full_estate_18_sector_cycle` to verify that `rooms` contains all 32 chambers dynamically loaded from `SECTOR_REGISTRY`.
3. **Add Registry Test Cases**: Incorporate tests for `SECTOR_REGISTRY`, `getSector`, `getFloorSectors`, and `getAdjacentSectors`.
4. **Add Shader Material & Backdrop Assertions**: Add test methods validating the 8 surface shader materials and backdrop texture manager.
5. **Add Blueprint Map Node Count Assertions**: Add tests validating that SVG DOM generation for each of the 7 floors stays under 200 nodes.

---
*Resident Lovely: Graphics & Map Expansion | Explorer 3 Test & Infrastructure Survey*

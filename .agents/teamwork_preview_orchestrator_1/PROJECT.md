# Project: Resident Lovely 3D Graphics Upgrade & World Map Expansion (18 to 32 Sectors)

## Architecture
- Native ECMAScript Modules (ESM) with zero build step.
- Three.js r128 WebGL renderer with high visual realism (PBR, UnrealBloom, volumetric shafts, PCFSoftShadowMap 2048x2048, CubeCamera reflections).
- Authoritative Single Source of Truth: `src/world/sectors.js` declaring 32 sectors (S01–S32) with biomes, floor layers, coordinates, shaders, backdrops, and lighting profiles.
- Modular subsystems:
  - `src/world/sectors.js`: Sector registry, spatial graph queries, biome tokens.
  - `src/world/backdrops.js`: Illustrated 2.5D backdrop quad system, LRU texture cache (max 3), depth-of-field edge softening, parallax offset, procedural GLSL gradient fallback.
  - `src/world/shaders/surface-shaders.js`: 8 custom GLSL surface materials, active+adjacent throttling, standard fallback.
  - `src/systems/minimap.js`: Holographic Blueprint Map v2, SVG dynamic generation, 7 floor tabs, <= 180 SVG DOM nodes, CRT scanline overlay, interactive inspection flyout.
  - `src/world/rooms.js`: Procedural chamber geometry for all 32 sectors (S01-S32), 2+ decorative 3D props each, collision boundaries.
  - `src/world/scene.js`: PBR materials, dynamic lighting, shadow maps, volumetric light shafts, post-processing composer.
  - `src/main.js`: Main loop, room transitions, contextual interactions, HUD update.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---|---|---|---|
| F1 | Modular Sector Registry | 32 sectors (S01-S32) schema in `src/world/sectors.js` with `getSector`, `getFloorSectors`, `getAdjacentSectors` | M1 | R1 |
| F2 | Refactor Hardcoded References | Migrate `rooms.js`, `scene.js`, `main.js`, `camera.js`, `audio.js` to dynamic registry lookup | M1 | R1 |
| F3 | Illustrated 2.5D Backdrop Engine | `src/world/backdrops.js` with LRU texture cache (max 3 active), `depthWrite: false`, `renderOrder: -1`, radial edge feathering, GLSL fallback | M2 | R2 |
| F4 | Backdrop SVG Assets | 14 SVG backdrops in `assets/backdrops/` for S19-S32 with NEXUS PRIVÉ v6.0 styling and zero emojis | M2 | R2 |
| F5 | 8 Per-Sector GLSL Shaders | `ivy_vein`, `bioluminescent_floor`, `prismatic_refraction`, `flowing_river`, `star_trail_sky`, `ice_crack_floor`, `mechanical_gear_wall`, `infinite_mirror` in `surface-shaders.js` | M3 | R3 |
| F6 | Shader Throttling & Fallback | Active + 1 adjacent sector execution flag, frame time <= 5.0ms, MeshStandardMaterial fallback | M3 | R3 |
| F7 | Maximal 3D Realism Shaders & FX | PBR micro-detail, UnrealBloomPass (0.85/0.4/0.6), FXAA, volumetric shafts, PCFSoftShadowMap 2048x2048, CubeCamera reflections | M3 | Directive |
| F8 | Blueprint Map v2 SVG Generator | SVG auto-generation from `SECTOR_REGISTRY` with 7 floor tabs (`4F`, `3F`, `2F`, `1F`, `B1`, `B2`, `OUTDOOR`), <= 180 DOM nodes | M4 | R4 |
| F9 | Interactive Blueprint UI/UX | Bi-directional inspection flyout, happiness %, plushie count, puzzle states, animated player beacon, CRT scanlines | M4 | R4 / UI-UX |
| F10 | New Chamber Geometry S19-S32 | Procedural floor plane, 4 walls, ceiling, 2+ decorative 3D props each (28+ props total) in `rooms.js` | M5 | R5 |
| F11 | Sector Lights & Collisions S19-S32 | Biome point lights (`castShadow: false`), collision boundaries, room transitions in `scene.js` and `main.js` | M5 | R5 |
| F12 | E2E Testing Suite Expansion | 150+ tests in `tests/test_e2e_shaders_fx.py` (Tiers 1-4) + Tier 5 adversarial testing + zero-emoji validation | M6 | E2E Track |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|---|---|---|---|
| M1 | Modular Sector Registry & Refactor | Create `src/world/sectors.js` (S01-S32), refactor `rooms.js`, `scene.js`, `main.js` | none | DONE |
| M2 | Illustrated 2.5D Backdrop System | Create `src/world/backdrops.js` and 14 backdrop SVG assets in `assets/backdrops/` | M1 | DONE |
| M3 | Per-Sector GLSL Surface Shaders | Create `src/world/shaders/surface-shaders.js` with 8 GLSL materials, throttling, PBR, post-processing | M1 | DONE |
| M4 | Holographic Blueprint Map v2 | Build SVG map generator with 7 floor tabs, telemetry panel, CRT scanline overlay | M1 | DONE |
| M5 | Chamber Geometry for S19-S32 | Build procedural 3D chamber geometry and 28+ props for S19-S32 in `rooms.js`, lights in `scene.js` | M1 | DONE |
| M6 | Comprehensive E2E Testing & Forensics | Update `tests/test_e2e_shaders_fx.py` to 150+ tests, run tests, verify zero emojis, run forensic audit | M1, M2, M3, M4, M5 | IN_PROGRESS |

## Interface Contracts
### `src/world/sectors.js`
- `export const SECTOR_REGISTRY = { [id]: { id, slug, name, floor, biome, coords: {x,y,z}, size: {w,l,h}, connections: [...], shaders: [...], backdrop: string, light: {color, intensity, distance}, pbr: {roughness, metalness} } }`
- `export function getSector(idOrSlug)`
- `export function getFloorSectors(floor)`
- `export function getAdjacentSectors(idOrSlug)`
- `export const BIOME_COLORS = { ... }`

### `src/world/backdrops.js`
- `export class BackdropManager { constructor(scene, camera) { ... } update(currentSectorId, camera) { ... } dispose() { ... } }`
- Max active textures in GPU memory: 3 (LRU eviction).
- Properties: `renderOrder = -1`, `depthWrite = false`, radial edge alpha feathering, parallax offset factor 0.005.

### `src/world/shaders/surface-shaders.js`
- `export class SurfaceShaderManager { constructor(renderer) { ... } getMaterial(shaderName, baseColor) { ... } update(delta, activeSectorId, adjacentSectorIds) { ... } dispose() { ... } }`
- Supported shaders: `ivy_vein`, `bioluminescent_floor`, `prismatic_refraction`, `flowing_river`, `star_trail_sky`, `ice_crack_floor`, `mechanical_gear_wall`, `infinite_mirror`.
- Active execution limited to current room + 1 adjacent room.

### `src/systems/minimap.js` (Blueprint Map v2)
- `export function renderBlueprintMapSVG(activeFloor, currentSectorId, containerEl, onSectorClick)`
- 7 floor tabs: `4F`, `3F`, `2F`, `1F`, `B1`, `B2`, `OUTDOOR`.
- Strict SVG DOM node budget: <= 180 nodes per floor.

### `src/world/rooms.js`
- `export function createChamber(sectorId)`
- Procedural floor, 4 walls, ceiling, 2+ decorative 3D meshes per room, collision bounding box.

## Code Layout
- `src/world/sectors.js`: Sector registry & spatial graph
- `src/world/backdrops.js`: 2.5D backdrop quad system & texture manager
- `src/world/shaders/surface-shaders.js`: Custom GLSL materials & PBR enhancement
- `src/world/rooms.js`: Chamber procedural 3D geometry & props
- `src/world/scene.js`: Three.js lighting, shadows, skybox, volumetric shafts, post-processing
- `src/systems/minimap.js`: Minimap radar & SVG Blueprint Map v2
- `src/main.js`: Game loop, room transitions, interactables
- `assets/backdrops/*.svg`: Vector backdrop illustrations for all 14 new sectors
- `tests/test_e2e_shaders_fx.py`: Multi-tier E2E testing & static analysis suite

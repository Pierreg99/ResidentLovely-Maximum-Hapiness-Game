# [LOCKED] RESIDENT LOVELY — FULL GRAPHICS & MAP EXPANSION SPECIFICATION SURVEY
## Document ID: `SPEC-SURVEY-2026-08-28-M1-CONVERGED`
## Status: CONVERGED & AUTHORITATIVE
## Classification: NEXUS PRIVÉ v6.0 Standard | Zero-Emoji Strict Compliance

---

## 1. Executive Summary & Architectural Scope

This specification survey extracts and formalizes the complete technical requirements for expanding **Resident Lovely: Maximum Happiness 3D** from **18 to 32 sectors** (+14 new chambers), implementing an **Illustrated 2.5D Room Backdrop Sprite System**, **8 Per-Sector GLSL Surface Shaders**, a **Holographic Blueprint Map v2** with 7 floor tabs, and full **3D Chamber Geometry for S19–S32**.

```
                           [SECTOR REGISTRY (32 Sectors)]
                                      [LOCKED]
         [LOCKED]
         [LOCKED]                            [LOCKED]                            [LOCKED]
[2.5D BACKDROP SYSTEM]    [GLSL SURFACE SHADERS (8)]    [BLUEPRINT MAP v2 (7 Tabs)]
  - Max 3 Active Textures   - Active + 1 Adj Flag         - 4F/3F/2F/1F/B1/B2/OUTDOOR
  - Lazy Load & LRU Purge   - MeshStandard Fallback       - Animated Dashed Paths
  - renderOrder: -1         - Frame Budget <= 5.0ms       - DOM Nodes <= 200/floor
  - depthWrite: false       - 8 Custom GLSL Materials     - Sector Telemetry Panel
         [LOCKED]                            [LOCKED]                            [LOCKED]
         [LOCKED]
                                      [LOCKED]
                        [3D CHAMBER GEOMETRY S19–S32]
                          - 14 Unique Chambers
                          - 2+ 3D Props per Chamber
                          - Biome-Tinted Point Lights
                          - Collision & Transition Triggers
```

---

## 2. Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| F1 | Registry | Modular Sector Registry (`src/world/sectors.js`) | Export `SECTOR_REGISTRY` (32 items) and query helpers | Sector ID/slug, floor string, adjacent ID | Sector schema object, filtered sector arrays | Returns `null` or `[]` for unknown queries | Reference Spec §2, §3; ORIGINAL_REQUEST R1 |
| F2 | Registry | Sector Query Helper `getSector(idOrSlug)` | Fast indexed lookup supporting both 'S01'..'S32' and 'foyer'..'ancient_ruins' | Sector ID (`'S01'`) or slug (`'foyer'`) | Sector object or `null` | Returns `null` on nonexistent key | Reference Spec §3; ORIGINAL_REQUEST R1 |
| F3 | Registry | Floor Sector Query `getFloorSectors(floor)` | Filters sectors by exact floor category (`'1F'`, `'2F'`, `'3F'`, `'4F'`, `'B1'`, `'B2'`, `'OUTDOOR'`) | Floor string | Array of Sector objects | Returns `[]` if floor empty | Reference Spec §3; ORIGINAL_REQUEST R1 |
| F4 | Registry | Adjacent Connection Query `getAdjacentSectors(id)` | Resolves all neighboring sector objects connected to a given sector | Sector ID | Array of neighboring Sector objects | Returns `[]` if no connections | Reference Spec §3; ORIGINAL_REQUEST R1 |
| F5 | Backdrops | Illustrated 2.5D Backdrop Mesh (`src/world/backdrops.js`) | Constructs background quad behind 3D geometry with `renderOrder: -1` and `depthWrite: false` | Sector ID, backdrop texture asset path | `THREE.Mesh` (PlaneGeometry quad) | Falls back to procedural GLSL gradient on load failure | Reference Spec §3; ORIGINAL_REQUEST R2 |
| F6 | Backdrops | Lazy Loading & LRU Texture Manager | Loads backdrop textures dynamically when entering sector; caps active VRAM textures to 3 | Active sector ID, preloaded adjacent IDs | Texture asset binding | Disposes oldest unused texture (`texture.dispose()`) | Reference Spec §3, §4; ORIGINAL_REQUEST R2 |
| F7 | Backdrops | Procedural GLSL Gradient Fallback | Generates zenith-to-horizon biome color gradient quad when image texture is absent or loading | Biome primary/secondary colors | `THREE.ShaderMaterial` quad | Fallback never fails; defaults to `#05070a` to `#22d3ee` | Reference Spec §3; ORIGINAL_REQUEST R2 |
| F8 | Shaders | Ivy Vein GLSL Material (`ivy_vein`) | Procedural creeping vine and pulsating leaf branching shader for garden/forest surfaces | `uTime`, `uTileScale`, `uColorPrimary`, `uColorSecondary` | `THREE.ShaderMaterial` | Falls back to `MeshStandardMaterial` if shader budget exceeded | Reference Spec §3; ORIGINAL_REQUEST R3 |
| F9 | Shaders | Bioluminescent Floor Material (`bioluminescent_floor`) | Procedural pulsing organic lichen and ripple highlights for damp/magical floors | `uTime`, `uPulseSpeed`, `uGlowIntensity`, `uColorPrimary` | `THREE.ShaderMaterial` | Falls back to `MeshStandardMaterial` | Reference Spec §3; ORIGINAL_REQUEST R3 |
| F10 | Shaders | Prismatic Refraction Material (`prismatic_refraction`) | Iridescent chromatic dispersion and diamond caustic sparkle shader | `uTime`, `uDispersion`, `uRoughness`, `uColorPrimary` | `THREE.ShaderMaterial` | Falls back to `MeshStandardMaterial` | Reference Spec §3; ORIGINAL_REQUEST R3 |
| F11 | Shaders | Flowing River Material (`flowing_river`) | Dual-frequency flow map with turbulent foam and wave perturbation | `uTime`, `uFlowSpeed`, `uFoamIntensity`, `uWaveHeight` | `THREE.ShaderMaterial` | Falls back to `MeshStandardMaterial` | Reference Spec §3; ORIGINAL_REQUEST R3 |
| F12 | Shaders | Star Trail Sky Material (`star_trail_sky`) | Cosmic stardust swirling vortex and stellar motes shader | `uTime`, `uSwirlSpeed`, `uStardustIntensity`, `uZenithColor` | `THREE.ShaderMaterial` | Falls back to `MeshStandardMaterial` | Reference Spec §3; ORIGINAL_REQUEST R3 |
| F13 | Shaders | Ice Crack Floor Material (`ice_crack_floor`) | Voronoi fracture matrix with subsurface luminous glow | `uTime`, `uCrackScale`, `uGlowIntensity`, `uColorPrimary` | `THREE.ShaderMaterial` | Falls back to `MeshStandardMaterial` | Reference Spec §3; ORIGINAL_REQUEST R3 |
| F14 | Shaders | Mechanical Gear Wall Material (`mechanical_gear_wall`) | Procedural rotating 2D gear SDF with brass teeth interlocking animation | `uTime`, `uGearSpeed`, `uTeethCount`, `uMetalness` | `THREE.ShaderMaterial` | Falls back to `MeshStandardMaterial` | Reference Spec §3; ORIGINAL_REQUEST R3 |
| F15 | Shaders | Infinite Mirror Material (`infinite_mirror`) | Recursive internal ray tunnel depth simulation for labyrinth corridors | `uTime`, `uDepthRecursion`, `uTintGradient`, `uResolution` | `THREE.ShaderMaterial` | Falls back to `MeshStandardMaterial` | Reference Spec §3; ORIGINAL_REQUEST R3 |
| F16 | Shaders | Dynamic Sector-Flag Execution Enforcer | Restricts heavy GLSL updates to active sector + 1 adjacent sector only | Active sector ID, adjacent IDs, global elapsed time | Updated uniform values | Inactive sector shaders bypass uniform math and render static | Reference Spec §3, §4; ORIGINAL_REQUEST R3 |
| F17 | Map | Holographic Blueprint Map v2 Generator (`src/systems/minimap.js` / `map.js`) | Auto-generates full vector SVG blueprint hierarchy from `SECTOR_REGISTRY` | `SECTOR_REGISTRY` array | Structured SVG DOM string / element tree | Filters invalid coordinates safely | Reference Spec §3; ORIGINAL_REQUEST R4 |
| F18 | Map | 7-Tab Floor Selector Matrix | Seamless tab navigation across 7 distinct building tiers (`4F`, `3F`, `2F`, `1F`, `B1`, `B2`, `OUTDOOR`) | Floor tab click event | Filtered floor SVG layer displayed | Default active floor set to player current sector floor | Reference Spec §2, §3; ORIGINAL_REQUEST R4 |
| F19 | Map | Biome-Specific Zone Coloring Matrix | Automatically colors room rects based on biome token palette | Biome string (`estate`, `gothic`, `kawaii`, `outdoor`, `maritime`, `subterranean`, `crystal`, `forest`) | Hex stroke & fill tokens | Defaults to `estate` cyan (`#22d3ee`) | Reference Spec §3; design/map-component-spec.md |
| F20 | Map | Animated Dashed Connection Paths | Renders dynamic hallway conduits between connected rooms with flowing dash stroke | Adjacent connection pairs `[S_A, S_B]` | SVG `<path class="connection-pulse">` | Clamps disconnected rooms without error | Reference Spec §3; ORIGINAL_REQUEST R4 |
| F21 | Map | Interactive Sector Telemetry Sidebar | Displays room bliss %, active grump count, quest task, and backdrop thumbnail upon click | Sector click event | Populated HTML Telemetry Card | Shows default estate stats if sector unselected | Reference Spec §3; design/map-component-spec.md |
| F22 | Map | Viewport Node Budget Clipping (<= 200 Nodes) | Strict DOM element budget per active floor layer to prevent mobile SVG lag | Active floor sector list | Capped SVG DOM sub-tree | Cull out-of-viewport decorative elements | Reference Spec §4; ORIGINAL_REQUEST R4 |
| F23 | Geometry | 1F East Wing Chambers (S19, S20, S21) | 3D chamber geometry for Haunted Conservatory, Tea Salon, and Music Parlor | Chamber transform, room group | `THREE.Group` with floor, 4 walls, ceiling, 2+ props | Clamps bounds at ±14m | Reference Spec §2; ORIGINAL_REQUEST R5 |
| F24 | Geometry | Outdoor Expansion Grounds (S22, S23, S24, S25, S26) | 3D outdoor terrain for Village District, Forest Trail, Harbor, Meadow, Crystal Grotto | Ground plane coords, props | `THREE.Group` with open skybox, perimeter fences/props | Unbounded height, horizontal collider bounds | Reference Spec §2; ORIGINAL_REQUEST R5 |
| F25 | Geometry | Upper Tower Chambers (S27, S28, S29) | 3D chamber geometry for Moonlit Rooftop (4F), Belfry (4F), and Mirror Maze (3F) | Vertical Y offset (+24m, +36m), room group | `THREE.Group` with balustrades, gears, mirrors | Elevation check for floor transitions | Reference Spec §2; ORIGINAL_REQUEST R5 |
| F26 | Geometry | Subterranean Abyss Chambers (S30, S31, S32) | 3D chamber geometry for Underground Cavern, Crystal Vault, and Ancient Ruins (B2) | Sub-ground Y offset (-42m), room group | `THREE.Group` with cavern rocks, vaults, stone ruins | Enclosed box collision bounds | Reference Spec §2; ORIGINAL_REQUEST R5 |
| F27 | Geometry | Procedural 3D Decorative Props (28+ Props) | Over 28 unique procedural 3D prop meshes distributed across all 14 new chambers | Prop descriptor, material tokens | `THREE.Group` child meshes | Low-poly primitives with shared materials | Reference Spec §2; ORIGINAL_REQUEST R5 |
| F28 | Lighting | Per-Chamber Dynamic Lighting Matrix | Dedicated PointLight and ambient parameters per chamber matching biome color | Sector lighting config | `THREE.PointLight` instance & ambient color update | Safe defaults: Intensity 2.0, Distance 34 | Reference Spec §2; `src/world/scene.js` |
| F29 | Engine | Room Transition & Spatial Audio Trigger | Contextual door interactions and seamless camera transition between sectors | Player proximity to doorway | Room state switch, audio update, curtain fade | Transition debounce lock during fade | `src/main.js`; `src/engine/audio.js` |
| F30 | Protocol | NEXUS PRIVÉ v6.0 Zero-Emoji Enforcement | Global protocol prohibiting emojis across all code, assets, UI, and documentation | UTF-8 text strings, UI DOM | Clean vector glyphs (`[LOCKED]`, `[LOCKED]`, `[LOCKED]`, `•`) | Test suite fails on any emoji byte `0x1F300`–`0x1FAFF` | GEMINI.md; `tests/test_e2e_shaders_fx.py` |

---

## 3. Edge Cases & Failure Modes

| # | Feature | Input / Condition | Observed / Required Behavior |
|---|---------|-------------------|------------------------------|
| E1 | Sector Registry | Nonexistent Sector Query `getSector('S99')` | Returns `null` gracefully without throwing runtime errors. |
| E2 | Sector Registry | Query with undefined or invalid floor `getFloorSectors('10F')` | Returns empty array `[]` cleanly. |
| E3 | Sector Registry | Adjacent query on leaf sector `getAdjacentSectors('S31')` | Returns array with exactly 1 element `[S30]`. |
| E4 | Backdrop Manager | Fast traversal through 5+ sectors within 2 seconds | Texture LRU manager strictly unloads oldest texture, maintaining `<= 3` active GPU textures. |
| E5 | Backdrop Manager | Missing backdrop PNG file (HTTP 404) | Automatically falls back to procedural GLSL zenith/horizon gradient shader quad without visual pop. |
| E6 | Backdrop Geometry | Camera orbiting close to backdrop quad | Quad set with `renderOrder: -1` and `depthWrite: false` to guarantee zero Z-fighting with 3D props. |
| E7 | GLSL Surface Shaders | Low-end mobile device exceeding 5.0ms frame time | Dynamic shader scaler automatically downgrades distant adjacent shaders to `MeshStandardMaterial`. |
| E8 | GLSL Surface Shaders | Sector with `shader: null` (e.g. S05, S10) | Instantiates default optimized PBR `THREE.MeshStandardMaterial` with room tile colors. |
| E9 | GLSL Surface Shaders | Rapid sector switching before shader compilation finishes | Uniform animation loop validates material presence before writing uniforms (`if (mat.uniforms?.uTime)`). |
| E10 | Blueprint Map v2 | Switching floor tab when player is on a different floor | Blueprint opens to active tab without altering player game state; shows "Player on Floor 1F" badge. |
| E11 | Blueprint Map v2 | Floor with large number of rooms (1F has 10 sectors) | SVG sub-tree renders with `<= 200` total DOM nodes; labels use concise typography. |
| E12 | Blueprint Map v2 | Clicking already-selected sector in Blueprint sidebar | Sidebar maintains state and replays subtle click audio without DOM re-render flicker. |
| E13 | Chamber Geometry | Player sprinting into chamber boundary walls | Bounding box collision clamps player `x, z` within `[minX, maxX]`, `[minZ, maxZ]`. |
| E14 | Chamber Geometry | Vertical chamber transition (e.g. Cathedral 3F to Rooftop 4F) | Player position teleports to designated landing spawn coordinate with matching camera pitch. |
| E15 | Props Collision | Player colliding with complex 3D props (e.g. Grand Harpsichord) | Bounding cylinder / box obstacle check deflects player velocity smoothly. |
| E16 | Zero-Emoji Protocol | Text strings containing accidental unicode emojis | Sanitized to approved geometric glyphs (`[LOCKED]`, `[LOCKED]`, `[LOCKED]`) or monospace text badges. |

---

## 4. Complete 32-Sector Registry Specification (S01 to S32)

### 4.1 Biome Token Definitions

| Biome Key | Biome Name | Hex Token | Glow Token | Semantic Environment |
|---|---|---|---|---|
| `estate` | Château Grand Estate | `#22d3ee` | `rgba(34, 211, 238, 0.4)` | Grand polished marble, gilded trims, velvet halls |
| `gothic` | Gloomy Victorian Gothic | `#7c3aed` | `rgba(124, 58, 237, 0.4)` | Overgrown ivy, antique stone, twilight urns |
| `kawaii` | Pastel Confectionery | `#f472b6` | `rgba(244, 114, 182, 0.4)` | Sweet sugar parlors, teapots, plush decor |
| `outdoor` | Verdant Manor Grounds | `#10b981` | `rgba(16, 185, 129, 0.4)` | Open sky, manicured hedges, pavilions |
| `maritime` | Coastal Harbor & Docks | `#0284c7` | `rgba(2, 132, 199, 0.4)` | Wooden docks, sea spray, anchor posts |
| `subterranean` | Sugar Mine Caverns | `#78350f` | `rgba(120, 53, 15, 0.4)` | Underground dynamos, amber conduits, rock walls |
| `crystal` | Celestial Quartz & Mirror | `#a78bfa` | `rgba(167, 139, 250, 0.4)` | Iridescent prisms, disco chandeliers, star sky |
| `forest` | Sacred Whispering Woods | `#059669` | `rgba(5, 150, 105, 0.4)` | Ancient trees, moss shrines, glowing spores |

---

### 4.2 Full 32-Sector Data Catalog

```javascript
export const SECTOR_REGISTRY = [
  // =========================================================================
  // 1F GROUND ESTATE WINGS (S01 - S07, S19 - S21)
  // =========================================================================
  {
    id: 'S01',
    slug: 'foyer',
    name: 'Grand Foyer & Mezzanine',
    floor: '1F',
    coords: [0, 0, 0],
    dimensions: [28, 12, 28],
    biome: 'estate',
    connections: ['S02', 'S03', 'S04', 'S08', 'S09', 'S17'],
    happiness: 75,
    backdrop: 'assets/backdrops/S01-foyer.png',
    shader: 'bioluminescent_floor',
    lighting: { color: 0xf59e0b, intensity: 1.8, distance: 32, position: [0, 7.5, 0] },
    ambient: { color: 0x38bdf8, intensity: 0.65 }
  },
  {
    id: 'S02',
    slug: 'library',
    name: 'Library of Harmony',
    floor: '1F',
    coords: [45, 0, 0],
    dimensions: [24, 10, 24],
    biome: 'estate',
    connections: ['S01', 'S05'],
    happiness: 50,
    backdrop: 'assets/backdrops/S02-library.png',
    shader: 'ivy_vein',
    lighting: { color: 0xf59e0b, intensity: 2.0, distance: 32, position: [45, 7.0, 0] },
    ambient: { color: 0xfde047, intensity: 0.55 }
  },
  {
    id: 'S03',
    slug: 'garden',
    name: 'Solarium Garden',
    floor: '1F',
    coords: [-45, 0, 0],
    dimensions: [26, 10, 26],
    biome: 'kawaii',
    connections: ['S01', 'S06', 'S19'],
    happiness: 90,
    backdrop: 'assets/backdrops/S03-garden.png',
    shader: 'flowing_river',
    lighting: { color: 0x10b981, intensity: 2.2, distance: 34, position: [-45, 7.5, 0] },
    ambient: { color: 0x6ee7b7, intensity: 0.85 }
  },
  {
    id: 'S04',
    slug: 'greenhouse',
    name: 'Courtyard Tea Greenhouse',
    floor: '1F',
    coords: [0, 0, 45],
    dimensions: [26, 12, 26],
    biome: 'kawaii',
    connections: ['S01', 'S13'],
    happiness: 85,
    backdrop: 'assets/backdrops/S04-greenhouse.png',
    shader: 'ivy_vein',
    lighting: { color: 0x34d399, intensity: 2.2, distance: 34, position: [0, 7.5, 45] },
    ambient: { color: 0x6ee7b7, intensity: 0.85 }
  },
  {
    id: 'S05',
    slug: 'dining',
    name: 'Grand Banquet Dining Hall',
    floor: '1F',
    coords: [45, 0, 45],
    dimensions: [26, 10, 26],
    biome: 'estate',
    connections: ['S02', 'S07'],
    happiness: 90,
    backdrop: 'assets/backdrops/S05-dining.png',
    shader: 'bioluminescent_floor',
    lighting: { color: 0xf59e0b, intensity: 2.2, distance: 34, position: [45, 7.5, 45] },
    ambient: { color: 0x38bdf8, intensity: 0.65 }
  },
  {
    id: 'S06',
    slug: 'gallery',
    name: 'Hall of Wholesome Portraits',
    floor: '1F',
    coords: [-45, 0, 45],
    dimensions: [26, 10, 26],
    biome: 'estate',
    connections: ['S03', 'S20'],
    happiness: 95,
    backdrop: 'assets/backdrops/S06-gallery.png',
    shader: 'prismatic_refraction',
    lighting: { color: 0xec4899, intensity: 2.2, distance: 34, position: [-45, 7.5, 45] },
    ambient: { color: 0x38bdf8, intensity: 0.65 }
  },
  {
    id: 'S07',
    slug: 'bakery',
    name: 'Royal Bakery & Kitchen',
    floor: '1F',
    coords: [45, -14, -45],
    dimensions: [26, 10, 26],
    biome: 'kawaii',
    connections: ['S05', 'S17'],
    happiness: 80,
    backdrop: 'assets/backdrops/S07-bakery.png',
    shader: 'mechanical_gear_wall',
    lighting: { color: 0xf59e0b, intensity: 2.2, distance: 32, position: [45, -7.0, -45] },
    ambient: { color: 0xfde047, intensity: 0.6 }
  },
  {
    id: 'S19',
    slug: 'conservatory',
    name: 'Haunted Conservatory',
    floor: '1F',
    coords: [-90, 0, 0],
    dimensions: [26, 12, 26],
    biome: 'gothic',
    connections: ['S03', 'S20', 'S21'],
    happiness: 40,
    backdrop: 'assets/backdrops/S19-haunted-conservatory.png',
    shader: 'ivy_vein',
    lighting: { color: 0x7c3aed, intensity: 2.2, distance: 34, position: [-90, 7.5, 0] },
    ambient: { color: 0x581c87, intensity: 0.6 },
    props: ['overgrown_gothic_urn', 'withered_topiary_arch', 'ghostly_sconce']
  },
  {
    id: 'S20',
    slug: 'tea_salon',
    name: 'Tea Salon',
    floor: '1F',
    coords: [-90, 0, 45],
    dimensions: [24, 10, 24],
    biome: 'kawaii',
    connections: ['S19', 'S06'],
    happiness: 70,
    backdrop: 'assets/backdrops/S20-tea-salon.png',
    shader: 'bioluminescent_floor',
    lighting: { color: 0xf472b6, intensity: 2.2, distance: 34, position: [-90, 7.5, 45] },
    ambient: { color: 0xec4899, intensity: 0.7 },
    props: ['tiered_pastry_stand', 'kawaii_teapot_table', 'velvet_chaise']
  },
  {
    id: 'S21',
    slug: 'music_parlor',
    name: 'Music Parlor',
    floor: '1F',
    coords: [-90, 0, -45],
    dimensions: [26, 10, 26],
    biome: 'estate',
    connections: ['S19'],
    happiness: 65,
    backdrop: 'assets/backdrops/S21-music-parlor.png',
    shader: 'prismatic_refraction',
    lighting: { color: 0x22d3ee, intensity: 2.2, distance: 34, position: [-90, 7.5, -45] },
    ambient: { color: 0x38bdf8, intensity: 0.65 },
    props: ['grand_harpsichord', 'cello_stand', 'brass_horn_sconce']
  },

  // =========================================================================
  // 2F MEZZANINE & UPPER SUITES (S08 - S11)
  // =========================================================================
  {
    id: 'S08',
    slug: 'observatory',
    name: 'Celestial Observatory',
    floor: '2F',
    coords: [45, 12, 0],
    dimensions: [24, 12, 24],
    biome: 'crystal',
    connections: ['S01', 'S29'],
    happiness: 60,
    backdrop: 'assets/backdrops/S08-observatory.png',
    shader: 'star_trail_sky',
    lighting: { color: 0x38bdf8, intensity: 2.2, distance: 34, position: [45, 18.0, 0] },
    ambient: { color: 0x38bdf8, intensity: 0.7 }
  },
  {
    id: 'S09',
    slug: 'clocktower',
    name: 'Clocktower Sweet Suite',
    floor: '2F',
    coords: [-45, 12, 0],
    dimensions: [24, 14, 24],
    biome: 'estate',
    connections: ['S01', 'S28'],
    happiness: 65,
    backdrop: 'assets/backdrops/S09-clocktower.png',
    shader: 'mechanical_gear_wall',
    lighting: { color: 0xf59e0b, intensity: 2.2, distance: 34, position: [-45, 18.0, 0] },
    ambient: { color: 0xfde047, intensity: 0.6 }
  },
  {
    id: 'S10',
    slug: 'mastersuite',
    name: 'Royal Velvet Master Suite',
    floor: '2F',
    coords: [0, 12, 45],
    dimensions: [24, 10, 24],
    biome: 'kawaii',
    connections: ['S01', 'S11'],
    happiness: 100,
    backdrop: 'assets/backdrops/S10-mastersuite.png',
    shader: 'bioluminescent_floor',
    lighting: { color: 0xa855f7, intensity: 2.2, distance: 34, position: [0, 18.0, 45] },
    ambient: { color: 0x38bdf8, intensity: 0.65 }
  },
  {
    id: 'S11',
    slug: 'ballroom',
    name: 'Grand Crystal Ballroom',
    floor: '2F',
    coords: [0, 12, -45],
    dimensions: [26, 12, 26],
    biome: 'crystal',
    connections: ['S01', 'S10', 'S12'],
    happiness: 100,
    backdrop: 'assets/backdrops/S11-ballroom.png',
    shader: 'prismatic_refraction',
    lighting: { color: 0x38bdf8, intensity: 2.4, distance: 36, position: [0, 18.0, -45] },
    ambient: { color: 0x38bdf8, intensity: 0.7 }
  },

  // =========================================================================
  // 3F & 4F UPPER TOWERS & ROOFTOP (S12, S27, S28, S29)
  // =========================================================================
  {
    id: 'S12',
    slug: 'cathedral',
    name: 'Crystal Cathedral of Harmony',
    floor: '3F',
    coords: [0, 24, 0],
    dimensions: [26, 16, 26],
    biome: 'crystal',
    connections: ['S11', 'S27', 'S29'],
    happiness: 85,
    backdrop: 'assets/backdrops/S12-cathedral.png',
    shader: 'infinite_mirror',
    lighting: { color: 0xf59e0b, intensity: 2.5, distance: 38, position: [0, 30.0, 0] },
    ambient: { color: 0x38bdf8, intensity: 0.7 }
  },
  {
    id: 'S29',
    slug: 'mirror_maze_gallery',
    name: 'Mirror Maze Gallery',
    floor: '3F',
    coords: [45, 24, -45],
    dimensions: [24, 10, 24],
    biome: 'crystal',
    connections: ['S12', 'S08'],
    happiness: 55,
    backdrop: 'assets/backdrops/S29-mirror-maze-gallery.png',
    shader: 'infinite_mirror',
    lighting: { color: 0xa78bfa, intensity: 2.4, distance: 36, position: [45, 30.0, -45] },
    ambient: { color: 0x38bdf8, intensity: 0.7 },
    props: ['prismatic_mirror_frame', 'reflective_pedestal', 'gilded_obelisk']
  },
  {
    id: 'S27',
    slug: 'moonlit_rooftop',
    name: 'Moonlit Rooftop Garden',
    floor: '4F',
    coords: [0, 36, 0],
    dimensions: [30, 8, 30],
    biome: 'outdoor',
    connections: ['S12', 'S28'],
    happiness: 90,
    backdrop: 'assets/backdrops/S27-moonlit-rooftop.png',
    shader: 'star_trail_sky',
    lighting: { color: 0x38bdf8, intensity: 2.4, distance: 38, position: [0, 42.0, 0] },
    ambient: { color: 0x0f172a, intensity: 0.8 },
    props: ['rooftop_balustrade', 'astral_telescope', 'starlit_pergola']
  },
  {
    id: 'S28',
    slug: 'clock_tower_belfry',
    name: 'Clock Tower Belfry',
    floor: '4F',
    coords: [-45, 24, 0],
    dimensions: [20, 18, 20],
    biome: 'estate',
    connections: ['S09', 'S27'],
    happiness: 60,
    backdrop: 'assets/backdrops/S28-clock-tower-belfry.png',
    shader: 'mechanical_gear_wall',
    lighting: { color: 0xf59e0b, intensity: 2.2, distance: 36, position: [-45, 30.0, 0] },
    ambient: { color: 0xfde047, intensity: 0.6 },
    props: ['massive_bronze_bell', 'belfry_gearbox', 'perch_railing']
  },

  // =========================================================================
  // SUBTERRANEAN LEVELS B1 & B2 (S17, S18, S30, S31, S32)
  // =========================================================================
  {
    id: 'S17',
    slug: 'lab',
    name: 'Subterranean Sugar Lab',
    floor: 'B1',
    coords: [0, -14, -45],
    dimensions: [26, 10, 26],
    biome: 'subterranean',
    connections: ['S01', 'S07', 'S18'],
    happiness: 45,
    backdrop: 'assets/backdrops/S17-lab.png',
    shader: 'mechanical_gear_wall',
    lighting: { color: 0x06b6d4, intensity: 2.4, distance: 36, position: [0, -8.0, -45] },
    ambient: { color: 0x06b6d4, intensity: 0.6 }
  },
  {
    id: 'S18',
    slug: 'crypt',
    name: 'Whispering Crypt Boss Arena',
    floor: 'B2',
    coords: [0, -28, -45],
    dimensions: [28, 12, 28],
    biome: 'gothic',
    connections: ['S17', 'S30'],
    happiness: 30,
    backdrop: 'assets/backdrops/S18-crypt.png',
    shader: 'ice_crack_floor',
    lighting: { color: 0x22d3ee, intensity: 2.6, distance: 38, position: [0, -22.0, -45] },
    ambient: { color: 0x06b6d4, intensity: 0.6 }
  },
  {
    id: 'S30',
    slug: 'underground_river_cavern',
    name: 'Underground River Cavern',
    floor: 'B2',
    coords: [0, -42, -45],
    dimensions: [32, 12, 32],
    biome: 'subterranean',
    connections: ['S18', 'S31', 'S32'],
    happiness: 35,
    backdrop: 'assets/backdrops/S30-underground-river-cavern.png',
    shader: 'flowing_river',
    lighting: { color: 0x0284c7, intensity: 2.4, distance: 36, position: [0, -36.0, -45] },
    ambient: { color: 0x06b6d4, intensity: 0.6 },
    props: ['stalactite_pillars', 'cavern_stepping_stones', 'mineral_ledge']
  },
  {
    id: 'S31',
    slug: 'crystal_vault',
    name: 'Crystal Vault',
    floor: 'B2',
    coords: [45, -42, -45],
    dimensions: [24, 10, 24],
    biome: 'crystal',
    connections: ['S30'],
    happiness: 50,
    backdrop: 'assets/backdrops/S31-crystal-vault.png',
    shader: 'ice_crack_floor',
    lighting: { color: 0xa78bfa, intensity: 2.4, distance: 36, position: [45, -36.0, -45] },
    ambient: { color: 0x581c87, intensity: 0.65 },
    props: ['gilded_treasure_chest', 'floating_prismatic_shard', 'gem_pedestal']
  },
  {
    id: 'S32',
    slug: 'ancient_ruins',
    name: 'Ancient Ruins',
    floor: 'B2',
    coords: [-45, -42, -45],
    dimensions: [28, 12, 28],
    biome: 'gothic',
    connections: ['S30'],
    happiness: 35,
    backdrop: 'assets/backdrops/S32-ancient-ruins.png',
    shader: 'bioluminescent_floor',
    lighting: { color: 0x7c3aed, intensity: 2.4, distance: 36, position: [-45, -36.0, -45] },
    ambient: { color: 0x3b0764, intensity: 0.6 },
    props: ['broken_ionic_column', 'runed_altar_slab', 'ancient_stone_archway']
  },

  // =========================================================================
  // OUTDOOR OPEN GROUNDS (S13 - S16, S22 - S26)
  // =========================================================================
  {
    id: 'S13',
    slug: 'gatehouse',
    name: 'Sunset Carriage Gatehouse',
    floor: 'OUTDOOR',
    coords: [0, 0, 90],
    dimensions: [30, 14, 30],
    biome: 'outdoor',
    connections: ['S04', 'S14', 'S15', 'S16'],
    happiness: 80,
    backdrop: 'assets/backdrops/S13-gatehouse.png',
    shader: 'star_trail_sky',
    lighting: { color: 0xf59e0b, intensity: 2.2, distance: 36, position: [0, 8.0, 90] },
    ambient: { color: 0xf59e0b, intensity: 0.8 }
  },
  {
    id: 'S14',
    slug: 'reflection_pool',
    name: 'Grand Reflection Pool',
    floor: 'OUTDOOR',
    coords: [-45, 0, 90],
    dimensions: [28, 10, 28],
    biome: 'outdoor',
    connections: ['S13', 'S24'],
    happiness: 85,
    backdrop: 'assets/backdrops/S14-reflection_pool.png',
    shader: 'flowing_river',
    lighting: { color: 0x38bdf8, intensity: 2.2, distance: 36, position: [-45, 8.0, 90] },
    ambient: { color: 0xf59e0b, intensity: 0.8 }
  },
  {
    id: 'S15',
    slug: 'rose_maze',
    name: 'Topiary Rose Hedge Maze',
    floor: 'OUTDOOR',
    coords: [45, 0, 90],
    dimensions: [28, 10, 28],
    biome: 'outdoor',
    connections: ['S13', 'S23'],
    happiness: 75,
    backdrop: 'assets/backdrops/S15-rose_maze.png',
    shader: 'ivy_vein',
    lighting: { color: 0x10b981, intensity: 2.2, distance: 36, position: [45, 8.0, 90] },
    ambient: { color: 0x6ee7b7, intensity: 0.85 }
  },
  {
    id: 'S16',
    slug: 'gazebo',
    name: 'Starlight Pavilion Gazebo',
    floor: 'OUTDOOR',
    coords: [0, 0, 135],
    dimensions: [24, 12, 24],
    biome: 'outdoor',
    connections: ['S13', 'S22'],
    happiness: 90,
    backdrop: 'assets/backdrops/S16-gazebo.png',
    shader: 'star_trail_sky',
    lighting: { color: 0xec4899, intensity: 2.2, distance: 36, position: [0, 8.0, 135] },
    ambient: { color: 0xf59e0b, intensity: 0.8 }
  },
  {
    id: 'S22',
    slug: 'village_district',
    name: 'Village District',
    floor: 'OUTDOOR',
    coords: [0, 0, 180],
    dimensions: [36, 12, 36],
    biome: 'outdoor',
    connections: ['S16', 'S25', 'S26'],
    happiness: 70,
    backdrop: 'assets/backdrops/S22-village-district.png',
    shader: 'flowing_river',
    lighting: { color: 0xf59e0b, intensity: 2.2, distance: 36, position: [0, 8.0, 180] },
    ambient: { color: 0xf59e0b, intensity: 0.8 },
    props: ['cobblestone_well', 'thatched_cottage_facade', 'village_lamp_post']
  },
  {
    id: 'S23',
    slug: 'sacred_forest_trail',
    name: 'Sacred Forest Trail',
    floor: 'OUTDOOR',
    coords: [90, 0, 135],
    dimensions: [32, 14, 32],
    biome: 'forest',
    connections: ['S15', 'S25'],
    happiness: 65,
    backdrop: 'assets/backdrops/S23-sacred-forest-trail.png',
    shader: 'ivy_vein',
    lighting: { color: 0x10b981, intensity: 2.2, distance: 36, position: [90, 8.0, 135] },
    ambient: { color: 0x064e3b, intensity: 0.8 },
    props: ['ancient_moss_stone', 'whispering_tree_trunk', 'forest_shrine']
  },
  {
    id: 'S24',
    slug: 'harbor_docks',
    name: 'Harbor Docks',
    floor: 'OUTDOOR',
    coords: [-90, 0, 135],
    dimensions: [32, 10, 32],
    biome: 'maritime',
    connections: ['S14', 'S26'],
    happiness: 70,
    backdrop: 'assets/backdrops/S24-harbor-docks.png',
    shader: 'flowing_river',
    lighting: { color: 0x0284c7, intensity: 2.4, distance: 36, position: [-90, 8.0, 135] },
    ambient: { color: 0x0284c7, intensity: 0.75 },
    props: ['wooden_mooring_post', 'nautical_anchor', 'cargo_barrel_stack']
  },
  {
    id: 'S25',
    slug: 'moonlit_meadow',
    name: 'Moonlit Meadow',
    floor: 'OUTDOOR',
    coords: [45, 0, 180],
    dimensions: [32, 10, 32],
    biome: 'outdoor',
    connections: ['S22', 'S23'],
    happiness: 85,
    backdrop: 'assets/backdrops/S25-moonlit-meadow.png',
    shader: 'star_trail_sky',
    lighting: { color: 0x38bdf8, intensity: 2.2, distance: 36, position: [45, 8.0, 180] },
    ambient: { color: 0x1e1b4b, intensity: 0.75 },
    props: ['starlight_monolith', 'wildflower_patch', 'luminescent_cairn']
  },
  {
    id: 'S26',
    slug: 'crystal_grotto',
    name: 'Crystal Grotto',
    floor: 'OUTDOOR',
    coords: [-45, 0, 180],
    dimensions: [30, 12, 30],
    biome: 'crystal',
    connections: ['S22', 'S24'],
    happiness: 75,
    backdrop: 'assets/backdrops/S26-crystal-grotto.png',
    shader: 'prismatic_refraction',
    lighting: { color: 0xa78bfa, intensity: 2.4, distance: 36, position: [-45, 8.0, 180] },
    ambient: { color: 0x581c87, intensity: 0.7 },
    props: ['giant_amethyst_cluster', 'quartz_geode_stalagmite', 'bioluminescent_pond_rim']
  }
];
```

---

## 5. Illustrated 2.5D Backdrop Sprite System (`src/world/backdrops.js`)

### 5.1 Architecture & Render Pipeline
1. **Geometry**: Quad rendered via `THREE.PlaneGeometry(width, height)`.
2. **Depth & Sorting**:
   - `renderOrder = -1`
   - `material.depthWrite = false`
   - `material.transparent = true`
3. **Texture Lifecycle & VRAM Budget**:
   - `MAX_ACTIVE_BACKDROPS = 3`
   - LRU cache queue: Upon transitioning to sector $S_k$, load $S_k$ backdrop and preload immediate neighbors.
   - If active textures > 3, dispose least-recently used texture via `texture.dispose()` and `material.dispose()`.
4. **GLSL Fallback Gradient**:
   - If image is loading, missing, or in low-spec fallback mode, a procedural vertex/fragment gradient shader is bound:
   ```glsl
   // Vertex
   varying vec2 vUv;
   void main() {
     vUv = uv;
     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
   }
   // Fragment
   uniform vec3 uTopColor;
   uniform vec3 uBottomColor;
   varying vec2 vUv;
   void main() {
     vec3 grad = mix(uBottomColor, uTopColor, smoothstep(0.0, 1.0, vUv.y));
     gl_FragColor = vec4(grad, 1.0);
   }
   ```

---

## 6. Per-Sector GLSL Surface Shaders (`src/world/shaders/surface-shaders.js`)

### 6.1 The 8 Procedural GLSL Materials

1. **`ivy_vein` (Creeping Foliage & Pulse)**
   - *Formula*: $f(p, t) = \text{FBM}(p \cdot 4.0) + 0.3 \sin(p.y \cdot 12.0 + t \cdot 1.5)$
   - *Role*: Simulates living ivy growth, vein pulse, and chlorophyll flow.
2. **`bioluminescent_floor` (Glowing Lichen & Stepping Ripples)**
   - *Formula*: $L(p, t) = \text{Voronoi}(p \cdot 2.5) \cdot (\sin(t \cdot 2.0 + \text{hash}(p) \cdot 6.28) \cdot 0.5 + 0.5)$
   - *Role*: Pulsating organic bioluminescence with luminous stepping rings.
3. **`prismatic_refraction` (Crystal Caustic & Dispersion)**
   - *Formula*: Chromatic offset $\Delta \lambda = \text{vec3}(-0.02, 0.0, 0.02) \cdot \text{Fresnel}(V, N, 4.0)$
   - *Role*: Shimmering diamond refractions, chromatic dispersion, and specular facets.
4. **`flowing_river` (Water Flow & Turbulent Foam)**
   - *Formula*: Dual-layer Voronoi caustic + directional flow vector $p' = p + \text{vec2}(t \cdot 0.15, t \cdot 0.08)$
   - *Role*: Flowing rivers, reflection basins, and pond ripples.
5. **`star_trail_sky` (Cosmic Vortex & Stellar Motes)**
   - *Formula*: Polar swirl $\theta' = \theta + \frac{t \cdot 0.1}{r + 0.2}$, with exponential stellar noise $S = \text{noise3D}(p)^{14.0} \cdot 20.0$
   - *Role*: Starlit gazebos, rooftop observatory domes, and cosmic skies.
6. **`ice_crack_floor` (Subsurface Frost Fractures)**
   - *Formula*: Edge Voronoi $d_2 - d_1 < 0.08 \implies$ glowing fracture emission.
   - *Role*: Frosty crystal vaults and subterranean crypt boss floors.
7. **`mechanical_gear_wall` (Interlocking Brass Gears)**
   - *Formula*: 2D Gear SDF $d(r, \phi) = r - (R_0 + A \cdot \text{sign}(\sin(N \cdot (\phi + \omega t))))$
   - *Role*: Clocktower gearboxes, sugar dynamos, and belfry mechanics.
8. **`infinite_mirror` (Recursive Mirror Corridor)**
   - *Formula*: Parallax ray reflection steps $C = \sum_{k=1}^{6} w_k \cdot T(uv \cdot (1.0 + k \cdot 0.18))$
   - *Role*: Mirror maze gallery and cathedral halls.

### 6.2 Performance Budget & Sector Flag
- **Sector-Flag Guard**: In `src/main.js`, each animation frame updates uniforms ONLY for `activeSector` and `1 adjacentSector`.
- **Fallback**: Inactive sectors are mapped to lightweight `THREE.MeshStandardMaterial`.
- **Telemetry Guard**: Monitored via `window.__perfMetrics.frameTimeMs <= 5.0ms`.

---

## 7. Holographic Blueprint Map v2 (`src/systems/minimap.js` / `map.js`)

### 7.1 Floor Hierarchy & Tab Routing
- 7 Floors: `4F` (2 sectors), `3F` (2 sectors), `2F` (4 sectors), `1F` (10 sectors), `B1` (2 sectors), `B2` (4 sectors), `OUTDOOR` (9 sectors). Total = 32 sectors (with S07 crossing 1F/B1, Cathedral 3F).
- Viewport SVG: 800x500 coordinate space with auto-scaled sector rects.
- Biome fill styles: Translucent frosted glass matching biome tokens (`rgba(..., 0.45)` with `stroke-width: 2.5`).
- Connection paths: `<path d="..." stroke="#22d3ee" stroke-dasharray="6,6" class="map-conduit"/>`.
- DOM Node Budget: `<= 200 SVG DOM elements` per active floor layer via selective layer visibility.

---

## 8. New Chamber Geometry for S19–S32 (14 Sectors)

| Sector ID | Chamber Name | Dimensions (W,H,D) | Floor Spec | Wall Spec | Decorative 3D Props (2+) | Point Light (Color, Int, Dist) |
|---|---|---|---|---|---|---|
| S19 | Haunted Conservatory | 26 x 12 x 26 | Dark gothic tile | Victorian window arch, ivy stone | Overgrown Gothic Urn, Withered Topiary Arch, Ghostly Sconce | `0x7c3aed`, 2.2, 34 |
| S20 | Tea Salon | 24 x 10 x 24 | Kawaii pink marble | Rose pastel paneling | Tiered Porcelain Pastry Stand, Kawaii Teapot Table, Velvet Chaise | `0xf472b6`, 2.2, 34 |
| S21 | Music Parlor | 26 x 10 x 26 | Polished oak parquet | Acoustic wood fluting, gold sconces | Grand Harpsichord, Cello Stand, Brass Horn Sconce | `0x22d3ee`, 2.2, 34 |
| S22 | Village District | 36 x 12 x 36 | Cobblestone pavement | Open sky, cottage facades | Cobblestone Well, Thatched Cottage Facade, Village Lamp Post | `0xf59e0b`, 2.2, 36 |
| S23 | Sacred Forest Trail | 32 x 14 x 32 | Mossy soil plane | Dense tree trunk perimeter | Ancient Moss Stone, Whispering Tree Trunk, Forest Shrine | `0x10b981`, 2.2, 36 |
| S24 | Harbor Docks | 32 x 10 x 32 | Weathered dock planks | Ocean water boundary, wood pilings | Wooden Mooring Post, Nautical Anchor, Cargo Barrel Stack | `0x0284c7`, 2.4, 36 |
| S25 | Moonlit Meadow | 32 x 10 x 32 | Wildflower grass plane | Low stone walls, starlit horizon | Starlight Monolith, Wildflower Patch, Luminescent Cairn | `0x38bdf8`, 2.2, 36 |
| S26 | Crystal Grotto | 30 x 12 x 30 | Amethyst cavern rock | Crystalline cavern walls | Giant Amethyst Cluster, Quartz Geode Stalagmite, Bioluminescent Pond Rim | `0xa78bfa`, 2.4, 36 |
| S27 | Moonlit Rooftop | 30 x 8 x 30 | Manor slate rooftop | Marble balustrade perimeter, open sky | Rooftop Balustrade, Astral Telescope, Starlit Pergola | `0x38bdf8`, 2.4, 38 |
| S28 | Clock Tower Belfry | 20 x 18 x 20 | Brass grating platform | Heavy timber belfry walls, clock dial | Massive Bronze Bell, Belfry Gearbox, Perch Railing | `0xf59e0b`, 2.2, 36 |
| S29 | Mirror Maze Gallery | 24 x 10 x 24 | Polished obsidian mirror | Mirrored glass panels, gold frames | Prismatic Mirror Frame, Reflective Pedestal, Gilded Obelisk | `0xa78bfa`, 2.4, 36 |
| S30 | Underground River Cavern | 32 x 12 x 32 | Damp cavern rock & river | Stalactite rock walls | Stalactite Ceiling Pillars, Cavern Stepping Stones, Mineral Ledge | `0x0284c7`, 2.4, 36 |
| S31 | Crystal Vault | 24 x 10 x 24 | Gilded mosaic tile | Gemstone encrusted vault walls | Gilded Treasure Chest, Floating Prismatic Shard, Gem Pedestal | `0xa78bfa`, 2.4, 36 |
| S32 | Ancient Ruins | 28 x 12 x 28 | Cracked ancient flagstones | Weathered ionic colonnades | Broken Ionic Column, Runed Altar Slab, Ancient Stone Archway | `0x7c3aed`, 2.4, 36 |

---

## 9. NEXUS PRIVÉ v6.0 Zero-Emoji Compliance Matrix

- **Prohibition**: Zero standard unicode emoji points (`0x1F300`–`0x1FAFF`, `0x1F600`–`0x1F64F`, `0x1F680`–`0x1F6FF`) in any source, asset, markdown, or HTML file.
- **Permitted Glyphs**: `[LOCKED]`, `[LOCKED]`, `[LOCKED]`, `[LOCKED]`, `[LOCKED]`, `•`, `[LOCKED]`, `[LOCKED]`, `[LOCKED]`, `[LOCKED]`, `[LOCKED]`, `[LOCKED]`, `[LOCKED]`, `[LOCKED]`, `[LOCKED]`, `[LOCKED]`, `[LOCKED]`, `[LOCKED]`, `[LOCKED]`, `[LOCKED]`, `[LOCKED]`, `[LOCKED]`, `[LOCKED]`, `[LOCKED]`, `[LOCKED]`, `[LOCKED]`, `–`, `—`, `’`, `“`, `”`, `…`, `·`, `©`, `®`, `™`, `±`, `×`, `÷`, `≤`, `≥`, `≠`, `°`.
- **Validation**: Enforced via `tests/test_e2e_shaders_fx.py` automated scanner.

---
*Resident Lovely v2.0.0 Specification Survey | Converged & Approved | NEXUS PRIVÉ v6.0*

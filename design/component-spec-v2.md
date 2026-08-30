# ❖ RESIDENT LOVELY — COMPONENT SPECIFICATION v2.0
## NEXUS PRIVÉ v6.0 UI/UX Standard · 32-Sector Tactical Architecture

---

### 1. Component: `TacticalBlueprintMap`
- **Module**: `src/systems/map.js`
- **Container**: `#blueprintModal` (fixed overlay, `z-index: 1000`)
- **Visuals**: Obsidian glassmorphism background (`rgba(5,7,10,0.88)`), CRT scanlines (`.crt-overlay`), SVG viewport with procedural rendering.
- **Props**:
  - `sectors`: Array of 32 sector descriptor objects.
  - `activeSectorId`: ID of the chamber currently occupied by the player.
  - `selectedFloor`: Active floor tab (`4F`, `3F`, `2F`, `1F`, `B1`, `B2`, `OUTDOOR`).
- **Events**:
  - `onSectorSelect(sectorId)`: Updates telemetry sidebar and pans view.
  - `onFloorSwitch(floorKey)`: Switches active SVG node tree.
  - `onDeployBeacon(coords)`: Places navigation waypoint for player HUD radar.

---

### 2. Component: `DiegeticTelemetrySidebar`
- **Fields**: Sector Name, Coordinates (`x,y,z`), Biome Chromatic Tag, Grumps Plushie Count, PBR Shader Key, Happiness % Bar.
- **Interaction**: Keyboard navigable (Tab / Shift-Tab, Enter to select).
- **Sound Feedback**: Procedural Web Audio synthesizer tone (`880Hz` select beep, `440Hz->880Hz` dual chirp on beacon deploy).

---

### 3. Component: `SectorBackdropQuad`
- **Module**: `src/world/backdrops.js`
- **Geometry**: `THREE.PlaneGeometry(120, 80)`
- **Material**: `THREE.MeshBasicMaterial` with `depthWrite: false`, `transparent: true`, `renderOrder: -1`.
- **Lifecycle**: Lazy-loaded upon chamber entry; disposed via `map.dispose()` and `material.dispose()` upon exiting adjacent sector radius. Max 3 active textures.

---

### 4. Component: `PBRSurfaceShader`
- **Module**: `src/world/shaders/surface-shaders.js`
- **Uniforms**: `uTime`, `uColor`, `uRoughness`, `uNormalPerturb`, `uResolution`.
- **Budget**: Only 1 heavy GLSL shader + 1 adjacent chamber shader active per frame. Others clamped to baseline `MeshStandardMaterial`.

---
*NEXUS PRIVÉ v6.0 | Strict Zero-Emoji Protocol*

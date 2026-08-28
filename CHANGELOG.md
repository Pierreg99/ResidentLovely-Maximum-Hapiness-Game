# CHANGELOG: RESIDENT LOVELY ❖ MAXIMUM HAPPINESS 3D

All notable changes to **Resident Lovely** are documented in this file.  
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and adheres to the **NEXUS PRIVÉ v6.0 / Zero-Emoji Standard**.

---

## [2.0.0] - 2026-08-28 ❖ GRAND ESTATE MASTERWORK EXPANSION

### Added
- **7-Chamber Grand Estate Architecture**:
  - **Grand Foyer 2F Mezzanine Balconies**: Wraparound upper walkways (Y = 4.5) with golden heart-filigree balustrades, connected to 1F via the Grand Staircase.
  - **East Wing 2F — Celestial Observatory**: Midnight indigo dome with 28 glowing star constellation nodes, rotating Brass Armillary Astrolabe (equatorial and ecliptic rings), and brass stargazer telescope.
  - **West Wing 2F — Clocktower Sweet Suite**: Monumental Roman numeral wall clock with spinning escapement gear, oscillating brass pendulum, and royal canopied velvet bed.
  - **North Wing 1F — Courtyard Tea Greenhouse**: Victorian glass pavilion, porcelain tea table set, sculpted topiary bunny hedges, and harvestable Prismatic Sugar Crystal cluster.
  - **Subterranean B1 — Sugar Alchemy Lab & Confectionery Boiler**: Glowing neon cyan/magenta syrup pipelines, automated conveyor oven, alembic distillation glassware, and Master Joy Dynamo Generator.
- **Expanded Quest & Progression System (6 Quests)**:
  - Added Quest 4 (*Celestial Astrolabe*) and Quest 5 (*Subterranean Sugar Dynamo*).
  - Scaled total plushie Grump encounters to 10 across all 7 wings.
- **3-Tier Interactive Tactical Blueprint Engine**:
  - Added floorplan switching across `1F (Ground)`, `2F (Mezzanine & Towers)`, and `B1 (Subterranean Lab)`.
  - Comprehensive sector telemetry inspection and real-time live player beacon coordinates.
- **Next-Gen Visual & Lighting Pipeline**:
  - Volumetric Starlight light cones in the Observatory dome and animated Stained-Glass Caustic floor projection in the Grand Foyer.
  - Dedicated multi-room point lights and room-adaptive ambient atmosphere.

---

## [1.7.0] - 2026-08-27

### Added
- **Kawaii Holographic Blueprint & Master Tactical Map Engine**:
  - Multi-level floor selector for Floor 1F (Ground Floor) and Floor 2F (Balconies & Mezzanine).
  - High-res vector SVG blueprint displaying checkerboard rotunda, Grand Concert Piano, save gramophones, bubbling alchemical cauldron, and tiered marble fountain.
  - Interactive room inspection: Clicking/tapping any chamber highlights its perimeter and updates real-time sector telemetry (happiness %, unresolved puzzles, Grump entity count).
  - Live animated S.M.I.L.E. Agent beacon with expanding radar pulse rings and direction arrow.
  - Surveillance optical feed preview with CRT scanlines and live camera badges.
- **Master UI/UX Design System Showcase**:
  - `~/projects/cryo-omega/design/resident-lovely/map-design-system.html` (Standalone master interactive map design system showcase).
  - `~/projects/cryo-omega/design/resident-lovely/map-component-spec.md` (Design tokens, component specs, typography, accessibility audit).
  - `~/projects/cryo-omega/design/resident-lovely/a11y-report.md` (WCAG 2.1 AAA Accessibility Report).

---

## [1.6.2] - 2026-08-27

### Added
- **Dual-Smoothing Camera Engine**:
  - Smoothly interpolates both camera position and lookAt target (`lerp(0.18)`), eliminating all camera jitter, tilting snaps, and disorientation.
  - Added wall collision clamping per room (`±12.2m` in Foyer, `±10.2m` in Library, `±11.2m` in Solarium).
- **Grump Knockback & Health Bar Billboarding**:
  - Propels hit enemies away from player along `+Z` sightline.
  - Overhead health bars billboard dynamically towards the active camera angle.

---

## [1.6.0] - 2026-08-27

### Added
- **3-Mode Camera Engine (Classic Fixed / 360° OTS / First-Person ADS)**.
- **Dynamic Holographic Sights & Target Lock-On**.
- **180° Quick-Turn & Orbit Touch Controls**.

---

## [1.5.0] - 2026-08-27

### Added
- **Volumetric God Rays & Atmospheric Shading**.
- **Baroque Architecture & Room Aesthetics**.

---

## [1.4.0] - 2026-08-27

### Added
- **Expressive Kawaii Chibi "Agent Joy" Character Model**.
- **Squash-and-Stretch Kawaii Grump AI**.
- **3D Item Inspection Modal & Typewriter Save Dialog**.
- **Expanded 3-Tier Herb Alchemy**.

---

## [1.0.0] - 2026-08-27

### Added
- **Core 3D WebGL Engine & 8-Slot Inventory Grid**.

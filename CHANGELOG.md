# CHANGELOG: RESIDENT LOVELY ❖ MAXIMUM HAPPINESS 3D

All notable changes to **Resident Lovely** are documented in this file.  
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and adheres to the **NEXUS PRIVÉ v6.0 / Zero-Emoji Standard**.

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

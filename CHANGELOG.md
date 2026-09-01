# CHANGELOG: RESIDENT LOVELY ❖ MAXIMUM HAPPINESS 3D

All notable changes to **Resident Lovely** are documented in this file.  
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and adheres to the **NEXUS PRIVÉ v6.1 / Zero-Emoji Standard**.

## [6.1.0] - 2026-09-01 ❖ MASTER TOUCH CONTROLS, REALISTIC ASSETS & FAST-TRAVEL NETWORK

### Added & Enhanced
- **Master Mobile Touch Virtual Controls** (`src/engine/input.js`, `index.html`):
  - Dynamic Floating Analog Joystick with thumb-centering, smooth deadzone, and 48px drag boundary.
  - Multi-touch action cluster with haptic feedback (`triggerHaptic`) on `[E] Examine`, `[F] Joy Fire`, `[Z] 180° Turn`, `[G] Weapon Cycle`, `[I] Inventory`, and `[M] Map`.
- **Realistic Kawaii Character & Map Assets** (`src/entities/player.js`, `src/world/rooms.js`):
  - Agent Joy upgraded with golden shoulder epaulets, knee-high tactical boots with silver buckles, dual holster straps, specular catchlights, and bouncing hair dynamics.
  - Grand Interconnecting Colonnades (`createConnectingColonnade`) with polished marble floors, gilded pillars, and open archway line-of-sight between Foyer, Library, Solarium, and Greenhouse.
  - Confectionery 3D Props in Royal Bakery: 5-tier pastel macarons and giant strawberry swirl lollipops.
- **Holographic Blueprint Map Fast-Travel Network** (`src/systems/minimap.js`, `src/main.js`):
  - Double-click fast travel on any chamber node across all 7 floor tabs with harmonic chime and instant room warping.
  - Global `window.__changeRoom` hook with seamless GLSL shader and backdrop parallax synchronization.
- **Sweet Confectionery Quests & Alchemy Recipes** (`src/systems/quests.js`, `src/systems/inventory.js`):
  - Added Quest 11 (*Sweet Confectionery Grand Prix*) and Quest 12 (*The Great Joy Squad Parade*).
  - Added Rainbow Starlight Macaron, Sparkle Cotton Candy, and Hyper Bliss Confection crafting recipes.
- **Automated Verification**:
  - 237 / 237 automated tests passing (100% OK) across all 10 test suites.

---

## [6.0.0] - 2026-09-01 ❖ ADVANCED MODES & ROGUELIKE EXPANSION

### Added & Enhanced
- **Endless Dimension Roguelike Engine** (`src/systems/endless_generator.js`):
  - Procedural floor generation across 7 biomes (`estate`, `gothic`, `kawaii`, `subterranean`, `crystal`, `astronomical`, `clockwork`).
  - 5 procedural blessing modifiers (`Joy Surge`, `Sparkle Haste`, `Balloon Bounty`, `Prismatic Aura`, `Grump Swarm`).
  - Depth-scaling difficulty, randomized reward loot drops, and floor completion score multipliers.
- **Time-Attack Speedrun Mode & HUD** (`src/systems/game_modes.js`):
  - In-game precision split timer HUD with Personal Best (PB) persistence in `localStorage`.
  - Boss split checkpoint recording (`recordSplit`) and mode switching API (`setMode`).
- **AI Companion Dialogue System** (`src/systems/ai_dialogue.js`):
  - Multi-companion personality fallback database for Agent Joy, Gloom Bear, Bun-Bun, and Master Chef.
  - Contextual triggering for combat encounters, low joy vitality, boss battles, and endless dimension navigation.
- **Automated Verification**:
  - Added `tests/test_v6_advanced_modes.py` with 8 dedicated unit test cases.
  - 227/227 total unit and adversarial stress tests passing (100% OK).

---

## [5.0.0] - 2026-08-30 ❖ CRYO OMEGA v5.0 UNIFIED MAJOR UPGRADE

### Added & Upgraded
- **Full-Spectrum Engine Unification**:
  - Full convergence with **CRYO OMEGA v5.0 UNIFIED** and the 1,002 multi-agent swarm architecture.
  - 32-Sector 7-Floor World Architecture (`4F`, `3F`, `2F`, `1F`, `B1`, `B2`, `OUTDOOR`) with seamless biome lighting.
  - Per-sector procedural GLSL shaders (Bioluminescent, Ivy Vein, Flowing River, Celestial Nebula, Crystal Cavern).
  - 3-Phase Tactical Boss Encounter: *The Grumpy Master Chef* (Rolling Pin Waves, Confectionery Barrage, Sugar Valve Crisis).
  - 4-Tier Follower Companion Joy Parade squad dynamics with petting (+25% speed buff) and Mega Bliss Cupcake feeding.
  - Native ESM multi-module architecture with zero runtime bundling overhead and 60 FPS mobile WebGL target.
  - 100% Zero-Emoji Protocol compliance across all UI, HUD, and SVG tactical floorplans.


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

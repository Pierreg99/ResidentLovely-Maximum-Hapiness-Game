# CHANGELOG: RESIDENT LOVELY ❖ MAXIMUM HAPPINESS 3D

All notable changes to **Resident Lovely** are documented in this file.  
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and adheres to the **NEXUS PRIVÉ v6.0 / Zero-Emoji Standard**.

---

## [1.4.0] - 2026-08-27

### Added
- **Expressive Kawaii Chibi "Agent Joy" Character Model**:
  - Smooth chibi head proportions with large glossy dark anime eyes and dual specular highlight stars.
  - Rosy pink blush cheeks (`#f472b6`) and gold S.M.I.L.E. star belt buckle.
  - Animated twin-tail pigtails that oscillate with real-time spring physics while sprinting.
  - Tactile foot-hop running animation cycle.
- **Squash-and-Stretch Kawaii Grump AI**:
  - *Gloom Bear*: Fluffy plush bear with stitched patch textures, big teary anime eyes that morph into starry golden sparkle eyes upon being uplifted. Real-time mesh squash-and-stretch deformation on joy impacts.
  - *Sighing Specter*: Translucent marshmallow ghost with heart-shaped ribbons and soft lavender glow.
  - *Chibi Gilded Knight*: Plush knight with toy shield, oversized cardboard-gold helmet with bouncing pink plume.
- **Authentic Resident Evil Parody Mechanics**:
  - **180° Quick-Turn**: Instant pivot (`Z` key or `[180° TURN]` touch button) with swoosh audio and camera whip.
  - **3D Item Inspection Modal (`★ 3D INSPECT`)**: Dedicated 3D Three.js orbit viewer allowing 360-degree rotation and examination of inventory items to reveal hidden inscriptions and lore.
  - **Authentic Typewriter / Gramophone Save Dialog**: Interactive save modal ("Will you record your joyful journey in the Grand Chronicle?") with synthesized mechanical typewriter keystrokes and carriage return bell.
  - **Expanded 3-Tier Herb Alchemy**:
    - `Green + Green` ➔ `Double Sparkle Herb` (70% Joy)
    - `Green + Red` ➔ `Mega Bliss Cupcake` (100% Joy)
    - `Double Green + Green` ➔ `Ultra Joy Elixir` (100% Joy + Star Shield)
- **Baroque Architecture & Kawaii PBR Upgrades**:
  - Stained-glass rose windows casting vibrant pink light on ballroom walls.
  - Blooming kawaii rose bushes with pink blossoms in the Solarium Garden.
  - High-gloss obsidian lacquer on the Grand Concert Piano.
- **Master Game Design Document (DOCX)**:
  - Generated `docs/Resident_Lovely_Master_Game_Design_Document.docx` covering complete systems, lore, and mathematical balancing.

### Changed
- Refactored `src/entities/player.js` to support dual-state aiming and 180-degree quick-turning interpolation.
- Upgraded projectile collision geometry in `src/weapons/arsenal.js` for enhanced hit detection accuracy.

---

## [1.3.0] - 2026-08-27

### Added
- **ESM Multi-Module Architecture Decoupling**:
  - Decoupled single monolithic file into 15 cleanly organized ECMAScript Modules:
    - `src/main.js`: Main lifecycle & animation loop coordinator.
    - `src/engine/audio.js`: Sound synthesis engine.
    - `src/engine/input.js`: Input matrix & virtual joystick.
    - `src/engine/camera.js`: Chase camera & screen trauma decay.
    - `src/world/scene.js`: Three.js scene, lighting, and confetti particle pool.
    - `src/world/rooms.js`: Procedural room builders (Foyer, Library, Solarium Garden).
    - `src/world/destructibles.js`: Breakable balloons & gift boxes.
    - `src/entities/player.js`: Player model & movement physics.
    - `src/entities/grump.js`: Grump AI state machines & happiness gauges.
    - `src/weapons/arsenal.js`: 4-weapon projectile physics & beam raycasting.
    - `src/systems/inventory.js`: 8-slot inventory grid & combine recipes.
    - `src/systems/quests.js`: Multi-tier quest chain & objective HUD.
    - `src/systems/minimap.js`: Rotating radar mini-map & estate blueprint.
    - `src/systems/persistence.js`: Save/load storage snapshotting.
  - `css/style.css`: Dedicated stylesheet with NEXUS PRIVÉ v6.0 glassmorphic tokens.

### Performance
- Optimized Three.js garbage collection by reusing geometry buffers and clamping mobile DPR at 1.5x.

---

## [1.2.0] - 2026-08-27

### Added
- **4-Weapon Wholesome Arsenal System**:
  - `Mk-IV Confetti Pistol`: Rapid precision sparkly darts with gold muzzle flashes.
  - `Pastry Bubble Shotgun`: 5-pellet bubble spread with buoyant physics trapping enemies inside soap bubbles.
  - `Confectionery Mortar`: Arcing ballistic cupcake missile with 360° confetti shockwave and screen shake.
  - `Prismatic Joy Beam`: Continuous neon rainbow laser beam with real-time cylinder mesh & polyphonic synth audio hum.
- **Weapon Switching Dock & Quick Cycling**:
  - Touch HUD dock with SVG weapon silhouettes.
  - Keyboard number shortcuts (`1`, `2`, `3`, `4`) and cycle button (`[GUN]`).
- **Interactive Radar Mini-Map HUD**:
  - 360-degree rotating radar scan with room boundaries.
  - Player orientation cone and live entity blips (Blue = Gloomy, Gold = Dancing, Magenta = Destructibles).
- **Fullscreen Estate Architectural Blueprint Modal**:
  - Interactive SVG floorplan of *Château de la Joie* with dynamic door lock states (`[LOCK]` / `[OPEN]`).
  - Active player pinpoint coordinates indicator (`[▶] S.M.I.L.E. Agent`).
- **Destructible Environmental Objects**:
  - Floating pastel balloons in room corners; shoot to pop and drop surprise treats.
  - Gilded gift chests that fracture on hit.
- **Dynamic PointLight Muzzle Flashes**:
  - Colored point lights casting real-time illumination on room walls during weapon fire.

---

## [1.1.0] - 2026-08-27

### Added
- **Multi-Tier Quest & Task Engine**:
  - `Quest 1: The Foyer Sonatina` (Piano triad sequence `[C-E-G]`).
  - `Quest 2: Alchemical Bliss Brew` (Library cauldron activation).
  - `Quest 3: Solarium Heart Lanterns` (4 Heart Lantern ignition).
  - `Quest 4: Château Joy Brigade` (Uplift 5 Grumps and save progress).
  - Dedicated `[QUESTS]` log modal with interactive task completion checkboxes.
- **Procedural 3D Baroque Assets**:
  - Grand Concert Piano with playable keys and sound generator.
  - Alchemical Golden Cauldron with bubbling magenta liquid and steam particles.
  - Solarium Marble Gazebo and 4 Heart Lanterns.
- **3 Diverse Grump Variants**:
  - Gloom Bear, Sighing Specter, Gilded Knight.

---

## [1.0.0] - 2026-08-27

### Added
- **Core 3D WebGL Engine**:
  - Single-file Three.js (r128) architecture with soft shadow mapping and DPR capping.
  - Over-the-shoulder chase camera with aim zoom and laser sight line.
- **Mobile-First Virtual Touch Controls**:
  - Floating dynamic virtual analog joystick for 360-degree movement.
  - Right-screen touch drag for camera rotation.
  - Tactile action buttons for Aim, Joy Blast, Examine, Items, and Audio.
- **Classic 8-Slot Inventory System (Resident Evil Parody)**:
  - 4x2 glassmorphic slot grid with item inspection and discard.
  - Combine recipe engine (`Sparkle Herb` + `Sweet Powder` = `Mega Bliss Cupcake`).
  - Pulsing ECG Vitality monitor (`MAX BLISS` ➔ `CHEERFUL` ➔ `GRUMPY`).
- **Procedural Web Audio Engine**:
  - Confetti blast pop, arpeggio cheers, gramophone lullabies, and door chimes.
- **Save System**:
  - Golden Gramophone save station with `localStorage` state persistence.
- **NEXUS PRIVÉ v6.0 Standard**:
  - Obsidian base (`#05070a`), cyan (`#22d3ee`), gold (`#f59e0b`), emerald (`#10b981`), magenta (`#ec4899`).
  - 100% Zero-Emoji enforcement across all UI and documentation.

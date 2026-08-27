# CHANGELOG: RESIDENT LOVELY

All notable changes to **Resident Lovely** are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and adheres to the **NEXUS PRIVÉ v6.0 / Zero-Emoji Standard**.

---

## [1.2.0] - 2026-08-27

### Added
- **4-Weapon Cute Arsenal System**:
  - `Mk-IV Confetti Pistol`: Rapid precision sparkly darts with gold muzzle flash.
  - `Pastry Bubble Shotgun`: 5-pellet bubble spread with buoyant physics that traps Grumps inside floating soap bubbles.
  - `Confectionery Mortar`: Arcing ballistic 3D cupcake missile with 360-degree confetti shockwaves.
  - `Prismatic Joy Beam`: Continuous neon rainbow laser beam with real-time cylinder mesh & polyphonic synth audio hum.
- **Weapon Switching Dock & Quick Cycling**:
  - Touch HUD dock with SVG weapon silhouettes.
  - Keyboard number shortcuts (`1`, `2`, `3`, `4`) and cycle button (`[GUN]`).
- **Interactive Radar Mini-Map HUD**:
  - 360-degree rotating radar sweep with room boundaries.
  - Player orientation cone and live entity blips (Blue = Gloomy, Gold = Dancing, Magenta = Destructibles).
- **Fullscreen Estate Architectural Blueprint Modal**:
  - Interactive SVG floorplan of *Château de la Joie* with dynamic door lock states (`[LOCK]` / `[OPEN]`).
  - Active player pinpoint coordinates indicator (`[▶] S.M.I.L.E. Agent`).
- **Dynamic Environmental Destructibles**:
  - Floating pastel balloons in room corners; shoot to pop and drop surprise treats.
  - Gilded gift chests with gold ribbons that fracture on hit.
- **Physical Feedback & Visual Effects**:
  - Dynamic `PointLight` muzzle flashes casting colored light on room walls during fire.
  - Camera recoil kickback and screen shake on heavy mortar explosions.
  - Grump physical knockback impulses on hit.

---

## [1.1.0] - 2026-08-27

### Added
- **Multi-Tier Quest & Task Engine**:
  - `Quest 1: The Foyer Sonatina` (Piano triad sequence `[C-E-G]`).
  - `Quest 2: Alchemical Bliss Brew` (Library cauldron activation).
  - `Quest 3: Solarium Heart Lanterns` (4 Heart Lantern ignition).
  - `Quest 4: Château Joy Brigade` (Uplift 5 Grumps and save progress).
  - Dedicated `[QUESTS]` log modal with interactive task completion checkboxes.
- **Realistic Procedural 3D Assets**:
  - Grand Concert Piano with individual keys, brass caster legs, and illuminated sheet music.
  - Alchemical Golden Cauldron with bubbling magenta liquid and steam particles.
  - Solarium Marble Gazebo and 4 Heart Lanterns.
  - Victorian Velvet Armchairs and runner carpets.
- **3 Diverse Grump Variants**:
  - `Gloom Bear`: Chunky plush bear with floppy ears and blue moping aura.
  - `Sighing Specter`: Translucent floating ghost-plushie.
  - `Gilded Knight`: Heavy-armored plush knight with cardboard visor helmet.
- **Piano Triad Audio Synthesizer**: Web Audio polyphonic notes (C, D, E, F, G, A).

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

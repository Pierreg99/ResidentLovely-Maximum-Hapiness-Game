# RESIDENT LOVELY ❖ Maximum Happiness 3D

<p align="center">
  <img src="assets/resident-lovely-banner.svg" alt="Resident Lovely Banner" width="100%" />
</p>

<p align="center">
  <a href="https://pierreg99.github.io/resident-lovely-game/"><img src="https://img.shields.io/badge/PLAY_NOW-GitHub_Pages-cyan?style=for-the-badge&logo=github" alt="Play Now" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License" /></a>
  <a href="ROADMAP.md"><img src="https://img.shields.io/badge/Version-v1.3.0_ESM-orange.svg?style=for-the-badge" alt="Version" /></a>
  <a href="CHANGELOG.md"><img src="https://img.shields.io/badge/Changelog-Updated-emerald.svg?style=for-the-badge" alt="Changelog" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Standard-Zero_Emojis-pink.svg?style=for-the-badge" alt="Zero Emojis" /></a>
</p>

> **Resident Lovely** is an over-the-shoulder 3D action-adventure survival-joy game parodying classic survival-horror mechanics (specifically the *Resident Evil* franchise) inverted into an uncompromising aesthetic of **Maximum Happiness and Wholesomeness**. Built with a modular **ESM (ECMAScript Modules)** architecture.

---

## ❖ Live Web Game Access

- **Public GitHub Pages (Play in Browser)**: [https://pierreg99.github.io/resident-lovely-game/](https://pierreg99.github.io/resident-lovely-game/)
- **Local Control Center Endpoint**: `http://localhost:8080/resident-lovely/index.html`

---

## ❖ Modular Project Architecture

```
resident-lovely-game/
├── index.html                   # Clean HTML shell & module entry point
├── LICENSE                      # Official MIT License
├── README.md                    # Project documentation & guides
├── ROADMAP.md                   # Phased roadmap & feature progress
├── CHANGELOG.md                 # Chronological version release notes
├── assets/
│   └── resident-lovely-banner.svg # Vector hero artwork & schematics
├── css/
│   └── style.css                # NEXUS PRIVÉ v6.0 glassmorphic stylesheet
├── docs/
│   ├── 2026-08-27--resident-lovely-3d-mobile-game.md
│   └── 2026-08-27--resident-lovely-maps-and-weapons.md
└── src/
    ├── main.js                  # Main lifecycle & game loop coordinator
    ├── engine/
    │   ├── audio.js             # Synthesized Web Audio API sound engine
    │   ├── input.js             # Multi-touch virtual joystick & key bindings
    │   └── camera.js            # Over-the-shoulder chase camera & recoil shake
    ├── world/
    │   ├── scene.js             # Three.js scene, dynamic lighting & particles
    │   ├── rooms.js             # Procedural room builders (Foyer, Library, Garden)
    │   └── destructibles.js     # Floating balloons & breakable gift boxes
    ├── entities/
    │   ├── player.js            # 3D Player character ("Agent Joy") model & physics
    │   └── grump.js             # 3D Grump AI variants (Bear, Specter, Knight)
    ├── weapons/
    │   └── arsenal.js           # 4-weapon system, 3D ballistics & beam lasers
    └── systems/
        ├── inventory.js         # 8-slot inventory grid, combine recipes & ECG
        ├── quests.js            # Multi-tier quest log & objective HUD
        ├── minimap.js           # 360° Radar mini-map & estate blueprint modal
        └── persistence.js       # Save & load snapshotting with localStorage
```

---

## ★ Key Features

### 1. High-Quality 4-Weapon Wholesome Arsenal
- **Mk-IV Confetti Pistol (`[1]`)**: High-velocity precision sparkly darts with rapid single-fire.
- **Pastry Bubble Shotgun (`[2]`)**: 5-projectile bubble spread that traps Grumps in giant floating buoyant bubbles!
- **Confectionery Mortar (`[3]`)**: Heavy ballistic gravity arc exploding in a massive 360-degree confetti shockwave with screen recoil shake.
- **Prismatic Joy Beam (`[4]`)**: Continuous neon rainbow laser beam with real-time cylinder mesh & polyphonic synth audio hum.

### 2. Tactical Radar Mini-Map & Estate Blueprint
- **Circular Radar Mini-Map**: Real-time 360-degree radar scan, room bounds, player orientation cone, Grump blips (Blue = Gloomy, Gold = Dancing), and item pins.
- **Fullscreen Architectural Blueprint (`[MAP]` / Key `M`)**: Interactive floorplan of Château de la Joie with door lock status (Red [LOCK] / Emerald [OPEN]) and player pinpoint coordinates.

### 3. Classic 8-Slot Inventory System (Resident Evil Parody)
- **Joy Vitality ECG**: Real-time heartbeat monitor graph (`MAX BLISS` ➔ `CHEERFUL` ➔ `GRUMPY`).
- **Combine System**:
  - *Sparkle Herb (Green)* + *Sweet Powder (Red)* ➔ *Mega Bliss Cupcake*
  - *Silver Foyer Key* + *Golden Ribbon* ➔ *Master Ballroom Key*
- **Save Points**: Golden Gramophone Music Boxes with `localStorage` persistence.

### 4. Multi-Tier Quests & Tasks
- **Quest 1: The Foyer Sonatina** (Play Grand Piano triad `[C-E-G]` to unlock East Wing Key).
- **Quest 2: Alchemical Bliss Brew** (Deposit crafted Mega Bliss Cupcake into Library Cauldron).
- **Quest 3: Solarium Heart Lanterns** (Ignite all 4 Heart Lanterns in the West Wing Garden).
- **Quest 4: Château Joy Brigade** (Uplift all 5 Gloomy Grumps into celebration dancers).

---

## ◈ Controls

### Mobile Touch Controls
- **Left Thumb**: Dynamic floating virtual analog joystick (360-degree movement).
- **Right Thumb**: Swipe screen to orbit camera; dedicated tactile action buttons for `[AIM]`, `[JOY BLAST]`, `[EXAMINE]`, `[GUN]`, `[ITEMS]`, `[TASKS]`, and `[MAP]`.

### Desktop Controls
- **Movement**: `W`, `A`, `S`, `D` or Arrow Keys
- **Aim / Fire**: Right-Click to Aim, Left-Click / `Space` to Fire
- **Weapon Slots**: `1` (Pistol), `2` (Shotgun), `3` (Mortar), `4` (Joy Beam)
- **Cycle Weapon**: Tap `[GUN]` button or cycle numbers
- **Interact / Examine**: `E`
- **Inventory**: `I` or `Tab`
- **Quest Log**: `Q`
- **Tactical Map**: `M`

---

## ❖ How to Run Locally

```bash
# Python 3
python3 -m http.server 8080

# Node.js
npx serve .
```

Open `http://localhost:8080/index.html` in your browser.

---

## ★ License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.  
Built for Cryo Omega v3.0 & Antigravity Swarm.

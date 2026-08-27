# RESIDENT LOVELY ❖ Maximum Happiness 3D

<p align="center">
  <img src="assets/resident-lovely-banner.svg" alt="Resident Lovely Banner" width="100%" />
</p>

<p align="center">
  <a href="https://pierreg99.github.io/resident-lovely-game/"><img src="https://img.shields.io/badge/PLAY_NOW-GitHub_Pages-cyan?style=for-the-badge&logo=github" alt="Play Now" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License" /></a>
  <a href="ROADMAP.md"><img src="https://img.shields.io/badge/Version-v1.4.0_Kawaii-orange.svg?style=for-the-badge" alt="Version" /></a>
  <a href="CHANGELOG.md"><img src="https://img.shields.io/badge/Changelog-Updated-emerald.svg?style=for-the-badge" alt="Changelog" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Standard-Zero_Emojis-pink.svg?style=for-the-badge" alt="Zero Emojis" /></a>
</p>

> **Resident Lovely** is an over-the-shoulder 3D action-adventure survival-joy game parodying classic survival-horror mechanics (specifically the *Resident Evil* franchise) inverted into an uncompromising aesthetic of **Maximum Happiness, Kawaii Charm, and Wholesomeness**. Built with a modular **ESM (ECMAScript Modules)** architecture.

---

## ❖ Live Web Game Access

- **Public GitHub Pages (Play in Browser)**: [https://pierreg99.github.io/resident-lovely-game/](https://pierreg99.github.io/resident-lovely-game/)
- **Local Control Center Endpoint**: `http://localhost:8080/resident-lovely/index.html`

---

## ★ Key Kawaii & Authentic Gameplay Features

### 1. Expressive Chibi "Agent Joy" & Squash-and-Stretch Grump AI
- **Chibi Agent Joy**: Large glossy anime eyes with star highlights, rosy blush cheeks (`#f472b6`), animated twin-tail pigtails that bounce with spring physics, and foot-hop running cycles.
- **Squash-and-Stretch Grumps**:
  - *Gloom Bear*: Fluffy plush bear with stitched patch seams and big teary eyes that turn into starry gold sparkle eyes upon being uplifted.
  - *Sighing Specter*: Translucent marshmallow ghost with heart ribbons and soft lavender aura.
  - *Chibi Gilded Knight*: Plush knight with toy shield, oversized cardboard-gold helmet with bouncing pink plume.

### 2. Authentic Resident Evil Survival-Joy Mechanics
- **180° Quick-Turn (`Z` or `[180° TURN]` Button)**: Instant character spin with camera follow whip and audio swoosh.
- **Interactive 3D Item Inspection (`★ 3D INSPECT`)**: Dedicated 3D orbit viewer inside the inventory modal allowing 360-degree rotation to discover secrets and lore.
- **Typewriter / Gramophone Save Dialog**: Authentic prompt dialog ("Will you record your joyful journey in the Grand Chronicle?") with synthesized typewriter key clatter and carriage bell.
- **Expanded 3-Tier Herb Alchemy**:
  - `Green Herb` + `Green Herb` = *Double Sparkle Herb* (70% Joy)
  - `Green Herb` + `Red Sweet Powder` = *Mega Bliss Cupcake* (100% Joy)
  - `Double Green Herb` + `Green Herb` = *Ultra Joy Elixir* (100% Joy + Star Shield)
  - `Silver Foyer Key` + `Golden Ribbon` = *Master Ballroom Key*

### 3. High-Quality 4-Weapon Wholesome Arsenal
- **Mk-IV Confetti Pistol (`[1]`)**: Star-shaped sparkle darts with rapid single-fire.
- **Pastry Bubble Shotgun (`[2]`)**: 5-pellet bubble spread that traps Grumps in giant floating buoyant bubbles!
- **Confectionery Mortar (`[3]`)**: Heavy ballistic cupcake missile exploding in a 360-degree confetti shockwave with screen recoil shake.
- **Prismatic Joy Beam (`[4]`)**: Continuous neon rainbow laser beam with real-time cylinder mesh & polyphonic synth audio hum.

### 4. Tactical Radar Mini-Map & Estate Blueprint
- **Circular Radar Mini-Map**: Real-time 360-degree radar scan, room bounds, player orientation cone, and live entity blips.
- **Fullscreen Architectural Blueprint (`[MAP]` / Key `M`)**: Interactive floorplan of Château de la Joie with door lock status (Red [LOCK] / Emerald [OPEN]).

---

## ◈ Controls

### Mobile Touch Controls
- **Left Thumb**: Dynamic floating virtual analog joystick (360-degree movement).
- **Right Thumb**: Touch drag to orbit camera; dedicated tactile action buttons for `[AIM]`, `[JOY BLAST]`, `[EXAMINE]`, `[180° TURN]`, `[GUN]`, `[ITEMS]`, `[TASKS]`, and `[MAP]`.

### Desktop Controls
- **Movement**: `W`, `A`, `S`, `D` or Arrow Keys
- **180° Quick-Turn**: `Z` or `S + Space`
- **Aim / Fire**: Right-Click to Aim, Left-Click / `Space` to Fire
- **Weapon Slots**: `1` (Pistol), `2` (Shotgun), `3` (Mortar), `4` (Joy Beam)
- **Cycle Weapon**: Tap `[GUN]` button or cycle numbers
- **Interact / Examine**: `E`
- **Inventory**: `I` or `Tab`
- **Quest Log**: `Q`
- **Tactical Map**: `M`

---

## ❖ Modular Project Architecture

```
resident-lovely-game/
├── index.html                   # Lightweight HTML shell & ESM mount
├── LICENSE                      # Official MIT License
├── README.md                    # Project documentation & architecture
├── ROADMAP.md                   # Phased milestone roadmap & progress
├── CHANGELOG.md                 # Version release notes (v1.0.0 - v1.4.0)
├── assets/
│   └── resident-lovely-banner.svg # Vector hero artwork (1200x500)
├── css/
│   └── style.css                # Dedicated NEXUS PRIVÉ v6.0 glassmorphic CSS
├── docs/
│   ├── 2026-08-27--resident-lovely-3d-mobile-game.md
│   └── 2026-08-27--resident-lovely-maps-and-weapons.md
└── src/
    ├── main.js                  # Main coordinator & animation lifecycle
    ├── engine/
    │   ├── audio.js             # Synthesized Web Audio API SFX engine
    │   ├── input.js             # Multi-touch virtual joystick & 180° turn
    │   └── camera.js            # Over-the-shoulder chase camera & recoil trauma
    ├── world/
    │   ├── scene.js             # Three.js scene, lighting & particle pool
    │   ├── rooms.js             # Procedural room builders (Foyer, Library, Garden)
    │   └── destructibles.js     # Floating balloons & breakable gift boxes
    ├── entities/
    │   ├── player.js            # Chibi "Agent Joy" with pigtail bounce & 180° turn
    │   └── grump.js             # Squash-and-stretch Grump AI (Bear, Specter, Knight)
    ├── weapons/
    │   └── arsenal.js           # 4-weapon system, 3D ballistics & beam lasers
    └── systems/
        ├── inventory.js         # 3D inspection viewer & 3-tier herb alchemy
        ├── quests.js            # Multi-tier quest log & objective HUD
        ├── minimap.js           # 360° Radar mini-map & estate blueprint modal
        └── persistence.js       # Typewriter save dialog & localStorage
```

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

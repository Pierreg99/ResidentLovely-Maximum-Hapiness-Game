# RESIDENT LOVELY ❖ Maximum Happiness 3D

<p align="center">
  <img src="assets/resident-lovely-banner.svg" alt="Resident Lovely Banner" width="100%" />
</p>

<p align="center">
  <a href="https://pierreg99.github.io/resident-lovely-game/"><img src="https://img.shields.io/badge/PLAY_NOW-GitHub_Pages-cyan?style=for-the-badge&logo=github" alt="Play Now" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License" /></a>
  <a href="ROADMAP.md"><img src="https://img.shields.io/badge/Roadmap-v1.6.0_Master-orange.svg?style=for-the-badge" alt="Roadmap" /></a>
  <a href="CHANGELOG.md"><img src="https://img.shields.io/badge/Changelog-Comprehensive-emerald.svg?style=for-the-badge" alt="Changelog" /></a>
  <a href="docs/Resident_Lovely_Master_Game_Design_Document.docx"><img src="https://img.shields.io/badge/Design_Doc-DOCX-magenta.svg?style=for-the-badge" alt="DOCX Design Doc" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Standard-Zero_Emojis-pink.svg?style=for-the-badge" alt="Zero Emojis" /></a>
</p>

> **Resident Lovely** is an over-the-shoulder 3D action-adventure survival-joy game parodying classic survival-horror mechanics (specifically the *Resident Evil* franchise) inverted into an uncompromising aesthetic of **Maximum Happiness, Kawaii Charm, and Wholesomeness**. Built with a modular **ESM (ECMAScript Modules)** architecture.

---

## ❖ Live Web Game Access

- **Public GitHub Pages (Play in Browser)**: [https://pierreg99.github.io/resident-lovely-game/](https://pierreg99.github.io/resident-lovely-game/)
- **Local Control Center Endpoint**: `http://localhost:8080/resident-lovely/index.html`
- **Master Design Document (DOCX)**: [docs/Resident_Lovely_Master_Game_Design_Document.docx](docs/Resident_Lovely_Master_Game_Design_Document.docx)

---

## ★ Key Visual & Gameplay Masterwork Features (v1.6.0)

### 1. 3-Mode Camera Engine (Classic Fixed / 360° OTS / ADS)
- **Mode 1: Dynamic 360° Over-The-Shoulder (OTS)**: Smooth third-person chase camera with 360° yaw orbit and vertical pitch tilt (±35°).
- **Mode 2: Classic Fixed Cinematic Camera Angles**: Authentic 1996 *Resident Evil* Spencer Mansion style with preset cinematic room vantage nodes per chamber (Front Entrance Wide, Grand Staircase Balcony, Library Mezzanine, Solarium Fountain) that dynamically cut angles based on player position zones.
- **Mode 3: Precision First-Person / ADS Down-the-Sights View**: Intimate first-person view aligned with Agent Joy's eye level and blaster sightline for precise confetti shooting.
- **Instant Toggle**: Press `V` on keyboard or tap `[VIEW: OTS / FIXED / ADS]` on the top HUD.

### 2. Dynamic Holographic Sights & Target Lock-On
- **Smart Target Acquisition**: Real-time raycasting detects the closest Gloomy Grump within aiming sightline.
- **HUD Lock-On Box**: Displays target name and live range measurement in meters (e.g. `[★ LOCKED: GLOOM BEAR 7.2m]`).
- **Dynamic Crosshair**: Reacts to weapon recoil bloom and character movement.

### 3. 180° Quick-Turn & 360° Free Orbit Navigation
- **180° Quick-Turn (`Z` or `S + Space` or `[180° TURN]` Button)**: Instant character spin with camera follow whip and audio swoosh.
- **360° Orbit Look**: Right-screen touch drag or mouse move to pan 360 degrees horizontally and tilt vertically.

### 4. High-Quality 4-Weapon Wholesome Arsenal
- **Mk-IV Confetti Pistol (`[1]`)**: Star-shaped sparkle darts with rapid single-fire.
- **Pastry Bubble Shotgun (`[2]`)**: 5-pellet bubble spread that traps Grumps in giant floating buoyant bubbles!
- **Confectionery Mortar (`[3]`)**: Heavy ballistic cupcake missile exploding in a 360-degree confetti shockwave with screen recoil shake.
- **Prismatic Joy Beam (`[4]`)**: Continuous neon rainbow laser beam with real-time cylinder mesh & polyphonic synth audio hum.

---

## ◈ Controls

### Mobile Touch Controls
- **Left Thumb**: Dynamic floating virtual analog joystick (360-degree movement).
- **Right Thumb**: Touch drag to orbit camera (360° yaw & vertical pitch tilt).
- **Tactile Action Buttons**: `[AIM]`, `[JOY BLAST]`, `[EXAMINE]`, `[180° TURN]`, `[GUN]`, `[VIEW]`, `[ITEMS]`, `[TASKS]`, and `[MAP]`.

### Desktop Controls
- **Movement**: `W`, `A`, `S`, `D` or Arrow Keys
- **180° Quick-Turn**: `Z` or `S + Space`
- **Switch Camera View**: `V` (Cycles 360° OTS ➔ Classic Fixed ➔ First-Person ADS)
- **Aim / Fire**: Right-Click to Aim, Left-Click / `Space` to Fire
- **Weapon Slots**: `1` (Pistol), `2` (Shotgun), `3` (Mortar), `4` (Joy Beam)
- **Cycle Weapon**: Tap `[GUN]` button or cycle numbers
- **Interact / Examine**: `E`
- **Inventory**: `I` or `Tab`
- **Quest Log**: `Q`
- **Tactical Map**: `M`

---

## ❖ Alchemy & Confectionery Crafting Recipes

| Ingredient 1 | Ingredient 2 | Resulting Item | Effect |
|---|---|---|---|
| **Sparkle Herb (Green)** | **Sparkle Herb (Green)** | **Double Sparkle Herb** | Restores 70% Joy Vitality |
| **Sparkle Herb (Green)** | **Sweet Powder (Red)** | **Mega Bliss Cupcake** | Restores 100% Joy + Cauldron Fuel |
| **Double Sparkle Herb (G+G)** | **Sparkle Herb (Green)** | **Ultra Joy Elixir** | Restores 100% Joy + Radiant Star Shield |
| **Silver Foyer Key** | **Golden Sparkle Ribbon** | **Master Ballroom Key** | Unlocks West Wing Solarium Garden |

---

## ❖ Modular Project Architecture

```
resident-lovely-game/
├── index.html                   # Lightweight HTML shell & ESM mount
├── LICENSE                      # Official MIT License
├── README.md                    # Project documentation & architecture
├── ROADMAP.md                   # Phased milestone roadmap & progress matrix
├── CHANGELOG.md                 # Full version release history (v1.0.0 - v1.6.0)
├── assets/
│   └── resident-lovely-banner.svg # Vector hero artwork (1200x500)
├── css/
│   └── style.css                # Dedicated NEXUS PRIVÉ v6.0 glassmorphic CSS
├── docs/
│   ├── Resident_Lovely_Master_Game_Design_Document.docx # Master DOCX GDD
│   ├── 2026-08-27--resident-lovely-3d-mobile-game.md
│   ├── 2026-08-27--resident-lovely-maps-and-weapons.md
│   ├── 2026-08-27--resident-lovely-masterwork-documentation-and-deploy.md
│   └── 2026-08-27--resident-lovely-full-graphic-overhaul.md
└── src/
    ├── main.js                  # Main coordinator & animation lifecycle
    ├── engine/
    │   ├── audio.js             # Synthesized Web Audio API SFX engine
    │   ├── input.js             # Multi-touch joystick, 360/180 turn & View toggle
    │   └── camera.js            # 3-Mode Camera Engine (Fixed/OTS/ADS) & Recoil
    ├── world/
    │   ├── scene.js             # Three.js scene, volumetric rays & stardust
    │   ├── rooms.js             # Procedural room builders (Foyer, Library, Garden)
    │   └── destructibles.js     # Floating balloons & breakable gift boxes
    ├── entities/
    │   ├── player.js            # Chibi "Agent Joy" with eye blinking & pigtails
    │   └── grump.js             # Squash-and-stretch Grump AI (Bear, Specter, Knight)
    ├── weapons/
    │   └── arsenal.js           # 4 weapons, dynamic holographic sights & lock-on
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

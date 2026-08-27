# RESIDENT LOVELY ❖ Maximum Happiness 3D

<p align="center">
  <img src="assets/resident-lovely-banner.svg" alt="Resident Lovely Banner" width="100%" />
</p>

<p align="center">
  <a href="https://pierreg99.github.io/resident-lovely-game/"><img src="https://img.shields.io/badge/PLAY_NOW-GitHub_Pages-cyan?style=for-the-badge&logo=github" alt="Play Now" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License" /></a>
  <a href="ROADMAP.md"><img src="https://img.shields.io/badge/Roadmap-v1.5.0_Master-orange.svg?style=for-the-badge" alt="Roadmap" /></a>
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

## ★ Key Visual & Gameplay Masterwork Features (v1.5.0)

### 1. Volumetric Atmosphere & Baroque Graphics
- **Volumetric God Rays**: Translucent additive pink light beams projecting diagonally from the stained-glass rose window onto the Foyer checkerboard floor.
- **Ambient Stardust Motes**: 55 floating glitter particles drifting through illuminated zones with Brownian drift physics.
- **Multi-Tier Crystal Chandelier**: Gilded brass framework with hanging crystal prisms casting refractive highlights.
- **Baroque Architecture**: Gilded wainscoting moldings, framed oil landscape paintings, and rolling library ladders.
- **Cascading Fountain**: Tiered Solarium fountain with animated rotating water ripple rings and blooming rose bushes.

### 2. Expressive Chibi "Agent Joy" & Squash-and-Stretch Grump AI
- **Chibi Agent Joy**: Large glossy anime eyes with animated blinking cycles, star highlights, rosy blush cheeks (`#f472b6`), animated twin-tail pigtails with physics spring inertia, and foot-hop running cycles.
- **Squash-and-Stretch Grumps**:
  - *Gloom Bear*: Fluffy plush bear with stitched patch seams and big teary eyes that turn into starry gold sparkle eyes upon being uplifted.
  - *Sighing Specter*: Translucent marshmallow ghost with heart ribbons and soft lavender aura.
  - *Chibi Gilded Knight*: Plush knight with toy shield, oversized cardboard-gold helmet with bouncing pink plume.

### 3. Authentic Resident Evil Survival-Joy Mechanics
- **180° Quick-Turn (`Z` or `[180° TURN]` Button)**: Instant character spin with camera follow whip and audio swoosh.
- **Interactive 3D Item Inspection (`★ 3D INSPECT`)**: Dedicated 3D orbit viewer inside the inventory modal allowing 360-degree rotation to discover secrets and lore.
- **Typewriter / Gramophone Save Dialog**: Authentic prompt dialog ("Will you record your joyful journey in the Grand Chronicle?") with synthesized typewriter key clatter and carriage bell.
- **Expanded 3-Tier Herb Alchemy**:
  - `Green Herb` + `Green Herb` = *Double Sparkle Herb* (70% Joy)
  - `Green Herb` + `Red Sweet Powder` = *Mega Bliss Cupcake* (100% Joy)
  - `Double Green Herb` + `Green Herb` = *Ultra Joy Elixir* (100% Joy + Star Shield)
  - `Silver Foyer Key` + `Golden Ribbon` = *Master Ballroom Key*

### 4. High-Quality 4-Weapon Wholesome Arsenal
- **Mk-IV Confetti Pistol (`[1]`)**: Star-shaped sparkle darts with rapid single-fire.
- **Pastry Bubble Shotgun (`[2]`)**: 5-pellet bubble spread that traps Grumps in giant floating buoyant bubbles!
- **Confectionery Mortar (`[3]`)**: Heavy ballistic cupcake missile exploding in a 360-degree confetti shockwave with screen recoil shake.
- **Prismatic Joy Beam (`[4]`)**: Continuous neon rainbow laser beam with real-time cylinder mesh & polyphonic synth audio hum.

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
├── CHANGELOG.md                 # Full version release history (v1.0.0 - v1.5.0)
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
    │   ├── input.js             # Multi-touch virtual joystick & 180° turn
    │   └── camera.js            # Over-the-shoulder chase camera & recoil trauma
    ├── world/
    │   ├── scene.js             # Three.js scene, volumetric rays & stardust
    │   ├── rooms.js             # Procedural room builders (Foyer, Library, Garden)
    │   └── destructibles.js     # Floating balloons & breakable gift boxes
    ├── entities/
    │   ├── player.js            # Chibi "Agent Joy" with eye blinking & pigtails
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

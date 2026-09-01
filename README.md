# RESIDENT LOVELY ❖ Maximum Happiness 3D

<p align="center">
  <img src="assets/resident-lovely-banner.svg" alt="Resident Lovely Banner" width="100%" />
</p>

<p align="center">
  <a href="https://pierreg99.github.io/ResidentLovely-Maximum-Hapiness-Game/"><img src="https://img.shields.io/badge/PLAY_NOW-GitHub_Pages-cyan?style=for-the-badge&logo=github" alt="Play Now" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License" /></a>
  <a href="PROGRESS.md"><img src="https://img.shields.io/badge/Progress-v6.3.0_Master-orange.svg?style=for-the-badge" alt="Progress" /></a>
  <a href="CHANGELOG.md"><img src="https://img.shields.io/badge/Changelog-Comprehensive-emerald.svg?style=for-the-badge" alt="Changelog" /></a>
  <a href="docs/Resident_Lovely_Master_Game_Design_Specification.docx"><img src="https://img.shields.io/badge/Specification-DOCX-magenta.svg?style=for-the-badge" alt="DOCX Specification" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Standard-NEXUS_PRIVÉ_v6.3-pink.svg?style=for-the-badge" alt="NEXUS PRIVÉ v6.3" /></a>
</p>

> **Resident Lovely** is an over-the-shoulder 3D action-adventure survival-joy game parodying classic survival-horror mechanics (specifically the *Resident Evil* Spencer Mansion experience) inverted into an uncompromising aesthetic of **Maximum Happiness, Kawaii Charm, and Wholesomeness**. Built with a modular **ESM (ECMAScript Modules)** architecture.

---

## ❖ Live Deployment Endpoints

- **Public GitHub Pages (Play in Browser)**: [https://pierreg99.github.io/ResidentLovely-Maximum-Hapiness-Game/](https://pierreg99.github.io/ResidentLovely-Maximum-Hapiness-Game/)
- **Local Control Center Endpoint**: `http://localhost:8080/index.html`
- **Master Design Document (DOCX)**: [`docs/Resident_Lovely_Master_Game_Design_Specification.docx`](docs/Resident_Lovely_Master_Game_Design_Specification.docx)
- **Map Design System Showcase**: [`design/map-design-system.html`](design/map-design-system.html)

---

## ★ Key Visual & Gameplay Masterwork Features (v6.3.0)

### 1. Master Touch Virtual Controls & Haptic Feedback
- **Floating Dynamic Joystick**: Touch anywhere on the left half of the screen to spawn an analog joystick with smooth 48px drag radius and deadzone normalization.
- **Tactile Action Cluster**: Radial buttons with instant haptic pulse responses (`navigator.vibrate`):
  - `[EXAMINE / ACTION]` (Contextual puzzle interactions, notes, keys)
  - `[JOY FIRE]` (Confetti / Joy pulse blaster)
  - `[180° TURN]` (Instant Spencer-Mansion quick turn)
  - `[WEAPON CYCLE]` (One-tap weapon switcher: Pistol ➔ Shotgun ➔ Mortar ➔ Beam)
  - `[MAP]` (Holographic vector blueprint drawer)
  - `[ITEMS]` (Alchemical inventory pouch)
  - `[QUESTS]` (12-quest task ledger)

### 2. Sprawling 32-Sector Spencer-Mansion Estate & Grand Colonnades
- **Seamless Interconnecting Colonnades**: Open arched marble hallways seamlessly connecting the Grand Foyer (`S01`) with the East Wing Library (`S02`), West Wing Solarium (`S03`), and Courtyard Greenhouse (`S04`).
- **7-Floor Architectural Layout**: `4F (Rooftop)`, `3F (Cathedral)`, `2F (Mezzanine & Suites)`, `1F (Ground Estate)`, `B1 (Subterranean Lab)`, `B2 (Crypt & Vaults)`, `OUTDOOR (Grounds & Nature)`.
- **Fast Travel Teleporter Network**: Double-click any chamber node on the Holographic Blueprint Map to instantly warp across wings with custom harmonic door chimes.
- **Spatial Culling & Lighting Throttling**: Dynamic point-light attenuation for sectors outside active camera radius (`<= 75m`), guaranteeing a rock-solid 60 FPS on mobile devices.

### 3. Realistic Kawaii PBR Shading & World Atmosphere
- **Agent Joy Character Rig**: Gilded shoulder epaulets, dual holster belts, knee-high tactical boots with silver buckles, glossy anime eyes with specular catchlights, and bouncing twin-tail hair physics.
- **Three.js PBR Shaders**: High-gloss checkerboard marble floors, gold metallic trim reflectivity, frosted glass caustics, and stardust particle trails.
- **Atmospheric Emitters**: Floating heart bubble motes on joy restoration and sparkling stardust footsteps.

### 4. 12-Quest Alchemical Narrative & Confectionery Alchemy
- **12 Narrative Quests**:
  1. *The Foyer Sonatina* (Harmonic Triad C-E-G)
  2. *Alchemical Bliss Brew* (Golden Cauldron)
  3. *Solarium Heart Lanterns* (Ignite 4 Lanterns)
  4. *Celestial Astrolabe* (Star Sapphire Gem)
  5. *Subterranean Sugar Dynamo* (Joy Dynamo Core)
  6. *Royal Confectionery Banquet* (Feast Platter)
  7. *Hall of Wholesome Portraits* (Portrait Tour)
  8. *Royal Velvet Master Suite* (Solarium Terrace)
  9. *Crystal Ballroom Waltz* (Starlight Disco Chandelier)
  10. *Grand Gloom Behemoth Uplift* (B2 Boss Battle)
  11. *Sweet Confectionery Grand Prix* (Bake Rainbow Macaron)
  12. *The Great Joy Squad Parade* (Recruit & Pet 4 Companions)
- **8 Confectionery Alchemy Recipes**:
  - Green Herb + Green Herb ➔ Double Sparkle Herb
  - Double Herb + Green Herb ➔ Ultra Joy Elixir
  - Green Herb + Red Powder ➔ Mega Bliss Cupcake
  - Silver Key + Gold Ribbon ➔ Master Ballroom Key
  - Sun Crest + Prismatic Sugar ➔ Joy Dynamo Core
  - Cupcake + Prismatic Sugar ➔ Hyper Bliss Confection
  - Double Herb + Prismatic Sugar ➔ Rainbow Starlight Macaron
  - Red Powder + Gold Ribbon ➔ Sparkle Cotton Candy

### 5. Multi-Mode Roguelike & Speedrun Engine
- **Endless Dimension Generator**: Procedural dungeon runs across 7 biomes with depth scaling and randomized blessing modifiers (`Joy Surge`, `Sparkle Haste`, `Balloon Bounty`, `Prismatic Aura`, `Grump Swarm`).
- **Speedrun Split Timer**: Precision personal-best tracking with automated boss checkpoint recording and `localStorage` persistence.
- **AI Companion Dialogue**: Procedural conversational chatter for Agent Joy, Gloom Bear, Bun-Bun, and Master Chef.

---

## ◈ Controls

### Mobile Touch Controls
- **Left Thumb (Joystick Zone)**: Dynamic floating virtual analog joystick (360° omnidirectional movement).
- **Right Thumb (Screen Drag)**: Smooth 360° camera orbit & pitch tilt.
- **Action Buttons**:
  - `[AIM]`: Toggle Aiming Mode (Camera zooms over-the-shoulder).
  - `[JOY FIRE]`: Fire equipped Joy weapon.
  - `[EXAMINE]`: Inspect interactables, solve puzzles, collect keys.
  - `[180° TURN]`: Instant quick turn.
  - `[GUN]`: Cycle weapon slot.
  - `[ITEMS]`: Open Alchemical Inventory pouch.
  - `[QUESTS]`: Open Quest Log checklist.
  - `[MAP]`: Open Holographic Blueprint Map.

### Desktop Keyboard & Mouse Controls
- **W / A / S / D** or **Arrow Keys**: Move Agent Joy.
- **Mouse Drag (Left Button)**: 360° Camera Look / Orbit.
- **Mouse Right-Click**: Toggle Precision Aiming (ADS / OTS).
- **Spacebar**: Fire Weapon / Uplift Grump.
- **E**: Examine / Contextual Interact / Inspect.
- **Z** or **S + Spacebar**: 180° Quick Turn.
- **1 / 2 / 3 / 4**: Select Weapon (Pistol, Shotgun, Mortar, Beam).
- **I** or **Tab**: Open / Close Inventory.
- **Q**: Open / Close Quest Log.
- **M**: Open / Close Holographic Blueprint Map.
- **V**: Cycle Camera Mode (`Over-The-Shoulder` ➔ `Fixed Cinematic` ➔ `First-Person ADS`).

---

## ❖ Automated Testing Suite

The project includes an automated test discovery suite written in Python:

```bash
# Run all 10 test suites (237 automated tests)
python3 -m unittest discover -s tests -p "test_*.py"
```

All 237 tests pass with a 100% success rate across all world geometry, shader validation, inventory alchemy, and camera mechanics.

---

## ❖ License & Attribution

Distributed under the **MIT License**. Assets created under the **NEXUS PRIVÉ v6.1 Pierrefektion Standard**.  
See [`LICENSE`](LICENSE) for details.

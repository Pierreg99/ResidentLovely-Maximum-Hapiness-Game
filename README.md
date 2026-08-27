# RESIDENT LOVELY ❖ Maximum Happiness 3D

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![NEXUS PRIVÉ](https://img.shields.io/badge/Design_System-NEXUS_PRIVÉ_v6.0-cyan.svg)](#)
[![Three.js](https://img.shields.io/badge/WebGL-Three.js_r128-orange.svg)](#)
[![Audio](https://img.shields.io/badge/Audio-Web_Audio_API-emerald.svg)](#)
[![Emoji Free](https://img.shields.io/badge/Standards-Zero_Emojis-pink.svg)](#)

> **Resident Lovely** is an over-the-shoulder 3D action-adventure survival-joy game parodying classic survival-horror mechanics (specifically the *Resident Evil* franchise) inverted into an uncompromising aesthetic of **Maximum Happiness and Wholesomeness**.

---

## ❖ Overview

Instead of bio-weapons, dark hallways, and gore:
- **Location**: *Château de la Joie* — A grand baroque mansion filled with gold chandeliers, velvet runners, and secret confectionery chambers.
- **Protagonist**: *Agent Joy (S.M.I.L.E. Alpha Team)* armed with an arsenal of wholesome 3D joy weapons.
- **The Threat**: *The Gloom Outbreak* — Friendly plushies turned into sad, moping "Grumps".
- **The Mission**: Explore the mansion wings, solve piano and alchemical puzzles, blast Grumps with overwhelming happiness, and trigger the Grand Friendship Party!

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

### 5. Environmental Destructibles
- **Floating Balloons**: Bobbing in room corners; shoot to pop with celebratory confetti and item drops.
- **Gilded Gift Boxes**: Procedural gift chests that fracture into pieces when blasted.

---

## ◈ Controls

### Mobile Touch Controls
- **Left Thumb**: Dynamic floating virtual analog joystick (360-degree movement).
- **Right Thumb**: Swipe screen to orbit camera; dedicated buttons for `[AIM]`, `[JOY BLAST]`, `[EXAMINE]`, `[GUN]`, `[ITEMS]`, `[TASKS]`, and `[MAP]`.

### Desktop Controls
- **Movement**: `W`, `A`, `S`, `D` or Arrow Keys
- **Aim / Fire**: Right-Click to Aim, Left-Click / `Space` to Fire
- **Weapon Slots**: `1` (Pistol), `2` (Shotgun), `3` (Mortar), `4` (Joy Beam)
- **Interact / Examine**: `E`
- **Inventory**: `I` or `Tab`
- **Quest Log**: `Q`
- **Tactical Map**: `M`

---

## ❖ Technical Architecture

- **Engine**: Three.js (r128) via WebGL with soft shadow maps and mobile DPR capping.
- **Audio Engine**: 100% procedural Web Audio API synthesizers (zero external audio files).
- **Design Standard**: NEXUS PRIVÉ v6.0 glassmorphism, obsidian base (`#05070a`), cyan (`#22d3ee`), gold (`#f59e0b`), emerald (`#10b981`), magenta (`#ec4899`).
- **Zero Emojis**: 100% vector SVG glyphs and geometric unicode symbols.
- **Deployment**: Standalone zero-dependency single-file HTML5 web application.

---

## ❖ How to Run Locally

Simply serve the repository folder with any static HTTP server:

```bash
# Python 3
python3 -m http.server 8080

# Node.js
npx serve .
```

Open `http://localhost:8080/index.html` in your browser.

---

## ★ License
MIT License. Built for Cryo Omega v3.0 & Antigravity.

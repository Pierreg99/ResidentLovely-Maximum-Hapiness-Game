# SPECIFICATION: RESIDENT LOVELY (3D MOBILE JOY HORROR-PARODY)

**Document ID**: `SPEC-2026-08-27-RESIDENT-LOVELY-APPROVED`  
**Status**: APPROVED BY USER (Approach B Selected)  
**Classification**: NEXUS PRIVÉ v6.0 Standard | Zero-Emoji Enforcement  
**Deliverable Path**: `~/projects/cryo-omega/webby/resident-lovely/index.html`  
**Engine**: Three.js (r128) + WebGL + Web Audio API (Standalone Single-File PWA)  

---

## 1. Vision & Narrative Blueprint

**Resident Lovely** is an over-the-shoulder 3D action-adventure survival-joy game parodying *Resident Evil*.

### Lore & Setting
- **Setting**: *Château de la Joie* — A grand baroque mansion filled with velvet carpets, gold chandeliers, pastel marble, and mystery tea rooms.
- **Protagonist**: *Agent Joy (S.M.I.L.E. Alpha Team)* armed with the **Mk-IV Confetti Blaster** and **Pastry Launcher**.
- **The Threat**: *The Gloom Outbreak* — Friendly plushies and garden statues have turned into sad, moping "Grumps".
- **The Mission**: Explore the mansion, unlock locked confectionery doors, combine sparkle herbs, blast Grumps with overwhelming happiness until they dance, and activate the Grand Golden Gramophone.

---

## 2. Approved Gameplay Mechanics (Approach B)

### 2.1 Camera & Mobile Control Matrix
- **Over-The-Shoulder Dynamic Chase Camera**: Smooth interpolation, responsive rotation, and shoulder-offset aim zoom.
- **Left Touch Zone**: Virtual floating analog joystick for 360° omnidirectional movement and sprinting.
- **Right Touch Zone**: Swipe to orbit camera, tap to quick-turn, dual action buttons.
- **Action Triggers**:
  - `[AIM]` (Toggle or Hold Aim Mode with laser guide line)
  - `[FIRE]` (Launch physics-driven confetti / joy projectile bursts)
  - `[INTERACT / EXAMINE]` (Contextual pickup, door open, gramophone save)
  - `[INVENTORY]` (Open classic 8-slot status grid)
- **Desktop Keyboard/Mouse Fallback**: `WASD` movement, `Right Click` / `Shift` aim, `Left Click` fire, `E` interact, `I` / `Tab` inventory, `Space` quick roll.

### 2.2 Classic 8-Slot Inventory System (Approved)
- **Grid Layout**: 4x2 matrix styled with NEXUS PRIVÉ obsidian glass and cyan border accents.
- **Item Mechanics**:
  - `USE`: Consume treats (restore Joy ECG meter), equip tools.
  - `EXAMINE`: 3D inspection view with lore details.
  - `COMBINE`:
    - *Sparkle Herb (Green)* + *Sweet Sugar (Red)* ➔ *Mega Bliss Cupcake*
    - *Silver Foyer Key* + *Golden Sparkle Ribbon* ➔ *Master Ballroom Key*
    - *Pastry Dough* + *Rainbow Sprinkles* ➔ *High-Caliber Confetti Cake*
- **Joy Vitality ECG**:
  - `MAX JOY` (Emerald `#10b981` pulsing wave, 100%)
  - `CHEERFUL` (Cyan `#22d3ee`, 70-99%)
  - `MEH` (Gold `#f59e0b`, 30-69%)
  - `GRUMPY` (Rose `#f43f5e`, <30%)

### 2.3 Wholesome Combat & AI State Machine
- **Grump AI States**:
  - `IDLE / MOPING`: Wandering with blue gloomy aura, sighing.
  - `SEEKING HUGS`: Approaching player to complain or drain Joy.
  - `OVERWHELMED BY JOY`: Upon receiving Confetti Blasts, their Happiness Meter fills.
  - `ECSTATIC CELEBRATION`: At 100% Happiness, they sprout flower crowns, dance, launch party poppers, and drop rare Keys/Treats.

---

## 3. Technical Architecture & Performance Budget

1. **Rendering**:
   - Three.js r128 with mobile pixel ratio capping (1.5x max) for locked 60fps on mobile chipsets.
   - Custom low-poly 3D models with vertex colors and glossy PBR materials.
   - Dynamic point lights with optimized shadow maps.
   - Zero external textures/models; 100% procedurally generated geometry and canvas textures.
2. **Audio Subsystem**:
   - Synthesized Web Audio API (Polyphonic synth chimes, square-wave retro pops, soothing mansion ambiance).
3. **UI / Styling**:
   - NEXUS PRIVÉ v6.0 glassmorphism (`backdrop-filter: blur(12px)`).
   - Zero emojis — 100% SVG vectors, glyphs (`★`, `❖`, `▶`, `✔`, `•`), and monospace typography.
4. **State Persistence**:
   - `localStorage` snapshotting at Golden Gramophones (Inventory, Room States, Grump Uplift States).

---

## 4. Swarm Verification & QA Sign-Off

- **A022 (QA 5-Dim)**:
  - Happy Path (30%): Fluid movement, accurate collision, responsive shooting, flawless inventory combine.
  - Edge Cases (25%): Multi-touch finger collisions, rapid inventory toggles, boundary collisions.
  - Safety (20%): Zero external binary dependencies, sandbox safe, no tracking.
  - Consistency (15%): NEXUS PRIVÉ design token compliance across all UI layers.
  - Regression (10%): Backward compatibility with mobile touch and desktop mice.
- **A023 (SafeMode Level 2)**: Verified clean execution and memory-leak free particle recycling.

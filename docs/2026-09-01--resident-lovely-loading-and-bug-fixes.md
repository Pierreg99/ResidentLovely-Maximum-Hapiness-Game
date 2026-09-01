# SPECIFICATION: RESIDENT LOVELY LOADING RESILIENCE & BUG FIX ARCHITECTURE

- **Document ID**: `SPEC-2026-09-01-RESIDENT-LOVELY-RESILIENCE`
- **Target Project**: `resident-lovely-game`
- **Standard**: NEXUS PRIVÉ v6.0 Standard (Strict Zero-Emoji Protocol)
- **Status**: USER APPROVED (Approach 2: Full Resilience & Defensive Engine Architecture)
- **Agents**: A16 Research (S4), A17 Strategy (S4), A05 Design (S2), A22 QA (S6), A23 SafeMode (S6)

---

## 1. Executive Summary & Objectives

This specification defines the comprehensive hardening of the loading lifecycle, offline PWA cache, audio synthesis runtime, and WebGL initialization boundaries in *Resident Lovely ❖ Maximum Happiness 3D*.

### Core Objectives
1. **Zero-Latency Bootstrap**: Guarantee synchronous availability of Three.js before ESM script evaluation, eliminating CDN race conditions.
2. **100% Offline Asset Caching**: Complete the Service Worker manifest with all 23 sector backdrop SVGs and ESM subsystem modules.
3. **Defensive Web Audio Synthesis**: Ensure all sound triggers operate safely with null-guards, preventing audio-related game loop halts on locked or restricted browsers.
4. **WebGL Context & Error Boundaries**: Provide user-visible error state handling on the loading card for unsupported devices and seamless WebGL context restoration.
5. **Mobile Touch & Viewport Hardening**: Prevent touch double-fire events and ensure smooth mobile interaction.

---

## 2. Detailed Technical Changes

### 2.1 Three.js Synchronous Bootstrap (`index.html`)
- Replace the asynchronous fallback script insertion with local primary loading:
  ```html
  <script src="./js/three.min.js"></script>
  ```
- Retain CDN fallback only if local script fails via synchronous fallback logic.
- Add WebGL support detection before module evaluation with informative UI fallback on `#loading-status-text`.

### 2.2 Service Worker Offline Manifest (`service-worker.js`)
- Increment cache version to `resident-lovely-v6.3.0-cache`.
- Add all missing assets:
  - `./js/three.min.js`
  - `./src/world/sectors.js`
  - `./src/world/backdrops.js`
  - `./src/world/atmosphere.js`
  - `./src/world/shaders/surface-shaders.js`
  - `./src/systems/game_modes.js`
  - `./src/systems/endless_generator.js`
  - `./src/systems/ai_dialogue.js`
  - All 23 backdrop SVGs in `./assets/backdrops/`

### 2.3 Audio Engine Defensiveness (`src/engine/audio.js`)
- Safeguard all synthesis methods with `if (!this.ctx) return;`.
- Ensure `init()` safely detects `AudioContext` / `webkitAudioContext` and handles locked audio contexts without throwing unhandled exceptions.
- Add user-gesture listeners (`pointerdown`, `keydown`, `touchstart`) to unlock audio seamlessly on first player input.

### 2.4 WebGL Initialization & Pre-warm Boundary (`src/world/scene.js` & `src/main.js`)
- Protect `new THREE.WebGLRenderer()` with try/catch fallback.
- In `prewarmShaders()`, ensure errors during `renderer.compile()` are caught and logged without aborting the game launch gate.
- Prevent duplicate `launchGame()` invocations across simultaneous click and touchstart events.

### 2.5 Touch Event & Input Hardening (`src/engine/input.js`)
- Ensure mobile joystick and action buttons prevent unwanted default touch behaviors (e.g., pinch-zoom or scrolling) while maintaining active touch controls.

---

## 3. A22 QA Validation Plan (S6)

| Test ID | Scenario | Expected Outcome |
|---------|----------|------------------|
| **QA-01** | Offline Cold Load (No Internet) | `index.html` loads Three.js instantly from `./js/three.min.js`, initializes all 32 sectors, and completes loading bar to 100%. |
| **QA-02** | Service Worker Offline Fetch | Service Worker caches all 23 backdrop SVGs and 23 JS modules without 404 network errors. |
| **QA-03** | AudioContext Blocked / Muted | Weapon firing (pistol, bubble, mortar, beam) does not throw exceptions when audio context is uninitialized or blocked. |
| **QA-04** | Rapid / Simultaneous Touch & Click | `#btn-enter-chateau` transitions cleanly with single execution of `launchGame()`. |
| **QA-05** | Regression Test Suite | Full Python unittest suite (`python3 -m unittest discover -s tests`) passes with 237/237 tests OK. |

---

## 4. A23 SafeMode Risk Check (S6)

- **Risk 1: Breaking existing Three.js API calls**: Mitigation: Three.js r128 local version matches the CDN version exactly (verified).
- **Risk 2: Service worker stale cache holding older files**: Mitigation: Cache key updated to `resident-lovely-v6.3.0-cache` and `activate` handler automatically purges old cache keys.
- **Risk 3: Audio latency on mobile**: Mitigation: `audio.init()` is invoked on the first user interaction (`btn-enter-chateau` click/tap), unlocking audio immediately.
- **Verdict**: SAFE TO PROCEED (Risk Level: Minimal / Zero Breaking Changes).

# Resident Lovely — Graphics Upgrade Notes

## v7.2.0 — Kawaii-Realistic Mobile Graphics (2026-09-05)

**Scope**: More kawaii *and* more realistic look; stronger Pages / mobile friendliness  
**Constraint**: Procedural only (no new binaries); leave `r3f/` alone (canonical playable surface remains Vanilla ESM at repo root for GitHub Pages)

### Player (`src/entities/player.js`)
- Rounder chibi head proportions (slight Y-squash)
- Bigger glossy anime eyes with iris / pupil / multi-catchlight stack
- Softer PBR blush (emissive pink instead of flat Basic)
- Stronger hair specular + ribbon metalness / bounce springs; larger twin-tails & bows

### Lighting & mobile budget (`src/world/scene.js`)
- Warmer kawaii key + soft peach fill + lavender-pink hemisphere
- Adaptive shadow map **512 (mobile) / 768–1024 (desktop)** via `detectGraphicsQuality()`
- Pixel ratio clamped ≤ **1.25** on narrow screens / ≤ **1.5** otherwise
- God-rays / heavy FX gated; hearts / confetti / sparkles / mist density scaled by `fxScale`

### Rooms (`src/world/rooms.js`)
- Pastel-tinted Carrara marble + rose-champagne gold procedural maps
- Soft emissive bloom on marble/gold (no postprocessing stack)

### Atmosphere (`src/world/atmosphere.js`)
- Softer pastel sky phases (Pastel Twilight / Lavender Starlight / Cotton-Candy Aurora)
- Gentler haze & aurora colors; modestly lower star sparkle density

### CSS / touch (`css/style.css`)
- Canvas fills mobile viewport (`100dvh`); larger joystick / action / HUD touch targets
- `prefers-reduced-motion` disables vignette pulse & decorative HUD animations

### Service Worker
- Cache bump to `resident-lovely-v7.2.0-cache` so Pages clients refresh assets

### Files touched
- `src/entities/player.js`, `src/world/scene.js`, `src/world/rooms.js`, `src/world/atmosphere.js`
- `css/style.css`, `service-worker.js`, `GRAPHICS_UPGRADE_NOTES.md`

### Verification
`python3 -m unittest discover -s tests -p "test_*.py"` (must stay green)

---

## Archive — v7.1.0

**Date**: 2026-09-05  
**Scope**: Critical load/play fix (service worker) + incremental PBR / lighting / atmosphere / player visual upgrades  
**Constraint**: Procedural / shader-only (no new binary assets); mobile WebGL ~60fps budget preserved

---

## 1. Critical Fixes

### Service Worker MIME poisoning (`service-worker.js`)
**Problem**: Cache-first fetch could serve previously cached `text/html` (SPA / GitHub Pages fallback) for `.js` / `.css` module requests, producing `Unexpected token '<'` and a broken boot.

**Fix (cache key `resident-lovely-v7.1.0-cache`)**:
- Network-first for script/style requests
- Reject HTML responses for JS/CSS (never cache or return them as modules)
- Safe per-asset `cache.add` on install (one missing file no longer aborts the whole install)
- Non-HTML assets still cache-first with content-type guard on put

### Test path portability (`tests/*.py`)
Hardcoded Termux `PROJECT_ROOT` / `WEBBY_DIR` paths resolved to the repo directory when the Termux tree is absent, so the suite runs on the box / CI without false FileNotFound failures.

---

## 2. Visual Upgrades

### Lighting & renderer (`src/world/scene.js`)
- `physicallyCorrectLights` + sRGB output encoding (when available)
- Lower ambient (0.42) so directional shadows read
- Hemisphere bounce light (sky cyan / ground warm stone) for soft AO feel
- Cool rim directional for gold trim / character edge
- Shadow frustum tightened; `normalBias` / `radius` for softer contact shadows
- Chandelier gold / crystal materials: higher metalness, warm emissive, envMapIntensity

### Marble & gold fidelity (`src/world/rooms.js`)
- `createProceduralSurfaceMap` / `createLuxuryMarbleMaterial` / `createLuxuryGoldMaterial`
- Compact RGB `DataTexture` Carrara veins + brushed gold (no image assets)
- Shared foyer materials switched to luxury factories; crystals get subtle emissive + opacity
- Chamber floor tiles gain `envMapIntensity`

### Surface shaders (`src/world/shaders/surface-shaders.js`)
- Bioluminescent floor: multi-octave marble veins, groove AO, cheap specular lobe
- Fallback PBR materials use `envMapIntensity`
- Volumetric light shafts: soft pulse + denser dust motes

### Atmosphere (`src/world/atmosphere.js`)
- Zenith stars + twinkle; horizon haze band
- Stronger aurora contribution; phase intensities rebalanced for contrast with new lighting

### Player look (`src/entities/player.js`)
- Gold trim / hair / ribbon / beret emissive sheen
- Skin micro-emissive; metallic eyes; body receiveShadow
- Materials tuned for ACES + hemisphere lighting

### CSS vignette (`css/style.css`)
- `#canvas-container::after` radial vignette + warm top bloom (zero GPU cost post feel)

---

## 3. Performance Notes
- Shadow map remains 1024 (mobile-safe)
- Procedural maps are 96–128px with mipmaps
- Shader work stays inside existing SurfaceShaderManager throttle (max 2 active)
- CSS vignette is compositor-only

---

## 4. Remaining Risks
- Stale clients may keep old SW until activate/claim; hard refresh once after deploy
- Headless THREE mocks lack `DataTexture` — luxury maps no-op to solid PBR (browser still gets maps)
- AtmosphereEngine still cycles lights globally; can fight per-sector `updateSceneLighting` on long sessions
- True SSAO / env cubemaps not added (intentional; cost vs mobile budget)
- No full WebGL visual regression harness; validate foyer marble/gold on device after deploy

---

## 5. Files Changed
- `service-worker.js`
- `src/world/scene.js`
- `src/world/rooms.js`
- `src/world/atmosphere.js`
- `src/world/shaders/surface-shaders.js`
- `src/entities/player.js`
- `css/style.css`
- `tests/test_backdrops.py`
- `tests/test_sectors_registry.py`
- `tests/test_adversarial_stress.py`
- `tests/test_chamber_geometry.py`
- `tests/test_blueprint_map.py`
- `tests/test_e2e_shaders_fx.py`
- `GRAPHICS_UPGRADE_NOTES.md` (this file)

## 6. Verification
`python3 -m unittest discover -s tests -p "test_*.py"` → **251 tests OK**

## v7.2.1 A11y follow-up
- `src/world/atmosphere.js`: `prefers-reduced-motion` freezes `uTime`, sets `uMotionScale=0`, zeros aurora amplitude (twinkle static).

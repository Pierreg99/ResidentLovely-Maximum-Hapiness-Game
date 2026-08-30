# Project: Resident Lovely v4.0.0 Maximal 3D Graphic Overhaul + 32-Sector World

## Architecture
- **Tech Stack**: Zero-build native ECMAScript Modules (ESM), Three.js r128 (CDN-loaded), Web Audio API synthesized audio engine, NEXUS PRIVÉ v6.0 design system.
- **Rendering Pipeline**: `THREE.WebGLRenderer` with `powerPreference: 'high-performance'`, `pixelRatio` clamped to `1.5x`, `ACESFilmicToneMapping` (exposure: 1.25), `PCFSoftShadowMap` (1024x1024 directional sun shadow map), 18 localized point lights without shadow pass.
- **Coordinate & Chamber Graph**: 18 sectors spaced across world space:
  - 1F Estate Wings: Foyer `(0,0,0)`, Library `(45,0,0)`, Garden `(-45,0,0)`, Greenhouse `(0,0,45)`, Dining `(45,0,45)`, Gallery `(-45,0,45)`, Bakery `(45,-14,-45)`.
  - 2F/3F Upper Towers: Observatory `(45,12,0)`, Clocktower `(-45,12,0)`, Mastersuite `(0,12,45)`, Ballroom `(0,12,-45)`, Cathedral `(0,24,0)`.
  - Outdoor Grounds: Gatehouse `(0,0,90)`, Reflection Pool `(-45,0,90)`, Rose Maze `(45,0,90)`, Gazebo `(0,0,135)`.
  - Subterranean: Lab `(0,-14,-45)`, Crypt `(0,-28,-45)`.
- **Zero-Emoji Protocol**: Strict adherence to NEXUS PRIVÉ v6.0: 0 emojis across all code, assets, UI, and files. SVG vector icons and Unicode geometric tokens (`★`, `❖`, `◈`, `➔`, `✔`, `•`, `▶`) only.
- **Synchronization**: Master source in `/data/data/com.termux/files/home/projects/resident-lovely-game/`, mirrored directly to `/data/data/com.termux/files/home/projects/cryo-omega/webby/` (root & `webby/resident-lovely/`).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F1 | Dynamic Sunset Skybox & Celestial Dome | Procedural GLSL gradient sky dome (`#0f172a` Midnight Blue -> `#831843` Crimson Magenta -> `#f59e0b` Sunset Gold) with animated stardust cloud noise on `THREE.ShaderMaterial` | M1 | R1 |
| F2 | Planar Water Ripple & Reflection Shader | Custom GLSL water surface shader with Gerstner/multi-sine vertex undulation, procedural normal perturbation, caustics, and Fresnel view reflectance | M2 | R2 |
| F3 | Multi-Chamber Water Integration | Integrate water shader into Grand Marble Reflection Pool (`reflection_pool`), Solarium Fountain (`garden`), and install new Tea Pavilion basin in Courtyard Greenhouse (`greenhouse`) | M2 | R2 |
| F4 | Ambient Wind Petal Particle Turbulence | Procedural wind turbulence vector physics (3D sinusoidal gusts) and ground collision bounce for cherry blossom petals across outdoor sectors (`rose_maze`, `gatehouse`, `gazebo`) | M3 | R3 |
| F5 | Crystal Chandelier Sparkle Glints | Dynamic procedural sparkle glint effects / pulsating specular flares on crystal chandelier prisms in Foyer | M3 | R3 |
| F6 | Mobile WebGL Frame Time Profiling Hook | Lightweight `window.__perfMetrics` profiling hook in `src/main.js` (`performance.now()`) validating frame time <= 5.0ms (60 FPS) | M4 | AC |
| F7 | Full Test Suite & Zero-Emoji Validation | Python 3.14.6 automated test suite validating ES module graph, DOM bindings, zero-emoji compliance, and E2E requirements | M4 | AC |
| F8 | Webby Build Synchronization | Complete bidirectional synchronization of updated game assets, modules, and docs to `~/projects/cryo-omega/webby/` and `webby/resident-lovely/` | M4 | AC |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Sunset Skybox & Celestial Dome | `src/world/scene.js` (ShaderMaterial, gradient GLSL, stardust clouds, animation loop) | none | PLANNED |
| M2 | Planar Water Reflections & Caustics | `src/world/rooms.js`, `src/world/scene.js` (Water shader material, reflection pool, solarium fountain, tea pavilion basin, caustics) | M1 | PLANNED |
| M3 | Atmospheric Environmental FX | `src/world/scene.js` (Wind turbulence petal physics, outdoor sector spawning, chandelier crystal sparkle glints) | M1 | PLANNED |
| M4 | Performance, Test Suite & Webby Sync | `src/main.js`, E2E test suite, webby sync verification | M1, M2, M3 | PLANNED |

## Interface Contracts

### Skybox Shader (`src/world/scene.js`)
- **Mesh**: `sunsetSkyDome` (`THREE.SphereGeometry(320, 32, 24)`)
- **Material**: `THREE.ShaderMaterial`
- **Uniforms**:
  - `uTime`: `{ value: 0.0 }` (updated per frame via `delta` or elapsed clock)
  - `uZenithColor`: `{ value: new THREE.Color(0x0f172a) }` (Midnight Blue)
  - `uHorizonColor`: `{ value: new THREE.Color(0x831843) }` (Crimson Magenta)
  - `uSunsetColor`: `{ value: new THREE.Color(0xf59e0b) }` (Sunset Gold)
  - `uStardustIntensity`: `{ value: 1.0 }`
- **Vertex Shader**: Passes normalized world/local elevation `vPosition` and `vUv`.
- **Fragment Shader**: Vertical smoothstep gradient blend + procedural stardust/nebula noise.

### Water Shader (`src/world/rooms.js` & `src/world/scene.js`)
- **Function**: `createWaterShaderMaterial(options)` returning `THREE.ShaderMaterial`.
- **Uniforms**:
  - `uTime`: `{ value: 0.0 }`
  - `uDeepColor`: `{ value: new THREE.Color(0x0284c7) }`
  - `uShallowColor`: `{ value: new THREE.Color(0x38bdf8) }`
  - `uSunsetColor`: `{ value: new THREE.Color(0xf59e0b) }`
  - `uCausticIntensity`: `{ value: 0.6 }`
  - `uWaveSpeed`: `{ value: 1.2 }`
  - `uWaveHeight`: `{ value: 0.08 }`
- **Vertex Shader**: Gerstner/multi-wave displacement: `y += sin(...) + cos(...)`.
- **Fragment Shader**: Procedural normal perturbation, Fresnel blend, animated Voronoi caustic lighting.

### Environmental FX (`src/world/scene.js`)
- **Petals**: Array of particle meshes with physics states (`velX`, `velY`, `velZ`, `baseY`, `bounceCount`, `sector`).
- **Chandelier Glints**: Procedural cross-star / octahedron specular glints anchored at `(0, 9.5, 0)` with oscillating opacity/scale in Foyer.

## Code Layout
- `src/world/scene.js`: Scene setup, lighting, `sunsetSkyDome` shader material, petal particle wind physics, chandelier glints, renderer.
- `src/world/rooms.js`: Chamber definitions, water surface meshes (Reflection Pool, Solarium Fountain, Greenhouse Tea Pavilion), water shader binding.
- `src/main.js`: Main loop, performance telemetry (`window.__perfMetrics`), room transitions, input.
- `tests/test_e2e_shaders_fx.py`: Automated E2E verification test suite.

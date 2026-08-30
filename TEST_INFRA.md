# E2E Test Infra: Resident Lovely v3.5.0 PBR Shaders, Backdrops & 32-Sector Graphic Map Expansion

## Test Philosophy
- Opaque-box, requirement-driven verification covering Visual & Shader Pipeline, 2.5D Backdrops, GLSL Surface Shaders, Holographic Blueprint Map v2, Procedural Chamber Geometry, Mobile Performance, Zero-Emoji Compliance, and Build Synchronization.
- Methodology: Category-Partition + Boundary Value Analysis (BVA) + Pairwise Interaction + Real-World Workload Testing.

## Feature Inventory
| # | Feature | Source | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|---|---------|--------|:------:|:------:|:------:|:------:|
| F1 | Dynamic Sunset Skybox & Celestial Dome | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| F2 | Planar Water Ripple & Reflection Shader | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ | ✓ |
| F3 | Multi-Chamber Water Integration | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ | ✓ |
| F4 | Wind Petal Particle Turbulence & Collision | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ | ✓ |
| F5 | Crystal Chandelier Sparkle Glints | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ | ✓ |
| F6 | Mobile WebGL Frame Time Profiling Hook | ORIGINAL_REQUEST §AC | 5 | 5 | ✓ | ✓ |
| F7 | Zero-Emoji Compliance Across Assets | ORIGINAL_REQUEST §AC | 5 | 5 | ✓ | ✓ |
| F8 | Webby Build Synchronization | ORIGINAL_REQUEST §AC | 5 | 5 | ✓ | ✓ |
| F9 | Modular Sector Registry (S01 - S32) | Spec §R1 | 5 | 5 | ✓ | ✓ |
| F10 | Illustrated 2.5D Backdrops & LRU Texture Manager | Spec §R2 | 5 | 5 | ✓ | ✓ |
| F11 | Per-Sector GLSL Surface Shaders & Throttling | Spec §R3 | 5 | 5 | ✓ | ✓ |
| F12 | Holographic Blueprint Map v2 & SVG Engine | Spec §R4 | 5 | 5 | ✓ | ✓ |
| F13 | Procedural 3D Chamber Geometry & Props (S19 - S32) | Spec §R5 | 5 | 5 | ✓ | ✓ |

## Test Architecture
- **E2E Suite Runner**: Python 3.14.6 automated test suite located at `tests/test_e2e_shaders_fx.py`.
- **E2E Invocation**: `python3 tests/test_e2e_shaders_fx.py` (153 tests, ~39s)
- **Full Discovery Invocation**: `python3 -m unittest discover -s tests -p "test_*.py"` (212 tests, ~66s)
- **Pass/Fail Semantics**: Returns exit code 0 when 100% of test assertions pass; non-zero exit code with detailed traceback on failure.

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | Outdoor Estate Grounds Traversal (`gatehouse` -> `reflection_pool` -> `rose_maze` -> `gazebo`) | F1, F2, F3, F4, F6 | High |
| 2 | Solarium Garden Water Meditation (`garden` -> `greenhouse` tea pavilion) | F2, F3, F6 | Medium |
| 3 | Grand Foyer Evening Atmosphere (`foyer` piano + crystal chandelier sparkle + caustic floor) | F1, F2, F5, F6 | Medium |
| 4 | Full Estate Exploration Cycle across all 32 Sectors (S01 - S32) | F9, F10, F11, F12, F13 | High |
| 5 | Mobile WebGL 60 FPS Thermal Simulation & Zero-Emoji Stress | F6, F7, F8 | High |
| 6 | B2 Subterranean Depth Expedition (S18 -> S30 -> S31 -> S32) | F9, F10, F11, F13 | High |
| 7 | 4F Upper Tower Ascent & Stargazing Soiree (S12 -> S27 -> S28) | F1, F10, F13 | Medium |
| 8 | 1F Expansion Wing Exploration (S01 -> S03 -> S19 -> S20 -> S21) | F9, F10, F11, F12, F13 | High |

## Coverage Thresholds
- Tier 1: ≥5 test cases per feature (65 tests across 13 features)
- Tier 2: ≥5 boundary/edge test cases per feature (65 tests across 13 features)
- Tier 3: Pairwise cross-feature interactions (15 tests)
- Tier 4: Real-world estate workload scenarios (8 scenarios)
- **E2E Suite Total**: 153 automated test cases
- **Full Discovered Suite Total**: 212 automated test cases

// =========================================================================
// RESIDENT LOVELY - ILLUSTRATED 2.5D BACKDROP SYSTEM & LRU TEXTURE CACHE
// Standard: NEXUS PRIVE v6.0 | Strict Zero-Emoji Protocol | Native ESM
// =========================================================================

import { getSector, SECTOR_REGISTRY } from './sectors.js';

// Global Three.js reference resolution (browser global or Node environment)
const THREE_LIB = typeof THREE !== 'undefined' ? THREE : (typeof globalThis !== 'undefined' && globalThis.THREE ? globalThis.THREE : null);

/**
 * Maximum active GPU textures allowed concurrently in VRAM.
 * Strict mobile WebGL budget constraint (M6/R2 specification).
 */
export const MAX_ACTIVE_TEXTURES = 3;

/**
 * Camera parallax coefficient relative to active chamber center.
 */
export const PARALLAX_FACTOR = 0.005;

/**
 * Default backdrop dimensions in Three.js world units.
 */
export const DEFAULT_BACKDROP_WIDTH = 120;
export const DEFAULT_BACKDROP_HEIGHT = 80;
export const DEFAULT_DEPTH_OFFSET = -30;

/**
 * Biome fallback color definitions conforming to NEXUS PRIVE v6.0 palette.
 */
export const BIOME_GRADIENTS = {
  estate: { zenith: 0x0f172a, horizon: 0x1e293b, accent: 0x22d3ee },
  gothic: { zenith: 0x090514, horizon: 0x3b0764, accent: 0x7c3aed },
  kawaii: { zenith: 0x1a0818, horizon: 0x831843, accent: 0xf472b6 },
  outdoor: { zenith: 0x020617, horizon: 0x065f46, accent: 0x10b981 },
  forest: { zenith: 0x021c14, horizon: 0x064e3b, accent: 0x065f46 },
  maritime: { zenith: 0x020817, horizon: 0x075985, accent: 0x0284c7 },
  subterranean: { zenith: 0x05070a, horizon: 0x451a03, accent: 0x78350f },
  crystal: { zenith: 0x05070a, horizon: 0x2e1065, accent: 0xa78bfa }
};

/**
 * Authoritative mapping of sector IDs and slugs to backdrop SVG assets.
 */
export const BACKDROP_ASSET_MAP = {
  // 1F Estate Wings & Extensions (S01 - S07, S19 - S21)
  S01: 'assets/backdrops/backdrop_foyer.svg',
  foyer: 'assets/backdrops/backdrop_foyer.svg',
  S02: 'assets/backdrops/backdrop_library.svg',
  library: 'assets/backdrops/backdrop_library.svg',
  S03: 'assets/backdrops/backdrop_garden.svg',
  garden: 'assets/backdrops/backdrop_garden.svg',
  S04: 'assets/backdrops/backdrop_greenhouse.svg',
  greenhouse: 'assets/backdrops/backdrop_greenhouse.svg',
  S05: 'assets/backdrops/backdrop_dining.svg',
  dining: 'assets/backdrops/backdrop_dining.svg',
  S06: 'assets/backdrops/backdrop_gallery.svg',
  gallery: 'assets/backdrops/backdrop_gallery.svg',
  S07: 'assets/backdrops/backdrop_bakery.svg',
  bakery: 'assets/backdrops/backdrop_bakery.svg',

  // S19 - S21
  S19: 'assets/backdrops/backdrop_conservatory_annex.svg',
  conservatory: 'assets/backdrops/backdrop_conservatory_annex.svg',
  haunted_conservatory: 'assets/backdrops/backdrop_haunted_conservatory.svg',
  S20: 'assets/backdrops/backdrop_tea_salon.svg',
  tea_salon: 'assets/backdrops/backdrop_tea_salon.svg',
  S21: 'assets/backdrops/backdrop_clockwork_archives.svg',
  music_parlor: 'assets/backdrops/backdrop_music_parlor.svg',
  clockwork_archives: 'assets/backdrops/backdrop_clockwork_archives.svg',

  // 2F / 3F / 4F Towers (S08 - S12, S27 - S29)
  S08: 'assets/backdrops/backdrop_observatory.svg',
  observatory: 'assets/backdrops/backdrop_observatory.svg',
  S09: 'assets/backdrops/backdrop_clocktower.svg',
  clocktower: 'assets/backdrops/backdrop_clocktower.svg',
  S10: 'assets/backdrops/backdrop_mastersuite.svg',
  mastersuite: 'assets/backdrops/backdrop_mastersuite.svg',
  S11: 'assets/backdrops/backdrop_ballroom.svg',
  ballroom: 'assets/backdrops/backdrop_ballroom.svg',
  S12: 'assets/backdrops/backdrop_cathedral.svg',
  cathedral: 'assets/backdrops/backdrop_cathedral.svg',

  // S27 - S29
  S27: 'assets/backdrops/backdrop_grand_terrace.svg',
  moonlit_rooftop: 'assets/backdrops/backdrop_moonlit_rooftop.svg',
  grand_terrace: 'assets/backdrops/backdrop_grand_terrace.svg',
  S28: 'assets/backdrops/backdrop_secret_belfry.svg',
  clock_tower_belfry: 'assets/backdrops/backdrop_clock_tower_belfry.svg',
  secret_belfry: 'assets/backdrops/backdrop_secret_belfry.svg',
  S29: 'assets/backdrops/backdrop_mirror_maze.svg',
  mirror_maze_gallery: 'assets/backdrops/backdrop_mirror_maze_gallery.svg',
  mirror_maze: 'assets/backdrops/backdrop_mirror_maze.svg',

  // Subterranean Levels B1 & B2 (S17, S18, S30 - S32)
  S17: 'assets/backdrops/backdrop_lab.svg',
  lab: 'assets/backdrops/backdrop_lab.svg',
  S18: 'assets/backdrops/backdrop_crypt.svg',
  crypt: 'assets/backdrops/backdrop_crypt.svg',

  // S30 - S32
  S30: 'assets/backdrops/backdrop_ice_chamber.svg',
  underground_river_cavern: 'assets/backdrops/backdrop_underground_river_cavern.svg',
  ice_chamber: 'assets/backdrops/backdrop_ice_chamber.svg',
  S31: 'assets/backdrops/backdrop_crystal_vault.svg',
  crystal_vault: 'assets/backdrops/backdrop_crystal_vault.svg',
  S32: 'assets/backdrops/backdrop_alchemy_dungeon.svg',
  ancient_ruins: 'assets/backdrops/backdrop_ancient_ruins.svg',
  alchemy_dungeon: 'assets/backdrops/backdrop_alchemy_dungeon.svg',

  // Outdoor Grounds (S13 - S16, S22 - S26)
  S13: 'assets/backdrops/backdrop_gatehouse.svg',
  gatehouse: 'assets/backdrops/backdrop_gatehouse.svg',
  S14: 'assets/backdrops/backdrop_reflection_pool.svg',
  reflection_pool: 'assets/backdrops/backdrop_reflection_pool.svg',
  S15: 'assets/backdrops/backdrop_rose_maze.svg',
  rose_maze: 'assets/backdrops/backdrop_rose_maze.svg',
  S16: 'assets/backdrops/backdrop_gazebo.svg',
  gazebo: 'assets/backdrops/backdrop_gazebo.svg',

  // S22 - S26
  S22: 'assets/backdrops/backdrop_village_district.svg',
  village_district: 'assets/backdrops/backdrop_village_district.svg',
  S23: 'assets/backdrops/backdrop_sacred_forest.svg',
  sacred_forest_trail: 'assets/backdrops/backdrop_sacred_forest_trail.svg',
  sacred_forest: 'assets/backdrops/backdrop_sacred_forest.svg',
  S24: 'assets/backdrops/backdrop_harbor_docks.svg',
  harbor_docks: 'assets/backdrops/backdrop_harbor_docks.svg',
  lighthouse_deck: 'assets/backdrops/backdrop_lighthouse_deck.svg',
  S25: 'assets/backdrops/backdrop_planetarium.svg',
  moonlit_meadow: 'assets/backdrops/backdrop_moonlit_meadow.svg',
  planetarium: 'assets/backdrops/backdrop_planetarium.svg',
  S26: 'assets/backdrops/backdrop_sunken_grotto.svg',
  crystal_grotto: 'assets/backdrops/backdrop_crystal_grotto.svg',
  sunken_grotto: 'assets/backdrops/backdrop_sunken_grotto.svg',

  // S33 - S40 (5F Astral Spire & B3 Abyssal Trench)
  S33: 'assets/backdrops/backdrop_astral_spire_peak.svg',
  astral_spire_peak: 'assets/backdrops/backdrop_astral_spire_peak.svg',
  S34: 'assets/backdrops/backdrop_starlight_sanctuary.svg',
  starlight_sanctuary: 'assets/backdrops/backdrop_starlight_sanctuary.svg',
  S35: 'assets/backdrops/backdrop_celestial_chamber.svg',
  celestial_chamber: 'assets/backdrops/backdrop_celestial_chamber.svg',
  S36: 'assets/backdrops/backdrop_moonbeam_zenith.svg',
  moonbeam_zenith: 'assets/backdrops/backdrop_moonbeam_zenith.svg',
  S37: 'assets/backdrops/backdrop_abyssal_trench_gateway.svg',
  abyssal_trench_gateway: 'assets/backdrops/backdrop_abyssal_trench_gateway.svg',
  S38: 'assets/backdrops/backdrop_coral_trench.svg',
  coral_trench: 'assets/backdrops/backdrop_coral_trench.svg',
  S39: 'assets/backdrops/backdrop_deep_alchemical_vault.svg',
  deep_alchemical_vault: 'assets/backdrops/backdrop_deep_alchemical_vault.svg',
  S40: 'assets/backdrops/backdrop_ancient_core_crucible.svg',
  ancient_core_crucible: 'assets/backdrops/backdrop_ancient_core_crucible.svg'
};

/**
 * Resolve the asset path for a given sector ID or slug.
 */
export function resolveBackdropAsset(sectorIdOrSlug) {
  if (!sectorIdOrSlug || typeof sectorIdOrSlug !== 'string') return null;
  const key = sectorIdOrSlug.trim();
  const upperKey = key.toUpperCase();
  const lowerKey = key.toLowerCase();

  if (BACKDROP_ASSET_MAP[key]) return BACKDROP_ASSET_MAP[key];
  if (BACKDROP_ASSET_MAP[upperKey]) return BACKDROP_ASSET_MAP[upperKey];
  if (BACKDROP_ASSET_MAP[lowerKey]) return BACKDROP_ASSET_MAP[lowerKey];

  const sector = getSector(key);
  if (sector) {
    if (sector.backdropSvg) return `assets/backdrops/${sector.backdropSvg}`;
    if (sector.backdrop) return sector.backdrop;
    if (BACKDROP_ASSET_MAP[sector.id]) return BACKDROP_ASSET_MAP[sector.id];
    if (BACKDROP_ASSET_MAP[sector.slug]) return BACKDROP_ASSET_MAP[sector.slug];
  }

  return `assets/backdrops/backdrop_${lowerKey}.svg`;
}

// =========================================================================
// LRU TEXTURE CACHE IMPLEMENTATION
// =========================================================================

/**
 * Least Recently Used (LRU) Texture Cache.
 * Evicts oldest texture to guarantee active GPU textures <= maxActive (3).
 */
export class LRUTextureCache {
  constructor(maxSize = MAX_ACTIVE_TEXTURES) {
    this.maxSize = Math.max(1, maxSize);
    this.cache = new Map(); // Key -> { texture, timestamp, sectorId }
  }

  get size() {
    return this.cache.size;
  }

  has(key) {
    return this.cache.has(key);
  }

  get(key) {
    if (!this.cache.has(key)) return null;
    const entry = this.cache.get(key);
    entry.timestamp = Date.now();
    // Re-insert to maintain insertion order for MRU
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.texture;
  }

  set(key, texture) {
    if (!key || !texture) return;

    if (this.cache.has(key)) {
      const existing = this.cache.get(key);
      if (existing.texture !== texture && existing.texture && typeof existing.texture.dispose === 'function') {
        existing.texture.dispose();
      }
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Evict least recently used (first item in Map iterator)
      const oldestKey = this.cache.keys().next().value;
      this.evict(oldestKey);
    }

    this.cache.set(key, {
      texture,
      timestamp: Date.now()
    });
  }

  evict(key) {
    if (!this.cache.has(key)) return;
    const entry = this.cache.get(key);
    if (entry.texture && typeof entry.texture.dispose === 'function') {
      try {
        entry.texture.dispose();
      } catch (err) {
        // Safe disposal
      }
    }
    this.cache.delete(key);
  }

  delete(key) {
    this.evict(key);
  }

  clear() {
    for (const [key, entry] of this.cache.entries()) {
      if (entry.texture && typeof entry.texture.dispose === 'function') {
        try {
          entry.texture.dispose();
        } catch (err) {
          // Safe disposal
        }
      }
    }
    this.cache.clear();
  }

  keys() {
    return Array.from(this.cache.keys());
  }

  getState() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      keys: this.keys()
    };
  }
}

// =========================================================================
// GLSL SHADERS WITH RADIAL VIGNETTE & PROCEDURAL FALLBACK GRADIENT
// =========================================================================

export const BACKDROP_VERTEX_SHADER = `
varying vec2 vUv;
varying vec3 vWorldPosition;

void main() {
  vUv = uv;
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`;

export const BACKDROP_FRAGMENT_SHADER = `
uniform sampler2D uTexture;
uniform float uUseTexture;
uniform float uTime;
uniform float uAlpha;
uniform vec3 uBiomeColor;
uniform vec3 uZenithColor;
uniform vec3 uHorizonColor;
uniform float uVignetteInner;
uniform float uVignetteOuter;
uniform vec2 uParallaxOffset;

varying vec2 vUv;
varying vec3 vWorldPosition;

// Simple procedural noise for stardust / gradient shimmer
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  // Apply camera parallax offset to texture UV coordinates
  vec2 uv = clamp(vUv + uParallaxOffset, 0.0, 1.0);

  vec4 baseColor = vec4(0.0);

  if (uUseTexture > 0.5) {
    baseColor = texture2D(uTexture, uv);
  } else {
    // Procedural GLSL fallback gradient
    float elevation = uv.y;
    vec3 skyGradient = mix(uHorizonColor, uZenithColor, smoothstep(0.05, 0.95, elevation));
    
    // Subtle animated ambient wave and star shimmer
    float wave = sin(uv.x * 12.0 + uTime * 1.2) * cos(uv.y * 10.0 + uTime * 0.8) * 0.04;
    float starMote = hash(floor(uv * 90.0) + floor(uTime * 0.5)) * 0.08;
    
    vec3 proceduralRgb = mix(skyGradient, uBiomeColor, 0.22) + vec3(wave + starMote);
    baseColor = vec4(proceduralRgb, 1.0);
  }

  // Radial vignette alpha falloff / edge softening for smooth 3D chamber blending
  vec2 center = vec2(0.5, 0.5);
  float dist = distance(vUv, center);
  float vignette = smoothstep(uVignetteOuter, uVignetteInner, dist);

  // Obsidian void blending (#05070a: 0.0196, 0.0275, 0.0392)
  vec3 obsidianVoid = vec3(0.0196, 0.0275, 0.0392);
  vec3 finalRgb = mix(obsidianVoid, baseColor.rgb, vignette);
  float finalAlpha = baseColor.a * vignette * uAlpha;

  gl_FragColor = vec4(finalRgb, finalAlpha);
}
`;

// =========================================================================
// BACKDROP MANAGER CLASS
// =========================================================================

export class BackdropManager {
  /**
   * @param {Object} options
   * @param {number} [options.maxActive=3] - Maximum active textures in LRU cache
   * @param {number} [options.parallaxFactor=0.005] - Camera parallax offset multiplier
   * @param {number} [options.vignetteInner=0.35] - Radial vignette inner threshold
   * @param {number} [options.vignetteOuter=0.50] - Radial vignette outer threshold
   * @param {number} [options.width=120] - Quad width in world units
   * @param {number} [options.height=80] - Quad height in world units
   * @param {number} [options.depthOffset=-30] - Z-offset relative to chamber center
   */
  constructor(options = {}) {
    this.maxActive = options.maxActive || MAX_ACTIVE_TEXTURES;
    this.parallaxFactor = typeof options.parallaxFactor === 'number' ? options.parallaxFactor : PARALLAX_FACTOR;
    this.vignetteInner = typeof options.vignetteInner === 'number' ? options.vignetteInner : 0.35;
    this.vignetteOuter = typeof options.vignetteOuter === 'number' ? options.vignetteOuter : 0.50;
    this.width = options.width || DEFAULT_BACKDROP_WIDTH;
    this.height = options.height || DEFAULT_BACKDROP_HEIGHT;
    this.depthOffset = typeof options.depthOffset === 'number' ? options.depthOffset : DEFAULT_DEPTH_OFFSET;

    this.lruCache = new LRUTextureCache(this.maxActive);
    this.currentSectorId = null;
    this.activeChamberCenter = { x: 0, y: 0, z: 0 };
    this.basePosition = { x: 0, y: 0, z: 0 };

    this.textureLoader = null;
    this.pendingLoads = new Map();

    // Instantiate Three.js Quad Mesh & ShaderMaterial
    this.initMesh();

    this.scene = options.scene || null;
    if (this.scene && this.mesh && typeof this.scene.add === 'function') {
      this.scene.add(this.mesh);
    }
  }

  initMesh() {
    const THREE = THREE_LIB;
    if (!THREE) {
      // Mock / fallback representation in non-Three environment
      this.geometry = { dispose: () => {} };
      this.material = {
        uniforms: {
          uTexture: { value: null },
          uUseTexture: { value: 0.0 },
          uTime: { value: 0.0 },
          uAlpha: { value: 1.0 },
          uBiomeColor: { value: { r: 0.13, g: 0.83, b: 0.93, setHex: () => {} } },
          uZenithColor: { value: { r: 0.06, g: 0.09, b: 0.16, setHex: () => {} } },
          uHorizonColor: { value: { r: 0.51, g: 0.09, b: 0.26, setHex: () => {} } },
          uVignetteInner: { value: this.vignetteInner },
          uVignetteOuter: { value: this.vignetteOuter },
          uParallaxOffset: { value: { x: 0, y: 0, set: function(x, y) { this.x = x; this.y = y; } } }
        },
        depthWrite: false,
        depthTest: false,
        transparent: true,
        dispose: () => {}
      };
      this.mesh = {
        renderOrder: -1,
        position: { x: 0, y: 0, z: 0, set: function(x, y, z) { this.x = x; this.y = y; this.z = z; } },
        rotation: { x: 0, y: 0, z: 0, set: () => {} },
        scale: { x: 1, y: 1, z: 1, set: () => {} },
        material: this.material,
        geometry: this.geometry,
        name: 'SectorBackdropQuad'
      };
      return;
    }

    this.geometry = new THREE.PlaneGeometry(this.width, this.height);

    const zenithHex = BIOME_GRADIENTS.estate.zenith;
    const horizonHex = BIOME_GRADIENTS.estate.horizon;
    const accentHex = BIOME_GRADIENTS.estate.accent;

    this.material = new THREE.ShaderMaterial({
      vertexShader: BACKDROP_VERTEX_SHADER,
      fragmentShader: BACKDROP_FRAGMENT_SHADER,
      uniforms: {
        uTexture: { value: null },
        uUseTexture: { value: 0.0 },
        uTime: { value: 0.0 },
        uAlpha: { value: 1.0 },
        uBiomeColor: { value: new THREE.Color(accentHex) },
        uZenithColor: { value: new THREE.Color(zenithHex) },
        uHorizonColor: { value: new THREE.Color(horizonHex) },
        uVignetteInner: { value: this.vignetteInner },
        uVignetteOuter: { value: this.vignetteOuter },
        uParallaxOffset: { value: new THREE.Vector2(0.0, 0.0) }
      },
      depthWrite: false,
      depthTest: false,
      transparent: true,
      side: THREE.DoubleSide
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.renderOrder = -1;
    this.mesh.name = 'SectorBackdropQuad';
    this.mesh.frustumCulled = false;

    if (THREE.TextureLoader) {
      this.textureLoader = new THREE.TextureLoader();
    }
  }

  /**
   * Set the active sector backdrop, repositioning the quad and updating shaders.
   * @param {string} sectorIdOrSlug
   */
  setSector(sectorIdOrSlug) {
    if (!sectorIdOrSlug) return;
    const sector = getSector(sectorIdOrSlug);
    const sectorId = sector ? sector.id : sectorIdOrSlug.toUpperCase();
    this.currentSectorId = sectorId;

    // Determine chamber coordinates
    if (sector && sector.coords) {
      this.activeChamberCenter.x = sector.coords.x || 0;
      this.activeChamberCenter.y = sector.coords.y || 0;
      this.activeChamberCenter.z = sector.coords.z || 0;
    } else if (sector && Array.isArray(sector.position)) {
      this.activeChamberCenter.x = sector.position[0] || 0;
      this.activeChamberCenter.y = sector.position[1] || 0;
      this.activeChamberCenter.z = sector.position[2] || 0;
    } else {
      this.activeChamberCenter.x = 0;
      this.activeChamberCenter.y = 0;
      this.activeChamberCenter.z = 0;
    }

    // Position quad behind active chamber
    this.basePosition.x = this.activeChamberCenter.x;
    this.basePosition.y = this.activeChamberCenter.y + (this.height * 0.35);
    this.basePosition.z = this.activeChamberCenter.z + this.depthOffset;

    if (this.mesh && this.mesh.position && typeof this.mesh.position.set === 'function') {
      this.mesh.position.set(this.basePosition.x, this.basePosition.y, this.basePosition.z);
    }

    // Apply Biome Colors to uniforms
    const biomeKey = (sector && sector.biome && BIOME_GRADIENTS[sector.biome]) ? sector.biome : 'estate';
    const grad = BIOME_GRADIENTS[biomeKey] || BIOME_GRADIENTS.estate;

    if (this.material && this.material.uniforms) {
      if (this.material.uniforms.uBiomeColor && this.material.uniforms.uBiomeColor.value && typeof this.material.uniforms.uBiomeColor.value.setHex === 'function') {
        this.material.uniforms.uBiomeColor.value.setHex(grad.accent);
      }
      if (this.material.uniforms.uZenithColor && this.material.uniforms.uZenithColor.value && typeof this.material.uniforms.uZenithColor.value.setHex === 'function') {
        this.material.uniforms.uZenithColor.value.setHex(grad.zenith);
      }
      if (this.material.uniforms.uHorizonColor && this.material.uniforms.uHorizonColor.value && typeof this.material.uniforms.uHorizonColor.value.setHex === 'function') {
        this.material.uniforms.uHorizonColor.value.setHex(grad.horizon);
      }
    }

    // Load or retrieve texture via LRU cache
    this.loadSectorTexture(sectorId);
  }

  /**
   * Asynchronously load and assign texture via LRU cache.
   * Falls back to procedural gradient until texture is ready.
   * @param {string} sectorId
   */
  loadSectorTexture(sectorId) {
    const assetPath = resolveBackdropAsset(sectorId);
    if (!assetPath) {
      this.applyFallback();
      return;
    }

    // 1. Check if already active in LRU cache
    if (this.lruCache.has(assetPath)) {
      const cachedTexture = this.lruCache.get(assetPath);
      this.applyTexture(cachedTexture);
      return;
    }

    // 2. Fallback procedural gradient active during load
    this.applyFallback();

    // 3. Initiate texture load
    if (!this.textureLoader) {
      return;
    }

    if (this.pendingLoads.has(assetPath)) {
      return;
    }

    const loadPromise = new Promise((resolve) => {
      this.textureLoader.load(
        assetPath,
        (texture) => {
          this.pendingLoads.delete(assetPath);
          this.lruCache.set(assetPath, texture);
          // If this sector is still the active one, apply texture
          if (this.currentSectorId === sectorId) {
            this.applyTexture(texture);
          }
          resolve(texture);
        },
        undefined,
        (err) => {
          this.pendingLoads.delete(assetPath);
          // Keep procedural fallback active on error
          this.applyFallback();
          resolve(null);
        }
      );
    });

    this.pendingLoads.set(assetPath, loadPromise);
  }

  /**
   * Apply texture to shader material uniforms.
   */
  applyTexture(texture) {
    if (!this.material || !this.material.uniforms) return;
    this.material.uniforms.uTexture.value = texture;
    this.material.uniforms.uUseTexture.value = 1.0;
  }

  /**
   * Apply procedural gradient fallback.
   */
  applyFallback() {
    if (!this.material || !this.material.uniforms) return;
    this.material.uniforms.uUseTexture.value = 0.0;
  }

  /**
   * Preload a sector backdrop into the LRU cache ahead of player arrival.
   * @param {string} sectorIdOrSlug
   * @returns {Promise}
   */
  async preload(sectorIdOrSlug) {
    const assetPath = resolveBackdropAsset(sectorIdOrSlug);
    if (!assetPath || this.lruCache.has(assetPath) || !this.textureLoader) {
      return Promise.resolve(null);
    }
    return new Promise((resolve) => {
      this.textureLoader.load(
        assetPath,
        (texture) => {
          this.lruCache.set(assetPath, texture);
          resolve(texture);
        },
        undefined,
        () => resolve(null)
      );
    });
  }

  /**
   * Per-frame update step: handles sector transition, parallax offset, and shader time uniform.
   * @param {string|null} currentSectorId
   * @param {Object} camera - Three.js Camera instance
   * @param {number} [deltaTime=0.016]
   */
  update(currentSectorId, camera, deltaTime = 0.016) {
    // 1. Sector transition detection
    if (currentSectorId && currentSectorId !== this.currentSectorId) {
      this.setSector(currentSectorId);
    }

    // 2. Update shader time progression
    if (this.material && this.material.uniforms && this.material.uniforms.uTime) {
      this.material.uniforms.uTime.value += deltaTime;
    }

    // 3. Camera parallax offset calculation relative to active chamber center
    if (camera && camera.position) {
      const dx = (camera.position.x || 0) - this.activeChamberCenter.x;
      const dy = (camera.position.y || 0) - this.activeChamberCenter.y;

      const offsetX = -dx * this.parallaxFactor;
      const offsetY = -dy * this.parallaxFactor;

      if (this.material && this.material.uniforms && this.material.uniforms.uParallaxOffset && this.material.uniforms.uParallaxOffset.value) {
        if (typeof this.material.uniforms.uParallaxOffset.value.set === 'function') {
          this.material.uniforms.uParallaxOffset.value.set(offsetX, offsetY);
        } else {
          this.material.uniforms.uParallaxOffset.value.x = offsetX;
          this.material.uniforms.uParallaxOffset.value.y = offsetY;
        }
      }

      // Subtle physical mesh position tracking
      if (this.mesh && this.mesh.position) {
        this.mesh.position.x = this.basePosition.x + (dx * this.parallaxFactor * 0.5);
        this.mesh.position.y = this.basePosition.y + (dy * this.parallaxFactor * 0.5);
      }
    }
  }

  /**
   * Retrieve the backdrop mesh for adding to scene.
   * @returns {Object} THREE.Mesh
   */
  getMesh() {
    return this.mesh;
  }

  /**
   * Retrieve current active sector ID.
   * @returns {string|null}
   */
  getActiveSector() {
    return this.currentSectorId;
  }

  /**
   * Retrieve LRU cache size.
   * @returns {number}
   */
  getLRUSize() {
    return this.lruCache.size;
  }

  /**
   * Retrieve LRU cache state object.
   * @returns {Object}
   */
  getLRUState() {
    return this.lruCache.getState();
  }

  /**
   * Retrieve material uniforms map.
   * @returns {Object}
   */
  getUniforms() {
    return this.material ? this.material.uniforms : null;
  }

  /**
   * Dispose all GPU resources, geometries, materials, and active textures.
   */
  dispose() {
    this.lruCache.clear();

    if (this.geometry && typeof this.geometry.dispose === 'function') {
      this.geometry.dispose();
    }
    if (this.material && typeof this.material.dispose === 'function') {
      this.material.dispose();
    }

    if (this.mesh && this.mesh.parent && typeof this.mesh.parent.remove === 'function') {
      this.mesh.parent.remove(this.mesh);
    }
  }
}

/**
 * Factory helper function to instantiate a BackdropManager.
 * @param {string} [initialSectorId='S01']
 * @param {Object} [options={}]
 * @returns {BackdropManager}
 */
export function createSectorBackdrop(initialSectorId = 'S01', options = {}) {
  const manager = new BackdropManager(options);
  if (initialSectorId) {
    manager.setSector(initialSectorId);
  }
  return manager;
}

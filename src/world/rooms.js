// =========================================================================
// RESIDENT LOVELY - 3D CHAMBER GEOMETRY & PROPS ENGINE (S01 - S32)
// Standard: NEXUS PRIVE v6.0 | Strict Zero-Emoji Protocol | Native ESM
// =========================================================================

import { scene, createWaterShaderMaterial } from './scene.js';
import { SECTOR_REGISTRY, getSector } from './sectors.js';

// Global room groups map (keyed by slug and sector ID)
export const rooms = {
  // --- 1F Estate Wings ---
  foyer: new THREE.Group(),
  library: new THREE.Group(),
  garden: new THREE.Group(),
  greenhouse: new THREE.Group(),
  dining: new THREE.Group(),
  gallery: new THREE.Group(),
  bakery: new THREE.Group(),

  // --- 2F / 3F / 4F Upper Towers ---
  observatory: new THREE.Group(),
  clocktower: new THREE.Group(),
  mastersuite: new THREE.Group(),
  ballroom: new THREE.Group(),
  cathedral: new THREE.Group(),
  moonlit_rooftop: new THREE.Group(),
  clock_tower_belfry: new THREE.Group(),
  mirror_maze_gallery: new THREE.Group(),

  // --- Open Grounds (Outdoor) ---
  gatehouse: new THREE.Group(),
  reflection_pool: new THREE.Group(),
  rose_maze: new THREE.Group(),
  gazebo: new THREE.Group(),
  village_district: new THREE.Group(),
  sacred_forest_trail: new THREE.Group(),
  harbor_docks: new THREE.Group(),
  moonlit_meadow: new THREE.Group(),
  crystal_grotto: new THREE.Group(),

  // --- 1F Expansion Wings ---
  conservatory: new THREE.Group(),
  tea_salon: new THREE.Group(),
  music_parlor: new THREE.Group(),

  // --- Subterranean Levels (B1, B2) ---
  lab: new THREE.Group(),
  crypt: new THREE.Group(),
  underground_river_cavern: new THREE.Group(),
  crystal_vault: new THREE.Group(),
  ancient_ruins: new THREE.Group(),

  // --- 5F Astral Spire & B3 Deep Trench (S33 - S40) ---
  astral_spire_peak: new THREE.Group(),
  starlight_sanctuary: new THREE.Group(),
  celestial_chamber: new THREE.Group(),
  moonbeam_zenith: new THREE.Group(),
  abyssal_trench_gateway: new THREE.Group(),
  coral_trench: new THREE.Group(),
  deep_alchemical_vault: new THREE.Group(),
  ancient_core_crucible: new THREE.Group()
};

// Aliases by Sector ID and Alternate Slugs for direct indexing
SECTOR_REGISTRY.forEach(sector => {
  if (rooms[sector.slug]) {
    rooms[sector.id] = rooms[sector.slug];
    rooms[sector.id.toLowerCase()] = rooms[sector.slug];
  }
});

// Additional convenience aliases matching spec variations
const ALIASES = {
  haunted_conservatory: 'conservatory',
  mirror_maze: 'mirror_maze_gallery',
  sacred_forest: 'sacred_forest_trail',
  clockwork_archives: 'clock_tower_belfry',
  planetarium: 'observatory',
  ice_chamber: 'crystal_grotto',
  alchemy_dungeon: 'ancient_ruins',
  grand_terrace: 'moonlit_rooftop',
  sunken_grotto: 'underground_river_cavern',
  lighthouse_deck: 'harbor_docks',
  conservatory_annex: 'conservatory',
  secret_belfry: 'clock_tower_belfry'
};

Object.entries(ALIASES).forEach(([alias, target]) => {
  if (rooms[target] && !rooms[alias]) {
    rooms[alias] = rooms[target];
  }
});

// Dynamic animation and tracking registries
export const lanternMeshes = [];
export const groundItems = [];
export const animatedWaterMeshes = [];
export const animatedAstrolabeRings = [];
export const animatedClockGears = [];
export const animatedLabGears = [];
export const animatedBallroomCrystals = [];
export const animatedFloatingCrystals = [];
export let animatedCausticFloor = null;


// =========================================================================
// LUXURY PBR MATERIAL FACTORY (procedural marble veins + polished gold)
// =========================================================================

function _hash2(x, y) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function _fbm2(x, y) {
  let v = 0.0;
  let a = 0.5;
  let fx = x;
  let fy = y;
  for (let i = 0; i < 4; i++) {
    v += a * _hash2(Math.floor(fx), Math.floor(fy));
    fx = fx * 2.0 + 17.0;
    fy = fy * 2.0 + 31.0;
    a *= 0.5;
  }
  return v;
}

/**
 * Build a compact DataTexture for marble / brushed-metal albedo (no binary assets).
 */
export function createProceduralSurfaceMap(kind = 'marble', size = 128) {
  if (typeof THREE === 'undefined' || typeof THREE.DataTexture !== 'function' || THREE.RGBFormat === undefined) {
    return null;
  }
  const data = new Uint8Array(size * size * 3);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const v = y / size;
      const i = (y * size + x) * 3;
      if (kind === 'gold') {
        const brush = 0.82 + 0.18 * Math.sin((u * 48.0 + v * 2.0) * Math.PI);
        const scratch = _fbm2(u * 22.0, v * 6.0);
        const warm = brush * (0.92 + scratch * 0.12);
        // Rose-champagne gold (still reads as polished metal)
        data[i] = Math.min(255, Math.floor(252 * warm));
        data[i + 1] = Math.min(255, Math.floor(186 * warm));
        data[i + 2] = Math.min(255, Math.floor(96 * warm + 28));
      } else {
        // Pastel Carrara marble: soft rose-lilac tint + readable dark veins
        const n1 = _fbm2(u * 6.0, v * 6.0);
        const n2 = _fbm2(u * 14.0 + 3.1, v * 9.0);
        const vein = Math.pow(Math.abs(Math.sin((u * 7.0 + n1 * 2.2) * Math.PI)), 8.0);
        const vein2 = Math.pow(Math.abs(Math.sin((v * 5.5 + n2 * 1.8) * Math.PI)), 10.0);
        const mixV = Math.min(1.0, vein * 0.85 + vein2 * 0.55);
        const shade = 0.90 + n1 * 0.10 - mixV * 0.38;
        data[i] = Math.min(255, Math.floor(238 * shade));
        data[i + 1] = Math.min(255, Math.floor(228 * shade));
        data[i + 2] = Math.min(255, Math.floor(236 * shade));
      }
    }
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  if (THREE.sRGBEncoding !== undefined) tex.encoding = THREE.sRGBEncoding;
  return tex;
}

export function createLuxuryMarbleMaterial(options = {}) {
  const map = createProceduralSurfaceMap('marble', options.size || 128);
  if (map && map.repeat && map.repeat.set) map.repeat.set(options.repeat || 3, options.repeat || 3);
  const params = {
    color: options.color !== undefined ? options.color : 0xfff1f2,
    roughness: options.roughness !== undefined ? options.roughness : 0.2,
    metalness: options.metalness !== undefined ? options.metalness : 0.06,
    envMapIntensity: options.envMapIntensity !== undefined ? options.envMapIntensity : 1.2,
    // Soft emissive bloom (no post stack) — pastel luxury read
    emissive: options.emissive !== undefined ? options.emissive : 0xfbcfe8,
    emissiveIntensity: options.emissiveIntensity !== undefined ? options.emissiveIntensity : 0.045,
    flatShading: false
  };
  if (map) params.map = map;
  return new THREE.MeshStandardMaterial(params);
}

export function createLuxuryGoldMaterial(options = {}) {
  const map = createProceduralSurfaceMap('gold', options.size || 96);
  if (map && map.repeat && map.repeat.set) map.repeat.set(options.repeat || 2, options.repeat || 2);
  const params = {
    color: options.color !== undefined ? options.color : 0xfbbf24,
    roughness: options.roughness !== undefined ? options.roughness : 0.18,
    metalness: options.metalness !== undefined ? options.metalness : 0.94,
    emissive: options.emissive !== undefined ? options.emissive : 0xf59e0b,
    emissiveIntensity: options.emissiveIntensity !== undefined ? options.emissiveIntensity : 0.16,
    envMapIntensity: options.envMapIntensity !== undefined ? options.envMapIntensity : 1.45
  };
  if (map) params.map = map;
  return new THREE.MeshStandardMaterial(params);
}

// =========================================================================
// PROCEDURAL GEOMETRY BUILDER HELPERS
// =========================================================================

/**
 * Creates a biome-appropriate tiled floor plane with alternating checkerboard tiles.
 */
export function createChamberFloor(w, d, color1 = 0x090d16, color2 = 0x131d31, roughness = 0.18, metalness = 0.25) {
  const group = new THREE.Group();
  group.name = 'chamber_floor';
  const tileSize = 2;
  const nx = Math.ceil(w / tileSize);
  const nz = Math.ceil(d / tileSize);
  const geo = new THREE.BoxGeometry(tileSize, 0.2, tileSize);
  const mat1 = new THREE.MeshStandardMaterial({ color: color1, roughness, metalness, envMapIntensity: 1.05 });
  const mat2 = new THREE.MeshStandardMaterial({ color: color2, roughness: Math.min(1.0, roughness + 0.04), metalness: Math.min(1.0, metalness + 0.1), envMapIntensity: 1.05 });

  for (let x = -nx / 2; x < nx / 2; x++) {
    for (let z = -nz / 2; z < nz / 2; z++) {
      const mat = (Math.abs(x + z) % 2 === 0) ? mat1 : mat2;
      const tile = new THREE.Mesh(geo, mat);
      tile.position.set(x * tileSize + tileSize / 2, -0.1, z * tileSize + tileSize / 2);
      tile.receiveShadow = true;
      group.add(tile);
    }
  }
  return group;
}

/**
 * Creates a framed artwork or wall relief canvas.
 */
export function createFramedPainting(w, h, frameMat, innerColor) {
  const g = new THREE.Group();
  g.name = 'framed_painting';
  const frame = new THREE.Mesh(new THREE.BoxGeometry(w + 0.3, h + 0.3, 0.1), frameMat);
  frame.castShadow = true;
  g.add(frame);
  const canvas = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ color: innerColor, roughness: 0.4 }));
  canvas.position.z = 0.06;
  g.add(canvas);
  return g;
}

/**
 * Creates 4 perimeter walls with open archways matching sector connections.
 */
export function createChamberPerimeterWalls({
  w,
  d,
  h,
  wallMat,
  trimMat,
  openSides = { north: false, south: false, east: false, west: false },
  doorWidth = 4.8,
  doorHeight = 7.0,
  thickness = 0.6
}) {
  const wallGroup = new THREE.Group();
  wallGroup.name = 'perimeter_walls';

  // Helper to build a single wall with or without doorway cutout
  function buildWallSegment(wallLen, isOpen, isZAxis, offsetCoord, sign) {
    const segment = new THREE.Group();
    if (!isOpen) {
      // Solid Wall
      const wallGeo = isZAxis ? new THREE.BoxGeometry(thickness, h, wallLen) : new THREE.BoxGeometry(wallLen, h, thickness);
      const wallMesh = new THREE.Mesh(wallGeo, wallMat);
      wallMesh.position.y = h / 2;
      wallMesh.receiveShadow = true;
      segment.add(wallMesh);

      // Baseboard Trim
      const baseGeo = isZAxis ? new THREE.BoxGeometry(thickness + 0.1, 0.4, wallLen) : new THREE.BoxGeometry(wallLen, 0.4, thickness + 0.1);
      const baseMesh = new THREE.Mesh(baseGeo, trimMat);
      baseMesh.position.y = 0.2;
      segment.add(baseMesh);

      // Crown Molding Trim
      const crownGeo = isZAxis ? new THREE.BoxGeometry(thickness + 0.1, 0.4, wallLen) : new THREE.BoxGeometry(wallLen, 0.4, thickness + 0.1);
      const crownMesh = new THREE.Mesh(crownGeo, trimMat);
      crownMesh.position.y = h - 0.2;
      segment.add(crownMesh);
    } else {
      // Open Doorway with Archway Architecture
      const sideWidth = (wallLen - doorWidth) / 2;
      const leftCenter = -(doorWidth / 2 + sideWidth / 2);
      const rightCenter = (doorWidth / 2 + sideWidth / 2);

      // Left Wall Flank
      const leftGeo = isZAxis ? new THREE.BoxGeometry(thickness, h, sideWidth) : new THREE.BoxGeometry(sideWidth, h, thickness);
      const leftMesh = new THREE.Mesh(leftGeo, wallMat);
      leftMesh.position.y = h / 2;
      if (isZAxis) leftMesh.position.z = leftCenter;
      else leftMesh.position.x = leftCenter;
      leftMesh.receiveShadow = true;
      segment.add(leftMesh);

      // Right Wall Flank
      const rightGeo = isZAxis ? new THREE.BoxGeometry(thickness, h, sideWidth) : new THREE.BoxGeometry(sideWidth, h, thickness);
      const rightMesh = new THREE.Mesh(rightGeo, wallMat);
      rightMesh.position.y = h / 2;
      if (isZAxis) rightMesh.position.z = rightCenter;
      else rightMesh.position.x = rightCenter;
      rightMesh.receiveShadow = true;
      segment.add(rightMesh);

      // Top Lintel Header
      const headerHeight = h - doorHeight;
      if (headerHeight > 0.1) {
        const headerGeo = isZAxis ? new THREE.BoxGeometry(thickness, headerHeight, doorWidth) : new THREE.BoxGeometry(doorWidth, headerHeight, thickness);
        const headerMesh = new THREE.Mesh(headerGeo, wallMat);
        headerMesh.position.y = doorHeight + headerHeight / 2;
        headerMesh.receiveShadow = true;
        segment.add(headerMesh);
      }

      // Decorative Gilded Door Archway Posts & Lintel
      const postRadius = 0.16;
      const p1 = new THREE.Mesh(new THREE.CylinderGeometry(postRadius, postRadius, doorHeight, 12), trimMat);
      p1.position.y = doorHeight / 2;
      if (isZAxis) p1.position.set(0, doorHeight / 2, -doorWidth / 2);
      else p1.position.set(-doorWidth / 2, doorHeight / 2, 0);
      segment.add(p1);

      const p2 = new THREE.Mesh(new THREE.CylinderGeometry(postRadius, postRadius, doorHeight, 12), trimMat);
      p2.position.y = doorHeight / 2;
      if (isZAxis) p2.position.set(0, doorHeight / 2, doorWidth / 2);
      else p2.position.set(doorWidth / 2, doorHeight / 2, 0);
      segment.add(p2);

      const archTop = new THREE.Mesh(new THREE.TorusGeometry(doorWidth / 2, 0.15, 8, 24, Math.PI), trimMat);
      archTop.position.y = doorHeight;
      if (isZAxis) archTop.rotation.y = Math.PI / 2;
      segment.add(archTop);
    }

    if (isZAxis) segment.position.x = offsetCoord;
    else segment.position.z = offsetCoord;
    return segment;
  }

  // North Wall (-Z)
  wallGroup.add(buildWallSegment(w, openSides.north, false, -d / 2, -1));
  // South Wall (+Z)
  wallGroup.add(buildWallSegment(w, openSides.south, false, d / 2, 1));
  // West Wall (-X)
  wallGroup.add(buildWallSegment(d, openSides.west, true, -w / 2, -1));
  // East Wall (+X)
  wallGroup.add(buildWallSegment(d, openSides.east, true, w / 2, 1));

  return wallGroup;
}

/**
 * Creates chamber ceiling structure (vaulted ribs, glass dome, rafters, cavern stalactites, or balustrades).
 */
export function createChamberCeiling({ w, d, h, style = 'ribbed_vault', trimMat, beamMat }) {
  const g = new THREE.Group();
  g.name = 'ceiling_' + style;

  if (style === 'ribbed_vault') {
    // Cross-rib vault arches
    for (let x = -w / 2 + 4; x <= w / 2 - 4; x += 6) {
      const arch = new THREE.Mesh(new THREE.TorusGeometry(d / 2 - 0.5, 0.18, 8, 24, Math.PI), trimMat);
      arch.position.set(x, h - 0.2, 0);
      arch.rotation.y = Math.PI / 2;
      g.add(arch);
    }
    const ridgeBeam = new THREE.Mesh(new THREE.BoxGeometry(w, 0.3, 0.4), beamMat);
    ridgeBeam.position.set(0, h + d / 2 - 0.8, 0);
    g.add(ridgeBeam);
  } else if (style === 'coffered_wood') {
    const numX = 4;
    const numZ = 4;
    for (let i = 0; i < numX; i++) {
      const beamZ = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.45, d), beamMat);
      beamZ.position.set(-w / 2 + (i + 1) * (w / (numX + 1)), h - 0.2, 0);
      g.add(beamZ);
    }
    for (let j = 0; j < numZ; j++) {
      const beamX = new THREE.Mesh(new THREE.BoxGeometry(w, 0.35, 0.45), beamMat);
      beamX.position.set(0, h - 0.2, -d / 2 + (j + 1) * (d / (numZ + 1)));
      g.add(beamX);
    }
  } else if (style === 'glass_dome') {
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0x6ee7b7,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const dome = new THREE.Mesh(new THREE.SphereGeometry(Math.min(w, d) / 2, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), domeMat);
    dome.position.y = h;
    g.add(dome);

    const ribRing = new THREE.Mesh(new THREE.TorusGeometry(Math.min(w, d) / 2, 0.2, 8, 32), trimMat);
    ribRing.rotation.x = Math.PI / 2;
    ribRing.position.y = h;
    g.add(ribRing);
  } else if (style === 'cavern_roof') {
    const stalactiteMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
    for (let i = 0; i < 18; i++) {
      const sh = 1.8 + (i % 5) * 0.5;
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.3 + (i % 3) * 0.15, sh, 8), stalactiteMat);
      cone.rotation.x = Math.PI;
      const px = ((i * 7) % (w - 6)) - (w - 6) / 2;
      const pz = ((i * 11) % (d - 6)) - (d - 6) / 2;
      cone.position.set(px, h - sh / 2, pz);
      g.add(cone);
    }
  } else if (style === 'belfry_truss') {
    // Heavy timber scissor truss
    for (let z of [-d / 3, 0, d / 3]) {
      const beamL = new THREE.Mesh(new THREE.BoxGeometry(0.35, h * 0.8, 0.35), beamMat);
      beamL.position.set(-w / 4, h * 0.6, z);
      beamL.rotation.z = -0.45;
      g.add(beamL);

      const beamR = new THREE.Mesh(new THREE.BoxGeometry(0.35, h * 0.8, 0.35), beamMat);
      beamR.position.set(w / 4, h * 0.6, z);
      beamR.rotation.z = 0.45;
      g.add(beamR);

      const tieBeam = new THREE.Mesh(new THREE.BoxGeometry(w * 0.7, 0.35, 0.35), beamMat);
      tieBeam.position.set(0, h * 0.75, z);
      g.add(tieBeam);
    }
  }
  return g;
}

/**
 * Attaches metadata, bounding boxes, collision data, and interactables to a room group.
 */
export function setupRoomMetadata(roomGroup, sectorId, dimensions, interactables = [], customCollision = []) {
  const sector = getSector(sectorId);
  const w = dimensions[0] || 26;
  const h = dimensions[1] || 10;
  const d = dimensions[2] || 26;
  const cx = sector ? sector.coords.x : 0;
  const cy = sector ? sector.coords.y : 0;
  const cz = sector ? sector.coords.z : 0;

  roomGroup.userData = {
    sectorId: sector ? sector.id : sectorId,
    slug: sector ? sector.slug : sectorId,
    name: sector ? sector.name : sectorId,
    floor: sector ? sector.floor : '1F',
    biome: sector ? sector.biome : 'estate',
    dimensions: [w, h, d],
    bounds: {
      minX: cx - w / 2,
      maxX: cx + w / 2,
      minY: cy,
      maxY: cy + h,
      minZ: cz - d / 2,
      maxZ: cz + d / 2,
      width: w,
      height: h,
      length: d
    },
    interactables: interactables.map(item => ({
      id: item.id,
      name: item.name || item.id,
      position: item.position || [0, 0, 0],
      type: item.type || 'inspect',
      prompt: item.prompt || ('EXAMINE ' + (item.name || item.id).toUpperCase())
    })),
    collisionBoxes: [
      { id: 'boundary', minX: -w / 2, maxX: w / 2, minZ: -d / 2, maxZ: d / 2, minY: 0, maxY: h, type: 'room_boundary' },
      ...customCollision
    ]
  };
}

/**
 * Creates an illuminated connecting colonnade/corridor with marble floor, pillars, and sconces.
 */
export function createConnectingColonnade({
  length = 18,
  width = 6.0,
  height = 8.0,
  wallMat,
  trimMat,
  floorMat,
  isZAxis = true
}) {
  const g = new THREE.Group();
  g.name = 'connecting_colonnade';

  // Floor
  const floorGeo = isZAxis ? new THREE.BoxGeometry(width, 0.2, length) : new THREE.BoxGeometry(length, 0.2, width);
  const floor = new THREE.Mesh(floorGeo, floorMat || new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.18 }));
  floor.position.y = -0.1;
  floor.receiveShadow = true;
  g.add(floor);

  // Pillars & Archways along sides
  const pillarCount = Math.floor(length / 4);
  for (let i = 0; i <= pillarCount; i++) {
    const offset = -length / 2 + i * 4;
    for (let sign of [-1, 1]) {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, height, 16), trimMat || new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85 }));
      p.position.y = height / 2;
      if (isZAxis) p.position.set(sign * (width / 2), height / 2, offset);
      else p.position.set(offset, height / 2, sign * (width / 2));
      p.castShadow = true;
      g.add(p);
    }
  }
  return g;
}

// =========================================================================
// INIT ROOMS - 32 SECTORS FULL 3D PROCEDURAL ARCHITECTURE
// =========================================================================

export function initRooms() {
  const addedGroups = new Set();
  Object.values(rooms).forEach(r => {
    if (r instanceof THREE.Group && !addedGroups.has(r)) {
      scene.add(r);
      addedGroups.add(r);
    }
  });

  // Standard shared PBR Materials (procedural marble/gold maps for foyer fidelity)
  const goldTrimMat = createLuxuryGoldMaterial();
  const velvetMat = new THREE.MeshStandardMaterial({ color: 0x831843, roughness: 0.82, metalness: 0.05, envMapIntensity: 0.6 });
  const obsidianMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.12, metalness: 0.55, envMapIntensity: 1.1 });
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.62, metalness: 0.08, envMapIntensity: 0.7 });
  const gothicStoneMat = new THREE.MeshStandardMaterial({ color: 0x2e1065, roughness: 0.78, metalness: 0.12, envMapIntensity: 0.65 });
  const darkWoodMat = new THREE.MeshStandardMaterial({ color: 0x271c19, roughness: 0.68, metalness: 0.05 });
  const marbleWhiteMat = createLuxuryMarbleMaterial();
  const ironMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.42, metalness: 0.85, envMapIntensity: 1.2 });
  const crystalVioletMat = new THREE.MeshStandardMaterial({ color: 0xa78bfa, metalness: 0.88, roughness: 0.08, emissive: 0x5b21b6, emissiveIntensity: 0.08, envMapIntensity: 1.25, transparent: true, opacity: 0.92 });
  const crystalCyanMat = new THREE.MeshStandardMaterial({ color: 0x22d3ee, metalness: 0.9, roughness: 0.08, emissive: 0x0891b2, emissiveIntensity: 0.1, envMapIntensity: 1.3, transparent: true, opacity: 0.9 });

  // -------------------------------------------------------------------------
  // 1. GRAND FOYER (S01)
  // -------------------------------------------------------------------------
  (function buildFoyer() {
    const g = rooms.foyer;
    g.position.set(0, 0, 0);
    g.add(createChamberFloor(28, 28, 0x090d16, 0x131d31));

    const backWall = new THREE.Mesh(new THREE.BoxGeometry(28, 12, 0.6), wallMat);
    backWall.position.set(0, 6, -14);
    g.add(backWall);

    const windowFrame = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.25, 16, 32), goldTrimMat);
    windowFrame.position.set(0, 7.5, -13.6);
    g.add(windowFrame);

    const stainedGlass = new THREE.Mesh(
      new THREE.CircleGeometry(3.4, 32),
      new THREE.MeshBasicMaterial({ color: 0xec4899, transparent: true, opacity: 0.75, side: THREE.DoubleSide })
    );
    stainedGlass.position.set(0, 7.5, -13.5);
    g.add(stainedGlass);

    // Caustic Floor
    const causticMat = new THREE.MeshBasicMaterial({
      color: 0xec4899,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    animatedCausticFloor = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), causticMat);
    animatedCausticFloor.rotation.x = -Math.PI / 2;
    animatedCausticFloor.position.set(0, 0.02, 0);
    g.add(animatedCausticFloor);

    // Grand Staircase
    for (let i = 0; i < 14; i++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.32, 0.65), goldTrimMat);
      step.position.set(0, i * 0.3, -5.5 - i * 0.55);
      g.add(step);
      const runner = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.34, 0.67), velvetMat);
      runner.position.set(0, i * 0.3, -5.5 - i * 0.55);
      g.add(runner);
    }

    // 2F Mezzanine Walkways
    const mezMat = new THREE.MeshStandardMaterial({ color: 0x131d31, roughness: 0.2 });
    const nWalk = new THREE.Mesh(new THREE.BoxGeometry(26, 0.3, 3.5), mezMat);
    nWalk.position.set(0, 4.2, -12);
    g.add(nWalk);

    const pianoGroup = new THREE.Group();
    pianoGroup.name = 'grand_piano';
    const mainBox = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.8, 3.2), obsidianMat);
    mainBox.position.set(0, 1.4, 0);
    pianoGroup.add(mainBox);
    pianoGroup.position.set(6.5, 0, -3);
    pianoGroup.rotation.y = -Math.PI / 4;
    g.add(pianoGroup);

    const gramophone = new THREE.Group();
    gramophone.name = 'gold_gramophone';
    const table = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.1, 1.2, 16), goldTrimMat);
    table.position.y = 0.6;
    gramophone.add(table);
    const horn = new THREE.Mesh(new THREE.ConeGeometry(0.65, 1.35, 16, 1, true), goldTrimMat);
    horn.rotation.x = Math.PI / 4;
    horn.position.set(0, 1.85, 0.3);
    gramophone.add(horn);
    gramophone.position.set(-8.5, 0, -8.5);
    g.add(gramophone);

    // Grand Interconnecting Colonnades to Library (+X), Solarium (-X), and Greenhouse (+Z)
    const eastColonnade = createConnectingColonnade({ length: 18, width: 5.5, height: 7.5, wallMat, trimMat: goldTrimMat, isZAxis: false });
    eastColonnade.position.set(23, 0, 0);
    g.add(eastColonnade);

    const westColonnade = createConnectingColonnade({ length: 18, width: 5.5, height: 7.5, wallMat, trimMat: goldTrimMat, isZAxis: false });
    westColonnade.position.set(-23, 0, 0);
    g.add(westColonnade);

    const northColonnade = createConnectingColonnade({ length: 18, width: 5.5, height: 7.5, wallMat, trimMat: goldTrimMat, isZAxis: true });
    northColonnade.position.set(0, 0, 23);
    g.add(northColonnade);

    setupRoomMetadata(g, 'S01', [28, 12, 28], [
      { id: 'foyer_piano', name: 'Grand Concert Piano', position: [6.5, 0, -3], type: 'piano' },
      { id: 'foyer_gramophone', name: 'Gold Gramophone', position: [-8.5, 0, -8.5], type: 'save' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // 2. LIBRARY OF HARMONY (S02)
  // -------------------------------------------------------------------------
  (function buildLibrary() {
    const g = rooms.library;
    g.position.set(45, 0, 0);
    g.add(createChamberFloor(24, 24, 0x1c1917, 0x292524));
    const bookMat = new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.8 });
    for (let z = -8; z <= 8; z += 4) {
      const shelfL = new THREE.Mesh(new THREE.BoxGeometry(1.0, 7.5, 3.4), bookMat);
      shelfL.position.set(-10.5, 3.75, z);
      g.add(shelfL);
      const shelfR = new THREE.Mesh(new THREE.BoxGeometry(1.0, 7.5, 3.4), bookMat);
      shelfR.position.set(10.5, 3.75, z);
      g.add(shelfR);
    }
    const pot = new THREE.Mesh(new THREE.SphereGeometry(1.2, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.75), goldTrimMat);
    pot.position.set(0, 1.2, -6);
    pot.rotation.x = Math.PI;
    g.add(pot);

    setupRoomMetadata(g, 'S02', [24, 10, 24], [
      { id: 'library_cauldron', name: 'Alchemical Cauldron', position: [0, 1.2, -6], type: 'cauldron' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // 3. SOLARIUM GARDEN (S03)
  // -------------------------------------------------------------------------
  (function buildGarden() {
    const g = rooms.garden;
    g.position.set(-45, 0, 0);
    g.add(createChamberFloor(26, 26, 0x064e3b, 0x047857));
    const fountainBase = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.5, 0.8, 24), new THREE.MeshStandardMaterial({ color: 0x22d3ee, roughness: 0.2 }));
    fountainBase.position.set(0, 0.4, 0);
    g.add(fountainBase);

    const gardenWaterMat = createWaterShaderMaterial({
      deepColor: 0x0284c7,
      shallowColor: 0x22d3ee,
      sunsetColor: 0xf59e0b,
      causticIntensity: 0.85,
      waveSpeed: 1.8,
      waveHeight: 0.04,
      concentric: true
    });
    const waterRing = new THREE.Mesh(
      new THREE.RingGeometry(1.6, 3.9, 48, 8),
      gardenWaterMat
    );
    waterRing.rotation.x = -Math.PI / 2;
    waterRing.position.y = 0.75;
    g.add(waterRing);
    animatedWaterMeshes.push(waterRing);

    [[-6, 0, 0], [6, 0, 0], [0, 0, -6], [0, 0, 6]].forEach((pos, idx) => {
      const lGroup = new THREE.Group();
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 2.2, 12), goldTrimMat);
      post.position.y = 1.1;
      lGroup.add(post);
      const flame = new THREE.Mesh(new THREE.OctahedronGeometry(0.38), new THREE.MeshBasicMaterial({ color: 0x475569 }));
      flame.position.y = 2.4;
      lGroup.add(flame);
      lGroup.position.set(pos[0], pos[1], pos[2]);
      g.add(lGroup);
      lanternMeshes.push({ group: lGroup, flame, lit: false, index: idx });
    });

    setupRoomMetadata(g, 'S03', [26, 10, 26], [
      { id: 'garden_fountain', name: 'Solarium Fountain', position: [0, 0.4, 0], type: 'fountain' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // 4. COURTYARD TEA GREENHOUSE (S04)
  // -------------------------------------------------------------------------
  (function buildGreenhouse() {
    const g = rooms.greenhouse;
    g.position.set(0, 0, 45);
    g.add(createChamberFloor(26, 26, 0x064e3b, 0x065f46));
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x6ee7b7, roughness: 0.1, transparent: true, opacity: 0.4 });
    const dome = new THREE.Mesh(new THREE.SphereGeometry(10, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), glassMat);
    g.add(dome);

    const basinGroup = new THREE.Group();
    basinGroup.position.set(0, 0, 0);
    const basinRim = new THREE.Mesh(
      new THREE.CylinderGeometry(3.6, 3.9, 0.35, 32),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.25, metalness: 0.4 })
    );
    basinRim.position.y = 0.18;
    basinGroup.add(basinRim);

    const teaWaterMat = createWaterShaderMaterial({
      deepColor: 0x0284c7,
      shallowColor: 0x34d399,
      sunsetColor: 0xf59e0b,
      causticIntensity: 0.65,
      waveSpeed: 1.0,
      waveHeight: 0.05
    });
    const teaWaterSurface = new THREE.Mesh(
      new THREE.CircleGeometry(3.4, 32, 8),
      teaWaterMat
    );
    teaWaterSurface.rotation.x = -Math.PI / 2;
    teaWaterSurface.position.y = 0.32;
    basinGroup.add(teaWaterSurface);
    g.add(basinGroup);

    setupRoomMetadata(g, 'S04', [26, 12, 26], [
      { id: 'tea_basin', name: 'Courtyard Tea Basin', position: [0, 0.3, 0], type: 'inspect' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // 5. GRAND BANQUET DINING HALL (S05)
  // -------------------------------------------------------------------------
  (function buildDining() {
    const g = rooms.dining;
    g.position.set(45, 0, 45);
    g.add(createChamberFloor(26, 26, 0x1e1b4b, 0x312e81));
    const table = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.8, 14.0), obsidianMat);
    table.position.set(0, 0.8, 0);
    g.add(table);

    setupRoomMetadata(g, 'S05', [26, 10, 26], [
      { id: 'banquet_table', name: 'Grand Banquet Table', position: [0, 0.8, 0], type: 'inspect' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // 6. HALL OF WHOLESOME PORTRAITS (S06)
  // -------------------------------------------------------------------------
  (function buildGallery() {
    const g = rooms.gallery;
    g.position.set(-45, 0, 45);
    g.add(createChamberFloor(26, 26, 0x18181b, 0x27272a));
    const colors = [0x22d3ee, 0xf59e0b, 0x10b981, 0xec4899, 0xa855f7];
    colors.forEach((c, idx) => {
      const p = createFramedPainting(2.4, 3.4, goldTrimMat, c);
      p.position.set(-11.8, 4.0, (idx - 2) * 4.5);
      p.rotation.y = Math.PI / 2;
      g.add(p);
    });

    setupRoomMetadata(g, 'S06', [26, 10, 26], [
      { id: 'portrait_gallery', name: 'Wholesome Portrait Array', position: [-11.8, 4.0, 0], type: 'inspect' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // 7. ROYAL BAKERY & CONFECTIONERY KITCHEN (S07)
  // -------------------------------------------------------------------------
  (function buildBakery() {
    const g = rooms.bakery;
    g.position.set(45, -14, -45);
    g.add(createChamberFloor(26, 26, 0x451a03, 0x78350f));

    // Central Marble Dough Island
    const marbleMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2, metalness: 0.15 });
    const woodBaseMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 });
    const islandBase = new THREE.Mesh(new THREE.BoxGeometry(8.0, 1.1, 4.0), woodBaseMat);
    islandBase.position.set(0, 0.55, 0);
    g.add(islandBase);

    const islandTop = new THREE.Mesh(new THREE.BoxGeometry(8.4, 0.2, 4.4), marbleMat);
    islandTop.position.set(0, 1.2, 0);
    g.add(islandTop);

    // Industrial Copper Confectionery Oven
    const copperMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.35, metalness: 0.8 });
    const oven = new THREE.Mesh(new THREE.BoxGeometry(5.0, 3.6, 3.4), copperMat);
    oven.position.set(0, 1.8, -10.5);
    g.add(oven);

    const ovenDoorMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.6, roughness: 0.2 });
    const ovenDoor = new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.0, 0.2), ovenDoorMat);
    ovenDoor.position.set(0, 1.8, -8.7);
    g.add(ovenDoor);

    // 3 Interactive Sugar Pressure Valves (Cyan, Gold, Emerald)
    const valveColors = [
      { id: 'valve_cyan', color: 0x22d3ee, x: -6.5, name: 'Cyan Sugar Valve' },
      { id: 'valve_gold', color: 0xf59e0b, x: 0.0, name: 'Golden Sugar Valve' },
      { id: 'valve_emerald', color: 0x10b981, x: 6.5, name: 'Emerald Sugar Valve' }
    ];

    valveColors.forEach(v => {
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 2.4, 16), obsidianMat);
      pipe.position.set(v.x, 1.2, 10.5);
      g.add(pipe);

      const wheelMat = new THREE.MeshStandardMaterial({ color: v.color, emissive: v.color, emissiveIntensity: 0.4, roughness: 0.3, metalness: 0.7 });
      const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.08, 12, 24), wheelMat);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(v.x, 2.4, 10.5);
      wheel.name = `prop_${v.id}`;
      g.add(wheel);
    });

    // 3D Sweet Kawaii Confectionery Display (Pastel Macarons & Giant Swirl Lollipops)
    const macaronColors = [0xf472b6, 0x38bdf8, 0x4ade80, 0xfde047, 0xc084fc];
    macaronColors.forEach((col, i) => {
      const macMat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.3 });
      const creamMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      
      const macGroup = new THREE.Group();
      const topShell = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.12, 16), macMat);
      topShell.position.y = 0.08;
      const cream = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.06, 16), creamMat);
      const btmShell = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.12, 16), macMat);
      btmShell.position.y = -0.08;
      macGroup.add(topShell, cream, btmShell);
      
      macGroup.position.set(-2.5 + i * 1.25, 1.4, 0);
      g.add(macGroup);
    });

    // Giant Swirling Candy Lollipops
    for (let lx of [-3.2, 3.2]) {
      const stickMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 });
      const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.2, 12), stickMat);
      stick.position.set(lx, 2.2, 1.2);
      
      const candyMat = new THREE.MeshStandardMaterial({ color: 0xec4899, emissive: 0xdb2777, emissiveIntensity: 0.3, roughness: 0.2 });
      const candyHead = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.14, 24), candyMat);
      candyHead.rotation.x = Math.PI / 2;
      candyHead.position.set(lx, 3.1, 1.2);
      g.add(stick, candyHead);
    }

    setupRoomMetadata(g, 'S07', [26, 10, 26], [
      { id: 'royal_oven', name: 'Royal Confectionery Oven', position: [0, 1.8, -8.7], type: 'royal_oven' },
      { id: 'sugar_valve_cyan', name: 'Cyan Sugar Valve', position: [-6.5, 2.4, 10.5], type: 'sugar_valve_cyan' },
      { id: 'sugar_valve_gold', name: 'Golden Sugar Valve', position: [0.0, 2.4, 10.5], type: 'sugar_valve_gold' },
      { id: 'sugar_valve_emerald', name: 'Emerald Sugar Valve', position: [6.5, 2.4, 10.5], type: 'sugar_valve_emerald' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // 8. CELESTIAL OBSERVATORY (S08)
  // -------------------------------------------------------------------------
  (function buildObservatory() {
    const g = rooms.observatory;
    g.position.set(45, 12, 0);
    g.add(createChamberFloor(24, 24, 0x05070a, 0x0f172a));
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.08, 12, 32), goldTrimMat);
    ring1.position.y = 2.4;
    g.add(ring1);
    animatedAstrolabeRings.push({ mesh: ring1, axis: 'y', speed: 0.4 });

    setupRoomMetadata(g, 'S08', [24, 12, 24], [
      { id: 'astrolabe_mechanism', name: 'Celestial Astrolabe', position: [0, 2.4, 0], type: 'astrolabe' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // 9. CLOCKTOWER SWEET SUITE (S09)
  // -------------------------------------------------------------------------
  (function buildClocktower() {
    const g = rooms.clocktower;
    g.position.set(-45, 12, 0);
    g.add(createChamberFloor(24, 24, 0x271c19, 0x3d271d));
    const clockDial = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.6, 0.2, 32), goldTrimMat);
    clockDial.rotation.x = Math.PI / 2;
    clockDial.position.set(0, 5.5, -11.6);
    g.add(clockDial);

    setupRoomMetadata(g, 'S09', [24, 14, 24], [
      { id: 'clock_dial', name: 'Grand Clock Face', position: [0, 5.5, -11.6], type: 'clock' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // 10. ROYAL VELVET MASTER SUITE (S10)
  // -------------------------------------------------------------------------
  (function buildMasterSuite() {
    const g = rooms.mastersuite;
    g.position.set(0, 12, 45);
    g.add(createChamberFloor(24, 24, 0x3b0764, 0x581c87));
    const canopyBed = new THREE.Mesh(new THREE.BoxGeometry(4.8, 3.5, 6.0), goldTrimMat);
    canopyBed.position.set(0, 1.75, -6);
    g.add(canopyBed);

    setupRoomMetadata(g, 'S10', [24, 10, 24], [
      { id: 'canopy_bed', name: 'Royal Velvet Canopy Bed', position: [0, 1.75, -6], type: 'rest' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // 11. GRAND CRYSTAL BALLROOM (S11)
  // -------------------------------------------------------------------------
  (function buildBallroom() {
    const g = rooms.ballroom;
    g.position.set(0, 12, -45);
    g.add(createChamberFloor(26, 26, 0x0284c7, 0x0369a1));
    const disco = new THREE.Mesh(new THREE.SphereGeometry(1.6, 16, 16), new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.95 }));
    disco.position.set(0, 7.5, 0);
    g.add(disco);
    animatedBallroomCrystals.push(disco);

    setupRoomMetadata(g, 'S11', [26, 12, 26], [
      { id: 'crystal_ball', name: 'Grand Crystal Mirror Sphere', position: [0, 7.5, 0], type: 'dance' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // 12. CRYSTAL CATHEDRAL OF HARMONY (S12)
  // -------------------------------------------------------------------------
  (function buildCathedral() {
    const g = rooms.cathedral;
    g.position.set(0, 24, 0);
    g.add(createChamberFloor(26, 26, 0x1e1b4b, 0x312e81));
    const organPipeMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9 });
    for (let i = -5; i <= 5; i++) {
      const h = 4.0 + Math.abs(i) * 0.8;
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, h, 12), organPipeMat);
      pipe.position.set(i * 0.7, h / 2, -11.5);
      g.add(pipe);
    }

    setupRoomMetadata(g, 'S12', [26, 16, 26], [
      { id: 'cathedral_organ', name: 'Pipe Organ of Harmony', position: [0, 4.0, -11.5], type: 'play' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // 13. SUNSET CARRIAGE GATEHOUSE (S13)
  // -------------------------------------------------------------------------
  (function buildGatehouse() {
    const g = rooms.gatehouse;
    g.position.set(0, 0, 90);
    g.add(createChamberFloor(30, 30, 0x0f172a, 0x1e293b));
    const arch = new THREE.Mesh(new THREE.TorusGeometry(6.0, 0.5, 12, 24, Math.PI), goldTrimMat);
    arch.position.set(0, 6.0, 0);
    g.add(arch);

    setupRoomMetadata(g, 'S13', [30, 14, 30], [
      { id: 'carriage_gate', name: 'Grand Sunset Archway', position: [0, 6.0, 0], type: 'inspect' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // 14. GRAND REFLECTION POOL (S14)
  // -------------------------------------------------------------------------
  (function buildReflectionPool() {
    const g = rooms.reflection_pool;
    g.position.set(-45, 0, 90);
    g.add(createChamberFloor(28, 28, 0x064e3b, 0x065f46));

    const rimMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.4 });
    const rim = new THREE.Mesh(new THREE.BoxGeometry(18.6, 0.45, 18.6), rimMat);
    rim.position.y = 0.2;
    g.add(rim);

    const poolWaterMat = createWaterShaderMaterial({
      deepColor: 0x0284c7,
      shallowColor: 0x38bdf8,
      sunsetColor: 0xf59e0b,
      causticIntensity: 0.75,
      waveSpeed: 1.2,
      waveHeight: 0.08
    });
    const waterSurface = new THREE.Mesh(new THREE.PlaneGeometry(17.8, 17.8, 36, 36), poolWaterMat);
    waterSurface.rotation.x = -Math.PI / 2;
    waterSurface.position.y = 0.38;
    g.add(waterSurface);

    setupRoomMetadata(g, 'S14', [28, 10, 28], [
      { id: 'reflection_basin', name: 'Grand Reflection Basin', position: [0, 0.38, 0], type: 'inspect' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // 15. TOPIARY ROSE HEDGE MAZE (S15)
  // -------------------------------------------------------------------------
  (function buildRoseMaze() {
    const g = rooms.rose_maze;
    g.position.set(45, 0, 90);
    g.add(createChamberFloor(28, 28, 0x064e3b, 0x047857));
    const hedgeMat = new THREE.MeshStandardMaterial({ color: 0x047857, roughness: 0.8 });
    for (let x of [-8, 0, 8]) {
      const hedge = new THREE.Mesh(new THREE.BoxGeometry(2.0, 3.5, 16.0), hedgeMat);
      hedge.position.set(x, 1.75, 0);
      g.add(hedge);
    }

    setupRoomMetadata(g, 'S15', [28, 10, 28], [
      { id: 'rose_hedges', name: 'Topiary Rose Maze Paths', position: [0, 1.75, 0], type: 'search' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // 16. STARLIGHT PAVILION GAZEBO (S16)
  // -------------------------------------------------------------------------
  (function buildGazebo() {
    const g = rooms.gazebo;
    g.position.set(0, 0, 135);
    g.add(createChamberFloor(24, 24, 0x05070a, 0x1e1b4b));
    const roof = new THREE.Mesh(new THREE.ConeGeometry(5.5, 3.0, 8), goldTrimMat);
    roof.position.y = 5.5;
    g.add(roof);

    setupRoomMetadata(g, 'S16', [24, 12, 24], [
      { id: 'pavilion_roof', name: 'Starlight Pavilion Canopy', position: [0, 5.5, 0], type: 'inspect' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // 17. SUBTERRANEAN SUGAR LAB (S17)
  // -------------------------------------------------------------------------
  (function buildLab() {
    const g = rooms.lab;
    g.position.set(0, -14, -45);
    g.add(createChamberFloor(26, 26, 0x09090b, 0x171717));

    // Lab Alembic Still and Flasks
    const alembicGroup = new THREE.Group();
    const flask = new THREE.Mesh(new THREE.SphereGeometry(1.2, 16, 16), crystalCyanMat);
    flask.position.y = 1.2;
    alembicGroup.add(flask);
    const coil = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.08, 8, 24), goldTrimMat);
    coil.rotation.x = Math.PI / 2;
    coil.position.y = 2.2;
    alembicGroup.add(coil);
    alembicGroup.position.set(0, 0, -6);
    g.add(alembicGroup);

    setupRoomMetadata(g, 'S17', [26, 10, 26], [
      { id: 'sugar_alembic', name: 'Subterranean Sugar Alembic', position: [0, 1.2, -6], type: 'distill' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // 18. WHISPERING CRYPT BOSS ARENA (S18)
  // -------------------------------------------------------------------------
  (function buildCrypt() {
    const g = rooms.crypt;
    g.position.set(0, -28, -45);
    g.add(createChamberFloor(28, 28, 0x020617, 0x0f172a));

    const arenaPillars = [
      [-10, 0, -10], [10, 0, -10], [-10, 0, 10], [10, 0, 10]
    ];
    arenaPillars.forEach(pos => {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.1, 8.0, 16), gothicStoneMat);
      col.position.set(pos[0], 4.0, pos[2]);
      g.add(col);
    });

    setupRoomMetadata(g, 'S18', [28, 12, 28], [
      { id: 'boss_altar', name: 'Whispering Crypt Core Altar', position: [0, 1.0, 0], type: 'boss_trigger' }
    ]);
  })();

  // =========================================================================
  // NEW PROCEDURAL CHAMBER ARCHITECTURE (S19 - S32)
  // =========================================================================

  // -------------------------------------------------------------------------
  // 19. HAUNTED CONSERVATORY (S19) - Gothic Chambers
  // Connections: S03 (East), S20 (South), S21 (North)
  // -------------------------------------------------------------------------
  (function buildConservatory() {
    const g = rooms.conservatory;
    g.position.set(-90, 0, 0);

    // Biome-appropriate PBR tiled floor
    g.add(createChamberFloor(26, 26, 0x1e1b4b, 0x2e1065, 0.35, 0.2));

    // 4 perimeter walls with open archways matching connections
    g.add(createChamberPerimeterWalls({
      w: 26,
      d: 26,
      h: 12,
      wallMat: gothicStoneMat,
      trimMat: goldTrimMat,
      openSides: { north: true, south: true, east: true, west: false }
    }));

    // Ceiling: Wrought iron arched conservatory ribs
    g.add(createChamberCeiling({ w: 26, d: 26, h: 12, style: 'glass_dome', trimMat: ironMat, beamMat: ironMat }));

    // Prop 1: Overgrown Gothic Urn & Pedestal
    const urnGroup = new THREE.Group();
    urnGroup.name = 'overgrown_gothic_urn';
    const urnBase = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.8, 1.6), gothicStoneMat);
    urnBase.position.y = 0.4;
    urnGroup.add(urnBase);
    const urnBody = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.6, 1.8, 16), obsidianMat);
    urnBody.position.y = 1.7;
    urnGroup.add(urnBody);
    const urnRim = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.12, 8, 24), goldTrimMat);
    urnRim.rotation.x = Math.PI / 2;
    urnRim.position.y = 2.6;
    urnGroup.add(urnRim);
    urnGroup.position.set(0, 0, 0);
    g.add(urnGroup);

    // Prop 2: Withered Topiary Arch
    const topiaryArch = new THREE.Group();
    topiaryArch.name = 'withered_topiary_arch';
    const archFrame = new THREE.Mesh(new THREE.TorusGeometry(3.0, 0.25, 12, 24, Math.PI), gothicStoneMat);
    archFrame.position.set(0, 4.0, -8);
    topiaryArch.add(archFrame);
    for (let angle = 0; angle <= Math.PI; angle += 0.4) {
      const bush = new THREE.Mesh(new THREE.SphereGeometry(0.45, 8, 8), new THREE.MeshStandardMaterial({ color: 0x2e1065, roughness: 0.9 }));
      bush.position.set(Math.cos(angle) * 3.0, 4.0 + Math.sin(angle) * 3.0, -8);
      topiaryArch.add(bush);
    }
    g.add(topiaryArch);

    // Prop 3: Prismatic Crystal Geodes on Gem Pedestal
    const geodeGroup = new THREE.Group();
    geodeGroup.name = 'prismatic_crystal_geodes';
    const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.0, 1.2, 6), gothicStoneMat);
    ped.position.y = 0.6;
    geodeGroup.add(ped);
    const mainGeode = new THREE.Mesh(new THREE.OctahedronGeometry(0.65), crystalVioletMat);
    mainGeode.position.y = 1.6;
    geodeGroup.add(mainGeode);
    animatedFloatingCrystals.push({ mesh: mainGeode, baseY: 1.6, speed: 1.2 });
    geodeGroup.position.set(6, 0, -4);
    g.add(geodeGroup);

    setupRoomMetadata(g, 'S19', [26, 12, 26], [
      { id: 'conservatory_urn', name: 'Overgrown Gothic Urn', position: [0, 1.2, 0], type: 'inspect' },
      { id: 'conservatory_geode', name: 'Prismatic Crystal Geodes', position: [6, 1.2, -4], type: 'harvest' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // 20. KAWAII TEA SALON (S20) - Kawaii Tea Salons
  // Connections: S19 (North), S06 (East)
  // -------------------------------------------------------------------------
  (function buildTeaSalon() {
    const g = rooms.tea_salon;
    g.position.set(-90, 0, 45);

    // Pastel rose and velvet checkerboard floor
    g.add(createChamberFloor(24, 24, 0x500724, 0x831843, 0.2, 0.15));

    // 4 perimeter walls
    g.add(createChamberPerimeterWalls({
      w: 24,
      d: 24,
      h: 10,
      wallMat: new THREE.MeshStandardMaterial({ color: 0x831843, roughness: 0.4 }),
      trimMat: goldTrimMat,
      openSides: { north: true, south: false, east: true, west: false }
    }));

    // Ceiling: Coffered rosette ceiling
    g.add(createChamberCeiling({ w: 24, d: 24, h: 10, style: 'coffered_wood', trimMat: goldTrimMat, beamMat: velvetMat }));

    // Prop 1: Porcelain Tea Service Table
    const tableGroup = new THREE.Group();
    tableGroup.name = 'porcelain_tea_table';
    const tableBase = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 0.15, 24), marbleWhiteMat);
    tableBase.position.y = 0.8;
    tableGroup.add(tableBase);
    const tableLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 0.8, 16), goldTrimMat);
    tableLeg.position.y = 0.4;
    tableGroup.add(tableLeg);

    // Teapot & Cups
    const teapot = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), marbleWhiteMat);
    teapot.position.set(0, 1.15, 0);
    tableGroup.add(teapot);
    const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.08, 0.3, 8), goldTrimMat);
    spout.rotation.z = Math.PI / 4;
    spout.position.set(0.3, 1.25, 0);
    tableGroup.add(spout);

    tableGroup.position.set(0, 0, 0);
    g.add(tableGroup);

    // Prop 2: Tiered Pastry Stand
    const pastryStand = new THREE.Group();
    pastryStand.name = 'tiered_pastry_stand';
    const centralRod = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.6, 12), goldTrimMat);
    centralRod.position.y = 0.8;
    pastryStand.add(centralRod);
    [0.4, 0.8, 1.2].forEach((h, idx) => {
      const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.7 - idx * 0.18, 0.7 - idx * 0.18, 0.04, 16), goldTrimMat);
      plate.position.y = h;
      pastryStand.add(plate);
      // Macarons
      for (let m = 0; m < 4; m++) {
        const mac = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 8), new THREE.MeshStandardMaterial({ color: (m % 2 === 0 ? 0xf472b6 : 0x38bdf8) }));
        const angle = (m / 4) * Math.PI * 2;
        mac.position.set(Math.cos(angle) * (0.45 - idx * 0.12), h + 0.05, Math.sin(angle) * (0.45 - idx * 0.12));
        pastryStand.add(mac);
      }
    });
    pastryStand.position.set(3.5, 0, -3.5);
    g.add(pastryStand);

    // Prop 3: Velvet Settee
    const settee = new THREE.Group();
    settee.name = 'velvet_settee';
    const seat = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.5, 1.4), velvetMat);
    seat.position.set(0, 0.5, 0);
    settee.add(seat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.2, 0.3), velvetMat);
    back.position.set(0, 1.2, -0.6);
    settee.add(back);
    settee.position.set(-5, 0, 3);
    g.add(settee);

    setupRoomMetadata(g, 'S20', [24, 10, 24], [
      { id: 'tea_service', name: 'Porcelain Tea Service Table', position: [0, 0.8, 0], type: 'taste' },
      { id: 'pastry_stand_item', name: 'Tiered Pastry Stand', position: [3.5, 0.8, -3.5], type: 'eat' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // 21. ROYAL MUSIC PARLOR (S21) - Estate Wings
  // Connections: S19 (South)
  // -------------------------------------------------------------------------
  (function buildMusicParlor() {
    const g = rooms.music_parlor;
    g.position.set(-90, 0, -45);

    // Acoustic parquet timber floor
    g.add(createChamberFloor(26, 26, 0x1e1b4b, 0x0f172a, 0.25, 0.35));

    // Perimeter walls
    g.add(createChamberPerimeterWalls({
      w: 26,
      d: 26,
      h: 10,
      wallMat: wallMat,
      trimMat: goldTrimMat,
      openSides: { north: false, south: true, east: false, west: false }
    }));

    // Ceiling: Coffered acoustic timber
    g.add(createChamberCeiling({ w: 26, d: 26, h: 10, style: 'coffered_wood', trimMat: goldTrimMat, beamMat: darkWoodMat }));

    // Prop 1: Grand Harpsichord
    const harpsichord = new THREE.Group();
    harpsichord.name = 'grand_harpsichord';
    const hBody = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.8, 3.8), obsidianMat);
    hBody.position.set(0, 1.2, 0);
    harpsichord.add(hBody);
    const hLid = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.1, 3.8), goldTrimMat);
    hLid.position.set(0, 1.9, 0);
    hLid.rotation.x = -0.3;
    harpsichord.add(hLid);
    for (let pos of [[-1, 0.4, -1.5], [1, 0.4, -1.5], [0, 0.4, 1.5]]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.8, 12), goldTrimMat);
      leg.position.set(pos[0], pos[1], pos[2]);
      harpsichord.add(leg);
    }
    harpsichord.position.set(0, 0, 0);
    g.add(harpsichord);

    // Prop 2: Cello & Stand
    const celloGroup = new THREE.Group();
    celloGroup.name = 'cello_stand';
    const celloBody = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.4, 0.4), darkWoodMat);
    celloBody.position.y = 1.0;
    celloGroup.add(celloBody);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.9, 8), darkWoodMat);
    neck.position.set(0, 1.9, 0);
    celloGroup.add(neck);
    const cStand = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.6, 8), goldTrimMat);
    cStand.position.set(0, 0.3, 0);
    celloGroup.add(cStand);
    celloGroup.position.set(-5.5, 0, -3.5);
    g.add(celloGroup);

    // Prop 3: Brass Horn Sconces
    for (let x of [-11, 11]) {
      const sconce = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.9, 16, 1, true), goldTrimMat);
      sconce.position.set(x, 4.5, 0);
      sconce.rotation.z = (x < 0 ? Math.PI / 2 : -Math.PI / 2);
      g.add(sconce);
    }

    setupRoomMetadata(g, 'S21', [26, 10, 26], [
      { id: 'harpsichord_play', name: 'Grand Harpsichord', position: [0, 1.2, 0], type: 'play' },
      { id: 'cello_inspect', name: 'Classical Cello Stand', position: [-5.5, 1.0, -3.5], type: 'inspect' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // 22. VILLAGE DISTRICT (S22) - Outdoor Grounds
  // Connections: S16 (North), S25 (East), S26 (West)
  // -------------------------------------------------------------------------
  (function buildVillageDistrict() {
    const g = rooms.village_district;
    g.position.set(0, 0, 180);

    // Weathered cobblestone plaza floor
    g.add(createChamberFloor(36, 36, 0x1c1917, 0x292524, 0.6, 0.1));

    // Low perimeter stone courtyard walls with gates
    g.add(createChamberPerimeterWalls({
      w: 36,
      d: 36,
      h: 4,
      wallMat: new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.85 }),
      trimMat: darkWoodMat,
      openSides: { north: true, south: false, east: true, west: true },
      doorWidth: 8.0,
      doorHeight: 4.0
    }));

    // Prop 1: Cobblestone Wishing Well
    const wellGroup = new THREE.Group();
    wellGroup.name = 'cobblestone_well';
    const wellRim = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.3, 1.4, 20), new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 }));
    wellRim.position.y = 0.7;
    wellGroup.add(wellRim);

    // Well Water Surface
    const wellWater = new THREE.Mesh(new THREE.CircleGeometry(1.7, 16), new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1 }));
    wellWater.rotation.x = -Math.PI / 2;
    wellWater.position.y = 0.8;
    wellGroup.add(wellWater);

    // Well Roof & Posts
    for (let x of [-1.5, 1.5]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 3.2, 8), darkWoodMat);
      post.position.set(x, 2.1, 0);
      wellGroup.add(post);
    }
    const wellRoof = new THREE.Mesh(new THREE.ConeGeometry(2.6, 1.6, 4), darkWoodMat);
    wellRoof.rotation.y = Math.PI / 4;
    wellRoof.position.y = 3.9;
    wellGroup.add(wellRoof);
    wellGroup.position.set(0, 0, 0);
    g.add(wellGroup);

    // Prop 2: Thatched Cottage Facade
    const cottage = new THREE.Group();
    cottage.name = 'thatched_cottage_facade';
    const houseWall = new THREE.Mesh(new THREE.BoxGeometry(10.0, 5.0, 2.5), new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.8 }));
    houseWall.position.set(0, 2.5, 0);
    cottage.add(houseWall);
    const roof = new THREE.Mesh(new THREE.ConeGeometry(7.0, 3.2, 4), new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 }));
    roof.position.set(0, 6.2, 0);
    roof.rotation.y = Math.PI / 4;
    cottage.add(roof);
    cottage.position.set(0, 0, 14);
    g.add(cottage);

    // Prop 3: Village Lamp Post
    for (let pos of [[-8, 0, -8], [8, 0, -8]]) {
      const lamp = new THREE.Group();
      lamp.name = 'village_lamp_post';
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 4.0, 12), ironMat);
      pole.position.y = 2.0;
      lamp.add(pole);
      const lantern = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.6), goldTrimMat);
      lantern.position.y = 4.2;
      lamp.add(lantern);
      const glow = new THREE.Mesh(new THREE.OctahedronGeometry(0.24), new THREE.MeshBasicMaterial({ color: 0xfde047 }));
      glow.position.y = 4.2;
      lamp.add(glow);
      lamp.position.set(pos[0], pos[1], pos[2]);
      g.add(lamp);
    }

    setupRoomMetadata(g, 'S22', [36, 12, 36], [
      { id: 'village_well_item', name: 'Cobblestone Wishing Well', position: [0, 0.8, 0], type: 'wish' },
      { id: 'cottage_door', name: 'Village Cottage Facade', position: [0, 2.5, 14], type: 'knock' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // 23. SACRED FOREST TRAIL (S23) - Sacred Forest
  // Connections: S15 (North), S25 (South)
  // -------------------------------------------------------------------------
  (function buildSacredForestTrail() {
    const g = rooms.sacred_forest_trail;
    g.position.set(90, 0, 135);

    // Dense leafy soil and moss floor
    g.add(createChamberFloor(32, 32, 0x022c22, 0x064e3b, 0.6, 0.05));

    // Natural clearing boundaries with openings
    g.add(createChamberPerimeterWalls({
      w: 32,
      d: 32,
      h: 6,
      wallMat: new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.9 }),
      trimMat: darkWoodMat,
      openSides: { north: true, south: true, east: false, west: false },
      doorWidth: 8.0,
      doorHeight: 6.0
    }));

    // Prop 1: Hollow Ancient Elder Tree
    const treeGroup = new THREE.Group();
    treeGroup.name = 'hollow_elder_tree';
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.6, 7.0, 12), new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 }));
    trunk.position.y = 3.5;
    treeGroup.add(trunk);
    const canopy = new THREE.Mesh(new THREE.SphereGeometry(4.5, 12, 12), new THREE.MeshStandardMaterial({ color: 0x065f46, roughness: 0.8 }));
    canopy.position.y = 8.5;
    treeGroup.add(canopy);
    treeGroup.position.set(0, 0, 0);
    g.add(treeGroup);

    // Prop 2: Ancient Runestone Monoliths
    const monolithGroup = new THREE.Group();
    monolithGroup.name = 'ancient_runestone_monoliths';
    const stone1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 4.8, 0.8), gothicStoneMat);
    stone1.position.set(-6, 2.4, -4);
    monolithGroup.add(stone1);
    const stone2 = new THREE.Mesh(new THREE.BoxGeometry(1.0, 3.8, 0.8), gothicStoneMat);
    stone2.position.set(6, 1.9, 4);
    monolithGroup.add(stone2);
    g.add(monolithGroup);

    // Prop 3: Mossy Altar Shrine
    const altar = new THREE.Group();
    altar.name = 'mossy_forest_altar';
    const slab = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.6, 1.8), new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 }));
    slab.position.y = 0.8;
    altar.add(slab);
    const spiritStone = new THREE.Mesh(new THREE.OctahedronGeometry(0.35), new THREE.MeshBasicMaterial({ color: 0x10b981 }));
    spiritStone.position.y = 1.4;
    altar.add(spiritStone);
    animatedFloatingCrystals.push({ mesh: spiritStone, baseY: 1.4, speed: 1.0 });
    altar.position.set(-4, 0, 5);
    g.add(altar);

    setupRoomMetadata(g, 'S23', [32, 14, 32], [
      { id: 'elder_tree_commune', name: 'Hollow Elder Tree', position: [0, 3.5, 0], type: 'commune' },
      { id: 'forest_altar_pray', name: 'Mossy Forest Altar', position: [-4, 0.8, 5], type: 'pray' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // 24. HARBOR DOCKS (S24) - Maritime Docks
  // Connections: S14 (North), S26 (South)
  // -------------------------------------------------------------------------
  (function buildHarborDocks() {
    const g = rooms.harbor_docks;
    g.position.set(-90, 0, 135);

    // Weathered maritime boardwalk floor
    g.add(createChamberFloor(32, 32, 0x0c4a6e, 0x075985, 0.3, 0.3));

    // Pier boundaries and water ledges
    g.add(createChamberPerimeterWalls({
      w: 32,
      d: 32,
      h: 4,
      wallMat: ironMat,
      trimMat: darkWoodMat,
      openSides: { north: true, south: true, east: false, west: false },
      doorWidth: 8.0,
      doorHeight: 4.0
    }));

    // Prop 1: Wooden Mooring Bollards & Cleats
    const mooringGroup = new THREE.Group();
    mooringGroup.name = 'wooden_mooring_bollards';
    for (let pos of [[-8, 0, -8], [-8, 0, 8], [8, 0, -8], [8, 0, 8]]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 1.8, 12), darkWoodMat);
      post.position.set(pos[0], 0.9, pos[2]);
      mooringGroup.add(post);
      const rope = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.08, 8, 16), new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 }));
      rope.rotation.x = Math.PI / 2;
      rope.position.set(pos[0], 1.2, pos[2]);
      mooringGroup.add(rope);
    }
    g.add(mooringGroup);

    // Prop 2: Cargo Crates Stack
    const crateStack = new THREE.Group();
    crateStack.name = 'cargo_crates';
    const c1 = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.0, 2.0), darkWoodMat);
    c1.position.set(0, 1.0, 0);
    crateStack.add(c1);
    const c2 = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.6, 1.6), darkWoodMat);
    c2.position.set(0.3, 2.8, 0.2);
    crateStack.add(c2);
    crateStack.position.set(5, 0, -4);
    g.add(crateStack);

    // Prop 3: Heavy Nautical Ship Anchor
    const anchorGroup = new THREE.Group();
    anchorGroup.name = 'ship_anchor';
    const shank = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 3.4, 12), ironMat);
    shank.position.y = 1.7;
    anchorGroup.add(shank);
    const stock = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.2, 12), ironMat);
    stock.rotation.z = Math.PI / 2;
    stock.position.y = 3.0;
    anchorGroup.add(stock);
    const fluke = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.16, 8, 16, Math.PI), ironMat);
    fluke.rotation.z = Math.PI;
    fluke.position.y = 1.2;
    anchorGroup.add(fluke);
    anchorGroup.position.set(-6, 0, 2);
    anchorGroup.rotation.z = 0.25;
    g.add(anchorGroup);

    setupRoomMetadata(g, 'S24', [32, 10, 32], [
      { id: 'harbor_anchor_inspect', name: 'Nautical Ship Anchor', position: [-6, 1.2, 2], type: 'inspect' },
      { id: 'cargo_search', name: 'Stacked Cargo Crates', position: [5, 1.0, -4], type: 'search' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // 25. MOONLIT MEADOW (S25) - Outdoor Grounds
  // Connections: S22 (West), S23 (North)
  // -------------------------------------------------------------------------
  (function buildMoonlitMeadow() {
    const g = rooms.moonlit_meadow;
    g.position.set(45, 0, 180);

    // Starlit turf floor
    g.add(createChamberFloor(32, 32, 0x064e3b, 0x047857, 0.55, 0.05));

    // Open grounds boundary
    g.add(createChamberPerimeterWalls({
      w: 32,
      d: 32,
      h: 4,
      wallMat: new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.9 }),
      trimMat: darkWoodMat,
      openSides: { north: true, south: false, east: false, west: true },
      doorWidth: 8.0,
      doorHeight: 4.0
    }));

    // Prop 1: Starlight Monolith / Armillary Sphere
    const monolith = new THREE.Group();
    monolith.name = 'starlight_monolith';
    const mPillar = new THREE.Mesh(new THREE.BoxGeometry(1.4, 5.0, 1.4), crystalCyanMat);
    mPillar.position.y = 2.5;
    monolith.add(mPillar);
    const mRing = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.1, 12, 32), goldTrimMat);
    mRing.position.y = 3.5;
    monolith.add(mRing);
    animatedAstrolabeRings.push({ mesh: mRing, axis: 'y', speed: 0.5 });
    monolith.position.set(0, 0, 0);
    g.add(monolith);

    // Prop 2: Luminescent Balancing Cairn
    const cairn = new THREE.Group();
    cairn.name = 'luminescent_cairn';
    [1.0, 0.75, 0.5, 0.3].forEach((r, idx) => {
      const stone = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 12), new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3 }));
      stone.scale.set(1.2, 0.6, 1.0);
      stone.position.y = 0.3 + idx * 0.7;
      cairn.add(stone);
    });
    cairn.position.set(-6, 0, 4);
    g.add(cairn);

    // Prop 3: Star Chart Celestial Desk
    const chartDesk = new THREE.Group();
    chartDesk.name = 'star_chart_desk';
    const dTop = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.15, 16), obsidianMat);
    dTop.position.y = 1.0;
    chartDesk.add(dTop);
    const dBase = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 1.0, 12), goldTrimMat);
    dBase.position.y = 0.5;
    chartDesk.add(dBase);
    chartDesk.position.set(5, 0, -4);
    g.add(chartDesk);

    setupRoomMetadata(g, 'S25', [32, 10, 32], [
      { id: 'monolith_attune', name: 'Starlight Constellation Monolith', position: [0, 2.5, 0], type: 'attune' },
      { id: 'star_desk_inspect', name: 'Star Chart Celestial Desk', position: [5, 1.0, -4], type: 'examine' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // 26. CRYSTAL GROTTO (S26) - Crystal Vaults / Caverns
  // Connections: S22 (East), S24 (North)
  // -------------------------------------------------------------------------
  (function buildCrystalGrotto() {
    const g = rooms.crystal_grotto;
    g.position.set(-45, 0, 180);

    // Crystalline cave floor
    g.add(createChamberFloor(30, 30, 0x2e1065, 0x3b0764, 0.15, 0.7));

    // Cave perimeter walls
    g.add(createChamberPerimeterWalls({
      w: 30,
      d: 30,
      h: 12,
      wallMat: gothicStoneMat,
      trimMat: crystalVioletMat,
      openSides: { north: true, south: false, east: true, west: false }
    }));

    // Ceiling: Natural cavern stalactites
    g.add(createChamberCeiling({ w: 30, d: 30, h: 12, style: 'cavern_roof', trimMat: gothicStoneMat, beamMat: gothicStoneMat }));

    // Prop 1: Giant Amethyst Geode Cluster
    const amethystCluster = new THREE.Group();
    amethystCluster.name = 'giant_amethyst_cluster';
    for (let i = 0; i < 7; i++) {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.35 + (i % 3) * 0.15, 2.8 + (i % 4) * 0.6, 6), crystalVioletMat);
      const angle = (i / 7) * Math.PI * 2;
      spike.rotation.set((Math.random() - 0.5) * 0.4, angle, (Math.random() - 0.5) * 0.4);
      spike.position.set(Math.cos(angle) * 1.0, 1.4, Math.sin(angle) * 1.0);
      amethystCluster.add(spike);
    }
    amethystCluster.position.set(0, 0, 0);
    g.add(amethystCluster);

    // Prop 2: Quartz Geode Stalagmites
    const stalagmite = new THREE.Mesh(new THREE.ConeGeometry(0.9, 4.2, 8), crystalCyanMat);
    stalagmite.position.set(-6, 2.1, -5);
    g.add(stalagmite);

    // Prop 3: Frost Crystal Throne
    const throneGroup = new THREE.Group();
    throneGroup.name = 'frost_crystal_throne';
    const tBase = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.8, 1.8), crystalCyanMat);
    tBase.position.y = 0.4;
    throneGroup.add(tBase);
    const tBack = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.8, 0.4), crystalVioletMat);
    tBack.position.set(0, 2.0, -0.7);
    throneGroup.add(tBack);
    throneGroup.position.set(6, 0, 4);
    g.add(throneGroup);

    setupRoomMetadata(g, 'S26', [30, 12, 30], [
      { id: 'amethyst_geode', name: 'Giant Amethyst Geode Cluster', position: [0, 1.4, 0], type: 'harvest' },
      { id: 'frost_throne_seat', name: 'Frost Crystal Throne', position: [6, 1.4, 4], type: 'sit' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // 27. MOONLIT ROOFTOP GARDEN (S27) - 4F Upper Rooftop
  // Connections: S12 (Stairs below), S28 (West)
  // -------------------------------------------------------------------------
  (function buildMoonlitRooftop() {
    const g = rooms.moonlit_rooftop;
    g.position.set(0, 36, 0);

    // Marble and obsidian terrace floor
    g.add(createChamberFloor(30, 30, 0x0f172a, 0x1e293b, 0.25, 0.3));

    // Classical Balustrade perimeter (Open 360 sky with West gateway)
    g.add(createChamberPerimeterWalls({
      w: 30,
      d: 30,
      h: 3,
      wallMat: marbleWhiteMat,
      trimMat: goldTrimMat,
      openSides: { north: false, south: false, east: false, west: true },
      doorWidth: 6.0,
      doorHeight: 3.0
    }));

    // Prop 1: Stone Pergola & Trellis
    const pergola = new THREE.Group();
    pergola.name = 'stone_pergola';
    for (let px of [-4, 4]) {
      for (let pz of [-4, 4]) {
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 4.0, 16), marbleWhiteMat);
        pillar.position.set(px, 2.0, pz);
        pergola.add(pillar);
      }
    }
    const trellisTop = new THREE.Mesh(new THREE.BoxGeometry(9.0, 0.3, 9.0), darkWoodMat);
    trellisTop.position.set(0, 4.15, 0);
    pergola.add(trellisTop);
    pergola.position.set(0, 0, 4);
    g.add(pergola);

    // Prop 2: Astral Brass Telescope
    const telescope = new THREE.Group();
    telescope.name = 'astral_telescope';
    const tripod = new THREE.Mesh(new THREE.ConeGeometry(0.8, 1.8, 3, 1, true), ironMat);
    tripod.position.y = 0.9;
    telescope.add(tripod);
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.25, 2.8, 16), goldTrimMat);
    tube.rotation.x = Math.PI / 3;
    tube.position.set(0, 2.2, -0.4);
    telescope.add(tube);
    telescope.position.set(0, 0, -8);
    g.add(telescope);

    // Prop 3: Classical Marble Garden Urns
    for (let pos of [[-10, 0, -10], [10, 0, -10], [-10, 0, 10], [10, 0, 10]]) {
      const urn = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.4, 1.4, 12), marbleWhiteMat);
      urn.position.set(pos[0], 0.7, pos[2]);
      g.add(urn);
    }

    setupRoomMetadata(g, 'S27', [30, 8, 30], [
      { id: 'telescope_gaze', name: 'Astral Brass Telescope', position: [0, 1.8, -8], type: 'gaze' },
      { id: 'pergola_relax', name: 'Starlit Stone Pergola', position: [0, 2.0, 4], type: 'relax' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // 28. CLOCK TOWER BELFRY (S28) - 4F Upper Belfry
  // Connections: S09 (Below), S27 (East)
  // -------------------------------------------------------------------------
  (function buildClockTowerBelfry() {
    const g = rooms.clock_tower_belfry;
    g.position.set(-45, 24, 0);

    // Heavy oak plank deck
    g.add(createChamberFloor(20, 20, 0x271c19, 0x3d271d, 0.5, 0.2));

    // Belfry louvers walls
    g.add(createChamberPerimeterWalls({
      w: 20,
      d: 20,
      h: 18,
      wallMat: new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 }),
      trimMat: goldTrimMat,
      openSides: { north: false, south: false, east: true, west: false },
      doorWidth: 5.0,
      doorHeight: 7.0
    }));

    // Ceiling: Belfry scissor truss
    g.add(createChamberCeiling({ w: 20, d: 20, h: 18, style: 'belfry_truss', trimMat: goldTrimMat, beamMat: darkWoodMat }));

    // Prop 1: Massive Bronze Carillon Bell
    const bellGroup = new THREE.Group();
    bellGroup.name = 'massive_bronze_bell';
    const bellBody = new THREE.Mesh(new THREE.ConeGeometry(2.4, 3.6, 20), goldTrimMat);
    bellBody.position.y = 8.0;
    bellGroup.add(bellBody);
    const bellCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.2, 0.8, 16), goldTrimMat);
    bellCrown.position.y = 10.0;
    bellGroup.add(bellCrown);
    const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 7.0, 8), new THREE.MeshStandardMaterial({ color: 0x78350f }));
    rope.position.y = 4.0;
    bellGroup.add(rope);
    bellGroup.position.set(0, 0, 0);
    g.add(bellGroup);

    // Prop 2: Towering Belfry Gearbox Assembly
    const gearGroup = new THREE.Group();
    gearGroup.name = 'belfry_gearbox';
    const g1 = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.25, 8, 24), goldTrimMat);
    g1.position.set(5, 3.5, -4);
    gearGroup.add(g1);
    const g2 = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.2, 8, 20), ironMat);
    g2.position.set(5, 5.8, -4);
    gearGroup.add(g2);
    animatedClockGears.push({ mesh: g1, speed: 0.3 });
    animatedClockGears.push({ mesh: g2, speed: -0.45 });
    g.add(gearGroup);

    // Prop 3: Perch Railing & Gargoyle Watchpoint
    const gargoyle = new THREE.Mesh(new THREE.OctahedronGeometry(0.65), gothicStoneMat);
    gargoyle.position.set(-8, 1.8, 0);
    g.add(gargoyle);

    setupRoomMetadata(g, 'S28', [20, 18, 20], [
      { id: 'carillon_ring', name: 'Massive Bronze Carillon Bell', position: [0, 4.0, 0], type: 'ring' },
      { id: 'gearbox_inspect', name: 'Belfry Escapement Gearbox', position: [5, 3.5, -4], type: 'inspect' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // 29. MIRROR MAZE GALLERY (S29) - 3F Upper Towers
  // Connections: S12 (South), S08 (West)
  // -------------------------------------------------------------------------
  (function buildMirrorMazeGallery() {
    const g = rooms.mirror_maze_gallery;
    g.position.set(45, 24, -45);

    // High-gloss obsidian mirror floor
    g.add(createChamberFloor(24, 24, 0x090d16, 0x1e1b4b, 0.05, 0.85));

    // Perimeter walls
    g.add(createChamberPerimeterWalls({
      w: 24,
      d: 24,
      h: 10,
      wallMat: wallMat,
      trimMat: goldTrimMat,
      openSides: { north: false, south: true, east: false, west: true }
    }));

    // Ceiling: Mirrored coffered ribs
    g.add(createChamberCeiling({ w: 24, d: 24, h: 10, style: 'coffered_wood', trimMat: goldTrimMat, beamMat: obsidianMat }));

    // Prop 1: Gilded Hall of Mirrors Assembly
    const mirrorArray = new THREE.Group();
    mirrorArray.name = 'gilded_mirrors_assembly';
    [[-4, 0, -4], [4, 0, 4], [-4, 0, 4]].forEach(pos => {
      const frame = new THREE.Mesh(new THREE.BoxGeometry(3.0, 5.0, 0.3), goldTrimMat);
      frame.position.set(pos[0], 2.5, pos[2]);
      const glass = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 4.6), crystalCyanMat);
      glass.position.set(pos[0], 2.5, pos[2] + 0.16);
      mirrorArray.add(frame);
      mirrorArray.add(glass);
    });
    g.add(mirrorArray);

    // Prop 2: Reflective Prismatic Pedestal
    const prismPedestal = new THREE.Group();
    prismPedestal.name = 'reflective_prism_pedestal';
    const pPlinth = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.0, 1.2, 8), obsidianMat);
    pPlinth.position.y = 0.6;
    prismPedestal.add(pPlinth);
    const pPrism = new THREE.Mesh(new THREE.OctahedronGeometry(0.55), crystalVioletMat);
    pPrism.position.y = 1.6;
    prismPedestal.add(pPrism);
    animatedFloatingCrystals.push({ mesh: pPrism, baseY: 1.6, speed: 1.4 });
    prismPedestal.position.set(0, 0, 0);
    g.add(prismPedestal);

    // Prop 3: Gilded Reflective Obelisks
    for (let ox of [-6, 6]) {
      const obelisk = new THREE.Mesh(new THREE.ConeGeometry(0.6, 3.8, 4), goldTrimMat);
      obelisk.position.set(ox, 1.9, -6);
      g.add(obelisk);
    }

    setupRoomMetadata(g, 'S29', [24, 10, 24], [
      { id: 'prism_align', name: 'Reflective Prism Pedestal', position: [0, 1.2, 0], type: 'align' },
      { id: 'mirror_examine', name: 'Gilded Mirror Maze Array', position: [4, 2.5, 4], type: 'examine' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // 30. UNDERGROUND RIVER CAVERN (S30) - B2 Subterranean
  // Connections: S18 (North), S31 (East), S32 (West)
  // -------------------------------------------------------------------------
  (function buildUndergroundRiverCavern() {
    const g = rooms.underground_river_cavern;
    g.position.set(0, -42, -45);

    // Subterranean riverbed floor
    g.add(createChamberFloor(32, 32, 0x020617, 0x082f49, 0.45, 0.2));

    // Cavern rock perimeter walls
    g.add(createChamberPerimeterWalls({
      w: 32,
      d: 32,
      h: 12,
      wallMat: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.85 }),
      trimMat: gothicStoneMat,
      openSides: { north: true, south: false, east: true, west: true }
    }));

    // Ceiling: Stalactite cavern roof
    g.add(createChamberCeiling({ w: 32, d: 32, h: 12, style: 'cavern_roof', trimMat: gothicStoneMat, beamMat: gothicStoneMat }));

    // Prop 1: Subterranean River Channel & Water
    const riverWaterMat = createWaterShaderMaterial({
      deepColor: 0x020617,
      shallowColor: 0x0284c7,
      sunsetColor: 0x38bdf8,
      causticIntensity: 0.5,
      waveSpeed: 0.8,
      waveHeight: 0.04
    });
    const riverSurface = new THREE.Mesh(new THREE.PlaneGeometry(10.0, 30.0), riverWaterMat);
    riverSurface.rotation.x = -Math.PI / 2;
    riverSurface.position.set(0, 0.08, 0);
    g.add(riverSurface);
    animatedWaterMeshes.push(riverSurface);

    // Prop 2: Colossal Stalagmite / Stalactite Pillars
    for (let pos of [[-8, 0, -6], [8, 0, 6]]) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.6, 10.0, 12), gothicStoneMat);
      col.position.set(pos[0], 5.0, pos[1]);
      g.add(col);
    }

    // Prop 3: Stepping Stones & Moored Cavern Rowboat
    const rowboat = new THREE.Group();
    rowboat.name = 'cavern_rowboat';
    const hull = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.6, 3.6), darkWoodMat);
    hull.position.y = 0.3;
    rowboat.add(hull);
    const bench = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.1, 0.6), darkWoodMat);
    bench.position.y = 0.5;
    rowboat.add(bench);
    rowboat.position.set(-2, 0, 4);
    g.add(rowboat);

    setupRoomMetadata(g, 'S30', [32, 12, 32], [
      { id: 'river_inspect', name: 'Subterranean River Channel', position: [0, 0.4, 0], type: 'inspect' },
      { id: 'rowboat_board', name: 'Abandoned Cavern Rowboat', position: [-2, 0.5, 4], type: 'board' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // 31. CRYSTAL VAULT (S31) - B2 Subterranean Crystal Vault
  // Connections: S30 (West)
  // -------------------------------------------------------------------------
  (function buildCrystalVault() {
    const g = rooms.crystal_vault;
    g.position.set(45, -42, -45);

    // Amethyst and lapis flagstone floor
    g.add(createChamberFloor(24, 24, 0x3b0764, 0x581c87, 0.1, 0.8));

    // Reinforced vault walls
    g.add(createChamberPerimeterWalls({
      w: 24,
      d: 24,
      h: 10,
      wallMat: gothicStoneMat,
      trimMat: goldTrimMat,
      openSides: { north: false, south: false, east: false, west: true }
    }));

    // Ceiling: Vaulted crystal dome
    g.add(createChamberCeiling({ w: 24, d: 24, h: 10, style: 'glass_dome', trimMat: goldTrimMat, beamMat: goldTrimMat }));

    // Prop 1: Gilded Treasure Chest
    const chestGroup = new THREE.Group();
    chestGroup.name = 'gilded_treasure_chest';
    const chestBox = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.2, 1.6), goldTrimMat);
    chestBox.position.y = 0.6;
    chestGroup.add(chestBox);
    const chestLid = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2.4, 16, 1, false, 0, Math.PI), goldTrimMat);
    chestLid.rotation.z = Math.PI / 2;
    chestLid.position.set(0, 1.2, 0);
    chestGroup.add(chestLid);
    chestGroup.position.set(0, 0, 0);
    g.add(chestGroup);

    // Prop 2: Floating Prismatic Crystal Shard
    const shard = new THREE.Mesh(new THREE.OctahedronGeometry(0.9), crystalVioletMat);
    shard.position.set(0, 2.6, -4);
    shard.scale.set(0.7, 1.8, 0.7);
    g.add(shard);
    animatedFloatingCrystals.push({ mesh: shard, baseY: 2.6, speed: 1.5 });

    // Prop 3: Gem Display Pedestals
    for (let gx of [-5, 5]) {
      const gPed = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.8, 1.2, 6), marbleWhiteMat);
      gPed.position.set(gx, 0.6, 0);
      g.add(gPed);
      const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.32), (gx < 0 ? crystalCyanMat : goldTrimMat));
      gem.position.set(gx, 1.4, 0);
      g.add(gem);
    }

    setupRoomMetadata(g, 'S31', [24, 10, 24], [
      { id: 'vault_chest_open', name: 'Gilded Treasure Chest', position: [0, 0.8, 0], type: 'open' },
      { id: 'prismatic_shard_attune', name: 'Floating Prismatic Crystal Shard', position: [0, 2.6, -4], type: 'attune' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // 32. ANCIENT RUINS (S32) - B2 Subterranean Gothic Ruins
  // Connections: S30 (East)
  // -------------------------------------------------------------------------
  (function buildAncientRuins() {
    const g = rooms.ancient_ruins;
    g.position.set(-45, -42, -45);

    // Ancient cracked flagstone floor
    g.add(createChamberFloor(28, 28, 0x18181b, 0x27272a, 0.7, 0.1));

    // Temple walls
    g.add(createChamberPerimeterWalls({
      w: 28,
      d: 28,
      h: 12,
      wallMat: new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.85 }),
      trimMat: gothicStoneMat,
      openSides: { north: false, south: false, east: true, west: false }
    }));

    // Ceiling: Ribbed ruins vault
    g.add(createChamberCeiling({ w: 28, d: 28, h: 12, style: 'ribbed_vault', trimMat: gothicStoneMat, beamMat: gothicStoneMat }));

    // Prop 1: Broken Ionic Columns
    const colGroup = new THREE.Group();
    colGroup.name = 'broken_ionic_columns';
    const col1 = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.9, 5.5, 16), marbleWhiteMat);
    col1.position.set(-6, 2.75, -5);
    colGroup.add(col1);
    const col2 = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.9, 2.4, 16), marbleWhiteMat);
    col2.position.set(6, 1.2, -5);
    colGroup.add(col2);
    const fallenCol = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 4.0, 16), marbleWhiteMat);
    fallenCol.rotation.x = Math.PI / 2;
    fallenCol.position.set(6, 0.4, 2);
    colGroup.add(fallenCol);
    g.add(colGroup);

    // Prop 2: Runed Altar Slab & Ritual Basin
    const altar = new THREE.Group();
    altar.name = 'runed_altar_slab';
    const aBase = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.8, 2.2), gothicStoneMat);
    aBase.position.y = 0.4;
    altar.add(aBase);
    const basin = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.6, 0.4, 16), obsidianMat);
    basin.position.y = 1.0;
    altar.add(basin);
    altar.position.set(0, 0, 0);
    g.add(altar);

    // Prop 3: Megalithic Stone Archway
    const archway = new THREE.Group();
    archway.name = 'ancient_stone_archway';
    const postL = new THREE.Mesh(new THREE.BoxGeometry(1.2, 5.5, 1.2), gothicStoneMat);
    postL.position.set(-3, 2.75, -9);
    archway.add(postL);
    const postR = new THREE.Mesh(new THREE.BoxGeometry(1.2, 5.5, 1.2), gothicStoneMat);
    postR.position.set(3, 2.75, -9);
    archway.add(postR);
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(8.0, 1.2, 1.4), gothicStoneMat);
    lintel.position.set(0, 6.0, -9);
    archway.add(lintel);
    g.add(archway);

    setupRoomMetadata(g, 'S32', [28, 12, 28], [
      { id: 'ruins_altar_channel', name: 'Ancient Runed Altar Slab', position: [0, 0.8, 0], type: 'channel' },
      { id: 'archway_activate', name: 'Megalithic Stone Archway', position: [0, 3.0, -9], type: 'activate' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // 33. ASTRAL SPIRE PEAK (S33) - 5F Astral Spire Peak
  // Connections: S27 (South), S34 (East)
  // -------------------------------------------------------------------------
  (function buildAstralSpirePeak() {
    const g = rooms.astral_spire_peak;
    g.position.set(0, 48, 0);

    // Iridescent celestial tiled floor
    g.add(createChamberFloor(26, 26, 0x0f172a, 0x1e1b4b, 0.2, 0.4));

    // Starlight perimeter walls with open arches
    g.add(createChamberPerimeterWalls({
      w: 26,
      d: 26,
      h: 14,
      wallMat: new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.5 }),
      trimMat: goldTrimMat,
      openSides: { north: false, south: true, east: true, west: false }
    }));

    // Glass observatory dome ceiling
    g.add(createChamberCeiling({ w: 26, d: 26, h: 14, style: 'glass_dome', trimMat: goldTrimMat, beamMat: goldTrimMat }));

    // Prop 1: Astral Starlight Spire
    const spireGroup = new THREE.Group();
    spireGroup.name = 'astral_starlight_spire';
    const spireBase = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.8, 1.5, 16), marbleWhiteMat);
    spireBase.position.y = 0.75;
    spireGroup.add(spireBase);
    const spirePillar = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.6, 6.0, 16), goldTrimMat);
    spirePillar.position.y = 4.5;
    spireGroup.add(spirePillar);
    const starTop = new THREE.Mesh(new THREE.OctahedronGeometry(0.8), crystalCyanMat);
    starTop.position.y = 7.8;
    spireGroup.add(starTop);
    g.add(spireGroup);

    // Prop 2: Celestial Telescope Dais
    const daisGroup = new THREE.Group();
    daisGroup.name = 'celestial_telescope_dais';
    const daisSteps = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 3.2, 0.6, 24), marbleWhiteMat);
    daisSteps.position.set(5, 0.3, 4);
    daisGroup.add(daisSteps);
    const telescope = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 2.5, 12), goldTrimMat);
    telescope.rotation.x = -Math.PI / 4;
    telescope.position.set(5, 1.8, 4);
    daisGroup.add(telescope);
    g.add(daisGroup);

    // Prop 3: Orbiting Luminescent Halo
    const haloGroup = new THREE.Group();
    haloGroup.name = 'orbiting_luminescent_halo';
    const haloMesh = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.15, 16, 48), crystalCyanMat);
    haloMesh.rotation.x = Math.PI / 3;
    haloMesh.position.set(0, 5.0, 0);
    haloGroup.add(haloMesh);
    g.add(haloGroup);

    setupRoomMetadata(g, 'S33', [26, 14, 26], [
      { id: 'spire_star_beacon', name: 'Astral Star Beacon', position: [0, 2.0, 0], type: 'activate' },
      { id: 'telescope_inspect', name: 'Celestial Telescope', position: [5, 1.5, 4], type: 'inspect' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // 34. STARLIGHT OBSERVATORY SANCTUARY (S34) - 5F Crystal Sanctuary
  // Connections: S33 (West), S35 (South)
  // -------------------------------------------------------------------------
  (function buildStarlightSanctuary() {
    const g = rooms.starlight_sanctuary;
    g.position.set(45, 48, 0);

    g.add(createChamberFloor(24, 24, 0x2e1065, 0x3b0764, 0.15, 0.6));
    g.add(createChamberPerimeterWalls({
      w: 24,
      d: 24,
      h: 12,
      wallMat: gothicStoneMat,
      trimMat: crystalVioletMat,
      openSides: { north: false, south: true, east: false, west: true }
    }));
    g.add(createChamberCeiling({ w: 24, d: 24, h: 12, style: 'ribbed_vault', trimMat: crystalVioletMat, beamMat: crystalVioletMat }));

    // Prop 1: Sanctuary Prism Altar
    const prismAltar = new THREE.Group();
    prismAltar.name = 'sanctuary_prism_altar';
    const pBase = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.0, 1.0, 12), obsidianMat);
    pBase.position.y = 0.5;
    prismAltar.add(pBase);
    const pShard = new THREE.Mesh(new THREE.OctahedronGeometry(0.9), crystalVioletMat);
    pShard.position.y = 1.8;
    prismAltar.add(pShard);
    g.add(prismAltar);

    // Prop 2: Constellation Dome Mobile
    const domeMobile = new THREE.Group();
    domeMobile.name = 'celestial_constellation_dome';
    const centerGlobe = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), crystalCyanMat);
    centerGlobe.position.set(0, 6.5, 0);
    domeMobile.add(centerGlobe);
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 2) {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 8), goldTrimMat);
      arm.rotation.z = Math.PI / 2;
      arm.rotation.y = angle;
      arm.position.set(Math.cos(angle) * 1.1, 6.5, Math.sin(angle) * 1.1);
      domeMobile.add(arm);
    }
    g.add(domeMobile);

    setupRoomMetadata(g, 'S34', [24, 12, 24], [
      { id: 'sanctuary_prism_channel', name: 'Sanctuary Prism Altar', position: [0, 1.0, 0], type: 'channel' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // 35. CELESTIAL GRAND CHAMBER (S35) - 5F Royal Estate Chamber
  // Connections: S34 (North), S36 (West)
  // -------------------------------------------------------------------------
  (function buildCelestialChamber() {
    const g = rooms.celestial_chamber;
    g.position.set(45, 48, -45);

    g.add(createChamberFloor(28, 28, 0x083344, 0x164e63, 0.25, 0.5));
    g.add(createChamberPerimeterWalls({
      w: 28,
      d: 28,
      h: 12,
      wallMat: new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 }),
      trimMat: goldTrimMat,
      openSides: { north: true, south: false, east: false, west: true }
    }));
    g.add(createChamberCeiling({ w: 28, d: 28, h: 12, style: 'coffered', trimMat: goldTrimMat, beamMat: goldTrimMat }));

    // Prop 1: Opal Velvet Canopy & Dais
    const canopy = new THREE.Group();
    canopy.name = 'opal_velvet_canopy';
    const cDais = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.5, 4.5), marbleWhiteMat);
    cDais.position.set(0, 0.25, -6);
    canopy.add(cDais);
    const cCover = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.2, 4.2), velvetMat);
    cCover.position.set(0, 4.5, -6);
    canopy.add(cCover);
    g.add(canopy);

    // Prop 2: Gilded Astral Throne
    const throne = new THREE.Group();
    throne.name = 'gilded_astral_throne';
    const tBase = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.8, 1.4), goldTrimMat);
    tBase.position.set(0, 0.7, -6);
    throne.add(tBase);
    const tBack = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.0, 0.3), goldTrimMat);
    tBack.position.set(0, 2.0, -6.5);
    throne.add(tBack);
    g.add(throne);

    setupRoomMetadata(g, 'S35', [28, 12, 28], [
      { id: 'astral_throne_commune', name: 'Gilded Astral Throne', position: [0, 1.2, -6], type: 'commune' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // 36. MOONBEAM CLOCK ZENITH (S36) - 5F Estate Clockwork Chamber
  // Connections: S28 (South), S35 (East)
  // -------------------------------------------------------------------------
  (function buildMoonbeamZenith() {
    const g = rooms.moonbeam_zenith;
    g.position.set(-45, 48, 0);

    g.add(createChamberFloor(22, 22, 0x18181b, 0x27272a, 0.3, 0.7));
    g.add(createChamberPerimeterWalls({
      w: 22,
      d: 22,
      h: 16,
      wallMat: gothicStoneMat,
      trimMat: goldTrimMat,
      openSides: { north: false, south: true, east: true, west: false }
    }));
    g.add(createChamberCeiling({ w: 22, d: 22, h: 16, style: 'ribbed_vault', trimMat: goldTrimMat, beamMat: goldTrimMat }));

    // Prop 1: Zenith Escapement Wheel
    const gearGroup = new THREE.Group();
    gearGroup.name = 'zenith_escapement_wheel';
    const gear = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 0.3, 24), goldTrimMat);
    gear.rotation.x = Math.PI / 2;
    gear.position.set(0, 5.0, -8);
    gearGroup.add(gear);
    g.add(gearGroup);

    // Prop 2: Moonbeam Pendulum Shaft
    const pendulumGroup = new THREE.Group();
    pendulumGroup.name = 'moonbeam_pendulum_shaft';
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 6.0, 12), ironMat);
    rod.position.set(0, 6.0, 0);
    pendulumGroup.add(rod);
    const bob = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 16), goldTrimMat);
    bob.position.set(0, 2.5, 0);
    pendulumGroup.add(bob);
    g.add(pendulumGroup);

    setupRoomMetadata(g, 'S36', [22, 16, 22], [
      { id: 'zenith_chronometer', name: 'Zenith Master Chronometer', position: [0, 2.0, 0], type: 'puzzle' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // 37. ABYSSAL TRENCH GATEWAY (S37) - B3 Subterranean Trench Gateway
  // Connections: S30 (North), S38 (East)
  // -------------------------------------------------------------------------
  (function buildAbyssalTrenchGateway() {
    const g = rooms.abyssal_trench_gateway;
    g.position.set(0, -56, -45);

    g.add(createChamberFloor(30, 30, 0x082f49, 0x0c4a6e, 0.35, 0.3));
    g.add(createChamberPerimeterWalls({
      w: 30,
      d: 30,
      h: 14,
      wallMat: gothicStoneMat,
      trimMat: crystalCyanMat,
      openSides: { north: true, south: false, east: true, west: false }
    }));
    g.add(createChamberCeiling({ w: 30, d: 30, h: 14, style: 'cross_vault', trimMat: crystalCyanMat, beamMat: crystalCyanMat }));

    // Prop 1: Trench Stone Arch
    const arch = new THREE.Group();
    arch.name = 'trench_stone_arch';
    const pillarL = new THREE.Mesh(new THREE.BoxGeometry(1.4, 6.0, 1.4), obsidianMat);
    pillarL.position.set(-4, 3.0, 0);
    arch.add(pillarL);
    const pillarR = new THREE.Mesh(new THREE.BoxGeometry(1.4, 6.0, 1.4), obsidianMat);
    pillarR.position.set(4, 3.0, 0);
    arch.add(pillarR);
    const topBar = new THREE.Mesh(new THREE.BoxGeometry(10.0, 1.4, 1.6), obsidianMat);
    topBar.position.set(0, 6.5, 0);
    arch.add(topBar);
    g.add(arch);

    // Prop 2: Ancient Diving Bell
    const bellGroup = new THREE.Group();
    bellGroup.name = 'ancient_diving_bell';
    const bell = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.8, 2.8, 16), ironMat);
    bell.position.set(7, 1.4, -6);
    bellGroup.add(bell);
    g.add(bellGroup);

    setupRoomMetadata(g, 'S37', [30, 14, 30], [
      { id: 'trench_diving_bell', name: 'Ancient Pressure Diving Bell', position: [7, 1.4, -6], type: 'inspect' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // 38. BIOLUMINESCENT CORAL TRENCH (S38) - B3 Crystal Trench
  // Connections: S37 (West), S39 (South)
  // -------------------------------------------------------------------------
  (function buildCoralTrench() {
    const g = rooms.coral_trench;
    g.position.set(45, -56, -45);

    g.add(createChamberFloor(26, 26, 0x164e63, 0x0e7490, 0.2, 0.5));
    g.add(createChamberPerimeterWalls({
      w: 26,
      d: 26,
      h: 12,
      wallMat: gothicStoneMat,
      trimMat: crystalVioletMat,
      openSides: { north: false, south: true, east: false, west: true }
    }));
    g.add(createChamberCeiling({ w: 26, d: 26, h: 12, style: 'glass_dome', trimMat: crystalVioletMat, beamMat: crystalVioletMat }));

    // Prop 1: Glowing Sugar Coral
    const coralGroup = new THREE.Group();
    coralGroup.name = 'glowing_sugar_coral';
    for (let sign of [-1, 1]) {
      const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.5, 3.2, 8), crystalCyanMat);
      stalk.position.set(sign * 2.5, 1.6, 0);
      stalk.rotation.z = sign * 0.2;
      coralGroup.add(stalk);
    }
    g.add(coralGroup);

    // Prop 2: Trench Caustic Shelf
    const shelf = new THREE.Group();
    shelf.name = 'trench_caustic_shelf';
    const sPlate = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.4, 2.0), obsidianMat);
    sPlate.position.set(0, 1.2, 6);
    shelf.add(sPlate);
    g.add(shelf);

    setupRoomMetadata(g, 'S38', [26, 12, 26], [
      { id: 'sugar_coral_harvest', name: 'Bioluminescent Sugar Coral', position: [0, 1.5, 0], type: 'harvest' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // 39. DEEP ALCHEMICAL VAULT (S39) - B3 Subterranean Laboratory
  // Connections: S31 (North), S38 (West), S40 (South)
  // -------------------------------------------------------------------------
  (function buildDeepAlchemicalVault() {
    const g = rooms.deep_alchemical_vault;
    g.position.set(45, -56, 0);

    g.add(createChamberFloor(24, 24, 0x064e3b, 0x065f46, 0.2, 0.6));
    g.add(createChamberPerimeterWalls({
      w: 24,
      d: 24,
      h: 10,
      wallMat: gothicStoneMat,
      trimMat: goldTrimMat,
      openSides: { north: true, south: true, east: false, west: true }
    }));
    g.add(createChamberCeiling({ w: 24, d: 24, h: 10, style: 'coffered', trimMat: goldTrimMat, beamMat: goldTrimMat }));

    // Prop 1: Pressurized Alchemical Crucible
    const crucibleGroup = new THREE.Group();
    crucibleGroup.name = 'pressurized_alchemical_crucible';
    const vat = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.4, 2.2, 16), ironMat);
    vat.position.set(0, 1.1, 0);
    crucibleGroup.add(vat);
    const pressureGuage = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.06, 8, 16), goldTrimMat);
    pressureGuage.position.set(0, 2.4, 0);
    crucibleGroup.add(pressureGuage);
    g.add(crucibleGroup);

    // Prop 2: Subsurface Crystal Pedestal
    const pedGroup = new THREE.Group();
    pedGroup.name = 'subsurface_crystal_pedestal';
    const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.9, 1.2, 12), obsidianMat);
    ped.position.set(5, 0.6, -4);
    pedGroup.add(ped);
    const shard = new THREE.Mesh(new THREE.OctahedronGeometry(0.5), crystalVioletMat);
    shard.position.set(5, 1.6, -4);
    pedGroup.add(shard);
    g.add(pedGroup);

    setupRoomMetadata(g, 'S39', [24, 10, 24], [
      { id: 'deep_vault_crucible', name: 'Pressurized Alchemical Crucible', position: [0, 1.5, 0], type: 'alchemy' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // 40. ANCIENT CORE CRUCIBLE (S40) - B3 Gothic Primordial Hearth
  // Connections: S32 (North), S39 (East)
  // -------------------------------------------------------------------------
  (function buildAncientCoreCrucible() {
    const g = rooms.ancient_core_crucible;
    g.position.set(-45, -56, -45);

    g.add(createChamberFloor(28, 28, 0x3b0764, 0x4c1d95, 0.3, 0.4));
    g.add(createChamberPerimeterWalls({
      w: 28,
      d: 28,
      h: 14,
      wallMat: gothicStoneMat,
      trimMat: goldTrimMat,
      openSides: { north: true, south: false, east: true, west: false }
    }));
    g.add(createChamberCeiling({ w: 28, d: 28, h: 14, style: 'ribbed_vault', trimMat: goldTrimMat, beamMat: goldTrimMat }));

    // Prop 1: Primordial Joy Furnace
    const furnaceGroup = new THREE.Group();
    furnaceGroup.name = 'primordial_joy_furnace';
    const fBase = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.0, 3.6), obsidianMat);
    fBase.position.set(0, 1.0, 0);
    furnaceGroup.add(fBase);
    const fHeart = new THREE.Mesh(new THREE.DodecahedronGeometry(1.0), crystalCyanMat);
    fHeart.position.set(0, 2.6, 0);
    furnaceGroup.add(fHeart);
    g.add(furnaceGroup);

    // Prop 2: Confectionery Steam Regulator
    const steamGroup = new THREE.Group();
    steamGroup.name = 'confectionery_steam_regulator';
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 4.5, 12), ironMat);
    pipe.position.set(-6, 2.25, -6);
    steamGroup.add(pipe);
    g.add(steamGroup);

    setupRoomMetadata(g, 'S40', [28, 14, 28], [
      { id: 'core_furnace_joy', name: 'Primordial Joy Furnace', position: [0, 2.5, 0], type: 'furnace' }
    ]);
  })();

  // -------------------------------------------------------------------------
  // INITIAL GROUND ITEMS SPAWNING
  // -------------------------------------------------------------------------
  spawnGroundItem('herb_green', new THREE.Vector3(7, 0.2, 6), 'foyer');
  spawnGroundItem('powder_red', new THREE.Vector3(-7, 0.2, 6), 'foyer');
  spawnGroundItem('ribbon_gold', new THREE.Vector3(0, 0.2, 4), 'foyer');
  spawnGroundItem('tome_scroll', new THREE.Vector3(0, 1.4, 3), 'library');
  spawnGroundItem('herb_green', new THREE.Vector3(5, 0.2, -6), 'garden');
  spawnGroundItem('sugar_crystal', new THREE.Vector3(5, 0.2, 4), 'greenhouse');
  spawnGroundItem('gem_star', new THREE.Vector3(7, 0.2, -6), 'observatory');
  spawnGroundItem('crest_royal', new THREE.Vector3(-7, 0.2, -4), 'clocktower');
  spawnGroundItem('powder_red', new THREE.Vector3(6, 0.2, 4), 'dining');
  spawnGroundItem('herb_green', new THREE.Vector3(-6, 0.2, 4), 'gallery');
  spawnGroundItem('sugar_crystal', new THREE.Vector3(0, 0.2, -3), 'mastersuite');
  spawnGroundItem('herb_green', new THREE.Vector3(0, 0.2, 4), 'gatehouse');
  spawnGroundItem('sugar_crystal', new THREE.Vector3(0, 0.2, 0), 'gazebo');
  spawnGroundItem('herb_green', new THREE.Vector3(0, 0.2, 4), 'conservatory');
  spawnGroundItem('sugar_crystal', new THREE.Vector3(0, 0.2, 2), 'tea_salon');
  spawnGroundItem('gem_star', new THREE.Vector3(0, 0.2, 0), 'crystal_vault');
}

// =========================================================================
// ITEM SPAWN & ANIMATION LOOP
// =========================================================================

export function spawnGroundItem(itemId, pos, roomName) {
  const group = new THREE.Group();
  group.position.copy(pos);
  group.userData = { itemId, roomName };

  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(0.48, 0.05, 8, 24),
    new THREE.MeshBasicMaterial({ color: 0x22d3ee, wireframe: true })
  );
  halo.rotation.x = Math.PI / 2;
  group.add(halo);

  const core = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.36),
    new THREE.MeshStandardMaterial({
      color: (itemId.includes('herb') ? 0x10b981 : (itemId.includes('key') || itemId.includes('crest') ? 0xf59e0b : 0xec4899)),
      emissive: 0x22d3ee,
      emissiveIntensity: 0.5
    })
  );
  core.position.y = 0.45;
  group.add(core);

  if (rooms[roomName]) rooms[roomName].add(group);
  groundItems.push(group);
  return group;
}

export function updateGroundItems(delta, time) {
  groundItems.forEach(item => {
    item.rotation.y += delta * 1.6;
    item.position.y = 0.2 + Math.sin(time * 3 + item.position.x) * 0.09;
  });

  animatedWaterMeshes.forEach(w => { w.rotation.z += delta * 0.5; });
  animatedAstrolabeRings.forEach(r => {
    if (r.axis === 'y') r.mesh.rotation.y += delta * r.speed;
    if (r.axis === 'x') r.mesh.rotation.x += delta * r.speed;
  });
  animatedClockGears.forEach(g => {
    if (g.speed) g.mesh.rotation.z += delta * g.speed;
    if (g.pendulum) g.mesh.rotation.z = Math.sin(time * 2.2) * 0.35;
  });
  animatedBallroomCrystals.forEach(c => { c.rotation.y += delta * 0.8; });
  animatedFloatingCrystals.forEach(fc => {
    fc.mesh.rotation.y += delta * 1.2;
    fc.mesh.position.y = fc.baseY + Math.sin(time * 2.5 * (fc.speed || 1.0)) * 0.12;
  });

  if (animatedCausticFloor) {
    animatedCausticFloor.material.opacity = 0.15 + Math.sin(time * 2.5) * 0.06;
  }
}

// =========================================================================
// QUERY HELPERS FOR ROOM DATA & COLLISION
// =========================================================================

export function getRoomBounds(roomNameOrId) {
  const r = rooms[roomNameOrId];
  return r?.userData?.bounds || null;
}

export function getRoomInteractables(roomNameOrId) {
  const r = rooms[roomNameOrId];
  return r?.userData?.interactables || [];
}

export function getRoomCollisionBoxes(roomNameOrId) {
  const r = rooms[roomNameOrId];
  return r?.userData?.collisionBoxes || [];
}

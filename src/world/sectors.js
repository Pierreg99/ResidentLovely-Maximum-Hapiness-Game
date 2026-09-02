// =========================================================================
// RESIDENT LOVELY - MODULAR SECTOR REGISTRY
// Standard: NEXUS PRIVE v6.0 | Strict Zero-Emoji Protocol | Native ESM
// =========================================================================

export const BIOME_COLORS = {
  estate: '#22d3ee',
  gothic: '#7c3aed',
  kawaii: '#f472b6',
  outdoor: '#10b981',
  forest: '#065f46',
  maritime: '#0284c7',
  subterranean: '#78350f',
  crystal: '#a78bfa'
};

export const BIOME_NAMES = {
  estate: 'Estate Wings',
  gothic: 'Gothic Chambers',
  kawaii: 'Kawaii Tea Salons',
  outdoor: 'Outdoor Grounds',
  forest: 'Sacred Forest',
  maritime: 'Maritime Docks',
  subterranean: 'Subterranean Crypts',
  crystal: 'Crystal Vaults'
};

export const FLOOR_ORDER = ['5F', '4F', '3F', '2F', '1F', 'B1', 'B2', 'B3', 'OUTDOOR'];

export const SECTOR_REGISTRY = [
  // =========================================================================
  // 1F GROUND ESTATE WINGS (S01 - S07, S19 - S21)
  // =========================================================================
  {
    id: 'S01',
    slug: 'foyer',
    name: 'Grand Foyer & Mezzanine',
    floor: '1F',
    biome: 'estate',
    biomeColor: '#22d3ee',
    coords: { x: 0, y: 0, z: 0 },
    size: { w: 28, l: 28, h: 12 },
    connections: ['S02', 'S03', 'S04', 'S08', 'S09', 'S17'],
    happiness: 75,
    backdrop: 'assets/backdrops/S01-foyer.png',
    backdropSvg: 'backdrop_foyer.svg',
    shader: 'bioluminescent_floor',
    light: { color: 0xf59e0b, intensity: 1.8, distance: 32, position: { x: 0, y: 7.5, z: 0 } },
    ambient: { color: 0x38bdf8, intensity: 0.65 },
    pbr: { roughness: 0.18, metalness: 0.25, normalScale: 1.0 }
  },
  {
    id: 'S02',
    slug: 'library',
    name: 'Library of Harmony',
    floor: '1F',
    biome: 'estate',
    biomeColor: '#22d3ee',
    coords: { x: 45, y: 0, z: 0 },
    size: { w: 24, l: 24, h: 10 },
    connections: ['S01', 'S05'],
    happiness: 50,
    backdrop: 'assets/backdrops/S02-library.png',
    backdropSvg: 'backdrop_library.svg',
    shader: 'ivy_vein',
    light: { color: 0xf59e0b, intensity: 2.0, distance: 32, position: { x: 45, y: 7.0, z: 0 } },
    ambient: { color: 0xfde047, intensity: 0.55 },
    pbr: { roughness: 0.22, metalness: 0.15, normalScale: 1.0 }
  },
  {
    id: 'S03',
    slug: 'garden',
    name: 'Solarium Garden',
    floor: '1F',
    biome: 'kawaii',
    biomeColor: '#f472b6',
    coords: { x: -45, y: 0, z: 0 },
    size: { w: 26, l: 26, h: 10 },
    connections: ['S01', 'S06', 'S19'],
    happiness: 90,
    backdrop: 'assets/backdrops/S03-garden.png',
    backdropSvg: 'backdrop_garden.svg',
    shader: 'flowing_river',
    light: { color: 0x10b981, intensity: 2.2, distance: 34, position: { x: -45, y: 7.5, z: 0 } },
    ambient: { color: 0x6ee7b7, intensity: 0.85 },
    pbr: { roughness: 0.35, metalness: 0.1, normalScale: 1.0 }
  },
  {
    id: 'S04',
    slug: 'greenhouse',
    name: 'Courtyard Tea Greenhouse',
    floor: '1F',
    biome: 'kawaii',
    biomeColor: '#f472b6',
    coords: { x: 0, y: 0, z: 45 },
    size: { w: 26, l: 26, h: 12 },
    connections: ['S01', 'S13'],
    happiness: 85,
    backdrop: 'assets/backdrops/S04-greenhouse.png',
    backdropSvg: 'backdrop_greenhouse.svg',
    shader: 'ivy_vein',
    light: { color: 0x34d399, intensity: 2.2, distance: 34, position: { x: 0, y: 7.5, z: 45 } },
    ambient: { color: 0x6ee7b7, intensity: 0.85 },
    pbr: { roughness: 0.15, metalness: 0.2, normalScale: 1.0 }
  },
  {
    id: 'S05',
    slug: 'dining',
    name: 'Grand Banquet Dining Hall',
    floor: '1F',
    biome: 'estate',
    biomeColor: '#22d3ee',
    coords: { x: 45, y: 0, z: 45 },
    size: { w: 26, l: 26, h: 10 },
    connections: ['S02', 'S07'],
    happiness: 90,
    backdrop: 'assets/backdrops/S05-dining.png',
    backdropSvg: 'backdrop_dining.svg',
    shader: 'bioluminescent_floor',
    light: { color: 0xf59e0b, intensity: 2.2, distance: 34, position: { x: 45, y: 7.5, z: 45 } },
    ambient: { color: 0x38bdf8, intensity: 0.65 },
    pbr: { roughness: 0.25, metalness: 0.3, normalScale: 1.0 }
  },
  {
    id: 'S06',
    slug: 'gallery',
    name: 'Hall of Wholesome Portraits',
    floor: '1F',
    biome: 'estate',
    biomeColor: '#22d3ee',
    coords: { x: -45, y: 0, z: 45 },
    size: { w: 26, l: 26, h: 10 },
    connections: ['S03', 'S20'],
    happiness: 95,
    backdrop: 'assets/backdrops/S06-gallery.png',
    backdropSvg: 'backdrop_gallery.svg',
    shader: 'prismatic_refraction',
    light: { color: 0xec4899, intensity: 2.2, distance: 34, position: { x: -45, y: 7.5, z: 45 } },
    ambient: { color: 0x38bdf8, intensity: 0.65 },
    pbr: { roughness: 0.2, metalness: 0.25, normalScale: 1.0 }
  },
  {
    id: 'S07',
    slug: 'bakery',
    name: 'Royal Bakery & Kitchen',
    floor: '1F',
    biome: 'kawaii',
    biomeColor: '#f472b6',
    coords: { x: 45, y: -14, z: -45 },
    size: { w: 26, l: 26, h: 10 },
    connections: ['S05', 'S17'],
    happiness: 80,
    backdrop: 'assets/backdrops/S07-bakery.png',
    backdropSvg: 'backdrop_bakery.svg',
    shader: 'mechanical_gear_wall',
    light: { color: 0xf59e0b, intensity: 2.2, distance: 32, position: { x: 45, y: -7.0, z: -45 } },
    ambient: { color: 0xfde047, intensity: 0.6 },
    pbr: { roughness: 0.3, metalness: 0.2, normalScale: 1.0 }
  },
  {
    id: 'S19',
    slug: 'conservatory',
    name: 'Haunted Conservatory',
    floor: '1F',
    biome: 'gothic',
    biomeColor: '#7c3aed',
    coords: { x: -90, y: 0, z: 0 },
    size: { w: 26, l: 26, h: 12 },
    connections: ['S03', 'S20', 'S21'],
    happiness: 40,
    backdrop: 'assets/backdrops/S19-haunted-conservatory.png',
    backdropSvg: 'backdrop_haunted_conservatory.svg',
    shader: 'ivy_vein',
    light: { color: 0x7c3aed, intensity: 2.2, distance: 34, position: { x: -90, y: 7.5, z: 0 } },
    ambient: { color: 0x581c87, intensity: 0.6 },
    pbr: { roughness: 0.4, metalness: 0.2, normalScale: 1.0 },
    props: ['overgrown_gothic_urn', 'withered_topiary_arch', 'ghostly_sconce']
  },
  {
    id: 'S20',
    slug: 'tea_salon',
    name: 'Tea Salon',
    floor: '1F',
    biome: 'kawaii',
    biomeColor: '#f472b6',
    coords: { x: -90, y: 0, z: 45 },
    size: { w: 24, l: 24, h: 10 },
    connections: ['S19', 'S06'],
    happiness: 70,
    backdrop: 'assets/backdrops/S20-tea-salon.png',
    backdropSvg: 'backdrop_tea_salon.svg',
    shader: 'bioluminescent_floor',
    light: { color: 0xf472b6, intensity: 2.2, distance: 34, position: { x: -90, y: 7.5, z: 45 } },
    ambient: { color: 0xec4899, intensity: 0.7 },
    pbr: { roughness: 0.2, metalness: 0.15, normalScale: 1.0 },
    props: ['tiered_pastry_stand', 'kawaii_teapot_table', 'velvet_chaise']
  },
  {
    id: 'S21',
    slug: 'music_parlor',
    name: 'Music Parlor',
    floor: '1F',
    biome: 'estate',
    biomeColor: '#22d3ee',
    coords: { x: -90, y: 0, z: -45 },
    size: { w: 26, l: 26, h: 10 },
    connections: ['S19'],
    happiness: 65,
    backdrop: 'assets/backdrops/S21-music-parlor.png',
    backdropSvg: 'backdrop_music_parlor.svg',
    shader: 'prismatic_refraction',
    light: { color: 0x22d3ee, intensity: 2.2, distance: 34, position: { x: -90, y: 7.5, z: -45 } },
    ambient: { color: 0x38bdf8, intensity: 0.65 },
    pbr: { roughness: 0.25, metalness: 0.4, normalScale: 1.0 },
    props: ['grand_harpsichord', 'cello_stand', 'brass_horn_sconce']
  },

  // =========================================================================
  // 2F MEZZANINE & UPPER SUITES (S08 - S11)
  // =========================================================================
  {
    id: 'S08',
    slug: 'observatory',
    name: 'Celestial Observatory',
    floor: '2F',
    biome: 'crystal',
    biomeColor: '#a78bfa',
    coords: { x: 45, y: 12, z: 0 },
    size: { w: 24, l: 24, h: 12 },
    connections: ['S01', 'S29'],
    happiness: 60,
    backdrop: 'assets/backdrops/S08-observatory.png',
    backdropSvg: 'backdrop_observatory.svg',
    shader: 'star_trail_sky',
    light: { color: 0x38bdf8, intensity: 2.2, distance: 34, position: { x: 45, y: 18.0, z: 0 } },
    ambient: { color: 0x38bdf8, intensity: 0.7 },
    pbr: { roughness: 0.12, metalness: 0.85, normalScale: 1.0 }
  },
  {
    id: 'S09',
    slug: 'clocktower',
    name: 'Clocktower Sweet Suite',
    floor: '2F',
    biome: 'estate',
    biomeColor: '#22d3ee',
    coords: { x: -45, y: 12, z: 0 },
    size: { w: 24, l: 24, h: 14 },
    connections: ['S01', 'S28'],
    happiness: 65,
    backdrop: 'assets/backdrops/S09-clocktower.png',
    backdropSvg: 'backdrop_clocktower.svg',
    shader: 'mechanical_gear_wall',
    light: { color: 0xf59e0b, intensity: 2.2, distance: 34, position: { x: -45, y: 18.0, z: 0 } },
    ambient: { color: 0xfde047, intensity: 0.6 },
    pbr: { roughness: 0.28, metalness: 0.45, normalScale: 1.0 }
  },
  {
    id: 'S10',
    slug: 'mastersuite',
    name: 'Royal Velvet Master Suite',
    floor: '2F',
    biome: 'kawaii',
    biomeColor: '#f472b6',
    coords: { x: 0, y: 12, z: 45 },
    size: { w: 24, l: 24, h: 10 },
    connections: ['S01', 'S11'],
    happiness: 100,
    backdrop: 'assets/backdrops/S10-mastersuite.png',
    backdropSvg: 'backdrop_mastersuite.svg',
    shader: 'bioluminescent_floor',
    light: { color: 0xa855f7, intensity: 2.2, distance: 34, position: { x: 0, y: 18.0, z: 45 } },
    ambient: { color: 0x38bdf8, intensity: 0.65 },
    pbr: { roughness: 0.35, metalness: 0.2, normalScale: 1.0 }
  },
  {
    id: 'S11',
    slug: 'ballroom',
    name: 'Grand Crystal Ballroom',
    floor: '2F',
    biome: 'crystal',
    biomeColor: '#a78bfa',
    coords: { x: 0, y: 12, z: -45 },
    size: { w: 26, l: 26, h: 12 },
    connections: ['S01', 'S10', 'S12'],
    happiness: 100,
    backdrop: 'assets/backdrops/S11-ballroom.png',
    backdropSvg: 'backdrop_ballroom.svg',
    shader: 'prismatic_refraction',
    light: { color: 0x38bdf8, intensity: 2.4, distance: 36, position: { x: 0, y: 18.0, z: -45 } },
    ambient: { color: 0x38bdf8, intensity: 0.7 },
    pbr: { roughness: 0.1, metalness: 0.65, normalScale: 1.0 }
  },

  // =========================================================================
  // 3F & 4F UPPER TOWERS & ROOFTOP (S12, S27, S28, S29)
  // =========================================================================
  {
    id: 'S12',
    slug: 'cathedral',
    name: 'Crystal Cathedral of Harmony',
    floor: '3F',
    biome: 'crystal',
    biomeColor: '#a78bfa',
    coords: { x: 0, y: 24, z: 0 },
    size: { w: 26, l: 26, h: 16 },
    connections: ['S11', 'S27', 'S29'],
    happiness: 85,
    backdrop: 'assets/backdrops/S12-cathedral.png',
    backdropSvg: 'backdrop_cathedral.svg',
    shader: 'infinite_mirror',
    light: { color: 0xf59e0b, intensity: 2.5, distance: 38, position: { x: 0, y: 30.0, z: 0 } },
    ambient: { color: 0x38bdf8, intensity: 0.7 },
    pbr: { roughness: 0.15, metalness: 0.5, normalScale: 1.0 }
  },
  {
    id: 'S29',
    slug: 'mirror_maze_gallery',
    name: 'Mirror Maze Gallery',
    floor: '3F',
    biome: 'crystal',
    biomeColor: '#a78bfa',
    coords: { x: 45, y: 24, z: -45 },
    size: { w: 24, l: 24, h: 10 },
    connections: ['S12', 'S08'],
    happiness: 55,
    backdrop: 'assets/backdrops/S29-mirror-maze-gallery.png',
    backdropSvg: 'backdrop_mirror_maze_gallery.svg',
    shader: 'infinite_mirror',
    light: { color: 0xa78bfa, intensity: 2.4, distance: 36, position: { x: 45, y: 30.0, z: -45 } },
    ambient: { color: 0x38bdf8, intensity: 0.7 },
    pbr: { roughness: 0.05, metalness: 0.9, normalScale: 1.0 },
    props: ['prismatic_mirror_frame', 'reflective_pedestal', 'gilded_obelisk']
  },
  {
    id: 'S27',
    slug: 'moonlit_rooftop',
    name: 'Moonlit Rooftop Garden',
    floor: '4F',
    biome: 'outdoor',
    biomeColor: '#10b981',
    coords: { x: 0, y: 36, z: 0 },
    size: { w: 30, l: 30, h: 8 },
    connections: ['S12', 'S28', 'S33'],
    happiness: 90,
    backdrop: 'assets/backdrops/S27-moonlit-rooftop.png',
    backdropSvg: 'backdrop_moonlit_rooftop.svg',
    shader: 'star_trail_sky',
    light: { color: 0x38bdf8, intensity: 2.4, distance: 38, position: { x: 0, y: 42.0, z: 0 } },
    ambient: { color: 0x0f172a, intensity: 0.8 },
    pbr: { roughness: 0.35, metalness: 0.25, normalScale: 1.0 },
    props: ['rooftop_balustrade', 'astral_telescope', 'starlit_pergola']
  },
  {
    id: 'S28',
    slug: 'clock_tower_belfry',
    name: 'Clock Tower Belfry',
    floor: '4F',
    biome: 'estate',
    biomeColor: '#22d3ee',
    coords: { x: -45, y: 24, z: 0 },
    size: { w: 20, l: 20, h: 18 },
    connections: ['S09', 'S27', 'S36'],
    happiness: 60,
    backdrop: 'assets/backdrops/S28-clock-tower-belfry.png',
    backdropSvg: 'backdrop_clock_tower_belfry.svg',
    shader: 'mechanical_gear_wall',
    light: { color: 0xf59e0b, intensity: 2.2, distance: 36, position: { x: -45, y: 30.0, z: 0 } },
    ambient: { color: 0xfde047, intensity: 0.6 },
    pbr: { roughness: 0.4, metalness: 0.6, normalScale: 1.0 },
    props: ['massive_bronze_bell', 'belfry_gearbox', 'perch_railing']
  },

  // =========================================================================
  // SUBTERRANEAN LEVELS B1 & B2 (S17, S18, S30, S31, S32)
  // =========================================================================
  {
    id: 'S17',
    slug: 'lab',
    name: 'Subterranean Sugar Lab',
    floor: 'B1',
    biome: 'subterranean',
    biomeColor: '#78350f',
    coords: { x: 0, y: -14, z: -45 },
    size: { w: 26, l: 26, h: 10 },
    connections: ['S01', 'S07', 'S18'],
    happiness: 45,
    backdrop: 'assets/backdrops/S17-lab.png',
    backdropSvg: 'backdrop_lab.svg',
    shader: 'mechanical_gear_wall',
    light: { color: 0x06b6d4, intensity: 2.4, distance: 36, position: { x: 0, y: -8.0, z: -45 } },
    ambient: { color: 0x06b6d4, intensity: 0.6 },
    pbr: { roughness: 0.35, metalness: 0.5, normalScale: 1.0 }
  },
  {
    id: 'S18',
    slug: 'crypt',
    name: 'Whispering Crypt Boss Arena',
    floor: 'B2',
    biome: 'gothic',
    biomeColor: '#7c3aed',
    coords: { x: 0, y: -28, z: -45 },
    size: { w: 28, l: 28, h: 12 },
    connections: ['S17', 'S30'],
    happiness: 30,
    backdrop: 'assets/backdrops/S18-crypt.png',
    backdropSvg: 'backdrop_crypt.svg',
    shader: 'ice_crack_floor',
    light: { color: 0x22d3ee, intensity: 2.6, distance: 38, position: { x: 0, y: -22.0, z: -45 } },
    ambient: { color: 0x06b6d4, intensity: 0.6 },
    pbr: { roughness: 0.4, metalness: 0.3, normalScale: 1.0 }
  },
  {
    id: 'S30',
    slug: 'underground_river_cavern',
    name: 'Underground River Cavern',
    floor: 'B2',
    biome: 'subterranean',
    biomeColor: '#78350f',
    coords: { x: 0, y: -42, z: -45 },
    size: { w: 32, l: 32, h: 12 },
    connections: ['S18', 'S31', 'S32', 'S37'],
    happiness: 35,
    backdrop: 'assets/backdrops/S30-underground-river-cavern.png',
    backdropSvg: 'backdrop_underground_river_cavern.svg',
    shader: 'flowing_river',
    light: { color: 0x0284c7, intensity: 2.4, distance: 36, position: { x: 0, y: -36.0, z: -45 } },
    ambient: { color: 0x06b6d4, intensity: 0.6 },
    pbr: { roughness: 0.5, metalness: 0.2, normalScale: 1.0 },
    props: ['stalactite_pillars', 'cavern_stepping_stones', 'mineral_ledge']
  },
  {
    id: 'S31',
    slug: 'crystal_vault',
    name: 'Crystal Vault',
    floor: 'B2',
    biome: 'crystal',
    biomeColor: '#a78bfa',
    coords: { x: 45, y: -42, z: -45 },
    size: { w: 24, l: 24, h: 10 },
    connections: ['S30', 'S39'],
    happiness: 50,
    backdrop: 'assets/backdrops/S31-crystal-vault.png',
    backdropSvg: 'backdrop_crystal_vault.svg',
    shader: 'ice_crack_floor',
    light: { color: 0xa78bfa, intensity: 2.4, distance: 36, position: { x: 45, y: -36.0, z: -45 } },
    ambient: { color: 0x581c87, intensity: 0.65 },
    pbr: { roughness: 0.1, metalness: 0.8, normalScale: 1.0 },
    props: ['gilded_treasure_chest', 'floating_prismatic_shard', 'gem_pedestal']
  },
  {
    id: 'S32',
    slug: 'ancient_ruins',
    name: 'Ancient Ruins',
    floor: 'B2',
    biome: 'gothic',
    biomeColor: '#7c3aed',
    coords: { x: -45, y: -42, z: -45 },
    size: { w: 28, l: 28, h: 12 },
    connections: ['S30', 'S40'],
    happiness: 35,
    backdrop: 'assets/backdrops/S32-ancient-ruins.png',
    backdropSvg: 'backdrop_ancient_ruins.svg',
    shader: 'bioluminescent_floor',
    light: { color: 0x7c3aed, intensity: 2.4, distance: 36, position: { x: -45, y: -36.0, z: -45 } },
    ambient: { color: 0x3b0764, intensity: 0.6 },
    pbr: { roughness: 0.65, metalness: 0.1, normalScale: 1.0 },
    props: ['broken_ionic_column', 'runed_altar_slab', 'ancient_stone_archway']
  },

  // =========================================================================
  // OUTDOOR OPEN GROUNDS (S13 - S16, S22 - S26)
  // =========================================================================
  {
    id: 'S13',
    slug: 'gatehouse',
    name: 'Sunset Carriage Gatehouse',
    floor: 'OUTDOOR',
    biome: 'outdoor',
    biomeColor: '#10b981',
    coords: { x: 0, y: 0, z: 90 },
    size: { w: 30, l: 30, h: 14 },
    connections: ['S04', 'S14', 'S15', 'S16'],
    happiness: 80,
    backdrop: 'assets/backdrops/S13-gatehouse.png',
    backdropSvg: 'backdrop_gatehouse.svg',
    shader: 'star_trail_sky',
    light: { color: 0xf59e0b, intensity: 2.2, distance: 36, position: { x: 0, y: 8.0, z: 90 } },
    ambient: { color: 0xf59e0b, intensity: 0.8 },
    pbr: { roughness: 0.45, metalness: 0.1, normalScale: 1.0 }
  },
  {
    id: 'S14',
    slug: 'reflection_pool',
    name: 'Grand Reflection Pool',
    floor: 'OUTDOOR',
    biome: 'outdoor',
    biomeColor: '#10b981',
    coords: { x: -45, y: 0, z: 90 },
    size: { w: 28, l: 28, h: 10 },
    connections: ['S13', 'S24'],
    happiness: 85,
    backdrop: 'assets/backdrops/S14-reflection_pool.png',
    backdropSvg: 'backdrop_reflection_pool.svg',
    shader: 'flowing_river',
    light: { color: 0x38bdf8, intensity: 2.2, distance: 36, position: { x: -45, y: 8.0, z: 90 } },
    ambient: { color: 0xf59e0b, intensity: 0.8 },
    pbr: { roughness: 0.1, metalness: 0.3, normalScale: 1.0 }
  },
  {
    id: 'S15',
    slug: 'rose_maze',
    name: 'Topiary Rose Hedge Maze',
    floor: 'OUTDOOR',
    biome: 'outdoor',
    biomeColor: '#10b981',
    coords: { x: 45, y: 0, z: 90 },
    size: { w: 28, l: 28, h: 10 },
    connections: ['S13', 'S23'],
    happiness: 75,
    backdrop: 'assets/backdrops/S15-rose_maze.png',
    backdropSvg: 'backdrop_rose_maze.svg',
    shader: 'ivy_vein',
    light: { color: 0x10b981, intensity: 2.2, distance: 36, position: { x: 45, y: 8.0, z: 90 } },
    ambient: { color: 0x6ee7b7, intensity: 0.85 },
    pbr: { roughness: 0.6, metalness: 0.05, normalScale: 1.0 }
  },
  {
    id: 'S16',
    slug: 'gazebo',
    name: 'Starlight Pavilion Gazebo',
    floor: 'OUTDOOR',
    biome: 'outdoor',
    biomeColor: '#10b981',
    coords: { x: 0, y: 0, z: 135 },
    size: { w: 24, l: 24, h: 12 },
    connections: ['S13', 'S22'],
    happiness: 90,
    backdrop: 'assets/backdrops/S16-gazebo.png',
    backdropSvg: 'backdrop_gazebo.svg',
    shader: 'star_trail_sky',
    light: { color: 0xec4899, intensity: 2.2, distance: 36, position: { x: 0, y: 8.0, z: 135 } },
    ambient: { color: 0xf59e0b, intensity: 0.8 },
    pbr: { roughness: 0.25, metalness: 0.4, normalScale: 1.0 }
  },
  {
    id: 'S22',
    slug: 'village_district',
    name: 'Village District',
    floor: 'OUTDOOR',
    biome: 'outdoor',
    biomeColor: '#10b981',
    coords: { x: 0, y: 0, z: 180 },
    size: { w: 36, l: 36, h: 12 },
    connections: ['S16', 'S25', 'S26'],
    happiness: 70,
    backdrop: 'assets/backdrops/S22-village-district.png',
    backdropSvg: 'backdrop_village_district.svg',
    shader: 'flowing_river',
    light: { color: 0xf59e0b, intensity: 2.2, distance: 36, position: { x: 0, y: 8.0, z: 180 } },
    ambient: { color: 0xf59e0b, intensity: 0.8 },
    pbr: { roughness: 0.5, metalness: 0.1, normalScale: 1.0 },
    props: ['cobblestone_well', 'thatched_cottage_facade', 'village_lamp_post']
  },
  {
    id: 'S23',
    slug: 'sacred_forest_trail',
    name: 'Sacred Forest Trail',
    floor: 'OUTDOOR',
    biome: 'forest',
    biomeColor: '#065f46',
    coords: { x: 90, y: 0, z: 135 },
    size: { w: 32, l: 32, h: 14 },
    connections: ['S15', 'S25'],
    happiness: 65,
    backdrop: 'assets/backdrops/S23-sacred-forest-trail.png',
    backdropSvg: 'backdrop_sacred_forest_trail.svg',
    shader: 'ivy_vein',
    light: { color: 0x10b981, intensity: 2.2, distance: 36, position: { x: 90, y: 8.0, z: 135 } },
    ambient: { color: 0x064e3b, intensity: 0.8 },
    pbr: { roughness: 0.6, metalness: 0.05, normalScale: 1.0 },
    props: ['ancient_moss_stone', 'whispering_tree_trunk', 'forest_shrine']
  },
  {
    id: 'S24',
    slug: 'harbor_docks',
    name: 'Harbor Docks',
    floor: 'OUTDOOR',
    biome: 'maritime',
    biomeColor: '#0284c7',
    coords: { x: -90, y: 0, z: 135 },
    size: { w: 32, l: 32, h: 10 },
    connections: ['S14', 'S26'],
    happiness: 70,
    backdrop: 'assets/backdrops/S24-harbor-docks.png',
    backdropSvg: 'backdrop_harbor_docks.svg',
    shader: 'flowing_river',
    light: { color: 0x0284c7, intensity: 2.4, distance: 36, position: { x: -90, y: 8.0, z: 135 } },
    ambient: { color: 0x0284c7, intensity: 0.75 },
    pbr: { roughness: 0.3, metalness: 0.3, normalScale: 1.0 },
    props: ['wooden_mooring_post', 'nautical_anchor', 'cargo_barrel_stack']
  },
  {
    id: 'S25',
    slug: 'moonlit_meadow',
    name: 'Moonlit Meadow',
    floor: 'OUTDOOR',
    biome: 'outdoor',
    biomeColor: '#10b981',
    coords: { x: 45, y: 0, z: 180 },
    size: { w: 32, l: 32, h: 10 },
    connections: ['S22', 'S23'],
    happiness: 85,
    backdrop: 'assets/backdrops/S25-moonlit-meadow.png',
    backdropSvg: 'backdrop_moonlit_meadow.svg',
    shader: 'star_trail_sky',
    light: { color: 0x38bdf8, intensity: 2.2, distance: 36, position: { x: 45, y: 8.0, z: 180 } },
    ambient: { color: 0x1e1b4b, intensity: 0.75 },
    pbr: { roughness: 0.55, metalness: 0.05, normalScale: 1.0 },
    props: ['starlight_monolith', 'wildflower_patch', 'luminescent_cairn']
  },
  {
    id: 'S26',
    slug: 'crystal_grotto',
    name: 'Crystal Grotto',
    floor: 'OUTDOOR',
    biome: 'crystal',
    biomeColor: '#a78bfa',
    coords: { x: -45, y: 0, z: 180 },
    size: { w: 30, l: 30, h: 12 },
    connections: ['S22', 'S24'],
    happiness: 75,
    backdrop: 'assets/backdrops/S26-crystal-grotto.png',
    backdropSvg: 'backdrop_crystal_grotto.svg',
    shader: 'prismatic_refraction',
    light: { color: 0xa78bfa, intensity: 2.4, distance: 36, position: { x: -45, y: 8.0, z: 180 } },
    ambient: { color: 0x581c87, intensity: 0.7 },
    pbr: { roughness: 0.15, metalness: 0.7, normalScale: 1.0 },
    props: ['giant_amethyst_cluster', 'quartz_geode_stalagmite', 'bioluminescent_pond_rim']
  },

  // =========================================================================
  // 5F ASTRAL CELESTIAL SPIRE (S33 - S36)
  // =========================================================================
  {
    id: 'S33',
    slug: 'astral_spire_peak',
    name: 'Astral Spire Peak',
    floor: '5F',
    biome: 'kawaii',
    biomeColor: '#f472b6',
    coords: { x: 0, y: 48, z: 0 },
    size: { w: 26, l: 26, h: 14 },
    connections: ['S27', 'S34'],
    happiness: 95,
    backdrop: 'assets/backdrops/S33-astral-spire-peak.png',
    backdropSvg: 'backdrop_astral_spire_peak.svg',
    shader: 'celestial_aurora',
    light: { color: 0x38bdf8, intensity: 2.6, distance: 40, position: { x: 0, y: 54.0, z: 0 } },
    ambient: { color: 0x0f172a, intensity: 0.85 },
    pbr: { roughness: 0.2, metalness: 0.4, normalScale: 1.0 },
    props: ['astral_starlight_spire', 'celestial_telescope_dais', 'orbiting_luminescent_halo']
  },
  {
    id: 'S34',
    slug: 'starlight_sanctuary',
    name: 'Starlight Observatory Sanctuary',
    floor: '5F',
    biome: 'crystal',
    biomeColor: '#a78bfa',
    coords: { x: 45, y: 48, z: 0 },
    size: { w: 24, l: 24, h: 12 },
    connections: ['S33', 'S35'],
    happiness: 90,
    backdrop: 'assets/backdrops/S34-starlight-sanctuary.png',
    backdropSvg: 'backdrop_starlight_sanctuary.svg',
    shader: 'celestial_aurora',
    light: { color: 0xa78bfa, intensity: 2.5, distance: 38, position: { x: 45, y: 54.0, z: 0 } },
    ambient: { color: 0x2e1065, intensity: 0.8 },
    pbr: { roughness: 0.15, metalness: 0.6, normalScale: 1.0 },
    props: ['sanctuary_prism_altar', 'celestial_constellation_dome', 'floating_ether_globes']
  },
  {
    id: 'S35',
    slug: 'celestial_chamber',
    name: 'Celestial Grand Chamber',
    floor: '5F',
    biome: 'estate',
    biomeColor: '#22d3ee',
    coords: { x: 45, y: 48, z: -45 },
    size: { w: 28, l: 28, h: 12 },
    connections: ['S34', 'S36'],
    happiness: 85,
    backdrop: 'assets/backdrops/S35-celestial-chamber.png',
    backdropSvg: 'backdrop_celestial_chamber.svg',
    shader: 'iridescent_opal_velvet',
    light: { color: 0x22d3ee, intensity: 2.4, distance: 38, position: { x: 45, y: 54.0, z: -45 } },
    ambient: { color: 0x083344, intensity: 0.75 },
    pbr: { roughness: 0.25, metalness: 0.5, normalScale: 1.0 },
    props: ['opal_velvet_canopy', 'gilded_astral_throne', 'prismatic_crystal_chandelier']
  },
  {
    id: 'S36',
    slug: 'moonbeam_zenith',
    name: 'Moonbeam Clock Zenith',
    floor: '5F',
    biome: 'estate',
    biomeColor: '#22d3ee',
    coords: { x: -45, y: 48, z: 0 },
    size: { w: 22, l: 22, h: 16 },
    connections: ['S28', 'S35'],
    happiness: 80,
    backdrop: 'assets/backdrops/S36-moonbeam-zenith.png',
    backdropSvg: 'backdrop_moonbeam_zenith.svg',
    shader: 'iridescent_opal_velvet',
    light: { color: 0xf59e0b, intensity: 2.5, distance: 36, position: { x: -45, y: 54.0, z: 0 } },
    ambient: { color: 0x451a03, intensity: 0.75 },
    pbr: { roughness: 0.3, metalness: 0.7, normalScale: 1.0 },
    props: ['zenith_escapement_wheel', 'moonbeam_pendulum_shaft', 'clockwork_observation_balcony']
  },

  // =========================================================================
  // B3 ABYSSAL DEEP TRENCH (S37 - S40)
  // =========================================================================
  {
    id: 'S37',
    slug: 'abyssal_trench_gateway',
    name: 'Abyssal Trench Gateway',
    floor: 'B3',
    biome: 'subterranean',
    biomeColor: '#78350f',
    coords: { x: 0, y: -56, z: -45 },
    size: { w: 30, l: 30, h: 14 },
    connections: ['S30', 'S38'],
    happiness: 40,
    backdrop: 'assets/backdrops/S37-abyssal-trench-gateway.png',
    backdropSvg: 'backdrop_abyssal_trench_gateway.svg',
    shader: 'prismatic_water_caustics',
    light: { color: 0x0284c7, intensity: 2.5, distance: 38, position: { x: 0, y: -50.0, z: -45 } },
    ambient: { color: 0x082f49, intensity: 0.65 },
    pbr: { roughness: 0.35, metalness: 0.3, normalScale: 1.0 },
    props: ['trench_stone_arch', 'bioluminescent_vent_plume', 'ancient_diving_bell']
  },
  {
    id: 'S38',
    slug: 'coral_trench',
    name: 'Bioluminescent Coral Trench',
    floor: 'B3',
    biome: 'crystal',
    biomeColor: '#a78bfa',
    coords: { x: 45, y: -56, z: -45 },
    size: { w: 26, l: 26, h: 12 },
    connections: ['S37', 'S39'],
    happiness: 50,
    backdrop: 'assets/backdrops/S38-coral-trench.png',
    backdropSvg: 'backdrop_coral_trench.svg',
    shader: 'prismatic_water_caustics',
    light: { color: 0x38bdf8, intensity: 2.6, distance: 36, position: { x: 45, y: -50.0, z: -45 } },
    ambient: { color: 0x164e63, intensity: 0.7 },
    pbr: { roughness: 0.2, metalness: 0.5, normalScale: 1.0 },
    props: ['glowing_sugar_coral', 'trench_caustic_shelf', 'floating_bubble_spores']
  },
  {
    id: 'S39',
    slug: 'deep_alchemical_vault',
    name: 'Deep Alchemical Vault',
    floor: 'B3',
    biome: 'subterranean',
    biomeColor: '#78350f',
    coords: { x: 45, y: -56, z: 0 },
    size: { w: 24, l: 24, h: 10 },
    connections: ['S31', 'S38', 'S40'],
    happiness: 45,
    backdrop: 'assets/backdrops/S39-deep-alchemical-vault.png',
    backdropSvg: 'backdrop_deep_alchemical_vault.svg',
    shader: 'crystalline_subsurface',
    light: { color: 0x10b981, intensity: 2.4, distance: 36, position: { x: 45, y: -50.0, z: 0 } },
    ambient: { color: 0x064e3b, intensity: 0.7 },
    pbr: { roughness: 0.2, metalness: 0.6, normalScale: 1.0 },
    props: ['pressurized_alchemical_crucible', 'runed_retort_piping', 'subsurface_crystal_pedestal']
  },
  {
    id: 'S40',
    slug: 'ancient_core_crucible',
    name: 'Ancient Core Crucible',
    floor: 'B3',
    biome: 'gothic',
    biomeColor: '#7c3aed',
    coords: { x: -45, y: -56, z: -45 },
    size: { w: 28, l: 28, h: 14 },
    connections: ['S32', 'S39'],
    happiness: 40,
    backdrop: 'assets/backdrops/S40-ancient-core-crucible.png',
    backdropSvg: 'backdrop_ancient_core_crucible.svg',
    shader: 'crystalline_subsurface',
    light: { color: 0x7c3aed, intensity: 2.6, distance: 40, position: { x: -45, y: -50.0, z: -45 } },
    ambient: { color: 0x3b0764, intensity: 0.65 },
    pbr: { roughness: 0.3, metalness: 0.4, normalScale: 1.0 },
    props: ['primordial_joy_furnace', 'confectionery_steam_regulator', 'core_crucible_monolith']
  }
];

// Index registry by both ID and Slug on the dictionary and array
export const SECTORS_BY_ID = {};
export const SECTORS_BY_SLUG = {};

SECTOR_REGISTRY.forEach(sector => {
  SECTORS_BY_ID[sector.id] = sector;
  SECTORS_BY_SLUG[sector.slug] = sector;
  SECTOR_REGISTRY[sector.id] = sector;
  SECTOR_REGISTRY[sector.slug] = sector;
});

/**
 * Retrieve a sector definition by ID (e.g. 'S01') or slug (e.g. 'foyer').
 * Returns null if not found.
 */
export function getSector(idOrSlug) {
  if (!idOrSlug || typeof idOrSlug !== 'string') return null;
  const key = idOrSlug.trim();
  const upperKey = key.toUpperCase();
  const lowerKey = key.toLowerCase();

  if (SECTORS_BY_ID[upperKey]) return SECTORS_BY_ID[upperKey];
  if (SECTORS_BY_SLUG[lowerKey]) return SECTORS_BY_SLUG[lowerKey];
  if (SECTOR_REGISTRY[key]) return SECTOR_REGISTRY[key];
  if (SECTOR_REGISTRY[upperKey]) return SECTOR_REGISTRY[upperKey];
  if (SECTOR_REGISTRY[lowerKey]) return SECTOR_REGISTRY[lowerKey];

  return null;
}

/**
 * Retrieve all sectors on a given floor ('4F', '3F', '2F', '1F', 'B1', 'B2', 'OUTDOOR').
 * Returns an array of Sector objects (or empty array if none found).
 */
export function getFloorSectors(floor) {
  if (!floor || typeof floor !== 'string') return [];
  const normalizedFloor = floor.trim().toUpperCase();
  return SECTOR_REGISTRY.filter(s => s.floor && s.floor.toUpperCase() === normalizedFloor);
}

/**
 * Retrieve all neighboring sector objects connected to a given sector ID or slug.
 * Returns an array of Sector objects.
 */
export function getAdjacentSectors(idOrSlug) {
  const sector = getSector(idOrSlug);
  if (!sector || !Array.isArray(sector.connections)) return [];

  const adjacents = [];
  sector.connections.forEach(conn => {
    const adj = getSector(conn);
    if (adj) adjacents.push(adj);
  });
  return adjacents;
}

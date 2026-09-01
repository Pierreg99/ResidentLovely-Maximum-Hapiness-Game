// =========================================================================
// RESIDENT LOVELY - ENDLESS ROGUELIKE ENGINE (v6.0)
// Standard: NEXUS PRIVÉ v6.0 | Strict Zero-Emoji Protocol
// =========================================================================

import { SECTOR_REGISTRY } from '../world/sectors.js';

export const EndlessDimension = {
  depth: 0,
  active: false,
  baseSectors: [],
  currentSectors: [],
  score: 0,
  activeModifiers: [],
  currentFloor: null,

  BIOMES: ['estate', 'gothic', 'kawaii', 'subterranean', 'crystal', 'astronomical', 'clockwork'],
  SHADERS: ['infinite_mirror', 'bioluminescent_floor', 'prismatic_crystal', 'ice_crack_floor', 'clockwork_gears', 'star_trail_sky'],
  MODIFIERS: [
    { id: 'JOY_SURGE', name: 'Joy Surge', description: '+30% Vitality recovery on crafting', multiplier: 1.3 },
    { id: 'SPARKLE_HASTE', name: 'Sparkle Haste', description: '+20% Agent Joy movement speed', multiplier: 1.2 },
    { id: 'BALLOON_BOUNTY', name: 'Balloon Bounty', description: 'Extra confetti and ground items', multiplier: 1.5 },
    { id: 'PRISMATIC_AURA', name: 'Prismatic Aura', description: 'Grumps pacified in a wider radius', multiplier: 1.4 },
    { id: 'GRUMP_SWARM', name: 'Grump Swarm', description: 'Higher enemy density with double joy reward', multiplier: 2.0 }
  ],
  REWARDS: ['herb_green', 'powder_red', 'ribbon_gold', 'bliss_cupcake', 'ultra_joy_elixir'],

  init() {
    this.baseSectors = [...SECTOR_REGISTRY];
    this.active = false;
    this.depth = 0;
    this.score = 0;
    this.activeModifiers = [];
  },

  enterPortal() {
    this.active = true;
    this.depth = 0;
    this.score = 0;
    this.activeModifiers = [];
    return this.generateNextFloor();
  },

  generateNextFloor() {
    this.depth++;
    const biomeIndex = (this.depth - 1) % this.BIOMES.length;
    const selectedBiome = this.BIOMES[biomeIndex];
    const shaderIndex = (this.depth - 1) % this.SHADERS.length;
    const selectedShader = this.SHADERS[shaderIndex];

    // Pick 1-2 procedural modifiers
    const modCount = Math.min(3, 1 + Math.floor(this.depth / 3));
    const shuffledMods = [...this.MODIFIERS].sort(() => 0.5 - Math.random());
    this.activeModifiers = shuffledMods.slice(0, modCount);

    const grumpCount = 3 + Math.floor(this.depth * 1.5);
    const rewardItem = this.REWARDS[Math.floor(Math.random() * this.REWARDS.length)];

    const newSector = {
      id: `ENDLESS_D${this.depth}`,
      slug: `endless_dimension_f${this.depth}`,
      name: `Endless Dimension Floor ${this.depth}`,
      floor: `B${Math.min(99, 2 + this.depth)}`,
      biome: selectedBiome,
      coords: { x: 0, y: -45 - (this.depth * 12), z: 0 },
      size: { w: 32 + Math.min(16, this.depth * 2), l: 32 + Math.min(16, this.depth * 2), h: 14 },
      connections: this.depth > 1 ? [`ENDLESS_D${this.depth - 1}`] : ['S32'],
      happiness: Math.max(10, 50 - (this.depth * 2)),
      backdrop: 'assets/backdrops/S18-crypt.png',
      shader: selectedShader,
      light: {
        color: this.depth % 2 === 0 ? 0x9333ea : 0x22d3ee,
        intensity: 2.5,
        distance: 45,
        position: { x: 0, y: 7.0, z: 0 }
      },
      props: ['floating_prismatic_shard', 'runed_altar_slab', 'gilded_treasure_chest'],
      grumpCount,
      rewardItem,
      depth: this.depth,
      modifiers: this.activeModifiers
    };

    this.currentFloor = newSector;
    this.currentSectors.push(newSector);
    return newSector;
  },

  completeFloor(joyPoints = 100) {
    if (!this.active) return null;
    const bonus = this.activeModifiers.reduce((acc, m) => acc * m.multiplier, 1.0);
    const earned = Math.round(joyPoints * bonus * (1 + this.depth * 0.2));
    this.score += earned;
    return {
      depth: this.depth,
      earnedScore: earned,
      totalScore: this.score,
      nextFloor: this.generateNextFloor()
    };
  },

  getFloorSummary() {
    if (!this.active || !this.currentFloor) return null;
    return {
      depth: this.depth,
      score: this.score,
      floorName: this.currentFloor.name,
      biome: this.currentFloor.biome,
      modifiers: this.activeModifiers.map(m => m.name),
      grumpCount: this.currentFloor.grumpCount,
      rewardItem: this.currentFloor.rewardItem
    };
  },

  exitPortal() {
    const finalStats = {
      depthReached: this.depth,
      finalScore: this.score
    };
    this.active = false;
    this.currentFloor = null;
    return finalStats;
  }
};

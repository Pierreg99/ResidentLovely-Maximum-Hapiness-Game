// =========================================================================
// RESIDENT LOVELY - HOLOGRAPHIC BLUEPRINT MAP SYSTEM v2.0
// Standard: NEXUS PRIVE v6.0 | Strict Zero-Emoji Protocol | Native ESM
// =========================================================================

import { audio } from '../engine/audio.js';
import {
  SECTOR_REGISTRY,
  BIOME_COLORS,
  BIOME_NAMES,
  FLOOR_ORDER,
  getSector,
  getFloorSectors,
  getAdjacentSectors
} from '../world/sectors.js';

export const FLOOR_METADATA = {
  '4F': { label: '4F (ROOFTOP)', subtitle: 'MOONLIT ROOFTOP & BELFRY' },
  '3F': { label: '3F (CATHEDRAL)', subtitle: 'CRYSTAL CATHEDRAL & MIRROR MAZE' },
  '2F': { label: '2F (MEZZANINE)', subtitle: 'OBSERVATORY, SUITES & BALLROOM' },
  '1F': { label: '1F (GROUND)', subtitle: 'ESTATE WINGS, FOYER & SALONS' },
  'B1': { label: 'B1 (LABORATORY)', subtitle: 'SUBTERRANEAN SUGAR LAB' },
  'B2': { label: 'B2 (SUBTERRANEAN)', subtitle: 'CRYPT, UNDERGROUND RIVER & VAULT' },
  'OUTDOOR': { label: 'OUTDOOR (GROUNDS)', subtitle: 'VILLAGE, DOCKS, FOREST & MEADOW' }
};

export const FLOOR_LAYOUTS = {
  '1F': {
    positions: {
      S21: { x: 145, y: 110, w: 120, h: 80 },
      S19: { x: 145, y: 250, w: 120, h: 80 },
      S20: { x: 145, y: 390, w: 120, h: 80 },
      S03: { x: 315, y: 250, w: 120, h: 80 },
      S06: { x: 315, y: 390, w: 120, h: 80 },
      S01: { x: 485, y: 250, w: 130, h: 100 },
      S04: { x: 485, y: 390, w: 120, h: 80 },
      S07: { x: 655, y: 110, w: 120, h: 80 },
      S02: { x: 655, y: 250, w: 120, h: 80 },
      S05: { x: 655, y: 390, w: 120, h: 80 }
    }
  },
  '2F': {
    positions: {
      S09: { x: 200, y: 250, w: 130, h: 85 },
      S08: { x: 600, y: 250, w: 130, h: 85 },
      S11: { x: 400, y: 110, w: 130, h: 85 },
      S10: { x: 400, y: 390, w: 130, h: 85 }
    }
  },
  '3F': {
    positions: {
      S12: { x: 320, y: 250, w: 150, h: 100 },
      S29: { x: 530, y: 250, w: 140, h: 90 }
    }
  },
  '4F': {
    positions: {
      S28: { x: 290, y: 250, w: 140, h: 90 },
      S27: { x: 510, y: 250, w: 150, h: 100 }
    }
  },
  'B1': {
    positions: {
      S17: { x: 400, y: 250, w: 280, h: 180 }
    }
  },
  'B2': {
    positions: {
      S18: { x: 400, y: 115, w: 140, h: 85 },
      S30: { x: 400, y: 260, w: 150, h: 90 },
      S32: { x: 210, y: 385, w: 135, h: 85 },
      S31: { x: 590, y: 385, w: 135, h: 85 }
    }
  },
  'OUTDOOR': {
    positions: {
      S14: { x: 265, y: 110, w: 110, h: 75 },
      S13: { x: 400, y: 110, w: 110, h: 75 },
      S15: { x: 535, y: 110, w: 110, h: 75 },
      S24: { x: 130, y: 250, w: 110, h: 75 },
      S16: { x: 400, y: 250, w: 110, h: 75 },
      S23: { x: 670, y: 250, w: 110, h: 75 },
      S26: { x: 265, y: 390, w: 110, h: 75 },
      S22: { x: 400, y: 390, w: 110, h: 75 },
      S25: { x: 535, y: 390, w: 110, h: 75 }
    }
  }
};

/**
 * Calculates 2D SVG canvas position for a given sector on a given floor.
 * Uses layout tables with fallback to dynamic 3D coordinate projection.
 */
export function calculateSectorPosition(sector, floor) {
  const normFloor = floor ? floor.trim().toUpperCase() : '1F';
  const custom = FLOOR_LAYOUTS[normFloor]?.positions?.[sector.id] ||
                 FLOOR_LAYOUTS[normFloor]?.positions?.[sector.slug];
  if (custom) return { ...custom };

  const floorSectors = getFloorSectors(normFloor);
  if (floorSectors.length <= 1) {
    return { x: 400, y: 250, w: 200, h: 120 };
  }

  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  floorSectors.forEach(s => {
    const cx = s.coords?.x ?? 0;
    const cz = s.coords?.z ?? 0;
    if (cx < minX) minX = cx;
    if (cx > maxX) maxX = cx;
    if (cz < minZ) minZ = cz;
    if (cz > maxZ) maxZ = cz;
  });

  const spanX = maxX - minX || 1;
  const spanZ = maxZ - minZ || 1;
  const centerX = (minX + maxX) / 2;
  const centerZ = (minZ + maxZ) / 2;

  const scaleX = Math.min(3.8, Math.max(1.8, 540 / spanX));
  const scaleY = Math.min(3.8, Math.max(1.8, 320 / spanZ));
  const scale = Math.min(scaleX, scaleY);

  const cx = sector.coords?.x ?? 0;
  const cz = sector.coords?.z ?? 0;
  const x = Math.round(400 + (cx - centerX) * scale);
  const y = Math.round(250 + (cz - centerZ) * scale);

  return { x, y, w: 120, h: 80 };
}

/**
 * Computes all connecting paths between adjacent sectors on the specified floor.
 */
export function generateConnectionPaths(floor) {
  const normFloor = floor ? floor.trim().toUpperCase() : '1F';
  const floorSectors = getFloorSectors(normFloor);
  const floorSectorIds = new Set(floorSectors.map(s => s.id));
  const renderedPairs = new Set();
  const paths = [];

  floorSectors.forEach(sector => {
    const posA = calculateSectorPosition(sector, normFloor);
    if (!Array.isArray(sector.connections)) return;

    sector.connections.forEach(targetIdOrSlug => {
      const target = getSector(targetIdOrSlug);
      if (!target || !floorSectorIds.has(target.id)) return;

      const pairKey = [sector.id, target.id].sort().join('-');
      if (renderedPairs.has(pairKey)) return;
      renderedPairs.add(pairKey);

      const posB = calculateSectorPosition(target, normFloor);
      paths.push({
        from: sector.id,
        to: target.id,
        x1: posA.x,
        y1: posA.y,
        x2: posB.x,
        y2: posB.y,
        biomeColor: sector.biomeColor || BIOME_COLORS[sector.biome] || '#22d3ee'
      });
    });
  });

  return paths;
}

export function getHappinessColor(happiness) {
  if (happiness >= 80) return '#10b981';
  if (happiness >= 50) return '#f59e0b';
  return '#22d3ee';
}

function truncateName(name, maxLen = 18) {
  if (!name || name.length <= maxLen) return name;
  return name.slice(0, maxLen - 1) + '…';
}

/**
 * Generates dynamic SVG markup string for Blueprint Map v2 for the given floor.
 * 100% derived from SECTOR_REGISTRY.
 */
export function generateBlueprintSvg(floor, selectedSectorId = null, playerSector = null, playerPos = null, playerRot = 0) {
  const normalizedFloor = floor ? floor.trim().toUpperCase() : '1F';
  const sectors = getFloorSectors(normalizedFloor);
  const connectionPaths = generateConnectionPaths(normalizedFloor);

  let svg = `<svg id="estate-blueprint-svg" viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(34, 211, 238, 0.08)" stroke-width="1"/>
    </pattern>
    <filter id="cyan-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#grid-pattern)" />`;

  // Connection Paths Group
  svg += `\n  <g id="blueprint-connections" class="blueprint-connections-group">`;
  connectionPaths.forEach(conn => {
    svg += `\n    <line class="blueprint-connection-path" x1="${conn.x1}" y1="${conn.y1}" x2="${conn.x2}" y2="${conn.y2}" stroke="${conn.biomeColor}" stroke-width="2.5" stroke-dasharray="6,4" stroke-opacity="0.7"/>`;
  });
  svg += `\n  </g>`;

  // Sectors Group
  svg += `\n  <g id="blueprint-sectors" class="blueprint-sectors-group">`;
  sectors.forEach(sector => {
    const pos = calculateSectorPosition(sector, normalizedFloor);
    const isSelected = selectedSectorId && (selectedSectorId === sector.id || selectedSectorId === sector.slug);
    const biomeColor = sector.biomeColor || BIOME_COLORS[sector.biome] || '#22d3ee';
    const strokeWidth = isSelected ? 3 : 2;
    const strokeColor = isSelected ? '#f59e0b' : biomeColor;
    const rx = pos.x - pos.w / 2;
    const ry = pos.y - pos.h / 2;

    const otherFloorConns = (sector.connections || [])
      .map(cid => getSector(cid))
      .filter(s => s && s.floor !== sector.floor);
    const floorBadgeText = otherFloorConns.length > 0 ? `➔ ${otherFloorConns.map(s => s.floor).join('/')}` : '';

    svg += `\n    <g id="map-room-${sector.slug}" class="room-blueprint-node${isSelected ? ' selected' : ''}" data-sector-id="${sector.id}" data-sector-slug="${sector.slug}" tabindex="0">
      <rect x="${rx}" y="${ry}" width="${pos.w}" height="${pos.h}" rx="8" fill="${biomeColor}15" stroke="${strokeColor}" stroke-width="${strokeWidth}" />
      <rect x="${rx}" y="${ry}" width="${pos.w}" height="18" rx="6" fill="${biomeColor}35" />
      <text x="${rx + 6}" y="${ry + 13}" fill="${biomeColor}" font-family="monospace" font-size="8.5" font-weight="bold">${sector.id} · ${sector.floor}</text>
      <text x="${rx + pos.w - 6}" y="${ry + 13}" fill="#94a3b8" font-family="monospace" font-size="7.5" text-anchor="end">${sector.biome.toUpperCase()}</text>
      <text x="${pos.x}" y="${pos.y + 2}" fill="#f8fafc" font-family="monospace" font-size="9" font-weight="bold" text-anchor="middle">${truncateName(sector.name, 18)}</text>
      <text x="${pos.x}" y="${pos.y + 17}" fill="${getHappinessColor(sector.happiness)}" font-family="monospace" font-size="8" text-anchor="middle">★ ${sector.happiness}% BLISS</text>
      ${floorBadgeText ? `<text x="${pos.x}" y="${pos.y + 28}" fill="#f59e0b" font-family="monospace" font-size="7" text-anchor="middle">${floorBadgeText}</text>` : ''}
    </g>`;
  });
  svg += `\n  </g>`;

  // Player Beacon Group
  let beaconVisible = false;
  let beaconX = 400;
  let beaconY = 250;
  if (playerSector && playerSector.floor === normalizedFloor) {
    beaconVisible = true;
    const basePos = calculateSectorPosition(playerSector, normalizedFloor);
    if (playerPos && playerSector.size) {
      const halfW = (playerSector.size.w || 26) / 2;
      const halfL = (playerSector.size.l || 26) / 2;
      const dx = ((playerPos.x - playerSector.coords.x) / halfW) * (basePos.w / 2 - 12);
      const dz = ((playerPos.z - playerSector.coords.z) / halfL) * (basePos.h / 2 - 12);
      beaconX = Math.round(basePos.x + Math.max(-basePos.w / 2 + 10, Math.min(basePos.w / 2 - 10, dx)));
      beaconY = Math.round(basePos.y + Math.max(-basePos.h / 2 + 10, Math.min(basePos.h / 2 - 10, dz)));
    } else {
      beaconX = basePos.x;
      beaconY = basePos.y;
    }
  }

  const rotDeg = Math.round((playerRot * 180) / Math.PI);

  svg += `\n  <g id="map-player-beacon" transform="translate(${beaconX}, ${beaconY})" style="display: ${beaconVisible ? 'inline' : 'none'};">
    <circle class="beacon-pulse" cx="0" cy="0" r="14" fill="none" stroke="#22d3ee" stroke-width="2"/>
    <circle cx="0" cy="0" r="7" fill="#22d3ee" stroke="#ffffff" stroke-width="1.5"/>
    <g class="beacon-compass" transform="rotate(${rotDeg})">
      <polygon points="0,-12 4,-4 -4,-4" fill="#22d3ee"/>
    </g>
  </g>
</svg>`;

  return svg;
}

export class MinimapSystem {
  constructor(gameState) {
    this.gameState = gameState;
    this.canvas = typeof document !== 'undefined' ? document.getElementById('minimap-canvas') : null;
    this.ctx = (this.canvas && typeof this.canvas.getContext === 'function') ? this.canvas.getContext('2d') : null;
    this.mapModal = typeof document !== 'undefined' ? document.getElementById('map-modal') : null;
    this.activeFloor = '1F';
    this.selectedSector = null;

    if (typeof document !== 'undefined') {
      const closeBtn = document.getElementById('map-close-btn');
      if (closeBtn) closeBtn.addEventListener('click', () => this.toggleFullMap());

      this.initFloorTabs();
      this.initSidebar();
      this.renderBlueprintSvg();
    }
  }

  initFloorTabs() {
    if (typeof document === 'undefined') return;
    const container = document.querySelector('.floor-tabs');
    if (!container) return;

    const existingBtns = container.querySelectorAll('.floor-tab-btn');
    const needsRebuild = existingBtns.length !== FLOOR_ORDER.length;

    if (needsRebuild) {
      container.innerHTML = '';
      FLOOR_ORDER.forEach(floorId => {
        const meta = FLOOR_METADATA[floorId] || { label: floorId };
        const btn = document.createElement('button');
        btn.className = `floor-tab-btn${floorId === this.activeFloor ? ' active' : ''}`;
        btn.id = `btn-floor-${floorId.toLowerCase()}`;
        btn.setAttribute('data-floor', floorId);
        btn.textContent = meta.label;
        btn.addEventListener('click', () => {
          if (typeof audio !== 'undefined' && audio.playPop) audio.playPop();
          this.switchFloor(floorId);
        });
        container.appendChild(btn);
      });
    } else {
      FLOOR_ORDER.forEach(floorId => {
        const btn = document.getElementById(`btn-floor-${floorId.toLowerCase()}`) ||
                    document.getElementById(`btn-floor-${floorId}`);
        if (btn) {
          btn.setAttribute('data-floor', floorId);
          btn.addEventListener('click', () => {
            if (typeof audio !== 'undefined' && audio.playPop) audio.playPop();
            this.switchFloor(floorId);
          });
        }
      });
    }
  }

  initSidebar() {
    if (typeof document === 'undefined') return;
    const sidebar = document.querySelector('.map-sidebar');
    if (!sidebar) return;

    let travelBtn = document.getElementById('btn-map-travel');
    if (!travelBtn) {
      const telBox = sidebar.querySelector('.telemetry-box');
      if (telBox) {
        travelBtn = document.createElement('button');
        travelBtn.id = 'btn-map-travel';
        travelBtn.className = 'btn-map-travel';
        travelBtn.textContent = '➔ DEPLOY BEACON / FAST TRAVEL';
        travelBtn.addEventListener('click', () => {
          if (this.selectedSector) {
            this.fastTravel(this.selectedSector);
          }
        });
        telBox.appendChild(travelBtn);
      }
    }
  }

  switchFloor(floor) {
    const normalizedFloor = floor ? floor.trim().toUpperCase() : '1F';
    this.activeFloor = normalizedFloor;

    if (typeof document !== 'undefined') {
      FLOOR_ORDER.forEach(f => {
        const btn = document.getElementById(`btn-floor-${f.toLowerCase()}`) ||
                    document.getElementById(`btn-floor-${f}`);
        if (btn) {
          btn.classList.toggle('active', f === normalizedFloor);
        }
      });

      const allFloorBtns = document.querySelectorAll('.floor-tab-btn');
      allFloorBtns.forEach(btn => {
        const dataFloor = btn.getAttribute('data-floor');
        if (dataFloor) {
          btn.classList.toggle('active', dataFloor.toUpperCase() === normalizedFloor);
        }
      });

      this.renderBlueprintSvg();
      this.updateFullMapUI();
    }
  }

  renderBlueprintSvg() {
    if (typeof document === 'undefined') return;
    const viewport = document.querySelector('.blueprint-viewport');
    if (!viewport) return;

    if (!viewport.querySelector('.blueprint-crt-overlay')) {
      const crtOverlay = document.createElement('div');
      crtOverlay.className = 'blueprint-crt-overlay';
      viewport.appendChild(crtOverlay);
    }

    const curSector = getSector(this.gameState?.room);
    const pPos = (typeof window !== 'undefined' && window.__playerPos) ? window.__playerPos : null;
    const pRot = (typeof window !== 'undefined' && typeof window.__playerRot === 'number') ? window.__playerRot : 0;

    const svgMarkup = generateBlueprintSvg(
      this.activeFloor,
      this.selectedSector?.id || this.selectedSector?.slug,
      curSector,
      pPos,
      pRot
    );

    const existingSvg = document.getElementById('estate-blueprint-svg');
    if (existingSvg) {
      existingSvg.outerHTML = svgMarkup;
    } else {
      viewport.insertAdjacentHTML('afterbegin', svgMarkup);
    }

    this.attachSectorClickHandlers();
  }

  attachSectorClickHandlers() {
    if (typeof document === 'undefined') return;
    const nodes = document.querySelectorAll('.room-blueprint-node');
    nodes.forEach(el => {
      el.addEventListener('click', () => {
        const sectorId = el.getAttribute('data-sector-id');
        const sectorSlug = el.getAttribute('data-sector-slug');
        this.inspectSector(sectorId || sectorSlug);
      });
    });
  }

  inspectSector(roomOrId) {
    if (typeof audio !== 'undefined' && audio.playPop) audio.playPop();
    const sector = getSector(roomOrId);
    if (!sector) return;

    this.selectedSector = sector;

    if (typeof document !== 'undefined') {
      const title = document.getElementById('tel-room-title');
      const joy = document.getElementById('tel-joy-percent');
      const quest = document.getElementById('tel-quest-state');
      const grump = document.getElementById('tel-grump-count');

      if (title) title.textContent = `❖ ${sector.name.toUpperCase()} (${sector.floor})`;

      let joyVal = `${sector.happiness}% BLISS`;
      let questVal = 'Chamber Investigation';
      let grumpVal = '1 Plushie Grump';

      if (sector.id === 'S01' || sector.slug === 'foyer') {
        joyVal = this.gameState?.pianoSolved ? '100% BLISS' : '75% BLISS';
        questVal = this.gameState?.pianoSolved ? 'Sonatina Solved ✔' : 'Harmonic Triad (C-E-G)';
        grumpVal = '2 Plushie Grumps';
      } else if (sector.id === 'S02' || sector.slug === 'library') {
        joyVal = this.gameState?.cauldronFed ? '100% BLISS' : '50% BLISS';
        questVal = this.gameState?.cauldronFed ? 'Cauldron Radiating ✔' : 'Mega Bliss Cupcake Brew';
        grumpVal = '2 Plushie Grumps';
      } else if (sector.id === 'S03' || sector.slug === 'garden') {
        joyVal = this.gameState?.unlockedDoors?.garden ? '90% BLISS' : '40% BLISS';
        questVal = this.gameState?.unlockedDoors?.garden ? 'Solarium Unlocked ✔' : '4 Heart Lantern Ignition';
        grumpVal = '1 Plush Knight';
      } else if (sector.id === 'S04' || sector.slug === 'greenhouse') {
        joyVal = '85% BLISS';
        questVal = 'Prismatic Sugar Cultivation';
        grumpVal = '1 Plushie Bear';
      } else if (sector.id === 'S05' || sector.slug === 'dining') {
        joyVal = '90% BLISS';
        questVal = 'Grand Banquet Table Inspection';
        grumpVal = '1 Hungry Bear';
      } else if (sector.id === 'S06' || sector.slug === 'gallery') {
        joyVal = '95% BLISS';
        questVal = 'Stained Glass Sconce Tour';
        grumpVal = '1 Art Critic Grump';
      } else if (sector.id === 'S07' || sector.slug === 'bakery') {
        joyVal = '80% BLISS';
        questVal = 'Royal Bakery Oven Operation';
        grumpVal = '1 Chef Grump';
      } else if (sector.id === 'S08' || sector.slug === 'observatory') {
        joyVal = this.gameState?.astrolabeSolved ? '100% BLISS' : '60% BLISS';
        questVal = this.gameState?.astrolabeSolved ? 'Astrolabe Aligned ✔' : 'Insert Star Sapphire Gem';
        grumpVal = '1 Stargazer Specter';
      } else if (sector.id === 'S09' || sector.slug === 'clocktower') {
        joyVal = this.gameState?.clockSolved ? '100% BLISS' : '65% BLISS';
        questVal = this.gameState?.clockSolved ? 'Royal Crest Retrieved ✔' : 'Grand Clock Escapement';
        grumpVal = '1 Clockwork Knight';
      } else if (sector.id === 'S10' || sector.slug === 'mastersuite') {
        joyVal = '100% BLISS';
        questVal = 'Royal Velvet Rest & Solarium Terrace';
        grumpVal = '1 Slumbering Plushie';
      } else if (sector.id === 'S11' || sector.slug === 'ballroom') {
        joyVal = '100% BLISS';
        questVal = 'Starlight Disco Chandelier Dance';
        grumpVal = '2 Waltz Dancers';
      } else if (sector.id === 'S12' || sector.slug === 'cathedral') {
        joyVal = '85% BLISS';
        questVal = 'Crystal Cathedral Pipe Organ Tuning';
        grumpVal = '1 Cathedral Chorister';
      } else if (sector.id === 'S13' || sector.slug === 'gatehouse') {
        joyVal = '80% BLISS';
        questVal = 'Sunset Carriage Gate Inspection';
        grumpVal = '1 Gatekeeper Grump';
      } else if (sector.id === 'S14' || sector.slug === 'reflection_pool') {
        joyVal = '85% BLISS';
        questVal = 'Grand Reflection Caustic Calming';
        grumpVal = '1 Water Sprite Grump';
      } else if (sector.id === 'S15' || sector.slug === 'rose_maze') {
        joyVal = '75% BLISS';
        questVal = 'Topiary Hedge Maze Navigation';
        grumpVal = '2 Maze Wanderers';
      } else if (sector.id === 'S16' || sector.slug === 'gazebo') {
        joyVal = '90% BLISS';
        questVal = 'Starlight Pavilion Meditation';
        grumpVal = '1 Starlight Guardian';
      } else if (sector.id === 'S17' || sector.slug === 'lab') {
        joyVal = this.gameState?.dynamoActive ? '100% BLISS' : '45% BLISS';
        questVal = this.gameState?.dynamoActive ? 'Joy Dynamo Online ✔' : 'Insert Dynamo Core';
        grumpVal = '2 Chemist Grumps';
      } else if (sector.id === 'S18' || sector.slug === 'crypt') {
        joyVal = '30% BLISS (BOSS ARENA)';
        questVal = '★ UPLIFT GRAND GLOOM BEHEMOTH ★';
        grumpVal = '★ BOSS: GLOOM BEHEMOTH ★';
      } else if (sector.id === 'S19' || sector.slug === 'conservatory') {
        joyVal = '40% BLISS';
        questVal = 'Haunted Topiary Pruning';
        grumpVal = '2 Ghostly Specters';
      } else if (sector.id === 'S20' || sector.slug === 'tea_salon') {
        joyVal = '70% BLISS';
        questVal = 'Sakura Rose Tea Ceremony';
        grumpVal = '1 Tea Master Bear';
      } else if (sector.id === 'S21' || sector.slug === 'music_parlor') {
        joyVal = '65% BLISS';
        questVal = 'Harpsichord Harmonic Resonation';
        grumpVal = '1 Maestro Grump';
      } else if (sector.id === 'S22' || sector.slug === 'village_district') {
        joyVal = '70% BLISS';
        questVal = 'Village Cobblestone Restoration';
        grumpVal = '2 Village Townsfolk Grumps';
      } else if (sector.id === 'S23' || sector.slug === 'sacred_forest_trail') {
        joyVal = '65% BLISS';
        questVal = 'Sacred Forest Spore Cleansing';
        grumpVal = '2 Forest Sprites';
      } else if (sector.id === 'S24' || sector.slug === 'harbor_docks') {
        joyVal = '70% BLISS';
        questVal = 'Harbor Docks Mooring Alignment';
        grumpVal = '1 Sailor Grump';
      } else if (sector.id === 'S25' || sector.slug === 'moonlit_meadow') {
        joyVal = '85% BLISS';
        questVal = 'Moonlit Meadow Starlight Absorption';
        grumpVal = '2 Meadow Fairies';
      } else if (sector.id === 'S26' || sector.slug === 'crystal_grotto') {
        joyVal = '75% BLISS';
        questVal = 'Crystal Grotto Geode Awakening';
        grumpVal = '2 Crystal Golems';
      } else if (sector.id === 'S27' || sector.slug === 'moonlit_rooftop') {
        joyVal = '90% BLISS';
        questVal = 'Moonlit Astral Telescope Alignment';
        grumpVal = '1 Sky Watcher Grump';
      } else if (sector.id === 'S28' || sector.slug === 'clock_tower_belfry') {
        joyVal = '60% BLISS';
        questVal = 'Belfry Bronze Chime Resonance';
        grumpVal = '1 Belfry Phantom';
      } else if (sector.id === 'S29' || sector.slug === 'mirror_maze_gallery') {
        joyVal = '55% BLISS';
        questVal = 'Prismatic Mirror Reflection Alignment';
        grumpVal = '2 Mirror Doppelgangers';
      } else if (sector.id === 'S30' || sector.slug === 'underground_river_cavern') {
        joyVal = '35% BLISS';
        questVal = 'Underground River Cavern Navigation';
        grumpVal = '2 Cavern Lurkers';
      } else if (sector.id === 'S31' || sector.slug === 'crystal_vault') {
        joyVal = '50% BLISS';
        questVal = 'Crystal Vault Treasure Unlocking';
        grumpVal = '1 Vault Keeper Grump';
      } else if (sector.id === 'S32' || sector.slug === 'ancient_ruins') {
        joyVal = '35% BLISS';
        questVal = 'Ancient Altar Rune Activation';
        grumpVal = '2 Ruin Sentinels';
      }

      if (joy) {
        joy.textContent = joyVal;
        joy.style.color = getHappinessColor(sector.happiness);
      }
      if (quest) quest.textContent = questVal;
      if (grump) grump.textContent = grumpVal;

      const camBadge = document.querySelector('.cam-feed-badge');
      const camLabel = document.querySelector('.cam-feed-label');
      if (camBadge) camBadge.textContent = `CAM ${sector.id} • LIVE`;
      if (camLabel) {
        camLabel.innerHTML = `[OPTICAL: ${sector.name.toUpperCase()}]<br><span style="font-size:8px;color:var(--cyan-glow);">${sector.biomeName?.toUpperCase() || sector.biome?.toUpperCase()} • NOMINAL</span>`;
      }

      // Highlight active node in SVG
      document.querySelectorAll('.room-blueprint-node').forEach(node => {
        const isMatch = node.getAttribute('data-sector-id') === sector.id;
        node.classList.toggle('selected', isMatch);
        const mainRect = node.querySelector('rect');
        if (mainRect) {
          mainRect.setAttribute('stroke', isMatch ? '#f59e0b' : (sector.biomeColor || '#22d3ee'));
          mainRect.setAttribute('stroke-width', isMatch ? '3' : '2');
        }
      });
    }
  }

  fastTravel(sectorOrId) {
    const sector = getSector(typeof sectorOrId === 'string' ? sectorOrId : sectorOrId?.id);
    if (!sector) return;

    if (typeof audio !== 'undefined' && audio.playDoorChime) {
      audio.playDoorChime();
    } else if (typeof audio !== 'undefined' && audio.playPop) {
      audio.playPop();
    }

    if (typeof window !== 'undefined' && typeof window.__changeRoom === 'function') {
      const targetPos = (typeof THREE !== 'undefined' && THREE.Vector3)
        ? new THREE.Vector3(sector.coords.x, sector.coords.y, sector.coords.z)
        : sector.coords;
      window.__changeRoom(sector.slug || sector.id, targetPos);
    } else if (typeof this.onFastTravel === 'function') {
      this.onFastTravel(sector);
    } else if (this.gameState) {
      this.gameState.room = sector.slug || sector.id;
      if (typeof window !== 'undefined' && window.__playerPos) {
        window.__playerPos.x = sector.coords.x;
        window.__playerPos.y = sector.coords.y;
        window.__playerPos.z = sector.coords.z;
      }
    }

    if (this.mapModal && this.mapModal.style.display === 'flex') {
      this.toggleFullMap();
    }
  }

  toggleFullMap() {
    if (typeof audio !== 'undefined' && audio.playPop) audio.playPop();
    if (!this.mapModal) return;

    const isOpen = this.mapModal.style.display === 'flex';
    this.mapModal.style.display = isOpen ? 'none' : 'flex';

    if (!isOpen) {
      const curSector = getSector(this.gameState?.room);
      if (curSector && curSector.floor) {
        this.switchFloor(curSector.floor);
      } else {
        this.switchFloor('1F');
      }
      this.inspectSector(this.gameState?.room || 'S01');
      this.updateFullMapUI();
    }
  }

  updateFullMapUI() {
    if (typeof document === 'undefined') return;

    if (this.gameState?.unlockedDoors) {
      const dLibRect = document.getElementById('map-door-library-rect');
      const dLibTxt = document.getElementById('map-door-library-text');
      if (this.gameState.unlockedDoors.library) {
        if (dLibRect) dLibRect.setAttribute('fill', '#10b981');
        if (dLibTxt) dLibTxt.textContent = 'OPEN';
      }

      const dGardenRect = document.getElementById('map-door-garden-rect');
      const dGardenTxt = document.getElementById('map-door-garden-text');
      if (this.gameState.unlockedDoors.garden) {
        if (dGardenRect) dGardenRect.setAttribute('fill', '#10b981');
        if (dGardenTxt) dGardenTxt.textContent = 'OPEN';
      }
    }

    const curSector = getSector(this.gameState?.room);
    const beacon = document.getElementById('map-player-beacon');
    if (beacon) {
      if (curSector && curSector.floor === this.activeFloor) {
        const basePos = calculateSectorPosition(curSector, this.activeFloor);
        const pPos = (typeof window !== 'undefined' && window.__playerPos) ? window.__playerPos : { x: 0, z: 0 };
        const halfW = (curSector.size?.w || 26) / 2;
        const halfL = (curSector.size?.l || 26) / 2;
        const dx = ((pPos.x - curSector.coords.x) / halfW) * (basePos.w / 2 - 12);
        const dz = ((pPos.z - curSector.coords.z) / halfL) * (basePos.h / 2 - 12);
        const beaconX = Math.round(basePos.x + Math.max(-basePos.w / 2 + 10, Math.min(basePos.w / 2 - 10, dx)));
        const beaconY = Math.round(basePos.y + Math.max(-basePos.h / 2 + 10, Math.min(basePos.h / 2 - 10, dz)));

        beacon.setAttribute('transform', `translate(${beaconX}, ${beaconY})`);
        beacon.style.display = 'inline';

        const compass = beacon.querySelector('.beacon-compass');
        if (compass && typeof window !== 'undefined' && typeof window.__playerRot === 'number') {
          const rotDeg = Math.round((window.__playerRot * 180) / Math.PI);
          compass.setAttribute('transform', `rotate(${rotDeg})`);
        }
      } else {
        beacon.style.display = 'none';
      }
    }
  }

  render(player, grumps = [], destructibles = []) {
    if (player && player.group) {
      if (typeof window !== 'undefined') {
        window.__playerPos = player.group.position;
        window.__playerRot = typeof player.rotation === 'number'
          ? player.rotation
          : (player.group.rotation?.y || 0);
      }
    }

    if (!this.canvas || !this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const scale = 3.5;

    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = '#05070a';
    ctx.fillRect(0, 0, w, h);

    // Room boundaries
    const pPos = player?.group?.position || { x: 0, y: 0, z: 0 };
    const currentRoom = this.gameState?.room || 'foyer';
    const curSector = getSector(currentRoom);

    ctx.strokeStyle = curSector?.biomeColor || 'rgba(34, 211, 238, 0.4)';
    ctx.lineWidth = 1.5;

    let roomOffset = { x: 0, y: 0, z: 0 };
    if (curSector && curSector.coords) {
      roomOffset = curSector.coords;
    } else if (rooms[currentRoom]) {
      roomOffset = rooms[currentRoom].position;
    }

    const rx = cx - (pPos.x - roomOffset.x) * scale;
    const ry = cy - (pPos.z - roomOffset.z) * scale;
    const roomW = (curSector?.size?.w || 26) * scale;
    const roomL = (curSector?.size?.l || 26) * scale;
    ctx.strokeRect(rx - roomW / 2, ry - roomL / 2, roomW, roomL);

    // Grump Blips
    if (Array.isArray(grumps)) {
      grumps.forEach(g => {
        if (g.roomName === currentRoom || g.sectorId === curSector?.id) {
          const gPos = g.group?.position || g.position || { x: 0, z: 0 };
          const gx = cx + (gPos.x - (pPos.x - roomOffset.x)) * scale;
          const gy = cy + (gPos.z - (pPos.z - roomOffset.z)) * scale;

          ctx.fillStyle = g.isDancing ? '#f59e0b' : '#3b82f6';
          ctx.beginPath();
          ctx.arc(gx, gy, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }

    // Destructible Blips
    if (Array.isArray(destructibles)) {
      destructibles.forEach(d => {
        const dRoom = d.userData?.roomName || d.userData?.sectorId;
        if (dRoom === currentRoom || dRoom === curSector?.id) {
          const dPos = d.position || { x: 0, z: 0 };
          const dx = cx + (dPos.x - (pPos.x - roomOffset.x)) * scale;
          const dy = cy + (dPos.z - (pPos.z - roomOffset.z)) * scale;
          ctx.fillStyle = '#ec4899';
          ctx.beginPath();
          ctx.arc(dx, dy, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }

    // Player Directional Arrow (+Z forward)
    const pRotation = typeof player?.rotation === 'number'
      ? player.rotation
      : (player?.group?.rotation?.y || 0);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(pRotation);
    ctx.fillStyle = '#22d3ee';
    ctx.beginPath();
    ctx.moveTo(0, 6);
    ctx.lineTo(4, -5);
    ctx.lineTo(-4, -5);
    ctx.closePath();
    ctx.fill();

    // Vision cone
    ctx.fillStyle = 'rgba(34, 211, 238, 0.15)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 24, Math.PI / 2 - 0.5, Math.PI / 2 + 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    if (this.mapModal && this.mapModal.style.display === 'flex') {
      this.updateFullMapUI();
    }
  }
}

import { audio } from '../engine/audio.js';
import { rooms } from '../world/rooms.js';

export class MinimapSystem {
  constructor(gameState) {
    this.gameState = gameState;
    this.canvas = document.getElementById('minimap-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.mapModal = document.getElementById('map-modal');
    this.activeFloor = '1F';

    // Modal close button
    const closeBtn = document.getElementById('map-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.toggleFullMap());

    // Floor tabs
    const btn1F = document.getElementById('btn-floor-1f');
    const btn2F = document.getElementById('btn-floor-2f');
    const btnB1 = document.getElementById('btn-floor-b1');

    if (btn1F) {
      btn1F.addEventListener('click', () => {
        audio.playPop();
        this.switchFloor('1F');
      });
    }
    if (btn2F) {
      btn2F.addEventListener('click', () => {
        audio.playPop();
        this.switchFloor('2F');
      });
    }
    if (btnB1) {
      btnB1.addEventListener('click', () => {
        audio.playPop();
        this.switchFloor('B1');
      });
    }

    // Room Blueprint Nodes Click Inspection
    const nodes = {
      'map-room-foyer': 'foyer',
      'map-room-library': 'library',
      'map-room-garden': 'garden',
      'map-room-greenhouse': 'greenhouse',
      'map-room-observatory': 'observatory',
      'map-room-clocktower': 'clocktower',
      'map-room-lab': 'lab'
    };

    Object.entries(nodes).forEach(([id, roomName]) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', () => this.inspectSector(roomName));
    });
  }

  switchFloor(floor) {
    this.activeFloor = floor;
    ['1f', '2f', 'b1'].forEach(f => {
      const btn = document.getElementById(`btn-floor-${f}`);
      const layer = document.getElementById(`layer-floor-${f}`);
      const isActive = f.toUpperCase() === floor;
      if (btn) btn.classList.toggle('active', isActive);
      if (layer) layer.style.display = isActive ? 'inline' : 'none';
    });
  }

  inspectSector(room) {
    audio.playPop();
    const title = document.getElementById('tel-room-title');
    const joy = document.getElementById('tel-joy-percent');
    const quest = document.getElementById('tel-quest-state');
    const grump = document.getElementById('tel-grump-count');

    if (room === 'foyer') {
      if (title) title.textContent = 'GRAND FOYER (1F & 2F)';
      if (joy) joy.textContent = this.gameState.pianoSolved ? '100% BLISS' : '75% BLISS';
      if (quest) quest.textContent = this.gameState.pianoSolved ? 'Sonatina Solved ✔' : 'Harmonic Triad (C-E-G)';
      if (grump) grump.textContent = '2 Plushie Grumps';
    } else if (room === 'library') {
      if (title) title.textContent = 'EAST WING LIBRARY';
      if (joy) joy.textContent = this.gameState.cauldronFed ? '100% BLISS' : '50% BLISS';
      if (quest) quest.textContent = this.gameState.cauldronFed ? 'Cauldron Radiating ✔' : 'Mega Bliss Cupcake Brew';
      if (grump) grump.textContent = '2 Plushie Grumps';
    } else if (room === 'garden') {
      if (title) title.textContent = 'SOLARIUM GARDEN';
      if (joy) joy.textContent = this.gameState.unlockedDoors.garden ? '90% BLISS' : '40% BLISS';
      if (quest) quest.textContent = '4 Heart Lantern Ignition';
      if (grump) grump.textContent = '1 Plush Knight';
    } else if (room === 'greenhouse') {
      if (title) title.textContent = 'COURTYARD GREENHOUSE';
      if (joy) joy.textContent = '85% BLISS';
      if (quest) quest.textContent = 'Prismatic Sugar Cultivation';
      if (grump) grump.textContent = '1 Plushie Bear';
    } else if (room === 'observatory') {
      if (title) title.textContent = 'CELESTIAL OBSERVATORY (2F)';
      if (joy) joy.textContent = this.gameState.astrolabeSolved ? '100% BLISS' : '60% BLISS';
      if (quest) quest.textContent = this.gameState.astrolabeSolved ? 'Astrolabe Aligned ✔' : 'Insert Star Sapphire Gem';
      if (grump) grump.textContent = '1 Stargazer Specter';
    } else if (room === 'clocktower') {
      if (title) title.textContent = 'CLOCKTOWER SUITE (2F)';
      if (joy) joy.textContent = this.gameState.clockSolved ? '100% BLISS' : '65% BLISS';
      if (quest) quest.textContent = this.gameState.clockSolved ? 'Royal Crest Retrieved ✔' : 'Grand Clock Escapement';
      if (grump) grump.textContent = '1 Clockwork Knight';
    } else if (room === 'lab') {
      if (title) title.textContent = 'SUBTERRANEAN SUGAR LAB (B1)';
      if (joy) joy.textContent = this.gameState.dynamoActive ? '100% BLISS' : '45% BLISS';
      if (quest) quest.textContent = this.gameState.dynamoActive ? 'Joy Dynamo Online ✔' : 'Insert Dynamo Core';
      if (grump) grump.textContent = '2 Chemist Grumps';
    } else if (room === 'dining') {
      if (title) title.textContent = 'GRAND BANQUET DINING HALL (1F)';
      if (joy) joy.textContent = '90% BLISS';
      if (quest) quest.textContent = 'Feast Table Banquet Inspection';
      if (grump) grump.textContent = '1 Hungry Bear';
    } else if (room === 'gallery') {
      if (title) title.textContent = 'HALL OF WHOLESOME PORTRAITS (1F)';
      if (joy) joy.textContent = '95% BLISS';
      if (quest) quest.textContent = 'Stained Glass Sconce Tour';
      if (grump) grump.textContent = '1 Art Critic Grump';
    } else if (room === 'mastersuite') {
      if (title) title.textContent = 'ROYAL VELVET MASTER SUITE (2F)';
      if (joy) joy.textContent = '100% BLISS';
      if (quest) quest.textContent = 'Royal Velvet Rest & Solarium Terrace';
      if (grump) grump.textContent = '1 Slumbering Plushie';
    } else if (room === 'ballroom') {
      if (title) title.textContent = 'GRAND CRYSTAL BALLROOM (2F)';
      if (joy) joy.textContent = '100% BLISS';
      if (quest) quest.textContent = 'Starlight Disco Chandelier Dance';
      if (grump) grump.textContent = '2 Waltz Dancers';
    } else if (room === 'crypt') {
      if (title) title.textContent = 'WHISPERING CRYPT OF JOY (B2)';
      if (joy) joy.textContent = 'FINAL BOSS ARENA';
      if (quest) quest.textContent = '★ UPLIFT GRAND GLOOM BEHEMOTH ★';
      if (grump) grump.textContent = '★ BOSS: GLOOM BEHEMOTH ★';
    }
  }

  toggleFullMap() {
    audio.playPop();
    const isOpen = this.mapModal.style.display === 'flex';
    this.mapModal.style.display = isOpen ? 'none' : 'flex';
    if (!isOpen) {
      if (this.gameState.room === 'observatory' || this.gameState.room === 'clocktower') {
        this.switchFloor('2F');
      } else if (this.gameState.room === 'lab') {
        this.switchFloor('B1');
      } else {
        this.switchFloor('1F');
      }
      this.updateFullMapUI();
      this.inspectSector(this.gameState.room);
    }
  }

  updateFullMapUI() {
    // Door Lock State Updates
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

    // Player Beacon Transform on High-Res Blueprint
    const beacon = document.getElementById('map-player-beacon');
    if (beacon) {
      let mapX = 380;
      let mapY = 250;
      const pPos = window.__playerPos || { x: 0, z: 0 };

      if (this.gameState.room === 'foyer') {
        mapX = 380 + (pPos.x / 14) * 80;
        mapY = 250 + (pPos.z / 14) * 120;
      } else if (this.gameState.room === 'library') {
        mapX = 620 + ((pPos.x - rooms.library.position.x) / 12) * 70;
        mapY = 250 + ((pPos.z - rooms.library.position.z) / 12) * 100;
      } else if (this.gameState.room === 'garden') {
        mapX = 140 + ((pPos.x - rooms.garden.position.x) / 13) * 70;
        mapY = 250 + ((pPos.z - rooms.garden.position.z) / 13) * 100;
      } else if (this.gameState.room === 'greenhouse') {
        mapX = 380 + ((pPos.x - rooms.greenhouse.position.x) / 13) * 70;
        mapY = 55 + ((pPos.z - rooms.greenhouse.position.z) / 13) * 25;
      } else if (this.gameState.room === 'observatory') {
        mapX = 625 + ((pPos.x - rooms.observatory.position.x) / 12) * 70;
        mapY = 240 + ((pPos.z - rooms.observatory.position.z) / 12) * 100;
      } else if (this.gameState.room === 'clocktower') {
        mapX = 175 + ((pPos.x - rooms.clocktower.position.x) / 12) * 70;
        mapY = 240 + ((pPos.z - rooms.clocktower.position.z) / 12) * 100;
      } else if (this.gameState.room === 'lab') {
        mapX = 400 + ((pPos.x - rooms.lab.position.x) / 13) * 120;
        mapY = 240 + ((pPos.z - rooms.lab.position.z) / 13) * 120;
      }

      beacon.setAttribute('transform', `translate(${mapX.toFixed(1)}, ${mapY.toFixed(1)})`);
    }
  }

  render(player, grumps, destructibles) {
    window.__playerPos = player.group.position;
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
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)';
    ctx.lineWidth = 1.5;
    const pPos = player.group.position;

    let roomOffset = new THREE.Vector3(0, 0, 0);
    if (rooms[this.gameState.room]) {
      roomOffset = rooms[this.gameState.room].position;
    }

    const rx = cx - (pPos.x - roomOffset.x) * scale;
    const ry = cy - (pPos.z - roomOffset.z) * scale;
    const rSize = 26 * scale;
    ctx.strokeRect(rx - rSize/2, ry - rSize/2, rSize, rSize);

    // Grump Blips
    grumps.forEach(g => {
      if (g.roomName === this.gameState.room) {
        const gx = cx + (g.group.position.x - (pPos.x - roomOffset.x)) * scale;
        const gy = cy + (g.group.position.z - (pPos.z - roomOffset.z)) * scale;

        ctx.fillStyle = g.isDancing ? '#f59e0b' : '#3b82f6';
        ctx.beginPath();
        ctx.arc(gx, gy, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Destructible Blips
    destructibles.forEach(d => {
      if (d.userData.roomName === this.gameState.room) {
        const dx = cx + (d.position.x - (pPos.x - roomOffset.x)) * scale;
        const dy = cy + (d.position.z - (pPos.z - roomOffset.z)) * scale;
        ctx.fillStyle = '#ec4899';
        ctx.beginPath();
        ctx.arc(dx, dy, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Player Directional Arrow (+Z forward)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(player.rotation);
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
    ctx.arc(0, 0, 24, Math.PI/2 - 0.5, Math.PI/2 + 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    if (this.mapModal && this.mapModal.style.display === 'flex') {
      this.updateFullMapUI();
    }
  }
}

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
    if (btn1F) {
      btn1F.addEventListener('click', () => {
        audio.playPop();
        this.activeFloor = '1F';
        btn1F.classList.add('active');
        if (btn2F) btn2F.classList.remove('active');
      });
    }
    if (btn2F) {
      btn2F.addEventListener('click', () => {
        audio.playPop();
        this.activeFloor = '2F';
        btn2F.classList.add('active');
        if (btn1F) btn1F.classList.remove('active');
      });
    }

    // Room Blueprint Nodes Click Inspection
    const nodeFoyer = document.getElementById('map-room-foyer');
    const nodeLib = document.getElementById('map-room-library');
    const nodeGarden = document.getElementById('map-room-garden');

    if (nodeFoyer) nodeFoyer.addEventListener('click', () => this.inspectSector('foyer'));
    if (nodeLib) nodeLib.addEventListener('click', () => this.inspectSector('library'));
    if (nodeGarden) nodeGarden.addEventListener('click', () => this.inspectSector('garden'));
  }

  inspectSector(room) {
    audio.playPop();
    const title = document.getElementById('tel-room-title');
    const joy = document.getElementById('tel-joy-percent');
    const quest = document.getElementById('tel-quest-state');
    const grump = document.getElementById('tel-grump-count');

    if (room === 'foyer') {
      if (title) title.textContent = 'GRAND FOYER';
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
    }
  }

  toggleFullMap() {
    audio.playPop();
    const isOpen = this.mapModal.style.display === 'flex';
    this.mapModal.style.display = isOpen ? 'none' : 'flex';
    if (!isOpen) {
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
      let mapX = 400;
      let mapY = 250;
      const pPos = player.group.position;

      if (this.gameState.room === 'foyer') {
        mapX = 400 + (pPos.x / 14) * 80;
        mapY = 250 + (pPos.z / 14) * 160;
      } else if (this.gameState.room === 'library') {
        mapX = 650 + ((pPos.x - rooms.library.position.x) / 12) * 80;
        mapY = 250 + ((pPos.z - rooms.library.position.z) / 12) * 120;
      } else if (this.gameState.room === 'garden') {
        mapX = 150 + ((pPos.x - rooms.garden.position.x) / 13) * 80;
        mapY = 250 + ((pPos.z - rooms.garden.position.z) / 13) * 120;
      }

      beacon.setAttribute('transform', `translate(${mapX.toFixed(1)}, ${mapY.toFixed(1)})`);
    }
  }

  render(player, grumps, destructibles) {
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
    if (this.gameState.room === 'library') roomOffset = rooms.library.position;
    if (this.gameState.room === 'garden') roomOffset = rooms.garden.position;

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

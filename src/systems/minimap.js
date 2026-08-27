import { audio } from '../engine/audio.js';
import { rooms } from '../world/rooms.js';

export class MinimapSystem {
  constructor(gameState) {
    this.gameState = gameState;
    this.canvas = document.getElementById('minimap-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.mapModal = document.getElementById('map-modal');

    document.getElementById('map-close-btn').addEventListener('click', () => this.toggleFullMap());
  }

  toggleFullMap() {
    audio.playPop();
    const isOpen = this.mapModal.style.display === 'flex';
    this.mapModal.style.display = isOpen ? 'none' : 'flex';
    if (!isOpen) this.updateFullMapUI();
  }

  updateFullMapUI() {
    const dLib = document.getElementById('map-door-library');
    const dLibTxt = document.getElementById('map-door-library-txt');
    if (this.gameState.unlockedDoors.library) {
      dLib.setAttribute('fill', '#10b981');
      dLibTxt.textContent = 'OPEN';
    }

    const dGarden = document.getElementById('map-door-garden');
    const dGardenTxt = document.getElementById('map-door-garden-txt');
    if (this.gameState.unlockedDoors.garden) {
      dGarden.setAttribute('fill', '#10b981');
      dGardenTxt.textContent = 'OPEN';
    }

    const pin = document.getElementById('map-player-pin');
    if (this.gameState.room === 'foyer') pin.setAttribute('transform', 'translate(200, 150)');
    if (this.gameState.room === 'library') pin.setAttribute('transform', 'translate(325, 150)');
    if (this.gameState.room === 'garden') pin.setAttribute('transform', 'translate(75, 150)');
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
  }
}

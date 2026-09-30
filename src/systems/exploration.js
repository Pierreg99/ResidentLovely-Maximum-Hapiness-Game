import { scene, spawnConfetti } from '../world/scene.js';
import { rooms } from '../world/rooms.js';
import { SECTOR_REGISTRY, getSector } from '../world/sectors.js';
import { player } from '../entities/player.js';
import { motionReduced } from './preferences.js';

export function findRoute(from, to) {
  const start = getSector(from); const destination = getSector(to);
  if (!start || !destination) return [];
  const queue = [[start.id]]; const seen = new Set([start.id]);
  while (queue.length) {
    const path = queue.shift(); const current = getSector(path[path.length - 1]);
    if (current.id === destination.id) return path;
    for (const id of current.connections) {
      if (seen.has(id) || !getSector(id)) continue;
      seen.add(id); queue.push([...path, id]);
    }
  }
  return [];
}

function labelSprite(text, color) {
  const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 96;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(12,16,32,.88)'; ctx.fillRect(0, 0, 512, 96);
  ctx.strokeStyle = color; ctx.lineWidth = 4; ctx.strokeRect(2, 2, 508, 92);
  ctx.fillStyle = '#fff'; ctx.font = '600 25px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(text.length > 31 ? text.slice(0, 29) + '…' : text, 256, 57);
  const texture = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, depthTest: true }));
  sprite.scale.set(4, .75, 1); sprite.position.y = 3.2; return sprite;
}

export class ExplorationSystem {
  constructor(gameState, { onToast, onTravel, onJoyChanged }) {
    this.gameState = gameState; this.onToast = onToast; this.onTravel = onTravel; this.onJoyChanged = onJoyChanged;
    this.score = 0; this.visited = new Set(['S01']); this.collected = new Set();
    this.waypoint = null; this.portals = []; this.crystals = []; this.nearPortal = null;
    this.rally = null; this.best = 0; this.uiClock = 0;
    try {
      const saved = JSON.parse(localStorage.getItem('resident-lovely-exploration-v8') || '{}');
      this.score = Math.max(0, Number(saved.score) || 0); this.best = Math.max(0, Number(saved.best) || 0);
      this.visited = new Set(['S01', ...(saved.visited || []).filter(id => getSector(id))]);
      this.collected = new Set((saved.collected || []).filter(id => typeof id === 'string'));
    } catch (_) {}
    const coreGeo = new THREE.OctahedronGeometry(.32);
    const rimGeo = new THREE.TorusGeometry(.5, .025, 6, 24);
    const coreMat = new THREE.MeshStandardMaterial({ color: 0xfde68a, emissive: 0xfbbf24, emissiveIntensity: 0.7, metalness: .65, roughness: .18 });
    const rimMat = new THREE.MeshBasicMaterial({ color: 0xf9a8d4 });
    SECTOR_REGISTRY.forEach(sector => {
      const room = rooms[sector.slug];
      sector.connections.forEach((id, index) => {
        const target = getSector(id); if (!target) return;
        const angle = index * Math.PI * 2 / sector.connections.length;
        const group = new THREE.Group(); group.name = `gate-${id}`;
        group.position.set(Math.sin(angle) * (sector.size.w / 2 - 2.6), 0, Math.cos(angle) * (sector.size.l / 2 - 2.6));
        const ring = new THREE.Mesh(new THREE.TorusGeometry(1.15, .065, 8, 40),
          new THREE.MeshStandardMaterial({ color: target.biomeColor, emissive: target.biomeColor, emissiveIntensity: .7, metalness: .5, roughness: .2 }));
        ring.position.y = 1.6; ring.rotation.y = angle; group.add(ring);
        const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.5, .08, 24),
          new THREE.MeshStandardMaterial({ color: 0x24354d, metalness: .6, roughness: .3 }));
        pad.position.y = .08; group.add(pad); group.add(labelSprite(target.name, target.biomeColor));
        room.add(group); this.portals.push({ group, sector: sector.id, target, ring });
      });
      for (let index = 0; index < 3; index++) {
        const id = `${sector.id}-${index}`; const group = new THREE.Group();
        const angle = index * Math.PI * 2 / 3 + .5;
        group.position.set(Math.sin(angle) * 5, 1, Math.cos(angle) * 5);
        const core = new THREE.Mesh(coreGeo, coreMat); group.add(core);
        const rim = new THREE.Mesh(rimGeo, rimMat); rim.rotation.x = Math.PI / 2; group.add(rim);
        group.visible = !this.collected.has(id); room.add(group);
        this.crystals.push({ id, group, sector: sector.id, baseY: 1 });
      }
    });
    this.gateButton = document.getElementById('btn-gate-travel');
    this.gateButton.addEventListener('click', () => this.travelNearest());
    document.getElementById('btn-start-rally').addEventListener('click', () => this.startRally());
    document.getElementById('btn-stop-rally').addEventListener('click', () => this.stopRally());
    this.updateHUD();
  }
  save() {
    try { localStorage.setItem('resident-lovely-exploration-v8', JSON.stringify({ score: this.score, best: this.best, visited: [...this.visited], collected: [...this.collected] })); } catch (_) {}
  }
  markVisited(room) {
    const sector = getSector(room); if (!sector || this.visited.has(sector.id)) return;
    this.visited.add(sector.id); this.score += 100; this.save();
    this.onToast(`Discovered ${sector.name} · +100 joy points`);
  }
  setWaypoint(id) {
    this.waypoint = getSector(id)?.id || null; this.updateHUD();
  }
  travelNearest() {
    if (!this.nearPortal) return false;
    const target = this.nearPortal.target;
    this.nearPortal = null; this.gateButton.hidden = true;
    this.onTravel(target.slug, new THREE.Vector3(target.coords.x, target.coords.y, target.coords.z + 3));
    return true;
  }
  startRally() {
    if (this.rally) this.disposeRally();
    this.rally = { wave: 1, score: 0, seconds: 75, pickups: [], sector: null, count: 0, combo: 0, lastPickup: -100, elapsed: 0 };
    this.spawnWave(); this.onToast('Joy Rally started! Collect 5 stars before time runs out.');
    window.dispatchEvent(new CustomEvent('resident-resume'));
  }
  spawnWave() {
    const rally = this.rally; const sector = getSector(this.gameState.room);
    rally.sector = sector.id; rally.count = 0;
    for (let i = 0; i < 5; i++) {
      const angle = i * Math.PI * 2 / 5 + rally.wave * .7;
      const group = new THREE.Group();
      const star = new THREE.Mesh(new THREE.IcosahedronGeometry(.42, 0),
        new THREE.MeshStandardMaterial({ color: 0x7dd3fc, emissive: 0x38bdf8, emissiveIntensity: .9, metalness: .5, roughness: .2 }));
      group.add(star);
      const radius = Math.min(sector.size.w, sector.size.l) * .28;
      group.position.set(Math.sin(angle) * radius, 1.2, Math.cos(angle) * radius);
      rooms[sector.slug].add(group); rally.pickups.push(group);
    }
  }
  disposeRally() {
    if (!this.rally) return;
    this.rally.pickups.forEach(group => {
      group.parent?.remove(group); group.traverse(object => { object.geometry?.dispose(); object.material?.dispose(); });
    });
    this.rally.pickups = [];
  }
  stopRally(failed = false) {
    if (!this.rally) return;
    const score = this.rally.score; this.best = Math.max(this.best, score);
    this.disposeRally(); this.rally = null; this.save(); this.updateHUD();
    this.onToast(`${failed ? 'Time up!' : 'Rally finished.'} Score ${score} · Best ${this.best}`);
  }
  update(delta, time) {
    const sector = getSector(this.gameState.room); if (!sector) return;
    this.markVisited(sector.id);
    const local = player.position.clone().sub(rooms[sector.slug].position);
    this.nearPortal = null; let distance = 2.1;
    this.portals.forEach(portal => {
      if (portal.sector !== sector.id) return;
      if (!motionReduced()) portal.ring.rotation.z = Math.sin(time * .6) * .07;
      const d = Math.hypot(local.x - portal.group.position.x, local.z - portal.group.position.z);
      if (d < distance) { distance = d; this.nearPortal = portal; }
    });
    this.gateButton.hidden = !this.nearPortal;
    if (this.nearPortal) this.gateButton.textContent = `Travel to ${this.nearPortal.target.name} · E`;
    this.crystals.forEach(crystal => {
      if (crystal.sector !== sector.id || this.collected.has(crystal.id)) return;
      if (!motionReduced()) { crystal.group.rotation.y = time; crystal.group.position.y = crystal.baseY + Math.sin(time * 2 + crystal.id.length) * .15; }
      if (Math.hypot(local.x - crystal.group.position.x, local.z - crystal.group.position.z) < 1.2) {
        this.collected.add(crystal.id); crystal.group.visible = false; this.score += 25;
        this.gameState.joy = Math.min(100, this.gameState.joy + 5); this.onJoyChanged();
        if (!motionReduced()) spawnConfetti(player.position.clone().add(new THREE.Vector3(0, 1, 0)), 10);
        this.onToast('Joy crystal found · +25 points · +5 vitality'); this.save();
      }
    });
    if (this.rally) {
      const rally = this.rally; rally.seconds -= delta; rally.elapsed += delta;
      if (rally.sector !== sector.id) { this.disposeRally(); this.spawnWave(); }
      for (const group of rally.pickups) {
        if (!group.visible) continue;
        if (!motionReduced()) group.rotation.y = time * 1.5;
        if (Math.hypot(local.x - group.position.x, local.z - group.position.z) < 1.3) {
          group.visible = false; rally.count++;
          rally.combo = rally.elapsed - rally.lastPickup < 8 ? Math.min(4, rally.combo + 1) : 1;
          rally.lastPickup = rally.elapsed; const points = 50 * rally.combo;
          rally.score += points; this.score += points; rally.seconds += 3;
          this.onToast(`Rally star ${rally.count}/5 · ${rally.combo}x combo · +${points}`);
        }
      }
      if (rally.count === 5) {
        this.disposeRally(); rally.wave++; rally.seconds = Math.max(30, 75 - (rally.wave - 1) * 7);
        this.spawnWave(); this.onToast(`Wave ${rally.wave} · A new star trail has appeared!`); this.save();
      }
      if (rally.seconds <= 0) this.stopRally(true);
    }
    this.uiClock += delta;
    if (this.uiClock > .15) { this.uiClock = 0; this.updateHUD(); }
  }
  updateHUD() {
    const sector = getSector(this.gameState.room);
    document.getElementById('exploration-stats').textContent = `${this.visited.size}/${SECTOR_REGISTRY.length} places · ${this.score.toLocaleString()} joy points`;
    const stamina = document.getElementById('stamina-fill'); stamina.style.width = `${player.stamina}%`;
    document.getElementById('stamina-meter').setAttribute('aria-valuenow', Math.round(player.stamina));
    const trail = document.getElementById('waypoint-status');
    const route = this.waypoint ? findRoute(sector.id, this.waypoint) : [];
    trail.hidden = !this.waypoint;
    if (this.waypoint) trail.textContent = route.length > 1 ? `Next gate: ${getSector(route[1]).name} · ${route.length - 1} hops` : `Destination: ${getSector(this.waypoint).name}`;
    const rallyHud = document.getElementById('rally-status'); rallyHud.hidden = !this.rally;
    if (this.rally) rallyHud.textContent = `JOY RALLY · Wave ${this.rally.wave} · ${this.rally.count}/5 stars · ${Math.ceil(Math.max(0, this.rally.seconds))}s · ${this.rally.score} pts`;
    document.getElementById('rally-best').textContent = `Best rally: ${this.best} points`;
    document.getElementById('btn-stop-rally').disabled = !this.rally;
  }
}

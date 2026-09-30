import { preferences, savePreferences, motionReduced } from './preferences.js';
import { setGraphicsMode, graphicsQuality } from '../world/scene.js';
import { setCharacterStyle } from '../entities/player.js';
import { audio } from '../engine/audio.js';
import { SECTOR_REGISTRY, getSector } from '../world/sectors.js';
import { findRoute } from './exploration.js';
import { calculateSectorPosition } from './minimap.js';
import { resolveBackdropAsset } from '../world/backdrops.js';

const paths = {
  menu: 'M4 6h16M4 12h16M4 18h16',
  map: 'm3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2V5Zm6-2v16M15 5v16',
  quest: 'M8 4H5v17h14V4h-3M8 3h8v4H8V3Zm0 9h8M8 16h5',
  dash: 'm13 2-9 12h7l-1 8 10-13h-7l0-7Z',
  sprint: 'M12 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM5 9l4-3 5 3 3 3 4-1M4 21l5-8 3 2 2 6M9 13l3-5',
  star: 'm12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6Z',
  compass: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4 6-2 6-6 2 2-6 6-2Z'
};
export function icon(name) {
  return `<svg class="rl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name] || paths.star}"/></svg>`;
}
function portrait(hair, vest) {
  return `<svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="38" fill="${vest}" opacity=".3"/><path d="M16 67Q18 48 40 48T64 67" fill="${vest}"/><ellipse cx="17" cy="36" rx="8" ry="19" fill="${hair}"/><ellipse cx="63" cy="36" rx="8" ry="19" fill="${hair}"/><circle cx="40" cy="33" r="22" fill="${hair}"/><ellipse cx="40" cy="38" rx="17" ry="18" fill="#ffe4da"/><path d="M21 32Q22 9 42 15L59 32 46 25 38 31 32 24Z" fill="${hair}"/><ellipse cx="33" cy="38" rx="2.5" ry="4" fill="#23395e"/><ellipse cx="47" cy="38" rx="2.5" ry="4" fill="#23395e"/><path d="M35 47Q40 51 45 47" fill="none" stroke="#b36878" stroke-width="2"/><path d="m38 60 2-5 2 5 5 1-4 3 1 5-4-2-4 2 1-5-4-3Z" fill="#f0cd8d"/></svg>`;
}

export class GameUI {
  constructor(gameState, minimap, exploration, persistence) {
    this.state = gameState; this.map = minimap; this.exploration = exploration; this.persistence = persistence;
    this.menu = document.getElementById('pause-modal'); this.lastFocus = null;
    document.getElementById('btn-menu').innerHTML = icon('menu') + '<span>MENU</span>';
    for (const [id, name] of [['btn-full-map', 'map'], ['btn-quest-log', 'quest'], ['btn-sprint', 'sprint'], ['btn-dash', 'dash']]) {
      const el = document.getElementById(id); if (!el) continue;
      const svg = el.querySelector('svg'); if (svg) svg.outerHTML = icon(name);
    }
    document.getElementById('btn-menu').addEventListener('click', () => this.togglePause());
    document.getElementById('btn-resume').addEventListener('click', () => this.resume());
    document.getElementById('pause-close-btn').addEventListener('click', () => this.resume());
    document.getElementById('btn-save-now').addEventListener('click', () => { persistence.executeSave(); exploration.save(); });
    document.getElementById('btn-menu-map').addEventListener('click', () => { this.resume(); minimap.toggleFullMap(); });
    document.getElementById('btn-fullscreen').addEventListener('click', async () => {
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else await document.documentElement.requestFullscreen();
      } catch (_) { document.getElementById('install-help').textContent = 'Use your browser fullscreen control.'; }
    });
    const quality = document.getElementById('graphics-quality'); quality.value = preferences.quality;
    quality.addEventListener('change', () => { setGraphicsMode(quality.value); savePreferences(); this.updateQuality(); });
    const reduced = document.getElementById('reduced-motion'); reduced.checked = preferences.reducedMotion;
    reduced.addEventListener('change', () => { preferences.reducedMotion = reduced.checked; savePreferences(); this.updateMotion(); });
    const sound = document.getElementById('sound-enabled'); sound.checked = preferences.sound;
    audio.muted = !preferences.sound;
    sound.addEventListener('change', () => { preferences.sound = sound.checked; audio.muted = !sound.checked; if (audio.muted) audio.stopBeamSound(); savePreferences(); });
    document.querySelectorAll('[data-skin]').forEach((button, i) => {
      const skins = [['#7dd3fc', '#243863'], ['#f9a8d4', '#783554'], ['#6ee7b7', '#164e46']];
      button.insertAdjacentHTML('afterbegin', portrait(...skins[i]));
      button.addEventListener('click', () => {
        preferences.skin = button.dataset.skin; setCharacterStyle(preferences.skin); savePreferences(); this.updateSkins();
      });
    });
    setCharacterStyle(preferences.skin); this.updateSkins(); this.updateMotion(); this.updateQuality();
    window.addEventListener('resident-resume', () => this.resume());
    window.addEventListener('blur', () => { if (this.state.started) this.pause(); });
    document.addEventListener('visibilitychange', () => { if (document.hidden && this.state.started) this.pause(); });
    this.menu.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab') return;
      const controls = [...this.menu.querySelectorAll('button, select, input')].filter(el => !el.disabled && !el.hidden);
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    this.initMapTools(); this.initInstall();
  }
  updateSkins() {
    document.querySelectorAll('[data-skin]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.skin === preferences.skin)));
  }
  updateMotion() { document.body.classList.toggle('reduced-motion', motionReduced()); }
  updateQuality() {
    document.getElementById('quality-description').textContent = `${graphicsQuality.preset === 'low' ? 'Battery saver' : graphicsQuality.preset === 'med' ? 'Balanced' : 'Enhanced'} rendering · ${graphicsQuality.shadowMapSize}px shadows`;
  }
  pause() {
    if (this.state.paused || !this.state.started) return;
    this.state.paused = true; this.lastFocus = document.activeElement;
    this.menu.style.display = 'flex'; window.dispatchEvent(new CustomEvent('resident-pause'));
    document.getElementById('btn-resume').focus();
  }
  resume() {
    this.state.paused = false; this.menu.style.display = 'none';
    this.lastFocus?.focus?.();
  }
  togglePause() {
    const closeButtons = ['map-close-btn', 'inv-close-btn', 'quest-close-btn', 'piano-close-btn', 'inspect-close-btn', 'btn-cancel-save'];
    for (const id of closeButtons) {
      const button = document.getElementById(id); const overlay = button?.closest('.modal-overlay, #piano-modal, #inspect-modal, #save-modal');
      if (overlay && getComputedStyle(overlay).display !== 'none') { button.click(); return; }
    }
    if (this.state.paused) this.resume(); else this.pause();
  }
  initMapTools() {
    const select = document.getElementById('map-destination');
    SECTOR_REGISTRY.forEach(sector => {
      const option = document.createElement('option'); option.value = sector.id; option.textContent = `${sector.floor} · ${sector.name}`; select.appendChild(option);
    });
    select.addEventListener('change', () => { const sector = getSector(select.value); this.map.switchFloor(sector.floor); this.map.inspectSector(sector.id); });
    document.getElementById('btn-track-destination').addEventListener('click', () => {
      const sector = this.map.selectedSector || getSector(select.value);
      this.exploration.setWaypoint(sector.id); this.drawRoute();
      document.getElementById('map-route-summary').textContent = `Tracking ${sector.name}. Follow the labeled gates.`;
    });
    document.getElementById('btn-clear-waypoint').addEventListener('click', () => {
      this.exploration.setWaypoint(null); this.drawRoute(); document.getElementById('map-route-summary').textContent = 'Select a room to explore or track a route.';
    });
    const inspect = this.map.inspectSector.bind(this.map);
    this.map.inspectSector = (id) => {
      inspect(id); const sector = getSector(id); if (!sector) return;
      select.value = sector.id;
      const preview = document.querySelector('.security-camera-screen');
      if (preview) {
        preview.style.backgroundImage = `linear-gradient(0deg, #0c1428aa, transparent), url("${resolveBackdropAsset(sector.id)}")`;
        preview.style.backgroundSize = 'cover';
        preview.style.backgroundPosition = 'center';
      }
      document.getElementById('map-discovery').textContent = `${this.exploration.visited.has(sector.id) ? 'Discovered' : 'Unexplored'} · ${[0, 1, 2].filter(i => this.exploration.collected.has(`${sector.id}-${i}`)).length}/3 crystals`;
      this.drawRoute();
    };
    const render = this.map.renderBlueprintSvg.bind(this.map);
    this.map.renderBlueprintSvg = () => { render(); this.drawRoute(); };
  }
  drawRoute() {
    const svg = document.getElementById('estate-blueprint-svg'); if (!svg) return;
    svg.querySelector('#exploration-route')?.remove();
    if (!this.exploration.waypoint) return;
    const route = findRoute(this.state.room, this.exploration.waypoint);
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g'); group.id = 'exploration-route'; group.setAttribute('pointer-events', 'none');
    route.forEach((id, i) => {
      if (!i) return; const from = getSector(route[i - 1]), to = getSector(id);
      if (from.floor !== this.map.activeFloor || to.floor !== this.map.activeFloor) return;
      const a = calculateSectorPosition(from, from.floor), b = calculateSectorPosition(to, to.floor);
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      for (const [key, value] of Object.entries({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: '#fde68a', 'stroke-width': 4, 'stroke-dasharray': '8 5' })) line.setAttribute(key, value);
      group.appendChild(line);
    });
    svg.querySelector('#blueprint-sectors')?.before(group);
  }
  initInstall() {
    const button = document.getElementById('btn-install'); let installPrompt = null;
    window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); installPrompt = event; button.hidden = false; });
    window.addEventListener('appinstalled', () => { installPrompt = null; button.hidden = true; document.getElementById('install-help').textContent = 'Resident Lovely is installed.'; });
    button.addEventListener('click', async () => {
      if (!installPrompt) return;
      await installPrompt.prompt(); await installPrompt.userChoice; installPrompt = null; button.hidden = true;
    });
    const android = /Android/i.test(navigator.userAgent);
    document.getElementById('install-help').textContent = android ? 'Android: Chrome menu → Add to Home screen → Install. Play in landscape for more space.' : 'Windows & Linux: open in Chrome or Edge and choose Install app. Firefox can play in the browser.';
  }
}

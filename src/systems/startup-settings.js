import { preferences, savePreferences } from './preferences.js';
import { setGraphicsMode } from '../world/scene.js';
import { setCharacterStyle } from '../entities/player.js';
import { audio } from '../engine/audio.js';

// A deliberate graphics choice and a separate Play click are required each launch.
export class StartupSettings {
  constructor(gameUI) {
    this.ready = false;
    this.chosen = false;
    this.play = document.getElementById('btn-enter-chateau');
    this.status = document.getElementById('startup-quality-status');
    this.gameUI = gameUI;
    this.screen = document.getElementById('loading-screen');
    this.screen.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const controls = [...this.screen.querySelectorAll('button:not(:disabled), input')];
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    document.querySelectorAll('[data-start-quality]').forEach(button => {
      button.addEventListener('click', () => {
        setGraphicsMode(button.dataset.startQuality);
        savePreferences();
        this.chosen = true;
        document.querySelectorAll('[data-start-quality]').forEach(el => el.setAttribute('aria-pressed', String(el === button)));
        document.getElementById('graphics-quality').value = preferences.quality;
        gameUI.updateQuality();
        this.status.textContent = `${button.querySelector('strong').textContent} selected. ${preferences.quality === 'ultra' ? 'Best for powerful graphics hardware. ' : ''}Press Play when you are ready.`;
        this.update();
      });
    });
    document.querySelectorAll('[data-start-skin]').forEach(button => {
      button.addEventListener('click', () => {
        preferences.skin = button.dataset.startSkin;
        setCharacterStyle(preferences.skin); savePreferences(); gameUI.updateSkins(); this.updateSkins();
      });
    });
    const sound = document.getElementById('startup-sound');
    sound.checked = preferences.sound;
    sound.addEventListener('change', () => {
      preferences.sound = sound.checked; audio.muted = !sound.checked;
      document.getElementById('sound-enabled').checked = sound.checked; savePreferences();
    });
    const motion = document.getElementById('startup-motion');
    motion.checked = preferences.reducedMotion;
    motion.addEventListener('change', () => {
      preferences.reducedMotion = motion.checked;
      document.getElementById('reduced-motion').checked = motion.checked;
      savePreferences(); gameUI.updateMotion();
    });
    this.updateSkins(); this.update();
    this.screen.querySelector('[data-start-quality]')?.focus({ preventScroll: true });
  }
  updateSkins() {
    document.querySelectorAll('[data-start-skin]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.startSkin === preferences.skin)));
  }
  setReady() { this.ready = true; this.update(); }
  get canPlay() { return this.ready && this.chosen; }
  update() { this.play.disabled = !this.canPlay; }
}

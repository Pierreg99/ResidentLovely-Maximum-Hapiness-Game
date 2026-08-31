// =========================================================================
// RESIDENT LOVELY - GAME MODES ENGINE (v6.0)
// Standard: NEXUS PRIVÉ v6.0 | Strict Zero-Emoji Protocol
// =========================================================================

export const GameModes = {
  activeMode: 'CLASSIC', // 'CLASSIC', 'SPEEDRUN', 'ENDLESS'
  speedrunTimer: 0.0,
  speedrunActive: false,
  bestTime: localStorage.getItem('rl_speedrun_best') || null,
  hudElement: null,

  init() {
    this.createSpeedrunHUD();
  },

  createSpeedrunHUD() {
    const hud = document.createElement('div');
    hud.id = 'speedrun-hud';
    hud.style.position = 'absolute';
    hud.style.top = '16px';
    hud.style.right = '16px';
    hud.style.padding = '8px 16px';
    hud.style.background = 'rgba(5, 7, 10, 0.85)';
    hud.style.border = '1px solid #f59e0b';
    hud.style.color = '#f59e0b';
    hud.style.fontFamily = 'monospace';
    hud.style.fontSize = '18px';
    hud.style.fontWeight = 'bold';
    hud.style.zIndex = '1000';
    hud.style.pointerEvents = 'none';
    hud.style.display = 'none';
    hud.style.boxShadow = '0 0 10px rgba(245, 158, 11, 0.3)';
    hud.innerHTML = '00:00.000';
    document.body.appendChild(hud);
    this.hudElement = hud;
  },

  startSpeedrun() {
    this.activeMode = 'SPEEDRUN';
    this.speedrunTimer = 0.0;
    this.speedrunActive = true;
    if (this.hudElement) {
      this.hudElement.style.display = 'block';
    }
  },

  stopSpeedrun(completed = false) {
    this.speedrunActive = false;
    if (completed) {
      if (!this.bestTime || this.speedrunTimer < this.bestTime) {
        this.bestTime = this.speedrunTimer;
        localStorage.setItem('rl_speedrun_best', this.bestTime.toString());
      }
    }
  },

  update(delta) {
    if (this.activeMode === 'SPEEDRUN' && this.speedrunActive) {
      this.speedrunTimer += delta;
      this.renderHUD();
    }
  }
};

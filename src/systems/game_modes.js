// =========================================================================
// RESIDENT LOVELY - GAME MODES ENGINE (v6.0)
// Standard: NEXUS PRIVÉ v6.0 | Strict Zero-Emoji Protocol
// =========================================================================

export const GameModes = {
  activeMode: 'CLASSIC',
  speedrunTimer: 0.0,
  speedrunActive: false,
  bestTime: (typeof localStorage !== 'undefined' && localStorage.getItem('rl_speedrun_best')) || null,
  splits: {},
  hudElement: null,

  init() {
    if (typeof document !== 'undefined') {
      this.createSpeedrunHUD();
    }
  },

  setMode(mode) {
    this.activeMode = mode;
    if (mode === 'SPEEDRUN') {
      this.startSpeedrun();
    } else {
      this.stopSpeedrun(false);
      if (this.hudElement) {
        this.hudElement.style.display = 'none';
      }
    }
  },

  createSpeedrunHUD() {
    if (typeof document === 'undefined') return;
    let hud = document.getElementById('speedrun-hud');
    if (!hud) {
      hud = document.createElement('div');
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
    }
    this.hudElement = hud;
  },

  startSpeedrun() {
    this.activeMode = 'SPEEDRUN';
    this.speedrunTimer = 0.0;
    this.speedrunActive = true;
    this.splits = {};
    if (this.hudElement) {
      this.hudElement.style.display = 'block';
    }
  },

  recordSplit(splitName) {
    if (!this.speedrunActive) return null;
    const splitTime = this.speedrunTimer;
    this.splits[splitName] = splitTime;
    return splitTime;
  },

  getSplits() {
    return { ...this.splits };
  },

  stopSpeedrun(completed = false) {
    this.speedrunActive = false;
    if (completed) {
      if (!this.bestTime || this.speedrunTimer < parseFloat(this.bestTime)) {
        this.bestTime = this.speedrunTimer.toString();
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('rl_speedrun_best', this.bestTime);
        }
      }
    }
  },

  update(delta) {
    if (this.activeMode === 'SPEEDRUN' && this.speedrunActive) {
      this.speedrunTimer += delta;
      this.renderHUD();
    }
  },

  renderHUD() {
    if (!this.hudElement) return;
    const t = this.speedrunTimer;
    const mins = Math.floor(t / 60).toString().padStart(2, '0');
    const secs = Math.floor(t % 60).toString().padStart(2, '0');
    const ms = Math.floor((t % 1) * 1000).toString().padStart(3, '0');
    
    let text = `${mins}:${secs}.${ms}`;
    if (this.bestTime) {
      const bt = parseFloat(this.bestTime);
      const bMins = Math.floor(bt / 60).toString().padStart(2, '0');
      const bSecs = Math.floor(bt % 60).toString().padStart(2, '0');
      text += `<br><span style="font-size:12px;color:#22d3ee">PB: ${bMins}:${bSecs}</span>`;
    }
    this.hudElement.innerHTML = text;
  }
};

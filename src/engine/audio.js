import { SECTOR_REGISTRY, getSector } from '../world/sectors.js';

/**
 * SoundEngine: Synthesized Web Audio API Sound Effects (Zero external audio files)
 * Enhanced with Kawaii chimes, Typewriter mechanical clicks, and Door handles.
 */
export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.beamOsc = null;
    this.beamGain = null;
    this.bgmTimer = null;
    this.currentBgmRoom = 'foyer';
    this.bgmStep = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playPistol() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  playBubbleShot() {
    if (this.muted) return;
    this.init();
    for (let i = 0; i < 5; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320 + i * 140, this.ctx.currentTime + i * 0.02);
      osc.frequency.exponentialRampToValueAtTime(950 + i * 120, this.ctx.currentTime + i * 0.02 + 0.16);
      gain.gain.setValueAtTime(0.16, this.ctx.currentTime + i * 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.02 + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + i * 0.02);
      osc.stop(this.ctx.currentTime + i * 0.02 + 0.18);
    }
  }

  playMortarFire() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.35);
    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }

  playExplosion() {
    if (this.muted) return;
    this.init();
    const freqs = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    freqs.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, this.ctx.currentTime + i * 0.02);
      gain.gain.setValueAtTime(0.22, this.ctx.currentTime + i * 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.02 + 0.7);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + i * 0.02);
      osc.stop(this.ctx.currentTime + i * 0.02 + 0.7);
    });
  }

  startBeamSound() {
    if (this.muted || this.beamOsc) return;
    this.init();
    this.beamOsc = this.ctx.createOscillator();
    this.beamGain = this.ctx.createGain();
    this.beamOsc.type = 'sawtooth';
    this.beamOsc.frequency.setValueAtTime(523.25, this.ctx.currentTime);
    this.beamGain.gain.setValueAtTime(0.14, this.ctx.currentTime);
    this.beamOsc.connect(this.beamGain);
    this.beamGain.connect(this.ctx.destination);
    this.beamOsc.start();
  }

  stopBeamSound() {
    if (this.beamOsc) {
      try {
        this.beamGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
        this.beamOsc.stop(this.ctx.currentTime + 0.05);
      } catch(e) {}
      this.beamOsc = null;
      this.beamGain = null;
    }
  }

  playPop() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1040, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playCheer() {
    if (this.muted) return;
    this.init();
    const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    chord.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.07);
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.07 + 0.5);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + idx * 0.07);
      osc.stop(this.ctx.currentTime + idx * 0.07 + 0.5);
    });
  }

  playTypewriter() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);

    const bell = this.ctx.createOscillator();
    const bGain = this.ctx.createGain();
    bell.type = 'sine';
    bell.frequency.setValueAtTime(1760, this.ctx.currentTime + 0.04);
    bGain.gain.setValueAtTime(0.2, this.ctx.currentTime + 0.04);
    bGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
    bell.connect(bGain);
    bGain.connect(this.ctx.destination);
    bell.start(this.ctx.currentTime + 0.04);
    bell.stop(this.ctx.currentTime + 0.35);
  }

  playQuickTurn() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(240, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(680, this.ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.18);
  }

  playPianoNote(freq) {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.8);
  }

  playDoorChime() {
    if (this.muted) return;
    this.init();
    const oscClick = this.ctx.createOscillator();
    const gainClick = this.ctx.createGain();
    oscClick.type = 'triangle';
    oscClick.frequency.setValueAtTime(320, this.ctx.currentTime);
    gainClick.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gainClick.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
    oscClick.connect(gainClick);
    gainClick.connect(this.ctx.destination);
    oscClick.start();
    oscClick.stop(this.ctx.currentTime + 0.08);

    const freqs = [392.00, 523.25, 659.25, 783.99];
    freqs.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, this.ctx.currentTime + 0.08 + i * 0.12);
      gain.gain.setValueAtTime(0.22, this.ctx.currentTime + 0.08 + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08 + i * 0.12 + 0.5);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + 0.08 + i * 0.12);
      osc.stop(this.ctx.currentTime + 0.08 + i * 0.12 + 0.5);
    });
  }

  playGramophone() {
    if (this.muted) return;
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50, 1318.51, 1567.98];
    notes.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, this.ctx.currentTime + i * 0.11);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime + i * 0.11);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.11 + 0.5);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + i * 0.11);
      osc.stop(this.ctx.currentTime + i * 0.11 + 0.5);
    });
  }

  playLanternIgnite() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(240, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(960, this.ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  // --- Dynamic Adaptive Web Audio BGM System (32 Sectors) ---
  startBGM(roomName = 'foyer') {
    if (this.bgmTimer) return;
    this.init();
    this.currentBgmRoom = roomName;
    this.bgmStep = 0;

    const bgmScales = {
      foyer: [261.63, 329.63, 392.00, 523.25, 392.00, 329.63],
      library: [293.66, 349.23, 440.00, 587.33, 440.00, 349.23],
      garden: [329.63, 415.30, 493.88, 659.25, 493.88, 415.30],
      greenhouse: [349.23, 440.00, 523.25, 698.46, 523.25, 440.00],
      observatory: [493.88, 587.33, 739.99, 987.77, 739.99, 587.33],
      clocktower: [392.00, 493.88, 587.33, 783.99, 587.33, 493.88],
      lab: [220.00, 261.63, 329.63, 440.00, 329.63, 261.63],
      crypt: [164.81, 196.00, 246.94, 329.63, 246.94, 196.00],
      dining: [261.63, 329.63, 392.00, 523.25, 659.25, 523.25],
      gallery: [293.66, 369.99, 440.00, 587.33, 440.00, 369.99],
      bakery: [392.00, 440.00, 493.88, 587.33, 659.25, 587.33],
      mastersuite: [329.63, 392.00, 493.88, 659.25, 493.88, 392.00],
      ballroom: [392.00, 493.88, 587.33, 783.99, 987.77, 783.99],
      cathedral: [261.63, 392.00, 523.25, 783.99, 1046.50, 783.99],
      gatehouse: [392.00, 440.00, 493.88, 587.33, 493.88, 440.00],
      reflection_pool: [293.66, 349.23, 440.00, 523.25, 440.00, 349.23],
      rose_maze: [329.63, 392.00, 440.00, 493.88, 440.00, 392.00],
      gazebo: [349.23, 440.00, 523.25, 659.25, 523.25, 440.00],
      conservatory: [196.00, 233.08, 293.66, 349.23, 293.66, 233.08],
      tea_salon: [440.00, 554.37, 659.25, 880.00, 659.25, 554.37],
      music_parlor: [329.63, 415.30, 493.88, 659.25, 493.88, 415.30],
      village_district: [293.66, 369.99, 440.00, 587.33, 440.00, 369.99],
      sacred_forest_trail: [185.00, 220.00, 277.18, 369.99, 277.18, 220.00],
      harbor_docks: [261.63, 311.13, 392.00, 466.16, 392.00, 311.13],
      moonlit_meadow: [246.94, 293.66, 369.99, 493.88, 369.99, 293.66],
      crystal_grotto: [277.18, 329.63, 415.30, 554.37, 415.30, 329.63],
      moonlit_rooftop: [293.66, 369.99, 440.00, 587.33, 739.99, 587.33],
      clock_tower_belfry: [174.61, 220.00, 261.63, 349.23, 261.63, 220.00],
      mirror_maze_gallery: [311.13, 392.00, 466.16, 622.25, 466.16, 392.00],
      underground_river_cavern: [196.00, 233.08, 293.66, 392.00, 293.66, 233.08],
      crystal_vault: [220.00, 261.63, 329.63, 440.00, 523.25, 440.00],
      ancient_ruins: [146.83, 174.61, 220.00, 293.66, 220.00, 174.61]
    };

    // Populate scales for ID aliases
    SECTOR_REGISTRY.forEach(sec => {
      if (bgmScales[sec.slug]) {
        bgmScales[sec.id] = bgmScales[sec.slug];
      }
    });

    this.bgmTimer = setInterval(() => {
      if (this.muted || !this.ctx) return;
      const sector = getSector(this.currentBgmRoom);
      const key = sector ? sector.slug : this.currentBgmRoom;
      const scale = bgmScales[key] || bgmScales.foyer;
      const freq = scale[this.bgmStep % scale.length];
      this.bgmStep++;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const isCrystal = (key === 'observatory' || key === 'ballroom' || key === 'cathedral' || key === 'crystal_vault' || key === 'crystal_grotto' || key === 'mirror_maze_gallery' || key === 'moonlit_rooftop');
      osc.type = isCrystal ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    }, 280);
  }

  updateBGMRoom(roomName) {
    this.currentBgmRoom = roomName;
    if (!this.bgmTimer) this.startBGM(roomName);
  }

  playRollingPinSlam() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(65, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(25, this.ctx.currentTime + 0.28);
    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.32);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.32);
  }

  playValveTurnChime(noteFreq = 440) {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(noteFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(noteFreq * 1.5, this.ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }

  playTartSuccessJingle() {
    if (this.muted) return;
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.09);
      gain.gain.setValueAtTime(0.28, this.ctx.currentTime + i * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.09 + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + i * 0.09);
      osc.stop(this.ctx.currentTime + i * 0.09 + 0.35);
    });
  }

  playKawaiiSparkleChime() {
    if (this.muted) return;
    this.init();
    const notes = [659.25, 830.61, 987.77, 1318.51, 1567.98]; // E5, G#5, B5, E6, G6
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.045);
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime + i * 0.045);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.045 + 0.28);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + i * 0.045);
      osc.stop(this.ctx.currentTime + i * 0.045 + 0.28);
    });
  }

  playHeartPop() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.06);
    gain.gain.setValueAtTime(0.22, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.14);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.14);
  }

  playFootstep(surface = 'marble') {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    const pitch = surface === 'grass' ? 180 : (surface === 'wood' ? 240 : 380);
    osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(pitch * 0.5, this.ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.06);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  stopBGM() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

export const audio = new SoundEngine();

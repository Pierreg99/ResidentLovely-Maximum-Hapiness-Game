let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let sfx: GainNode | null = null;
let music: GainNode | null = null;
let muted = false;
let musicTimer = 0;

function ac() {
  if (!ctx) {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new C({ latencyHint: "interactive" });
    master = ctx.createGain();
    sfx = ctx.createGain();
    music = ctx.createGain();
    sfx.gain.value = 0.45;
    music.gain.value = 0.12;
    sfx.connect(master);
    music.connect(master);
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function beep(freq: number, dur: number, type: OscillatorType = "sine", vol = 0.2, slide = 0) {
  if (muted) return;
  const c = ac();
  if (!c || !sfx) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, c.currentTime);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), c.currentTime + dur);
  g.gain.setValueAtTime(0.0001, c.currentTime);
  g.gain.exponentialRampToValueAtTime(vol, c.currentTime + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  o.connect(g);
  g.connect(sfx);
  o.start();
  o.stop(c.currentTime + dur + 0.02);
}

export const audio = {
  unlock() {
    ac();
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") ac();
    });
  },
  setMuted(v: boolean) {
    muted = v;
    if (master) master.gain.setTargetAtTime(v ? 0 : 1, ac().currentTime, 0.03);
  },
  pop() {
    beep(880, 0.08, "triangle", 0.12);
  },
  deny() {
    beep(180, 0.16, "square", 0.1, -80);
  },
  pickup() {
    beep(660, 0.1, "sine", 0.14);
    beep(990, 0.12, "sine", 0.1);
  },
  craft() {
    beep(520, 0.12, "triangle", 0.12);
    beep(780, 0.16, "triangle", 0.1);
  },
  chime() {
    beep(784, 0.18, "sine", 0.14);
    beep(1174, 0.22, "sine", 0.1);
  },
  heal() {
    beep(523, 0.2, "sine", 0.12, 200);
  },
  cheer() {
    beep(523, 0.16, "triangle", 0.12);
    beep(659, 0.18, "triangle", 0.1);
    beep(784, 0.28, "sine", 0.12);
  },
  door() {
    beep(220, 0.18, "sine", 0.1, -40);
  },
  fire(kind: string) {
    if (kind === "pistol") beep(420, 0.06, "square", 0.1, 180);
    else if (kind === "shotgun") beep(140, 0.12, "sawtooth", 0.14, -60);
    else if (kind === "mortar") beep(90, 0.2, "sawtooth", 0.16, -30);
    else if (kind === "beam") beep(640 + Math.random() * 80, 0.05, "sawtooth", 0.06);
    else beep(980, 0.1, "triangle", 0.12, 240);
  },
  hit() {
    beep(300, 0.07, "square", 0.1, -120);
  },
  foot(surface: string) {
    const f = surface === "wood" ? 140 : surface === "grass" ? 90 : 180;
    beep(f + Math.random() * 30, 0.05, "sine", 0.05);
  },
  note(n: string) {
    const map: Record<string, number> = { C: 261.6, D: 293.7, E: 329.6, F: 349.2, G: 392, A: 440, B: 493.9 };
    beep(map[n] ?? 330, 0.35, "sine", 0.16);
  },
  tickMusic(dt: number) {
    if (muted) return;
    musicTimer += dt;
    if (musicTimer < 2.4) return;
    musicTimer = 0;
    const c = ac();
    if (!c || !music) return;
    const seq = [261.6, 329.6, 392, 329.6];
    seq.forEach((f, i) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = "sine";
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, c.currentTime + i * 0.28);
      g.gain.exponentialRampToValueAtTime(0.05, c.currentTime + i * 0.28 + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + i * 0.28 + 0.4);
      o.connect(g);
      g.connect(music!);
      o.start(c.currentTime + i * 0.28);
      o.stop(c.currentTime + i * 0.28 + 0.42);
    });
  },
};

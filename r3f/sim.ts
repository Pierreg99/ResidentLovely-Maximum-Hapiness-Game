import { MAPS } from "./data/maps";
import type { Dir, MapId, ViewMode, WeaponId } from "./types";

export type SimKey =
  | "KeyW"
  | "KeyA"
  | "KeyS"
  | "KeyD"
  | "ArrowUp"
  | "ArrowLeft"
  | "ArrowDown"
  | "ArrowRight"
  | "ShiftLeft"
  | "Space";

export type Projectile = {
  alive: boolean;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  damage: number;
  arcing: boolean;
  color: number;
};

export type GrumpLive = {
  id: number;
  kind: string;
  x: number;
  z: number;
  gloom: number;
  max: number;
  uplifted: boolean;
  bob: number;
  recruited: boolean;
};

export type Particle = {
  alive: boolean;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  max: number;
  color: number;
  size: number;
};

const PROJECTILE_POOL = 48;
const PARTICLE_POOL = 160;

export const sim = {
  x: 0,
  y: 0,
  z: 8,
  yaw: Math.PI,
  pitch: 0.18,
  speed: 0,
  forward: 0,
  steer: 0,
  joy: 100,
  mapId: "foyer" as MapId,
  aiming: false,
  weapon: "pistol" as WeaponId,
  fireCd: 0,
  trauma: 0,
  viewMode: "ots" as ViewMode,
  keys: new Set<string>(),
  injected: new Set<string>(),
  joyX: 0,
  joyY: 0,
  lookX: 0,
  lookY: 0,
  running: false,
  bob: 0,
  stride: 0,
  hairL: 0,
  hairR: 0,
  beamOn: false,
  interactHint: "",
  nearId: "",
  projectiles: [] as Projectile[],
  particles: [] as Particle[],
  grumps: [] as GrumpLive[],
  boss: {
    alive: false,
    x: 0,
    z: 0,
    hp: 300,
    max: 300,
    phase: 1,
    t: 0,
  },
  time: 0,
};

function makePool<T>(n: number, factory: () => T): T[] {
  return Array.from({ length: n }, factory);
}

export function resetPools() {
  sim.projectiles = makePool(PROJECTILE_POOL, () => ({
    alive: false,
    x: 0,
    y: 0,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    life: 0,
    damage: 0,
    arcing: false,
    color: 0xe8a0b0,
  }));
  sim.particles = makePool(PARTICLE_POOL, () => ({
    alive: false,
    x: 0,
    y: 0,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    life: 0,
    max: 1,
    color: 0xe8a0b0,
    size: 0.08,
  }));
}

export function spawnMapEntities(mapId: MapId) {
  const m = MAPS[mapId];
  sim.grumps = m.grumps.map((g, i) => ({
    id: i,
    kind: g.kind,
    x: g.x,
    z: g.z,
    gloom: g.gloom,
    max: g.gloom,
    uplifted: false,
    bob: Math.random() * 6,
    recruited: false,
  }));
  if (mapId === "crypt") {
    sim.boss = { alive: true, x: 0, z: -4, hp: 300, max: 300, phase: 1, t: 0 };
  } else {
    sim.boss.alive = false;
  }
}

export function spawnProjectile(p: Omit<Projectile, "alive">) {
  const slot = sim.projectiles.find((x) => !x.alive);
  if (!slot) return;
  Object.assign(slot, p, { alive: true });
}

export function spawnBurst(x: number, y: number, z: number, color: number, n = 12, power = 3) {
  let left = n;
  for (const p of sim.particles) {
    if (p.alive) continue;
    p.alive = true;
    p.x = x;
    p.y = y;
    p.z = z;
    p.vx = (Math.random() - 0.5) * power;
    p.vy = Math.random() * power * 0.8 + 0.4;
    p.vz = (Math.random() - 0.5) * power;
    p.life = 0.4 + Math.random() * 0.5;
    p.max = p.life;
    p.color = color;
    p.size = 0.05 + Math.random() * 0.08;
    left -= 1;
    if (left <= 0) break;
  }
}

export function held(code: string) {
  return sim.keys.has(code) || sim.injected.has(code);
}

export function forwardFromYaw(yaw: number) {
  return { x: -Math.sin(yaw), z: -Math.cos(yaw) };
}

export function rightFromYaw(yaw: number) {
  return { x: Math.cos(yaw), z: -Math.sin(yaw) };
}

export function doorWorld(mapId: MapId, dir: Dir) {
  const m = MAPS[mapId];
  const hx = m.w / 2 - 0.6;
  const hz = m.l / 2 - 0.6;
  if (dir === "N") return { x: 0, z: hz };
  if (dir === "S") return { x: 0, z: -hz };
  if (dir === "E") return { x: hx, z: 0 };
  if (dir === "W") return { x: -hx, z: 0 };
  if (dir === "U") return { x: 3.5, z: 3.5 };
  return { x: -3.5, z: 3.5 };
}

export function spawnFromDoor(to: MapId, fromDir: Dir) {
  const m = MAPS[to];
  const hx = m.w / 2 - 2.2;
  const hz = m.l / 2 - 2.2;
  if (fromDir === "N") return { x: 0, z: -hz, yaw: 0 };
  if (fromDir === "S") return { x: 0, z: hz, yaw: Math.PI };
  if (fromDir === "E") return { x: -hx, z: 0, yaw: -Math.PI / 2 };
  if (fromDir === "W") return { x: hx, z: 0, yaw: Math.PI / 2 };
  if (fromDir === "U") return { x: -2, z: -2, yaw: Math.PI };
  return { x: 2, z: 2, yaw: 0 };
}

resetPools();
spawnMapEntities("foyer");

import { MAPS } from "./data/maps";
import { WEAPONS } from "./data/items";
import { audio } from "./audio";
import {
  sim,
  held,
  forwardFromYaw,
  spawnProjectile,
  spawnBurst,
  type GrumpLive,
} from "./sim";
import { nearestInteract, tryDoorTransition, useGame } from "./store";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function doorOpen(dir: string) {
  const g = useGame.getState();
  const m = MAPS[sim.mapId];
  const d = m.doors.find((x) => x.dir === dir);
  if (!d) return false;
  if (g.unlocked.includes(d.to) || d.to === "foyer") return true;
  if (d.requires && g.inventory.some((s) => s && s.id === d.requires)) return true;
  if (d.requiresFlag && g.flags[d.requiresFlag]) return true;
  return false;
}

function collide(x: number, z: number) {
  const m = MAPS[sim.mapId];
  const hx = m.w / 2 - 0.75;
  const hz = m.l / 2 - 0.75;
  const gap = 1.7;
  const inGapX = Math.abs(x) < gap;
  const inGapZ = Math.abs(z) < gap;
  if (!(doorOpen("N") && inGapX && z > 0) && !(doorOpen("S") && inGapX && z < 0)) {
    z = clamp(z, -hz, hz);
  }
  if (!(doorOpen("E") && inGapZ && x > 0) && !(doorOpen("W") && inGapZ && x < 0)) {
    x = clamp(x, -hx, hx);
  }
  return { x, z };
}

export function fireWeapon() {
  const g = useGame.getState();
  if (g.ui !== "playing") return;
  const w = WEAPONS[sim.weapon];
  if (!w) return;
  if (sim.fireCd > 0 && !w.beam) return;
  sim.fireCd = w.cooldown;
  const f = forwardFromYaw(sim.yaw);
  const originY = 1.15;
  audio.fire(sim.weapon);
  sim.trauma = Math.min(1, sim.trauma + (w.arcing ? 0.45 : 0.18));
  for (let i = 0; i < w.pellets; i++) {
    const spread = (Math.random() - 0.5) * w.spread;
    const cs = Math.cos(spread);
    const sn = Math.sin(spread);
    const fx = f.x * cs - f.z * sn;
    const fz = f.x * sn + f.z * cs;
    spawnProjectile({
      x: sim.x + fx * 0.6,
      y: originY,
      z: sim.z + fz * 0.6,
      vx: fx * w.speed,
      vy: w.arcing ? 6 : 0,
      vz: fz * w.speed,
      life: 1.6,
      damage: w.damage,
      arcing: w.arcing,
      color: sim.weapon === "wand" ? 0xa8e0f0 : sim.weapon === "beam" ? 0x7ec8c4 : 0xe8a0b0,
    });
  }
  spawnBurst(sim.x + f.x, originY, sim.z + f.z, 0xffd0c0, 6, 2);
}

function hitActors(x: number, y: number, z: number, dmg: number) {
  let hit = false;
  for (const g of sim.grumps) {
    if (g.uplifted) continue;
    const dist = Math.hypot(g.x - x, g.z - z);
    if (dist < 1.15 && Math.abs(y - 0.7) < 1.4) {
      g.gloom = Math.max(0, g.gloom - dmg);
      spawnBurst(g.x, 0.8, g.z, 0xe8a0b0, 10, 3);
      audio.hit();
      hit = true;
      if (g.gloom <= 0) uplift(g);
    }
  }
  if (sim.boss.alive) {
    const dist = Math.hypot(sim.boss.x - x, sim.boss.z - z);
    if (dist < 2.4) {
      sim.boss.hp = Math.max(0, sim.boss.hp - dmg);
      spawnBurst(sim.boss.x, 1.6, sim.boss.z, 0xa8d0e8, 14, 4);
      sim.trauma = Math.min(1, sim.trauma + 0.25);
      audio.hit();
      hit = true;
      if (sim.boss.hp <= 0) {
        sim.boss.alive = false;
        useGame.getState().completeTask("q_boss", "t_boss");
        useGame.getState().addJoy(40);
        audio.cheer();
      }
    }
  }
  return hit;
}

function uplift(g: GrumpLive) {
  g.uplifted = true;
  g.gloom = 0;
  spawnBurst(g.x, 1, g.z, 0xffc8d8, 20, 4);
  useGame.getState().addJoy(12);
  audio.cheer();
  if (sim.mapId === "harbor_docks") useGame.getState().completeTask("q_harbor", "t_docks", 1);
  if (sim.mapId === "village" && !g.recruited) {
    g.recruited = true;
    useGame.getState().recruit(g.kind);
  }
}

export function tick(dt: number) {
  const ui = useGame.getState().ui;
  if (ui !== "playing") {
    sim.speed = 0;
    return;
  }
  const d = Math.min(dt, 0.1);
  sim.time += d;
  sim.fireCd = Math.max(0, sim.fireCd - d);
  sim.trauma = Math.max(0, sim.trauma - d * 1.8);

  let steer = 0;
  let throttle = 0;
  if (held("KeyA") || held("ArrowLeft")) steer += 1;
  if (held("KeyD") || held("ArrowRight")) steer -= 1;
  if (held("KeyW") || held("ArrowUp")) throttle += 1;
  if (held("KeyS") || held("ArrowDown")) throttle -= 1;
  steer += sim.joyX;
  throttle += sim.joyY;
  steer = clamp(steer, -1, 1);
  throttle = clamp(throttle, -1, 1);

  sim.yaw += sim.lookX;
  sim.pitch = clamp(sim.pitch + sim.lookY, -0.7, 0.55);
  sim.lookX = 0;
  sim.lookY = 0;

  const turn = 1.85;
  sim.yaw += steer * turn * d;
  sim.steer = steer;

  const sprint = held("ShiftLeft") ? 1.35 : 1;
  const maxSpd = 6.4 * sprint;
  const f = forwardFromYaw(sim.yaw);
  sim.x += f.x * throttle * maxSpd * d;
  sim.z += f.z * throttle * maxSpd * d;
  const c = collide(sim.x, sim.z);
  sim.x = c.x;
  sim.z = c.z;
  sim.speed = Math.abs(throttle) * maxSpd;
  sim.forward = throttle;

  sim.stride += sim.speed * d * 1.8;
  sim.bob += d * (sim.speed > 0.2 ? 10 : 2.4);
  sim.hairL += (sim.steer * 0.35 - sim.hairL) * (1 - Math.exp(-8 * d));
  sim.hairR += (-sim.steer * 0.35 - sim.hairR) * (1 - Math.exp(-8 * d));

  if (sim.speed > 0.4) {
    if (Math.floor(sim.stride) !== Math.floor(sim.stride - sim.speed * d * 1.8)) {
      const biome = MAPS[sim.mapId].biome;
      audio.foot(biome === "forest" || biome === "outdoor" ? "grass" : biome === "estate" ? "marble" : "wood");
    }
  }

  if (held("Space") || sim.beamOn) fireWeapon();

  for (const p of sim.projectiles) {
    if (!p.alive) continue;
    p.life -= d;
    if (p.arcing) p.vy -= 18 * d;
    p.x += p.vx * d;
    p.y += p.vy * d;
    p.z += p.vz * d;
    if (p.y < 0.1) {
      p.alive = false;
      spawnBurst(p.x, 0.2, p.z, p.color, 8, 2);
      continue;
    }
    if (p.life <= 0) p.alive = false;
    else if (hitActors(p.x, p.y, p.z, p.damage * d * 8)) {
      if (!WEAPONS[sim.weapon]?.beam) p.alive = false;
    }
  }

  for (const pt of sim.particles) {
    if (!pt.alive) continue;
    pt.life -= d;
    pt.x += pt.vx * d;
    pt.y += pt.vy * d;
    pt.z += pt.vz * d;
    pt.vy -= 6 * d;
    if (pt.life <= 0) pt.alive = false;
  }

  for (const g of sim.grumps) {
    g.bob += d;
    if (g.uplifted) continue;
    const dx = sim.x - g.x;
    const dz = sim.z - g.z;
    const dist = Math.hypot(dx, dz);
    if (dist < 1.0) {
      sim.joy = Math.max(0, sim.joy - 8 * d);
      sim.trauma = Math.min(1, sim.trauma + 0.2 * d);
    } else if (dist < 8) {
      g.x += (dx / dist) * 1.1 * d;
      g.z += (dz / dist) * 1.1 * d;
    }
  }

  if (sim.boss.alive) {
    sim.boss.t += d;
    const dx = sim.x - sim.boss.x;
    const dz = sim.z - sim.boss.z;
    const dist = Math.hypot(dx, dz) || 1;
    sim.boss.phase = sim.boss.hp < 100 ? 3 : sim.boss.hp < 200 ? 2 : 1;
    const spd = 1.2 + sim.boss.phase * 0.4;
    sim.boss.x += (dx / dist) * spd * d;
    sim.boss.z += (dz / dist) * spd * d;
    if (dist < 2.2) {
      sim.joy = Math.max(0, sim.joy - 14 * d);
      sim.trauma = Math.min(1, sim.trauma + 0.4 * d);
    }
  }

  if (sim.joy <= 0.2) {
    sim.joy = 42;
    useGame.getState().addJoy(42 - useGame.getState().joy);
    useGame.getState().pushToast("The chateau steadies you. Joy restored.");
  } else if (Math.abs(useGame.getState().joy - sim.joy) > 0.8) {
    useGame.setState({ joy: Math.round(sim.joy) });
  }

  const pads = typeof navigator !== "undefined" ? navigator.getGamepads?.() : null;
  const gp = pads?.[0];
  if (gp) {
    const ax = gp.axes[0] ?? 0;
    const ay = gp.axes[1] ?? 0;
    sim.joyX = Math.abs(ax) > 0.18 ? -ax : 0;
    sim.joyY = Math.abs(ay) > 0.18 ? -ay : sim.joyY;
    if (gp.buttons[0]?.pressed) fireWeapon();
    if (gp.buttons[1]?.pressed) useGame.getState().interact();
  }

  nearestInteract();
  tryDoorTransition();
  audio.tickMusic(d);
}

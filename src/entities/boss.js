import { rooms } from '../world/rooms.js';
import { audio } from '../engine/audio.js';
import { spawnConfetti } from '../world/scene.js';

/**
 * MasterChefBoss: The Grumpy Master Chef Encounter (Bakery / S07)
 * 3-Phase Tactical Patisserie Encounter (NEXUS PRIVE v6.0 Standard)
 */
export class MasterChefBoss {
  constructor() {
    this.group = new THREE.Group();
    this.group.position.set(0, 0, -4);
    this.roomName = 'bakery';
    this.sectorId = 'S07';
    this.name = 'THE GRUMPY MASTER CHEF';
    this.anger = 100;
    this.maxAnger = 100;
    this.phase = 1; // 1: Rolling Pin Waves, 2: Confectionery Barrage, 3: Sugar Valve Crisis
    this.isCalmed = false;
    this.squashTimer = 0;
    this.slamCooldown = 3.5;
    this.shockwaves = [];

    this.initMesh();
    if (rooms.bakery) rooms.bakery.add(this.group);
  }

  initMesh() {
    // Body - Chubby Chibi Chef in Apron
    this.bodyMat = new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.5, metalness: 0.1 });
    this.bodyMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.2, 2.2, 20), this.bodyMat);
    this.bodyMesh.position.y = 1.1;
    this.bodyMesh.castShadow = true;
    this.group.add(this.bodyMesh);

    // Apron (Pastel Crimson / White)
    this.apronMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.4 });
    const apron = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.25, 1.4, 20), this.apronMat);
    apron.position.y = 0.9;
    this.group.add(apron);

    // Giant Chef Toque (Hat)
    this.toqueMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const toqueRim = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.35, 20), this.toqueMat);
    toqueRim.position.y = 2.3;
    this.group.add(toqueRim);

    const toquePuff = new THREE.Mesh(new THREE.SphereGeometry(1.05, 20, 20), this.toqueMat);
    toquePuff.scale.set(1.0, 1.3, 1.0);
    toquePuff.position.y = 3.2;
    this.group.add(toquePuff);

    // Wholesome Chibi Eyes & Cheeks
    this.eyes = [];
    this.stars = [];
    for (let x of [-0.35, 0.35]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), new THREE.MeshBasicMaterial({ color: 0x0f172a }));
      eye.position.set(x, 1.6, 0.95);
      this.group.add(eye);
      this.eyes.push(eye);

      const cheek = new THREE.Mesh(new THREE.CircleGeometry(0.12, 16), new THREE.MeshBasicMaterial({ color: 0xf472b6, side: THREE.DoubleSide }));
      cheek.position.set(x * 1.4, 1.4, 0.96);
      this.group.add(cheek);

      const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.2), new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
      star.position.set(x, 1.6, 0.98);
      star.visible = false;
      this.group.add(star);
      this.stars.push(star);
    }

    // Marble Rolling Pin Weapon
    this.rollingPinGroup = new THREE.Group();
    const pinHandleMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 });
    const pinRollerMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.15, metalness: 0.3 });

    const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 2.4, 16), pinRollerMat);
    roller.rotation.z = Math.PI / 2;
    this.rollingPinGroup.add(roller);

    for (let x of [-1.5, 1.5]) {
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.6, 12), pinHandleMat);
      handle.rotation.z = Math.PI / 2;
      handle.position.x = x;
      this.rollingPinGroup.add(handle);
    }

    this.rollingPinGroup.position.set(0.9, 1.2, 0.6);
    this.rollingPinGroup.rotation.y = -0.3;
    this.group.add(this.rollingPinGroup);
  }

  takeDamage(amount, gameState, callbacks) {
    if (this.isCalmed) return;

    this.anger = Math.max(0, this.anger - amount);
    this.squashTimer = 0.25;

    // Phase Transitions
    if (this.anger <= 35 && this.phase === 2) {
      this.transitionPhase(3, callbacks);
    } else if (this.anger <= 70 && this.phase === 1) {
      this.transitionPhase(2, callbacks);
    }

    // Update Boss HUD
    const bossFill = document.getElementById('boss-health-fill');
    if (bossFill) {
      bossFill.style.width = `${(this.anger / this.maxAnger) * 100}%`;
    }

    if (this.anger <= 0 && !this.isCalmed) {
      this.calmChef(gameState, callbacks);
    }
  }

  transitionPhase(nextPhase, callbacks) {
    this.phase = nextPhase;
    audio.playCheer();
    if (nextPhase === 2) {
      if (callbacks?.onToast) callbacks.onToast('❖ CHEF PHASE 2: FLOUR BARRAGE & DOUGHBALL MINIONS!');
    } else if (nextPhase === 3) {
      if (callbacks?.onToast) callbacks.onToast('★ CHEF PHASE 3: MASTER OVEN REDLINING! EQUALIZE SUGAR VALVES! ★');
    }
  }

  calmChef(gameState, callbacks) {
    this.isCalmed = true;
    this.apronMat.color.setHex(0xf59e0b); // Golden joy apron
    this.eyes.forEach(e => e.visible = false);
    this.stars.forEach(s => s.visible = true);

    audio.playTartSuccessJingle();
    if (rooms.bakery) {
      spawnConfetti(rooms.bakery.position.clone().add(new THREE.Vector3(0, 3, 0)), 100);
    }

    if (callbacks?.onToast) callbacks.onToast('★ THE GRUMPY MASTER CHEF HAS FOUND INNER HAPPINESS! ★');

    if (gameState && callbacks?.onItemAwarded) {
      callbacks.onItemAwarded('bliss_tart');
    }
  }

  performRollingPinSlam() {
    audio.playRollingPinSlam();
    this.squashTimer = 0.45;

    const ringGeo = new THREE.RingGeometry(0.4, 0.7, 32);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const waveMesh = new THREE.Mesh(ringGeo, ringMat);
    waveMesh.position.copy(this.group.position);
    waveMesh.position.y = 0.05;
    if (rooms.bakery) rooms.bakery.add(waveMesh);

    this.shockwaves.push({
      mesh: waveMesh,
      radius: 0.6,
      maxRadius: 18.0,
      speed: 10.0,
      opacity: 0.85
    });
  }

  update(delta, time, playerPos) {
    if (this.isCalmed) {
      this.group.position.y = Math.abs(Math.sin(time * 4)) * 0.6;
      this.group.rotation.y += delta * 1.5;
      return;
    }

    this.group.position.y = Math.sin(time * 2.5) * 0.15;

    if (playerPos) {
      const dir = playerPos.clone().sub(this.group.position);
      this.group.rotation.y = Math.atan2(dir.x, dir.z);
    }

    this.slamCooldown -= delta;
    if (this.slamCooldown <= 0 && this.phase < 3) {
      this.performRollingPinSlam();
      this.slamCooldown = this.phase === 1 ? 4.2 : 2.8;
    }

    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += sw.speed * delta;
      sw.mesh.scale.set(sw.radius, sw.radius, sw.radius);
      sw.opacity = Math.max(0, 1.0 - (sw.radius / sw.maxRadius));
      sw.mesh.material.opacity = sw.opacity;

      if (sw.radius >= sw.maxRadius || sw.opacity <= 0) {
        if (sw.mesh.parent) sw.mesh.parent.remove(sw.mesh);
        sw.mesh.geometry.dispose();
        sw.mesh.material.dispose();
        this.shockwaves.splice(i, 1);
      }
    }

    if (this.squashTimer > 0) {
      this.squashTimer -= delta;
      this.bodyMesh.scale.set(1.2, 0.75, 1.2);
    } else {
      this.bodyMesh.scale.set(1, 1, 1);
    }
  }
}

/**
 * GloomBehemothBoss: Classic Crypt Boss (S18)
 */
export class GloomBehemothBoss {
  constructor() {
    this.group = new THREE.Group();
    this.group.position.set(0, 0, 0);
    this.roomName = 'crypt';
    this.sectorId = 'S18';
    this.name = 'GRAND GLOOM BEHEMOTH';
    this.hp = 300;
    this.maxHp = 300;
    this.phase = 1;
    this.isDefeated = false;
    this.squashTimer = 0;

    this.initMesh();
    if (rooms.crypt) rooms.crypt.add(this.group);
  }

  initMesh() {
    this.furMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.7, metalness: 0.2 });
    this.bodyMesh = new THREE.Mesh(new THREE.SphereGeometry(2.4, 24, 24), this.furMat);
    this.bodyMesh.position.y = 2.4;
    this.bodyMesh.castShadow = true;
    this.group.add(this.bodyMesh);

    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.15 });
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 0.9, 0.8, 8), goldMat);
    crown.position.set(0, 4.8, 0);
    this.group.add(crown);

    this.eyes = [];
    this.stars = [];
    for (let x of [-0.7, 0.7]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), new THREE.MeshBasicMaterial({ color: 0x0f172a }));
      eye.position.set(x, 2.9, 2.0);
      this.group.add(eye);
      this.eyes.push(eye);

      const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.32), new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
      star.position.set(x, 2.9, 2.05);
      star.visible = false;
      this.group.add(star);
      this.stars.push(star);
    }
  }

  takeDamage(amount, gameState, callbacks) {
    if (this.isDefeated) return;
    this.hp = Math.max(0, this.hp - amount);
    this.squashTimer = 0.25;

    const bossFill = document.getElementById('boss-health-fill');
    if (bossFill) {
      bossFill.style.width = `${(this.hp / this.maxHp) * 100}%`;
    }

    if (this.hp <= 0 && !this.isDefeated) {
      this.upliftBoss(gameState, callbacks);
    }
  }

  upliftBoss(gameState, callbacks) {
    this.isDefeated = true;
    this.furMat.color.setHex(0xf59e0b);
    this.eyes.forEach(e => e.visible = false);
    this.stars.forEach(s => s.visible = true);

    audio.playCheer();
    if (rooms.crypt) {
      spawnConfetti(rooms.crypt.position.clone().add(new THREE.Vector3(0, 4, 0)), 120);
    }

    if (callbacks?.onToast) callbacks.onToast('★ GRAND GLOOM BEHEMOTH UPLIFTED INTO ETERNAL JOY! ★');
    const victoryBanner = document.getElementById('party-banner');
    if (victoryBanner) victoryBanner.style.display = 'flex';
  }

  update(delta, time, playerPos) {
    if (this.isDefeated) {
      this.group.position.y = Math.abs(Math.sin(time * 4)) * 1.2;
      this.group.rotation.y += delta * 2.5;
      return;
    }
    this.group.position.y = Math.sin(time * 2) * 0.25;
    if (playerPos) {
      const dir = playerPos.clone().sub(this.group.position);
      this.group.rotation.y = Math.atan2(dir.x, dir.z);
    }
    if (this.squashTimer > 0) {
      this.squashTimer -= delta;
      this.bodyMesh.scale.set(1.2, 0.8, 1.2);
    } else {
      this.bodyMesh.scale.set(1, 1, 1);
    }
  }
}


/**
 * ClockworkArchivistBoss: 4F Secret Belfry Boss (S20)
 * Chrono-manipulating boss with Escapement Pendulum and Time-Warp Rewind.
 */
export class ClockworkArchivistBoss {
  constructor() {
    this.group = new THREE.Group();
    this.group.position.set(0, 24, -3);
    this.roomName = 'clock_tower_belfry';
    this.sectorId = 'S20';
    this.name = 'THE CLOCKWORK ARCHIVIST';
    this.anger = 100;
    this.maxAnger = 100;
    this.phase = 1;
    this.isCalmed = false;
    this.squashTimer = 0;
    this.gearSpinSpeed = 1.0;
    this.chronoPulseTimer = 0;

    this.initMesh();
    if (rooms.clock_tower_belfry) rooms.clock_tower_belfry.add(this.group);
  }

  initMesh() {
    // Body: Brass Mechanical Automaton
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.25, metalness: 0.85 });
    this.bodyMesh = new THREE.Mesh(new THREE.OctahedronGeometry(1.2, 2), brassMat);
    this.bodyMesh.position.y = 1.6;
    this.group.add(this.bodyMesh);

    // Rotating Escapement Gear Halo
    const gearMat = new THREE.MeshStandardMaterial({ color: 0x22d3ee, roughness: 0.2, metalness: 0.6 });
    this.gearHalo = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.12, 8, 24), gearMat);
    this.gearHalo.position.y = 1.6;
    this.group.add(this.gearHalo);

    // Glowing Cyan Optical Core
    this.coreEye = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), new THREE.MeshBasicMaterial({ color: 0x22d3ee }));
    this.coreEye.position.set(0, 1.6, 0.9);
    this.group.add(this.coreEye);
  }

  takeDamage(amount, gameState, callbacks) {
    if (this.isCalmed) return;
    this.anger = Math.max(0, this.anger - amount);
    this.squashTimer = 0.25;

    if (this.anger <= 60 && this.phase === 1) {
      this.phase = 2;
      this.gearSpinSpeed = 2.5;
      audio.playCheer();
      if (callbacks?.onToast) callbacks.onToast('★ CHRONO ARCHIVIST ENTERED PHASE 2: TEMPORAL REWIND! ★');
    } else if (this.anger <= 25 && this.phase === 2) {
      this.phase = 3;
      this.gearSpinSpeed = 4.0;
      audio.playCheer();
      if (callbacks?.onToast) callbacks.onToast('★ CHRONO ARCHIVIST ENTERED PHASE 3: ESCAPEMENT OVERLOAD! ★');
    }

    if (this.anger <= 0) {
      this.pacify(gameState, callbacks);
    }
  }

  pacify(gameState, callbacks) {
    this.isCalmed = true;
    this.coreEye.material.color.setHex(0x10b981);
    audio.playCheer();
    spawnConfetti(this.group.position.clone().add(new THREE.Vector3(0, 2, 0)), 80);
    if (callbacks?.onToast) callbacks.onToast('★ THE CLOCKWORK ARCHIVIST HAS BEEN CALMED INTO HARMONY! ★');
  }

  update(delta, time, playerPos) {
    if (this.gearHalo) {
      this.gearHalo.rotation.z += delta * this.gearSpinSpeed;
      this.gearHalo.rotation.x = Math.sin(time * 2) * 0.2;
    }
    this.group.position.y = (this.group.position.y || 24) + Math.sin(time * 3) * 0.005;
    if (playerPos) {
      const dir = playerPos.clone().sub(this.group.position);
      this.group.rotation.y = Math.atan2(dir.x, dir.z);
    }
  }
}

/**
 * PrismaticGolemBoss: B2 Crystal Vaults Boss (S31)
 * Crystal entity requiring prism weapon beam refractions to pacify.
 */
export class PrismaticGolemBoss {
  constructor() {
    this.group = new THREE.Group();
    this.group.position.set(0, -28, -4);
    this.roomName = 'crystal_vault';
    this.sectorId = 'S31';
    this.name = 'THE PRISMATIC GOLEM';
    this.anger = 100;
    this.maxAnger = 100;
    this.isCalmed = false;
    this.squashTimer = 0;

    this.initMesh();
    if (rooms.crystal_vault) rooms.crystal_vault.add(this.group);
  }

  initMesh() {
    const prismMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85
    });

    this.bodyMesh = new THREE.Mesh(new THREE.DodecahedronGeometry(1.6), prismMat);
    this.bodyMesh.position.y = 1.8;
    this.group.add(this.bodyMesh);

    // Orbiting Prismatic Shards
    this.shards = [];
    for (let i = 0; i < 4; i++) {
      const shard = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.8, 6), new THREE.MeshBasicMaterial({ color: 0x22d3ee }));
      this.group.add(shard);
      this.shards.push(shard);
    }
  }

  takeDamage(amount, gameState, callbacks) {
    if (this.isCalmed) return;
    this.anger = Math.max(0, this.anger - amount);
    this.squashTimer = 0.2;

    if (this.anger <= 0) {
      this.pacify(gameState, callbacks);
    }
  }

  pacify(gameState, callbacks) {
    this.isCalmed = true;
    this.bodyMesh.material.color.setHex(0x10b981);
    audio.playCheer();
    spawnConfetti(this.group.position.clone().add(new THREE.Vector3(0, 2, 0)), 80);
    if (callbacks?.onToast) callbacks.onToast('★ THE PRISMATIC GOLEM CONVERGED INTO RADIANT JOY! ★');
  }

  update(delta, time, playerPos) {
    if (this.shards) {
      this.shards.forEach((shard, idx) => {
        const angle = time * 2 + (idx * Math.PI / 2);
        shard.position.set(Math.cos(angle) * 2.5, 1.8 + Math.sin(time * 3 + idx) * 0.4, Math.sin(angle) * 2.5);
        shard.rotation.y = angle;
      });
    }
    if (this.bodyMesh) {
      this.bodyMesh.rotation.y += delta * 0.8;
      this.bodyMesh.rotation.x = Math.sin(time) * 0.15;
    }
  }
}

export let bossInstance = null;
export let masterChefBoss = null;
export let clockworkBoss = null;
export let prismaticBoss = null;

export function initBoss() {
  bossInstance = new GloomBehemothBoss();
  masterChefBoss = new MasterChefBoss();
  clockworkBoss = new ClockworkArchivistBoss();
  prismaticBoss = new PrismaticGolemBoss();
  return { gloom: bossInstance, chef: masterChefBoss, clockwork: clockworkBoss, prismatic: prismaticBoss };
}



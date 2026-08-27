import { scene, muzzleLight, spawnConfetti } from '../world/scene.js';
import { rooms } from '../world/rooms.js';
import { destructibles, popDestructible } from '../world/destructibles.js';
import { grumps, upliftGrump } from '../entities/grump.js';
import { player } from '../entities/player.js';
import { audio } from '../engine/audio.js';

export const projectiles = [];
export let currentTargetLock = null;

export function updateTargetSights(currentRoom) {
  if (!player.isAiming) {
    currentTargetLock = null;
    const lockBox = document.getElementById('reticle-lock-box');
    const lockTxt = document.getElementById('reticle-lock-txt');
    if (lockBox) lockBox.style.display = 'none';
    if (lockTxt) lockTxt.textContent = 'STANDBY';
    return;
  }

  const fwd = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), player.rotation);
  const pPos = player.group.position;
  let closestGrump = null;
  let closestDist = 20.0;

  grumps.forEach(g => {
    if (g.roomName !== currentRoom || g.isDancing) return;
    let wPos = g.group.position.clone();
    if (g.roomName === 'library') wPos.add(rooms.library.position);
    if (g.roomName === 'garden') wPos.add(rooms.garden.position);

    const toEnemy = wPos.clone().sub(pPos);
    const dist = toEnemy.length();

    if (dist < closestDist) {
      const angle = fwd.angleTo(toEnemy.normalize());
      if (angle < 0.42) {
        closestDist = dist;
        closestGrump = { entity: g, dist: dist.toFixed(1), name: g.type.toUpperCase() };
      }
    }
  });

  currentTargetLock = closestGrump;
  const lockBox = document.getElementById('reticle-lock-box');
  const lockTxt = document.getElementById('reticle-lock-txt');
  const rangeTxt = document.getElementById('reticle-range-txt');

  if (closestGrump) {
    if (lockBox) lockBox.style.display = 'flex';
    if (lockTxt) lockTxt.textContent = `★ LOCKED: ${closestGrump.name}`;
    if (rangeTxt) rangeTxt.textContent = `RANGE: ${closestGrump.dist}m`;
  } else {
    if (lockBox) lockBox.style.display = 'none';
  }
}

export function launchProjectile(type, origin, dir, currentRoom) {
  const pGroup = new THREE.Group();
  pGroup.position.copy(origin);

  let vel = dir.clone();
  let gravity = 0;
  let life = 2.0;
  let blastRadius = 0;

  if (type === 'pistol') {
    // Star-shaped Sparkle Dart
    const dart = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.14),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.6 })
    );
    pGroup.add(dart);
    vel.multiplyScalar(30);
    life = 1.0;
  } else if (type === 'shotgun') {
    // Iridescent Pastry Soap Bubble
    const bubble = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.75, roughness: 0.05, metalness: 0.1 })
    );
    pGroup.add(bubble);
    vel.multiplyScalar(20);
    gravity = -1.5;
    life = 1.2;
  } else if (type === 'mortar') {
    // 3D Cupcake Missile with Sparkler
    const cake = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.44, 0.42, 14),
      new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.3 })
    );
    pGroup.add(cake);

    const cherry = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 10, 10),
      new THREE.MeshBasicMaterial({ color: 0x22d3ee })
    );
    cherry.position.y = 0.35;
    pGroup.add(cherry);

    vel.multiplyScalar(17);
    vel.y += 6.5;
    gravity = -9.8;
    life = 2.5;
    blastRadius = 5.5;
  }

  scene.add(pGroup);
  projectiles.push({ mesh: pGroup, vel, gravity, life, type, blastRadius, roomName: currentRoom });
}

export function triggerWeaponFire(gameState, cameraController, callbacks) {
  audio.init();

  // Weapon recoil kickback animation
  player.meshGun.position.z = 0.22;
  setTimeout(() => { player.meshGun.position.z = 0.4; }, 90);

  // Muzzle flash point light
  const fwd = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), player.rotation);
  const muzzlePos = player.group.position.clone().add(new THREE.Vector3(0.42, 1.05, 0.75).applyAxisAngle(new THREE.Vector3(0, 1, 0), player.rotation));

  muzzleLight.position.copy(muzzlePos);
  muzzleLight.color.setHex(gameState.currentWeapon === 'mortar' ? 0xec4899 : (gameState.currentWeapon === 'shotgun' ? 0x22d3ee : 0xf59e0b));
  muzzleLight.intensity = 3.5;
  setTimeout(() => { muzzleLight.intensity = 0; }, 80);

  spawnConfetti(muzzlePos, 18);

  if (gameState.currentWeapon === 'pistol') {
    audio.playPistol();
    launchProjectile('pistol', muzzlePos, fwd, gameState.room);
  } else if (gameState.currentWeapon === 'shotgun') {
    audio.playBubbleShot();
    for (let i = -2; i <= 2; i++) {
      const spreadDir = fwd.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), i * 0.14);
      launchProjectile('shotgun', muzzlePos, spreadDir, gameState.room);
    }
  } else if (gameState.currentWeapon === 'mortar') {
    audio.playMortarFire();
    launchProjectile('mortar', muzzlePos, fwd, gameState.room);
    cameraController.addShake(0.45);
  } else if (gameState.currentWeapon === 'beam') {
    player.beamMesh.visible = true;
    audio.startBeamSound();

    checkBeamHits(muzzlePos, fwd, gameState, callbacks);

    setTimeout(() => {
      player.beamMesh.visible = false;
      audio.stopBeamSound();
    }, 350);
  }
}

function checkBeamHits(origin, dir, gameState, callbacks) {
  grumps.forEach(g => {
    if (g.roomName !== gameState.room || g.isDancing) return;

    let worldGrumpPos = g.group.position.clone();
    if (g.roomName === 'library') worldGrumpPos.add(rooms.library.position);
    if (g.roomName === 'garden') worldGrumpPos.add(rooms.garden.position);

    const toGrump = worldGrumpPos.clone().sub(origin);
    const dist = toGrump.length();

    if (dist < 14) {
      const angle = dir.angleTo(toGrump.normalize());
      if (angle < 0.38) {
        upliftGrump(g, 35, gameState, callbacks);
        spawnConfetti(worldGrumpPos, 20);
      }
    }
  });

  destructibles.forEach(d => {
    if (d.userData.roomName !== gameState.room) return;
    let worldDPos = d.position.clone();
    if (d.userData.roomName === 'library') worldDPos.add(rooms.library.position);
    if (d.userData.roomName === 'garden') worldDPos.add(rooms.garden.position);

    if (origin.distanceTo(worldDPos) < 14) {
      const angle = dir.angleTo(worldDPos.clone().sub(origin).normalize());
      if (angle < 0.38) {
        popDestructible(d, callbacks.onToast);
      }
    }
  });
}

export function updateProjectiles(delta, gameState, callbacks) {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];
    p.vel.y += p.gravity * delta;
    p.mesh.position.addScaledVector(p.vel, delta);
    p.mesh.rotation.x += delta * 4;
    p.mesh.rotation.y += delta * 4;
    p.life -= delta;

    let hit = false;
    grumps.forEach(g => {
      if (g.roomName !== p.roomName || g.isDancing) return;
      let worldGrumpPos = g.group.position.clone();
      if (g.roomName === 'library') worldGrumpPos.add(rooms.library.position);
      if (g.roomName === 'garden') worldGrumpPos.add(rooms.garden.position);

      if (p.mesh.position.distanceTo(worldGrumpPos.clone().add(new THREE.Vector3(0, 0.8, 0))) < 1.3) {
        hit = true;
        if (p.type === 'shotgun') {
          g.bubbleTrap.visible = true;
          g.group.position.y += 0.5;
          upliftGrump(g, 45, gameState, callbacks);
        } else if (p.type === 'mortar') {
          audio.playExplosion();
          spawnConfetti(p.mesh.position, 65);
          upliftGrump(g, 75, gameState, callbacks);
        } else {
          upliftGrump(g, 40, gameState, callbacks);
        }
      }
    });

    destructibles.forEach(d => {
      if (d.userData.roomName !== p.roomName) return;
      let worldDPos = d.position.clone();
      if (d.userData.roomName === 'library') worldDPos.add(rooms.library.position);
      if (d.userData.roomName === 'garden') worldDPos.add(rooms.garden.position);

      if (p.mesh.position.distanceTo(worldDPos.clone().add(new THREE.Vector3(0, 1.0, 0))) < 1.3) {
        hit = true;
        popDestructible(d, callbacks.onToast);
      }
    });

    if (p.type === 'mortar' && (p.mesh.position.y <= 0.2 || hit)) {
      audio.playExplosion();
      spawnConfetti(p.mesh.position, 65);
      grumps.forEach(g => {
        if (g.roomName === p.roomName && !g.isDancing) {
          let wPos = g.group.position.clone();
          if (g.roomName === 'library') wPos.add(rooms.library.position);
          if (g.roomName === 'garden') wPos.add(rooms.garden.position);
          if (p.mesh.position.distanceTo(wPos) < p.blastRadius) {
            upliftGrump(g, 65, gameState, callbacks);
          }
        }
      });
      hit = true;
    }

    if (hit || p.life <= 0) {
      scene.remove(p.mesh);
      projectiles.splice(i, 1);
    }
  }
}

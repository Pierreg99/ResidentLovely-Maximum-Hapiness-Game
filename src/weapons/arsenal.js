import { scene, muzzleLight, spawnConfetti } from '../world/scene.js';
import { rooms } from '../world/rooms.js';
import { destructibles, popDestructible } from '../world/destructibles.js';
import { grumps, upliftGrump } from '../entities/grump.js';
import { player } from '../entities/player.js';
import { audio } from '../engine/audio.js';

export const projectiles = [];

export function launchProjectile(type, origin, dir, currentRoom) {
  const pGroup = new THREE.Group();
  pGroup.position.copy(origin);

  let vel = dir.clone();
  let gravity = 0;
  let life = 2.0;
  let blastRadius = 0;

  if (type === 'pistol') {
    const dart = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b })
    );
    pGroup.add(dart);
    vel.multiplyScalar(28);
    life = 1.0;
  } else if (type === 'shotgun') {
    const bubble = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.7, roughness: 0.1 })
    );
    pGroup.add(bubble);
    vel.multiplyScalar(18);
    gravity = -2.0;
    life = 1.2;
  } else if (type === 'mortar') {
    const cake = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.4, 0.4, 12),
      new THREE.MeshStandardMaterial({ color: 0xec4899 })
    );
    pGroup.add(cake);
    vel.multiplyScalar(16);
    vel.y += 6.0;
    gravity = -9.8;
    life = 2.5;
    blastRadius = 5.0;
  }

  scene.add(pGroup);
  projectiles.push({ mesh: pGroup, vel, gravity, life, type, blastRadius, roomName: currentRoom });
}

export function triggerWeaponFire(gameState, cameraController, callbacks) {
  audio.init();

  // Weapon recoil kickback
  player.meshGun.position.z = 0.2;
  setTimeout(() => { player.meshGun.position.z = 0.4; }, 100);

  // Muzzle flash point light
  const fwd = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), player.rotation);
  const muzzlePos = player.group.position.clone().add(new THREE.Vector3(0.45, 1.1, 0.7).applyAxisAngle(new THREE.Vector3(0, 1, 0), player.rotation));

  muzzleLight.position.copy(muzzlePos);
  muzzleLight.color.setHex(gameState.currentWeapon === 'mortar' ? 0xec4899 : (gameState.currentWeapon === 'shotgun' ? 0x22d3ee : 0xf59e0b));
  muzzleLight.intensity = 3.0;
  setTimeout(() => { muzzleLight.intensity = 0; }, 80);

  spawnConfetti(muzzlePos, 15);

  if (gameState.currentWeapon === 'pistol') {
    audio.playPistol();
    launchProjectile('pistol', muzzlePos, fwd, gameState.room);
  } else if (gameState.currentWeapon === 'shotgun') {
    audio.playBubbleShot();
    for (let i = -2; i <= 2; i++) {
      const spreadDir = fwd.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), i * 0.12);
      launchProjectile('shotgun', muzzlePos, spreadDir, gameState.room);
    }
  } else if (gameState.currentWeapon === 'mortar') {
    audio.playMortarFire();
    launchProjectile('mortar', muzzlePos, fwd, gameState.room);
    cameraController.addShake(0.4);
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

    if (dist < 12) {
      const angle = dir.angleTo(toGrump.normalize());
      if (angle < 0.35) {
        upliftGrump(g, 30, gameState, callbacks);
        spawnConfetti(worldGrumpPos, 15);
      }
    }
  });

  destructibles.forEach(d => {
    if (d.userData.roomName !== gameState.room) return;
    let worldDPos = d.position.clone();
    if (d.userData.roomName === 'library') worldDPos.add(rooms.library.position);
    if (d.userData.roomName === 'garden') worldDPos.add(rooms.garden.position);

    if (origin.distanceTo(worldDPos) < 12) {
      const angle = dir.angleTo(worldDPos.clone().sub(origin).normalize());
      if (angle < 0.35) {
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
    p.life -= delta;

    let hit = false;
    grumps.forEach(g => {
      if (g.roomName !== p.roomName || g.isDancing) return;
      let worldGrumpPos = g.group.position.clone();
      if (g.roomName === 'library') worldGrumpPos.add(rooms.library.position);
      if (g.roomName === 'garden') worldGrumpPos.add(rooms.garden.position);

      if (p.mesh.position.distanceTo(worldGrumpPos.clone().add(new THREE.Vector3(0, 0.8, 0))) < 1.2) {
        hit = true;
        if (p.type === 'shotgun') {
          g.bubbleTrap.visible = true;
          g.group.position.y += 0.4;
          upliftGrump(g, 45, gameState, callbacks);
        } else if (p.type === 'mortar') {
          audio.playExplosion();
          spawnConfetti(p.mesh.position, 60);
          upliftGrump(g, 70, gameState, callbacks);
        } else {
          upliftGrump(g, 35, gameState, callbacks);
        }
      }
    });

    destructibles.forEach(d => {
      if (d.userData.roomName !== p.roomName) return;
      let worldDPos = d.position.clone();
      if (d.userData.roomName === 'library') worldDPos.add(rooms.library.position);
      if (d.userData.roomName === 'garden') worldDPos.add(rooms.garden.position);

      if (p.mesh.position.distanceTo(worldDPos.clone().add(new THREE.Vector3(0, 1.0, 0))) < 1.2) {
        hit = true;
        popDestructible(d, callbacks.onToast);
      }
    });

    if (p.type === 'mortar' && (p.mesh.position.y <= 0.2 || hit)) {
      audio.playExplosion();
      spawnConfetti(p.mesh.position, 60);
      grumps.forEach(g => {
        if (g.roomName === p.roomName && !g.isDancing) {
          let wPos = g.group.position.clone();
          if (g.roomName === 'library') wPos.add(rooms.library.position);
          if (g.roomName === 'garden') wPos.add(rooms.garden.position);
          if (p.mesh.position.distanceTo(wPos) < p.blastRadius) {
            upliftGrump(g, 60, gameState, callbacks);
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

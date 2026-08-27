import { rooms } from '../world/rooms.js';
import { audio } from '../engine/audio.js';
import { player } from './player.js';

export const grumps = [];

export function createGrump(pos, roomName, type = 'bear') {
  const gGroup = new THREE.Group();
  gGroup.position.copy(pos);

  let furMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.8 });
  let bodyMesh;

  if (type === 'bear') {
    bodyMesh = new THREE.Mesh(new THREE.SphereGeometry(0.65, 16, 16), furMat);
    bodyMesh.position.y = 0.65;
    gGroup.add(bodyMesh);

    const ear1 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), furMat);
    ear1.position.set(0.45, 1.2, 0);
    gGroup.add(ear1);
    const ear2 = ear1.clone();
    ear2.position.set(-0.45, 1.2, 0);
    gGroup.add(ear2);
  } else if (type === 'specter') {
    furMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, transparent: true, opacity: 0.75 });
    bodyMesh = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.5, 16), furMat);
    bodyMesh.position.y = 0.9;
    bodyMesh.rotation.x = Math.PI;
    gGroup.add(bodyMesh);
  } else if (type === 'knight') {
    furMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.7 });
    bodyMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 1.4, 16), furMat);
    bodyMesh.position.y = 0.7;
    gGroup.add(bodyMesh);

    const helm = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), furMat);
    helm.position.y = 1.6;
    gGroup.add(helm);
  }

  const barBg = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.15), new THREE.MeshBasicMaterial({ color: 0x111827 }));
  barBg.position.y = 1.8;
  gGroup.add(barBg);

  const barFill = new THREE.Mesh(new THREE.PlaneGeometry(0.01, 0.12), new THREE.MeshBasicMaterial({ color: 0xec4899 }));
  barFill.position.set(-0.58, 1.8, 0.01);
  gGroup.add(barFill);

  const bubbleTrap = new THREE.Mesh(
    new THREE.SphereGeometry(1.2, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.45, roughness: 0.1 })
  );
  bubbleTrap.position.y = 0.8;
  bubbleTrap.visible = false;
  gGroup.add(bubbleTrap);

  const grumpObj = {
    group: gGroup,
    roomName,
    type,
    happiness: 0,
    isDancing: false,
    bubbleTrap,
    furMat,
    barFill
  };

  rooms[roomName].add(gGroup);
  grumps.push(grumpObj);
  return grumpObj;
}

export function initGrumps() {
  createGrump(new THREE.Vector3(-4, 0, 0), 'foyer', 'bear');
  createGrump(new THREE.Vector3(3, 0, 4), 'foyer', 'specter');
  createGrump(new THREE.Vector3(-4, 0, -4), 'library', 'specter');
  createGrump(new THREE.Vector3(5, 0, 5), 'library', 'knight');
  createGrump(new THREE.Vector3(0, 0, -4), 'garden', 'knight');
}

export function upliftGrump(grump, amount, gameState, callbacks) {
  grump.happiness = Math.min(100, grump.happiness + amount);

  // Knockback impulse
  const knockVec = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), player.rotation).multiplyScalar(0.4);
  grump.group.position.add(knockVec);

  grump.barFill.geometry.dispose();
  grump.barFill.geometry = new THREE.PlaneGeometry((grump.happiness / 100) * 1.15, 0.12);
  grump.barFill.position.x = -0.58 + (grump.happiness / 100) * 0.575;

  if (grump.happiness >= 100 && !grump.isDancing) {
    grump.isDancing = true;
    grump.furMat.color.setHex(0xf59e0b);
    gameState.grumpsUpliftedCount++;
    audio.playCheer();
    if (callbacks.onToast) callbacks.onToast('★ GRUMP UPLIFTED! SPREADING CHEER! ★');
    if (callbacks.onGrumpUplifted) callbacks.onGrumpUplifted();
  }
}

export function updateGrumps(delta, time) {
  grumps.forEach(g => {
    if (g.isDancing) {
      g.group.position.y = Math.abs(Math.sin(time * 6)) * 0.5;
      g.group.rotation.y += delta * 3.5;
    } else {
      g.group.position.y = Math.sin(time * 2 + g.group.position.x) * 0.1;
    }
  });
}

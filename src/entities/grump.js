import { rooms } from '../world/rooms.js';
import { audio } from '../engine/audio.js';
import { player } from './player.js';
import { companionSquad } from './companion.js';
import { spawnHeartBubbles, spawnConfetti } from '../world/scene.js';

export const grumps = [];

export function createGrump(pos, roomName, type = 'bear') {
  const gGroup = new THREE.Group();
  gGroup.position.copy(pos);

  let furMat;
  let bodyMesh;
  const eyes = [];
  const stars = [];

  if (type === 'bear') {
    // 1. Gloom Teddy Bear
    furMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.8 });
    bodyMesh = new THREE.Mesh(new THREE.SphereGeometry(0.68, 20, 20), furMat);
    bodyMesh.position.y = 0.68;
    bodyMesh.castShadow = true;
    gGroup.add(bodyMesh);

    // Muzzle & Button Nose
    const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), new THREE.MeshStandardMaterial({ color: 0xbfdbfe }));
    muzzle.position.set(0, 0.65, 0.55);
    gGroup.add(muzzle);

    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), new THREE.MeshBasicMaterial({ color: 0x1e293b }));
    nose.position.set(0, 0.75, 0.74);
    gGroup.add(nose);

    // Big Teary Eyes
    for (let x of [-0.2, 0.2]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), new THREE.MeshBasicMaterial({ color: 0x0f172a }));
      eye.position.set(x, 0.85, 0.56);
      gGroup.add(eye);
      eyes.push(eye);

      const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.09), new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
      star.position.set(x, 0.85, 0.58);
      star.visible = false;
      gGroup.add(star);
      stars.push(star);

    // Floppy Bear Ears with Inner Felt
    for (let x of [-0.2, 0.2]) {
      const ear = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), furMat);
      ear.position.set(x * 2.2, 1.25, 0);
      gGroup.add(ear);

      const innerEar = new THREE.Mesh(new THREE.CircleGeometry(0.12, 12), new THREE.MeshStandardMaterial({ color: 0xbfdbfe }));
      innerEar.position.set(x * 2.2, 1.25, 0.12);
      gGroup.add(innerEar);
    }

    // Cute Red Satin Bowtie
    const bowMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.3 });
    const bowtie = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.12, 0.08), bowMat);
    bowtie.position.set(0, 0.42, 0.62);
    gGroup.add(bowtie);

    // Stitched Heart Patch on Belly
    const patchMat = new THREE.MeshStandardMaterial({ color: 0x60a5fa, roughness: 0.5 });
    const patch = new THREE.Mesh(new THREE.OctahedronGeometry(0.12), patchMat);
    patch.position.set(-0.2, 0.45, 0.58);
    gGroup.add(patch);

  } else if (type === 'bunny') {
    // 2. Pouting Lop-Eared Bunny
    furMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.6 });
    bodyMesh = new THREE.Mesh(new THREE.SphereGeometry(0.62, 20, 20), furMat);
    bodyMesh.position.y = 0.62;
    gGroup.add(bodyMesh);

    // Fluffy Cotton Tail
    const tail = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }));
    tail.position.set(0, 0.35, -0.6);
    gGroup.add(tail);

    // Long Floppy Ears & Blush Cheeks
    for (let x of [-0.28, 0.28]) {
      const ear = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.08, 0.85, 12), furMat);
      ear.position.set(x, 1.05, -0.1);
      ear.rotation.z = (x < 0 ? -0.35 : 0.35);
      gGroup.add(ear);

      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), new THREE.MeshBasicMaterial({ color: 0x0f172a }));
      eye.position.set(x * 0.7, 0.78, 0.52);
      gGroup.add(eye);
      eyes.push(eye);

      const blush = new THREE.Mesh(new THREE.CircleGeometry(0.06, 8), new THREE.MeshBasicMaterial({ color: 0xfb7185, transparent: true, opacity: 0.7 }));
      blush.position.set(x * 1.1, 0.68, 0.55);
      gGroup.add(blush);

      const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.08), new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
      star.position.set(x * 0.7, 0.78, 0.54);
      star.visible = false;
      gGroup.add(star);
      stars.push(star);
    }
  } else if (type === 'cat') {
    // 3. Somber Kitten
    furMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.5 });
    bodyMesh = new THREE.Mesh(new THREE.SphereGeometry(0.64, 20, 20), furMat);
    bodyMesh.position.y = 0.64;
    gGroup.add(bodyMesh);

    // Golden Bell Collar
    const collarMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e });
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.04, 8, 18), collarMat);
    collar.rotation.x = Math.PI / 2;
    collar.position.set(0, 0.5, 0.2);
    gGroup.add(collar);

    const bell = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9 }));
    bell.position.set(0, 0.45, 0.58);
    gGroup.add(bell);

    // Pointy Cat Ears
    for (let x of [-0.25, 0.25]) {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.35, 6), furMat);
      ear.position.set(x, 1.25, 0);
      gGroup.add(ear);

      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), new THREE.MeshBasicMaterial({ color: 0x0f172a }));
      eye.position.set(x * 0.8, 0.8, 0.54);
      gGroup.add(eye);
      eyes.push(eye);

      const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.08), new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
      star.position.set(x * 0.8, 0.8, 0.56);
      star.visible = false;
      gGroup.add(star);
      stars.push(star);
    }
  } else if (type === 'penguin') {
    // 4. Pouting Penguin with Red Knit Scarf
    furMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });
    bodyMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.58, 1.1, 16), furMat);
    bodyMesh.position.y = 0.6;
    gGroup.add(bodyMesh);

    const belly = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 16), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    belly.position.set(0, 0.55, 0.3);
    gGroup.add(belly);

    const scarfMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.8 });
    const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.08, 8, 16), scarfMat);
    scarf.rotation.x = Math.PI / 2;
    scarf.position.set(0, 0.82, 0.08);
    gGroup.add(scarf);

    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.25, 8), new THREE.MeshStandardMaterial({ color: 0xf59e0b }));
    beak.rotation.x = Math.PI / 2;
    beak.position.set(0, 0.8, 0.55);
    gGroup.add(beak);

    for (let x of [-0.18, 0.18]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), new THREE.MeshBasicMaterial({ color: 0x000000 }));
      eye.position.set(x, 0.95, 0.42);
      gGroup.add(eye);
      eyes.push(eye);

      const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.07), new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
      star.position.set(x, 0.95, 0.44);
      star.visible = false;
      gGroup.add(star);
      stars.push(star);
    }
  } else {
    // 5. Spectral Ghostling with Floating Crown
    furMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85, roughness: 0.2 });
    bodyMesh = new THREE.Mesh(new THREE.SphereGeometry(0.65, 20, 20), furMat);
    bodyMesh.position.y = 0.95;
    gGroup.add(bodyMesh);

    const crown = new THREE.Mesh(new THREE.OctahedronGeometry(0.14), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85 }));
    crown.position.set(0, 1.7, 0);
    gGroup.add(crown);

    const skirt = new THREE.Mesh(new THREE.ConeGeometry(0.65, 0.8, 16, 1, true), furMat);
    skirt.position.y = 0.45;
    gGroup.add(skirt);

    for (let x of [-0.18, 0.18]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), new THREE.MeshBasicMaterial({ color: 0x0f172a }));
      eye.position.set(x, 1.05, 0.55);
      gGroup.add(eye);
      eyes.push(eye);

      const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.08), new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
      star.position.set(x, 1.05, 0.56);
      star.visible = false;
      gGroup.add(star);
      stars.push(star);
    }
  }

  // Overhead Health Bar
  const barGroup = new THREE.Group();
  barGroup.position.set(0, 1.95, 0);

  const barBg = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.16), new THREE.MeshBasicMaterial({ color: 0x05070a, side: THREE.DoubleSide }));
  barGroup.add(barBg);

  const barFill = new THREE.Mesh(
    new THREE.PlaneGeometry(0.01, 0.12),
    new THREE.MeshBasicMaterial({ color: 0x22d3ee, side: THREE.DoubleSide })
  );
  barFill.position.set(-0.58, 0, 0.01);
  barGroup.add(barFill);
  gGroup.add(barGroup);

  // Bubble Trap Mesh (Invisible until trapped)
  const bubbleMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.6,
    roughness: 0.1,
    metalness: 0.9
  });
  const bubbleTrap = new THREE.Mesh(new THREE.SphereGeometry(1.0, 20, 20), bubbleMat);
  bubbleTrap.position.y = 0.8;
  bubbleTrap.visible = false;
  gGroup.add(bubbleTrap);

  const grumpObj = {
    group: gGroup,
    roomName,
    type,
    happiness: 0,
    isDancing: false,
    isTrapped: false,
    trappedTimer: 0,
    squashTimer: 0,
    barGroup,
    bubbleTrap,
    furMat,
    bodyMesh,
    eyes,
    stars,
    barFill
  };

  if (rooms[roomName]) rooms[roomName].add(gGroup);
  grumps.push(grumpObj);
  return grumpObj;
}

export function initGrumps() {
  createGrump(new THREE.Vector3(-4, 0, 0), 'foyer', 'bear');
  createGrump(new THREE.Vector3(3, 0, 4), 'foyer', 'bunny');
  createGrump(new THREE.Vector3(-4, 0, -4), 'library', 'cat');
  createGrump(new THREE.Vector3(5, 0, 5), 'library', 'ghost');
  createGrump(new THREE.Vector3(0, 0, -4), 'garden', 'penguin');
  createGrump(new THREE.Vector3(3, 0, -3), 'greenhouse', 'bunny');
  createGrump(new THREE.Vector3(4, 0, 4), 'dining', 'bear');
  createGrump(new THREE.Vector3(-4, 0, 4), 'gallery', 'cat');
  createGrump(new THREE.Vector3(0, 0, -4), 'observatory', 'ghost');
  createGrump(new THREE.Vector3(-3, 0, 3), 'clocktower', 'penguin');
  createGrump(new THREE.Vector3(0, 0, -3), 'mastersuite', 'bunny');
  createGrump(new THREE.Vector3(4, 0, 0), 'ballroom', 'cat');
  createGrump(new THREE.Vector3(-5, 0, 3), 'lab', 'bear');
  createGrump(new THREE.Vector3(5, 0, -4), 'lab', 'ghost');
}

export function upliftGrump(grump, amount, gameState, callbacks) {
  grump.happiness = Math.min(100, grump.happiness + amount);
  grump.squashTimer = 0.25;

  const knockVec = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), player.rotation).multiplyScalar(0.45);
  grump.group.position.add(knockVec);

  grump.barFill.geometry.dispose();
  grump.barFill.geometry = new THREE.PlaneGeometry((grump.happiness / 100) * 1.15, 0.12);
  grump.barFill.position.x = -0.58 + (grump.happiness / 100) * 0.575;

  // Emits small heart bubbles on every joyous hit
  spawnHeartBubbles(grump.group.position, 4);

  if (grump.happiness >= 100 && !grump.isDancing) {
    grump.isDancing = true;
    grump.furMat.color.setHex(0xf59e0b);

    grump.eyes.forEach(e => { e.visible = false; });
    grump.stars.forEach(s => { s.visible = true; });

    gameState.grumpsUpliftedCount++;
    companionSquad.addCompanion(grump);
    
    // Grand heart burst & celebratory kawaii chime
    spawnHeartBubbles(grump.group.position.clone().add(new THREE.Vector3(0, 1.0, 0)), 24);
    spawnConfetti(grump.group.position.clone().add(new THREE.Vector3(0, 1.2, 0)), 40);
    audio.playCheer();
    audio.playKawaiiSparkleChime();
    
    if (callbacks.onToast) callbacks.onToast('★ GRUMP UPLIFTED! JOINED JOY PARADE! ★');
    if (callbacks.onGrumpUplifted) callbacks.onGrumpUplifted();
  }
}

export function updateGrumps(delta, time, camera) {
  grumps.forEach(g => {
    if (camera && g.barGroup) {
      g.barGroup.quaternion.copy(camera.quaternion);
    }

    if (g.squashTimer > 0) {
      g.squashTimer -= delta;
      g.bodyMesh.scale.set(1.25, 0.75, 1.25);
    } else {
      g.bodyMesh.scale.set(1, 1, 1);
    }

    if (g.isDancing) {
      g.group.position.y = Math.abs(Math.sin(time * 6)) * 0.65;
      g.group.rotation.y += delta * 4.0;
    } else {
      g.group.position.y = Math.sin(time * 2.5 + g.group.position.x) * 0.12;
    }
  });
}

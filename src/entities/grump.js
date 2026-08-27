import { rooms } from '../world/rooms.js';
import { audio } from '../engine/audio.js';
import { player } from './player.js';

export const grumps = [];

export function createGrump(pos, roomName, type = 'bear') {
  const gGroup = new THREE.Group();
  gGroup.position.copy(pos);

  let furMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.8 });
  let bodyMesh;
  const eyes = [];
  const stars = [];

  if (type === 'bear') {
    // 1. Gloom Bear with Kawaii Features
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

      // Starry Eyes (Hidden until uplifted)
      const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.09), new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
      star.position.set(x, 0.85, 0.58);
      star.visible = false;
      gGroup.add(star);
      stars.push(star);

      // Rosy Blush
      const blush = new THREE.Mesh(new THREE.CircleGeometry(0.09, 12), new THREE.MeshBasicMaterial({ color: 0xf472b6, transparent: true, opacity: 0.65 }));
      blush.position.set(x * 1.7, 0.62, 0.58);
      gGroup.add(blush);

      // Floppy Bear Ears
      const ear = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), furMat);
      ear.position.set(x * 2.2, 1.25, 0);
      gGroup.add(ear);
    }
  } else if (type === 'specter') {
    // 2. Marshmallow Sighing Specter
    furMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, transparent: true, opacity: 0.8, roughness: 0.2 });
    bodyMesh = new THREE.Mesh(new THREE.SphereGeometry(0.65, 20, 20), furMat);
    bodyMesh.position.y = 0.95;
    gGroup.add(bodyMesh);

    const skirt = new THREE.Mesh(new THREE.ConeGeometry(0.65, 0.8, 16, 1, true), furMat);
    skirt.position.y = 0.45;
    gGroup.add(skirt);

    // Heart-shaped Ribbon on head
    const ribbon = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.05, 8, 16), new THREE.MeshStandardMaterial({ color: 0xec4899 }));
    ribbon.position.set(0.3, 1.45, 0.1);
    ribbon.rotation.x = Math.PI / 2;
    gGroup.add(ribbon);

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
  } else if (type === 'knight') {
    // 3. Chibi Plush Gilded Knight
    furMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.7, roughness: 0.3 });
    bodyMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.56, 1.2, 16), furMat);
    bodyMesh.position.y = 0.65;
    gGroup.add(bodyMesh);

    const helm = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.62, 0.62), furMat);
    helm.position.y = 1.5;
    gGroup.add(helm);

    // Pink Plume on Helmet
    const plume = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), new THREE.MeshStandardMaterial({ color: 0xec4899 }));
    plume.position.set(0, 1.95, -0.15);
    gGroup.add(plume);

    // Toy Cardboard Shield
    const shield = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.6, 0.45), new THREE.MeshStandardMaterial({ color: 0xf59e0b }));
    shield.position.set(-0.55, 0.75, 0.2);
    gGroup.add(shield);

    for (let x of [-0.15, 0.15]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), new THREE.MeshBasicMaterial({ color: 0x22d3ee }));
      eye.position.set(x, 1.5, 0.32);
      gGroup.add(eye);
      eyes.push(eye);

      const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.08), new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
      star.position.set(x, 1.5, 0.34);
      star.visible = false;
      gGroup.add(star);
      stars.push(star);
    }
  }

  // Overhead Billboarding Joy Health Bar Group
  const barGroup = new THREE.Group();
  barGroup.position.y = 1.9;

  const barBg = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.15), new THREE.MeshBasicMaterial({ color: 0x111827 }));
  barGroup.add(barBg);

  const barFill = new THREE.Mesh(new THREE.PlaneGeometry(0.01, 0.12), new THREE.MeshBasicMaterial({ color: 0xec4899 }));
  barFill.position.set(-0.58, 0, 0.01);
  barGroup.add(barFill);

  gGroup.add(barGroup);

  // Giant Bubble Trap Mesh
  const bubbleTrap = new THREE.Mesh(
    new THREE.SphereGeometry(1.25, 20, 20),
    new THREE.MeshStandardMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.45, roughness: 0.1 })
  );
  bubbleTrap.position.y = 0.85;
  bubbleTrap.visible = false;
  gGroup.add(bubbleTrap);

  const grumpObj = {
    group: gGroup,
    barGroup,
    roomName,
    type,
    happiness: 0,
    isDancing: false,
    squashTimer: 0,
    bubbleTrap,
    furMat,
    bodyMesh,
    eyes,
    stars,
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

  // Trigger Squash & Stretch reaction
  grump.squashTimer = 0.25;

  // Correct Knockback impulse (+Z forward away from player)
  const knockVec = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), player.rotation).multiplyScalar(0.45);
  grump.group.position.add(knockVec);

  grump.barFill.geometry.dispose();
  grump.barFill.geometry = new THREE.PlaneGeometry((grump.happiness / 100) * 1.15, 0.12);
  grump.barFill.position.x = -0.58 + (grump.happiness / 100) * 0.575;

  if (grump.happiness >= 100 && !grump.isDancing) {
    grump.isDancing = true;
    grump.furMat.color.setHex(0xf59e0b); // Golden joy color

    // Transform eyes to Starry Sparkle Eyes
    grump.eyes.forEach(e => { e.visible = false; });
    grump.stars.forEach(s => { s.visible = true; });

    gameState.grumpsUpliftedCount++;
    audio.playCheer();
    if (callbacks.onToast) callbacks.onToast('★ GRUMP UPLIFTED! SPREADING CHEER! ★');
    if (callbacks.onGrumpUplifted) callbacks.onGrumpUplifted();
  }
}

export function updateGrumps(delta, time, camera) {
  grumps.forEach(g => {
    // Billboard overhead health bar towards camera
    if (camera && g.barGroup) {
      g.barGroup.quaternion.copy(camera.quaternion);
    }

    // Handle Squash & Stretch on hit
    if (g.squashTimer > 0) {
      g.squashTimer -= delta;
      g.bodyMesh.scale.set(1.25, 0.75, 1.25);
    } else {
      g.bodyMesh.scale.set(1, 1, 1);
    }

    if (g.isDancing) {
      // Cheerful Kawaii Dance with Backflip rotation
      g.group.position.y = Math.abs(Math.sin(time * 6)) * 0.65;
      g.group.rotation.y += delta * 4.0;
    } else {
      // Gentle floating / sighing
      g.group.position.y = Math.sin(time * 2.5 + g.group.position.x) * 0.12;
    }
  });
}

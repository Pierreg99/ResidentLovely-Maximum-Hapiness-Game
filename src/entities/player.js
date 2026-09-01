import { scene, spawnSparkleFootstep } from '../world/scene.js';
import { rooms } from '../world/rooms.js';
import { input } from '../engine/input.js';
import { audio } from '../engine/audio.js';

export const player = {
  group: new THREE.Group(),
  position: new THREE.Vector3(0, 0, 8),
  rotation: 0,
  targetRotation: 0,
  isAiming: false,
  isQuickTurning: false,
  quickTurnTimer: 0,
  blinkTimer: 0,
  speed: 7.4,
  meshBody: null,
  headGroup: new THREE.Group(),
  leftLegGroup: new THREE.Group(),
  rightLegGroup: new THREE.Group(),
  leftArmGroup: new THREE.Group(),
  rightArmGroup: new THREE.Group(),
  meshGun: null,
  eyes: [],
  leftPigtail: null,
  rightPigtail: null,
  laserGuide: null,
  beamMesh: null,
  hairInertia: 0,
  setHeadVisibility: function(visible) {
    if (this.headGroup) this.headGroup.visible = visible;
  }
};

export function initPlayer() {
  const pGroup = player.group;

  // Shared Optimized Materials
  const vestMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.25 });
  const goldTrimMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.88, roughness: 0.2 });
  const bootMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.4 });
  const silverMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.1 });
  const headMat = new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.45 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.4 });
  const ribbonMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.3 });
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x09090b });
  const eyeHighlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

  // 1. Chibi Torso with Tactical Pastel Vest
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.44, 1.2, 16), vestMat);
  body.position.y = 0.65;
  body.castShadow = true;
  pGroup.add(body);
  player.meshBody = body;

  // Gold S.M.I.L.E. Belt Buckle (+Z Front)
  const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.46), goldTrimMat);
  buckle.position.set(0, 0.35, 0.2);
  pGroup.add(buckle);

  // Tactical Pouch (+X Right Hip)
  const pouch = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.25, 0.15), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
  pouch.position.set(0.38, 0.4, 0);
  pGroup.add(pouch);

  // Golden Shoulder Epaulets
  for (let sign of [-1, 1]) {
    const epaulet = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.08, 0.26), goldTrimMat);
    epaulet.position.set(sign * 0.4, 1.15, 0);
    pGroup.add(epaulet);
  }

  // Articulated Left & Right Legs
  for (let sign of [-1, 1]) {
    const legGroup = sign < 0 ? player.leftLegGroup : player.rightLegGroup;
    legGroup.position.set(sign * 0.2, 0.42, 0);

    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.26, 12), vestMat);
    thigh.position.y = -0.12;
    legGroup.add(thigh);

    const boot = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.38, 12), bootMat);
    boot.position.y = -0.32;
    boot.castShadow = true;
    legGroup.add(boot);

    const bootBuckle = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.18), silverMat);
    bootBuckle.position.set(0, -0.22, 0.08);
    legGroup.add(bootBuckle);

    pGroup.add(legGroup);
  }

  // 2. Head Group (Can be culled in ADS First-Person Mode)
  const hGroup = player.headGroup;
  pGroup.add(hGroup);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 20, 20), headMat);
  head.position.y = 1.55;
  head.castShadow = true;
  hGroup.add(head);

  // Large Glossy Anime Eyes facing +Z Front
  for (let x of [-0.16, 0.16]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), eyeMat);
    eye.scale.set(1, 1.3, 0.4);
    eye.position.set(x, 1.58, 0.38);
    hGroup.add(eye);
    player.eyes.push(eye);

    // Specular Star Highlights
    const h1 = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), eyeHighlightMat);
    h1.position.set(x - 0.03, 1.62, 0.42);
    hGroup.add(h1);

    const h2 = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), eyeHighlightMat);
    h2.position.set(x + 0.03, 1.54, 0.42);
    hGroup.add(h2);

    // Rosy Pink Blush Cheeks
    const blush = new THREE.Mesh(new THREE.CircleGeometry(0.075, 12), new THREE.MeshBasicMaterial({ color: 0xf472b6, transparent: true, opacity: 0.75 }));
    blush.position.set(x * 1.5, 1.46, 0.39);
    hGroup.add(blush);
  }

  // 3. Cyan S.M.I.L.E. Beret with Star Badge
  const beretMat = new THREE.MeshStandardMaterial({ color: 0x22d3ee, roughness: 0.3 });
  const beret = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.16, 18), beretMat);
  beret.position.set(0, 1.88, -0.05);
  beret.rotation.z = 0.12;
  hGroup.add(beret);

  const starBadge = new THREE.Mesh(new THREE.OctahedronGeometry(0.08), goldTrimMat);
  starBadge.position.set(-0.25, 1.92, 0.32);
  hGroup.add(starBadge);

  // 4. Bouncing Twin-Tail Hair Meshes with Pink Ribbon Bows (-Z Back)
  const tailGeo = new THREE.ConeGeometry(0.12, 0.6, 12);
  tailGeo.rotateX(Math.PI);

  const leftTail = new THREE.Mesh(tailGeo, hairMat);
  leftTail.position.set(-0.42, 1.55, -0.15);
  leftTail.rotation.z = -0.3;
  hGroup.add(leftTail);
  player.leftPigtail = leftTail;

  const leftBow = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.08, 0.06), ribbonMat);
  leftBow.position.set(-0.38, 1.72, -0.12);
  hGroup.add(leftBow);

  const rightTail = new THREE.Mesh(tailGeo, hairMat);
  rightTail.position.set(0.42, 1.55, -0.15);
  rightTail.rotation.z = 0.3;
  hGroup.add(rightTail);
  player.rightPigtail = rightTail;

  const rightBow = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.08, 0.06), ribbonMat);
  rightBow.position.set(0.38, 1.72, -0.12);
  hGroup.add(rightBow);

  // Articulated Arms & Tactical Wrist Cuffs
  const cuffMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3 });
  for (let sign of [-1, 1]) {
    const armGroup = sign < 0 ? player.leftArmGroup : player.rightArmGroup;
    armGroup.position.set(sign * 0.44, 1.05, 0);

    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.44, 12), vestMat);
    arm.position.y = -0.18;
    armGroup.add(arm);

    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.12, 12), cuffMat);
    cuff.position.y = -0.34;
    armGroup.add(cuff);

    const clasp = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.08), goldTrimMat);
    clasp.position.set(sign * 0.04, -0.34, 0);
    armGroup.add(clasp);

    pGroup.add(armGroup);
  }

  // 5. Custom Mk-IV Confetti Blaster with Heart Tip (+Z Forward)
  const gunGroup = new THREE.Group();
  gunGroup.position.set(0.38, 0.95, 0.35);

  const gun = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.22, 0.65), goldTrimMat);
  gunGroup.add(gun);

  const muzzleHeart = new THREE.Mesh(new THREE.OctahedronGeometry(0.09), new THREE.MeshStandardMaterial({ color: 0xec4899 }));
  muzzleHeart.position.set(0, 0, 0.35);
  gunGroup.add(muzzleHeart);

  // Laser Guide Line (+Z Forward)
  const laserGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, 16)
  ]);
  const laserMat = new THREE.LineBasicMaterial({ color: 0xec4899, transparent: true, opacity: 0.85 });
  player.laserGuide = new THREE.Line(laserGeo, laserMat);
  player.laserGuide.position.set(0, 0, 0.38);
  player.laserGuide.visible = false;
  gunGroup.add(player.laserGuide);

  // Prismatic Beam Mesh (+Z Forward)
  const beamGeo = new THREE.CylinderGeometry(0.08, 0.16, 16, 12);
  beamGeo.rotateX(Math.PI / 2);
  beamGeo.translate(0, 0, 8);
  const beamMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.75 });
  player.beamMesh = new THREE.Mesh(beamGeo, beamMat);
  player.beamMesh.position.set(0, 0, 0.38);
  player.beamMesh.visible = false;
  gunGroup.add(player.beamMesh);

  pGroup.add(gunGroup);
  player.meshGun = gunGroup;

  pGroup.position.copy(player.position);
  scene.add(pGroup);
}

export function performQuickTurn() {
  if (player.isQuickTurning) return;
  player.isQuickTurning = true;
  player.quickTurnTimer = 0.22; // 220ms quick-turn
  player.targetRotation = player.rotation + Math.PI;
  player.hairInertia = Math.PI * 0.75;
  audio.playQuickTurn();
}

export function updatePlayer(delta, time, currentRoom, cameraPitch = 0) {
  // Eye Blinking & Sharpshooter Focus Logic
  player.blinkTimer -= delta;
  if (player.blinkTimer <= 0) {
    player.eyes.forEach(e => { e.scale.y = 0.1; });
    setTimeout(() => {
      const targetScaleY = player.isAiming ? 0.95 : 1.3;
      player.eyes.forEach(e => { e.scale.y = targetScaleY; });
      player.blinkTimer = Math.random() * 3.5 + 2.5; // Next blink in 2.5-6s
    }, 120);
  } else {
    const targetScaleY = player.isAiming ? 0.95 : 1.3;
    player.eyes.forEach(e => { e.scale.y = THREE.MathUtils.lerp(e.scale.y, targetScaleY, 0.2); });
  }

  // Handle 180 Quick-Turn Animation
  if (player.isQuickTurning) {
    player.quickTurnTimer -= delta;
    player.rotation = THREE.MathUtils.lerp(player.rotation, player.targetRotation, 0.38);
    if (player.quickTurnTimer <= 0) {
      player.rotation = player.targetRotation;
      player.isQuickTurning = false;
    }
  }

  // Pitch weapon & arm positioning when aiming
  if (player.isAiming && player.meshGun) {
    player.meshGun.rotation.x = -cameraPitch * 0.8;
    if (player.leftArmGroup && player.rightArmGroup) {
      player.rightArmGroup.rotation.x = -0.85 - cameraPitch * 0.7;
      player.rightArmGroup.rotation.z = -0.25;
      player.leftArmGroup.rotation.x = -0.75 - cameraPitch * 0.7;
      player.leftArmGroup.rotation.z = 0.45;
    }
  } else if (player.meshGun) {
    player.meshGun.rotation.x = 0;
  }

  // Movement vector (+Z is Forward, -Z is Backward, +X is Strafe Right, -X is Strafe Left)
  let moveDir = new THREE.Vector3();
  if (input.keys['KeyW'] || input.keys['ArrowUp']) moveDir.z += 1;
  if (input.keys['KeyS'] || input.keys['ArrowDown']) moveDir.z -= 1;
  if (input.keys['KeyD'] || input.keys['ArrowRight']) moveDir.x += 1;
  if (input.keys['KeyA'] || input.keys['ArrowLeft']) moveDir.x -= 1;

  if (Math.abs(input.moveX) > 0.05 || Math.abs(input.moveY) > 0.05) {
    moveDir.x += input.moveX;
    moveDir.z += input.moveY;
  }

  const isMoving = moveDir.lengthSq() > 0.001;

  if (isMoving) {
    moveDir.normalize();
    const rotatedMove = moveDir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), player.rotation);
    player.position.addScaledVector(rotatedMove, player.speed * delta);

    const roomBounds = 12.5;
    let roomCenter = new THREE.Vector3(0, 0, 0);
    if (currentRoom === 'library') roomCenter = rooms.library.position;
    if (currentRoom === 'garden') roomCenter = rooms.garden.position;

    player.position.x = THREE.MathUtils.clamp(player.position.x, roomCenter.x - roomBounds, roomCenter.x + roomBounds);
    player.position.z = THREE.MathUtils.clamp(player.position.z, roomCenter.z - roomBounds, roomCenter.z + roomBounds);

    // Kawaii foot-hop, leg stride cycle, and sparkle footstep trail
    spawnSparkleFootstep(player.position);
    player.meshBody.position.y = 0.65 + Math.abs(Math.sin(time * 14)) * 0.08;
    player.headGroup.position.y = Math.abs(Math.sin(time * 14)) * 0.08;

    // Articulated Leg Stride Swing
    const stride = Math.sin(time * 14);
    if (player.leftLegGroup && player.rightLegGroup) {
      player.leftLegGroup.rotation.x = stride * 0.55;
      player.rightLegGroup.rotation.x = -stride * 0.55;
    }

    // Arm Counter-Swing (when not aiming)
    if (!player.isAiming && player.leftArmGroup && player.rightArmGroup) {
      player.leftArmGroup.rotation.x = stride * 0.35;
      player.leftArmGroup.rotation.z = 0.1;
      player.rightArmGroup.rotation.x = -stride * 0.35;
      player.rightArmGroup.rotation.z = -0.1;
    }

    // Bouncing Twin-Tail Dynamics
    if (player.leftPigtail && player.rightPigtail) {
      player.leftPigtail.rotation.x = Math.sin(time * 14) * 0.35;
      player.rightPigtail.rotation.x = -Math.sin(time * 14) * 0.35;
      player.leftPigtail.rotation.z = -0.3 + Math.sin(time * 7) * 0.15;
      player.rightPigtail.rotation.z = 0.3 - Math.sin(time * 7) * 0.15;
    }
  } else {
    // Breathing Idle Animation
    const breath = Math.sin(time * 2.5);
    player.meshBody.position.y = 0.65 + breath * 0.015;
    player.headGroup.position.y = breath * 0.015;

    // Settle legs
    if (player.leftLegGroup && player.rightLegGroup) {
      player.leftLegGroup.rotation.x = THREE.MathUtils.lerp(player.leftLegGroup.rotation.x, 0, 0.2);
      player.rightLegGroup.rotation.x = THREE.MathUtils.lerp(player.rightLegGroup.rotation.x, 0, 0.2);
    }

    // Settle arms
    if (!player.isAiming && player.leftArmGroup && player.rightArmGroup) {
      player.leftArmGroup.rotation.x = THREE.MathUtils.lerp(player.leftArmGroup.rotation.x, breath * 0.06, 0.2);
      player.leftArmGroup.rotation.z = THREE.MathUtils.lerp(player.leftArmGroup.rotation.z, 0.05, 0.2);
      player.rightArmGroup.rotation.x = THREE.MathUtils.lerp(player.rightArmGroup.rotation.x, -breath * 0.06, 0.2);
      player.rightArmGroup.rotation.z = THREE.MathUtils.lerp(player.rightArmGroup.rotation.z, -0.05, 0.2);
    }

    // Gentle Twin-Tail Sway
    if (player.leftPigtail && player.rightPigtail) {
      player.leftPigtail.rotation.x = THREE.MathUtils.lerp(player.leftPigtail.rotation.x, breath * 0.08, 0.15);
      player.rightPigtail.rotation.x = THREE.MathUtils.lerp(player.rightPigtail.rotation.x, breath * 0.08, 0.15);
      player.leftPigtail.rotation.z = THREE.MathUtils.lerp(player.leftPigtail.rotation.z, -0.3, 0.15);
      player.rightPigtail.rotation.z = THREE.MathUtils.lerp(player.rightPigtail.rotation.z, 0.3, 0.15);
    }
  }

  // Apply hair inertia during quick turns
  if (player.hairInertia > 0) {
    player.hairInertia -= delta * 3.5;
    if (player.leftPigtail && player.rightPigtail) {
      player.leftPigtail.rotation.y = Math.sin(time * 20) * player.hairInertia;
      player.rightPigtail.rotation.y = -Math.sin(time * 20) * player.hairInertia;
    }
  }

  player.group.position.copy(player.position);
  player.group.rotation.y = player.rotation;
}

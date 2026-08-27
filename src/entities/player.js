import { scene } from '../world/scene.js';
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
  speed: 7.4,
  meshBody: null,
  meshHead: null,
  meshGun: null,
  leftPigtail: null,
  rightPigtail: null,
  laserGuide: null,
  beamMesh: null
};

export function initPlayer() {
  const pGroup = player.group;

  // 1. Chibi Torso with Tactical Pastel Vest
  const vestMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.2 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.44, 1.2, 16), vestMat);
  body.position.y = 0.65;
  body.castShadow = true;
  pGroup.add(body);
  player.meshBody = body;

  // Gold S.M.I.L.E. Belt Buckle
  const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.46), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8 }));
  buckle.position.set(0, 0.35, 0.2);
  pGroup.add(buckle);

  // Tactical Pouch
  const pouch = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.25, 0.15), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
  pouch.position.set(0.38, 0.4, 0);
  pGroup.add(pouch);

  // 2. Kawaii Chibi Head
  const headMat = new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.5 });
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 20, 20), headMat);
  head.position.y = 1.55;
  head.castShadow = true;
  pGroup.add(head);
  player.meshHead = head;

  // Large Glossy Anime Eyes
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x09090b });
  const eyeHighlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

  for (let x of [-0.16, 0.16]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), eyeMat);
    eye.scale.set(1, 1.3, 0.4);
    eye.position.set(x, 1.58, 0.38);
    pGroup.add(eye);

    // Specular Star Highlight
    const h1 = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), eyeHighlightMat);
    h1.position.set(x - 0.03, 1.62, 0.42);
    pGroup.add(h1);

    const h2 = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), eyeHighlightMat);
    h2.position.set(x + 0.03, 1.54, 0.42);
    pGroup.add(h2);

    // Rosy Pink Blush Cheeks
    const blush = new THREE.Mesh(new THREE.CircleGeometry(0.07, 12), new THREE.MeshBasicMaterial({ color: 0xf472b6, transparent: true, opacity: 0.75 }));
    blush.position.set(x * 1.5, 1.46, 0.39);
    pGroup.add(blush);
  }

  // 3. Cyan S.M.I.L.E. Beret with Star Badge
  const beretMat = new THREE.MeshStandardMaterial({ color: 0x22d3ee, roughness: 0.3 });
  const beret = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.16, 18), beretMat);
  beret.position.set(0, 1.88, -0.05);
  beret.rotation.z = 0.12;
  pGroup.add(beret);

  const starBadge = new THREE.Mesh(new THREE.OctahedronGeometry(0.08), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8 }));
  starBadge.position.set(-0.25, 1.92, 0.32);
  pGroup.add(starBadge);

  // 4. Bouncing Twin-Tail Hair Meshes
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.4 });
  const tailGeo = new THREE.ConeGeometry(0.12, 0.6, 12);
  tailGeo.rotateX(Math.PI);

  const leftTail = new THREE.Mesh(tailGeo, hairMat);
  leftTail.position.set(-0.42, 1.55, -0.15);
  leftTail.rotation.z = -0.3;
  pGroup.add(leftTail);
  player.leftPigtail = leftTail;

  const rightTail = new THREE.Mesh(tailGeo, hairMat);
  rightTail.position.set(0.42, 1.55, -0.15);
  rightTail.rotation.z = 0.3;
  pGroup.add(rightTail);
  player.rightPigtail = rightTail;

  // 5. Custom Mk-IV Confetti Blaster with Heart Tip
  const gunMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.2 });
  const gun = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.22, 0.65), gunMat);
  gun.position.set(0.42, 1.05, 0.4);
  pGroup.add(gun);
  player.meshGun = gun;

  const muzzleHeart = new THREE.Mesh(new THREE.OctahedronGeometry(0.09), new THREE.MeshStandardMaterial({ color: 0xec4899 }));
  muzzleHeart.position.set(0.42, 1.05, 0.75);
  pGroup.add(muzzleHeart);

  // Laser Guide Line
  const laserGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, 14)
  ]);
  const laserMat = new THREE.LineBasicMaterial({ color: 0xec4899, transparent: true, opacity: 0.85 });
  player.laserGuide = new THREE.Line(laserGeo, laserMat);
  player.laserGuide.position.set(0.42, 1.05, 0.78);
  player.laserGuide.visible = false;
  pGroup.add(player.laserGuide);

  // Prismatic Beam Mesh
  const beamGeo = new THREE.CylinderGeometry(0.08, 0.16, 14, 12);
  beamGeo.rotateX(Math.PI / 2);
  beamGeo.translate(0, 0, 7);
  const beamMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.75 });
  player.beamMesh = new THREE.Mesh(beamGeo, beamMat);
  player.beamMesh.position.set(0.42, 1.05, 0.78);
  player.beamMesh.visible = false;
  pGroup.add(player.beamMesh);

  pGroup.position.copy(player.position);
  scene.add(pGroup);
}

export function performQuickTurn() {
  if (player.isQuickTurning) return;
  player.isQuickTurning = true;
  player.quickTurnTimer = 0.25; // 250ms turn
  player.targetRotation = player.rotation + Math.PI;
  audio.playQuickTurn();
}

export function updatePlayer(delta, time, currentRoom) {
  // Handle 180 Quick-Turn Animation
  if (player.isQuickTurning) {
    player.quickTurnTimer -= delta;
    player.rotation = THREE.MathUtils.lerp(player.rotation, player.targetRotation, 0.35);
    if (player.quickTurnTimer <= 0) {
      player.rotation = player.targetRotation;
      player.isQuickTurning = false;
    }
  }

  let moveDir = new THREE.Vector3();
  if (input.keys['KeyW'] || input.keys['ArrowUp']) moveDir.z -= 1;
  if (input.keys['KeyS'] || input.keys['ArrowDown']) moveDir.z += 1;
  if (input.keys['KeyA'] || input.keys['ArrowLeft']) moveDir.x -= 1;
  if (input.keys['KeyD'] || input.keys['ArrowRight']) moveDir.x += 1;

  if (Math.abs(input.moveX) > 0.05 || Math.abs(input.moveY) > 0.05) {
    moveDir.x += input.moveX;
    moveDir.z += input.moveY;
  }

  if (moveDir.lengthSq() > 0.001) {
    moveDir.normalize();
    const rotatedMove = moveDir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), player.rotation);
    player.position.addScaledVector(rotatedMove, player.speed * delta);

    const roomBounds = 12.5;
    let roomCenter = new THREE.Vector3(0, 0, 0);
    if (currentRoom === 'library') roomCenter = rooms.library.position;
    if (currentRoom === 'garden') roomCenter = rooms.garden.position;

    player.position.x = THREE.MathUtils.clamp(player.position.x, roomCenter.x - roomBounds, roomCenter.x + roomBounds);
    player.position.z = THREE.MathUtils.clamp(player.position.z, roomCenter.z - roomBounds, roomCenter.z + roomBounds);

    // Kawaii foot-hop and hair bounce physics
    player.meshBody.position.y = 0.65 + Math.abs(Math.sin(time * 14)) * 0.08;
    player.meshHead.position.y = 1.55 + Math.abs(Math.sin(time * 14)) * 0.08;

    if (player.leftPigtail && player.rightPigtail) {
      player.leftPigtail.rotation.x = Math.sin(time * 14) * 0.3;
      player.rightPigtail.rotation.x = -Math.sin(time * 14) * 0.3;
    }
  } else {
    player.meshBody.position.y = 0.65;
    player.meshHead.position.y = 1.55;
    if (player.leftPigtail && player.rightPigtail) {
      player.leftPigtail.rotation.x = Math.sin(time * 3) * 0.08;
      player.rightPigtail.rotation.x = Math.sin(time * 3) * 0.08;
    }
  }

  player.group.position.copy(player.position);
  player.group.rotation.y = player.rotation;
}

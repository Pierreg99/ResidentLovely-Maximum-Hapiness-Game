import { scene } from '../world/scene.js';
import { rooms } from '../world/rooms.js';
import { input } from '../engine/input.js';

export const player = {
  group: new THREE.Group(),
  position: new THREE.Vector3(0, 0, 8),
  rotation: 0,
  isAiming: false,
  speed: 7.2,
  meshBody: null,
  meshGun: null,
  laserGuide: null,
  beamMesh: null
};

export function initPlayer() {
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 1.4, 16), bodyMat);
  body.position.y = 0.7;
  body.castShadow = true;
  player.group.add(body);
  player.meshBody = body;

  const headMat = new THREE.MeshStandardMaterial({ color: 0xffedd5 });
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), headMat);
  head.position.y = 1.6;
  player.group.add(head);

  const beretMat = new THREE.MeshStandardMaterial({ color: 0x22d3ee });
  const beret = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.15, 16), beretMat);
  beret.position.set(0, 1.85, -0.05);
  beret.rotation.z = 0.15;
  player.group.add(beret);

  const gunMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8 });
  const gun = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.25, 0.7), gunMat);
  gun.position.set(0.45, 1.1, 0.4);
  player.group.add(gun);
  player.meshGun = gun;

  const laserGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, 12)
  ]);
  const laserMat = new THREE.LineBasicMaterial({ color: 0xec4899, transparent: true, opacity: 0.8 });
  player.laserGuide = new THREE.Line(laserGeo, laserMat);
  player.laserGuide.position.set(0.45, 1.1, 0.7);
  player.laserGuide.visible = false;
  player.group.add(player.laserGuide);

  const beamGeo = new THREE.CylinderGeometry(0.08, 0.15, 12, 12);
  beamGeo.rotateX(Math.PI / 2);
  beamGeo.translate(0, 0, 6);
  const beamMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.75 });
  player.beamMesh = new THREE.Mesh(beamGeo, beamMat);
  player.beamMesh.position.set(0.45, 1.1, 0.7);
  player.beamMesh.visible = false;
  player.group.add(player.beamMesh);

  player.group.position.copy(player.position);
  scene.add(player.group);
}

export function updatePlayer(delta, time, currentRoom) {
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
    player.meshBody.position.y = 0.7 + Math.sin(time * 12) * 0.05;
  } else {
    player.meshBody.position.y = 0.7;
  }

  player.group.position.copy(player.position);
  player.group.rotation.y = player.rotation;
}

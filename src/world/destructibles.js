import { rooms, spawnGroundItem } from './rooms.js';
import { spawnConfetti } from './scene.js';
import { audio } from '../engine/audio.js';

export const destructibles = [];

export function spawnBalloon(pos, roomName, colorHex = 0xec4899) {
  const bGroup = new THREE.Group();
  bGroup.position.copy(pos);
  bGroup.userData = { type: 'balloon', roomName, hp: 1 };

  const bMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 16, 16),
    new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.2, metalness: 0.1 })
  );
  bMesh.position.y = 2.2;
  bGroup.add(bMesh);

  const knot = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.15, 8), new THREE.MeshBasicMaterial({ color: colorHex }));
  knot.position.y = 1.6;
  bGroup.add(knot);

  const string = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1.6, 0)]),
    new THREE.LineBasicMaterial({ color: 0x94a3b8 })
  );
  bGroup.add(string);

  rooms[roomName].add(bGroup);
  destructibles.push(bGroup);
  return bGroup;
}

export function spawnGiftBox(pos, roomName) {
  const gGroup = new THREE.Group();
  gGroup.position.copy(pos);
  gGroup.userData = { type: 'giftbox', roomName, hp: 1 };

  const box = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.9, 0.9),
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 })
  );
  box.position.y = 0.45;
  gGroup.add(box);

  const ribbon = new THREE.Mesh(
    new THREE.BoxGeometry(0.95, 0.95, 0.2),
    new THREE.MeshStandardMaterial({ color: 0xec4899 })
  );
  ribbon.position.y = 0.45;
  gGroup.add(ribbon);

  rooms[roomName].add(gGroup);
  destructibles.push(gGroup);
  return gGroup;
}

export function initDestructibles() {
  spawnBalloon(new THREE.Vector3(7, 0, 7), 'foyer', 0xec4899);
  spawnBalloon(new THREE.Vector3(-7, 0, 7), 'foyer', 0x22d3ee);
  spawnGiftBox(new THREE.Vector3(5, 0, -8), 'foyer');
  spawnBalloon(new THREE.Vector3(-5, 0, 5), 'library', 0xa855f7);
  spawnGiftBox(new THREE.Vector3(4, 0, -4), 'library');
  spawnBalloon(new THREE.Vector3(6, 0, 6), 'garden', 0x10b981);
  spawnGiftBox(new THREE.Vector3(-6, 0, -6), 'garden');
}

export function popDestructible(d, onToast) {
  const idx = destructibles.indexOf(d);
  if (idx !== -1) {
    audio.playPop();
    let worldPos = d.position.clone();
    if (d.userData.roomName === 'library') worldPos.add(rooms.library.position);
    if (d.userData.roomName === 'garden') worldPos.add(rooms.garden.position);

    spawnConfetti(worldPos, 30);
    rooms[d.userData.roomName].remove(d);
    destructibles.splice(idx, 1);

    const dropId = Math.random() > 0.5 ? 'herb_green' : 'powder_red';
    spawnGroundItem(dropId, d.position.clone().setY(0.2), d.userData.roomName);
    if (onToast) onToast('★ DESTRUCTIBLE POPPED! TREAT DROPPED! ★');
  }
}

export function updateDestructibles(time) {
  destructibles.forEach(d => {
    if (d.userData.type === 'balloon') {
      d.position.y = Math.sin(time * 2 + d.position.x) * 0.15;
    }
  });
}

import { scene } from './scene.js';

export const rooms = {
  foyer: new THREE.Group(),
  library: new THREE.Group(),
  garden: new THREE.Group()
};

export const lanternMeshes = [];
export const groundItems = [];

function createChamberFloor(w, d, color1 = 0x090d16, color2 = 0x131d31) {
  const group = new THREE.Group();
  const tileSize = 2;
  const nx = Math.ceil(w / tileSize);
  const nz = Math.ceil(d / tileSize);
  const geo = new THREE.BoxGeometry(tileSize, 0.2, tileSize);
  const mat1 = new THREE.MeshStandardMaterial({ color: color1, roughness: 0.2, metalness: 0.2 });
  const mat2 = new THREE.MeshStandardMaterial({ color: color2, roughness: 0.2, metalness: 0.3 });

  for (let x = -nx/2; x < nx/2; x++) {
    for (let z = -nz/2; z < nz/2; z++) {
      const mat = (Math.abs(x + z) % 2 === 0) ? mat1 : mat2;
      const tile = new THREE.Mesh(geo, mat);
      tile.position.set(x * tileSize + tileSize/2, -0.1, z * tileSize + tileSize/2);
      tile.receiveShadow = true;
      group.add(tile);
    }
  }
  return group;
}

export function initRooms() {
  scene.add(rooms.foyer);
  scene.add(rooms.library);
  scene.add(rooms.garden);

  // --- 1. GRAND FOYER (Baroque Stained-Glass Mansion) ---
  (function buildFoyer() {
    const g = rooms.foyer;
    g.add(createChamberFloor(28, 28, 0x090d16, 0x131d31));

    const wallMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.6 });
    const goldTrimMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 });
    const velvetMat = new THREE.MeshStandardMaterial({ color: 0x831843, roughness: 0.8 });

    const backWall = new THREE.Mesh(new THREE.BoxGeometry(28, 9, 0.6), wallMat);
    backWall.position.set(0, 4.5, -14);
    g.add(backWall);

    // Stained-Glass Rose Window on Back Wall
    const windowFrame = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.2, 16, 32), goldTrimMat);
    windowFrame.position.set(0, 5.8, -13.6);
    g.add(windowFrame);

    const stainedGlass = new THREE.Mesh(
      new THREE.CircleGeometry(3.0, 32),
      new THREE.MeshBasicMaterial({ color: 0xec4899, transparent: true, opacity: 0.75, side: THREE.DoubleSide })
    );
    stainedGlass.position.set(0, 5.8, -13.5);
    g.add(stainedGlass);

    const frontWall = new THREE.Mesh(new THREE.BoxGeometry(28, 9, 0.6), wallMat);
    frontWall.position.set(0, 4.5, 14);
    g.add(frontWall);

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.6, 9, 28), wallMat);
    leftWall.position.set(-14, 4.5, 0);
    g.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.6, 9, 28), wallMat);
    rightWall.position.set(14, 4.5, 0);
    g.add(rightWall);

    // Gilded Rococo Crown Pillars
    for (let x of [-8, 8]) {
      for (let z of [-8, 8]) {
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.58, 9, 16), goldTrimMat);
        pillar.position.set(x, 4.5, z);
        pillar.castShadow = true;
        g.add(pillar);

        const cap = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.3, 1.3), goldTrimMat);
        cap.position.set(x, 8.8, z);
        g.add(cap);
      }
    }

    // Grand Staircase
    const stairGroup = new THREE.Group();
    for (let i = 0; i < 9; i++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.35, 0.8), goldTrimMat);
      step.position.set(0, i * 0.35, -9.5 - i * 0.4);
      step.receiveShadow = true;
      stairGroup.add(step);

      const runner = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.37, 0.82), velvetMat);
      runner.position.set(0, i * 0.35, -9.5 - i * 0.4);
      stairGroup.add(runner);
    }
    g.add(stairGroup);

    // Grand Concert Piano with High-Gloss Lacquer
    const pianoGroup = new THREE.Group();
    pianoGroup.name = 'grand_piano';
    const pianoBodyMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.1, metalness: 0.4 });

    const mainBox = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.8, 3.2), pianoBodyMat);
    mainBox.position.set(0, 1.4, 0);
    pianoGroup.add(mainBox);

    const wing = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.8, 16, 1, false, 0, Math.PI), pianoBodyMat);
    wing.position.set(-0.6, 1.4, -0.6);
    wing.rotation.y = Math.PI / 2;
    pianoGroup.add(wing);

    for (let pos of [[-0.9, 0.6, 1.2], [0.9, 0.6, 1.2], [0, 0.6, -1.2]]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 1.2, 12), goldTrimMat);
      leg.position.set(pos[0], pos[1], pos[2]);
      pianoGroup.add(leg);
    }

    const keybed = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.15, 0.6), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 }));
    keybed.position.set(0, 1.4, 1.6);
    pianoGroup.add(keybed);

    const blackKeys = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.22, 0.35), new THREE.MeshStandardMaterial({ color: 0x18181b }));
    blackKeys.position.set(0, 1.45, 1.45);
    pianoGroup.add(blackKeys);

    const sheet = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.6), new THREE.MeshBasicMaterial({ color: 0x22d3ee, side: THREE.DoubleSide }));
    sheet.position.set(0, 2.1, 1.3);
    sheet.rotation.x = -0.3;
    pianoGroup.add(sheet);

    pianoGroup.position.set(6.5, 0, -4);
    pianoGroup.rotation.y = -Math.PI / 4;
    g.add(pianoGroup);

    // Golden Gramophone Save Station
    const gramophone = new THREE.Group();
    gramophone.name = 'gramophone_save';
    const table = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.1, 1.2, 16), goldTrimMat);
    table.position.y = 0.6;
    gramophone.add(table);

    const horn = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.3, 16, 1, true), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.15, side: THREE.DoubleSide }));
    horn.rotation.x = Math.PI / 4;
    horn.position.set(0, 1.85, 0.3);
    gramophone.add(horn);

    const record = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.05, 16), new THREE.MeshBasicMaterial({ color: 0x09090b }));
    record.position.set(0, 1.25, 0);
    gramophone.add(record);

    gramophone.position.set(-8.5, 0, -8.5);
    g.add(gramophone);

    // Doors
    const doorEast = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4.2, 2.6), new THREE.MeshStandardMaterial({ color: 0xec4899, metalness: 0.5, roughness: 0.2 }));
    doorEast.position.set(13.8, 2.1, 0);
    doorEast.name = 'door_library';
    g.add(doorEast);

    const doorWest = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4.2, 2.6), new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.5, roughness: 0.2 }));
    doorWest.position.set(-13.8, 2.1, 0);
    doorWest.name = 'door_garden';
    g.add(doorWest);
  })();

  // --- 2. EAST WING: LIBRARY OF HARMONY ---
  (function buildLibrary() {
    const g = rooms.library;
    g.position.set(45, 0, 0);
    g.add(createChamberFloor(24, 24, 0x1c1917, 0x292524));

    const bookMat = new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.8 });
    const goldTrimMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 });

    for (let z = -8; z <= 8; z += 4) {
      const shelfL = new THREE.Mesh(new THREE.BoxGeometry(1.0, 7.5, 3.4), bookMat);
      shelfL.position.set(-10.5, 3.75, z);
      g.add(shelfL);

      const shelfR = new THREE.Mesh(new THREE.BoxGeometry(1.0, 7.5, 3.4), bookMat);
      shelfR.position.set(10.5, 3.75, z);
      g.add(shelfR);
    }

    // Golden Alchemical Cauldron
    const cauldronGroup = new THREE.Group();
    cauldronGroup.name = 'golden_cauldron';

    const stoneHearth = new THREE.Mesh(new THREE.CylinderGeometry(2, 2.2, 0.4, 16), new THREE.MeshStandardMaterial({ color: 0x44403c }));
    stoneHearth.position.y = 0.2;
    cauldronGroup.add(stoneHearth);

    const pot = new THREE.Mesh(new THREE.SphereGeometry(1.2, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.75), goldTrimMat);
    pot.position.y = 1.2;
    pot.rotation.x = Math.PI;
    cauldronGroup.add(pot);

    const liquid = new THREE.Mesh(new THREE.CircleGeometry(1.0, 16), new THREE.MeshStandardMaterial({ color: 0xec4899, emissive: 0xec4899, emissiveIntensity: 0.8 }));
    liquid.rotation.x = -Math.PI / 2;
    liquid.position.y = 1.4;
    cauldronGroup.add(liquid);

    cauldronGroup.position.set(0, 0, -6);
    g.add(cauldronGroup);

    // Study Desk
    const desk = new THREE.Mesh(new THREE.BoxGeometry(4.5, 1.2, 2.5), new THREE.MeshStandardMaterial({ color: 0x451a03 }));
    desk.position.set(0, 0.6, 3);
    g.add(desk);

    const doorFoyer = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4.2, 2.6), new THREE.MeshStandardMaterial({ color: 0x22d3ee }));
    doorFoyer.position.set(-11.8, 2.1, 0);
    doorFoyer.name = 'door_foyer_from_lib';
    g.add(doorFoyer);
  })();

  // --- 3. WEST WING: SOLARIUM GARDEN (Blossoming Roses & Crystal Columns) ---
  (function buildGarden() {
    const g = rooms.garden;
    g.position.set(-45, 0, 0);
    g.add(createChamberFloor(26, 26, 0x064e3b, 0x047857));

    const glassMat = new THREE.MeshStandardMaterial({ color: 0x6ee7b7, roughness: 0.1, transparent: true, opacity: 0.45 });
    for (let x = -10; x <= 10; x += 5) {
      for (let z = -10; z <= 10; z += 5) {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 8, 14), glassMat);
        col.position.set(x, 4, z);
        g.add(col);
      }
    }

    // Tiered Fountain
    const fountainBase = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.5, 0.8, 24), new THREE.MeshStandardMaterial({ color: 0x22d3ee, roughness: 0.2 }));
    fountainBase.position.set(0, 0.4, 0);
    g.add(fountainBase);

    const fountainSpire = new THREE.Mesh(new THREE.ConeGeometry(1.6, 2.5, 16), new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.4 }));
    fountainSpire.position.set(0, 2.2, 0);
    g.add(fountainSpire);

    // Kawaii Rose Bushes
    const bushMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.7 });
    const roseMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, emissive: 0xf472b6, emissiveIntensity: 0.3 });

    for (let x of [-7, 7]) {
      for (let z of [-7, 7]) {
        const bush = new THREE.Mesh(new THREE.SphereGeometry(0.9, 12, 12), bushMat);
        bush.position.set(x, 0.6, z);
        g.add(bush);

        const flower = new THREE.Mesh(new THREE.OctahedronGeometry(0.2), roseMat);
        flower.position.set(x, 1.4, z);
        g.add(flower);
      }
    }

    const lanternPositions = [
      [0, 0, -6],
      [0, 0, 6],
      [-6, 0, 0],
      [6, 0, 0]
    ];

    lanternPositions.forEach((pos, idx) => {
      const lGroup = new THREE.Group();
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 2.2, 12), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85 }));
      post.position.y = 1.1;
      lGroup.add(post);

      const flameMesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.38), new THREE.MeshBasicMaterial({ color: 0x475569 }));
      flameMesh.position.y = 2.4;
      lGroup.add(flameMesh);

      lGroup.position.set(pos[0], pos[1], pos[2]);
      g.add(lGroup);
      lanternMeshes.push({ group: lGroup, flame: flameMesh, lit: false, index: idx });
    });

    const doorFoyer2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4.2, 2.6), new THREE.MeshStandardMaterial({ color: 0x22d3ee }));
    doorFoyer2.position.set(12.8, 2.1, 0);
    doorFoyer2.name = 'door_foyer_from_garden';
    g.add(doorFoyer2);
  })();

  // Starter Items
  spawnGroundItem('herb_green', new THREE.Vector3(7, 0.2, 6), 'foyer');
  spawnGroundItem('powder_red', new THREE.Vector3(-7, 0.2, 6), 'foyer');
  spawnGroundItem('tome_scroll', new THREE.Vector3(0, 1.4, 3), 'library');
  spawnGroundItem('herb_green', new THREE.Vector3(5, 0.2, -6), 'garden');
}

export function spawnGroundItem(itemId, pos, roomName) {
  const group = new THREE.Group();
  group.position.copy(pos);
  group.userData = { itemId, roomName };

  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(0.48, 0.05, 8, 24),
    new THREE.MeshBasicMaterial({ color: 0x22d3ee, wireframe: true })
  );
  halo.rotation.x = Math.PI / 2;
  group.add(halo);

  const core = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.36),
    new THREE.MeshStandardMaterial({
      color: (itemId.includes('herb') ? 0x10b981 : (itemId.includes('key') ? 0xf59e0b : 0xec4899)),
      emissive: 0x22d3ee,
      emissiveIntensity: 0.5
    })
  );
  core.position.y = 0.45;
  group.add(core);

  rooms[roomName].add(group);
  groundItems.push(group);
  return group;
}

export function updateGroundItems(delta, time) {
  groundItems.forEach(item => {
    item.rotation.y += delta * 1.6;
    item.position.y = 0.2 + Math.sin(time * 3 + item.position.x) * 0.09;
  });
}

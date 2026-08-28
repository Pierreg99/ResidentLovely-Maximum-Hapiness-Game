import { scene } from './scene.js';

export const rooms = {
  foyer: new THREE.Group(),
  library: new THREE.Group(),
  garden: new THREE.Group(),
  greenhouse: new THREE.Group(),
  dining: new THREE.Group(),
  gallery: new THREE.Group(),
  observatory: new THREE.Group(),
  clocktower: new THREE.Group(),
  mastersuite: new THREE.Group(),
  ballroom: new THREE.Group(),
  lab: new THREE.Group(),
  crypt: new THREE.Group()
};

export const lanternMeshes = [];
export const groundItems = [];
export const animatedWaterMeshes = [];
export const animatedAstrolabeRings = [];
export const animatedClockGears = [];
export const animatedLabGears = [];
export const animatedBallroomCrystals = [];
export let animatedCausticFloor = null;

function createChamberFloor(w, d, color1 = 0x090d16, color2 = 0x131d31) {
  const group = new THREE.Group();
  const tileSize = 2;
  const nx = Math.ceil(w / tileSize);
  const nz = Math.ceil(d / tileSize);
  const geo = new THREE.BoxGeometry(tileSize, 0.2, tileSize);
  const mat1 = new THREE.MeshStandardMaterial({ color: color1, roughness: 0.18, metalness: 0.25 });
  const mat2 = new THREE.MeshStandardMaterial({ color: color2, roughness: 0.18, metalness: 0.35 });

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

function createFramedPainting(w, h, frameMat, innerColor) {
  const g = new THREE.Group();
  const frame = new THREE.Mesh(new THREE.BoxGeometry(w + 0.3, h + 0.3, 0.1), frameMat);
  g.add(frame);
  const canvas = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ color: innerColor, roughness: 0.4 }));
  canvas.position.z = 0.06;
  g.add(canvas);
  return g;
}

export function initRooms() {
  Object.values(rooms).forEach(r => scene.add(r));

  const goldTrimMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.88, roughness: 0.18 });
  const velvetMat = new THREE.MeshStandardMaterial({ color: 0x831843, roughness: 0.8 });
  const obsidianMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.1, metalness: 0.45 });
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.6 });

  // ==========================================
  // --- 1. GRAND FOYER (1F + 2F MEZZANINE) ---
  // ==========================================
  (function buildFoyer() {
    const g = rooms.foyer;
    g.add(createChamberFloor(28, 28, 0x090d16, 0x131d31));

    // Walls
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(28, 12, 0.6), wallMat);
    backWall.position.set(0, 6, -14);
    g.add(backWall);

    const frontWall = new THREE.Mesh(new THREE.BoxGeometry(28, 12, 0.6), wallMat);
    frontWall.position.set(0, 6, 14);
    g.add(frontWall);

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.6, 12, 28), wallMat);
    leftWall.position.set(-14, 6, 0);
    g.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.6, 12, 28), wallMat);
    rightWall.position.set(14, 6, 0);
    g.add(rightWall);

    // Stained-Glass Rose Window
    const windowFrame = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.25, 16, 32), goldTrimMat);
    windowFrame.position.set(0, 7.5, -13.6);
    g.add(windowFrame);

    const stainedGlass = new THREE.Mesh(
      new THREE.CircleGeometry(3.4, 32),
      new THREE.MeshBasicMaterial({ color: 0xec4899, transparent: true, opacity: 0.75, side: THREE.DoubleSide })
    );
    stainedGlass.position.set(0, 7.5, -13.5);
    g.add(stainedGlass);

    // Animated Caustic Floor
    const causticGeo = new THREE.PlaneGeometry(16, 16);
    const causticMat = new THREE.MeshBasicMaterial({
      color: 0xec4899,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    animatedCausticFloor = new THREE.Mesh(causticGeo, causticMat);
    animatedCausticFloor.rotation.x = -Math.PI / 2;
    animatedCausticFloor.position.set(0, 0.02, 0);
    g.add(animatedCausticFloor);

    // Grand Staircase
    const stairGroup = new THREE.Group();
    for (let i = 0; i < 14; i++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.32, 0.65), goldTrimMat);
      step.position.set(0, i * 0.3, -5.5 - i * 0.55);
      step.receiveShadow = true;
      stairGroup.add(step);

      const runner = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.34, 0.67), velvetMat);
      runner.position.set(0, i * 0.3, -5.5 - i * 0.55);
      stairGroup.add(runner);
    }
    g.add(stairGroup);

    // 2F Mezzanine Balconies
    const mezzanineFloorMat = new THREE.MeshStandardMaterial({ color: 0x131d31, roughness: 0.2, metalness: 0.3 });
    const northWalkway = new THREE.Mesh(new THREE.BoxGeometry(26, 0.3, 3.5), mezzanineFloorMat);
    northWalkway.position.set(0, 4.2, -12);
    g.add(northWalkway);

    const eastWalkway = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.3, 24), mezzanineFloorMat);
    eastWalkway.position.set(12, 4.2, 0);
    g.add(eastWalkway);

    const westWalkway = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.3, 24), mezzanineFloorMat);
    westWalkway.position.set(-12, 4.2, 0);
    g.add(westWalkway);

    // Piano & Gramophone
    const pianoGroup = new THREE.Group();
    pianoGroup.name = 'grand_piano';
    const mainBox = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.8, 3.2), obsidianMat);
    mainBox.position.set(0, 1.4, 0);
    pianoGroup.add(mainBox);
    pianoGroup.position.set(6.5, 0, -3);
    pianoGroup.rotation.y = -Math.PI / 4;
    g.add(pianoGroup);

    const gramophone = new THREE.Group();
    const table = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.1, 1.2, 16), goldTrimMat);
    table.position.y = 0.6;
    gramophone.add(table);
    const horn = new THREE.Mesh(new THREE.ConeGeometry(0.65, 1.35, 16, 1, true), goldTrimMat);
    horn.rotation.x = Math.PI / 4;
    horn.position.set(0, 1.85, 0.3);
    gramophone.add(horn);
    gramophone.position.set(-8.5, 0, -8.5);
    g.add(gramophone);
  })();

  // ===============================================
  // --- 2. EAST WING 1F: LIBRARY OF HARMONY ---
  // ===============================================
  (function buildLibrary() {
    const g = rooms.library;
    g.position.set(45, 0, 0);
    g.add(createChamberFloor(24, 24, 0x1c1917, 0x292524));

    const bookMat = new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.8 });
    for (let z = -8; z <= 8; z += 4) {
      const shelfL = new THREE.Mesh(new THREE.BoxGeometry(1.0, 7.5, 3.4), bookMat);
      shelfL.position.set(-10.5, 3.75, z);
      g.add(shelfL);
      const shelfR = new THREE.Mesh(new THREE.BoxGeometry(1.0, 7.5, 3.4), bookMat);
      shelfR.position.set(10.5, 3.75, z);
      g.add(shelfR);
    }

    // Golden Cauldron
    const cauldronGroup = new THREE.Group();
    const pot = new THREE.Mesh(new THREE.SphereGeometry(1.2, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.75), goldTrimMat);
    pot.position.y = 1.2;
    pot.rotation.x = Math.PI;
    cauldronGroup.add(pot);
    cauldronGroup.position.set(0, 0, -6);
    g.add(cauldronGroup);
  })();

  // =========================================================
  // --- 3. WEST WING 1F: SOLARIUM GARDEN (FOUNTAIN & ROSES) ---
  // =========================================================
  (function buildGarden() {
    const g = rooms.garden;
    g.position.set(-45, 0, 0);
    g.add(createChamberFloor(26, 26, 0x064e3b, 0x047857));

    const fountainBase = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.5, 0.8, 24), new THREE.MeshStandardMaterial({ color: 0x22d3ee, roughness: 0.2 }));
    fountainBase.position.set(0, 0.4, 0);
    g.add(fountainBase);

    const waterRing = new THREE.Mesh(
      new THREE.RingGeometry(1.8, 3.8, 24),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.65, side: THREE.DoubleSide })
    );
    waterRing.rotation.x = -Math.PI / 2;
    waterRing.position.y = 0.75;
    g.add(waterRing);
    animatedWaterMeshes.push(waterRing);

    // 4 Heart Lanterns
    [[-6, 0, 0], [6, 0, 0], [0, 0, -6], [0, 0, 6]].forEach((pos, idx) => {
      const lGroup = new THREE.Group();
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 2.2, 12), goldTrimMat);
      post.position.y = 1.1;
      lGroup.add(post);
      const flame = new THREE.Mesh(new THREE.OctahedronGeometry(0.38), new THREE.MeshBasicMaterial({ color: 0x475569 }));
      flame.position.y = 2.4;
      lGroup.add(flame);
      lGroup.position.set(pos[0], pos[1], pos[2]);
      g.add(lGroup);
      lanternMeshes.push({ group: lGroup, flame, lit: false, index: idx });
    });
  })();

  // ==============================================================
  // --- 4. NORTH 1F: COURTYARD TEA GREENHOUSE & PRISMATIC SUGAR ---
  // ==============================================================
  (function buildGreenhouse() {
    const g = rooms.greenhouse;
    g.position.set(0, 0, 45);
    g.add(createChamberFloor(26, 26, 0x064e3b, 0x065f46));

    const glassMat = new THREE.MeshStandardMaterial({ color: 0x6ee7b7, roughness: 0.1, transparent: true, opacity: 0.4 });
    const dome = new THREE.Mesh(new THREE.SphereGeometry(10, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), glassMat);
    g.add(dome);

    // Sugar Crystal Cluster
    const sugarNode = new THREE.Group();
    sugarNode.name = 'sugar_crystal_node';
    const cMat = new THREE.MeshStandardMaterial({ color: 0xec4899, emissive: 0xd946ef, emissiveIntensity: 0.6 });
    for (let i = 0; i < 6; i++) {
      const spire = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.8, 6), cMat);
      spire.position.set(Math.cos(i) * 0.6, 0.9, Math.sin(i) * 0.6);
      sugarNode.add(spire);
    }
    sugarNode.position.set(5, 0, 4);
    g.add(sugarNode);
  })();

  // ==============================================================
  // --- 5. EAST 1F: GRAND DINING BANQUET HALL OF JOY ---
  // ==============================================================
  (function buildDining() {
    const g = rooms.dining;
    g.position.set(45, 0, 45);
    g.add(createChamberFloor(26, 26, 0x1e1b4b, 0x312e81));

    // Long Royal Banquet Table
    const table = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.8, 14.0), obsidianMat);
    table.position.set(0, 0.8, 0);
    g.add(table);

    const runner = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.82, 13.8), velvetMat);
    runner.position.set(0, 0.8, 0);
    g.add(runner);

    // Gilded Candelabras & Banquet Treats
    for (let z of [-4, 0, 4]) {
      const cand = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.22, 1.4, 8), goldTrimMat);
      cand.position.set(0, 1.9, z);
      g.add(cand);
    }
  })();

  // ==============================================================
  // --- 6. WEST 1F: HALL OF WHOLESOME PORTRAITS ---
  // ==============================================================
  (function buildGallery() {
    const g = rooms.gallery;
    g.position.set(-45, 0, 45);
    g.add(createChamberFloor(26, 26, 0x18181b, 0x27272a));

    const colors = [0x22d3ee, 0xf59e0b, 0x10b981, 0xec4899, 0xa855f7];
    colors.forEach((c, idx) => {
      const p = createFramedPainting(2.4, 3.4, goldTrimMat, c);
      p.position.set(-11.8, 4.0, (idx - 2) * 4.5);
      p.rotation.y = Math.PI / 2;
      g.add(p);
    });
  })();

  // ==============================================================
  // --- 7. EAST WING 2F: CELESTIAL OBSERVATORY & ASTROLABE ---
  // ==============================================================
  (function buildObservatory() {
    const g = rooms.observatory;
    g.position.set(45, 12, 0);
    g.add(createChamberFloor(24, 24, 0x05070a, 0x0f172a));

    const brassMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95, roughness: 0.15 });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.08, 12, 32), brassMat);
    ring1.position.y = 2.4;
    g.add(ring1);
    animatedAstrolabeRings.push({ mesh: ring1, axis: 'y', speed: 0.4 });

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.07, 12, 32), brassMat);
    ring2.position.y = 2.4;
    ring2.rotation.x = Math.PI / 4;
    g.add(ring2);
    animatedAstrolabeRings.push({ mesh: ring2, axis: 'x', speed: -0.6 });
  })();

  // ==============================================================
  // --- 8. WEST WING 2F: CLOCKTOWER SWEET SUITE ---
  // ==============================================================
  (function buildClocktower() {
    const g = rooms.clocktower;
    g.position.set(-45, 12, 0);
    g.add(createChamberFloor(24, 24, 0x271c19, 0x3d271d));

    const clockDial = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.6, 0.2, 32), goldTrimMat);
    clockDial.rotation.x = Math.PI / 2;
    clockDial.position.set(0, 5.5, -11.6);
    g.add(clockDial);

    const gearMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.15, 12), goldTrimMat);
    gearMesh.position.set(0, 5.5, -11.4);
    gearMesh.rotation.x = Math.PI / 2;
    g.add(gearMesh);
    animatedClockGears.push({ mesh: gearMesh, speed: 0.8 });

    const pendulumRod = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.2, 8), goldTrimMat);
    pendulumRod.position.set(0, 2.5, -11.4);
    g.add(pendulumRod);
    animatedClockGears.push({ mesh: pendulumRod, pendulum: true });
  })();

  // ==============================================================
  // --- 9. NORTH 2F: ROYAL VELVET MASTER SUITE & BALCONY ---
  // ==============================================================
  (function buildMasterSuite() {
    const g = rooms.mastersuite;
    g.position.set(0, 12, 45);
    g.add(createChamberFloor(24, 24, 0x3b0764, 0x581c87));

    const canopyBed = new THREE.Mesh(new THREE.BoxGeometry(5.0, 1.0, 6.0), velvetMat);
    canopyBed.position.set(0, 0.8, -4);
    g.add(canopyBed);
  })();

  // ==============================================================
  // --- 10. SOUTH 2F: GRAND CRYSTAL BALLROOM ---
  // ==============================================================
  (function buildBallroom() {
    const g = rooms.ballroom;
    g.position.set(0, 12, -45);
    g.add(createChamberFloor(26, 26, 0x0284c7, 0x0369a1));

    // Starlight Disco Chandelier
    const disco = new THREE.Mesh(new THREE.SphereGeometry(1.6, 16, 16), new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.95, roughness: 0.05 }));
    disco.position.set(0, 7.5, 0);
    g.add(disco);
    animatedBallroomCrystals.push(disco);
  })();

  // ==============================================================
  // --- 11. SUBTERRANEAN B1: SUGAR ALCHEMY LAB & JOY DYNAMO ---
  // ==============================================================
  (function buildLab() {
    const g = rooms.lab;
    g.position.set(0, -14, -45);
    g.add(createChamberFloor(26, 26, 0x09090b, 0x171717));

    const pipeMatCyan = new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x06b6d4, emissiveIntensity: 0.6 });
    for (let y of [3.5, 6.0]) {
      const pipeL = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 24, 16), pipeMatCyan);
      pipeL.rotation.z = Math.PI / 2;
      pipeL.position.set(0, y, -12.6);
      g.add(pipeL);
    }

    const dynamoCore = new THREE.Mesh(new THREE.SphereGeometry(1.6, 24, 24), new THREE.MeshStandardMaterial({ color: 0x22d3ee, emissive: 0x06b6d4, emissiveIntensity: 0.75 }));
    dynamoCore.position.set(0, 2.2, -3);
    g.add(dynamoCore);
  })();

  // ==============================================================
  // --- 12. SUBTERRANEAN B2: ANCIENT RELIC CRYPT & BOSS ARENA ---
  // ==============================================================
  (function buildCrypt() {
    const g = rooms.crypt;
    g.position.set(0, -28, -45);
    g.add(createChamberFloor(28, 28, 0x020617, 0x0f172a));

    // Luminescent Crystal Pillars (Arena Corners)
    const cryoCrystalMat = new THREE.MeshStandardMaterial({ color: 0x22d3ee, emissive: 0x0891b2, emissiveIntensity: 0.8, roughness: 0.1 });
    for (let x of [-9, 9]) {
      for (let z of [-9, 9]) {
        const spire = new THREE.Mesh(new THREE.OctahedronGeometry(1.2), cryoCrystalMat);
        spire.scale.set(0.8, 3.5, 0.8);
        spire.position.set(x, 3.0, z);
        g.add(spire);
      }
    }
  })();

  // Starter Items
  spawnGroundItem('herb_green', new THREE.Vector3(7, 0.2, 6), 'foyer');
  spawnGroundItem('powder_red', new THREE.Vector3(-7, 0.2, 6), 'foyer');
  spawnGroundItem('ribbon_gold', new THREE.Vector3(0, 0.2, 4), 'foyer');
  spawnGroundItem('tome_scroll', new THREE.Vector3(0, 1.4, 3), 'library');
  spawnGroundItem('herb_green', new THREE.Vector3(5, 0.2, -6), 'garden');
  spawnGroundItem('sugar_crystal', new THREE.Vector3(5, 0.2, 4), 'greenhouse');
  spawnGroundItem('gem_star', new THREE.Vector3(7, 0.2, -6), 'observatory');
  spawnGroundItem('crest_royal', new THREE.Vector3(-7, 0.2, -4), 'clocktower');
  spawnGroundItem('powder_red', new THREE.Vector3(6, 0.2, 4), 'dining');
  spawnGroundItem('herb_green', new THREE.Vector3(-6, 0.2, 4), 'gallery');
  spawnGroundItem('sugar_crystal', new THREE.Vector3(0, 0.2, -3), 'mastersuite');
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
      color: (itemId.includes('herb') ? 0x10b981 : (itemId.includes('key') || itemId.includes('crest') ? 0xf59e0b : 0xec4899)),
      emissive: 0x22d3ee,
      emissiveIntensity: 0.5
    })
  );
  core.position.y = 0.45;
  group.add(core);

  if (rooms[roomName]) rooms[roomName].add(group);
  groundItems.push(group);
  return group;
}

export function updateGroundItems(delta, time) {
  groundItems.forEach(item => {
    item.rotation.y += delta * 1.6;
    item.position.y = 0.2 + Math.sin(time * 3 + item.position.x) * 0.09;
  });

  animatedWaterMeshes.forEach(w => { w.rotation.z += delta * 0.5; });
  animatedAstrolabeRings.forEach(r => {
    if (r.axis === 'y') r.mesh.rotation.y += delta * r.speed;
    if (r.axis === 'x') r.mesh.rotation.x += delta * r.speed;
  });
  animatedClockGears.forEach(g => {
    if (g.speed) g.mesh.rotation.z += delta * g.speed;
    if (g.pendulum) g.mesh.rotation.z = Math.sin(time * 2.2) * 0.35;
  });
  animatedBallroomCrystals.forEach(c => { c.rotation.y += delta * 0.8; });

  if (animatedCausticFloor) {
    animatedCausticFloor.material.opacity = 0.15 + Math.sin(time * 2.5) * 0.06;
  }
}

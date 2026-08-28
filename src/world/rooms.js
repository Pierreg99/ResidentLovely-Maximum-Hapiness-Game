import { scene } from './scene.js';

export const rooms = {
  foyer: new THREE.Group(),
  library: new THREE.Group(),
  garden: new THREE.Group(),
  greenhouse: new THREE.Group(),
  observatory: new THREE.Group(),
  clocktower: new THREE.Group(),
  lab: new THREE.Group()
};

export const lanternMeshes = [];
export const groundItems = [];
export const animatedWaterMeshes = [];
export const animatedAstrolabeRings = [];
export const animatedClockGears = [];
export const animatedLabGears = [];
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
  scene.add(rooms.foyer);
  scene.add(rooms.library);
  scene.add(rooms.garden);
  scene.add(rooms.greenhouse);
  scene.add(rooms.observatory);
  scene.add(rooms.clocktower);
  scene.add(rooms.lab);

  // ==========================================
  // --- 1. GRAND FOYER (1F + 2F MEZZANINE) ---
  // ==========================================
  (function buildFoyer() {
    const g = rooms.foyer;
    g.add(createChamberFloor(28, 28, 0x090d16, 0x131d31));

    const wallMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.6 });
    const goldTrimMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.88, roughness: 0.18 });
    const velvetMat = new THREE.MeshStandardMaterial({ color: 0x831843, roughness: 0.8 });

    // Perimeter Walls (Height 12m to accommodate 2F Mezzanine)
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

    // Stained-Glass Rose Window on Back Wall
    const windowFrame = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.25, 16, 32), goldTrimMat);
    windowFrame.position.set(0, 7.5, -13.6);
    g.add(windowFrame);

    const stainedGlass = new THREE.Mesh(
      new THREE.CircleGeometry(3.4, 32),
      new THREE.MeshBasicMaterial({ color: 0xec4899, transparent: true, opacity: 0.75, side: THREE.DoubleSide })
    );
    stainedGlass.position.set(0, 7.5, -13.5);
    g.add(stainedGlass);

    // Animated Caustic Floor Decal Plane
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

    // Framed Paintings
    const paintingL = createFramedPainting(2.8, 3.8, goldTrimMat, 0x0284c7);
    paintingL.position.set(-13.6, 4.5, -4);
    paintingL.rotation.y = Math.PI / 2;
    g.add(paintingL);

    const paintingR = createFramedPainting(2.8, 3.8, goldTrimMat, 0xd946ef);
    paintingR.position.set(13.6, 4.5, -4);
    paintingR.rotation.y = -Math.PI / 2;
    g.add(paintingR);

    // Gilded Rococo Crown Pillars
    for (let x of [-8, 8]) {
      for (let z of [-8, 8]) {
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.58, 12, 16), goldTrimMat);
        pillar.position.set(x, 6, z);
        pillar.castShadow = true;
        g.add(pillar);

        const cap = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.3, 1.3), goldTrimMat);
        cap.position.set(x, 11.8, z);
        g.add(cap);
      }
    }

    // Grand Staircase (Leading up from 1F to 2F Landing at Y = 4.2)
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

    // 2F Mezzanine Balcony Walkway (Y = 4.2)
    const mezzanineFloorMat = new THREE.MeshStandardMaterial({ color: 0x131d31, roughness: 0.2, metalness: 0.3 });
    const balustradeMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.15 });

    // North Balcony (Stair landing connecting left and right)
    const northWalkway = new THREE.Mesh(new THREE.BoxGeometry(26, 0.3, 3.5), mezzanineFloorMat);
    northWalkway.position.set(0, 4.2, -12);
    g.add(northWalkway);

    // East & West Upper Balconies
    const eastWalkway = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.3, 24), mezzanineFloorMat);
    eastWalkway.position.set(12, 4.2, 0);
    g.add(eastWalkway);

    const westWalkway = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.3, 24), mezzanineFloorMat);
    westWalkway.position.set(-12, 4.2, 0);
    g.add(westWalkway);

    // Balustrade Railings
    const railNorth = new THREE.Mesh(new THREE.BoxGeometry(16, 0.8, 0.15), balustradeMat);
    railNorth.position.set(0, 4.8, -10.2);
    g.add(railNorth);

    const railEast = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.8, 22), balustradeMat);
    railEast.position.set(10.2, 4.8, -1);
    g.add(railEast);

    const railWest = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.8, 22), balustradeMat);
    railWest.position.set(-10.2, 4.8, -1);
    g.add(railWest);

    // Grand Concert Piano
    const pianoGroup = new THREE.Group();
    pianoGroup.name = 'grand_piano';
    const pianoBodyMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.1, metalness: 0.45 });

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

    pianoGroup.position.set(6.5, 0, -3);
    pianoGroup.rotation.y = -Math.PI / 4;
    g.add(pianoGroup);

    // Golden Gramophone Save Station
    const gramophone = new THREE.Group();
    gramophone.name = 'gramophone_save';
    const table = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.1, 1.2, 16), goldTrimMat);
    table.position.y = 0.6;
    gramophone.add(table);

    const horn = new THREE.Mesh(new THREE.ConeGeometry(0.65, 1.35, 16, 1, true), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.92, roughness: 0.15, side: THREE.DoubleSide }));
    horn.rotation.x = Math.PI / 4;
    horn.position.set(0, 1.85, 0.3);
    gramophone.add(horn);

    const record = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.05, 16), new THREE.MeshBasicMaterial({ color: 0x09090b }));
    record.position.set(0, 1.25, 0);
    gramophone.add(record);

    gramophone.position.set(-8.5, 0, -8.5);
    g.add(gramophone);

    // Subterranean Trapdoor Hatch (Leading down to B1 Lab)
    const hatchGroup = new THREE.Group();
    hatchGroup.name = 'trapdoor_lab';
    const hatchRim = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.12, 8, 24), goldTrimMat);
    hatchRim.rotation.x = Math.PI / 2;
    hatchRim.position.y = 0.05;
    hatchGroup.add(hatchRim);

    const hatchDoor = new THREE.Mesh(new THREE.CircleGeometry(1.3, 24), new THREE.MeshStandardMaterial({ color: 0x06b6d4, metalness: 0.8, roughness: 0.3 }));
    hatchDoor.rotation.x = -Math.PI / 2;
    hatchDoor.position.y = 0.06;
    hatchGroup.add(hatchDoor);

    const runeHalo = new THREE.Mesh(new THREE.RingGeometry(0.7, 1.1, 16), new THREE.MeshBasicMaterial({ color: 0x22d3ee, side: THREE.DoubleSide, transparent: true, opacity: 0.7 }));
    runeHalo.rotation.x = -Math.PI / 2;
    runeHalo.position.y = 0.07;
    hatchGroup.add(runeHalo);

    hatchGroup.position.set(8.5, 0, 8.5);
    g.add(hatchGroup);

    // 1F Doors
    const doorEast = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4.2, 2.6), new THREE.MeshStandardMaterial({ color: 0xec4899, metalness: 0.5, roughness: 0.2 }));
    doorEast.position.set(13.8, 2.1, 0);
    doorEast.name = 'door_library';
    g.add(doorEast);

    const doorWest = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4.2, 2.6), new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.5, roughness: 0.2 }));
    doorWest.position.set(-13.8, 2.1, 0);
    doorWest.name = 'door_garden';
    g.add(doorWest);

    const doorGreenhouse = new THREE.Mesh(new THREE.BoxGeometry(3.2, 4.2, 0.3), new THREE.MeshStandardMaterial({ color: 0x34d399, metalness: 0.5, roughness: 0.2 }));
    doorGreenhouse.position.set(0, 2.1, 13.8);
    doorGreenhouse.name = 'door_greenhouse';
    g.add(doorGreenhouse);

    // 2F Doors (On Balconies)
    const doorObservatory = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.8, 2.4), new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.7, roughness: 0.2 }));
    doorObservatory.position.set(13.8, 6.2, 0);
    doorObservatory.name = 'door_observatory';
    g.add(doorObservatory);

    const doorClocktower = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.8, 2.4), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.7, roughness: 0.2 }));
    doorClocktower.position.set(-13.8, 6.2, 0);
    doorClocktower.name = 'door_clocktower';
    g.add(doorClocktower);
  })();

  // ===============================================
  // --- 2. EAST WING 1F: LIBRARY OF HARMONY ---
  // ===============================================
  (function buildLibrary() {
    const g = rooms.library;
    g.position.set(45, 0, 0);
    g.add(createChamberFloor(24, 24, 0x1c1917, 0x292524));

    const bookMat = new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.8 });
    const goldTrimMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.2 });

    for (let z = -8; z <= 8; z += 4) {
      const shelfL = new THREE.Mesh(new THREE.BoxGeometry(1.0, 7.5, 3.4), bookMat);
      shelfL.position.set(-10.5, 3.75, z);
      g.add(shelfL);

      const shelfR = new THREE.Mesh(new THREE.BoxGeometry(1.0, 7.5, 3.4), bookMat);
      shelfR.position.set(10.5, 3.75, z);
      g.add(shelfR);
    }

    // Rolling Brass Library Ladder
    const ladder = new THREE.Group();
    for (let y = 0; y < 12; y++) {
      const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 8), goldTrimMat);
      rung.rotation.z = Math.PI / 2;
      rung.position.y = y * 0.5;
      ladder.add(rung);
    }
    ladder.position.set(-9.8, 0, 2);
    ladder.rotation.z = -0.15;
    g.add(ladder);

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

    const liquid = new THREE.Mesh(new THREE.CircleGeometry(1.0, 16), new THREE.MeshStandardMaterial({ color: 0xec4899, emissive: 0xec4899, emissiveIntensity: 0.85 }));
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

  // =========================================================
  // --- 3. WEST WING 1F: SOLARIUM GARDEN (FOUNTAIN & ROSES) ---
  // =========================================================
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

    // Tiered Fountain with Animated Water Rings
    const fountainBase = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.5, 0.8, 24), new THREE.MeshStandardMaterial({ color: 0x22d3ee, roughness: 0.2 }));
    fountainBase.position.set(0, 0.4, 0);
    g.add(fountainBase);

    const fountainSpire = new THREE.Mesh(new THREE.ConeGeometry(1.6, 2.5, 16), new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.45 }));
    fountainSpire.position.set(0, 2.2, 0);
    g.add(fountainSpire);

    const waterRing = new THREE.Mesh(
      new THREE.RingGeometry(1.8, 3.8, 24),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.65, side: THREE.DoubleSide })
    );
    waterRing.rotation.x = -Math.PI / 2;
    waterRing.position.y = 0.75;
    g.add(waterRing);
    animatedWaterMeshes.push(waterRing);

    // Rose Bushes
    const bushMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.7 });
    const roseMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, emissive: 0xf472b6, emissiveIntensity: 0.35 });

    for (let x of [-7, 7]) {
      for (let z of [-7, 7]) {
        const bush = new THREE.Mesh(new THREE.SphereGeometry(0.9, 12, 12), bushMat);
        bush.position.set(x, 0.6, z);
        g.add(bush);

        const flower = new THREE.Mesh(new THREE.OctahedronGeometry(0.22), roseMat);
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

  // ==============================================================
  // --- 4. NORTH 1F: COURTYARD TEA GREENHOUSE & PRISMATIC SUGAR ---
  // ==============================================================
  (function buildGreenhouse() {
    const g = rooms.greenhouse;
    g.position.set(0, 0, 45);
    g.add(createChamberFloor(26, 26, 0x064e3b, 0x065f46));

    const whiteIronMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.4, roughness: 0.3 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x6ee7b7, roughness: 0.1, transparent: true, opacity: 0.4 });
    const goldTrimMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.2 });

    // Victorian Glass Pavilion Ribs
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
      const arch = new THREE.Mesh(new THREE.TorusGeometry(10, 0.18, 8, 24, Math.PI), whiteIronMat);
      arch.rotation.y = angle;
      arch.position.y = 0;
      g.add(arch);
    }

    // Glass Dome
    const dome = new THREE.Mesh(new THREE.SphereGeometry(10, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), glassMat);
    dome.position.y = 0;
    g.add(dome);

    // Marble Tea Table with Porcelain Tea Set
    const tableGroup = new THREE.Group();
    const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 0.15, 24), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 }));
    tableTop.position.y = 1.0;
    tableGroup.add(tableTop);

    const tableBase = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.6, 1.0, 12), whiteIronMat);
    tableBase.position.y = 0.5;
    tableGroup.add(tableBase);

    // Teapot & Cups
    const teapot = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.2 }));
    teapot.position.set(0, 1.25, 0);
    tableGroup.add(teapot);

    const teaCup1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.05, 0.1, 12), new THREE.MeshStandardMaterial({ color: 0x22d3ee }));
    teaCup1.position.set(0.6, 1.15, 0.4);
    tableGroup.add(teaCup1);

    const teaCup2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.05, 0.1, 12), new THREE.MeshStandardMaterial({ color: 0xf59e0b }));
    teaCup2.position.set(-0.6, 1.15, -0.4);
    tableGroup.add(teaCup2);

    tableGroup.position.set(-5, 0, -4);
    g.add(tableGroup);

    // Prismatic Sugar Crystal Cluster (Harvest Node)
    const sugarNode = new THREE.Group();
    sugarNode.name = 'sugar_crystal_node';

    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      emissive: 0xd946ef,
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.3
    });

    for (let i = 0; i < 6; i++) {
      const spire = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.6 + i * 0.2, 6), crystalMat);
      spire.position.set(Math.cos(i) * 0.6, 0.8 + i * 0.1, Math.sin(i) * 0.6);
      spire.rotation.set((Math.random() - 0.5) * 0.4, 0, (Math.random() - 0.5) * 0.4);
      sugarNode.add(spire);
    }
    sugarNode.position.set(5, 0, 4);
    g.add(sugarNode);

    // Sculpted Topiary Bunny Bushes
    const topiaryMat = new THREE.MeshStandardMaterial({ color: 0x047857, roughness: 0.8 });
    for (let pos of [[-8, 0, 6], [8, 0, -6]]) {
      const topiary = new THREE.Group();
      const tBody = new THREE.Mesh(new THREE.SphereGeometry(0.9, 12, 12), topiaryMat);
      tBody.position.y = 0.9;
      topiary.add(tBody);

      const tHead = new THREE.Mesh(new THREE.SphereGeometry(0.55, 12, 12), topiaryMat);
      tHead.position.y = 1.9;
      topiary.add(tHead);

      const earL = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.8, 8), topiaryMat);
      earL.position.set(-0.25, 2.5, 0);
      topiary.add(earL);

      const earR = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.8, 8), topiaryMat);
      earR.position.set(0.25, 2.5, 0);
      topiary.add(earR);

      topiary.position.set(pos[0], pos[1], pos[2]);
      g.add(topiary);
    }

    // Door back to Foyer
    const doorFoyer = new THREE.Mesh(new THREE.BoxGeometry(3.2, 4.2, 0.3), new THREE.MeshStandardMaterial({ color: 0x22d3ee }));
    doorFoyer.position.set(0, 2.1, -12.8);
    doorFoyer.name = 'door_foyer_from_greenhouse';
    g.add(doorFoyer);
  })();

  // ==============================================================
  // --- 5. EAST WING 2F: CELESTIAL OBSERVATORY & BRASS ASTROLABE ---
  // ==============================================================
  (function buildObservatory() {
    const g = rooms.observatory;
    g.position.set(45, 12, 0);
    g.add(createChamberFloor(24, 24, 0x05070a, 0x0f172a));

    const brassMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95, roughness: 0.15 });
    const indigoMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.4 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.5, roughness: 0.1 });

    // Midnight Domed Ceiling
    const dome = new THREE.Mesh(new THREE.SphereGeometry(11, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), indigoMat);
    dome.position.y = 0;
    g.add(dome);

    // Glowing Star Constellation Nodes on Dome
    for (let i = 0; i < 28; i++) {
      const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.12), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * (Math.PI / 2 - 0.2) + 0.1;
      star.position.set(10.8 * Math.sin(phi) * Math.cos(theta), 10.8 * Math.cos(phi), 10.8 * Math.sin(phi) * Math.sin(theta));
      g.add(star);
    }

    // Rotating Brass Celestial Astrolabe (Centerpiece)
    const astrolabe = new THREE.Group();
    astrolabe.name = 'astrolabe_center';

    const basePedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.9, 1.2, 16), brassMat);
    basePedestal.position.y = 0.6;
    astrolabe.add(basePedestal);

    // Outer Armillary Ring (Equatorial)
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.08, 12, 32), brassMat);
    ring1.position.y = 2.4;
    astrolabe.add(ring1);
    animatedAstrolabeRings.push({ mesh: ring1, axis: 'y', speed: 0.4 });

    // Inner Armillary Ring (Ecliptic)
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.07, 12, 32), brassMat);
    ring2.position.y = 2.4;
    ring2.rotation.x = Math.PI / 4;
    astrolabe.add(ring2);
    animatedAstrolabeRings.push({ mesh: ring2, axis: 'x', speed: -0.6 });

    // Core Star Gem Socket
    const socket = new THREE.Mesh(new THREE.OctahedronGeometry(0.35), new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x38bdf8, emissiveIntensity: 0.8 }));
    socket.position.y = 2.4;
    socket.name = 'astrolabe_core_socket';
    astrolabe.add(socket);

    astrolabe.position.set(0, 0, 0);
    g.add(astrolabe);

    // Brass Celestial Telescope
    const telescope = new THREE.Group();
    const scopeTube = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.35, 3.2, 16), brassMat);
    scopeTube.rotation.x = -Math.PI / 4;
    scopeTube.position.set(0, 2.4, 0);
    telescope.add(scopeTube);

    for (let pos of [[-0.6, 0.9, -0.6], [0.6, 0.9, -0.6], [0, 0.9, 0.8]]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 1.8, 8), brassMat);
      leg.position.set(pos[0], pos[1], pos[2]);
      telescope.add(leg);
    }

    telescope.position.set(7, 0, -6);
    g.add(telescope);

    // Stargazer Chart Desk
    const desk = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.1, 2.2), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
    desk.position.set(-6, 0.55, 6);
    g.add(desk);

    // Door back to 2F Foyer Balcony
    const doorFoyer = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.8, 2.4), new THREE.MeshStandardMaterial({ color: 0x22d3ee }));
    doorFoyer.position.set(-11.8, 1.9, 0);
    doorFoyer.name = 'door_foyer_from_observatory';
    g.add(doorFoyer);
  })();

  // ==============================================================
  // --- 6. WEST WING 2F: CLOCKTOWER SWEET SUITE & SUN CREST ---
  // ==============================================================
  (function buildClocktower() {
    const g = rooms.clocktower;
    g.position.set(-45, 12, 0);
    g.add(createChamberFloor(24, 24, 0x271c19, 0x3d271d));

    const mahoganyMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.3 });
    const goldTrimMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.92, roughness: 0.16 });
    const velvetMat = new THREE.MeshStandardMaterial({ color: 0x701a75, roughness: 0.7 });

    // Grand Monumental Clock Face on Back Wall
    const clockGroup = new THREE.Group();
    clockGroup.name = 'grand_clock_mechanism';

    const clockDial = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.6, 0.2, 32), new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.3 }));
    clockDial.rotation.x = Math.PI / 2;
    clockDial.position.set(0, 5.5, -11.6);
    clockGroup.add(clockDial);

    const clockRim = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.25, 12, 32), goldTrimMat);
    clockRim.position.set(0, 5.5, -11.5);
    clockGroup.add(clockRim);

    // Rotating Escapement Gear
    const gearGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.15, 12);
    const gearMesh = new THREE.Mesh(gearGeo, goldTrimMat);
    gearMesh.position.set(0, 5.5, -11.4);
    gearMesh.rotation.x = Math.PI / 2;
    clockGroup.add(gearMesh);
    animatedClockGears.push({ mesh: gearMesh, speed: 0.8 });

    // Oscillating Pendulum
    const pendulumRod = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.2, 8), goldTrimMat);
    pendulumRod.position.set(0, 2.5, -11.4);
    clockGroup.add(pendulumRod);

    const pendulumBob = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.15, 16), goldTrimMat);
    pendulumBob.position.set(0, 0.9, -11.4);
    pendulumBob.rotation.x = Math.PI / 2;
    clockGroup.add(pendulumBob);
    animatedClockGears.push({ mesh: pendulumRod, pendulum: true, bob: pendulumBob });

    g.add(clockGroup);

    // Grand Canopied Royal Bed
    const bedGroup = new THREE.Group();
    const mattress = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.8, 5.2), velvetMat);
    mattress.position.set(0, 0.8, 0);
    bedGroup.add(mattress);

    for (let pos of [[-2.0, 2.2, -2.5], [2.0, 2.2, -2.5], [-2.0, 2.2, 2.5], [2.0, 2.2, 2.5]]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 4.4, 12), goldTrimMat);
      post.position.set(pos[0], pos[1], pos[2]);
      bedGroup.add(post);
    }

    const canopy = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.2, 5.4), velvetMat);
    canopy.position.set(0, 4.4, 0);
    bedGroup.add(canopy);

    bedGroup.position.set(6, 0, 4);
    g.add(bedGroup);

    // Antique Grandfather Clock (Interactive Puzzle / Crest Pedestal)
    const gfClock = new THREE.Group();
    gfClock.name = 'antique_grandfather_clock';
    const gfCase = new THREE.Mesh(new THREE.BoxGeometry(1.6, 4.8, 1.2), mahoganyMat);
    gfCase.position.y = 2.4;
    gfClock.add(gfCase);

    const gfFace = new THREE.Mesh(new THREE.CircleGeometry(0.45, 16), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
    gfFace.position.set(0, 3.8, 0.61);
    gfClock.add(gfFace);

    gfClock.position.set(-7, 0, -4);
    g.add(gfClock);

    // Door back to 2F Foyer Balcony
    const doorFoyer = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.8, 2.4), new THREE.MeshStandardMaterial({ color: 0x22d3ee }));
    doorFoyer.position.set(11.8, 1.9, 0);
    doorFoyer.name = 'door_foyer_from_clocktower';
    g.add(doorFoyer);
  })();

  // ==============================================================
  // --- 7. SUBTERRANEAN B1: SUGAR ALCHEMY LAB & JOY DYNAMO ---
  // ==============================================================
  (function buildLab() {
    const g = rooms.lab;
    g.position.set(0, -14, -45);
    g.add(createChamberFloor(26, 26, 0x09090b, 0x171717));

    const pipeMatCyan = new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x06b6d4, emissiveIntensity: 0.6, roughness: 0.2 });
    const pipeMatMagenta = new THREE.MeshStandardMaterial({ color: 0xec4899, emissive: 0xec4899, emissiveIntensity: 0.6, roughness: 0.2 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.25 });
    const goldTrimMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 });

    // Glowing Neon Syrup Pipeline Networks
    for (let y of [3.5, 6.0]) {
      const pipeL = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 24, 16), pipeMatCyan);
      pipeL.rotation.z = Math.PI / 2;
      pipeL.position.set(0, y, -12.6);
      g.add(pipeL);

      const pipeR = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 24, 16), pipeMatMagenta);
      pipeR.rotation.x = Math.PI / 2;
      pipeR.position.set(-12.6, y, 0);
      g.add(pipeR);
    }

    // Master Joy Dynamo Generator (Centerpiece)
    const dynamoGroup = new THREE.Group();
    dynamoGroup.name = 'master_joy_dynamo';

    const dynamoBase = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 3.2, 1.4, 24), steelMat);
    dynamoBase.position.y = 0.7;
    dynamoGroup.add(dynamoBase);

    const dynamoCore = new THREE.Mesh(new THREE.SphereGeometry(1.6, 24, 24), new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.75,
      roughness: 0.1
    }));
    dynamoCore.position.y = 2.2;
    dynamoGroup.add(dynamoCore);

    // Revolving Dynamo Induction Coils
    for (let i = 0; i < 4; i++) {
      const coil = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.12, 12, 24), goldTrimMat);
      coil.rotation.x = Math.PI / 2;
      coil.position.y = 1.4 + i * 0.5;
      dynamoGroup.add(coil);
      animatedLabGears.push({ mesh: coil, speed: (i % 2 === 0 ? 1 : -1) * 0.9 });
    }

    dynamoGroup.position.set(0, 0, -3);
    g.add(dynamoGroup);

    // Automated Confectionery Oven & Conveyor
    const ovenGroup = new THREE.Group();
    const ovenBox = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.6, 3.2), steelMat);
    ovenBox.position.y = 1.3;
    ovenGroup.add(ovenBox);

    const conveyor = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.4, 1.8), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
    conveyor.position.set(3.5, 1.0, 0);
    ovenGroup.add(conveyor);

    ovenGroup.position.set(-7, 0, 4);
    g.add(ovenGroup);

    // Distillation Alembic Glassware Table
    const alembicTable = new THREE.Group();
    const aDesk = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.2, 2.4), steelMat);
    aDesk.position.y = 0.6;
    alembicTable.add(aDesk);

    for (let x of [-1.5, 0, 1.5]) {
      const flask = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.9, 12), new THREE.MeshStandardMaterial({ color: 0xec4899, transparent: true, opacity: 0.75, roughness: 0.1 }));
      flask.position.set(x, 1.5, 0);
      alembicTable.add(flask);
    }
    alembicTable.position.set(6, 0, 4);
    g.add(alembicTable);

    // Ascent Ladder back to Foyer
    const ladderGroup = new THREE.Group();
    for (let y = 0; y < 18; y++) {
      const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.2, 8), goldTrimMat);
      rung.rotation.z = Math.PI / 2;
      rung.position.y = y * 0.4;
      ladderGroup.add(rung);
    }
    ladderGroup.position.set(0, 0, 11.5);
    g.add(ladderGroup);
  })();

  // ==========================================
  // --- SPAWN INITIAL GROUND ITEMS & TREATS ---
  // ==========================================
  spawnGroundItem('herb_green', new THREE.Vector3(7, 0.2, 6), 'foyer');
  spawnGroundItem('powder_red', new THREE.Vector3(-7, 0.2, 6), 'foyer');
  spawnGroundItem('ribbon_gold', new THREE.Vector3(0, 0.2, 4), 'foyer');
  spawnGroundItem('tome_scroll', new THREE.Vector3(0, 1.4, 3), 'library');
  spawnGroundItem('herb_green', new THREE.Vector3(5, 0.2, -6), 'garden');
  spawnGroundItem('sugar_crystal', new THREE.Vector3(5, 0.2, 4), 'greenhouse');
  spawnGroundItem('gem_star', new THREE.Vector3(7, 0.2, -6), 'observatory');
  spawnGroundItem('crest_royal', new THREE.Vector3(-7, 0.2, -4), 'clocktower');
  spawnGroundItem('powder_red', new THREE.Vector3(6, 0.2, 4), 'lab');
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

  rooms[roomName].add(group);
  groundItems.push(group);
  return group;
}

export function updateGroundItems(delta, time) {
  groundItems.forEach(item => {
    item.rotation.y += delta * 1.6;
    item.position.y = 0.2 + Math.sin(time * 3 + item.position.x) * 0.09;
  });

  animatedWaterMeshes.forEach(w => {
    w.rotation.z += delta * 0.5;
  });

  animatedAstrolabeRings.forEach(r => {
    if (r.axis === 'y') r.mesh.rotation.y += delta * r.speed;
    if (r.axis === 'x') r.mesh.rotation.x += delta * r.speed;
  });

  animatedClockGears.forEach(g => {
    if (g.speed) g.mesh.rotation.z += delta * g.speed;
    if (g.pendulum) {
      const angle = Math.sin(time * 2.2) * 0.35;
      g.mesh.rotation.z = angle;
      if (g.bob) {
        g.bob.position.x = Math.sin(angle) * 1.6;
        g.bob.position.y = 2.5 - Math.cos(angle) * 1.6;
      }
    }
  });

  animatedLabGears.forEach(g => {
    if (g.speed) g.mesh.rotation.z += delta * g.speed;
  });

  if (animatedCausticFloor) {
    animatedCausticFloor.material.opacity = 0.15 + Math.sin(time * 2.5) * 0.06;
  }
}

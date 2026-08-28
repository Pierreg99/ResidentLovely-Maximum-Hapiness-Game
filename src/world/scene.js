export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05070a);
// Clean Linear Fog that preserves room clarity across all wings
scene.fog = new THREE.Fog(0x05070a, 35, 110);

export const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;

const container = document.getElementById('canvas-container');
if (container) container.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
});

// Dynamic Ambient Light
export const ambientLight = new THREE.AmbientLight(0x38bdf8, 0.65);
scene.add(ambientLight);

// Primary Directional Sun Light
export const sunLight = new THREE.DirectionalLight(0xffedd5, 1.1);
sunLight.position.set(15, 32, 15);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 1024;
sunLight.shadow.mapSize.height = 1024;
sunLight.shadow.bias = -0.0005;
scene.add(sunLight);

// --- Dedicated Wing Point Lights for Balanced PBR Illumination ---
export const foyerLight = new THREE.PointLight(0xf59e0b, 1.8, 32);
foyerLight.position.set(0, 7.5, 0);
scene.add(foyerLight);

export const libraryLight = new THREE.PointLight(0xf59e0b, 2.0, 32);
libraryLight.position.set(45, 7.0, 0);
scene.add(libraryLight);

export const gardenLight = new THREE.PointLight(0x10b981, 2.2, 34);
gardenLight.position.set(-45, 7.5, 0);
scene.add(gardenLight);

export const greenhouseLight = new THREE.PointLight(0x34d399, 2.2, 34);
greenhouseLight.position.set(0, 7.5, 45);
scene.add(greenhouseLight);

export const diningLight = new THREE.PointLight(0xf59e0b, 2.2, 34);
diningLight.position.set(45, 7.5, 45);
scene.add(diningLight);

export const galleryLight = new THREE.PointLight(0xec4899, 2.2, 34);
galleryLight.position.set(-45, 7.5, 45);
scene.add(galleryLight);

export const observatoryLight = new THREE.PointLight(0x38bdf8, 2.2, 34);
observatoryLight.position.set(45, 18.0, 0);
scene.add(observatoryLight);

export const clocktowerLight = new THREE.PointLight(0xf59e0b, 2.2, 34);
clocktowerLight.position.set(-45, 18.0, 0);
scene.add(clocktowerLight);

export const mastersuiteLight = new THREE.PointLight(0xa855f7, 2.2, 34);
mastersuiteLight.position.set(0, 18.0, 45);
scene.add(mastersuiteLight);

export const ballroomLight = new THREE.PointLight(0x38bdf8, 2.4, 36);
ballroomLight.position.set(0, 18.0, -45);
scene.add(ballroomLight);

export const cathedralLight = new THREE.PointLight(0xf59e0b, 2.5, 38);
cathedralLight.position.set(0, 30.0, 0);
scene.add(cathedralLight);

export const gatehouseLight = new THREE.PointLight(0xf59e0b, 2.2, 36);
gatehouseLight.position.set(0, 8.0, 90);
scene.add(gatehouseLight);

export const reflectionLight = new THREE.PointLight(0x38bdf8, 2.2, 36);
reflectionLight.position.set(-45, 8.0, 90);
scene.add(reflectionLight);

export const mazeLight = new THREE.PointLight(0x10b981, 2.2, 36);
mazeLight.position.set(45, 8.0, 90);
scene.add(mazeLight);

export const gazeboLight = new THREE.PointLight(0xec4899, 2.2, 36);
gazeboLight.position.set(0, 8.0, 135);
scene.add(gazeboLight);

export const labLight = new THREE.PointLight(0x06b6d4, 2.4, 36);
labLight.position.set(0, -8.0, -45);
scene.add(labLight);

export const cryptLight = new THREE.PointLight(0x22d3ee, 2.6, 38);
cryptLight.position.set(0, -22.0, -45);
scene.add(cryptLight);

// --- Procedural Dynamic Sunset Skybox & Celestial Dome ---
export let sunsetSkyDome = null;
(function buildSunsetSkyDome() {
  const domeGeo = new THREE.SphereGeometry(320, 32, 24);
  const domeMat = new THREE.MeshBasicMaterial({
    color: 0x1e1b4b,
    side: THREE.BackSide,
    depthWrite: false
  });
  sunsetSkyDome = new THREE.Mesh(domeGeo, domeMat);
  scene.add(sunsetSkyDome);
})();

// --- Cherry Blossom Pastel Petal Wind Particles ---
export const petalParticles = [];
const petalGroup = new THREE.Group();
scene.add(petalGroup);

(function initPetals() {
  const petalMat = new THREE.MeshStandardMaterial({
    color: 0xf472b6,
    emissive: 0xec4899,
    emissiveIntensity: 0.35,
    roughness: 0.6,
    side: THREE.DoubleSide
  });

  for (let i = 0; i < 80; i++) {
    const mesh = new THREE.Mesh(new THREE.CircleGeometry(0.12, 6), petalMat);
    mesh.position.set(
      (Math.random() - 0.5) * 120,
      1.0 + Math.random() * 12,
      (Math.random() - 0.5) * 120 + 60
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    petalGroup.add(mesh);
    petalParticles.push({
      mesh,
      speedX: -0.8 - Math.random() * 1.2,
      speedY: -0.4 - Math.random() * 0.6,
      rotSpeed: 1.2 + Math.random() * 2.0
    });
  }
})();

export function updatePetals(delta, time) {
  petalParticles.forEach(p => {
    p.mesh.position.x += p.speedX * delta;
    p.mesh.position.y += p.speedY * delta;
    p.mesh.rotation.z += p.rotSpeed * delta;

    if (p.mesh.position.y < 0.1) {
      p.mesh.position.y = 12.0;
      p.mesh.position.x = 40.0 + (Math.random() - 0.5) * 20;
    }
  });

  if (sunsetSkyDome) {
    sunsetSkyDome.rotation.y = time * 0.015;
  }
}

// Multi-Tier Crystal Chandelier Mesh in Foyer
(function buildChandelier() {
  const g = new THREE.Group();
  g.position.set(0, 9.5, 0);

  const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.15 });
  const crystalMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, transparent: true, opacity: 0.75 });

  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.2, 12), goldMat);
  rod.position.y = 1.1;
  g.add(rod);

  for (let r of [2.0, 1.4, 0.8]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.06, 8, 24), goldMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = (2.0 - r) * 0.45;
    g.add(ring);

    const numPrisms = Math.floor(r * 10);
    for (let i = 0; i < numPrisms; i++) {
      const angle = (i / numPrisms) * Math.PI * 2;
      const prism = new THREE.Mesh(new THREE.OctahedronGeometry(0.14), crystalMat);
      prism.scale.set(0.6, 1.8, 0.6);
      prism.position.set(Math.cos(angle) * r, (2.0 - r) * 0.45 - 0.3, Math.sin(angle) * r);
      g.add(prism);
    }
  }
  scene.add(g);
})();

// Volumetric God Rays
(function buildGodRays() {
  const rayGeo = new THREE.ConeGeometry(4.8, 16, 16, 1, true);
  rayGeo.rotateX(-Math.PI / 3);
  rayGeo.translate(0, 5.0, -6);
  const rayMat = new THREE.MeshBasicMaterial({
    color: 0xfbcfe8,
    transparent: true,
    opacity: 0.14,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  const rays = new THREE.Mesh(rayGeo, rayMat);
  scene.add(rays);
})();

// Confetti Burst System
export const particles = [];
const particleGeo = new THREE.PlaneGeometry(0.18, 0.18);
const colors = [0xf59e0b, 0x22d3ee, 0xec4899, 0x10b981, 0xa855f7, 0xf43f5e, 0x38bdf8];

export function spawnConfetti(pos, count = 35) {
  for (let i = 0; i < count; i++) {
    const mat = new THREE.MeshBasicMaterial({
      color: colors[Math.floor(Math.random() * colors.length)],
      side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(particleGeo, mat);
    mesh.position.copy(pos);

    const vel = new THREE.Vector3(
      (Math.random() - 0.5) * 6,
      Math.random() * 6 + 3,
      (Math.random() - 0.5) * 6
    );

    particles.push({ mesh, vel, life: 1.0, rotSpeed: (Math.random() - 0.5) * 10 });
    scene.add(mesh);
  }
}

export function updateParticles(delta) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life -= delta * 0.9;
    p.vel.y -= 9.8 * delta;
    p.mesh.position.addScaledVector(p.vel, delta);
    p.mesh.rotation.x += p.rotSpeed * delta;
    p.mesh.rotation.y += p.rotSpeed * delta;

    if (p.mesh.position.y < 0) {
      p.mesh.position.y = 0;
      p.vel.y *= -0.4;
    }

    if (p.life <= 0) {
      scene.remove(p.mesh);
      p.mesh.geometry.dispose();
      p.mesh.material.dispose();
      particles.splice(i, 1);
    }
  }
}

// Ambient Stardust Motes
export const stardustMotes = [];
(function initStardust() {
  const moteGeo = new THREE.OctahedronGeometry(0.08);
  const moteMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });
  for (let i = 0; i < 90; i++) {
    const mote = new THREE.Mesh(moteGeo, moteMat);
    mote.position.set((Math.random() - 0.5) * 30, Math.random() * 8 + 0.5, (Math.random() - 0.5) * 30);
    scene.add(mote);
    stardustMotes.push({ mesh: mote, basePos: mote.position.clone(), speed: 0.6 + Math.random() * 0.8 });
  }
})();

export function updateStardust(time, currentRoom) {
  stardustMotes.forEach((m, idx) => {
    m.mesh.position.y = m.basePos.y + Math.sin(time * m.speed + idx) * 0.45;
    m.mesh.rotation.y += 0.02;
    m.mesh.rotation.x += 0.01;
  });
}

// Room-adaptive lighting controller
export function updateSceneLighting(roomName) {
  if (roomName === 'foyer') {
    ambientLight.color.setHex(0x38bdf8);
    ambientLight.intensity = 0.65;
    sunLight.intensity = 1.1;
  } else if (roomName === 'library') {
    ambientLight.color.setHex(0xfde047);
    ambientLight.intensity = 0.55;
    sunLight.intensity = 0.8;
  } else if (roomName === 'garden' || roomName === 'greenhouse' || roomName === 'rose_maze') {
    ambientLight.color.setHex(0x6ee7b7);
    ambientLight.intensity = 0.85;
    sunLight.intensity = 1.35;
  } else if (roomName === 'gatehouse' || roomName === 'reflection_pool' || roomName === 'gazebo') {
    ambientLight.color.setHex(0xf59e0b);
    ambientLight.intensity = 0.8;
    sunLight.intensity = 1.4;
  } else if (roomName === 'observatory' || roomName === 'ballroom' || roomName === 'cathedral') {
    ambientLight.color.setHex(0x38bdf8);
    ambientLight.intensity = 0.7;
    sunLight.intensity = 0.7;
  } else if (roomName === 'lab' || roomName === 'crypt') {
    ambientLight.color.setHex(0x06b6d4);
    ambientLight.intensity = 0.6;
    sunLight.intensity = 0.3;
  }
}

export const muzzleLight = new THREE.PointLight(0xf59e0b, 0, 10);
scene.add(muzzleLight);

export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05070a);
// Clean Linear Fog that preserves room clarity across all wings
scene.fog = new THREE.Fog(0x05070a, 35, 95);

export const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;

const container = document.getElementById('canvas-container');
container.appendChild(renderer.domElement);

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

// Dedicated Wing Point Lights for Balanced PBR Illumination
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

export const labLight = new THREE.PointLight(0x06b6d4, 2.4, 36);
labLight.position.set(0, -8.0, -45);
scene.add(labLight);

export const cryptLight = new THREE.PointLight(0x22d3ee, 2.6, 38);
cryptLight.position.set(0, -22.0, -45);
scene.add(cryptLight);

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

    // Hanging Crystal Prisms
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

// Volumetric God Rays Mesh from Stained-Glass Window
(function buildGodRays() {
  const rayGeo = new THREE.ConeGeometry(4.8, 16, 16, 1, true);
  rayGeo.rotateX(-Math.PI / 3);
  rayGeo.translate(0, 5.0, -6);
  const rayMat = new THREE.MeshBasicMaterial({
    color: 0xec4899,
    transparent: true,
    opacity: 0.16,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const godRay = new THREE.Mesh(rayGeo, rayMat);
  godRay.position.set(0, 2, -4);
  scene.add(godRay);
})();

// Volumetric Starlight Cones in Observatory
(function buildObservatoryStarlight() {
  const rayGeo = new THREE.ConeGeometry(3.6, 14, 16, 1, true);
  rayGeo.rotateX(Math.PI);
  const rayMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.14,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const starRay = new THREE.Mesh(rayGeo, rayMat);
  starRay.position.set(45, 18, 0);
  scene.add(starRay);
})();

// Dynamic Weapon Muzzle Flash Light
export const muzzleLight = new THREE.PointLight(0xf59e0b, 0, 16);
scene.add(muzzleLight);

// Ambient Floating Stardust & Joy Motes System
const stardustMotes = [];
const moteGeo = new THREE.OctahedronGeometry(0.08);

for (let i = 0; i < 90; i++) {
  const moteColor = (i % 3 === 0) ? 0x22d3ee : ((i % 3 === 1) ? 0xf59e0b : 0xec4899);
  const moteMat = new THREE.MeshBasicMaterial({ color: moteColor, transparent: true, opacity: 0.75 });
  const mote = new THREE.Mesh(moteGeo, moteMat);
  mote.position.set(
    (Math.random() - 0.5) * 28,
    Math.random() * 8 + 0.5,
    (Math.random() - 0.5) * 28
  );
  stardustMotes.push({
    mesh: mote,
    baseY: mote.position.y,
    offsetX: (Math.random() - 0.5) * 20,
    offsetZ: (Math.random() - 0.5) * 20,
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.8 + 0.4
  });
  scene.add(mote);
}

export function updateStardust(time, currentRoom) {
  let cx = 0, cy = 0, cz = 0;
  if (currentRoom === 'library') { cx = 45; cy = 0; cz = 0; }
  else if (currentRoom === 'garden') { cx = -45; cy = 0; cz = 0; }
  else if (currentRoom === 'greenhouse') { cx = 0; cy = 0; cz = 45; }
  else if (currentRoom === 'observatory') { cx = 45; cy = 12; cz = 0; }
  else if (currentRoom === 'clocktower') { cx = -45; cy = 12; cz = 0; }
  else if (currentRoom === 'lab') { cx = 0; cy = -14; cz = -45; }

  stardustMotes.forEach((m) => {
    m.mesh.position.x = cx + m.offsetX;
    m.mesh.position.y = cy + m.baseY + Math.sin(time * m.speed + m.phase) * 0.4;
    m.mesh.position.z = cz + m.offsetZ;
    m.mesh.rotation.x += 0.015;
    m.mesh.rotation.y += 0.02;
  });
}

export function updateSceneLighting(currentRoom) {
  if (currentRoom === 'foyer') {
    sunLight.position.set(15, 32, 15);
    ambientLight.color.setHex(0x38bdf8);
    ambientLight.intensity = 0.65;
    scene.fog.near = 35;
    scene.fog.far = 95;
  } else if (currentRoom === 'library') {
    sunLight.position.set(55, 32, 15);
    ambientLight.color.setHex(0xfbbf24);
    ambientLight.intensity = 0.55;
    scene.fog.near = 30;
    scene.fog.far = 90;
  } else if (currentRoom === 'garden') {
    sunLight.position.set(-35, 32, 15);
    ambientLight.color.setHex(0x6ee7b7);
    ambientLight.intensity = 0.65;
    scene.fog.near = 30;
    scene.fog.far = 90;
  } else if (currentRoom === 'greenhouse') {
    sunLight.position.set(10, 32, 55);
    ambientLight.color.setHex(0x34d399);
    ambientLight.intensity = 0.7;
    scene.fog.near = 35;
    scene.fog.far = 100;
  } else if (currentRoom === 'observatory') {
    sunLight.position.set(55, 40, 10);
    ambientLight.color.setHex(0x38bdf8);
    ambientLight.intensity = 0.5;
    scene.fog.near = 40;
    scene.fog.far = 110;
  } else if (currentRoom === 'clocktower') {
    sunLight.position.set(-35, 40, 10);
    ambientLight.color.setHex(0xf59e0b);
    ambientLight.intensity = 0.6;
    scene.fog.near = 35;
    scene.fog.far = 100;
  } else if (currentRoom === 'lab') {
    sunLight.position.set(0, 10, -35);
    ambientLight.color.setHex(0x06b6d4);
    ambientLight.intensity = 0.6;
    scene.fog.near = 25;
    scene.fog.far = 80;
  }
}

// Confetti & Star Sparkle Particle System
const particles = [];
const particleGeo = new THREE.PlaneGeometry(0.18, 0.18);
const confettiColors = [0x22d3ee, 0xf59e0b, 0x10b981, 0xec4899, 0xa855f7, 0xffffff];

export function spawnConfetti(pos, count = 28) {
  for (let i = 0; i < count; i++) {
    const mat = new THREE.MeshBasicMaterial({
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      side: THREE.DoubleSide
    });
    const p = new THREE.Mesh(particleGeo, mat);
    p.position.copy(pos);
    p.position.x += (Math.random() - 0.5) * 0.4;
    p.position.y += (Math.random() - 0.5) * 0.4 + 0.5;
    p.position.z += (Math.random() - 0.5) * 0.4;

    const vel = new THREE.Vector3(
      (Math.random() - 0.5) * 6.5,
      Math.random() * 5.5 + 3.8,
      (Math.random() - 0.5) * 6.5
    );
    const rotVel = new THREE.Vector3(
      Math.random() * 10,
      Math.random() * 10,
      Math.random() * 10
    );
    particles.push({ mesh: p, vel, rotVel, life: 1.8 });
    scene.add(p);
  }
}

export function updateParticles(delta) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.vel.y -= 9.8 * delta;
    p.mesh.position.addScaledVector(p.vel, delta);
    p.mesh.rotation.x += p.rotVel.x * delta;
    p.mesh.rotation.y += p.rotVel.y * delta;
    p.life -= delta;
    if (p.life <= 0) {
      scene.remove(p.mesh);
      particles.splice(i, 1);
    }
  }
}

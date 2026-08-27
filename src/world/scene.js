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
const ambientLight = new THREE.AmbientLight(0x38bdf8, 0.65);
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
export const foyerLight = new THREE.PointLight(0xf59e0b, 1.8, 30);
foyerLight.position.set(0, 7.5, 0);
scene.add(foyerLight);

export const libraryLight = new THREE.PointLight(0xf59e0b, 2.0, 32);
libraryLight.position.set(45, 7.0, 0);
scene.add(libraryLight);

export const gardenLight = new THREE.PointLight(0x10b981, 2.2, 34);
gardenLight.position.set(-45, 7.5, 0);
scene.add(gardenLight);

// Multi-Tier Crystal Chandelier Mesh in Foyer
(function buildChandelier() {
  const g = new THREE.Group();
  g.position.set(0, 8.2, 0);

  const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.15 });
  const crystalMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, transparent: true, opacity: 0.75 });

  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.6, 12), goldMat);
  rod.position.y = 0.8;
  g.add(rod);

  for (let r of [1.6, 1.1, 0.6]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.05, 8, 24), goldMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = (1.6 - r) * 0.4;
    g.add(ring);

    // Hanging Crystal Prisms
    const numPrisms = Math.floor(r * 10);
    for (let i = 0; i < numPrisms; i++) {
      const angle = (i / numPrisms) * Math.PI * 2;
      const prism = new THREE.Mesh(new THREE.OctahedronGeometry(0.12), crystalMat);
      prism.scale.set(0.6, 1.6, 0.6);
      prism.position.set(Math.cos(angle) * r, (1.6 - r) * 0.4 - 0.25, Math.sin(angle) * r);
      g.add(prism);
    }
  }
  scene.add(g);
})();

// Volumetric God Rays Mesh from Stained-Glass Window
(function buildGodRays() {
  const rayGeo = new THREE.ConeGeometry(4.2, 14, 16, 1, true);
  rayGeo.rotateX(-Math.PI / 3);
  rayGeo.translate(0, 4.5, -6);
  const rayMat = new THREE.MeshBasicMaterial({
    color: 0xec4899,
    transparent: true,
    opacity: 0.14,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const godRay = new THREE.Mesh(rayGeo, rayMat);
  godRay.position.set(0, 2, -4);
  scene.add(godRay);
})();

// Dynamic Weapon Muzzle Flash Light
export const muzzleLight = new THREE.PointLight(0xf59e0b, 0, 16);
scene.add(muzzleLight);

// Ambient Floating Stardust Motes System
const stardustMotes = [];
const moteGeo = new THREE.OctahedronGeometry(0.06);
const moteMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.65 });

for (let i = 0; i < 60; i++) {
  const mote = new THREE.Mesh(moteGeo, moteMat);
  mote.position.set(
    (Math.random() - 0.5) * 28,
    Math.random() * 7 + 0.5,
    (Math.random() - 0.5) * 28
  );
  stardustMotes.push({
    mesh: mote,
    baseY: mote.position.y,
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.8 + 0.4
  });
  scene.add(mote);
}

export function updateStardust(time, currentRoom) {
  let roomCenterX = 0;
  if (currentRoom === 'library') roomCenterX = 45;
  if (currentRoom === 'garden') roomCenterX = -45;

  stardustMotes.forEach((m, idx) => {
    m.mesh.position.y = m.baseY + Math.sin(time * m.speed + m.phase) * 0.35;
    m.mesh.rotation.x += 0.01;
    m.mesh.rotation.y += 0.015;
  });
}

export function updateSceneLighting(currentRoom) {
  if (currentRoom === 'foyer') {
    sunLight.position.set(15, 32, 15);
    scene.fog.near = 35;
    scene.fog.far = 95;
  } else if (currentRoom === 'library') {
    sunLight.position.set(55, 32, 15);
  } else if (currentRoom === 'garden') {
    sunLight.position.set(-35, 32, 15);
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

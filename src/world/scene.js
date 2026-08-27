export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05070a);
scene.fog = new THREE.FogExp2(0x05070a, 0.022);

export const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const container = document.getElementById('canvas-container');
container.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
});

// Dynamic Lighting
const ambientLight = new THREE.AmbientLight(0x38bdf8, 0.38);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffedd5, 0.85);
sunLight.position.set(15, 30, 15);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 1024;
sunLight.shadow.mapSize.height = 1024;
scene.add(sunLight);

const chandelierLight = new THREE.PointLight(0xf59e0b, 1.4, 30);
chandelierLight.position.set(0, 7.5, 0);
scene.add(chandelierLight);

export const muzzleLight = new THREE.PointLight(0xf59e0b, 0, 15);
scene.add(muzzleLight);

// Confetti Particle System
const particles = [];
const particleGeo = new THREE.PlaneGeometry(0.16, 0.16);
const confettiColors = [0x22d3ee, 0xf59e0b, 0x10b981, 0xec4899, 0xa855f7, 0xffffff];

export function spawnConfetti(pos, count = 25) {
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
      (Math.random() - 0.5) * 6,
      Math.random() * 5 + 3.5,
      (Math.random() - 0.5) * 6
    );
    const rotVel = new THREE.Vector3(
      Math.random() * 8,
      Math.random() * 8,
      Math.random() * 8
    );
    particles.push({ mesh: p, vel, rotVel, life: 1.6 });
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

import { SECTOR_REGISTRY, getSector, getFloorSectors } from './sectors.js';

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

// --- Dedicated Dynamic Point Lights per Sector (32 Sectors) ---
export const sectorPointLights = {};

SECTOR_REGISTRY.forEach(sector => {
  const lightCfg = sector.light || sector.lighting;
  const color = lightCfg?.color !== undefined ? lightCfg.color : 0xf59e0b;
  const intensity = lightCfg?.intensity !== undefined ? lightCfg.intensity : 2.2;
  const distance = lightCfg?.distance !== undefined ? lightCfg.distance : 34;
  
  let posX = sector.coords.x;
  let posY = sector.coords.y + 7.5;
  let posZ = sector.coords.z;

  if (lightCfg?.position) {
    if (Array.isArray(lightCfg.position)) {
      posX = lightCfg.position[0];
      posY = lightCfg.position[1];
      posZ = lightCfg.position[2];
    } else {
      if (lightCfg.position.x !== undefined) posX = lightCfg.position.x;
      if (lightCfg.position.y !== undefined) posY = lightCfg.position.y;
      if (lightCfg.position.z !== undefined) posZ = lightCfg.position.z;
    }
  }

  const pLight = new THREE.PointLight(color, intensity, distance);
  pLight.position.set(posX, posY, posZ);
  pLight.name = `${sector.slug}_point_light`;
  scene.add(pLight);

  sectorPointLights[sector.id] = pLight;
  sectorPointLights[sector.slug] = pLight;
});

// Legacy named point lights for backward compatibility
export const foyerLight = sectorPointLights.foyer;
export const libraryLight = sectorPointLights.library;
export const gardenLight = sectorPointLights.garden;
export const greenhouseLight = sectorPointLights.greenhouse;
export const diningLight = sectorPointLights.dining;
export const galleryLight = sectorPointLights.gallery;
export const observatoryLight = sectorPointLights.observatory;
export const clocktowerLight = sectorPointLights.clocktower;
export const mastersuiteLight = sectorPointLights.mastersuite;
export const ballroomLight = sectorPointLights.ballroom;
export const cathedralLight = sectorPointLights.cathedral;
export const gatehouseLight = sectorPointLights.gatehouse;
export const reflectionLight = sectorPointLights.reflection_pool;
export const mazeLight = sectorPointLights.rose_maze;
export const gazeboLight = sectorPointLights.gazebo;
export const labLight = sectorPointLights.lab;
export const cryptLight = sectorPointLights.crypt;

// --- Water Shader Material Registry & Factory ---
export const waterShaderMaterials = [];

export function createWaterShaderMaterial(options = {}) {
  const deepColor = new THREE.Color(options.deepColor !== undefined ? options.deepColor : 0x0284c7);
  const shallowColor = new THREE.Color(options.shallowColor !== undefined ? options.shallowColor : 0x38bdf8);
  const sunsetColor = new THREE.Color(options.sunsetColor !== undefined ? options.sunsetColor : 0xf59e0b);
  const causticIntensity = options.causticIntensity !== undefined ? options.causticIntensity : 0.6;
  const waveSpeed = options.waveSpeed !== undefined ? options.waveSpeed : 1.2;
  const waveHeight = options.waveHeight !== undefined ? options.waveHeight : 0.08;
  const concentric = options.concentric ? 1.0 : 0.0;

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0.0 },
      uDeepColor: { value: deepColor },
      uShallowColor: { value: shallowColor },
      uSunsetColor: { value: sunsetColor },
      uCausticIntensity: { value: causticIntensity },
      uWaveSpeed: { value: waveSpeed },
      uWaveHeight: { value: waveHeight },
      uConcentric: { value: concentric }
    },
    vertexShader: `
      uniform float uTime;
      uniform float uWaveSpeed;
      uniform float uWaveHeight;
      uniform float uConcentric;

      varying vec3 vWorldPosition;
      varying vec3 vNormal;
      varying vec2 vUv;
      varying vec3 vViewPosition;

      void main() {
        vUv = uv;
        vec3 pos = position;

        float t = uTime * uWaveSpeed;
        float wave = 0.0;

        if (uConcentric > 0.5) {
          float r = length(pos.xy);
          wave += sin(r * 6.0 - t * 3.0) * (uWaveHeight * 0.7);
          wave += sin(pos.x * 4.0 + t) * cos(pos.y * 4.0 + t) * (uWaveHeight * 0.3);
        } else {
          float w1 = sin(pos.x * 1.6 + t * 1.2) * cos(pos.y * 1.3 + t * 0.9) * (uWaveHeight * 0.6);
          float w2 = sin((pos.x + pos.y) * 2.4 - t * 1.4) * (uWaveHeight * 0.3);
          float w3 = cos(length(pos.xy) * 1.8 - t * 1.6) * (uWaveHeight * 0.2);
          wave = w1 + w2 + w3;
        }

        pos.z += wave;

        vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
        vWorldPosition = worldPosition.xyz;

        vec3 transformedNormal = normalMatrix * normal;
        vNormal = normalize(transformedNormal);

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uDeepColor;
      uniform vec3 uShallowColor;
      uniform vec3 uSunsetColor;
      uniform float uCausticIntensity;
      uniform float uWaveSpeed;
      uniform float uConcentric;

      varying vec3 vWorldPosition;
      varying vec3 vNormal;
      varying vec2 vUv;
      varying vec3 vViewPosition;

      vec2 hash22(vec2 p) {
        p = fract(p * vec2(5.3983, 5.4427));
        p += dot(p.yx, p.xy + vec2(21.5351, 14.3137));
        return fract(vec2(p.x * p.y * 95.4337, p.x * p.y * 97.597));
      }

      float voronoiCaustic(vec2 p, float time) {
        vec2 n = floor(p);
        vec2 f = fract(p);
        float md = 8.0;
        for (int j = -1; j <= 1; j++) {
          for (int i = -1; i <= 1; i++) {
            vec2 g = vec2(float(i), float(j));
            vec2 o = hash22(n + g);
            o = 0.5 + 0.45 * sin(time * 2.2 + 6.2831 * o);
            vec2 r = g + o - f;
            float d = dot(r, r);
            if (d < md) md = d;
          }
        }
        return sqrt(md);
      }

      void main() {
        vec3 viewDir = normalize(vViewPosition);

        float t = uTime * uWaveSpeed;
        vec2 p = vWorldPosition.xz * 1.4;

        float nx = sin(p.x * 4.0 + t * 2.0) * 0.12 + cos(p.y * 3.5 - t * 1.7) * 0.08;
        float ny = cos(p.x * 3.5 - t * 1.8) * 0.08 + sin(p.y * 4.0 + t * 2.2) * 0.12;
        vec3 perturbedNormal = normalize(vNormal + vec3(nx, ny, 0.0));

        // View-dependent Fresnel reflection factor
        float cosTheta = clamp(dot(viewDir, perturbedNormal), 0.0, 1.0);
        float fresnel = 0.12 + 0.88 * pow(1.0 - cosTheta, 3.5);

        // Dual-layer Voronoi caustics
        float c1 = voronoiCaustic(vWorldPosition.xz * 1.2 + vec2(t * 0.12, t * 0.08), t);
        float c2 = voronoiCaustic(vWorldPosition.xz * 1.7 - vec2(t * 0.10, -t * 0.14), t * 1.2);
        float caustic = pow(1.0 - min(c1, c2), 2.2) * uCausticIntensity;

        // Depth gradient blend
        float depthFactor = clamp(0.5 + 0.5 * sin(vWorldPosition.x * 0.4 + vWorldPosition.z * 0.4 + t * 0.8), 0.0, 1.0);
        vec3 waterBase = mix(uDeepColor, uShallowColor, depthFactor * 0.65 + 0.2);

        // Blend with sunset sky reflection
        vec3 finalColor = mix(waterBase, uSunsetColor, fresnel * 0.65);

        // Specular highlight from directional sun
        vec3 sunLightDir = normalize(vec3(0.35, 0.85, 0.35));
        vec3 halfVec = normalize(sunLightDir + viewDir);
        float spec = pow(max(dot(perturbedNormal, halfVec), 0.0), 36.0) * 0.85;
        finalColor += uSunsetColor * spec;

        // Caustic highlight
        finalColor += vec3(0.9, 0.96, 1.0) * caustic;

        gl_FragColor = vec4(finalColor, 0.88);
      }
    `,
    transparent: true,
    side: options.side !== undefined ? options.side : THREE.DoubleSide,
    depthWrite: false
  });

  waterShaderMaterials.push(mat);
  return mat;
}

// --- Procedural Dynamic Sunset Skybox & Celestial Dome ---
export let sunsetSkyDome = null;
(function buildSunsetSkyDome() {
  const domeGeo = new THREE.SphereGeometry(320, 32, 24);
  const domeMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0.0 },
      uZenithColor: { value: new THREE.Color(0x0f172a) },
      uHorizonColor: { value: new THREE.Color(0x831843) },
      uSunsetColor: { value: new THREE.Color(0xf59e0b) },
      uStardustIntensity: { value: 1.0 }
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uZenithColor;
      uniform vec3 uHorizonColor;
      uniform vec3 uSunsetColor;
      uniform float uStardustIntensity;

      varying vec3 vWorldPosition;
      varying vec2 vUv;

      float hash(vec3 p) {
        p = fract(p * 0.3183099 + 0.1);
        p *= 17.0;
        return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
      }

      float noise3D(vec3 x) {
        vec3 i = floor(x);
        vec3 f = fract(x);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(
            mix(hash(i + vec3(0.0, 0.0, 0.0)), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
            mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
          mix(
            mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
            mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x), f.y), f.z);
      }

      float fbm(vec3 p) {
        float v = 0.0;
        float a = 0.5;
        vec3 shift = vec3(100.0);
        for (int i = 0; i < 4; ++i) {
          v += a * noise3D(p);
          p = p * 2.0 + shift;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec3 dir = normalize(vWorldPosition);
        float h = clamp(dir.y, -0.1, 1.0);

        // Multi-stop sunset gradient interpolation
        vec3 skyColor;
        if (h < 0.22) {
          float t = smoothstep(-0.06, 0.22, h);
          skyColor = mix(uSunsetColor, uHorizonColor, t);
        } else {
          float t = smoothstep(0.22, 0.88, h);
          skyColor = mix(uHorizonColor, uZenithColor, t);
        }

        // Sunset solar radiance glow towards sunset vector
        vec3 sunDir = normalize(vec3(0.35, 0.12, 0.75));
        float sunDot = max(dot(dir, sunDir), 0.0);
        float sunGlow = pow(sunDot, 10.0) * 0.6 + pow(sunDot, 36.0) * 0.9;
        skyColor += uSunsetColor * sunGlow;

        // Floating procedural stardust clouds and twilight stellar motes
        if (h > 0.04) {
          vec3 stardustCoord = dir * 12.0 + vec3(uTime * 0.018, uTime * 0.012, uTime * 0.022);
          float clouds = fbm(stardustCoord);
          float cloudMask = smoothstep(0.42, 0.78, clouds) * smoothstep(0.04, 0.45, h) * uStardustIntensity;

          vec3 starCoord = dir * 42.0 + vec3(uTime * 0.035, 0.0, uTime * 0.025);
          float stars = pow(noise3D(starCoord), 14.0) * 20.0 * smoothstep(0.18, 0.8, h) * uStardustIntensity;

          vec3 stardustGlow = mix(vec3(0.13, 0.83, 0.93), vec3(0.96, 0.62, 0.04), clouds);
          skyColor += stardustGlow * (cloudMask * 0.42) + vec3(1.0, 0.96, 0.92) * stars;
        }

        gl_FragColor = vec4(skyColor, 1.0);
      }
    `
  });
  sunsetSkyDome = new THREE.Mesh(domeGeo, domeMat);
  scene.add(sunsetSkyDome);
})();

// --- Cherry Blossom Pastel Petal Wind Particles & Outdoor Physics ---
export const petalParticles = [];
const petalGroup = new THREE.Group();
scene.add(petalGroup);

// Dynamically construct outdoor sector bounding zones from SECTOR_REGISTRY
export const OUTDOOR_SECTORS = getFloorSectors('OUTDOOR').map(sec => ({
  name: sec.slug,
  minX: sec.coords.x - sec.size.w / 2 + 2,
  maxX: sec.coords.x + sec.size.w / 2 - 2,
  minZ: sec.coords.z - sec.size.l / 2 + 2,
  maxZ: sec.coords.z + sec.size.l / 2 - 2
}));

// Fallback if empty
if (OUTDOOR_SECTORS.length === 0) {
  OUTDOOR_SECTORS.push(
    { name: 'rose_maze', minX: 33, maxX: 57, minZ: 78, maxZ: 102 },
    { name: 'gatehouse', minX: -12, maxX: 12, minZ: 78, maxZ: 102 },
    { name: 'gazebo', minX: -10, maxX: 10, minZ: 124, maxZ: 146 },
    { name: 'reflection_pool', minX: -57, maxX: -33, minZ: 78, maxZ: 102 }
  );
}

function resetPetalPhysics(p) {
  const sectorInfo = OUTDOOR_SECTORS[Math.floor(Math.random() * OUTDOOR_SECTORS.length)];
  p.sector = sectorInfo.name;
  p.mesh.position.set(
    sectorInfo.minX + Math.random() * (sectorInfo.maxX - sectorInfo.minX),
    6.0 + Math.random() * 9.0,
    sectorInfo.minZ + Math.random() * (sectorInfo.maxZ - sectorInfo.minZ)
  );
  p.mesh.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
  p.velX = -0.6 - Math.random() * 0.8;
  p.velY = -0.3 - Math.random() * 0.5;
  p.velZ = (Math.random() - 0.5) * 0.8;
  p.baseY = 0.0;
  p.bounceCount = 0;
  p.settleTimer = 0.0;
  p.rotVelX = 1.0 + Math.random() * 2.0;
  p.rotVelY = 0.8 + Math.random() * 1.5;
  p.rotVelZ = 1.2 + Math.random() * 2.2;
  p.windPhase = Math.random() * Math.PI * 2;
}

(function initPetals() {
  const petalMat = new THREE.MeshStandardMaterial({
    color: 0xf472b6,
    emissive: 0xec4899,
    emissiveIntensity: 0.4,
    roughness: 0.5,
    side: THREE.DoubleSide
  });

  for (let i = 0; i < 96; i++) {
    const mesh = new THREE.Mesh(new THREE.CircleGeometry(0.14, 6), petalMat);
    petalGroup.add(mesh);
    const p = { mesh };
    resetPetalPhysics(p);
    petalParticles.push(p);
  }
})();

// --- Multi-Tier Crystal Chandelier & Sparkle Glints in Foyer ---
export const chandelierGlints = [];
const chandelierGroup = new THREE.Group();

(function buildChandelier() {
  chandelierGroup.position.set(0, 9.5, 0);

  const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.15 });
  const crystalMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, transparent: true, opacity: 0.75 });
  const glintMat = new THREE.MeshBasicMaterial({
    color: 0xfef08a,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false
  });

  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.2, 12), goldMat);
  rod.position.y = 1.1;
  chandelierGroup.add(rod);

  for (let r of [2.0, 1.4, 0.8]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.06, 8, 24), goldMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = (2.0 - r) * 0.45;
    chandelierGroup.add(ring);

    const numPrisms = Math.floor(r * 10);
    for (let i = 0; i < numPrisms; i++) {
      const angle = (i / numPrisms) * Math.PI * 2;
      const prism = new THREE.Mesh(new THREE.OctahedronGeometry(0.14), crystalMat);
      prism.scale.set(0.6, 1.8, 0.6);
      const px = Math.cos(angle) * r;
      const py = (2.0 - r) * 0.45 - 0.3;
      const pz = Math.sin(angle) * r;
      prism.position.set(px, py, pz);
      chandelierGroup.add(prism);

      if (i % 2 === 0) {
        const glintCross = new THREE.Group();
        const p1 = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.05), glintMat.clone());
        const p2 = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 0.26), glintMat.clone());
        glintCross.add(p1);
        glintCross.add(p2);
        glintCross.position.set(px, py - 0.15, pz);
        chandelierGroup.add(glintCross);

        chandelierGlints.push({
          mesh: glintCross,
          baseScale: 0.9 + Math.random() * 0.4,
          phase: Math.random() * Math.PI * 2,
          rotSpeed: 0.8 + Math.random() * 1.4
        });
      }
    }
  }
  scene.add(chandelierGroup);
})();

export function updateChandelierGlints(delta, time) {
  chandelierGlints.forEach(glint => {
    const pulse = Math.sin(time * 4.2 + glint.phase);
    const scale = glint.baseScale * (0.35 + 0.65 * Math.max(0.0, pulse));
    glint.mesh.scale.setScalar(scale);

    const alpha = 0.2 + 0.8 * Math.pow(Math.max(0.0, Math.sin(time * 5.0 + glint.phase * 1.7)), 2.0);
    glint.mesh.children.forEach(child => {
      if (child.material) {
        child.material.opacity = alpha;
      }
    });

    glint.mesh.rotation.z += delta * glint.rotSpeed;
  });
}

export function updatePetals(delta, time) {
  petalParticles.forEach(p => {
    if (p.bounceCount >= 3 && p.settleTimer > 0) {
      p.settleTimer += delta;
      if (p.settleTimer > 2.2) {
        resetPetalPhysics(p);
      }
      return;
    }

    // 3D Sinusoidal Wind Turbulence
    const gustX = -1.1 + Math.sin(time * 1.5 + p.windPhase) * 0.8 + Math.cos(time * 0.7 + p.mesh.position.z * 0.05) * 0.35;
    const gustZ = Math.cos(time * 1.1 + p.windPhase * 1.3) * 0.65 + Math.sin(time * 0.4 + p.mesh.position.x * 0.05) * 0.25;
    const turbY = Math.sin(time * 2.1 + p.mesh.position.x * 0.12) * 0.25;

    p.velX = gustX;
    p.velZ = gustZ;
    p.velY += (-0.6 + turbY) * delta;

    p.mesh.position.x += p.velX * delta;
    p.mesh.position.y += p.velY * delta;
    p.mesh.position.z += p.velZ * delta;

    p.mesh.rotation.x += p.rotVelX * delta;
    p.mesh.rotation.y += p.rotVelY * delta;
    p.mesh.rotation.z += p.rotVelZ * delta;

    // Ground collision bounce with damping
    if (p.mesh.position.y <= 0.06) {
      p.mesh.position.y = 0.06;
      p.velY = -p.velY * 0.35;
      p.bounceCount++;
      if (p.bounceCount >= 3 || Math.abs(p.velY) < 0.15) {
        p.settleTimer = 0.01;
      }
    }

    // Out of bounds safety reset
    if (p.mesh.position.y < -0.5 || p.mesh.position.y > 22.0 || Math.abs(p.mesh.position.x) > 120.0 || p.mesh.position.z < 60.0 || p.mesh.position.z > 220.0) {
      resetPetalPhysics(p);
    }
  });

  // Skybox time and rotation update
  if (sunsetSkyDome) {
    sunsetSkyDome.rotation.y = time * 0.015;
    if (sunsetSkyDome.material.uniforms && sunsetSkyDome.material.uniforms.uTime) {
      sunsetSkyDome.material.uniforms.uTime.value = time;
    }
  }

  // Water Shader Uniforms update
  waterShaderMaterials.forEach(mat => {
    if (mat.uniforms && mat.uniforms.uTime) {
      mat.uniforms.uTime.value = time;
    }
  });

  // Chandelier Glints update
  updateChandelierGlints(delta, time);
}

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

// Floating Sweet Heart Bubbles
export const heartBubbles = [];
const heartShapeGeo = new THREE.OctahedronGeometry(0.22);
const heartColors = [0xec4899, 0xf43f5e, 0xfb7185, 0xf472b6, 0xa855f7, 0x22d3ee];

export function spawnHeartBubbles(pos, count = 16) {
  for (let i = 0; i < count; i++) {
    const color = heartColors[Math.floor(Math.random() * heartColors.length)];
    const mat = new THREE.MeshBasicMaterial({
      color,
      wireframe: i % 2 === 0,
      transparent: true,
      opacity: 0.95
    });
    const mesh = new THREE.Mesh(heartShapeGeo, mat);
    mesh.position.copy(pos).add(new THREE.Vector3((Math.random() - 0.5) * 0.8, Math.random() * 0.5, (Math.random() - 0.5) * 0.8));
    mesh.scale.setScalar(0.4 + Math.random() * 0.6);

    const vel = new THREE.Vector3(
      (Math.random() - 0.5) * 1.8,
      1.5 + Math.random() * 2.2,
      (Math.random() - 0.5) * 1.8
    );

    heartBubbles.push({
      mesh,
      vel,
      life: 1.8,
      maxLife: 1.8,
      swayPhase: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 4
    });
    scene.add(mesh);
  }
}

export function updateHeartBubbles(delta, time) {
  for (let i = heartBubbles.length - 1; i >= 0; i--) {
    const b = heartBubbles[i];
    b.life -= delta;
    b.swayPhase += delta * 3.5;
    
    b.mesh.position.y += b.vel.y * delta;
    b.mesh.position.x += (b.vel.x + Math.sin(b.swayPhase) * 0.8) * delta;
    b.mesh.position.z += (b.vel.z + Math.cos(b.swayPhase) * 0.8) * delta;
    
    b.mesh.rotation.y += b.rotSpeed * delta;
    b.mesh.rotation.z += b.rotSpeed * 0.5 * delta;

    const alpha = Math.max(0, b.life / b.maxLife);
    if (b.mesh.material) b.mesh.material.opacity = alpha;

    if (b.life <= 0) {
      scene.remove(b.mesh);
      b.mesh.geometry.dispose();
      b.mesh.material.dispose();
      heartBubbles.splice(i, 1);
    }
  }
}

// Sparkle Footstep Stardust
export const sparkleFootsteps = [];
const sparkleGeo = new THREE.OctahedronGeometry(0.09);
const sparkleColors = [0xfde047, 0xf472b6, 0x38bdf8, 0x4ade80, 0xc084fc];

export function spawnSparkleFootstep(pos) {
  if (sparkleFootsteps.length > 40) return; // Pool cap for performance
  for (let i = 0; i < 3; i++) {
    const color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 });
    const mesh = new THREE.Mesh(sparkleGeo, mat);
    mesh.position.copy(pos).add(new THREE.Vector3((Math.random() - 0.5) * 0.35, 0.08, (Math.random() - 0.5) * 0.35));
    
    sparkleFootsteps.push({
      mesh,
      life: 0.6,
      maxLife: 0.6,
      velY: 0.4 + Math.random() * 0.5
    });
    scene.add(mesh);
  }
}

export function updateSparkleFootsteps(delta) {
  for (let i = sparkleFootsteps.length - 1; i >= 0; i--) {
    const s = sparkleFootsteps[i];
    s.life -= delta;
    s.mesh.position.y += s.velY * delta;
    s.mesh.rotation.y += 6.0 * delta;
    
    const alpha = Math.max(0, s.life / s.maxLife);
    if (s.mesh.material) s.mesh.material.opacity = alpha;

    if (s.life <= 0) {
      scene.remove(s.mesh);
      s.mesh.geometry.dispose();
      s.mesh.material.dispose();
      sparkleFootsteps.splice(i, 1);
    }
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

// Room-adaptive dynamic lighting controller based on SECTOR_REGISTRY
export function updateSceneLighting(roomName) {
  const sector = getSector(roomName);

  if (sector && sector.ambient) {
    ambientLight.color.setHex(sector.ambient.color);
    ambientLight.intensity = sector.ambient.intensity;
  } else if (roomName === 'foyer') {
    ambientLight.color.setHex(0x38bdf8);
    ambientLight.intensity = 0.65;
  } else if (roomName === 'library') {
    ambientLight.color.setHex(0xfde047);
    ambientLight.intensity = 0.55;
  } else if (roomName === 'garden' || roomName === 'greenhouse' || roomName === 'rose_maze') {
    ambientLight.color.setHex(0x6ee7b7);
    ambientLight.intensity = 0.85;
  } else if (roomName === 'gatehouse' || roomName === 'reflection_pool' || roomName === 'gazebo') {
    ambientLight.color.setHex(0xf59e0b);
    ambientLight.intensity = 0.8;
  } else if (roomName === 'observatory' || roomName === 'ballroom' || roomName === 'cathedral') {
    ambientLight.color.setHex(0x38bdf8);
    ambientLight.intensity = 0.7;
  } else if (roomName === 'lab' || roomName === 'crypt') {
    ambientLight.color.setHex(0x06b6d4);
    ambientLight.intensity = 0.6;
  }

  // Sun Light intensity adjusting by floor & environment
  if (sector) {
    if (sector.floor === 'OUTDOOR' || sector.floor === '4F') {
      sunLight.intensity = 1.35;
    } else if (sector.floor === 'B1' || sector.floor === 'B2') {
      sunLight.intensity = 0.3;
    } else {
      sunLight.intensity = 0.9;
    }
  } else {
    if (roomName === 'garden' || roomName === 'greenhouse' || roomName === 'rose_maze') {
      sunLight.intensity = 1.35;
    } else if (roomName === 'gatehouse' || roomName === 'reflection_pool' || roomName === 'gazebo') {
      sunLight.intensity = 1.4;
    } else if (roomName === 'lab' || roomName === 'crypt') {
      sunLight.intensity = 0.3;
    } else {
      sunLight.intensity = 0.9;
    }
  }
}

export const muzzleLight = new THREE.PointLight(0xf59e0b, 0, 10);
scene.add(muzzleLight);

// Spatial Culling & Dynamic Point Light Throttling for 32+ Connected Chambers
export function updateSpatialCulling(playerPos, maxDistance = 75.0) {
  if (!playerPos) return;
  const pX = playerPos.x;
  const pZ = playerPos.z;

  Object.values(sectorPointLights).forEach(ptLight => {
    if (!ptLight) return;
    const dx = ptLight.position.x - pX;
    const dz = ptLight.position.z - pZ;
    const distSq = dx * dx + dz * dz;
    const isNearby = distSq < (maxDistance * maxDistance);
    
    ptLight.visible = isNearby;
  });
}

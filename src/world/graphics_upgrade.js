/**
 * Resident Lovely — CHATRY Graphics Upgrade
 *
 * Additive visual polish layer. No gameplay state mutation.
 * Uses the existing Three.js global and scene exports.
 */
import {
  scene,
  renderer,
  graphicsQuality,
  sunsetSkyDome
} from './scene.js';
import { player } from '../entities/player.js';

const REDUCED_MOTION = typeof window !== 'undefined'
  && typeof window.matchMedia === 'function'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const QUALITY_CAPS = Object.freeze({
  low: { particles: 120, auroraOpacity: 0.028, rimIntensity: 0.18 },
  med: { particles: 260, auroraOpacity: 0.042, rimIntensity: 0.26 },
  high: { particles: 420, auroraOpacity: 0.055, rimIntensity: 0.34 }
});

function makeRadialTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(32, 32, 1, 32, 32, 30);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.18, 'rgba(255,255,255,0.86)');
  gradient.addColorStop(0.55, 'rgba(255,255,255,0.25)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function makeAuroraTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 256);
  gradient.addColorStop(0, 'rgba(34,211,238,0)');
  gradient.addColorStop(0.38, 'rgba(34,211,238,0.45)');
  gradient.addColorStop(0.52, 'rgba(236,72,153,0.36)');
  gradient.addColorStop(0.7, 'rgba(168,85,247,0.22)');
  gradient.addColorStop(1, 'rgba(34,211,238,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

const quality = QUALITY_CAPS[graphicsQuality?.preset] || QUALITY_CAPS.med;
const particleCount = REDUCED_MOTION
  ? Math.max(40, Math.floor(quality.particles * 0.45))
  : quality.particles;

const rig = new THREE.Group();
rig.name = 'CHATRY_GRAPHICS_UPGRADE_RIG';
scene.add(rig);

/* Local fairy-dust field: follows the player to remain dense only where visible. */
const dustPositions = new Float32Array(particleCount * 3);
const dustSeeds = new Float32Array(particleCount);
for (let i = 0; i < particleCount; i += 1) {
  const i3 = i * 3;
  const radius = 8 + Math.random() * 34;
  const theta = Math.random() * Math.PI * 2;
  const y = 1 + Math.random() * 14;
  dustPositions[i3] = Math.cos(theta) * radius;
  dustPositions[i3 + 1] = y;
  dustPositions[i3 + 2] = Math.sin(theta) * radius;
  dustSeeds[i] = Math.random() * Math.PI * 2;
}

const dustGeometry = new THREE.BufferGeometry();
dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));

const dustMaterial = new THREE.PointsMaterial({
  map: makeRadialTexture(),
  color: 0xfbcfe8,
  size: graphicsQuality.preset === 'high' ? 0.16 : 0.13,
  transparent: true,
  opacity: REDUCED_MOTION ? 0.34 : 0.52,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  sizeAttenuation: true
});

const dust = new THREE.Points(dustGeometry, dustMaterial);
dust.name = 'chatry_fairy_dust';
rig.add(dust);

/* Two ultra-subtle aurora planes create depth without a heavyweight post stack. */
const auroraTexture = makeAuroraTexture();
const auroraMaterialA = new THREE.MeshBasicMaterial({
  map: auroraTexture,
  transparent: true,
  opacity: quality.auroraOpacity,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  side: THREE.DoubleSide
});
const auroraMaterialB = auroraMaterialA.clone();
auroraMaterialB.opacity = quality.auroraOpacity * 0.7;

const auroraA = new THREE.Mesh(new THREE.PlaneGeometry(26, 20, 1, 1), auroraMaterialA);
auroraA.name = 'chatry_aurora_a';
auroraA.position.set(-6, 10, -10);
auroraA.rotation.y = Math.PI * 0.12;
rig.add(auroraA);

const auroraB = new THREE.Mesh(new THREE.PlaneGeometry(22, 17, 1, 1), auroraMaterialB);
auroraB.name = 'chatry_aurora_b';
auroraB.position.set(10, 8, -6);
auroraB.rotation.y = -Math.PI * 0.22;
rig.add(auroraB);

/* Character key/rim light. It never casts shadows, so cost stays low. */
const rim = new THREE.PointLight(0xf9a8d4, quality.rimIntensity, 10, 2);
rim.name = 'chatry_player_rim';
rim.position.set(-1.5, 4.0, -2.2);
if (player?.group) player.group.add(rim);

let elapsed = 0;

function tick() {
  requestAnimationFrame(tick);
  if (!player?.group) return;

  elapsed += 0.016;
  const p = player.group.position;
  rig.position.set(p.x, p.y, p.z);

  if (!REDUCED_MOTION) {
    dust.rotation.y += 0.00075;
    dust.rotation.x = Math.sin(elapsed * 0.22) * 0.03;
    auroraA.rotation.z = Math.sin(elapsed * 0.18) * 0.035;
    auroraB.rotation.z = Math.cos(elapsed * 0.14) * 0.045;
    auroraA.position.x = -6 + Math.sin(elapsed * 0.11) * 1.3;
    auroraB.position.x = 10 + Math.cos(elapsed * 0.09) * 1.1;
  }

  const pulse = 1 + Math.sin(elapsed * 1.7) * 0.12;
  rim.intensity = quality.rimIntensity * pulse;

  if (sunsetSkyDome?.material?.uniforms?.uTime) {
    sunsetSkyDome.material.uniforms.uTime.value = elapsed * 0.12;
  }
}

export const chatryGraphicsUpgrade = Object.freeze({
  version: '8.0.0-chatry',
  preset: graphicsQuality?.preset || 'med',
  particleCount,
  reducedMotion: REDUCED_MOTION,
  rendererPixelRatio: renderer.getPixelRatio(),
  enabled: true
});

tick();

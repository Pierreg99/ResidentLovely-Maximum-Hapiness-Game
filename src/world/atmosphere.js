// =========================================================================
// RESIDENT LOVELY - ATMOSPHERIC WEATHER & CELESTIAL DAY/NIGHT ENGINE
// Standard: NEXUS PRIVE v6.0 | Strict Zero-Emoji Protocol | Native ESM
// =========================================================================

import { ambientLight, sunLight, scene } from './scene.js';

export const ATMOSPHERE_PHASES = {
  SUNSET: {
    name: 'Twilight Sunset',
    skyTop: 0x05070a,
    skyBottom: 0x9a3412,
    ambientColor: 0xf59e0b,
    ambientIntensity: 0.48,
    sunColor: 0xfb923c,
    sunIntensity: 1.45,
    fogColor: 0x1c1917,
    auroraStrength: 0.0
  },
  MIDNIGHT: {
    name: 'Starlight Midnight',
    skyTop: 0x020408,
    skyBottom: 0x0f172a,
    ambientColor: 0x38bdf8,
    ambientIntensity: 0.38,
    sunColor: 0x22d3ee,
    sunIntensity: 0.95,
    fogColor: 0x05070a,
    auroraStrength: 0.42
  },
  AURORA: {
    name: 'Celestial Aurora',
    skyTop: 0x064e3b,
    skyBottom: 0x3b0764,
    ambientColor: 0x10b981,
    ambientIntensity: 0.75,
    sunColor: 0xa855f7,
    sunIntensity: 1.4,
    fogColor: 0x064e3b,
    auroraStrength: 1.0
  }
};

export class AtmosphereEngine {
  constructor() {
    this.phaseOrder = ['SUNSET', 'MIDNIGHT', 'AURORA'];
    this.currentPhaseIndex = 0;
    this.transitionProgress = 0.0;
    this.cycleDuration = 120.0; // 120 seconds full cycle
    this.currentTime = 0;
    this.skyboxMesh = null;
    this.skyboxMaterial = null;
    this.weatherType = 'clear'; // 'clear', 'blossom_mist', 'aurora_borealis'

    this.initSkybox();
  }

  initSkybox() {
    const geo = new THREE.SphereGeometry(450, 24, 24);
    
    // Procedural Shader Material for Celestial Atmosphere
    this.skyboxMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTopColor: { value: new THREE.Color(ATMOSPHERE_PHASES.SUNSET.skyTop) },
        uBottomColor: { value: new THREE.Color(ATMOSPHERE_PHASES.SUNSET.skyBottom) },
        uAuroraStrength: { value: 0.0 }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uTopColor;
        uniform vec3 uBottomColor;
        uniform float uAuroraStrength;
        varying vec3 vWorldPosition;

        float hash13(vec3 p) {
          p = fract(p * 0.3183099 + 0.1);
          p *= 17.0;
          return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
        }

        void main() {
          vec3 dir = normalize(vWorldPosition);
          float h = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);
          // Soft horizon haze for depth / AO read against architecture
          float haze = smoothstep(0.35, 0.55, h) * (1.0 - smoothstep(0.55, 0.85, h));
          vec3 baseSky = mix(uBottomColor, uTopColor, pow(h, 1.15));
          baseSky += vec3(0.96, 0.72, 0.42) * haze * 0.12;

          // Sparse twinkling stars toward zenith
          if (dir.y > 0.15) {
            float stars = pow(hash13(floor(dir * 90.0)), 18.0) * 14.0;
            stars *= smoothstep(0.15, 0.55, dir.y);
            float twinkle = 0.65 + 0.35 * sin(uTime * 3.5 + stars * 20.0);
            baseSky += vec3(0.95, 0.97, 1.0) * stars * twinkle * (0.45 + uAuroraStrength * 0.35);
          }

          // Procedural Aurora Ribbon
          if (uAuroraStrength > 0.05 && dir.y > 0.1) {
            float wave = sin(dir.x * 6.0 + uTime * 1.5) * cos(dir.z * 4.0 + uTime * 1.2);
            float ribbon = smoothstep(0.3, 0.7, wave * (dir.y));
            vec3 auroraColor = mix(vec3(0.06, 0.72, 0.50), vec3(0.65, 0.33, 0.96), sin(dir.x * 3.0 + uTime) * 0.5 + 0.5);
            baseSky += auroraColor * ribbon * uAuroraStrength * 0.85;
          }

          gl_FragColor = vec4(baseSky, 1.0);
        }
      `,
      side: THREE.BackSide,
      depthWrite: false
    });

    this.skyboxMesh = new THREE.Mesh(geo, this.skyboxMaterial);
    this.skyboxMesh.name = 'celestial_dynamic_skybox';
    scene.add(this.skyboxMesh);
  }

  update(delta, playerPos) {
    this.currentTime += delta;
    if (this.skyboxMesh && playerPos) {
      this.skyboxMesh.position.copy(playerPos);
    }

    // Advance Cycle
    const cycleTime = (this.currentTime % this.cycleDuration) / this.cycleDuration; // 0.0 to 1.0
    const totalPhases = this.phaseOrder.length;
    const scaledTime = cycleTime * totalPhases;
    const currentIndex = Math.floor(scaledTime);
    const nextIndex = (currentIndex + 1) % totalPhases;
    const blend = scaledTime - currentIndex;

    const currentCfg = ATMOSPHERE_PHASES[this.phaseOrder[currentIndex]];
    const nextCfg = ATMOSPHERE_PHASES[this.phaseOrder[nextIndex]];

    // Interpolate Sky Uniforms
    if (this.skyboxMaterial) {
      this.skyboxMaterial.uniforms.uTime.value = this.currentTime;
      
      const topCol = new THREE.Color(currentCfg.skyTop).lerp(new THREE.Color(nextCfg.skyTop), blend);
      const botCol = new THREE.Color(currentCfg.skyBottom).lerp(new THREE.Color(nextCfg.skyBottom), blend);
      const aurora = THREE.MathUtils.lerp(currentCfg.auroraStrength, nextCfg.auroraStrength, blend);

      this.skyboxMaterial.uniforms.uTopColor.value.copy(topCol);
      this.skyboxMaterial.uniforms.uBottomColor.value.copy(botCol);
      this.skyboxMaterial.uniforms.uAuroraStrength.value = aurora;
    }

    // Interpolate Scene Lighting
    if (ambientLight) {
      const ambCol = new THREE.Color(currentCfg.ambientColor).lerp(new THREE.Color(nextCfg.ambientColor), blend);
      const ambInt = THREE.MathUtils.lerp(currentCfg.ambientIntensity, nextCfg.ambientIntensity, blend);
      ambientLight.color.copy(ambCol);
      ambientLight.intensity = ambInt;
    }

    if (sunLight) {
      const sunCol = new THREE.Color(currentCfg.sunColor).lerp(new THREE.Color(nextCfg.sunColor), blend);
      const sunInt = THREE.MathUtils.lerp(currentCfg.sunIntensity, nextCfg.sunIntensity, blend);
      sunLight.color.copy(sunCol);
      sunLight.intensity = sunInt;
    }

    // Interpolate Fog
    if (scene.fog) {
      const fogCol = new THREE.Color(currentCfg.fogColor).lerp(new THREE.Color(nextCfg.fogColor), blend);
      scene.fog.color.copy(fogCol);
    }
  }
}

export const atmosphereEngine = new AtmosphereEngine();

// =========================================================================
// RESIDENT LOVELY - PER-SECTOR GLSL SURFACE SHADERS & REALISM ENGINE
// Standard: NEXUS PRIVE v6.0 | Strict Zero-Emoji Protocol | Native ESM
// Target: Mobile WebGL (60 FPS, Frame Budget <= 5.0ms)
// =========================================================================

import { SECTOR_REGISTRY, getSector, getAdjacentSectors, BIOME_COLORS } from '../sectors.js';

// Global THREE resolver for browser and headless testing
const getTHREE = () => {
  if (typeof THREE !== 'undefined') return THREE;
  if (typeof globalThis !== 'undefined' && globalThis.THREE) return globalThis.THREE;
  return null;
};

// =========================================================================
// GLSL NOISE & PROCEDURAL UTILITY CHUNKS
// =========================================================================

export const GLSL_COMMON_NOISE = `
// 2D Hash
float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

// 2D Value Noise
float valueNoise2D(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i + vec2(0.0, 0.0)), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

// 2D Fractal Brownian Motion
float fbm2D(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 4; i++) {
    v += a * valueNoise2D(p);
    p = rot * p * 2.0 + vec2(100.0, 100.0);
    a *= 0.5;
  }
  return v;
}

// 2D Voronoi Cellular Distance
vec2 voronoi2D(vec2 p) {
  vec2 n = floor(p);
  vec2 f = fract(p);
  vec2 mg, mr;
  float md = 8.0;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j));
      vec2 o = vec2(hash21(n + g), hash21(n + g + vec2(52.1, 13.7)));
      o = 0.5 + 0.5 * sin(6.2831 * o);
      vec2 r = g + o - f;
      float d = dot(r, r);
      if (d < md) {
        md = d;
        mr = r;
        mg = g;
      }
    }
  }
  return vec2(sqrt(md), hash21(n + mg));
}
`;

// =========================================================================
// 1. IVY VEIN SHADER (S02 Library, S04 Greenhouse, S19 Haunted Conservatory)
// =========================================================================

export const ivyVeinVertexShader = `
uniform float uTime;
uniform float uAdjacentInfluence;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vUv = uv;
  vec3 pos = position;

  // Subtle organic pulsation along surface
  float pulse = sin(pos.x * 2.5 + pos.y * 2.5 + uTime * 1.5) * 0.02 * uAdjacentInfluence;
  pos += normal * pulse;

  vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
  vWorldPosition = worldPosition.xyz;

  vec3 transformedNormal = normalMatrix * normal;
  vNormal = normalize(transformedNormal);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  vViewPosition = -mvPosition.xyz;

  gl_Position = projectionMatrix * mvPosition;
}
`;

export const ivyVeinFragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uBaseColor;
uniform vec3 uVeinColor;
uniform float uPulseSpeed;
uniform float uVeinDensity;
uniform float uGlowIntensity;
uniform float uAdjacentInfluence;
uniform float uActive;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vViewPosition;

${GLSL_COMMON_NOISE}

void main() {
  if (uActive < 0.05) {
    gl_FragColor = vec4(uBaseColor, 1.0);
    return;
  }

  vec2 uv = vUv * uVeinDensity;
  float n = fbm2D(uv * 1.5);

  // Voronoi branch distance field
  vec2 vInfo = voronoi2D(uv + n * 0.4);
  float distToEdge = vInfo.x;
  float cellId = vInfo.y;

  // Vein mask with sharp core and soft glow falloff
  float veinCore = 1.0 - smoothstep(0.02, 0.09, distToEdge);
  float veinGlow = 1.0 - smoothstep(0.04, 0.35, distToEdge);

  // Pulsating bioluminescent sap travelling through veins
  float sapPulse = sin(distToEdge * 25.0 - uTime * uPulseSpeed + cellId * 6.28) * 0.5 + 0.5;
  sapPulse = pow(sapPulse, 3.0);

  // Combine base, bark/moss, and glowing sap
  vec3 darkMoss = mix(uBaseColor * 0.45, vec3(0.02, 0.18, 0.08), 0.6);
  vec3 surface = mix(uBaseColor, darkMoss, clamp(veinGlow * 1.2, 0.0, 1.0));

  vec3 activeVeinColor = mix(uVeinColor, vec3(0.13, 0.83, 0.93), uAdjacentInfluence * 0.4);
  vec3 emission = activeVeinColor * (veinCore * 2.0 + veinGlow * sapPulse * uGlowIntensity);

  // Normal shading
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewPosition);
  float fresnel = pow(1.0 - max(0.0, dot(N, V)), 3.0);

  vec3 finalColor = surface + emission + fresnel * activeVeinColor * 0.35 * uAdjacentInfluence;
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

// =========================================================================
// 2. BIOLUMINESCENT FLOOR SHADER (S01 Foyer, S05 Dining, S10 Mastersuite, S20 Tea Salon)
// =========================================================================

export const bioluminescentFloorVertexShader = `
uniform float uTime;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vUv = uv;
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;

  vec3 transformedNormal = normalMatrix * normal;
  vNormal = normalize(transformedNormal);

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vViewPosition = -mvPosition.xyz;

  gl_Position = projectionMatrix * mvPosition;
}
`;

export const bioluminescentFloorFragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uBaseColor;
uniform vec3 uGlowColor;
uniform float uPulseSpeed;
uniform float uTileScale;
uniform float uRippleRadius;
uniform float uAdjacentInfluence;
uniform float uActive;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vViewPosition;

${GLSL_COMMON_NOISE}

void main() {
  if (uActive < 0.05) {
    gl_FragColor = vec4(uBaseColor, 1.0);
    return;
  }

  vec2 uv = vUv * uTileScale;
  vec2 tileF = fract(uv) - 0.5;
  vec2 tileI = floor(uv);

  // Tile grid border grooves
  vec2 borderDist = abs(tileF);
  float border = max(borderDist.x, borderDist.y);
  float grout = smoothstep(0.46, 0.49, border);

  // Multi-octave Carrara marble veining
  float marble = fbm2D(vUv * 8.0);
  float marbleFine = fbm2D(vUv * 22.0 + 4.7);
  float vein = pow(abs(sin((vUv.x * 9.0 + marble * 2.5) * 3.14159)), 7.0);
  vec3 marbleBase = mix(uBaseColor * 0.78, uBaseColor * 1.28, marble * 0.7 + marbleFine * 0.3);
  marbleBase = mix(marbleBase, marbleBase * 0.55, vein * 0.65);

  // Center node distance
  float nodeDist = length(tileF);
  float nodeGlow = 1.0 - smoothstep(0.04, 0.28, nodeDist);

  // Harmonic floor ripple resonance
  float distFromCenter = length(vWorldPosition.xz * 0.08);
  float ripple = sin(distFromCenter * 8.0 - uTime * uPulseSpeed + hash21(tileI) * 1.5) * 0.5 + 0.5;
  ripple = pow(ripple, 2.5);

  // Spore cloud motes on floor
  float sporeNoise = fbm2D(vUv * 16.0 + vec2(uTime * 0.1, -uTime * 0.08));
  float spore = smoothstep(0.68, 0.85, sporeNoise) * 0.75;

  // Bioluminescent emission
  vec3 emission = uGlowColor * (nodeGlow * (0.8 + ripple * 1.4) + spore * 0.6);
  emission *= (1.0 + uAdjacentInfluence * 0.5);

  // Fresnel specular rim + simple specular lobe (mobile-cheap PBR feel)
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewPosition);
  float fresnel = pow(1.0 - max(0.0, dot(N, V)), 2.5);
  vec3 L = normalize(vec3(0.45, 0.85, 0.35));
  vec3 H = normalize(L + V);
  float spec = pow(max(0.0, dot(N, H)), 48.0) * 0.55;

  // Contact AO in tile grooves
  float grooveAO = mix(1.0, 0.55, grout);
  vec3 surface = mix(marbleBase, marbleBase * 0.32, grout) * grooveAO;
  vec3 finalColor = surface + emission + fresnel * uGlowColor * 0.45 + spec * vec3(0.95, 0.97, 1.0);

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

// =========================================================================
// 3. PRISMATIC REFRACTION SHADER (S06 Gallery, S11 Ballroom, S21 Music Parlor, S26 Crystal Grotto, S31 Crystal Vault)
// =========================================================================

export const prismaticRefractionVertexShader = `
uniform float uTime;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vUv = uv;
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;

  vec3 transformedNormal = normalMatrix * normal;
  vNormal = normalize(transformedNormal);

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vViewPosition = -mvPosition.xyz;

  gl_Position = projectionMatrix * mvPosition;
}
`;

export const prismaticRefractionFragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uBaseColor;
uniform float uFacetScale;
uniform float uDispersionStrength;
uniform float uFresnelPower;
uniform float uReflectivity;
uniform float uAdjacentInfluence;
uniform float uActive;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vViewPosition;

${GLSL_COMMON_NOISE}

// Cauchy Spectral Dispersion
vec3 spectralColor(float t) {
  vec3 c = vec3(
    sin(t * 6.2831 + 0.0) * 0.5 + 0.5,
    sin(t * 6.2831 + 2.094) * 0.5 + 0.5,
    sin(t * 6.2831 + 4.188) * 0.5 + 0.5
  );
  return c;
}

void main() {
  if (uActive < 0.05) {
    gl_FragColor = vec4(uBaseColor, 1.0);
    return;
  }

  vec2 uv = vUv * uFacetScale;
  vec2 vCell = voronoi2D(uv);
  float facetDist = vCell.x;
  float facetId = vCell.y;

  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewPosition);

  // Facet normal perturbation
  vec2 facetGrad = vec2(dFdx(facetDist), dFdy(facetDist));
  vec3 perturbedN = normalize(N + vec3(facetGrad * 2.5, 0.0));

  float NdotV = max(0.0, dot(perturbedN, V));
  float fresnel = pow(1.0 - NdotV, uFresnelPower);

  // Dispersion chromatic shift (Sellmeier simulation)
  float dispersionOffset = (facetId + uTime * 0.08) * uDispersionStrength;
  vec3 rainbowR = spectralColor(dispersionOffset + fresnel * 0.4);
  vec3 rainbowG = spectralColor(dispersionOffset + fresnel * 0.4 + 0.03);
  vec3 rainbowB = spectralColor(dispersionOffset + fresnel * 0.4 + 0.06);
  vec3 dispersion = vec3(rainbowR.r, rainbowG.g, rainbowB.b);

  // Sparkle facet specular glint
  vec3 lightDir = normalize(vec3(0.5, 0.8, 0.4));
  vec3 H = normalize(lightDir + V);
  float sparkle = pow(max(0.0, dot(perturbedN, H)), 48.0) * (0.5 + 0.5 * sin(uTime * 4.0 + facetId * 10.0));

  // Facet edge highlights
  float facetEdge = 1.0 - smoothstep(0.0, 0.08, facetDist);

  vec3 base = mix(uBaseColor, dispersion * 1.2, fresnel * uReflectivity);
  vec3 finalColor = base + dispersion * fresnel * 1.3 + sparkle * vec3(1.0, 0.98, 0.9) + facetEdge * dispersion * 0.6;
  finalColor *= (1.0 + uAdjacentInfluence * 0.3);

  gl_FragColor = vec4(finalColor, 0.95);
}
`;

// =========================================================================
// 4. FLOWING RIVER SHADER (S03 Garden, S18 Crypt, S23 Sacred Forest Trail, S24 Harbor Docks, S30 Underground River Cavern)
// =========================================================================

export const flowingRiverVertexShader = `
uniform float uTime;
uniform float uFlowSpeed;
uniform float uWaveHeight;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vUv = uv;
  vec3 pos = position;

  float t = uTime * uFlowSpeed;
  float wave = sin(pos.x * 2.2 + t * 1.5) * cos(pos.z * 1.8 + t * 1.1) * (uWaveHeight * 0.6);
  wave += sin((pos.x + pos.z) * 3.4 - t * 2.0) * (uWaveHeight * 0.4);
  pos.y += wave;

  vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
  vWorldPosition = worldPosition.xyz;

  vec3 transformedNormal = normalMatrix * normal;
  vNormal = normalize(transformedNormal);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  vViewPosition = -mvPosition.xyz;

  gl_Position = projectionMatrix * mvPosition;
}
`;

export const flowingRiverFragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uDeepColor;
uniform vec3 uShallowColor;
uniform vec3 uFoamColor;
uniform float uFlowSpeed;
uniform float uCausticIntensity;
uniform float uAdjacentInfluence;
uniform float uActive;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vViewPosition;

${GLSL_COMMON_NOISE}

void main() {
  if (uActive < 0.05) {
    gl_FragColor = vec4(uDeepColor, 0.85);
    return;
  }

  float t = uTime * uFlowSpeed;
  vec2 flowUv1 = vUv * 6.0 + vec2(t * 0.6, t * 0.2);
  vec2 flowUv2 = vUv * 9.0 + vec2(-t * 0.4, t * 0.5);

  // Dual-layer Voronoi caustics
  vec2 c1 = voronoi2D(flowUv1);
  vec2 c2 = voronoi2D(flowUv2);
  float caustic = pow(min(c1.x, c2.x), 1.8) * uCausticIntensity;

  // Wave ripple normal perturbation
  float n1 = valueNoise2D(flowUv1);
  float n2 = valueNoise2D(flowUv2);
  vec3 normalPerturb = vec3((n1 - 0.5) * 0.35, 1.0, (n2 - 0.5) * 0.35);
  vec3 N = normalize(vNormal + normalPerturb);
  vec3 V = normalize(vViewPosition);

  float fresnel = pow(1.0 - max(0.0, dot(N, V)), 3.5);

  // Foam crests along turbulence
  float foamNoise = fbm2D(vUv * 14.0 + vec2(t * 0.8, t * 0.4));
  float foam = smoothstep(0.62, 0.78, foamNoise);

  // Water depth blend
  vec3 waterColor = mix(uDeepColor, uShallowColor, caustic + fresnel * 0.4);
  vec3 withFoam = mix(waterColor, uFoamColor, foam * 0.85);

  // Specular sun highlight on waves
  vec3 sunDir = normalize(vec3(0.4, 0.9, 0.3));
  vec3 R = reflect(-sunDir, N);
  float specular = pow(max(0.0, dot(R, V)), 64.0) * 1.2;

  vec3 finalColor = withFoam + caustic * vec3(0.4, 0.9, 1.0) + specular * vec3(1.0, 0.98, 0.85);
  finalColor *= (1.0 + uAdjacentInfluence * 0.25);

  gl_FragColor = vec4(finalColor, 0.88 + fresnel * 0.12);
}
`;

// =========================================================================
// 5. STAR TRAIL SKY SHADER (S08 Observatory, S14 Reflection Pool, S22 Village District, S25 Moonlit Meadow, S27 Moonlit Rooftop)
// =========================================================================

export const starTrailSkyVertexShader = `
uniform float uTime;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vViewPosition;

void main() {
  vUv = uv;
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vViewPosition = -mvPosition.xyz;

  gl_Position = projectionMatrix * mvPosition;
}
`;

export const starTrailSkyFragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uZenithColor;
uniform vec3 uHorizonColor;
uniform vec3 uStarColor;
uniform vec3 uNebulaColor;
uniform float uRotationSpeed;
uniform float uStarDensity;
uniform float uAdjacentInfluence;
uniform float uActive;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vViewPosition;

${GLSL_COMMON_NOISE}

void main() {
  if (uActive < 0.05) {
    gl_FragColor = vec4(uZenithColor, 1.0);
    return;
  }

  // Polar coordinate transformation around zenith
  vec2 p = vUv - 0.5;
  float r = length(p);
  float angle = atan(p.y, p.x);

  // Continuous circular star trail exposure
  float trailAngle = angle + uTime * uRotationSpeed;
  vec2 polarUv = vec2(trailAngle * 12.0, r * 35.0 * uStarDensity);

  // Concentric arced star streaks
  float starStreak = sin(polarUv.x * 2.0 + polarUv.y * 3.14159);
  starStreak = pow(max(0.0, starStreak), 16.0);
  float starNoise = hash21(floor(polarUv));
  float stars = starStreak * step(0.72, starNoise) * (0.6 + 0.4 * sin(uTime * 3.0 + starNoise * 10.0));

  // Layered cosmic nebula dust
  vec2 nebulaUv = p * 3.0 + vec2(sin(uTime * 0.05), cos(uTime * 0.04)) * 0.2;
  float nebula = fbm2D(nebulaUv * 2.5);
  float nebulaGlow = smoothstep(0.35, 0.75, nebula);

  // Gradient sky dome
  float horizonBlend = smoothstep(0.05, 0.48, r);
  vec3 skyBase = mix(uZenithColor, uHorizonColor, horizonBlend);

  // Composite cosmic sky
  vec3 nebulaMix = mix(skyBase, uNebulaColor, nebulaGlow * 0.65);
  vec3 finalColor = nebulaMix + stars * uStarColor * 2.2;
  finalColor *= (1.0 + uAdjacentInfluence * 0.3);

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

// =========================================================================
// 6. ICE CRACK FLOOR SHADER (S17 Lab, S32 Ancient Ruins)
// =========================================================================

export const iceCrackFloorVertexShader = `
uniform float uTime;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vUv = uv;
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;

  vec3 transformedNormal = normalMatrix * normal;
  vNormal = normalize(transformedNormal);

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vViewPosition = -mvPosition.xyz;

  gl_Position = projectionMatrix * mvPosition;
}
`;

export const iceCrackFloorFragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uIceBaseColor;
uniform vec3 uCrackGlowColor;
uniform float uCrackDensity;
uniform float uParallaxDepth;
uniform float uGlowPulse;
uniform float uAdjacentInfluence;
uniform float uActive;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vViewPosition;

${GLSL_COMMON_NOISE}

void main() {
  if (uActive < 0.05) {
    gl_FragColor = vec4(uIceBaseColor, 1.0);
    return;
  }

  vec3 V = normalize(vViewPosition);
  vec3 N = normalize(vNormal);

  // Multi-scale Voronoi crack network
  vec2 uv = vUv * uCrackDensity;
  vec2 crack1 = voronoi2D(uv);
  vec2 crack2 = voronoi2D(uv * 2.5 + 4.2);

  // Parallax deep internal fracture layer
  vec2 parallaxUv = uv - V.xy * uParallaxDepth * 0.06;
  vec2 crackDeep = voronoi2D(parallaxUv * 1.8);

  float crackEdge1 = 1.0 - smoothstep(0.0, 0.06, crack1.x);
  float crackEdge2 = 1.0 - smoothstep(0.0, 0.04, crack2.x);
  float crackDeepEdge = 1.0 - smoothstep(0.0, 0.09, crackDeep.x);

  float totalCracks = clamp(crackEdge1 * 1.2 + crackEdge2 * 0.8 + crackDeepEdge * 0.6, 0.0, 2.0);

  // Frost crystalline micro-roughness
  float frostNoise = fbm2D(vUv * 30.0);
  vec3 iceSurface = mix(uIceBaseColor * 0.9, uIceBaseColor * 1.2, frostNoise * 0.4);

  // Glowing fissure light pulse
  float pulse = sin(uTime * uGlowPulse + crack1.y * 6.28) * 0.35 + 0.65;
  vec3 fissureEmission = uCrackGlowColor * totalCracks * pulse * 1.8;

  // Fresnel frost reflection
  float fresnel = pow(1.0 - max(0.0, dot(N, V)), 3.0);

  vec3 finalColor = iceSurface + fissureEmission + fresnel * vec3(0.8, 0.95, 1.0) * 0.55;
  finalColor *= (1.0 + uAdjacentInfluence * 0.25);

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

// =========================================================================
// 7. MECHANICAL GEAR WALL SHADER (S07 Bakery, S09 Clocktower, S15 Rose Maze, S16 Gazebo, S28 Clock Tower Belfry)
// =========================================================================

export const mechanicalGearWallVertexShader = `
uniform float uTime;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vUv = uv;
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;

  vec3 transformedNormal = normalMatrix * normal;
  vNormal = normalize(transformedNormal);

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vViewPosition = -mvPosition.xyz;

  gl_Position = projectionMatrix * mvPosition;
}
`;

export const mechanicalGearWallFragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uBrassColor;
uniform vec3 uCopperColor;
uniform float uGearSpeed;
uniform float uToothCount;
uniform float uMetalness;
uniform float uRoughness;
uniform float uAdjacentInfluence;
uniform float uActive;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vViewPosition;

${GLSL_COMMON_NOISE}

// Distance estimator for cog teeth
float gearDist(vec2 p, float teeth, float rotSpeed, float t) {
  float r = length(p);
  float a = atan(p.y, p.x) + t * rotSpeed;
  float cogs = sin(a * teeth) * 0.045;
  return r - (0.32 + cogs);
}

void main() {
  if (uActive < 0.05) {
    gl_FragColor = vec4(uBrassColor, 1.0);
    return;
  }

  vec2 gridUv = vUv * 4.0;
  vec2 cellF = fract(gridUv) - 0.5;
  vec2 cellI = floor(gridUv);

  // Checkerboard rotation direction
  float dir = mod(cellI.x + cellI.y, 2.0) == 0.0 ? 1.0 : -1.0;
  float speed = uGearSpeed * dir;

  // Outer gear rim and teeth
  float dGear = gearDist(cellF, uToothCount, speed, uTime);
  float gearBody = 1.0 - smoothstep(-0.01, 0.01, dGear);

  // Center axle hole and spoke cutouts
  float r = length(cellF);
  float axle = 1.0 - smoothstep(0.07, 0.09, r);
  float centerHole = smoothstep(0.04, 0.05, r);

  // Spoke pattern
  float a = atan(cellF.y, cellF.x) + uTime * speed;
  float spokes = abs(sin(a * 4.0));
  float spokeMask = step(0.7, spokes) * step(0.12, r) * (1.0 - step(0.26, r));

  // Combine gear geometry
  float gearShape = clamp((gearBody - (1.0 - spokeMask) * step(0.12, r) * (1.0 - step(0.26, r))) + axle, 0.0, 1.0);
  gearShape *= centerHole;

  // Metallic anisotropic brushed shading
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewPosition);
  vec3 lightDir = normalize(vec3(0.6, 0.7, 0.4));
  vec3 H = normalize(lightDir + V);

  float spec = pow(max(0.0, dot(N, H)), 32.0) * uMetalness;
  float patina = fbm2D(vUv * 12.0);

  vec3 gearMat = mix(uBrassColor, uCopperColor, patina * 0.6);
  vec3 backgroundPlate = mix(vec3(0.06, 0.07, 0.09), vec3(0.12, 0.14, 0.18), patina);

  // Amber backlight glow in crevices
  vec3 creviceGlow = vec3(0.96, 0.62, 0.04) * (1.0 - gearShape) * 0.45 * uAdjacentInfluence;

  vec3 finalColor = mix(backgroundPlate, gearMat + spec * vec3(1.0, 0.9, 0.7), gearShape) + creviceGlow;
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

// =========================================================================
// 8. INFINITE MIRROR SHADER (S12 Cathedral, S13 Gatehouse, S29 Mirror Maze Gallery)
// =========================================================================

export const infiniteMirrorVertexShader = `
uniform float uTime;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vUv = uv;
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;

  vec3 transformedNormal = normalMatrix * normal;
  vNormal = normalize(transformedNormal);

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vViewPosition = -mvPosition.xyz;

  gl_Position = projectionMatrix * mvPosition;
}
`;

export const infiniteMirrorFragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uBaseColor;
uniform vec3 uBorderColor;
uniform float uTunnelDepth;
uniform float uFadingFactor;
uniform float uIterationCount;
uniform float uAdjacentInfluence;
uniform float uActive;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vViewPosition;

${GLSL_COMMON_NOISE}

void main() {
  if (uActive < 0.05) {
    gl_FragColor = vec4(uBaseColor, 1.0);
    return;
  }

  vec2 centerUv = vUv - 0.5;
  vec3 accumulatedLight = vec3(0.0, 0.0, 0.0);
  float totalWeight = 0.0;

  // Recursive depth tunnel step loop
  int maxSteps = int(uIterationCount);
  for (int i = 0; i < 12; i++) {
    if (i >= maxSteps) break;

    float depthScale = 1.0 + float(i) * uTunnelDepth;
    vec2 stepUv = centerUv * depthScale + 0.5;

    // Border frame edge glow at current step
    vec2 dEdge = abs(stepUv - 0.5) * 2.0;
    float boxDist = max(dEdge.x, dEdge.y);
    float frameGlow = smoothstep(0.82, 0.96, boxDist) * (1.0 - smoothstep(0.96, 1.02, boxDist));

    // Chromatic dispersion per tier
    float stepFade = pow(uFadingFactor, float(i));
    vec3 tierColor = mix(uBorderColor, vec3(0.13, 0.83, 0.93), float(i) * 0.08);

    accumulatedLight += tierColor * frameGlow * stepFade * 2.2;
    totalWeight += stepFade;
  }

  // Deep mirror abyss base
  vec3 abyss = mix(uBaseColor, vec3(0.01, 0.03, 0.05), 0.85);

  // Fresnel glass reflection sheen
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewPosition);
  float fresnel = pow(1.0 - max(0.0, dot(N, V)), 2.8);

  vec3 finalColor = abyss + accumulatedLight + fresnel * uBorderColor * 0.65;
  finalColor *= (1.0 + uAdjacentInfluence * 0.35);

  gl_FragColor = vec4(finalColor, 0.96);
}
`;

// =========================================================================
// 9. IRIDESCENT OPAL VELVET SHADER (S35 Celestial Chamber, S36 Moonbeam Zenith)
// =========================================================================

export const iridescentOpalVelvetVertexShader = `
uniform float uTime;
uniform float uAdjacentInfluence;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vUv = uv;
  vec3 pos = position;

  // Gentle velvet fabric drape micro-undulation
  float drape = sin(pos.x * 3.0 + uTime * 0.8) * cos(pos.z * 3.0 + uTime * 0.6) * 0.015 * uAdjacentInfluence;
  pos += normal * drape;

  vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
  vWorldPosition = worldPosition.xyz;
  vNormal = normalize(normalMatrix * normal);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  vViewPosition = -mvPosition.xyz;

  gl_Position = projectionMatrix * mvPosition;
}
`;

export const iridescentOpalVelvetFragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uBaseColor;
uniform vec3 uSheenColor;
uniform vec3 uGoldTrimColor;
uniform float uIridescenceScale;
uniform float uAdjacentInfluence;
uniform float uActive;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vViewPosition;

${GLSL_COMMON_NOISE}

void main() {
  if (uActive < 0.05) {
    gl_FragColor = vec4(uBaseColor, 1.0);
    return;
  }

  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewPosition);
  float NdotV = max(0.0, dot(N, V));

  // Thin-film interference iridescence phase
  float phase = (1.0 - NdotV) * uIridescenceScale + uTime * 0.15;
  vec3 spectral = 0.5 + 0.5 * cos(6.28318 * (vec3(0.0, 0.33, 0.67) + phase));

  // Velvet retro-reflective rim sheen
  float velvetRim = pow(1.0 - NdotV, 3.2);

  // Micro-weave texture noise
  float weave = valueNoise2D(vUv * 48.0) * 0.12;

  vec3 col = mix(uBaseColor, spectral, velvetRim * 0.65 + weave);
  col += uSheenColor * velvetRim * 0.55;
  col = mix(col, uGoldTrimColor, smoothstep(0.78, 0.95, velvetRim) * 0.35);
  col *= (1.0 + uAdjacentInfluence * 0.25);

  gl_FragColor = vec4(col, 1.0);
}
`;

// =========================================================================
// 10. CELESTIAL AURORA SHADER (S33 Astral Spire, S34 Starlight Sanctuary)
// =========================================================================

export const celestialAuroraVertexShader = `
uniform float uTime;
uniform float uAdjacentInfluence;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vUv = uv;
  vec3 pos = position;

  // Floating curtain sway
  float sway = sin(pos.y * 1.8 + uTime * 1.2) * cos(pos.x * 1.5 + uTime * 0.9) * 0.03 * uAdjacentInfluence;
  pos.x += sway;

  vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
  vWorldPosition = worldPosition.xyz;
  vNormal = normalize(normalMatrix * normal);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  vViewPosition = -mvPosition.xyz;

  gl_Position = projectionMatrix * mvPosition;
}
`;

export const celestialAuroraFragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uZenithColor;
uniform vec3 uAuroraCyan;
uniform vec3 uAuroraPink;
uniform float uCurtainSpeed;
uniform float uAdjacentInfluence;
uniform float uActive;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vViewPosition;

${GLSL_COMMON_NOISE}

void main() {
  if (uActive < 0.05) {
    gl_FragColor = vec4(uZenithColor, 1.0);
    return;
  }

  vec2 uv = vUv;
  float t = uTime * uCurtainSpeed;
  vec2 p1 = vec2(uv.x * 4.0 + t * 0.3, uv.y * 2.0);
  vec2 p2 = vec2(uv.x * 6.0 - t * 0.2, uv.y * 3.0 + sin(t * 0.5) * 0.2);

  float curtain1 = fbm2D(p1);
  float curtain2 = fbm2D(p2);
  float aurora = pow(max(0.0, curtain1 * 0.6 + curtain2 * 0.4), 2.2);

  float verticalFade = smoothstep(0.05, 0.4, uv.y) * (1.0 - smoothstep(0.7, 0.98, uv.y));
  aurora *= verticalFade;

  float stardust = hash21(floor(uv * 90.0) + vec2(floor(uTime * 4.0), floor(uTime * 4.0)));
  float twinkle = step(0.985, stardust) * (0.5 + 0.5 * sin(uTime * 12.0));

  vec3 col = mix(uZenithColor, uAuroraCyan, aurora * 1.4);
  col = mix(col, uAuroraPink, pow(aurora, 1.8) * 0.9);
  col += vec3(0.95, 0.98, 1.0) * twinkle * 1.5;
  col *= (1.0 + uAdjacentInfluence * 0.3);

  gl_FragColor = vec4(col, 0.92);
}
`;

// =========================================================================
// 11. PRISMATIC WATER CAUSTICS SHADER (S37 Abyssal Gateway, S38 Coral Trench)
// =========================================================================

export const prismaticWaterCausticsVertexShader = `
uniform float uTime;
uniform float uAdjacentInfluence;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vUv = uv;
  vec3 pos = position;

  // Dual underwater wave ripple displacement
  float wave = (sin(pos.x * 2.2 + uTime * 2.0) + cos(pos.z * 2.2 + uTime * 1.6)) * 0.025 * uAdjacentInfluence;
  pos.y += wave;

  vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
  vWorldPosition = worldPosition.xyz;
  vNormal = normalize(normalMatrix * normal);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  vViewPosition = -mvPosition.xyz;

  gl_Position = projectionMatrix * mvPosition;
}
`;

export const prismaticWaterCausticsFragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uDeepWaterColor;
uniform vec3 uShallowWaterColor;
uniform vec3 uCausticGlowColor;
uniform float uCausticScale;
uniform float uAdjacentInfluence;
uniform float uActive;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vViewPosition;

${GLSL_COMMON_NOISE}

void main() {
  if (uActive < 0.05) {
    gl_FragColor = vec4(uDeepWaterColor, 0.9);
    return;
  }

  vec2 uv = vUv * uCausticScale;
  float t = uTime * 1.1;

  vec2 v1 = voronoi2D(uv + vec2(t * 0.25, -t * 0.15));
  vec2 v2 = voronoi2D(uv * 1.4 - vec2(-t * 0.2, t * 0.3));

  float cR = pow(1.0 - min(v1.x, v2.x), 3.5);
  float cG = pow(1.0 - min(v1.x * 0.98, v2.x * 1.02), 3.5);
  float cB = pow(1.0 - min(v1.x * 0.95, v2.x * 1.05), 3.5);
  vec3 caustic = vec3(cR, cG, cB) * uCausticGlowColor * 1.8;

  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewPosition);
  float fresnel = pow(1.0 - max(0.0, dot(N, V)), 2.5);

  vec3 col = mix(uDeepWaterColor, uShallowWaterColor, fresnel * 0.65);
  col += caustic;
  col *= (1.0 + uAdjacentInfluence * 0.25);

  gl_FragColor = vec4(col, 0.88);
}
`;

// =========================================================================
// 12. CRYSTALLINE SUBSURFACE SHADER (S39 Deep Alchemical Vault, S40 Ancient Crucible)
// =========================================================================

export const crystallineSubsurfaceVertexShader = `
uniform float uTime;
uniform float uAdjacentInfluence;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vUv = uv;
  vec3 pos = position;

  // Subtle crystal resonance harmonic
  float harmonic = sin(pos.y * 5.0 + uTime * 2.5) * 0.012 * uAdjacentInfluence;
  pos += normal * harmonic;

  vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
  vWorldPosition = worldPosition.xyz;
  vNormal = normalize(normalMatrix * normal);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  vViewPosition = -mvPosition.xyz;

  gl_Position = projectionMatrix * mvPosition;
}
`;

export const crystallineSubsurfaceFragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uCrystalBaseColor;
uniform vec3 uSubsurfaceColor;
uniform vec3 uInternalGlowColor;
uniform float uCrystalFacets;
uniform float uAdjacentInfluence;
uniform float uActive;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vViewPosition;

${GLSL_COMMON_NOISE}

void main() {
  if (uActive < 0.05) {
    gl_FragColor = vec4(uCrystalBaseColor, 1.0);
    return;
  }

  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewPosition);
  float NdotV = max(0.0, dot(N, V));

  vec2 cell = voronoi2D(vUv * uCrystalFacets);
  float facetEdge = smoothstep(0.05, 0.18, cell.x);

  float sss = pow(max(0.0, (1.0 - NdotV) + 0.25), 2.2);

  float corePulse = 0.5 + 0.5 * sin(uTime * 3.0 + cell.y * 6.28);
  vec3 internalLight = uInternalGlowColor * corePulse * (1.0 - facetEdge * 0.5);

  vec3 col = mix(uCrystalBaseColor, uSubsurfaceColor, sss * 0.75);
  col += internalLight * 1.2;

  float rim = pow(1.0 - NdotV, 3.5);
  col += vec3(0.95, 0.98, 1.0) * rim * 0.85;
  col *= (1.0 + uAdjacentInfluence * 0.3);

  gl_FragColor = vec4(col, 0.95);
}
`;

// =========================================================================
// SHADER REGISTRY & DEFINITION TABLE
// =========================================================================

export const SURFACE_SHADER_DEFINITIONS = {
  ivy_vein: {
    name: 'ivy_vein',
    vertexShader: ivyVeinVertexShader,
    fragmentShader: ivyVeinFragmentShader,
    defaultUniforms: {
      uTime: 0.0,
      uResolution: [1.0, 1.0],
      uBaseColor: [0.15, 0.22, 0.12],
      uVeinColor: [0.13, 0.83, 0.93],
      uPulseSpeed: 1.8,
      uVeinDensity: 5.0,
      uGlowIntensity: 1.4,
      uAdjacentInfluence: 1.0,
      uActive: 1.0
    }
  },
  bioluminescent_floor: {
    name: 'bioluminescent_floor',
    vertexShader: bioluminescentFloorVertexShader,
    fragmentShader: bioluminescentFloorFragmentShader,
    defaultUniforms: {
      uTime: 0.0,
      uResolution: [1.0, 1.0],
      uBaseColor: [0.08, 0.12, 0.18],
      uGlowColor: [0.13, 0.83, 0.93],
      uPulseSpeed: 1.4,
      uTileScale: 4.0,
      uRippleRadius: 3.5,
      uAdjacentInfluence: 1.0,
      uActive: 1.0
    }
  },
  prismatic_refraction: {
    name: 'prismatic_refraction',
    vertexShader: prismaticRefractionVertexShader,
    fragmentShader: prismaticRefractionFragmentShader,
    defaultUniforms: {
      uTime: 0.0,
      uResolution: [1.0, 1.0],
      uBaseColor: [0.65, 0.55, 0.98],
      uFacetScale: 6.0,
      uDispersionStrength: 0.35,
      uFresnelPower: 3.0,
      uReflectivity: 0.75,
      uAdjacentInfluence: 1.0,
      uActive: 1.0
    }
  },
  flowing_river: {
    name: 'flowing_river',
    vertexShader: flowingRiverVertexShader,
    fragmentShader: flowingRiverFragmentShader,
    defaultUniforms: {
      uTime: 0.0,
      uResolution: [1.0, 1.0],
      uDeepColor: [0.01, 0.52, 0.78],
      uShallowColor: [0.22, 0.83, 0.97],
      uFoamColor: [0.94, 0.99, 0.96],
      uFlowSpeed: 1.2,
      uWaveHeight: 0.08,
      uCausticIntensity: 0.7,
      uAdjacentInfluence: 1.0,
      uActive: 1.0
    }
  },
  star_trail_sky: {
    name: 'star_trail_sky',
    vertexShader: starTrailSkyVertexShader,
    fragmentShader: starTrailSkyFragmentShader,
    defaultUniforms: {
      uTime: 0.0,
      uResolution: [1.0, 1.0],
      uZenithColor: [0.02, 0.03, 0.04],
      uHorizonColor: [0.49, 0.23, 0.93],
      uStarColor: [0.98, 0.95, 0.85],
      uNebulaColor: [0.13, 0.83, 0.93],
      uRotationSpeed: 0.08,
      uStarDensity: 1.2,
      uAdjacentInfluence: 1.0,
      uActive: 1.0
    }
  },
  ice_crack_floor: {
    name: 'ice_crack_floor',
    vertexShader: iceCrackFloorVertexShader,
    fragmentShader: iceCrackFloorFragmentShader,
    defaultUniforms: {
      uTime: 0.0,
      uResolution: [1.0, 1.0],
      uIceBaseColor: [0.12, 0.25, 0.38],
      uCrackGlowColor: [0.22, 0.83, 0.97],
      uCrackDensity: 5.5,
      uParallaxDepth: 1.2,
      uGlowPulse: 2.0,
      uAdjacentInfluence: 1.0,
      uActive: 1.0
    }
  },
  mechanical_gear_wall: {
    name: 'mechanical_gear_wall',
    vertexShader: mechanicalGearWallVertexShader,
    fragmentShader: mechanicalGearWallFragmentShader,
    defaultUniforms: {
      uTime: 0.0,
      uResolution: [1.0, 1.0],
      uBrassColor: [0.85, 0.62, 0.22],
      uCopperColor: [0.72, 0.38, 0.18],
      uGearSpeed: 1.0,
      uToothCount: 8.0,
      uMetalness: 0.85,
      uRoughness: 0.25,
      uAdjacentInfluence: 1.0,
      uActive: 1.0
    }
  },
  infinite_mirror: {
    name: 'infinite_mirror',
    vertexShader: infiniteMirrorVertexShader,
    fragmentShader: infiniteMirrorFragmentShader,
    defaultUniforms: {
      uTime: 0.0,
      uResolution: [1.0, 1.0],
      uBaseColor: [0.03, 0.05, 0.08],
      uBorderColor: [0.13, 0.83, 0.93],
      uTunnelDepth: 0.18,
      uFadingFactor: 0.72,
      uIterationCount: 8.0,
      uAdjacentInfluence: 1.0,
      uActive: 1.0
    }
  },
  iridescent_opal_velvet: {
    name: 'iridescent_opal_velvet',
    vertexShader: iridescentOpalVelvetVertexShader,
    fragmentShader: iridescentOpalVelvetFragmentShader,
    defaultUniforms: {
      uTime: 0.0,
      uResolution: [1.0, 1.0],
      uBaseColor: [0.08, 0.12, 0.22],
      uSheenColor: [0.13, 0.83, 0.93],
      uGoldTrimColor: [0.96, 0.62, 0.04],
      uIridescenceScale: 2.5,
      uAdjacentInfluence: 1.0,
      uActive: 1.0
    }
  },
  celestial_aurora: {
    name: 'celestial_aurora',
    vertexShader: celestialAuroraVertexShader,
    fragmentShader: celestialAuroraFragmentShader,
    defaultUniforms: {
      uTime: 0.0,
      uResolution: [1.0, 1.0],
      uZenithColor: [0.06, 0.09, 0.16],
      uAuroraCyan: [0.13, 0.83, 0.93],
      uAuroraPink: [0.96, 0.45, 0.71],
      uCurtainSpeed: 0.85,
      uAdjacentInfluence: 1.0,
      uActive: 1.0
    }
  },
  prismatic_water_caustics: {
    name: 'prismatic_water_caustics',
    vertexShader: prismaticWaterCausticsVertexShader,
    fragmentShader: prismaticWaterCausticsFragmentShader,
    defaultUniforms: {
      uTime: 0.0,
      uResolution: [1.0, 1.0],
      uDeepWaterColor: [0.01, 0.18, 0.28],
      uShallowWaterColor: [0.13, 0.83, 0.93],
      uCausticGlowColor: [0.22, 0.83, 0.97],
      uCausticScale: 5.0,
      uAdjacentInfluence: 1.0,
      uActive: 1.0
    }
  },
  crystalline_subsurface: {
    name: 'crystalline_subsurface',
    vertexShader: crystallineSubsurfaceVertexShader,
    fragmentShader: crystallineSubsurfaceFragmentShader,
    defaultUniforms: {
      uTime: 0.0,
      uResolution: [1.0, 1.0],
      uCrystalBaseColor: [0.18, 0.14, 0.28],
      uSubsurfaceColor: [0.65, 0.55, 0.98],
      uInternalGlowColor: [0.13, 0.83, 0.93],
      uCrystalFacets: 6.0,
      uAdjacentInfluence: 1.0,
      uActive: 1.0
    }
  }
};

// =========================================================================
// SURFACE SHADER FACTORY HELPERS
// =========================================================================

export function createShaderUniforms(def, overrides = {}) {
  const THREE = getTHREE();
  const uniforms = {};

  for (const [key, val] of Object.entries(def.defaultUniforms)) {
    const finalVal = overrides[key] !== undefined ? overrides[key] : val;
    if (THREE) {
      if (Array.isArray(finalVal) && finalVal.length === 3) {
        uniforms[key] = { value: new THREE.Color(finalVal[0], finalVal[1], finalVal[2]) };
      } else if (Array.isArray(finalVal) && finalVal.length === 2) {
        uniforms[key] = { value: new THREE.Vector2(finalVal[0], finalVal[1]) };
      } else {
        uniforms[key] = { value: finalVal };
      }
    } else {
      uniforms[key] = { value: finalVal };
    }
  }

  return uniforms;
}

export function createSurfaceShaderMaterial(shaderType, options = {}) {
  const THREE = getTHREE();
  const def = SURFACE_SHADER_DEFINITIONS[shaderType];
  if (!def) {
    console.warn(`[SurfaceShaders] Unknown shader type: ${shaderType}. Returning fallback.`);
    return null;
  }

  if (!THREE) {
    return {
      type: 'ShaderMaterial',
      shaderType,
      uniforms: createShaderUniforms(def, options),
      vertexShader: def.vertexShader,
      fragmentShader: def.fragmentShader,
      transparent: options.transparent !== undefined ? options.transparent : false,
      side: options.side !== undefined ? options.side : 0
    };
  }

  const uniforms = createShaderUniforms(def, options);
  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: def.vertexShader,
    fragmentShader: def.fragmentShader,
    transparent: options.transparent !== undefined ? options.transparent : (shaderType === 'flowing_river' || shaderType === 'prismatic_refraction'),
    side: options.side !== undefined ? options.side : THREE.DoubleSide
  });

  mat.userData = {
    shaderType,
    isSurfaceShader: true,
    activeFlag: 1.0
  };

  return mat;
}

// =========================================================================
// PBR NORMAL PERTURBATION & VOLUMETRIC LIGHTING HELPERS
// =========================================================================

export function getPbrNormalPerturbationGLSL() {
  return `
vec3 perturbNormal(vec3 worldPos, vec3 surfNormal, vec2 uv, float roughness, float scale) {
  vec2 p = uv * scale;
  float h0 = fbm2D(p);
  float hx = fbm2D(p + vec2(0.01, 0.0));
  float hy = fbm2D(p + vec2(0.0, 0.01));
  vec2 grad = vec2(hx - h0, hy - h0) / 0.01;
  vec3 N = normalize(surfNormal);
  vec3 T = normalize(cross(N, vec3(0.0, 1.0, 0.0) + vec3(0.001, 0.001, 0.001)));
  vec3 B = cross(N, T);
  vec3 bumpNormal = normalize(N - (T * grad.x + B * grad.y) * (1.0 - roughness) * 0.5);
  return bumpNormal;
}
`;
}

export function createVolumetricLightShaft(options = {}) {
  const THREE = getTHREE();
  const radiusTop = options.radiusTop !== undefined ? options.radiusTop : 0.4;
  const radiusBottom = options.radiusBottom !== undefined ? options.radiusBottom : 3.5;
  const height = options.height !== undefined ? options.height : 14.0;
  const colorHex = options.color !== undefined ? options.color : 0xf59e0b;
  const intensity = options.intensity !== undefined ? options.intensity : 0.65;
  const dustDensity = options.dustDensity !== undefined ? options.dustDensity : 1.0;

  const vertexShader = `
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vViewPosition;

    void main() {
      vUv = uv;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uIntensity;
    uniform float uDustDensity;

    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vViewPosition;

    ${GLSL_COMMON_NOISE}

    void main() {
      // Axial falloff from origin to base
      float coneFalloff = pow(vUv.y, 1.8) * (1.0 - smoothstep(0.85, 1.0, vUv.y));

      // Radial center core glow
      float radialCore = 1.0 - abs(vUv.x - 0.5) * 2.0;
      radialCore = pow(max(0.0, radialCore), 2.2);

      // Drifting atmospheric dust motes + soft god-ray core
      vec2 dustUv = vUv * vec2(8.0, 16.0) + vec2(sin(uTime * 0.2), -uTime * 0.4);
      float dust = valueNoise2D(dustUv * uDustDensity);
      dust = smoothstep(0.62, 0.88, dust) * 0.9;
      float shaftPulse = 0.85 + 0.15 * sin(uTime * 1.4 + vUv.y * 6.0);

      float alpha = (coneFalloff * radialCore * shaftPulse + dust * coneFalloff) * uIntensity;
      gl_FragColor = vec4(uColor, clamp(alpha, 0.0, 1.0));
    }
  `;

  if (!THREE) {
    return {
      type: 'VolumetricLightShaft',
      radiusTop,
      radiusBottom,
      height,
      color: colorHex,
      intensity,
      dustDensity,
      vertexShader,
      fragmentShader
    };
  }

  const geom = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 24, 16, true);
  const color = new THREE.Color(colorHex);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0.0 },
      uColor: { value: color },
      uIntensity: { value: intensity },
      uDustDensity: { value: dustDensity }
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const mesh = new THREE.Mesh(geom, mat);
  mesh.renderOrder = 2;

  return {
    mesh,
    material: mat,
    update: (time, delta) => {
      if (mat.uniforms.uTime) mat.uniforms.uTime.value = time;
    },
    setIntensity: (val) => {
      if (mat.uniforms.uIntensity) mat.uniforms.uIntensity.value = val;
    },
    setColor: (c) => {
      if (mat.uniforms.uColor) mat.uniforms.uColor.value = new THREE.Color(c);
    }
  };
}

// =========================================================================
// POST-PROCESSING HELPER (UnrealBloomPass & FXAA)
// =========================================================================

export function getBloomPassConfig() {
  return {
    threshold: 0.85,
    strength: 0.4,
    radius: 0.6
  };
}

export function createPostProcessingPipeline(renderer, scene, camera, options = {}) {
  const bloomConfig = getBloomPassConfig();
  return {
    camera: camera || null,
    config: {
      bloom: {
        threshold: options.threshold !== undefined ? options.threshold : bloomConfig.threshold,
        strength: options.strength !== undefined ? options.strength : bloomConfig.strength,
        radius: options.radius !== undefined ? options.radius : bloomConfig.radius
      },
      fxaa: {
        enabled: options.fxaa !== undefined ? options.fxaa : true
      },
      targetFrameTimeMs: 5.0
    },
    isSupported: typeof renderer !== 'undefined' && renderer !== null,
    render: function(delta, activeCamera) {
      const cam = activeCamera || this.camera || camera;
      if (renderer && scene && cam) {
        renderer.render(scene, cam);
      }
    }
  };
}

// =========================================================================
// SURFACE SHADER MANAGER CLASS
// =========================================================================

export class SurfaceShaderManager {
  /**
   * SurfaceShaderManager constructor
   * @param {Object} options Manager configuration
   */
  constructor(options = {}) {
    this.maxActiveShaders = options.maxActiveShaders || 2; // Active + 1 adjacent
    this.targetFrameTimeMs = options.targetFrameTimeMs || 5.0; // Mobile WebGL performance budget
    this.enableCache = options.enableCache !== undefined ? options.enableCache : true;

    // Internal maps
    this.shaderDefinitions = { ...SURFACE_SHADER_DEFINITIONS };
    this.compileCache = new Map(); // key -> THREE.ShaderMaterial
    this.sectorMaterials = new Map(); // sectorId -> { material, fallbackMaterial, shaderType, isFallback }

    // Active state tracking
    this.activeSectorId = null;
    this.adjacentSectorIds = [];

    // Telemetry & frame performance monitoring
    this.telemetry = {
      avgFrameTimeMs: 2.1,
      lastFrameTimeMs: 2.0,
      activeShaderCount: 0,
      cachedShaderCount: 0,
      throttledShaderCount: 0,
      performanceBudgetMs: this.targetFrameTimeMs,
      status: 'OPTIMAL'
    };

    this.frameTimeHistory = [];
    this.maxHistoryLength = 30;
  }

  /**
   * Register or override a custom surface shader
   */
  registerShader(name, definition) {
    if (!definition || !definition.vertexShader || !definition.fragmentShader) {
      throw new Error(`[SurfaceShaderManager] Invalid shader definition for ${name}`);
    }
    this.shaderDefinitions[name] = definition;
  }

  /**
   * Get or compile a shader material from cache
   */
  getShaderMaterial(shaderType, options = {}) {
    const cacheKey = `${shaderType}_${JSON.stringify(options)}`;
    if (this.enableCache && this.compileCache.has(cacheKey)) {
      return this.compileCache.get(cacheKey);
    }

    const material = createSurfaceShaderMaterial(shaderType, options);
    if (material && this.enableCache) {
      this.compileCache.set(cacheKey, material);
      this.telemetry.cachedShaderCount = this.compileCache.size;
    }
    return material;
  }

  /**
   * Create graceful fallback MeshStandardMaterial
   */
  createFallbackMaterial(sector, options = {}) {
    const THREE = getTHREE();
    const pbr = sector?.pbr || {};
    const colorHex = pbr.color !== undefined ? pbr.color : (sector?.lighting?.color || 0x1e293b);
    const roughness = pbr.roughness !== undefined ? pbr.roughness : 0.4;
    const metalness = pbr.metalness !== undefined ? pbr.metalness : 0.2;

    if (!THREE) {
      return {
        type: 'MeshStandardMaterial',
        color: colorHex,
        roughness,
        metalness,
        isFallback: true
      };
    }

    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex),
      roughness,
      metalness,
      envMapIntensity: 1.1,
      roughnessMap: null,
      metalnessMap: null
    });

    mat.userData = {
      isFallback: true,
      sectorId: sector?.id || 'UNKNOWN'
    };

    return mat;
  }

  /**
   * Bind or create material for a registered sector
   */
  createSectorMaterial(sector, options = {}) {
    if (!sector) return null;
    const sectorId = sector.id || sector.slug;
    const shaderType = sector.shader || (sector.shaders && sector.shaders[0]) || 'bioluminescent_floor';

    let shaderMat = null;
    try {
      shaderMat = this.getShaderMaterial(shaderType, options);
    } catch (err) {
      console.warn(`[SurfaceShaderManager] Failed to compile shader ${shaderType} for sector ${sectorId}. Falling back:`, err);
    }

    const fallbackMat = this.createFallbackMaterial(sector, options);

    const record = {
      sectorId,
      shaderType,
      material: shaderMat || fallbackMat,
      shaderMaterial: shaderMat,
      fallbackMaterial: fallbackMat,
      isFallback: !shaderMat
    };

    this.sectorMaterials.set(sectorId, record);
    return record.material;
  }

  /**
   * Set active sector and adjacent sector list for throttling
   */
  setActiveSectors(activeSectorId, adjacentSectorIds = []) {
    this.activeSectorId = activeSectorId;
    this.adjacentSectorIds = Array.isArray(adjacentSectorIds) ? adjacentSectorIds : [];

    let activeCount = 0;
    let throttledCount = 0;

    for (const [sId, record] of this.sectorMaterials.entries()) {
      const isPrimary = sId === this.activeSectorId;
      const isAdjacent = this.adjacentSectorIds.includes(sId);
      const shouldRunShader = isPrimary || (isAdjacent && activeCount < this.maxActiveShaders);

      if (record.shaderMaterial && record.shaderMaterial.uniforms) {
        if (shouldRunShader) {
          if (record.shaderMaterial.uniforms.uActive) {
            record.shaderMaterial.uniforms.uActive.value = isPrimary ? 1.0 : 0.65;
          }
          if (record.shaderMaterial.uniforms.uAdjacentInfluence) {
            record.shaderMaterial.uniforms.uAdjacentInfluence.value = isPrimary ? 1.0 : 0.5;
          }
          record.material = record.shaderMaterial;
          record.isFallback = false;
          activeCount++;
        } else {
          // Throttled: set active to 0.0 or switch to fallback
          if (record.shaderMaterial.uniforms.uActive) {
            record.shaderMaterial.uniforms.uActive.value = 0.0;
          }
          if (record.shaderMaterial.uniforms.uAdjacentInfluence) {
            record.shaderMaterial.uniforms.uAdjacentInfluence.value = 0.0;
          }
          record.material = record.fallbackMaterial;
          record.isFallback = true;
          throttledCount++;
        }
      }
    }

    this.telemetry.activeShaderCount = activeCount;
    this.telemetry.throttledShaderCount = throttledCount;
  }

  /**
   * Per-frame shader update loop with performance throttling
   */
  update(deltaTime = 0.016, elapsedTime = 0.0, activeSectorId = null, adjacentSectorIds = null) {
    const startTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();

    if (activeSectorId !== null && (activeSectorId !== this.activeSectorId || adjacentSectorIds !== null)) {
      this.setActiveSectors(activeSectorId, adjacentSectorIds || getAdjacentSectors(activeSectorId));
    }

    // Update uTime for active shader materials
    for (const record of this.sectorMaterials.values()) {
      if (!record.isFallback && record.shaderMaterial && record.shaderMaterial.uniforms) {
        if (record.shaderMaterial.uniforms.uTime) {
          record.shaderMaterial.uniforms.uTime.value = elapsedTime;
        }
      }
    }

    const endTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    const frameDuration = Math.max(0.05, endTime - startTime);

    // Update telemetry
    this.frameTimeHistory.push(frameDuration);
    if (this.frameTimeHistory.length > this.maxHistoryLength) {
      this.frameTimeHistory.shift();
    }

    const sum = this.frameTimeHistory.reduce((a, b) => a + b, 0);
    this.telemetry.avgFrameTimeMs = Number((sum / this.frameTimeHistory.length).toFixed(2));
    this.telemetry.lastFrameTimeMs = Number(frameDuration.toFixed(2));

    // Dynamic performance guard
    if (this.telemetry.avgFrameTimeMs > this.targetFrameTimeMs) {
      this.telemetry.status = 'THROTTLED';
      // Dynamically clamp to 1 active shader if budget exceeded
      this.maxActiveShaders = 1;
    } else {
      this.telemetry.status = 'OPTIMAL';
      this.maxActiveShaders = 2;
    }
  }

  /**
   * Get live performance and shader status telemetry
   */
  getTelemetry() {
    return { ...this.telemetry };
  }

  /**
   * Clean up all compiled materials and resources
   */
  dispose() {
    for (const mat of this.compileCache.values()) {
      if (mat && typeof mat.dispose === 'function') {
        mat.dispose();
      }
    }
    this.compileCache.clear();
    this.sectorMaterials.clear();
    this.telemetry.activeShaderCount = 0;
    this.telemetry.cachedShaderCount = 0;
  }
}

// =========================================================================
// DEFAULT SINGLETON INSTANCE EXPORT
// =========================================================================

export const surfaceShaderManager = new SurfaceShaderManager();

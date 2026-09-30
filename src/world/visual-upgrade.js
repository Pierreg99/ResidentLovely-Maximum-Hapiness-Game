import { scene, renderer, sunLight, hemiLight, rimLight, graphicsQuality, sunsetSkyDome, updateSpatialCulling } from './scene.js';
import { rooms } from './rooms.js';
import { SECTOR_REGISTRY, getSector } from './sectors.js';
import { motionReduced, preferences } from '../systems/preferences.js';
import { atmosphereEngine } from './atmosphere.js';
import { applySweetAssetDirection } from './sweet-assets.js';

function canvasTexture(draw, size = 256) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  draw(canvas.getContext('2d'), size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  return texture;
}

function createStudioEnvironment() {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const sky = ctx.createLinearGradient(0, 0, 0, 256);
  sky.addColorStop(0, '#354265'); sky.addColorStop(0.45, '#c4bdd3');
  sky.addColorStop(0.55, '#f6dcc3'); sky.addColorStop(1, '#40364d');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, 512, 256);
  for (const [x, color] of [[90, '#fff5e2'], [340, '#d0e8ff']]) {
    const glow = ctx.createRadialGradient(x, 95, 2, x, 95, 65);
    glow.addColorStop(0, color); glow.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = glow; ctx.fillRect(x - 65, 30, 130, 130);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.encoding = THREE.sRGBEncoding;
  const generator = new THREE.PMREMGenerator(renderer);
  const environment = generator.fromEquirectangular(texture);
  scene.environment = environment.texture;
  texture.dispose(); generator.dispose();
}

export class VisualUpgrade {
  constructor() {
    createStudioEnvironment();
    if (sunsetSkyDome) {
      sunsetSkyDome.material.vertexShader = 'varying vec3 vSkyDirection; void main(){vSkyDirection=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}';
      sunsetSkyDome.material.fragmentShader = `
        varying vec3 vSkyDirection;
        uniform vec3 uZenithColor;
        uniform vec3 uHorizonColor;
        void main() {
          vec3 direction = normalize(vSkyDirection);
          float height = smoothstep(-.15, .9, direction.y);
          vec3 sky = mix(uHorizonColor, uZenithColor, height);
          float sun = pow(max(0., dot(direction, normalize(vec3(-.4,.5,-.6)))), 160.);
          gl_FragColor = vec4(sky + vec3(1.,.8,.55) * sun * .6, 1.);
          #include <encodings_fragment>
        }`;
      sunsetSkyDome.material.uniforms.uZenithColor.value.setHex(0x172d48).convertSRGBToLinear();
      sunsetSkyDome.material.uniforms.uHorizonColor.value.setHex(0x9ac7ce).convertSRGBToLinear();
      sunsetSkyDome.material.needsUpdate = true;
    }
    this.lastRoom = null; this.lightingBase = 1;
    this.phase = 0; this.lastCull = -1;
    this.frameAverage = 16; this.lastFrame = performance.now(); this.nextAdapt = this.lastFrame + 8000;
    this.marble = canvasTexture((ctx, size) => {
      ctx.fillStyle = '#cbd0da'; ctx.fillRect(0, 0, size, size);
      for (let i = 0; i < 14; i++) {
        ctx.beginPath(); ctx.strokeStyle = i % 3 ? '#b5bac6' : '#9ba4b7'; ctx.lineWidth = i % 3 ? 0.6 : 1.2;
        for (let y = 0; y <= size; y += 4) {
          const x = i * 24 + Math.sin(y / 48 + i) * 13 + Math.sin(y / 13 + i) * 3;
          if (!y) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    });
    this.fabric = canvasTexture((ctx, size) => {
      ctx.fillStyle = '#bbb'; ctx.fillRect(0, 0, size, size);
      ctx.strokeStyle = '#888'; ctx.lineWidth = 1;
      for (let i = 0; i < size; i += 4) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, size); ctx.moveTo(0, i); ctx.lineTo(size, i); ctx.stroke(); }
    }, 128);
    const panel = canvasTexture((ctx, size) => {
      ctx.fillStyle = '#d1d1d1'; ctx.fillRect(0, 0, size, size);
      ctx.strokeStyle = '#949494'; ctx.lineWidth = 2;
      for (let y = 0; y < size; y += 64) for (let x = 0; x < size; x += 64) ctx.strokeRect(x + 6, y + 6, 52, 52);
    });
    const visited = new Set();
    Object.values(rooms).forEach(group => group.traverse(object => {
      const material = object.material;
      if (!material || !material.isMeshStandardMaterial || visited.has(material)) return;
      visited.add(material);
      if (object.parent?.name === 'chamber_floor') {
        material.map = material.map || this.marble; material.bumpMap = this.marble; material.bumpScale = 0.018;
      } else if (object.geometry?.type === 'BoxGeometry' && object.geometry.parameters.height > 4 && material.metalness < 0.2) {
        material.map = material.map || panel; material.bumpMap = panel; material.bumpScale = 0.035;
      }
      material.needsUpdate = true;
    }));
    this.resize = () => this.resizeTargets();
    window.addEventListener('resize', this.resize);
    this.createPostProcessing();
  }

  enhanceCharacters(player, grumps) {
    player.styleMaterials.vest.bumpMap = this.fabric; player.styleMaterials.vest.bumpScale = 0.008;
    grumps.forEach(grump => {
      if (grump.furMat) { grump.furMat.bumpMap = this.fabric; grump.furMat.bumpScale = 0.03; }
      grump.group.traverse(object => { if (object.isMesh && !object.material.transparent) object.castShadow = true; });
      const badge = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.025, 8, 20),
        new THREE.MeshStandardMaterial({ color: 0xfde68a, metalness: 0.75, roughness: 0.2 }));
      badge.position.set(0, 0.45, 0.66); grump.group.add(badge);
    });
    this.assetCoverage = applySweetAssetDirection(scene, rooms, SECTOR_REGISTRY, renderer, player, grumps);
  }

  createPostProcessing() {
    this.postScene = new THREE.Scene(); this.postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const vertexShader = 'varying vec2 vUv; void main(){vUv=uv; gl_Position=vec4(position.xy,0.,1.);}';
    this.blur = new THREE.ShaderMaterial({ depthTest: false, depthWrite: false, uniforms: { source: { value: null }, stepSize: { value: new THREE.Vector2() }, extract: { value: 0 } }, vertexShader,
      fragmentShader: 'varying vec2 vUv; uniform sampler2D source; uniform vec2 stepSize; uniform float extract; void main(){vec3 c=texture2D(source,vUv).rgb*.227027; c+=(texture2D(source,vUv+stepSize*1.384615).rgb+texture2D(source,vUv-stepSize*1.384615).rgb)*.316216; c+=(texture2D(source,vUv+stepSize*3.230769).rgb+texture2D(source,vUv-stepSize*3.230769).rgb)*.070270; if(extract>.5)c*=smoothstep(.65,1.,max(c.r,max(c.g,c.b))); gl_FragColor=vec4(c,1.);}' });
    this.composite = new THREE.ShaderMaterial({ depthTest: false, depthWrite: false, toneMapped: false, uniforms: { source: { value: null }, glow: { value: null }, strength: { value: 0.24 } }, vertexShader,
      fragmentShader: 'varying vec2 vUv; uniform sampler2D source; uniform sampler2D glow; uniform float strength; void main(){vec3 c=texture2D(source,vUv).rgb+texture2D(glow,vUv).rgb*strength; float v=1.-smoothstep(.2,.85,length(vUv-.5)); c*=mix(.86,1.,v); gl_FragColor=vec4(c,1.);\n#include <encodings_fragment>\n}' });
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.blur); this.postScene.add(this.quad);
    this.targets = [0, 1, 2].map(() => new THREE.WebGLRenderTarget(1, 1, { depthBuffer: true }));
    this.resizeTargets();
  }
  resizeTargets() {
    if (!this.targets) return;
    const ratio = renderer.getPixelRatio(); const w = Math.round(innerWidth * ratio); const h = Math.round(innerHeight * ratio);
    this.targets[0].setSize(w, h);
    this.targets.slice(1).forEach(target => target.setSize(Math.max(1, Math.floor(w / 4)), Math.max(1, Math.floor(h / 4))));
    this.targetRatio = ratio;
  }
  update(delta, time, position, room) {
    this.phase += motionReduced() ? 0 : delta / 240;
    const sector = getSector(room);
    if (room !== this.lastRoom) {
      this.lastCull = -1;
      this.lastRoom = room; this.lightingBase = sunLight.intensity;
      const c = sector?.coords || position;
      sunLight.position.set(c.x + 14, c.y + 28, c.z + 12);
      sunLight.target.position.set(c.x, c.y, c.z); scene.add(sunLight.target);
      rimLight.position.set(c.x - 12, c.y + 16, c.z - 8);
      sunLight.shadow.needsUpdate = true;
    }
    const outdoor = sector?.floor === 'OUTDOOR';
    // The original engine contained two overlapping sky spheres.
    if (atmosphereEngine.skyboxMesh) atmosphereEngine.skyboxMesh.visible = false;
    if (sunsetSkyDome) { sunsetSkyDome.visible = outdoor; sunsetSkyDome.position.copy(position); }
    const daylight = 0.65 + Math.sin(this.phase * Math.PI * 2) * 0.35;
    sunLight.intensity = this.lightingBase * (outdoor ? daylight : 1);
    if (hemiLight.color) hemiLight.color.setHex(outdoor ? 0xbfdbfe : 0xfbcfe8);
    scene.background.setHex(outdoor ? 0x273e59 : 0x0c1020);
    if (scene.fog) scene.fog.color.copy(scene.background);
    for (const id of ['rainbow_sky_garden', 'aurora_bay']) {
      const aurora = rooms[id].userData.aurora;
      if (aurora) aurora.uniforms.uTime.value = motionReduced() ? 0 : time;
    }
    // Hide whole rooms on other floors; also reduces CPU scene traversal and shadow work.
    if (time - this.lastCull > 0.25) {
      this.lastCull = time;
      updateSpatialCulling(position);
      SECTOR_REGISTRY.forEach(s => {
        const group = rooms[s.slug];
        const distance = Math.hypot(s.coords.x - position.x, s.coords.z - position.z);
        group.visible = s.slug === room || (Math.abs(s.coords.y - position.y) < 8 && distance < 65);
      });
    }
  }
  render(camera) {
    const now = performance.now(); const elapsed = now - this.lastFrame; this.lastFrame = now;
    this.frameAverage = this.frameAverage * .95 + Math.min(250, elapsed) * .05;
    if (preferences.quality === 'auto' && now > this.nextAdapt) {
      this.nextAdapt = now + 8000;
      const ratio = renderer.getPixelRatio();
      if (this.frameAverage > 32 && ratio > .75) renderer.setPixelRatio(Math.max(.75, ratio - .25));
      else if (this.frameAverage < 19 && ratio < graphicsQuality.maxPixelRatio) renderer.setPixelRatio(Math.min(graphicsQuality.maxPixelRatio, ratio + .1));
    }
    if (graphicsQuality.preset !== 'high') { renderer.render(scene, camera); return; }
    if (this.targetRatio !== renderer.getPixelRatio()) this.resizeTargets();
    const [base, first, second] = this.targets;
    renderer.setRenderTarget(base); renderer.render(scene, camera);
    this.quad.material = this.blur;
    this.blur.uniforms.source.value = base.texture;
    this.blur.uniforms.stepSize.value.set(1 / first.width, 0); this.blur.uniforms.extract.value = 1;
    renderer.setRenderTarget(first); renderer.render(this.postScene, this.postCamera);
    this.blur.uniforms.source.value = first.texture;
    this.blur.uniforms.stepSize.value.set(0, 1 / first.height); this.blur.uniforms.extract.value = 0;
    renderer.setRenderTarget(second); renderer.render(this.postScene, this.postCamera);
    this.quad.material = this.composite;
    this.composite.uniforms.source.value = base.texture; this.composite.uniforms.glow.value = second.texture;
    renderer.setRenderTarget(null); renderer.render(this.postScene, this.postCamera);
  }
}

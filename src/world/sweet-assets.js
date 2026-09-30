// Shared material and geometry art direction for the entire playable estate.
const cream = 0xfff0df;
let textile = null;
const linearMaterials = new WeakSet();
function calibrateColor(material) {
  if (!linearMaterials.has(material)) { material.color.convertSRGBToLinear(); linearMaterials.add(material); }
}

function texture(renderer, draw, repeat = 1) {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 256;
  draw(canvas.getContext('2d'));
  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(repeat, repeat);
  map.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  return map;
}
function add(group, geometry, material, x, y, z, scale) {
  const item = new THREE.Mesh(geometry, material);
  item.position.set(x, y, z); if (scale) item.scale.set(...scale);
  item.castShadow = true; item.receiveShadow = true; group.add(item); return item;
}

export function softenPlush(material) {
  calibrateColor(material);
  material.roughness = .86; material.metalness = 0;
  if (textile) { material.bumpMap = textile; material.bumpScale = .018; }
  material.needsUpdate = true;
}

export function applySweetAssetDirection(scene, rooms, sectors, renderer, player, grumps) {
  textile = texture(renderer, ctx => {
    ctx.fillStyle = '#ddd'; ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 256; i += 3) {
      ctx.strokeStyle = i % 2 ? '#c5c5c5' : '#ededed'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 256); ctx.moveTo(0, i); ctx.lineTo(256, i); ctx.stroke();
    }
  }, 2);
  const damask = texture(renderer, ctx => {
    ctx.fillStyle = '#fffaf5'; ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = '#dbcacb'; ctx.lineWidth = 1.5;
    for (let y = 32; y < 256; y += 64) for (let x = 32; x < 256; x += 64) {
      ctx.beginPath(); ctx.moveTo(x, y - 24); ctx.bezierCurveTo(x + 32, y, x + 18, y + 16, x, y + 24);
      ctx.bezierCurveTo(x - 18, y + 16, x - 32, y, x, y - 24); ctx.stroke();
      for (let i = 0; i < 5; i++) {
        const a = i * Math.PI * 2 / 5;
        ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * 6, y + Math.sin(a) * 6, 3, 6, a, 0, Math.PI * 2); ctx.stroke();
      }
    }
  });
  const grain = texture(renderer, ctx => {
    ctx.fillStyle = '#f6ebdf'; ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = '#c6b5ac'; ctx.lineWidth = .8;
    for (let x = 0; x < 256; x += 7) {
      ctx.beginPath();
      for (let y = 0; y <= 256; y += 4) { const px = x + Math.sin(y / 35 + x) * 3; if (!y) ctx.moveTo(px, y); else ctx.lineTo(px, y); }
      ctx.stroke();
    }
  });
  const treated = new Set(); const hsl = {};
  scene.traverse(object => {
    for (const material of (Array.isArray(object.material) ? object.material : [object.material])) {
      if (!material?.isMeshStandardMaterial || treated.has(material)) continue;
      treated.add(material);
      material.color.getHSL(hsl);
      // Preserve shadows, dark eyes, glass, and the identity of each biome.
      if (!material.transparent && hsl.l > .08) {
        material.color.setHSL(hsl.h, hsl.s * .72, Math.min(.86, hsl.l + .055));
      }
      calibrateColor(material);
      material.envMapIntensity = material.metalness > .5 ? .8 : .35;
      if (material.emissiveIntensity > .2) material.emissiveIntensity *= .55;
      if (material.metalness > .55) { material.roughness = Math.max(.24, material.roughness); }
      else if (!material.transparent && !material.map && object.geometry?.type === 'BoxGeometry') {
        const tall = object.geometry.parameters.height > 3;
        material.map = tall ? damask : grain;
        material.bumpMap = material.map; material.bumpScale = tall ? .009 : .012;
      }
      material.needsUpdate = true;
    }
  });
  // Floral wallpaper replaces the earlier square panel relief on every wall.
  Object.values(rooms).forEach(room => room.traverse(object => {
    const material = object.material;
    if (material?.isMeshStandardMaterial && object.geometry?.type === 'BoxGeometry' && object.geometry.parameters.height > 4 && material.metalness < .2) {
      material.map = damask; material.bumpMap = damask; material.bumpScale = .012;
    }
  }));

  const satin = player.styleMaterials.vest;
  satin.roughness = .55; satin.metalness = .03; satin.bumpMap = textile; satin.bumpScale = .008;
  const lace = new THREE.MeshStandardMaterial({ color: cream, roughness: .7, bumpMap: textile, bumpScale: .006 });
  const rose = player.styleMaterials.ribbon;
  const gold = player.styleMaterials.trim;
  gold.emissiveIntensity = .025; gold.roughness = .3;
  player.styleMaterials.hair.metalness = .03; player.styleMaterials.hair.roughness = .42;
  player.styleMaterials.hair.bumpMap = grain; player.styleMaterials.hair.bumpScale = .008;
  // A fitted dress silhouette, layered scalloped hem, puff sleeves and pearl trim.
  player.meshBody.geometry.dispose();
  player.meshBody.geometry = new THREE.CylinderGeometry(.32, .35, .8, 32);
  player.meshBody.position.y = .88;
  add(player.group, new THREE.CylinderGeometry(.28, .56, .5, 40), satin, 0, .4, 0);
  add(player.group, new THREE.TorusGeometry(.53, .045, 8, 48), lace, 0, .18, 0).rotation.x = Math.PI / 2;
  for (let i = 0; i < 24; i++) {
    const a = i * Math.PI * 2 / 24;
    add(player.group, new THREE.SphereGeometry(.04, 8, 6), lace, Math.sin(a) * .52, .17, Math.cos(a) * .52);
  }
  for (const arm of [player.leftArmGroup, player.rightArmGroup]) add(arm, new THREE.SphereGeometry(.16, 16, 12), lace, 0, -.035, 0, [1, 1.1, 1]);
  // Smooth hair cap, swept fringe and curved locks replace cone-shaped tails.
  const hair = player.styleMaterials.hair;
  add(player.headGroup, new THREE.SphereGeometry(.48, 32, 24, 0, Math.PI * 2, 0, Math.PI * .53), hair, 0, 1.55, -.055, [1.02, 1.03, 1]);
  add(player.headGroup, new THREE.SphereGeometry(.45, 28, 20), hair, 0, 1.51, -.20, [1.02, 1, .66]);
  for (let i = 0; i < 5; i++) {
    const strand = add(player.headGroup, new THREE.SphereGeometry(.13, 16, 12), hair, (i - 2) * .14, 1.78 + Math.abs(i - 2) * .035, .32, [.8, 1.6, .5]);
    strand.rotation.z = (i - 2) * -.18;
  }
  const points = [new THREE.Vector2(.07, -.68), new THREE.Vector2(.13, -.51), new THREE.Vector2(.12, -.2), new THREE.Vector2(.16, .02), new THREE.Vector2(.09, .2)];
  const locks = new THREE.LatheGeometry(points, 20);
  player.leftPigtail.geometry = locks; player.rightPigtail.geometry = locks;
  for (const sign of [-1, 1]) {
    for (const side of [-1, 1]) {
      const loop = add(player.headGroup, new THREE.SphereGeometry(.09, 12, 10), rose, sign * .46 + side * .07, 1.77, -.06, [1.2, .6, .4]);
      loop.rotation.z = side * .35;
    }
    add(player.headGroup, new THREE.SphereGeometry(.032, 10, 8), lace, sign * .45, 1.33, .01);
  }
  const smile = new THREE.Mesh(new THREE.TorusGeometry(.055, .008, 6, 20, Math.PI), new THREE.MeshStandardMaterial({ color: 0xb9677f, roughness: .6 }));
  smile.rotation.z = Math.PI; smile.position.set(0, 1.38, .466); player.headGroup.add(smile);
  grumps.forEach(grump => {
    softenPlush(grump.furMat);
    for (const eye of grump.eyes || []) add(eye, new THREE.SphereGeometry(.018, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }), -.02, .025, .065);
  });

  // Shared instanced flowers keep the same visual language affordable in all 42 maps.
  const petalGeo = new THREE.SphereGeometry(.13, 10, 8);
  const petalMat = new THREE.MeshStandardMaterial({ color: 0xf3b3ca, roughness: .7 });
  const porcelain = new THREE.MeshStandardMaterial({ color: cream, roughness: .24, metalness: .08 });
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x6e9a7d, roughness: .8 });
  const matrix = new THREE.Object3D();
  sectors.forEach(sector => {
    const room = rooms[sector.slug]; const decor = new THREE.Group(); decor.name = 'sweet-chateau-decor'; room.add(decor);
    for (const sign of [-1, 1]) {
      const x = sign * (sector.size.w / 2 - 2.4), z = -sector.size.l / 2 + 2.4;
      add(decor, new THREE.CylinderGeometry(.37, .25, .7, 20), porcelain, x, .35, z);
      const petals = new THREE.InstancedMesh(petalGeo, petalMat, 15); let index = 0;
      for (let flower = 0; flower < 3; flower++) {
        const cx = x + (flower - 1) * .23, cy = 1.05 + (flower === 1 ? .15 : 0);
        add(decor, new THREE.CylinderGeometry(.016, .02, .7, 6), stemMat, cx, .75, z);
        add(decor, new THREE.SphereGeometry(.07, 8, 8), gold, cx, cy, z);
        for (let p = 0; p < 5; p++) {
          const angle = p * Math.PI * 2 / 5;
          matrix.position.set(cx + Math.cos(angle) * .12, cy + Math.sin(angle) * .12, z);
          matrix.scale.set(1, .8, .4); matrix.updateMatrix(); petals.setMatrixAt(index++, matrix.matrix);
        }
      }
      petals.castShadow = true; decor.add(petals);
    }
  });
  scene.traverse(object => {
    for (const material of (Array.isArray(object.material) ? object.material : [object.material])) {
      if (material?.isMeshStandardMaterial) { calibrateColor(material); treated.add(material); }
    }
  });
  return { materialCount: treated.size, decoratedRooms: sectors.length };
}

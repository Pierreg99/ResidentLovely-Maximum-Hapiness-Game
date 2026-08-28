import { scene, spawnConfetti } from '../world/scene.js';
import { player } from './player.js';
import { audio } from '../engine/audio.js';

export class CompanionSquad {
  constructor() {
    this.companions = [];
    this.maxCompanions = 4;
    this.speedBuffTimer = 0;
  }

  addCompanion(grumpEntity) {
    if (this.companions.length >= this.maxCompanions) return;
    if (this.companions.some(c => c.id === grumpEntity)) return;

    // Create Follower Mesh Group
    const fGroup = new THREE.Group();
    fGroup.position.copy(player.group.position).add(new THREE.Vector3((Math.random() - 0.5) * 2, 0, (Math.random() - 0.5) * 2));

    // Clone species visual
    const furMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 });
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.48, 16, 16), furMat);
    body.position.y = 0.48;
    fGroup.add(body);

    // Glowing Star Eyes
    for (let x of [-0.14, 0.14]) {
      const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.06), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      star.position.set(x, 0.62, 0.42);
      fGroup.add(star);

      // Pink Blush
      const blush = new THREE.Mesh(new THREE.CircleGeometry(0.06, 8), new THREE.MeshBasicMaterial({ color: 0xec4899, transparent: true, opacity: 0.8 }));
      blush.position.set(x * 1.6, 0.48, 0.44);
      fGroup.add(blush);
    }

    // Floating Golden Halo
    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(0.28, 0.03, 8, 16),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b })
    );
    halo.rotation.x = Math.PI / 2;
    halo.position.y = 1.05;
    fGroup.add(halo);

    scene.add(fGroup);

    const comp = {
      id: grumpEntity,
      type: grumpEntity.type || 'bear',
      group: fGroup,
      body,
      affection: 100,
      targetOffset: new THREE.Vector3(0, 0, 0),
      hopPhase: Math.random() * Math.PI * 2
    };

    this.companions.push(comp);
    this.updateHUD();
    audio.playCheer();
  }

  petCompanion(index, callbacks) {
    const c = this.companions[index];
    if (!c) return;

    c.affection = Math.min(100, c.affection + 20);
    this.speedBuffTimer = 15.0; // 15s speed buff
    player.speed = 9.2; // Buffed speed

    audio.playPop();
    spawnConfetti(c.group.position.clone().add(new THREE.Vector3(0, 1, 0)), 30);
    if (callbacks.onToast) callbacks.onToast('★ PETTED COMPANION! +25% SPEED BUFF ACTIVE! ★');
    this.updateHUD();
  }

  feedCupcake(index, inventorySystem, callbacks) {
    const c = this.companions[index];
    if (!c) return;

    const cakeIdx = inventorySystem.gameState.inventory.findIndex(s => s && s.id === 'bliss_cupcake');
    if (cakeIdx !== -1) {
      inventorySystem.consumeSlot(cakeIdx);
      c.affection = 100;
      this.speedBuffTimer = 30.0;
      player.speed = 9.8;

      audio.playCheer();
      spawnConfetti(c.group.position.clone().add(new THREE.Vector3(0, 1.2, 0)), 50);
      if (callbacks.onToast) callbacks.onToast('★ FED MEGA BLISS CUPCAKE! MAXIMUM PARADE JOY! ★');
      this.updateHUD();
    } else {
      if (callbacks.onToast) callbacks.onToast('NO MEGA BLISS CUPCAKES IN INVENTORY!');
    }
  }

  update(delta, time, currentRoom) {
    // Handle Speed Buff Expiration
    if (this.speedBuffTimer > 0) {
      this.speedBuffTimer -= delta;
      if (this.speedBuffTimer <= 0) {
        player.speed = 7.4; // Return to standard speed
      }
    }

    const pPos = player.group.position;
    const pRot = player.rotation;

    this.companions.forEach((c, idx) => {
      // Marching Formation behind player along -Z
      const formationDist = 1.4 + idx * 0.9;
      const angleSpread = (idx % 2 === 0 ? 1 : -1) * (0.35 + idx * 0.15);

      const targetX = pPos.x - Math.sin(pRot + angleSpread) * formationDist;
      const targetZ = pPos.z - Math.cos(pRot + angleSpread) * formationDist;
      const targetY = pPos.y;

      const targetVec = new THREE.Vector3(targetX, targetY, targetZ);
      c.group.position.lerp(targetVec, 0.12);

      // Face player direction
      c.group.rotation.y = pRot;

      // Cute Bouncing Hop Animation
      c.hopPhase += delta * 8.0;
      const isMoving = pPos.distanceTo(c.group.position) > 0.8;
      if (isMoving) {
        c.group.position.y = targetY + Math.abs(Math.sin(c.hopPhase)) * 0.28;
      } else {
        c.group.position.y = targetY + Math.sin(time * 3 + idx) * 0.06;
      }
    });
  }

  updateHUD() {
    const squadBar = document.getElementById('companion-squad-bar');
    if (!squadBar) return;

    if (this.companions.length === 0) {
      squadBar.style.display = 'none';
      return;
    }

    squadBar.style.display = 'flex';
    const compList = document.getElementById('companion-icons-list');
    if (compList) {
      compList.innerHTML = this.companions.map((c, i) => `
        <div class="companion-hud-pill" onclick="window.__petCompanion(${i})" title="Click to Pet Companion [${i+1}]">
          <span style="color:#f59e0b;">★</span>
          <span>${c.type.toUpperCase()}</span>
          <span style="color:#22d3ee;font-size:9px;">${c.affection}%</span>
        </div>
      `).join('');
    }
  }
}

export const companionSquad = new CompanionSquad();

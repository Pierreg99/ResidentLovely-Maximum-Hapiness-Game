import { rooms } from '../world/rooms.js';
import { audio } from '../engine/audio.js';
import { spawnConfetti } from '../world/scene.js';

export class BossEntity {
  constructor() {
    this.group = new THREE.Group();
    this.group.position.set(0, 0, 0);
    this.roomName = 'crypt';
    this.name = 'GRAND GLOOM BEHEMOTH';
    this.hp = 300;
    this.maxHp = 300;
    this.phase = 1; // 1: Sigh Shockwaves, 2: Minions, 3: Finale Joy Beam
    this.isDefeated = false;
    this.squashTimer = 0;
    this.attackTimer = 3.0;

    this.initMesh();
    if (rooms.crypt) rooms.crypt.add(this.group);
  }

  initMesh() {
    this.furMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.7, metalness: 0.2 });
    
    // Giant Round Body
    this.bodyMesh = new THREE.Mesh(new THREE.SphereGeometry(2.4, 24, 24), this.furMat);
    this.bodyMesh.position.y = 2.4;
    this.bodyMesh.castShadow = true;
    this.group.add(this.bodyMesh);

    // Gilded Royal Crown
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.15 });
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 0.9, 0.8, 8), goldMat);
    crown.position.set(0, 4.8, 0);
    this.group.add(crown);

    // Giant Big Eyes & Teary Gloom Marks
    this.eyes = [];
    this.stars = [];
    for (let x of [-0.7, 0.7]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), new THREE.MeshBasicMaterial({ color: 0x0f172a }));
      eye.position.set(x, 2.9, 2.0);
      this.group.add(eye);
      this.eyes.push(eye);

      const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.32), new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
      star.position.set(x, 2.9, 2.05);
      star.visible = false;
      this.group.add(star);
      this.stars.push(star);
    }
  }

  takeDamage(amount, gameState, callbacks) {
    if (this.isDefeated) return;

    this.hp = Math.max(0, this.hp - amount);
    this.squashTimer = 0.25;

    // Update Boss HUD if present
    const bossFill = document.getElementById('boss-health-fill');
    if (bossFill) {
      bossFill.style.width = `${(this.hp / this.maxHp) * 100}%`;
    }

    if (this.hp <= 0 && !this.isDefeated) {
      this.upliftBoss(gameState, callbacks);
    }
  }

  upliftBoss(gameState, callbacks) {
    this.isDefeated = true;
    this.furMat.color.setHex(0xf59e0b); // Golden joy transformation
    this.eyes.forEach(e => e.visible = false);
    this.stars.forEach(s => s.visible = true);

    audio.playCheer();
    spawnConfetti(rooms.crypt.position.clone().add(new THREE.Vector3(0, 4, 0)), 120);

    if (callbacks.onToast) callbacks.onToast('★ GRAND GLOOM BEHEMOTH UPLIFTED INTO ETERNAL JOY! ★');
    
    // Trigger Grand Victory Banner
    const victoryBanner = document.getElementById('party-banner');
    if (victoryBanner) victoryBanner.style.display = 'flex';
  }

  update(delta, time, playerPos) {
    if (this.isDefeated) {
      this.group.position.y = Math.abs(Math.sin(time * 4)) * 1.2;
      this.group.rotation.y += delta * 2.5;
      return;
    }

    // Gentle floating
    this.group.position.y = Math.sin(time * 2) * 0.25;

    // Face player
    if (playerPos) {
      const dir = playerPos.clone().sub(this.group.position);
      this.group.rotation.y = Math.atan2(dir.x, dir.z);
    }

    // Squash & Stretch
    if (this.squashTimer > 0) {
      this.squashTimer -= delta;
      this.bodyMesh.scale.set(1.2, 0.8, 1.2);
    } else {
      this.bodyMesh.scale.set(1, 1, 1);
    }
  }
}

export let bossInstance = null;

export function initBoss() {
  bossInstance = new BossEntity();
  return bossInstance;
}

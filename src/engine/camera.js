import { rooms } from '../world/rooms.js';
import { SECTOR_REGISTRY, getSector } from '../world/sectors.js';

export class CameraController {
  constructor() {
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.shake = 0;
    this.viewMode = 'ots'; // 'ots' (Over-The-Shoulder), 'fixed' (Classic RE Cinematic), 'ads' (First-Person ADS)
    this.pitch = 0; // Vertical pitch tilt (-0.45 to +0.45)
    this.currentLookAt = new THREE.Vector3(0, 1.4, 8); // Smoothly interpolated lookAt target
    this.dramaticTimer = 0;
    this.dramaticTarget = null;

    // Room Bounding Boxes for Camera Collision Clamping
    this.roomBounds = {
      foyer: { minX: -12.2, maxX: 12.2, minZ: -12.2, maxZ: 12.2, minY: 0.9, maxY: 11.0, center: new THREE.Vector3(0, 0, 0) },
      library: { minX: 34.0, maxX: 56.0, minZ: -10.2, maxZ: 10.2, minY: 0.9, maxY: 7.2, center: new THREE.Vector3(45, 0, 0) },
      garden: { minX: -56.0, maxX: -34.0, minZ: -11.2, maxZ: 11.2, minY: 0.9, maxY: 7.8, center: new THREE.Vector3(-45, 0, 0) },
      greenhouse: { minX: -11.5, maxX: 11.5, minZ: 33.5, maxZ: 56.5, minY: 0.9, maxY: 9.0, center: new THREE.Vector3(0, 0, 45) },
      dining: { minX: 34.0, maxX: 56.0, minZ: 33.5, maxZ: 56.5, minY: 0.9, maxY: 8.5, center: new THREE.Vector3(45, 0, 45) },
      gallery: { minX: -56.0, maxX: -34.0, minZ: 33.5, maxZ: 56.5, minY: 0.9, maxY: 8.5, center: new THREE.Vector3(-45, 0, 45) },
      observatory: { minX: 34.0, maxX: 56.0, minZ: -10.5, maxZ: 10.5, minY: 12.8, maxY: 20.0, center: new THREE.Vector3(45, 12, 0) },
      clocktower: { minX: -56.0, maxX: -34.0, minZ: -10.5, maxZ: 10.5, minY: 12.8, maxY: 20.0, center: new THREE.Vector3(-45, 12, 0) },
      mastersuite: { minX: -11.5, maxX: 11.5, minZ: 33.5, maxZ: 56.5, minY: 12.8, maxY: 20.0, center: new THREE.Vector3(0, 12, 45) },
      ballroom: { minX: -12.5, maxX: 12.5, minZ: -56.5, maxZ: -33.5, minY: 12.8, maxY: 20.0, center: new THREE.Vector3(0, 12, -45) },
      cathedral: { minX: -11.5, maxX: 11.5, minZ: -11.5, maxZ: 11.5, minY: 24.9, maxY: 38.0, center: new THREE.Vector3(0, 24, 0) },
      gatehouse: { minX: -13.0, maxX: 13.0, minZ: 77.0, maxZ: 103.0, minY: 0.9, maxY: 12.0, center: new THREE.Vector3(0, 0, 90) },
      reflection_pool: { minX: -57.0, maxX: -33.0, minZ: 77.0, maxZ: 103.0, minY: 0.9, maxY: 9.0, center: new THREE.Vector3(-45, 0, 90) },
      rose_maze: { minX: 33.0, maxX: 57.0, minZ: 77.0, maxZ: 103.0, minY: 0.9, maxY: 9.0, center: new THREE.Vector3(45, 0, 90) },
      gazebo: { minX: -10.5, maxX: 10.5, minZ: 124.5, maxZ: 145.5, minY: 0.9, maxY: 10.5, center: new THREE.Vector3(0, 0, 135) },
      lab: { minX: -11.5, maxX: 11.5, minZ: -56.5, maxZ: -33.5, minY: -13.2, maxY: -6.0, center: new THREE.Vector3(0, -14, -45) },
      crypt: { minX: -12.5, maxX: 12.5, minZ: -56.5, maxZ: -33.5, minY: -27.2, maxY: -20.0, center: new THREE.Vector3(0, -28, -45) }
    };

    // Dynamically populate bounds for all 32 sectors from SECTOR_REGISTRY
    SECTOR_REGISTRY.forEach(sec => {
      const w = sec.size.w;
      const l = sec.size.l;
      const h = sec.size.h;
      const cx = sec.coords.x;
      const cy = sec.coords.y;
      const cz = sec.coords.z;
      const halfW = w / 2 - 1.6;
      const halfL = l / 2 - 1.6;

      if (!this.roomBounds[sec.slug]) {
        this.roomBounds[sec.slug] = {
          minX: cx - halfW,
          maxX: cx + halfW,
          minZ: cz - halfL,
          maxZ: cz + halfL,
          minY: cy + 0.9,
          maxY: cy + h - 1.0,
          center: new THREE.Vector3(cx, cy, cz)
        };
      }
      this.roomBounds[sec.id] = this.roomBounds[sec.slug];
    });

    // Classic Resident Evil Fixed Cinematic Camera Nodes per Room
    this.fixedNodes = {
      foyer: [
        { id: 'foyer_entrance', pos: new THREE.Vector3(0, 6.0, -11.0), triggerZ: -4 },
        { id: 'foyer_center', pos: new THREE.Vector3(-8.8, 5.2, 0), triggerZ: 2 },
        { id: 'foyer_stairs', pos: new THREE.Vector3(7.8, 8.5, 8.0), triggerZ: 14 }
      ],
      library: [
        { id: 'lib_entry', pos: new THREE.Vector3(36.5, 5.2, -5.0), triggerZ: -2 },
        { id: 'lib_cauldron', pos: new THREE.Vector3(52.5, 5.5, 8.0), triggerZ: 4 }
      ],
      garden: [
        { id: 'garden_entry', pos: new THREE.Vector3(-36.5, 5.5, -5.0), triggerZ: -2 },
        { id: 'garden_fountain', pos: new THREE.Vector3(-45.0, 4.8, 8.0), triggerZ: 4 }
      ],
      greenhouse: [
        { id: 'gh_entry', pos: new THREE.Vector3(0, 4.5, 36.0), triggerZ: 40 },
        { id: 'gh_pavilion', pos: new THREE.Vector3(7.5, 5.5, 48.0), triggerZ: 50 }
      ],
      dining: [
        { id: 'din_entry', pos: new THREE.Vector3(37.5, 5.5, 38.0), triggerZ: 40 },
        { id: 'din_table', pos: new THREE.Vector3(52.5, 5.5, 50.0), triggerZ: 50 }
      ],
      gallery: [
        { id: 'gal_entry', pos: new THREE.Vector3(-37.5, 5.5, 38.0), triggerZ: 40 },
        { id: 'gal_art', pos: new THREE.Vector3(-52.5, 5.5, 50.0), triggerZ: 50 }
      ],
      observatory: [
        { id: 'obs_entry', pos: new THREE.Vector3(37.5, 16.5, -5.0), triggerZ: -2 },
        { id: 'obs_astrolabe', pos: new THREE.Vector3(52.5, 17.5, 6.0), triggerZ: 4 }
      ],
      clocktower: [
        { id: 'clock_entry', pos: new THREE.Vector3(-37.5, 16.5, -5.0), triggerZ: -2 },
        { id: 'clock_pendulum', pos: new THREE.Vector3(-52.5, 17.5, 6.0), triggerZ: 4 }
      ],
      mastersuite: [
        { id: 'master_entry', pos: new THREE.Vector3(0, 16.5, 38.0), triggerZ: 40 }
      ],
      ballroom: [
        { id: 'ball_entry', pos: new THREE.Vector3(0, 16.5, -38.0), triggerZ: -40 }
      ],
      lab: [
        { id: 'lab_entry', pos: new THREE.Vector3(0, -9.5, -36.0), triggerZ: -40 },
        { id: 'lab_dynamo', pos: new THREE.Vector3(-7.5, -8.5, -48.0), triggerZ: -50 }
      ],
      crypt: [
        { id: 'crypt_entry', pos: new THREE.Vector3(0, -23.5, -38.0), triggerZ: -40 },
        { id: 'crypt_boss', pos: new THREE.Vector3(0, -22.5, -50.0), triggerZ: -48 }
      ]
    };

    // Dynamically populate default cinematic camera angles for all sectors
    SECTOR_REGISTRY.forEach(sec => {
      if (!this.fixedNodes[sec.slug]) {
        const cx = sec.coords.x;
        const cy = sec.coords.y;
        const cz = sec.coords.z;
        this.fixedNodes[sec.slug] = [
          { id: `${sec.slug}_entry`, pos: new THREE.Vector3(cx, cy + 5.5, cz - 8.0), triggerZ: cz - 2 },
          { id: `${sec.slug}_center`, pos: new THREE.Vector3(cx - 6.0, cy + 5.2, cz), triggerZ: cz + 2 }
        ];
      }
      this.fixedNodes[sec.id] = this.fixedNodes[sec.slug];
    });

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    });
  }

  cycleViewMode() {
    if (this.viewMode === 'ots') {
      this.viewMode = 'fixed';
    } else if (this.viewMode === 'fixed') {
      this.viewMode = 'ads';
    } else {
      this.viewMode = 'ots';
    }
    return this.getViewModeLabel();
  }

  getViewModeLabel() {
    if (this.viewMode === 'ots') return 'VIEW: 360° OTS';
    if (this.viewMode === 'fixed') return 'VIEW: CLASSIC FIXED';
    return 'VIEW: FIRST-PERSON ADS';
  }

  addShake(amount) {
    this.shake = Math.min(1.0, this.shake + amount);
  }

  addPitch(deltaPitch) {
    this.pitch = THREE.MathUtils.clamp(this.pitch + deltaPitch, -0.45, 0.45);
  }

  update(player, delta, currentRoom) {
    const pPos = player.group.position;
    const pRot = player.rotation;
    const sector = getSector(currentRoom);
    const bounds = this.roomBounds[currentRoom] || (sector ? this.roomBounds[sector.slug] : this.roomBounds.foyer);

    // Head culling for ADS mode to prevent mesh clipping
    if (player.setHeadVisibility) {
      player.setHeadVisibility(this.viewMode !== 'ads');
    }

    if (this.viewMode === 'ots') {
      // 1. DYNAMIC 360° OVER-THE-SHOULDER (OTS)
      // Character is modeled facing +Z. Camera sits BEHIND at -Z.
      const baseDist = player.isAiming ? 2.4 : 3.9;
      const baseHeight = player.isAiming ? 1.55 : 1.9;
      const sideOffset = player.isAiming ? 0.75 : 0.6; // Right shoulder

      const camOffset = new THREE.Vector3(sideOffset, baseHeight - this.pitch * 1.8, -baseDist);
      const rotatedOffset = camOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), pRot);
      const rawCamPos = pPos.clone().add(rotatedOffset);

      // Camera Wall Collision Clamping with Feeler Soft-Pullback
      const targetCamPos = new THREE.Vector3(
        THREE.MathUtils.clamp(rawCamPos.x, bounds.minX, bounds.maxX),
        THREE.MathUtils.clamp(rawCamPos.y, bounds.minY, bounds.maxY),
        THREE.MathUtils.clamp(rawCamPos.z, bounds.minZ, bounds.maxZ)
      );

      // If pushed against a wall, softly pull towards player to avoid mesh clipping
      if (targetCamPos.distanceTo(rawCamPos) > 0.05) {
        targetCamPos.lerp(pPos.clone().add(new THREE.Vector3(0, 1.5, 0)), 0.22);
      }

      // Camera Shake
      if (this.shake > 0) {
        targetCamPos.x += (Math.random() - 0.5) * this.shake;
        targetCamPos.y += (Math.random() - 0.5) * this.shake;
        this.shake = Math.max(0, this.shake - delta * 2.0);
      }

      // Smooth Position Interpolation
      this.camera.position.lerp(targetCamPos, 0.18);

      // Look Target: In front of the character along +Z (shoulder height)
      const lookDist = player.isAiming ? 18 : 12;
      const lookOffset = new THREE.Vector3(sideOffset * 0.3, 1.4 + this.pitch * 3.0, lookDist);
      const rotatedLook = lookOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), pRot);
      const targetLook = pPos.clone().add(rotatedLook);

      // Dual-Smoothing: Smoothly interpolate lookAt target to eliminate all camera snapping/jitter
      this.currentLookAt.lerp(targetLook, 0.18);
      this.camera.lookAt(this.currentLookAt);

    } else if (this.viewMode === 'fixed') {
      // 2. CLASSIC RESIDENT EVIL FIXED CINEMATIC CAMERA ANGLES
      const roomNodes = this.fixedNodes[currentRoom] || (sector ? this.fixedNodes[sector.slug] : this.fixedNodes.foyer);
      let activeNode = roomNodes[0];

      let roomRelZ = pPos.z;
      if (rooms[currentRoom] && rooms[currentRoom].position) {
        roomRelZ = pPos.z - rooms[currentRoom].position.z;
      }

      for (let node of roomNodes) {
        if (roomRelZ <= node.triggerZ) {
          activeNode = node;
          break;
        }
      }

      const targetCamPos = activeNode.pos.clone();
      if (this.shake > 0) {
        targetCamPos.x += (Math.random() - 0.5) * this.shake;
        targetCamPos.y += (Math.random() - 0.5) * this.shake;
        this.shake = Math.max(0, this.shake - delta * 2.0);
      }

      this.camera.position.lerp(targetCamPos, 0.12);
      const targetLook = pPos.clone().add(new THREE.Vector3(0, 1.3, 0));
      this.currentLookAt.lerp(targetLook, 0.15);
      this.camera.lookAt(this.currentLookAt);

    } else if (this.viewMode === 'ads') {
      // 3. FIRST-PERSON / ADS DOWN-THE-SIGHTS MODE
      const headPos = pPos.clone().add(new THREE.Vector3(0, 1.55, 0));
      const fwd = new THREE.Vector3(0, this.pitch, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), pRot).normalize();
      const eyeCamPos = headPos.clone().add(fwd.clone().multiplyScalar(0.45));

      if (this.shake > 0) {
        eyeCamPos.x += (Math.random() - 0.5) * this.shake * 0.5;
        eyeCamPos.y += (Math.random() - 0.5) * this.shake * 0.5;
        this.shake = Math.max(0, this.shake - delta * 2.0);
      }

      this.camera.position.lerp(eyeCamPos, 0.35);
      const aimTarget = eyeCamPos.clone().add(fwd.clone().multiplyScalar(20));
      this.currentLookAt.lerp(aimTarget, 0.35);
      this.camera.lookAt(this.currentLookAt);
    }
  }

  triggerDramaticFraming(targetPos, duration = 3.0) {
    if (targetPos && typeof targetPos.clone === 'function') {
      this.dramaticTarget = targetPos.clone();
    }
    this.dramaticTimer = duration;
  }
}

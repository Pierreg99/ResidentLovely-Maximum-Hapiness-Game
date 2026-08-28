import { rooms } from '../world/rooms.js';

export class CameraController {
  constructor() {
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.shake = 0;
    this.viewMode = 'ots'; // 'ots' (Over-The-Shoulder), 'fixed' (Classic RE Cinematic), 'ads' (First-Person ADS)
    this.pitch = 0; // Vertical pitch tilt (-0.45 to +0.45)
    this.currentLookAt = new THREE.Vector3(0, 1.4, 8); // Smoothly interpolated lookAt target

    // Room Bounding Boxes for Camera Collision Clamping
    this.roomBounds = {
      foyer: { minX: -12.2, maxX: 12.2, minZ: -12.2, maxZ: 12.2, minY: 0.9, maxY: 11.0, center: new THREE.Vector3(0, 0, 0) },
      library: { minX: 34.0, maxX: 56.0, minZ: -10.2, maxZ: 10.2, minY: 0.9, maxY: 7.2, center: new THREE.Vector3(45, 0, 0) },
      garden: { minX: -56.0, maxX: -34.0, minZ: -11.2, maxZ: 11.2, minY: 0.9, maxY: 7.8, center: new THREE.Vector3(-45, 0, 0) },
      greenhouse: { minX: -11.5, maxX: 11.5, minZ: 33.5, maxZ: 56.5, minY: 0.9, maxY: 9.0, center: new THREE.Vector3(0, 0, 45) },
      observatory: { minX: 34.0, maxX: 56.0, minZ: -10.5, maxZ: 10.5, minY: 12.8, maxY: 20.0, center: new THREE.Vector3(45, 12, 0) },
      clocktower: { minX: -56.0, maxX: -34.0, minZ: -10.5, maxZ: 10.5, minY: 12.8, maxY: 20.0, center: new THREE.Vector3(-45, 12, 0) },
      lab: { minX: -11.5, maxX: 11.5, minZ: -56.5, maxZ: -33.5, minY: -13.2, maxY: -6.0, center: new THREE.Vector3(0, -14, -45) }
    };

    // Classic Resident Evil Fixed Cinematic Camera Nodes per Room
    this.fixedNodes = {
      foyer: [
        { id: 'foyer_entrance', pos: new THREE.Vector3(0, 6.0, -11.0), triggerZ: -4 },
        { id: 'foyer_center', pos: new THREE.Vector3(-8.8, 5.2, 0), triggerZ: 2 },
        { id: 'foyer_stairs', pos: new THREE.Vector3(7.8, 8.5, 8.0), triggerZ: 14 }
      ],
      library: [
        { id: 'lib_entry', pos: new THREE.Vector3(36.5, 5.2, -5.0), triggerZ: -2 },
        { id: 'lib_cauldron', pos: new THREE.Vector3(52.5, 5.5, 8.0), triggerZ: 4 },
        { id: 'lib_balcony', pos: new THREE.Vector3(37.5, 5.8, 4.0), triggerZ: 14 }
      ],
      garden: [
        { id: 'garden_entry', pos: new THREE.Vector3(-36.5, 5.5, -5.0), triggerZ: -2 },
        { id: 'garden_fountain', pos: new THREE.Vector3(-45.0, 4.8, 8.0), triggerZ: 4 },
        { id: 'garden_gazebo', pos: new THREE.Vector3(-53.5, 5.8, -3.0), triggerZ: 14 }
      ],
      greenhouse: [
        { id: 'gh_entry', pos: new THREE.Vector3(0, 4.5, 36.0), triggerZ: 40 },
        { id: 'gh_pavilion', pos: new THREE.Vector3(7.5, 5.5, 48.0), triggerZ: 50 }
      ],
      observatory: [
        { id: 'obs_entry', pos: new THREE.Vector3(37.5, 16.5, -5.0), triggerZ: -2 },
        { id: 'obs_astrolabe', pos: new THREE.Vector3(52.5, 17.5, 6.0), triggerZ: 4 }
      ],
      clocktower: [
        { id: 'clock_entry', pos: new THREE.Vector3(-37.5, 16.5, -5.0), triggerZ: -2 },
        { id: 'clock_pendulum', pos: new THREE.Vector3(-52.5, 17.5, 6.0), triggerZ: 4 }
      ],
      lab: [
        { id: 'lab_entry', pos: new THREE.Vector3(0, -9.5, -36.0), triggerZ: -40 },
        { id: 'lab_dynamo', pos: new THREE.Vector3(-7.5, -8.5, -48.0), triggerZ: -50 }
      ]
    };

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
    const bounds = this.roomBounds[currentRoom] || this.roomBounds.foyer;

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

      // Camera Wall Collision Clamping
      const targetCamPos = new THREE.Vector3(
        THREE.MathUtils.clamp(rawCamPos.x, bounds.minX, bounds.maxX),
        THREE.MathUtils.clamp(rawCamPos.y, bounds.minY, bounds.maxY),
        THREE.MathUtils.clamp(rawCamPos.z, bounds.minZ, bounds.maxZ)
      );

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
      const roomNodes = this.fixedNodes[currentRoom] || this.fixedNodes.foyer;
      let activeNode = roomNodes[0];

      let roomRelZ = pPos.z;
      if (currentRoom === 'library') roomRelZ = pPos.z - rooms.library.position.z;
      if (currentRoom === 'garden') roomRelZ = pPos.z - rooms.garden.position.z;

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
}

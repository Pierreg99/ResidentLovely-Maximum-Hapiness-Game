import { rooms } from '../world/rooms.js';

export class CameraController {
  constructor() {
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.shake = 0;
    this.viewMode = 'ots'; // 'ots' (Over-The-Shoulder), 'fixed' (Classic RE Cinematic), 'ads' (First-Person ADS)
    this.pitch = 0; // Vertical pitch tilt (-0.5 to +0.5)

    // Classic Resident Evil Fixed Cinematic Camera Nodes per Room
    this.fixedNodes = {
      foyer: [
        { id: 'foyer_entrance', pos: new THREE.Vector3(0, 6.5, -12), triggerZ: -4 },
        { id: 'foyer_center', pos: new THREE.Vector3(-9.5, 5.8, 0), triggerZ: 2 },
        { id: 'foyer_stairs', pos: new THREE.Vector3(8.5, 6.2, 8.5), triggerZ: 14 }
      ],
      library: [
        { id: 'lib_entry', pos: new THREE.Vector3(35, 5.8, -6), triggerZ: -2 },
        { id: 'lib_cauldron', pos: new THREE.Vector3(54, 6.2, 9), triggerZ: 4 },
        { id: 'lib_balcony', pos: new THREE.Vector3(36, 6.5, 5), triggerZ: 14 }
      ],
      garden: [
        { id: 'garden_entry', pos: new THREE.Vector3(-35, 6.0, -6), triggerZ: -2 },
        { id: 'garden_fountain', pos: new THREE.Vector3(-45, 5.2, 9), triggerZ: 4 },
        { id: 'garden_gazebo', pos: new THREE.Vector3(-55, 6.5, -4), triggerZ: 14 }
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

    if (this.viewMode === 'ots') {
      // 1. DYNAMIC 360° OVER-THE-SHOULDER (OTS)
      // Character is modeled facing +Z. Camera sits BEHIND at -Z.
      const baseDist = player.isAiming ? 2.4 : 4.2;
      const baseHeight = player.isAiming ? 1.65 : 2.0;
      const sideOffset = player.isAiming ? 0.8 : 0.65; // Right shoulder

      // Camera sits at (sideOffset, baseHeight + pitch, -baseDist) relative to player
      const camOffset = new THREE.Vector3(sideOffset, baseHeight - this.pitch * 2.2, -baseDist);
      const rotatedOffset = camOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), pRot);
      const targetCamPos = pPos.clone().add(rotatedOffset);

      // Camera Shake
      if (this.shake > 0) {
        targetCamPos.x += (Math.random() - 0.5) * this.shake;
        targetCamPos.y += (Math.random() - 0.5) * this.shake;
        this.shake = Math.max(0, this.shake - delta * 2.0);
      }

      this.camera.position.lerp(targetCamPos, 0.2);

      // Look Target: In front of the character along +Z (shoulder height)
      const lookDist = player.isAiming ? 16 : 10;
      const lookOffset = new THREE.Vector3(sideOffset * 0.4, 1.4 + this.pitch * 3.5, lookDist);
      const rotatedLook = lookOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), pRot);
      const targetLook = pPos.clone().add(rotatedLook);

      this.camera.lookAt(targetLook);

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

      this.camera.position.lerp(targetCamPos, 0.1);
      const targetLook = pPos.clone().add(new THREE.Vector3(0, 1.3, 0));
      this.camera.lookAt(targetLook);

    } else if (this.viewMode === 'ads') {
      // 3. FIRST-PERSON / ADS DOWN-THE-SIGHTS MODE
      const headPos = pPos.clone().add(new THREE.Vector3(0, 1.55, 0.1));
      const fwd = new THREE.Vector3(0, this.pitch, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), pRot).normalize();
      const eyeCamPos = headPos.clone().add(fwd.clone().multiplyScalar(0.2));

      if (this.shake > 0) {
        eyeCamPos.x += (Math.random() - 0.5) * this.shake * 0.5;
        eyeCamPos.y += (Math.random() - 0.5) * this.shake * 0.5;
        this.shake = Math.max(0, this.shake - delta * 2.0);
      }

      this.camera.position.lerp(eyeCamPos, 0.35);
      const aimTarget = eyeCamPos.clone().add(fwd.clone().multiplyScalar(15));
      this.camera.lookAt(aimTarget);
    }
  }
}

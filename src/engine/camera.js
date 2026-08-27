import { rooms } from '../world/rooms.js';

export class CameraController {
  constructor() {
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.shake = 0;
    this.viewMode = 'ots'; // 'ots' (Over-The-Shoulder), 'fixed' (Classic RE Cinematic), 'ads' (First-Person Down-The-Sights)
    this.pitch = 0; // Vertical tilt
    this.yaw = 0;   // Free orbit yaw offset

    // Classic Resident Evil Fixed Cinematic Camera Nodes Database per Room
    this.fixedNodes = {
      foyer: [
        { id: 'foyer_entrance', pos: new THREE.Vector3(0, 5.8, 12.5), look: new THREE.Vector3(0, 1.4, 0), triggerZ: 4 },
        { id: 'foyer_center', pos: new THREE.Vector3(-8.5, 6.2, 0), look: new THREE.Vector3(0, 1.4, -2), triggerZ: -1 },
        { id: 'foyer_stairs', pos: new THREE.Vector3(7.5, 5.5, -9.5), look: new THREE.Vector3(0, 2.0, -8), triggerZ: -6 }
      ],
      library: [
        { id: 'lib_entry', pos: new THREE.Vector3(34, 5.8, 5.5), look: new THREE.Vector3(45, 1.4, 0), triggerZ: 2 },
        { id: 'lib_cauldron', pos: new THREE.Vector3(54, 6.2, -9.5), look: new THREE.Vector3(45, 1.4, -6), triggerZ: -4 },
        { id: 'lib_balcony', pos: new THREE.Vector3(36, 6.5, -5), look: new THREE.Vector3(45, 1.4, 2), triggerZ: -10 }
      ],
      garden: [
        { id: 'garden_entry', pos: new THREE.Vector3(-34, 6.0, 6.0), look: new THREE.Vector3(-45, 1.4, 0), triggerZ: 2 },
        { id: 'garden_fountain', pos: new THREE.Vector3(-45, 5.2, -9.5), look: new THREE.Vector3(-45, 1.4, 0), triggerZ: -3 },
        { id: 'garden_gazebo', pos: new THREE.Vector3(-55, 6.5, 4.0), look: new THREE.Vector3(-45, 1.4, -4), triggerZ: -8 }
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

  addOrbit(deltaYaw, deltaPitch) {
    this.yaw += deltaYaw;
    this.pitch = THREE.MathUtils.clamp(this.pitch + deltaPitch, -0.45, 0.55);
  }

  update(player, delta, currentRoom) {
    const pPos = player.group.position;

    if (this.viewMode === 'ots') {
      // 1. DYNAMIC 360° OVER-THE-SHOULDER (OTS)
      const baseDist = player.isAiming ? 2.6 : 4.4;
      const baseHeight = player.isAiming ? 1.7 : 2.1;
      const sideOffset = player.isAiming ? 0.95 : 0.7;

      const totalRotation = player.rotation + this.yaw;
      const camOffset = new THREE.Vector3(sideOffset, baseHeight + this.pitch * 2, baseDist);
      const rotatedOffset = camOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), totalRotation);
      const targetCamPos = pPos.clone().add(rotatedOffset);

      // Camera Shake
      if (this.shake > 0) {
        targetCamPos.x += (Math.random() - 0.5) * this.shake;
        targetCamPos.y += (Math.random() - 0.5) * this.shake;
        this.shake = Math.max(0, this.shake - delta * 2.0);
      }

      this.camera.position.lerp(targetCamPos, 0.18);

      const lookTarget = pPos.clone().add(new THREE.Vector3(0, 1.35 + this.pitch, 0));
      if (player.isAiming) {
        const aimLook = lookTarget.clone().add(new THREE.Vector3(0, 0, -6).applyAxisAngle(new THREE.Vector3(0, 1, 0), player.rotation));
        this.camera.lookAt(aimLook);
      } else {
        this.camera.lookAt(lookTarget);
      }
    } else if (this.viewMode === 'fixed') {
      // 2. CLASSIC RESIDENT EVIL FIXED CINEMATIC ANGLES
      const roomNodes = this.fixedNodes[currentRoom] || this.fixedNodes.foyer;
      let activeNode = roomNodes[0];

      let roomRelativeZ = pPos.z;
      if (currentRoom === 'library') roomRelativeZ = pPos.z - rooms.library.position.z;
      if (currentRoom === 'garden') roomRelativeZ = pPos.z - rooms.garden.position.z;

      for (let node of roomNodes) {
        if (roomRelativeZ <= node.triggerZ) {
          activeNode = node;
        }
      }

      const targetCamPos = activeNode.pos.clone();
      if (this.shake > 0) {
        targetCamPos.x += (Math.random() - 0.5) * this.shake;
        targetCamPos.y += (Math.random() - 0.5) * this.shake;
        this.shake = Math.max(0, this.shake - delta * 2.0);
      }

      this.camera.position.lerp(targetCamPos, 0.08);
      const targetLook = pPos.clone().add(new THREE.Vector3(0, 1.2, 0));
      this.camera.lookAt(targetLook);
    } else if (this.viewMode === 'ads') {
      // 3. FIRST-PERSON / ADS DOWN-THE-SIGHTS MODE
      const headPos = pPos.clone().add(new THREE.Vector3(0, 1.55, 0));
      const fwd = new THREE.Vector3(0, this.pitch, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), player.rotation).normalize();
      const eyeCamPos = headPos.clone().add(fwd.clone().multiplyScalar(0.35));

      if (this.shake > 0) {
        eyeCamPos.x += (Math.random() - 0.5) * this.shake * 0.5;
        eyeCamPos.y += (Math.random() - 0.5) * this.shake * 0.5;
        this.shake = Math.max(0, this.shake - delta * 2.0);
      }

      this.camera.position.lerp(eyeCamPos, 0.35);
      const aimTarget = eyeCamPos.clone().add(fwd.clone().multiplyScalar(10));
      this.camera.lookAt(aimTarget);
    }
  }
}

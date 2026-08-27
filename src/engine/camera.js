export class CameraController {
  constructor() {
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.shake = 0;

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    });
  }

  addShake(amount) {
    this.shake = Math.min(1.0, this.shake + amount);
  }

  update(player, delta) {
    const camOffset = player.isAiming ? new THREE.Vector3(1.0, 1.8, 2.5) : new THREE.Vector3(0.8, 2.2, 4.5);
    const rotatedOffset = camOffset.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), player.rotation);
    const targetCamPos = player.position.clone().add(rotatedOffset);

    if (this.shake > 0) {
      targetCamPos.x += (Math.random() - 0.5) * this.shake;
      targetCamPos.y += (Math.random() - 0.5) * this.shake;
      this.shake = Math.max(0, this.shake - delta * 2.0);
    }

    this.camera.position.lerp(targetCamPos, 0.15);

    const lookTarget = player.position.clone().add(new THREE.Vector3(0, 1.3, 0));
    if (player.isAiming) {
      const aimLook = lookTarget.clone().add(new THREE.Vector3(0, 0, -5).applyAxisAngle(new THREE.Vector3(0, 1, 0), player.rotation));
      this.camera.lookAt(aimLook);
    } else {
      this.camera.lookAt(lookTarget);
    }
  }
}

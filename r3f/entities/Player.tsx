import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { sim, forwardFromYaw, rightFromYaw } from "../sim";
import { Humanoid } from "./Rigs";
import { useGame } from "../store";

const desired = new THREE.Vector3();
const look = new THREE.Vector3();

function Gun() {
  return (
    <group position={[0.34, 0.72, 0.28]} rotation={[0.1, 0, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.08, 0.1, 0.34]} />
        <meshStandardMaterial color={0x2a3038} metalness={0.45} roughness={0.32} />
      </mesh>
      <mesh position={[0, 0.04, 0.18]}>
        <boxGeometry args={[0.06, 0.05, 0.12]} />
        <meshStandardMaterial color={0xc4a070} metalness={0.7} roughness={0.25} />
      </mesh>
    </group>
  );
}

export function Player() {
  const group = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const fps = useGame((s) => s.viewMode) === "fps";

  useFrame((_, dt) => {
    if (!group.current) return;
    group.current.position.set(sim.x, 0, sim.z);
    group.current.rotation.y = sim.yaw + Math.PI;
    group.current.visible = sim.viewMode !== "fps";

    const f = forwardFromYaw(sim.yaw);
    const r = rightFromYaw(sim.yaw);
    const shake = sim.trauma * sim.trauma;
    const sx = (Math.random() - 0.5) * shake * 0.28;
    const sy = (Math.random() - 0.5) * shake * 0.22;

    if (sim.viewMode === "fps") {
      camera.position.set(sim.x + sx, 1.44 + sy, sim.z);
      look.set(sim.x + f.x * 10, 1.44 - sim.pitch * 8, sim.z + f.z * 10);
      camera.lookAt(look);
    } else {
      desired.set(
        sim.x - f.x * 4.5 + r.x * 0.72 + sx,
        1.72 + sy + sim.pitch * 0.35,
        sim.z - f.z * 4.5 + r.z * 0.72,
      );
      look.set(sim.x + f.x * 1.6, 1.18, sim.z + f.z * 1.6);
      const k = 1 - Math.exp(-Math.min(dt, 0.1) * 10);
      camera.position.lerp(desired, k);
      camera.lookAt(look);
    }
  });

  return (
    <group ref={group}>
      <Humanoid hair={0x5ec8d8} ribbon={0xe8a0b0} vest={0x2a3038} accent={0xc4a070} />
      {!fps && <Gun />}
    </group>
  );
}

export function Viewmodel() {
  const ref = useRef<THREE.Group>(null);
  const { camera } = useThree();
  useFrame(() => {
    if (!ref.current) return;
    const on = sim.viewMode === "fps" && useGame.getState().ui === "playing";
    ref.current.visible = on;
    if (!on) return;
    ref.current.position.copy(camera.position);
    ref.current.quaternion.copy(camera.quaternion);
  });
  return (
    <group ref={ref} visible={false}>
      <mesh position={[0.28, -0.22, -0.52]} rotation={[0.12, 0.08, 0.04]}>
        <boxGeometry args={[0.09, 0.12, 0.36]} />
        <meshStandardMaterial color={0x2a3038} metalness={0.5} roughness={0.28} />
      </mesh>
      <mesh position={[0.28, -0.16, -0.34]}>
        <boxGeometry args={[0.06, 0.05, 0.1]} />
        <meshStandardMaterial color={0xc4a070} metalness={0.75} roughness={0.2} />
      </mesh>
    </group>
  );
}

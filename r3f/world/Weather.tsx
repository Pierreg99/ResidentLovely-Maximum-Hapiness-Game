import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MAPS } from "../data/maps";
import { useGame } from "../store";

const COUNT = 56;

export function Weather() {
  const mapId = useGame((s) => s.mapId);
  const kind = MAPS[mapId].weather;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const bits = useMemo(
    () =>
      Array.from({ length: COUNT }, () => ({
        x: (Math.random() - 0.5) * MAPS[mapId].w,
        y: Math.random() * MAPS[mapId].h,
        z: (Math.random() - 0.5) * MAPS[mapId].l,
        s: 0.5 + Math.random() * 1.1,
      })),
    [mapId],
  );

  useFrame((_, dt) => {
    if (kind === "none" || !mesh.current) return;
    bits.forEach((b, i) => {
      b.y -= b.s * dt * (kind === "snow" ? 0.7 : 1.2);
      if (kind === "spray") b.x += dt * 0.4;
      if (b.y < 0) {
        b.y = MAPS[mapId].h * 0.9;
        b.x = (Math.random() - 0.5) * MAPS[mapId].w;
        b.z = (Math.random() - 0.5) * MAPS[mapId].l;
      }
      dummy.position.set(b.x, b.y, b.z);
      dummy.scale.setScalar(kind === "snow" ? 0.07 : 0.05);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  if (kind === "none") return null;
  const color =
    kind === "snow"
      ? 0xf4ece8
      : kind === "embers"
        ? 0xffa060
        : kind === "sparks"
          ? 0xa8e0f0
          : kind === "mist"
            ? 0xc8c0d0
            : kind === "spores"
              ? 0x90c878
              : 0xe8a0b0;

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]} frustumCulled={false}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color={color} transparent opacity={0.72} />
    </instancedMesh>
  );
}

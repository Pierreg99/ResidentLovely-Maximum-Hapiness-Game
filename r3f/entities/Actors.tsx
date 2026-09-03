import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sim } from "../sim";
import { MAPS } from "../data/maps";
import { useGame } from "../store";
import { Humanoid, Plush, BossBehemoth } from "./Rigs";
import type { NpcId } from "../types";

const NPC_LOOK: Record<NpcId, { hair: number; vest: number; hat?: "toque" | "sailor" | "none"; coat?: number }> = {
  "madame-macaron": { hair: 0xf4ece8, vest: 0xe8a0b0, hat: "toque" },
  "captain-puff": { hair: 0x3a4a54, vest: 0x2a3840, hat: "sailor", coat: 0x3a5060 },
  "sister-prism": { hair: 0xa8d4e8, vest: 0xd8d0e8, hat: "none" },
  "miss-chamomile": { hair: 0x6a4030, vest: 0xc8b89a, hat: "none", coat: 0xb8c8b0 },
  "maestro-clef": { hair: 0xb8b0c8, vest: 0x2a2428, hat: "none", coat: 0x2a2428 },
  "keeper-lumen": { hair: 0xc4a070, vest: 0x4a6040, hat: "none", coat: 0x3a5038 },
};

function GrumpBody({ index }: { index: number }) {
  const ref = useRef<THREE.Group>(null);
  const bar = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const g = sim.grumps[index];
    if (!g || !ref.current) return;
    ref.current.position.set(g.x, Math.sin(g.bob * 2.4) * 0.06, g.z);
    ref.current.lookAt(sim.x, 0.6, sim.z);
    if (bar.current) {
      const f = g.uplifted ? 0 : g.gloom / g.max;
      bar.current.scale.x = Math.max(0.05, f);
      bar.current.visible = !g.uplifted;
    }
  });
  const g = sim.grumps[index];
  if (!g) return null;
  return (
    <group ref={ref}>
      <Plush kind={g.kind} gloomy={!g.uplifted} />
      <mesh ref={bar} position={[0, 1.35, 0]}>
        <boxGeometry args={[0.8, 0.06, 0.06]} />
        <meshBasicMaterial color={0xe8a0b0} />
      </mesh>
    </group>
  );
}

function NpcBody({
  id,
  x,
  z,
  yaw,
}: {
  id: NpcId;
  x: number;
  z: number;
  yaw: number;
}) {
  const look = NPC_LOOK[id];
  return (
    <group position={[x, 0, z]} rotation={[0, yaw + Math.PI, 0]}>
      <Humanoid hair={look.hair} vest={look.vest} hat={look.hat} coat={look.coat} />
    </group>
  );
}

function BossBody() {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    ref.current.visible = sim.boss.alive;
    if (!sim.boss.alive) return;
    ref.current.position.set(sim.boss.x, 0, sim.boss.z);
    ref.current.lookAt(sim.x, 1, sim.z);
  });
  return (
    <group ref={ref} visible={false}>
      <BossBehemoth hpFrac={1} />
    </group>
  );
}

function Projectiles() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame(() => {
    if (!mesh.current) return;
    sim.projectiles.forEach((p, i) => {
      if (!p.alive) {
        dummy.scale.setScalar(0);
      } else {
        dummy.position.set(p.x, p.y, p.z);
        dummy.scale.setScalar(0.12);
      }
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, sim.projectiles.length]} frustumCulled={false}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={0xe8a0b0} />
    </instancedMesh>
  );
}

function Particles() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame(() => {
    if (!mesh.current) return;
    sim.particles.forEach((p, i) => {
      if (!p.alive) dummy.scale.setScalar(0);
      else {
        dummy.position.set(p.x, p.y, p.z);
        dummy.scale.setScalar(p.size);
      }
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, sim.particles.length]} frustumCulled={false}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color={0xffd0c8} transparent opacity={0.85} />
    </instancedMesh>
  );
}

function Pickups() {
  const mapId = useGame((s) => s.mapId);
  const flags = useGame((s) => s.flags);
  const items = MAPS[mapId].interactables.filter((i) => i.kind === "pickup");
  return (
    <>
      {items.map((it) =>
        flags[`got_${it.id}`] ? null : (
          <group key={it.id} position={[it.x, 0.55, it.z]}>
            <mesh>
              <octahedronGeometry args={[0.22, 0]} />
              <meshStandardMaterial
                color={0xe8a0b0}
                emissive={0xe8a0b0}
                emissiveIntensity={0.55}
                roughness={0.2}
                metalness={0.4}
              />
            </mesh>
            <pointLight color={0xe8a0b0} intensity={0.6} distance={3} />
          </group>
        ),
      )}
    </>
  );
}

export function Actors() {
  const mapId = useGame((s) => s.mapId);
  const m = MAPS[mapId];
  return (
    <group>
      {sim.grumps.map((_, i) => (
        <GrumpBody key={`${mapId}-g-${i}`} index={i} />
      ))}
      {m.npcs.map((n) => (
        <NpcBody key={n.id} id={n.id} x={n.x} z={n.z} yaw={n.yaw} />
      ))}
      <BossBody />
      <Projectiles />
      <Particles />
      <Pickups />
    </group>
  );
}

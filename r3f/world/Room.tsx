import { useMemo } from "react";
import * as THREE from "three";
import { MAPS, BIOME_PALETTE } from "../data/maps";
import { useGame } from "../store";
import { doorWorld } from "../sim";
import type { Dir, MapId } from "../types";

function Wall({
  w,
  h,
  d,
  position,
  color,
  accent,
}: {
  w: number;
  h: number;
  d: number;
  position: [number, number, number];
  color: number;
  accent?: boolean;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial color={accent ? 0xc4a070 : color} roughness={0.55} metalness={accent ? 0.4 : 0.08} />
    </mesh>
  );
}

function DoorGapWalls({
  dir,
  halfW,
  halfL,
  h,
  wall,
  hasDoor,
}: {
  dir: "N" | "S" | "E" | "W";
  halfW: number;
  halfL: number;
  h: number;
  wall: number;
  hasDoor: boolean;
}) {
  const gap = 1.8;
  const thick = 0.45;
  if (dir === "N" || dir === "S") {
    const z = dir === "N" ? halfL : -halfL;
    const span = halfW;
    if (!hasDoor) {
      return <Wall w={span * 2} h={h} d={thick} position={[0, h / 2, z]} color={wall} />;
    }
    const side = span - gap;
    return (
      <>
        <Wall w={side} h={h} d={thick} position={[-(gap + side / 2), h / 2, z]} color={wall} />
        <Wall w={side} h={h} d={thick} position={[gap + side / 2, h / 2, z]} color={wall} />
        <Wall w={gap * 2} h={0.4} d={thick} position={[0, h - 0.2, z]} color={wall} accent />
      </>
    );
  }
  const x = dir === "E" ? halfW : -halfW;
  const span = halfL;
  if (!hasDoor) {
    return <Wall w={thick} h={h} d={span * 2} position={[x, h / 2, 0]} color={wall} />;
  }
  const side = span - gap;
  return (
    <>
      <Wall w={thick} h={h} d={side} position={[x, h / 2, -(gap + side / 2)]} color={wall} />
      <Wall w={thick} h={h} d={side} position={[x, h / 2, gap + side / 2]} color={wall} />
      <Wall w={thick} h={0.4} d={gap * 2} position={[x, h - 0.2, 0]} color={wall} accent />
    </>
  );
}

function CheckerFloor({ w, l, c1, c2 }: { w: number; l: number; c1: number; c2: number }) {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(w, l, 1, 1);
    g.rotateX(-Math.PI / 2);
    return g;
  }, [w, l]);
  return (
    <>
      <mesh geometry={geo} receiveShadow>
        <meshStandardMaterial color={c1} roughness={0.28} metalness={0.22} />
      </mesh>
      {Array.from({ length: 8 }).map((_, i) => {
        const x = ((i % 4) - 1.5) * (w / 4.2);
        const z = (Math.floor(i / 4) - 0.5) * (l / 3.2);
        return (
          <mesh key={i} position={[x, 0.01, z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[w / 9, l / 9]} />
            <meshStandardMaterial color={c2} roughness={0.22} metalness={0.28} />
          </mesh>
        );
      })}
    </>
  );
}

function Column({ x, z, h, color }: { x: number; z: number; h: number; color: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, h / 2, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.32, h, 10]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.2} />
      </mesh>
      <mesh position={[0, h, 0]}>
        <boxGeometry args={[0.7, 0.16, 0.7]} />
        <meshStandardMaterial color={0xc4a070} metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Piano() {
  return (
    <group position={[0, 0, -6]}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[2.4, 0.9, 1.4]} />
        <meshStandardMaterial color={0x1a1210} roughness={0.3} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0.95, 0.1]}>
        <boxGeometry args={[2.1, 0.08, 0.9]} />
        <meshStandardMaterial color={0xf4ece8} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.5, -0.5]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[2.2, 1.1, 0.08]} />
        <meshStandardMaterial color={0x1a1210} roughness={0.35} />
      </mesh>
    </group>
  );
}

function Cauldron() {
  return (
    <group position={[5, 0, 0]}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <sphereGeometry args={[0.7, 16, 12]} />
        <meshStandardMaterial color={0xc4a070} metalness={0.8} roughness={0.25} />
      </mesh>
      <mesh position={[0, 1.15, 0]}>
        <cylinderGeometry args={[0.45, 0.5, 0.2, 12]} />
        <meshStandardMaterial color={0xe8a0b0} emissive={0xe8a0b0} emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

function Fountain() {
  return (
    <group>
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <cylinderGeometry args={[2.2, 2.4, 0.4, 16]} />
        <meshStandardMaterial color={0xc4a070} metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[1.4, 1.4, 0.2, 16]} />
        <meshStandardMaterial color={0x7ec8c4} transparent opacity={0.7} roughness={0.1} />
      </mesh>
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 1.4, 8]} />
        <meshStandardMaterial color={0xe8d8c8} />
      </mesh>
    </group>
  );
}

function Astrolabe() {
  return (
    <group position={[0, 1.4, 0]}>
      <mesh>
        <torusGeometry args={[1.1, 0.06, 8, 32]} />
        <meshStandardMaterial color={0xc4a070} metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.85, 0.05, 8, 28]} />
        <meshStandardMaterial color={0xa8d0e8} metalness={0.7} roughness={0.2} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshStandardMaterial color={0x7ec8c4} emissive={0x7ec8c4} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function Bell() {
  return (
    <group position={[0, 4.2, 0]}>
      <mesh>
        <cylinderGeometry args={[0.9, 1.2, 1.6, 14]} />
        <meshStandardMaterial color={0xc4a070} metalness={0.85} roughness={0.25} />
      </mesh>
    </group>
  );
}

function Crystal({ x, z }: { x: number; z: number }) {
  return (
    <mesh position={[x, 1.2, z]} castShadow rotation={[0, 0, 0.2]}>
      <octahedronGeometry args={[0.55, 0]} />
      <meshStandardMaterial color={0xa8e0f0} emissive={0x5080a0} emissiveIntensity={0.35} roughness={0.15} metalness={0.4} transparent opacity={0.9} />
    </mesh>
  );
}

function Mirror({ x, z, yaw }: { x: number; z: number; yaw: number }) {
  return (
    <group position={[x, 1.4, z]} rotation={[0, yaw, 0]}>
      <mesh>
        <boxGeometry args={[1.6, 2.4, 0.12]} />
        <meshStandardMaterial color={0xc4a070} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.08]}>
        <planeGeometry args={[1.3, 2.1]} />
        <meshStandardMaterial color={0xc8dce8} metalness={0.9} roughness={0.05} />
      </mesh>
    </group>
  );
}

function Oven() {
  return (
    <group position={[6, 0, 4]}>
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[2.2, 1.6, 1.4]} />
        <meshStandardMaterial color={0x8a5040} roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.7, 0.72]}>
        <circleGeometry args={[0.35, 16]} />
        <meshStandardMaterial color={0xffa060} emissive={0xff7030} emissiveIntensity={0.7} />
      </mesh>
    </group>
  );
}

function Dynamo() {
  return (
    <group>
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[1.1, 1.2, 1.6, 14]} />
        <meshStandardMaterial color={0x3a4a4c} metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.45, 12, 12]} />
        <meshStandardMaterial color={0x50b8b0} emissive={0x208080} emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

function Shrine() {
  return (
    <group position={[0, 0, -4]}>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.6, 0.8, 1.6]} />
        <meshStandardMaterial color={0x4a3c28} roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 1.2, 8]} />
        <meshStandardMaterial color={0x68a060} />
      </mesh>
    </group>
  );
}

function Tree({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.24, 1.6, 8]} />
        <meshStandardMaterial color={0x4a3420} />
      </mesh>
      <mesh position={[0, 2.1, 0]} castShadow>
        <sphereGeometry args={[1.1, 10, 8]} />
        <meshStandardMaterial color={0x3a7048} roughness={0.8} />
      </mesh>
    </group>
  );
}

function Boat() {
  return (
    <mesh position={[8, 0.2, 0]} rotation={[0, 0.4, 0]} castShadow>
      <boxGeometry args={[4.2, 0.5, 1.4]} />
      <meshStandardMaterial color={0x5a4030} roughness={0.6} />
    </mesh>
  );
}

function LanternMesh({ x, z, lit }: { x: number; z: number; lit: boolean }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 1.2, 8]} />
        <meshStandardMaterial color={0xc4a070} metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.4, 0]}>
        <sphereGeometry args={[0.22, 10, 10]} />
        <meshStandardMaterial
          color={lit ? 0xe8a0b0 : 0x4a3038}
          emissive={lit ? 0xe8a0b0 : 0x000000}
          emissiveIntensity={lit ? 0.8 : 0}
        />
      </mesh>
    </group>
  );
}

function Centerpiece({ id }: { id: MapId }) {
  if (id === "foyer") return <Piano />;
  if (id === "library") return <Cauldron />;
  if (id === "garden") return <Fountain />;
  if (id === "observatory") return <Astrolabe />;
  if (id === "clock_belfry") return <Bell />;
  if (id === "bakery") return <Oven />;
  if (id === "sugar_lab") return <Dynamo />;
  if (id === "sacred_forest") return <Shrine />;
  if (id === "harbor_docks") return <Boat />;
  if (id === "crystal_grotto")
    return (
      <>
        <Crystal x={6} z={4} />
        <Crystal x={-6} z={4} />
        <Crystal x={0} z={-6} />
      </>
    );
  if (id === "mirror_maze")
    return (
      <>
        <Mirror x={4} z={5} yaw={0.3} />
        <Mirror x={-4} z={-5} yaw={-0.4} />
        <Mirror x={5} z={-2} yaw={1.1} />
      </>
    );
  if (id === "tea_salon")
    return (
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.9, 1, 0.9, 12]} />
        <meshStandardMaterial color={0xe8d8c8} roughness={0.4} />
      </mesh>
    );
  if (id === "music_parlor")
    return (
      <mesh position={[0, 0.55, -4]} castShadow>
        <boxGeometry args={[2.2, 1.1, 0.9]} />
        <meshStandardMaterial color={0x3a2a20} roughness={0.4} />
      </mesh>
    );
  if (id === "moonlit_meadow")
    return (
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 3.2, 8]} />
        <meshStandardMaterial color={0xc4a070} metalness={0.6} />
      </mesh>
    );
  if (id === "village")
    return (
      <>
        <mesh position={[-6, 1.2, -4]} castShadow>
          <boxGeometry args={[3.2, 2.4, 2.6]} />
          <meshStandardMaterial color={0x8a6a50} roughness={0.7} />
        </mesh>
        <mesh position={[6, 1.0, 3]} castShadow>
          <boxGeometry args={[2.6, 2, 2.4]} />
          <meshStandardMaterial color={0xa08060} roughness={0.7} />
        </mesh>
      </>
    );
  if (id === "crypt")
    return (
      <mesh position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[4.5, 24]} />
        <meshStandardMaterial color={0x2a2030} roughness={0.6} />
      </mesh>
    );
  if (id === "lighthouse")
    return (
      <group>
        <mesh position={[0, 3.2, 0]} castShadow>
          <cylinderGeometry args={[1.4, 1.7, 6.4, 14]} />
          <meshStandardMaterial color={0xe8d8c8} roughness={0.55} />
        </mesh>
        <mesh position={[0, 6.6, 0]}>
          <sphereGeometry args={[0.7, 12, 12]} />
          <meshStandardMaterial color={0xffe4a8} emissive={0xffc878} emissiveIntensity={0.8} />
        </mesh>
      </group>
    );
  if (id === "ice_chamber")
    return (
      <>
        <mesh position={[0, 1.1, 0]} rotation={[0.2, 0.4, 0.1]} castShadow>
          <octahedronGeometry args={[1.4, 0]} />
          <meshStandardMaterial color={0xa8e0f0} transparent opacity={0.7} roughness={0.08} metalness={0.3} />
        </mesh>
        <mesh position={[3, 0.8, 3]} rotation={[0, 0.2, 0.3]}>
          <octahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial color={0xd0ecf8} transparent opacity={0.8} roughness={0.1} />
        </mesh>
      </>
    );
  if (id === "conservatory")
    return (
      <group>
        <mesh position={[0, 1.6, 0]}>
          <sphereGeometry args={[1.1, 12, 10]} />
          <meshStandardMaterial color={0xe8a0b0} roughness={0.35} metalness={0.15} />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.16, 0.2, 1.1, 8]} />
          <meshStandardMaterial color={0x4a3420} />
        </mesh>
      </group>
    );
  if (id === "terrace")
    return (
      <group position={[0, 0, -4]}>
        <mesh position={[-3, 1.4, 0]}>
          <boxGeometry args={[0.12, 2.8, 0.12]} />
          <meshStandardMaterial color={0xc4a070} metalness={0.6} />
        </mesh>
        <mesh position={[3, 1.4, 0]}>
          <boxGeometry args={[0.12, 2.8, 0.12]} />
          <meshStandardMaterial color={0xc4a070} metalness={0.6} />
        </mesh>
        <mesh position={[0, 2.6, 0]}>
          <boxGeometry args={[6.4, 0.1, 0.1]} />
          <meshStandardMaterial color={0xc4a070} metalness={0.7} />
        </mesh>
      </group>
    );
  return null;
}

function ExtraProps({ id }: { id: MapId }) {
  if (id === "library") {
    return (
      <>
        {[-6, -2, 2].map((z) => (
          <mesh key={z} position={[-8, 1.6, z]} castShadow>
            <boxGeometry args={[1.2, 3.2, 3.2]} />
            <meshStandardMaterial color={0x3a2a22} roughness={0.7} />
          </mesh>
        ))}
      </>
    );
  }
  if (id === "bakery") {
    return (
      <>
        {[-3, 0, 3].map((x) => (
          <mesh key={x} position={[x, 0.55, -6]} castShadow>
            <cylinderGeometry args={[0.35, 0.4, 0.5, 10]} />
            <meshStandardMaterial color={0xe8a0b0} roughness={0.5} />
          </mesh>
        ))}
      </>
    );
  }
  if (id === "foyer") {
    return (
      <>
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[3.2, 24]} />
          <meshStandardMaterial color={0x3a2c24} roughness={0.35} metalness={0.2} />
        </mesh>
        <mesh position={[7, 2.2, -7]}>
          <boxGeometry args={[1.8, 2.2, 0.12]} />
          <meshStandardMaterial color={0x2a2018} />
        </mesh>
      </>
    );
  }
  return null;
}

export function Room() {
  const mapId = useGame((s) => s.mapId);
  const flags = useGame((s) => s.flags);
  const m = MAPS[mapId];
  const pal = BIOME_PALETTE[m.biome];
  const dirs = new Set(m.doors.map((d) => d.dir));
  const hw = m.w / 2;
  const hl = m.l / 2;
  const outdoor = m.biome === "outdoor" || m.biome === "forest" || m.biome === "maritime";

  return (
    <group>
      <CheckerFloor w={m.w} l={m.l} c1={pal.floor} c2={pal.floor2} />
      {!outdoor && (
        <mesh position={[0, m.h, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[m.w, m.l]} />
          <meshStandardMaterial color={pal.wall} roughness={0.8} side={THREE.DoubleSide} />
        </mesh>
      )}
      {(["N", "S", "E", "W"] as const).map((dir) => (
        <DoorGapWalls
          key={dir}
          dir={dir}
          halfW={hw}
          halfL={hl}
          h={outdoor ? 1.4 : m.h}
          wall={pal.wall}
          hasDoor={dirs.has(dir)}
        />
      ))}
      <Column x={hw - 1.2} z={hl - 1.2} h={outdoor ? 2.2 : m.h * 0.85} color={pal.accent} />
      <Column x={-hw + 1.2} z={hl - 1.2} h={outdoor ? 2.2 : m.h * 0.85} color={pal.accent} />
      <Column x={hw - 1.2} z={-hl + 1.2} h={outdoor ? 2.2 : m.h * 0.85} color={pal.accent} />
      <Column x={-hw + 1.2} z={-hl + 1.2} h={outdoor ? 2.2 : m.h * 0.85} color={pal.accent} />
      <Centerpiece id={mapId} />
      <ExtraProps id={mapId} />
      {m.interactables
        .filter((i) => i.kind === "lantern")
        .map((i) => (
          <LanternMesh key={i.id} x={i.x} z={i.z} lit={Boolean(flags[i.id])} />
        ))}
      {(mapId === "sacred_forest" || mapId === "moonlit_meadow" || mapId === "garden") && (
        <>
          <Tree x={8} z={8} />
          <Tree x={-9} z={7} />
          <Tree x={9} z={-8} />
          <Tree x={-8} z={-7} />
        </>
      )}
      {m.doors.map((d) => {
        const p = doorWorld(mapId, d.dir as Dir);
        return (
          <mesh key={d.dir} position={[p.x, 1.6, p.z]}>
            <torusGeometry args={[0.45, 0.04, 8, 16]} />
            <meshStandardMaterial color={0x7ec8c4} emissive={0x3a8080} emissiveIntensity={0.5} />
          </mesh>
        );
      })}
    </group>
  );
}

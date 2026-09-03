import { useMemo } from "react";
import * as THREE from "three";

const skin = new THREE.MeshStandardMaterial({ color: 0xffe0c8, roughness: 0.45 });
const eyeWhite = new THREE.MeshStandardMaterial({ color: 0xf7f4ef, roughness: 0.3 });
const eyeDark = new THREE.MeshStandardMaterial({ color: 0x1a1214, roughness: 0.2 });
const highlight = new THREE.MeshBasicMaterial({ color: 0xffffff });
const blush = new THREE.MeshStandardMaterial({ color: 0xe8a0b0, roughness: 0.6, transparent: true, opacity: 0.45 });

export function Humanoid({
  hair = 0x5ec8d8,
  ribbon = 0xe8a0b0,
  vest = 0x2a3038,
  accent = 0xc4a070,
  hat,
  coat,
}: {
  hair?: number;
  ribbon?: number;
  vest?: number;
  accent?: number;
  hat?: "toque" | "sailor" | "none";
  coat?: number;
}) {
  const hairMat = useMemo(() => new THREE.MeshStandardMaterial({ color: hair, roughness: 0.38 }), [hair]);
  const vestMat = useMemo(() => new THREE.MeshStandardMaterial({ color: vest, roughness: 0.42, metalness: 0.12 }), [vest]);
  const gold = useMemo(() => new THREE.MeshStandardMaterial({ color: accent, metalness: 0.82, roughness: 0.22 }), [accent]);
  const rib = useMemo(() => new THREE.MeshStandardMaterial({ color: ribbon, roughness: 0.35 }), [ribbon]);
  const boot = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x1a1816, roughness: 0.4, metalness: 0.25 }), []);
  const coatMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: coat ?? vest, roughness: 0.5 }),
    [coat, vest],
  );

  return (
    <group>
      <mesh position={[0, 0.72, 0]} castShadow material={coat ? coatMat : vestMat}>
        <cylinderGeometry args={[0.28, 0.34, 0.85, 12]} />
      </mesh>
      <mesh position={[0, 0.38, 0.18]} material={gold}>
        <boxGeometry args={[0.16, 0.08, 0.08]} />
      </mesh>
      <mesh position={[-0.3, 1.08, 0]} material={gold}>
        <boxGeometry args={[0.16, 0.06, 0.18]} />
      </mesh>
      <mesh position={[0.3, 1.08, 0]} material={gold}>
        <boxGeometry args={[0.16, 0.06, 0.18]} />
      </mesh>
      <mesh position={[-0.16, 0.22, 0]} castShadow material={boot}>
        <cylinderGeometry args={[0.1, 0.12, 0.44, 8]} />
      </mesh>
      <mesh position={[0.16, 0.22, 0]} castShadow material={boot}>
        <cylinderGeometry args={[0.1, 0.12, 0.44, 8]} />
      </mesh>
      <mesh position={[-0.38, 0.75, 0.02]} rotation={[0, 0, 0.3]} material={vestMat}>
        <cylinderGeometry args={[0.07, 0.08, 0.55, 8]} />
      </mesh>
      <mesh position={[0.38, 0.75, 0.02]} rotation={[0, 0, -0.3]} material={vestMat}>
        <cylinderGeometry args={[0.07, 0.08, 0.55, 8]} />
      </mesh>
      <group position={[0, 1.28, 0]}>
        <mesh castShadow material={skin}>
          <sphereGeometry args={[0.32, 18, 16]} />
        </mesh>
        <mesh position={[-0.11, 0.04, 0.26]} material={eyeWhite}>
          <sphereGeometry args={[0.09, 10, 10]} />
        </mesh>
        <mesh position={[0.11, 0.04, 0.26]} material={eyeWhite}>
          <sphereGeometry args={[0.09, 10, 10]} />
        </mesh>
        <mesh position={[-0.11, 0.04, 0.33]} material={eyeDark}>
          <sphereGeometry args={[0.045, 8, 8]} />
        </mesh>
        <mesh position={[0.11, 0.04, 0.33]} material={eyeDark}>
          <sphereGeometry args={[0.045, 8, 8]} />
        </mesh>
        <mesh position={[-0.08, 0.07, 0.36]} material={highlight}>
          <sphereGeometry args={[0.018, 6, 6]} />
        </mesh>
        <mesh position={[0.14, 0.07, 0.36]} material={highlight}>
          <sphereGeometry args={[0.018, 6, 6]} />
        </mesh>
        <mesh position={[-0.16, -0.06, 0.26]} material={blush}>
          <sphereGeometry args={[0.05, 8, 8]} />
        </mesh>
        <mesh position={[0.16, -0.06, 0.26]} material={blush}>
          <sphereGeometry args={[0.05, 8, 8]} />
        </mesh>
        <mesh position={[0, 0.18, 0]} material={hairMat}>
          <sphereGeometry args={[0.34, 14, 12]} />
        </mesh>
        <mesh position={[-0.28, 0.02, -0.04]} rotation={[0.2, 0, 0.45]} material={hairMat}>
          <cylinderGeometry args={[0.08, 0.05, 0.55, 8]} />
        </mesh>
        <mesh position={[0.28, 0.02, -0.04]} rotation={[0.2, 0, -0.45]} material={hairMat}>
          <cylinderGeometry args={[0.08, 0.05, 0.55, 8]} />
        </mesh>
        <mesh position={[-0.22, 0.16, 0.12]} material={rib}>
          <boxGeometry args={[0.1, 0.06, 0.08]} />
        </mesh>
        <mesh position={[0.22, 0.16, 0.12]} material={rib}>
          <boxGeometry args={[0.1, 0.06, 0.08]} />
        </mesh>
        {hat === "toque" && (
          <mesh position={[0, 0.38, 0]} material={new THREE.MeshStandardMaterial({ color: 0xf4ece8, roughness: 0.7 })}>
            <cylinderGeometry args={[0.22, 0.26, 0.28, 12]} />
          </mesh>
        )}
        {hat === "sailor" && (
          <mesh position={[0, 0.34, 0]} material={new THREE.MeshStandardMaterial({ color: 0xf4ece8, roughness: 0.5 })}>
            <cylinderGeometry args={[0.3, 0.22, 0.1, 14]} />
          </mesh>
        )}
      </group>
    </group>
  );
}

export function Plush({
  kind,
  gloomy,
}: {
  kind: string;
  gloomy: boolean;
}) {
  const fur =
    kind === "bunny"
      ? 0xe8a0b0
      : kind === "kitten"
        ? 0xc4a070
        : kind === "penguin"
          ? 0x2a3038
          : kind === "ghost"
            ? 0xd8d0e8
            : 0x6a90c4;
  const furMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: fur, roughness: gloomy ? 0.85 : 0.55 }),
    [fur, gloomy],
  );
  return (
    <group>
      <mesh position={[0, 0.55, 0]} castShadow material={furMat}>
        <sphereGeometry args={[0.48, 16, 14]} />
      </mesh>
      {kind === "bunny" && (
        <>
          <mesh position={[-0.16, 1.15, 0]} rotation={[0.1, 0, 0.2]} material={furMat}>
            <capsuleGeometry args={[0.08, 0.42, 4, 8]} />
          </mesh>
          <mesh position={[0.16, 1.15, 0]} rotation={[0.1, 0, -0.2]} material={furMat}>
            <capsuleGeometry args={[0.08, 0.42, 4, 8]} />
          </mesh>
        </>
      )}
      {kind === "bear" && (
        <>
          <mesh position={[-0.32, 0.95, 0]} material={furMat}>
            <sphereGeometry args={[0.16, 10, 10]} />
          </mesh>
          <mesh position={[0.32, 0.95, 0]} material={furMat}>
            <sphereGeometry args={[0.16, 10, 10]} />
          </mesh>
        </>
      )}
      {kind === "penguin" && (
        <mesh position={[0, 0.5, 0.22]} material={new THREE.MeshStandardMaterial({ color: 0xf4ece8, roughness: 0.7 })}>
          <sphereGeometry args={[0.32, 12, 10]} />
        </mesh>
      )}
      <mesh position={[-0.14, 0.68, 0.38]} material={eyeDark}>
        <sphereGeometry args={[0.07, 8, 8]} />
      </mesh>
      <mesh position={[0.14, 0.68, 0.38]} material={eyeDark}>
        <sphereGeometry args={[0.07, 8, 8]} />
      </mesh>
      <mesh position={[-0.12, 0.72, 0.43]} material={highlight}>
        <sphereGeometry args={[0.02, 6, 6]} />
      </mesh>
      <mesh position={[0.16, 0.72, 0.43]} material={highlight}>
        <sphereGeometry args={[0.02, 6, 6]} />
      </mesh>
      <mesh position={[0, 0.42, 0.44]} material={new THREE.MeshStandardMaterial({ color: 0xc45c6a, roughness: 0.4 })}>
        <boxGeometry args={[0.18, 0.08, 0.06]} />
      </mesh>
    </group>
  );
}

export function BossBehemoth({ hpFrac }: { hpFrac: number }) {
  const c = hpFrac < 0.35 ? 0x4a3860 : 0x3a6088;
  return (
    <group scale={2.2}>
      <Plush kind="bear" gloomy={hpFrac > 0.05} />
      <mesh position={[0, 1.4, 0]} material={new THREE.MeshStandardMaterial({ color: c, roughness: 0.5 })}>
        <sphereGeometry args={[0.2, 10, 10]} />
      </mesh>
    </group>
  );
}

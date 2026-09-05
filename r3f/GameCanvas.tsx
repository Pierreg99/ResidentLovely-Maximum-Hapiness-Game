import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { MAPS, BIOME_PALETTE } from "./data/maps";
import { useGame } from "./store";
import { sim } from "./sim";
import { tick } from "./tick";
import { Room } from "./world/Room";
import { Weather } from "./world/Weather";
import { Player, Viewmodel } from "./entities/Player";
import { Actors } from "./entities/Actors";

let lastTick = -1;

function Loop() {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (t === lastTick) return;
    const dt = lastTick < 0 ? 0.016 : Math.min(t - lastTick, 0.1);
    lastTick = t;
    tick(dt);
  });
  return null;
}

function Atmosphere() {
  const mapId = useGame((s) => s.mapId);
  const m = MAPS[mapId];
  const pal = BIOME_PALETTE[m.biome];
  const outdoor = m.biome === "outdoor" || m.biome === "forest" || m.biome === "maritime";
  const { scene } = useThree();
  useEffect(() => {
    scene.fog = new THREE.Fog(pal.fog, outdoor ? 14 : 7, outdoor ? 46 : 30);
    scene.background = new THREE.Color(pal.fog);
  }, [scene, pal.fog, outdoor]);
  return (
    <>
      <ambientLight intensity={0.32} color={pal.ambient} />
      <hemisphereLight args={[pal.light, pal.floor, 0.55]} />
      <directionalLight
        castShadow
        position={[9, 15, 7]}
        intensity={1.15}
        color={pal.light}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={48}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
      />
      {outdoor && <directionalLight position={[-6, 8, -4]} intensity={0.25} color={0xa8c8e0} />}
    </>
  );
}

export default function GameCanvas() {
  const wrap = useRef<HTMLDivElement>(null);
  const ui = useGame((s) => s.ui);
  const mapId = useGame((s) => s.mapId);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      if (useGame.getState().ui !== "playing") return;
      if (document.pointerLockElement) {
        sim.lookX -= e.movementX * 0.0023;
        sim.lookY -= e.movementY * 0.0017;
      }
    };
    const onDown = (e: PointerEvent) => {
      if (useGame.getState().ui !== "playing") return;
      if (e.pointerType === "mouse" && e.button === 0) {
        el.requestPointerLock?.();
      }
    };
    window.addEventListener("mousemove", onMove);
    el.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("pointerdown", onDown);
    };
  }, []);

  useEffect(() => {
    if (ui !== "playing" && document.pointerLockElement) {
      document.exitPointerLock?.();
    }
  }, [ui]);

  return (
    <div ref={wrap} className="absolute inset-0 z-0 touch-none">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ fov: 62, near: 0.12, far: 80, position: [0, 1.7, 8] }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
        }}
      >
        <Loop />
        <Atmosphere />
        <Room key={mapId} />
        <Weather />
        <Player />
        <Viewmodel />
        <Actors key={`a-${mapId}`} />
      </Canvas>
    </div>
  );
}

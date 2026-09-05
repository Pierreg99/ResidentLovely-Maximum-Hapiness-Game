import { lazy, Suspense, useEffect } from "react";
import { bindInput, installControlsTest } from "./input";
import { bindAutosave, loadSave } from "./save";
import { useGame } from "./store";
import { HUD } from "./ui/HUD";
import type { MapId, QuestDef, Slot, WeaponId } from "./types";

const GameCanvas = lazy(() => import("./GameCanvas"));

function Splash() {
  return (
    <div className="flex h-[100dvh] items-end bg-bg p-8">
      <div>
        <p className="text-xs tracking-[0.2em] text-teal uppercase">Resident Lovely</p>
        <h1 className="font-display mt-2 text-3xl text-fg">Opening the chateau</h1>
        <p className="mt-2 text-sm text-muted">Maximum Happiness loading.</p>
      </div>
    </div>
  );
}

export default function GameApp() {
  useEffect(() => {
    const blob = loadSave();
    if (blob) {
      useGame.getState().hydrate({
        mapId: blob.mapId as MapId,
        joy: blob.joy,
        inventory: blob.inventory as Slot[],
        quests: blob.quests as QuestDef[],
        flags: blob.flags as Record<string, boolean | number>,
        visited: blob.visited as MapId[],
        unlocked: blob.unlocked as MapId[],
        companions: blob.companions as string[],
        weapon: blob.weapon as WeaponId,
        unlockedWeapons: blob.unlockedWeapons as WeaponId[],
      });
    }
    installControlsTest();
    const unbind = bindInput();
    bindAutosave(() => useGame.getState() as unknown as Record<string, unknown>);
    return unbind;
  }, []);

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-bg text-fg">
      <Suspense fallback={<Splash />}>
        <GameCanvas />
      </Suspense>
      <HUD />
    </main>
  );
}

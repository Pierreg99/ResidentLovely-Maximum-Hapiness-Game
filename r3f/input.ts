import { sim } from "./sim";
import { audio } from "./audio";
import { useGame } from "./store";

export function bindInput() {
  const onDown = (e: KeyboardEvent) => {
    audio.unlock();
    sim.keys.add(e.code);
    const g = useGame.getState();
    if (g.ui === "title") return;
    if (e.code === "Escape") {
      g.setUi(g.ui === "playing" ? "paused" : "playing");
      return;
    }
    if (g.ui === "piano") return;
    if (g.ui !== "playing" && (e.code === "KeyI" || e.code === "KeyQ" || e.code === "KeyM" || e.code === "Tab")) {
      g.setUi("playing");
      e.preventDefault();
      return;
    }
    if (g.ui !== "playing") return;
    if (e.code === "KeyI" || e.code === "Tab") {
      e.preventDefault();
      g.toggle("inventory");
    }
    if (e.code === "KeyQ") g.toggle("quests");
    if (e.code === "KeyM") g.toggle("map");
    if (e.code === "KeyE") g.interact();
    if (e.code === "KeyV") g.cycleView();
    if (e.code === "KeyZ") sim.yaw += Math.PI;
    if (e.code === "Digit1") g.setWeapon("pistol");
    if (e.code === "Digit2") g.setWeapon("shotgun");
    if (e.code === "Digit3") g.setWeapon("mortar");
    if (e.code === "Digit4") g.setWeapon("beam");
    if (e.code === "Digit5") g.setWeapon("wand");
    if (e.code === "KeyG") g.cycleWeapon();
  };
  const onUp = (e: KeyboardEvent) => {
    sim.keys.delete(e.code);
  };
  window.addEventListener("keydown", onDown);
  window.addEventListener("keyup", onUp);
  window.addEventListener("blur", () => sim.keys.clear());
  return () => {
    window.removeEventListener("keydown", onDown);
    window.removeEventListener("keyup", onUp);
  };
}

export function installControlsTest() {
  window.__controlsTest = {
    getYaw: () => sim.yaw,
    getSpeed: () => sim.speed,
    setKeys: (codes: string[]) => {
      sim.injected = new Set(codes);
    },
    setSteer: (v: number) => {
      sim.steer = v;
    },
  };
}

declare global {
  interface Window {
    __controlsTest?: {
      getYaw: () => number;
      getSpeed: () => number;
      setKeys?: (codes: string[]) => void;
      setSteer?: (v: number) => void;
    };
  }
}

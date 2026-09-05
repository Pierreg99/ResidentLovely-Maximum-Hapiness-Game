const KEY = "resident-lovely-save-v1";
const VERSION = 1;

export type SaveBlob = {
  version: number;
  mapId: string;
  joy: number;
  inventory: unknown;
  quests: unknown;
  flags: unknown;
  visited: unknown;
  unlocked: unknown;
  companions: unknown;
  weapon: string;
  unlockedWeapons: unknown;
  x?: number;
  z?: number;
  yaw?: number;
};

export function persistNow(state: Record<string, unknown>) {
  try {
    const blob: SaveBlob = {
      version: VERSION,
      mapId: String(state.mapId),
      joy: Number(state.joy),
      inventory: state.inventory,
      quests: state.quests,
      flags: state.flags,
      visited: state.visited,
      unlocked: state.unlocked,
      companions: state.companions,
      weapon: String(state.weapon),
      unlockedWeapons: state.unlockedWeapons,
    };
    localStorage.setItem(KEY, JSON.stringify(blob));
    localStorage.setItem(KEY + ":bak", JSON.stringify(blob));
  } catch {
    /* private mode */
  }
}

export function loadSave(): SaveBlob | null {
  try {
    const raw = localStorage.getItem(KEY) ?? localStorage.getItem(KEY + ":bak");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SaveBlob;
    if (!parsed || typeof parsed !== "object") return null;
    if (parsed.version !== VERSION) return parsed;
    return parsed;
  } catch {
    return null;
  }
}

export function clearSave() {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem(KEY + ":bak");
  } catch {
    /* ignore */
  }
}

export function bindAutosave(getState: () => Record<string, unknown>) {
  const flush = () => persistNow(getState());
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush();
  });
  window.addEventListener("pagehide", flush);
}

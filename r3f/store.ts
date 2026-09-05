import { create } from "zustand";
import { QUEST_DEFS } from "./data/quests";
import { ITEMS, matchRecipe } from "./data/items";
import { MAPS } from "./data/maps";
import { COMPANION_NAMES, EXAMINE, NPC_META } from "./data/immersives";
import { sim, spawnMapEntities, spawnFromDoor, doorWorld } from "./sim";
import { persistNow } from "./save";
import { audio } from "./audio";
import type {
  ExaminePayload,
  ItemId,
  MapId,
  QuestDef,
  Slot,
  UiMode,
  ViewMode,
  WeaponId,
} from "./types";

export type Toast = { id: number; text: string };

type GameState = {
  ui: UiMode;
  viewMode: ViewMode;
  mapId: MapId;
  visited: MapId[];
  unlocked: MapId[];
  joy: number;
  inventory: Slot[];
  selected: number | null;
  combine: number | null;
  quests: QuestDef[];
  flags: Record<string, boolean | number>;
  companions: string[];
  weapon: WeaponId;
  unlockedWeapons: WeaponId[];
  examine: ExaminePayload | null;
  toast: Toast | null;
  objective: string;
  piano: string[];
  reducedMotion: boolean;
  start: () => void;
  setUi: (ui: UiMode) => void;
  toggle: (ui: UiMode) => void;
  cycleView: () => void;
  setWeapon: (w: WeaponId) => void;
  cycleWeapon: () => void;
  addItem: (id: ItemId, qty?: number) => boolean;
  consumeSelected: () => void;
  tryCombine: (slot: number) => void;
  completeTask: (questId: string, taskId: string, inc?: number) => void;
  setFlag: (k: string, v?: boolean | number) => void;
  changeMap: (to: MapId, fromDir?: "N" | "S" | "E" | "W" | "U" | "D") => void;
  interact: () => void;
  pianoKey: (note: string) => void;
  showExamine: (p: ExaminePayload) => void;
  pushToast: (text: string) => void;
  addJoy: (n: number) => void;
  recruit: (kind: string) => void;
  hydrate: (partial: Partial<GameState>) => void;
};

let toastSeq = 1;

function cloneQuests(): QuestDef[] {
  return QUEST_DEFS.map((q, i) => ({
    ...q,
    tasks: q.tasks.map((t) => ({ ...t })),
    // first quest active conceptually; status inferred from tasks
    name: q.name,
  }));
}

function objectiveFrom(quests: QuestDef[]) {
  const q = quests.find((x) => x.tasks.some((t) => !t.done));
  if (!q) return "All quests complete. Maximum Happiness.";
  const t = q.tasks.find((x) => !x.done);
  return t ? t.text : q.name;
}

export const useGame = create<GameState>((set, get) => ({
  ui: "title",
  viewMode: "ots",
  mapId: "foyer",
  visited: ["foyer"],
  unlocked: ["foyer", "bakery", "observatory", "sugar_lab"],
  joy: 100,
  inventory: [
    { id: "herb_green", qty: 2 },
    { id: "powder_red", qty: 1 },
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  selected: null,
  combine: null,
  quests: cloneQuests(),
  flags: {},
  companions: [],
  weapon: "pistol",
  unlockedWeapons: ["pistol", "shotgun", "mortar", "beam"],
  examine: null,
  toast: null,
  objective: objectiveFrom(cloneQuests()),
  piano: [],
  reducedMotion: false,

  start() {
    audio.unlock();
    sim.keys.clear();
    sim.injected.clear();
    sim.running = true;
    set({ ui: "playing" });
  },

  setUi(ui) {
    set({ ui });
    if (ui === "paused" || ui === "title") persistNow(get());
  },

  toggle(ui) {
    audio.pop();
    set((s) => ({ ui: s.ui === ui ? "playing" : ui }));
  },

  cycleView() {
    const next: ViewMode = get().viewMode === "ots" ? "fps" : "ots";
    sim.viewMode = next;
    set({ viewMode: next });
    get().pushToast(next === "ots" ? "View: over-shoulder" : "View: immersive first-person");
  },

  setWeapon(w) {
    if (!get().unlockedWeapons.includes(w)) {
      get().pushToast("Weapon not forged yet");
      return;
    }
    sim.weapon = w;
    set({ weapon: w });
    audio.pop();
  },

  cycleWeapon() {
    const list = get().unlockedWeapons;
    const i = list.indexOf(get().weapon);
    get().setWeapon(list[(i + 1) % list.length]!);
  },

  addItem(id, qty = 1) {
    const inv = get().inventory.slice();
    const stack = inv.find((s) => s && s.id === id);
    if (stack) {
      stack.qty += qty;
      set({ inventory: inv });
      return true;
    }
    const empty = inv.findIndex((s) => s === null);
    if (empty < 0) {
      get().pushToast("Inventory full");
      return false;
    }
    inv[empty] = { id, qty };
    set({ inventory: inv });
    return true;
  },

  consumeSelected() {
    const { selected, inventory } = get();
    if (selected == null) return;
    const slot = inventory[selected];
    if (!slot) return;
    const def = ITEMS[slot.id];
    if (def.type !== "consumable" || !def.restore) return;
    get().addJoy(def.restore);
    const next = inventory.slice();
    if (slot.qty <= 1) next[selected] = null;
    else next[selected] = { ...slot, qty: slot.qty - 1 };
    set({ inventory: next, selected: null });
    audio.heal();
  },

  tryCombine(slot) {
    const { combine, inventory } = get();
    if (combine == null) {
      set({ combine: slot, selected: slot });
      return;
    }
    if (combine === slot) {
      set({ combine: null });
      return;
    }
    const a = inventory[combine];
    const b = inventory[slot];
    if (!a || !b) {
      set({ combine: null });
      return;
    }
    const out = matchRecipe(a.id, b.id);
    if (!out) {
      get().pushToast("Those do not combine");
      set({ combine: null });
      audio.deny();
      return;
    }
    const next = inventory.slice();
    next[combine] = a.qty <= 1 ? null : { ...a, qty: a.qty - 1 };
    next[slot] = b.qty <= 1 ? null : { ...b, qty: b.qty - 1 };
    const empty = next.findIndex((s) => s === null);
    if (empty >= 0) next[empty] = { id: out, qty: 1 };
    set({ inventory: next, combine: null, selected: empty >= 0 ? empty : null });
    audio.craft();
    get().pushToast(`Crafted ${ITEMS[out].name}`);
    if (out === "bliss_cupcake") get().completeTask("q_cauldron", "t_craft");
    if (out === "key_master") get().completeTask("q_lanterns", "t_master");
    if (out === "macaron_rainbow") get().completeTask("q_bakery", "t_macaron");
    if (out === "dynamo_core") get().completeTask("q_dynamo", "t_core");
    if (out === "wand_astral") {
      const w = get().unlockedWeapons;
      if (!w.includes("wand")) set({ unlockedWeapons: [...w, "wand"], weapon: "wand" });
      sim.weapon = "wand";
      get().pushToast("Astral Wand forged");
    }
  },

  completeTask(questId, taskId, inc = 0) {
    const quests = get().quests.map((q) => ({ ...q, tasks: q.tasks.map((t) => ({ ...t })) }));
    const q = quests.find((x) => x.id === questId);
    if (!q) return;
    const t = q.tasks.find((x) => x.id === taskId);
    if (!t || t.done) return;
    if (t.max) {
      t.count = Math.min(t.max, (t.count ?? 0) + (inc || 1));
      t.text = t.text.replace(/\(\d+\/\d+\)/, `(${t.count}/${t.max})`);
      if (!/\(\d+\/\d+\)/.test(t.text) && t.max > 1) {
        // keep original text; count tracked separately
      }
      if ((t.count ?? 0) < t.max) {
        set({ quests, objective: objectiveFrom(quests) });
        return;
      }
    }
    t.done = true;
    const all = q.tasks.every((x) => x.done);
    if (all && q.unlocks) {
      const unlocked = new Set(get().unlocked);
      q.unlocks.forEach((m) => unlocked.add(m));
      set({ unlocked: [...unlocked] });
    }
    set({ quests, objective: objectiveFrom(quests) });
    audio.chime();
    if (all) get().pushToast(`Quest complete: ${q.name}`);
    const finale = quests.find((x) => x.id === "q_max");
    if (finale && quests.filter((x) => x.id !== "q_max").every((x) => x.tasks.every((t) => t.done))) {
      get().completeTask("q_max", "t_all");
      set({ ui: "win" });
    }
    persistNow({ ...get(), quests });
  },

  setFlag(k, v = true) {
    set({ flags: { ...get().flags, [k]: v } });
  },

  changeMap(to, fromDir) {
    const { unlocked, inventory, flags } = get();
    const door = MAPS[get().mapId].doors.find((d) => d.to === to);
    const hasKey = Boolean(door?.requires && inventory.some((s) => s && s.id === door.requires));
    const hasFlag = Boolean(door?.requiresFlag && flags[door.requiresFlag]);
    const open = unlocked.includes(to) || to === "foyer" || hasKey || hasFlag;
    if (!open) {
      if (door?.requires) {
        get().pushToast(`Locked. Need ${ITEMS[door.requires].name}.`);
      } else {
        get().pushToast("The way is not yet open.");
      }
      audio.deny();
      return;
    }
    if (door?.requires && !hasKey && !unlocked.includes(to) && !hasFlag) {
      get().pushToast(`Locked. Need ${ITEMS[door.requires].name}.`);
      audio.deny();
      return;
    }
    const dest = MAPS[to];
    const pose = fromDir ? spawnFromDoor(to, fromDir) : dest.spawn;
    sim.mapId = to;
    sim.x = pose.x;
    sim.z = pose.z;
    sim.yaw = pose.yaw;
    spawnMapEntities(to);
    audio.door();
    const visited = get().visited.includes(to) ? get().visited : [...get().visited, to];
    const unlockedNext = get().unlocked.includes(to) ? get().unlocked : [...get().unlocked, to];
    set({ mapId: to, visited, unlocked: unlockedNext });
    if (to === "library") get().completeTask("q_cauldron", "t_enter_lib");
    if (to === "garden") get().completeTask("q_lanterns", "t_enter_g");
    if (to === "mirror_maze") get().completeTask("q_mirror", "t_maze");
    if (to === "crypt") get().completeTask("q_boss", "t_descend");
    if (to === "lighthouse") get().completeTask("q_light", "t_enter_lh");
    if (to === "ice_chamber") get().completeTask("q_ice", "t_enter_ice");
    if (to === "conservatory") get().completeTask("q_cons", "t_enter_cons");
    if (to === "terrace") get().completeTask("q_terrace", "t_enter_ter");
  },

  interact() {
    const id = sim.nearId;
    if (!id) return;
    const map = MAPS[get().mapId];
    const it = map.interactables.find((x) => x.id === id);
    if (!it) {
      const door = map.doors.find((d) => `door-${d.dir}` === id);
      if (door) get().changeMap(door.to, door.dir);
      return;
    }
    if (it.kind === "pickup" && it.item) {
      if (get().flags[`got_${it.id}`]) return;
      if (get().addItem(it.item)) {
        get().setFlag(`got_${it.id}`);
        get().pushToast(`Collected ${ITEMS[it.item].name}`);
        audio.pickup();
        if (it.item === "key_foyer") get().completeTask("q_piano", "t_key");
        if (it.item === "gem_star") get().completeTask("q_astro", "t_gem");
        if (it.item === "crest_royal") get().completeTask("q_clock", "t_crest");
        if (it.item === "tea_blend") get().completeTask("q_tea", "t_blend");
        if (it.item === "lighthouse_lens") {
          /* wait for return */
        }
        if (it.item === "forest_offering") get().completeTask("q_forest", "t_offering");
      }
      return;
    }
    if (it.kind === "examine") {
      if (it.id === "oven") get().completeTask("q_bakery", "t_oven");
      get().showExamine(EXAMINE[it.id] ?? { title: it.label, body: "You look closely." });
      return;
    }
    if (it.kind === "npc" && it.npc) {
      const n = NPC_META[it.npc];
      const step = Number(get().flags[`npc_${it.npc}`] ?? 0);
      const line = n.lines[Math.min(step, n.lines.length - 1)]!;
      get().showExamine({ title: n.name, body: line, portrait: n.portrait, speaker: n.name });
      get().setFlag(`npc_${it.npc}`, step + 1);
      if (it.npc === "madame-macaron") get().completeTask("q_bakery", "t_talk_m");
      if (it.npc === "captain-puff") get().completeTask("q_harbor", "t_captain");
      if (it.npc === "sister-prism") get().completeTask("q_crystal", "t_prism");
      if (it.npc === "miss-chamomile") {
        if (get().inventory.some((s) => s && s.id === "tea_blend") && get().flags.tea_candles_done) {
          get().completeTask("q_tea", "t_serve");
          get().pushToast("Moonpetal shared.");
        }
      }
      if (it.npc === "captain-puff" && get().inventory.some((s) => s && s.id === "lighthouse_lens")) {
        get().completeTask("q_harbor", "t_lens");
        get().pushToast("Lens restored. The harbor lantern wakes.");
      }
      return;
    }
    if (it.kind === "lantern") {
      if (get().flags[it.id]) return;
      get().setFlag(it.id);
      audio.chime();
      if (it.flag === "lantern") get().completeTask("q_lanterns", "t_lights", 1);
      if (it.flag === "tea_candle") {
        get().completeTask("q_tea", "t_candles", 1);
        const n = ["candle_1", "candle_2", "candle_3"].filter((k) => get().flags[k] || k === it.id).length;
        if (n >= 3) get().setFlag("tea_candles_done");
      }
      get().pushToast(`Lit ${it.label}`);
      return;
    }
    if (it.kind === "puzzle") {
      if (it.flag === "piano") {
        get().completeTask("q_piano", "t_inspect");
        set({ ui: "piano", piano: [] });
        return;
      }
      if (it.flag === "gear") {
        if (get().flags[it.id]) return;
        get().setFlag(it.id);
        get().completeTask("q_clock", "t_gears", 1);
        get().pushToast("Gear wound");
        audio.chime();
        return;
      }
      if (it.flag === "crystal") {
        if (get().flags[it.id]) return;
        get().setFlag(it.id);
        get().completeTask("q_crystal", "t_crystals", 1);
        get().pushToast("Crystal attuned");
        audio.chime();
        return;
      }
      if (it.flag === "harp") {
        get().completeTask("q_moon", "t_harp");
        get().showExamine({
          title: "Harpsichord",
          body: "The meadow motif rings. The rooftop chimes will answer.",
        });
        return;
      }
      if (it.flag === "chimes") {
        get().completeTask("q_moon", "t_chimes");
        get().pushToast("Meadow chimes answered");
        audio.cheer();
        return;
      }
      if (it.flag === "glass_rose") {
        get().completeTask("q_cons", "t_rose");
        get().pushToast("The glass rose blooms");
        audio.cheer();
        return;
      }
      if (it.flag === "bells") {
        get().completeTask("q_terrace", "t_bells");
        get().pushToast("Windbells carry across the estate");
        audio.cheer();
        return;
      }
    }
    if (it.kind === "altar") {
      if (it.flag === "cauldron") {
        const inv = get().inventory;
        const i = inv.findIndex((s) => s && s.id === "bliss_cupcake");
        if (i < 0) {
          get().pushToast("The cauldron wants a Mega Bliss Cupcake.");
          return;
        }
        const next = inv.slice();
        const s = next[i]!;
        next[i] = s.qty <= 1 ? null : { ...s, qty: s.qty - 1 };
        set({ inventory: next });
        get().completeTask("q_cauldron", "t_offer");
        get().pushToast("The cauldron blooms with gold light.");
        audio.cheer();
        return;
      }
      if (it.flag === "astrolabe") {
        if (!get().inventory.some((s) => s && s.id === "gem_star")) {
          get().pushToast("The astrolabe needs the Star Sapphire.");
          return;
        }
        get().completeTask("q_astro", "t_align");
        get().pushToast("Constellations lock into place.");
        audio.cheer();
        return;
      }
      if (it.flag === "true_mirror") {
        get().completeTask("q_mirror", "t_true");
        if (get().addItem("mirror_shard")) get().pushToast("The true pane yields a shard.");
        audio.cheer();
        return;
      }
      if (it.flag === "shrine") {
        if (!get().inventory.some((s) => s && s.id === "forest_offering")) {
          get().pushToast("The shrine waits for a grove offering.");
          return;
        }
        get().completeTask("q_forest", "t_shrine");
        audio.cheer();
        return;
      }
      if (it.flag === "generator") {
        if (!get().inventory.some((s) => s && s.id === "dynamo_core")) {
          get().pushToast("Seat a Joy Dynamo Core first.");
          return;
        }
        get().setFlag("dynamo");
        get().completeTask("q_dynamo", "t_gen");
        get().pushToast("The sugar dynamo wakes. The crypt unlatches.");
        audio.cheer();
        return;
      }
      if (it.flag === "lamp") {
        if (!get().inventory.some((s) => s && s.id === "lighthouse_lens")) {
          get().pushToast("The lamp needs the Harbor Lens.");
          return;
        }
        get().completeTask("q_light", "t_lamp");
        get().pushToast("The lighthouse opens a gold eye over the water.");
        audio.cheer();
        return;
      }
      if (it.flag === "ice") {
        const inv = get().inventory;
        const i = inv.findIndex((s) => s && s.id === "bliss_cupcake");
        if (i < 0) {
          get().pushToast("The frozen heart wants a Mega Bliss Cupcake.");
          return;
        }
        const next = inv.slice();
        const s = next[i]!;
        next[i] = s.qty <= 1 ? null : { ...s, qty: s.qty - 1 };
        set({ inventory: next });
        get().completeTask("q_ice", "t_thaw");
        get().pushToast("Ice turns to warm light.");
        audio.cheer();
      }
    }
  },

  pianoKey(note) {
    const seq = [...get().piano, note].slice(-3);
    audio.note(note);
    set({ piano: seq });
    if (seq.join("") === "CEG") {
      get().completeTask("q_piano", "t_play");
      get().addItem("key_foyer");
      get().completeTask("q_piano", "t_key");
      get().pushToast("The drawer opens. Silver Foyer Key.");
      audio.cheer();
      set({ ui: "playing", piano: [] });
    }
  },

  showExamine(p) {
    audio.pop();
    set({ ui: "examine", examine: p });
  },

  pushToast(text) {
    set({ toast: { id: toastSeq++, text } });
  },

  addJoy(n) {
    const joy = Math.max(0, Math.min(100, get().joy + n));
    sim.joy = joy;
    set({ joy });
  },

  recruit(kind) {
    const companions = get().companions;
    if (companions.includes(kind) || companions.length >= 4) return;
    const next = [...companions, kind];
    set({ companions: next });
    get().completeTask("q_village", "t_recruit", 1);
    get().pushToast(`${COMPANION_NAMES[kind] ?? kind} joined the Joy Squad`);
  },

  hydrate(partial) {
    set(partial as GameState);
    sim.mapId = (partial.mapId as MapId) ?? sim.mapId;
    sim.joy = partial.joy ?? sim.joy;
    sim.weapon = (partial.weapon as WeaponId) ?? sim.weapon;
    const dest = MAPS[sim.mapId];
    sim.x = dest.spawn.x;
    sim.z = dest.spawn.z;
    sim.yaw = dest.spawn.yaw;
    spawnMapEntities(sim.mapId);
  },
}));

export function tryDoorTransition() {
  const g = useGame.getState();
  const map = MAPS[g.mapId];
  for (const d of map.doors) {
    if (d.dir === "U" || d.dir === "D") continue;
    const p = doorWorld(g.mapId, d.dir);
    const dx = sim.x - p.x;
    const dz = sim.z - p.z;
    if (dx * dx + dz * dz < 2.4) {
      const hasKey = Boolean(d.requires && g.inventory.some((s) => s && s.id === d.requires));
      const hasFlag = Boolean(d.requiresFlag && g.flags[d.requiresFlag]);
      if (!g.unlocked.includes(d.to) && !hasKey && !hasFlag) continue;
      if (d.requires && !hasKey && !g.unlocked.includes(d.to)) continue;
      if (d.requiresFlag && !hasFlag && !g.unlocked.includes(d.to)) continue;
      const outward =
        (d.dir === "N" && sim.z > p.z - 0.2) ||
        (d.dir === "S" && sim.z < p.z + 0.2) ||
        (d.dir === "E" && sim.x > p.x - 0.2) ||
        (d.dir === "W" && sim.x < p.x + 0.2);
      if (outward) g.changeMap(d.to, d.dir);
    }
  }
}

export function nearestInteract(): string {
  const g = useGame.getState();
  const map = MAPS[g.mapId];
  let best = "";
  let bestD = 2.1;
  for (const it of map.interactables) {
    if (it.kind === "pickup" && g.flags[`got_${it.id}`]) continue;
    const dx = sim.x - it.x;
    const dz = sim.z - it.z;
    const d = Math.hypot(dx, dz);
    if (d < bestD) {
      bestD = d;
      best = it.id;
    }
  }
  for (const d of map.doors) {
    const p = doorWorld(g.mapId, d.dir);
    const dist = Math.hypot(sim.x - p.x, sim.z - p.z);
    if (dist < bestD) {
      bestD = dist;
      best = `door-${d.dir}`;
    }
  }
  sim.nearId = best;
  const it = map.interactables.find((x) => x.id === best);
  const door = map.doors.find((d) => `door-${d.dir}` === best);
  sim.interactHint = it?.label ?? door?.label ?? "";
  return best;
}

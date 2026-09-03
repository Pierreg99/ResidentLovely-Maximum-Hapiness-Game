import { Heart, Map as MapIcon, Pause, ScrollText, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { ITEMS, WEAPONS } from "../data/items";
import { MAPS, MAP_LIST } from "../data/maps";
import { COMPANION_NAMES, PORTRAITS } from "../data/immersives";
import { clearSave, loadSave } from "../save";
import { audio } from "../audio";
import { useGame } from "../store";
import { sim } from "../sim";
import { Touch } from "./Touch";
import type { MapId } from "../types";

const NODE: Record<MapId, { x: number; y: number }> = {
  sacred_forest: { x: 78, y: 8 },
  moonlit_meadow: { x: 56, y: 8 },
  clock_belfry: { x: 56, y: 20 },
  terrace: { x: 34, y: 20 },
  observatory: { x: 56, y: 32 },
  mirror_maze: { x: 78, y: 32 },
  music_parlor: { x: 12, y: 44 },
  tea_salon: { x: 34, y: 44 },
  garden: { x: 56, y: 44 },
  conservatory: { x: 56, y: 56 },
  foyer: { x: 56, y: 68 },
  library: { x: 78, y: 68 },
  village: { x: 34, y: 80 },
  bakery: { x: 56, y: 80 },
  harbor_docks: { x: 34, y: 92 },
  lighthouse: { x: 12, y: 92 },
  sugar_lab: { x: 56, y: 92 },
  crystal_grotto: { x: 56, y: 104 },
  ice_chamber: { x: 78, y: 104 },
  crypt: { x: 56, y: 116 },
};

function Panel({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="pointer-events-auto absolute inset-0 z-30 flex items-end justify-center bg-bg/70 p-3 sm:items-center">
      <div className="max-h-[88dvh] w-full max-w-lg overflow-auto rounded-xl border border-border bg-surface p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-display text-xl text-fg">{title}</h2>
          <button
            type="button"
            className="h-11 rounded-md border border-border px-3 text-sm text-muted"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Title() {
  const start = useGame((s) => s.start);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    setSaved(Boolean(loadSave()));
  }, []);
  return (
    <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden bg-bg">
      <img
        src={PORTRAITS.chateau}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-55"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/30" />
        <div className="pointer-events-auto relative flex h-full flex-col justify-end gap-5 p-6 pb-10 sm:p-10">
        <p className="text-xs tracking-[0.22em] text-teal uppercase">Chateau de la Joie</p>
        <h1 className="font-display max-w-xl text-4xl leading-tight text-fg sm:text-6xl">
          Resident Lovely
        </h1>
        <p className="max-w-md text-sm text-muted sm:text-base">
          Maximum Happiness. Restore joy, uplift every Grump, and walk the estate with kindness.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="h-12 min-w-36 rounded-lg bg-accent px-6 text-sm font-medium text-accent-fg"
            onClick={start}
          >
            Start
          </button>
          {saved && (
            <button
              type="button"
              className="h-12 rounded-lg border border-border-strong bg-raised px-5 text-sm text-fg"
              onClick={start}
            >
              Continue
            </button>
          )}
          <button
            type="button"
            className="h-12 rounded-lg border border-border px-5 text-sm text-muted"
            onClick={() => {
              clearSave();
              window.location.reload();
            }}
          >
            New investigation
          </button>
        </div>
        <p className="max-w-lg text-xs leading-relaxed text-subtle">
          W/S walk · A/D turn · mouse look · E examine · Space fire · I items · Q quests · M map · V view
        </p>
      </div>
    </div>
  );
}

function PlayingChrome() {
  const joy = useGame((s) => s.joy);
  const mapId = useGame((s) => s.mapId);
  const objective = useGame((s) => s.objective);
  const weapon = useGame((s) => s.weapon);
  const companions = useGame((s) => s.companions);
  const toast = useGame((s) => s.toast);
  const setUi = useGame((s) => s.setUi);
  const hint = sim.interactHint;
  const m = MAPS[mapId];
  return (
    <>
      <div className="pointer-events-none absolute left-3 top-3 z-20 flex max-w-[min(100%-1.5rem,22rem)] items-center gap-3 rounded-lg border border-border bg-surface/85 p-2 pr-3">
        <img
          src={PORTRAITS.joy}
          alt=""
          className="h-12 w-12 rounded-md object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm text-fg">Agent Joy</p>
            <span className="tabular-nums text-xs text-muted">{Math.round(joy)}</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-raised">
            <div className="h-full bg-accent" style={{ width: `${joy}%` }} />
          </div>
          <p className="mt-1 truncate text-[11px] text-subtle">
            {m.name} · {m.floor}
          </p>
        </div>
      </div>
      <div className="pointer-events-none absolute left-1/2 top-3 z-20 hidden -translate-x-1/2 rounded-md border border-border bg-surface/80 px-3 py-1.5 text-xs text-muted sm:block">
        {objective}
      </div>
      <div className="pointer-events-auto absolute right-3 top-16 z-20 flex gap-2 sm:top-4">
        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-md border border-border bg-surface text-fg"
          onClick={() => setUi("quests")}
          aria-label="Quests"
        >
          <ScrollText className="h-4 w-4" />
          <span className="sr-only">Quests</span>
        </button>
        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-md border border-border bg-surface text-fg"
          onClick={() => setUi("map")}
          aria-label="Map"
        >
          <MapIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-md border border-border bg-surface text-fg"
          onClick={() => setUi("inventory")}
          aria-label="Items"
        >
          <Sparkles className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-md border border-border bg-surface text-fg"
          onClick={() => setUi("paused")}
          aria-label="Pause"
        >
          <Pause className="h-4 w-4" />
        </button>
      </div>
      {hint && (
        <div className="pointer-events-none absolute bottom-24 left-1/2 z-20 -translate-x-1/2 rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-fg">
          <span className="text-teal">E</span> {hint}
        </div>
      )}
      <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 rounded-md border border-border bg-surface/80 px-3 py-1.5 text-xs text-muted md:block">
        {WEAPONS[weapon]?.name} · 1–5 / G cycle
      </div>
      {companions.length > 0 && (
        <div className="pointer-events-none absolute bottom-4 left-3 z-10 hidden max-w-48 text-xs text-muted md:block">
          Squad {companions.map((c) => COMPANION_NAMES[c] ?? c).join(" · ")}
        </div>
      )}
      {toast && (
        <div className="pointer-events-none absolute bottom-36 left-1/2 z-30 -translate-x-1/2 rounded-md bg-raised px-3 py-2 text-sm text-fg">
          {toast.text}
        </div>
      )}
      <div className="pointer-events-none absolute bottom-4 right-3 z-10 hidden items-center gap-1 text-xs text-subtle md:flex">
        <Heart className="h-3 w-3 text-accent" /> Joy restoration
      </div>
    </>
  );
}

function Inventory() {
  const inventory = useGame((s) => s.inventory);
  const selected = useGame((s) => s.selected);
  const combine = useGame((s) => s.combine);
  const tryCombine = useGame((s) => s.tryCombine);
  const consumeSelected = useGame((s) => s.consumeSelected);
  const setUi = useGame((s) => s.setUi);
  return (
    <Panel title="Alchemy pouch" onClose={() => setUi("playing")}>
      <p className="mb-3 text-sm text-muted">Tap one slot, then another to combine. Consumables can be used.</p>
      <div className="grid grid-cols-4 gap-2">
        {inventory.map((slot, i) => (
          <button
            type="button"
            key={i}
            onClick={() => tryCombine(i)}
            className={`min-h-20 rounded-md border p-2 text-left text-xs ${
              selected === i || combine === i
                ? "border-accent bg-raised text-fg"
                : "border-border bg-bg text-muted"
            }`}
          >
            {slot ? (
              <>
                <span className="block font-medium text-fg">{ITEMS[slot.id].name}</span>
                <span className="tabular-nums text-subtle">×{slot.qty}</span>
              </>
            ) : (
              <span className="text-subtle">Empty</span>
            )}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="mt-4 h-11 w-full rounded-md bg-accent text-sm text-accent-fg"
        onClick={consumeSelected}
      >
        Use selected
      </button>
    </Panel>
  );
}

function Quests() {
  const quests = useGame((s) => s.quests);
  const setUi = useGame((s) => s.setUi);
  return (
    <Panel title="Quest ledger" onClose={() => setUi("playing")}>
      <ul className="space-y-3">
        {quests.map((q) => {
          const done = q.tasks.every((t) => t.done);
          const started = q.tasks.some((t) => t.done);
          return (
            <li key={q.id} className="rounded-md border border-border bg-bg p-3">
              <p className="text-sm text-fg">
                {q.name}
                <span className="ml-2 text-xs text-subtle">
                  {done ? "Complete" : started ? "Active" : "Waiting"}
                </span>
              </p>
              <p className="mt-1 text-xs text-muted">{q.desc}</p>
              <ul className="mt-2 space-y-1">
                {q.tasks.map((t) => (
                  <li key={t.id} className={`text-xs ${t.done ? "text-teal" : "text-subtle"}`}>
                    {t.done ? "Done" : "Open"} — {t.text}
                    {t.max ? ` (${t.count ?? 0}/${t.max})` : ""}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

function MapPanel() {
  const mapId = useGame((s) => s.mapId);
  const visited = useGame((s) => s.visited);
  const unlocked = useGame((s) => s.unlocked);
  const setUi = useGame((s) => s.setUi);
  const changeMap = useGame((s) => s.changeMap);
  return (
    <Panel title="Estate blueprint" onClose={() => setUi("playing")}>
      <p className="mb-2 text-xs text-muted">Visited rooms can be opened. Locked wings stay dim.</p>
      <div className="relative h-80 overflow-auto rounded-md border border-border bg-bg">
        <div className="relative h-[32rem] w-full min-w-[20rem]">
          {MAP_LIST.map((m) => {
            const n = NODE[m.id];
            const on = mapId === m.id;
            const seen = visited.includes(m.id);
            const open = unlocked.includes(m.id);
            return (
              <button
                type="button"
                key={m.id}
                disabled={!open}
                onClick={() => {
                  if (open) {
                    changeMap(m.id);
                    setUi("playing");
                  }
                }}
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-sm border px-1.5 py-1 text-[10px] ${
                  on
                    ? "border-accent bg-accent text-accent-fg"
                    : open
                      ? "border-teal bg-raised text-fg"
                      : "border-border bg-surface text-subtle"
                }`}
              >
                {seen || open ? m.name : "????"}
              </button>
            );
          })}
        </div>
      </div>
    </Panel>
  );
}

function Examine() {
  const examine = useGame((s) => s.examine);
  const setUi = useGame((s) => s.setUi);
  if (!examine) return null;
  return (
    <Panel title={examine.title} onClose={() => setUi("playing")}>
      <div className="flex gap-4">
        {examine.portrait && (
          <img
            src={examine.portrait}
            alt=""
            className="h-28 w-24 shrink-0 rounded-md object-cover"
          />
        )}
        <p className="text-sm leading-relaxed text-muted">{examine.body}</p>
      </div>
    </Panel>
  );
}

function Piano() {
  const pianoKey = useGame((s) => s.pianoKey);
  const piano = useGame((s) => s.piano);
  const setUi = useGame((s) => s.setUi);
  const notes = ["C", "D", "E", "F", "G", "A", "B"];
  return (
    <Panel title="Grand concert piano" onClose={() => setUi("playing")}>
      <p className="mb-3 text-sm text-muted">Play C, then E, then G.</p>
      <p className="mb-3 font-mono text-sm text-teal">{piano.join(" ") || "—"}</p>
      <div className="flex gap-1">
        {notes.map((n) => (
          <button
            key={n}
            type="button"
            className="h-28 flex-1 rounded-sm border border-border bg-fg text-sm text-bg"
            onClick={() => pianoKey(n)}
          >
            {n}
          </button>
        ))}
      </div>
    </Panel>
  );
}

function Paused() {
  const setUi = useGame((s) => s.setUi);
  const cycleView = useGame((s) => s.cycleView);
  const viewMode = useGame((s) => s.viewMode);
  return (
    <Panel title="Paused" onClose={() => setUi("playing")}>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          className="h-12 rounded-md bg-accent text-sm text-accent-fg"
          onClick={() => setUi("playing")}
        >
          Resume
        </button>
        <button
          type="button"
          className="h-12 rounded-md border border-border text-sm text-fg"
          onClick={cycleView}
        >
          View: {viewMode === "ots" ? "over-shoulder" : "first-person"}
        </button>
        <button
          type="button"
          className="h-12 rounded-md border border-border text-sm text-fg"
          onClick={() => audio.setMuted(true)}
        >
          Mute audio
        </button>
      </div>
    </Panel>
  );
}

function Win() {
  return (
    <div className="absolute inset-0 z-40 flex items-end bg-bg/80 p-8">
      <div className="max-w-lg">
        <p className="text-xs tracking-[0.2em] text-teal uppercase">Maximum Happiness</p>
        <h2 className="font-display mt-2 text-4xl text-fg">The chateau remembers how to smile.</h2>
        <p className="mt-3 text-sm text-muted">
          Every wing is lit. The Gloom Behemoth rests kindly. Agent Joy stands in the foyer with the Joy Squad.
        </p>
      </div>
    </div>
  );
}

export function HUD() {
  const ui = useGame((s) => s.ui);
  if (ui === "title") return <Title />;
  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      {ui !== "win" && <PlayingChrome />}
      {ui === "inventory" && <Inventory />}
      {ui === "quests" && <Quests />}
      {ui === "map" && <MapPanel />}
      {ui === "examine" && <Examine />}
      {ui === "piano" && <Piano />}
      {ui === "paused" && <Paused />}
      {ui === "win" && <Win />}
      <Touch />
    </div>
  );
}

import { useRef } from "react";
import { sim } from "../sim";
import { useGame } from "../store";
import { fireWeapon } from "../tick";

function Stick({
  side,
}: {
  side: "move" | "look";
}) {
  const origin = useRef<{ x: number; y: number; id: number } | null>(null);

  const onDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    origin.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
  };
  const onMove = (e: React.PointerEvent) => {
    if (!origin.current || origin.current.id !== e.pointerId) return;
    const dx = (e.clientX - origin.current.x) / 48;
    const dy = (e.clientY - origin.current.y) / 48;
    const mag = Math.hypot(dx, dy) || 1;
    const nx = dx / Math.max(1, mag);
    const ny = dy / Math.max(1, mag);
    if (side === "move") {
      sim.joyX = -nx;
      sim.joyY = -ny;
    } else {
      sim.lookX -= nx * 0.045;
      sim.lookY -= ny * 0.03;
    }
  };
  const onUp = () => {
    origin.current = null;
    if (side === "move") {
      sim.joyX = 0;
      sim.joyY = 0;
    }
  };

  return (
    <div
      className="h-28 w-28 rounded-full border border-border bg-surface/70"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    />
  );
}

export function Touch() {
  const ui = useGame((s) => s.ui);
  const interact = useGame((s) => s.interact);
  const toggle = useGame((s) => s.toggle);
  if (ui !== "playing") return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-20 md:hidden">
      <div className="pointer-events-auto absolute bottom-6 left-4">
        <Stick side="move" />
      </div>
      <div className="pointer-events-auto absolute bottom-6 right-4 flex flex-col items-end gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            className="h-12 min-w-12 rounded-md border border-border bg-surface px-3 text-sm text-fg"
            onPointerDown={() => interact()}
          >
            Examine
          </button>
          <button
            type="button"
            className="h-12 min-w-12 rounded-md bg-accent px-3 text-sm text-accent-fg"
            onPointerDown={() => {
              sim.beamOn = true;
              fireWeapon();
            }}
            onPointerUp={() => {
              sim.beamOn = false;
            }}
            onPointerCancel={() => {
              sim.beamOn = false;
            }}
          >
            Fire
          </button>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="h-11 rounded-md border border-border bg-surface px-3 text-xs text-muted"
            onClick={() => toggle("inventory")}
          >
            Items
          </button>
          <button
            type="button"
            className="h-11 rounded-md border border-border bg-surface px-3 text-xs text-muted"
            onClick={() => toggle("map")}
          >
            Map
          </button>
          <button
            type="button"
            className="h-11 rounded-md border border-border bg-surface px-3 text-xs text-muted"
            onClick={() => toggle("quests")}
          >
            Quests
          </button>
        </div>
        <Stick side="look" />
      </div>
    </div>
  );
}

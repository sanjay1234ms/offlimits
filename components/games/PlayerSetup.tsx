"use client";

import { useState } from "react";
import { Plus, Users } from "lucide-react";
import { parseNames } from "@/hooks/useScoreboard";
import { PLAYER_COUNT_CHOICES } from "@/data/competitive";

interface PlayerSetupProps {
  onAddNames: (names: string[]) => void;
  onSeedCount: (n: number) => void;
}

/** Zero-friction, non-blocking setup. The game card is already on screen below
 * this, tap a number to start instantly, or name the players. */
export function PlayerSetup({ onAddNames, onSeedCount }: PlayerSetupProps) {
  const [draft, setDraft] = useState("");

  function commit() {
    const names = parseNames(draft);
    if (names.length === 0) return;
    onAddNames(names);
    setDraft("");
  }

  return (
    <div className="rounded-2xl border-2 border-border-strong bg-surface/60 p-3 backdrop-blur sm:p-4">
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-subtle">
        <Users className="h-3.5 w-3.5" aria-hidden />
        How many playing?
      </p>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {PLAYER_COUNT_CHOICES.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onSeedCount(n)}
            className="min-w-[2.5rem] rounded-lg border-2 border-border-strong bg-surface px-2 py-1.5 text-sm font-extrabold text-foreground transition-transform duration-150 hover:-translate-y-0.5 hover:border-accent active:scale-95"
          >
            {n}
          </button>
        ))}
      </div>

      <p className="mt-3 text-[0.7rem] font-semibold text-subtle">
        Tap a number to start now with default names. Rename anyone from the
        scoreboard bar, or type real names here:
      </p>

      <form
        className="mt-1.5 flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          commit();
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add names, comma-separated"
          aria-label="Player names, comma separated"
          className="min-w-0 flex-1 rounded-xl border-2 border-border-strong bg-surface px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-subtle focus:border-accent"
        />
        <button
          type="submit"
          disabled={draft.trim() === ""}
          aria-label="Add players"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-[color:var(--accent-contrast)] transition-transform duration-150 hover:brightness-110 active:scale-95 disabled:opacity-40"
        >
          <Plus className="h-5 w-5" aria-hidden />
        </button>
      </form>
    </div>
  );
}

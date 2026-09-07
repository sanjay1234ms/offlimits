"use client";

import { SkipForward } from "lucide-react";
import { useScoreContext } from "./ScoreContext";
import { sfx } from "@/lib/audio";
import { haptic, HAPTIC } from "@/lib/haptics";

interface ScoringRowProps {
  /** Prompt above the buttons. */
  question?: string;
  /**
   * Called after a pick (a player OR skip) so the parent can reveal
   * "Next". Omit for a persistent award strip that stays put.
   */
  onResolved?: () => void;
  /** Hide the "Nobody / Skip" button. */
  hideSkip?: boolean;
}

/** "Who got it right?", one tap awards +1 and (optionally) advances the turn.
 * Renders nothing when there are no players on the board. */
export function ScoringRow({
  question = "Who answered correctly?",
  onResolved,
  hideSkip,
}: ScoringRowProps) {
  const { players, award } = useScoreContext();
  if (players.length === 0) return null;

  function pick(id: string) {
    award(id);
    sfx.flip();
    haptic(HAPTIC.advance);
    onResolved?.();
  }

  return (
    <div className="w-full rounded-2xl border-2 border-amber-400/40 bg-amber-500/10 p-3 sm:p-4">
      <p className="text-center text-xs font-extrabold uppercase tracking-wider text-amber-300">
        {question}
      </p>
      <div className="mt-2.5 flex flex-wrap justify-center gap-2">
        {players.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => pick(p.id)}
            className="inline-flex items-center gap-1 rounded-full border-2 border-emerald-500/50 bg-emerald-500/15 px-3 py-1.5 text-sm font-extrabold text-emerald-300 transition-transform duration-150 hover:-translate-y-0.5 hover:bg-emerald-500/25 active:scale-95"
          >
            +1 <span className="max-w-[7rem] truncate text-foreground">{p.name}</span>
          </button>
        ))}
        {!hideSkip ? (
          <button
            type="button"
            onClick={() => onResolved?.()}
            className="inline-flex items-center gap-1 rounded-full border-2 border-border-strong bg-surface px-3 py-1.5 text-sm font-bold text-muted transition-transform duration-150 hover:-translate-y-0.5 hover:text-foreground active:scale-95"
          >
            <SkipForward className="h-3.5 w-3.5" aria-hidden />
            Nobody / Skip
          </button>
        ) : null}
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Ban, Play, RotateCcw, SkipForward } from "lucide-react";
import { useDeck } from "@/hooks/useDeck";
import type { CatalogGame } from "@/data/catalog";
import { sfx } from "@/lib/audio";
import { haptic, HAPTIC } from "@/lib/haptics";
import { ScoringRow } from "./ScoringRow";
import { CompetitiveFilters } from "./CompetitiveFilters";
import { useCompetitiveDeck } from "@/hooks/useCompetitiveDeck";
import { BUZZKILL_DECK } from "@/data/competitiveDecks";

const ROUND = 30;

/** Buzzkill / Taboo, describe the target without the forbidden words, 30s. */
export function BuzzkillGame({ game }: { game: CatalogGame }) {
  const deck = useCompetitiveDeck(BUZZKILL_DECK);
  const items = useMemo(
    () =>
      deck.items.map((c) => ({
        id: c.id,
        target: c.target,
        forbidden: c.forbidden,
      })),
    [deck.items],
  );
  const { current, position, total, next } = useDeck(items, (x) => x.id, "buzzkill");
  const [secs, setSecs] = useState(ROUND);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setRunning(false);
    setSecs(ROUND);
  }, [deck.items]);

  useEffect(() => {
    if (!running) return;
    if (secs <= 0) {
      setRunning(false);
      sfx.buzzer();
      haptic(HAPTIC.buzzer);
      return;
    }
    sfx.tick(secs <= 5 ? 2 : secs <= 12 ? 1 : 0);
    const id = window.setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [running, secs]);

  const advance = useCallback(() => {
    next();
    setSecs(ROUND);
    setRunning(true);
  }, [next]);

  const low = secs <= 8;

  return (
    <div className="flex flex-col items-center gap-5">
      <CompetitiveFilters deck={deck} />
      <div
        className={`flex w-full items-center justify-between text-sm font-bold ${game.text}`}
      >
        <span>
          Word {position} / {total}
        </span>
        <span className={low ? "text-red-400" : "text-muted"}>
          {secs === 0 ? "Time!" : `${secs}s`}
        </span>
      </div>

      <div
        className={`flex min-h-[16rem] w-full flex-col items-center justify-center gap-4 rounded-3xl border-2 bg-gradient-to-br p-6 text-center sm:min-h-[20rem] sm:p-9 ${game.border} ${game.gradient}`}
        style={{ backgroundColor: "var(--card-bg)" }}
      >
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-subtle">
          Get your team to say
        </p>
        <p
          key={current?.id}
          className="animate-card-flip text-4xl font-extrabold text-foreground"
        >
          {current?.target ?? ""}
        </p>
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-red-400">
          Without saying
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {(current?.forbidden ?? []).map((w) => (
            <span
              key={w}
              className="inline-flex items-center gap-1 rounded-full border-2 border-red-500/50 bg-red-500/10 px-3 py-1 text-sm font-bold text-red-300"
            >
              <Ban className="h-3.5 w-3.5" aria-hidden />
              {w}
            </span>
          ))}
        </div>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-[width] duration-1000 ease-linear ${
            low ? "bg-red-500" : "bg-emerald-500"
          }`}
          style={{ width: `${(secs / ROUND) * 100}%` }}
        />
      </div>

      <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={advance}
          className="btn-primary w-full py-4 text-base sm:w-auto sm:min-w-[12rem]"
        >
          {running ? (
            <SkipForward className="h-5 w-5" aria-hidden />
          ) : (
            <Play className="h-5 w-5" aria-hidden />
          )}
          {running ? "Next word" : "Start round"}
        </button>
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          className="btn-ghost sm:w-auto"
        >
          {running ? "Pause" : "Resume"}
        </button>
        <button
          type="button"
          onClick={() => {
            setSecs(ROUND);
            setRunning(false);
          }}
          className="btn-ghost sm:w-auto"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          Reset timer
        </button>
      </div>

      <ScoringRow question="Guessed it? Tap to score a point:" hideSkip />

      <p className="text-xs text-subtle">
        Say a forbidden word and it&apos;s a foul, no point.
      </p>
    </div>
  );
}

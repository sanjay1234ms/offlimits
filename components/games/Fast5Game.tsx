"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import { useDeck } from "@/hooks/useDeck";
import type { CatalogGame } from "@/data/catalog";
import { sfx } from "@/lib/audio";
import { haptic, HAPTIC } from "@/lib/haptics";
import { ScoringRow } from "./ScoringRow";
import { useScoreContext } from "./ScoreContext";
import { CompetitiveFilters } from "./CompetitiveFilters";
import { useCompetitiveDeck } from "@/hooks/useCompetitiveDeck";
import { FAST5_DECK } from "@/data/competitiveDecks";

const ROUND = 5;

/** Fast 5, name five things in the category before the 5-second buzzer. */
export function Fast5Game({ game }: { game: CatalogGame }) {
  const deck = useCompetitiveDeck(FAST5_DECK);
  const items = useMemo(
    () => deck.items.map((c) => ({ id: c.id, text: c.text })),
    [deck.items],
  );
  const { current, position, total, next } = useDeck(items, (x) => x.id);
  const [secs, setSecs] = useState(ROUND);
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [scored, setScored] = useState(false);
  const { players } = useScoreContext();

  useEffect(() => {
    setPhase("idle");
    setSecs(ROUND);
    setScored(false);
  }, [deck.items]);

  useEffect(() => {
    if (phase !== "running") return;
    if (secs <= 0) {
      setPhase("done");
      sfx.buzzer();
      haptic(HAPTIC.buzzer);
      return;
    }
    sfx.tick(secs <= 2 ? 2 : 1);
    const id = window.setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [phase, secs]);

  const startRound = useCallback(() => {
    setSecs(ROUND);
    setScored(false);
    setPhase("running");
  }, []);

  const nextCategory = useCallback(() => {
    next();
    setSecs(ROUND);
    setScored(false);
    setPhase("idle");
  }, [next]);

  const awaitingScore = phase === "done" && players.length > 0 && !scored;

  return (
    <div className="flex flex-col items-center gap-5">
      <CompetitiveFilters deck={deck} />
      <div
        className={`flex w-full items-center justify-between text-sm font-bold ${game.text}`}
      >
        <span>
          Category {position} / {total}
        </span>
        <span className="text-muted">Name 5 · 5 seconds</span>
      </div>

      <div
        className={`relative flex min-h-[18rem] w-full flex-col items-center justify-center gap-5 rounded-3xl border-2 bg-gradient-to-br p-6 text-center sm:min-h-[22rem] sm:p-9 ${game.border} ${game.gradient}`}
        style={{ backgroundColor: "var(--card-bg)" }}
      >
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-subtle">
          Name 5
        </p>
        <p
          key={current?.id}
          className="animate-card-flip text-balance text-3xl font-extrabold leading-tight text-foreground"
        >
          {current?.text ?? ""}
        </p>

        <div
          className={`grid h-24 w-24 place-items-center rounded-full border-4 text-4xl font-extrabold tabular-nums ${
            phase === "done"
              ? "border-red-500 text-red-400"
              : phase === "running" && secs <= 2
                ? "border-red-500 text-red-400"
                : "border-emerald-500 text-foreground"
          }`}
        >
          {phase === "done" ? "!" : secs}
        </div>

        {phase === "done" ? (
          <p className="text-sm font-bold text-red-400">Buzzer!</p>
        ) : null}
      </div>

      {awaitingScore ? (
        <ScoringRow
          question="Who named five in time?"
          onResolved={() => setScored(true)}
        />
      ) : (
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          {phase === "running" ? (
            <button
              type="button"
              onClick={() => setPhase("done")}
              className="btn-primary w-full py-4 text-base sm:w-auto sm:min-w-[12rem]"
            >
              Stop
            </button>
          ) : (
            <button
              type="button"
              onClick={startRound}
              className="btn-primary w-full py-4 text-base sm:w-auto sm:min-w-[12rem]"
            >
              <Play className="h-5 w-5" aria-hidden />
              {phase === "done" ? "Retry category" : "Start 5 seconds"}
            </button>
          )}
          <button
            type="button"
            onClick={nextCategory}
            className="btn-ghost sm:w-auto"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            New category
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { useScoreboard, type Scoreboard } from "./useScoreboard";

/**
 * The shared competitive layer. Player names live in one global roster; the
 * scores are isolated to `gameSlug`, so opening Charades after Trivia loads the
 * same people at 0 points.
 *
 * Zero-friction setup: if the game was opened from a group-size filter
 * (`/games/trivia?players=4`) and the roster is empty, it seeds
 * "Player 1 … Player N" automatically, no blocking modal.
 */
export function useCompetitiveGame(gameSlug: string): Scoreboard {
  const board = useScoreboard(gameSlug);
  const { hydrated, players, syncCount } = board;
  const seededFromUrl = useRef(false);

  useEffect(() => {
    if (seededFromUrl.current || !hydrated || players.length > 0) return;
    seededFromUrl.current = true;
    try {
      const raw = new URLSearchParams(window.location.search).get("players");
      const n = raw ? parseInt(raw, 10) : NaN;
      if (Number.isFinite(n) && n >= 2) syncCount(n);
    } catch {
      /* no search params / SSR, ignore */
    }
  }, [hydrated, players.length, syncCount]);

  return board;
}

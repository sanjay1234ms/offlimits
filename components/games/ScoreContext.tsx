"use client";

import { createContext, useContext } from "react";
import type { Player } from "@/hooks/useScoreboard";

interface ScoreContextValue {
  /** Active players in roster order (stable, don't re-sort for buttons). */
  players: Player[];
  /** Give a player one point in the active game. Live in the leaderboard bar. */
  award: (playerId: string) => void;
  /** Resize the roster to N, appends or trims trailing unedited defaults. */
  syncCount: (n: number) => void;
}

const NOOP: ScoreContextValue = {
  players: [],
  award: () => {},
  syncCount: () => {},
};

export const ScoreContext = createContext<ScoreContextValue | null>(null);

/** Access the live scoreboard from inside a competitive engine game. Returns
 * an empty, inert value when the game isn't wrapped in a `ScoreTray`. */
export function useScoreContext(): ScoreContextValue {
  return useContext(ScoreContext) ?? NOOP;
}

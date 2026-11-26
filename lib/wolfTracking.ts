"use client";

import { useCallback, useEffect, useRef } from "react";
import { announceGameDone, track } from "./analytics";

/**
 * One Werewolf/Mafia game, tracked once, so GA4 can show completion and the
 * exact phase where groups quit:
 * - werewolf_start   (game_id, mode, players, skin)
 * - werewolf_phase   (game_id, mode, phase, round) on every phase change
 * - werewolf_end     (game_id, mode, winner, round, minutes), once per game
 * - werewolf_abandon (game_id, mode, last_phase, round, minutes) when the page
 *   is closed or left mid-game.
 * In Party Room mode only the host's phone calls this, so a 6-player room
 * counts as one game, not six.
 */

type Mode = "local" | "room";

/** Room "roles" and local "deal" are the same moment: everyone sees a role. */
const normalise = (phase: string) => (phase === "roles" ? "deal" : phase);

export function useWolfTracker(mode: Mode) {
  const game = useRef<{
    id: string;
    skin: string;
    startedAt: number;
    phase: string;
    round: number;
    ended: boolean;
  } | null>(null);

  const minutes = () =>
    game.current
      ? Math.round(((Date.now() - game.current.startedAt) / 60000) * 10) / 10
      : 0;

  const abandon = useCallback(() => {
    const g = game.current;
    if (!g || g.ended) return;
    g.ended = true;
    track("werewolf_abandon", {
      game_id: g.id,
      mode,
      skin: g.skin,
      last_phase: g.phase,
      round: g.round,
      minutes: minutes(),
      transport_type: "beacon",
    });
  }, [mode]);

  const start = useCallback(
    (players: number, skin: string) => {
      abandon(); // a restart mid-game counts the old game as abandoned
      game.current = {
        id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
        skin,
        startedAt: Date.now(),
        phase: "deal",
        round: 1,
        ended: false,
      };
      track("werewolf_start", { game_id: game.current.id, mode, players, skin });
    },
    [abandon, mode],
  );

  const phase = useCallback(
    (raw: string, round: number) => {
      const g = game.current;
      if (!g || g.ended) return;
      const p = normalise(raw);
      if (p === g.phase && round === g.round) return;
      g.phase = p;
      g.round = round;
      if (p === "end") return; // reported by end()
      track("werewolf_phase", { game_id: g.id, mode, skin: g.skin, phase: p, round });
    },
    [mode],
  );

  const end = useCallback(
    (winner: string) => {
      const g = game.current;
      if (!g || g.ended) return;
      g.ended = true;
      g.phase = "end";
      track("werewolf_end", {
        game_id: g.id,
        mode,
        skin: g.skin,
        winner,
        round: g.round,
        minutes: minutes(),
      });
      announceGameDone(g.skin);
    },
    [mode],
  );

  // Closing the tab or leaving the page mid-game.
  useEffect(() => {
    window.addEventListener("pagehide", abandon);
    return () => {
      window.removeEventListener("pagehide", abandon);
      abandon();
    };
  }, [abandon]);

  return { start, phase, end };
}

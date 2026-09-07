"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { MIN_PLAYERS } from "@/data/competitive";

export { MIN_PLAYERS };

/** Player identity, shared across every competitive game. */
export interface RosterPlayer {
  id: string;
  name: string;
}

/** A roster player plus their score in the active game session. */
export interface Player extends RosterPlayer {
  score: number;
}

const ROSTER_KEY = "offlimits_roster";
const LEGACY_KEY = "offlimits_scoreboard";
const LEGACY_SCORES_PREFIX = "offlimits_scores_";

/** A still-auto-generated, never-renamed player. */
const DEFAULT_NAME_RE = /^Player \d+$/;
/** Leftover mock/test players to scrub on load. */
const MOCK_NAME_RE = /^(sam|uu)$/i;

function makeId(): string {
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

/** Splits "Player 1, Player 2" (or newlines) into trimmed, non-empty names. */
export function parseNames(text: string): string[] {
  return text
    .split(/[,\n]/)
    .map((n) => n.trim())
    .filter(Boolean);
}

/**
 * Player names live in one persisted roster (`offlimits_roster`); scores are
 * **session-only** and never persisted, every fresh mount or game switch
 * starts every player on 0. Default names are strictly "Player N".
 */
export function useScoreboard(gameSlug: string) {
  const [roster, setRoster, rosterHydrated] = useLocalStorage<RosterPlayer[]>(
    ROSTER_KEY,
    [],
  );

  // Scores: in-memory only. Reset the moment the game route changes.
  const [scores, setScores] = useState<Record<string, number>>({});
  const [scoreSlug, setScoreSlug] = useState(gameSlug);
  if (gameSlug !== scoreSlug) {
    setScoreSlug(gameSlug);
    setScores({});
  }

  // One-time cleanup: drop persisted score maps (scores are session-only now),
  // migrate a legacy combined board into the roster, and scrub "sam" / "uu".
  const cleaned = useRef(false);
  useEffect(() => {
    if (cleaned.current || !rosterHydrated) return;
    cleaned.current = true;
    try {
      Object.keys(window.localStorage)
        .filter((k) => k.startsWith(LEGACY_SCORES_PREFIX))
        .forEach((k) => window.localStorage.removeItem(k));

      if (roster.length === 0) {
        const raw = window.localStorage.getItem(LEGACY_KEY);
        if (raw) {
          const old = JSON.parse(raw) as { name?: string }[];
          const names = old
            .map((p) => p?.name?.trim())
            .filter(Boolean) as string[];
          if (names.length) {
            setRoster(
              names.map((name, i) => ({
                id: makeId(),
                name: MOCK_NAME_RE.test(name) ? `Player ${i + 1}` : name,
              })),
            );
          }
        }
        window.localStorage.removeItem(LEGACY_KEY);
      } else if (roster.some((p) => MOCK_NAME_RE.test(p.name.trim()))) {
        setRoster((prev) =>
          prev.map((p, i) =>
            MOCK_NAME_RE.test(p.name.trim())
              ? { ...p, name: `Player ${i + 1}` }
              : p,
          ),
        );
      }
    } catch {
      /* ignore */
    }
  }, [rosterHydrated, roster, setRoster]);

  const players: Player[] = useMemo(
    () => roster.map((r) => ({ ...r, score: scores[r.id] ?? 0 })),
    [roster, scores],
  );

  const addNames = useCallback(
    (names: string[]) => {
      const clean = names.map((n) => n.trim()).filter(Boolean);
      if (clean.length === 0) return;
      setRoster((prev) => [
        ...prev,
        ...clean.map((name) => ({ id: makeId(), name })),
      ]);
    },
    [setRoster],
  );

  /**
   * Resize the roster toward `n`:
   *  - below target → append "Player N";
   *  - above target → trim from the end, but only players that are still an
   *    un-renamed default AND have no points this session. Custom names and
   *    scored players are always kept, never below MIN_PLAYERS.
   */
  const syncCount = useCallback(
    (n: number) => {
      const target = Math.max(MIN_PLAYERS, Math.min(24, Math.floor(n)));
      setRoster((prev) => {
        if (prev.length === target) return prev;

        if (prev.length < target) {
          const extra = Array.from(
            { length: target - prev.length },
            (_, i) => ({
              id: makeId(),
              name: `Player ${prev.length + i + 1}`,
            }),
          );
          return [...prev, ...extra];
        }

        const next = [...prev];
        while (
          next.length > target &&
          next.length > MIN_PLAYERS &&
          DEFAULT_NAME_RE.test(next[next.length - 1].name) &&
          (scores[next[next.length - 1].id] ?? 0) === 0
        ) {
          next.pop();
        }
        return next.length === prev.length ? prev : next;
      });
    },
    [setRoster, scores],
  );

  const rename = useCallback(
    (id: string, name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      setRoster((prev) =>
        prev.map((p) => (p.id === id ? { ...p, name: trimmed } : p)),
      );
    },
    [setRoster],
  );

  const remove = useCallback(
    (id: string) =>
      setRoster((prev) =>
        prev.length <= MIN_PLAYERS ? prev : prev.filter((p) => p.id !== id),
      ),
    [setRoster],
  );

  const adjust = useCallback(
    (id: string, delta: number) =>
      setScores((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + delta })),
    [],
  );

  /** Zero every score for this session, roster untouched. */
  const resetScores = useCallback(() => setScores({}), []);

  const clear = useCallback(() => {
    setRoster([]);
    setScores({});
  }, [setRoster]);

  const ranked = useMemo(
    () => [...players].sort((a, b) => b.score - a.score),
    [players],
  );

  const leaderId = useMemo(() => {
    if (ranked.length === 0 || ranked[0].score <= 0) return null;
    return ranked[0].id;
  }, [ranked]);

  return {
    players,
    ranked,
    leaderId,
    hydrated: rosterHydrated,
    started: roster.length > 0,
    addNames,
    syncCount,
    rename,
    remove,
    adjust,
    resetScores,
    clear,
  };
}

export type Scoreboard = ReturnType<typeof useScoreboard>;

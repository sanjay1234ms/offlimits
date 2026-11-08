/**
 * Shared helpers for the daily puzzles (Word Heist, Off the Map, Close Call).
 *
 * Puzzles turn over at local midnight, like most daily word games, so a
 * player's "today" matches their own calendar. Everything here runs in the
 * browser after mount: the server never knows the player's date, which keeps
 * the pages static and avoids hydration mismatches.
 */

/** Puzzle No. 1 is this local date. */
const LAUNCH = { y: 2026, m: 10, d: 8 }; // 8 November 2026 (month is 0-based)

const DAY_MS = 86_400_000;

/** Days since launch for the player's local date (0 = launch day). */
export function dayIndex(now = new Date()): number {
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const launch = Date.UTC(LAUNCH.y, LAUNCH.m, LAUNCH.d);
  return Math.max(0, Math.floor((today - launch) / DAY_MS));
}

/** The number shown to players, e.g. "No. 12". */
export function puzzleNumber(now = new Date()): number {
  return dayIndex(now) + 1;
}

/** Milliseconds until the next local midnight. */
export function msUntilNext(now = new Date()): number {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return next.getTime() - now.getTime();
}

/** "10 h", "45 min" style countdown label. */
export function formatCountdown(ms: number): string {
  const mins = Math.max(1, Math.ceil(ms / 60_000));
  if (mins < 60) return `${mins} min`;
  return `${Math.floor(mins / 60)} h`;
}

/** "03:12:09" clock for the end-of-game screen. */
export function formatClock(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}

/** Small, fast seeded PRNG so every player gets the same puzzle each day. */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic Fisher-Yates shuffle. */
export function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  const out = items.slice();
  const rand = seededRandom(seed);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Picks `count` items for a given day. Walks a fixed shuffle of the bank in
 * blocks so nothing repeats until the whole bank has been used, then
 * reshuffles for the next lap.
 */
export function dailyPicks<T>(bank: readonly T[], day: number, count: number, salt: number): T[] {
  const perLap = Math.floor(bank.length / count);
  const lap = Math.floor(day / perLap);
  const slot = day % perLap;
  const order = seededShuffle(bank, salt * 1000 + lap);
  return order.slice(slot * count, slot * count + count);
}

/** One item for a given day, cycling a fixed shuffle of the bank. */
export function dailyPick<T>(bank: readonly T[], day: number, salt: number): T {
  return dailyPicks(bank, day, 1, salt)[0];
}

/* -------------------------------------------------------------------------- */
/* Saved progress and streaks (per browser)                                    */
/* -------------------------------------------------------------------------- */

export type PuzzleId = "word-heist" | "off-the-map" | "close-call";

export interface DailyStats {
  played: number;
  wins: number;
  streak: number;
  best: number;
  /** Day index of the last finished puzzle. */
  lastDay: number;
}

const EMPTY_STATS: DailyStats = { played: 0, wins: 0, streak: 0, best: 0, lastDay: -1 };

function read<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode or storage full: progress just won't persist */
  }
}

/** Today's in-progress or finished state for a puzzle. */
export function loadProgress<T>(id: PuzzleId, day: number): T | null {
  return read<T>(`offlimits:daily:${id}:${day}`);
}

export function saveProgress(id: PuzzleId, day: number, state: unknown): void {
  write(`offlimits:daily:${id}:${day}`, state);
}

export function loadStats(id: PuzzleId): DailyStats {
  return { ...EMPTY_STATS, ...(read<DailyStats>(`offlimits:daily:${id}:stats`) ?? {}) };
}

/** Records a finished puzzle once per day and returns the new stats. */
export function recordResult(id: PuzzleId, day: number, won: boolean): DailyStats {
  const stats = loadStats(id);
  if (stats.lastDay === day) return stats;
  const continued = stats.lastDay === day - 1;
  const streak = won ? (continued ? stats.streak + 1 : 1) : 0;
  const next: DailyStats = {
    played: stats.played + 1,
    wins: stats.wins + (won ? 1 : 0),
    streak,
    best: Math.max(stats.best, streak),
    lastDay: day,
  };
  write(`offlimits:daily:${id}:stats`, next);
  return next;
}

/** True if today's puzzle is already finished in this browser. */
export function isDoneToday(id: PuzzleId, day: number): boolean {
  const state = loadProgress<{ done?: boolean }>(id, day);
  return Boolean(state?.done);
}

/** Copies text, falling back to the native share sheet. Resolves to what happened. */
export async function shareText(text: string): Promise<"copied" | "shared" | "failed"> {
  try {
    await navigator.clipboard.writeText(text);
    return "copied";
  } catch {
    try {
      if (navigator.share) {
        await navigator.share({ text });
        return "shared";
      }
    } catch {
      /* user cancelled */
    }
    return "failed";
  }
}

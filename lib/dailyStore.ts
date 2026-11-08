import { dayIndex } from "@/lib/daily";

/*
 * Daily puzzle leaderboards. Same pattern as the party-room store: Supabase
 * (table: supabase/daily_scores.sql) when SUPABASE_URL and
 * SUPABASE_SERVICE_ROLE_KEY are set, otherwise an in-memory map that's fine
 * for `next dev`. If the table hasn't been created yet it also falls back to
 * memory, so the games never break over a missing table.
 *
 * One score per device per puzzle per day; the first finish is the one that
 * counts. Scores are reported by the browser, which is fine for a casual
 * daily table.
 */

export const PUZZLES = ["word-heist", "off-the-map", "close-call"] as const;
export type BoardPuzzle = (typeof PUZZLES)[number];

export interface ScoreRow {
  puzzle: BoardPuzzle;
  day: number;
  device_id: string;
  name: string;
  rank_value: number;
  label: string;
  ms: number;
  created_at: string;
}

export interface BoardEntry {
  position: number;
  name: string;
  label: string;
  ms: number;
  you: boolean;
}

export interface Board {
  total: number;
  top: BoardEntry[];
  you: BoardEntry | null;
}

const SB_URL = process.env.SUPABASE_URL?.replace(/\/$/, "");
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
let tableMissing = !(SB_URL && SB_KEY);

const g = globalThis as unknown as { __offlimitsDaily?: Map<string, ScoreRow[]> };
const MEM = g.__offlimitsDaily ?? (g.__offlimitsDaily = new Map<string, ScoreRow[]>());
const memKey = (puzzle: string, day: number) => `${puzzle}:${day}`;

async function sb(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`${SB_URL}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: SB_KEY!,
      Authorization: `Bearer ${SB_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal,resolution=ignore-duplicates",
      ...init.headers,
    },
  });
}

function noteMissing(status: number, body: string): boolean {
  if (status === 404 || /PGRST205|does not exist/.test(body)) {
    tableMissing = true;
    console.warn("[daily] daily_scores table missing; using memory. Run supabase/daily_scores.sql.");
    return true;
  }
  return false;
}

async function allRows(puzzle: BoardPuzzle, day: number): Promise<ScoreRow[]> {
  if (!tableMissing) {
    const res = await sb(
      `daily_scores?puzzle=eq.${puzzle}&day=eq.${day}&select=*&order=rank_value.asc,ms.asc&limit=5000`,
    );
    if (res.ok) return (await res.json()) as ScoreRow[];
    if (!noteMissing(res.status, await res.text())) throw new Error(`daily read ${res.status}`);
  }
  return (MEM.get(memKey(puzzle, day)) ?? [])
    .slice()
    .sort((a, b) => a.rank_value - b.rank_value || a.ms - b.ms);
}

export function isBoardPuzzle(value: string): value is BoardPuzzle {
  return (PUZZLES as readonly string[]).includes(value);
}

/** Accept scores only for today's puzzle (give or take a day for time zones). */
export function isOpenDay(day: number): boolean {
  const today = dayIndex(new Date());
  return Number.isInteger(day) && day >= today - 1 && day <= today + 1;
}

export async function submitScore(row: Omit<ScoreRow, "created_at">): Promise<void> {
  const full: ScoreRow = { ...row, created_at: new Date().toISOString() };
  if (!tableMissing) {
    const res = await sb("daily_scores", { method: "POST", body: JSON.stringify(full) });
    if (res.ok || res.status === 409) return;
    if (!noteMissing(res.status, await res.text())) throw new Error(`daily insert ${res.status}`);
  }
  const key = memKey(row.puzzle, row.day);
  const list = MEM.get(key) ?? [];
  if (!list.some((r) => r.device_id === row.device_id)) list.push(full);
  MEM.set(key, list);
}

/** Sets the name on an existing row (people often pick a name after finishing). */
export async function renameScore(puzzle: BoardPuzzle, day: number, deviceId: string, name: string): Promise<void> {
  if (!tableMissing) {
    const res = await sb(
      `daily_scores?puzzle=eq.${puzzle}&day=eq.${day}&device_id=eq.${encodeURIComponent(deviceId)}`,
      { method: "PATCH", body: JSON.stringify({ name }) },
    );
    if (res.ok) return;
    if (!noteMissing(res.status, await res.text())) throw new Error(`daily rename ${res.status}`);
  }
  const row = (MEM.get(memKey(puzzle, day)) ?? []).find((r) => r.device_id === deviceId);
  if (row) row.name = name;
}

/** Positions share a place when rank and time tie exactly. */
export async function getBoard(puzzle: BoardPuzzle, day: number, deviceId: string | null): Promise<Board> {
  const rows = await allRows(puzzle, day);
  const entries: BoardEntry[] = [];
  let position = 0;
  rows.forEach((r, i) => {
    const prev = rows[i - 1];
    if (!prev || prev.rank_value !== r.rank_value || prev.ms !== r.ms) position = i + 1;
    entries.push({
      position,
      name: r.name || "Anonymous",
      label: r.label,
      ms: r.ms,
      you: Boolean(deviceId) && r.device_id === deviceId,
    });
  });
  return {
    total: entries.length,
    top: entries.slice(0, 10),
    you: entries.find((e) => e.you) ?? null,
  };
}

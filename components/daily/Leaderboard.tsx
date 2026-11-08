"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Copy, Loader2, Share2, Trophy } from "lucide-react";
import { getDeviceId } from "@/lib/deviceId";
import { shareText, type DailyStats, type PuzzleId } from "@/lib/daily";
import { track } from "@/lib/analytics";
import type { Board } from "@/lib/dailyStore";

const NAME_KEY = "offlimits:daily:name";

function readName(): string {
  try {
    return window.localStorage.getItem(NAME_KEY) ?? "";
  } catch {
    return "";
  }
}

function formatMs(ms: number): string {
  const s = Math.round(ms / 1000);
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s`;
}

interface FinishPanelProps {
  puzzle: PuzzleId;
  day: number;
  practice: boolean;
  /** Big headline, e.g. "Vault cracked in 4!" */
  headline: string;
  /** What the table shows for this run, e.g. "4/6" or "812". */
  label: string;
  /** Lower is better. */
  rank: number;
  /** Time from first input. */
  ms: number;
  shareLines: string;
  stats: DailyStats | null;
  children?: React.ReactNode;
}

/** End-of-puzzle panel: result, share, streak and today's leaderboard. */
export function FinishPanel({ puzzle, day, practice, headline, label, rank, ms, shareLines, stats, children }: FinishPanelProps) {
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(!practice);
  const [name, setName] = useState("");
  const [savedName, setSavedName] = useState("");
  const [shared, setShared] = useState<"copied" | "shared" | "failed" | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/daily/${puzzle}?day=${day}&device=${encodeURIComponent(getDeviceId())}`, {
        cache: "no-store",
      });
      if (res.ok) setBoard((await res.json()) as Board);
    } finally {
      setLoading(false);
    }
  }, [puzzle, day]);

  const submit = useCallback(
    async (playerName: string) => {
      await fetch(`/api/daily/${puzzle}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ day, device: getDeviceId(), name: playerName, rank, label, ms }),
      }).catch(() => {});
    },
    [puzzle, day, rank, label, ms],
  );

  // Submit once on finish (first finish counts), then show the table.
  useEffect(() => {
    if (practice) return;
    const n = readName();
    setName(n);
    setSavedName(n);
    submit(n).then(load);
  }, [practice, submit, load]);

  async function saveName() {
    const clean = name.trim().slice(0, 20);
    try {
      window.localStorage.setItem(NAME_KEY, clean);
    } catch {
      /* ignore */
    }
    setSavedName(clean);
    await fetch(`/api/daily/${puzzle}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "rename", day, device: getDeviceId(), name: clean }),
    }).catch(() => {});
    load();
    track("daily_name_set", { puzzle });
  }

  async function onShare() {
    const result = await shareText(shareLines);
    setShared(result);
    track("daily_share", { puzzle, method: result });
    window.setTimeout(() => setShared(null), 2500);
  }

  return (
    <div className="mt-4 rounded-2xl border-[3px] border-slate-900 bg-yellow-50 p-4 text-center shadow-[4px_4px_0_#0f172a] motion-safe:animate-pop-in sm:p-5">
      <p className="text-2xl font-black tracking-tight">{headline}</p>
      {children}
      {stats && !practice ? (
        <div className="mt-3 grid grid-cols-4 gap-2 text-center">
          {[
            ["Played", stats.played],
            ["Wins", stats.wins],
            ["Streak", stats.streak],
            ["Best", stats.best],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl border-2 border-slate-900 bg-white py-2">
              <p className="text-xl font-black">{v}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{k}</p>
            </div>
          ))}
        </div>
      ) : null}

      <button
        type="button"
        onClick={onShare}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border-[3px] border-slate-900 bg-lime-300 px-6 py-3 text-base font-black shadow-[4px_4px_0_#0f172a] transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
      >
        {shared === "copied" ? <Check className="h-5 w-5" aria-hidden /> : shared ? <Copy className="h-5 w-5" aria-hidden /> : <Share2 className="h-5 w-5" aria-hidden />}
        {shared === "copied" ? "Copied. Paste it in the group chat" : shared === "failed" ? "Couldn't copy" : "Share result (no spoilers)"}
      </button>

      {!practice ? (
        <div className="mt-5 text-left">
          <p className="flex items-center gap-2 text-sm font-black uppercase tracking-wider">
            <Trophy className="h-4 w-4 text-amber-500" aria-hidden />
            Today&apos;s table {board ? <span className="font-bold normal-case tracking-normal text-slate-500">· {board.total} played</span> : null}
          </p>
          {loading ? (
            <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Loading the table…
            </p>
          ) : board && board.total > 0 ? (
            <ol className="mt-2 divide-y-2 divide-slate-100 overflow-hidden rounded-xl border-2 border-slate-900 bg-white text-sm">
              {board.top.map((e, i) => (
                <li key={i} className={`flex items-center gap-3 px-3 py-2 ${e.you ? "bg-lime-100 font-black" : ""}`}>
                  <span className="w-6 text-right font-mono text-slate-500">{e.position}</span>
                  <span className="flex-1 truncate">{e.you ? (savedName ? `${savedName} (you)` : "You") : e.name}</span>
                  <span className="font-black">{e.label}</span>
                  <span className="w-14 text-right text-xs text-slate-500">{formatMs(e.ms)}</span>
                </li>
              ))}
              {board.you && !board.top.some((e) => e.you) ? (
                <li className="flex items-center gap-3 bg-lime-100 px-3 py-2 font-black">
                  <span className="w-6 text-right font-mono">{board.you.position}</span>
                  <span className="flex-1 truncate">{savedName ? `${savedName} (you)` : "You"}</span>
                  <span>{board.you.label}</span>
                  <span className="w-14 text-right text-xs text-slate-500">{formatMs(board.you.ms)}</span>
                </li>
              ) : null}
            </ol>
          ) : (
            <p className="mt-2 text-sm text-slate-500">The table is quiet right now. Check back later.</p>
          )}
          {!savedName ? (
            <div className="mt-3 flex gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
                placeholder="Your name for the table"
                aria-label="Your name for the leaderboard"
                className="min-w-0 flex-1 rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-lime-400"
              />
              <button
                type="button"
                disabled={!name.trim()}
                onClick={saveName}
                className="rounded-xl border-2 border-slate-900 bg-slate-900 px-4 text-sm font-black text-white disabled:opacity-40"
              >
                Save
              </button>
            </div>
          ) : null}
          <p className="mt-2 text-xs text-slate-500">
            The table stays open until midnight, so your place can move. Ties go to the faster time, counted from your first move.
          </p>
        </div>
      ) : null}
    </div>
  );
}

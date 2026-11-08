"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { shareText, type DailyStats, type PuzzleId } from "@/lib/daily";
import { track } from "@/lib/analytics";

interface FinishPanelProps {
  puzzle: PuzzleId;
  practice: boolean;
  /** Big headline, e.g. "Vault cracked in 4!" */
  headline: string;
  shareLines: string;
  stats: DailyStats | null;
  children?: React.ReactNode;
}

/** End-of-puzzle panel: result, streak stats and a spoiler-free share. */
export function FinishPanel({ puzzle, practice, headline, shareLines, stats, children }: FinishPanelProps) {
  const [shared, setShared] = useState<"copied" | "shared" | "failed" | null>(null);

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
    </div>
  );
}

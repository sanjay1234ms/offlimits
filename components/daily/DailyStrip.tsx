"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { DAILY_GAMES } from "@/data/daily/puzzles";
import { formatCountdown, isDoneToday } from "@/lib/daily";
import { useDailyClock } from "@/hooks/useDailyClock";

/** "Today's puzzles" row: shortcut cards into the three daily games, with
 * the puzzle number, a countdown and a tick on ones already finished. */
export function DailyStrip({ showHeading = true }: { showHeading?: boolean }) {
  const { day, msLeft } = useDailyClock();
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (day === null) return;
    setDone(Object.fromEntries(DAILY_GAMES.map((g) => [g.id, isDoneToday(g.id, day)])));
  }, [day]);

  return (
    <div>
      {showHeading ? (
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
          <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Today&apos;s puzzles</h2>
          <span className="rounded-full border-2 border-slate-900 bg-slate-900 px-2.5 py-0.5 text-xs font-black text-white dark:border-white dark:bg-white dark:text-slate-900">
            {day === null ? "Daily" : `No. ${day + 1}`}
          </span>
          {day !== null ? <span className="text-sm font-semibold text-muted">new in {formatCountdown(msLeft)}</span> : null}
          <Link href="/daily" className="ml-auto text-sm font-bold text-accent underline-offset-4 hover:underline">
            All daily puzzles →
          </Link>
        </div>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-3">
        {DAILY_GAMES.map((g, i) => (
          <Link
            key={g.id}
            href={g.href}
            style={{ animationDelay: `${i * 70}ms` }}
            className={`group relative flex items-center gap-3 rounded-2xl border-[3px] border-slate-900 px-4 py-3 text-slate-900 shadow-[4px_4px_0_#0f172a] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#0f172a] active:translate-y-0.5 active:shadow-[2px_2px_0_#0f172a] motion-safe:animate-pop-in [animation-fill-mode:both] ${g.color}`}
          >
            <span aria-hidden className="text-3xl transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110">
              {g.emoji}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-base font-black leading-tight">{g.name}</span>
              <span className="block text-xs font-bold text-slate-700">
                {g.genre} · {g.minutes} min
              </span>
            </span>
            {done[g.id] ? (
              <span className="inline-flex items-center gap-1 rounded-full border-2 border-slate-900 bg-white px-3 py-1 text-xs font-black">
                <Check className="h-3.5 w-3.5" aria-hidden /> Done
              </span>
            ) : (
              <span className="rounded-full border-2 border-slate-900 bg-white px-3.5 py-1 text-sm font-black shadow-[2px_2px_0_#0f172a]">
                Play
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

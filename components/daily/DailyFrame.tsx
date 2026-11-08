"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, CalendarDays } from "lucide-react";
import { Modal } from "@/components/Modal";
import type { DailyGame } from "@/data/daily/puzzles";

/** How many past days stay open as practice. */
export const PRACTICE_DAYS = 7;

function dayLabel(offset: number): string {
  if (offset === 0) return "Today";
  if (offset === 1) return "Yesterday";
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.toLocaleDateString(undefined, { weekday: "short", day: "numeric" });
}

interface DailyFrameProps {
  game: DailyGame;
  /** Today's day index, null until mounted. */
  today: number | null;
  /** The day being played (today, or a practice day). */
  day: number | null;
  onPickDay: (day: number) => void;
  rules: React.ReactNode;
  children: React.ReactNode;
}

/** The white game card shared by all three daily puzzles: title strip,
 * puzzle number, rules sheet and a picker for the last week's practice. */
export function DailyFrame({ game, today, day, onPickDay, rules, children }: DailyFrameProps) {
  const [rulesOpen, setRulesOpen] = useState(false);
  const practice = today !== null && day !== null && day !== today;
  const offsets = today === null ? [] : Array.from({ length: Math.min(PRACTICE_DAYS + 1, today + 1) }, (_, i) => i);

  return (
    <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-[1.75rem] border-[3px] border-slate-900 bg-white text-slate-900 shadow-[6px_6px_0_#0f172a]">
      <div className={`flex items-center gap-3 border-b-[3px] border-slate-900 px-4 py-3 sm:px-5 ${game.color}`}>
        <span aria-hidden className="text-2xl">
          {game.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-black leading-tight">{game.name}</p>
          <p className="text-xs font-bold text-slate-700">
            {day === null ? "Loading…" : practice ? `Practice · No. ${day + 1}` : `No. ${day + 1} · today`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setRulesOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full border-2 border-slate-900 bg-white px-3 py-1.5 text-xs font-black shadow-[2px_2px_0_#0f172a] transition-transform hover:-translate-y-0.5"
        >
          <BookOpen className="h-3.5 w-3.5" aria-hidden />
          Rules
        </button>
      </div>

      {offsets.length > 1 ? (
        <div className="flex items-center gap-2 overflow-x-auto border-b-2 border-slate-200 px-4 py-2 sm:px-5">
          <CalendarDays className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
          {offsets.map((o) => {
            const d = (today ?? 0) - o;
            const on = d === day;
            return (
              <button
                key={o}
                type="button"
                onClick={() => onPickDay(d)}
                aria-pressed={on}
                className={`shrink-0 rounded-full border-2 px-3 py-1 text-xs font-bold transition-colors ${
                  on ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                }`}
              >
                {dayLabel(o)}
              </button>
            );
          })}
        </div>
      ) : null}

      {practice ? (
        <p className="bg-amber-50 px-4 py-2 text-center text-xs font-semibold text-amber-900 sm:px-5">
          Practice round. It won&apos;t touch your streak or the leaderboard.{" "}
          <button type="button" className="font-black underline" onClick={() => today !== null && onPickDay(today)}>
            Back to today
          </button>
        </p>
      ) : null}

      <div className="px-3 py-4 sm:px-5 sm:py-5">{children}</div>

      <Modal open={rulesOpen} onClose={() => setRulesOpen(false)} title={`How to play ${game.name}`}>
        <div className="mt-3 space-y-3 text-sm text-muted">{rules}</div>
        <button type="button" onClick={() => setRulesOpen(false)} className="btn-primary mt-5 w-full">
          Got it
        </button>
      </Modal>
    </div>
  );
}

/** "Next puzzle in 04:12:55" plus links to the other two puzzles. */
export function MoreDaily({ current, games, clock }: { current: string; games: readonly DailyGame[]; clock: string }) {
  return (
    <div className="mt-5 rounded-2xl border-2 border-slate-200 bg-slate-50 p-4">
      <p className="text-center text-xs font-bold uppercase tracking-wider text-slate-500">
        Next puzzle in <span className="font-mono text-slate-900">{clock}</span>
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {games
          .filter((g) => g.id !== current)
          .map((g) => (
            <Link
              key={g.id}
              href={g.href}
              className={`flex items-center gap-2 rounded-xl border-2 border-slate-900 px-3 py-2 text-sm font-black shadow-[2px_2px_0_#0f172a] transition-transform hover:-translate-y-0.5 ${g.color}`}
            >
              <span aria-hidden>{g.emoji}</span>
              <span className="flex-1">{g.name}</span>
              <span className="text-xs font-bold text-slate-700">{g.genre}</span>
            </Link>
          ))}
      </div>
    </div>
  );
}

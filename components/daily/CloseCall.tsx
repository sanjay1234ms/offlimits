"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Delete, Lock, Shuffle } from "lucide-react";
import { DailyFrame, MoreDaily } from "./DailyFrame";
import { FinishPanel } from "./Leaderboard";
import { useDailyClock } from "@/hooks/useDailyClock";
import { DAILY_GAMES } from "@/data/daily/puzzles";
import { ESTIMATES, type Estimate } from "@/data/daily/closeCall";
import {
  dailyPicks,
  formatClock,
  loadProgress,
  loadStats,
  recordResult,
  saveProgress,
  seededShuffle,
  type DailyStats,
} from "@/lib/daily";
import { track } from "@/lib/analytics";

const GAME = DAILY_GAMES[2];
const QUESTIONS = 5;
const MAX_DIGITS = 9;
/** A year guess loses 2% closeness per year off, so 50 years out scores 0. */
const YEAR_SPAN = 50;

/** 0..1. Numbers: the smaller over the larger, so double and half both
 * score 50%. Years: by how many years off. */
export function closeness(guess: number, q: Estimate): number {
  if (q.year) return Math.max(0, 1 - Math.abs(guess - q.answer) / YEAR_SPAN);
  if (guess <= 0) return 0;
  return Math.min(guess, q.answer) / Math.max(guess, q.answer);
}

function verdict(c: number): { emoji: string; text: string } {
  if (c >= 0.98) return { emoji: "🎯", text: "Bang on!" };
  if (c >= 0.9) return { emoji: "🔥", text: "So close" };
  if (c >= 0.7) return { emoji: "👍", text: "Not bad" };
  if (c >= 0.4) return { emoji: "😬", text: "In the area" };
  return { emoji: "🧊", text: "Ice cold" };
}

interface Progress {
  guesses: number[];
  done: boolean;
  startedAt: number | null;
  ms: number;
}

const FRESH: Progress = { guesses: [], done: false, startedAt: null, ms: 0 };

type Round = { kind: "daily"; day: number } | { kind: "bonus"; seed: number };

/** Guess vs answer on one bar, log-scaled so big misses still fit. */
function CloseMeter({ guess, q }: { guess: number; q: Estimate }) {
  const pos = (v: number) => {
    if (q.year) return 50 + Math.max(-48, Math.min(48, ((v - q.answer) / YEAR_SPAN) * 48));
    const r = Math.log10(Math.max(v, 1e-9) / q.answer);
    return 50 + Math.max(-48, Math.min(48, r * 48));
  };
  return (
    <div className="relative mt-3 h-10">
      <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-sky-200 via-lime-300 to-pink-200" />
      <span
        className="absolute top-1/2 h-6 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-900"
        style={{ left: "50%" }}
        title="Answer"
      />
      <span
        className="absolute top-1/2 grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-slate-900 bg-yellow-300 text-xs font-black transition-[left] duration-700"
        style={{ left: `${pos(guess)}%` }}
        title="Your guess"
      >
        you
      </span>
      <span className="absolute -bottom-1 left-0 text-[10px] font-bold text-slate-500">{q.year ? "too early" : "too low"}</span>
      <span className="absolute -bottom-1 right-0 text-[10px] font-bold text-slate-500">{q.year ? "too late" : "too high"}</span>
    </div>
  );
}

export function CloseCall() {
  const { day: today, msLeft } = useDailyClock(1000);
  const [round, setRound] = useState<Round | null>(null);
  const [p, setP] = useState<Progress>(FRESH);
  const [entry, setEntry] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [stats, setStats] = useState<DailyStats | null>(null);

  useEffect(() => {
    if (today !== null && round === null) setRound({ kind: "daily", day: today });
  }, [today, round]);

  const questions: Estimate[] = useMemo(() => {
    if (!round) return [];
    if (round.kind === "bonus") return seededShuffle(ESTIMATES, round.seed).slice(0, QUESTIONS);
    return dailyPicks(ESTIMATES, round.day, QUESTIONS, 37);
  }, [round]);

  const practice = round?.kind !== "daily" || round.day !== today;

  useEffect(() => {
    if (!round) return;
    const saved = round.kind === "daily" ? loadProgress<Progress>("close-call", round.day) : null;
    setP(saved ?? FRESH);
    setEntry("");
    setRevealed(false);
    setStats(loadStats("close-call"));
  }, [round]);

  const persist = useCallback(
    (next: Progress) => {
      setP(next);
      if (round?.kind === "daily") saveProgress("close-call", round.day, next);
    },
    [round],
  );

  const idx = revealed ? p.guesses.length - 1 : p.guesses.length;
  const q = questions[idx] as Estimate | undefined;

  const press = useCallback(
    (key: string) => {
      if (revealed || p.done || !q) return;
      if (!p.startedAt) persist({ ...p, startedAt: Date.now() });
      setEntry((e) => {
        if (key === "back") return e.slice(0, -1);
        if (key === "000") return e && e.length + 3 <= MAX_DIGITS ? e + "000" : e;
        if (e.length >= MAX_DIGITS) return e;
        if (e === "0") return key;
        return e + key;
      });
    },
    [revealed, p, q, persist],
  );

  const lockIn = useCallback(() => {
    if (!entry || revealed || p.done) return;
    const guess = Number(entry);
    persist({ ...p, guesses: [...p.guesses, guess] });
    setRevealed(true);
    setEntry("");
  }, [entry, revealed, p, persist]);

  function next() {
    setRevealed(false);
    if (p.guesses.length >= QUESTIONS) {
      const score = Math.round(p.guesses.reduce((a, g, i) => a + closeness(g, questions[i]), 0) * (1000 / QUESTIONS));
      const ms = p.startedAt ? Date.now() - p.startedAt : 0;
      persist({ ...p, done: true, ms });
      if (round?.kind === "daily" && !practice) setStats(recordResult("close-call", round.day, score > 0));
      track("daily_finish", { puzzle: "close-call", score, practice });
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      if (/^[0-9]$/.test(e.key)) press(e.key);
      else if (e.key === "Backspace") press("back");
      else if (e.key === "Enter") (revealed ? next : lockIn)();
      else return;
      e.preventDefault();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const score = Math.round(p.guesses.reduce((a, g, i) => a + (questions[i] ? closeness(g, questions[i]) : 0), 0) * (1000 / QUESTIONS));
  const number = round?.kind === "daily" ? round.day + 1 : null;
  const shareLines = [
    `OffLimits Close Call ${number ? `No. ${number}` : "bonus"} · ${score}/1000`,
    p.guesses.map((g, i) => (questions[i] ? verdict(closeness(g, questions[i])).emoji : "")).join(""),
    "playofflimits.com/daily/close-call",
  ].join("\n");

  const shown = entry ? Number(entry).toLocaleString() : "";
  const lastGuess = p.guesses[p.guesses.length - 1];

  return (
    <DailyFrame
      game={GAME}
      today={today}
      day={round?.kind === "daily" ? round.day : null}
      onPickDay={(d) => setRound({ kind: "daily", day: d })}
      rules={<CloseCallRules />}
    >
      {round?.kind === "bonus" ? (
        <p className="mb-2 text-center">
          <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-800">Bonus round · just for fun</span>
        </p>
      ) : null}

      {!p.done && q ? (
        <div className="mx-auto max-w-md">
          <div className="mb-3 flex items-center gap-2">
            {Array.from({ length: QUESTIONS }, (_, i) => (
              <span
                key={i}
                className={`h-2.5 flex-1 rounded-full border-2 border-slate-900 ${
                  i < p.guesses.length ? "bg-pink-300" : i === idx ? "bg-yellow-300" : "bg-white"
                }`}
              />
            ))}
            <span className="ml-1 font-mono text-sm font-black">{score}</span>
          </div>

          <div key={idx} className="rounded-2xl border-[3px] border-slate-900 bg-pink-50 p-4 shadow-[3px_3px_0_#0f172a] motion-safe:animate-pop-in">
            <p className="text-3xl" aria-hidden>
              {q.emoji}
            </p>
            <p className="mt-1 text-lg font-black leading-snug sm:text-xl">{q.q}</p>
            {q.unit ? <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">Answer in {q.unit}</p> : null}
          </div>

          {revealed && lastGuess !== undefined ? (
            <div className="mt-4 text-center motion-safe:animate-pop-in">
              {(() => {
                const c = closeness(lastGuess, q);
                const v = verdict(c);
                return (
                  <>
                    <p className="text-2xl font-black">
                      {v.emoji} {v.text} · {Math.round(c * 100)}%
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      You said <span className="font-black text-slate-900">{lastGuess.toLocaleString()}</span>. The answer is{" "}
                      <span className="font-black text-slate-900">
                        {q.about ? "about " : ""}
                        {q.year ? q.answer : q.answer.toLocaleString()}
                        {q.unit && !q.year ? ` ${q.unit}` : ""}
                      </span>
                      .
                    </p>
                    <CloseMeter guess={lastGuess} q={q} />
                  </>
                );
              })()}
              <button
                type="button"
                onClick={next}
                className="mt-4 w-full rounded-full border-[3px] border-slate-900 bg-lime-300 px-6 py-3 text-base font-black shadow-[3px_3px_0_#0f172a] hover:-translate-y-0.5"
              >
                {p.guesses.length >= QUESTIONS ? "See my score" : "Next question →"}
              </button>
            </div>
          ) : (
            <>
              <div className="mt-4 flex h-16 items-center justify-center rounded-2xl border-[3px] border-slate-900 bg-white px-4 font-mono text-3xl font-black">
                {shown || <span className="text-slate-300">0</span>}
                {q.unit && !q.year && shown ? <span className="ml-2 text-sm font-bold text-slate-500">{q.unit}</span> : null}
              </div>
              <div className="mt-3 grid select-none grid-cols-3 gap-2">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "000", "0", "back"].map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => press(k)}
                    aria-label={k === "back" ? "Delete" : k === "000" ? "Add three zeros" : k}
                    className="grid h-14 place-items-center rounded-xl border-2 border-slate-900 bg-white text-xl font-black shadow-[2px_2px_0_#0f172a] transition-transform active:translate-y-0.5 active:shadow-none"
                  >
                    {k === "back" ? <Delete className="h-5 w-5" aria-hidden /> : k === "000" ? ",000" : k}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={lockIn}
                disabled={!entry}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border-[3px] border-slate-900 bg-lime-300 px-6 py-3 text-base font-black shadow-[3px_3px_0_#0f172a] transition-transform hover:-translate-y-0.5 disabled:opacity-40"
              >
                <Lock className="h-4 w-4" aria-hidden />
                Lock it in
              </button>
              <p className="mt-2 text-center text-xs text-slate-500">One guess per question. No take-backs.</p>
            </>
          )}
        </div>
      ) : null}

      {p.done ? (
        <>
          <FinishPanel
            key={JSON.stringify(round)}
            puzzle="close-call"
            day={round?.kind === "daily" ? round.day : -1}
            practice={practice}
            headline={score >= 850 ? `Human calculator! ${score}/1000 🧮` : score >= 600 ? `Solid gut: ${score}/1000 🎯` : `${score}/1000. Wild guesses! 🎲`}
            label={`${score}`}
            rank={-score}
            ms={p.ms}
            shareLines={shareLines}
            stats={stats}
          >
            <ul className="mt-3 space-y-1 text-left text-sm">
              {questions.map((qq, i) => {
                const g = p.guesses[i];
                const c = g === undefined ? 0 : closeness(g, qq);
                return (
                  <li key={qq.q} className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5">
                    <span aria-hidden>{verdict(c).emoji}</span>
                    <span className="flex-1 truncate font-semibold">{qq.q}</span>
                    <span className="font-black">{Math.round(c * 100)}%</span>
                  </li>
                );
              })}
            </ul>
          </FinishPanel>
          <button
            type="button"
            onClick={() => setRound({ kind: "bonus", seed: Math.floor(Math.random() * 1e6) })}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-slate-900 bg-white px-5 py-2.5 text-sm font-black shadow-[3px_3px_0_#0f172a] hover:-translate-y-0.5"
          >
            <Shuffle className="h-4 w-4" aria-hidden />
            Play a bonus round (5 random questions)
          </button>
          <MoreDaily current="close-call" games={DAILY_GAMES} clock={formatClock(msLeft)} />
        </>
      ) : null}
    </DailyFrame>
  );
}

export function CloseCallRules() {
  return (
    <>
      <p>Five number questions a day, the same five for everyone. Nobody knows the exact answers, so trust your gut.</p>
      <ol className="list-decimal space-y-1.5 pl-5">
        <li>Read the question and check the unit.</li>
        <li>Tap in your number. The ,000 key adds three zeros for the big ones.</li>
        <li>Press Lock it in. You get one guess per question.</li>
        <li>See the real answer and how close you were.</li>
      </ol>
      <p>
        <strong>Scoring:</strong> closeness is the smaller number divided by the bigger one, so guessing double or half
        both score 50%. For years, every year off costs 2%. Your day is out of 1,000 (each question is worth up to 200).
      </p>
      <p>
        <strong>Leaderboard:</strong> highest score wins, ties go to the faster time, counted from your first tap.
        No calculators, no searching. That&apos;s the fun.
      </p>
    </>
  );
}

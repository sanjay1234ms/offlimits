"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Delete, Lightbulb, Shuffle } from "lucide-react";
import { DailyFrame, MoreDaily } from "./DailyFrame";
import { FinishPanel } from "./Leaderboard";
import { useDailyClock } from "@/hooks/useDailyClock";
import { DAILY_GAMES } from "@/data/daily/puzzles";
import { WORD_HEIST_ANSWERS } from "@/data/daily/wordHeist";
import {
  dailyPick,
  formatClock,
  loadProgress,
  loadStats,
  recordResult,
  saveProgress,
  type DailyStats,
} from "@/lib/daily";
import { track } from "@/lib/analytics";

const GAME = DAILY_GAMES[0];
const ROWS = 6;
const LEN = 5;
const CLUE_AFTER = 3;

type Mark = "hit" | "near" | "miss";

interface Progress {
  guesses: string[];
  clue: { index: number } | null;
  done: boolean;
  won: boolean;
  /** ms epoch of the first key press; time counts from here. */
  startedAt: number | null;
  ms: number;
}

const FRESH: Progress = { guesses: [], clue: null, done: false, won: false, startedAt: null, ms: 0 };

/** Scores a guess. Repeated letters only light up as often as they appear
 * in the answer: exact hits are claimed first, then near misses left to right. */
export function scoreGuess(guess: string, answer: string): Mark[] {
  const marks: Mark[] = Array(LEN).fill("miss");
  const left: Record<string, number> = {};
  for (let i = 0; i < LEN; i++) {
    if (guess[i] === answer[i]) marks[i] = "hit";
    else left[answer[i]] = (left[answer[i]] ?? 0) + 1;
  }
  for (let i = 0; i < LEN; i++) {
    if (marks[i] === "hit") continue;
    if (left[guess[i]]) {
      marks[i] = "near";
      left[guess[i]]--;
    }
  }
  return marks;
}

const TILE: Record<Mark, string> = {
  hit: "bg-lime-400 border-slate-900 text-slate-900",
  near: "bg-amber-300 border-slate-900 text-slate-900",
  miss: "bg-slate-500 border-slate-500 text-white",
};
const KEY: Record<Mark, string> = {
  hit: "bg-lime-400 text-slate-900 border-slate-900",
  near: "bg-amber-300 text-slate-900 border-slate-900",
  miss: "bg-slate-400 text-white border-slate-400 opacity-70",
};
const SHARE: Record<Mark, string> = { hit: "🟩", near: "🟨", miss: "⬛" };

/** Small marks so the result never relies on colour alone. */
function TileMark({ mark }: { mark: Mark }) {
  if (mark === "hit") return <span aria-hidden className="absolute bottom-1 left-1/2 h-1 w-5 -translate-x-1/2 rounded-full bg-slate-900/70" />;
  if (mark === "near") return <span aria-hidden className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-slate-900/70" />;
  return null;
}

const KEYBOARD = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

let dictionary: Promise<Set<string>> | null = null;
function loadDictionary(): Promise<Set<string>> {
  dictionary ??= fetch("/daily/words5.txt")
    .then((r) => (r.ok ? r.text() : ""))
    .then((t) => new Set([...t.split("\n").map((w) => w.trim()), ...WORD_HEIST_ANSWERS]))
    .catch(() => new Set<string>());
  return dictionary;
}

type Round = { kind: "daily"; day: number } | { kind: "bonus"; seed: number };

export function WordHeist() {
  const { day: today, msLeft } = useDailyClock(1000);
  const [round, setRound] = useState<Round | null>(null);
  const [p, setP] = useState<Progress>(FRESH);
  const [typed, setTyped] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [shakeRow, setShakeRow] = useState(false);
  const [revealRow, setRevealRow] = useState(-1);
  const [stats, setStats] = useState<DailyStats | null>(null);
  const [words, setWords] = useState<Set<string> | null>(null);
  const toastTimer = useRef<number>();

  useEffect(() => {
    loadDictionary().then(setWords);
  }, []);

  // Start on today's puzzle once the date is known.
  useEffect(() => {
    if (today !== null && round === null) setRound({ kind: "daily", day: today });
  }, [today, round]);

  const answer = useMemo(() => {
    if (!round) return "";
    if (round.kind === "bonus") return WORD_HEIST_ANSWERS[round.seed % WORD_HEIST_ANSWERS.length];
    return dailyPick(WORD_HEIST_ANSWERS, round.day, 11);
  }, [round]);

  const practice = round?.kind !== "daily" || round.day !== today;

  // Load saved progress for the chosen day.
  useEffect(() => {
    if (!round) return;
    setTyped("");
    setRevealRow(-1);
    if (round.kind === "daily") setP(loadProgress<Progress>("word-heist", round.day) ?? FRESH);
    else setP(FRESH);
    setStats(loadStats("word-heist"));
  }, [round]);

  const persist = useCallback(
    (next: Progress) => {
      setP(next);
      if (round?.kind === "daily") saveProgress("word-heist", round.day, next);
    },
    [round],
  );

  function flash(msg: string) {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 1800);
  }

  const marksFor = useCallback((g: string) => scoreGuess(g, answer), [answer]);

  const keyMarks = useMemo(() => {
    const best: Record<string, Mark> = {};
    const rankOf = { miss: 0, near: 1, hit: 2 };
    for (const g of p.guesses) {
      marksFor(g).forEach((m, i) => {
        const c = g[i];
        if (!best[c] || rankOf[m] > rankOf[best[c]]) best[c] = m;
      });
    }
    return best;
  }, [p.guesses, marksFor]);

  const submit = useCallback(() => {
    if (p.done || !round) return;
    if (typed.length < LEN) {
      setShakeRow(true);
      flash("Five letters, please");
      window.setTimeout(() => setShakeRow(false), 400);
      return;
    }
    if (words && words.size > 0 && !words.has(typed)) {
      setShakeRow(true);
      flash("Not in our word list. That one's free.");
      window.setTimeout(() => setShakeRow(false), 400);
      return;
    }
    const guesses = [...p.guesses, typed];
    const won = typed === answer;
    const done = won || guesses.length >= ROWS;
    const ms = p.startedAt ? Date.now() - p.startedAt : 0;
    setRevealRow(guesses.length - 1);
    setTyped("");
    const next = { ...p, guesses, won, done, ms: done ? ms : p.ms };
    // Let the tiles flip before the result shows.
    window.setTimeout(() => {
      persist(next);
      if (done) {
        if (round.kind === "daily" && !practice) setStats(recordResult("word-heist", round.day, won));
        track("daily_finish", { puzzle: "word-heist", won, tries: guesses.length, clue: Boolean(p.clue), practice });
      }
    }, done ? 1300 : 0);
    if (!done) persist(next);
  }, [p, typed, words, answer, round, persist, practice]);

  const press = useCallback(
    (key: string) => {
      if (p.done || !round) return;
      if (key === "enter") return submit();
      if (key === "back") return setTyped((t) => t.slice(0, -1));
      if (/^[a-z]$/.test(key) && typed.length < LEN) {
        if (!p.startedAt) persist({ ...p, startedAt: Date.now() });
        setTyped((t) => (t.length < LEN ? t + key : t));
      }
    },
    [p, round, typed.length, submit, persist],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      if (e.key === "Enter") press("enter");
      else if (e.key === "Backspace") press("back");
      else if (/^[a-zA-Z]$/.test(e.key)) press(e.key.toLowerCase());
      else return;
      e.preventDefault();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [press]);

  function revealClue() {
    if (p.clue || p.done) return;
    // Reveal a letter the player hasn't pinned in place yet.
    const found = new Set<number>();
    p.guesses.forEach((g) => marksFor(g).forEach((m, i) => m === "hit" && found.add(i)));
    const open = Array.from({ length: LEN }, (_, i) => i).filter((i) => !found.has(i));
    if (open.length === 0) return;
    const index = open[(round?.kind === "daily" ? round.day : 0) % open.length];
    persist({ ...p, clue: { index } });
    track("daily_clue", { puzzle: "word-heist" });
  }

  const misses = p.guesses.filter((g) => g !== answer).length;
  const canClue = !p.done && !p.clue && misses >= CLUE_AFTER;
  const label = p.won ? `${p.guesses.length}/6${p.clue ? " +clue" : ""}` : "X/6";
  const number = round?.kind === "daily" ? round.day + 1 : null;
  const shareLines = [
    `OffLimits Word Heist ${number ? `No. ${number}` : "bonus"} · ${label}`,
    ...p.guesses.map((g) => marksFor(g).map((m) => SHARE[m]).join("")),
    "playofflimits.com/daily/word-heist",
  ].join("\n");

  const rows = Array.from({ length: ROWS }, (_, r) => {
    if (r < p.guesses.length) return { letters: p.guesses[r], marks: marksFor(p.guesses[r]) as Mark[] | null };
    if (r === p.guesses.length && !p.done) return { letters: typed, marks: null };
    return { letters: "", marks: null };
  });

  return (
    <DailyFrame
      game={GAME}
      today={today}
      day={round?.kind === "daily" ? round.day : null}
      onPickDay={(d) => setRound({ kind: "daily", day: d })}
      rules={<WordHeistRules />}
    >
      <div className="relative flex flex-col items-center">
        {round?.kind === "bonus" ? (
          <p className="mb-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-800">Bonus vault · just for fun</p>
        ) : null}

        <div className="grid gap-1.5" style={{ perspective: 600 }} aria-label="Guesses">
          {rows.map((row, r) => (
            <div key={r} className={`grid grid-cols-5 gap-1.5 ${shakeRow && r === p.guesses.length ? "daily-shake" : ""}`}>
              {Array.from({ length: LEN }, (_, i) => {
                const ch = row.letters[i] ?? "";
                const mark = row.marks?.[i];
                const clueHere = !row.marks && r === p.guesses.length && p.clue?.index === i && !ch;
                const flipping = revealRow === r;
                return (
                  <div
                    key={i}
                    style={flipping ? { animationDelay: `${i * 220}ms` } : undefined}
                    className={`relative grid h-14 w-14 place-items-center rounded-xl border-[3px] text-2xl font-black uppercase sm:h-16 sm:w-16 sm:text-3xl ${
                      mark ? `${TILE[mark]} ${flipping ? "daily-flip" : ""}` : ch ? "daily-pop border-slate-900 bg-white" : "border-slate-200 bg-white"
                    } ${p.won && r === p.guesses.length - 1 ? "daily-bounce" : ""}`}
                    aria-label={ch ? `${ch}${mark ? `, ${mark === "hit" ? "right spot" : mark === "near" ? "in the word" : "not in the word"}` : ""}` : "empty"}
                  >
                    {ch || (clueHere ? <span className="text-amber-500/70">{answer[i]}</span> : "")}
                    {mark ? <TileMark mark={mark} /> : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-2 flex h-8 items-center justify-center" role="status" aria-live="polite">
          {toast ? (
            <span className="rounded-full bg-slate-900 px-4 py-1.5 text-sm font-bold text-white shadow-lg motion-safe:animate-pop-in">
              {toast}
            </span>
          ) : null}
        </div>

        {p.clue && !p.done ? (
          <p className="text-sm font-semibold text-amber-700">
            💡 Clue: letter {p.clue.index + 1} is <span className="font-black uppercase">{answer[p.clue.index]}</span>
          </p>
        ) : canClue ? (
          <button
            type="button"
            onClick={revealClue}
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-amber-500 bg-amber-50 px-4 py-1.5 text-sm font-black text-amber-800 hover:bg-amber-100"
          >
            <Lightbulb className="h-4 w-4" aria-hidden />
            Stuck? Reveal a letter
          </button>
        ) : null}

        {!p.done ? (
          <div className="mt-3 w-full max-w-lg select-none space-y-1.5">
            {KEYBOARD.map((line, li) => (
              <div key={li} className="flex justify-center gap-1">
                {li === 2 ? (
                  <button type="button" onClick={() => press("enter")} className="h-12 rounded-lg border-2 border-slate-900 bg-lime-300 px-2 text-xs font-black sm:px-3">
                    ENTER
                  </button>
                ) : null}
                {line.split("").map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => press(k)}
                    className={`h-12 min-w-0 flex-1 rounded-lg border-2 text-base font-black uppercase transition-transform active:scale-95 sm:max-w-[2.75rem] ${
                      keyMarks[k] ? KEY[keyMarks[k]] : "border-slate-300 bg-slate-100 text-slate-900"
                    }`}
                  >
                    {k}
                  </button>
                ))}
                {li === 2 ? (
                  <button type="button" onClick={() => press("back")} aria-label="Delete" className="grid h-12 place-items-center rounded-lg border-2 border-slate-900 bg-white px-2 sm:px-3">
                    <Delete className="h-5 w-5" aria-hidden />
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full">
            <FinishPanel
              key={JSON.stringify(round)}
              puzzle="word-heist"
              practice={practice}
              headline={p.won ? `Vault cracked in ${p.guesses.length}! 🔓` : "The vault stayed shut 🔒"}
              shareLines={shareLines}
              stats={stats}
            >
              <p className="mt-1 text-sm text-slate-600">
                The code was <span className="font-black uppercase tracking-widest text-slate-900">{answer}</span>
              </p>
            </FinishPanel>
            <button
              type="button"
              onClick={() => setRound({ kind: "bonus", seed: Math.floor(Math.random() * 1e6) })}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-slate-900 bg-white px-5 py-2.5 text-sm font-black shadow-[3px_3px_0_#0f172a] hover:-translate-y-0.5"
            >
              <Shuffle className="h-4 w-4" aria-hidden />
              Crack a bonus vault
            </button>
            <MoreDaily current="word-heist" games={DAILY_GAMES} clock={formatClock(msLeft)} />
          </div>
        )}
      </div>
    </DailyFrame>
  );
}

export function WordHeistRules() {
  return (
    <>
      <p>
        Guess the secret five-letter word (the vault code) in six tries. Everyone gets the same code, and a new one
        drops at midnight your time.
      </p>
      <ol className="list-decimal space-y-1.5 pl-5">
        <li>Type any real five-letter word and press Enter.</li>
        <li>
          <span className="rounded bg-lime-400 px-1 font-black text-slate-900">Green</span> with a bar: right letter,
          right spot.
        </li>
        <li>
          <span className="rounded bg-amber-300 px-1 font-black text-slate-900">Yellow</span> with a dot: the letter is
          in the word, somewhere else.
        </li>
        <li>
          <span className="rounded bg-slate-500 px-1 font-black text-white">Grey</span>: not in the word.
        </li>
        <li>Made-up words, names and typos are refused and don&apos;t use up a try.</li>
      </ol>
      <p>
        <strong>Double letters:</strong> a letter only lights up as many times as it&apos;s in the code. Guess
        &quot;sweet&quot; when the code has one E and only one E lights up.
      </p>
      <p>
        <strong>Clue:</strong> after three misses you can reveal one letter. Your share card shows you used it,
        so a clean solve still has bragging rights.
      </p>
      <p>
        <strong>Streaks:</strong> solve it each day to keep your streak going. Streaks live on this device. Missed a
        day? Play the last week as practice.
      </p>
    </>
  );
}

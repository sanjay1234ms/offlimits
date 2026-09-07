"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Eye,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  TimerReset,
} from "lucide-react";
import { useDeck } from "@/hooks/useDeck";
import { catalogBySlug, type CatalogGame } from "@/data/catalog";
import { BuzzkillGame } from "./BuzzkillGame";
import { Fast5Game } from "./Fast5Game";
import { ScoringRow } from "./ScoringRow";
import { useScoreContext } from "./ScoreContext";
import { CompetitiveFilters } from "./CompetitiveFilters";
import { useCompetitiveDeck } from "@/hooks/useCompetitiveDeck";
import { CHARADES_DECK, TRIVIA_DECK } from "@/data/competitiveDecks";
import {
  DARES,
  FAKE_NEWS,
  HOW_WELL_DO_YOU_KNOW_ME,
  MISS_A_BEAT,
  ODD_ONE_OUT_WORDS,
  SAY_IT_BACKWARDS,
  THIS_OR_THAT,
  TRUTHS,
} from "@/data/partyGamePrompts";

const SIMPLE_PROMPTS: Record<string, string[]> = {
  "this-or-that": THIS_OR_THAT,
  "fake-news-factory": FAKE_NEWS,
  "miss-a-beat": MISS_A_BEAT,
  "say-it-backwards": SAY_IT_BACKWARDS,
  "how-well-do-you-know-me": HOW_WELL_DO_YOU_KNOW_ME,
};

/* ------------------------------------------------------------------ *
 * Shared bits
 * ------------------------------------------------------------------ */

function Counter({ game, left }: { game: CatalogGame; left: string }) {
  return (
    <div
      className={`flex w-full items-center justify-between text-sm font-bold ${game.text}`}
    >
      <span>{left}</span>
      <span className="text-muted">{game.mode}</span>
    </div>
  );
}

function ThemedCard({
  game,
  stem,
  children,
}: {
  game: CatalogGame;
  stem?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`animate-card-flip relative flex min-h-[16rem] w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl border-2 bg-gradient-to-br p-6 text-center sm:min-h-[20rem] sm:p-9 ${game.border} ${game.gradient}`}
      style={{ backgroundColor: "var(--card-bg)" }}
    >
      <span className="text-3xl" aria-hidden>
        {game.emoji}
      </span>
      {stem ? (
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-subtle">
          {stem}
        </p>
      ) : null}
      <p className="text-balance text-2xl font-extrabold leading-tight text-foreground sm:text-[1.9rem] sm:leading-[1.2]">
        {children}
      </p>
    </div>
  );
}

function Controls({
  onNext,
  onRestart,
  nextLabel = "Next",
  extra,
}: {
  onNext: () => void;
  onRestart?: () => void;
  nextLabel?: string;
  extra?: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      {extra}
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={onNext}
          className="btn-primary w-full py-4 text-base sm:w-auto sm:min-w-[14rem]"
        >
          {nextLabel}
          <ArrowRight className="h-5 w-5" aria-hidden />
        </button>
        {onRestart ? (
          <button
            type="button"
            onClick={onRestart}
            className="btn-ghost w-full sm:w-auto"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Shuffle &amp; restart
          </button>
        ) : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Simple deck (This or That, Fake News, Miss a Beat, Say It Backwards,
 * How Well Do You Know Me)
 * ------------------------------------------------------------------ */

function SimpleDeck({ game, prompts }: { game: CatalogGame; prompts: string[] }) {
  const items = useMemo(
    () => prompts.map((text, i) => ({ id: `${game.slug}-${i}`, text })),
    [prompts, game.slug],
  );
  const { current, position, total, next, restart } = useDeck(
    items,
    (x) => x.id,
  );
  const [outs, setOuts] = useState(0);
  const showOuts = game.slug === "miss-a-beat";

  return (
    <div className="flex flex-col items-center gap-5">
      <Counter game={game} left={`${position} / ${total}`} />
      <ThemedCard key={current?.id} game={game} stem={game.stem}>
        {current?.text ?? ""}
      </ThemedCard>
      <Controls
        onNext={next}
        onRestart={restart}
        extra={
          showOuts ? (
            <button
              type="button"
              onClick={() => setOuts((o) => o + 1)}
              className="btn-ghost"
            >
              <Minus className="h-4 w-4" aria-hidden />
              Mark someone out · {outs}
            </button>
          ) : null
        }
      />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Truth or Dare
 * ------------------------------------------------------------------ */

function TruthOrDare({ game }: { game: CatalogGame }) {
  const truthItems = useMemo(
    () => TRUTHS.map((text, i) => ({ id: `t-${i}`, text })),
    [],
  );
  const dareItems = useMemo(
    () => DARES.map((text, i) => ({ id: `d-${i}`, text })),
    [],
  );
  const truth = useDeck(truthItems, (x) => x.id);
  const dare = useDeck(dareItems, (x) => x.id);
  const [pick, setPick] = useState<null | "truth" | "dare">(null);

  const choose = useCallback(
    (kind: "truth" | "dare") => {
      if (kind === "truth") truth.next();
      else dare.next();
      setPick(kind);
    },
    [truth, dare],
  );

  const current = pick === "truth" ? truth.current : dare.current;

  if (!pick || !current) {
    return (
      <div className="flex flex-col items-center gap-6 pt-4">
        <p className="text-lg font-extrabold text-foreground">Pick your lane</p>
        <div className="grid w-full max-w-md grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => choose("truth")}
            className="rounded-3xl border-2 border-sky-500/40 bg-sky-500/10 p-8 text-xl font-extrabold text-sky-300 transition-transform duration-200 hover:-translate-y-1"
          >
            Truth
          </button>
          <button
            type="button"
            onClick={() => choose("dare")}
            className="rounded-3xl border-2 border-rose-500/40 bg-rose-500/10 p-8 text-xl font-extrabold text-rose-300 transition-transform duration-200 hover:-translate-y-1"
          >
            Dare
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <span
        className={`rounded-full border-2 px-3 py-1 text-xs font-extrabold uppercase tracking-wide ${
          pick === "truth"
            ? "border-sky-500/50 text-sky-300"
            : "border-rose-500/50 text-rose-300"
        }`}
      >
        {pick}
      </span>
      <ThemedCard key={current.id} game={game}>
        {current.text}
      </ThemedCard>
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={() => choose("truth")}
          className="btn-ghost sm:w-auto"
        >
          Another truth
        </button>
        <button
          type="button"
          onClick={() => choose("dare")}
          className="btn-primary sm:w-auto"
        >
          Another dare
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Trivia
 * ------------------------------------------------------------------ */

function Trivia({ game }: { game: CatalogGame }) {
  const deck = useCompetitiveDeck(TRIVIA_DECK);
  const items = useMemo(
    () => deck.items.map((c) => ({ id: c.id, q: c.q, a: c.a })),
    [deck.items],
  );
  const { current, position, total, next, restart } = useDeck(
    items,
    (x) => x.id,
  );
  const [revealed, setRevealed] = useState(false);
  const [scored, setScored] = useState(false);
  const { players } = useScoreContext();

  // A filter change reshuffles the deck, clear the turn state.
  useEffect(() => {
    setRevealed(false);
    setScored(false);
  }, [deck.items]);

  const awaitingScore = revealed && players.length > 0 && !scored;

  function goNext() {
    setRevealed(false);
    setScored(false);
    next();
  }
  function doRestart() {
    setRevealed(false);
    setScored(false);
    restart();
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <CompetitiveFilters deck={deck} />
      <Counter game={game} left={`Question ${position} / ${total}`} />
      <div
        key={current?.id}
        className={`animate-card-flip flex min-h-[16rem] w-full flex-col items-center justify-center gap-5 rounded-3xl border-2 bg-gradient-to-br p-6 text-center sm:min-h-[20rem] sm:p-9 ${game.border} ${game.gradient}`}
        style={{ backgroundColor: "var(--card-bg)" }}
      >
        <span className="text-3xl" aria-hidden>
          ❓
        </span>
        <p className="text-balance text-2xl font-extrabold leading-tight text-foreground sm:text-[1.9rem]">
          {current?.q ?? ""}
        </p>
        {revealed ? (
          <p className={`text-balance text-lg font-extrabold ${game.text}`}>
            {current?.a}
          </p>
        ) : (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="btn-ghost"
          >
            <Eye className="h-4 w-4" aria-hidden />
            Reveal Answer
          </button>
        )}
      </div>

      {awaitingScore ? (
        <>
          <ScoringRow onResolved={() => setScored(true)} />
          <button type="button" onClick={doRestart} className="btn-ghost">
            <RotateCcw className="h-4 w-4" aria-hidden />
            Shuffle &amp; restart
          </button>
        </>
      ) : (
        <Controls
          onNext={goNext}
          onRestart={doRestart}
          nextLabel="Next Question"
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Charades, 60s animated timer
 * ------------------------------------------------------------------ */

function Charades({ game }: { game: CatalogGame }) {
  const deck = useCompetitiveDeck(CHARADES_DECK);
  const items = useMemo(
    () => deck.items.map((c) => ({ id: c.id, text: c.text })),
    [deck.items],
  );
  const { current, position, total, next, restart } = useDeck(
    items,
    (x) => x.id,
  );
  const [secs, setSecs] = useState(60);
  const [running, setRunning] = useState(false);
  const [scoring, setScoring] = useState(false);
  const { players } = useScoreContext();

  useEffect(() => {
    setScoring(false);
    setRunning(false);
    setSecs(60);
  }, [deck.items]);

  useEffect(() => {
    if (!running || secs <= 0) {
      if (secs <= 0 && running) setRunning(false);
      return;
    }
    const id = setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [running, secs]);

  const advance = useCallback(() => {
    next();
    setSecs(60);
    setRunning(true);
    setScoring(false);
  }, [next]);

  function gotIt() {
    if (players.length > 0) {
      setRunning(false);
      setScoring(true);
    } else {
      advance();
    }
  }

  const circumference = 2 * Math.PI * 44;
  const pct = secs / 60;
  const low = secs <= 10;

  return (
    <div className="flex flex-col items-center gap-5">
      <CompetitiveFilters deck={deck} />
      <Counter game={game} left={`Prompt ${position} / ${total}`} />

      <div
        className={`relative flex min-h-[18rem] w-full flex-col items-center justify-center gap-6 rounded-3xl border-2 bg-gradient-to-br p-6 text-center sm:min-h-[22rem] sm:p-9 ${game.border} ${game.gradient}`}
        style={{ backgroundColor: "var(--card-bg)" }}
      >
        <p
          key={current?.id}
          className="animate-card-flip text-balance text-2xl font-extrabold leading-tight text-foreground sm:text-3xl"
        >
          {current?.text ?? ""}
        </p>

        <div className="relative h-28 w-28">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.15"
              strokeWidth="8"
              className="text-foreground"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - pct)}
              className={low ? "text-red-400" : game.text}
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <span
            className={`absolute inset-0 grid place-items-center text-3xl font-extrabold ${
              low ? "text-red-400" : "text-foreground"
            }`}
          >
            {secs === 0 ? "Time!" : secs}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setRunning((r) => !r)}
            className="btn-ghost"
          >
            {running ? (
              <Pause className="h-4 w-4" aria-hidden />
            ) : (
              <Play className="h-4 w-4" aria-hidden />
            )}
            {running ? "Pause" : "Start"}
          </button>
          <button
            type="button"
            onClick={() => {
              setSecs(60);
              setRunning(false);
            }}
            className="btn-ghost"
          >
            <TimerReset className="h-4 w-4" aria-hidden />
            Reset
          </button>
        </div>
      </div>

      {scoring ? (
        <ScoringRow question="Who scored this point?" onResolved={advance} />
      ) : (
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={gotIt}
            className="btn-primary w-full py-4 text-base sm:w-auto sm:min-w-[12rem]"
          >
            Got it
          </button>
          <button
            type="button"
            onClick={advance}
            className="btn-ghost sm:w-auto"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={() => {
              restart();
              setSecs(60);
              setRunning(false);
              setScoring(false);
            }}
            className="btn-ghost sm:w-auto"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Restart
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Odd One Out, pass-the-phone secret roles
 * ------------------------------------------------------------------ */

function OddOneOut({ game }: { game: CatalogGame }) {
  const [phase, setPhase] = useState<
    "setup" | "reveal" | "discuss" | "result"
  >("setup");
  const [count, setCount] = useState(5);
  const [word, setWord] = useState("");
  const [imposter, setImposter] = useState(0);
  const [idx, setIdx] = useState(0);
  const [shown, setShown] = useState(false);

  function start() {
    setWord(
      ODD_ONE_OUT_WORDS[Math.floor(Math.random() * ODD_ONE_OUT_WORDS.length)],
    );
    setImposter(Math.floor(Math.random() * count));
    setIdx(0);
    setShown(false);
    setPhase("reveal");
  }

  function nextPlayer() {
    if (idx + 1 < count) {
      setIdx(idx + 1);
      setShown(false);
    } else {
      setPhase("discuss");
    }
  }

  if (phase === "setup") {
    return (
      <div className="flex flex-col items-center gap-6 pt-4 text-center">
        <p className="text-lg font-extrabold text-foreground">
          How many players?
        </p>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setCount((c) => Math.max(3, c - 1))}
            className="btn-ghost !px-3"
            aria-label="Fewer players"
          >
            <Minus className="h-4 w-4" aria-hidden />
          </button>
          <span className="w-14 text-4xl font-extrabold text-foreground">
            {count}
          </span>
          <button
            type="button"
            onClick={() => setCount((c) => Math.min(30, c + 1))}
            className="btn-ghost !px-3"
            aria-label="More players"
          >
            <Plus className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <p className="max-w-sm text-sm text-muted">
          One player is the odd one out and never sees the word. Pass the phone
          around so everyone checks their role in private.
        </p>
        <button type="button" onClick={start} className="btn-primary">
          Deal roles
        </button>
      </div>
    );
  }

  if (phase === "reveal") {
    const isImposter = idx === imposter;
    return (
      <div className="flex flex-col items-center gap-5 text-center">
        <Counter game={game} left={`Player ${idx + 1} / ${count}`} />
        {!shown ? (
          <button
            type="button"
            onClick={() => setShown(true)}
            className={`flex min-h-[16rem] w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 bg-gradient-to-br p-6 text-lg font-extrabold text-foreground sm:min-h-[20rem] ${game.border} ${game.gradient}`}
            style={{ backgroundColor: "var(--card-bg)" }}
          >
            <Eye className="h-8 w-8 text-muted" aria-hidden />
            Player {idx + 1}, tap to see your role
          </button>
        ) : (
          <div
            className={`flex min-h-[16rem] w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 p-6 text-center sm:min-h-[20rem] ${
              isImposter
                ? "border-red-500/50 bg-red-950/40"
                : `${game.border} ${game.gradient}`
            }`}
            style={{ backgroundColor: "var(--card-bg)" }}
          >
            {isImposter ? (
              <>
                <span className="text-3xl">🕵️</span>
                <p className="text-2xl font-extrabold text-red-300">
                  You are the odd one out
                </p>
                <p className="max-w-xs text-sm text-muted">
                  You don&apos;t know the word. Bluff, blend in, and work it
                  out.
                </p>
              </>
            ) : (
              <>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-subtle">
                  The word is
                </p>
                <p className="text-3xl font-extrabold text-foreground">
                  {word}
                </p>
              </>
            )}
            <button
              type="button"
              onClick={nextPlayer}
              className="btn-primary mt-3"
            >
              Hide &amp; pass on
            </button>
          </div>
        )}
      </div>
    );
  }

  if (phase === "discuss") {
    return (
      <div className="flex flex-col items-center gap-5 text-center">
        <div
          className={`flex min-h-[14rem] w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 bg-gradient-to-br p-6 ${game.border} ${game.gradient}`}
          style={{ backgroundColor: "var(--card-bg)" }}
        >
          <span className="text-3xl">🗣️</span>
          <p className="max-w-sm text-lg font-bold text-foreground">
            Go round the circle. Everyone gives one clue about the word without
            saying it. Then vote for the odd one out.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setPhase("result")}
          className="btn-primary"
        >
          Reveal the odd one out
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <div
        className="flex min-h-[14rem] w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 border-red-500/50 bg-red-950/40 p-6"
        style={{ backgroundColor: "var(--card-bg)" }}
      >
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-subtle">
          The odd one out was
        </p>
        <p className="text-3xl font-extrabold text-red-300">
          Player {imposter + 1}
        </p>
        <p className="mt-2 text-sm text-muted">
          The word was <span className="font-bold text-foreground">{word}</span>
        </p>
      </div>
      <button type="button" onClick={() => setPhase("setup")} className="btn-primary">
        <RotateCcw className="h-4 w-4" aria-hidden />
        Play again
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Router
 * ------------------------------------------------------------------ */

export function GameRunner({ slug }: { slug: string }) {
  const game = catalogBySlug(slug);
  if (!game || !game.engine) {
    return (
      <p className="text-sm text-muted">This game isn&apos;t available yet.</p>
    );
  }

  switch (game.engine) {
    case "truth-or-dare":
      return <TruthOrDare game={game} />;
    case "trivia":
      return <Trivia game={game} />;
    case "charades":
      return <Charades game={game} />;
    case "odd-one-out":
      return <OddOneOut game={game} />;
    case "buzzkill":
      return <BuzzkillGame game={game} />;
    case "fast-5":
      return <Fast5Game game={game} />;
    case "simple":
    default:
      return (
        <SimpleDeck game={game} prompts={SIMPLE_PROMPTS[slug] ?? THIS_OR_THAT} />
      );
  }
}

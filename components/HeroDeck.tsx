"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SampleCard {
  game: string;
  emoji: string;
  prompt: string;
  href: string;
  /** Card face colors. */
  face: string;
}

const CARDS: SampleCard[] = [
  {
    game: "Would You Rather",
    emoji: "🤔",
    prompt: "Always be 10 minutes late, or always be 20 minutes early?",
    href: "/games/would-you-rather",
    face: "from-indigo-500 to-violet-600",
  },
  {
    game: "Never Have I Ever",
    emoji: "🙈",
    prompt: "Never have I ever pretended to know a song I'd never heard.",
    href: "/games/never-have-i-ever",
    face: "from-rose-500 to-pink-600",
  },
  {
    game: "Most Likely To",
    emoji: "👉",
    prompt: "Who's most likely to become famous by accident?",
    href: "/games/most-likely-to",
    face: "from-amber-400 to-orange-500",
  },
  {
    game: "Truth or Dare",
    emoji: "😈",
    prompt: "Dare: talk in an accent until your next turn.",
    href: "/games/truth-or-dare",
    face: "from-fuchsia-500 to-purple-600",
  },
  {
    game: "Charades",
    emoji: "🎭",
    prompt: "Act it out: a cat that just got into the bathtub.",
    href: "/games/charades",
    face: "from-emerald-500 to-teal-600",
  },
  {
    game: "This or That",
    emoji: "⚡",
    prompt: "Pizza or tacos, for the rest of your life?",
    href: "/games/this-or-that",
    face: "from-sky-500 to-blue-600",
  },
];

const INTERVAL_MS = 3200;

/** Where each card sits relative to the front of the stack. */
function placement(offset: number): string {
  if (offset === 0) return "z-30 translate-y-0 rotate-0 scale-100 opacity-100";
  // Only the front card takes taps; the rest (incl. the one just thrown
  // off-screen) must not cover the buttons beside the deck.
  if (offset === 1)
    return "pointer-events-none z-20 translate-y-4 rotate-[4deg] scale-[0.94] opacity-100";
  if (offset === 2)
    return "pointer-events-none z-10 translate-y-8 -rotate-[4deg] scale-[0.88] opacity-90";
  if (offset === CARDS.length - 1)
    // Just played: thrown off to the right, away from the text.
    return "pointer-events-none z-40 translate-x-[130%] rotate-[18deg] scale-95 opacity-0";
  return "pointer-events-none z-0 translate-y-8 scale-[0.85] opacity-0";
}

/** Hero "live deck": a stack of real-style prompt cards that deals itself.
 * Tap to deal the next card; auto-deals unless the visitor prefers reduced
 * motion, and pauses on hover or while the tab is hidden. */
export function HeroDeck() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [auto, setAuto] = useState(false);

  useEffect(() => {
    setAuto(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (!auto || paused) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        setActive((a) => (a + 1) % CARDS.length);
      }
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [auto, paused]);

  const front = CARDS[active];

  return (
    <div
      className="relative mx-auto w-full max-w-[19rem] sm:max-w-sm"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[4/5]">
        {CARDS.map((card, i) => {
          const offset = (i - active + CARDS.length) % CARDS.length;
          return (
            <button
              key={card.game}
              type="button"
              tabIndex={offset === 0 ? 0 : -1}
              aria-hidden={offset !== 0}
              aria-label={`${card.game}: ${card.prompt} Tap for the next card.`}
              onClick={() => setActive((a) => (a + 1) % CARDS.length)}
              className={`absolute inset-0 flex origin-bottom flex-col justify-between overflow-hidden rounded-[2rem] border-[3px] border-slate-900 bg-gradient-to-br p-6 text-left text-white shadow-[6px_6px_0_#0f172a] transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)] will-change-transform ${card.face} ${placement(offset)}`}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-25 [background-image:radial-gradient(rgba(255,255,255,0.55)_1px,transparent_1.5px)] [background-size:14px_14px]"
              />
              <span className="relative flex items-center justify-between">
                <span className="rounded-full bg-black/25 px-3 py-1 text-xs font-extrabold uppercase tracking-wider">
                  {card.game}
                </span>
                <span className="text-4xl drop-shadow-[0_4px_0_rgba(0,0,0,0.25)]">
                  {card.emoji}
                </span>
              </span>
              <span className="relative text-balance text-2xl font-black leading-tight tracking-tight drop-shadow-[0_2px_0_rgba(0,0,0,0.2)] sm:text-[1.7rem]">
                {card.prompt}
              </span>
              <span className="relative text-xs font-bold text-white/80">
                Tap for the next card
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between gap-3">
        <div className="flex gap-1.5" aria-hidden>
          {CARDS.map((card, i) => (
            <span
              key={card.game}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === active ? "w-6 bg-accent" : "w-1.5 bg-border-strong"
              }`}
            />
          ))}
        </div>
        <Link
          href={front.href}
          className="group inline-flex items-center gap-1.5 text-sm font-extrabold text-foreground underline-offset-4 hover:underline"
        >
          Play {front.game}
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            aria-hidden
          />
        </Link>
      </div>
    </div>
  );
}

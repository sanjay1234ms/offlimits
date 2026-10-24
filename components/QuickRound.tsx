"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw, SkipForward } from "lucide-react";
import { confettiBurst } from "@/lib/confetti";
import { track } from "@/lib/analytics";
import { shuffle } from "@/lib/shuffle";

export interface QuickPrompt {
  a: string;
  b: string;
}

const DEFEND_SECONDS = 10;
const RING = 2 * Math.PI * 26;

/** A playable Would You Rather round right on the homepage: tap a side, the
 * card reacts, then a 10-second "defend it" timer runs before the next one. */
export function QuickRound({ prompts }: { prompts: QuickPrompt[] }) {
  const [deck, setDeck] = useState(prompts);
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<"a" | "b" | null>(null);
  const [left, setLeft] = useState(DEFEND_SECONDS);
  const [played, setPlayed] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  // Shuffle on the client only, so server and client render the same first card.
  useEffect(() => {
    setDeck(shuffle(prompts));
  }, [prompts]);

  useEffect(() => {
    if (!pick || left <= 0) return;
    const t = window.setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [pick, left]);

  const card = deck[i % deck.length];

  function choose(side: "a" | "b", el: HTMLElement) {
    if (pick) return;
    setPick(side);
    setLeft(DEFEND_SECONDS);
    setPlayed((p) => p + 1);
    const r = el.getBoundingClientRect();
    confettiBurst(r.left + r.width / 2, r.top + r.height / 2, 22);
    track("quick_round_pick", { round: played + 1 });
  }

  function next() {
    setPick(null);
    setLeft(DEFEND_SECONDS);
    setI((n) => n + 1);
  }

  const options: { side: "a" | "b"; text: string; tone: string }[] = [
    { side: "a", text: card.a, tone: "bg-sky-300" },
    { side: "b", text: card.b, tone: "bg-rose-300" },
  ];

  return (
    <div className="mx-auto grid max-w-content items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr]">
      <div className="text-center lg:text-left">
        <span className="inline-block -rotate-2 rounded-full border-2 border-slate-900 bg-lime-300 px-3 py-0.5 text-xs font-black uppercase tracking-wider text-slate-900 shadow-[3px_3px_0_#0f172a]">
          ⚡ Quick round
        </span>
        <h2 className="mt-3 text-balance text-3xl font-black tracking-tight text-foreground sm:text-5xl">
          Try one right now
        </h2>
        <p className="mt-2 text-pretty text-base text-muted sm:text-lg">
          Pick a side, then you&apos;ve got ten seconds to defend it out loud.
          This is the whole game, just with your friends watching.
        </p>
        <Link
          href="/games/would-you-rather"
          className="mt-5 inline-flex items-center gap-2 rounded-full border-[3px] border-slate-900 bg-yellow-300 px-6 py-3 font-extrabold text-slate-900 shadow-[4px_4px_0_#0f172a] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#0f172a] active:translate-y-0.5 active:shadow-[2px_2px_0_#0f172a]"
        >
          Play the full game
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        {played > 0 ? (
          <p className="mt-3 text-sm font-semibold text-muted motion-safe:animate-fade-up">
            {played} {played === 1 ? "round" : "rounds"} played. You&apos;re warmed up 🔥
          </p>
        ) : null}
      </div>

      <div
        ref={cardRef}
        key={i}
        className="relative rounded-[2rem] border-[3px] border-slate-900 bg-white p-5 text-slate-900 shadow-[8px_8px_0_#0f172a] motion-safe:animate-card-flip sm:p-7"
      >
        <p className="text-center text-xs font-black uppercase tracking-widest text-slate-500">
          🤔 Would you rather…
        </p>
        <div className="mt-4 grid gap-3">
          {options.map((o, k) => {
            const chosen = pick === o.side;
            const other = pick && !chosen;
            return (
              <div key={o.side} className="contents">
                <button
                  type="button"
                  onClick={(e) => choose(o.side, e.currentTarget)}
                  disabled={Boolean(pick)}
                  className={`relative rounded-2xl border-[3px] border-slate-900 px-4 py-4 text-left text-base font-extrabold leading-snug shadow-[4px_4px_0_#0f172a] transition-all duration-300 sm:text-lg ${o.tone} ${
                    chosen
                      ? "scale-[1.03] ring-4 ring-yellow-300"
                      : other
                        ? "scale-95 opacity-40 grayscale"
                        : "hover:-translate-y-1 hover:shadow-[6px_6px_0_#0f172a] active:translate-y-0.5 active:shadow-[2px_2px_0_#0f172a]"
                  }`}
                >
                  {chosen ? (
                    <span className="absolute -right-2 -top-3 rounded-full border-2 border-slate-900 bg-yellow-300 px-2 py-0.5 text-xs font-black motion-safe:animate-pop-in">
                      Your pick
                    </span>
                  ) : null}
                  {o.text}
                </button>
                {k === 0 ? (
                  <span className="mx-auto -my-1 grid h-9 w-9 place-items-center rounded-full border-[3px] border-slate-900 bg-slate-900 text-xs font-black text-white">
                    OR
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex min-h-[64px] items-center justify-center gap-4">
          {pick ? (
            left > 0 ? (
              <>
                <svg viewBox="0 0 60 60" className="h-16 w-16 -rotate-90" aria-hidden>
                  <circle cx="30" cy="30" r="26" fill="none" stroke="#e2e8f0" strokeWidth="6" />
                  <circle
                    cx="30"
                    cy="30"
                    r="26"
                    fill="none"
                    stroke={left <= 3 ? "#f43f5e" : "#0f172a"}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={RING}
                    strokeDashoffset={RING * (1 - left / DEFEND_SECONDS)}
                    style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
                  />
                </svg>
                <div>
                  <p className={`text-3xl font-black tabular-nums ${left <= 3 ? "text-rose-500 motion-safe:animate-wiggle" : ""}`} key={left}>
                    {left}s
                  </p>
                  <p className="text-sm font-bold text-slate-600">Defend it, out loud!</p>
                </div>
                <button type="button" onClick={next} className="ml-auto inline-flex items-center gap-1 rounded-full border-2 border-slate-900 px-3 py-1.5 text-xs font-black hover:bg-slate-100" aria-label="Skip to next">
                  <SkipForward className="h-3.5 w-3.5" aria-hidden />
                  Skip
                </button>
              </>
            ) : (
              <div className="flex w-full flex-col items-center gap-2 motion-safe:animate-pop-in">
                <p className="text-lg font-black">⏰ Time&apos;s up! Pass the phone.</p>
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex items-center gap-2 rounded-full border-[3px] border-slate-900 bg-lime-300 px-5 py-2 font-extrabold shadow-[3px_3px_0_#0f172a] transition-transform hover:-translate-y-0.5"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden />
                  Next question
                </button>
              </div>
            )
          ) : (
            <p className="text-sm font-bold text-slate-500">Tap a side to lock it in 👆</p>
          )}
        </div>
      </div>
    </div>
  );
}

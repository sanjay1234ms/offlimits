"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JiggleBadge } from "./HolidayFx";

const CARD =
  "rounded-[1.75rem] border-[3px] border-slate-900 bg-white text-slate-900 shadow-[6px_6px_0_#0f172a] transition-[transform,box-shadow] duration-200 ease-out hover:-translate-x-0.5 hover:-translate-y-1 hover:shadow-[9px_9px_0_#0f172a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[3px_3px_0_#0f172a]";

const TICKER = [
  { q: "Sweet or savoury?", a: "Savoury, always 🧂" },
  { q: "Snack that makes your day?", a: "Ketchup chips 🍟" },
  { q: "Colours you actually wear?", a: "Forest green 🌲" },
  { q: "Anything to avoid?", a: "No nuts please 🥜🚫" },
  { q: "Never buy yourself…", a: "Fancy hot sauce 🌶️" },
];

const PLAYERS = ["Priya", "Sam", "Jo", "Alex"];
const GIFTS = ["🕯️", "🧦", "☕", "🍫"];

function useTick(ms: number) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setTick((t) => t + 1), ms);
    return () => window.clearInterval(id);
  }, [ms]);
  return tick;
}

function QuestionnaireCard() {
  const tick = useTick(2400);
  const item = TICKER[tick % TICKER.length];
  const filled = (tick % TICKER.length) + 1;
  return (
    <Link href="/secret-santa/questionnaire" className={`${CARD} group flex flex-col gap-3 p-5 sm:p-6`}>
      <span className="flex items-center gap-4">
        <JiggleBadge emoji="📝" className="bg-amber-300" />
        <span className="min-w-0 flex-1">
          <span className="block text-lg font-black tracking-tight">Santa questionnaire</span>
          <span className="mt-0.5 block text-sm text-slate-600">
            12 quick questions so your Santa never has to guess.
          </span>
        </span>
        <ArrowRight
          className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-slate-900"
          aria-hidden
        />
      </span>
      <span
        aria-hidden
        className="block overflow-hidden rounded-2xl border-2 border-slate-900 bg-amber-50 px-3 py-2 [perspective:400px]"
      >
        <span key={tick} className="block motion-safe:animate-word-flip">
          <span className="block text-[11px] font-black uppercase tracking-wider text-slate-500">
            {item.q}
          </span>
          <span className="block truncate text-sm font-bold">{item.a}</span>
        </span>
        <span className="mt-2 flex gap-1">
          {TICKER.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                i < filled ? "bg-rose-500" : "bg-slate-200"
              }`}
            />
          ))}
        </span>
      </span>
    </Link>
  );
}

function WhiteElephantCard() {
  const tick = useTick(1700);
  // Gift i is held by player (i + tick) mod n: gifts slide one seat each tick,
  // with an occasional "STOLEN!" flash on whoever just lost theirs.
  const n = PLAYERS.length;
  const stolenFrom = tick % n;
  return (
    <Link href="/white-elephant" className={`${CARD} group flex flex-col gap-3 p-5 sm:p-6`}>
      <span className="flex items-center gap-4">
        <JiggleBadge emoji="🐘" className="bg-violet-300" />
        <span className="min-w-0 flex-1">
          <span className="block text-lg font-black tracking-tight">White Elephant</span>
          <span className="mt-0.5 block text-sm text-slate-600">
            Shuffle turns, draw from a hat, or run the whole steal-fest free.
          </span>
        </span>
        <ArrowRight
          className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-slate-900"
          aria-hidden
        />
      </span>
      <span aria-hidden className="grid grid-cols-4 gap-1.5">
        {PLAYERS.map((p, seat) => {
          const gift = GIFTS[(seat + tick) % n];
          const robbed = tick > 0 && seat === stolenFrom;
          return (
            <span
              key={p}
              className={`relative flex flex-col items-center rounded-xl border-2 border-slate-900 px-1 py-1.5 transition-colors duration-300 ${
                robbed ? "bg-rose-100" : "bg-violet-50"
              }`}
            >
              {robbed ? (
                <span className="absolute -top-2.5 rounded-full border border-slate-900 bg-rose-400 px-1.5 text-[9px] font-black uppercase text-white motion-safe:animate-pop-in">
                  stolen!
                </span>
              ) : null}
              <span key={`${gift}-${tick}`} className="text-xl motion-safe:animate-pop-in">
                {gift}
              </span>
              <span className="text-[10px] font-bold text-slate-600">{p}</span>
            </span>
          );
        })}
      </span>
    </Link>
  );
}

/** The two cards beside the Secret Santa card on the homepage. */
export function HolidayCards() {
  return (
    <div className="grid gap-5">
      <QuestionnaireCard />
      <WhiteElephantCard />
    </div>
  );
}

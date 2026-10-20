import Link from "next/link";
import { ArrowRight, Flame, Sparkles } from "lucide-react";
import { CATALOG } from "@/data/catalog";
import { ConfettiLink } from "./ConfettiLink";
import { HeroDeck } from "./HeroDeck";
import { HeroSpotlight } from "./HeroSpotlight";
import { RotatingWord } from "./RotatingWord";
import { SurpriseButton } from "./SurpriseButton";

const GAME_COUNT = CATALOG.filter((g) => !g.adult).length;

/** Party props drifting around the hero background. */
const FLOATERS = [
  {
    emoji: "🎲",
    className: "left-[3%] top-[12%] hidden text-4xl sm:block",
    delay: "0s",
  },
  {
    emoji: "🎉",
    className: "right-[5%] top-[3%] text-4xl sm:top-[8%] sm:text-5xl",
    delay: "1.2s",
  },
  {
    emoji: "🍕",
    className: "left-[44%] top-[4%] hidden text-3xl lg:block",
    delay: "2.1s",
  },
  {
    emoji: "🃏",
    className: "bottom-[6%] left-[46%] hidden text-4xl lg:block",
    delay: "0.6s",
  },
  {
    emoji: "🎤",
    className: "bottom-[4%] right-[4%] hidden text-3xl lg:block",
    delay: "1.7s",
  },
];

/** Landing hero: brand tagline, sub-copy, calls to action and a live deck
 * of sample cards dealing itself. */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <HeroSpotlight />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-24 h-72 w-72 rounded-full bg-indigo-500/25 blur-[100px] animate-float-slow"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-rose-500/20 blur-[100px] animate-float-slow [animation-delay:-3s]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-amber-400/10 blur-[90px] animate-float-slow [animation-delay:-1.5s]"
      />
      {FLOATERS.map((f) => (
        <span
          key={f.emoji}
          aria-hidden
          style={{ animationDelay: f.delay }}
          className={`pointer-events-none absolute select-none opacity-60 animate-float-slow motion-reduce:animate-none ${f.className}`}
        >
          {f.emoji}
        </span>
      ))}

      <div className="relative mx-auto grid max-w-content items-center gap-12 px-4 pb-16 pt-12 sm:px-6 sm:pt-20 lg:grid-cols-[1.15fr_1fr] lg:gap-8 lg:pb-24">
        <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
          <span className="pill animate-fade-up">
            <Sparkles className="h-3.5 w-3.5 text-rose-400" aria-hidden />
            Free · No signup · No download
          </span>

          <h1 className="animate-fade-up text-balance text-5xl font-black leading-[1.05] tracking-tight text-foreground sm:text-7xl">
            Party games with{" "}
            <span className="mt-2 inline-block -rotate-2 animate-sticker rounded-2xl border-[3px] border-slate-900 bg-yellow-300 px-3 pb-1 text-slate-900 shadow-[5px_5px_0_#0f172a] motion-reduce:animate-none sm:px-4">
              no limits
            </span>
          </h1>

          <RotatingWord />

          <p className="max-w-xl text-pretty text-base text-muted sm:text-lg">
            Would You Rather, Never Have I Ever, Truth or Dare, trivia, charades
            and more. Pick a game, pass the phone, and you&apos;re playing in
            seconds. Clean by day,{" "}
            <span className="font-bold text-rose-400">
              uncensored 18+ by night
            </span>
            . The host sets the heat.
          </p>

          <div className="flex w-full flex-col items-center gap-4 lg:items-start">
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <ConfettiLink
                href="/games/would-you-rather"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full border-[3px] border-slate-900 bg-lime-300 px-8 py-4 text-lg font-extrabold text-slate-900 shadow-[5px_5px_0_#0f172a] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#0f172a] active:translate-y-0.5 active:shadow-[2px_2px_0_#0f172a] sm:w-auto"
              >
                Play now
                <ArrowRight
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  aria-hidden
                />
              </ConfettiLink>
              <SurpriseButton className="inline-flex w-full items-center justify-center gap-2 rounded-full border-[3px] border-slate-900 bg-white px-7 py-4 text-lg font-extrabold text-slate-900 shadow-[5px_5px_0_#0f172a] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#0f172a] active:translate-y-0.5 active:shadow-[2px_2px_0_#0f172a] sm:w-auto" />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm font-semibold lg:justify-start">
              <Link
                href="#party-games"
                className="underline underline-offset-4"
              >
                Browse all games
              </Link>
              <span aria-hidden className="text-muted">
                ·
              </span>
              <Link href="/party" className="underline underline-offset-4">
                Open a party room
              </Link>
              <span aria-hidden className="text-muted">
                ·
              </span>
              <Link
                href="/play?category=18-plus&vibe=wild"
                className="inline-flex items-center gap-1 text-rose-400 underline underline-offset-4"
              >
                <Flame className="h-4 w-4" aria-hidden />
                Enter the 18+ deck
              </Link>
            </div>
          </div>

          <p className="text-xs font-semibold text-muted sm:text-sm">
            {GAME_COUNT} games · Works on every phone · Real 18+ modes, adults
            only
          </p>
        </div>

        <div className="animate-fade-up">
          <HeroDeck />
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { ArrowRight, Flame, Sparkles } from "lucide-react";
import { CATALOG } from "@/data/catalog";

const GAME_COUNT = CATALOG.filter((g) => !g.adult).length;

/** Landing hero: brand tagline, sub-copy, and primary calls to action. */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-[100px] animate-float-slow"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-rose-500/15 blur-[100px] animate-float-slow"
      />

      <div className="relative mx-auto max-w-content px-4 pb-14 pt-16 sm:px-6 sm:pt-24">
        <div className="flex flex-col items-center gap-6 text-center">
          <span className="pill animate-fade-up">
            <Sparkles className="h-3.5 w-3.5 text-rose-400" aria-hidden />
            Free · No signup · No download
          </span>

          <h1 className="animate-fade-up text-balance text-5xl font-black leading-[1.05] tracking-tight text-foreground sm:text-7xl">
            Party games with{" "}
            <span className="mt-2 inline-block -rotate-2 rounded-2xl border-[3px] border-slate-900 bg-yellow-300 px-3 pb-1 text-slate-900 shadow-[5px_5px_0_#0f172a] sm:px-4">
              no limits
            </span>
          </h1>

          <p className="max-w-xl text-pretty text-base text-muted sm:text-lg">
            Would You Rather, Never Have I Ever, Truth or Dare, trivia, charades
            and more. Pick a game, pass the phone, and you&apos;re playing in
            seconds. Clean by day,{" "}
            <span className="font-bold text-rose-400">
              uncensored 18+ by night
            </span>
            . The host sets the heat.
          </p>

          <div className="flex w-full flex-col items-center gap-3 sm:w-auto">
            <Link
              href="/games/would-you-rather"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border-[3px] border-slate-900 bg-lime-300 px-8 py-4 text-lg font-extrabold text-slate-900 shadow-[5px_5px_0_#0f172a] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_#0f172a] sm:w-auto"
            >
              Play now
              <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm font-semibold">
              <Link href="#party-games" className="underline underline-offset-4">
                Browse all games
              </Link>
              <span aria-hidden className="text-muted">·</span>
              <Link href="/party" className="underline underline-offset-4">
                Open a party room
              </Link>
              <span aria-hidden className="text-muted">·</span>
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
            {GAME_COUNT} games · Works on every phone · Real 18+ modes, adults only
          </p>
        </div>
      </div>
    </section>
  );
}

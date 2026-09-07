import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";

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

      <div className="relative mx-auto max-w-content px-4 pb-12 pt-14 sm:px-6 sm:pt-20">
        <div className="flex flex-col items-start gap-5">
          <span className="pill animate-fade-up">
            <Flame className="h-3.5 w-3.5 text-rose-400" aria-hidden />
            No filter · No setup · No app
          </span>

          <h1 className="animate-fade-up text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
            The party game with{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-rose-400 bg-clip-text text-transparent">
              zero filter.
            </span>
          </h1>

          <p className="max-w-xl text-pretty text-base text-muted sm:text-lg">
            Would You Rather, Never Have I Ever, Most Likely To, plus an 18+
            tier for when the group is ready. Pick a game, pass the phone, and
            go.
          </p>

          <div className="flex max-w-xl flex-col gap-2.5">
            <span className="hero-adult-pill inline-flex w-fit items-center gap-2 rounded-full border-2 border-red-500/60 bg-red-950/50 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-[0.15em] text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.35)] dark:animate-flame-pulse">
              🔥 18+ Uncensored Mode Included
            </span>
            <p className="text-pretty text-sm font-bold text-[#9f1239] dark:font-semibold dark:text-red-300/90 sm:text-base">
              Unlock filthy confessions, wild dares, and zero-filter late night
              questions when the drinks start flowing.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href="/games" className="btn-primary w-full sm:w-auto">
              Start playing
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/play?game=18plus"
              className="hero-adult-btn inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-red-500/60 bg-red-950/40 px-5 py-3 text-sm font-extrabold text-red-300 shadow-[0_0_22px_rgba(239,68,68,0.4)] transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 hover:bg-red-900/40 hover:shadow-[0_0_34px_rgba(239,68,68,0.6)] active:scale-95 sm:w-auto"
            >
              <Flame className="h-4 w-4" aria-hidden />
              Try 18+ mode
            </Link>
            <Link href="#party-games" className="btn-ghost w-full sm:w-auto">
              Browse games
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

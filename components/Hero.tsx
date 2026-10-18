import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

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
            <Sparkles className="h-3.5 w-3.5 text-rose-400" aria-hidden />
            Free · No signup · No download
          </span>

          <h1 className="animate-fade-up text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
            Free party games for{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-rose-400 bg-clip-text text-transparent">
              any group, on any phone.
            </span>
          </h1>

          <p className="max-w-xl text-pretty text-base text-muted sm:text-lg">
            Would You Rather, Never Have I Ever, Truth or Dare, trivia, charades
            and more. Pick a game, pass the phone, and you&apos;re playing in
            seconds. Family-safe by default, wilder when your group wants it.
          </p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/games/would-you-rather"
              className="btn-primary w-full sm:w-auto"
            >
              Play now
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="#party-games" className="btn-ghost w-full sm:w-auto">
              Browse all games
            </Link>
            <Link href="/party" className="btn-ghost w-full sm:w-auto">
              Open a party room
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

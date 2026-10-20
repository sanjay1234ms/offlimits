import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import type { CatalogGame } from "@/data/catalog";
import { logoMotion } from "@/data/logoMotion";
import { Tilt } from "./Tilt";

interface CatalogCardProps {
  game: CatalogGame;
  /** Overrides game.href (e.g. to launch the 18+ variant of a dual-deck game). */
  href?: string;
  ctaLabel?: string;
}

/** Solid art-panel colors, keyed by the hue in each game's `text` class. */
const ART: Record<string, string> = {
  indigo: "from-indigo-500 to-violet-600",
  violet: "from-violet-500 to-purple-700",
  rose: "from-rose-500 to-pink-600",
  pink: "from-pink-500 to-fuchsia-600",
  red: "from-red-600 to-rose-800",
  amber: "from-amber-400 to-orange-500",
  orange: "from-orange-500 to-red-500",
  lime: "from-lime-400 to-emerald-500",
  green: "from-emerald-500 to-teal-600",
  cyan: "from-cyan-400 to-sky-600",
};

function artFor(game: CatalogGame): string {
  const hue = /text-(\w+)-\d+/.exec(game.text)?.[1] ?? "indigo";
  return ART[hue] ?? ART.indigo;
}

/** One game tile in the catalog / selection grid: a bold color panel with
 * the game's emoji up top, details and a play button below. */
export function CatalogCard({ game, href, ctaLabel }: CatalogCardProps) {
  const adult = href?.includes("adult=1") || game.adult;

  return (
    <Tilt>
      <Link
        href={href ?? game.href}
        className={`tactile-card group relative flex h-full flex-col overflow-hidden rounded-3xl border-2 bg-card bg-gradient-to-br transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1.5 active:scale-[0.98] ${game.border} ${game.gradient} ${
          adult
            ? "is-adult shadow-[0_0_26px_rgba(239,68,68,0.3)] hover:shadow-[0_0_40px_rgba(239,68,68,0.5)]"
            : "hover:shadow-[0_24px_50px_-20px_rgba(0,0,0,0.6)]"
        }`}
      >
        <div
          className={`relative flex h-28 items-center justify-center overflow-hidden bg-gradient-to-br sm:h-32 ${artFor(game)}`}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-25 [background-image:radial-gradient(rgba(255,255,255,0.6)_1px,transparent_1.5px)] [background-size:14px_14px]"
          />
          <span
            aria-hidden
            className="logo-depth-back pointer-events-none absolute -bottom-6 -right-4 select-none"
          >
            <span className="block text-8xl opacity-20 blur-[1px] transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110">
              {game.emoji}
            </span>
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/30 opacity-0 transition-[transform,opacity] duration-700 ease-out group-hover:translate-x-[450%] group-hover:opacity-100"
          />
          <span className="logo-depth-front relative">
            <span
              data-motion={logoMotion(game.slug)}
              className={`game-logo block text-6xl drop-shadow-[0_6px_0_rgba(0,0,0,0.22)] sm:text-7xl ${
                adult ? "animate-flame-pulse rounded-2xl" : ""
              }`}
            >
              {game.emoji}
            </span>
          </span>
          {adult ? (
            <span className="catalog-adult-badge absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border-2 border-red-500/60 bg-red-950/70 px-2 py-0.5 text-[0.65rem] font-extrabold text-red-300">
              <Lock className="h-2.5 w-2.5" aria-hidden />
              18+
            </span>
          ) : null}
          <span className="absolute left-3 top-3 rounded-full bg-black/25 px-2 py-0.5 text-[0.65rem] font-extrabold uppercase tracking-wider text-white">
            {game.players}
          </span>
        </div>

        <div className="relative flex flex-1 flex-col gap-3 p-5">
          <div>
            <h3 className="text-lg font-extrabold tracking-tight text-[#0f172a] dark:text-foreground">
              {game.title}
            </h3>
            <p className="mt-1 text-sm font-medium leading-snug text-[#1e293b] dark:font-normal dark:text-muted">
              {game.blurb}
            </p>
          </div>

          <div className="mt-auto flex items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap gap-1.5">
              {[game.time, game.mode].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-black/15 bg-black/[0.06] px-2 py-0.5 text-[0.65rem] font-bold text-[#0f172a] dark:border-white/10 dark:bg-white/5 dark:font-semibold dark:text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
            <span
              className={`catalog-cta inline-flex shrink-0 items-center gap-1 rounded-full text-xs font-extrabold transition-colors dark:bg-white/10 dark:px-3 dark:py-1.5 dark:text-foreground dark:group-hover:bg-white dark:group-hover:text-slate-900 ${game.text}`}
            >
              {ctaLabel ?? (adult ? "Enter the 18+ deck" : "Play now")}
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </span>
          </div>
        </div>
      </Link>
    </Tilt>
  );
}

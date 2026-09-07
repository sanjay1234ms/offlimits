import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import type { CatalogGame } from "@/data/catalog";

interface CatalogCardProps {
  game: CatalogGame;
  /** Overrides game.href (e.g. to launch the 18+ variant of a dual-deck game). */
  href?: string;
  ctaLabel?: string;
}

/** One game tile in the catalog / selection grid. */
export function CatalogCard({ game, href, ctaLabel }: CatalogCardProps) {
  const adult = href?.includes("adult=1") || game.adult;

  return (
    <Link
      href={href ?? game.href}
      className={`tactile-card group relative flex flex-col gap-3 overflow-hidden rounded-3xl border-2 bg-gradient-to-br p-5 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.02] sm:p-6 ${game.border} ${game.gradient} ${
        adult
          ? "is-adult shadow-[0_0_26px_rgba(239,68,68,0.3)] hover:shadow-[0_0_40px_rgba(239,68,68,0.5)]"
          : "hover:shadow-[0_24px_50px_-20px_rgba(0,0,0,0.6)]"
      }`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-14 -top-14 hidden h-36 w-36 rounded-full bg-white/10 blur-3xl transition-opacity duration-300 group-hover:opacity-80 dark:block"
      />

      <div className="relative flex items-start justify-between">
        <span
          className={`grid h-12 w-12 place-items-center rounded-2xl border border-black/10 bg-white/10 text-2xl ring-1 ring-white/15 transition-transform duration-300 group-hover:scale-110 dark:border-transparent ${
            adult ? "animate-flame-pulse border-2" : ""
          }`}
        >
          {game.emoji}
        </span>
        {adult ? (
          <span className="catalog-adult-badge inline-flex items-center gap-1 rounded-full border-2 border-red-500/60 bg-red-950/50 px-2 py-0.5 text-[0.65rem] font-extrabold text-red-300">
            <Lock className="h-2.5 w-2.5" aria-hidden />
            18+
          </span>
        ) : null}
      </div>

      <div className="relative">
        <h3 className="text-base font-extrabold tracking-tight text-[#0f172a] dark:text-foreground">
          {game.title}
        </h3>
        <p className="mt-1 text-sm font-medium leading-snug text-[#1e293b] dark:font-normal dark:text-muted">
          {game.blurb}
        </p>
      </div>

      <div className="relative mt-auto flex flex-wrap gap-1.5 pt-1">
        {[game.players, game.time, game.mode].map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-black/15 bg-black/[0.06] px-2 py-0.5 text-[0.65rem] font-bold text-[#0f172a] dark:border-white/10 dark:bg-white/5 dark:font-semibold dark:text-foreground/75"
          >
            {tag}
          </span>
        ))}
      </div>

      <span
        className={`catalog-cta relative inline-flex w-fit items-center gap-1 text-xs font-extrabold ${game.text} dark:bg-transparent dark:p-0`}
      >
        {ctaLabel ?? (adult ? "Enter the 18+ deck" : "Play now")}
        <ArrowRight
          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden
        />
      </span>
    </Link>
  );
}

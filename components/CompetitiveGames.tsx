import { Trophy } from "lucide-react";
import { CATALOG } from "@/data/catalog";
import { COMPETITIVE_TAGLINE } from "@/data/competitive";
import { CatalogCard } from "./CatalogCard";

/** Homepage "Competitive Games" section, scored games with a podium finish. */
export function CompetitiveGames() {
  const games = CATALOG.filter((g) => g.competitive && !g.adult);

  return (
    <section className="mx-auto max-w-content px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-2">
        <h2 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          <Trophy className="h-6 w-6 text-amber-400" aria-hidden />
          Competitive Games
        </h2>
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border-2 border-amber-400/50 bg-amber-500/10 px-3 py-1 text-xs font-extrabold text-amber-300">
          {COMPETITIVE_TAGLINE}
        </span>
        <p className="mt-1 max-w-2xl text-pretty text-sm text-muted sm:text-base">
          Keep score on a slim tap-to-adjust bar, then hit{" "}
          <span className="font-semibold text-foreground">
            Finish &amp; Crown Winner
          </span>{" "}
          for a podium and a shareable story card.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <CatalogCard
            key={game.slug}
            game={game}
            ctaLabel="Keep score"
          />
        ))}
      </div>
    </section>
  );
}

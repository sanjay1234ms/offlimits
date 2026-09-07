import { CATALOG } from "@/data/catalog";
import { CatalogCard } from "./CatalogCard";

/** The homepage catalog grid. 18+ content is hidden here, it lives behind
 * the age gate on the /games selection screen. */
export function GameCatalog() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {CATALOG.filter((game) => !game.adult).map((game) => (
        <CatalogCard key={game.slug} game={game} />
      ))}
    </div>
  );
}

"use client";

import { useState } from "react";
import { CATALOG, type CatalogVibe } from "@/data/catalog";
import { CatalogCard } from "./CatalogCard";
import { Reveal } from "./Reveal";

const GAMES = CATALOG.filter((game) => !game.adult);

const VIBES: { id: CatalogVibe | "All"; label: string }[] = [
  { id: "All", label: "✨ All" },
  { id: "Icebreaker", label: "🧊 Icebreakers" },
  { id: "Funny", label: "😂 Funny" },
  { id: "Competitive", label: "🏆 Competitive" },
  { id: "Revealing", label: "🤫 Revealing" },
  { id: "Quick fire", label: "⚡ Quick fire" },
];

/** The homepage catalog grid with quick vibe filters. 18+ content is hidden
 * here, it lives behind the age gate on the /games selection screen. Every
 * card is in the server-rendered HTML (the default filter is "All"). */
export function GameCatalog() {
  const [vibe, setVibe] = useState<CatalogVibe | "All">("All");
  const [touched, setTouched] = useState(false);

  const games =
    vibe === "All" ? GAMES : GAMES.filter((g) => g.vibes.includes(vibe));

  return (
    <div>
      <div
        role="group"
        aria-label="Filter games by vibe"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-4 no-scrollbar sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {VIBES.map((v) => (
          <button
            key={v.id}
            type="button"
            aria-pressed={vibe === v.id}
            onClick={() => {
              setVibe(v.id);
              setTouched(true);
            }}
            className="filter-chip shrink-0"
          >
            {v.label}
          </button>
        ))}
      </div>

      <div
        key={vibe}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {games.map((game, i) =>
          touched ? (
            <div
              key={game.slug}
              className="h-full animate-pop-in [animation-fill-mode:both]"
              style={{ animationDelay: `${i * 45}ms` }}
            >
              <CatalogCard game={game} />
            </div>
          ) : (
            <Reveal key={game.slug} delay={(i % 3) * 90} className="h-full">
              <CatalogCard game={game} />
            </Reveal>
          ),
        )}
      </div>
    </div>
  );
}

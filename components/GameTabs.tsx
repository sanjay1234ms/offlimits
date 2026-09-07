"use client";

import type { GameDeck } from "@/types";
import { gameTheme } from "@/lib/gameTheme";

interface GameTabsProps {
  decks: GameDeck[];
  activeId: string;
  onSelect: (id: string) => void;
}

/** Segmented tab control for switching between starter games, each tinted
 * with its own neon personality when active. */
export function GameTabs({ decks, activeId, onSelect }: GameTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Starter games"
      className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 no-scrollbar"
    >
      {decks.map((deck) => {
        const active = deck.id === activeId;
        const theme = gameTheme(deck.id);
        return (
          <button
            key={deck.id}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onSelect(deck.id)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-[transform,background-color,border-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 ${
              active
                ? `bg-gradient-to-br text-foreground ${theme.gradient} ${theme.border} ${theme.ring}`
                : "border-white/10 bg-white/5 text-muted backdrop-blur hover:border-white/25 hover:text-foreground"
            }`}
          >
            <span aria-hidden className="text-base leading-none">
              {deck.emoji}
            </span>
            {deck.title}
          </button>
        );
      })}
    </div>
  );
}

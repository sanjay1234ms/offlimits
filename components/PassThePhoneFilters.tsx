"use client";

import { useState } from "react";
import { Bomb, SlidersHorizontal, X } from "lucide-react";
import { countActiveFilters, filterGroups } from "@/data/filters";
import { ADULT_CATEGORY } from "@/lib/monetization";
import { heatEmoji, heatTierLabel, type HeatCategory } from "@/lib/intensity";
import type { PromptFilters } from "@/types";
import { IntensityDial } from "./games/IntensityDial";

interface PassThePhoneFiltersProps {
  filters: PromptFilters;
  onToggle: (group: keyof PromptFilters, value: string) => void;
  onClear: () => void;
  /** Strict-match prompt count for the header. */
  resultCount: number;
  intensity: number;
  onIntensity: (level: number) => void;
  heatCategory: HeatCategory;
  /** Heat-filtered count for the Spicy Meter description. */
  matchCount: number;
  /** Most Likely To / This or That also get the Hot Potato timer toggle. */
  showSpeedBomb: boolean;
  speedBomb: boolean;
  onSpeedBomb: (on: boolean) => void;
}

/** The unified filter card for the pass-the-phone games, Category / Group size
 * / Vibe pills and the neon Spicy Meter in one collapsible glass container,
 * matching the competitive games. */
export function PassThePhoneFilters({
  filters,
  onToggle,
  onClear,
  resultCount,
  intensity,
  onIntensity,
  heatCategory,
  matchCount,
  showSpeedBomb,
  speedBomb,
  onSpeedBomb,
}: PassThePhoneFiltersProps) {
  const active = countActiveFilters(filters);
  // Start collapsed so the first question sits above the fold on phones;
  // stay open when a link arrived with filters already applied.
  const [open, setOpen] = useState(() => active > 0);

  return (
    <div className="glass-card mx-auto mb-6 w-full max-w-xl p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-sm font-bold tracking-tight text-foreground">
          <SlidersHorizontal className="h-4 w-4 text-accent" aria-hidden />
          Filters
          <span className="font-semibold text-muted">
            · {resultCount} prompts
          </span>
        </span>
        <div className="flex items-center gap-2">
          {active > 0 ? (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-bold text-muted transition-transform duration-100 hover:text-foreground active:scale-95"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
              Clear ({active})
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="inline-flex items-center gap-1 text-xs font-bold text-muted transition-colors hover:text-foreground"
          >
            Filters {open ? "▴" : "▾"}
          </button>
        </div>
      </div>

      {open ? (
        <div className="mt-4 flex flex-col gap-3">
          {filterGroups.map((group) => (
            <div
              key={group.key}
              className="flex flex-wrap items-center gap-2"
            >
              <span className="w-20 shrink-0 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-subtle">
                {group.label}
              </span>
              <div className="-mx-1 flex flex-1 flex-wrap gap-2 px-1">
                {group.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={(filters[group.key] as string[]).includes(
                      option,
                    )}
                    onClick={() => onToggle(group.key, option)}
                    className={`filter-chip${option === ADULT_CATEGORY ? " is-adult" : ""}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Nested neon Spicy Meter */}
          <div className="mt-1 border-t border-white/10 pt-3.5">
            <IntensityDial value={intensity} onChange={onIntensity} />
            <p className="mt-2 text-xs font-semibold text-muted">
              {heatEmoji(intensity)} {heatTierLabel(heatCategory, intensity)} ·{" "}
              {matchCount} cards in play
            </p>

            {showSpeedBomb ? (
              <button
                type="button"
                aria-pressed={speedBomb}
                onClick={() => onSpeedBomb(!speedBomb)}
                className={`mt-3 inline-flex items-center gap-1.5 rounded-xl border-2 px-3 py-1.5 text-xs font-extrabold transition-transform duration-100 active:scale-95 ${
                  speedBomb
                    ? "border-transparent bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-[0_0_18px_rgba(239,68,68,0.55)]"
                    : "border-white/15 bg-white/5 text-muted hover:border-red-400/50 hover:text-foreground"
                }`}
              >
                <Bomb className="h-3.5 w-3.5" aria-hidden />
                Hot potato · {speedBomb ? "10s timer on" : "off"}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

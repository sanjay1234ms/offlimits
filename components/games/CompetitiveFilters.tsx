"use client";

import { Lock, SlidersHorizontal, X } from "lucide-react";
import { IntensityDial } from "./IntensityDial";
import { AgeGateModal } from "../AgeGateModal";
import { PaywallOverlay } from "../PaywallOverlay";
import {
  categoryOptions,
  groupSizeOptions,
  vibeOptions,
} from "@/data/filters";
import { ADULT_CATEGORY } from "@/lib/monetization";
import { heatEmoji, heatTierLabel } from "@/lib/intensity";
import type { CompCardBase } from "@/data/competitiveDecks";
import type { CompDeck } from "@/hooks/useCompetitiveDeck";

interface RowProps {
  label: string;
  group: "category" | "vibe" | "groupSize";
  options: readonly string[];
  selected: string[];
  onToggle: (group: "category" | "vibe" | "groupSize", value: string) => void;
}

function Row({ label, group, options, selected, onToggle }: RowProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-20 shrink-0 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-subtle">
        {label}
      </span>
      <div className="-mx-1 flex flex-1 flex-wrap gap-2 px-1">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            aria-pressed={selected.includes(opt)}
            onClick={() => onToggle(group, opt)}
            className={`filter-chip${opt === ADULT_CATEGORY ? " is-adult" : ""}`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

/** The full filter container, Category / Group size / Vibe pills plus the
 * live neon Spicy Meter, dropped above a competitive game's card. */
export function CompetitiveFilters({ deck }: { deck: CompDeck<CompCardBase> }) {
  return (
    <div className="glass-card flex w-full flex-col gap-3.5 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-sm font-bold tracking-tight text-foreground">
          <SlidersHorizontal className="h-4 w-4 text-accent" aria-hidden />
          Filters
          <span className="font-semibold text-muted">
            · {deck.matchCount} cards
          </span>
        </span>
        {deck.activeCount > 0 ? (
          <button
            type="button"
            onClick={deck.clear}
            className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-bold text-muted transition-transform duration-100 hover:text-foreground active:scale-95"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
            Clear ({deck.activeCount})
          </button>
        ) : null}
      </div>

      <Row
        label="Category"
        group="category"
        options={categoryOptions}
        selected={deck.filters.category}
        onToggle={deck.toggle}
      />
      <Row
        label="Group size"
        group="groupSize"
        options={groupSizeOptions}
        selected={deck.filters.groupSize}
        onToggle={deck.toggle}
      />
      <Row
        label="Vibe"
        group="vibe"
        options={vibeOptions}
        selected={deck.filters.vibe}
        onToggle={deck.toggle}
      />

      {/* Nested neon Spicy Meter */}
      <div className="mt-1 border-t border-white/10 pt-3.5">
        <IntensityDial value={deck.filters.heat} onChange={deck.setHeat} />
        <p className="mt-2 text-xs font-semibold text-muted">
          {heatEmoji(deck.filters.heat)}{" "}
          {heatTierLabel(deck.heatCategory, deck.filters.heat)} ·{" "}
          {deck.matchCount} cards in play
        </p>
      </div>

      {deck.locked ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-rose-500/40 bg-rose-950/40 px-3 py-2 text-xs font-bold text-rose-300 shadow-[0_0_18px_rgba(244,63,94,0.25)]">
          <span className="inline-flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5" aria-hidden />
            Preview: {deck.previewCap} free 18+ cards, then unlock
          </span>
          <button
            type="button"
            onClick={deck.openPaywall}
            className="rounded-full border border-rose-400/60 px-2.5 py-0.5 transition-transform duration-100 hover:bg-rose-500/20 active:scale-95"
          >
            Unlock full deck
          </button>
        </div>
      ) : null}

      {deck.paywallOpen ? (
        <div className="relative min-h-[19rem]">
          <PaywallOverlay onUnlock={deck.unlock} />
          <button
            type="button"
            onClick={deck.closePaywall}
            className="absolute right-2 top-2 z-30 rounded-full border border-white/20 bg-black/40 px-2 py-0.5 text-xs font-bold text-white/80 hover:text-white"
          >
            Maybe later
          </button>
        </div>
      ) : null}

      <AgeGateModal
        open={deck.ageGateOpen}
        onConfirm={deck.confirmAge}
        onCancel={deck.cancelAge}
      />
    </div>
  );
}

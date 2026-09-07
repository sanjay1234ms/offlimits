"use client";

import { useCallback, useMemo, useState } from "react";
import { useAdultPreview } from "./useAdultPreview";
import { useScoreContext } from "@/components/games/ScoreContext";
import { DEFAULT_INTENSITY, type HeatCategory } from "@/lib/intensity";
import {
  ADULT_CATEGORY,
  persistAgeConfirmed,
  readAgeConfirmed,
} from "@/lib/monetization";
import { GROUP_SIZE_MIN, MIN_PLAYERS } from "@/data/competitive";
import {
  emptyCompFilters,
  filterComp,
  type CompCardBase,
  type CompFilterState,
} from "@/data/competitiveDecks";
import type { PromptCategory, Vibe } from "@/types";

type FilterGroup = "category" | "vibe" | "groupSize";

export interface CompDeck<T extends CompCardBase> {
  /** Cards after filtering (sliced to the preview cap while 18+ is locked). */
  items: T[];
  matchCount: number;
  filters: CompFilterState;
  heatCategory: HeatCategory;
  toggle: (group: FilterGroup, value: string) => void;
  setHeat: (n: number) => void;
  clear: () => void;
  activeCount: number;
  adultActive: boolean;
  /** 18+ selected but the Party Pass isn't active. */
  locked: boolean;
  previewCap: number;
  unlock: () => void;
  paywallOpen: boolean;
  openPaywall: () => void;
  closePaywall: () => void;
  ageGateOpen: boolean;
  confirmAge: () => void;
  cancelAge: () => void;
}

/** The shared filter + Spicy Meter + 18+ gate for a competitive game's card
 * dataset. Mirrors the pass-the-phone deck behaviour. */
export function useCompetitiveDeck<T extends CompCardBase>(
  all: T[],
): CompDeck<T> {
  const [filters, setFilters] = useState<CompFilterState>(() =>
    emptyCompFilters(DEFAULT_INTENSITY),
  );
  const [ageGateOpen, setAgeGateOpen] = useState(false);
  const preview = useAdultPreview();
  const { syncCount } = useScoreContext();

  /** Roster baseline for the current group-size selection (largest tier wins;
   * nothing selected → MIN_PLAYERS). */
  const rosterTargetFor = useCallback((sizes: string[]) => {
    if (sizes.length === 0) return MIN_PLAYERS;
    return Math.max(
      ...sizes.map((s) => GROUP_SIZE_MIN[s] ?? MIN_PLAYERS),
    );
  }, []);

  const adultActive = filters.category.includes(ADULT_CATEGORY);
  const locked = adultActive && preview.hydrated && !preview.unlocked;

  const filtered = useMemo(() => filterComp(all, filters), [all, filters]);
  const items = useMemo(
    () => (locked ? filtered.slice(0, preview.cap) : filtered),
    [locked, filtered, preview.cap],
  );

  const heatCategory: HeatCategory = adultActive
    ? "adult"
    : filters.category.includes("Couples")
      ? "couples"
      : filters.category.includes("Office")
        ? "office"
        : "general";

  const applyToggle = useCallback((group: FilterGroup, value: string) => {
    setFilters((prev) => {
      const cur = prev[group] as string[];
      const next = cur.includes(value)
        ? cur.filter((v) => v !== value)
        : [...cur, value];
      return { ...prev, [group]: next } as CompFilterState;
    });
  }, []);

  const toggle = useCallback(
    (group: FilterGroup, value: string) => {
      if (group === "groupSize") {
        const nextSizes = filters.groupSize.includes(value)
          ? filters.groupSize.filter((v) => v !== value)
          : [...filters.groupSize, value];
        // Expand → add default players; scale down / clear → trim trailing
        // unedited defaults back to the tier baseline.
        syncCount(rosterTargetFor(nextSizes));
        setFilters((prev) => ({ ...prev, groupSize: nextSizes }));
        return;
      }
      if (group === "category" && value === ADULT_CATEGORY) {
        const turningOn = !filters.category.includes(ADULT_CATEGORY);
        if (turningOn && !readAgeConfirmed()) {
          setAgeGateOpen(true);
          return;
        }
      }
      applyToggle(group, value as PromptCategory | Vibe);
    },
    [
      applyToggle,
      syncCount,
      rosterTargetFor,
      filters.category,
      filters.groupSize,
    ],
  );

  const setHeat = useCallback(
    (n: number) => setFilters((prev) => ({ ...prev, heat: n })),
    [],
  );

  const clear = useCallback(() => {
    setFilters(emptyCompFilters(DEFAULT_INTENSITY));
    syncCount(MIN_PLAYERS);
  }, [syncCount]);

  const confirmAge = useCallback(() => {
    persistAgeConfirmed();
    setAgeGateOpen(false);
    applyToggle("category", ADULT_CATEGORY);
  }, [applyToggle]);

  const cancelAge = useCallback(() => setAgeGateOpen(false), []);

  return {
    items,
    matchCount: items.length,
    filters,
    heatCategory,
    toggle,
    setHeat,
    clear,
    activeCount:
      filters.category.length + filters.vibe.length + filters.groupSize.length,
    adultActive,
    locked,
    previewCap: preview.cap,
    unlock: preview.unlock,
    paywallOpen: preview.paywallOpen,
    openPaywall: preview.openPaywall,
    closePaywall: preview.closePaywall,
    ageGateOpen,
    confirmAge,
    cancelAge,
  };
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, X } from "lucide-react";
import { AgeGateModal } from "./AgeGateModal";
import { AdultCardDeck, CardDeck } from "./CardDeck";
import { PassThePhoneFilters } from "./PassThePhoneFilters";
import { GameGuide } from "./GameGuide";
import { GameTabs } from "./GameTabs";
import { TruthOrDareDeck } from "./games/TruthOrDareDeck";
import { SuggestHelper } from "./games/SuggestHelper";
import { GameControlBar } from "./games/GameControlBar";
import {
  DEFAULT_INTENSITY,
  withinIntensity,
  type HeatCategory,
} from "@/lib/intensity";
import {
  decks,
  deckById,
  emptyFilters,
  filterPrompts,
  makeFilters,
} from "@/data/prompts";
import { adultDeckFor } from "@/data/adultDeck";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { usePartyPass } from "@/hooks/usePartyPass";
import { ADULT_CATEGORY, STORAGE_KEYS } from "@/lib/monetization";
import { corePageForGame } from "@/data/corePages";
import type {
  PromptCategory,
  PromptFilters,
  PromptGame,
  PromptOccasion,
  Vibe,
} from "@/types";

interface PlayScreenProps {
  /** Pre-applies an occasion filter (used by /occasions/[slug]). */
  initialOccasion?: PromptOccasion;
  /** Pre-selects a game tab, or "18plus" to enter the gated 18+ deck. */
  initialGame?: string;
  /** From `?adult=1`, enter 18+ mode for whatever game is selected. */
  initialAdult?: boolean;
  /** From `?category=`, activates that category pill (footer occasion links). */
  initialCategory?: string;
  /** From `?vibe=`, activates that vibe pill (footer occasion links). */
  initialVibe?: string;
  /** Page heading override, used by the per-game SEO pages. */
  heading?: string;
  /** Intro paragraph override shown under the heading in normal mode. */
  intro?: string;
  /** When set, game tabs navigate to each game's own page instead of
   * switching in place, so the URL always matches the game on screen. */
  linkTabs?: boolean;
}

/** Any identifier that means "enter 18+ mode", every entry point maps here. */
function isAdultRequest(value: string | undefined): boolean {
  if (!value) return false;
  const v = value.toLowerCase();
  return v === "18plus" || v === "18+" || v === "adult" || v === "18";
}

const CATEGORY_ALIASES: Record<string, PromptCategory> = {
  friends: "Friends",
  office: "Office",
  couples: "Couples",
  "18+": "18+",
  "18": "18+",
  "18plus": "18+",
  "18-plus": "18+",
  adult: "18+",
};

const VIBE_ALIASES: Record<string, Vibe> = {
  icebreaker: "Icebreaker",
  funny: "Funny",
  revealing: "Revealing",
  wild: "Wild",
};

export function PlayScreen({
  initialOccasion,
  initialGame,
  initialAdult,
  initialCategory,
  initialVibe,
  heading,
  intro,
  linkTabs,
}: PlayScreenProps) {
  const router = useRouter();
  const reqCategory = initialCategory
    ? CATEGORY_ALIASES[initialCategory.toLowerCase()]
    : undefined;
  const reqVibe = initialVibe
    ? VIBE_ALIASES[initialVibe.toLowerCase()]
    : undefined;

  const wantsAdult =
    isAdultRequest(initialGame) ||
    initialAdult === true ||
    reqCategory === "18+";

  const startId: PromptGame =
    decks.find((d) => d.id === initialGame)?.id ?? decks[0].id;
  const [activeId, setActiveId] = useState<PromptGame>(startId);
  const [filters, setFilters] = useState<PromptFilters>(() =>
    makeFilters({
      occasion: initialOccasion ? [initialOccasion] : [],
      // 18+ is applied via the age-gate flow below, not seeded directly.
      category: reqCategory && reqCategory !== "18+" ? [reqCategory] : [],
      vibe: reqVibe ? [reqVibe] : [],
    }),
  );

  const [ageConfirmed, setAgeConfirmed, ageHydrated] = useLocalStorage(
    STORAGE_KEYS.ageConfirmed,
    false,
  );
  const [ageGateOpen, setAgeGateOpen] = useState(false);
  // True while a URL-driven 18+ entry is still resolving (age check pending).
  const [adultEntryPending, setAdultEntryPending] = useState(wantsAdult);

  const partyPass = usePartyPass();

  const deck = deckById(activeId) ?? decks[0];

  const filtered = useMemo(
    () => filterPrompts(deck.prompts, filters),
    [deck, filters],
  );

  // Live "Spicy Meter", re-filters the deck on the fly, never restarts it.
  const [intensity, setIntensity] = useState(DEFAULT_INTENSITY);
  const [speedBomb, setSpeedBomb] = useState(false);

  const heatFiltered = useMemo(() => {
    const hot = filtered.filter((p) =>
      withinIntensity(p.intensity, p.text, p.isAdult, intensity),
    );
    return hot.length > 0 ? hot : filtered;
  }, [filtered, intensity]);

  const adultHeatDeck = useMemo(() => {
    const full = adultDeckFor(activeId);
    const hot = full.filter((c) =>
      withinIntensity(c.intensity, c.prompt, true, intensity),
    );
    return hot.length > 0 ? hot : full;
  }, [activeId, intensity]);

  const showSpeedBomb =
    activeId === "most_likely_to" || activeId === "this_or_that";

  // The single source of truth for 18+ mode: the "18+" category is selected.
  const adultMode = filters.category.includes(ADULT_CATEGORY);

  // Spicy Meter copy follows the active category, "filthy" talk is 18+ only.
  const heatCategory: HeatCategory = adultMode
    ? "adult"
    : filters.category.includes("Couples")
      ? "couples"
      : filters.category.includes("Office")
        ? "office"
        : "general";

  /** Puts the screen into 18+ mode, identical to selecting the filter pill. */
  const enterAdultMode = useCallback(() => {
    setFilters((prev) =>
      prev.category.includes(ADULT_CATEGORY)
        ? prev
        : { ...prev, category: [...prev.category, ADULT_CATEGORY] },
    );
  }, []);

  // Resolve a URL-driven 18+ entry once we know the stored age-confirm state.
  useEffect(() => {
    if (!adultEntryPending || !ageHydrated) return;
    if (ageConfirmed) {
      enterAdultMode();
      setAdultEntryPending(false);
    } else {
      setAgeGateOpen(true);
      // Keep pending true, the placeholder stays until the user answers.
    }
  }, [adultEntryPending, ageHydrated, ageConfirmed, enterAdultMode]);

  function applyToggle(group: keyof PromptFilters, value: string) {
    setFilters((prev) => {
      const current = prev[group] as string[];
      const nextValues = current.includes(value)
        ? current.filter((entry) => entry !== value)
        : [...current, value];
      return { ...prev, [group]: nextValues } as PromptFilters;
    });
  }

  function toggleFilter(group: keyof PromptFilters, value: string) {
    const turningOn = !(filters[group] as string[]).includes(value);
    if (
      group === "category" &&
      value === ADULT_CATEGORY &&
      turningOn &&
      !ageConfirmed
    ) {
      setAgeGateOpen(true);
      return;
    }
    applyToggle(group, value);
  }

  function confirmAge() {
    setAgeConfirmed(true);
    setAgeGateOpen(false);
    enterAdultMode();
    setAdultEntryPending(false);
  }

  function cancelAge() {
    setAgeGateOpen(false);
    setAdultEntryPending(false);
  }

  const showResolving = adultEntryPending && !adultMode;
  const isTruthOrDare = activeId === "truth_or_dare";

  /** The "💡 Suggest …" helper for games that support it. */
  const suggestFooter =
    activeId === "most_likely_to" ? (
      <SuggestHelper type="scenario" adult={adultMode} />
    ) : activeId === "never_have_i_ever" ? (
      <SuggestHelper type="confession" adult={adultMode} />
    ) : undefined;

  return (
    <div className="min-h-dvh bg-background pb-24">
      <div className="mx-auto max-w-content px-4 pt-8 sm:px-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {heading ?? "Pass-the-phone games"}
        </h1>
        <p className="mt-1.5 max-w-xl text-sm text-muted sm:text-base">
          {isTruthOrDare
            ? (intro ??
              "Choose your packs, then take Truth, Dare, or let the phone decide.")
            : adultMode || showResolving
              ? "All five games, uncensored. Three free preview cards per game, then unlock the rest. Switch games with the tabs above."
              : intro ??
                "Pick a game, dial in the filters, and hand the phone around. One question at a time, shuffled so nothing repeats until the deck is done."}
        </p>

        {filters.occasion.length > 0 ? (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {filters.occasion.map((occasion) => (
              <span
                key={occasion}
                className="inline-flex items-center gap-1.5 rounded-full border border-accent bg-[color:var(--accent-soft)] px-3 py-1.5 text-xs font-bold text-foreground shadow-[0_0_0_3px_var(--accent-soft)]"
              >
                <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden />
                {occasion}
                <button
                  type="button"
                  aria-label={`Remove ${occasion} filter`}
                  onClick={() => applyToggle("occasion", occasion)}
                  className="ml-0.5 rounded-full p-0.5 text-muted transition-colors hover:text-foreground"
                >
                  <X className="h-3 w-3" aria-hidden />
                </button>
              </span>
            ))}
            <Link
              href="/play"
              className="text-xs font-semibold text-muted underline-offset-2 hover:text-foreground hover:underline"
            >
              Browse all
            </Link>
          </div>
        ) : null}

        {/* All 5 games are always available, in every mode (Normal and 18+). */}
        <div className="mt-5">
          <GameTabs
            decks={decks}
            activeId={activeId}
            onSelect={(id) => {
              const page = linkTabs ? corePageForGame(id) : undefined;
              if (page && id !== activeId) {
                router.push(`/games/${page.slug}`);
                return;
              }
              setActiveId(id as PromptGame);
            }}
          />
        </div>
      </div>

      {showResolving || isTruthOrDare ? null : !adultMode ? (
        <div className="mx-auto mt-4 max-w-2xl px-4 sm:px-6">
          <PassThePhoneFilters
            filters={filters}
            onToggle={toggleFilter}
            onClear={() => setFilters(emptyFilters)}
            resultCount={filtered.length}
            intensity={intensity}
            onIntensity={setIntensity}
            heatCategory={heatCategory}
            matchCount={heatFiltered.length}
            showSpeedBomb={showSpeedBomb}
            speedBomb={speedBomb}
            onSpeedBomb={setSpeedBomb}
          />
        </div>
      ) : (
        <div className="mx-auto mt-4 max-w-content px-4 sm:px-6">
          <div
            className={`flex flex-wrap items-center justify-between gap-2 rounded-full border-2 px-4 py-2 text-xs font-bold ${
              partyPass.active
                ? "border-amber-400/50 bg-amber-500/10 text-amber-300 shadow-[0_0_18px_rgba(251,191,36,0.3)]"
                : "border-red-500/50 bg-red-950/40 text-red-300 shadow-[0_0_18px_rgba(239,68,68,0.35)]"
            }`}
          >
            <span>
              {partyPass.active
                ? `⚡ Party Pass active, full 18+ decks unlocked · ${partyPass.remainingLabel}`
                : "18+ mode active, 3 free previews shared across every game and tool"}
            </span>
            <button
              type="button"
              onClick={() => setFilters(emptyFilters)}
              className="rounded-full border border-white/25 px-2.5 py-0.5 transition-colors hover:bg-white/10"
            >
              Exit 18+
            </button>
          </div>
        </div>
      )}

      {/* Normal mode folds the Spicy Meter into PassThePhoneFilters above;
       * Truth or Dare has its own card. 18+ decks keep the standalone meter. */}
      {!showResolving && !isTruthOrDare && adultMode ? (
        <div className="mx-auto mt-6 max-w-2xl px-4 sm:px-6">
          <GameControlBar
            intensity={intensity}
            onIntensity={setIntensity}
            heatCategory={heatCategory}
            showSpeedBomb={showSpeedBomb}
            speedBomb={speedBomb}
            onSpeedBomb={setSpeedBomb}
            matchCount={adultHeatDeck.length}
          />
        </div>
      ) : null}

      <div className="mx-auto max-w-2xl px-4 pt-8 sm:px-6">
        {showResolving ? (
          <div className="flex min-h-[16rem] items-center justify-center rounded-3xl border-2 border-red-500/40 bg-card text-sm text-muted sm:min-h-[20rem]">
            Loading the 18+ preview…
          </div>
        ) : isTruthOrDare ? (
          <TruthOrDareDeck initialAdult={adultMode} />
        ) : adultMode ? (
          <AdultCardDeck
            deck={adultHeatDeck}
            gameId={activeId}
            speedBomb={speedBomb && showSpeedBomb}
            onExit={() => setFilters(emptyFilters)}
            footer={suggestFooter}
          />
        ) : (
          <CardDeck
            deck={deck}
            prompts={heatFiltered}
            speedBomb={speedBomb && showSpeedBomb}
            onResetFilters={() => setFilters(emptyFilters)}
            footer={suggestFooter}
          />
        )}
      </div>

      {!showResolving ? <GameGuide slug={activeId} /> : null}

      <AgeGateModal
        open={ageGateOpen}
        onConfirm={confirmAge}
        onCancel={cancelAge}
      />
    </div>
  );
}

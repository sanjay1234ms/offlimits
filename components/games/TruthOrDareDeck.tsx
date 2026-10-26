"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Dices, SlidersHorizontal } from "lucide-react";
import {
  TOD_ADULT,
  TOD_NORMAL,
  TOD_PACKS,
  type TodCard,
  type TodPackId,
} from "@/data/truthOrDare";
import { useAdultPreview } from "@/hooks/useAdultPreview";
import { gameTheme } from "@/lib/gameTheme";
import {
  DEFAULT_INTENSITY,
  heatEmoji,
  heatTierLabel,
  type HeatCategory,
} from "@/lib/intensity";
import { sfx } from "@/lib/audio";
import { haptic, HAPTIC } from "@/lib/haptics";
import { persistAgeConfirmed, readAgeConfirmed } from "@/lib/monetization";
import { groupSizeOptions, vibeOptions } from "@/data/filters";
import type { GroupSize, Prompt, Vibe } from "@/types";
import { PromptCard } from "../PromptCard";
import { SwipeCard } from "../SwipeCard";
import { DeckStage } from "../DeckStage";
import { PaywallOverlay } from "../PaywallOverlay";
import { AgeGateModal } from "../AgeGateModal";
import { IntensityDial } from "./IntensityDial";
import { CardExtras } from "./CardExtras";
import { SuggestHelper } from "./SuggestHelper";
import { trackCardNext } from "@/lib/analytics";

interface TruthOrDareDeckProps {
  /** Pre-selects the 18+ pack (e.g. arriving from an 18+ entry point). */
  initialAdult?: boolean;
}

const ROUND_LENGTHS: { value: number; label: string }[] = [
  { value: 5, label: "5" },
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: Number.POSITIVE_INFINITY, label: "Endless" },
];

const NORMAL_PACKS = TOD_PACKS.filter((p) => !p.adult);
const ADULT_PACK = "18plus";
type PackChip = TodPackId | typeof ADULT_PACK;

const PACK_CHIPS: { id: PackChip; label: string }[] = [
  ...NORMAL_PACKS.map((p) => ({ id: p.id as PackChip, label: p.label })),
  { id: ADULT_PACK, label: "18+" },
];

/** Vibe / group-size a card suits, derived from its heat (Truth or Dare cards
 * aren't tagged individually). */
function deriveVibe(heat: number): Vibe[] {
  if (heat <= 1) return ["Icebreaker"];
  if (heat === 2) return ["Funny", "Icebreaker"];
  if (heat === 3) return ["Revealing", "Funny"];
  return ["Wild", "Revealing"];
}
function deriveGroupSize(heat: number): GroupSize[] {
  if (heat <= 2) return ["2-4", "5-10", "11-20", "20+"];
  if (heat === 3) return ["2-4", "5-10", "11-20"];
  return ["2-4", "5-10"];
}

interface PoolCard extends TodCard {
  isAdult: boolean;
}

function toDisplayPrompt(card: PoolCard): Prompt {
  return {
    id: card.id,
    game: "truth_or_dare",
    text: card.text,
    category: card.isAdult ? "18+" : "Friends",
    isAdult: card.isAdult,
    groupSize: [],
    vibe: [],
    occasion: [],
    kind: card.kind,
  };
}

export function TruthOrDareDeck({ initialAdult }: TruthOrDareDeckProps) {
  const [selectedPacks, setSelectedPacks] = useState<PackChip[]>(() => [
    ...NORMAL_PACKS.map((p) => p.id as PackChip),
    ...(initialAdult ? [ADULT_PACK as PackChip] : []),
  ]);
  const [groupSize, setGroupSize] = useState<GroupSize[]>([]);
  const [vibe, setVibe] = useState<Vibe[]>([]);
  const [heat, setHeat] = useState(DEFAULT_INTENSITY);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [ageGateOpen, setAgeGateOpen] = useState(false);

  const [roundLength, setRoundLength] = useState<number>(10);
  const [turns, setTurns] = useState(0);
  const [current, setCurrent] = useState<PoolCard | null>(null);
  const [recent, setRecent] = useState<string[]>([]);

  const adult18 = selectedPacks.includes(ADULT_PACK);

  // Shared, app-wide 18+ preview budget + paywall.
  const {
    hydrated,
    unlocked,
    used,
    cap,
    consume,
    paywallOpen,
    openPaywall,
    closePaywall,
    unlock,
  } = useAdultPreview();

  useEffect(() => {
    if (!adult18) closePaywall();
  }, [adult18, closePaywall]);

  const pool = useMemo<PoolCard[]>(() => {
    const normalSel = selectedPacks.filter(
      (id): id is TodPackId => id !== ADULT_PACK,
    );
    const normal = TOD_NORMAL.filter((c) =>
      c.packs.some((p) => normalSel.includes(p)),
    ).map((c) => ({ ...c, isAdult: false }));
    const adultCards = adult18
      ? TOD_ADULT.map((c) => ({ ...c, isAdult: true }))
      : [];

    const everything = [...normal, ...adultCards];
    let out = everything;

    if (vibe.length > 0) {
      const v = out.filter((c) =>
        deriveVibe(c.intensity ?? 2).some((x) => vibe.includes(x)),
      );
      if (v.length > 0) out = v;
    }
    if (groupSize.length > 0) {
      const g = out.filter((c) =>
        deriveGroupSize(c.intensity ?? 2).some((x) => groupSize.includes(x)),
      );
      if (g.length > 0) out = g;
    }
    const h = out.filter((c) => (c.intensity ?? 2) <= heat);
    if (h.length > 0) out = h;

    return out.length > 0 ? out : everything;
  }, [selectedPacks, adult18, vibe, groupSize, heat]);

  const truthCount = pool.filter((c) => c.kind === "truth").length;
  const dareCount = pool.filter((c) => c.kind === "dare").length;

  const trial = adult18 && hydrated && !unlocked;
  const roundIsFinite = Number.isFinite(roundLength);
  const roundOver = !trial && roundIsFinite && turns >= roundLength;
  const theme = gameTheme(adult18 ? "18+" : "truth_or_dare");

  const heatCategory: HeatCategory = adult18
    ? "adult"
    : selectedPacks.length === 1 && selectedPacks[0] === "couples"
      ? "couples"
      : selectedPacks.length === 1 && selectedPacks[0] === "office"
        ? "office"
        : "general";

  const drawCard = useCallback(
    (choice: "truth" | "dare" | "pick") => {
      if (paywallOpen || roundOver) return;

      const kind: "truth" | "dare" =
        choice === "pick" ? (Math.random() < 0.5 ? "truth" : "dare") : choice;

      const ofKind = pool.filter((c) => c.kind === kind);
      if (ofKind.length === 0) return;
      const fresh = ofKind.filter((c) => !recent.includes(c.id));
      const bag = fresh.length > 0 ? fresh : ofKind;
      const picked = bag[Math.floor(Math.random() * bag.length)];

      // 18+ card, unpaid: spend one shared preview slot, then hit the paywall.
      if (picked.isAdult && !unlocked && !consume(`tod-${picked.id}`)) {
        openPaywall();
        return;
      }

      sfx.flip();
      haptic(HAPTIC.advance);
      trackCardNext(
        picked.isAdult ? "truth_or_dare_18plus" : "truth_or_dare",
        turns + 1,
      );
      setCurrent(picked);
      setRecent((r) =>
        [picked.id, ...r].slice(0, Math.max(4, Math.floor(pool.length / 2))),
      );
      setTurns((t) => t + 1);
    },
    [
      paywallOpen,
      roundOver,
      unlocked,
      consume,
      openPaywall,
      pool,
      recent,
      turns,
    ],
  );

  // Keyboard: T = truth, D = dare, Space = let the phone pick.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.target instanceof HTMLElement) {
        const tag = event.target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
      }
      const key = event.key.toLowerCase();
      if (key === "t") {
        event.preventDefault();
        drawCard("truth");
      } else if (key === "d") {
        event.preventDefault();
        drawCard("dare");
      } else if (event.code === "Space") {
        event.preventDefault();
        drawCard("pick");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawCard]);

  function togglePack(id: PackChip) {
    if (id === ADULT_PACK) {
      if (!adult18 && !readAgeConfirmed()) {
        setAgeGateOpen(true);
        return;
      }
      setSelectedPacks((prev) =>
        prev.includes(ADULT_PACK)
          ? prev.filter((p) => p !== ADULT_PACK)
          : [...prev, ADULT_PACK],
      );
      return;
    }
    setSelectedPacks((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  }

  function toggleIn<T extends string>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    value: T,
  ) {
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }

  function confirmAge() {
    persistAgeConfirmed();
    setAgeGateOpen(false);
    setSelectedPacks((prev) =>
      prev.includes(ADULT_PACK) ? prev : [...prev, ADULT_PACK],
    );
  }

  const counter = trial
    ? used === 0
      ? `Preview: ${cap} free 18+ cards`
      : `Preview: Card ${Math.min(used, cap)} of ${cap}`
    : roundIsFinite
      ? `Turn ${Math.min(turns, roundLength)} of ${roundLength}`
      : turns === 0
        ? "Endless round"
        : `Turn ${turns}`;

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Unified filter container */}
      <div className="glass-card mx-auto mb-6 w-full max-w-xl p-5">
        <button
          type="button"
          onClick={() => setFiltersOpen((o) => !o)}
          aria-expanded={filtersOpen}
          className="flex w-full items-center justify-between gap-3 text-sm font-bold text-foreground"
        >
          <span className="inline-flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-accent" aria-hidden />
            Filters
            <span className="font-semibold text-muted">
              · {pool.length} cards in play
            </span>
          </span>
          <span className="text-xs font-bold text-muted" aria-hidden>
            Filters {filtersOpen ? "▴" : "▾"}
          </span>
        </button>

        {filtersOpen ? (
          <div className="mt-4 flex flex-col gap-3">
            {/* Pack selection (replaces Category) */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-20 shrink-0 text-xs font-bold uppercase tracking-wider text-subtle">
                Packs
              </span>
              <div className="-mx-1 flex flex-1 flex-wrap gap-2 px-1">
                {PACK_CHIPS.map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    aria-pressed={selectedPacks.includes(chip.id)}
                    onClick={() => togglePack(chip.id)}
                    className={`filter-chip${chip.id === ADULT_PACK ? " is-adult" : ""}`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
            <p className="pl-[calc(5rem+0.5rem)] text-[0.7rem] font-semibold text-subtle">
              {truthCount} truths · {dareCount} dares
            </p>

            {/* Group size */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-20 shrink-0 text-xs font-bold uppercase tracking-wider text-subtle">
                Group size
              </span>
              <div className="-mx-1 flex flex-1 flex-wrap gap-2 px-1">
                {groupSizeOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    aria-pressed={groupSize.includes(opt)}
                    onClick={() => toggleIn(setGroupSize, opt)}
                    className="filter-chip"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Vibe */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-20 shrink-0 text-xs font-bold uppercase tracking-wider text-subtle">
                Vibe
              </span>
              <div className="-mx-1 flex flex-1 flex-wrap gap-2 px-1">
                {vibeOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    aria-pressed={vibe.includes(opt)}
                    onClick={() => toggleIn(setVibe, opt)}
                    className="filter-chip"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Nested Spicy Meter */}
            <div className="mt-1 border-t border-white/10 pt-3.5">
              <IntensityDial value={heat} onChange={setHeat} />
              <p className="mt-1.5 text-xs font-semibold text-muted">
                {heatEmoji(heat)} {heatTierLabel(heatCategory, heat)} ·{" "}
                {pool.length} cards in play
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {/* Counter */}
      <div className="flex w-full items-center justify-between text-sm font-bold">
        <span className={trial ? "text-red-400" : theme.text}>{counter}</span>
        {adult18 ? (
          unlocked ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-emerald-300">
              Full 18+ deck unlocked
            </span>
          ) : (
            <span className="rounded-full border border-red-500/40 bg-red-950/40 px-2.5 py-1 text-xs text-red-300">
              Preview
            </span>
          )
        ) : null}
      </div>

      {/* Card */}
      <DeckStage theme={adult18 || current?.isAdult ? "18+" : current?.kind === "dare" ? "dare" : current?.kind === "truth" ? "truth" : "truth_or_dare"}>
      <div className="relative mx-auto w-[86%] max-w-xl" style={{ perspective: "1200px" }}>
        <SwipeCard
          key={current?.id ?? "empty"}
          onSwipe={(dir) => drawCard(dir < 0 ? "truth" : "dare")}
          disabled={paywallOpen || roundOver}
          leftLabel="Truth"
          rightLabel="Dare"
        >
          <div
            className={`preserve-3d transition-[filter] duration-200 ${
              paywallOpen ? "pointer-events-none select-none blur-md" : ""
            }`}
            aria-hidden={paywallOpen}
          >
            {current ? (
              <PromptCard
                prompt={toDisplayPrompt(current)}
                gameEmoji={theme.emoji}
                gameTitle="Truth or Dare"
                themeKey={current.isAdult ? "18+" : "truth_or_dare"}
                flip={false}
              />
            ) : (
              <div
                className={`flex min-h-[16rem] flex-col items-center justify-center gap-3 rounded-3xl border-2 bg-gradient-to-br p-8 text-center sm:min-h-[20rem] ${theme.border} ${theme.gradient}`}
                style={{ backgroundColor: "var(--card-bg)" }}
              >
                <span className="text-4xl" aria-hidden>
                  {theme.emoji}
                </span>
                <p className="text-lg font-bold text-foreground">
                  Pick Truth, Dare, or let the phone decide.
                </p>
                <p className="text-xs font-semibold text-muted">
                  Swipe left for Truth, right for Dare.
                </p>
              </div>
            )}
          </div>
        </SwipeCard>
        {paywallOpen ? <PaywallOverlay onUnlock={unlock} /> : null}
      </div>
      </DeckStage>

      {current && !paywallOpen ? (
        <CardExtras
          promptText={current.text}
          gameLabel={current.isAdult ? "Truth or Dare · 18+" : "Truth or Dare"}
          badge={
            current.kind === "dare"
              ? "OffLimits Dare"
              : "OffLimits Late Night Confession"
          }
          adult={current.isAdult}
          cardKey={current.id}
        />
      ) : null}

      {/* Action bar */}
      {roundOver ? (
        <div className="flex w-full flex-col items-center gap-3">
          <p className="text-sm font-bold text-foreground">
            Round complete, {roundLength} turns done.
          </p>
          <button
            type="button"
            onClick={() => {
              setTurns(0);
              setCurrent(null);
              setRecent([]);
            }}
            className="btn-primary"
          >
            Start a new round
          </button>
        </div>
      ) : (
        <>
          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => drawCard("truth")}
              className="rounded-2xl border-2 border-sky-500/50 bg-sky-500/10 py-4 text-base font-extrabold text-sky-300 transition-transform duration-150 hover:-translate-y-0.5 hover:bg-sky-500/20 active:scale-95"
            >
              Truth
            </button>
            <button
              type="button"
              onClick={() => drawCard("dare")}
              className="rounded-2xl border-2 border-rose-500/50 bg-rose-500/10 py-4 text-base font-extrabold text-rose-300 transition-transform duration-150 hover:-translate-y-0.5 hover:bg-rose-500/20 active:scale-95"
            >
              Dare
            </button>
            <button
              type="button"
              onClick={() => drawCard("pick")}
              className="btn-primary py-4 text-base"
            >
              <Dices className="h-5 w-5" aria-hidden />
              Let the phone pick
            </button>
          </div>
          <p className="text-xs text-subtle">
            <kbd className="rounded border border-white/15 px-1">T</kbd> for
            truth, <kbd className="rounded border border-white/15 px-1">D</kbd>{" "}
            for dare,{" "}
            <kbd className="rounded border border-white/15 px-1">space</kbd> to
            be told.
          </p>
        </>
      )}

      {/* Round length */}
      <div className="flex w-full flex-wrap items-center gap-2 border-t border-white/10 pt-4">
        <span className="text-xs font-bold uppercase tracking-wider text-subtle">
          Turns a round
        </span>
        {ROUND_LENGTHS.map((opt) => (
          <button
            key={opt.label}
            type="button"
            className="filter-chip"
            aria-pressed={roundLength === opt.value}
            onClick={() => setRoundLength(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Alternative idea generator */}
      <SuggestHelper type="truth-or-dare" adult={adult18} />

      <AgeGateModal
        open={ageGateOpen}
        onConfirm={confirmAge}
        onCancel={() => setAgeGateOpen(false)}
      />
    </div>
  );
}

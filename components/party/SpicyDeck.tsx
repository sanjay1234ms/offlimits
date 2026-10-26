"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Lock, Shuffle, SlidersHorizontal, UserPlus } from "lucide-react";
import { SwipeCard, type SwipeCardHandle } from "@/components/SwipeCard";
import { DeckStage, type StageTheme } from "@/components/DeckStage";
import { DeckPill } from "@/components/DeckPill";
import { IntensityDial } from "@/components/games/IntensityDial";
import { AgeGateModal } from "@/components/AgeGateModal";
import { PaywallOverlay } from "@/components/PaywallOverlay";
import { useAdultPreview } from "@/hooks/useAdultPreview";
import { persistAgeConfirmed, readAgeConfirmed } from "@/lib/monetization";
import { sfx } from "@/lib/audio";
import { haptic, HAPTIC } from "@/lib/haptics";
import { track } from "@/lib/analytics";
import { shuffle } from "@/lib/shuffle";

export type SpicyMode = "truth" | "dare" | "nhie" | "mlt";

export interface SpicyCard {
  id: string;
  mode: SpicyMode;
  /** 1 Cute · 2 Flirty · 3 Spicy · 4 Filthy · 5 Nasty. 3+ is 18+. */
  level: 1 | 2 | 3 | 4 | 5;
  text: string;
}

export interface SpicyLevel {
  level: 1 | 2 | 3 | 4 | 5;
  label: string;
  emoji: string;
  blurb: string;
}

export const DEFAULT_LEVELS: SpicyLevel[] = [
  { level: 1, label: "Cute", emoji: "🥂", blurb: "Warm-up. Safe for the group chat." },
  { level: 2, label: "Flirty", emoji: "😏", blurb: "Cheeky. Somebody's blushing." },
  { level: 3, label: "Spicy", emoji: "🌶️", blurb: "18+. Things are getting personal." },
  { level: 4, label: "Filthy", emoji: "🔥", blurb: "18+. No filter, no mercy." },
  { level: 5, label: "Nasty", emoji: "😈", blurb: "18+. Do not show your mother." },
];

const MODE_META: Record<SpicyMode | "mix", { label: string; emoji: string }> = {
  mix: { label: "Mix", emoji: "🎲" },
  truth: { label: "Truth", emoji: "🗣️" },
  dare: { label: "Dare", emoji: "⚡" },
  nhie: { label: "Never Have I Ever", emoji: "🙈" },
  mlt: { label: "Most Likely To", emoji: "👉" },
};

const MODE_PREFIX: Record<SpicyMode, string> = {
  truth: "Truth",
  dare: "Dare",
  nhie: "Never have I ever…",
  mlt: "Who's most likely to…",
};

/** Card colour ramps from champagne to devil-red as the meter climbs. */
const LEVEL_STYLE: Record<number, { card: string; ring: string; chip: string }> = {
  1: { card: "from-rose-100 via-pink-50 to-amber-50", ring: "ring-rose-200", chip: "bg-rose-200 text-rose-900" },
  2: { card: "from-pink-200 via-rose-100 to-fuchsia-100", ring: "ring-pink-300", chip: "bg-pink-300 text-pink-950" },
  3: { card: "from-orange-300 via-rose-300 to-pink-300", ring: "ring-orange-400", chip: "bg-orange-400 text-orange-950" },
  4: { card: "from-red-500 via-rose-600 to-fuchsia-700", ring: "ring-red-500", chip: "bg-red-600 text-white" },
  5: { card: "from-zinc-900 via-red-900 to-black", ring: "ring-red-700", chip: "bg-black text-red-400" },
};



interface Props {
  title: string;
  cards: SpicyCard[];
  levels?: SpicyLevel[];
  /** Scene colours below 18+ (18+ always uses the crimson room). */
  theme?: StageTheme;
  modes?: SpicyMode[];
  /** Analytics key. */
  slug: string;
}

/**
 * A swipeable truth/dare/Never Have I Ever/Most Likely To deck with a
 * five-step spicy meter. Levels 3-5 sit behind the age check and the shared
 * 3-free-cards preview, then the Party Pass.
 */
export function SpicyDeck({ title, cards, levels = DEFAULT_LEVELS, modes = ["truth", "dare", "nhie", "mlt"], slug, theme = "party" }: Props) {
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [level, setLevel] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [mode, setMode] = useState<SpicyMode | "mix">("mix");
  const [order, setOrder] = useState<SpicyCard[]>([]);
  const [i, setI] = useState(0);
  const [players, setPlayers] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [turn, setTurn] = useState(0);
  const [ageOpen, setAgeOpen] = useState(false);
  const [pendingLevel, setPendingLevel] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [done, setDone] = useState(0);
  const swipe = useRef<SwipeCardHandle>(null);
  const { consume, paywallOpen, openPaywall, unlock, unlocked, remaining } = useAdultPreview();

  // Only offer modes that actually have cards at this heat level.
  const available = useMemo(
    () => modes.filter((m) => cards.some((c) => c.level === level && c.mode === m)),
    [cards, level, modes],
  );
  useEffect(() => {
    if (mode !== "mix" && !available.includes(mode)) setMode("mix");
  }, [available, mode]);

  const pool = useMemo(
    () => cards.filter((c) => c.level === level && (mode === "mix" || c.mode === mode)),
    [cards, level, mode],
  );

  // Fresh shuffle whenever the meter or mode changes.
  useEffect(() => {
    setOrder(shuffle(pool));
    setI(0);
  }, [pool]);

  const card = order.length ? order[i % order.length] : null;
  const adult = level >= 3;

  // Spend a free preview the first time each 18+ card is shown.
  useEffect(() => {
    if (!card || card.level < 3) {
      setBlocked(false);
      return;
    }
    const ok = consume(`${slug}:${card.id}`);
    setBlocked(!ok);
    if (!ok) openPaywall();
  }, [card, consume, openPaywall, slug]);

  const pickLevel = useCallback((l: 1 | 2 | 3 | 4 | 5) => {
    if (l >= 3 && !readAgeConfirmed()) {
      setPendingLevel(l);
      setAgeOpen(true);
      return;
    }
    setLevel(l);
    sfx.tick(l - 1);
    haptic(HAPTIC.advance);
    track("spicy_level", { game: slug, level: l });
  }, [slug]);

  const next = useCallback(() => {
    sfx.flip();
    haptic(HAPTIC.advance);
    setI((n) => n + 1);
    setDone((d) => d + 1);
    if (players.length) setTurn((t) => (t + 1) % players.length);
  }, [players.length]);

  function addPlayer() {
    const name = draft.trim().slice(0, 18);
    if (!name || players.length >= 16) return;
    setPlayers((p) => [...p, name]);
    setDraft("");
  }

  const lv = levels.find((l) => l.level === level)!;
  const style = LEVEL_STYLE[level];
  const darkText = level >= 4;
  const stageTheme: StageTheme = adult ? "18+" : theme;

  return (
    <div className="flex flex-col gap-4">
      {/* Filters + Spicy Meter, same panel as the pass-the-phone games */}
      <div className="glass-card mx-auto w-full max-w-xl p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-sm font-bold tracking-tight text-foreground">
            <SlidersHorizontal className="h-4 w-4 text-accent" aria-hidden />
            Filters
            <span className="font-semibold text-muted">· {cards.length} prompts</span>
          </span>
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            aria-expanded={filtersOpen}
            className="inline-flex items-center gap-1 text-xs font-bold text-muted transition-colors hover:text-foreground"
          >
            Filters {filtersOpen ? "▴" : "▾"}
          </button>
        </div>

        {filtersOpen ? (
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-20 shrink-0 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-subtle">Type</span>
              <div className="-mx-1 flex flex-1 flex-wrap gap-2 px-1">
                {(["mix", ...available] as (SpicyMode | "mix")[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    aria-pressed={mode === m}
                    onClick={() => setMode(m)}
                    className="filter-chip"
                  >
                    {MODE_META[m].label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-20 shrink-0 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-subtle">Players</span>
              <form
                className="-mx-1 flex flex-1 flex-wrap items-center gap-2 px-1"
                onSubmit={(e) => {
                  e.preventDefault();
                  addPlayer();
                }}
              >
                {players.map((p, k) => (
                  <button
                    key={`${p}-${k}`}
                    type="button"
                    onClick={() => setPlayers((list) => list.filter((_, j) => j !== k))}
                    className="filter-chip"
                    aria-pressed
                    title="Remove"
                  >
                    {p} ✕
                  </button>
                ))}
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={players.length ? "Add another" : "Add names to take turns"}
                  aria-label="Player name"
                  className="min-w-[9rem] flex-1 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-foreground outline-none placeholder:text-subtle focus:border-accent"
                />
                <button type="submit" className="filter-chip" aria-label="Add player">
                  <UserPlus className="h-3.5 w-3.5" aria-hidden /> Add
                </button>
              </form>
            </div>

            <div className="mt-1 border-t border-white/10 pt-3.5">
              <IntensityDial value={level} onChange={(n) => pickLevel(n as 1 | 2 | 3 | 4 | 5)} />
              <p className="mt-2 text-xs font-semibold text-muted">
                {lv.emoji} {lv.label}
                {adult ? <span className="mx-1 rounded bg-red-600 px-1 py-px text-[10px] font-black text-white">18+</span> : " "}
                · {lv.blurb} · {pool.length} cards in play
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {/* Card stage */}
      <DeckStage theme={stageTheme} className="mx-auto max-w-2xl">
        <div className="mb-5 flex items-center justify-between px-1 text-xs font-bold text-white/80 sm:px-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/25 px-3 py-1 backdrop-blur">
            {lv.emoji} {lv.label}
          </span>
          <span className="rounded-full bg-black/25 px-3 py-1 backdrop-blur">
            {adult && !unlocked ? `${remaining} free 18+ left` : `Card ${done + 1}`}
          </span>
        </div>
        <div className="relative mx-auto w-[82%] max-w-md">
          {card ? (
            <SwipeCard ref={swipe} key={`${card.id}-${i}`} onSwipe={next} leftLabel="Skip" rightLabel="Done" peek>
              <div
                className={`relative flex min-h-[19rem] flex-col justify-between overflow-hidden rounded-[1.75rem] bg-gradient-to-br p-6 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] ring-2 sm:min-h-[22rem] sm:p-7 ${style.card} ${style.ring}`}
              >
                {level === 5 ? (
                  <span aria-hidden className="pointer-events-none absolute -right-6 -top-6 text-[9rem] opacity-10">😈</span>
                ) : null}
                <div className="flex items-center justify-between gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-wider ${style.chip}`}>
                    {MODE_META[card.mode].emoji} {MODE_PREFIX[card.mode]}
                  </span>
                  <span className={`text-xs font-black ${darkText ? "text-white/70" : "text-slate-700/70"}`}>#{done + 1}</span>
                </div>
                <p
                  className={`my-6 text-balance text-2xl font-black leading-snug sm:text-[1.7rem] ${
                    darkText ? "text-white" : "text-slate-900"
                  } ${blocked ? "select-none blur-md" : ""}`}
                >
                  {card.text}
                </p>
                <div className={`flex items-center justify-between text-xs font-bold ${darkText ? "text-white/70" : "text-slate-700/80"}`}>
                  <span>{players.length ? `👉 ${players[turn % players.length]}'s turn` : title}</span>
                  <span>{lv.emoji}</span>
                </div>
                {blocked ? (
                  <div className="absolute inset-0 grid place-items-center bg-black/40 backdrop-blur-sm">
                    <span className="inline-flex items-center gap-2 rounded-full bg-black/80 px-4 py-2 text-sm font-black text-white">
                      <Lock className="h-4 w-4" aria-hidden />
                      Unlock with the Party Pass
                    </span>
                  </div>
                ) : null}
              </div>
            </SwipeCard>
          ) : (
            <div className="grid min-h-[19rem] place-items-center rounded-[1.75rem] border border-white/15 bg-white/5 p-6 text-center text-white/70">
              No cards for this combo. Try another type.
            </div>
          )}
          {paywallOpen ? <PaywallOverlay onUnlock={unlock} /> : null}
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setOrder(shuffle(pool));
              setI(0);
              sfx.spin();
            }}
            aria-label="Shuffle"
            title="Shuffle"
            className="grid h-12 w-12 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition-transform hover:rotate-180 hover:scale-110"
          >
            <Shuffle className="h-5 w-5" aria-hidden />
          </button>
          <DeckPill onSkip={() => swipe.current?.fling(-1)} onDone={() => swipe.current?.fling(1)} disabled={!card} />
        </div>
        <p className="mt-3 text-center text-xs font-semibold text-white/60">Swipe or tap. ✕ skips, the smile means you did it.</p>
      </DeckStage>

      <AgeGateModal
        open={ageOpen}
        onConfirm={() => {
          persistAgeConfirmed();
          setAgeOpen(false);
          if (pendingLevel) {
            setLevel(pendingLevel);
            track("spicy_level", { game: slug, level: pendingLevel });
          }
          setPendingLevel(null);
        }}
        onCancel={() => {
          setAgeOpen(false);
          setPendingLevel(null);
        }}
      />
    </div>
  );
}

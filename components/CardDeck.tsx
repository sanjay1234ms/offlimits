"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  KeyRound,
  Lock,
  RotateCcw,
  Shuffle,
  SkipForward,
  Sparkles,
  Undo2,
} from "lucide-react";
import type { GameDeck, Prompt, PromptGame } from "@/types";
import { useDeck } from "@/hooks/useDeck";
import { useAdultPreview } from "@/hooks/useAdultPreview";
import { gameTheme } from "@/lib/gameTheme";
import { sfx } from "@/lib/audio";
import { haptic, HAPTIC } from "@/lib/haptics";
import type { AdultCard } from "@/data/adultDeck";
import { PromptCard } from "./PromptCard";
import { PaywallOverlay } from "./PaywallOverlay";
import { SwipeCard, type SwipeCardHandle } from "./SwipeCard";
import { CardExtras } from "./games/CardExtras";
import { trackCardNext, trackDeckComplete } from "@/lib/analytics";

/** Small circular progress indicator; inherits colour from `currentColor`. */
function ProgressRing({ value, total }: { value: number; total: number }) {
  const radius = 9;
  const circumference = 2 * Math.PI * radius;
  const pct = total > 0 ? Math.min(1, Math.max(0, value / total)) : 0;
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 -rotate-90" aria-hidden>
      <circle
        cx="12"
        cy="12"
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.18"
        strokeWidth="3"
      />
      <circle
        cx="12"
        cy="12"
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - pct)}
        style={{ transition: "stroke-dashoffset 0.35s ease" }}
      />
    </svg>
  );
}

/* ================================================================== *
 * Standard deck (Friends / Office / Couples), JSON-backed, shuffled
 * ================================================================== */

interface CardDeckProps {
  deck: GameDeck;
  /** Prompts already narrowed by the filter bar. */
  prompts: Prompt[];
  /** Clears all filters, wired to the empty-state reset button. */
  onResetFilters?: () => void;
  /** Show the 10-second Hot Potato timer on each card. */
  speedBomb?: boolean;
  /** Optional slot rendered under the controls (e.g. the Suggest helper). */
  footer?: React.ReactNode;
}

const promptKey = (prompt: Prompt) => prompt.id;

/** One question at a time, shuffled without repeats until the whole deck has
 * been seen, then reshuffled. Used for every non-18+ category. */
export function CardDeck({
  deck,
  prompts,
  onResetFilters,
  speedBomb,
  footer,
}: CardDeckProps) {
  const { current, position, total, round, onLastCard, next, restart } =
    useDeck(prompts, promptKey, deck.id);
  const theme = gameTheme(deck.id);
  const swipe = useRef<SwipeCardHandle>(null);

  const handleNext = useCallback(() => {
    if (total > 0) {
      sfx.flip();
      haptic(HAPTIC.advance);
      next();
    }
  }, [total, next]);

  // Buttons and keys throw the card away too, so every path animates.
  const requestNext = useCallback(() => {
    if (swipe.current) swipe.current.fling(-1);
    else handleNext();
  }, [handleNext]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.target instanceof HTMLElement) {
        const tag = event.target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
      }
      if (event.code === "Space" || event.code === "ArrowRight") {
        event.preventDefault();
        requestNext();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [requestNext]);

  if (total === 0 || !current) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-card border border-dashed border-border-strong bg-card p-10 text-center">
        <p className="text-lg font-semibold text-foreground">
          Nothing matches those filters
        </p>
        <p className="max-w-sm text-sm text-muted">
          That filter combination is a little too tight for this deck.
        </p>
        {onResetFilters ? (
          <button
            type="button"
            onClick={onResetFilters}
            className="btn-primary"
          >
            <Undo2 className="h-4 w-4" aria-hidden />
            Reset Filters to View All Cards
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex w-full items-center justify-between gap-3 text-sm font-semibold">
        <span className={`inline-flex items-center gap-2 ${theme.text}`}>
          <ProgressRing value={position} total={total} />
          <span className="text-muted">
            Question <span className="text-foreground">{position}</span> /{" "}
            {total}
          </span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          {round > 1 ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted backdrop-blur">
              <Shuffle className="h-3 w-3" aria-hidden />
              Round {round}
            </span>
          ) : null}
          {onLastCard ? (
            <span
              className={`rounded-full border px-2.5 py-1 text-xs ${theme.border} ${theme.text}`}
            >
              Last card
            </span>
          ) : null}
        </span>
      </div>

      <div className="w-full" style={{ perspective: "1200px" }}>
        <SwipeCard ref={swipe} key={current.id} onSwipe={handleNext}>
          <div className="preserve-3d">
            <PromptCard
              prompt={current}
              gameEmoji={deck.emoji}
              gameTitle={deck.title}
              themeKey={deck.id}
            />
          </div>
        </SwipeCard>
      </div>

      <DeckControls onNext={requestNext} onRestart={restart} />

      <CardExtras
        promptText={current.text}
        gameLabel={deck.title}
        cardKey={current.id}
        speedBomb={speedBomb}
      />

      <p className="text-xs text-subtle">
        Tip: swipe the card away, or press Space or →.
      </p>

      {footer ? <div className="w-full">{footer}</div> : null}
    </div>
  );
}

/* ================================================================== *
 * 18+ deck, shared 3-item preview budget, then a $2.99 paywall
 * ================================================================== */

/** Adapts a bare {@link AdultCard} to the shape `<PromptCard>` expects. */
function toDisplayPrompt(card: AdultCard): Prompt {
  return {
    id: card.id,
    game: card.game,
    text: card.prompt,
    category: "18+",
    isAdult: true,
    groupSize: [],
    vibe: ["Wild"],
    occasion: [],
    kind: card.kind,
  };
}

interface AdultCardDeckProps {
  /** The 18+ deck for the active game (adultDeckFor). */
  deck: AdultCard[];
  /** The active game, drives the title, emoji, and reset on tab switch. */
  gameId: PromptGame;
  /** Show the 10-second Hot Potato timer on each card. */
  speedBomb?: boolean;
  /** Lets the player back out of 18+ mode (clears the filter). */
  onExit?: () => void;
  /** Optional slot rendered under the controls (e.g. the Suggest helper). */
  footer?: React.ReactNode;
}

/** The 18+ engine. The 3-item preview budget is shared app-wide via
 * `useAdultPreview`, across every game deck AND the Suggest helpers, so it
 * can never be a free backdoor into adult content. */
export function AdultCardDeck({
  deck,
  gameId,
  speedBomb,
  onExit,
  footer,
}: AdultCardDeckProps) {
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
  const [currentIndex, setCurrentIndex] = useState(0);

  const fullDeck = useMemo(() => (deck.length > 0 ? deck : []), [deck]);

  // Switching game tabs while in 18+ mode restarts that game's deck.
  useEffect(() => {
    setCurrentIndex(0);
    closePaywall();
  }, [gameId, closePaywall]);

  // Clamp an out-of-range index back to 0.
  useEffect(() => {
    if (currentIndex >= fullDeck.length) setCurrentIndex(0);
  }, [currentIndex, fullDeck.length]);

  const safeIndex =
    currentIndex >= fullDeck.length || currentIndex < 0 ? 0 : currentIndex;
  const activePrompt = fullDeck[safeIndex];
  const activeText = activePrompt?.prompt || "";

  // Every card that gets shown spends one shared preview slot (idempotent per
  // card id, re-viewing a previewed card is free).
  useEffect(() => {
    if (!hydrated || unlocked || !activePrompt) return;
    if (!consume(activePrompt.id)) openPaywall();
  }, [
    activePrompt?.id,
    hydrated,
    unlocked,
    consume,
    openPaywall,
    activePrompt,
  ]);

  const handleNext = useCallback(() => {
    if (paywallOpen || fullDeck.length === 0) return;
    const nextIdx = currentIndex + 1 >= fullDeck.length ? 0 : currentIndex + 1;
    const nextCard = fullDeck[nextIdx];
    if (nextCard && !consume(nextCard.id)) {
      openPaywall();
      return;
    }
    sfx.flip();
    haptic(HAPTIC.advance);
    if (nextIdx === 0) trackDeckComplete(`${gameId}_18plus`);
    else trackCardNext(`${gameId}_18plus`, nextIdx + 1);
    setCurrentIndex(nextIdx);
  }, [paywallOpen, fullDeck, currentIndex, consume, openPaywall]);

  const swipe = useRef<SwipeCardHandle>(null);
  const requestNext = useCallback(() => {
    if (swipe.current && !paywallOpen) swipe.current.fling(-1);
    else handleNext();
  }, [handleNext, paywallOpen]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.target instanceof HTMLElement) {
        const tag = event.target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
      }
      if (event.code === "Space" || event.code === "ArrowRight") {
        event.preventDefault();
        requestNext();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [requestNext]);

  // Avoid a flash of the preview limit before localStorage has been read.
  if (!hydrated) {
    return (
      <div className="flex min-h-[16rem] items-center justify-center rounded-card border border-border-strong bg-card sm:min-h-[20rem]">
        <span className="text-sm text-muted">Loading deck…</span>
      </div>
    );
  }

  const counter = unlocked
    ? `Card ${safeIndex + 1} of ${fullDeck.length}`
    : `Preview: Card ${Math.min(used, cap) || 1} of ${cap}`;
  const meta = gameTheme(gameId);

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex w-full items-center justify-between gap-3 text-sm font-semibold">
        <span className="inline-flex items-center gap-2 text-red-400">
          <ProgressRing
            value={unlocked ? safeIndex + 1 : used}
            total={unlocked ? fullDeck.length : cap}
          />
          <span className={unlocked ? "text-foreground" : "text-red-400"}>
            {counter}
          </span>
        </span>
        {unlocked ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-emerald-300 backdrop-blur">
            <Sparkles className="h-3 w-3" aria-hidden />
            Full 18+ deck unlocked
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full border border-red-500/40 bg-red-950/40 px-2.5 py-1 text-xs font-bold text-red-300">
            <Lock className="h-3 w-3" aria-hidden />
            Preview
          </span>
        )}
      </div>

      <div className="relative w-full" style={{ perspective: "1200px" }}>
        <SwipeCard
          ref={swipe}
          key={activePrompt?.id ?? "empty"}
          onSwipe={handleNext}
          disabled={paywallOpen}
        >
          <div
            className={`preserve-3d transition-[filter] duration-200 ${
              paywallOpen ? "pointer-events-none select-none blur-md" : ""
            }`}
            aria-hidden={paywallOpen}
          >
            {activePrompt ? (
              <PromptCard
                prompt={toDisplayPrompt(activePrompt)}
                gameEmoji={meta.emoji}
                gameTitle={meta.label}
                themeKey="18+"
              />
            ) : (
              <div className="min-h-[16rem] rounded-3xl border border-red-500/40 bg-card p-6 text-center text-muted sm:min-h-[20rem]">
                {activeText}
              </div>
            )}
          </div>
        </SwipeCard>
        {paywallOpen ? <PaywallOverlay onUnlock={unlock} /> : null}
      </div>

      <DeckControls
        onNext={requestNext}
        nextDisabled={paywallOpen}
        onRestart={() => setCurrentIndex(0)}
        restartLabel="Start over"
        onExit={onExit}
      />

      {activePrompt && !paywallOpen ? (
        <CardExtras
          promptText={activePrompt.prompt}
          gameLabel={`${meta.label} · 18+`}
          badge="OffLimits Late Night Confession"
          adult
          cardKey={activePrompt.id}
          speedBomb={speedBomb}
        />
      ) : null}

      <p className="text-xs text-subtle">
        {paywallOpen
          ? "Unlock the full 18+ deck to keep going."
          : unlocked
            ? "Tip: swipe the card away, or press Space or →."
            : `${cap} free 18+ previews, shared across every game and helper.`}
      </p>

      {footer ? <div className="w-full">{footer}</div> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Shared controls
 * ------------------------------------------------------------------ */

interface DeckControlsProps {
  onNext: () => void;
  onRestart: () => void;
  nextDisabled?: boolean;
  restartLabel?: string;
  onExit?: () => void;
}

function DeckControls({
  onNext,
  onRestart,
  nextDisabled = false,
  restartLabel = "Shuffle & restart",
  onExit,
}: DeckControlsProps) {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className="btn-primary w-full py-4 text-base sm:w-auto sm:min-w-[16rem]"
        >
          <SkipForward className="h-5 w-5" aria-hidden />
          Next Question
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="btn-ghost w-full sm:w-auto"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          {restartLabel}
        </button>
      </div>
      {onExit ? (
        <button
          type="button"
          onClick={onExit}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted transition-colors hover:text-foreground"
        >
          <KeyRound className="h-3.5 w-3.5" aria-hidden />
          Exit 18+ deck
        </button>
      ) : null}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { shuffle } from "@/lib/shuffle";
import { trackCardNext, trackDeckComplete } from "@/lib/analytics";

export interface DeckController<T> {
  /** The card currently face-up, or undefined when the deck is empty. */
  current: T | undefined;
  /** 1-based position of the current card within this pass. */
  position: number;
  /** Number of cards in the deck (after filtering). */
  total: number;
  /** How many complete passes through the deck have started (1-based). */
  round: number;
  /** True when the current card is the last one before a reshuffle. */
  onLastCard: boolean;
  /** Advance to the next card, reshuffling once every card has been seen. */
  next: () => void;
  /** Reshuffle and return to the first card. */
  restart: () => void;
}

/**
 * Walks a list of items in a random order, showing every item exactly once
 * before any repeats. When the pass is exhausted the deck reshuffles (never
 * repeating the just-seen card as the next one) and the round counter ticks.
 *
 * `keyOf` must return a stable id per item; it drives the re-shuffle that
 * happens whenever the underlying set changes (e.g. the filters move).
 */
export function useDeck<T>(
  items: T[],
  keyOf: (item: T) => string,
  /** Game id for GA4 play-depth events; omit to skip tracking. */
  trackAs?: string,
): DeckController<T> {
  const signature = items.map(keyOf).join("|");

  const [order, setOrder] = useState<T[]>(items);
  const [index, setIndex] = useState(0);
  const [round, setRound] = useState(1);

  // Reshuffle whenever the item set changes. Runs on mount too, so the very
  // first client render matches the server (unshuffled) and only then
  // randomises, avoiding a hydration mismatch.
  const lastSignature = useRef<string | null>(null);
  useEffect(() => {
    if (lastSignature.current === signature) return;
    lastSignature.current = signature;
    setOrder(shuffle(items));
    setIndex(0);
    setRound(1);
  }, [signature, items]);

  const next = useCallback(() => {
    if (trackAs) {
      if (index + 1 < order.length) trackCardNext(trackAs, index + 2);
      else trackDeckComplete(trackAs);
    }
    setIndex((current) => {
      if (current + 1 < order.length) return current + 1;

      // Pass complete, reshuffle for the next round.
      setOrder((prev) => {
        if (prev.length < 2) return prev;
        const reshuffled = shuffle(prev);
        if (keyOf(reshuffled[0]) === keyOf(prev[prev.length - 1])) {
          const swapWith = 1 + Math.floor(Math.random() * (reshuffled.length - 1));
          [reshuffled[0], reshuffled[swapWith]] = [
            reshuffled[swapWith],
            reshuffled[0],
          ];
        }
        return reshuffled;
      });
      setRound((r) => r + 1);
      return 0;
    });
  }, [order, keyOf, index, trackAs]);

  const restart = useCallback(() => {
    setOrder(shuffle(items));
    setIndex(0);
    setRound(1);
  }, [items]);

  return {
    current: order[index],
    position: order.length === 0 ? 0 : index + 1,
    total: order.length,
    round,
    onLastCard: order.length > 0 && index === order.length - 1,
    next,
    restart,
  };
}

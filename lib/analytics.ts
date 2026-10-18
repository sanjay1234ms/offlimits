import { sendGAEvent } from "@next/third-parties/google";

type Params = Record<string, string | number | boolean>;

/** Fires a GA4 event. Never throws, so analytics can't break a game. */
export function track(name: string, params: Params = {}): void {
  if (typeof window === "undefined") return;
  try {
    sendGAEvent("event", name, params);
  } catch {
    // Analytics is best-effort.
  }
}

/**
 * Play-depth events, so GA4 shows how far people get rather than only the
 * average engagement time:
 * - card_next: a player moved to the next card (`game`, `position`).
 * - deck_complete: a player went through every card in the deck.
 * - game_finished: a scored game reached its podium.
 */
export function trackCardNext(game: string, position: number): void {
  track("card_next", { game, position });
}

export function trackDeckComplete(game: string): void {
  track("deck_complete", { game });
}

export function trackGameFinished(game: string): void {
  track("game_finished", { game });
}

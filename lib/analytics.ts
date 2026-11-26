type Params = Record<string, string | number | boolean>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Fires a GA4 event. Never throws, so analytics can't break a game. */
export function track(name: string, params: Params = {}): void {
  if (typeof window === "undefined") return;
  try {
    // gtag() is defined inline in the root layout; events queue in the
    // dataLayer until gtag.js finishes loading.
    window.gtag?.("event", name, params);
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

/** Window event fired when a group finishes a deck or a game. The home-screen
 * prompt listens for it: right after a good game is the moment to ask. */
export const GAME_DONE_EVENT = "offlimits:game-done";

export function announceGameDone(game: string): void {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new CustomEvent(GAME_DONE_EVENT, { detail: { game } }));
  } catch {
    // Never let this break a game.
  }
}

export function trackDeckComplete(game: string): void {
  track("deck_complete", { game });
  announceGameDone(game);
}

export function trackGameFinished(game: string): void {
  track("game_finished", { game });
  announceGameDone(game);
}

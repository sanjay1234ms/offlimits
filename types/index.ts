/**
 * Shared domain types for the OffLimits app.
 */

/* ------------------------------------------------------------------ *
 * Landing-page catalog
 * ------------------------------------------------------------------ */

/** A high-level grouping shown in the navigation and used to filter games. */
export type GameCategory =
  | "party-games"
  | "wheels-pickers"
  | "holiday"
  | "icebreakers";

/** An occasion slug used for the "By Occasion" browsing experience. */
export type Occasion =
  | "game-night"
  | "office-party"
  | "road-trip"
  | "birthday"
  | "holidays"
  | "date-night";

/** A single playable game card on the landing page. */
export interface Game {
  slug: string;
  title: string;
  description: string;
  emoji: string;
  category: GameCategory;
  occasions: Occasion[];
  players: string;
  duration: string;
  featured?: boolean;
}

/** Navigation entry rendered in the top bar. */
export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

/** A titled block of games on the landing page. */
export interface GameSection {
  id: string;
  title: string;
  subtitle: string;
  category: GameCategory;
}

/* ------------------------------------------------------------------ *
 * Pass-the-phone game engine
 * ------------------------------------------------------------------ */

/** Which starter game a prompt belongs to (matches data/games.json). */
export type PromptGame =
  | "would_you_rather"
  | "never_have_i_ever"
  | "most_likely_to"
  | "truth_or_dare"
  | "this_or_that";

/** Truth or Dare card type, drives the TRUTH / DARE badge. */
export type TruthOrDareKind = "truth" | "dare";

/** Audience / setting a prompt is written for. */
export type PromptCategory = "Friends" | "Office" | "Couples" | "18+";

/** Recommended player-count bucket. */
export type GroupSize = "2-4" | "5-10" | "11-20" | "20+";

/** Tone of a prompt. */
export type Vibe = "Icebreaker" | "Funny" | "Revealing" | "Wild";

/** Occasion a prompt suits, as a display label (see data/filters.ts for slugs). */
export type PromptOccasion =
  | "Office Party"
  | "Game Night"
  | "Road Trip"
  | "Date Night"
  | "Birthday"
  | "Holidays";

/** Raw row shape in data/games.json / data/extraDecks.ts. */
export interface RawPrompt {
  id: string;
  game: PromptGame;
  prompt: string;
  category: PromptCategory;
  isAdult: boolean;
  groupSize: GroupSize[];
  vibe: Vibe[];
  occasion: PromptOccasion[];
  /** Truth or Dare only. */
  kind?: TruthOrDareKind;
  /** Explicit heat level 1-5 (leveled decks). Derived heuristically if absent. */
  intensity?: number;
}

/** A prompt after loading: `prompt` is normalised to `text`. */
export interface Prompt {
  id: string;
  game: PromptGame;
  text: string;
  category: PromptCategory;
  isAdult: boolean;
  groupSize: GroupSize[];
  vibe: Vibe[];
  occasion: PromptOccasion[];
  /** Truth or Dare only. */
  kind?: TruthOrDareKind;
  /** Explicit heat level 1-5 (leveled decks). Derived heuristically if absent. */
  intensity?: number;
}

/** A full starter game: a titled, themed deck of prompts. */
export interface GameDeck {
  id: PromptGame;
  title: string;
  tagline: string;
  emoji: string;
  prompts: Prompt[];
}

/** Active multi-select filter state for the deck. */
export interface PromptFilters {
  category: PromptCategory[];
  groupSize: GroupSize[];
  vibe: Vibe[];
  occasion: PromptOccasion[];
}

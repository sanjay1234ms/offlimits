import type {
  GameDeck,
  Prompt,
  PromptFilters,
  PromptGame,
  RawPrompt,
} from "@/types";
import { ADULT_CATEGORY } from "@/lib/monetization";
import gamesData from "./games.json";
import { EXTRA_PROMPTS } from "./extraDecks";
import { NORMAL_DECK_PROMPTS } from "./decks";

/** Presentation metadata per game, keyed by the `game` field in games.json. */
const DECK_META: Record<
  PromptGame,
  { title: string; tagline: string; emoji: string }
> = {
  would_you_rather: {
    title: "Would You Rather",
    tagline: "Two impossible options. Pick one, defend it.",
    emoji: "🤔",
  },
  never_have_i_ever: {
    title: "Never Have I Ever",
    tagline: "Put a finger down. Everyone is watching.",
    emoji: "🙈",
  },
  most_likely_to: {
    title: "Most Likely To",
    tagline: "Point at someone. No takebacks.",
    emoji: "👉",
  },
  truth_or_dare: {
    title: "Truth or Dare",
    tagline: "Pick your lane, then take whatever the phone deals.",
    emoji: "😈",
  },
  this_or_that: {
    title: "This or That",
    tagline: "Rapid fire, first instinct, no thinking allowed.",
    emoji: "⚡",
  },
};

const DECK_ORDER: PromptGame[] = [
  "would_you_rather",
  "never_have_i_ever",
  "most_likely_to",
  "truth_or_dare",
  "this_or_that",
];

/** All prompts, with `prompt` normalised to `text`. */
export const allPrompts: Prompt[] = [
  ...(gamesData as unknown as RawPrompt[]),
  ...EXTRA_PROMPTS,
].map((row) => ({
  id: row.id,
  game: row.game,
  text: row.prompt,
  category: row.category,
  isAdult: row.isAdult,
  groupSize: row.groupSize,
  vibe: row.vibe,
  occasion: row.occasion,
  kind: row.kind,
}));

/** Prompts grouped into the starter decks. 18+ prompts are excluded here so
 * normal browsing never shows adult content, the 18+ decks are separate
 * (data/adultDeck.ts) and gated behind the age check. */
export const decks: GameDeck[] = DECK_ORDER.map((game) => ({
  id: game,
  ...DECK_META[game],
  prompts: [
    ...allPrompts.filter((prompt) => prompt.game === game && !prompt.isAdult),
    ...(NORMAL_DECK_PROMPTS[game] ?? []),
  ],
}));

export function deckById(id: string): GameDeck | undefined {
  return decks.find((deck) => deck.id === id);
}

/** An empty filter selection (nothing narrowed). */
export const emptyFilters: PromptFilters = {
  category: [],
  groupSize: [],
  vibe: [],
  occasion: [],
};

/** Build a filter set from a partial override on top of the empty state. */
export function makeFilters(partial: Partial<PromptFilters>): PromptFilters {
  return { ...emptyFilters, ...partial };
}

function matchesCategory(prompt: Prompt, filters: PromptFilters): boolean {
  return (
    filters.category.length === 0 ||
    filters.category.includes(prompt.category)
  );
}

/** True when the prompt satisfies every active tag group (group size, vibe,
 * occasion). Empty groups are ignored; within a group the match is OR. */
function matchesTags(prompt: Prompt, filters: PromptFilters): boolean {
  const groupSizeOk =
    filters.groupSize.length === 0 ||
    prompt.groupSize.some((size) => filters.groupSize.includes(size));
  const vibeOk =
    filters.vibe.length === 0 ||
    prompt.vibe.some((vibe) => filters.vibe.includes(vibe));
  const occasionOk =
    filters.occasion.length === 0 ||
    prompt.occasion.some((occasion) => filters.occasion.includes(occasion));
  return groupSizeOk && vibeOk && occasionOk;
}

function activeGroupCount(filters: PromptFilters): number {
  return (
    (filters.category.length > 0 ? 1 : 0) +
    (filters.groupSize.length > 0 ? 1 : 0) +
    (filters.vibe.length > 0 ? 1 : 0) +
    (filters.occasion.length > 0 ? 1 : 0)
  );
}

/**
 * Strict match: the category filter AND every active tag group.
 * (OR within a group, AND across groups.)
 */
export function matchesFilters(prompt: Prompt, filters: PromptFilters): boolean {
  return matchesCategory(prompt, filters) && matchesTags(prompt, filters);
}

/**
 * Filters a deck. Normally this is the strict match above. But when two or
 * more filter groups are active and the strict intersection is empty (e.g.
 * "Holidays" + "20+"), it widens to prompts that match the category OR the
 * full tag set, so users rarely hit an empty screen. 18+ category prompts
 * stay hidden in the widened pass unless 18+ is one of the chosen categories.
 */
export function filterPrompts(
  prompts: Prompt[],
  filters: PromptFilters,
): Prompt[] {
  const strict = prompts.filter((prompt) => matchesFilters(prompt, filters));
  if (strict.length > 0 || activeGroupCount(filters) < 2) {
    return strict;
  }

  const adultSelected = filters.category.includes(ADULT_CATEGORY);
  return prompts.filter((prompt) => {
    if (prompt.category === ADULT_CATEGORY && !adultSelected) return false;
    return matchesCategory(prompt, filters) || matchesTags(prompt, filters);
  });
}

import type { GroupSize, Prompt, PromptGame, Vibe } from "@/types";
import type { DeckCard } from "./schema";
import { WYR_CARDS } from "./wouldYouRather";
import { NHIE_CARDS } from "./neverHaveIEver";
import { MLT_CARDS } from "./mostLikelyTo";
import { TOD_CARDS } from "./truthOrDare";
import { TOT_CARDS } from "./thisOrThat";

export type { DeckCard, Heat } from "./schema";
export { WYR_CARDS, NHIE_CARDS, MLT_CARDS, TOD_CARDS, TOT_CARDS };

/** Every leveled card across all five games and all four categories. */
export const ALL_DECK_CARDS: DeckCard[] = [
  ...WYR_CARDS,
  ...NHIE_CARDS,
  ...MLT_CARDS,
  ...TOD_CARDS,
  ...TOT_CARDS,
];

/** Renders a card to a single display string. Binary-choice games get their
 * two options stitched together; everything else uses `text` as-is. */
export function renderText(card: DeckCard): string {
  if (card.game === "would_you_rather") {
    return `Would you rather ${card.optionA}, or ${card.optionB}?`;
  }
  if (card.game === "this_or_that") {
    return `${card.optionA} or ${card.optionB}?`;
  }
  return card.text ?? "";
}

const ALL_GROUP_SIZES: GroupSize[] = ["2-4", "5-10", "11-20", "20+"];

const VIBE_BY_LEVEL: Record<number, Vibe> = {
  1: "Icebreaker",
  2: "Funny",
  3: "Revealing",
  4: "Revealing",
  5: "Wild",
};

/** Adapts a {@link DeckCard} to the legacy {@link Prompt} shape used by the
 * standard (non-18+) card deck and filter bar. */
export function deckCardToPrompt(card: DeckCard): Prompt {
  return {
    id: card.id,
    game: card.game,
    text: renderText(card),
    category: card.category,
    isAdult: card.category === "18+",
    groupSize: ALL_GROUP_SIZES,
    vibe: [VIBE_BY_LEVEL[card.intensity] ?? "Revealing"],
    occasion: [],
    kind: card.kind,
    intensity: card.intensity,
  };
}

function byGame(cards: DeckCard[]): Record<PromptGame, DeckCard[]> {
  const out: Record<PromptGame, DeckCard[]> = {
    would_you_rather: [],
    never_have_i_ever: [],
    most_likely_to: [],
    truth_or_dare: [],
    this_or_that: [],
  };
  for (const card of cards) out[card.game].push(card);
  return out;
}

/** Non-18+ leveled prompts per game, ready to merge into the starter decks. */
export const NORMAL_DECK_PROMPTS: Record<PromptGame, Prompt[]> = (() => {
  const grouped = byGame(ALL_DECK_CARDS.filter((c) => c.category !== "18+"));
  return {
    would_you_rather: grouped.would_you_rather.map(deckCardToPrompt),
    never_have_i_ever: grouped.never_have_i_ever.map(deckCardToPrompt),
    most_likely_to: grouped.most_likely_to.map(deckCardToPrompt),
    truth_or_dare: grouped.truth_or_dare.map(deckCardToPrompt),
    this_or_that: grouped.this_or_that.map(deckCardToPrompt),
  };
})();

/** 18+ leveled cards per game, for the adult decks. */
export const ADULT_DECK_CARDS: Record<PromptGame, DeckCard[]> = byGame(
  ALL_DECK_CARDS.filter((c) => c.category === "18+"),
);

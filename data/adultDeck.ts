import type { PromptGame, TruthOrDareKind } from "@/types";
import { ADULT_DECK_CARDS, renderText, type DeckCard } from "./decks";

export interface AdultCard {
  id: string;
  game: PromptGame;
  prompt: string;
  /** Truth or Dare only. */
  kind?: TruthOrDareKind;
  /** Explicit heat level 1-5. */
  intensity?: number;
}

/*
 * The 18+ decks, one per game, built from the leveled datasets in data/decks.
 * Each game carries 15 cards per heat level (1 = cheeky tease … 5 = filthy),
 * ordered low-to-high so the free preview always starts mild.
 */

function toAdultCard(card: DeckCard): AdultCard {
  return {
    id: card.id,
    game: card.game,
    prompt: renderText(card),
    kind: card.kind,
    intensity: card.intensity,
  };
}

const byIntensity = (a: AdultCard, b: AdultCard) =>
  (a.intensity ?? 3) - (b.intensity ?? 3);

const WOULD_YOU_RATHER: AdultCard[] = ADULT_DECK_CARDS.would_you_rather
  .map(toAdultCard)
  .sort(byIntensity);
const NEVER_HAVE_I_EVER: AdultCard[] = ADULT_DECK_CARDS.never_have_i_ever
  .map(toAdultCard)
  .sort(byIntensity);
const MOST_LIKELY_TO: AdultCard[] = ADULT_DECK_CARDS.most_likely_to
  .map(toAdultCard)
  .sort(byIntensity);
const TRUTH_OR_DARE: AdultCard[] = ADULT_DECK_CARDS.truth_or_dare
  .map(toAdultCard)
  .sort(byIntensity);
const THIS_OR_THAT: AdultCard[] = ADULT_DECK_CARDS.this_or_that
  .map(toAdultCard)
  .sort(byIntensity);

export const ADULT_DECKS: Record<PromptGame, AdultCard[]> = {
  would_you_rather: WOULD_YOU_RATHER,
  never_have_i_ever: NEVER_HAVE_I_EVER,
  most_likely_to: MOST_LIKELY_TO,
  truth_or_dare: TRUTH_OR_DARE,
  this_or_that: THIS_OR_THAT,
};

/** The 18+ deck for a game, with a safe fallback. */
export function adultDeckFor(game: PromptGame): AdultCard[] {
  return ADULT_DECKS[game] ?? WOULD_YOU_RATHER;
}

/** Flat deck + teasers, kept for the party-room prompt pool. */
export const EIGHTEEN_PLUS_DECK: AdultCard[] = [
  ...WOULD_YOU_RATHER,
  ...NEVER_HAVE_I_EVER,
  ...MOST_LIKELY_TO,
];

/** Mildest card from each of the three flat games, the free preview teasers. */
export const ADULT_TEASERS: AdultCard[] = [
  WOULD_YOU_RATHER[0],
  NEVER_HAVE_I_EVER[0],
  MOST_LIKELY_TO[0],
];

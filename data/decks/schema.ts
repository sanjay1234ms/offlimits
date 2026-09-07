import type { PromptCategory, PromptGame, TruthOrDareKind } from "@/types";

/** 1 = cheeky, 5 = completely unhinged. Explicit per card, never derived. */
export type Heat = 1 | 2 | 3 | 4 | 5;

/**
 * The canonical card shape for every leveled deck. Single-statement games
 * (Never Have I Ever, Most Likely To, Truth or Dare) use `text`; binary-choice
 * games (Would You Rather, This or That) use `optionA` / `optionB`.
 */
export interface DeckCard {
  id: string;
  game: PromptGame;
  category: PromptCategory;
  intensity: Heat;
  tags: string[];
  text?: string;
  optionA?: string;
  optionB?: string;
  kind?: TruthOrDareKind;
}

/** Short id slug per category. "18" keeps ids like `wyr_18_lvl5_01`. */
export const CAT_SLUG: Record<PromptCategory, string> = {
  Friends: "fr",
  Office: "of",
  Couples: "cp",
  "18+": "18",
};

const GAME_SLUG: Record<PromptGame, string> = {
  would_you_rather: "wyr",
  never_have_i_ever: "nhie",
  most_likely_to: "mlt",
  truth_or_dare: "tod",
  this_or_that: "tot",
};

const CATEGORY_TAG: Record<PromptCategory, string> = {
  Friends: "friends",
  Office: "office",
  Couples: "couples",
  "18+": "18+",
};

type Counters = Record<string, number>;

interface BuildOpts {
  game: PromptGame;
  category: PromptCategory;
  /** Extra tags merged onto every card in the batch. */
  tags?: string[];
}

/** Rows for a binary-choice game: `[heat, optionA, optionB, ...extraTags]`. */
export type ChoiceRow = [Heat, string, string, ...string[]];
/** Rows for a single-statement game: `[heat, text, ...extraTags]`. */
export type StatementRow = [Heat, string, ...string[]];
/** Rows for Truth or Dare: `[heat, kind, text, ...extraTags]`. */
export type TodRow = [Heat, TruthOrDareKind, string, ...string[]];

function nextId(
  counters: Counters,
  game: PromptGame,
  category: PromptCategory,
  heat: Heat,
): string {
  const key = `${game}-${category}-${heat}`;
  counters[key] = (counters[key] ?? 0) + 1;
  const n = String(counters[key]).padStart(2, "0");
  return `${GAME_SLUG[game]}_${CAT_SLUG[category]}_lvl${heat}_${n}`;
}

function baseTags(
  category: PromptCategory,
  heat: Heat,
  extra: string[],
): string[] {
  const tags = [CATEGORY_TAG[category], `lvl${heat}`, ...extra];
  return Array.from(new Set(tags));
}

export function buildChoice(
  { game, category, tags = [] }: BuildOpts,
  rows: ChoiceRow[],
): DeckCard[] {
  const counters: Counters = {};
  return rows.map(([heat, optionA, optionB, ...rowTags]) => ({
    id: nextId(counters, game, category, heat),
    game,
    category,
    intensity: heat,
    tags: baseTags(category, heat, [...tags, ...rowTags]),
    optionA,
    optionB,
  }));
}

export function buildStatement(
  { game, category, tags = [] }: BuildOpts,
  rows: StatementRow[],
): DeckCard[] {
  const counters: Counters = {};
  return rows.map(([heat, text, ...rowTags]) => ({
    id: nextId(counters, game, category, heat),
    game,
    category,
    intensity: heat,
    tags: baseTags(category, heat, [...tags, ...rowTags]),
    text,
  }));
}

export function buildTod(
  { category, tags = [] }: Omit<BuildOpts, "game">,
  rows: TodRow[],
): DeckCard[] {
  const counters: Counters = {};
  return rows.map(([heat, kind, text, ...rowTags]) => ({
    id: nextId(counters, "truth_or_dare", category, heat),
    game: "truth_or_dare" as const,
    category,
    intensity: heat,
    tags: baseTags(category, heat, [...tags, kind, ...rowTags]),
    text,
    kind,
  }));
}

import { CHRISTMAS_PAGES } from "./christmas";
import { DIRTY_TRUTH_OR_DARE_PAGE } from "./dirtyTruthOrDare";
import { GAME_PAGES } from "./games";
import { GUIDE_PAGES } from "./guides";
import { GIFT_PAGES } from "./gifts";
import { MOST_LIKELY_PAGES } from "./mostLikely";
import { MOST_LIKELY_PILLAR_PAGE } from "./mostLikelyPillar";
import { NEVER_HAVE_I_EVER_PILLAR_PAGE } from "./neverHaveIEverPillar";
import { QUESTION_PAGES } from "./questions";
import { SEASONAL_PAGES } from "./seasonal";
import { SECRET_SANTA_PAGES } from "./secretSanta";
import { TRIVIA_PAGES } from "./trivia";
import { TRUTH_OR_DARE_PAGES } from "./truthOrDare";
import type { KeywordItem, KeywordPage } from "./types";

export type { KeywordItem, KeywordPage, KeywordSection, TriviaItem } from "./types";

export const KEYWORD_PAGES: KeywordPage[] = [
  ...TRUTH_OR_DARE_PAGES,
  DIRTY_TRUTH_OR_DARE_PAGE,
  ...SEASONAL_PAGES,
  ...QUESTION_PAGES,
  MOST_LIKELY_PILLAR_PAGE,
  NEVER_HAVE_I_EVER_PILLAR_PAGE,
  ...MOST_LIKELY_PAGES,
  ...TRIVIA_PAGES,
  ...GAME_PAGES,
  ...GIFT_PAGES,
  ...CHRISTMAS_PAGES,
  ...GUIDE_PAGES,
  ...SECRET_SANTA_PAGES,
];

export function keywordPageByPath(path: string): KeywordPage | undefined {
  return KEYWORD_PAGES.find((p) => p.path === path);
}

/** Keyword pages served from /questions/[slug]. */
export const QUESTION_SLUG_PAGES = KEYWORD_PAGES.filter((p) =>
  p.path.startsWith("/questions/"),
);

export function itemText(item: KeywordItem): string {
  return typeof item === "string" ? item : item.q;
}

export function itemCount(page: KeywordPage): number {
  return page.sections.reduce((n, s) => n + s.items.length, 0);
}

export function fillN(template: string, page: KeywordPage): string {
  return template.replace(/\{n\}/g, String(itemCount(page)));
}

import { GAME_PAGES } from "./games";
import { GIFT_PAGES } from "./gifts";
import { MOST_LIKELY_PAGES } from "./mostLikely";
import { QUESTION_PAGES } from "./questions";
import { SEASONAL_PAGES } from "./seasonal";
import { TRIVIA_PAGES } from "./trivia";
import { TRUTH_OR_DARE_PAGES } from "./truthOrDare";
import type { KeywordItem, KeywordPage } from "./types";

export type { KeywordItem, KeywordPage, KeywordSection, TriviaItem } from "./types";

export const KEYWORD_PAGES: KeywordPage[] = [
  ...TRUTH_OR_DARE_PAGES,
  ...SEASONAL_PAGES,
  ...QUESTION_PAGES,
  ...MOST_LIKELY_PAGES,
  ...TRIVIA_PAGES,
  ...GAME_PAGES,
  ...GIFT_PAGES,
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

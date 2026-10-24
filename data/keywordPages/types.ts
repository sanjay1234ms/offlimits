/** Hand-written, search-targeted content pages (question lists, trivia,
 * gift guides, rules). Rendered by components/KeywordPage.tsx. */

export interface TriviaItem {
  q: string;
  a: string;
}

export type KeywordItem = string | TriviaItem;

export interface KeywordSection {
  heading: string;
  /** One or two sentences under the heading. */
  intro?: string;
  items: KeywordItem[];
}

export interface KeywordPage {
  /** Full path, e.g. "/questions/christmas-trivia-questions". */
  path: string;
  /** <title>, without the " | OffLimits" suffix. `{n}` = item count. */
  title: string;
  /** Meta description. `{n}` = item count. */
  description: string;
  h1: string;
  eyebrow: string;
  emojis: [string, string, string];
  /** Paragraph under the h1. `{n}` = item count. */
  intro: string;
  sections: KeywordSection[];
  /** Numbered "How to play" steps. */
  howTo?: string[];
  tips?: { title: string; body: string }[];
  faq: { q: string; a: string }[];
  /** Primary call to action into a live game or tool. */
  play?: { href: string; label: string };
  /** Paths of related pages to link at the bottom. */
  related: string[];
  /** Hub grouping on /questions. */
  group: "seasonal" | "questions" | "trivia" | "games" | "gifts";
  /** Adults-only wording; shows an 18+ notice. */
  adult?: boolean;
}

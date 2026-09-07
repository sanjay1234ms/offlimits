import type {
  GroupSize,
  PromptCategory,
  PromptFilters,
  PromptOccasion,
  Vibe,
} from "@/types";

/** Filter-bar options, in display order. */
export const categoryOptions: PromptCategory[] = [
  "Friends",
  "Office",
  "Couples",
  "18+",
];

export const groupSizeOptions: GroupSize[] = ["2-4", "5-10", "11-20", "20+"];

export const vibeOptions: Vibe[] = [
  "Icebreaker",
  "Funny",
  "Revealing",
  "Wild",
];

export type FilterGroupKey = keyof PromptFilters;

/** The rows rendered in the filter bar (occasion is set via the route, not here). */
export const filterGroups: {
  key: FilterGroupKey;
  label: string;
  options: readonly string[];
}[] = [
  { key: "category", label: "Category", options: categoryOptions },
  { key: "groupSize", label: "Group Size", options: groupSizeOptions },
  { key: "vibe", label: "Vibe", options: vibeOptions },
];

export function countActiveFilters(filters: PromptFilters): number {
  return (
    filters.category.length +
    filters.groupSize.length +
    filters.vibe.length +
    filters.occasion.length
  );
}

/* ------------------------------------------------------------------ *
 * Occasions, slug <-> display label, used by /occasions/[slug]
 * ------------------------------------------------------------------ */

export const OCCASION_BY_SLUG: Record<string, PromptOccasion> = {
  "office-party": "Office Party",
  "game-night": "Game Night",
  "road-trip": "Road Trip",
  "date-night": "Date Night",
  birthday: "Birthday",
  holidays: "Holidays",
};

export const occasionSlugs: string[] = Object.keys(OCCASION_BY_SLUG);

export function occasionBySlug(slug: string): PromptOccasion | undefined {
  return OCCASION_BY_SLUG[slug];
}

export function slugForOccasion(occasion: PromptOccasion): string {
  const entry = occasionSlugs.find(
    (slug) => OCCASION_BY_SLUG[slug] === occasion,
  );
  return entry ?? "";
}

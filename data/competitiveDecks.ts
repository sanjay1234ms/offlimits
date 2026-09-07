/** Tagged, filterable datasets for the four competitive games. Each card
 * carries a category, a heat level (1 cheeky → 5 filthy), and vibe tags, so the
 * shared filter bar + Spicy Meter narrow them exactly like the pass-the-phone
 * decks. The 18+ category holds the spicier content behind the preview gate. */

import type { PromptCategory, Vibe } from "@/types";

export type Heat = 1 | 2 | 3 | 4 | 5;

export interface CompCardBase {
  id: string;
  category: PromptCategory;
  intensity: Heat;
  vibe: Vibe[];
}
export interface TriviaCard extends CompCardBase {
  q: string;
  a: string;
}
export interface WordCard extends CompCardBase {
  text: string;
}
export interface BuzzCard extends CompCardBase {
  target: string;
  forbidden: [string, string, string];
}

const VIBE_BY_HEAT: Record<Heat, Vibe[]> = {
  1: ["Icebreaker"],
  2: ["Funny", "Icebreaker"],
  3: ["Revealing", "Funny"],
  4: ["Revealing", "Wild"],
  5: ["Wild"],
};

const CAT_SLUG: Record<PromptCategory, string> = {
  Friends: "fr",
  Office: "of",
  Couples: "cp",
  "18+": "18",
};

type TriviaRow = [Heat, string, string];
type WordRow = [Heat, string];
type BuzzRow = [Heat, string, string, string, string];

function mkId(prefix: string, cat: PromptCategory, heat: Heat, n: number) {
  return `${prefix}_${CAT_SLUG[cat]}_l${heat}_${String(n).padStart(2, "0")}`;
}

function buildTrivia(cat: PromptCategory, rows: TriviaRow[]): TriviaCard[] {
  const c: Record<number, number> = {};
  return rows.map(([intensity, q, a]) => {
    c[intensity] = (c[intensity] ?? 0) + 1;
    return {
      id: mkId("tv", cat, intensity, c[intensity]),
      category: cat,
      intensity,
      vibe: VIBE_BY_HEAT[intensity],
      q,
      a,
    };
  });
}

function buildWords(
  prefix: string,
  cat: PromptCategory,
  rows: WordRow[],
): WordCard[] {
  const c: Record<number, number> = {};
  return rows.map(([intensity, text]) => {
    c[intensity] = (c[intensity] ?? 0) + 1;
    return {
      id: mkId(prefix, cat, intensity, c[intensity]),
      category: cat,
      intensity,
      vibe: VIBE_BY_HEAT[intensity],
      text,
    };
  });
}

function buildBuzz(cat: PromptCategory, rows: BuzzRow[]): BuzzCard[] {
  const c: Record<number, number> = {};
  return rows.map(([intensity, target, f1, f2, f3]) => {
    c[intensity] = (c[intensity] ?? 0) + 1;
    return {
      id: mkId("bz", cat, intensity, c[intensity]),
      category: cat,
      intensity,
      vibe: VIBE_BY_HEAT[intensity],
      target,
      forbidden: [f1, f2, f3] as [string, string, string],
    };
  });
}

/* ================================================================== *
 * TRIVIA
 * ================================================================== */

export const TRIVIA_DECK: TriviaCard[] = [
  ...buildTrivia("Friends", [
    [1, "How many sides does a hexagon have?", "Six"],
    [1, "What is the largest planet in our solar system?", "Jupiter"],
    [1, "Mixing blue and yellow paint gives which colour?", "Green"],
    [1, "How many players from one team are on a football pitch?", "Eleven"],
    [1, "What is the capital of Japan?", "Tokyo"],
    [1, "Which ocean is the largest?", "The Pacific"],
    [2, "What year did the first iPhone launch?", "2007"],
    [2, "Which is the only mammal that cannot jump?", "The elephant"],
    [2, "How many bones are in the adult human body?", "206"],
    [2, "Which country is credited with inventing tea?", "China"],
    [2, "What is the fastest land animal?", "The cheetah"],
    [2, "What is the chemical symbol for gold?", "Au"],
  ]),
  ...buildTrivia("Office", [
    [1, "What does 'CEO' stand for?", "Chief Executive Officer"],
    [1, "Which shortcut copies a cell in a spreadsheet?", "Ctrl+C (or Cmd+C)"],
    [2, "What does 'EOD' mean in an email?", "End of day"],
    [2, "In agile, what is a short fixed work cycle called?", "A sprint"],
    [2, "What accounting term means money a company owes?", "Liabilities"],
    [3, "What does 'RTO' stand for in office debates?", "Return to office"],
    [3, "What does a '9-box grid' assess?", "Performance and potential"],
    [3, "What phrase means doing only exactly your job description?", "Quiet quitting"],
  ]),
  ...buildTrivia("Couples", [
    [2, "Which flower most traditionally means 'true love'?", "The red rose"],
    [2, "What is the traditional first-anniversary gift?", "Paper"],
    [2, "Which city is most famous for its 'love lock' bridge?", "Paris"],
    [3, "Which hormone is nicknamed the 'love hormone'?", "Oxytocin"],
    [3, "What is the giddy early stage of a relationship called?", "The honeymoon phase"],
    [3, "What date is 'Galentine's Day'?", "February 13th"],
    [3, "Who wrote 'The Five Love Languages'? (surname)", "Chapman"],
    [3, "The 'seven-year itch' is said to strike after how long?", "Seven years"],
  ]),
  ...buildTrivia("18+", [
    [3, "What does 'DTF' stand for? (keep it PG)", "Down to… fool around"],
    [3, "What colour is a 'red-light district' named for?", "Red"],
    [3, "What is the polite term for a one-night stand's morning exit?", "The walk of shame"],
    [4, "What is the 'refractory period'?", "The recovery time between rounds"],
    [4, "Which French phrase literally means 'the little death'?", "La petite mort"],
    [4, "Which vitamin is nicknamed the 'sex vitamin' for libido?", "Vitamin D"],
    [4, "What colour-based system do kink communities use for consent?", "Traffic lights (red / amber / green)"],
    [5, "What does 'BDSM' stand for?", "Bondage, Discipline, Dominance, Submission, Sadism, Masochism"],
    [5, "What is the fear of intimacy called?", "Genophobia"],
    [5, "Which ancient Indian text is the classic guide to pleasure?", "The Kama Sutra"],
    [5, "What is arousal from being watched called?", "Exhibitionism"],
    [5, "What is arousal from watching called?", "Voyeurism"],
  ]),
];

/* ================================================================== *
 * CHARADES
 * ================================================================== */

export const CHARADES_DECK: WordCard[] = [
  ...buildWords("ch", "Friends", [
    [1, "Walking a dog that refuses to move"],
    [1, "Taking a selfie"],
    [1, "Blowing out birthday candles"],
    [1, "Riding a rollercoaster"],
    [1, "Making a cup of tea"],
    [2, "Assembling flat-pack furniture with no instructions"],
    [2, "Sneaking past a sleeping parent"],
    [2, "A cat knocking things off a table"],
    [2, "Losing your phone while holding it"],
    [2, "Reacting to a very spicy chicken wing"],
    [2, "A magician whose trick just failed"],
    [2, "Trying to parallel park"],
  ]),
  ...buildWords("ch", "Office", [
    [1, "Pretending to look busy as the boss walks by"],
    [1, "A printer-jam meltdown"],
    [2, "Falling asleep in a meeting and jolting awake"],
    [2, "Reply-all regret"],
    [2, "The 'you're on mute' hand gestures"],
    [3, "Quietly stealing someone's labelled lunch"],
    [3, "Getting caught watching something on your phone"],
    [3, "Handing in your resignation letter"],
  ]),
  ...buildWords("ch", "Couples", [
    [2, "A first-date handshake gone wrong"],
    [2, "Slow dancing alone in the kitchen"],
    [2, "Fighting over the last slice"],
    [3, "Sliding into someone's DMs"],
    [3, "A dramatic airport reunion"],
    [3, "Looking casual while waiting for a text back"],
    [3, "The 'we need to talk' face"],
    [3, "Taking a hundred photos to get one good couple shot"],
  ]),
  ...buildWords("ch", "18+", [
    [3, "A very awkward morning after"],
    [3, "Hiding a hickey with a scarf"],
    [3, "Getting caught mid-makeout by a flatmate"],
    [4, "A striptease that immediately goes wrong"],
    [4, "Fumbling with a bra clasp"],
    [4, "Trying to stay quiet in a room with thin walls"],
    [4, "A very unsexy attempt at a seductive crawl"],
    [4, "Knocking over a lamp mid-seduction"],
    [5, "Explaining a very questionable search history"],
    [5, "A walk of shame in last night's outfit"],
    [5, "Opening the 'adult' drawer for the first time"],
    [5, "Forgetting the safeword at the worst moment"],
  ]),
];

/* ================================================================== *
 * FAST 5
 * ================================================================== */

export const FAST5_DECK: WordCard[] = [
  ...buildWords("f5", "Friends", [
    [1, "breakfast foods"],
    [1, "things in a fridge"],
    [1, "board games"],
    [1, "types of dog"],
    [1, "things that are cold"],
    [2, "movie villains"],
    [2, "sports played with a ball"],
    [2, "pizza toppings"],
    [2, "things that fly"],
    [2, "flavours of ice cream"],
    [2, "things in a wallet"],
    [2, "words that mean 'tired'"],
  ]),
  ...buildWords("f5", "Office", [
    [1, "things on a desk"],
    [1, "reasons to be late for work"],
    [2, "corporate buzzwords"],
    [2, "types of meeting nobody needs"],
    [2, "excuses for a missed deadline"],
    [3, "things you'd never say to your boss"],
    [3, "reasons to take a 'sick day'"],
    [3, "things people do while on mute"],
  ]),
  ...buildWords("f5", "Couples", [
    [2, "date-night ideas"],
    [2, "romantic films"],
    [2, "things couples argue about"],
    [3, "red flags on a first date"],
    [3, "pet names for a partner"],
    [3, "things people snoop for in a partner's phone"],
    [3, "last-minute gift ideas"],
    [3, "excuses for not texting back"],
  ]),
  ...buildWords("f5", "18+", [
    [3, "places people hook up but probably shouldn't"],
    [3, "things found in a bedside drawer"],
    [3, "terrible pick-up lines"],
    [4, "things whispered in the dark"],
    [4, "reasons the neighbours complained"],
    [4, "items on a 'spicy' shopping list"],
    [4, "excuses for the noise last night"],
    [5, "things you'd never admit are in your search history"],
    [5, "kinks people pretend they don't have"],
    [5, "questionable safewords"],
    [5, "things that kill the mood instantly"],
    [5, "lies told to get someone into bed"],
  ]),
];

/* ================================================================== *
 * BUZZKILL
 * ================================================================== */

export const BUZZKILL_DECK: BuzzCard[] = [
  ...buildBuzz("Friends", [
    [1, "Pizza", "cheese", "slice", "Italian"],
    [1, "Beach", "sand", "sea", "sun"],
    [1, "Netflix", "streaming", "TV", "watch"],
    [1, "Coffee", "caffeine", "morning", "cup"],
    [2, "Selfie", "photo", "camera", "phone"],
    [2, "Karaoke", "sing", "microphone", "song"],
    [2, "Traffic", "cars", "jam", "road"],
    [2, "Umbrella", "rain", "wet", "hold"],
    [2, "Snowman", "cold", "carrot", "melt"],
    [2, "Rollercoaster", "ride", "loop", "scream"],
    [2, "Podcast", "listen", "episode", "audio"],
    [2, "Alarm clock", "wake", "morning", "snooze"],
  ]),
  ...buildBuzz("Office", [
    [1, "Meeting", "work", "boring", "calendar"],
    [1, "Email", "inbox", "send", "reply"],
    [2, "Deadline", "due", "late", "Friday"],
    [2, "Spreadsheet", "Excel", "cells", "rows"],
    [2, "Promotion", "raise", "title", "manager"],
    [3, "Layoffs", "fired", "jobs", "restructure"],
    [3, "Micromanager", "boss", "control", "check"],
    [3, "Burnout", "tired", "stress", "quit"],
  ]),
  ...buildBuzz("Couples", [
    [2, "Anniversary", "date", "years", "celebrate"],
    [2, "Text back", "phone", "reply", "message"],
    [2, "Cuddle", "hug", "sofa", "warm"],
    [3, "Ex", "past", "relationship", "old"],
    [3, "Jealousy", "envy", "green", "insecure"],
    [3, "Ghosting", "ignore", "reply", "disappear"],
    [3, "The Talk", "serious", "relationship", "define"],
    [3, "Situationship", "unlabelled", "casual", "vibes"],
  ]),
  ...buildBuzz("18+", [
    [3, "Hickey", "neck", "bruise", "mark"],
    [3, "Sexting", "phone", "message", "explicit"],
    [3, "One-night stand", "hookup", "stranger", "morning"],
    [4, "Foreplay", "kissing", "before", "warm-up"],
    [4, "Handcuffs", "wrists", "metal", "police"],
    [4, "Blindfold", "eyes", "cover", "cloth"],
    [4, "Lingerie", "underwear", "lace", "bedroom"],
    [4, "Massage oil", "rub", "slippery", "back"],
    [5, "Safeword", "stop", "kink", "agree"],
    [5, "Body count", "number", "partners", "total"],
    [5, "Dominatrix", "whip", "leather", "boss"],
    [5, "Roleplay", "costume", "pretend", "character"],
  ]),
];

/* ================================================================== *
 * Filtering
 * ================================================================== */

export interface CompFilterState {
  category: PromptCategory[];
  vibe: Vibe[];
  /** Recorded for pressed styling; group size seeds players, it doesn't filter. */
  groupSize: string[];
  heat: number;
}

export const emptyCompFilters = (heat: number): CompFilterState => ({
  category: [],
  vibe: [],
  groupSize: [],
  heat,
});

/** Narrows a deck by category + vibe + heat, widening if a combination would
 * otherwise show nothing. 18+ cards stay hidden unless "18+" is selected. */
export function filterComp<T extends CompCardBase>(
  cards: T[],
  f: CompFilterState,
): T[] {
  const adult = f.category.includes("18+");
  let pool = cards.filter((c) =>
    adult ? c.category === "18+" : c.category !== "18+",
  );

  if (!adult && f.category.length > 0) {
    const byCat = pool.filter((c) => f.category.includes(c.category));
    if (byCat.length > 0) pool = byCat;
  }

  if (f.vibe.length > 0) {
    const byVibe = pool.filter((c) =>
      c.vibe.some((v) => f.vibe.includes(v)),
    );
    if (byVibe.length > 0) pool = byVibe;
  }

  const byHeat = pool.filter((c) => c.intensity <= f.heat);
  if (byHeat.length > 0) pool = byHeat;

  return pool.length > 0
    ? pool
    : cards.filter((c) => c.category !== "18+");
}

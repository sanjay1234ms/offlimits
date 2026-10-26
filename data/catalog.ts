/** The full OffLimits game catalog. The 5 dual-deck games have their own
 * pages at /games/[slug] (data/corePages.ts) on the /play engine; the extra
 * engine games play at /games/[slug] too. */

export type GameEngine =
  | "simple"
  | "truth-or-dare"
  | "trivia"
  | "charades"
  | "odd-one-out"
  | "buzzkill"
  | "fast-5"
  | "pirate-barrel"
  | "rps";

/** Catalog filter vocabularies (game-card level, not prompt level). */
export type CatalogGroupSize = "2-4" | "5-10" | "11-20" | "20+";
export type CatalogAudience =
  | "Family"
  | "Friends"
  | "Office"
  | "Couples"
  | "18+";
export type CatalogVibe =
  | "Icebreaker"
  | "Funny"
  | "Competitive"
  | "Revealing"
  | "Quick fire";

export interface CatalogGame {
  /** Route slug for /games/[slug]; for core decks it's the ?game= key. */
  slug: string;
  title: string;
  emoji: string;
  blurb: string;
  players: string;
  time: string;
  mode: string;
  href: string;
  gradient: string;
  border: string;
  text: string;
  groupSizes: CatalogGroupSize[];
  audiences: CatalogAudience[];
  vibes: CatalogVibe[];
  /** Set for the engine games at /games/[slug]. */
  engine?: GameEngine;
  stem?: string;
  /** True for the 18+ umbrella card (hidden from normal browsing). */
  adult?: boolean;
  /** True for the games that have both a clean and an 18+ deck. */
  dualDeck?: boolean;
  /** True for games that support the live scoreboard + podium finish. */
  competitive?: boolean;
  /** Occasion games live on an event page, e.g. "Bachelorette". */
  occasion?: string;
}

export const CATALOG: CatalogGame[] = [
  {
    slug: "would_you_rather",
    title: "Would You Rather",
    emoji: "🤔",
    blurb: "Two impossible options. Pick one, then defend it to the death.",
    players: "3+ players",
    time: "10-20 min",
    mode: "One phone",
    href: "/games/would-you-rather",
    gradient: "from-indigo-600/20 to-purple-600/10",
    border: "border-indigo-500/40",
    text: "text-indigo-300",
    groupSizes: ["2-4", "5-10", "11-20", "20+"],
    audiences: ["Family", "Friends", "Office", "Couples"],
    vibes: ["Icebreaker", "Funny", "Revealing"],
    dualDeck: true,
  },
  {
    slug: "never_have_i_ever",
    title: "Never Have I Ever",
    emoji: "🙈",
    blurb: "Put a finger down. Everyone is watching, nobody is safe.",
    players: "4+ players",
    time: "10-25 min",
    mode: "One phone",
    href: "/games/never-have-i-ever",
    gradient: "from-rose-600/20 to-pink-600/10",
    border: "border-rose-500/40",
    text: "text-rose-300",
    groupSizes: ["5-10", "11-20", "20+"],
    audiences: ["Friends", "Couples"],
    vibes: ["Funny", "Revealing"],
    dualDeck: true,
  },
  {
    slug: "most_likely_to",
    title: "Most Likely To",
    emoji: "👉",
    blurb: "Point at someone. No takebacks, no mercy.",
    players: "3+ players",
    time: "10-20 min",
    mode: "One phone",
    href: "/games/most-likely-to",
    gradient: "from-amber-600/20 to-orange-600/10",
    border: "border-amber-500/40",
    text: "text-amber-300",
    groupSizes: ["5-10", "11-20", "20+"],
    audiences: ["Family", "Friends", "Office"],
    vibes: ["Funny", "Competitive"],
    dualDeck: true,
  },
  {
    slug: "this_or_that",
    title: "This or That",
    emoji: "⚡",
    blurb: "Rapid fire, first instinct, no thinking allowed.",
    players: "2+ players",
    time: "5-15 min",
    mode: "One phone",
    href: "/games/this-or-that",
    gradient: "from-pink-600/25 to-fuchsia-600/10",
    border: "border-pink-500/40",
    text: "text-pink-300",
    groupSizes: ["2-4", "5-10", "11-20", "20+"],
    audiences: ["Family", "Friends", "Office", "Couples"],
    vibes: ["Quick fire", "Funny", "Icebreaker"],
    dualDeck: true,
  },
  {
    slug: "truth_or_dare",
    title: "Truth or Dare",
    emoji: "😈",
    blurb: "Pick your lane, then take whatever the phone deals.",
    players: "2-12 players",
    time: "10-30 min",
    mode: "One phone",
    href: "/games/truth-or-dare",
    gradient: "from-rose-600/25 to-pink-600/10",
    border: "border-rose-500/40",
    text: "text-rose-300",
    groupSizes: ["2-4", "5-10", "11-20"],
    audiences: ["Friends", "Couples"],
    vibes: ["Funny", "Revealing"],
    dualDeck: true,
  },
  {
    slug: "18plus",
    title: "18+ Uncensored",
    emoji: "🔥",
    blurb: "Filthy confessions, wild dares, zero-filter late night questions.",
    players: "3+ players",
    time: "15-40 min",
    mode: "One phone",
    href: "/play?game=18plus",
    gradient: "from-red-600/25 to-rose-950/40",
    border: "border-red-500/50",
    text: "text-red-300",
    groupSizes: ["2-4", "5-10", "11-20"],
    audiences: ["18+"],
    vibes: ["Revealing", "Funny"],
    adult: true,
  },
  {
    slug: "trivia",
    title: "Trivia",
    emoji: "❓",
    blurb: "Questions read out, answers revealed with a tap.",
    players: "1+ players",
    time: "5-30 min",
    mode: "One screen",
    href: "/games/trivia",
    gradient: "from-violet-600/25 to-purple-600/10",
    border: "border-violet-500/40",
    text: "text-violet-300",
    groupSizes: ["2-4", "5-10", "11-20", "20+"],
    audiences: ["Family", "Friends", "Office"],
    vibes: ["Competitive", "Quick fire"],
    engine: "trivia",
    competitive: true,
  },
  {
    slug: "odd-one-out",
    title: "Odd One Out",
    emoji: "🕵️",
    blurb: "Everyone knows the word except the imposter. Pass to reveal roles.",
    players: "3-30 players",
    time: "10-20 min",
    mode: "One phone",
    href: "/games/odd-one-out",
    gradient: "from-lime-600/25 to-green-600/10",
    border: "border-lime-500/40",
    text: "text-lime-300",
    groupSizes: ["5-10", "11-20", "20+"],
    audiences: ["Friends", "Office"],
    vibes: ["Competitive", "Funny"],
    engine: "odd-one-out",
  },
  {
    slug: "fake-news-factory",
    title: "Fake News Factory",
    emoji: "📰",
    blurb: "Write a convincing lie, then spot everyone else's.",
    players: "3-10 players",
    time: "20-40 min",
    mode: "One phone",
    href: "/games/fake-news-factory",
    gradient: "from-orange-600/25 to-amber-600/10",
    border: "border-orange-500/40",
    text: "text-orange-300",
    groupSizes: ["5-10", "11-20"],
    audiences: ["Friends", "Office"],
    vibes: ["Funny", "Competitive"],
    engine: "simple",
    stem: "Write a convincing lie about this, then read them all out:",
  },
  {
    slug: "charades",
    title: "Charades",
    emoji: "🎭",
    blurb: "Acting prompts with a functional 60-second timer.",
    players: "4-20 players",
    time: "15-30 min",
    mode: "One phone",
    href: "/games/charades",
    gradient: "from-amber-500/25 to-yellow-600/10",
    border: "border-amber-500/40",
    text: "text-amber-300",
    groupSizes: ["5-10", "11-20", "20+"],
    audiences: ["Family", "Friends", "Office"],
    vibes: ["Funny", "Competitive", "Quick fire"],
    engine: "charades",
    competitive: true,
  },
  {
    slug: "miss-a-beat",
    title: "Miss a Beat",
    emoji: "🥁",
    blurb: "Rhythmic word association. Tap to advance or mark someone out.",
    players: "2-12 players",
    time: "10-20 min",
    mode: "One screen",
    href: "/games/miss-a-beat",
    gradient: "from-pink-500/25 to-rose-500/10",
    border: "border-pink-400/40",
    text: "text-pink-300",
    groupSizes: ["2-4", "5-10", "11-20"],
    audiences: ["Family", "Friends"],
    vibes: ["Quick fire", "Competitive"],
    engine: "simple",
    stem: "Go round the circle naming things in this category, in rhythm:",
  },
  {
    slug: "say-it-backwards",
    title: "Say It Backwards",
    emoji: "🔄",
    blurb: "Read phonetic phrases backwards, teammates decode.",
    players: "4-20 players",
    time: "15-30 min",
    mode: "One phone",
    href: "/games/say-it-backwards",
    gradient: "from-green-500/25 to-emerald-600/10",
    border: "border-green-500/40",
    text: "text-green-300",
    groupSizes: ["5-10", "11-20", "20+"],
    audiences: ["Family", "Friends", "Office"],
    vibes: ["Funny", "Competitive"],
    engine: "simple",
    stem: "Read this out loud backwards. Your team has to decode it:",
  },
  {
    slug: "how-well-do-you-know-me",
    title: "How Well Do You Know Me",
    emoji: "💖",
    blurb: "Two-player question comparison. Answer, then compare.",
    players: "2 players",
    time: "10-20 min",
    mode: "One phone",
    href: "/games/how-well-do-you-know-me",
    gradient: "from-pink-600/25 to-rose-600/10",
    border: "border-pink-500/40",
    text: "text-pink-300",
    groupSizes: ["2-4"],
    audiences: ["Couples", "Friends"],
    vibes: ["Revealing", "Icebreaker"],
    engine: "simple",
    stem: "Both write your answer, then compare:",
  },
  {
    slug: "buzzkill",
    title: "Buzzkill",
    emoji: "🚫",
    blurb: "Describe the word without saying any of the three forbidden ones. 30 seconds.",
    players: "4-16 players",
    time: "15-30 min",
    mode: "One phone",
    href: "/games/buzzkill",
    gradient: "from-red-600/20 to-rose-600/10",
    border: "border-red-500/40",
    text: "text-red-300",
    groupSizes: ["5-10", "11-20"],
    audiences: ["Family", "Friends", "Office"],
    vibes: ["Competitive", "Quick fire", "Funny"],
    engine: "buzzkill",
    competitive: true,
  },
  {
    slug: "fast-5",
    title: "Fast 5",
    emoji: "⏱️",
    blurb: "Name five things in the category before the five-second buzzer.",
    players: "2-12 players",
    time: "10-20 min",
    mode: "One screen",
    href: "/games/fast-5",
    gradient: "from-cyan-600/20 to-sky-600/10",
    border: "border-cyan-500/40",
    text: "text-cyan-300",
    groupSizes: ["2-4", "5-10", "11-20"],
    audiences: ["Family", "Friends", "Office"],
    vibes: ["Competitive", "Quick fire"],
    engine: "fast-5",
    competitive: true,
  },
  {
    slug: "pirate-barrel",
    title: "Pirate Barrel",
    emoji: "🏴‍☠️",
    blurb: "Take turns throwing knives into the barrel. Hit the wrong slot and the pirate goes flying.",
    players: "2-20 players",
    time: "1-2 min a round",
    mode: "One phone",
    href: "/games/pirate-barrel",
    gradient: "from-amber-600/25 to-orange-700/10",
    border: "border-amber-500/40",
    text: "text-amber-300",
    groupSizes: ["2-4", "5-10", "11-20"],
    audiences: ["Family", "Friends", "Office"],
    vibes: ["Funny", "Quick fire"],
    engine: "pirate-barrel",
  },
  {
    slug: "rock-paper-scissors",
    title: "Rock Paper Scissors",
    emoji: "✊",
    blurb: "3D showdown against a computer that learns your habits, or a friend on the same phone.",
    players: "1-2 players",
    time: "1-3 min",
    mode: "One phone",
    href: "/games/rock-paper-scissors",
    gradient: "from-violet-600/25 to-fuchsia-700/10",
    border: "border-violet-500/40",
    text: "text-violet-300",
    groupSizes: ["2-4"],
    audiences: ["Family", "Friends", "Office", "Couples"],
    vibes: ["Competitive", "Quick fire"],
    engine: "rps",
    competitive: true,
  },

  /* Occasion games: they live on the event pages (/<occasion>#play-<tool>). */
  {
    slug: "bride-truth-or-dare",
    title: "Bachelorette Truth or Dare",
    emoji: "👰",
    blurb: "The Bride Edition deck: truths, dares, Never Have I Ever and Most Likely To, from cute to filthy on a five-step spicy meter.",
    players: "3+ players",
    time: "Endless",
    mode: "One phone",
    href: "/bachelorette-party-games#play-deck",
    gradient: "from-fuchsia-600/25 to-rose-700/10",
    border: "border-fuchsia-500/40",
    text: "text-fuchsia-300",
    groupSizes: ["2-4", "5-10", "11-20"],
    audiences: ["Friends", "18+"],
    vibes: ["Revealing", "Funny"],
    occasion: "Bachelorette",
  },
  {
    slug: "how-well-do-you-know-the-bride",
    title: "How Well Do You Know the Bride",
    emoji: "💍",
    blurb: "Make a quiz about the bride, send the link, and everyone plays on their own phone with a live leaderboard.",
    players: "3-50 players",
    time: "5 min",
    mode: "Every phone",
    href: "/bachelorette-party-games#play-quiz",
    gradient: "from-pink-600/25 to-purple-700/10",
    border: "border-pink-500/40",
    text: "text-pink-300",
    groupSizes: ["5-10", "11-20", "20+"],
    audiences: ["Friends", "Family"],
    vibes: ["Competitive", "Revealing"],
    occasion: "Bachelorette",
  },
  {
    slug: "most-likely-to-vote",
    title: "Most Likely To: Secret Vote",
    emoji: "🗳️",
    blurb: "Everyone votes in secret on one phone, then the bars race up and a winner gets crowned.",
    players: "3-12 players",
    time: "10 min",
    mode: "One phone",
    href: "/most-likely-to-game",
    gradient: "from-orange-600/25 to-amber-700/10",
    border: "border-orange-500/40",
    text: "text-orange-300",
    groupSizes: ["2-4", "5-10", "11-20"],
    audiences: ["Family", "Friends", "Office"],
    vibes: ["Funny", "Revealing"],
    occasion: "Any party",
  },
  {
    slug: "couples-quiz",
    title: "Couples Quiz",
    emoji: "💞",
    blurb: "Both answer in secret on one phone. Match to score, and find out how in sync you really are.",
    players: "2 players",
    time: "10 min",
    mode: "One phone",
    href: "/valentines-day-games#play-quiz",
    gradient: "from-rose-600/25 to-red-700/10",
    border: "border-rose-500/40",
    text: "text-rose-300",
    groupSizes: ["2-4"],
    audiences: ["Couples"],
    vibes: ["Revealing", "Funny"],
    occasion: "Valentine's Day",
  },
  {
    slug: "couples-truth-or-dare",
    title: "Couples Truth or Dare",
    emoji: "💋",
    blurb: "A five-level deck for two, from sweet to very much not. The top three levels are 18+.",
    players: "2 players",
    time: "Endless",
    mode: "One phone",
    href: "/valentines-day-games#play-deck",
    gradient: "from-red-600/25 to-fuchsia-800/10",
    border: "border-red-500/40",
    text: "text-red-300",
    groupSizes: ["2-4"],
    audiences: ["Couples", "18+"],
    vibes: ["Revealing"],
    occasion: "Valentine's Day",
  },
  {
    slug: "pass-the-turkey",
    title: "Pass the Turkey",
    emoji: "🦃",
    blurb: "Hot potato for the Thanksgiving table. Whoever's holding the phone when it gobbles answers the question.",
    players: "4+ players",
    time: "Endless",
    mode: "One phone",
    href: "/thanksgiving-games#play-turkey",
    gradient: "from-amber-600/25 to-orange-700/10",
    border: "border-amber-500/40",
    text: "text-amber-300",
    groupSizes: ["5-10", "11-20"],
    audiences: ["Family", "Friends"],
    vibes: ["Funny", "Quick fire"],
    occasion: "Thanksgiving",
  },
  {
    slug: "pass-the-present",
    title: "Pass the Present",
    emoji: "🎁",
    blurb: "A birthday hot potato with a ticking timer. When it pops, the holder does the challenge.",
    players: "4+ players",
    time: "Endless",
    mode: "One phone",
    href: "/birthday-party-games#play-present",
    gradient: "from-sky-600/25 to-violet-700/10",
    border: "border-sky-500/40",
    text: "text-sky-300",
    groupSizes: ["5-10", "11-20"],
    audiences: ["Family", "Friends"],
    vibes: ["Funny", "Quick fire"],
    occasion: "Birthday",
  },
  {
    slug: "baby-prediction-pool",
    title: "Baby Prediction Pool",
    emoji: "🍼",
    blurb: "Guests guess the birth date, weight and more on their own phones. Enter the real results and crown a winner.",
    players: "Any group",
    time: "2 min to join",
    mode: "Every phone",
    href: "/baby-shower-games#play-pool",
    gradient: "from-sky-600/25 to-indigo-700/10",
    border: "border-sky-500/40",
    text: "text-sky-300",
    groupSizes: ["5-10", "11-20", "20+"],
    audiences: ["Family", "Friends", "Office"],
    vibes: ["Competitive"],
    occasion: "Baby shower",
  },
  {
    slug: "price-is-right-baby",
    title: "The Price Is Right: Baby",
    emoji: "💸",
    blurb: "Guess what baby gear really costs. Closest without going over earns the bonus.",
    players: "Any group",
    time: "10 min",
    mode: "One phone",
    href: "/baby-shower-games#play-price",
    gradient: "from-emerald-600/25 to-teal-700/10",
    border: "border-emerald-500/40",
    text: "text-emerald-300",
    groupSizes: ["2-4", "5-10", "11-20"],
    audiences: ["Family", "Friends", "Office"],
    vibes: ["Competitive", "Funny"],
    occasion: "Baby shower",
  },
  {
    slug: "he-said-she-said",
    title: "He Said, She Said",
    emoji: "🗣️",
    blurb: "Guess whether the bride or groom said it. Everyone plays on their own phone with a live leaderboard.",
    players: "3-60 players",
    time: "5 min",
    mode: "Every phone",
    href: "/bridal-shower-games#play-hesaid",
    gradient: "from-rose-600/25 to-pink-700/10",
    border: "border-rose-500/40",
    text: "text-rose-300",
    groupSizes: ["5-10", "11-20", "20+"],
    audiences: ["Family", "Friends"],
    vibes: ["Competitive", "Funny"],
    occasion: "Bridal shower",
  },
  {
    slug: "bridal-shower-bingo",
    title: "Bridal Shower Bingo",
    emoji: "🎀",
    blurb: "A fresh 5x5 card for every guest. Mark gifts as the bride opens them; the card shouts BINGO for you.",
    players: "Any group",
    time: "Gift opening",
    mode: "Every phone",
    href: "/bridal-shower-games#play-bingo",
    gradient: "from-amber-600/25 to-rose-700/10",
    border: "border-amber-500/40",
    text: "text-amber-300",
    groupSizes: ["5-10", "11-20", "20+"],
    audiences: ["Family", "Friends"],
    vibes: ["Competitive"],
    occasion: "Bridal shower",
  },
];

export function catalogBySlug(slug: string): CatalogGame | undefined {
  return CATALOG.find((game) => game.slug === slug);
}

/** Slugs that have a built-in engine at /games/[slug]. */
export const ENGINE_SLUGS: string[] = CATALOG.filter((g) => g.engine).map(
  (g) => g.slug,
);

/* ------------------------------------------------------------------ *
 * Selection-screen filter options
 * ------------------------------------------------------------------ */

export const GROUP_SIZE_OPTIONS: { value: CatalogGroupSize; label: string }[] = [
  { value: "2-4", label: "2-4 people" },
  { value: "5-10", label: "5-10 people" },
  { value: "11-20", label: "11-20 people" },
  { value: "20+", label: "20+ people" },
];

export const AUDIENCE_OPTIONS: CatalogAudience[] = [
  "Family",
  "Friends",
  "Office",
  "Couples",
  "18+",
];

export const VIBE_OPTIONS: CatalogVibe[] = [
  "Icebreaker",
  "Funny",
  "Competitive",
  "Revealing",
  "Quick fire",
];

export interface CatalogFilters {
  groupSize: CatalogGroupSize[];
  audience: CatalogAudience[];
  vibe: CatalogVibe[];
}

export const emptyCatalogFilters: CatalogFilters = {
  groupSize: [],
  audience: [],
  vibe: [],
};

/**
 * Narrows the catalog by the selected pills. 18+ content stays hidden until
 * the "18+" audience pill is active; when it is, only the 18+ umbrella card
 * and the dual-deck games are shown.
 */
export function filterCatalog(
  filters: CatalogFilters,
  games: CatalogGame[] = CATALOG,
): CatalogGame[] {
  const adultActive = filters.audience.includes("18+");

  return games.filter((game) => {
    if (adultActive) {
      if (!(game.adult || game.dualDeck)) return false;
    } else {
      if (game.adult) return false;
      if (
        filters.audience.length > 0 &&
        !game.audiences.some((a) => filters.audience.includes(a))
      ) {
        return false;
      }
    }

    if (
      filters.groupSize.length > 0 &&
      !game.groupSizes.some((g) => filters.groupSize.includes(g))
    ) {
      return false;
    }

    if (
      filters.vibe.length > 0 &&
      !game.vibes.some((v) => filters.vibe.includes(v))
    ) {
      return false;
    }

    return true;
  });
}

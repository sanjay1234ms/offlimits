/** Dedicated content model for the Truth or Dare game. Packs replace the
 * generic category/vibe tags; clean and 18+ content are kept fully separate. */

import { TOD_CARDS, type DeckCard } from "./decks";

export type TodPackId =
  // clean
  | "friends"
  | "family"
  | "couples"
  | "new-group"
  | "office"
  // 18+
  | "spicy-couples"
  | "after-dark"
  | "wild-kinky"
  | "nasty-confessions";

export interface TodPack {
  id: TodPackId;
  label: string;
  adult: boolean;
}

export const TOD_PACKS: TodPack[] = [
  { id: "friends", label: "Friends", adult: false },
  { id: "family", label: "Family", adult: false },
  { id: "couples", label: "Couples", adult: false },
  { id: "office", label: "Office", adult: false },
  { id: "new-group", label: "New group", adult: false },
  { id: "spicy-couples", label: "Spicy Couples", adult: true },
  { id: "after-dark", label: "After Dark", adult: true },
  { id: "wild-kinky", label: "Wild / Kinky", adult: true },
  { id: "nasty-confessions", label: "Nasty Confessions", adult: true },
];

export interface TodCard {
  id: string;
  kind: "truth" | "dare";
  text: string;
  packs: TodPackId[];
  /** Explicit heat level 1-5. */
  intensity?: number;
}

const LEGACY_TOD_NORMAL: TodCard[] = [
  // Friends / New group, truths
  {
    id: "todn-t01",
    kind: "truth",
    text: "What's the most embarrassing thing in your search history right now?",
    packs: ["friends", "new-group"],
  },
  {
    id: "todn-t02",
    kind: "truth",
    text: "Who here would you call first to bail you out of trouble, and who last?",
    packs: ["friends"],
  },
  {
    id: "todn-t03",
    kind: "truth",
    text: "What's a lie you've told to get out of plans that you never got caught for?",
    packs: ["friends", "new-group"],
  },
  {
    id: "todn-t04",
    kind: "truth",
    text: "What's the pettiest thing you've ever held a grudge about?",
    packs: ["friends", "family"],
  },
  {
    id: "todn-t05",
    kind: "truth",
    text: "What's your go-to excuse when you're running late?",
    packs: ["friends", "new-group"],
  },
  {
    id: "todn-t06",
    kind: "truth",
    text: "First impressions: what did you think of the person on your left when you met?",
    packs: ["new-group", "friends"],
  },
  {
    id: "todn-t07",
    kind: "truth",
    text: "What's something you pretend to like just to fit in?",
    packs: ["new-group"],
  },
  // Family, truths
  {
    id: "todn-t08",
    kind: "truth",
    text: "What's a family tradition you secretly can't stand?",
    packs: ["family"],
  },
  {
    id: "todn-t09",
    kind: "truth",
    text: "What did you get away with as a kid that your parents still don't know about?",
    packs: ["family"],
  },
  {
    id: "todn-t10",
    kind: "truth",
    text: "Which relative are you most alike, and does that scare you?",
    packs: ["family"],
  },
  // Couples, truths
  {
    id: "todn-t11",
    kind: "truth",
    text: "What was your actual first impression of your partner?",
    packs: ["couples"],
  },
  {
    id: "todn-t12",
    kind: "truth",
    text: "What's a small thing your partner does that you love but have never told them?",
    packs: ["couples"],
  },
  {
    id: "todn-t13",
    kind: "truth",
    text: "What did you Google before your first date with them?",
    packs: ["couples"],
  },
  {
    id: "todn-t14",
    kind: "truth",
    text: "What's the most romantic thing you've ever done for someone?",
    packs: ["couples", "friends"],
  },
  // Friends / New group, dares
  {
    id: "todn-d01",
    kind: "dare",
    text: "Do an impression of someone in the room until they guess who it is.",
    packs: ["friends", "new-group"],
  },
  {
    id: "todn-d02",
    kind: "dare",
    text: "Talk in an accent of the group's choosing until your next turn.",
    packs: ["friends", "new-group"],
  },
  {
    id: "todn-d03",
    kind: "dare",
    text: "Let the person opposite you pick your next three songs.",
    packs: ["friends", "new-group"],
  },
  {
    id: "todn-d04",
    kind: "dare",
    text: "Post the most recent photo in your camera roll to your story.",
    packs: ["friends"],
  },
  {
    id: "todn-d05",
    kind: "dare",
    text: "Do 15 star jumps right now, counting out loud.",
    packs: ["friends", "family", "new-group"],
  },
  {
    id: "todn-d06",
    kind: "dare",
    text: "Read your last sent text out loud in your most dramatic voice.",
    packs: ["friends", "new-group"],
  },
  {
    id: "todn-d07",
    kind: "dare",
    text: "Speak only in questions until it's your turn again.",
    packs: ["friends", "new-group"],
  },
  // Family, dares
  {
    id: "todn-d08",
    kind: "dare",
    text: "Call a relative and tell them you love them, with no explanation.",
    packs: ["family"],
  },
  {
    id: "todn-d09",
    kind: "dare",
    text: "Do your best impression of a family member until someone guesses.",
    packs: ["family"],
  },
  {
    id: "todn-d10",
    kind: "dare",
    text: "Show the group the oldest photo on your phone.",
    packs: ["family", "friends"],
  },
  // Couples, dares
  {
    id: "todn-d11",
    kind: "dare",
    text: "Recreate the first thing you ever said to your partner.",
    packs: ["couples"],
  },
  {
    id: "todn-d12",
    kind: "dare",
    text: "Give your partner a 30-second compliment with no pauses.",
    packs: ["couples"],
  },
  {
    id: "todn-d13",
    kind: "dare",
    text: "Swap phones with your partner for one round.",
    packs: ["couples"],
  },
  {
    id: "todn-d14",
    kind: "dare",
    text: "Let the group give you a nickname for the rest of the night.",
    packs: ["friends", "new-group"],
  },
];

const LEGACY_TOD_ADULT: TodCard[] = [
  // Spicy Couples, truths
  {
    id: "toda-t01",
    kind: "truth",
    text: "What's something you want to try in bed but have never actually asked for?",
    packs: ["spicy-couples", "after-dark"],
  },
  {
    id: "toda-t02",
    kind: "truth",
    text: "What's the hottest thing your partner has ever done to you?",
    packs: ["spicy-couples"],
  },
  {
    id: "toda-t03",
    kind: "truth",
    text: "Where's the riskiest place you two have ever hooked up?",
    packs: ["spicy-couples", "after-dark"],
  },
  {
    id: "toda-t04",
    kind: "truth",
    text: "What do you think about when you want things to end quickly?",
    packs: ["spicy-couples"],
  },
  // After Dark, truths
  {
    id: "toda-t05",
    kind: "truth",
    text: "Describe your most replayed fantasy in as much detail as you dare.",
    packs: ["after-dark", "wild-kinky"],
  },
  {
    id: "toda-t06",
    kind: "truth",
    text: "Who in this room have you thought about in that way?",
    packs: ["after-dark"],
  },
  {
    id: "toda-t07",
    kind: "truth",
    text: "What's the closest you've ever come to getting caught, and by who?",
    packs: ["after-dark", "nasty-confessions"],
  },
  {
    id: "toda-t08",
    kind: "truth",
    text: "What's a message you've sent that you'd be mortified for anyone else to read?",
    packs: ["after-dark"],
  },
  // Wild / Kinky, truths
  {
    id: "toda-t09",
    kind: "truth",
    text: "What's a kink you've never admitted to anyone before tonight?",
    packs: ["wild-kinky"],
  },
  {
    id: "toda-t10",
    kind: "truth",
    text: "On a scale of 1 to 10, how into being tied up are you, and explain the number.",
    packs: ["wild-kinky"],
  },
  {
    id: "toda-t11",
    kind: "truth",
    text: "What's the wildest thing you've ever said yes to?",
    packs: ["wild-kinky", "nasty-confessions"],
  },
  // Nasty Confessions, truths
  {
    id: "toda-t12",
    kind: "truth",
    text: "What's the filthiest thing you have ever done, no details spared?",
    packs: ["nasty-confessions"],
  },
  {
    id: "toda-t13",
    kind: "truth",
    text: "How many people have you actually been with, the real number?",
    packs: ["nasty-confessions"],
  },
  {
    id: "toda-t14",
    kind: "truth",
    text: "What's the most depraved thing someone would find in your search history?",
    packs: ["nasty-confessions", "after-dark"],
  },
  // Spicy Couples, dares
  {
    id: "toda-d01",
    kind: "dare",
    text: "Whisper exactly what you want to do later into your partner's ear.",
    packs: ["spicy-couples"],
  },
  {
    id: "toda-d02",
    kind: "dare",
    text: "Give your partner a slow 20-second kiss on the neck.",
    packs: ["spicy-couples"],
  },
  {
    id: "toda-d03",
    kind: "dare",
    text: "Text your partner something filthy right now, even though they're sitting there.",
    packs: ["spicy-couples", "after-dark"],
  },
  // After Dark, dares
  {
    id: "toda-d04",
    kind: "dare",
    text: "Send a flirty voice note to the last person you texted and play it for the room.",
    packs: ["after-dark"],
  },
  {
    id: "toda-d05",
    kind: "dare",
    text: "Do your slowest, most teasing walk across the room and back.",
    packs: ["after-dark", "wild-kinky"],
  },
  {
    id: "toda-d06",
    kind: "dare",
    text: "Read your spiciest saved message out loud in your most convincing voice.",
    packs: ["after-dark", "nasty-confessions"],
  },
  // Wild / Kinky, dares
  {
    id: "toda-d07",
    kind: "dare",
    text: "Demonstrate your signature move on a pillow.",
    packs: ["wild-kinky"],
  },
  {
    id: "toda-d08",
    kind: "dare",
    text: "Let the group dictate one risky DM that you have to send right now.",
    packs: ["wild-kinky", "after-dark"],
  },
  {
    id: "toda-d09",
    kind: "dare",
    text: "Sit on someone's lap until it's your turn again.",
    packs: ["wild-kinky"],
  },
  // Nasty Confessions, dares
  {
    id: "toda-d10",
    kind: "dare",
    text: "Describe, in detail, the last time you hooked up.",
    packs: ["nasty-confessions"],
  },
  {
    id: "toda-d11",
    kind: "dare",
    text: "Show the group the most recent risky photo in your phone, your choice which one.",
    packs: ["nasty-confessions"],
  },
  {
    id: "toda-d12",
    kind: "dare",
    text: "Let the person to your left leave a filthy comment on your latest post.",
    packs: ["nasty-confessions", "after-dark"],
  },
];

/* ------------------------------------------------------------------ *
 * Leveled Truth or Dare content (data/decks) merged in as packs.
 * ------------------------------------------------------------------ */

const PACKS_BY_CATEGORY: Record<string, TodPackId[]> = {
  Friends: ["friends", "new-group"],
  Office: ["office"],
  Couples: ["couples"],
};

const ADULT_PACKS_BY_LEVEL: Record<number, TodPackId[]> = {
  1: ["spicy-couples", "after-dark"],
  2: ["spicy-couples", "after-dark"],
  3: ["after-dark", "wild-kinky"],
  4: ["wild-kinky", "nasty-confessions"],
  5: ["nasty-confessions", "after-dark"],
};

function deckCardToTodCard(card: DeckCard): TodCard {
  const packs =
    card.category === "18+"
      ? ADULT_PACKS_BY_LEVEL[card.intensity] ?? ["after-dark"]
      : PACKS_BY_CATEGORY[card.category] ?? ["friends"];
  return {
    id: card.id,
    kind: card.kind ?? "truth",
    text: card.text ?? "",
    packs,
    intensity: card.intensity,
  };
}

const LEVELED_NORMAL = TOD_CARDS.filter((c) => c.category !== "18+").map(
  deckCardToTodCard,
);
const LEVELED_ADULT = TOD_CARDS.filter((c) => c.category === "18+").map(
  deckCardToTodCard,
);

export const TOD_NORMAL: TodCard[] = [...LEGACY_TOD_NORMAL, ...LEVELED_NORMAL];
export const TOD_ADULT: TodCard[] = [...LEGACY_TOD_ADULT, ...LEVELED_ADULT];

/** Cards from the currently selected packs. */
export function todPool(
  adult: boolean,
  selectedPacks: TodPackId[],
): TodCard[] {
  const source = adult ? TOD_ADULT : TOD_NORMAL;
  if (selectedPacks.length === 0) return source;
  return source.filter((card) =>
    card.packs.some((pack) => selectedPacks.includes(pack)),
  );
}

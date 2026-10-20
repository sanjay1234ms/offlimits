import type { PromptGame } from "@/types";

/** Search-friendly pages for the five pass-the-phone games, served at
 * /games/[slug]. Each one opens the /play engine pre-set to that game. */
export interface CoreGamePage {
  slug: string;
  game: PromptGame;
  /** <title>, written for the search query people actually type. */
  title: string;
  description: string;
  h1: string;
  intro: string;
}

export const CORE_GAME_PAGES: CoreGamePage[] = [
  {
    slug: "would-you-rather",
    game: "would_you_rather",
    title: "Would You Rather Questions: Free Online Game for Groups",
    description:
      "Hundreds of funny, hard and clean Would You Rather questions. Play free on any phone, no signup or download. Pick a question, pass the phone, argue it out.",
    h1: "Would You Rather Questions",
    intro:
      "Two impossible options, one choice, and a room full of people who want you to defend it. Tap for a new question, filter for family, office or couples, and pass the phone around. Free, no signup.",
  },
  {
    slug: "never-have-i-ever",
    game: "never_have_i_ever",
    title: "Never Have I Ever Questions: Free Online Game",
    description:
      "Play Never Have I Ever free on any phone. Clean, funny and juicy questions for friends, couples and parties. No app, no signup, just pass the phone around.",
    h1: "Never Have I Ever Questions",
    intro:
      "Everyone holds up ten fingers. Read the statement out, and anyone who has done it puts a finger down. Filter by group and vibe so the questions fit the room, then pass the phone. Free, no signup.",
  },
  {
    slug: "most-likely-to",
    game: "most_likely_to",
    title: "Most Likely To Questions: Free Party Game for Groups",
    description:
      "Funny Most Likely To questions for friends, family and office parties. Free to play on one phone, no download or signup. Count to three and point at someone.",
    h1: "Most Likely To Questions",
    intro:
      "Read the question, count to three, and everyone points at the person most likely to do it. Most fingers loses the round. Great for big groups and icebreakers. Free, no signup.",
  },
  {
    slug: "this-or-that",
    game: "this_or_that",
    title: "This or That Questions: Free Rapid-Fire Game",
    description:
      "Quick This or That questions for icebreakers, couples, kids and classrooms. Free on any phone, no signup needed. First instinct only, no thinking allowed.",
    h1: "This or That Questions",
    intro:
      "Two options, first instinct, no thinking allowed. Fire through questions at speed and see who agrees with who. Works for two people or a whole room. Free, no signup.",
  },
  {
    slug: "truth-or-dare",
    game: "truth_or_dare",
    title: "Truth or Dare Questions: Free Online Game",
    description:
      "Free Truth or Dare on any phone: clean truths and dares for teens, friends and family, plus spicier packs for adults. No app, no signup, just pass the phone.",
    h1: "Truth or Dare",
    intro:
      "Pick truth or dare, or let the phone decide. Choose the packs that fit your group, from clean family dares to party-night truths, and pass the phone to the next player. Free, no signup.",
  },
];

export function corePageBySlug(slug: string): CoreGamePage | undefined {
  return CORE_GAME_PAGES.find((p) => p.slug === slug);
}

export function corePageForGame(game: string): CoreGamePage | undefined {
  return CORE_GAME_PAGES.find((p) => p.game === game);
}

/** Search titles and descriptions for the engine games at /games/[slug]. */
export const ENGINE_GAME_SEO: Record<
  string,
  { title: string; description: string }
> = {
  trivia: {
    title: "Free Trivia Questions with Answers: Party Quiz Game",
    description:
      "Free trivia questions with answers for parties, family nights and pub quizzes. Read them out, tap to reveal, keep score for teams. No signup, any phone.",
  },
  "odd-one-out": {
    title: "Odd One Out: Free Imposter Word Game for Groups",
    description:
      "Everyone gets the secret word except the imposter, who has to blend in. A free pass-the-phone imposter game for 3 to 30 players. No app, no signup needed.",
  },
  "fake-news-factory": {
    title: "Fake News Factory: Free Bluffing Party Game",
    description:
      "Write a convincing lie, then spot everyone else's. A free bluffing party game for 3 to 10 players on one phone, with scoring built in. No download, no signup.",
  },
  charades: {
    title: "Charades Ideas & Free Charades Game with Timer",
    description:
      "Funny charades ideas for kids and adults with a built-in 60-second timer and team scorekeeping. Free on any phone for family, friends and office parties.",
  },
  "miss-a-beat": {
    title: "Miss a Beat: Free Word Association Rhythm Game",
    description:
      "Name things in a category to the beat before you miss it. A free word association rhythm game for 2 to 12 players, great for parties. No signup, any phone.",
  },
  "say-it-backwards": {
    title: "Say It Backwards: Free Reverse Phrase Party Game",
    description:
      "Read a silly phrase backwards out loud and let your team decode it before time runs out. A free, laugh-out-loud team game for 4 to 20 players on one phone.",
  },
  "how-well-do-you-know-me": {
    title: "How Well Do You Know Me Questions: Free Couples & Friends Quiz",
    description:
      "How well do you know me questions for couples, best friends and family. Both answer in secret, then compare and score. Free on one phone, no app, no signup.",
  },
  buzzkill: {
    title: "Buzzkill: Free Taboo-Style Word Game Online",
    description:
      "Describe the word without saying the three forbidden ones before 30 seconds run out. A free taboo-style team word game on any phone, no app or signup needed.",
  },
  "fast-5": {
    title: "Fast 5: Name 5 Things Game, Free Online",
    description:
      "Name five things in a category before the five-second buzzer goes off. A free, fast party game for 2 to 12 players with built-in scorekeeping. No signup.",
  },
  "pirate-barrel": {
    title: "Pirate Barrel: Free Pop the Pirate Game Online",
    description:
      "Take turns throwing knives into the barrel. One slot launches the pirate. A free pop-the-pirate party game for kids and adults on one phone, no download.",
  },
};

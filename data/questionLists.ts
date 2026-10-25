import type { PromptCategory, PromptGame } from "@/types";
import type { Heat } from "./decks/schema";

/** Readable question-list pages at /questions/[slug]. Lists are pulled from
 * the existing decks (never the 18+ deck) so they stay in sync with the game. */
export interface QuestionSource {
  category: Exclude<PromptCategory, "18+">;
  heats: Heat[];
}

export interface QuestionList {
  slug: string;
  game: PromptGame;
  /** Title template; `{n}` is replaced with the question count. */
  title: string;
  description: string;
  h1: string;
  intro: string;
  sources: QuestionSource[];
  /** Hand-written questions shown before the deck questions. */
  extra?: string[];
  /** `?category=` for the play link (PlayScreen alias). */
  playCategory?: "friends" | "office" | "couples";
  howTo: string[];
}

const WYR_HOW_TO = [
  "Read the question out loud to the group.",
  "Everyone picks a side at the same time, by pointing or raising a hand.",
  "The smaller side has to defend their choice in one sentence.",
  "Pass the phone to the next person to read the next question.",
];

const NHIE_HOW_TO = [
  "Everyone holds up ten fingers.",
  "Take turns reading a statement out loud.",
  "Anyone who has done it puts one finger down.",
  "The last person with fingers still up wins.",
];

const MLT_HOW_TO = [
  "Read the question out loud.",
  "Everyone counts to three and points at who they think is most likely.",
  "The person with the most fingers pointed at them takes the round, and can explain themselves.",
  "Pass the phone and read the next one.",
];

const TOT_HOW_TO = [
  "Read both options as fast as you can.",
  "Everyone answers on instinct, no thinking time.",
  "Anyone who hesitates is out for the round.",
  "Go round the circle until everyone has read one.",
];

const TOD_HOW_TO = [
  "Sit in a circle and pick who goes first.",
  "That player chooses truth or dare.",
  "Read them a truth or dare from the list, or let the app pick one at random.",
  "Answer honestly or do the dare, then the turn passes to the left. Anyone can skip once per round.",
];

export const QUESTION_LISTS: QuestionList[] = [
  {
    slug: "funny-would-you-rather-questions",
    game: "would_you_rather",
    title: "{n} Funny Would You Rather Questions (Free List)",
    description:
      "{n} funny Would You Rather questions for friends, parties and road trips. Read the full list here or play them free on your phone, no signup or download.",
    h1: "Funny Would You Rather Questions",
    intro:
      "{n} funny Would You Rather questions for friends, from easy icebreakers to ones that start real arguments. Read them out from this list, or tap Play to get them one at a time on your phone.",
    sources: [{ category: "Friends", heats: [1, 2, 3] }],
    playCategory: "friends",
    howTo: WYR_HOW_TO,
  },
  {
    slug: "would-you-rather-questions-for-kids",
    game: "would_you_rather",
    title: "{n} Would You Rather Questions for Kids",
    description:
      "{n} clean, silly Would You Rather questions for kids, classrooms and family game night. Read the full list or play them free on any phone, no signup needed.",
    h1: "Would You Rather Questions for Kids",
    intro:
      "{n} clean and silly Would You Rather questions that work for kids, classrooms and family game night. Every question here is safe for all ages.",
    extra: [
      "Would you rather have a pet dragon or a pet unicorn?",
      "Would you rather eat pizza for every meal or ice cream for every meal?",
      "Would you rather be able to fly or be invisible?",
      "Would you rather live in a treehouse or a castle?",
      "Would you rather have a robot that does your homework or one that cleans your room?",
      "Would you rather be a superhero or a wizard?",
      "Would you rather swim with dolphins or ride an elephant?",
      "Would you rather have no school on Mondays or no school on Fridays?",
      "Would you rather be really fast or really strong?",
      "Would you rather live on the moon or under the sea?",
      "Would you rather have a giant trampoline or a giant slide in your garden?",
      "Would you rather talk like a pirate or walk like a penguin for a whole day?",
      "Would you rather have a chocolate river or a candy forest?",
      "Would you rather be a famous YouTuber or a famous scientist?",
      "Would you rather have snow every day or summer every day?",
      "Would you rather be able to breathe underwater or jump over houses?",
      "Would you rather have a talking dog or a talking cat?",
      "Would you rather eat broccoli ice cream or chocolate-covered carrots?",
      "Would you rather go to space or go to the bottom of the ocean?",
      "Would you rather shrink to the size of an ant or grow as tall as a giraffe?",
    ],
    sources: [{ category: "Friends", heats: [1] }],
    playCategory: "friends",
    howTo: WYR_HOW_TO,
  },
  {
    slug: "would-you-rather-questions-for-couples",
    game: "would_you_rather",
    title: "{n} Would You Rather Questions for Couples",
    description:
      "{n} Would You Rather questions for couples, from cute to deep. Perfect for date night or road trips. Read the list or play free on one phone.",
    h1: "Would You Rather Questions for Couples",
    intro:
      "{n} Would You Rather questions for couples, from cute and silly to ones that tell you something real about each other. Great for date night or a long drive.",
    sources: [{ category: "Couples", heats: [1, 2, 3] }],
    playCategory: "couples",
    howTo: WYR_HOW_TO,
  },
  {
    slug: "would-you-rather-questions-for-work",
    game: "would_you_rather",
    title: "{n} Would You Rather Questions for Work",
    description:
      "{n} work-appropriate Would You Rather questions for team meetings, icebreakers and office parties. Read the list or play free on a shared screen.",
    h1: "Would You Rather Questions for Work",
    intro:
      "{n} office-safe Would You Rather questions for team meetings, icebreakers and holiday parties. Nothing here will get anyone a call from HR.",
    sources: [{ category: "Office", heats: [1, 2, 3] }],
    playCategory: "office",
    howTo: WYR_HOW_TO,
  },
  {
    slug: "never-have-i-ever-questions",
    game: "never_have_i_ever",
    title: "{n} Never Have I Ever Questions (Funny & Clean)",
    description:
      "{n} funny Never Have I Ever questions for friends, parties and sleepovers. Read the full list or play them free on any phone, no app and no signup needed.",
    h1: "Never Have I Ever Questions",
    intro:
      "{n} Never Have I Ever questions for friends, from harmless to slightly incriminating. Read them from the list or tap Play to go one at a time.",
    sources: [{ category: "Friends", heats: [1, 2, 3] }],
    playCategory: "friends",
    howTo: NHIE_HOW_TO,
  },
  {
    slug: "juicy-never-have-i-ever-questions",
    game: "never_have_i_ever",
    title: "{n} Juicy Never Have I Ever Questions for Adults",
    description:
      "{n} juicy, revealing Never Have I Ever questions for adults and close friends. No explicit content, just the questions that get real answers. Free to play.",
    h1: "Juicy Never Have I Ever Questions",
    intro:
      "{n} juicy Never Have I Ever questions for close friends and adult game nights. They aren't explicit, just honest enough to make people think twice before putting a finger down.",
    sources: [{ category: "Friends", heats: [4, 5] }],
    playCategory: "friends",
    howTo: NHIE_HOW_TO,
  },
  {
    slug: "never-have-i-ever-questions-for-couples",
    game: "never_have_i_ever",
    title: "{n} Never Have I Ever Questions for Couples",
    description:
      "{n} Never Have I Ever questions for couples and date night. Find out what you don't know about each other. Read the list or play free on any phone.",
    h1: "Never Have I Ever Questions for Couples",
    intro:
      "{n} Never Have I Ever questions for couples. Some are sweet, some are awkward, and all of them will tell you something new.",
    sources: [{ category: "Couples", heats: [1, 2, 3] }],
    playCategory: "couples",
    howTo: NHIE_HOW_TO,
  },
  {
    slug: "most-likely-to-questions",
    game: "most_likely_to",
    title: "{n} Most Likely To Questions for Friends & Groups",
    description:
      "{n} funny Most Likely To questions for friends, parties and big groups. Read the full list or play free on one phone: count to three and point. No signup.",
    h1: "Most Likely To Questions",
    intro:
      "{n} Most Likely To questions for friends and big groups. Read one out, count to three, and point.",
    sources: [{ category: "Friends", heats: [1, 2, 3] }],
    playCategory: "friends",
    howTo: MLT_HOW_TO,
  },
  {
    slug: "most-likely-to-questions-for-work",
    game: "most_likely_to",
    title: "{n} Most Likely To Questions for Work & Coworkers",
    description:
      "{n} office-safe Most Likely To questions for coworkers, team building and holiday parties. Read the list or play free on one phone or shared screen.",
    h1: "Most Likely To Questions for Work",
    intro:
      "{n} Most Likely To questions for coworkers that are fun without being awkward. Good for team socials, offsites and the office holiday party.",
    sources: [{ category: "Office", heats: [1, 2, 3] }],
    playCategory: "office",
    howTo: MLT_HOW_TO,
  },
  {
    slug: "this-or-that-questions",
    game: "this_or_that",
    title: "{n} This or That Questions (Fun Icebreaker List)",
    description:
      "{n} fun This or That questions for icebreakers, classrooms and friends. Read the full list or play them rapid-fire on any phone, free with no app or signup.",
    h1: "This or That Questions",
    intro:
      "{n} This or That questions for icebreakers and quick rounds with friends. First instinct only, no thinking allowed.",
    sources: [{ category: "Friends", heats: [1, 2, 3] }],
    playCategory: "friends",
    howTo: TOT_HOW_TO,
  },
  {
    slug: "this-or-that-questions-for-couples",
    game: "this_or_that",
    title: "{n} This or That Questions for Couples",
    description:
      "{n} This or That questions for couples and date night. Answer fast and see how often you agree. Read the full list or play free on one phone, no signup.",
    h1: "This or That Questions for Couples",
    intro:
      "{n} This or That questions for couples. Answer at the same time and count how many you match on.",
    sources: [{ category: "Couples", heats: [1, 2, 3] }],
    playCategory: "couples",
    howTo: TOT_HOW_TO,
  },
  {
    slug: "truth-or-dare-questions-for-couples",
    game: "truth_or_dare",
    title: "{n} Truth or Dare Questions for Couples",
    description:
      "{n} truth or dare questions for couples and date night, from sweet and flirty to deep. Read the full list or play them free on one phone, no app or signup.",
    h1: "Truth or Dare for Couples",
    intro:
      "{n} truths and dares for couples, from sweet to seriously honest. Take turns, and keep the skips to one each.",
    sources: [{ category: "Couples", heats: [1, 2, 3] }],
    playCategory: "couples",
    howTo: TOD_HOW_TO,
  },
];

export function questionListBySlug(slug: string): QuestionList | undefined {
  return QUESTION_LISTS.find((l) => l.slug === slug);
}

export function fillCount(template: string, n: number): string {
  return template.replace(/\{n\}/g, String(n));
}

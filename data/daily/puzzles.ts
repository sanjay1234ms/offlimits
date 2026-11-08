import type { PuzzleId } from "@/lib/daily";

export interface DailyGame {
  id: PuzzleId;
  name: string;
  genre: string;
  minutes: number;
  href: string;
  emoji: string;
  tagline: string;
  /** Card colour (Tailwind classes), dark text on top. */
  color: string;
}

export const DAILY_GAMES: readonly DailyGame[] = [
  {
    id: "word-heist",
    name: "Word Heist",
    genre: "Word",
    minutes: 5,
    href: "/daily/word-heist",
    emoji: "🔐",
    tagline: "Crack the five-letter vault code in six tries.",
    color: "bg-sky-300",
  },
  {
    id: "off-the-map",
    name: "Off the Map",
    genre: "Map",
    minutes: 3,
    href: "/daily/off-the-map",
    emoji: "📍",
    tagline: "Five map cards a day. Drop your pin, closest scores most.",
    color: "bg-lime-300",
  },
  {
    id: "close-call",
    name: "Close Call",
    genre: "Numbers",
    minutes: 3,
    href: "/daily/close-call",
    emoji: "🎯",
    tagline: "Five numbers nobody knows. Guess close, score big.",
    color: "bg-pink-300",
  },
];

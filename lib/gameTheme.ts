import type { PromptGame } from "@/types";

/** Key for a themeable surface: the three starter games plus the 18+ tier. */
export type GameThemeKey = PromptGame | "18+";

export interface GameTheme {
  key: GameThemeKey;
  label: string;
  emoji: string;
  /** `bg-gradient-to-br <gradient>`, the mesh fill behind a card. */
  gradient: string;
  /** Border class for the themed surface. */
  border: string;
  /** Ambient colored drop-shadow applied on hover. */
  hoverShadow: string;
  /** Static glowing edge for the in-game stage card. */
  edgeShadow: string;
  /** Emoji badge backdrop. */
  badge: string;
  /** Accent text tint. */
  text: string;
  /** Progress fill. */
  fill: string;
  /** Ring shown on an active tab. */
  ring: string;
}

const THEMES: Record<GameThemeKey, GameTheme> = {
  would_you_rather: {
    key: "would_you_rather",
    label: "Would You Rather",
    emoji: "🤔",
    gradient: "from-indigo-600/20 to-purple-600/10",
    border: "border-indigo-500/30",
    hoverShadow: "hover:shadow-[0_28px_60px_-18px_rgba(99,102,241,0.45)]",
    edgeShadow: "shadow-[0_0_0_1px_rgba(99,102,241,0.35),0_30px_70px_-25px_rgba(99,102,241,0.45)]",
    badge: "bg-indigo-500/15 text-indigo-200 ring-1 ring-indigo-400/40 shadow-[0_0_30px_rgba(99,102,241,0.4)]",
    text: "text-indigo-300",
    fill: "bg-indigo-400",
    ring: "ring-2 ring-indigo-400/60",
  },
  never_have_i_ever: {
    key: "never_have_i_ever",
    label: "Never Have I Ever",
    emoji: "🙈",
    gradient: "from-rose-600/20 to-pink-600/10",
    border: "border-rose-500/30",
    hoverShadow: "hover:shadow-[0_28px_60px_-18px_rgba(244,63,94,0.45)]",
    edgeShadow: "shadow-[0_0_0_1px_rgba(244,63,94,0.35),0_30px_70px_-25px_rgba(244,63,94,0.45)]",
    badge: "bg-rose-500/15 text-rose-200 ring-1 ring-rose-400/40 shadow-[0_0_30px_rgba(244,63,94,0.4)]",
    text: "text-rose-300",
    fill: "bg-rose-400",
    ring: "ring-2 ring-rose-400/60",
  },
  most_likely_to: {
    key: "most_likely_to",
    label: "Most Likely To",
    emoji: "👉",
    gradient: "from-amber-600/20 to-orange-600/10",
    border: "border-amber-500/30",
    hoverShadow: "hover:shadow-[0_28px_60px_-18px_rgba(245,158,11,0.45)]",
    edgeShadow: "shadow-[0_0_0_1px_rgba(245,158,11,0.35),0_30px_70px_-25px_rgba(245,158,11,0.45)]",
    badge: "bg-amber-500/15 text-amber-200 ring-1 ring-amber-400/40 shadow-[0_0_30px_rgba(245,158,11,0.4)]",
    text: "text-amber-300",
    fill: "bg-amber-400",
    ring: "ring-2 ring-amber-400/60",
  },
  truth_or_dare: {
    key: "truth_or_dare",
    label: "Truth or Dare",
    emoji: "😈",
    gradient: "from-rose-600/20 to-pink-600/10",
    border: "border-rose-500/40",
    hoverShadow: "hover:shadow-[0_28px_60px_-18px_rgba(244,63,94,0.45)]",
    edgeShadow:
      "shadow-[0_0_0_1px_rgba(244,63,94,0.35),0_30px_70px_-25px_rgba(244,63,94,0.45)]",
    badge:
      "bg-rose-500/15 text-rose-200 ring-1 ring-rose-400/40 shadow-[0_0_30px_rgba(244,63,94,0.4)]",
    text: "text-rose-300",
    fill: "bg-rose-400",
    ring: "ring-2 ring-rose-400/60",
  },
  this_or_that: {
    key: "this_or_that",
    label: "This or That",
    emoji: "⚡",
    gradient: "from-pink-600/25 to-fuchsia-600/10",
    border: "border-pink-500/40",
    hoverShadow: "hover:shadow-[0_28px_60px_-18px_rgba(236,72,153,0.45)]",
    edgeShadow:
      "shadow-[0_0_0_1px_rgba(236,72,153,0.35),0_30px_70px_-25px_rgba(236,72,153,0.45)]",
    badge:
      "bg-pink-500/15 text-pink-200 ring-1 ring-pink-400/40 shadow-[0_0_30px_rgba(236,72,153,0.4)]",
    text: "text-pink-300",
    fill: "bg-pink-400",
    ring: "ring-2 ring-pink-400/60",
  },
  "18+": {
    key: "18+",
    label: "18+ Uncensored",
    emoji: "🔥",
    gradient: "from-red-600/25 to-rose-950/40",
    border: "border-red-500/40",
    hoverShadow: "hover:shadow-[0_28px_60px_-18px_rgba(239,68,68,0.5)]",
    edgeShadow: "shadow-[0_0_0_1px_rgba(239,68,68,0.4),0_30px_70px_-25px_rgba(239,68,68,0.5)]",
    badge: "bg-red-500/20 text-red-200 ring-1 ring-red-400/50 shadow-[0_0_34px_rgba(239,68,68,0.5)]",
    text: "text-red-300",
    fill: "bg-red-500",
    ring: "ring-2 ring-red-400/70",
  },
};

export function gameTheme(key: GameThemeKey): GameTheme {
  return THEMES[key] ?? THEMES.would_you_rather;
}

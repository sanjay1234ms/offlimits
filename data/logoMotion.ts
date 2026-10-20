/** Each game's signature logo animation, played when its card is hovered
 * (or scrolls into view on touch screens) and in the logo playground. The
 * keyframes live in app/globals.css under "GAME LOGO MOTION". */
export type LogoMotion =
  | "think"
  | "peek"
  | "jab"
  | "zap"
  | "bounce"
  | "flicker"
  | "spin"
  | "scan"
  | "flip"
  | "swap"
  | "beat"
  | "rewind"
  | "heartbeat"
  | "nope"
  | "tick"
  | "sway";

const MOTIONS: Record<string, LogoMotion> = {
  would_you_rather: "think",
  never_have_i_ever: "peek",
  most_likely_to: "jab",
  this_or_that: "zap",
  truth_or_dare: "bounce",
  "18plus": "flicker",
  trivia: "spin",
  "odd-one-out": "scan",
  "fake-news-factory": "flip",
  charades: "swap",
  "miss-a-beat": "beat",
  "say-it-backwards": "rewind",
  "how-well-do-you-know-me": "heartbeat",
  buzzkill: "nope",
  "fast-5": "tick",
  "pirate-barrel": "sway",
};

export function logoMotion(slug: string): LogoMotion {
  return MOTIONS[slug] ?? "bounce";
}

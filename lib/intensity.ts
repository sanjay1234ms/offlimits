/** The live "Spicy Meter". Level 1 is barely a blush; level 5 is unprintable.
 *
 * Prompts aren't hand-tagged, the level is derived from the text so the dial
 * can filter every deck (`intensity <= selectedLevel`) without a data migration.
 * Normal prompts land at 1-2; 18+ prompts land at 3-5 by keyword heat. */

export const MAX_INTENSITY = 5;

/** Emoji per heat level, shared across every category. */
export const HEAT_EMOJI = ["😊", "😏", "🌶️", "🔥", "💀"] as const;

/** Which flavour of tier copy to show. Driven by the active category filter:
 * "filthy / unhinged" language belongs strictly to 18+ mode. */
export type HeatCategory = "office" | "couples" | "general" | "adult";

const HEAT_TIERS: Record<HeatCategory, [string, string, string, string, string]> =
  {
    office: [
      "Safe for HR / Mild banter",
      "Watercooler gossip & coffee break gripes",
      "Calling out corporate drama & slacking",
      "Resignation-level honesty & manager hot takes",
      "Career suicide / Total zero-filter chaos",
    ],
    general: [
      "Chill icebreaker",
      "Playful roast & awkward stories",
      "Secret spilling & personal call-outs",
      "Real drama & high-stakes tea",
      "Friendship test / Zero apologies",
    ],
    couples: [
      "Sweet & playful",
      "Flirty banter & relationship quirks",
      "Past crushes & honest pet peeves",
      "Bedroom secrets & deep tension",
      "Ultimate intimacy / Total vulnerability",
    ],
    adult: [
      "Cheeky tease & mild flirt",
      "Flirty confessions & kissing history",
      "Boundary pushers & wild hookup stories",
      "Explicit bedroom secrets & kinks",
      "Completely unhinged, filthy & unfiltered",
    ],
  };

const clampLevel = (level: number) =>
  Math.min(Math.max(Math.round(level), 1), MAX_INTENSITY);

/** Category-aware label for a heat level, e.g. office L5 → "Career suicide …". */
export function heatTierLabel(category: HeatCategory, level: number): string {
  return (HEAT_TIERS[category] ?? HEAT_TIERS.general)[clampLevel(level) - 1];
}

/** Emoji for a heat level (1-5). */
export function heatEmoji(level: number): string {
  return HEAT_EMOJI[clampLevel(level) - 1];
}
export const DEFAULT_INTENSITY = 3;

const SCORCHING =
  /\b(depraved|filthy|nastiest|unhinged|degrad|choke|spit|cum|orgasm|climax|edg(e|ing)|bdsm|bondage|threesome|orgy|gangbang|dp\b|squirt|rimming|golden shower|breed|slut|whore)\b/i;
const HOT =
  /\b(sext|nude|nudes|dick pic|hookup|hooked up|one[- ]night|in bed|on top|position|foreplay|oral|going down|handcuff|blindfold|spank|moan|kink|kinky|fetish|toy|vibrator|lingerie|strip|lap dance|body count|slept with|make out session|dirty talk|role[- ]?play)\b/i;
const WARM =
  /\b(crush|ex\b|flirt|kiss|kissed|make out|attracted|chemistry|situationship|voice note|slide into|dm|first date|skinny dip|turn(ed)? on|tension|caught feelings|friends with benefits)\b/i;

export function promptIntensity(text: string, isAdult: boolean): number {
  const t = text || "";
  if (!isAdult) {
    return WARM.test(t) ? 2 : 1;
  }
  if (SCORCHING.test(t)) return 5;
  if (HOT.test(t)) return 4;
  return 3;
}

/** A card's heat: its explicit `intensity` if the leveled decks set one,
 * otherwise the keyword-derived estimate. */
export function cardHeat(
  explicit: number | undefined,
  text: string,
  isAdult: boolean,
): number {
  if (typeof explicit === "number" && explicit >= 1 && explicit <= MAX_INTENSITY) {
    return explicit;
  }
  return promptIntensity(text, isAdult);
}

/** True when a card belongs at or below the selected heat level. */
export function withinIntensity(
  explicit: number | undefined,
  text: string,
  isAdult: boolean,
  selected: number,
): boolean {
  return cardHeat(explicit, text, isAdult) <= selected;
}

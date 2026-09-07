import { TOD_ADULT, TOD_NORMAL } from "./truthOrDare";
import { ADULT_DECKS } from "./adultDeck";
import { allPrompts } from "./prompts";

/** What the "Suggest a prompt" helper produces. */
export type SuggestType =
  | "truth"
  | "dare"
  | "truth-or-dare"
  | "scenario"
  | "confession";

export const SUGGEST_LABEL: Record<SuggestType, string> = {
  truth: "Suggest a truth",
  dare: "Suggest a dare",
  "truth-or-dare": "Suggest an idea",
  scenario: "Suggest scenario",
  confession: "Suggest confession",
};

const gamePrompts = (game: string, adult: boolean): string[] =>
  allPrompts
    .filter((p) => p.game === game && p.isAdult === adult)
    .map((p) => p.text);

function pool(type: SuggestType, adult: boolean): string[] {
  switch (type) {
    case "truth":
      return (adult ? TOD_ADULT : TOD_NORMAL)
        .filter((c) => c.kind === "truth")
        .map((c) => c.text);
    case "dare":
      return (adult ? TOD_ADULT : TOD_NORMAL)
        .filter((c) => c.kind === "dare")
        .map((c) => c.text);
    case "truth-or-dare":
      return (adult ? TOD_ADULT : TOD_NORMAL).map((c) => c.text);
    case "scenario":
      return adult
        ? ADULT_DECKS.most_likely_to.map((c) => c.prompt)
        : gamePrompts("most_likely_to", false);
    case "confession":
      return adult
        ? ADULT_DECKS.never_have_i_ever.map((c) => c.prompt)
        : gamePrompts("never_have_i_ever", false);
  }
}

/** A random suggestion of the given type, avoiding `avoid` when possible. */
export function drawSuggestion(
  type: SuggestType,
  adult: boolean,
  avoid?: string | null,
): string {
  const list = pool(type, adult);
  if (list.length === 0) return "";
  if (list.length === 1) return list[0];
  let pick = list[Math.floor(Math.random() * list.length)];
  for (let i = 0; i < 6 && pick === avoid; i++) {
    pick = list[Math.floor(Math.random() * list.length)];
  }
  return pick;
}

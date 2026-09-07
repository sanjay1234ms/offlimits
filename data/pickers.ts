/** Metadata for the Random Pickers suite. Kept in a plain (non-client)
 * module so server components can read it in generateStaticParams / metadata. */

export interface PickerMeta {
  title: string;
  blurb: string;
  accent: string;
  border: string;
  grad: string;
}

export const PICKER_META: Record<string, PickerMeta> = {
  name: {
    title: "Random Name Picker",
    blurb: "Draw a name from your custom list, with no repeats until it resets.",
    accent: "text-teal-300",
    border: "border-teal-500/40",
    grad: "from-teal-600/20 to-cyan-600/10",
  },
  teams: {
    title: "Team Generator",
    blurb: "Split any group into fair teams automatically.",
    accent: "text-lime-300",
    border: "border-lime-500/40",
    grad: "from-lime-600/20 to-green-600/10",
  },
  scavenger: {
    title: "Scavenger Hunt",
    blurb: "Pick a pack, get a checklist, tick things off.",
    accent: "text-green-300",
    border: "border-green-500/40",
    grad: "from-green-500/20 to-emerald-600/10",
  },
  raffle: {
    title: "Raffle",
    blurb: "Draw prize winners from any list, tickets and all.",
    accent: "text-yellow-300",
    border: "border-yellow-500/40",
    grad: "from-yellow-500/20 to-amber-600/10",
  },
  word: {
    title: "Random Word Generator",
    blurb: "Words to draw, act, describe, or write about.",
    accent: "text-sky-300",
    border: "border-sky-500/40",
    grad: "from-sky-600/20 to-blue-600/10",
  },
  country: {
    title: "Random Country",
    blurb: "Draw a country with its flag, capital, and region.",
    accent: "text-blue-300",
    border: "border-blue-500/40",
    grad: "from-blue-600/20 to-indigo-600/10",
  },
};

export const PICKER_SLUGS: string[] = Object.keys(PICKER_META);

/** Metadata for the Random Pickers suite. Kept in a plain (non-client)
 * module so server components can read it in generateStaticParams / metadata. */

export interface PickerMeta {
  title: string;
  blurb: string;
  /** <title> and meta description for /pickers/[tool] (search results only, not shown on the page). */
  seoTitle: string;
  description: string;
  accent: string;
  border: string;
  grad: string;
}

export const PICKER_META: Record<string, PickerMeta> = {
  name: {
    title: "Random Name Picker",
    blurb: "Draw a name from your custom list, with no repeats until it resets.",
    seoTitle: "Random Name Picker: Free Name Draw with No Repeats",
    description:
      "Free random name picker: paste your list and draw a name, with no repeats until the list resets. Great for classrooms, giveaways, games and choosing turns.",
    accent: "text-teal-300",
    border: "border-teal-500/40",
    grad: "from-teal-600/20 to-cyan-600/10",
  },
  teams: {
    title: "Team Generator",
    blurb: "Split any group into fair teams automatically.",
    seoTitle: "Random Team Generator: Split Groups into Fair Teams",
    description:
      "Free random team generator: type in names and split any group into fair, balanced teams in one tap. Ideal for game night, classrooms, sports and work events.",
    accent: "text-lime-300",
    border: "border-lime-500/40",
    grad: "from-lime-600/20 to-green-600/10",
  },
  scavenger: {
    title: "Scavenger Hunt",
    blurb: "Pick a pack, get a checklist, tick things off.",
    seoTitle: "Scavenger Hunt Generator: Free Indoor & Outdoor Lists",
    description:
      "Free scavenger hunt generator: pick an around-the-house or outdoor pack, get a ready-made checklist and tick items off on one phone. No printing, no prep.",
    accent: "text-green-300",
    border: "border-green-500/40",
    grad: "from-green-500/20 to-emerald-600/10",
  },
  raffle: {
    title: "Raffle",
    blurb: "Draw prize winners from any list, tickets and all.",
    seoTitle: "Online Raffle Draw: Free Random Prize Winner Picker",
    description:
      "Free online raffle draw: add entrants and tickets, then draw prize winners at random on one screen. Fair, quick and ideal for parties, fundraisers and classes.",
    accent: "text-yellow-300",
    border: "border-yellow-500/40",
    grad: "from-yellow-500/20 to-amber-600/10",
  },
  word: {
    title: "Random Word Generator",
    blurb: "Words to draw, act, describe, or write about.",
    seoTitle: "Random Word Generator for Pictionary & Charades",
    description:
      "Free random word generator for Pictionary, charades and party games or writing prompts. Draw words to sketch, act out, describe or write about, on any phone.",
    accent: "text-sky-300",
    border: "border-sky-500/40",
    grad: "from-sky-600/20 to-blue-600/10",
  },
  country: {
    title: "Random Country",
    blurb: "Draw a country with its flag, capital, and region.",
    seoTitle: "Random Country Generator with Flags & Capitals",
    description:
      "Free random country generator: draw a country with its flag, capital and region. Great for geography quizzes, classroom games, trivia nights and trip ideas.",
    accent: "text-blue-300",
    border: "border-blue-500/40",
    grad: "from-blue-600/20 to-indigo-600/10",
  },
};

export const PICKER_SLUGS: string[] = Object.keys(PICKER_META);

/** "How to use" steps and FAQs shown under each /pickers/[tool] page.
 * Plain module so the server page can render it and build FAQPage JSON-LD. */

export interface PickerGuide {
  intro: string;
  howTo: string[];
  faq: { q: string; a: string }[];
}

export const PICKER_GUIDES: Record<string, PickerGuide> = {
  name: {
    intro:
      "A fair way to choose who goes first, who answers next or who wins the spot prize, without anyone accusing you of picking favourites.",
    howTo: [
      "Type or paste your names into the Names box, one name per line.",
      "Tap Draw a name. The picker shuffles the list and shows one name.",
      "Keep drawing. A name never comes up twice until everyone has been picked, and the counter shows how many are left.",
      "When the list runs out it reshuffles on its own, or tap Reset the list to start a fresh round early.",
    ],
    faq: [
      {
        q: "Can the same name be picked twice in a row?",
        a: "No. Every name is drawn once before the list resets, so everyone gets a turn before anyone goes again.",
      },
      {
        q: "Is it really random?",
        a: "Yes. The list is shuffled in your browser each round, so the order can't be predicted or influenced.",
      },
      {
        q: "Is my list saved?",
        a: "No. Names stay on the page while it is open and are never sent anywhere. Refreshing the page brings back the example list.",
      },
      {
        q: "What can I use it for?",
        a: "Choosing turns in party games, calling on students, picking a giveaway winner, deciding who does the dishes or settling who pays.",
      },
    ],
  },
  teams: {
    intro:
      "Split a group into random teams in one tap, so nobody has to be picked last and the sides come out even.",
    howTo: [
      "Type or paste everyone's names into the People box, one per line.",
      "Use the + and - buttons to choose how many teams you need, from 2 up to 8.",
      "Tap Generate teams. Names are shuffled and dealt out like cards, so team sizes never differ by more than one person.",
      "Not happy with the mix? Tap Generate teams again for a fresh split.",
    ],
    faq: [
      {
        q: "Are the teams balanced?",
        a: "By size, yes: players are dealt out one at a time, so teams are equal or within one person of each other. Skill isn't taken into account, so reshuffle if one side looks stacked.",
      },
      {
        q: "How many people can I add?",
        a: "As many as you like. You need at least as many people as teams, otherwise the button stays disabled.",
      },
      {
        q: "What is it good for?",
        a: "Trivia and charades teams at a party, classroom group work, five-a-side football, office icebreakers and splitting a big group into breakout rooms.",
      },
    ],
  },
  scavenger: {
    intro:
      "Ready-made scavenger hunt lists you can start in seconds, with a checklist on the phone instead of paper and pens.",
    howTo: [
      "Pick a pack: Around the house, Outdoors or Party edition.",
      "Read the list out, or pass the phone around so each team can see it.",
      "Set a time limit and send everyone off to find the items.",
      "Tap each item as it is found. The progress bar fills up so you can see how close you are.",
      "Tap Different pack to start a new hunt with a fresh list.",
    ],
    faq: [
      {
        q: "Do I need to print anything?",
        a: "No. The checklist lives on the phone, so there's no printing, no pens and no prep.",
      },
      {
        q: "Which pack should I choose?",
        a: "Around the house works for rainy days and sleepovers, Outdoors suits gardens, parks and camping, and Party edition is made for a room full of guests.",
      },
      {
        q: "How do we play with teams?",
        a: "Give each team the same pack on its own phone and a time limit. The team with the most items ticked when time runs out wins.",
      },
    ],
  },
  raffle: {
    intro:
      "Run a prize draw on one screen: add the tickets, choose how many winners you need and draw them at random in front of everyone.",
    howTo: [
      "Add one line per ticket in the Tickets box. Someone with three tickets goes in on three lines.",
      "Use the + and - buttons to set how many winners to draw, from 1 to 10.",
      "Tap Draw winners. The tickets are shuffled and the winners appear in the order they were drawn.",
      "Show the screen to the room, or draw again for the next prize.",
    ],
    faq: [
      {
        q: "How do extra tickets work?",
        a: "Each line is one ticket, so adding a name more than once gives that person better odds, just like buying more tickets.",
      },
      {
        q: "Can the same person win twice?",
        a: "Only if their name is on more than one line. Each ticket can win once per draw.",
      },
      {
        q: "Is it fair enough for a fundraiser?",
        a: "Every ticket has the same chance in each draw, and you can draw live in front of everyone so the result is clearly random.",
      },
      {
        q: "Are the entries saved or shared?",
        a: "No. The list stays on the page while it is open and is never sent anywhere.",
      },
    ],
  },
  word: {
    intro:
      "Random words for Pictionary, charades, taboo-style describing games and writing prompts, sorted by how you'll use them.",
    howTo: [
      "Choose a category: Draw it, Act it out, Describe it or Write about it.",
      "Tap Generate a word and show it only to the player whose turn it is.",
      "Start a timer and let them draw, act, describe or write while everyone else guesses.",
      "Tap again for the next word, or switch category for a different game.",
    ],
    faq: [
      {
        q: "Which category is for Pictionary?",
        a: "Use Draw it: the words are easy to sketch. Act it out is made for charades, and Describe it suits taboo-style games where you explain without saying the word.",
      },
      {
        q: "Can I use it for writing prompts?",
        a: "Yes. Write about it gives you a word to build a story, poem or journal entry around, which works well in classrooms.",
      },
      {
        q: "Can the same word come up again?",
        a: "Each tap is a fresh random pick, so repeats can happen. Just tap again if you get one you've already played.",
      },
    ],
  },
  country: {
    intro:
      "Draw a random country with its flag, capital and region, for geography games, quiz rounds or picking where to travel next.",
    howTo: [
      "Tap Draw a country to get a random country.",
      "Read the flag, name, capital and region on the result card.",
      "For a quiz, cover the screen and let players guess the country from its flag, or name the capital from the country.",
      "Tap again for the next round.",
    ],
    faq: [
      {
        q: "How can I use it in a game?",
        a: "Show only the flag and race to name the country, or call out the country and ask for its capital. Keep score to turn it into a trivia round.",
      },
      {
        q: "Is it good for the classroom?",
        a: "Yes. It makes a quick geography warm-up: draw a country, find it on a map and share one fact about it.",
      },
      {
        q: "Does it include every country?",
        a: "It draws from a curated list of well-known countries across every region, chosen so the flags and capitals are fair for a party quiz.",
      },
    ],
  },
};

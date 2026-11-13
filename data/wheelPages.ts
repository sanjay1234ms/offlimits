import { WHEEL_PRESETS } from "./wheelPresets";

/** One indexable page per ready-made wheel, at /wheel/<slug>. */
export interface WheelPage {
  slug: string;
  /** <title> without the " | OffLimits" suffix. */
  title: string;
  /** Meta description, 150-160 characters. */
  description: string;
  h1: string;
  emojis: [string, string, string];
  blurb: string;
  options: string[];
  howTo: string[];
  faq: { q: string; a: string }[];
}

const opts = (key: string) => WHEEL_PRESETS[key]?.options ?? [];

export const WHEEL_PAGES: WheelPage[] = [
  {
    slug: "yes-or-no",
    title: "Yes or No Wheel: Spin for a Random Answer",
    description:
      "Free yes or no wheel. Ask a question, spin, and let the wheel decide. Fair 50/50 odds, works on any phone or laptop, no download. Add Maybe if you dare.",
    h1: "Yes or No Wheel",
    emojis: ["✅", "❌", "🎡"],
    blurb: "Ask your question out loud, spin, and the wheel answers yes or no. Stuck between two choices? Let it decide.",
    options: opts("yes-or-no"),
    howTo: [
      "Think of a yes-or-no question.",
      "Tap Spin and wait for the wheel to stop.",
      "Want it less final? Add a Maybe or Ask again slice.",
    ],
    faq: [
      { q: "Is the yes or no wheel random?", a: "Yes. Every spin picks a slice at random, so Yes and No each have a 50% chance." },
      { q: "Can I add more answers?", a: "Yes. Add slices like Maybe or Ask again, or remove one, and the odds update automatically." },
      { q: "What can I use it for?", a: "Quick decisions, party dares, classroom games or settling an argument when nobody wants to choose." },
    ],
  },
  {
    slug: "what-should-i-eat",
    title: "What Should I Eat? Food Decision Wheel",
    description:
      "Can't decide what to eat? Spin the food wheel: pizza, sushi, tacos, burgers, curry and more. Edit the options for your area, then spin to pick dinner.",
    h1: "What Should I Eat? Wheel",
    emojis: ["🍕", "🌮", "🍣"],
    blurb: "Ten popular dinners on one wheel. Spin it, and that's what you're eating. No arguing allowed.",
    options: opts("what-should-i-eat"),
    howTo: [
      "Edit the slices to match the places near you, or keep the defaults.",
      "Spin once. Whatever it lands on is dinner.",
      "Allow one re-spin per person, then the wheel's word is final.",
    ],
    faq: [
      { q: "How do I decide what to eat with a group?", a: "Let everyone add one option to the wheel, then spin once. It's fair and ends the debate fast." },
      { q: "Can I add my favourite restaurants?", a: "Yes. Type in any restaurants or dishes and remove the ones you don't want." },
      { q: "Does it work on my phone?", a: "Yes. The wheel runs in any phone or laptop browser with no app or sign-up." },
    ],
  },
  {
    slug: "truth-or-dare",
    title: "Truth or Dare Wheel: Spin to Pick Truth or Dare",
    description:
      "Spin the truth or dare wheel to choose for you: truth, dare, double dare or skip. Free for parties and sleepovers, then grab a question from our deck.",
    h1: "Truth or Dare Wheel",
    emojis: ["🎯", "😈", "🎡"],
    blurb: "Can't choose? Spin and the wheel decides: truth, dare, double dare or a lucky skip.",
    options: opts("truth-or-dare"),
    howTo: [
      "Sit in a circle and pass the phone.",
      "Spin to see if you get a truth, a dare, a double dare or a skip.",
      "Draw your question from the truth or dare deck and answer it.",
    ],
    faq: [
      { q: "What is a double dare?", a: "You do the dare twice as big, or the person who set it has to do it with you." },
      { q: "Where do I get the questions?", a: "Open the OffLimits truth or dare game for hundreds of clean and party truths and dares." },
      { q: "Can I change the odds?", a: "Yes. Add more Truth or Dare slices to make one come up more often." },
    ],
  },
  {
    slug: "random-number-1-100",
    title: "Random Number Wheel 1-100: Pick a Number",
    description:
      "Spin the random number wheel to pick a number from 1 to 100. Fair, instant and free. Great for raffles, giveaways, classroom games and deciding who goes first.",
    h1: "Random Number Wheel (1 to 100)",
    emojis: ["🔢", "🎲", "🎡"],
    blurb: "A wheel with every number from 1 to 100. Spin it to pick a random number.",
    options: opts("random-number-1-100"),
    howTo: [
      "Tap Spin.",
      "The wheel stops on a random number between 1 and 100.",
      "Remove a number after it's picked if you don't want repeats.",
    ],
    faq: [
      { q: "Is every number equally likely?", a: "Yes. Each of the 100 numbers has the same 1% chance on every spin." },
      { q: "Can I change the range?", a: "Yes. Delete the numbers you don't need, or try the 1 to 10 wheel." },
      { q: "Can I use it for a giveaway?", a: "Yes. Give each entry a number, spin, and the wheel picks the winner. For names, use the raffle picker." },
    ],
  },
  {
    slug: "random-number-1-10",
    title: "Random Number Wheel 1-10: Spin to Pick",
    description:
      "Pick a random number from 1 to 10 with a quick spin. Free, fair and works on any phone. Use it for games, turn order, classroom picks or guess-my-number.",
    h1: "Random Number Wheel (1 to 10)",
    emojis: ["🔟", "🎲", "🎡"],
    blurb: "Ten big slices, one spin. The fastest way to pick a number between 1 and 10.",
    options: Array.from({ length: 10 }, (_, i) => String(i + 1)),
    howTo: [
      "Tap Spin.",
      "Read out the number the wheel lands on.",
      "Play guess-my-number: everyone guesses before the spin, closest wins.",
    ],
    faq: [
      { q: "Is it truly random?", a: "Each spin picks one of the ten numbers at random with equal odds." },
      { q: "What games use a 1 to 10 wheel?", a: "Guess-my-number, turn order, rating challenges and picking how many cards to draw." },
    ],
  },
  {
    slug: "heads-or-tails",
    title: "Flip a Coin Online: Heads or Tails Wheel",
    description:
      "Flip a coin online with the heads or tails wheel. Fair 50/50 result in one tap, no coin needed. Settle bets, pick who goes first or make a quick decision.",
    h1: "Heads or Tails: Flip a Coin",
    emojis: ["🪙", "👑", "🎡"],
    blurb: "No coin in your pocket? Spin for heads or tails instead. Same odds, more drama.",
    options: opts("heads-or-tails"),
    howTo: [
      "Call heads or tails out loud before you spin.",
      "Tap Spin.",
      "Best of three if anyone complains.",
    ],
    faq: [
      { q: "Is this a fair coin flip?", a: "Yes. Heads and tails each have exactly a 50% chance on every spin." },
      { q: "Can I use it to decide who goes first?", a: "Yes. Each player calls a side and the winner goes first. For more players, try the Who Goes First wheel." },
    ],
  },
  {
    slug: "what-should-i-watch",
    title: "What Should I Watch? Movie Genre Wheel",
    description:
      "Spin the what should I watch wheel to pick a movie genre for tonight: comedy, thriller, horror, rom-com and more. Free, instant, and it ends the scrolling.",
    h1: "What Should I Watch? Wheel",
    emojis: ["🍿", "🎬", "📺"],
    blurb: "Stop scrolling. Spin for a genre, then pick the first good movie you see in it.",
    options: opts("what-should-i-watch"),
    howTo: [
      "Spin to pick a genre.",
      "Open your streaming app and pick the first movie in that genre that someone says yes to.",
      "Add your own options, like specific shows, to narrow it down.",
    ],
    faq: [
      { q: "Can I put actual movie titles on the wheel?", a: "Yes. Replace the genres with your shortlist of movies and spin to pick one." },
      { q: "How do we decide as a couple or group?", a: "Each person adds two options, then spin once. Nobody gets a veto." },
    ],
  },
  {
    slug: "who-goes-first",
    title: "Who Goes First Wheel: Random Turn Picker",
    description:
      "Spin the who goes first wheel to pick a random starting player for any game. Add names, spin, and play. Fair, free and faster than arguing over the rules.",
    h1: "Who Goes First? Wheel",
    emojis: ["🥇", "👉", "🎡"],
    blurb: "Add everyone's name, spin, and the wheel picks who starts. No more arguing over youngest-goes-first.",
    options: opts("who-goes-first"),
    howTo: [
      "Replace the slices with every player's name.",
      "Spin once. That player goes first.",
      "Play continues to their left, or spin again for each turn.",
    ],
    faq: [
      { q: "Can I add player names?", a: "Yes. Type each name as a slice. Remove anyone who isn't playing." },
      { q: "Can I pick a full turn order?", a: "Yes. Spin, remove the winner, and spin again until everyone has a place." },
    ],
  },
  {
    slug: "random-letter",
    title: "Random Letter Generator Wheel (A to Z)",
    description:
      "Spin the random letter wheel to pick a letter from A to Z. Free for Scattergories-style games, word games, classroom spelling and name-a-thing challenges.",
    h1: "Random Letter Wheel",
    emojis: ["🔤", "✏️", "🎡"],
    blurb: "All 26 letters on one wheel. Spin it to pick a random letter for word games and challenges.",
    options: opts("random-letter"),
    howTo: [
      "Tap Spin to get a random letter.",
      "Everyone names something in a category that starts with it.",
      "Remove hard letters like Q, X and Z for younger players.",
    ],
    faq: [
      { q: "What games use a random letter?", a: "Scattergories-style category games, Fast 5, alphabet games and classroom spelling races." },
      { q: "Can I remove letters?", a: "Yes. Delete any slices you don't want, like Q, X or Z." },
    ],
  },
  {
    slug: "would-you-rather",
    title: "Would You Rather Wheel: Spin a Random Question",
    description:
      "Spin the would you rather wheel for a random dilemma to argue about. Free for parties, classrooms and road trips. Then play hundreds more in our game.",
    h1: "Would You Rather Wheel",
    emojis: ["🤔", "⚖️", "🎡"],
    blurb: "Spin for a random Would You Rather question, then everyone picks a side and defends it.",
    options: opts("would-you-rather"),
    howTo: [
      "Spin to land on a question.",
      "Everyone points left or right for their choice.",
      "The smaller side has ten seconds to defend their pick.",
    ],
    faq: [
      { q: "Where can I find more questions?", a: "The OffLimits Would You Rather game has hundreds more, with filters for friends, work, couples and kids." },
      { q: "Can I write my own questions?", a: "Yes. Replace any slice with your own Would You Rather question." },
    ],
  },
  {
    slug: "date-night-ideas",
    title: "Date Night Ideas Wheel: Spin for a Date",
    description:
      "Spin the date night ideas wheel for a random date: cook together, movie night, picnic, stargazing and more. Add your own ideas and let fate plan the night.",
    h1: "Date Night Ideas Wheel",
    emojis: ["💕", "🍝", "🎡"],
    blurb: "Out of date ideas? Spin and the wheel plans your night. Re-spins cost a kiss.",
    options: opts("date-night-ideas"),
    howTo: [
      "Each of you adds one or two ideas to the wheel.",
      "Spin once and commit to whatever it lands on.",
      "Save the wheel's picks for next week too.",
    ],
    faq: [
      { q: "Are these date ideas cheap?", a: "Most of them are free or low cost, like a picnic, cooking together or a movie night at home." },
      { q: "What should we play on date night?", a: "Try the couples quiz or How Well Do You Know Me on OffLimits after dinner." },
    ],
  },
  {
    slug: "chore-wheel",
    title: "Chore Wheel: Randomly Assign Chores Fairly",
    description:
      "Use the free chore wheel to assign household chores at random. Add your chores and spin for each person. Fair for kids, roommates and families. No sign-up.",
    h1: "Chore Wheel",
    emojis: ["🧹", "🧺", "🎡"],
    blurb: "Nobody wants the dishes. Spin the chore wheel and let fate decide who does what.",
    options: opts("chore-wheel"),
    howTo: [
      "Edit the slices to match your household chores.",
      "Each person spins once for their chore.",
      "Remove a chore once it's assigned so nobody gets two.",
    ],
    faq: [
      { q: "Is a chore wheel fair?", a: "Yes. Everyone has the same chance of every chore, so nobody can claim favouritism." },
      { q: "Does it work for roommates?", a: "Yes. Spin once a week and screenshot the results for the fridge." },
    ],
  },
  {
    slug: "workout-wheel",
    title: "Workout Wheel: Random Exercise Generator",
    description:
      "Spin the workout wheel for a random exercise: push-ups, squats, burpees, planks and more. A free random workout generator for home, PE class or forfeits.",
    h1: "Workout Wheel",
    emojis: ["💪", "🏋️", "🎡"],
    blurb: "Spin for a random exercise and do it now. Spin ten times for a full workout.",
    options: opts("workout-wheel"),
    howTo: [
      "Spin to get an exercise.",
      "Do exactly what it says, then shake it out.",
      "Rest 15 seconds and spin again. Ten spins is a full session.",
    ],
    faq: [
      { q: "Can I add my own exercises?", a: "Yes. Replace any slice with exercises that suit your level." },
      { q: "Can I use it as a party forfeit?", a: "Yes. Losers of a round spin the workout wheel and do whatever it lands on." },
    ],
  },
  {
    slug: "what-to-do-when-bored",
    title: "What to Do When Bored Wheel: Spin for an Idea",
    description:
      "Bored? Spin the what to do when bored wheel for a random idea: call an old friend, learn a card trick, go for a walk, do a puzzle. Free, instant, fun.",
    h1: "What to Do When You're Bored",
    emojis: ["🥱", "💡", "🎡"],
    blurb: "Spin and do whatever it says. No overthinking, no excuses.",
    options: opts("what-to-do-when-bored"),
    howTo: [
      "Spin the wheel.",
      "Do the activity for at least 15 minutes.",
      "Still bored? Try today's daily puzzles.",
    ],
    faq: [
      { q: "What can I do when I'm bored at home?", a: "Spin the wheel for an idea, or play today's Word Heist, Off the Map and Close Call puzzles on OffLimits." },
      { q: "Can I add my own ideas?", a: "Yes. Replace any slice with things you like to do." },
    ],
  },
  {
    slug: "christmas-movie-wheel",
    title: "Christmas Movie Wheel: Pick a Holiday Movie",
    description:
      "Spin the Christmas movie wheel to pick tonight's holiday film: Elf, Home Alone, The Grinch, Love Actually and more. Free, festive, and it ends the remote fight.",
    h1: "Christmas Movie Wheel",
    emojis: ["🎄", "🍿", "🎬"],
    blurb: "Twelve Christmas classics on one wheel. Spin it and press play.",
    options: [
      "Elf",
      "Home Alone",
      "The Grinch",
      "Love Actually",
      "The Polar Express",
      "It's a Wonderful Life",
      "The Santa Clause",
      "Christmas Vacation",
      "The Holiday",
      "Klaus",
      "The Muppet Christmas Carol",
      "Die Hard",
    ],
    howTo: [
      "Swap in any Christmas movies you'd rather watch.",
      "Spin once and press play.",
      "After the movie, play Christmas movie trivia to see who was paying attention.",
    ],
    faq: [
      { q: "What is the best Christmas movie for families?", a: "Elf, Home Alone and The Polar Express are safe picks for most ages." },
      { q: "Can I add my own movies?", a: "Yes. Replace or add any titles before you spin." },
    ],
  },
  {
    slug: "what-to-draw",
    title: "What to Draw Wheel: Random Drawing Ideas",
    description:
      "Spin the what to draw wheel for a random drawing idea: a dragon, your dream house, a cat in a hat and more. Free for artists, kids, classrooms and Pictionary.",
    h1: "What to Draw Wheel",
    emojis: ["✏️", "🎨", "🎡"],
    blurb: "Blank page? Spin for a random drawing prompt and start sketching.",
    options: [
      "A dragon",
      "Your dream house",
      "A cat in a hat",
      "A robot chef",
      "An underwater city",
      "Your favourite food with a face",
      "A monster under the bed",
      "A spaceship",
      "A tiny castle",
      "A snowman on holiday",
      "An animal mash-up",
      "Your self-portrait as a superhero",
    ],
    howTo: [
      "Spin for a prompt.",
      "Set a timer: 1 minute for a quick sketch, 10 for a proper drawing.",
      "Play it as Pictionary: one person draws, everyone else guesses the prompt.",
    ],
    faq: [
      { q: "Is this good for kids?", a: "Yes. Every prompt is kid-friendly and works for classrooms and rainy days." },
      { q: "Can I use it for Pictionary?", a: "Yes. For more words, see our Pictionary words list." },
    ],
  },
];

export function wheelPageBySlug(slug: string): WheelPage | undefined {
  return WHEEL_PAGES.find((p) => p.slug === slug);
}

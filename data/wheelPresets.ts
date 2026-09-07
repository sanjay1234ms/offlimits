/** Ready-made wheels. Pills route to /wheel?preset=<slug> and prefill slices. */

export interface WheelPreset {
  label: string;
  options: string[];
}

export const WHEEL_PRESETS: Record<string, WheelPreset> = {
  "yes-or-no": { label: "Yes or No Wheel", options: ["Yes", "No"] },
  "what-should-i-eat": {
    label: "What Should I Eat?",
    options: [
      "Pizza",
      "Sushi",
      "Tacos",
      "Burgers",
      "Thai",
      "Pasta",
      "Curry",
      "Ramen",
      "Salad",
      "Sandwiches",
    ],
  },
  "truth-or-dare": {
    label: "Truth or Dare Wheel",
    options: ["Truth", "Dare", "Truth", "Dare", "Double Dare", "Skip"],
  },
  "random-number-1-100": {
    label: "Random Number Wheel (1-100)",
    options: Array.from({ length: 100 }, (_, i) => String(i + 1)),
  },
  "heads-or-tails": { label: "Heads or Tails", options: ["Heads", "Tails"] },
  "what-should-i-watch": {
    label: "What Should I Watch?",
    options: [
      "Comedy",
      "Thriller",
      "Documentary",
      "Action",
      "Rom-com",
      "Horror",
      "Sci-fi",
      "Drama",
      "Anime",
      "Reality TV",
    ],
  },
  "who-goes-first": {
    label: "Who Goes First?",
    options: [
      "Player 1",
      "Player 2",
      "Player 3",
      "Player 4",
      "Player 5",
      "Player 6",
    ],
  },
  "random-letter": {
    label: "Random Letter Wheel",
    options: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
  },
  "would-you-rather": {
    label: "Would You Rather Wheel",
    options: [
      "Be invisible",
      "Be able to fly",
      "Read minds",
      "Time travel",
      "Never sleep",
      "Speak every language",
      "Always be 10 min early",
      "Never wait in a queue",
    ],
  },
  "date-night-ideas": {
    label: "Date Night Ideas Wheel",
    options: [
      "Cook something new together",
      "Movie night",
      "Go for a long walk",
      "Board games",
      "Try a new restaurant",
      "Stargazing",
      "Bake a dessert",
      "Museum or gallery",
      "Picnic",
      "Living-room karaoke",
    ],
  },
  "chore-wheel": {
    label: "Chore Wheel",
    options: [
      "Dishes",
      "Vacuum",
      "Laundry",
      "Take out the trash",
      "Clean the bathroom",
      "Dusting",
      "Mop the floors",
      "Tidy the kitchen",
    ],
  },
  "workout-wheel": {
    label: "Workout Wheel",
    options: [
      "20 push-ups",
      "30 squats",
      "1-min plank",
      "15 burpees",
      "20 lunges",
      "40 jumping jacks",
      "30-sec mountain climbers",
      "25 sit-ups",
    ],
  },
  "what-to-do-when-bored": {
    label: "What to Do When You're Bored",
    options: [
      "Call an old friend",
      "Learn a card trick",
      "Go for a walk",
      "Start a doodle",
      "Reorganise one drawer",
      "Try a 10-minute stretch",
      "Write a list of goals",
      "Cook something you've never made",
      "Do a puzzle",
      "Plan a day trip",
    ],
  },
};

export const WHEEL_PRESET_LIST: { slug: string; label: string }[] = Object.entries(
  WHEEL_PRESETS,
).map(([slug, preset]) => ({ slug, label: preset.label }));

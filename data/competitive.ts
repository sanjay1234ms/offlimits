/** Content + config for the Competitive Games section: the scored engine
 * games, the two new fast-paced games, and the end-game podium. */

export const COMPETITIVE_TAGLINE = "🏆 Show no mercy · Crown the winner";

/** Default one-tap names so a group can start without typing anything. */
export const QUICK_PLAY_NAMES = ["Player 1", "Player 2", "Player 3"];

/** Never drop below this many players on the board. */
export const MIN_PLAYERS = 2;

/** One-tap player counts offered on the inline setup strip. */
export const PLAYER_COUNT_CHOICES = [2, 3, 4, 5, 6, 8];

/** Group-size filter → the default player count to seed when a competitive
 * game is opened from that filter (URL `?players=`). */
export const GROUP_SIZE_TO_COUNT: Record<string, number> = {
  "2-4": 4,
  "5-10": 6,
  "11-20": 12,
  "20+": 20,
};

/** Group-size filter → the minimum roster it should top up to when tapped in
 * the in-game filter bar (e.g. "5-10" → 5 players). */
export const GROUP_SIZE_MIN: Record<string, number> = {
  "2-4": 2,
  "5-10": 5,
  "11-20": 11,
  "20+": 20,
};

/** Engine games (/games/[slug]) that get the scoreboard shell. Objectively
 * score-based only, social pass-the-phone games are deliberately excluded. */
export const COMPETITIVE_ENGINE_SLUGS = [
  "trivia",
  "fast-5",
  "buzzkill",
  "charades",
];

/** Roasts pulled for the bottom of the podium. */
export const PODIUM_ROASTS = [
  "participation trophy incoming.",
  "at least you showed up. barely.",
  "someone has to hold the wooden spoon.",
  "we've all agreed not to talk about this.",
  "technically still competed. technically.",
  "brought the vibes, not the points.",
  "carried the group snacks, not the scoreboard.",
  "great personality though.",
  "the real winner was the friends we lost along the way.",
  "next time try answering the questions.",
];

export interface BuzzkillCard {
  target: string;
  forbidden: [string, string, string];
}

/** Buzzkill / Taboo, describe the target without the three forbidden words. */
export const BUZZKILL_CARDS: BuzzkillCard[] = [
  { target: "Pizza", forbidden: ["cheese", "slice", "Italian"] },
  { target: "Beach", forbidden: ["sand", "sea", "sun"] },
  { target: "Wedding", forbidden: ["marriage", "dress", "ring"] },
  { target: "Netflix", forbidden: ["streaming", "TV", "watch"] },
  { target: "Gym", forbidden: ["workout", "weights", "muscle"] },
  { target: "Coffee", forbidden: ["caffeine", "morning", "cup"] },
  { target: "Birthday", forbidden: ["cake", "candles", "party"] },
  { target: "Umbrella", forbidden: ["rain", "wet", "hold"] },
  { target: "Snowman", forbidden: ["cold", "carrot", "melt"] },
  { target: "Passport", forbidden: ["travel", "airport", "photo"] },
  { target: "Doctor", forbidden: ["hospital", "sick", "patient"] },
  { target: "Guitar", forbidden: ["strings", "music", "band"] },
  { target: "Toothbrush", forbidden: ["teeth", "clean", "mouth"] },
  { target: "Wi-Fi", forbidden: ["internet", "password", "signal"] },
  { target: "Alarm clock", forbidden: ["wake", "morning", "snooze"] },
  { target: "Selfie", forbidden: ["photo", "camera", "phone"] },
  { target: "Bald", forbidden: ["hair", "head", "shave"] },
  { target: "Sunburn", forbidden: ["red", "skin", "sun"] },
  { target: "Karaoke", forbidden: ["sing", "microphone", "song"] },
  { target: "Traffic", forbidden: ["cars", "jam", "road"] },
  { target: "Ghost", forbidden: ["spooky", "dead", "white"] },
  { target: "Sandwich", forbidden: ["bread", "filling", "lunch"] },
  { target: "Rollercoaster", forbidden: ["ride", "loop", "scream"] },
  { target: "Fireworks", forbidden: ["explode", "bang", "sky"] },
  { target: "Meeting", forbidden: ["work", "boring", "calendar"] },
  { target: "Sunglasses", forbidden: ["eyes", "sun", "cool"] },
  { target: "Vacuum", forbidden: ["clean", "carpet", "suck"] },
  { target: "Password", forbidden: ["login", "forgot", "secure"] },
  { target: "Snail", forbidden: ["slow", "shell", "slime"] },
  { target: "Podcast", forbidden: ["listen", "episode", "audio"] },
];

/** Fast 5, name five things in the category before the buzzer. */
export const FAST5_CATEGORIES = [
  "breakfast foods",
  "things in a fridge",
  "board games",
  "countries in Europe",
  "types of dog",
  "things that are cold",
  "movie villains",
  "items in a bathroom",
  "sports played with a ball",
  "things you plug in",
  "pizza toppings",
  "words for 'tired'",
  "things at a beach",
  "famous rivers",
  "school subjects",
  "things in a first-aid kit",
  "reasons to be late",
  "types of pasta",
  "things that fly",
  "car brands",
  "things in a wallet",
  "flavours of ice cream",
  "jobs that wear a uniform",
  "things you find in space",
  "kitchen appliances",
  "things that are sticky",
  "musical instruments",
  "excuses for not texting back",
  "things at a wedding",
  "green vegetables",
];

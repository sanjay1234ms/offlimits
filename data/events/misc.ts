import type { SpicyCard } from "@/components/party/SpicyDeck";
import type { QuizTemplate } from "@/components/party/KnowQuiz";
import type { HuntItem } from "@/components/party/Checklist";
import type { PriceItem } from "@/components/party/PriceGuess";
import type { EmojiClue } from "@/components/party/EmojiQuiz";

type L = SpicyCard["level"];
type M = SpicyCard["mode"];
const cards = (level: L, mode: M, texts: string[]): SpicyCard[] =>
  texts.map((text, i) => ({ id: `bd${level}${mode}${i}`, level, mode, text }));

/* ------------------------------ Thanksgiving ------------------------------ */

export const TURKEY_PROMPTS = [
  "Name three things you're thankful for in ten seconds.",
  "What's the best thing that happened to you this year?",
  "Who at this table would you want with you on a desert island?",
  "What's your all-time favorite Thanksgiving dish?",
  "Do your best turkey gobble. Loud.",
  "What's one thing you're thankful for that nobody would guess?",
  "Tell a funny family story everyone has heard a hundred times.",
  "Give a ten-second toast to the cook.",
  "Who here made your year better, and how?",
  "What tradition would you add to Thanksgiving?",
  "Pumpkin pie or pecan pie? Defend your answer.",
  "Name something you learned this year.",
  "What's the most embarrassing thing you did as a kid at a family dinner?",
  "Impersonate someone at this table. They have to guess it's them.",
  "What are you looking forward to next year?",
];

export const THANKSGIVING_VOTE = [
  "fall asleep on the couch after dinner",
  "eat the most pie",
  "start a debate at the table",
  "burn the rolls",
  "bring a store-bought dish and call it homemade",
  "cry during the gratitude toast",
  "show up late",
  "take home the most leftovers",
  "start a food fight",
  "spend the whole meal on their phone",
];

/* -------------------------------- Birthday -------------------------------- */

export const PRESENT_PROMPTS = [
  "Sing happy birthday in your best opera voice.",
  "Share your favorite memory with the birthday person.",
  "What gift would you buy the birthday person with unlimited money?",
  "Do your best impression of the birthday person.",
  "Describe the birthday person in three words.",
  "What's the best birthday you've ever had?",
  "Give the birthday person a ten-second toast.",
  "Make up a birthday rap. Four lines minimum.",
  "Guess the birthday person's age in dog years.",
  "Name a celebrity who shares the birthday person's vibe.",
  "What should the birthday person do before their next birthday?",
  "Do a birthday dance for ten seconds.",
];

export const BIRTHDAY_QUIZ: QuizTemplate[] = [
  { q: "What's {name}'s favorite food?", options: ["Pizza", "Sushi", "Tacos", "Burgers"] },
  { q: "What's {name}'s dream vacation?", options: ["Beach", "Mountains", "Big city", "Road trip"] },
  { q: "What would {name} do with a free Saturday?", options: ["Sleep in", "Go out", "Binge a show", "Something active"] },
  { q: "What's {name}'s go-to drink?", options: ["Coffee", "Tea", "Something fizzy", "Something strong"] },
  { q: "What's {name}'s biggest fear?", options: ["Spiders", "Heights", "Public speaking", "Being late"] },
  { q: "Which superpower would {name} pick?", options: ["Flying", "Invisibility", "Mind reading", "Teleporting"] },
  { q: "What's {name}'s favorite season?", options: ["Spring", "Summer", "Fall", "Winter"] },
  { q: "What's {name}'s worst habit?", options: ["Always late", "Phone addict", "Leaves dishes", "Overthinks"] },
  { q: "Early bird or night owl?", options: ["Early bird", "Night owl", "Both, somehow", "Neither, always tired"] },
  { q: "What's {name}'s guilty pleasure?", options: ["Reality TV", "Junk food", "Online shopping", "Sleeping in"] },
];

export const BIRTHDAY_HUNT: HuntItem[] = [
  { text: "Get a stranger to sing happy birthday", points: 20 },
  { text: "Get a free dessert for the birthday person", points: 25 },
  { text: "Take a photo with someone with the same birthday month", points: 20 },
  { text: "Get the whole table to do a birthday toast", points: 10 },
  { text: "Find someone the birthday person's exact age", points: 15 },
  { text: "Get a birthday shout-out from the DJ or staff", points: 25 },
  { text: "Take a photo wearing someone else's hat", points: 10 },
  { text: "Collect birthday wishes from five strangers", points: 15 },
  { text: "Recreate a childhood photo of the birthday person", points: 20 },
  { text: "Find a candle and make a wish anywhere but home", points: 10 },
];

/** Adult birthday edition (21st, 30th, …). 3-5 are 18+. */
export const BIRTHDAY_DECK: SpicyCard[] = [
  ...cards(1, "truth", [
    "What's the best birthday present you've ever received?",
    "What age did you feel most like an adult?",
    "What's one thing you want to do before your next birthday?",
    "What was your worst birthday ever?",
  ]),
  ...cards(1, "dare", [
    "Lead the group in a birthday cheer.",
    "Give the birthday person a 20-second compliment speech.",
    "Do your best impression of the birthday person at age 12.",
    "Let the birthday person pick your next drink.",
  ]),
  ...cards(1, "mlt", [
    "Who's most likely to forget their own birthday?",
    "Who's most likely to cry at their birthday party?",
    "Who's most likely to still be partying at 4am?",
  ]),
  ...cards(2, "truth", [
    "Who was your worst kiss, and how old were you?",
    "What's the most embarrassing thing you've done on your birthday?",
    "Who here would you have dated at 21?",
    "What's the boldest thing you've done to celebrate a birthday?",
  ]),
  ...cards(2, "dare", [
    "Serenade the birthday person with a love song.",
    "Let the group post a birthday story from your phone.",
    "Do a birthday body roll for ten seconds.",
    "Flirt with the birthday person like it's a bad rom-com.",
  ]),
  ...cards(2, "nhie", [
    "Never have I ever kissed someone on my birthday.",
    "Never have I ever lied about my age.",
    "Never have I ever cried at my own party.",
  ]),
  ...cards(3, "truth", [
    "What's the wildest birthday hookup you've had?",
    "Where's the strangest place you've had sex?",
    "What's the sexiest birthday present you've ever given?",
    "What's your body count, rounded to the nearest five?",
  ]),
  ...cards(3, "dare", [
    "Give the birthday person a lap dance to a song they choose.",
    "Take a body shot off the birthday person (if they agree).",
    "Read your last flirty text out loud.",
    "Do your best fake orgasm. The birthday person rates it.",
  ]),
  ...cards(3, "nhie", [
    "Never have I ever had birthday sex I'll never forget.",
    "Never have I ever had a one-night stand.",
    "Never have I ever sent a nude.",
  ]),
  ...cards(4, "truth", [
    "What's the kinkiest thing you've ever done?",
    "What's your favorite position, and why?",
    "What's the dirtiest thing you've said in bed?",
    "Have you ever had a threesome? Details.",
  ]),
  ...cards(4, "dare", [
    "Demonstrate your best oral technique on a banana.",
    "Describe your best sex ever to the group. Every detail.",
    "Moan the birthday person's name like you mean it.",
    "Show the group the spiciest photo you're willing to show.",
  ]),
  ...cards(4, "nhie", [
    "Never have I ever had sex in public.",
    "Never have I ever been tied up.",
    "Never have I ever filmed myself having sex.",
  ]),
  ...cards(5, "truth", [
    "Describe your best orgasm: where, how, who.",
    "What's a kink you've never told anyone until now?",
    "What's the nastiest thing you've let someone do to you?",
    "Rank your last three hookups, with details.",
  ]),
  ...cards(5, "dare", [
    "Do a full 60-second fake orgasm at max volume.",
    "Let the group read your last sext out loud.",
    "Give the birthday person a full lap dance, no holding back.",
    "Let the group scroll your camera roll for 20 seconds.",
  ]),
  ...cards(5, "nhie", [
    "Never have I ever had sex in a public bathroom.",
    "Never have I ever hooked up with two people in one night.",
    "Never have I ever been to a sex party.",
  ]),
];

/* ------------------------------ Baby shower ------------------------------- */

export const BABY_PRICES: PriceItem[] = [
  { name: "Newborn diapers, 30-pack", emoji: "🧷", price: 11 },
  { name: "Baby wipes, 72-pack", emoji: "🧻", price: 4 },
  { name: "Baby bottles, 2-pack", emoji: "🍼", price: 13 },
  { name: "Pacifiers, 2-pack", emoji: "👶", price: 7 },
  { name: "Baby shampoo, 13 oz", emoji: "🛁", price: 7 },
  { name: "Bodysuits, 5-pack", emoji: "👕", price: 16 },
  { name: "Swaddle blankets, 3-pack", emoji: "🧸", price: 28 },
  { name: "Video baby monitor", emoji: "📹", price: 70 },
  { name: "Infant car seat", emoji: "🚗", price: 180 },
  { name: "Full-size stroller", emoji: "🛒", price: 250 },
  { name: "Convertible crib", emoji: "🛏️", price: 220 },
  { name: "Electric breast pump", emoji: "🤱", price: 160 },
  { name: "Diaper bag backpack", emoji: "🎒", price: 45 },
  { name: "Infant formula, 12 oz can", emoji: "🥛", price: 25 },
  { name: "Silicone teether", emoji: "🦷", price: 8 },
  { name: "Nursing pillow", emoji: "🌙", price: 40 },
];

export const BABY_EMOJI: EmojiClue[] = [
  { emoji: "⭐✨🔭❓", answer: "Twinkle Twinkle Little Star" },
  { emoji: "🐑⚫🧶", answer: "Baa Baa Black Sheep" },
  { emoji: "🥚🧱💥", answer: "Humpty Dumpty" },
  { emoji: "🕷️🌧️☀️", answer: "Itsy Bitsy Spider" },
  { emoji: "🐄🌙🦘", answer: "Hey Diddle Diddle" },
  { emoji: "🚌🔄🛞", answer: "The Wheels on the Bus" },
  { emoji: "🐭🕰️⬆️", answer: "Hickory Dickory Dock" },
  { emoji: "👧🐑🏫", answer: "Mary Had a Little Lamb" },
  { emoji: "🌉⬇️👸", answer: "London Bridge Is Falling Down" },
  { emoji: "🚣‍♂️🌊😴", answer: "Row, Row, Row Your Boat" },
  { emoji: "🦁👑🐗🦦", answer: "The Lion King" },
  { emoji: "🐠🔍👨‍👦", answer: "Finding Nemo" },
  { emoji: "👶🐻🍯", answer: "Winnie the Pooh" },
  { emoji: "🧸🤠🚀", answer: "Toy Story" },
  { emoji: "👶🍼💼", answer: "The Boss Baby" },
];

/* ----------------------------- Bridal shower ------------------------------ */

export const BRIDAL_BINGO = [
  "Lingerie", "Wine glasses", "Candle", "Cookbook", "Towels", "Picture frame", "Blender", "Robe",
  "Kitchen knife set", "Bath bombs", "Cutting board", "Champagne", "Sheet set", "Mixing bowls",
  "Throw pillow", "Recipe box", "Coffee maker", "Card with cash", "Jewelry", "Serving platter",
  "Someone cries", "Bride says 'I love it!'", "Bow on the bride's head", "Gift for the groom",
  "Something blue", "Plant", "Air fryer", "Mugs", "Photo album", "Spa set", "Cocktail shaker",
];

export const HE_SAID_SHE_SAID: QuizTemplate[] = [
  { q: "'I knew on the first date.' Who said it?", options: ["Her", "Him"] },
  { q: "'I'm the better driver.' Who said it?", options: ["Her", "Him"] },
  { q: "'I said I love you first.' Who said it?", options: ["Her", "Him"] },
  { q: "'I'm the messier one.' Who said it?", options: ["Her", "Him"] },
  { q: "'I'd never survive a camping trip.' Who said it?", options: ["Her", "Him"] },
  { q: "'I'm better with money.' Who said it?", options: ["Her", "Him"] },
  { q: "'I fell asleep during our first movie date.' Who said it?", options: ["Her", "Him"] },
  { q: "'I cried during the proposal.' Who said it?", options: ["Her", "Him"] },
  { q: "'I'm the one who plans the dates.' Who said it?", options: ["Her", "Him"] },
  { q: "'I hog the covers.' Who said it?", options: ["Her", "Him"] },
];

export const COUPLE_QUIZ: QuizTemplate[] = [
  { q: "Where did the couple meet?", options: ["Dating app", "Through friends", "At work", "At school"] },
  { q: "Who made the first move?", options: ["The bride", "The groom", "Both at once", "A friend set them up"] },
  { q: "What was their first date?", options: ["Dinner", "Drinks", "Movie", "Something adventurous"] },
  { q: "Where did the proposal happen?", options: ["At home", "On vacation", "At a restaurant", "Outdoors"] },
  { q: "What's their favorite date night?", options: ["Takeout and a movie", "Fancy dinner", "Game night", "Live music"] },
  { q: "Who's the better cook?", options: ["The bride", "The groom", "Neither", "Equal"] },
  { q: "Where are they going on honeymoon?", options: ["Beach", "Europe", "Asia", "Still deciding"] },
  { q: "How long have they been together?", options: ["Under 2 years", "2-4 years", "5-7 years", "8+ years"] },
];

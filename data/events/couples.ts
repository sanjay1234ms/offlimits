import type { SpicyCard } from "@/components/party/SpicyDeck";
import type { CoupleQ } from "@/components/party/CouplesQuiz";

type L = SpicyCard["level"];
type M = SpicyCard["mode"];

function cards(level: L, mode: M, texts: string[]): SpicyCard[] {
  return texts.map((text, i) => ({ id: `c${level}${mode}${i}`, level, mode, text }));
}

/** Couples Edition: for two. 3-5 are 18+. */
export const COUPLES_DECK: SpicyCard[] = [
  ...cards(1, "truth", [
    "What was the exact moment you knew you liked me?",
    "What's your favorite memory of us from this year?",
    "What do I do that makes you feel most loved?",
    "What's one thing you'd never guess I love about you?",
    "Which date of ours would you relive tomorrow?",
    "What song makes you think of me?",
  ]),
  ...cards(1, "dare", [
    "Give me a 30-second compliment without repeating yourself.",
    "Recreate our first kiss as accurately as you can.",
    "Slow dance with me to the next song, no phones.",
    "Write a two-line love poem and read it out loud.",
    "Do your best impression of me getting ready to go out.",
    "Hold eye contact with me for 60 seconds without laughing.",
  ]),
  ...cards(1, "nhie", [
    "Never have I ever stalked your social media before our first date.",
    "Never have I ever practised what to say before calling you.",
    "Never have I ever told my friends every detail about our first date.",
    "Never have I ever worn your clothes when you weren't around.",
  ]),
  ...cards(2, "truth", [
    "What's the first thing you noticed about my body?",
    "Where's your favorite place for me to kiss you?",
    "What outfit of mine drives you a little crazy?",
    "What's the most attractive thing I do without realizing?",
    "Have you ever had a dream about me you never told me about?",
    "What's one thing you want us to try on a date this year?",
  ]),
  ...cards(2, "dare", [
    "Kiss me somewhere that isn't my lips. My pick.",
    "Give me a one-minute massage, wherever I ask.",
    "Whisper something flirty in my ear.",
    "Show me your sexiest dance move.",
    "Text me something you'd never say out loud.",
    "Let me pick a song and give me your best slow strip of one item.",
  ]),
  ...cards(2, "nhie", [
    "Never have I ever thought about you during a boring meeting.",
    "Never have I ever planned our next make-out session in my head.",
    "Never have I ever smelled your pillow when you were away.",
    "Never have I ever been jealous when someone flirted with you.",
  ]),
  ...cards(3, "truth", [
    "What's your favorite thing I do in bed?",
    "When was the best sex we've ever had, and why?",
    "What's one fantasy you've thought about but never told me?",
    "What do you want me to do more often?",
    "Where's the riskiest place you'd want to have sex with me?",
    "What's the sexiest thing I've ever said to you?",
  ]),
  ...cards(3, "dare", [
    "Take off one item of clothing. I choose which.",
    "Kiss my neck for 30 seconds.",
    "Describe exactly what you want to do to me later, in a whisper.",
    "Give me a lap dance for one full song.",
    "Blindfold me and kiss me in three different places. I guess where.",
    "Send me the sexiest selfie you're willing to take right now.",
  ]),
  ...cards(3, "nhie", [
    "Never have I ever faked it with you.",
    "Never have I ever thought about you while touching myself.",
    "Never have I ever wanted to rip your clothes off in public.",
    "Never have I ever saved a sexy photo of you on my phone.",
  ]),
  ...cards(4, "truth", [
    "What's the dirtiest thing you want to try with me?",
    "Top or bottom tonight? Defend your answer.",
    "What position do you secretly want us to do more?",
    "What's one thing I do in bed that you want me to do harder?",
    "Would you ever want to film us? Why or why not?",
    "What's your filthiest fantasy about me, start to finish?",
  ]),
  ...cards(4, "dare", [
    "Strip down to your underwear for the rest of the game.",
    "Use your mouth on any part of me except my lips for one minute.",
    "Tell me in graphic detail how you'd make me finish.",
    "Tie my hands with something nearby and tease me for two minutes.",
    "Lick something sweet off my body. You choose where.",
    "Show me exactly how you like to be touched, on yourself.",
  ]),
  ...cards(4, "nhie", [
    "Never have I ever wanted you to be rougher with me.",
    "Never have I ever wanted to try a toy together but been too shy to ask.",
    "Never have I ever had sex with you somewhere we could have been caught.",
    "Never have I ever thought about a threesome with you.",
  ]),
  ...cards(5, "truth", [
    "What's the nastiest thing you want me to say to you in bed?",
    "What's a kink you'd try with me tonight if I said yes?",
    "What's the most turned on you've ever been by me, in detail?",
    "Describe your perfect night of sex with me, minute by minute.",
    "What's something you've watched that you want us to recreate?",
    "Where would you want me to finish?",
  ]),
  ...cards(5, "dare", [
    "Lose all your clothes. The game continues naked.",
    "Act out the next sex position I name, fully clothed or not.",
    "Use only your tongue to get me from neutral to breathless.",
    "Dirty-talk me for two minutes straight. Don't you dare stop.",
    "Let me do one thing to you that you've never let anyone do. You can still say no.",
    "Edge me for three minutes. If I finish, you win.",
  ]),
  ...cards(5, "nhie", [
    "Never have I ever wanted to be dominated by you.",
    "Never have I ever wanted to try anal with you.",
    "Never have I ever touched myself thinking about tonight.",
    "Never have I ever wanted to have sex in front of a mirror with you.",
  ]),
];

/** Couples quiz: both answer in secret, match = point. */
export const COUPLES_QUIZ: CoupleQ[] = [
  { q: "Who said 'I love you' first?", options: ["{a}", "{b}"] },
  { q: "Who's the better cook?", options: ["{a}", "{b}"] },
  { q: "Who takes longer to get ready?", options: ["{a}", "{b}"] },
  { q: "Who apologizes first after a fight?", options: ["{a}", "{b}"] },
  { q: "Who's the bigger flirt?", options: ["{a}", "{b}"] },
  { q: "Who fell asleep first on our first sleepover?", options: ["{a}", "{b}"] },
  { q: "Who's more likely to cry at a movie?", options: ["{a}", "{b}"] },
  { q: "Who's the better driver?", options: ["{a}", "{b}"] },
  { q: "Who spends more money?", options: ["{a}", "{b}"] },
  { q: "Who's the better kisser?", options: ["{a}", "{b}"] },
  { q: "Perfect date: night in or night out?", options: ["Night in", "Night out"] },
  { q: "Beach holiday or city break?", options: ["Beach", "City"] },
  { q: "Morning cuddles or late-night talks?", options: ["Morning cuddles", "Late-night talks"] },
  { q: "Dogs or cats?", options: ["Dogs", "Cats"] },
  { q: "Pizza or tacos for date night?", options: ["Pizza", "Tacos"] },
  { q: "Who made the first move?", options: ["{a}", "{b}"] },
  { q: "Who hogs the blanket?", options: ["{a}", "{b}"] },
  { q: "Who's more romantic?", options: ["{a}", "{b}"] },
  { q: "Who's more likely to plan a surprise?", options: ["{a}", "{b}"] },
  { q: "Who's the bigger kid?", options: ["{a}", "{b}"] },
  { q: "Who's more jealous?", options: ["{a}", "{b}"] },
  { q: "Who wants kids more?", options: ["{a}", "{b}"] },
  { q: "Who's funnier?", options: ["{a}", "{b}"] },
  { q: "Who would survive longer in a zombie apocalypse?", options: ["{a}", "{b}"] },
];

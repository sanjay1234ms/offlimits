import type { SpicyCard } from "@/components/party/SpicyDeck";
import type { QuizTemplate } from "@/components/party/KnowQuiz";
import type { HuntItem } from "@/components/party/Checklist";

type L = SpicyCard["level"];
type M = SpicyCard["mode"];

function cards(prefix: string, level: L, mode: M, texts: string[]): SpicyCard[] {
  return texts.map((text, i) => ({ id: `${prefix}${level}${mode}${i}`, level, mode, text }));
}

/** Bride Edition: five heat levels. 3-5 are 18+ and sit behind the age check. */
export const BACHELORETTE_DECK: SpicyCard[] = [
  /* ---------------- 1 · Cute ---------------- */
  ...cards("b", 1, "truth", [
    "What was your very first impression of your fiancé?",
    "What's the most romantic thing your partner has ever done for you?",
    "What did you text your best friend right after your first date?",
    "Which ex would be most shocked you're getting married?",
    "What's one thing about wedding planning you'd quietly delete?",
    "What's your partner's most annoying habit that you secretly love?",
    "When did you know they were the one?",
    "What's the worst date you went on before you met them?",
  ]),
  ...cards("b", 1, "dare", [
    "Do your best impression of the groom proposing.",
    "Show the group the first photo you ever took together.",
    "Give a 30-second speech toasting the maid of honor.",
    "Let the group pick your next drink.",
    "Teach everyone the first dance move you'll do at the wedding.",
    "Call your fiancé and tell them one thing you love about them, on speaker.",
    "Recreate your engagement photo pose with someone in the group.",
    "Wear the veil (or a napkin version of it) for the next three rounds.",
  ]),
  ...cards("b", 1, "nhie", [
    "Never have I ever cried at a wedding I wasn't in.",
    "Never have I ever caught a bouquet.",
    "Never have I ever stalked an ex's wedding photos.",
    "Never have I ever planned my wedding before I was even dating.",
    "Never have I ever said 'I love you' first.",
    "Never have I ever gone on a blind date.",
    "Never have I ever been a bridesmaid more than three times.",
    "Never have I ever lied about my age to get into a bar.",
  ]),
  ...cards("b", 1, "mlt", [
    "Who's most likely to cry first during the vows?",
    "Who's most likely to lose their phone tonight?",
    "Who's most likely to get married next?",
    "Who's most likely to start a dance-off with strangers?",
    "Who's most likely to fall asleep before midnight?",
    "Who's most likely to give the most emotional toast?",
  ]),

  /* ---------------- 2 · Flirty ---------------- */
  ...cards("b", 2, "truth", [
    "Where was your first kiss with your fiancé, and was it good?",
    "What's the cheesiest pickup line that has actually worked on you?",
    "Who was your hall-pass celebrity before you got engaged? Still is?",
    "What's the most embarrassing thing you've done to get someone's attention?",
    "What's your partner's sexiest feature that nobody else notices?",
    "Have you ever had a crush on one of your partner's friends?",
    "What's the boldest thing you've ever done on a first date?",
    "What's the flirtiest text you've sent this month?",
  ]),
  ...cards("b", 2, "dare", [
    "Send your fiancé a text that says only 'tonight 😏' and show the group the reply.",
    "Give the person on your left your best seductive wink and hold it for five seconds.",
    "Do your sexiest walk across the room to a song the group picks.",
    "Describe your fiancé's kissing style using only food words.",
    "Let the group write a flirty Instagram caption for your next post.",
    "Serenade the bride with a love song, full eye contact.",
    "Read out the last flirty message in your phone in a dramatic voice.",
    "Demonstrate your signature move on the dance floor, slow-motion.",
  ]),
  ...cards("b", 2, "nhie", [
    "Never have I ever kissed someone on the first date.",
    "Never have I ever sent a risky text to the wrong person.",
    "Never have I ever flirted my way out of a ticket or a cover charge.",
    "Never have I ever had a crush on a coworker.",
    "Never have I ever made out in a car.",
    "Never have I ever slid into someone's DMs.",
    "Never have I ever kissed two different people in one night.",
    "Never have I ever been caught checking someone out.",
  ]),
  ...cards("b", 2, "mlt", [
    "Who's most likely to get a stranger's number tonight (for the bride, obviously)?",
    "Who's most likely to send a risky text and regret it?",
    "Who's most likely to flirt with the bartender for free drinks?",
    "Who's most likely to have a secret dating app account?",
    "Who's most likely to make out at the wedding?",
    "Who's most likely to marry someone they met on vacation?",
  ]),

  /* ---------------- 3 · Spicy (18+) ---------------- */
  ...cards("b", 3, "truth", [
    "Where's the riskiest place you and your fiancé have had sex?",
    "What's the sexiest thing your partner has ever said to you in bed?",
    "Rate your sex life right now out of ten, and explain the missing points.",
    "What's one thing you want to try in bed but haven't asked for yet?",
    "What's the longest you two have gone without sex, and who cracked first?",
    "What's the best hookup you had before you met your partner?",
    "Morning sex or late-night sex, and why?",
    "What's the most embarrassing thing that's ever happened to you mid-sex?",
  ]),
  ...cards("b", 3, "dare", [
    "Show the group how you'd seduce your fiancé tonight, using a pillow.",
    "Text your fiancé the last sexy thing you thought about them.",
    "Describe your fiancé's best move in bed in exactly five words.",
    "Give the bride a lap dance to the next song (she can veto).",
    "Let the group choose a lingerie item you have to buy before the wedding night.",
    "Do your best orgasm noise. The group rates it out of ten.",
    "Eat a banana as seductively as you can while everyone watches.",
    "Whisper your dirtiest pet name for your partner to the person on your right.",
  ]),
  ...cards("b", 3, "nhie", [
    "Never have I ever had sex in a public place.",
    "Never have I ever sent a nude.",
    "Never have I ever faked it.",
    "Never have I ever had a one-night stand.",
    "Never have I ever been walked in on.",
    "Never have I ever had sex on a first date.",
    "Never have I ever used a sex toy with a partner.",
    "Never have I ever had sex in my parents' house.",
  ]),
  ...cards("b", 3, "mlt", [
    "Who's most likely to have the wildest wedding night?",
    "Who's most likely to own a drawer of sex toys?",
    "Who's most likely to have joined the mile-high club?",
    "Who's most likely to have a secret spicy playlist?",
    "Who's most likely to get caught having sex at a party?",
    "Who's most likely to have the highest body count in the room?",
  ]),

  /* ---------------- 4 · Filthy (18+) ---------------- */
  ...cards("b", 4, "truth", [
    "What's your favorite position, and demonstrate it with your hands.",
    "What's the kinkiest thing you've ever done in bed?",
    "Spit or swallow? Explain your reasoning to the group.",
    "What's the dirtiest thing you've ever said during sex?",
    "Have you ever had a threesome, or seriously wanted one? With who?",
    "What's the best oral you've ever received, and what made it so good?",
    "What's your biggest sexual fantasy that your partner doesn't know about yet?",
    "How many times in one night is your personal record?",
  ]),
  ...cards("b", 4, "dare", [
    "Demonstrate your best blowjob technique on a banana or popsicle. The group scores it.",
    "Describe your fiancé's naked body to the group in vivid detail. No skipping.",
    "Send your fiancé the dirtiest text you can think of. Read their reply out loud.",
    "Act out your favorite position with a pillow. Narrate it.",
    "Take a body shot off the bride (she picks where).",
    "Moan the bride's name like you mean it.",
    "Show the group the most explicit photo you're willing to show from your camera roll.",
    "Dirty-talk to a lollipop for 30 seconds without laughing.",
  ]),
  ...cards("b", 4, "nhie", [
    "Never have I ever had sex more than four times in one day.",
    "Never have I ever been tied up.",
    "Never have I ever had sex while someone else was in the room.",
    "Never have I ever recorded myself during sex.",
    "Never have I ever had a friends-with-benefits situation.",
    "Never have I ever had anal sex.",
    "Never have I ever had sex in a swimming pool or hot tub.",
    "Never have I ever hooked up with someone at a wedding.",
  ]),
  ...cards("b", 4, "mlt", [
    "Who's most likely to have had a threesome?",
    "Who's most likely to be the loudest in bed?",
    "Who's most likely to have a sex dungeon in their future?",
    "Who's most likely to have had sex in the office?",
    "Who's most likely to bring handcuffs on the honeymoon?",
    "Who's most likely to have a secret OnlyFans?",
  ]),

  /* ---------------- 5 · Nasty (18+) ---------------- */
  ...cards("b", 5, "truth", [
    "What's the nastiest thing you've ever let someone do to you, and would you do it again?",
    "Describe your best orgasm ever: where, how, who, how long.",
    "What's a kink you've never admitted out loud until right now?",
    "Have you ever hooked up with someone in this room's ex? Spill.",
    "What's the dirtiest sext you've ever sent? Recite it from memory.",
    "Rank everyone you've slept with from worst to best, by first initial.",
    "What's the most people you've hooked up with in one weekend?",
    "What's the filthiest thing on your wedding-night to-do list?",
  ]),
  ...cards("b", 5, "dare", [
    "Do a full 60-second fake orgasm, out loud, at full volume.",
    "Give the bride a full lap dance to a song the group picks. Commit.",
    "Let the group go through your camera roll for 30 seconds, no deleting first.",
    "Text your fiancé exactly what you're going to do to them on the wedding night. Graphic detail.",
    "Demonstrate your best riding technique on the arm of the couch.",
    "Lick whipped cream off a body part of someone in the group who volunteers.",
    "Read your most explicit DM conversation out loud, dramatic voices included.",
    "Swap underwear with someone in the group for the rest of the night (if they agree).",
  ]),
  ...cards("b", 5, "nhie", [
    "Never have I ever had sex in a public bathroom.",
    "Never have I ever hooked up with two people from the same friend group.",
    "Never have I ever been on the receiving end of a spanking and liked it.",
    "Never have I ever had sex with someone whose name I didn't know.",
    "Never have I ever used food in bed.",
    "Never have I ever been to a sex club or swingers party.",
    "Never have I ever had sex in a car while it was parked somewhere public.",
    "Never have I ever had an orgasm in public without anyone noticing.",
  ]),
  ...cards("b", 5, "mlt", [
    "Who's most likely to have had sex in a church?",
    "Who's most likely to have the biggest secret toy collection?",
    "Who's most likely to have done it somewhere they could've been arrested?",
    "Who's most likely to have slept with someone famous?",
    "Who's most likely to try a sex swing on the honeymoon?",
    "Who's most likely to have the nastiest search history in this room?",
  ]),
];

/** "How well do you know the bride?" starter questions. {name} = the bride. */
export const BRIDE_QUIZ: QuizTemplate[] = [
  { q: "Where did {name} meet their partner?", options: ["Dating app", "Through friends", "At work", "At a bar"] },
  { q: "Who said 'I love you' first?", options: ["{name}", "Their partner", "Both at once", "Still waiting"] },
  { q: "What's {name}'s go-to drink order?", options: ["Margarita", "Espresso martini", "Vodka soda", "Glass of wine"] },
  { q: "What's {name}'s biggest pet peeve?", options: ["Loud chewing", "Being late", "Bad texting", "Messy kitchens"] },
  { q: "What's {name}'s dream honeymoon?", options: ["Beach resort", "Europe tour", "Safari", "Japan"] },
  { q: "How long did they date before getting engaged?", options: ["Under a year", "1-2 years", "3-5 years", "5+ years"] },
  { q: "What would {name} grab first in a fire?", options: ["Phone", "Dog/cat", "Photos", "Wedding dress"] },
  { q: "What's {name}'s guilty-pleasure TV show?", options: ["Love Island", "The Bachelor", "Real Housewives", "Gossip Girl"] },
  { q: "Who's the better cook in the relationship?", options: ["{name}", "Their partner", "Neither, takeout", "It's a tie"] },
  { q: "What's {name}'s karaoke song?", options: ["Dancing Queen", "Since U Been Gone", "Before He Cheats", "Shallow"] },
  { q: "What was {name}'s first impression of their partner?", options: ["Instant crush", "Total friend zone", "Annoying", "Didn't notice them"] },
  { q: "Where was the proposal?", options: ["At home", "On vacation", "At a restaurant", "Somewhere outdoors"] },
];

/** Secret-vote Most Likely To for the bachelorette group (clean to cheeky). */
export const BACHELORETTE_VOTE = [
  "cry during the speeches",
  "get lost on the way back from the bathroom",
  "flirt with the DJ",
  "start a fight with a bouncer",
  "lose a shoe tonight",
  "end up dancing on a table",
  "post an embarrassing story at 3am",
  "order food at 4am",
  "elope instead of having a wedding",
  "become the bride's favorite in-law's favorite",
  "get matching tattoos tonight",
  "forget the bride's name after one too many",
];

/** Bachelorette night-out scavenger hunt. */
export const BACHELORETTE_HUNT: HuntItem[] = [
  { text: "Get a stranger to give the bride their best marriage advice", points: 10 },
  { text: "Take a group photo with someone named after a celebrity", points: 15 },
  { text: "Get a free drink for the bride", points: 20 },
  { text: "Get the DJ or band to shout out the bride", points: 25 },
  { text: "Find someone who's been married over 20 years and ask their secret", points: 15 },
  { text: "Get a stranger to sign the bride's sash or veil", points: 10 },
  { text: "Take a photo with a bartender holding the bride's drink", points: 10 },
  { text: "Do a group dance on the dance floor to a song you request", points: 15 },
  { text: "Collect five business cards for 'future wedding vendors'", points: 20 },
  { text: "Get someone to teach the bride a dance move", points: 15 },
  { text: "Find a man wearing a hat and borrow it for a photo", points: 10 },
  { text: "Get the whole bar to toast the bride", points: 30 },
  { text: "Take a photo recreating the proposal with a stranger (they agree)", points: 20 },
  { text: "Find someone with the same first name as the groom", points: 25 },
];

/** Search landing pages for seasonal and occasion queries, rendered by
 * components/LandingPage.tsx. Game picks reference catalog slugs. */

export interface LandingPick {
  /** Catalog slug (data/catalog.ts). */
  slug: string;
  why: string;
}

export interface LandingPage {
  path: string;
  title: string;
  description: string;
  h1: string;
  intro: string[];
  picksHeading: string;
  picks: LandingPick[];
  /** Ready-to-read prompts so the page is useful even before anyone taps play. */
  promptsHeading: string;
  prompts: string[];
  tipsHeading: string;
  tips: string[];
  faq: { q: string; a: string }[];
  /** Optional curated deck at /occasions/[slug]. */
  occasionHref?: string;
  /** Small print shown under the intro (e.g. drink responsibly). */
  note?: string;
}

export const LANDING_PAGES: Record<string, LandingPage> = {
  "christmas-party-games": {
    path: "/christmas-party-games",
    title: "Christmas Party Games: Free Games for Family, Friends & Office",
    description:
      "Free Christmas party games you can play on one phone: Christmas Would You Rather, holiday charades, trivia and more. No app, no signup, ready in seconds.",
    h1: "Christmas Party Games",
    intro: [
      "Free Christmas party games that run in the browser. Nobody has to print cards, download an app or make an account. Open a game on any phone, pass it around, and you are playing before the mince pies are out.",
      "They work for a family Christmas, a night in with friends, or the office party, and every game starts clean so you can play in front of the whole family.",
    ],
    picksHeading: "Best games for a Christmas party",
    picks: [
      { slug: "would_you_rather", why: "The easiest opener. Everyone has an opinion and nobody needs rules explained." },
      { slug: "charades", why: "A classic for the living room, with a built-in 60-second timer and scores." },
      { slug: "trivia", why: "Split into teams for a Christmas quiz. Answers reveal with a tap." },
      { slug: "most_likely_to", why: "Big laughs with family. Count to three and point." },
      { slug: "odd-one-out", why: "One imposter, one secret word. Works for 3 to 30 people." },
      { slug: "buzzkill", why: "A taboo-style team game that gets loud fast." },
    ],
    promptsHeading: "Christmas Would You Rather questions",
    prompts: [
      "Would you rather open all your presents on Christmas Eve or wait until Boxing Day?",
      "Would you rather eat Christmas dinner every day for a month or never eat it again?",
      "Would you rather wear an ugly Christmas jumper every day in December or never wear one again?",
      "Would you rather build a snowman or have a snowball fight?",
      "Would you rather be Santa for a day or one of his elves for a year?",
      "Would you rather only listen to Christmas music all year or never hear it again?",
      "Would you rather get one big present or ten small ones?",
      "Would you rather do all the cooking or all the washing up on Christmas Day?",
      "Would you rather have a white Christmas or a Christmas on the beach?",
      "Would you rather wrap every present or untangle every string of lights?",
    ],
    tipsHeading: "How to run Christmas party games",
    tips: [
      "Start with a quick game like Would You Rather while people arrive, then move to team games like charades or trivia once everyone is settled.",
      "For big family groups, use Odd One Out or Most Likely To. They work with any number of players and nobody sits out.",
      "Put the phone on the coffee table or cast it to the TV so everyone can see the question.",
      "Keep rounds short. Ten questions or a two-team trivia round is plenty before switching games.",
    ],
    faq: [
      { q: "Are these Christmas games free?", a: "Yes. Every game is free to play in the browser with no signup and no download." },
      { q: "Are the games family friendly?", a: "Yes. Every game starts in a clean, family-safe mode. Adult content only appears if someone turns it on and confirms they are 18 or over." },
      { q: "How many people can play?", a: "Most games work for 3 to 30 players on one phone. You can also open a party room so everyone plays on their own phone." },
      { q: "Do these work for an office Christmas party?", a: "Yes. Use the Office filter in Would You Rather and Most Likely To, or try trivia in teams. See our office party games page for more ideas." },
    ],
    occasionHref: "/occasions/holidays",
  },
  "office-party-games": {
    path: "/office-party-games",
    title: "Office Party Games: Free Team Games & Icebreakers for Work",
    description:
      "Free office party games and work icebreakers that run on one phone or a shared screen. Work-safe questions, team trivia, charades and more. No signup.",
    h1: "Office Party Games",
    intro: [
      "Free office party games and team icebreakers that are safe for work. Everything runs in the browser on one phone or a shared screen, so there is nothing to install on a work laptop and no accounts to set up.",
      "Use them for the holiday party, a team offsite, a Friday social, or the first five minutes of a meeting.",
    ],
    picksHeading: "Best games for the office",
    picks: [
      { slug: "this_or_that", why: "A fast, low-pressure icebreaker. Two options, first instinct." },
      { slug: "would_you_rather", why: "Turn on the Office filter for work-safe questions that still get people talking." },
      { slug: "trivia", why: "Team quiz with live scorekeeping. Great for a holiday party." },
      { slug: "odd-one-out", why: "One imposter, one secret word. Works for big teams." },
      { slug: "charades", why: "Office-themed charades prompts with a timer." },
      { slug: "fast-5", why: "Name five things before the buzzer. Quick and competitive." },
    ],
    promptsHeading: "Work-safe icebreaker questions",
    prompts: [
      "Would you rather have a four-day week or work from anywhere in the world?",
      "Would you rather never attend another meeting or never answer another email?",
      "Coffee or tea?",
      "Early bird or night owl?",
      "Would you rather present to the whole company or do all the note-taking for a month?",
      "What was your first ever job?",
      "Would you rather have a desk by the window or a desk by the snacks?",
      "Who here is most likely to reply-all by accident?",
      "Would you rather have an extra hour of lunch or leave an hour early?",
      "What is the most useful thing you learned in your first year at work?",
    ],
    tipsHeading: "How to run games at work",
    tips: [
      "Keep it opt-in and low pressure. This or That and Would You Rather let quieter people join without being put on the spot.",
      "Use the Office category filter so every question stays work-appropriate.",
      "For remote or hybrid teams, share your screen on Zoom or Teams and read the questions out.",
      "Split big teams into groups for trivia and charades, and let the scoreboard track the winner.",
    ],
    faq: [
      { q: "Are these games appropriate for work?", a: "Yes. Every game starts clean, and the Office filter limits questions to work-safe topics. Adult modes are off unless someone turns them on." },
      { q: "Can remote teams play?", a: "Yes. Share your screen in Zoom, Teams or Meet and read the questions out, or open a party room so everyone joins on their own phone." },
      { q: "How long does a game take?", a: "Most rounds take 5 to 20 minutes, so they fit at the start of a meeting or as a break during an event." },
      { q: "Do people need to sign up?", a: "No. There is no signup, no download and no cost." },
    ],
    occasionHref: "/occasions/office-party",
  },
  "halloween-party-games": {
    path: "/halloween-party-games",
    title: "Halloween Party Games: Free Spooky Games for Groups",
    description:
      "Free Halloween party games for kids, teens and adults: spooky Would You Rather, Halloween charades, imposter games and more. Play on one phone, no signup.",
    h1: "Halloween Party Games",
    intro: [
      "Free Halloween party games that run on any phone. Use the questions and charades ideas below as they are, or open one of the games and pass the phone around the room.",
      "Everything starts clean, so it works for a kids' party, a classroom or a costume party with friends.",
    ],
    picksHeading: "Best games for a Halloween party",
    picks: [
      { slug: "odd-one-out", why: "A spooky whodunit. Everyone gets the secret word except the imposter." },
      { slug: "charades", why: "Use the Halloween ideas below with the built-in timer." },
      { slug: "would_you_rather", why: "Start with the spooky questions below, then keep going in the app." },
      { slug: "truth_or_dare", why: "Pick the clean packs for teens and the party packs for adults." },
      { slug: "fake-news-factory", why: "Make up a ghost story that sounds true, then spot the fakes." },
      { slug: "trivia", why: "Run a quick quiz between costume judging and snacks." },
    ],
    promptsHeading: "Halloween Would You Rather and charades ideas",
    prompts: [
      "Would you rather spend a night in a haunted house or a night in a graveyard?",
      "Would you rather be a vampire or a werewolf?",
      "Would you rather only get raisins when trick-or-treating or only get toothbrushes?",
      "Would you rather meet a friendly ghost or a grumpy zombie?",
      "Would you rather carve pumpkins or bob for apples?",
      "Charades: a zombie trying to use a smartphone",
      "Charades: a witch whose broom won't start",
      "Charades: a vampire at the dentist",
      "Charades: trick-or-treating at a house that gives out vegetables",
      "Charades: a mummy unravelling at the worst moment",
    ],
    tipsHeading: "How to run Halloween party games",
    tips: [
      "Open with spooky Would You Rather while people show off their costumes.",
      "Turn the lights down for Odd One Out. It plays like a murder mystery.",
      "For kids, stick to charades and Would You Rather. For adults, Truth or Dare and Most Likely To get louder as the night goes on.",
      "Keep a prize for the best costume and another for the trivia winner.",
    ],
    faq: [
      { q: "Are these Halloween games free?", a: "Yes. Every game is free, with no signup and no download." },
      { q: "Are they OK for kids?", a: "Yes. All games start in a clean mode. Adult content stays off unless an adult turns it on and confirms their age." },
      { q: "How many players do we need?", a: "Most games work for 3 to 30 people on one phone, and you can open a party room so everyone plays on their own phone." },
    ],
    occasionHref: "/occasions/game-night",
  },
  "drinking-games": {
    path: "/drinking-games",
    title: "Drinking Games: Free Online Drinking Games for Groups",
    description:
      "Free online drinking games you can play on one phone: Never Have I Ever, Most Likely To, Truth or Dare and more, with sip rules and a forfeit wheel. 18+ only.",
    h1: "Drinking Games",
    intro: [
      "Free drinking games that run on one phone, with house rules built in. Pick a game, agree on the sip rules below, and pass the phone around.",
      "Every game works just as well with soft drinks. Swap sips for forfeits from the spin wheel if anyone isn't drinking.",
    ],
    note: "For adults of legal drinking age only. Please drink responsibly, and never pressure anyone to drink.",
    picksHeading: "Best games to play as drinking games",
    picks: [
      { slug: "never_have_i_ever", why: "The classic. If you have done it, take a sip." },
      { slug: "most_likely_to", why: "Everyone points. Whoever gets the most fingers drinks." },
      { slug: "truth_or_dare", why: "Refuse a truth or dare and you drink instead." },
      { slug: "would_you_rather", why: "The minority side drinks after every question." },
      { slug: "buzzkill", why: "Say a forbidden word and your team drinks." },
      { slug: "fast-5", why: "Miss the five before the buzzer, take a sip." },
      { slug: "pirate-barrel", why: "Launch the pirate and you drink. Rounds take a minute." },
    ],
    promptsHeading: "Simple sip rules",
    prompts: [
      "Never Have I Ever: drink if you have done it.",
      "Most Likely To: the person with the most fingers pointed at them drinks.",
      "Would You Rather: everyone on the smaller side drinks.",
      "Truth or Dare: refuse and drink twice.",
      "This or That: anyone who hesitates drinks.",
      "Buzzkill: say a forbidden word and your team drinks.",
      "Fast 5: fail to name five in time and drink.",
      "Trivia: the losing team drinks at the end of each round.",
    ],
    tipsHeading: "Playing responsibly",
    tips: [
      "Sips, not shots. Keep the rules light so the game lasts the night.",
      "Make water and soft drinks the default option for anyone who wants them, and use the forfeit wheel instead of sips.",
      "Adult question packs are behind an 18+ age check and stay off unless the group turns them on.",
      "Never drink and drive. Sort out a lift home before the first round.",
    ],
    faq: [
      { q: "Are these drinking games free?", a: "Yes. Every game is free in the browser, with no signup and no download. An optional Party Pass unlocks extra 18+ packs." },
      { q: "Can we play without drinking?", a: "Yes. Every game works without alcohol. Use the forfeit wheel or keep score instead." },
      { q: "What's the best drinking game for a big group?", a: "Most Likely To and Never Have I Ever work best for big groups because everyone plays every round." },
    ],
  },

  "classroom-games": {
    path: "/classroom-games",
    title: "Classroom Games: Free Games for Students on One Screen",
    description:
      "Free classroom games for students: trivia, charades, This or That, Would You Rather and more. Run them from one screen or projector. No signup, no student accounts.",
    h1: "Classroom Games",
    intro: [
      "Free classroom games you can run from the teacher's laptop, a projector or one phone. Students don't need accounts or devices, and there is nothing to install.",
      "Use them as a warm-up, a brain break, an end-of-term treat or a first-day icebreaker. Every game starts in a clean mode that's safe for school.",
    ],
    picksHeading: "Best games for the classroom",
    picks: [
      { slug: "trivia", why: "Split the class into teams and keep score on screen." },
      { slug: "this_or_that", why: "A fast warm-up. Students move to one side of the room or the other." },
      { slug: "charades", why: "Gets everyone moving, with a built-in timer." },
      { slug: "fast-5", why: "Name five things in a category before the buzzer. Great for vocab." },
      { slug: "would_you_rather", why: "Turns into a quick persuasive-speaking exercise." },
      { slug: "odd-one-out", why: "Builds listening and reasoning skills in groups." },
    ],
    promptsHeading: "Classroom This or That and Would You Rather questions",
    prompts: [
      "Cats or dogs?",
      "Reading or writing?",
      "Maths or art?",
      "Summer holidays or winter holidays?",
      "Would you rather have no homework for a year or an extra week of holidays?",
      "Would you rather be able to read minds or see the future?",
      "Would you rather visit the past or the future?",
      "Would you rather be the teacher for a day or the principal for a day?",
      "Would you rather explore space or the deep ocean?",
      "Would you rather know every language or be able to talk to animals?",
    ],
    tipsHeading: "How to run games in class",
    tips: [
      "Put the game on the projector so the whole class can read along.",
      "For This or That, have students move to the left or right side of the room to answer.",
      "Use teams of four to six for trivia and charades so everyone gets a turn.",
      "Keep each round to five or ten minutes as a brain break between lessons.",
    ],
    faq: [
      { q: "Are these classroom games free?", a: "Yes. Every game is free with no signup, and students don't need accounts or their own devices." },
      { q: "Are they safe for school?", a: "Yes. Every game starts in a clean mode. Adult content is hidden behind an 18+ age check and never turns on by itself." },
      { q: "Can I use them on a projector or smartboard?", a: "Yes. Open any game in the browser and it scales to a big screen." },
    ],
  },
  "party-games-for-large-groups": {
    path: "/party-games-for-large-groups",
    title: "Party Games for Large Groups: Free Games for 10 to 30+ People",
    description:
      "Free party games for large groups of 10, 20 or 30+ people. Everyone plays every round, on one phone or their own. No signup, no download.",
    h1: "Party Games for Large Groups",
    intro: [
      "Free party games that work for big groups, where everyone plays every round and nobody waits around for a turn.",
      "Run them from one phone, or open a party room so everyone joins on their own phone with a code.",
    ],
    picksHeading: "Best games for big groups",
    picks: [
      { slug: "most_likely_to", why: "Everyone points at once, so 30 people play as easily as 3." },
      { slug: "odd-one-out", why: "Works for up to 30 players. Add a second imposter past ten." },
      { slug: "never_have_i_ever", why: "Everyone plays every question at the same time." },
      { slug: "trivia", why: "Split into teams of five and keep score." },
      { slug: "charades", why: "Two big teams, one timer, lots of shouting." },
      { slug: "this_or_that", why: "Everyone answers by moving to one side of the room." },
    ],
    promptsHeading: "Most Likely To questions for big groups",
    prompts: [
      "Who's most likely to become famous?",
      "Who's most likely to get lost on the way here?",
      "Who's most likely to survive a zombie apocalypse?",
      "Who's most likely to cry at a film?",
      "Who's most likely to forget their own birthday?",
      "Who's most likely to start a dance-off right now?",
      "Who's most likely to win a reality show?",
      "Who's most likely to adopt ten cats?",
      "Who's most likely to talk their way out of a parking ticket?",
      "Who's most likely to still be here at 3am?",
    ],
    tipsHeading: "Running games for 10+ people",
    tips: [
      "Pick games where everyone answers at once, like Most Likely To and Never Have I Ever, so nobody waits.",
      "For team games, split into teams of four to six and rename the scoreboard pills to team names.",
      "Open a party room and put the code on the TV so people can join on their own phones.",
      "Use the name picker or team generator to split the group fairly.",
    ],
    faq: [
      { q: "What's the best party game for a big group?", a: "Most Likely To and Odd One Out work best, because everyone plays every round." },
      { q: "How many people can play?", a: "Most games work for up to 30 people on one phone, and party rooms let everyone join on their own phone." },
      { q: "Do people need to download anything?", a: "No. Everything runs in the browser. No app, no signup." },
    ],
  },
  "virtual-party-games": {
    path: "/virtual-party-games",
    title: "Virtual Party Games for Zoom & Teams: Free Online Games",
    description:
      "Free virtual party games for Zoom, Teams and Google Meet. Share your screen or open a party room so everyone plays on their own phone. No signup.",
    h1: "Virtual Party Games for Zoom and Teams",
    intro: [
      "Free games for video calls. Share your screen on Zoom, Teams or Google Meet and read the questions out, or open a party room so everyone answers on their own phone.",
      "They work for remote team socials, long-distance friends and family calls.",
    ],
    picksHeading: "Best games for video calls",
    picks: [
      { slug: "would_you_rather", why: "Everyone votes in the chat. The minority defends their choice." },
      { slug: "trivia", why: "Teams in breakout rooms, scores on the shared screen." },
      { slug: "this_or_that", why: "Answer by typing 1 or 2 in the chat. Fast and easy." },
      { slug: "never_have_i_ever", why: "Hold fingers up to the camera." },
      { slug: "fake-news-factory", why: "Everyone writes a fake story in the chat, then votes." },
      { slug: "how-well-do-you-know-me", why: "Great for pairs in breakout rooms." },
    ],
    promptsHeading: "Video call icebreaker questions",
    prompts: [
      "Would you rather have your camera on all day or never be able to unmute?",
      "Would you rather work from a beach or work from a cabin in the mountains?",
      "Never have I ever been on a call while still in my pyjamas.",
      "Never have I ever pretended my connection was bad to leave a call.",
      "Coffee or tea?",
      "Morning meetings or afternoon meetings?",
      "Would you rather have a perfect virtual background or perfect lighting forever?",
      "What's the strangest thing within arm's reach of you right now?",
    ],
    tipsHeading: "How to run games on a video call",
    tips: [
      "Share your screen with the game open, so everyone sees the same question.",
      "Ask people to answer in the chat at the same time, so nobody copies.",
      "For bigger calls, open a party room and paste the join code in the chat.",
      "Keep it to 15 to 20 minutes. Video-call energy drops faster than in person.",
    ],
    faq: [
      { q: "Do these work on Zoom, Teams and Google Meet?", a: "Yes. Share your browser tab, or open a party room so everyone plays on their own phone." },
      { q: "Is it free?", a: "Yes. No signup, no download and no cost." },
      { q: "Are they work-appropriate?", a: "Yes. Use the Office filter for work-safe questions. Adult modes stay off unless someone turns them on." },
    ],
  },
  "sleepover-games": {
    path: "/sleepover-games",
    title: "Sleepover Games: Free Truth or Dare, Would You Rather & More",
    description:
      "Free sleepover games for teens and tweens: clean Truth or Dare, Would You Rather, Never Have I Ever, charades and more. Play on one phone, no signup.",
    h1: "Sleepover Games",
    intro: [
      "Free sleepover games you can play on one phone, from clean Truth or Dare to charades and Would You Rather.",
      "Every game starts in a clean mode, so they are fine for tweens and teens.",
    ],
    picksHeading: "Best sleepover games",
    picks: [
      { slug: "truth_or_dare", why: "The sleepover classic, with clean packs for younger groups." },
      { slug: "would_you_rather", why: "Easy to start, impossible to stop." },
      { slug: "never_have_i_ever", why: "Find out who has done what." },
      { slug: "charades", why: "Gets everyone off the sofa." },
      { slug: "how-well-do-you-know-me", why: "Test who really knows their best friend." },
      { slug: "most_likely_to", why: "Point at the friend most likely to fall asleep first." },
      { slug: "pirate-barrel", why: "Take turns throwing knives at the barrel. Whoever launches the pirate loses." },
    ],
    promptsHeading: "Clean Truth or Dare ideas for sleepovers",
    prompts: [
      "Truth: What's the most embarrassing thing that happened to you at school?",
      "Truth: Who here would you call first if you were in trouble?",
      "Truth: What's your weirdest habit?",
      "Truth: What's the last thing you searched for online?",
      "Dare: Talk in an accent until your next turn.",
      "Dare: Do your best impression of someone in the room.",
      "Dare: Let the group give you a new hairstyle.",
      "Dare: Sing the chorus of the last song you listened to.",
      "Dare: Eat a spoonful of something from the kitchen, chosen by the group.",
      "Dare: Text a family member a random emoji and show the reply.",
    ],
    tipsHeading: "Sleepover game tips",
    tips: [
      "Agree on a skip rule before you start: one free pass each per round.",
      "Start with Would You Rather, then move to Truth or Dare once everyone's comfortable.",
      "Keep charades for when energy is high and Never Have I Ever for late at night.",
    ],
    faq: [
      { q: "Are these sleepover games clean?", a: "Yes. Every game starts in a clean mode. Adult content is behind an 18+ age check." },
      { q: "Do we need a phone each?", a: "No. One phone passed around is enough." },
    ],
    occasionHref: "/occasions/game-night",
  },
  "couples-games": {
    path: "/couples-games",
    title: "Couples Games: Free Date Night Games to Play Together",
    description:
      "Free couples games for date night: Would You Rather, How Well Do You Know Me, Truth or Dare and This or That for couples. Play on one phone, no signup.",
    h1: "Couples Games for Date Night",
    intro: [
      "Free games for couples to play on one phone, for date night in, a long drive or a slow Sunday.",
      "Pick the Couples filter in any game for questions written for two people, from cute to seriously honest.",
    ],
    picksHeading: "Best games for couples",
    picks: [
      { slug: "how-well-do-you-know-me", why: "Both answer, then compare. Built for two." },
      { slug: "would_you_rather", why: "Turn on the Couples filter for date-night questions." },
      { slug: "this_or_that", why: "Count how many answers you match on." },
      { slug: "truth_or_dare", why: "Couples packs, from sweet to brave." },
      { slug: "never_have_i_ever", why: "Find out what you didn't know about each other." },
      { slug: "fast-5", why: "A quick competitive round when you want a winner." },
    ],
    promptsHeading: "Questions for couples",
    prompts: [
      "Would you rather have a fancy dinner out or a takeaway night in?",
      "Would you rather travel somewhere new together or go back to your favourite place?",
      "Beach holiday or city break?",
      "What was your first impression of me?",
      "What's one thing on your bucket list we haven't done yet?",
      "Never have I ever planned our future in my head without telling you.",
      "Who's more likely to forget an anniversary?",
      "Would you rather relive our first date or skip ahead five years?",
    ],
    tipsHeading: "Date night game tips",
    tips: [
      "Use the Couples filter so every question is written for two.",
      "Answer at the same time for This or That and count your matches.",
      "Take turns reading so neither of you knows what's coming.",
    ],
    faq: [
      { q: "What's the best game for couples?", a: "How Well Do You Know Me and Would You Rather with the Couples filter are the most popular." },
      { q: "Is it free?", a: "Yes. Every game is free. An optional Party Pass unlocks extra 18+ packs if you want them." },
    ],
    occasionHref: "/occasions/date-night",
  },
};

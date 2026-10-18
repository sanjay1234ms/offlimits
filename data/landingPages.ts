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
};

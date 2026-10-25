/** Search landing pages for seasonal and occasion queries, rendered by
 * components/LandingPage.tsx. Game picks reference catalog slugs. */

export interface LandingPick {
  /** Catalog slug (data/catalog.ts). */
  slug: string;
  why: string;
}

/** A classic (non-app) party game idea with quick instructions. */
export interface LandingIdea {
  name: string;
  how: string;
  players?: string;
  /** What you need, e.g. "Paper and pens". Omit for "Nothing". */
  needs?: string;
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
  /** Extra game ideas, grouped (adults, families, office...). */
  ideas?: { heading: string; intro?: string; items: LandingIdea[] }[];
  /** Hand-picked related pages, shown near the end. */
  related?: { href: string; label: string; emoji: string }[];
}

export const LANDING_PAGES: Record<string, LandingPage> = {
  "christmas-party-games": {
    path: "/christmas-party-games",
    title: "Christmas Party Games: 30+ Fun Games for Adults & Families",
    description:
      "30+ Christmas party games for adults, families, kids and the office: charades, trivia, White Elephant, Would You Rather and no-prep games. Free, play on one phone.",
    h1: "Christmas Party Games",
    intro: [
      "Free Christmas party games that run in the browser. Nobody has to print cards, download an app or make an account. Open a game on any phone, pass it around, and you are playing before the mince pies are out.",
      "There is something for every kind of Christmas get-together: Christmas Would You Rather to break the ice, holiday charades and a team Christmas quiz once everyone has eaten, and imposter games for big family groups. Every game starts clean, so you can play in front of grandparents and kids, and the 18+ packs stay locked unless the adults turn them on.",
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
    ideas: [
      {
        heading: "Christmas party games for adults",
        intro: "Grown-up games for the after-dinner crowd. Most need nothing but the people in the room.",
        items: [
          { name: "White Elephant gift swap", how: "Everyone brings a wrapped gift, draws a number, and on their turn opens a new gift or steals one. Our free game runner tracks every steal and freezes gifts automatically.", players: "6-40", needs: "One wrapped gift each" },
          { name: "Christmas Never Have I Ever", how: "Everyone holds up ten fingers. Read a holiday confession like \"never have I ever regifted a present\" and anyone guilty puts a finger down.", players: "4+" },
          { name: "Christmas movie quote off", how: "Two teams take turns quoting a Christmas movie line. The other team must name the film in five seconds or lose a point.", players: "6+" },
          { name: "Plastic wrap ball", how: "Wrap small prizes into a giant ball of cling film. Players unwrap as fast as they can while the next person rolls dice; a double passes the ball on.", players: "5-15", needs: "Cling film, small prizes, two dice" },
          { name: "Ugly sweater awards", how: "Everyone votes in secret for best, worst and most creative sweater. Announce the winners like an awards show with a speech.", players: "Any", needs: "Paper slips" },
          { name: "Holiday hot seat", how: "One person sits in the hot seat for 60 seconds while everyone fires festive questions: worst gift, best Christmas, most awkward family moment.", players: "4+" },
        ],
      },
      {
        heading: "Christmas games for families and kids",
        intro: "Easy games that work across three generations, from grandparents to toddlers.",
        items: [
          { name: "Christmas charades", how: "Act out a Christmas movie, song or character without speaking. Use our Christmas charades list and a one-minute timer per turn.", players: "4+", needs: "Our charades list" },
          { name: "Christmas trivia quiz", how: "Split the table into teams and run four rounds: movies, songs, traditions and food. Answers are on our Christmas trivia page.", players: "4-30" },
          { name: "Pin the nose on Rudolph", how: "Draw Rudolph on a big sheet, blindfold each player, spin them twice and let them try to stick on the red nose. Closest wins.", players: "3+", needs: "Paper, red sticker, blindfold" },
          { name: "Present hot potato", how: "Wrap a small gift in many layers. Pass it around while music plays; whoever holds it when the music stops unwraps one layer.", players: "5-20", needs: "Layered gift, music" },
          { name: "Christmas scavenger hunt", how: "Hide candy canes, baubles and tiny elves around the house with a clue on each. First team to find them all wins.", players: "3-20", needs: "Small hidden items" },
          { name: "Snowball toss", how: "Set up buckets at different distances and throw cotton-wool or paper snowballs. Further buckets score more points.", players: "2+", needs: "Buckets, cotton balls" },
          { name: "Christmas Would You Rather", how: "Read a festive dilemma, everyone points to a side, and the smaller side defends their choice. Our list has 45 ready to go.", players: "3+" },
          { name: "Name that carol", how: "Hum the first few notes of a carol. First person to name it scores a point and hums the next one.", players: "3+" },
        ],
      },
      {
        heading: "Office Christmas party games",
        intro: "Work-safe games that include everyone and finish before anyone gets bored.",
        items: [
          { name: "Secret Santa", how: "Draw names a few weeks before, set a budget, and exchange gifts at the party. Our free generator keeps every pairing secret, even from the organiser.", players: "4-100" },
          { name: "Christmas This or That", how: "Rapid-fire festive pairs like real tree or fake tree. Everyone answers on instinct; it takes five minutes and warms up any meeting.", players: "Any" },
          { name: "Gingerbread decorating contest", how: "Teams get a plain gingerbread house and 15 minutes. The office votes on the winner.", players: "Teams of 3-5", needs: "Gingerbread kits" },
          { name: "Holiday Pictionary", how: "Draw Christmas words on a whiteboard while your team guesses against a one-minute timer.", players: "6+", needs: "Whiteboard or paper" },
          { name: "Two truths and a holiday lie", how: "Share two true holiday facts about yourself and one invented one. Colleagues guess the lie.", players: "4-20" },
        ],
      },
      {
        heading: "No-prep and virtual Christmas games",
        intro: "Nothing to buy or print. Perfect for a last-minute party or a video call with family far away.",
        items: [
          { name: "Christmas emoji quiz", how: "Send emoji combos in the chat (🎅🏠🔑 = Home Alone… roughly). First correct guess scores.", players: "Any", needs: "Group chat" },
          { name: "Most Likely To, holiday edition", how: "Who's most likely to fall asleep after dinner or open presents early? Everyone points on three.", players: "4+" },
          { name: "Christmas story chain", how: "One person starts a Christmas story with one sentence; everyone adds a line in turn until it becomes ridiculous.", players: "3+" },
          { name: "Guess the gift", how: "Describe a gift using only three words. Everyone guesses what it is before it gets unwrapped.", players: "3+" },
          { name: "Rock Paper Scissors tournament", how: "Settle who carves, who washes up, or who opens the first present with a quick bracket on our 3D Rock Paper Scissors game.", players: "2-16" },
        ],
      },
    ],
    related: [
      { href: "/questions/christmas-trivia-questions", label: "Christmas trivia with answers", emoji: "🧠" },
      { href: "/questions/christmas-would-you-rather-questions", label: "Christmas Would You Rather", emoji: "🎅" },
      { href: "/questions/christmas-never-have-i-ever", label: "Christmas Never Have I Ever", emoji: "🙈" },
      { href: "/questions/christmas-this-or-that", label: "Christmas This or That", emoji: "⚡" },
      { href: "/questions/christmas-charades-ideas", label: "Christmas charades ideas", emoji: "🎭" },
      { href: "/secret-santa", label: "Secret Santa generator", emoji: "🎁" },
      { href: "/white-elephant", label: "White Elephant game", emoji: "🐘" },
      { href: "/new-years-eve-party-games", label: "New Year's Eve party games", emoji: "🎆" },
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
      "Would you rather sit at the kids' table every year or host Christmas dinner every year?",
      "Would you rather get coal in your stocking or socks under the tree?",
      "Would you rather sing carols door to door or perform in the school nativity again?",
      "Would you rather have Christmas in July or two Christmases in December?",
      "Would you rather be stuck in a lift with Santa or with the Grinch?",
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
      { q: "What are the best Christmas party games for adults?", a: "Most Likely To, Truth or Dare and Buzzkill get the loudest laughs with adults. For a grown-up crowd later in the evening, the optional 18+ packs add spicier questions once everyone has confirmed they are over 18." },
      { q: "What Christmas games can you play with no supplies?", a: "All of them. Would You Rather, charades, trivia and Odd One Out only need one phone. There is nothing to print, buy or set up." },
      { q: "What are good Christmas games for a large group?", a: "Odd One Out, Most Likely To and team trivia work best for big family gatherings because everyone plays every round. Split into two teams for charades if there are more than ten of you." },
      { q: "Can we play Christmas games over Zoom?", a: "Yes. Share your screen on Zoom, Teams or FaceTime and read the questions out, or open a party room so each family joins on their own phone." },
    ],
  },
  "office-party-games": {
    path: "/office-party-games",
    title: "Office Party Games: Free Icebreakers for Work",
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
  },
  "18-plus-party-games": {
    path: "/18-plus-party-games",
    title: "18+ Party Games: 25 Adult Games for Game Night (Free)",
    description:
      "25 18+ party games for adults: dirty truth or dare, spicy Never Have I Ever, Most Likely To after dark, couples games and drinking twists. Play free on one phone.",
    h1: "18+ Party Games for Adults",
    intro: [
      "Party games for grown-ups who already know each other a little too well. Spicy truth or dare, Never Have I Ever after dark, Most Likely To with no filter, and a handful of classic adult party games you can run with nothing but a phone.",
      "Every game starts clean. The 18+ packs only open after an age check, the first few spicy cards are free to try, and a 24-hour Party Pass unlocks every adult deck for the night. No account, no download, no app store rating to worry about.",
    ],
    note: "Adults only. Everyone playing should be 18 or older and up for the vibe. Anyone can skip any card, any time.",
    picksHeading: "Best 18+ games to play tonight",
    picks: [
      { slug: "18plus", why: "The uncensored deck: confessions, wild dares and late-night questions with zero filter." },
      { slug: "truth_or_dare", why: "Switch on the 18+ pack for flirty truths and bold dares. One skip each keeps it fun." },
      { slug: "never_have_i_ever", why: "The spicy pack turns a classic into a night of confessions. Fingers down, stories out." },
      { slug: "most_likely_to", why: "Who's most likely to… after dark. Point on three and make them explain." },
      { slug: "would_you_rather", why: "Impossible adult dilemmas that start real arguments about dating, exes and bad decisions." },
      { slug: "how-well-do-you-know-me", why: "For couples: answer for each other in secret, then compare. Brutally revealing." },
    ],
    ideas: [
      {
        heading: "Adult party games for groups",
        intro: "Classic grown-up party games. Most need nothing, a few need a deck of cards.",
        items: [
          { name: "Dirty truth or dare", how: "Flirty truths and bold dares for close friends. Start mild, escalate slowly, and respect every skip. Our list has a free preview to get you going.", players: "4-10" },
          { name: "Never Have I Ever, juicy edition", how: "Ten fingers up. Read a confession about dating, nights out or bad decisions; anyone guilty puts one down and owes the story.", players: "4+" },
          { name: "Paranoia", how: "Whisper a \"who here would…\" question to the next player, who answers out loud with a name. A coin flip decides whether the question is revealed.", players: "5+", needs: "A coin" },
          { name: "Hot seat after dark", how: "One person, 60 seconds, every question fair game: worst date, biggest red flag, most embarrassing text.", players: "4+" },
          { name: "Date, Marry, Avoid", how: "Name three celebrities (or fictional characters). The player has to pick one to date, one to marry and one to avoid, and justify it.", players: "3+" },
          { name: "Two truths and a lie, dating edition", how: "Two true dating stories and one invented. The group votes on the lie; fool them all for a point.", players: "4+" },
          { name: "Spin the bottle, grown-up edition", how: "Spin to pick who answers the next spicy question or takes the next dare. Kisses optional and only with a yes.", players: "5+", needs: "A bottle" },
          { name: "Charades after dark", how: "Act out cheeky movie titles and awkward situations, like a walk of shame or a first date going wrong.", players: "6+" },
          { name: "Most Likely To, no filter", how: "Who's most likely to text an ex tonight or get kicked out of a bar? Point on three; the most-pointed player explains.", players: "5+" },
          { name: "Confession box", how: "Everyone writes an anonymous confession on a slip. Read them out one by one and guess who wrote each.", players: "5+", needs: "Paper and a bowl" },
        ],
      },
      {
        heading: "Spicy games for couples",
        intro: "Two-player games for date night, from flirty to seriously honest.",
        items: [
          { name: "How Well Do You Know Me", how: "Both answer questions about each other in secret, then reveal. Score a point for every match.", players: "2" },
          { name: "Couples truth or dare", how: "Take turns choosing truth or dare from a couples list. One skip each per game.", players: "2" },
          { name: "21 questions, flirty edition", how: "One partner asks 21 questions in a row, the other answers honestly. Then swap.", players: "2" },
          { name: "Dirty Would You Rather", how: "Impossible spicy dilemmas for two. Explain your answer or forfeit the next turn.", players: "2+" },
          { name: "Truth or drink for two", how: "Ask a hard question. Answer it honestly or take a sip instead. Water counts.", players: "2", needs: "Drinks (any kind)" },
        ],
      },
      {
        heading: "Drinking game twists (legal drinking age only)",
        intro: "Optional. Every one of these works just as well with water, juice or a forfeit instead.",
        items: [
          { name: "Truth or drink", how: "Answer the question honestly or take a sip instead. The juicier the question, the bigger the sip.", players: "3+", needs: "Drinks" },
          { name: "Never Have I Ever, drinking version", how: "Instead of fingers down, anyone guilty takes a sip.", players: "4+", needs: "Drinks" },
          { name: "Pirate Barrel sips", how: "Take turns throwing knives into our 3D barrel. Whoever launches the pirate takes a sip.", players: "2-20", needs: "Drinks" },
          { name: "Most Likely To, cheers edition", how: "Everyone points on three. Each finger pointed at you is a sip.", players: "5+", needs: "Drinks" },
        ],
      },
    ],
    promptsHeading: "A taste of the 18+ questions",
    prompts: [
      "Who in this room would you most want to kiss?",
      "What's the boldest text you've ever sent?",
      "Would you rather date someone ten years older or five years younger?",
    ],
    tipsHeading: "How to run an 18+ game night",
    tips: [
      "Agree the vibe before the first card. Everyone should be 18+, know each other, and want to play.",
      "Start mild and escalate. The best adult game nights warm up slowly; nobody enjoys being blindsided on question one.",
      "One free skip per player, no questions asked. Respecting a skip keeps everyone playing all night.",
      "If you're drinking, keep water and a sober forfeit on offer, and never pressure anyone to drink.",
      "What's said at game night stays at game night. No screenshots of anyone's answers.",
    ],
    faq: [
      { q: "Are these 18+ party games free?", a: "Yes, to start. Every game is free in its clean mode, and you can try the first few 18+ cards free. A 24-hour Party Pass unlocks every adult deck for the night." },
      { q: "How does the age check work?", a: "Before any 18+ content appears, the phone asks you to confirm everyone playing is 18 or over. Clean modes never show adult content." },
      { q: "What are the best adult party games?", a: "Dirty truth or dare, juicy Never Have I Ever, Paranoia and Most Likely To are the most popular. For couples, How Well Do You Know Me and couples truth or dare." },
      { q: "Do I need to drink to play?", a: "No. Every game works without alcohol. The drinking twists are optional and only for people of legal drinking age." },
      { q: "Are the questions explicit?", a: "They're spicy and revealing rather than graphic: dating, crushes, exes, confessions and bold dares. Anyone can skip any card." },
      { q: "Can we play on one phone?", a: "Yes. Pass one phone around the circle, or open a party room so everyone plays on their own phone." },
    ],
    related: [
      { href: "/questions/dirty-truth-or-dare-questions", label: "Dirty truth or dare questions", emoji: "🔥" },
      { href: "/questions/dirty-would-you-rather-questions", label: "Dirty Would You Rather", emoji: "😳" },
      { href: "/questions/juicy-never-have-i-ever-questions", label: "Juicy Never Have I Ever", emoji: "🙈" },
      { href: "/questions/paranoia-questions", label: "Paranoia questions", emoji: "🤫" },
      { href: "/questions/hot-seat-questions", label: "Hot seat questions", emoji: "🪑" },
      { href: "/drinking-games", label: "Drinking games", emoji: "🍻" },
      { href: "/couples-games", label: "Couples games", emoji: "💘" },
      { href: "/questions/truth-or-dare-questions", label: "Truth or dare questions", emoji: "😈" },
    ],
  },
  "halloween-party-games": {
    path: "/halloween-party-games",
    title: "Halloween Party Games: 29 Spooky Games for Adults & Kids",
    description:
      "29 Halloween party games for adults, kids, teens and big groups: murder in the dark, mummy wrap, spooky Would You Rather, charades and no-prep games. Free.",
    h1: "Halloween Party Games",
    intro: [
      "Free Halloween party games that run on any phone. Use the spooky Would You Rather questions and Halloween charades ideas below as they are, or open one of the games and pass the phone around the room.",
      "Everything starts clean, so it works for a kids' Halloween party, a classroom or a teen sleepover. For an adult costume party, Truth or Dare, Most Likely To and the imposter game Odd One Out keep the whole room playing, and there is nothing to print or set up.",
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
    ideas: [
      {
        heading: "Halloween party games for adults",
        intro: "For costume parties and grown-up nights in. Turn the lights down first.",
        items: [
          { name: "Murder in the dark", how: "Deal secret roles: one murderer, one detective. Lights go off, the murderer taps a victim, they scream, lights on, and the detective questions everyone.", players: "6-15", needs: "Playing cards" },
          { name: "Costume contest awards", how: "Everyone votes in secret for scariest, funniest and most creative costume. Announce winners with a dramatic speech.", players: "Any", needs: "Paper slips" },
          { name: "Halloween hot seat", how: "One person in the hot seat answers rapid spooky questions for 60 seconds: scariest movie, worst costume, ever seen a ghost?", players: "4+" },
          { name: "Mystery box", how: "Fill covered boxes with peeled grapes (eyeballs), cold spaghetti (brains) and gummy worms. Guests reach in blind and guess.", players: "Any", needs: "Boxes and gross-feeling food" },
          { name: "Halloween Paranoia", how: "Whisper a spooky \"who here would…\" question to the next player, they answer out loud with a name, and a coin flip decides if the question is revealed.", players: "5+", needs: "A coin" },
          { name: "Horror movie emoji quiz", how: "Send emoji clues for horror films (🎈🤡 = It). First correct answer scores.", players: "Any" },
        ],
      },
      {
        heading: "Halloween games for kids and families",
        intro: "Not-too-scary games that work for little monsters and grandparents alike.",
        items: [
          { name: "Mummy wrap race", how: "Teams of two race to wrap one player head to toe in toilet paper. Fastest complete mummy wins.", players: "Teams of 2", needs: "Toilet paper" },
          { name: "Pumpkin bowling", how: "Line up toilet-roll ghosts as pins and roll a small pumpkin to knock them down.", players: "2+", needs: "Small pumpkin, toilet rolls" },
          { name: "Pin the hat on the witch", how: "Draw a witch, blindfold each player, spin them, and let them stick on the hat. Closest wins.", players: "3+", needs: "Paper, blindfold" },
          { name: "Halloween scavenger hunt", how: "Hide plastic spiders, eyeballs and candy around the house with spooky clues. First team to find them all wins.", players: "3-20", needs: "Small hidden items" },
          { name: "Monster freeze dance", how: "Play spooky music and dance like a monster. When the music stops, freeze; anyone who moves is out.", players: "4+", needs: "Music" },
          { name: "Bobbing for apples", how: "Float apples in a tub of water. Hands behind backs, players try to grab one with their teeth.", players: "Any", needs: "Tub, apples, towels" },
          { name: "Halloween charades", how: "Act out a zombie, a vampire at the dentist or a ghost scared of people. Our charades ideas include a Halloween set.", players: "4+" },
          { name: "Spooky Would You Rather", how: "Would you rather spend a night in a haunted house or a graveyard? Everyone picks a side and defends it.", players: "3+" },
        ],
      },
      {
        heading: "Halloween games for teens and big groups",
        intro: "Louder games that keep a crowd of 10 to 30 playing together.",
        items: [
          { name: "Odd One Out, Halloween edition", how: "Everyone gets the secret word except the imposter. Give spooky clues, then vote on who's faking it. Plays like a mini murder mystery.", players: "4-30" },
          { name: "Truth or Dare, spooky edition", how: "Truths about scariest moments and dares like \"howl like a werewolf.\" Our teen list keeps it fun, not mean.", players: "4+" },
          { name: "Ghost in the graveyard", how: "One ghost hides outside in the dark. Everyone counts to midnight, goes looking, and runs back to base when the ghost is found.", players: "6+", needs: "A dark yard" },
          { name: "Witch's brew relay", how: "Teams race to carry \"potion\" (water) in spoons from one cauldron to another. Most potion after two minutes wins.", players: "Teams of 3+", needs: "Bowls, spoons, water" },
          { name: "Halloween trivia", how: "Run a quick quiz between costume judging and snacks: horror movies, candy and Halloween history.", players: "4-30" },
        ],
      },
      {
        heading: "No-prep Halloween games",
        intro: "Last-minute party? These need nothing but a phone.",
        items: [
          { name: "Most Likely To, Halloween edition", how: "Who's most likely to scream first in a haunted house or eat all the candy? Point on three.", players: "4+" },
          { name: "Fake ghost stories", how: "Everyone tells a short ghost story. Some are \"true,\" some are made up, and the group votes on which really happened.", players: "4+" },
          { name: "Spin the spooky wheel", how: "Put dares, songs and challenges on a spin wheel and let fate pick each turn.", players: "Any" },
          { name: "Never Have I Ever, Halloween edition", how: "Never have I ever worn the same costume twice, been scared by a decoration, or eaten candy before trick-or-treating.", players: "4+" },
        ],
      },
    ],
    related: [
      { href: "/questions/truth-or-dare-questions-for-teens", label: "Truth or dare for teens", emoji: "😈" },
      { href: "/questions/paranoia-questions", label: "Paranoia questions", emoji: "🤫" },
      { href: "/questions/hot-seat-questions", label: "Hot seat questions", emoji: "🔥" },
      { href: "/questions/charades-ideas", label: "Charades ideas", emoji: "🎭" },
      { href: "/games/odd-one-out", label: "Odd One Out imposter game", emoji: "🕵️" },
      { href: "/wheel", label: "Spin the wheel", emoji: "🎡" },
      { href: "/christmas-party-games", label: "Christmas party games", emoji: "🎄" },
      { href: "/18-plus-party-games", label: "18+ party games", emoji: "🔥" },
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
      "Would you rather have a skeleton as a best friend or a black cat that talks?",
      "Would you rather trick-or-treat in a blizzard or in a heatwave?",
      "Charades: a ghost who is scared of people",
      "Charades: Frankenstein learning to dance",
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
      { q: "What are the best Halloween party games for adults?", a: "Odd One Out plays like a murder mystery with the lights down, and Truth or Dare and Most Likely To get louder as the night goes on. Adults can turn on the 18+ packs after an age check." },
      { q: "What Halloween games are good for teens?", a: "Truth or Dare with the clean packs, spooky Would You Rather and Fake News Factory, where everyone writes a ghost story that sounds true and the group spots the fakes." },
      { q: "What are easy Halloween games with no prep?", a: "Read the spooky Would You Rather questions and charades ideas on this page out loud, or open any game on one phone. Nothing needs printing or buying." },
      { q: "What Halloween games work for a big group or classroom?", a: "Odd One Out, charades in two teams and a quick Halloween trivia round all work for 10 to 30 people, and nobody has to sit out." },
    ],
  },
  "drinking-games": {
    path: "/drinking-games",
    title: "Drinking Games: Free Online Games for Groups",
    description:
      "Free drinking games to play on one phone: Never Have I Ever, Most Likely To, Truth or Dare and more, with sip rules and a forfeit wheel. 18+ only.",
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
    title: "Classroom Games: Free Games for Students",
    description:
      "Free classroom games for students: trivia, charades, This or That, Would You Rather and more. Run them from one screen or projector, no student accounts.",
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
    title: "Party Games for Large Groups (10 to 30+)",
    description:
      "Free party games for large groups of 10, 20 or 30+ people. Everyone plays every round, on one shared phone or their own. No signup, no download, no app.",
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
    title: "Virtual Party Games for Zoom & Teams",
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
    title: "Sleepover Games: Truth or Dare & More",
    description:
      "Free sleepover games for teens and tweens: clean Truth or Dare, Would You Rather, Never Have I Ever, charades and more. One phone, no signup.",
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
  },
  "couples-games": {
    path: "/couples-games",
    title: "Couples Games: Free Date Night Games",
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
  },
};

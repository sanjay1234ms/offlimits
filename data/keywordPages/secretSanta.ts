import type { KeywordPage } from "./types";

/** Secret Santa cluster around the /secret-santa generator. */
export const SECRET_SANTA_PAGES: KeywordPage[] = [
  {
    path: "/secret-santa/rules",
    title: "Secret Santa Rules: How to Play, Step by Step",
    description:
      "Secret Santa rules made simple: how to draw names, set a budget, keep it secret and run the reveal. Plus {n} house rules and fixes for the most common problems.",
    h1: "Secret Santa Rules",
    eyebrow: "🎅 How it works",
    emojis: ["🎅", "📜", "🎁"],
    intro:
      "Everything you need to run a Secret Santa that nobody complains about: the basic rules, {n} optional house rules, and what to do when something goes wrong.",
    quickAnswer:
      "In Secret Santa, everyone's name goes into a draw and each person secretly gets one other person to buy a gift for. The group agrees a budget and a swap date, nobody reveals who they drew, and on the day gifts are handed out and people guess who their Secret Santa was.",
    updated: "2026-11-13",
    sections: [
      {
        heading: "The basic rules",
        items: [
          "Everyone who joins puts their name in the draw. You need at least three people.",
          "Each person draws one name and keeps it secret. You can't draw yourself.",
          "The group agrees one budget, and everyone sticks to it.",
          "Set a swap date and place, or a shipping deadline for remote groups.",
          "Buy and wrap a gift for the person you drew, with only their name on the tag.",
          "On the day, hand out the gifts. People can guess who their Santa was, or the Santas can reveal themselves.",
        ],
      },
      {
        heading: "House rules to agree before the draw",
        intro: "Pick a few of these and tell everyone up front.",
        items: [
          "Partners and housemates can't draw each other.",
          "Everyone writes a short wishlist or answers a few questions about what they like.",
          "No gift cards, or only gift cards. Decide which.",
          "Handmade gifts are welcome, as long as they're finished.",
          "Gag gifts are fine, but they have to come with something useful.",
          "Keep a theme, like \"something cosy\" or \"something under $20 you'd use every day\".",
          "Late gifts get a forfeit, like singing a carol at the next get-together.",
          "Leave the receipt in an envelope, just in case.",
        ],
      },
      {
        heading: "Common problems and fixes",
        items: [
          "Someone drew their own name: redraw everything, or use an online draw that never allows it.",
          "Someone dropped out after the draw: their Santa buys for the person the dropout drew.",
          "Someone told who they got: redraw for the people involved, or start fresh.",
          "Someone forgot the gift: the organiser keeps one spare wrapped gift for emergencies.",
          "Budgets don't match: set one number, not a range, and say it twice.",
        ],
      },
    ],
    howTo: [
      "Add everyone's names to the free Secret Santa generator.",
      "Set the budget, the swap date and any pairs who can't draw each other.",
      "Share the one link in the group chat. Each person taps their name to see their match.",
      "Shop, wrap, and swap on the day.",
    ],
    faq: [
      { q: "How many people do you need for Secret Santa?", a: "At least three. It works best with five or more, and there's no upper limit." },
      { q: "What is a good Secret Santa budget?", a: "$20 to $30 is the most common for friends and offices. Families often go higher. Pick one number and stick to it." },
      { q: "Can you do Secret Santa without drawing names from a hat?", a: "Yes. A free online generator draws the names, makes sure nobody gets themselves, and lets each person see only their own match." },
      { q: "When do you reveal who your Secret Santa was?", a: "Usually at the swap, after gifts are opened. Some groups keep it secret forever, which is fine too." },
    ],
    play: { href: "/secret-santa", label: "Draw names for free" },
    related: ["/secret-santa", "/secret-santa/office", "/secret-santa/virtual", "/secret-santa/gift-ideas", "/secret-santa/questionnaire", "/white-elephant/rules"],
    group: "gifts",
  },
  {
    path: "/secret-santa/office",
    title: "Office Secret Santa: Rules, Budget and {n} Ideas",
    description:
      "How to run an office Secret Santa: a fair budget, sign-up, a free name draw, work-safe gift ideas and a fun reveal. {n} tips and ideas for teams of 5 to 500.",
    h1: "Office Secret Santa",
    eyebrow: "💼 Work gift exchange",
    emojis: ["💼", "🎅", "🎁"],
    intro:
      "Running Secret Santa at work? Here's how to keep it fair, easy and work-appropriate, with {n} tips and gift ideas that won't make HR nervous.",
    quickAnswer:
      "To run an office Secret Santa, invite people to opt in, set one budget (usually $15 to $25), draw names with a free online generator so nobody has to manage a hat, set a swap date at the team party, and keep gifts work-appropriate. Optional wishlists make shopping much easier.",
    updated: "2026-11-13",
    compare: {
      heading: "Office Secret Santa at a glance",
      columns: ["Decision", "Most offices", "Small teams", "Big companies"],
      rows: [
        { name: "Budget", cells: ["$15-$25", "$20-$30", "$10-$20"] },
        { name: "Sign-up", cells: ["Opt in", "Everyone", "Opt in by team"] },
        { name: "Draw", cells: ["Online", "Online or hat", "Online, per team"] },
        { name: "Swap", cells: ["Team party", "Lunch", "Department party"] },
      ],
    },
    sections: [
      {
        heading: "How to set it up",
        items: [
          "Send an opt-in message. Never make Secret Santa mandatory at work.",
          "Set one budget. Lower is kinder: $15 to $25 is normal.",
          "Collect a short wishlist or three \"likes\" from each person.",
          "Draw names online so nobody has to manage a hat, and nobody can peek.",
          "Pick a swap date at the team party, or a drop-off desk for hybrid teams.",
          "Send a reminder a week before and the day before.",
        ],
      },
      {
        heading: "Work-safe gift ideas",
        items: [
          "A good mug with a bag of local coffee or tea.",
          "A desk plant that's hard to kill.",
          "A nice notebook and pen set.",
          "A phone stand or cable organiser.",
          "Gourmet snacks or hot chocolate kit.",
          "A cosy blanket for cold office days.",
          "A board game or card game for the break room.",
          "A gift card for the café near the office.",
        ],
      },
      {
        heading: "Fun twists for the reveal",
        items: [
          "Guess your Santa: everyone guesses before the reveal, and correct guesses win a candy cane.",
          "Turn it into White Elephant: wrap the gifts and let people steal.",
          "Play Christmas Most Likely To while gifts are opened.",
          "Do a quick Christmas trivia round for the team.",
        ],
      },
    ],
    tips: [
      { title: "Keep it inclusive", body: "Call it a holiday gift exchange if your team celebrates different holidays, and keep it optional." },
      { title: "Remote teammates", body: "Set a shipping deadline two weeks before the swap and reveal on a video call." },
    ],
    faq: [
      { q: "What is a good budget for office Secret Santa?", a: "$15 to $25 is the most common. Pick one fixed number so nobody over- or under-spends." },
      { q: "Should office Secret Santa be mandatory?", a: "No. Make it opt-in so nobody feels pressured to spend money." },
      { q: "How do you draw names for a big office?", a: "Use a free online generator. Add the names, block anyone who shouldn't match, and share one link. Each person sees only their own match." },
      { q: "What should you not give at an office Secret Santa?", a: "Avoid anything personal, alcohol unless you know the person, jokes about appearance and anything you wouldn't hand over in front of your manager." },
    ],
    play: { href: "/secret-santa", label: "Draw names for your office" },
    related: ["/secret-santa", "/secret-santa/rules", "/secret-santa/virtual", "/secret-santa/gift-ideas", "/office-party-games", "/white-elephant"],
    group: "gifts",
  },
  {
    path: "/secret-santa/virtual",
    title: "Virtual Secret Santa: How to Do It Online ({n} Tips)",
    description:
      "Run a virtual Secret Santa online: draw names with one link, set a shipping deadline, share wishlists and reveal on a video call. {n} tips for remote groups.",
    h1: "Virtual Secret Santa",
    eyebrow: "💻 Remote gift exchange",
    emojis: ["💻", "🎅", "📦"],
    intro:
      "Friends, family or a team spread out across cities? Here's how to run a Secret Santa entirely online, from the draw to the reveal, with {n} tips.",
    quickAnswer:
      "For a virtual Secret Santa, draw names with a free online generator and share one link in the group chat, ask everyone for a wishlist and shipping address, set a shipping deadline about two weeks before the reveal, and open gifts together on a video call.",
    updated: "2026-11-13",
    sections: [
      {
        heading: "Step by step",
        items: [
          "Add everyone's names to an online Secret Santa generator and share the one link.",
          "Each person taps their name to see their match, privately.",
          "Collect wishlists and shipping addresses in a shared doc or the group chat.",
          "Set a budget that includes shipping, or say shipping is extra.",
          "Set a shipping deadline about two weeks before the reveal.",
          "Ask people to mark parcels \"Do not open until\" the reveal date.",
          "Open the gifts together on a video call, one at a time.",
        ],
      },
      {
        heading: "Gift ideas that ship well",
        items: [
          "A digital gift card with a printed-at-home card.",
          "Local snacks from your city, so they get a taste of where you live.",
          "Books and puzzles.",
          "Socks, scarves or a cosy blanket.",
          "A subscription box for one month.",
          "Anything ordered straight to their door from their wishlist.",
        ],
      },
      {
        heading: "Make the video call fun",
        items: [
          "Guess your Santa before they reveal themselves.",
          "Play Christmas Would You Rather while people grab their parcels.",
          "Run a five-question Christmas trivia round between gifts.",
          "Everyone wears their ugliest Christmas sweater on camera.",
        ],
      },
    ],
    tips: [
      { title: "Plan for international shipping", body: "If anyone is overseas, set the deadline three weeks out or allow digital gifts." },
      { title: "Keep addresses private", body: "Ask people to send their address only to the organiser, who passes it to their Santa." },
    ],
    faq: [
      { q: "How do you do Secret Santa online?", a: "Add names to a free online Secret Santa generator, share the link, and each person sees who they're buying for. Ship gifts and open them together on a video call." },
      { q: "How do you send gifts in a virtual Secret Santa?", a: "Order online straight to your match's address, or post a parcel. Digital gift cards work if shipping is tricky." },
      { q: "What should the budget include?", a: "Say up front whether the budget includes shipping. $20 to $30 plus shipping is common." },
    ],
    play: { href: "/secret-santa", label: "Draw names online, free" },
    related: ["/secret-santa", "/secret-santa/rules", "/secret-santa/office", "/secret-santa/gift-ideas", "/virtual-party-games", "/questions/christmas-would-you-rather-questions"],
    group: "gifts",
  },
];

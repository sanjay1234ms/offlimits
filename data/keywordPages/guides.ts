import type { KeywordPage } from "./types";

/** Answer-style guides: a direct answer up top, a comparison table and an
 * FAQ, written so search engines and AI assistants can quote them. */
export const GUIDE_PAGES: KeywordPage[] = [
  {
    path: "/best-party-games",
    title: "Best Party Games for Groups (2026): {n} Picks That Work",
    description:
      "The best party games for groups in 2026, compared by player count, time and setup. {n} picks for adults, teens and families, most free on one phone tonight.",
    h1: "The Best Party Games for Groups",
    eyebrow: "🏆 Our top picks",
    emojis: ["🏆", "🎉", "📱"],
    intro:
      "{n} party games that reliably get a group laughing, sorted by what kind of night you're having. Every pick has been played with real groups, and most run free on one phone.",
    quickAnswer:
      "The best party games for most groups are Werewolf (or Mafia) for big groups, Odd One Out for a quick laugh, Most Likely To and Would You Rather as icebreakers, Charades and Buzzkill for active teams, and Truth or Dare or Never Have I Ever for close friends. All of them need no cards or board and work with 4 to 20 players.",
    updated: "2026-11-13",
    compare: {
      heading: "Top party games compared",
      columns: ["Game", "Players", "Round length", "Best for"],
      rows: [
        { name: "Werewolf", href: "/werewolf-game", cells: ["6-20", "15-30 min", "Big groups who like bluffing"] },
        { name: "Mafia", href: "/mafia-game", cells: ["6-20", "15-30 min", "The classic, with a narrator"] },
        { name: "Odd One Out", href: "/games/odd-one-out", cells: ["3-30", "5 min", "Fast laughs with any group"] },
        { name: "Most Likely To", href: "/games/most-likely-to", cells: ["3+", "Any", "Icebreakers and friends"] },
        { name: "Would You Rather", href: "/games/would-you-rather", cells: ["3+", "Any", "Mixed groups and families"] },
        { name: "Charades", href: "/games/charades", cells: ["4-20", "10-20 min", "Active teams"] },
        { name: "Buzzkill", href: "/games/buzzkill", cells: ["4-16", "10 min", "Competitive word game"] },
        { name: "Truth or Dare", href: "/games/truth-or-dare", cells: ["2-12", "Any", "Close friends"] },
        { name: "Never Have I Ever", href: "/games/never-have-i-ever", cells: ["4+", "Any", "Confessions and stories"] },
        { name: "Trivia", href: "/games/trivia", cells: ["1+", "15-40 min", "Teams who like to win"] },
      ],
    },
    sections: [
      {
        heading: "Best for big groups (8+)",
        items: [
          "Werewolf: secret roles, a spoken narrator and a night of lies. Every player can use their own phone in a party room.",
          "Mafia: the original social deduction game. One narrator, a hidden mafia and a town that has to vote them out.",
          "Odd One Out: everyone sees the same word except the imposter, who has to blend in.",
          "Charades: two teams, a 60-second timer and acting prompts from easy to ridiculous.",
          "Pirate Barrel: take turns until someone sends the pirate flying. Works with up to 20.",
        ],
      },
      {
        heading: "Best icebreakers",
        items: [
          "Most Likely To: read a prompt, point on three, and the most-pointed person explains.",
          "Would You Rather: two impossible options, everyone picks a side and defends it.",
          "This or That: rapid-fire choices with no time to think.",
          "Two Truths and a Lie: three facts, one fake, and the group votes.",
        ],
      },
      {
        heading: "Best for close friends",
        items: [
          "Truth or Dare: pick your lane and take whatever the phone deals. Switch packs for a spicier night.",
          "Never Have I Ever: ten fingers up, a finger down for everything you've done.",
          "How Well Do You Know Me: answer for each other, then compare.",
          "Fake News Factory: write a convincing lie, then spot everyone else's.",
        ],
      },
      {
        heading: "Best competitive games",
        items: [
          "Buzzkill: describe the word without saying any of the three forbidden ones.",
          "Fast 5: name five things in a category before the buzzer.",
          "Trivia: questions read out, answers revealed with a tap, scores kept as you go.",
          "Say It Backwards: read phonetic phrases backwards while your team decodes them.",
        ],
      },
    ],
    howTo: [
      "Count your group: 8 or more, start with Werewolf, Mafia or Odd One Out.",
      "If people don't know each other, open with an icebreaker like Most Likely To.",
      "Switch games every 15 to 20 minutes to keep the energy up.",
      "End with something competitive, like Buzzkill or trivia, so there's a winner.",
    ],
    tips: [
      { title: "One phone is enough", body: "Every game on this list runs in a browser. Pass one phone around, or open a party room so everyone plays on their own." },
      { title: "Have a backup", body: "If a game falls flat in five minutes, switch. The right game for the room beats the \"best\" game on paper." },
    ],
    faq: [
      { q: "What is the best party game for a large group?", a: "Werewolf or Mafia. Both work with 6 to 20 players, keep everyone involved, and need nothing but phones or a narrator." },
      { q: "What party games need no supplies?", a: "Most Likely To, Would You Rather, Two Truths and a Lie, Charades and Never Have I Ever need nothing. The OffLimits versions just need one phone." },
      { q: "What are good party games for adults?", a: "Werewolf, Odd One Out, Never Have I Ever, Truth or Dare and Fake News Factory are favourites. For spicier games, see the 18+ party games page." },
      { q: "Are these party games free?", a: "Yes. Every game linked here is free to play in a browser with no download or account. Only the optional 18+ packs have a paid unlock." },
    ],
    play: { href: "/games", label: "Browse every game" },
    related: ["/party-games-for-small-groups", "/house-party-games-for-adults", "/games-to-play-with-friends", "/party-games-for-large-groups", "/werewolf-game", "/mafia-game"],
    group: "games",
  },
  {
    path: "/house-party-games-for-adults",
    title: "{n} House Party Games for Adults (No Supplies Needed)",
    description:
      "{n} house party games for adults that need no supplies: icebreakers, bluffing games and late-night classics. Compare player counts and play free on one phone.",
    h1: "House Party Games for Adults",
    eyebrow: "🏠 Games for a night in",
    emojis: ["🏠", "🍕", "🎲"],
    intro:
      "{n} games for a house party with friends, from the first guests arriving to the last ones on the couch. Nothing to buy, nothing to set up.",
    quickAnswer:
      "The best house party games for adults are Most Likely To and Two Truths and a Lie while people arrive, Odd One Out or Werewolf once the group is settled, and Never Have I Ever or Truth or Dare late in the night. All of them need no supplies and work with 4 to 20 people.",
    updated: "2026-11-13",
    compare: {
      heading: "Which game, when",
      columns: ["Game", "When to play", "Players", "Vibe"],
      rows: [
        { name: "Most Likely To", href: "/games/most-likely-to", cells: ["As people arrive", "4+", "Easy laughs"] },
        { name: "Two Truths and a Lie", href: "/questions/two-truths-and-a-lie-ideas", cells: ["As people arrive", "4+", "Get to know you"] },
        { name: "Odd One Out", href: "/games/odd-one-out", cells: ["Main event", "4-30", "Bluffing"] },
        { name: "Werewolf", href: "/werewolf-game", cells: ["Main event", "6-20", "Lies and accusations"] },
        { name: "Buzzkill", href: "/games/buzzkill", cells: ["Main event", "4-16", "Competitive"] },
        { name: "Never Have I Ever", href: "/games/never-have-i-ever", cells: ["Late night", "4+", "Confessions"] },
        { name: "Truth or Dare", href: "/games/truth-or-dare", cells: ["Late night", "3-12", "Bold"] },
      ],
    },
    sections: [
      {
        heading: "While people arrive",
        intro: "Games people can join halfway through.",
        items: [
          "Most Likely To: the person with the most fingers pointed at them explains.",
          "Two Truths and a Lie: works one person at a time, so latecomers can jump in.",
          "Would You Rather: start a debate and let it run.",
          "This or That: quick picks to break the ice.",
        ],
      },
      {
        heading: "The main event",
        intro: "Once everyone is there and has a drink in hand.",
        items: [
          "Werewolf: secret roles, a night phase and a village vote. Best with 6 to 12.",
          "Mafia: the classic with a human narrator.",
          "Odd One Out: one imposter, one secret word, a lot of suspicious looks.",
          "Buzzkill: describe the word without the three forbidden ones.",
          "Charades: two teams, 60 seconds, no talking.",
          "Fake News Factory: write convincing lies and spot everyone else's.",
        ],
      },
      {
        heading: "Late night",
        intro: "When the group is down to the people who know each other best.",
        items: [
          "Never Have I Ever: fingers down, stories out.",
          "Truth or Dare: one skip each, and switch to the spicy pack if everyone's in.",
          "Paranoia: whisper a question, answer out loud with a name, flip a coin to reveal it.",
          "Hot Seat: one person, 60 seconds, every question fair game.",
        ],
      },
    ],
    tips: [
      { title: "Pick one host", body: "One person picks the games and keeps the phone. It stops the \"what should we play?\" stall." },
      { title: "Go spicy last", body: "Start clean and let the group decide when to switch to 18+ packs. Everyone should be in." },
    ],
    faq: [
      { q: "What games can you play at a house party with no supplies?", a: "Most Likely To, Two Truths and a Lie, Would You Rather, Charades, Mafia and Never Have I Ever need nothing. Werewolf and Odd One Out just need a phone." },
      { q: "What is a good game for a house party with 10 people?", a: "Werewolf is ideal for 10: two werewolves, a seer, a doctor and six villagers. Odd One Out and Charades also work well." },
      { q: "What games are good for adults who don't know each other?", a: "Start with Most Likely To or Two Truths and a Lie. They're low pressure and get names and stories going." },
    ],
    play: { href: "/games/odd-one-out", label: "Play Odd One Out on one phone" },
    related: ["/best-party-games", "/18-plus-party-games", "/drinking-games", "/werewolf-game", "/games-to-play-with-friends", "/party-games-for-large-groups"],
    group: "games",
  },
  {
    path: "/party-games-for-small-groups",
    title: "{n} Party Games for Small Groups (3 to 6 Players)",
    description:
      "{n} party games for small groups of 3 to 6 people: quick word games, bluffing games and conversation games. Compare the picks and play free on one phone.",
    h1: "Party Games for Small Groups",
    eyebrow: "👥 3 to 6 players",
    emojis: ["👥", "🎯", "💬"],
    intro:
      "{n} games that actually work with a small group. No games that need ten people to be fun, and nothing that leaves someone sitting out.",
    quickAnswer:
      "The best party games for small groups of 3 to 6 are Odd One Out, Buzzkill, Fast 5, Would You Rather, Never Have I Ever and Fake News Factory. They keep every player involved every round, and all of them run free on one phone.",
    updated: "2026-11-13",
    compare: {
      heading: "Small group picks compared",
      columns: ["Game", "Players", "Round length", "Type"],
      rows: [
        { name: "Odd One Out", href: "/games/odd-one-out", cells: ["3-30", "5 min", "Bluffing"] },
        { name: "Buzzkill", href: "/games/buzzkill", cells: ["4-16", "10 min", "Word game"] },
        { name: "Fast 5", href: "/games/fast-5", cells: ["2-12", "5 min", "Quick fire"] },
        { name: "Fake News Factory", href: "/games/fake-news-factory", cells: ["3-10", "15 min", "Bluffing"] },
        { name: "Would You Rather", href: "/games/would-you-rather", cells: ["3+", "Any", "Conversation"] },
        { name: "Never Have I Ever", href: "/games/never-have-i-ever", cells: ["4+", "Any", "Conversation"] },
        { name: "Miss a Beat", href: "/games/miss-a-beat", cells: ["2-12", "5 min", "Rhythm"] },
      ],
    },
    sections: [
      {
        heading: "For 3 players",
        items: [
          "Odd One Out: with three, the imposter has nowhere to hide. Short, tense rounds.",
          "Fast 5: name five things in a category before the buzzer.",
          "Would You Rather: three people means there's always a minority to defend.",
          "Fake News Factory: two truths and a bluff, scored over five rounds.",
        ],
      },
      {
        heading: "For 4 to 6 players",
        items: [
          "Buzzkill: two teams of two or three, describing words against the clock.",
          "Never Have I Ever: small enough that every confession gets a story.",
          "Miss a Beat: keep the rhythm going and name a word on the beat.",
          "Truth or Dare: everyone gets a turn every couple of minutes.",
          "Say It Backwards: read a phonetic phrase backwards and let your team decode it.",
          "Charades in pairs: one acts, one guesses, and the pairs race each other.",
        ],
      },
    ],
    tips: [
      { title: "Keep rounds short", body: "With fewer players, short rounds mean nobody waits long for a turn." },
      { title: "Use teams of two", body: "Word games like Buzzkill and Charades work great as pairs against pairs." },
    ],
    faq: [
      { q: "What games can 3 people play at a party?", a: "Odd One Out, Fast 5, Would You Rather and Fake News Factory all work well with three." },
      { q: "What are good party games for 4 people?", a: "Buzzkill in teams of two, Never Have I Ever, Truth or Dare and Charades in pairs are great with four." },
      { q: "Can we play these on one phone?", a: "Yes. Every game here runs free in a browser on one phone that you pass around." },
    ],
    play: { href: "/games/buzzkill", label: "Play Buzzkill on one phone" },
    related: ["/best-party-games", "/games-to-play-with-friends", "/couples-games", "/party-games-for-large-groups", "/virtual-party-games"],
    group: "games",
  },
  {
    path: "/games-to-play-with-friends",
    title: "{n} Fun Games to Play With Friends (In Person or Online)",
    description:
      "{n} fun games to play with friends in person or on a video call: bluffing games, word games and question games. Free in your browser, with quick rules for each.",
    h1: "Fun Games to Play With Friends",
    eyebrow: "🙌 For any night",
    emojis: ["🙌", "😂", "📱"],
    intro:
      "{n} games to play with friends when you're bored, hanging out or on a call. Most take a minute to learn, and all of them can be played free in a browser.",
    quickAnswer:
      "Fun games to play with friends include Werewolf and Odd One Out for bluffing, Buzzkill and Charades for word games, Would You Rather and Most Likely To for conversation, and Truth or Dare or Never Have I Ever for a more personal night. Each can be played in person on one phone, and most also work over a video call.",
    updated: "2026-11-13",
    compare: {
      heading: "Games to play with friends compared",
      columns: ["Game", "In person", "Video call", "Players"],
      rows: [
        { name: "Werewolf", href: "/werewolf-game", cells: ["Yes", "Yes, with a party room", "6-20"] },
        { name: "Odd One Out", href: "/games/odd-one-out", cells: ["Yes", "Yes, with a host", "3-30"] },
        { name: "Buzzkill", href: "/games/buzzkill", cells: ["Yes", "Yes, share screen", "4-16"] },
        { name: "Would You Rather", href: "/games/would-you-rather", cells: ["Yes", "Yes", "3+"] },
        { name: "Most Likely To", href: "/games/most-likely-to", cells: ["Yes", "Yes", "3+"] },
        { name: "Truth or Dare", href: "/games/truth-or-dare", cells: ["Yes", "Yes", "2-12"] },
        { name: "Never Have I Ever", href: "/games/never-have-i-ever", cells: ["Yes", "Yes", "4+"] },
      ],
    },
    sections: [
      {
        heading: "Bluffing games",
        items: [
          "Werewolf: secret roles and a village vote. Everyone can join from their own phone.",
          "Odd One Out: spot the imposter who doesn't know the secret word.",
          "Fake News Factory: write a believable lie and fool your friends.",
          "Two Truths and a Lie: three facts about you, one is made up.",
        ],
      },
      {
        heading: "Word and quick-fire games",
        items: [
          "Buzzkill: describe a word without the three forbidden ones.",
          "Charades: act it out, no talking, 60 seconds.",
          "Fast 5: five answers before the buzzer.",
          "Say It Backwards: decode a phrase read backwards.",
          "Trivia: questions read out, answers on a tap.",
        ],
      },
      {
        heading: "Question games",
        items: [
          "Would You Rather: impossible choices that start debates.",
          "Most Likely To: point on three and make them explain.",
          "This or That: quick picks, no overthinking.",
          "Never Have I Ever: confessions, one finger at a time.",
          "Truth or Dare: classic, with clean and spicy packs.",
          "21 Questions: get to know someone one question at a time.",
        ],
      },
    ],
    tips: [
      { title: "On a video call", body: "One person shares their screen with the game open and reads each card. Everyone answers out loud." },
      { title: "In person", body: "Pass one phone around, or open a party room so everyone plays on their own phone." },
    ],
    faq: [
      { q: "What games can you play with friends when you're bored?", a: "Would You Rather, Most Likely To, Odd One Out and Buzzkill need nothing but a phone and take a minute to start." },
      { q: "What games can you play with friends online?", a: "Werewolf in a party room, Would You Rather, Most Likely To, Trivia and Truth or Dare all work well on a video call." },
      { q: "Do I need to download anything?", a: "No. Every game here runs free in a phone or laptop browser, with no app or account." },
    ],
    play: { href: "/party", label: "Open a party room" },
    related: ["/best-party-games", "/virtual-party-games", "/party-games-for-small-groups", "/house-party-games-for-adults", "/daily"],
    group: "games",
  },
];

import type { LandingPage } from "./landingPages";

/** Event landing pages with interactive games (see app/<slug>/page.tsx). */
export const EVENT_PAGES: Record<string, LandingPage> = {
  "thanksgiving-games": {
    path: "/thanksgiving-games",
    title: "Thanksgiving Games: 25 Fun Games for Family & Friendsgiving",
    description:
      "25 Thanksgiving games for family, kids, adults and Friendsgiving: Pass the Turkey, gratitude games, trivia and Most Likely To. Free, play on one phone.",
    h1: "Thanksgiving Games",
    intro: [
      "Thanksgiving games for the whole table, from the kids' corner to the post-pie couch crowd. Start a round of Pass the Turkey right here, vote on who's most likely to fall asleep first, or pull up the trivia.",
      "Everything is free and runs on one phone. No printing, no setup, and nothing that needs the good china moved.",
    ],
    picksHeading: "Best games to play on Thanksgiving",
    picks: [
      { slug: "trivia", why: "Run a Thanksgiving trivia round between courses." },
      { slug: "most_likely_to", why: "Point on three: who's most likely to eat the most pie?" },
      { slug: "would_you_rather", why: "Easy table talk while the turkey rests." },
      { slug: "charades", why: "The post-dinner classic for every age." },
      { slug: "odd-one-out", why: "One imposter, one secret word. Great for big families." },
      { slug: "pirate-barrel", why: "A quick, silly decider for who does the dishes." },
    ],
    ideas: [
      {
        heading: "Thanksgiving games for the whole family",
        items: [
          { name: "Pass the Turkey", how: "Our hot-potato game above. Pass the phone while it ticks; whoever's holding it when it gobbles answers a gratitude question.", players: "4+" },
          { name: "Gratitude alphabet", how: "Go around the table naming something you're thankful for, A to Z. Hesitate for five seconds and you're out.", players: "3+" },
          { name: "Thankful jar", how: "Everyone writes something they're thankful for on a slip. Read them out during dessert and guess who wrote each.", players: "Any", needs: "Paper and a jar" },
          { name: "Turkey trivia", how: "Four quick rounds: history, food, football and turkeys. Answers are on our Thanksgiving trivia page.", players: "4-30" },
          { name: "Pie-eating contest (hands behind backs)", how: "Tiny slices, no hands, one minute. Messiest face gets a bonus.", players: "2+", needs: "Mini pies" },
          { name: "Leaf-pile scavenger hunt", how: "Kids find a red leaf, a pinecone, an acorn and something shaped like a turkey.", players: "Kids", needs: "A yard" },
        ],
      },
      {
        heading: "Friendsgiving and adult games",
        items: [
          { name: "Most Likely To, Thanksgiving edition", how: "Our secret-vote game above. Who's most likely to bring store-bought pie and call it homemade?", players: "3-12" },
          { name: "Two truths and a lie, family edition", how: "Two true family stories, one invented. The table guesses the lie.", players: "4+" },
          { name: "Thanksgiving charades", how: "Act out the parade, carving the turkey, or a food coma without speaking.", players: "6+" },
          { name: "Leftover chef challenge", how: "Two teams build the best leftovers sandwich in five minutes. Everyone votes.", players: "Teams", needs: "Leftovers" },
          { name: "Friendsgiving hot seat", how: "One person, 60 seconds, any question about their year.", players: "4+" },
          { name: "Guess the dish", how: "Blindfold a player and give them a bite of a side dish. Name it to score.", players: "Any", needs: "Blindfold" },
        ],
      },
    ],
    promptsHeading: "Thanksgiving table questions",
    prompts: [
      "What's one thing you're thankful for that nobody here knows about?",
      "What's the best thing that happened to you this year?",
      "Which Thanksgiving dish could you eat every day?",
      "What's your funniest Thanksgiving memory?",
      "Who's someone not at this table you're grateful for?",
      "What tradition should this family start?",
      "What's the best advice you got this year?",
      "If you could invite anyone, living or not, to dinner, who would it be?",
    ],
    tipsHeading: "How to run Thanksgiving games",
    tips: [
      "Play a quick game like Pass the Turkey between dinner and dessert, when energy dips.",
      "Pair kids with grandparents for trivia so everyone has a fair shot.",
      "Keep one game for the post-meal couch: Most Likely To works lying down.",
    ],
    faq: [
      { q: "What are good Thanksgiving games for families?", a: "Pass the Turkey, a gratitude alphabet, Thanksgiving trivia and charades work for every age and need nothing but a phone." },
      { q: "What games can you play at Friendsgiving?", a: "Most Likely To, two truths and a lie, a leftovers cook-off and Friendsgiving hot seat get the loudest laughs." },
      { q: "Are these Thanksgiving games free?", a: "Yes. Every game on this page is free in the browser, with no app and no signup." },
      { q: "When is Thanksgiving?", a: "US Thanksgiving is the fourth Thursday of November. Canadian Thanksgiving is the second Monday of October." },
    ],
    related: [
      { href: "/questions/thanksgiving-trivia-questions", label: "Thanksgiving trivia with answers", emoji: "🦃" },
      { href: "/christmas-party-games", label: "Christmas party games", emoji: "🎄" },
      { href: "/most-likely-to-game", label: "Most Likely To voting game", emoji: "👉" },
      { href: "/questions/get-to-know-you-questions", label: "Get to know you questions", emoji: "👋" },
    ],
  },

  "bachelorette-party-games": {
    path: "/bachelorette-party-games",
    title: "Bachelorette Party Games: 30 Fun & Dirty Games (18+)",
    description:
      "30 bachelorette party games: How Well Do You Know the Bride, a dirty truth or dare deck with a spicy meter, Most Likely To and a night-out scavenger hunt. Free on your phone.",
    h1: "Bachelorette Party Games",
    intro: [
      "Bachelorette party games that go from cute to absolutely filthy, your call. Turn the spicy meter up for the Bride Edition truth or dare deck, send the girls a How Well Do You Know the Bride quiz with a live leaderboard, or take the scavenger hunt out on the town.",
      "Everything runs on your phones. No printing, no props you forgot to pack. The dirtiest levels are 18+, sit behind an age check, and anyone can skip any card.",
    ],
    note: "Levels 3-5 of the Bride Edition deck are 18+. Play with people who are into it, and skip anything, any time.",
    picksHeading: "More games for the bride tribe",
    picks: [
      { slug: "18plus", why: "The uncensored deck for after the first round of shots." },
      { slug: "never_have_i_ever", why: "Switch on the spicy pack and let the confessions flow." },
      { slug: "truth_or_dare", why: "Classic truth or dare with an 18+ pack." },
      { slug: "how-well-do-you-know-me", why: "A pass-the-phone version for the bride and her person." },
      { slug: "pirate-barrel", why: "Whoever launches the pirate takes a shot." },
      { slug: "rock-paper-scissors", why: "Settle who buys the next round." },
    ],
    ideas: [
      {
        heading: "Games about the bride",
        items: [
          { name: "How Well Do You Know the Bride", how: "Our multi-phone quiz above. The maid of honor fills in the answers, everyone plays on their own phone, and the leaderboard crowns the bride's real best friend.", players: "3-50" },
          { name: "Who knows the groom best?", how: "Ask the groom ten questions before the party. The bride guesses his answers; every miss is a sip.", players: "2+" },
          { name: "Bride or groom?", how: "Read a fact. Everyone shouts whether it's about the bride or the groom.", players: "4+" },
          { name: "Advice for the bride", how: "Everyone writes their best (or worst) marriage advice on a card. The bride reads them out and guesses who wrote each.", players: "Any", needs: "Cards" },
        ],
      },
      {
        heading: "Dirty bachelorette games (18+)",
        items: [
          { name: "Bride Edition truth or dare", how: "Our five-level deck above, from cute to nasty. Truths, dares, Never Have I Ever and Most Likely To.", players: "3+" },
          { name: "Dirty Never Have I Ever", how: "Turn the meter to Filthy. Ten fingers up; anyone guilty puts one down and tells the story.", players: "4+" },
          { name: "Lingerie guessing game", how: "Guests bring lingerie for the bride. She guesses who brought each piece; wrong guesses are a sip.", players: "Any", needs: "Gifts" },
          { name: "Pin the junk on the hunk", how: "The legendary bachelorette classic. Blindfold, spin, and aim.", players: "Any", needs: "Poster, blindfold" },
          { name: "Banana relay", how: "Pass a banana down the line using only your knees or chins. Drop it and your team drinks.", players: "Teams", needs: "Bananas" },
          { name: "Dirty Mad Libs", how: "Fill in a wedding-night story with the nastiest words you can think of, then read it out loud.", players: "Any" },
        ],
      },
      {
        heading: "Night-out games",
        items: [
          { name: "Bachelorette scavenger hunt", how: "Our live checklist above: tick off challenges, rack up points, and hit Legend tier before last call.", players: "Teams" },
          { name: "Most Likely To, bachelorette edition", how: "Our secret-vote game: who's most likely to lose a shoe, flirt with the DJ, or cry during the speeches?", players: "3-12" },
          { name: "Bridesmaid bingo", how: "Mark off a stranger buying the bride a drink, someone crying in the bathroom, and the DJ playing ABBA.", players: "Any" },
          { name: "Truth or shot", how: "Answer the question honestly or take a shot. Water counts.", players: "4+", needs: "Drinks" },
        ],
      },
    ],
    promptsHeading: "A taste of the Bride Edition deck",
    prompts: [
      "What was your very first impression of your fiancé?",
      "Who's most likely to cry first during the vows?",
      "Never have I ever kissed someone on the first date.",
    ],
    tipsHeading: "How to run a great bachelorette",
    tips: [
      "Send the How Well Do You Know the Bride link a few days before the party, then reveal the leaderboard at pre-drinks.",
      "Start the deck on Cute and let the group vote to turn the heat up. Ambushing the bride's mother-in-law with level 5 is a choice.",
      "Agree that anyone can skip a card, no questions asked. The night stays fun when nobody feels cornered.",
      "Take the scavenger hunt to the bar and split into teams for double points.",
    ],
    faq: [
      { q: "What are the best bachelorette party games?", a: "How Well Do You Know the Bride, dirty truth or dare, Never Have I Ever, a night-out scavenger hunt and Most Likely To are the classics. All of them are on this page and free." },
      { q: "Are there dirty bachelorette games?", a: "Yes. Turn the spicy meter on the Bride Edition deck up to Filthy or Nasty for genuinely dirty truths and dares. Those levels are 18+ and sit behind an age check." },
      { q: "How does the bride quiz work?", a: "The maid of honor picks the right answers and gets a link. Everyone opens it on their own phone, plays, and lands on a live leaderboard." },
      { q: "Do we need to print anything?", a: "No. Every game runs on your phones. A few classics like pin the junk need a poster if you want them." },
      { q: "Are these games free?", a: "Yes. The first few 18+ cards are free to try; a 24-hour Party Pass unlocks every 18+ deck for the night." },
    ],
    related: [
      { href: "/18-plus-party-games", label: "18+ party games", emoji: "🔥" },
      { href: "/questions/dirty-truth-or-dare-questions", label: "Dirty truth or dare", emoji: "😈" },
      { href: "/bridal-shower-games", label: "Bridal shower games", emoji: "💐" },
      { href: "/drinking-games", label: "Drinking games", emoji: "🍻" },
      { href: "/questions/juicy-never-have-i-ever-questions", label: "Juicy Never Have I Ever", emoji: "🙈" },
      { href: "/most-likely-to-game", label: "Most Likely To voting game", emoji: "👉" },
    ],
  },

  "baby-shower-games": {
    path: "/baby-shower-games",
    title: "Baby Shower Games: 22 Fun Games (No Printing Needed)",
    description:
      "22 baby shower games you can play on your phone: a baby prediction pool, The Price Is Right baby edition, nursery rhyme emoji quiz and classic shower games. Free.",
    h1: "Baby Shower Games",
    intro: [
      "Baby shower games without a printer in sight. Open a baby prediction pool everyone fills in from their own phone, play The Price Is Right with real baby gear, or shout out nursery rhymes from emoji.",
      "Everything is free, works for in-person and virtual showers, and keeps score for you.",
    ],
    picksHeading: "More games for the shower",
    picks: [
      { slug: "trivia", why: "A quick team quiz between gift opening." },
      { slug: "would_you_rather", why: "Gentle icebreakers for guests who've just met." },
      { slug: "how-well-do-you-know-me", why: "Test how well the parents-to-be know each other." },
      { slug: "charades", why: "Act out baby-themed words and movies." },
    ],
    ideas: [
      {
        heading: "Baby shower games on your phone",
        items: [
          { name: "Baby prediction pool", how: "Our pool above: guests guess the birth date, weight, hair and more on their own phones. After the birth, you enter the results and crown a winner.", players: "Any" },
          { name: "The Price Is Right, baby edition", how: "Our game above: guess what baby gear costs. Closest without going over earns a bonus.", players: "Any" },
          { name: "Nursery rhyme emoji quiz", how: "Our flashcards above: 🐑⚫🧶 is Baa Baa Black Sheep. Shout it, then reveal.", players: "Any" },
          { name: "How well do you know the parents?", how: "Build a quiz about the parents-to-be and send guests the link. Live leaderboard included.", players: "3-50" },
        ],
      },
      {
        heading: "Classic baby shower games",
        items: [
          { name: "Guess the bump", how: "Everyone cuts a length of string they think fits around the bump. Closest wins.", players: "Any", needs: "String, scissors" },
          { name: "Baby food taste test", how: "Label jars by number. Guests taste and guess the flavor.", players: "Any", needs: "Baby food jars, spoons" },
          { name: "Diaper raffle", how: "Each pack of diapers a guest brings is a raffle ticket for a prize.", players: "Any", needs: "Diapers, prizes" },
          { name: "Baby photo match", how: "Guests bring baby photos. Everyone guesses who's who.", players: "Any", needs: "Baby photos" },
          { name: "Don't say 'baby'", how: "Everyone gets a clothespin. Say 'baby' and anyone who hears it takes your pin. Most pins wins.", players: "Any", needs: "Clothespins" },
          { name: "Dirty diaper", how: "Melt a different chocolate bar in each diaper. Guests sniff and guess the candy.", players: "Any", needs: "Diapers, chocolate bars" },
          { name: "Advice cards", how: "Guests write their best (and funniest) parenting advice for the parents-to-be.", players: "Any", needs: "Cards" },
          { name: "Bottle chugging race", how: "Fill baby bottles with juice or something stronger and race to finish.", players: "Any", needs: "Baby bottles" },
        ],
      },
    ],
    promptsHeading: "Baby shower icebreaker questions",
    prompts: [
      "What's the best parenting advice you've ever heard?",
      "Who do you think the baby will look like?",
      "What was your favorite toy as a kid?",
      "What's a lullaby you still know all the words to?",
      "What's one thing you hope the baby inherits from each parent?",
      "What's the funniest baby name you've ever heard?",
    ],
    tipsHeading: "How to run baby shower games",
    tips: [
      "Send the prediction pool link with the invitation so guests guess before the shower, then reveal the leaderboard after the birth.",
      "Play two or three short games, not ten. Gift opening is the main event.",
      "For virtual showers, share the quiz and pool links in the chat and screen-share the leaderboard.",
    ],
    faq: [
      { q: "What are the best baby shower games?", a: "A baby prediction pool, The Price Is Right, guess the bump and baby food taste test are crowd favorites. The first three on this page play on your phone." },
      { q: "Are there baby shower games without printing?", a: "Yes. Every game at the top of this page runs on phones, so there's nothing to print." },
      { q: "Do baby shower games work virtually?", a: "Yes. Send the prediction pool or quiz link in the video-call chat and everyone plays on their own phone." },
      { q: "How does the prediction pool pick a winner?", a: "After the birth, the host enters the real results. Everyone's guesses are scored on how close they were, and the leaderboard updates instantly." },
    ],
    related: [
      { href: "/bridal-shower-games", label: "Bridal shower games", emoji: "💐" },
      { href: "/birthday-party-games", label: "Birthday party games", emoji: "🎂" },
      { href: "/questions/trivia-questions-for-kids", label: "Trivia for kids", emoji: "🧒" },
      { href: "/questions/get-to-know-you-questions", label: "Get to know you questions", emoji: "👋" },
    ],
  },

  "bridal-shower-games": {
    path: "/bridal-shower-games",
    title: "Bridal Shower Games: 20 Fun Games (He Said She Said & Bingo)",
    description:
      "20 bridal shower games: He Said She Said with a live leaderboard, bridal bingo cards for every guest, How Well Do You Know the Couple and classic shower games. Free.",
    h1: "Bridal Shower Games",
    intro: [
      "Bridal shower games that work for grandmas and college friends alike. Run He Said She Said with a live leaderboard, hand every guest their own bridal bingo card, or quiz the room on the couple.",
      "No printing required: everything runs on phones, and you can print the bingo cards if you prefer paper.",
    ],
    picksHeading: "More games for the shower",
    picks: [
      { slug: "how-well-do-you-know-me", why: "A pass-the-phone quiz for the bride and her partner." },
      { slug: "would_you_rather", why: "Wedding-season icebreakers for mixed guests." },
      { slug: "trivia", why: "A quick team quiz between gifts." },
      { slug: "charades", why: "Act out wedding movies and love songs." },
    ],
    ideas: [
      {
        heading: "Bridal shower games on your phone",
        items: [
          { name: "He Said, She Said", how: "Our quiz above: read a quote and guess whether the bride or groom said it. Everyone plays on their own phone with a live leaderboard.", players: "3-60" },
          { name: "Bridal bingo", how: "Our bingo above: every guest gets their own card and marks gifts as the bride opens them. Card shouts BINGO for you.", players: "Any" },
          { name: "How well do you know the couple?", how: "A quiz about how they met, the proposal and the honeymoon, with leaderboard.", players: "3-60" },
        ],
      },
      {
        heading: "Classic bridal shower games",
        items: [
          { name: "Toilet paper wedding dress", how: "Teams design a wedding dress out of toilet paper in ten minutes. The bride judges.", players: "Teams", needs: "Toilet paper, tape" },
          { name: "What's in your purse?", how: "Call out items; the first guest to produce each one scores a point.", players: "Any", needs: "Purses" },
          { name: "Wedding emoji pictionary", how: "Describe wedding words and movies in emoji only.", players: "Any" },
          { name: "Bouquet toss, shower edition", how: "Toss a ribbon bouquet made from the gift bows. Catcher keeps it.", players: "Any", needs: "Gift bows" },
          { name: "Love song lyrics", how: "Read a line from a love song; first to name the song scores.", players: "Any" },
          { name: "Date night jar", how: "Everyone writes a date idea for the couple to open over their first year.", players: "Any", needs: "Jar, cards" },
          { name: "Ring hunt", how: "Hide plastic rings around the room. Most found by the end wins.", players: "Any", needs: "Plastic rings" },
          { name: "Marriage advice cards", how: "Guests write their best (and funniest) marriage advice for the bride to read later.", players: "Any", needs: "Cards" },
        ],
      },
    ],
    promptsHeading: "Bridal shower icebreaker questions",
    prompts: [
      "How do you know the bride?",
      "What's the best wedding you've ever been to, and why?",
      "What's your best piece of marriage advice?",
      "Where do you think the couple will be in ten years?",
      "What song should be their first dance?",
      "What's your favorite memory with the bride?",
    ],
    tipsHeading: "How to run bridal shower games",
    tips: [
      "Hand out bingo before gift opening so guests stay engaged through every present.",
      "Ask the couple the He Said She Said questions a week before and enter the answers in the quiz.",
      "Keep games short and mixed: one phone game, one hands-on game, then gifts.",
    ],
    faq: [
      { q: "What are the best bridal shower games?", a: "He Said She Said, bridal bingo, How Well Do You Know the Couple and the toilet paper wedding dress are the crowd favorites." },
      { q: "How does He Said She Said work?", a: "Ask the bride and groom questions beforehand, enter who said what, and send guests the link. Everyone guesses on their own phone and a live leaderboard shows the winner." },
      { q: "Can I print the bingo cards?", a: "Yes. Tap Print to print your card, or tap New card for a fresh one per guest." },
      { q: "Are these games appropriate for older relatives?", a: "Yes. Everything on this page is clean. For a spicier party, see our bachelorette party games." },
    ],
    related: [
      { href: "/bachelorette-party-games", label: "Bachelorette party games", emoji: "💍" },
      { href: "/baby-shower-games", label: "Baby shower games", emoji: "👶" },
      { href: "/questions/would-you-rather-questions-for-couples", label: "Would You Rather for couples", emoji: "💘" },
      { href: "/valentines-day-games", label: "Valentine's Day games", emoji: "💞" },
    ],
  },

  "valentines-day-games": {
    path: "/valentines-day-games",
    title: "Valentine's Day Games for Couples & Galentine's (Spicy & Sweet)",
    description:
      "Valentine's Day games for couples and Galentine's: a couples quiz that scores how in sync you are, a 5-level spicy truth or dare deck, and date-night games. Free.",
    h1: "Valentine's Day Games",
    intro: [
      "Valentine's Day games for two, or for the whole Galentine's crew. Find out how in sync you really are with the couples quiz, then turn the spicy meter up on the couples deck when the candles are lit.",
      "Free, private and on one phone. The spiciest levels are 18+ and behind an age check.",
    ],
    note: "Spicy levels 3-5 are 18+. Agree the vibe together, and skip anything, any time.",
    picksHeading: "More date-night games",
    picks: [
      { slug: "how-well-do-you-know-me", why: "Answer for each other in secret, then compare." },
      { slug: "would_you_rather", why: "Switch to the couples pack for deep and silly dilemmas." },
      { slug: "truth_or_dare", why: "Couples truth or dare with an optional 18+ pack." },
      { slug: "never_have_i_ever", why: "Confessions for two." },
      { slug: "rock-paper-scissors", why: "Decide who picks the movie." },
    ],
    ideas: [
      {
        heading: "Games for couples",
        items: [
          { name: "Couples quiz", how: "Our quiz above: both answer in secret on one phone, match for points, and get a sync score at the end.", players: "2" },
          { name: "Couples truth or dare", how: "Our five-level deck above, from sweet to very much not.", players: "2" },
          { name: "Love map questions", how: "Take turns asking about each other's dreams, fears and favorite memories.", players: "2" },
          { name: "Recreate your first date", how: "Same food, same music, same awkward conversation. Score each other on accuracy.", players: "2" },
          { name: "Blind taste test", how: "Blindfold your partner and feed them chocolates or wine. Guess right to win a kiss.", players: "2", needs: "Treats, blindfold" },
        ],
      },
      {
        heading: "Galentine's party games",
        items: [
          { name: "Most Likely To, Galentine's edition", how: "Who's most likely to text their ex tonight? Vote in secret, reveal together.", players: "3-12" },
          { name: "Worst date story contest", how: "Everyone tells their worst date. The group votes for the champion.", players: "4+" },
          { name: "Anti-Valentine's piñata", how: "Fill a heart piñata with candy and let the single friends take the first swings.", players: "Any", needs: "Piñata" },
          { name: "Rom-com charades", how: "Act out rom-com titles without speaking.", players: "6+" },
        ],
      },
    ],
    promptsHeading: "Valentine's questions for couples",
    prompts: [
      "What's your favorite memory of us?",
      "When did you know you liked me?",
      "What's one thing you want us to do together this year?",
      "What do I do that makes you feel most loved?",
      "What song reminds you of us?",
      "What's the best date we've ever been on?",
    ],
    tipsHeading: "Tips for Valentine's game night",
    tips: [
      "Start with the couples quiz to warm up, then move to the deck.",
      "Climb the spicy meter one level at a time, and agree you can both skip.",
      "Put the phones on do-not-disturb, except this one.",
    ],
    faq: [
      { q: "What games can couples play on Valentine's Day?", a: "A couples quiz, couples truth or dare, love map questions and a blind taste test are perfect for two." },
      { q: "What are good Galentine's party games?", a: "Most Likely To, a worst-date story contest and rom-com charades get the whole group laughing." },
      { q: "Are there spicy Valentine's games?", a: "Yes. Turn the couples deck up to Filthy or Nasty. Those levels are 18+ and behind an age check." },
      { q: "Are these games free?", a: "Yes. The first few 18+ cards are free; a 24-hour Party Pass unlocks every 18+ deck." },
    ],
    related: [
      { href: "/couples-games", label: "Couples games", emoji: "💘" },
      { href: "/questions/questions-to-ask-your-partner", label: "Questions to ask your partner", emoji: "💬" },
      { href: "/questions/would-you-rather-questions-for-couples", label: "Would You Rather for couples", emoji: "🤔" },
      { href: "/18-plus-party-games", label: "18+ party games", emoji: "🔥" },
    ],
  },

  "birthday-party-games": {
    path: "/birthday-party-games",
    title: "Birthday Party Games for Adults, Teens & Kids (25 Ideas)",
    description:
      "25 birthday party games for adults, teens and kids: Pass the Present, How Well Do You Know the Birthday Person, a 21st birthday deck and a birthday scavenger hunt. Free.",
    h1: "Birthday Party Games",
    intro: [
      "Birthday party games for every age. Pass the Present around the room, quiz everyone on the birthday person with a live leaderboard, or turn the spicy meter up on the adult birthday deck for a 21st or a 30th.",
      "Everything is free and runs on phones. Kids, teens and adults each have their own section below.",
    ],
    note: "Adult birthday deck levels 3-5 are 18+.",
    picksHeading: "More birthday games",
    picks: [
      { slug: "most_likely_to", why: "Everyone points at who's most likely to forget their own birthday." },
      { slug: "trivia", why: "A quick team quiz while the cake is cut." },
      { slug: "pirate-barrel", why: "Fast, silly and great for kids." },
      { slug: "truth_or_dare", why: "Teen and adult packs for later in the night." },
      { slug: "charades", why: "Works for every age." },
      { slug: "rock-paper-scissors", why: "Who gets the first slice? Settle it." },
    ],
    ideas: [
      {
        heading: "Birthday games for adults",
        items: [
          { name: "How well do you know the birthday person?", how: "Our multi-phone quiz above with a live leaderboard.", players: "3-50" },
          { name: "Adult birthday deck", how: "Our five-level deck above: perfect for a 21st, 30th or any birthday that ends at 3am.", players: "3+" },
          { name: "Birthday scavenger hunt", how: "Our checklist above: free desserts, stranger serenades and DJ shout-outs for points.", players: "Teams" },
          { name: "Roast and toast", how: "Everyone gets 30 seconds to roast the birthday person, then 30 to toast them.", players: "4+" },
          { name: "Guess the year", how: "Play songs from the birthday person's life. Guess the year each came out.", players: "Any" },
        ],
      },
      {
        heading: "Birthday games for teens",
        items: [
          { name: "Pass the Present", how: "Our hot-potato game above. Whoever's holding the phone when it goes off does the challenge.", players: "4+" },
          { name: "Truth or dare for teens", how: "Funny truths and harmless dares from our teens list.", players: "4+" },
          { name: "TikTok dance-off", how: "Everyone learns a trend in five minutes and performs it. Birthday person judges.", players: "Any" },
          { name: "Most Likely To vote", how: "Our secret-vote game: who's most likely to be famous?", players: "3-12" },
        ],
      },
      {
        heading: "Birthday games for kids",
        items: [
          { name: "Musical statues", how: "Dance while the music plays; freeze when it stops. Anyone who moves is out.", players: "4+", needs: "Music" },
          { name: "Pass the parcel", how: "Wrap a prize in many layers with a small treat in each. Unwrap a layer when the music stops.", players: "5+", needs: "Layered parcel" },
          { name: "Treasure hunt", how: "Hide clues around the house that lead to a prize.", players: "3+", needs: "Clues, prize" },
          { name: "Pirate Barrel", how: "Our 3D game: take turns throwing knives into the barrel until the pirate flies.", players: "2-20" },
          { name: "Balloon stomp", how: "Tie a balloon to each ankle. Pop everyone else's, keep yours.", players: "4+", needs: "Balloons, string" },
        ],
      },
    ],
    promptsHeading: "Birthday questions to ask the guest of honor",
    prompts: [
      "What's the best birthday you've ever had?",
      "What do you want to do before your next birthday?",
      "What's the best gift you've ever received?",
      "What age did you feel most grown-up?",
      "What advice would you give your younger self?",
      "What's on your bucket list this year?",
    ],
    tipsHeading: "How to run birthday party games",
    tips: [
      "Send the birthday quiz link with the invite so guests play before the party, then reveal the leaderboard with the cake.",
      "Match the game to the hour: kids' games early, the adult deck after dinner.",
      "Let the birthday person veto one card or challenge all night.",
    ],
    faq: [
      { q: "What are fun birthday party games for adults?", a: "How Well Do You Know the Birthday Person, roast and toast, the adult birthday deck and a bar scavenger hunt are all big hits." },
      { q: "What games are good for a 21st birthday?", a: "The adult birthday deck (turn the meter up), a birthday scavenger hunt and Pirate Barrel shots." },
      { q: "What birthday games work for kids?", a: "Musical statues, pass the parcel, treasure hunts, balloon stomp and our 3D Pirate Barrel." },
      { q: "Are these games free?", a: "Yes, every game on this page is free. The first few 18+ cards are free too; a Party Pass unlocks the rest." },
    ],
    related: [
      { href: "/party-games-for-large-groups", label: "Games for large groups", emoji: "👥" },
      { href: "/questions/truth-or-dare-questions-for-teens", label: "Truth or dare for teens", emoji: "😈" },
      { href: "/questions/hot-seat-questions", label: "Hot seat questions", emoji: "🔥" },
      { href: "/18-plus-party-games", label: "18+ party games", emoji: "🔞" },
    ],
  },

  "werewolf-game": {
    path: "/werewolf-game",
    title: "Werewolf Game Online: Free Narrator App, One Phone or Every Phone",
    description:
      "Play Werewolf free in your browser. The app deals secret roles and narrates the night out loud, so everyone plays. One phone, or every phone in a Party Room. 4-20 players.",
    h1: "Werewolf Game",
    intro: [
      "The classic party game of lies and accusations, with a narrator that never has to sit out. The app deals secret roles, calls the werewolves, Seer and Doctor awake one by one in a spooky voice, then runs the day vote.",
      "Play on one phone in the middle of the table, or open a Party Room so everyone gets their secret role and votes on their own phone. Free, no app, no signup, 4 to 20 players.",
    ],
    picksHeading: "More games for a big group",
    picks: [
      { slug: "odd-one-out", why: "Another imposter game: one player doesn't know the secret word." },
      { slug: "most-likely-to-vote", why: "Secret votes, big reveal. A gentler way to accuse your friends." },
      { slug: "truth_or_dare", why: "For the eliminated players who need something to do." },
      { slug: "fake-news-factory", why: "Bluff your way through fake headlines." },
      { slug: "pirate-barrel", why: "Settle who narrates the next round." },
    ],
    ideas: [
      {
        heading: "How to play Werewolf",
        plain: true,
        intro: "The app is your narrator. Here's the flow of every round.",
        items: [
          { name: "Deal the roles", how: "Add everyone's names. Pass the phone around (or each player opens the room on their own phone) and secretly look at your role card." },
          { name: "Night falls", how: "Everyone closes their eyes. The narrator wakes the Werewolves, who silently pick a victim, then the Seer (who checks one player) and the Doctor (who protects one player)." },
          { name: "Morning", how: "Everyone wakes up and the narrator reveals who was eaten, or that the Doctor saved them. Dead players stay quiet from now on." },
          { name: "Day: discuss and vote", how: "The village argues about who the werewolves are. Then everyone votes, and the player with the most votes is out. A tie means nobody goes." },
          { name: "Repeat until someone wins", how: "The village wins when every werewolf is gone. The werewolves win when they equal or outnumber the villagers." },
        ],
      },
      {
        heading: "Werewolf roles",
        plain: true,
        items: [
          { name: "🐺 Werewolf", how: "Knows the other werewolves. Each night, the pack picks someone to eat. By day, pretends to be an innocent villager." },
          { name: "🧑‍🌾 Villager", how: "No special power, just instincts. Watch for nervous liars and vote the werewolves out." },
          { name: "🔮 Seer", how: "Each night, learns whether one player is a werewolf. Share it carefully: the wolves will come for you." },
          { name: "🩺 Doctor", how: "Each night, protects one player (even themselves). If the wolves pick that player, nobody dies." },
        ],
      },
      {
        heading: "How many werewolves?",
        plain: true,
        intro: "The app suggests this automatically, and you can change it.",
        items: [
          { name: "4-5 players", how: "1 werewolf, plus a Seer from 5 players." },
          { name: "6-9 players", how: "2 werewolves, a Seer and a Doctor." },
          { name: "10-14 players", how: "3 werewolves, a Seer and a Doctor." },
          { name: "15-20 players", how: "4 werewolves, a Seer and a Doctor." },
        ],
      },
      {
        heading: "House rules and variations",
        items: [
          { name: "Mafia", how: "Same game, city skin: the Mafia hunts civilians, a Detective investigates. Switch the theme above.", players: "4-20" },
          { name: "Hidden roles", how: "Turn off role reveals so nobody learns what an eliminated player was. Much harder for the village." },
          { name: "Speed rounds", how: "Shorten the day timer to one minute for chaotic, fast games." },
          { name: "Ghost hints", how: "Dead players may give one yes/no nod per game. Agree before you start." },
        ],
      },
    ],
    promptsHeading: "Lines to use when you're accused",
    prompts: [
      "If I were a werewolf, would I really be this bad at lying?",
      "The Seer checked me last night. Ask them.",
      "Why is everyone so quiet about the person who voted first?",
      "I protected someone last night. That's all I'm saying.",
      "Vote me out and you'll regret it tomorrow morning.",
      "Interesting how you knew exactly who died before the narrator said it.",
    ],
    tipsHeading: "Tips for a great game",
    tips: [
      "Play with 7-12 people for the best mix of chaos and strategy.",
      "Put the narrator phone in the middle with the volume up, or use a Party Room so night actions are silent taps on every phone.",
      "Everyone taps something at night in Party Room mode, so nobody can tell who the wolves are from who's busy.",
      "Talk a lot on day one. Quiet players are the most suspicious.",
    ],
    faq: [
      { q: "How do you play Werewolf?", a: "Everyone gets a secret role. At night the werewolves pick a victim while the Seer and Doctor use their powers. During the day everyone debates and votes someone out. The village wins by eliminating every werewolf; the werewolves win when they equal the villagers." },
      { q: "Do we need a narrator?", a: "No. The app narrates out loud and runs every phase, so everyone gets to play." },
      { q: "Can everyone use their own phone?", a: "Yes. Open a Party Room, share the code, and each player sees their secret role, makes night choices and votes on their own phone. The host's phone narrates." },
      { q: "How many players do you need for Werewolf?", a: "At least 4, and up to 20. It's best with 7 to 12." },
      { q: "What's the difference between Werewolf and Mafia?", a: "They're the same game with different themes. Werewolf has werewolves, villagers and a Seer; Mafia has the Mafia, civilians and a Detective. Switch the theme above." },
      { q: "Is this Werewolf game free?", a: "Yes, completely free in your browser. No app, no signup." },
    ],
    related: [
      { href: "/mafia-game", label: "Mafia party game", emoji: "🕴️" },
      { href: "/halloween-party-games", label: "Halloween party games", emoji: "🎃" },
      { href: "/party-games-for-large-groups", label: "Games for large groups", emoji: "👥" },
      { href: "/games/odd-one-out", label: "Odd One Out imposter game", emoji: "🕵️" },
      { href: "/party", label: "Party Rooms", emoji: "📱" },
    ],
  },

  "mafia-game": {
    path: "/mafia-game",
    title: "Mafia Party Game Online: Free Narrator, Roles on Every Phone",
    description:
      "Play the Mafia party game free online. The app deals secret roles (Mafia, Detective, Doctor, Civilians), narrates every night and runs the vote. One phone or every phone.",
    h1: "Mafia Party Game",
    intro: [
      "The Mafia party game with an automatic narrator: the app deals the roles, wakes the Mafia, the Detective and the Doctor one by one, then runs the town's vote. Nobody has to sit out to host.",
      "Play on one phone in the middle, or open a Party Room and everyone gets their secret role on their own phone. Free, no app, 4 to 20 players.",
    ],
    picksHeading: "More bluffing games",
    picks: [
      { slug: "odd-one-out", why: "Find the imposter who doesn't know the secret word." },
      { slug: "fake-news-factory", why: "Spot the made-up headline." },
      { slug: "most-likely-to-vote", why: "Secret votes and dramatic reveals." },
      { slug: "truth_or_dare", why: "Something for the players who got whacked early." },
    ],
    ideas: [
      {
        heading: "How to play Mafia",
        plain: true,
        items: [
          { name: "Get your role", how: "Add players, then everyone secretly looks at their role: Mafia, Detective, Doctor or Civilian." },
          { name: "Night", how: "Eyes closed. The Mafia silently pick a target, the Detective investigates one player, and the Doctor saves one." },
          { name: "Morning", how: "The narrator announces who was taken out, or that the Doctor saved them." },
          { name: "Day", how: "The town debates and votes. Most votes is out; a tie means nobody goes." },
          { name: "Win", how: "The town wins when the Mafia are all gone. The Mafia win when they equal the civilians." },
        ],
      },
      {
        heading: "Mafia roles",
        plain: true,
        items: [
          { name: "🕴️ Mafia", how: "Knows the other Mafia. Picks a target each night and lies through their teeth by day." },
          { name: "🧍 Civilian", how: "No powers. Read the room and vote out the Mafia." },
          { name: "🕵️ Detective", how: "Investigates one player each night and learns if they're Mafia." },
          { name: "🩺 Doctor", how: "Saves one player each night, themselves included." },
        ],
      },
    ],
    promptsHeading: "Things a guilty mobster would say",
    prompts: [
      "I was asleep the whole night, I swear.",
      "Why would the Mafia kill their own friend? Think about it.",
      "The Detective is bluffing. There's no way they checked me.",
      "Let's not rush the vote. We could be wrong.",
    ],
    tipsHeading: "Tips for running Mafia",
    tips: [
      "With 8+ players, use 2 Mafia, a Detective and a Doctor.",
      "Use Party Room mode so night choices are silent taps on everyone's phone.",
      "Hide roles when someone is out for an expert-level game.",
    ],
    faq: [
      { q: "How do you play Mafia?", a: "Players secretly get roles. At night the Mafia pick a target while the Detective and Doctor use their powers; by day the town debates and votes someone out. The town wins by removing all the Mafia." },
      { q: "How many players do you need for Mafia?", a: "4 to 20. It's best with 7 to 12." },
      { q: "Can we play Mafia on separate phones?", a: "Yes. Create a Party Room, share the code, and everyone sees their secret role and votes on their own phone." },
      { q: "Is Mafia the same as Werewolf?", a: "Yes, it's the same game with a different theme. Switch between them above." },
    ],
    related: [
      { href: "/werewolf-game", label: "Werewolf game", emoji: "🐺" },
      { href: "/party-games-for-large-groups", label: "Games for large groups", emoji: "👥" },
      { href: "/games/odd-one-out", label: "Odd One Out imposter game", emoji: "🕵️" },
      { href: "/halloween-party-games", label: "Halloween party games", emoji: "🎃" },
    ],
  },

  "most-likely-to-game": {
    path: "/most-likely-to-game",
    title: "Most Likely To Game: Free Secret-Vote Party Game Online",
    description:
      "Play Most Likely To online for free: everyone votes in secret on one phone, then see the animated reveal and awards. Funny, friends, couples and family packs.",
    h1: "Most Likely To Game",
    intro: [
      "The Most Likely To game, but nobody can see who pointed at who. Add your players, pass the phone, and everyone votes in secret. Then the bars race up, the winner gets crowned, and the arguing begins.",
      "Pick a pack below: funny, friends, couples or family. Free, one phone, no signup.",
    ],
    picksHeading: "More games like Most Likely To",
    picks: [
      { slug: "most_likely_to", why: "The classic point-on-three version with 18+ packs." },
      { slug: "never_have_i_ever", why: "Confessions with fingers down." },
      { slug: "truth_or_dare", why: "The other party essential." },
      { slug: "would_you_rather", why: "Two choices, everyone defends their pick." },
      { slug: "18plus", why: "For the dirty version, uncensored." },
    ],
    ideas: [
      {
        heading: "Ways to play Most Likely To",
        items: [
          { name: "Secret vote", how: "Our game above: pass the phone, vote in secret, reveal together. No grudges about who pointed at you.", players: "3-12" },
          { name: "Point on three", how: "The classic. Read the question, count to three, everyone points. Most fingers explains themselves.", players: "3+" },
          { name: "Drinking version", how: "Most votes takes a sip for every finger pointing at them.", players: "3+", needs: "Drinks" },
          { name: "Group chat version", how: "Post a question; everyone replies with a name. Tally at the end of the day.", players: "Any" },
          { name: "Couples version", how: "Both point at yourself or your partner. Match to score a point.", players: "2" },
        ],
      },
    ],
    promptsHeading: "Most Likely To questions to start with",
    prompts: [
      "Who's most likely to become famous?",
      "Who's most likely to cry at a commercial?",
      "Who's most likely to text their ex tonight?",
      "Who's most likely to survive a zombie apocalypse?",
      "Who's most likely to forget their own birthday?",
      "Who's most likely to get arrested first?",
    ],
    tipsHeading: "Tips for a great round",
    tips: [
      "Use real names, not nicknames, so the reveal lands.",
      "Mix harmless and savage questions to keep it fun.",
      "Anyone voted most likely three rounds in a row picks the next pack.",
    ],
    faq: [
      { q: "How do you play Most Likely To?", a: "Read a \"who's most likely to\" question and everyone votes for the player it fits best. In our version, votes are secret on one phone and revealed together." },
      { q: "How many players do you need?", a: "Three to twelve works best with the secret vote. The point-on-three version works with any number." },
      { q: "Is the Most Likely To game free?", a: "Yes. It runs in your browser for free, with no app and no signup." },
      { q: "Is there a dirty version?", a: "Yes. See our dirty most likely to questions (18+) or the Bride Edition deck on the bachelorette page." },
    ],
    related: [
      { href: "/questions/funny-most-likely-to-questions", label: "Funny most likely to questions", emoji: "😂" },
      { href: "/questions/most-likely-to-questions-for-friends", label: "For friends", emoji: "👯" },
      { href: "/questions/most-likely-to-questions-for-couples", label: "For couples", emoji: "💘" },
      { href: "/questions/most-likely-to-questions-for-family", label: "For family", emoji: "👨‍👩‍👧" },
      { href: "/questions/most-likely-to-questions-for-teens", label: "For teens", emoji: "📱" },
      { href: "/questions/dirty-most-likely-to-questions", label: "Dirty (18+)", emoji: "🔥" },
    ],
  },
};

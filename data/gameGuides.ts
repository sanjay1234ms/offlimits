/**
 * Standardised 7-section guide shown beneath every game and the wheel. The
 * heading structure is identical everywhere. The copy is written per title so
 * no two games share a sentence.
 *
 * Sections, in order:
 *  1. How to Play
 *  2. Host Playbook & Room Dynamics
 *  3. Game Features & Special Mechanics
 *  4. Roster Setup & Social Sharing
 *  5. Companion Wheel
 *  6. Frequently Asked Questions
 *  7. Play Next  (rendered from the catalog, not stored here)
 */

export interface GuideFaq {
  q: string;
  a: string;
}

export interface GameGuide {
  /** Section 1: numbered turn-by-turn steps. */
  howToPlay: string[];
  /** Section 2: host tips for this game's own social friction. */
  hostPlaybook: string[];
  /** Section 3: the twist and the mechanics. */
  features: string[];
  /** Section 4: roster plus 9:16 social sharing walkthrough. */
  rosterSharing: string[];
  /** Section 5: contextual companion wheel. */
  wheel: { title: string; options: string[] };
  /** Section 6: five to seven expandable Q&As. */
  faq: GuideFaq[];
}

export const GAME_GUIDES: Record<string, GameGuide> = {
  /* ===================== COMPETITIVE ENGINE GAMES ===================== */

  trivia: {
    howToPlay: [
      "Add everyone to the scoreboard bar. Solo, teams, or tap a number chip to drop in Player 1, Player 2, Player 3.",
      "Read the question aloud. Read it twice, same speed both times, then give the room a few seconds to lock in.",
      "Tap Reveal Answer. The answer flips onto the card.",
      "Tap +1 under whoever got it. Tap Nobody or Skip if the room whiffed.",
      "Tap Next Question and keep moving. The leaderboard updates as you go.",
      "Done? Hit Finish & Crown Winner for the podium and the share card.",
    ],
    hostPlaybook: [
      "Read every question at the same pace. Do not slow down on the ones you happen to know.",
      "Decide before you start whether a near miss counts. Then rule it the same way for your best friend and your worst enemy.",
      "Blurters wreck it. If someone shouts before you say lock in, that question is dead. No point, next card.",
      "If you are playing too, hand the reading around every few questions so nobody sits out the whole game.",
      "Phones stay down while people answer. If a question feels searchable, it is.",
    ],
    features: [
      "The host awards every question on the +1 row. No answer sheet, no admin, and the leaderboard is always live.",
      "The deck ramps up. Early cards are gifts, later ones bite, so a comeback is always on.",
      "The answer stays hidden until you tap. Run a written round, a shout-out round, or a steal round off the same deck.",
      "Scores start at zero every time you open Trivia. Nothing carries over from last night.",
    ],
    rosterSharing: [
      "Set the field with the GROUP SIZE pills in the filter card. 2-4 adds two players, 5-10 adds five, 11-20 adds eleven. Scale back down and it trims the untouched Player N slots, never a name you typed or anyone holding points.",
      "Tap any scoreboard pill, like Player 1 with a zero next to it, to rename it on the spot. Type Priya or Team Chaos, hit enter, and it changes everywhere at once: the bar, the +1 buttons, and the podium.",
      "When the round ends, tap Finish & Crown Winner, then Share the podium. You get a 9:16 card with the full standings and the winner's score. The Facebook, Instagram, and TikTok buttons send it to a Story or a feed post. Phones use the native share sheet. Desktop downloads the image and opens the app.",
    ],
    wheel: {
      title: "Trivia Tie-Breaker Wheel",
      options: [
        "Sudden death: first correct answer wins",
        "Name three world capitals",
        "Spell Mississippi backwards",
        "Higher or lower on a population",
        "Closest guess to a number wins",
        "Category picked by your opponent",
        "Category picked by you",
        "Double or nothing",
      ],
    },
    faq: [
      {
        q: "Two players tie for first. Who wins?",
        a: "Spin the Trivia Tie-Breaker Wheel below and run what it lands on. Sudden death, first correct answer takes it, is the cleanest call.",
      },
      {
        q: "Can we play in teams instead of solo?",
        a: "Yes. Rename the scoreboard pills to team names and give the +1 to the team that answered. The leaderboard, podium, and share card all behave the same.",
      },
      {
        q: "Someone joined halfway through, or a phone died.",
        a: "Tap + Add in the scoreboard bar and type the name. They start on zero. Nobody else's score moves.",
      },
      {
        q: "How do we reset scores without losing our player names?",
        a: "Tap Reset scores under the deck. It zeroes the tallies for this session and keeps the roster. Leaving Trivia resets scores too.",
      },
      {
        q: "Is there an alcohol-free version?",
        a: "Trivia is dry already. If you added drink penalties for wrong answers, swap them for the Companion Wheel forfeits, or a dunce cap that passes to whoever answers last.",
      },
      {
        q: "The share card will not post to Instagram.",
        a: "On desktop, Instagram cannot take a direct upload. OffLimits saves the 9:16 image, copies the caption, and opens instagram.com. Attach the saved image to a new Story. On a phone, pick Instagram in the share sheet.",
      },
      {
        q: "Can one person host and play?",
        a: "It works. Hand the reading around every few questions, and never give yourself a point on a question you read.",
      },
    ],
  },

  charades: {
    howToPlay: [
      "Add actors to the scoreboard. One pill per person, or one pill per team.",
      "The active actor taps the card to see their prompt, keeps it hidden, and taps Start for the 60-second timer.",
      "They act it out in silence. No talking, no mouthing words, no pointing at things in the room.",
      "The second someone shouts the right answer, the actor taps Got it.",
      "The Who scored this point row appears. Tap +1 for the guesser or their team. Tap Skip if the timer runs out with nothing.",
      "Pass the phone to the next actor. Keep going until you crown a winner.",
    ],
    hostPlaybook: [
      "The usual disaster: one loud person talking over the top while a quiet person's correct guess goes unheard. Say one voice at a time, and let the actor point at who they heard first.",
      "Be strict on the actor's silence. The first mouthed word ends that round with no point.",
      "Agree the gestures for syllables, sounds-like, and whole thing before round one so nobody burns fifteen seconds on setup.",
      "If an actor draws an impossible prompt, let them tap Skip once per turn for free. Better than a minute of flailing.",
      "Give a shy actor an easy start. Let them choose act or describe on their first turn only.",
    ],
    features: [
      "A hard 60-second timer with a ring that turns red near the end. It carries the pressure for you.",
      "Got it and Skip hand the call to the room, then drop you straight into the scoring row so the leaderboard never drifts.",
      "The prompt deck is built to be acted, not described. Silence is the whole game.",
      "Team play is first class. Rename the pills to team names and the podium crowns the team.",
    ],
    rosterSharing: [
      "The GROUP SIZE pills seed the actor list. 2-4 adds two, 5-10 adds five, 11-20 adds eleven. Trimming the filter only removes blank Player N slots, never a renamed one or one holding points.",
      "Tap a scoreboard pill to rename it. Use team names like Reds or The Mimes for team play. The name follows through to the Who scored buttons and the podium.",
      "Finish & Crown Winner, then Share the podium, builds the 9:16 recap with the final standings. Send it to Facebook, Instagram, or TikTok from the share row. Native sheet on phones, download and open on desktop.",
    ],
    wheel: {
      title: "Actor Handicap Wheel",
      options: [
        "One hand behind your back",
        "No floor work, stay standing",
        "Face away from the room",
        "Thirty seconds, not sixty",
        "Stay seated the whole time",
        "Slow motion only",
        "Add a limp",
        "Free pass, normal round",
      ],
    },
    faq: [
      {
        q: "What counts as talking?",
        a: "Any word, a hum with a recognisable tune, or lip syncing. Pointing at real objects in the room is out too. Miming an object in the air is fine.",
      },
      {
        q: "The guess landed a second after the buzzer. Point or not?",
        a: "Host's call, made the same way every time. The fair default: if Got it was not tapped before the ring hit zero, it is a Skip.",
      },
      {
        q: "Can we play teams of three or four?",
        a: "Yes. One actor per turn, the rest of the team guesses, and only that team can score on that turn. Rename the pills to team names.",
      },
      {
        q: "How does it scale for a big group?",
        a: "Tap 11-20 or 20+ on the GROUP SIZE pills to seed a longer actor list, then rename as people arrive. Turn order follows the pill order.",
      },
      {
        q: "Alcohol-free?",
        a: "Charades is dry already. If you had drinking forfeits for failed acts, swap them for the Actor Handicap Wheel. The handicap is the penalty.",
      },
      {
        q: "Scores looked wrong after we reopened the game.",
        a: "Re-entering Charades always starts everyone at zero. Points only live during one unbroken session, so hit Finish & Crown before you leave if you want the recap.",
      },
      {
        q: "Instagram share is not opening the app.",
        a: "Desktop browsers cannot hand a file to Instagram, so we save the image, copy the caption, and open the website. On mobile, choose Instagram in the system share sheet.",
      },
    ],
  },

  buzzkill: {
    howToPlay: [
      "Add players or teams to the scoreboard bar.",
      "The clue-giver taps the card to see the target word and three forbidden words, then taps Start round for the 30-second timer.",
      "They describe the target out loud. Saying the target, any forbidden word, or an obvious version of one is a foul and scores nothing.",
      "Every clean guess: tap +1 for that guesser, then tap Next word and keep rolling until the buzzer.",
      "A foul ends that word. No point, move on.",
      "Rotate the clue-giver each round. Finish & Crown Winner when you are done.",
    ],
    hostPlaybook: [
      "You are the taboo referee. Watch the clue-giver's mouth, not the timer. A mumbled forbidden word still counts.",
      "Rule on obvious variants before round one. If slice is forbidden, slicing usually is too. Then hold that line all game.",
      "Fast talkers bury forbidden words in run-on sentences. Make them pause between clues if they are sprinting.",
      "Let the guessing team shout over each other. That is fine here, unlike Charades. Only the clue-giver is gagged.",
      "If a card is genuinely unfair for your group, the clue-giver can burn it once per turn with Next word. No foul, no point.",
    ],
    features: [
      "Three forbidden words per card. The constraint is the whole game. The deck is tagged by category and heat, from office-safe to 18+.",
      "A 30-second timer with a tick that speeds up and a hard buzzer.",
      "A tap-to-score strip that stays on screen, so you award points as fast as the team guesses.",
      "Foul calls are yours. The app tracks the clock and the score. You police the language.",
    ],
    rosterSharing: [
      "Seed the field with the GROUP SIZE pills. 2-4 adds two, 5-10 adds five, 11-20 adds eleven. Scaling down only trims untouched Player N slots.",
      "Rename any scoreboard pill on the spot. Tap it, type the real name or the team name, hit enter.",
      "Finish & Crown Winner, then Share the podium, gives you a 9:16 recap card for Facebook, Instagram, or TikTok. Mobile uses the native share sheet. Desktop downloads the image, copies the caption, and opens the site.",
    ],
    wheel: {
      title: "Buzzkill Hot Seat Selector",
      options: [
        "Player to the host's left gives clues",
        "Youngest in the room",
        "Last person to laugh",
        "Whoever's turn got skipped",
        "Eyes closed, point at random",
        "The current leader",
        "Whoever is lowest on points",
        "Dealer's choice",
      ],
    },
    faq: [
      {
        q: "Does a forbidden word from the guessing team count as a foul?",
        a: "No. Only the clue-giver is bound by the taboo list. Guessers can say anything.",
      },
      {
        q: "Are hand gestures allowed?",
        a: "Buzzkill is a talking game. Gestures are not on the list, but plenty of groups ban acting it out. Decide before round one.",
      },
      {
        q: "Plurals, tenses, root words?",
        a: "House rule, set up front. The common standard: any word that shares a root with a forbidden word is also forbidden.",
      },
      {
        q: "Scaling to twelve or more people?",
        a: "Tap 11-20 or 20+ to seed the roster, split into two or three teams, and rename the pills to team names. One clue-giver per team per round.",
      },
      {
        q: "Alcohol-free version?",
        a: "It is dry already. If you had a drink-on-a-foul rule, swap it for the fouling team skips their next turn, or a spin of the Hot Seat Selector.",
      },
      {
        q: "Points reset when we came back. Bug?",
        a: "That is intended. Buzzkill scores are session-only and start at zero on re-entry. Crown the winner before leaving to keep the recap card.",
      },
      {
        q: "TikTok share did nothing on my laptop.",
        a: "Desktop cannot push a file into TikTok, so we download the 9:16 card, copy the caption, and open tiktok.com. Upload the saved image there. On a phone, the share sheet lets you pick TikTok.",
      },
    ],
  },

  "fast-5": {
    howToPlay: [
      "Add players to the scoreboard bar.",
      "The active player taps Start 5 seconds. A category appears, like Name 5 breakfast foods, and the five-second countdown starts right away.",
      "They have to blurt five valid items before the buzzer. No hesitating, no repeats.",
      "Buzzer or Stop brings up the Who named five in time row. Tap +1 if they made it. Tap Skip if they choked.",
      "Tap New category and pass to the next player.",
      "Finish & Crown Winner for the podium.",
    ],
    hostPlaybook: [
      "You judge valid and in time. Call it fast and call it the same for everyone. This game lives on consistency.",
      "Under pressure, people trail off. Decide whether the fifth item counts if it lands after the buzzer. Default: it must be fully out first.",
      "Repeats and near repeats, like a dog then a puppy, are the classic argument. Rule once, out loud, and hold it.",
      "Start the countdown the instant the category is read, not when the player says ready.",
      "For a nervous player, let the room count the five out loud with them on their first turn only.",
    ],
    features: [
      "A brutal five-second timer. This is recall under pressure, not a knowledge quiz.",
      "The category deck is tagged by audience and heat, from things in a fridge to spicier prompts.",
      "One-tap adjudication straight into scoring, so the leaderboard never lags.",
      "Session scores wipe on every re-entry, so each sitting is a clean contest.",
    ],
    rosterSharing: [
      "The GROUP SIZE pills seed the player list. 2-4 adds two, 5-10 adds five, 11-20 adds eleven. Clearing the filter or picking a smaller tier only trims the leftover Player N slots.",
      "Tap a scoreboard pill to rename it. Player 3 becomes Dani in two seconds, and the name carries into the scoring buttons and the podium.",
      "Finish & Crown Winner, then Share the podium, gives you a 9:16 recap card with the standings for Facebook, Instagram, or TikTok. Native sheet on phones, download and open on desktop.",
    ],
    wheel: {
      title: "Fast 5 Sudden-Death Wheel",
      options: [
        "Name five in three seconds",
        "Name six, not five",
        "Opponent picks your category",
        "Name five with no repeated first letters",
        "Name five with your eyes closed",
        "Winner names five, loser has to beat it",
        "Name five in a category you have never heard of",
        "Free replay",
      ],
    },
    faq: [
      {
        q: "Does trailing off past the buzzer count?",
        a: "Host's call. The fair default: the fifth item must be fully out before the buzzer sounds.",
      },
      {
        q: "Are a dog and a puppy two items?",
        a: "Set a repeat rule before you start. Most groups say no, same thing, one item.",
      },
      {
        q: "Player count for a big party?",
        a: "Tap 11-20 or 20+ on GROUP SIZE, rename pills as people join, and run the turn order top to bottom.",
      },
      {
        q: "How do I reset scores mid-session?",
        a: "Reset scores under the deck zeroes the tallies and keeps the names. Leaving Fast 5 resets automatically.",
      },
      {
        q: "Sober version?",
        a: "Sober already. If you had a drink-on-a-choke rule, swap it for the Sudden-Death Wheel. Losing a spin is the punishment.",
      },
      {
        q: "The recap card did not reach Facebook.",
        a: "Facebook opens its share dialog in a popup, so allow popups for this site. The link and caption are pre-filled. Attach the downloaded image if the dialog asks.",
      },
    ],
  },

  "pirate-barrel": {
    howToPlay: [
      "Set how many players you have and pick a barrel size: 12 slots for a quick round, 24 for a long, tense one.",
      "The screen says whose turn it is. That player taps Throw a knife, taps the barrel, or taps a slot to aim. The knife spins in and sticks.",
      "The barrel shakes for a moment. If the pirate stays sitting, the phone goes to the next player.",
      "One slot is the trap, chosen at random each barrel. Whoever hits it launches the pirate off the barrel and loses the round.",
      "The loser takes the penalty you agreed on, then taps New barrel. The trap moves every time.",
    ],
    hostPlaybook: [
      "Agree the penalty before the first knife goes in. Arguing about it after the pirate flies is where the energy drops.",
      "Sit in a circle and pass the phone the same way every time, so nobody can claim they were skipped.",
      "Let the loser start the next barrel. It keeps the round moving and gives them a shot at revenge.",
      "Ban hovering. A player who hovers over the slots for ten seconds gets a five-second count from the room. Or just tap the barrel and let fate aim.",
      "With a big group, use 24 slots so most people get a turn before the pirate flies.",
    ],
    features: [
      "Every barrel hides the trap in a fresh random slot, so there is no pattern to learn and no safe favourite.",
      "Each knife spins in from a random side and the barrel shakes before the result, with sound and a buzz on phones that support it.",
      "The odds get worse with every knife. The last few players feel it, which is the whole point.",
      "Rounds take about a minute, so it fills the gap between bigger games or settles who goes first.",
    ],
    rosterSharing: [
      "Use the Players buttons to set the group size. The turn label counts Player 1, Player 2 and so on, so go round the circle in order.",
      "You can change the player count or the barrel size between rounds. Mid-round, the count stays locked so the turn order holds.",
      "No accounts and nothing saved. Close the tab and the next barrel starts fresh.",
    ],
    wheel: {
      title: "Pirate Barrel Penalty Wheel",
      options: [
        "Talk like a pirate until your next turn",
        "Do ten star jumps",
        "Sing the first line of any song",
        "Swap seats with the winner",
        "Go first in the next game",
        "Tell an embarrassing story",
        "Do your best pirate laugh",
        "Free pass this time",
      ],
    },
    faq: [
      {
        q: "Is the trap really random?",
        a: "Yes. A new trap slot is picked at random whenever you start a barrel or change its size. Nobody, including the phone holder, can see it.",
      },
      {
        q: "Is it like the Pop-Up Pirate toy?",
        a: "It plays the same way: blades go into the barrel until the pirate launches. You only need a phone, and the barrel resets in one tap.",
      },
      {
        q: "Can kids play?",
        a: "Yes. There is no text to read and nothing adult in the game itself. Pick a penalty that suits the group, or play with no penalty at all.",
      },
      {
        q: "How do we use it as a drinking game?",
        a: "For adults of legal drinking age only: whoever launches the pirate takes a sip. Never pressure anyone to drink, and keep a sober penalty on offer.",
      },
      {
        q: "Can I play alone?",
        a: "Set Players to 1 and see how many knives you can land before the pirate launches. Try to beat your best on the 24-slot barrel.",
      },
    ],
  },

  /* ===================== OTHER ENGINE GAMES ===================== */

  "odd-one-out": {
    howToPlay: [
      "Set the player count on the setup screen and tap Deal roles. Everyone passes the phone and checks their card in private.",
      "One player is the Odd One Out and never sees the secret word. Everyone else does.",
      "Go round the circle. Each player gives one clue about the word: vague enough to hide it, sharp enough to prove they know it.",
      "After a round or two of clues, everyone votes for who they think is the imposter.",
      "Reveal. Group catches the imposter, group wins. Imposter survives, or guesses the word, imposter wins.",
      "Deal fresh roles and go again.",
    ],
    hostPlaybook: [
      "One clue each, in order. No piling on, no interrupting.",
      "The real tell is usually the person whose clue is suspiciously generic, or suspiciously perfect.",
      "Do not let the loud confident players run the vote. Everyone commits in private, or points on three.",
      "If the imposter gets caught, let them try to guess the word for a consolation win. It keeps them in it.",
      "Rotate who deals so the same person is not always reading roles.",
    ],
    features: [
      "Hidden roles and social deduction. One imposter, no app scoring, all table talk.",
      "Private pass-to-reveal so nobody sees a role that is not theirs.",
      "Runs from three players to thirty.",
      "Plays stone-cold sober, or as a light drinking game. Imposter caught, group sips. Imposter wins, table sips.",
    ],
    rosterSharing: [
      "Odd One Out uses its own player-count stepper on the setup screen, not the scoreboard bar. There is nothing to score, so no roster is built.",
      "No names to rename. Players are just Player 1 to N for the pass order. Vote out loud or on a count.",
      "There is no auto recap card here, but a screenshot of the reveal screen makes a fine Story. Drop it into Facebook, Instagram, or TikTok yourself.",
    ],
    wheel: {
      title: "Odd One Out Clue Handicap Wheel",
      options: [
        "Your clue must be one word",
        "Your clue must be a question",
        "Clue in rhyme",
        "You go last this round",
        "Clue with your eyes closed",
        "Clue about a colour only",
        "Normal clue",
        "Skip your clue entirely",
      ],
    },
    faq: [
      {
        q: "How many imposters for a big group?",
        a: "One is standard up to about eight players. For ten or more, deal two imposters who do not know each other.",
      },
      {
        q: "The imposter guessed the word. Do they win?",
        a: "Yes. That is their win condition even after being voted out. Turn it off as a house rule if you prefer.",
      },
      {
        q: "Alcohol-free?",
        a: "It is a talking game, no drinking required. Track round wins on paper for a series champion.",
      },
      {
        q: "Can the Odd One Out just stay quiet?",
        a: "No. Everyone gives a clue. Silence is basically a confession.",
      },
      {
        q: "We cannot agree on the vote.",
        a: "Put a clock on it. Sixty seconds of talk, then everyone points on three. Majority rules. A tie means the imposter escapes.",
      },
      {
        q: "No share card appeared.",
        a: "Odd One Out does not make a recap card. Screenshot the reveal and post it yourself.",
      },
    ],
  },

  "fake-news-factory": {
    howToPlay: [
      "Each round, everyone sees the same real headline stem and secretly writes one convincing fake ending. The host notes the real one.",
      "Hand every answer to the host. They read all the fakes and the truth aloud, in random order.",
      "Players vote for the answer they think is real.",
      "Score it. A point for spotting the truth, plus a point for every player your fake fooled.",
      "Pass the phone, new stem, repeat for a set number of rounds.",
      "Highest total after the last round wins.",
    ],
    hostPlaybook: [
      "Read every answer in the same flat voice. The second you smirk at a fake, it is dead.",
      "Shuffle the slips or number them. Never read in submission order.",
      "Put a clock on writing time, sixty to ninety seconds, or the pace dies.",
      "Decide before round one whether pure joke answers are allowed. Plausible only rewards skill. Anything goes rewards chaos.",
      "Keep the running tally visible so people know when to bluff safe and when to bluff wild.",
    ],
    features: [
      "Write a lie, spot a lie. The app supplies the stems, the group supplies the deception.",
      "Double scoring rewards both truth spotting and successful fooling.",
      "Best at four to eight players, and it needs a dedicated reader.",
      "Naturally dry. It is a writing game.",
    ],
    rosterSharing: [
      "Track scores on paper, or in the scoreboard bar if you run it inside a competitive shell. Tap the GROUP SIZE pills to seed Player 1 to N and rename each pill to a real name.",
      "Rename by tapping a pill. The name follows into any recap.",
      "If you scored in the app, Finish & Crown Winner builds the 9:16 podium card for Facebook, Instagram, or TikTok. Otherwise, screenshot your paper tally.",
    ],
    wheel: {
      title: "Fake News Curveball Wheel",
      options: [
        "Your fake must contain a number",
        "Your fake must be under six words",
        "Write the fake in all caps",
        "Swap slips with your neighbour before reading",
        "The truth-teller reads their own aloud, last",
        "Double points this round",
        "Everyone writes two fakes",
        "Normal round",
      ],
    },
    faq: [
      {
        q: "Can a fake be a joke answer?",
        a: "Set it before round one. Plausible only rewards skill. Anything goes rewards comedy.",
      },
      {
        q: "Two players wrote near-identical fakes.",
        a: "Read both. Votes split between them, and both writers score anyone they fooled.",
      },
      {
        q: "Player count?",
        a: "Four to eight is the sweet spot. Below four there are not enough fakes. Above eight the read-out drags.",
      },
      {
        q: "How do we reset scores for a new game?",
        a: "In the app scoreboard, tap Reset scores. On paper, a new sheet.",
      },
      {
        q: "Alcohol-free?",
        a: "Completely. It is a pen and brain game.",
      },
      {
        q: "Share is not working.",
        a: "Only the app scoreboard makes a card. If you tallied on paper, screenshot it and post it to Facebook, Instagram, or TikTok yourself.",
      },
    ],
  },

  "miss-a-beat": {
    howToPlay: [
      "Sit in a circle and set a steady rhythm. Claps or thigh slaps, whatever the whole group can hold.",
      "Read the category on the card, like types of dog or movie villains.",
      "Going round the circle in time with the beat, each player names one valid item on their beat.",
      "Hesitate, repeat, break the rhythm, or name something invalid, and you are out for that round. Tap Mark someone out.",
      "Last player standing wins the round. Tap Next for a new category.",
      "First to an agreed number of round wins takes the game.",
    ],
    hostPlaybook: [
      "Set a rhythm the slowest person can keep. Too fast and it is a ten-second knockout.",
      "You keep the beat and you judge valid. Call it instantly. A slow ruling breaks the flow for everyone.",
      "Marginal answers, like is a wolf a type of dog, get ruled once and held.",
      "Restart the rhythm cleanly after every elimination so the next player is not rushed.",
      "For a big circle, split into two, run them at the same time, and final the two winners.",
    ],
    features: [
      "Rhythm and recall, with an elimination each round. No app timer. The group's beat is the clock.",
      "Category deck only. The pace and the pressure are all physical.",
      "Mark someone out is the only tap you need mid-round.",
      "Dry by default. With sips, one sip on the way out keeps it light, since rounds are short.",
    ],
    rosterSharing: [
      "There is no scoreboard mid-round. Eliminations are physical. For a series tally across rounds, use the scoreboard bar. The GROUP SIZE pills seed Player 1 to N, then rename each pill to a real name.",
      "Tap a pill to rename it. Give a point to each round winner and the names carry to any recap.",
      "Running the series in the scoreboard? Finish & Crown Winner makes the 9:16 card for Facebook, Instagram, or TikTok. Otherwise, screenshot the last-player-standing moment.",
    ],
    wheel: {
      title: "Miss a Beat Tempo Wheel",
      options: [
        "Double the tempo",
        "Half the tempo",
        "Reverse direction",
        "Skip every other player",
        "Category picked by them",
        "Two items per beat",
        "Silent beat, no claps",
        "Normal tempo",
      ],
    },
    faq: [
      {
        q: "Is a wolf a type of dog?",
        a: "Host rules once, out loud, and never revisits it. Consistency beats correctness.",
      },
      {
        q: "What exactly breaks the rhythm?",
        a: "Coming in late or early on your beat, a filled pause like uhh, a repeat, or an invalid answer. Any of them puts you out.",
      },
      {
        q: "Big group?",
        a: "Split into two circles, run them at the same time, then the two winners face off.",
      },
      {
        q: "Alcohol-free?",
        a: "Yes. It is clap and think. One sip on the way out is optional and stays gentle, since rounds are quick.",
      },
      {
        q: "How do we track a champion over many rounds?",
        a: "Use the scoreboard bar for a point per round win. Reset scores starts a fresh series.",
      },
      {
        q: "No recap card?",
        a: "Only if you scored the series in the app. Otherwise, screenshot and post it yourself.",
      },
    ],
  },

  "say-it-backwards": {
    howToPlay: [
      "The reader takes the phone and sees a short phrase plus a rough guide to saying it backwards.",
      "They say the phrase backwards out loud, sound by sound, as fast as they dare.",
      "Their team has a set window, thirty to forty-five seconds, to decode it and shout the real phrase.",
      "Got it in time, point to the team. Missed, no point, or pass to the other team for a steal.",
      "Swap readers and teams, next card.",
      "Highest score after the deck, or an agreed number of cards, wins.",
    ],
    hostPlaybook: [
      "Agree how backwards before you start. Full sound reversal and word-order reversal are very different difficulties.",
      "Time the guessing window on your phone and be strict. The clock is the tension.",
      "Let the reader go twice at most: once slow, once fast. Then lock the answer.",
      "If the team clearly has the phrase but flubs one word, that is a host call on whether it counts.",
      "Rotate readers so the same person is not always the one mangling their tongue.",
    ],
    features: [
      "Reverse speech decoding. The app gives the phrase and a guide, the reader supplies the chaos.",
      "Team versus team, with a steal on a miss.",
      "No app timer. The host runs the guessing window.",
      "Completely dry. The punishment is the laughter.",
    ],
    rosterSharing: [
      "Score it in the scoreboard bar if you are inside a competitive shell. The GROUP SIZE pills seed Player 1 to N. Rename them Team A and Team B.",
      "Tap a pill to rename it. Give the point to the decoding team.",
      "Finish & Crown Winner makes a 9:16 recap card for Facebook, Instagram, or TikTok. Or just screenshot the scoreline.",
    ],
    wheel: {
      title: "Say It Backwards Handicap Wheel",
      options: [
        "Reader gets one pass only",
        "Guessing window cut to twenty seconds",
        "Reader must whisper",
        "Reader goes once, full speed only",
        "Other team steals automatically on a miss",
        "Double points",
        "Reader holds their nose",
        "Normal round",
      ],
    },
    faq: [
      {
        q: "How backwards is backwards?",
        a: "Set it up front. Word-order reversal is easy mode. Full sound reversal is hard mode. Pick one and hold it.",
      },
      {
        q: "The team basically had it but said one word wrong.",
        a: "Host's call. Clearly the phrase with a minor flub usually counts. Guessed the topic does not.",
      },
      {
        q: "How many can play?",
        a: "Two teams of two to five. Bigger than that, add a third team and rotate.",
      },
      {
        q: "Alcohol-free?",
        a: "Yes. It is a tongue-twister game.",
      },
      {
        q: "Score reset?",
        a: "Reset scores in the scoreboard bar for a fresh match.",
      },
      {
        q: "Share card?",
        a: "Only if you scored in the app. Otherwise, screenshot the standings and post them yourself.",
      },
    ],
  },

  "how-well-do-you-know-me": {
    howToPlay: [
      "Two players. The phone shows a prompt about Player A.",
      "Both players write an answer in private. Player A writes the truth, Player B writes their guess.",
      "Reveal together. A match scores a point for the pair, or for Player B if you are keeping it competitive.",
      "Swap. The next prompt is about Player B.",
      "Alternate through the deck.",
      "Count the matches. A high score means you actually know each other.",
    ],
    hostPlaybook: [
      "It is a two-player game. In a bigger group, run it as a spectator round, one pair at a time, and let the room predict too.",
      "Both answers get written before either is read. Verbal first ruins it.",
      "Keep it kind. It is a bonding game, not a gotcha. Skip any prompt that is clearly a sore spot.",
      "Decide whether close counts before you start. The sequel or the original as a favourite film, for example.",
      "For couples, alternate who the prompt is about strictly so it does not become one-sided.",
    ],
    features: [
      "Two-player answer and compare. The deck is written for pairs who think they know each other.",
      "Write in private, then reveal, so nobody peeks.",
      "Score it as co-op, a shared total, or head to head, the guesser's points.",
      "Dry and low key. A date-night round, or a friendship check-up.",
    ],
    rosterSharing: [
      "It is a fixed two-hander, so there is no roster to build. Just Player A and Player B. Scoring head to head in the scoreboard bar? Rename the two pills to your names.",
      "Tap a pill to rename it inline.",
      "If you scored in the app, Finish & Crown Winner makes a 9:16 card of the result for Facebook, Instagram, or TikTok. Most pairs just screenshot the match count.",
    ],
    wheel: {
      title: "How Well Do You Know Me Twist Wheel",
      options: [
        "Answer out loud, no writing",
        "Wrong guess means you answer a bonus truth",
        "Best of three on this prompt",
        "Guess their answer, then explain why",
        "Swap: guess how they see you",
        "Double points",
        "Loser picks the next prompt",
        "Free skip",
      ],
    },
    faq: [
      {
        q: "We are a group of six. Can we still play?",
        a: "Run it one pair at a time with the rest as an audience that also guesses. Or use it as a tiebreaker after a group game.",
      },
      {
        q: "Does close count?",
        a: "Agree before you start. Same franchise or same vibe is a reasonable middle ground.",
      },
      {
        q: "Co-op or competitive?",
        a: "Your choice. Co-op, a shared match count, is friendlier. Head to head, the guesser scores, is spicier.",
      },
      {
        q: "Alcohol-free?",
        a: "Completely. It is a quiet connection game.",
      },
      {
        q: "Score reset?",
        a: "Reset scores in the scoreboard bar if you are playing head to head and want a rematch.",
      },
      {
        q: "Share?",
        a: "Only if you kept score in the app. Otherwise, screenshot your match count and post it.",
      },
    ],
  },

  /* ===================== PASS-THE-PHONE GAMES ===================== */

  would_you_rather: {
    howToPlay: [
      "Set the filter card. CATEGORY (Friends, Office, Couples, 18+), GROUP SIZE, VIBE, and the Spicy Meter.",
      "One phone goes round the circle. Read the two options aloud.",
      "Everyone commits to A or B out loud. No neither, no both.",
      "Go round again. Each person defends their pick in one sentence. Heckling encouraged.",
      "Tap Next Question and pass the phone left.",
      "Use Bail out for a forfeit spin if someone will not answer. Use Share to turn a spicy one into a 9:16 card.",
    ],
    hostPlaybook: [
      "Shut down it depends straight away. The whole game is forcing a bad choice. Count them down: three, two, one, pick.",
      "The fun is in the defence, not the vote. Make everyone justify their pick before you move on.",
      "Read the Spicy Meter with the room. Nudge it up when energy dips, drop it for a newcomer.",
      "If the group splits fifty-fifty, run a thirty-second debate and vote again.",
      "For 18+, check that everyone actually wants it before you flip the pack. One not for me means keep it at level two.",
    ],
    features: [
      "Two forced options per card, and the deck is built so both are genuinely bad.",
      "The Spicy Meter filters the deck live, level one to five, from cheeky to unhinged, with descriptions that match the category.",
      "The 18+ pack gives you three free preview cards, then the 24-Hour Party Pass unlocks the full deck across every game.",
      "A Bail out forfeit spinner and a per-card 9:16 Share card, so a great answer becomes a post.",
    ],
    rosterSharing: [
      "Would You Rather has no scoreboard. It is a pass-the-phone talker. The GROUP SIZE pills here steer the deck toward prompts that land for that many people. They do not build a player list.",
      "There is nothing to rename. The roster is whoever is in the circle, and turn order is physical. Pass left.",
      "Sharing is per card. Tap Share on any prompt for a 9:16 card with the question and OffLimits branding, then send it to Facebook, Instagram, or TikTok from the social row. Native share sheet on mobile, download and open on desktop.",
    ],
    wheel: {
      title: "Would You Rather Forfeit Wheel",
      options: [
        "Answer the next three with no defence allowed",
        "Swap your pick. You are living with B",
        "Let the group choose your answer",
        "Reveal your real reason",
        "Take the more embarrassing option, out loud",
        "Skip granted",
        "Everyone answers about you next round",
        "Do the loser's dare",
      ],
    },
    faq: [
      {
        q: "How do you play Would You Rather?",
        a: "Someone reads out two options, and every player has to pick one. No neither, no both. Then each person defends their choice in a sentence before you move to the next question. On OffLimits you tap for each new question and pass the phone along.",
      },
      {
        q: "What are good Would You Rather questions?",
        a: "The best ones make both options equally tempting or equally awful, so the room splits. The deck here has funny, hard, clean and couples questions, and the question lists page has ready-made sets for kids, work and couples.",
      },
      {
        q: "Can you play Would You Rather online for free?",
        a: "Yes. It runs in any phone or laptop browser with no download and no signup. Pass one phone around, or open a party room so everyone plays on their own phone.",
      },
      {
        q: "Is Would You Rather OK for kids?",
        a: "Yes. The game starts in a clean mode, and the Friends category with the Spicy Meter at one keeps every question family friendly. The 18+ pack stays locked behind an age check.",
      },
      {
        q: "Someone will not pick A or B.",
        a: "That is a Bail out. Tap it, spin the forfeit wheel, and they take what it lands on. Then they still answer.",
      },
      {
        q: "Can we vote and keep score?",
        a: "Not built in for pass-the-phone games. Run the majority pick as the room and tally on paper, or switch to a scored game.",
      },
      {
        q: "How do we make it clean for a family table?",
        a: "Set CATEGORY to Friends or Office and pin the Spicy Meter at one or two. The 18+ pack stays locked behind the age gate no matter what.",
      },
      {
        q: "What does GROUP SIZE change here?",
        a: "It weights the deck toward prompts that work for that headcount, small-group intimacy versus big-room chaos. It is not a player roster.",
      },
      {
        q: "The 18+ deck stopped after three cards.",
        a: "That is the free preview. Enter the access code or grab the 24-Hour Party Pass from the paywall to unlock the full deck everywhere for a day.",
      },
      {
        q: "My Share card will not copy to the clipboard.",
        a: "Some browsers block image clipboard writes. Use Save card instead and attach the file in your Story composer. The social buttons fall back to this automatically.",
      },
      {
        q: "Can two people share the same answer?",
        a: "Yes. No limit on how many pick A. The comedy is in why.",
      },
    ],
  },

  never_have_i_ever: {
    howToPlay: [
      "Set the filter card. CATEGORY, GROUP SIZE, VIBE, Spicy Meter. Everyone holds up a hand, or five to ten fingers.",
      "One phone circulates. Read the card: Never have I ever...",
      "Anyone who has done it puts a finger down, or takes the agreed sip or point.",
      "Fingers-down players can be asked to spill the story. Optional, but that is the whole game.",
      "Tap Next Question and pass the phone.",
      "Last person with a finger up wins the round. Use Share for a 9:16 card of a wild one.",
    ],
    hostPlaybook: [
      "Set the do you have to explain rule before card one. Finger down, no details required, keeps quieter players in.",
      "Do not let it turn into an interrogation of one person. If someone has taken five in a row, change the vibe or the category.",
      "Group memory is unreliable and competitive. If two people argue over whether something counts, the person it happened to decides.",
      "Nudge the Spicy Meter down the second someone looks cornered. This game can go from funny to raw in one card.",
      "For 18+, the age gate is not optional. Confirm out loud, not just tap through.",
    ],
    features: [
      "Confession-style prompts tagged by category and heat, with a Suggest confession helper for endless fresh rounds.",
      "The Spicy Meter filters live, level one to five. Level five is genuinely unfiltered.",
      "The 18+ pack gives three free previews, then the 24-Hour Party Pass.",
      "A per-card 9:16 Share card, stamped OffLimits Late Night Confession.",
    ],
    rosterSharing: [
      "No scoreboard. Never Have I Ever is a pass-the-phone confession game. GROUP SIZE steers the deck toward prompts that hit for that headcount. It does not create players.",
      "Nothing to rename. Track fingers or sips however your table likes. Turn order is physical.",
      "Tap Share on a standout card for a 9:16 recap, then send it to Facebook, Instagram, or TikTok from the social row. Mobile gives you the native picker. Desktop downloads the image and copies the caption.",
    ],
    wheel: {
      title: "Never Have I Ever Truth Wheel",
      options: [
        "Explain your last finger-down in full",
        "Name who you did it with",
        "Rate that story one to ten for regret",
        "Confess a related one nobody asked about",
        "Take an extra finger down",
        "Immunity, skip this one",
        "Everyone guesses your number first",
        "Pass the phone to the person you trust least",
      ],
    },
    faq: [
      {
        q: "Do you have to tell the story?",
        a: "Only if your house rule says so. Set it before you start. Finger down is enough is the inclusive default.",
      },
      {
        q: "We disagree on whether something counts.",
        a: "The person it happened to has the final say. Move on.",
      },
      {
        q: "Sober version?",
        a: "Play to fingers, not drinks. Last hand with a finger still up wins the round. Or track points and the lowest count wins.",
      },
      {
        q: "What does GROUP SIZE change?",
        a: "It weights the deck for the room size, not a player list. There is no roster in this game.",
      },
      {
        q: "Only three cards in the 18+ deck.",
        a: "That is the free preview limit. Unlock the full uncensored deck with the code or the 24-Hour Party Pass.",
      },
      {
        q: "Share to Instagram opened the website, not the app.",
        a: "That is the desktop fallback. The 9:16 image is saved and the caption copied. Attach it to a new Story. On a phone you get the native share sheet with Instagram in it.",
      },
      {
        q: "Can we keep score?",
        a: "Not natively for pass-the-phone. Count fingers-down on paper if you want a running loser.",
      },
    ],
  },

  most_likely_to: {
    howToPlay: [
      "Dial the filter card. CATEGORY, GROUP SIZE, VIBE, Spicy Meter.",
      "One phone goes round. Read: Who's most likely to...",
      "On the count of three, everyone points at the person they think fits best.",
      "Most fingers, that person owns it. They get ten seconds of right to reply.",
      "Tap Next Question, pass left. Toggle Hot Potato for a ten-second answer timer if the room stalls.",
      "Share a brutal callout as a 9:16 card.",
    ],
    hostPlaybook: [
      "Count three, two, one, point every time so nobody drifts their finger to follow the room.",
      "This is the game most likely to actually sting. Read the table. If the same person keeps getting picked, change category or drop the meter.",
      "No pointing at yourself, and no we all know it's Dave without a vote. Make everyone commit a finger.",
      "If two people tie on fingers, fifteen seconds of defence each, then the room points again.",
      "For couples or office packs especially, get a verbal yes we're good before you push past level three.",
    ],
    features: [
      "Point and accuse. The deck is tagged by audience and heat, with a Suggest scenario helper.",
      "Hot Potato, an optional ten-second countdown that forces a snap vote, with a buzzer.",
      "The Spicy Meter, level one to five, and the 18+ pack, three previews then the 24-Hour Party Pass.",
      "A Bail out forfeit spinner, plus a per-card 9:16 Share.",
    ],
    rosterSharing: [
      "No scoreboard here. It is a pass-the-phone accusation game. GROUP SIZE steers the deck toward prompts sized for the room, not a player list.",
      "Nothing to rename. Everyone in the circle is a target, and turn order is physical.",
      "Tap Share on a savage card for a 9:16 recap, then push it to Facebook, Instagram, or TikTok. Mobile: native share sheet. Desktop: the image downloads, the caption copies, and the app site opens.",
    ],
    wheel: {
      title: "Most Likely To Hot Seat Wheel",
      options: [
        "Most pointed-at this round owes a truth",
        "Vote again with everyone's eyes closed",
        "The accused picks the next card",
        "Everyone explains their vote",
        "The accused gets one veto token",
        "Double points-at this round",
        "Flip it: vote for who is least likely",
        "The accused spins a dare",
      ],
    },
    faq: [
      {
        q: "Two people got the same number of points.",
        a: "Fifteen seconds of defence each, then vote again. Still tied? Both own it.",
      },
      {
        q: "Can we keep a running tally of who gets picked most?",
        a: "Not built in for pass-the-phone. Use a tick sheet if you want a most accused loser at the end.",
      },
      {
        q: "It is getting personal. How do I cool it?",
        a: "Drop the Spicy Meter to one or two and switch CATEGORY to Office or Friends. Skip any card that is clearly aimed at one person.",
      },
      {
        q: "What does GROUP SIZE do?",
        a: "It weights the deck for the headcount. No roster is created.",
      },
      {
        q: "18+ locked after three cards.",
        a: "Preview limit. Unlock with the code or the 24-Hour Party Pass for the full deck across every game.",
      },
      {
        q: "The Hot Potato buzzer is not making a sound.",
        a: "Check the mute toggle in the top nav. Sound and haptics share one switch.",
      },
      {
        q: "Instagram share did not open the app.",
        a: "Desktop cannot hand a file to Instagram. The card is saved, the caption copied, and instagram.com opens for you to attach it. Mobile gives you the native picker.",
      },
    ],
  },

  truth_or_dare: {
    howToPlay: [
      "Open the filter card and choose your packs (Friends, Family, Couples, Office, New group, 18+), plus GROUP SIZE, VIBE, and the Spicy Meter.",
      "Set Turns a round: five, ten, twenty, or Endless.",
      "On your turn, tap Truth, Dare, or Let the phone pick. Keyboard: T, D, or space.",
      "Read the card and do it. A dare done or a truth answered, and you are clear.",
      "Chicken out? Tap Bail out for a forfeit spin. You take what it lands on instead.",
      "Pass the phone left. Use Share to turn a card into a 9:16 post.",
    ],
    hostPlaybook: [
      "Set the veto rule before turn one. One free pass per player per round, then every bail is a forfeit spin. Write it down so nobody argues later.",
      "You veto any dare that is dangerous or non-consensual, with no forfeit. Uncomfortable and unsafe are different. Push the first, protect the second.",
      "Keep the phone moving. The energy killer is a five-minute negotiation over one dare.",
      "Match the pack to the actual room. Couples at a work leaving-do is how you get an HR meeting.",
      "For 18+ packs, get consent out loud every time you raise the Spicy Meter, and honour a single no.",
    ],
    features: [
      "Two decks. A clean one (Friends, Family, Couples, Office, New group) and a full 18+ one, filtered together by pack, vibe, group size, and heat.",
      "A TRUTH or DARE badge on every card, plus a fifty-fifty Let the phone pick.",
      "A Bail out forfeit spinner for chicken-outs, and a Turns-a-round limiter so the game actually ends.",
      "18+ packs give three free preview cards, then the 24-Hour Party Pass unlocks everything for a day.",
    ],
    rosterSharing: [
      "No scoreboard. Truth or Dare is pass-the-phone. The GROUP SIZE pills steer the deck toward prompts that suit the headcount. They do not seed players.",
      "Nothing to rename. Turn order is physical, pass left, and Turns a round decides when it stops.",
      "Tap Share on any card for a 9:16 recap (OffLimits Dare, or OffLimits Late Night Confession), then send it to Facebook, Instagram, or TikTok. Native share sheet on mobile, download and open on desktop.",
    ],
    wheel: {
      title: "Punishment & Forfeit Wheel",
      options: [
        "Take two sips, or do two star jumps",
        "Let the group send a one-word text from your phone",
        "Thirty seconds of unbroken eye contact",
        "Do the dare you just chickened out of",
        "Swap seats with the person on your left",
        "Speak in an accent until your next turn",
        "Reveal your most-used emoji and send it to three people",
        "Free pass, this once",
      ],
    },
    faq: [
      {
        q: "How many times can someone chicken out?",
        a: "Your call as host. The standard: one clean pass per round, then every bail triggers the Punishment & Forfeit Wheel.",
      },
      {
        q: "A dare feels unsafe.",
        a: "You veto it outright, no forfeit, next card. Never spin the wheel to force an unsafe dare.",
      },
      {
        q: "Alcohol-free version?",
        a: "Every slice on the forfeit wheel has a non-drinking option built in, like two sips or two star jumps. Set it to physical and social forfeits only and it plays completely dry.",
      },
      {
        q: "How do we scale for a big group?",
        a: "GROUP SIZE weights the deck. Use Endless turns and keep passing. There is no player cap.",
      },
      {
        q: "The 18+ pack will not unlock.",
        a: "It is gated by the age confirmation and the three-card preview. Confirm you are 18+, then enter the code or buy the 24-Hour Party Pass.",
      },
      {
        q: "The card's TRUTH or DARE badge is missing.",
        a: "Let the phone pick still assigns one. The badge shows once the card is dealt. If you tapped Truth or Dare directly, it matches your choice.",
      },
      {
        q: "Share card exported but did not reach TikTok.",
        a: "Desktop downloads the 9:16 image and copies the caption, then opens tiktok.com for you to upload. On a phone, pick TikTok in the native share sheet.",
      },
    ],
  },

  this_or_that: {
    howToPlay: [
      "Set the filter card. CATEGORY, GROUP SIZE, VIBE, Spicy Meter.",
      "One phone circulates. Read the two options, fast.",
      "Everyone answers on instinct, out loud, at the same time. No thinking, no hedging.",
      "Quick reactions to the split, then move on. This is a warm-up, not a debate.",
      "Tap Next, pass left. Toggle Hot Potato for a ten-second snap-answer timer.",
      "Screenshot or Share a spicy one as a 9:16 card.",
    ],
    hostPlaybook: [
      "Speed is the point. If someone is stalling, that is a Bail out. Spin and move on.",
      "Keep a card landing every five to ten seconds. The moment it slows into analysis, the format is gone.",
      "Use it to loosen a cold room, then switch to Would You Rather or Truth or Dare once people are warm.",
      "Read the two options in the same tone. Do not telegraph the right answer.",
      "For 18+, ease in. This game's speed makes level five land harder than it does in slower games.",
    ],
    features: [
      "Binary snap choices. The deck is written for instinct, not reasoning.",
      "A Hot Potato ten-second timer with a buzzer for true rapid-fire rounds.",
      "The Spicy Meter, level one to five, and the 18+ pack, three previews then the 24-Hour Party Pass.",
      "A Bail out spinner and a per-card 9:16 Share.",
    ],
    rosterSharing: [
      "No scoreboard. This or That is a pass-the-phone quick-fire game. GROUP SIZE steers the deck for the room size, it does not build a roster.",
      "Nothing to rename. Everyone answers every card. Reading order is physical.",
      "Tap Share on a dilemma for a 9:16 card, then push it to Facebook, Instagram, or TikTok. Native sheet on mobile, download and open on desktop.",
    ],
    wheel: {
      title: "This or That Rapid-Fire Wheel",
      options: [
        "Answer the next five in three seconds each",
        "First word only, no hesitation",
        "Loser of the last split answers again",
        "Everyone must pick the unpopular option",
        "Flip it: pick what you would hate",
        "Speed round: ten cards, no reactions",
        "Explain one pick, then back to speed",
        "Free breather",
      ],
    },
    faq: [
      {
        q: "Someone keeps overthinking it.",
        a: "Bail out and spin. This game punishes deliberation.",
      },
      {
        q: "Can we keep score?",
        a: "Not for pass-the-phone. It is a warm-up. Run it for five minutes and move to a scored game.",
      },
      {
        q: "Clean mode for a mixed group?",
        a: "CATEGORY Friends or Office, Spicy Meter at one or two. The 18+ pack stays locked behind the age gate.",
      },
      {
        q: "GROUP SIZE, what is it for?",
        a: "Deck weighting for the headcount, not a player list.",
      },
      {
        q: "18+ stopped at card three.",
        a: "Free preview. Unlock with the code or the 24-Hour Party Pass.",
      },
      {
        q: "Share card will not post.",
        a: "Use Save card and attach the file yourself if your browser blocks the auto flow. Facebook needs popups enabled.",
      },
    ],
  },

  /* ===================== THE WHEEL ===================== */

  wheel: {
    howToPlay: [
      "Type or paste your options into the box, one per line or comma separated, then tap the plus or Enter. Each becomes a removable chip.",
      "Every chip is a slice. Add at least two.",
      "Tap Spin. The wheel speeds up, slows down, and stops on the winner under the pointer.",
      "Toggle Remove each winner after spinning for no-repeat draws: draft order, secret santa, elimination.",
      "Load a themed set from the ready-made wheel gallery, or a link like /wheel?preset=truth-or-dare.",
      "Toggle Sound for the spin and win effects.",
    ],
    hostPlaybook: [
      "For who goes first, add every name once and turn on remove after spin. Now you have a full random turn order in a few taps.",
      "For a decision with a heavy favourite, add the popular option twice and the underdog once. That weights it honestly.",
      "Keep slice labels short. Long text gets clipped on the wheel face, though the full label stays in the chip list.",
      "Screenshot the winner card for the group chat. It settles arguments better than trust me, I spun it.",
      "Paste, do not type. Build a big list in notes and dump it in with commas or newlines.",
    ],
    features: [
      "A pure SVG wheel. No assets, smooth deceleration, weighted by duplicate slices.",
      "A chip-based option editor with comma and newline batch add, and one-tap removal.",
      "Remove-winner mode for no-repeat draws, plus a ready-made preset library: Yes or No, What to Eat, Truth or Dare, Random Number 1 to 100, and more.",
      "Spin and win sound effects tied to the global mute toggle. The Truth-or-Dare preset also offers a Suggest a Truth or Dare helper on the result.",
    ],
    rosterSharing: [
      "The wheel's roster is just your slice list. There are no player accounts, and GROUP SIZE is not a factor. Add exactly as many names or options as you need.",
      "Rename a slice by removing its chip and re-adding the corrected text. Duplicates are allowed and act as weights.",
      "There is no auto 9:16 card for a plain spin. Screenshot the winner box and post it to Facebook, Instagram, or TikTok. When you run a game with a companion wheel, that game's Finish & Crown card produces the shareable recap.",
    ],
    wheel: {
      title: "Wheel of Wheels",
      options: [
        "Yes or No",
        "What Should We Eat?",
        "Who Goes First?",
        "Truth or Dare",
        "Random Number 1 to 100",
        "Heads or Tails",
        "Dares",
        "Chore Draw",
        "Movie Night Picker",
        "Forfeit Roulette",
      ],
    },
    faq: [
      {
        q: "Can I weight the odds?",
        a: "Yes. Add the option you want more likely multiple times. Three Pizza slices to one Salad is seventy-five percent pizza.",
      },
      {
        q: "How do I do a no-repeat draw (draft order, elimination)?",
        a: "Turn on Remove each winner after spinning. Each spin drops the winner from the list.",
      },
      {
        q: "My long option text is cut off on the wheel.",
        a: "The wheel face truncates for readability. The full label is kept in the chip list below.",
      },
      {
        q: "Where are the ready-made wheels?",
        a: "The Ready-made wheels section on the home page, or link straight in with /wheel?preset=truth-or-dare and friends.",
      },
      {
        q: "No sound on spin.",
        a: "Toggle Sound in the options panel, and check the global mute in the top nav. They are linked.",
      },
      {
        q: "Can I share the result?",
        a: "Screenshot the winner card. Full 9:16 recap cards come from the games (Finish & Crown Winner), not the standalone wheel.",
      },
      {
        q: "How many slices can it handle?",
        a: "In practice, up to about thirty before labels get too thin to read. The Random Number preset pushes a hundred and just shows numbers.",
      },
    ],
  },
};

/** The seven fixed section headings, in order. */
export const GUIDE_SECTIONS = [
  "How to Play",
  "Host Playbook & Room Dynamics",
  "Game Features & Special Mechanics",
  "Roster Setup & Social Sharing",
  "Companion Wheel",
  "Frequently Asked Questions",
  "Play Next",
] as const;

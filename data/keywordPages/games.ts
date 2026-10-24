import type { KeywordPage } from "./types";

export const GAME_PAGES: KeywordPage[] = [
  {
    path: "/questions/charades-ideas",
    title: "{n} Charades Ideas (Easy, Funny & Hard)",
    description:
      "{n} charades ideas for kids, families and adults: actions, animals, movies, jobs and sports, from easy to hard. Free printable list plus a charades game on your phone.",
    h1: "Charades Ideas",
    eyebrow: "🎭 Act it out",
    emojis: ["🎭", "🙊", "🎬"],
    intro:
      "{n} charades ideas sorted by category and difficulty. Pick the easy ones for kids, mix in movies for the adults, and save hard mode for the final round.",
    sections: [
      {
        heading: "Easy actions",
        items: [
          "Brushing your teeth", "Riding a bike", "Swimming", "Taking a selfie", "Walking a dog", "Eating spaghetti",
          "Flying a kite", "Playing the guitar", "Sneezing", "Fishing", "Juggling", "Climbing a ladder",
          "Blowing up a balloon", "Typing on a computer", "Making a sandwich",
        ],
      },
      {
        heading: "Animals",
        items: [
          "Elephant", "Monkey", "Kangaroo", "Penguin", "Snake", "Chicken", "Shark", "Giraffe", "Frog", "Crab",
          "Octopus", "Flamingo", "Sloth", "T-rex", "Bat",
        ],
      },
      {
        heading: "Movies and shows",
        items: [
          "Titanic", "Jaws", "The Lion King", "Finding Nemo", "Jurassic Park", "Star Wars", "Spider-Man",
          "Frozen", "The Wizard of Oz", "Harry Potter", "Toy Story", "Shrek", "The Little Mermaid",
          "Back to the Future", "Squid Game",
        ],
      },
      {
        heading: "Jobs",
        items: [
          "Firefighter", "Dentist", "Chef", "Pilot", "Magician", "Lifeguard", "Mail carrier", "Photographer",
          "Hairdresser", "Astronaut", "Construction worker", "Referee",
        ],
      },
      {
        heading: "Sports and hobbies",
        items: [
          "Bowling", "Surfing", "Skiing", "Boxing", "Golf", "Yoga", "Baseball", "Archery", "Weightlifting",
          "Figure skating", "Skateboarding", "Rock climbing",
        ],
      },
      {
        heading: "Hard mode",
        items: [
          "Assembling flat-pack furniture", "Parallel parking", "Getting stuck in a revolving door",
          "A cat that just knocked something off a table", "Losing your phone while holding it", "Stepping on a Lego",
          "Waiting for a slow elevator", "A waiter carrying too many plates", "Trying to open a jar that won't budge",
          "Sneaking back in after curfew",
        ],
      },
    ],
    howTo: [
      "Split into two teams.",
      "A player picks an idea without showing their team.",
      "They act it out in 60 seconds: no talking, no sounds, no pointing at objects.",
      "Their team shouts guesses. One point per correct guess, then the other team goes.",
    ],
    tips: [
      { title: "Learn the signals", body: "Hold up fingers for the number of words, tap your arm for which word, and cup your ear for \"sounds like\"." },
      { title: "Mix difficulty", body: "Put easy and hard ideas in the same hat so younger players can still score." },
    ],
    faq: [
      { q: "What are good charades ideas?", a: "Simple actions and animals for kids, famous movies for families, and everyday disasters like \"stepping on a Lego\" for adults. Mixing them keeps every age in the game." },
      { q: "What are the rules of charades?", a: "No talking, no sounds, no spelling with your fingers and no pointing at objects. You can use gestures to show the number of words and which word you're acting." },
    ],
    play: { href: "/games/charades", label: "Play Charades on your phone" },
    related: ["/questions/christmas-charades-ideas", "/questions/pictionary-words", "/games/charades", "/party-games-for-large-groups"],
    group: "games",
  },
  {
    path: "/questions/pictionary-words",
    title: "{n} Pictionary Words (Easy, Medium & Hard)",
    description:
      "{n} Pictionary words and drawing ideas sorted by difficulty: easy words for kids, medium for families and hard ones for adults. Free list for game night.",
    h1: "Pictionary Words",
    eyebrow: "✏️ Draw it",
    emojis: ["✏️", "🎨", "🖍️"],
    intro:
      "{n} Pictionary words and drawing ideas, from easy objects a five-year-old can draw to tricky ideas that will test the best artist in the room.",
    sections: [
      {
        heading: "Easy Pictionary words",
        items: [
          "Sun", "House", "Cat", "Tree", "Car", "Fish", "Apple", "Star", "Ball", "Flower", "Boat", "Moon",
          "Snowman", "Pizza", "Rainbow", "Hat", "Cloud", "Bird", "Cake", "Book", "Shoe", "Clock", "Kite",
          "Banana", "Spider",
        ],
      },
      {
        heading: "Medium Pictionary words",
        items: [
          "Lighthouse", "Volcano", "Skateboard", "Castle", "Robot", "Mermaid", "Treasure map", "Pirate",
          "Campfire", "Dragon", "Roller coaster", "Haunted house", "Hot air balloon", "Ice cream truck",
          "Waterfall", "Spaceship", "Scarecrow", "Unicorn", "Superhero", "Igloo", "Traffic jam", "Dentist",
          "Birthday party", "Sandcastle", "Thunderstorm",
        ],
      },
      {
        heading: "Hard Pictionary words",
        items: [
          "Gravity", "Daydream", "Jet lag", "Time travel", "Social media", "Echo", "Wi-Fi", "Procrastination",
          "Homesick", "Inflation", "Brainstorm", "Déjà vu", "Monday morning", "Peer pressure", "Black hole",
          "Sleepwalking", "Hide and seek", "Sunburn", "Shooting star", "Spring cleaning",
        ],
      },
      {
        heading: "Pictionary words for kids",
        items: [
          "Dinosaur", "Ladybug", "Lollipop", "Teddy bear", "Train", "Butterfly", "Octopus", "Crown",
          "Rocket", "Snail", "Bubble", "Cupcake", "Turtle", "Owl", "Popcorn",
        ],
      },
    ],
    howTo: [
      "Split into teams and grab paper or a whiteboard.",
      "The drawer picks a word without showing their team.",
      "Draw it in 60 seconds: no letters, numbers or talking.",
      "First correct guess scores a point for the team.",
    ],
    faq: [
      { q: "What are good Pictionary words?", a: "Concrete objects for easy rounds, scenes like \"traffic jam\" for medium, and abstract ideas like \"jet lag\" for hard. Pick the level to match your group." },
      { q: "Can you write letters in Pictionary?", a: "No. Drawings only: no letters, numbers or symbols that spell out the word." },
    ],
    play: { href: "/pickers/word", label: "Get a random word to draw" },
    related: ["/questions/charades-ideas", "/questions/christmas-charades-ideas", "/pickers/word", "/party-games-for-large-groups"],
    group: "games",
  },
  {
    path: "/questions/icebreaker-games-for-work",
    title: "{n} Icebreaker Games for Work (Quick & Fun)",
    description:
      "{n} icebreaker games for work meetings, new teams and virtual calls. Quick, inclusive and no awkward oversharing. Rules for each one, free.",
    h1: "Icebreaker Games for Work",
    eyebrow: "💼 Team building",
    emojis: ["💼", "🧊", "🤝"],
    intro:
      "{n} icebreaker games for work that take five to fifteen minutes, include everyone, and won't make anyone squirm. Most also work on video calls.",
    sections: [
      {
        heading: "Five-minute icebreakers",
        items: [
          "Two Truths and a Lie: everyone shares three facts, the team guesses the fake.",
          "This or That: rapid-fire pairs like coffee or tea, answered on instinct.",
          "One-word check-in: describe your week in one word, then explain only if you want to.",
          "Emoji status: everyone posts the emoji that sums up their mood in the chat.",
          "Desk show and tell: hold up one object near you and tell its story in 30 seconds.",
          "Would You Rather, work edition: office-safe dilemmas with a quick vote.",
        ],
      },
      {
        heading: "Team games (10 to 15 minutes)",
        items: [
          "Most Likely To: the team points at who's most likely to reply-all or bring snacks.",
          "Trivia sprint: five quick general knowledge questions, played in small teams.",
          "Guess the baby photo: everyone sends a childhood photo in advance and the team matches them.",
          "Common ground: in pairs, find three things you have in common that aren't about work.",
          "Shared playlist: everyone adds one song and the team guesses who picked each.",
          "Spin the wheel: put names on a wheel and spin to pick who answers the next question.",
        ],
      },
      {
        heading: "Virtual meeting icebreakers",
        items: [
          "Background tour: everyone explains one thing visible behind them.",
          "Scavenger hunt: give 30 seconds to fetch something blue, something old or something that makes them laugh.",
          "Rapid poll: run a silly poll in the meeting tool and reveal the results live.",
        ],
      },
    ],
    tips: [
      { title: "Keep it optional", body: "Allow a pass on any question. People open up more when they don't feel forced." },
      { title: "Time-box it", body: "Five minutes at the start of a meeting is enough. An icebreaker that runs long becomes a chore." },
    ],
    faq: [
      { q: "What are the best icebreaker games for work?", a: "Two Truths and a Lie, This or That and Most Likely To are quick, inclusive and need no setup. They work in person and on video calls." },
      { q: "How long should a work icebreaker take?", a: "Five to ten minutes at the start of a meeting, or up to 15 for a team-building session." },
    ],
    play: { href: "/office-party-games", label: "See all office party games" },
    related: ["/questions/icebreaker-questions", "/questions/would-you-rather-questions-for-work", "/questions/most-likely-to-questions-for-work", "/questions/two-truths-and-a-lie-ideas", "/virtual-party-games"],
    group: "games",
  },
];

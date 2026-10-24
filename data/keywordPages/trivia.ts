import type { KeywordPage } from "./types";

const QUIZ_STEPS = [
  "Split into teams, or play every person for themselves.",
  "Read each question twice and give ten seconds to answer.",
  "Tap the question to reveal the answer.",
  "One point per correct answer. Highest score wins.",
];

export const TRIVIA_PAGES: KeywordPage[] = [
  {
    path: "/questions/trivia-questions-and-answers",
    title: "{n} Trivia Questions and Answers (General Knowledge)",
    description:
      "{n} general knowledge trivia questions with answers: geography, science, history, movies, music, sports and food. Tap to reveal. Free for quiz night.",
    h1: "Trivia Questions and Answers",
    eyebrow: "🧠 Quiz night",
    emojis: ["🧠", "🏆", "❓"],
    intro:
      "{n} general knowledge trivia questions with answers, split into rounds so you can run a full quiz night. Tap any question to reveal the answer.",
    sections: [
      {
        heading: "Geography",
        items: [
          { q: "What is the capital of Australia?", a: "Canberra" },
          { q: "What is the capital of Canada?", a: "Ottawa" },
          { q: "What is the largest ocean on Earth?", a: "The Pacific Ocean" },
          { q: "What is the smallest country in the world?", a: "Vatican City" },
          { q: "In which country is Machu Picchu?", a: "Peru" },
          { q: "What is the tallest mountain above sea level?", a: "Mount Everest" },
          { q: "How many continents are there?", a: "Seven" },
          { q: "What is the largest hot desert in the world?", a: "The Sahara" },
          { q: "Which river flows through Egypt?", a: "The Nile" },
          { q: "Which country has more pyramids than Egypt?", a: "Sudan" },
        ],
      },
      {
        heading: "Science and nature",
        items: [
          { q: "What is the chemical symbol for gold?", a: "Au" },
          { q: "Which planet is closest to the Sun?", a: "Mercury" },
          { q: "What is the largest planet in our solar system?", a: "Jupiter" },
          { q: "Which planet is known as the Red Planet?", a: "Mars" },
          { q: "How many bones are in the adult human body?", a: "206" },
          { q: "What gas do plants absorb from the air?", a: "Carbon dioxide" },
          { q: "What is the hardest natural substance?", a: "Diamond" },
          { q: "At what temperature does water boil at sea level, in Celsius?", a: "100°C" },
          { q: "How many hearts does an octopus have?", a: "Three" },
          { q: "What is the largest animal that has ever lived?", a: "The blue whale" },
        ],
      },
      {
        heading: "History",
        items: [
          { q: "Who was the first person to walk on the Moon?", a: "Neil Armstrong, in 1969" },
          { q: "In what year did World War II end?", a: "1945" },
          { q: "Who painted the Mona Lisa?", a: "Leonardo da Vinci" },
          { q: "Who was the first president of the United States?", a: "George Washington" },
          { q: "In what year did the Titanic sink?", a: "1912" },
          { q: "In what year did the Berlin Wall fall?", a: "1989" },
          { q: "Which is the only one of the Seven Wonders of the Ancient World still standing?", a: "The Great Pyramid of Giza" },
          { q: "Did Cleopatra live closer in time to the Moon landing or to the building of the Great Pyramid?", a: "The Moon landing" },
        ],
      },
      {
        heading: "Movies, TV and music",
        items: [
          { q: "How many books are in the main Harry Potter series?", a: "Seven" },
          { q: "Who released the album Thriller?", a: "Michael Jackson" },
          { q: "Which band was made up of John, Paul, George and Ringo?", a: "The Beatles" },
          { q: "Which Disney film features the song Let It Go?", a: "Frozen" },
          { q: "What is the name of the cowboy toy in Toy Story?", a: "Woody" },
          { q: "In which city does the TV show Friends take place?", a: "New York City" },
          { q: "Which instrument has 88 keys?", a: "The piano" },
        ],
      },
      {
        heading: "Sports and food",
        items: [
          { q: "How many players does a soccer team have on the field?", a: "Eleven" },
          { q: "How often are the Summer Olympics held?", a: "Every four years" },
          { q: "Which sport is played at Wimbledon?", a: "Tennis" },
          { q: "How high is a regulation basketball hoop?", a: "10 feet" },
          { q: "Which country has won the most FIFA World Cups?", a: "Brazil" },
          { q: "What is the main ingredient in guacamole?", a: "Avocado" },
          { q: "What is sushi usually wrapped in?", a: "Seaweed, called nori" },
          { q: "Which country did pizza originate in?", a: "Italy" },
        ],
      },
    ],
    howTo: QUIZ_STEPS,
    tips: [
      { title: "Five rounds of eight", body: "Use one section per round for a quiz night that runs about an hour with scoring breaks." },
      { title: "Joker round", body: "Let each team play a joker on one round to double its points. It keeps losing teams in the game." },
    ],
    faq: [
      { q: "How do I host a trivia night?", a: "Pick five rounds from the sections above, split into teams of up to five, read each question twice, and mark answers after each round." },
      { q: "Are these trivia questions easy or hard?", a: "Mostly medium. Each round starts with an easier question and ends with one or two that will catch people out." },
    ],
    play: { href: "/games/trivia", label: "Play a trivia game on your phone" },
    related: ["/questions/trivia-questions-for-kids", "/questions/funny-trivia-questions", "/questions/christmas-trivia-questions", "/questions/thanksgiving-trivia-questions"],
    group: "trivia",
  },
  {
    path: "/questions/trivia-questions-for-kids",
    title: "{n} Trivia Questions for Kids (With Answers)",
    description:
      "{n} easy trivia questions for kids with answers: animals, space, math, movies and the world. Tap to reveal. Great for classrooms, car rides and parties.",
    h1: "Trivia Questions for Kids",
    eyebrow: "🧒 Easy quiz",
    emojis: ["🧒", "🦁", "🚀"],
    intro:
      "{n} kid-friendly trivia questions with answers, perfect for ages 6 to 12. Tap a question to reveal the answer.",
    sections: [
      {
        heading: "Animals",
        items: [
          { q: "How many legs does a spider have?", a: "Eight" },
          { q: "What is the fastest land animal?", a: "The cheetah" },
          { q: "What is a baby kangaroo called?", a: "A joey" },
          { q: "What is a baby frog called?", a: "A tadpole" },
          { q: "Which animal is called the king of the jungle?", a: "The lion" },
          { q: "What is the tallest animal in the world?", a: "The giraffe" },
          { q: "What do bees make?", a: "Honey" },
          { q: "Which bird can't fly but is a great swimmer?", a: "The penguin" },
          { q: "What do caterpillars turn into?", a: "Butterflies or moths" },
          { q: "What is the biggest land animal?", a: "The African elephant" },
        ],
      },
      {
        heading: "Space and science",
        items: [
          { q: "What planet do we live on?", a: "Earth" },
          { q: "What is the closest star to Earth?", a: "The Sun" },
          { q: "Which planet has big, bright rings?", a: "Saturn" },
          { q: "What do you get when water freezes?", a: "Ice" },
          { q: "What gas do we breathe in to stay alive?", a: "Oxygen" },
          { q: "How many colors are in a rainbow?", a: "Seven" },
          { q: "What color do you get when you mix blue and yellow?", a: "Green" },
          { q: "What do plants need from the sun to grow?", a: "Sunlight" },
        ],
      },
      {
        heading: "Math and shapes",
        items: [
          { q: "How many sides does a triangle have?", a: "Three" },
          { q: "What shape has eight sides?", a: "An octagon" },
          { q: "What is 7 times 8?", a: "56" },
          { q: "How many days are in a week?", a: "Seven" },
          { q: "How many days are in a normal year?", a: "365" },
          { q: "How many minutes are in an hour?", a: "60" },
        ],
      },
      {
        heading: "Movies, cartoons and the world",
        items: [
          { q: "Who lives in a pineapple under the sea?", a: "SpongeBob SquarePants" },
          { q: "What is the name of Mickey Mouse's dog?", a: "Pluto" },
          { q: "What is the name of Elsa's sister in Frozen?", a: "Anna" },
          { q: "What kind of animal is Simba in The Lion King?", a: "A lion" },
          { q: "What is the capital of the United States?", a: "Washington, D.C." },
          { q: "What is the largest ocean?", a: "The Pacific Ocean" },
          { q: "How many continents are there?", a: "Seven" },
          { q: "Which instrument has black and white keys?", a: "The piano" },
        ],
      },
    ],
    howTo: QUIZ_STEPS,
    faq: [
      { q: "What age are these trivia questions for?", a: "Roughly 6 to 12. Younger kids will know the animal and cartoon rounds, and older kids can take on space, math and the world." },
      { q: "Can I use these in a classroom?", a: "Yes. Split the class into table teams and read one round at a time. It works well as a Friday reward or an indoor recess game." },
    ],
    play: { href: "/games/trivia", label: "Play a trivia game on your phone" },
    related: ["/questions/trivia-questions-and-answers", "/questions/would-you-rather-questions-for-kids", "/questions/truth-or-dare-for-kids", "/classroom-games"],
    group: "trivia",
  },
  {
    path: "/questions/funny-trivia-questions",
    title: "{n} Funny Trivia Questions (Weird But True)",
    description:
      "{n} funny trivia questions with answers: weird-but-true facts about animals, history and everyday things that make the whole room groan. Tap to reveal.",
    h1: "Funny Trivia Questions",
    eyebrow: "😂 Weird but true",
    emojis: ["😂", "🦩", "🤯"],
    intro:
      "{n} funny trivia questions with weird-but-true answers. Nobody will get them all, and that's the fun.",
    sections: [
      {
        heading: "Weird animal facts",
        items: [
          { q: "What is a group of flamingos called?", a: "A flamboyance" },
          { q: "What is a group of crows called?", a: "A murder" },
          { q: "What is a group of owls called?", a: "A parliament" },
          { q: "Which animal has fingerprints almost identical to a human's?", a: "The koala" },
          { q: "What color is a polar bear's skin?", a: "Black" },
          { q: "Which animal holds hands while sleeping so it doesn't drift away?", a: "The sea otter" },
          { q: "What shape is wombat poop?", a: "Cube-shaped" },
          { q: "What is a baby puffin called?", a: "A puffling" },
          { q: "Where is a shrimp's heart?", a: "In its head" },
        ],
      },
      {
        heading: "Everyday things you never knew",
        items: [
          { q: "What is the dot over a lowercase i called?", a: "A tittle" },
          { q: "What is the plastic tip of a shoelace called?", a: "An aglet" },
          { q: "What was Bubble Wrap originally invented to be?", a: "Textured wallpaper" },
          { q: "What was Play-Doh originally sold as?", a: "Wallpaper cleaner" },
          { q: "Which letter doesn't appear in any US state name?", a: "Q" },
          { q: "What is the fear of long words called?", a: "Hippopotomonstrosesquippedaliophobia" },
        ],
      },
      {
        heading: "History and space surprises",
        items: [
          { q: "What is the national animal of Scotland?", a: "The unicorn" },
          { q: "Did Cleopatra live closer in time to the Moon landing or the building of the Great Pyramid?", a: "The Moon landing" },
          { q: "On which planet is a day longer than a year?", a: "Venus" },
          { q: "Which country has more pyramids than Egypt?", a: "Sudan" },
          { q: "How many hearts does an octopus have?", a: "Three" },
        ],
      },
    ],
    howTo: QUIZ_STEPS,
    faq: [
      { q: "What makes a trivia question funny?", a: "An answer so strange people don't believe it, like flamingos being called a flamboyance. The groan when you reveal it is half the fun." },
      { q: "Are these facts actually true?", a: "Yes. We only included facts that are well documented, and left out the popular \"facts\" that turn out to be myths." },
    ],
    play: { href: "/games/trivia", label: "Play a trivia game on your phone" },
    related: ["/questions/trivia-questions-and-answers", "/questions/trivia-questions-for-kids", "/questions/christmas-trivia-questions", "/games/fake-news-factory"],
    group: "trivia",
  },
];

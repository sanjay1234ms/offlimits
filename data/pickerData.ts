/** Data for the Random Pickers suite. */

export interface ScavengerPack {
  id: string;
  name: string;
  items: string[];
}

export const SCAVENGER_PACKS: ScavengerPack[] = [
  {
    id: "around-the-house",
    name: "Around the house",
    items: [
      "Something older than you",
      "A book with a blue cover",
      "A coin",
      "Something that makes noise",
      "A pair of odd socks",
      "Something you've never used",
      "A photo of someone laughing",
      "Something red",
      "A charger you don't recognise",
      "Something with a battery in it",
    ],
  },
  {
    id: "outdoor",
    name: "Outdoors",
    items: [
      "A leaf bigger than your hand",
      "Something perfectly round",
      "A feather",
      "Three different kinds of flower",
      "Something shaped like a letter",
      "A smooth stone",
      "Something that smells nice",
      "A stick taller than you",
      "Something man-made and something natural touching",
      "A cloud shaped like something",
    ],
  },
  {
    id: "party",
    name: "Party edition",
    items: [
      "A selfie with someone you just met",
      "Something borrowed from a stranger",
      "A group photo where nobody is ready",
      "Someone doing a dramatic pose",
      "Two people wearing the same colour",
      "A drink that isn't yours (ask first)",
      "Someone's best dance move on video",
      "A high five from three different people",
      "Something written on a napkin",
      "The oldest phone in the room",
    ],
  },
];

export interface WordCategory {
  id: string;
  name: string;
  words: string[];
}

export const WORD_CATEGORIES: WordCategory[] = [
  {
    id: "draw",
    name: "Draw it",
    words: [
      "volcano",
      "octopus",
      "lighthouse",
      "robot",
      "cactus",
      "hot air balloon",
      "pineapple",
      "castle",
      "spaceship",
      "umbrella",
      "dragon",
      "waterfall",
      "snowman",
      "treehouse",
      "jellyfish",
    ],
  },
  {
    id: "act",
    name: "Act it out",
    words: [
      "surfing",
      "sneezing",
      "a nervous interview",
      "carrying something heavy",
      "waking up",
      "losing your keys",
      "a bad phone signal",
      "tiptoeing",
      "winning a race",
      "eating something sour",
      "a mime trapped in a box",
      "falling asleep standing up",
    ],
  },
  {
    id: "describe",
    name: "Describe it",
    words: [
      "nostalgia",
      "the colour orange",
      "a thunderstorm",
      "your favourite meal",
      "the internet to someone from 1900",
      "silence",
      "a perfect Sunday",
      "the smell of rain",
      "gravity",
      "a spiral staircase",
    ],
  },
  {
    id: "write",
    name: "Write about it",
    words: [
      "a door that only opens once a year",
      "the last message on Earth",
      "a town where it's always 3pm",
      "a shop that sells memories",
      "the day the sky changed colour",
      "a suitcase left on a platform",
      "an app that predicts regrets",
      "the quietest place you know",
    ],
  },
];

export interface CountryEntry {
  name: string;
  flag: string;
  capital: string;
  region: string;
}

export const COUNTRIES: CountryEntry[] = [
  { name: "Japan", flag: "🇯🇵", capital: "Tokyo", region: "Asia" },
  { name: "Brazil", flag: "🇧🇷", capital: "Brasília", region: "South America" },
  { name: "Kenya", flag: "🇰🇪", capital: "Nairobi", region: "Africa" },
  { name: "Norway", flag: "🇳🇴", capital: "Oslo", region: "Europe" },
  { name: "Canada", flag: "🇨🇦", capital: "Ottawa", region: "North America" },
  { name: "Australia", flag: "🇦🇺", capital: "Canberra", region: "Oceania" },
  { name: "Egypt", flag: "🇪🇬", capital: "Cairo", region: "Africa" },
  { name: "Peru", flag: "🇵🇪", capital: "Lima", region: "South America" },
  { name: "Iceland", flag: "🇮🇸", capital: "Reykjavík", region: "Europe" },
  { name: "Thailand", flag: "🇹🇭", capital: "Bangkok", region: "Asia" },
  { name: "Morocco", flag: "🇲🇦", capital: "Rabat", region: "Africa" },
  { name: "Portugal", flag: "🇵🇹", capital: "Lisbon", region: "Europe" },
  { name: "New Zealand", flag: "🇳🇿", capital: "Wellington", region: "Oceania" },
  { name: "Mexico", flag: "🇲🇽", capital: "Mexico City", region: "North America" },
  { name: "India", flag: "🇮🇳", capital: "New Delhi", region: "Asia" },
  { name: "Chile", flag: "🇨🇱", capital: "Santiago", region: "South America" },
  { name: "Finland", flag: "🇫🇮", capital: "Helsinki", region: "Europe" },
  { name: "Vietnam", flag: "🇻🇳", capital: "Hanoi", region: "Asia" },
  { name: "Argentina", flag: "🇦🇷", capital: "Buenos Aires", region: "South America" },
  { name: "Greece", flag: "🇬🇷", capital: "Athens", region: "Europe" },
  { name: "South Korea", flag: "🇰🇷", capital: "Seoul", region: "Asia" },
  { name: "Ireland", flag: "🇮🇪", capital: "Dublin", region: "Europe" },
  { name: "Nigeria", flag: "🇳🇬", capital: "Abuja", region: "Africa" },
  { name: "Sweden", flag: "🇸🇪", capital: "Stockholm", region: "Europe" },
  { name: "Colombia", flag: "🇨🇴", capital: "Bogotá", region: "South America" },
  { name: "Indonesia", flag: "🇮🇩", capital: "Jakarta", region: "Asia" },
  { name: "Poland", flag: "🇵🇱", capital: "Warsaw", region: "Europe" },
  { name: "Ghana", flag: "🇬🇭", capital: "Accra", region: "Africa" },
  { name: "Spain", flag: "🇪🇸", capital: "Madrid", region: "Europe" },
  { name: "Turkey", flag: "🇹🇷", capital: "Ankara", region: "Asia" },
];

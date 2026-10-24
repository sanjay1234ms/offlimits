import type { KeywordPage } from "./types";

export const GIFT_PAGES: KeywordPage[] = [
  {
    path: "/white-elephant/rules",
    title: "White Elephant Rules: How to Play & Variations",
    description:
      "White Elephant rules explained step by step: turn order, stealing, freezing gifts and the final swap, plus Dirty Santa and Yankee Swap variations and house rules.",
    h1: "White Elephant Rules",
    eyebrow: "🐘 How to play",
    emojis: ["🐘", "🎁", "📜"],
    intro:
      "The complete White Elephant rules, also known as Dirty Santa, Yankee Swap or Steal-a-Gift: how turns work, how stealing works, when gifts freeze, and the house rules to agree before you start.",
    sections: [
      {
        heading: "The standard rules",
        items: [
          "Everyone brings one wrapped gift within the agreed budget, with no name on it.",
          "Put all the gifts in one pile in the middle of the room.",
          "Draw numbers to set the turn order.",
          "Number 1 opens any gift from the pile and shows it to everyone.",
          "Each player after that either opens a new gift or steals an opened gift from someone.",
          "If your gift is stolen, you immediately open a new gift or steal a different one.",
          "You can't steal back the gift that was just taken from you.",
          "A gift freezes after its third steal and stays with whoever holds it.",
          "The game ends when every gift is open. Number 1 can then make one final swap.",
        ],
      },
      {
        heading: "House rules to agree first",
        items: [
          "Steal limit: freeze after two steals for big groups, three for most, never for six people or fewer.",
          "Steals per turn: limit each turn to one steal so chains don't run for ten minutes.",
          "Final swap: decide whether Number 1 gets the last swap. It makes the worst number the best.",
          "Budget: say the number out loud. $20 to $30 is common for friends, less for offices.",
          "Joke gifts: decide whether they're allowed, or whether every gift should be something people want.",
        ],
      },
      {
        heading: "Variations",
        items: [
          "Dirty Santa: same game, common name in the US South, often with more aggressive stealing.",
          "Yankee Swap: the New England name, usually with gifts people actually want.",
          "Wrapped steal: nothing is opened until the end, so you steal based on the box.",
          "Dice White Elephant: roll a die each turn to decide whether you open, steal, swap or pass.",
          "Coin flip: heads you open, tails you must steal.",
          "Left-right game: read a story and pass gifts left or right every time those words come up.",
        ],
      },
    ],
    howTo: [
      "Agree the budget and house rules.",
      "Pile up the wrapped gifts and draw numbers.",
      "Play turns: open a new gift or steal an open one.",
      "When every gift is open, Number 1 gets the final swap.",
    ],
    faq: [
      { q: "How many times can a gift be stolen in White Elephant?", a: "Usually three, then it freezes. Big groups often freeze after two steals so the game finishes on time." },
      { q: "What's the difference between White Elephant, Dirty Santa and Yankee Swap?", a: "They're the same game with regional names. The only differences are the house rules each group uses." },
      { q: "Can you steal a gift back immediately?", a: "No. You can't take back the gift that was just stolen from you on the same turn. You can steal a different one or open a new gift." },
    ],
    play: { href: "/white-elephant", label: "Run the game free on one screen" },
    related: ["/white-elephant", "/white-elephant/gift-ideas", "/secret-santa", "/christmas-party-games", "/office-party-games"],
    group: "gifts",
  },
  {
    path: "/white-elephant/gift-ideas",
    title: "{n} White Elephant Gift Ideas (Under $10, $25 & $50)",
    description:
      "{n} White Elephant gift ideas people will actually steal: funny and useful gifts under $10, $25 and $50, plus office-safe picks.",
    h1: "White Elephant Gift Ideas",
    eyebrow: "🎁 Steal-worthy gifts",
    emojis: ["🎁", "🐘", "😂"],
    intro:
      "{n} White Elephant gift ideas, sorted by budget. The best gifts get stolen three times, so we've favored things people secretly want over joke gifts nobody keeps.",
    sections: [
      {
        heading: "White Elephant gifts under $10",
        items: [
          "A really good pair of fuzzy socks", "Fancy hot sauce", "A mini succulent in a cute pot",
          "A deck of party game cards", "Gourmet chocolate bar", "Lip balm and hand cream set",
          "A funny mug with hot chocolate packets", "A phone stand", "Scratch-off lottery tickets",
          "A pack of reusable stickers for a laptop", "Novelty ice cube trays", "A tiny desk plant that's impossible to kill",
        ],
      },
      {
        heading: "White Elephant gifts under $25",
        items: [
          "A cozy throw blanket", "A portable phone charger", "An insulated tumbler", "A board game for two",
          "A candle that smells like a bakery", "Wireless earbuds case or earbuds on sale", "A mini Bluetooth speaker",
          "A cookie decorating kit", "A heated eye mask", "A massage gun on sale", "A gourmet popcorn set",
          "A plant mister and grow light", "A puzzle with a funny picture",
        ],
      },
      {
        heading: "White Elephant gifts under $50",
        items: [
          "A weighted blanket", "A smart plug set", "A milk frother", "A Polaroid-style instant camera",
          "A quality knife sharpener", "A cast iron skillet", "A digital photo frame", "A projector for movie nights",
          "Noise-cancelling earbuds", "A heated blanket",
        ],
      },
      {
        heading: "Funny White Elephant gifts (that still get stolen)",
        items: [
          "A toilet night light", "A \"world's okayest\" trophy", "A giant gummy bear", "A cat butt tissue holder",
          "A bacon-scented candle", "A pizza blanket", "A Yodeling Pickle", "A sloth-shaped mug",
        ],
      },
      {
        heading: "Office-safe White Elephant gifts",
        items: [
          "A desk organizer", "Fancy coffee beans", "A plant for the desk", "A wrist rest and mouse pad set",
          "A good notebook and pen", "A snack box", "A reusable water bottle",
        ],
      },
    ],
    tips: [
      { title: "Aim for three steals", body: "If you'd steal it yourself, it's a good gift. Cozy, edible and gadget-y gifts change hands the most." },
      { title: "Wrap it well", body: "A big or oddly shaped box gets opened earlier, so your gift gets more airtime and more steals." },
    ],
    faq: [
      { q: "What is a good White Elephant gift?", a: "Something most people would want, inside the budget: a cozy blanket, good chocolate, a gadget or a fun game. The gifts that get stolen most are useful, not just funny." },
      { q: "How much should you spend on a White Elephant gift?", a: "Whatever the group agrees. $20 to $30 is common among friends, and $10 to $25 for offices." },
    ],
    play: { href: "/white-elephant", label: "Run your White Elephant game free" },
    related: ["/white-elephant/rules", "/white-elephant", "/secret-santa/gift-ideas", "/secret-santa"],
    group: "gifts",
  },
  {
    path: "/secret-santa/gift-ideas",
    title: "{n} Secret Santa Gift Ideas (Under $10, $20 & $50)",
    description:
      "{n} Secret Santa gift ideas by budget and person: coworkers, friends, family and people you barely know. Thoughtful picks under $10, $20 and $50.",
    h1: "Secret Santa Gift Ideas",
    eyebrow: "🎅 Gift guide",
    emojis: ["🎅", "🎁", "💡"],
    intro:
      "{n} Secret Santa gift ideas sorted by budget and by who you drew, including what to buy for the coworker you've never actually spoken to.",
    sections: [
      {
        heading: "Secret Santa gifts under $10",
        items: [
          "A nice candle", "Gourmet hot chocolate", "Fun socks", "A pocket notebook", "Hand cream",
          "A mini plant", "Fancy tea sampler", "Snack-size treats from a local shop", "A keychain multitool",
          "A phone grip", "A pack of nice pens",
        ],
      },
      {
        heading: "Secret Santa gifts under $20",
        items: [
          "A cozy beanie", "An insulated mug", "A paperback by an author they like", "A small board or card game",
          "A desk plant with a nice pot", "A spice set", "A bath bomb set", "A puzzle", "A reusable water bottle",
          "A portable charger", "A cookie mix in a jar", "A mini skincare set",
        ],
      },
      {
        heading: "Secret Santa gifts under $50",
        items: [
          "A weighted blanket", "A Bluetooth speaker", "A heated mug", "A cookbook and an ingredient to go with it",
          "A quality tote bag", "A plant subscription box", "A game they've mentioned wanting", "A massage gun",
        ],
      },
      {
        heading: "For a coworker you barely know",
        items: [
          "Good coffee or tea", "A desk plant", "A nice notebook", "A snack box", "A cozy throw for the office",
          "A gift card to a nearby coffee shop", "A phone stand", "A candle with a gentle scent",
        ],
      },
      {
        heading: "For friends and family",
        items: [
          "A personalized mug", "A framed photo of a shared memory", "Tickets to a local event",
          "Ingredients for their favorite cocktail or mocktail", "A book you think they'll love", "A cozy pajama set",
        ],
      },
    ],
    tips: [
      { title: "Use their questionnaire", body: "Ask everyone to fill in a Secret Santa questionnaire first. The \"things to avoid\" answer alone prevents most bad gifts." },
      { title: "Stick to the budget", body: "Going way over makes other people's gifts look small. Spend the agreed amount and put the extra effort into the wrapping." },
    ],
    faq: [
      { q: "What is a good Secret Santa gift?", a: "Something useful or treat-like that fits the budget and the person: a cozy item, a snack, a plant or a book. When in doubt, consumables are safest." },
      { q: "What should I buy a coworker I don't know?", a: "Keep it neutral and useful: good coffee, a desk plant, a notebook or a snack box. Avoid anything scented strongly or too personal." },
    ],
    play: { href: "/secret-santa", label: "Draw Secret Santa names free" },
    related: ["/secret-santa", "/secret-santa/questionnaire", "/white-elephant/gift-ideas", "/office-party-games"],
    group: "gifts",
  },
];

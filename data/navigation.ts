import type { NavItem } from "@/types";

/** Top-bar navigation, mirroring the structure of playantics.com. */
export const navigation: NavItem[] = [
  {
    label: "Party Games",
    href: "/games/party-games",
    children: [
      { label: "All Party Games", href: "/games/party-games" },
      { label: "Icebreakers", href: "/games/icebreakers" },
      { label: "Wheels & Pickers", href: "/games/wheels-pickers" },
    ],
  },
  {
    label: "By Occasion",
    href: "/occasions",
    children: [
      { label: "Game Night", href: "/occasions/game-night" },
      { label: "Office Party", href: "/occasions/office-party" },
      { label: "Road Trip", href: "/occasions/road-trip" },
      { label: "Date Night", href: "/occasions/date-night" },
      { label: "Birthday", href: "/occasions/birthday" },
    ],
  },
  { label: "Holiday", href: "/games/holiday" },
  { label: "How it works", href: "/how-it-works" },
];

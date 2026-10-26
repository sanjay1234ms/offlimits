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
      { label: "Road Trip", href: "/occasions/road-trip" },
      { label: "Birthday", href: "/birthday-party-games" },
    ],
  },
  { label: "Holiday", href: "/games/holiday" },
  { label: "How it works", href: "/how-it-works" },
];

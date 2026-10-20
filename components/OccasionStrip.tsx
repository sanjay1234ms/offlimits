import {
  Briefcase,
  Cake,
  Car,
  Gamepad2,
  Heart,
  Snowflake,
} from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { Occasion } from "@/types";

const occasions: {
  id: Occasion;
  label: string;
  href: string;
  icon: LucideIcon;
}[] = [
  { id: "game-night", label: "Game Night", href: "/games", icon: Gamepad2 },
  {
    id: "office-party",
    label: "Office Party",
    href: "/office-party-games",
    icon: Briefcase,
  },
  {
    id: "road-trip",
    label: "Road Trip",
    href: "/occasions/road-trip",
    icon: Car,
  },
  { id: "date-night", label: "Date Night", href: "/couples-games", icon: Heart },
  { id: "birthday", label: "Birthday", href: "/occasions/birthday", icon: Cake },
  {
    id: "holidays",
    label: "Holidays",
    href: "/christmas-party-games",
    icon: Snowflake,
  },
];

/** Horizontal, scrollable row of "browse by occasion" chips. */
export function OccasionStrip() {
  return (
    <div className="mx-auto max-w-content px-4 sm:px-6">
      <div className="-mx-4 flex gap-2.5 overflow-x-auto px-4 pb-2 no-scrollbar sm:mx-0 sm:flex-wrap sm:px-0">
        {occasions.map(({ id, label, href, icon: Icon }) => (
          <Link
            key={id}
            href={href}
            className="filter-chip shrink-0 !py-2.5 text-sm"
          >
            <Icon className="h-4 w-4 text-accent" aria-hidden />
            <span className="whitespace-nowrap font-semibold text-foreground">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

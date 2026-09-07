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

const occasions: { id: Occasion; label: string; icon: LucideIcon }[] = [
  { id: "game-night", label: "Game Night", icon: Gamepad2 },
  { id: "office-party", label: "Office Party", icon: Briefcase },
  { id: "road-trip", label: "Road Trip", icon: Car },
  { id: "date-night", label: "Date Night", icon: Heart },
  { id: "birthday", label: "Birthday", icon: Cake },
  { id: "holidays", label: "Holidays", icon: Snowflake },
];

/** Horizontal, scrollable row of "browse by occasion" chips. */
export function OccasionStrip() {
  return (
    <div className="mx-auto max-w-content px-4 sm:px-6">
      <div className="-mx-4 flex gap-2.5 overflow-x-auto px-4 pb-2 no-scrollbar sm:mx-0 sm:flex-wrap sm:px-0">
        {occasions.map(({ id, label, icon: Icon }) => (
          <Link
            key={id}
            href={`/occasions/${id}`}
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

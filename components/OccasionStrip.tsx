import Link from "next/link";

const occasions: { label: string; href: string; emoji: string }[] = [
  { label: "Game Night", href: "/games", emoji: "🎮" },
  { label: "Bachelorette", href: "/bachelorette-party-games", emoji: "👰" },
  { label: "Birthday", href: "/birthday-party-games", emoji: "🎂" },
  { label: "Christmas", href: "/christmas-party-games", emoji: "🎄" },
  { label: "Thanksgiving", href: "/thanksgiving-games", emoji: "🦃" },
  { label: "Date Night", href: "/valentines-day-games", emoji: "💞" },
  { label: "Baby Shower", href: "/baby-shower-games", emoji: "🍼" },
  { label: "Bridal Shower", href: "/bridal-shower-games", emoji: "💐" },
  { label: "Office Party", href: "/office-party-games", emoji: "💼" },
  { label: "18+ Night", href: "/18-plus-party-games", emoji: "🔥" },
  { label: "Road Trip", href: "/occasions/road-trip", emoji: "🚗" },
];

/** Horizontal, scrollable row of "browse by occasion" chips. */
export function OccasionStrip() {
  return (
    <div className="mx-auto max-w-content px-4 sm:px-6">
      <div className="-mx-4 flex gap-2.5 overflow-x-auto px-4 pb-2 no-scrollbar sm:mx-0 sm:flex-wrap sm:px-0">
        {occasions.map(({ label, href, emoji }) => (
          <Link
            key={href}
            href={href}
            className={`filter-chip shrink-0 !py-2.5 text-sm${label === "18+ Night" ? " is-adult" : ""}`}
          >
            <span aria-hidden>{emoji}</span>
            <span className="whitespace-nowrap font-semibold text-foreground">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";

interface FooterLink {
  label: string;
  href: string;
}

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Party Games",
    links: [
      { label: "Would You Rather", href: "/games/would-you-rather" },
      { label: "Never Have I Ever", href: "/games/never-have-i-ever" },
      { label: "Most Likely To", href: "/games/most-likely-to" },
      { label: "Truth or Dare", href: "/games/truth-or-dare" },
      { label: "This or That", href: "/games/this-or-that" },
      { label: "Trivia", href: "/games/trivia" },
      { label: "Charades", href: "/games/charades" },
      { label: "Buzzkill", href: "/games/buzzkill" },
      { label: "Fast 5", href: "/games/fast-5" },
      { label: "Pirate Barrel", href: "/games/pirate-barrel" },
    ],
  },
  {
    title: "Wheels & Pickers",
    links: [
      { label: "Spin the Wheel", href: "/wheel" },
      { label: "Random Name Picker", href: "/pickers/name" },
      { label: "Team Generator / Shuffler", href: "/pickers/teams" },
      { label: "Hot Seat Decider", href: "/wheel?preset=who-goes-first" },
      { label: "Decision Dice", href: "/wheel?preset=yes-or-no" },
    ],
  },
  {
    title: "By Occasion",
    links: [
      { label: "Halloween Party Games", href: "/halloween-party-games" },
      { label: "Christmas Party Games", href: "/christmas-party-games" },
      { label: "Office Party Games", href: "/office-party-games" },
      { label: "Drinking Games", href: "/drinking-games" },
      { label: "Classroom Games", href: "/classroom-games" },
      { label: "Large Group Games", href: "/party-games-for-large-groups" },
      { label: "Zoom & Virtual Games", href: "/virtual-party-games" },
      { label: "Sleepover Games", href: "/sleepover-games" },
      { label: "Couples Games", href: "/couples-games" },
      { label: "Secret Santa Generator", href: "/secret-santa" },
      { label: "Couples Game Night", href: "/play?category=couples" },
      { label: "House Party Icebreakers", href: "/play?vibe=icebreaker" },
      {
        label: "Wild & 18+ Late Night",
        href: "/play?category=18-plus&vibe=wild",
      },
      { label: "Virtual & Remote Team Games", href: "/games" },
    ],
  },
  {
    title: "Question Lists",
    links: [
      { label: "Funny Would You Rather", href: "/questions/funny-would-you-rather-questions" },
      { label: "Would You Rather for Kids", href: "/questions/would-you-rather-questions-for-kids" },
      { label: "Never Have I Ever", href: "/questions/never-have-i-ever-questions" },
      { label: "Most Likely To", href: "/questions/most-likely-to-questions" },
      { label: "Truth or Dare", href: "/questions/truth-or-dare-questions" },
      { label: "All question lists", href: "/questions" },
    ],
  },
  {
    title: "Host Toolkit & Guides",
    links: [
      { label: "Drinking Rules & Forfeits", href: "/host#house-rules" },
      { label: "Adjudication & Scoring Rules", href: "/host#scoring-rules" },
      {
        label: "Large Group Setups (10+ Players)",
        href: "/host#large-groups",
      },
      { label: "Party Pass & 18+ Access", href: "/host#party-pass" },
    ],
  },
  {
    title: "Company & Legal",
    links: [
      { label: "All Games Catalog", href: "/games" },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "About", href: "/about" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Contact Support", href: "/contact" },
    ],
  },
];

/** Global multi-column directory footer. Rendered once in app/layout.tsx. */
export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-[#060814] dark:text-slate-400">
      <div className="mx-auto max-w-content px-4 py-14 sm:px-6">
        {/* Brand summary */}
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.22em]">
            <span aria-hidden>🔒</span>
            <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-500 bg-clip-text text-transparent">
              OFFLIMITS
            </span>
          </span>
          <p className="mt-3 text-sm leading-relaxed">
            Free party games, trivia, drinking games and host tools for any
            group. No signup, no downloads, works instantly on every phone.
          </p>
        </div>

        {/* 5-column directory */}
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm transition-colors hover:text-slate-900 dark:hover:text-slate-100"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-slate-200 pt-6 dark:border-white/10 sm:flex-row sm:items-center">
          <p className="text-xs">
            © {new Date().getFullYear()} OffLimits · Free to play, no app
            required.
          </p>
        </div>
      </div>
    </footer>
  );
}

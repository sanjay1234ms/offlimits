import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SurpriseButton } from "./SurpriseButton";

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
      { label: "Most Likely To Vote", href: "/most-likely-to-game" },
      { label: "Truth or Dare", href: "/games/truth-or-dare" },
      { label: "This or That", href: "/games/this-or-that" },
      { label: "Trivia", href: "/games/trivia" },
      { label: "Charades", href: "/games/charades" },
      { label: "Buzzkill", href: "/games/buzzkill" },
      { label: "Fast 5", href: "/games/fast-5" },
      { label: "Pirate Barrel", href: "/games/pirate-barrel" },
      { label: "Rock Paper Scissors", href: "/games/rock-paper-scissors" },
      { label: "Werewolf", href: "/werewolf-game" },
      { label: "Mafia", href: "/mafia-game" },
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
      { label: "Bachelorette Party Games", href: "/bachelorette-party-games" },
      { label: "Birthday Party Games", href: "/birthday-party-games" },
      { label: "Baby Shower Games", href: "/baby-shower-games" },
      { label: "Bridal Shower Games", href: "/bridal-shower-games" },
      { label: "Valentine's Day Games", href: "/valentines-day-games" },
      { label: "Thanksgiving Games", href: "/thanksgiving-games" },
      { label: "Secret Santa Generator", href: "/secret-santa" },
      { label: "White Elephant Game", href: "/white-elephant" },
      { label: "Secret Santa Questionnaire", href: "/secret-santa/questionnaire" },
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
      {
        label: "Funny Would You Rather",
        href: "/questions/funny-would-you-rather-questions",
      },
      {
        label: "Would You Rather for Kids",
        href: "/questions/would-you-rather-questions-for-kids",
      },
      {
        label: "Never Have I Ever",
        href: "/questions/never-have-i-ever-questions",
      },
      { label: "Most Likely To", href: "/questions/most-likely-to-questions" },
      { label: "Dirty Most Likely To (18+)", href: "/questions/dirty-most-likely-to-questions" },
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
      { label: "18+ Party Games", href: "/18-plus-party-games" },
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
        {/* Play CTA band */}
        <div className="relative -mt-24 mb-14 overflow-hidden rounded-[2rem] border-[3px] border-slate-900 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-rose-500 p-7 text-white shadow-[6px_6px_0_#0f172a] sm:p-10">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(rgba(255,255,255,0.6)_1px,transparent_1.5px)] [background-size:16px_16px]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -right-4 -top-6 select-none text-8xl opacity-30 animate-float-slow motion-reduce:animate-none sm:text-9xl"
          >
            🎉
          </span>
          <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-balance text-2xl font-black tracking-tight sm:text-3xl">
                Your next party starts here.
              </p>
              <p className="mt-1 text-sm font-semibold text-white/85 sm:text-base">
                Pick a game, pass the phone. No signup, ever.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/games"
                className="group inline-flex items-center gap-2 rounded-full border-[3px] border-slate-900 bg-lime-300 px-6 py-3 font-extrabold text-slate-900 shadow-[4px_4px_0_#0f172a] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#0f172a] active:translate-y-0.5 active:shadow-[1px_1px_0_#0f172a]"
              >
                Browse games
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden
                />
              </Link>
              <SurpriseButton className="inline-flex items-center gap-2 rounded-full border-[3px] border-slate-900 bg-white px-6 py-3 font-extrabold text-slate-900 shadow-[4px_4px_0_#0f172a] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#0f172a] active:translate-y-0.5 active:shadow-[1px_1px_0_#0f172a]" />
            </div>
          </div>
        </div>

        {/* Brand summary */}
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 text-xl font-black uppercase tracking-[0.18em]">
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
                      className="inline-block text-sm transition-[color,transform] duration-200 hover:translate-x-0.5 hover:text-slate-900 dark:hover:text-slate-100"
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

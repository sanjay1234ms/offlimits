import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Flame,
  Gauge,
  Lock,
  RotateCw,
  ScrollText,
  Share2,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "OffLimits is a browser-based party game with real 18+ modes and sharp all-ages classics. No downloads, no accounts, no ads mid-round. One phone opens it and the room plays.",
};

const SECTION = "mx-auto max-w-3xl px-4 sm:px-6";
const CARD =
  "rounded-3xl border border-slate-200 bg-white/70 p-6 backdrop-blur-sm transition-colors dark:border-white/10 dark:bg-white/[0.03] sm:p-7";

const PROBLEMS: { title: string; body: string }[] = [
  {
    title: "Subscription paywalls",
    body: "A monthly fee to read questions off a screen. You pay for a year to use it twice.",
  },
  {
    title: "Awkward printouts",
    body: "Someone was supposed to print the cards. Nobody did. The night stalls before it starts.",
  },
  {
    title: "Rulebooks nobody reads",
    body: "Twenty minutes of setup and a scoring system that needs a referee. The room drifts to their phones.",
  },
  {
    title: "Corporate icebreakers",
    body: "Sanitized cards that sound like an HR training video. Safe, forgettable, and a little sad.",
  },
];

const HOST_TOOLS: { Icon: typeof Users; title: string; body: string }[] = [
  {
    Icon: Users,
    title: "Inline roster management",
    body: "Add, rename, and drop players without leaving the round. Names flow straight into prompts and scoring.",
  },
  {
    Icon: SlidersHorizontal,
    title: "Automatic group scaling",
    body: "Prompts, teams, and turn order adjust to a group of 3 or a group of 30. No mode switching.",
  },
  {
    Icon: RotateCw,
    title: "Built-in tiebreaker wheels",
    body: "Deadlocks, penalties, and forfeits get their own spin. The wheel decides so you do not have to.",
  },
  {
    Icon: Share2,
    title: "One-tap podium cards",
    body: "Finish a game and get a 9:16 results card, sized for Instagram, TikTok, and the group chat.",
  },
];

const FORMATS: { Icon: typeof Smartphone; title: string; body: string }[] = [
  {
    Icon: Smartphone,
    title: "Pass-the-Phone",
    body: "Would You Rather, Never Have I Ever, Most Likely To, Truth or Dare, This or That. One device around the table.",
  },
  {
    Icon: Trophy,
    title: "Competitive Buzzer & Trivia",
    body: "Scored rounds like Trivia, Buzzkill, and Fast 5, with live scorekeeping and a real winner at the end.",
  },
  {
    Icon: Users,
    title: "Social Deception",
    body: "Roles, bluffing, and quiet accusations across the room. Everyone sees the prompt, only you see your card.",
  },
  {
    Icon: RotateCw,
    title: "Companion Wheels",
    body: "Spin-the-wheel pickers, name draws, team shufflers, and decision dice for any game that needs a nudge.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-dvh bg-slate-50 text-slate-800 dark:bg-[#060814] dark:text-slate-100">
      {/* Hook */}
      <header className={`${SECTION} pt-16 pb-10 sm:pt-24`}>
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          About OffLimits
        </span>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          One phone opens it. The room starts playing.
        </h1>
        <div className="mt-6 flex flex-col gap-4 text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
          <p>
            OffLimits is a party game that lives in the browser. There is no app
            to download, no account to make, and no ad break in the middle of a
            round. Someone opens a link on their phone, and the game is already
            running.
          </p>
          <p>
            It is also not sanitized. Alongside sharp, all-ages party classics,
            OffLimits ships genuine 18+ modes with real stakes. The host decides
            the room&apos;s temperature and can change it any time.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/games" className="btn-primary">
            Browse all games
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link href="/party" className="btn-ghost">
            Open a party room
          </Link>
        </div>
      </header>

      {/* Why this exists */}
      <section className={`${SECTION} py-10`}>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Why this exists
        </h2>
        <p className="mt-3 max-w-2xl text-pretty text-slate-600 dark:text-slate-300">
          Modern party games got worse. They got bloated, gated, or bland. Most
          of the friction happens before anyone has laughed once.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PROBLEMS.map((p) => (
            <div key={p.title} className={CARD}>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {p.body}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-2xl text-pretty text-slate-600 dark:text-slate-300">
          OffLimits cuts all of it. Open the page, pick a game, pass the phone.
          The page is the game.
        </p>
      </section>

      {/* Clean by day, uncensored by night */}
      <section className={`${SECTION} py-10`}>
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <Flame className="h-3.5 w-3.5" aria-hidden />
          Range
        </span>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Clean by day, uncensored by night
        </h2>
        <div className="mt-4 flex flex-col gap-4 text-slate-600 dark:text-slate-300">
          <p>
            Every scored game, trivia pack, and icebreaker can be played totally
            dry and family-safe. That is the default. An office lunch or a
            Sunday with relatives never has to see anything sharp.
          </p>
          <p>
            Switching to spicy modes or activating the 24-Hour Party Pass
            unlocks the other half: real adult stakes, wild dares, and
            unfiltered prompt decks written for a room that wants them.
          </p>
          <p>
            The heat level is a dial, not a switch you flip once. The host moves
            it up and down as the night and the guest list change.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white/70 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.03]">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white">
              <Sparkles className="h-4 w-4" aria-hidden />
              <h3 className="text-base font-bold">Dry mode</h3>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              All-ages prompts, clean trivia, and icebreakers that still land.
              Nothing to explain to anyone in the room.
            </p>
          </div>
          <div className="rounded-3xl border border-rose-200 bg-rose-50/70 p-6 backdrop-blur-sm dark:border-rose-500/25 dark:bg-rose-500/[0.06]">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300">
              <Flame className="h-4 w-4" aria-hidden />
              <h3 className="text-base font-bold">Spicy mode &amp; Party Pass</h3>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Uncensored 18+ decks, harder dares, and prompts with actual
              consequences. Adults only, host-gated, on by choice.
            </p>
          </div>
        </div>
      </section>

      {/* Built for the host */}
      <section className={`${SECTION} py-10`}>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Built for the host
        </h2>
        <p className="mt-3 max-w-2xl text-pretty text-slate-600 dark:text-slate-300">
          One person runs the room. Every tool is built to keep that person in
          the game instead of buried in setup.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {HOST_TOOLS.map(({ Icon, title, body }) => (
            <div key={title} className={CARD}>
              <div className="flex items-center gap-2.5 text-slate-900 dark:text-white">
                <span className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.04]">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <h3 className="text-base font-bold">{title}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Zero waste, zero setup */}
      <section className={`${SECTION} py-10`}>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Zero waste, zero setup
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className={CARD}>
            <Zap className="h-5 w-5 text-slate-900 dark:text-white" aria-hidden />
            <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
              Instant load
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              It opens in the browser in a second. No store page, no update, no
              install prompt.
            </p>
          </div>
          <div className={CARD}>
            <Smartphone
              className="h-5 w-5 text-slate-900 dark:text-white"
              aria-hidden
            />
            <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
              Mobile-first
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Big touch targets, thumb-friendly controls, and layouts built for
              a phone getting passed around.
            </p>
          </div>
          <div className={CARD}>
            <Gauge
              className="h-5 w-5 text-slate-900 dark:text-white"
              aria-hidden
            />
            <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
              Dark and light
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Seamless dark and light modes that follow the room, from a bright
              kitchen to a 2am living room.
            </p>
          </div>
        </div>
        <p className="mt-6 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Lock className="h-4 w-4" aria-hidden />
          Scores, unlocks, and preferences stay on your device. Nothing syncs to
          a server.
        </p>
      </section>

      {/* What's inside */}
      <section className={`${SECTION} py-10 pb-20`}>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <ScrollText className="h-3.5 w-3.5" aria-hidden />
          What&apos;s inside
        </div>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Four game formats
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {FORMATS.map(({ Icon, title, body }) => (
            <div key={title} className={CARD}>
              <div className="flex items-center gap-2.5 text-slate-900 dark:text-white">
                <Icon className="h-5 w-5" aria-hidden />
                <h3 className="text-base font-bold">{title}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border border-slate-200 bg-white/70 p-6 text-center backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.03] sm:p-8">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Pick a game and go
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            No sign up, no download, no card details. Just a link and a room full
            of people.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link href="/games" className="btn-primary">
              Browse all games
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/host" className="btn-ghost">
              Read the host guide
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

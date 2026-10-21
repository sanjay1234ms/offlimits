import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Dices, Flame } from "lucide-react";
import { CATALOG } from "@/data/catalog";
import { JsonLd } from "@/components/JsonLd";
import {
  BRAND_DESCRIPTION,
  SITE_URL,
  absoluteUrl,
  webApplicationJsonLd,
} from "@/lib/site";
import {
  CompetitiveGames,
  GameCatalog,
  GameMarquee,
  Hero,
  OccasionStrip,
  RandomPickers,
  ReadyMadeWheels,
  Reveal,
  SectionHeading,
  TwoWaysToPlay,
} from "@/components";

// The physics playground is purely interactive and sits below the fold, so it
// loads on the client only; the placeholder keeps its exact size (no CLS).
const LogoPlayground = dynamic(
  () => import("@/components/LogoPlayground").then((m) => m.LogoPlayground),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden
        className="h-[22rem] rounded-[2rem] border-[3px] border-slate-900 bg-gradient-to-br from-indigo-950 via-violet-950 to-slate-950 shadow-[6px_6px_0_#0f172a] sm:h-[26rem]"
      />
    ),
  },
);

const GAME_COUNT = CATALOG.filter((g) => !g.adult).length;

export const metadata: Metadata = {
  title: {
    absolute: "OffLimits Party Games: Free Online Games for Groups",
  },
  alternates: { canonical: "/" },
};

// Tells Google the site's name (and the "playofflimits" spelling people
// search for) so brand searches resolve to the homepage. No SearchAction:
// the site has no search page for it to point at.
const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "OffLimits",
  alternateName: [
    "playofflimits",
    "Play OffLimits",
    "OffLimits Party Games",
    "playofflimits.com",
  ],
  url: `${SITE_URL}/`,
  description: BRAND_DESCRIPTION,
  inLanguage: "en",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

// The site itself as a free, no-install app, plus the games listed on the page.
const HOME_JSON_LD = [
  WEBSITE_JSON_LD,
  {
    ...webApplicationJsonLd({
      name: "OffLimits Party Games",
      description: BRAND_DESCRIPTION,
      path: "/",
    }),
    "@id": `${SITE_URL}/#app`,
    featureList: CATALOG.filter((g) => !g.adult).map((g) => g.title),
  },
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Free party games on OffLimits",
    url: `${SITE_URL}/`,
    numberOfItems: CATALOG.filter((g) => !g.adult).length,
    itemListElement: CATALOG.filter((g) => !g.adult).map((g, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: g.title,
      url: absoluteUrl(g.href),
    })),
  },
];

const SEASONAL_LINKS = [
  { href: "/halloween-party-games", label: "Halloween party games" },
  { href: "/christmas-party-games", label: "Christmas party games" },
  { href: "/office-party-games", label: "Office party games" },
  { href: "/drinking-games", label: "Drinking games" },
  { href: "/secret-santa", label: "Secret Santa generator" },
  { href: "/classroom-games", label: "Classroom games" },
  { href: "/party-games-for-large-groups", label: "Large group games" },
  { href: "/virtual-party-games", label: "Zoom games" },
  { href: "/sleepover-games", label: "Sleepover games" },
  { href: "/couples-games", label: "Couples games" },
  { href: "/questions", label: "Question lists" },
];

const OCCASION_TICKER = [
  { href: "/halloween-party-games", label: "Halloween", emoji: "🎃" },
  { href: "/christmas-party-games", label: "Christmas", emoji: "🎄" },
  { href: "/office-party-games", label: "Office parties", emoji: "💼" },
  { href: "/secret-santa", label: "Secret Santa", emoji: "🎁" },
  { href: "/party-games-for-large-groups", label: "Big groups", emoji: "👯" },
  { href: "/virtual-party-games", label: "Zoom calls", emoji: "💻" },
  { href: "/sleepover-games", label: "Sleepovers", emoji: "🛌" },
  { href: "/couples-games", label: "Date night", emoji: "💘" },
  { href: "/classroom-games", label: "Classrooms", emoji: "🍎" },
];

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-background">
      <JsonLd data={HOME_JSON_LD} />
      <main>
        <Hero />

        <div className="overflow-hidden py-4">
          <GameMarquee />
          <div className="-mt-1">
            <GameMarquee items={OCCASION_TICKER} tone="pink" reverse />
          </div>
        </div>

        <section
          id="party-games"
          className="mx-auto max-w-content scroll-mt-24 px-4 pb-4 pt-10 sm:px-6"
        >
          <SectionHeading
            eyebrow="🎲 The games"
            title="Pick a game"
            subtitle={`All ${GAME_COUNT} games, free to play right now. Tap one and pass the phone.`}
          />
          <div className="mt-5">
            <GameCatalog />
          </div>
        </section>

        <Reveal>
          <section className="mx-auto max-w-content px-4 py-10 sm:px-6">
            <SectionHeading
              eyebrow="🫧 Logo playground"
              title="Poke the games"
              subtitle="Push them around, fling them, or tap one to see what it is. Every logo has its own move."
            />
            <div className="mt-5">
              <LogoPlayground />
            </div>
          </section>
        </Reveal>

        <Reveal>
          <CompetitiveGames />
        </Reveal>

        <Reveal>
          <RandomPickers />
        </Reveal>

        <Reveal>
          <ReadyMadeWheels />
        </Reveal>

        <Reveal>
          <div id="how-it-works" className="scroll-mt-24 pt-2">
            <TwoWaysToPlay />
          </div>
        </Reveal>

        <Reveal>
          <section className="py-10">
            <div className="mx-auto max-w-content px-4 pb-3 sm:px-6">
              <SectionHeading
                eyebrow="🎈 Occasions"
                title="Browse by occasion"
                subtitle="Matched to the room you're in."
              />
            </div>
            <div className="mt-3">
              <OccasionStrip />
            </div>
            <div className="mx-auto mt-4 flex max-w-content flex-wrap gap-x-5 gap-y-2 px-4 sm:px-6">
              {SEASONAL_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold text-accent underline-offset-2 hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="mx-auto max-w-content px-4 py-6 sm:px-6">
            <div className="relative flex flex-col items-start gap-3 overflow-hidden rounded-3xl border-2 border-red-500/40 bg-red-500/5 p-6 dark:bg-red-950/20 sm:p-8">
              <span
                aria-hidden
                className="pointer-events-none absolute -right-6 -top-8 select-none text-9xl opacity-15 animate-float-slow motion-reduce:animate-none"
              >
                🔥
              </span>
              <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.15em] text-[#9f1239] dark:text-red-400">
                <Flame className="h-4 w-4" aria-hidden />
                Adults only
              </span>
              <h2 className="text-balance text-2xl font-extrabold tracking-tight text-foreground">
                18+ mode for late nights
              </h2>
              <p className="max-w-xl text-sm text-muted sm:text-base">
                Every pass-the-phone game has an uncensored deck behind an age
                check. Try three cards free, then unlock the rest with an
                optional Party Pass.
              </p>
              <Link
                href="/play?game=18plus"
                className="hero-adult-btn inline-flex items-center gap-2 rounded-2xl border-2 border-red-500/60 bg-red-950/40 px-5 py-3 text-sm font-extrabold text-red-300 transition-colors hover:bg-red-900/40"
              >
                <Flame className="h-4 w-4" aria-hidden />
                Try 18+ mode
              </Link>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="mx-auto max-w-content px-4 py-10 sm:px-6">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800/40 to-slate-900/20 p-6 backdrop-blur sm:p-9">
              <div
                aria-hidden
                className="pointer-events-none absolute -left-20 -top-20 h-52 w-52 rounded-full bg-indigo-500/15 blur-3xl"
              />
              <div className="relative flex flex-col items-start gap-4">
                <span className="group grid h-12 w-12 place-items-center rounded-2xl bg-accent-soft text-2xl ring-1 ring-white/10">
                  <Dices
                    className="h-6 w-6 text-accent transition-transform duration-700 group-hover:rotate-[360deg]"
                    aria-hidden
                  />
                </span>
                <h2 className="text-balance text-2xl font-extrabold tracking-tight text-foreground">
                  Can&apos;t decide? Spin for it.
                </h2>
                <p className="max-w-lg text-sm text-muted sm:text-base">
                  Drop in names or dares, hit spin, and let the wheel pick. No
                  app, no sign-up, no setup.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/games" className="btn-primary">
                    Start playing
                  </Link>
                  <Link href="/wheel" className="btn-ghost">
                    Spin the wheel
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </Reveal>
      </main>
    </div>
  );
}

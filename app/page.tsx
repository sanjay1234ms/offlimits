import type { Metadata } from "next";
import Link from "next/link";
import { Dices, Flame } from "lucide-react";
import { CATALOG } from "@/data/catalog";
import {
  CompetitiveGames,
  GameCatalog,
  Hero,
  OccasionStrip,
  RandomPickers,
  ReadyMadeWheels,
  SectionHeading,
  TwoWaysToPlay,
} from "@/components";

const GAME_COUNT = CATALOG.filter((g) => !g.adult).length;

export const metadata: Metadata = {
  title: {
    absolute: "PlayOffLimits: Free Online Party Games for Groups (No Download)",
  },
  alternates: { canonical: "/" },
};

// Tells Google the site's name (and the "playofflimits" spelling people
// search for) so brand searches resolve to the homepage.
const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "OffLimits",
  alternateName: ["playofflimits", "Play OffLimits", "playofflimits.com"],
  url: "https://playofflimits.com/",
};

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

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }}
      />
      <main>
        <Hero />

        <section
          id="party-games"
          className="mx-auto max-w-content scroll-mt-24 px-4 pb-4 pt-6 sm:px-6"
        >
          <SectionHeading
            title="Pick a game"
            subtitle={`All ${GAME_COUNT} games, free to play right now. Tap one and pass the phone.`}
          />
          <div className="mt-5">
            <GameCatalog />
          </div>
        </section>

        <CompetitiveGames />

        <RandomPickers />

        <ReadyMadeWheels />

        <div id="how-it-works" className="scroll-mt-24 pt-2">
          <TwoWaysToPlay />
        </div>

        <section className="py-10">
          <div className="mx-auto max-w-content px-4 pb-3 sm:px-6">
            <SectionHeading
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

        <section className="mx-auto max-w-content px-4 py-6 sm:px-6">
          <div className="flex flex-col items-start gap-3 rounded-3xl border-2 border-red-500/40 bg-red-500/5 p-6 dark:bg-red-950/20 sm:p-8">
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

        <section className="mx-auto max-w-content px-4 py-10 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800/40 to-slate-900/20 p-6 backdrop-blur sm:p-9">
            <div
              aria-hidden
              className="pointer-events-none absolute -left-20 -top-20 h-52 w-52 rounded-full bg-indigo-500/15 blur-3xl"
            />
            <div className="relative flex flex-col items-start gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-soft text-2xl ring-1 ring-white/10">
                <Dices className="h-6 w-6 text-accent" aria-hidden />
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
      </main>
    </div>
  );
}

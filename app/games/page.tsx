import type { Metadata } from "next";
import { shareMetadata } from "@/lib/seo";
import Link from "next/link";
import { GameBrowser } from "@/components";
import { CATALOG } from "@/data/catalog";
import { COMPETITIVE_ENGINE_SLUGS } from "@/data/competitive";
import { PICKER_META, PICKER_SLUGS } from "@/data/pickers";
import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/site";

const TITLE = "All Party Games: Find a Game for Your Group";
const DESCRIPTION =
  "Browse every free OffLimits party game and filter by group size, who's playing and the vibe: trivia, charades, imposter games and more.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/games" },
  ...shareMetadata(TITLE, DESCRIPTION, "/games"),
};

const CLEAN = CATALOG.filter((g) => !g.adult);

/** Server-rendered overview under the browser, so the page has a clear
 * outline and plain links to every game. */
const GROUPS: {
  heading: string;
  blurb: string;
  links: { href: string; label: string; blurb: string }[];
}[] = [
  {
    heading: "Pass-the-phone question games",
    blurb:
      "One phone, one question at a time, and the whole room answers. These are the quickest games to start: no teams, no scores, just filters for who is playing and how spicy it should get.",
    links: CLEAN.filter((g) => !g.engine).map((g) => ({
      href: g.href,
      label: g.title,
      blurb: g.blurb,
    })),
  },
  {
    heading: "Team games with scores",
    blurb:
      "Split into teams, keep score on screen and crown a winner on the podium. Good for game nights, office parties and big groups.",
    links: CLEAN.filter(
      (g) => g.engine && COMPETITIVE_ENGINE_SLUGS.includes(g.slug),
    ).map((g) => ({ href: g.href, label: g.title, blurb: g.blurb })),
  },
  {
    heading: "Bluffing, word and reaction games",
    blurb:
      "Imposters, fake headlines, tongue twisters and a pirate who might pop at any second. Pass the phone and see who cracks first.",
    links: CLEAN.filter(
      (g) => g.engine && !COMPETITIVE_ENGINE_SLUGS.includes(g.slug),
    ).map((g) => ({ href: g.href, label: g.title, blurb: g.blurb })),
  },
  {
    heading: "Wheels and random pickers",
    blurb:
      "Tools for the decisions nobody wants to make: who goes first, who is on which team, who wins the raffle.",
    links: [
      {
        href: "/wheel",
        label: "Spin the Wheel",
        blurb: "Add anything, spin, and let it decide.",
      },
      ...PICKER_SLUGS.map((slug) => ({
        href: `/pickers/${slug}`,
        label: PICKER_META[slug].title,
        blurb: PICKER_META[slug].blurb,
      })),
    ],
  },
];

export default function GamesPage() {
  return (
    <div className="min-h-dvh bg-background pb-24">
      <JsonLd data={breadcrumbJsonLd([{ name: "All games", path: "/games" }])} />
      <PageHero
        title="What kind of game do you need?"
        eyebrow="🎲 All games"
        emojis={["🎲", "🏆", "🎭"]}
      >
        <p className="mt-3 max-w-xl text-sm text-muted sm:text-base">
          Tell us the group and we&apos;ll narrow it down. Tap a filter again to
          remove it.
        </p>
      </PageHero>
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <GameBrowser />
      </div>
      <div className="mx-auto max-w-content px-4 pt-6 sm:px-6">
        <div className="my-8 h-px bg-border" />
        <div className="grid gap-10 md:grid-cols-2">
          {GROUPS.map((group) => (
            <section key={group.heading}>
              <h2 className="text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
                {group.heading}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {group.blurb}
              </p>
              <ul className="mt-3 space-y-1.5 text-sm">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-bold text-accent hover:underline"
                    >
                      {link.label}
                    </Link>
                    <span className="text-muted">: {link.blurb}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

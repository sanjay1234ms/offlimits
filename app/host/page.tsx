import type { Metadata } from "next";
import { shareMetadata } from "@/lib/seo";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/site";

const TITLE = "Host Toolkit: House Rules, Scoring & Party Tips";
const DESCRIPTION =
  "Host guide for OffLimits party games: house rules, drinking forfeits, scoring and adjudication, setups for 10+ players, and how Party Pass and 18+ mode work.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/host" },
  ...shareMetadata(TITLE, DESCRIPTION, "/host"),
};

const SECTIONS: { id: string; title: string; body: string[] }[] = [
  {
    id: "how-it-works",
    title: "How it works",
    body: [
      "OffLimits runs entirely in your browser. Pick a game, pass one phone around the room, done. There is no account, no install, and nothing is saved to a server.",
      "Your theme, scoreboard, 18+ unlock status, and free-preview count all live in this device's local storage. Clearing your browser data resets the app completely.",
    ],
  },
  {
    id: "house-rules",
    title: "Drinking rules and forfeits",
    body: [
      "Every scored game plays completely dry by default. If you want stakes, the Companion Wheel beneath each game carries forfeit slices with a non-drinking option built into every one. For example: take two sips, or do two star jumps.",
      "For Truth or Dare, set the veto rule before turn one. One free pass per player per round, then every bail is a forfeit spin. A host can veto any dare outright, with no forfeit, if it is unsafe or non-consensual. Uncomfortable and unsafe are not the same thing.",
    ],
  },
  {
    id: "scoring-rules",
    title: "Adjudication and scoring",
    body: [
      "The host is the referee. Decide two things before you start, and apply them the same to everyone: whether a near miss counts, and whether a shout that lands right on the buzzer counts.",
      "Trivia: a blurted answer before you say lock in kills that question, no point. Charades: the first mouthed word is a dead round. Buzzkill: only the clue-giver is bound by the forbidden words, the guessing team can say anything.",
      "Scores are session-only and start at zero every time you re-enter a game. Hit Finish & Crown Winner before you leave if you want to keep the 9:16 recap card.",
    ],
  },
  {
    id: "large-groups",
    title: "Large group setups (10+ players)",
    body: [
      "Tap the 11-20 or 20+ GROUP SIZE pill in the filter card to seed a full roster, then rename the pills as people arrive.",
      "Split into teams for Charades, Buzzkill, and Say It Backwards. Rename the pills to team names and the podium crowns the team. For Odd One Out with ten or more, deal two imposters who do not know each other. For rhythm games like Miss a Beat, run two circles at the same time and final the two winners.",
    ],
  },
  {
    id: "party-pass",
    title: "Party Pass and 18+ access",
    body: [
      "The 18+ decks give you three free preview cards per game. After that, the OffLimits 24-Hour Party Pass unlocks every 18+ deck, game, and helper for 24 hours. One purchase covers the whole site, and it is never per game.",
      "Enter the access code or buy the pass from any paywall. An active pass shows a countdown badge in the header. When it expires, every surface reverts to the three-card preview automatically.",
    ],
  },
];

export default function HostToolkitPage() {
  return (
    <div className="min-h-dvh bg-background">
      <JsonLd data={breadcrumbJsonLd([{ name: "Host Toolkit", path: "/host" }])} />
      <PageHero
        title="Host Toolkit & Guides"
        eyebrow="🧰 For hosts"
        emojis={["🧰", "🏆", "🍻"]}
        width="max-w-2xl"
      >
        <p className="mt-3 text-sm text-muted sm:text-base">
          Everything you need to run a clean game night. Rules, scoring calls,
          big-group logistics, and how the Party Pass works.
        </p>
      </PageHero>
      <div className="mx-auto max-w-2xl px-4 pb-14 sm:px-6">
        <div className="mt-10 flex flex-col gap-12">
          {SECTIONS.map((s) => (
            <Reveal key={s.id}>
              <section id={s.id} className="scroll-mt-24">
                <h2 className="text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
                  {s.title}
                </h2>
                <div className="mt-3 flex flex-col gap-3 text-sm leading-relaxed text-muted">
                  {s.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 border-t border-border pt-6">
          <Link
            href="/games"
            className="text-sm font-bold text-accent hover:underline"
          >
            Back to all games
          </Link>
        </div>
      </div>
    </div>
  );
}

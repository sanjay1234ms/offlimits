import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { WhiteElephant } from "@/components/WhiteElephant";
import { shareMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/site";

const TITLE = "White Elephant Gift Exchange: Free Game Runner & Rules";
const DESCRIPTION =
  "Free White Elephant tools: shuffle the turn order, draw numbers from a hat, or run the whole gift swap on one screen with steals, frozen gifts and the final swap.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | OffLimits` },
  description: DESCRIPTION,
  alternates: { canonical: "/white-elephant" },
  ...shareMetadata(TITLE, DESCRIPTION, "/white-elephant"),
};

const STEPS = [
  "Agree on a budget. Everyone brings one wrapped gift with no name on it, and they all go in one pile.",
  "Pick the turn order: shuffle the names above, or pass the phone and draw numbers from the hat.",
  "Number 1 unwraps a gift and shows it to the room. That's their turn done.",
  "Every number after that chooses: unwrap a new gift, or steal one that's already been opened.",
  "If your gift gets stolen, you go again right away. The turn only moves on when someone unwraps a new gift.",
  "A gift freezes after its third steal and stays put. You can't steal back the gift that was just taken from you.",
  "When every gift is open, Number 1 gets one last swap with any gift that isn't frozen. Then it's over.",
];

const TIPS = [
  {
    title: "Play the final swap",
    body: "Without it, Number 1 has the worst seat: they open blind with nothing to steal and watch their gift get taken. One swap at the very end turns the worst number into the best.",
  },
  {
    title: "Let the game runner keep score",
    body: "Around turn fifteen nobody remembers whether the candle has been stolen twice or three times. The runner above tracks every steal and freezes gifts automatically, so there's nothing to argue about.",
  },
  {
    title: "Bring a gift three people will want",
    body: "Joke gifts get one laugh and then sit unclaimed. The best gifts change hands four times: good chocolate, a cozy blanket, a gadget that's better than it looks.",
  },
  {
    title: "Match the rules to the group",
    body: "Freeze after three steals suits most groups. With 25 or more, freeze after two so the game ends before the party does. With six people, try never freezing and enjoy the chaos.",
  },
];

const FAQ = [
  {
    q: "How many times can a gift be stolen?",
    a: "Usually three, then it freezes with whoever took it last. Big groups often freeze after two to keep things moving, and small groups sometimes never freeze. The game runner lets you pick before you start.",
  },
  {
    q: "What's the deal with Number 1?",
    a: "Number 1 opens first with nothing to steal, which is a rough spot. That's why most groups give them a final swap once every gift is open. Turn it on in the game runner and it happens automatically.",
  },
  {
    q: "Can you steal a gift right back?",
    a: "Not straight away. If your gift is stolen you go again immediately, but you can't take back the gift that was just taken from you. Otherwise two people trade the same gift all night.",
  },
  {
    q: "How long does a game take?",
    a: "Roughly one to two minutes per person, so about 15 minutes for ten people and up to an hour for thirty. Steals are what stretch it out.",
  },
  {
    q: "Is White Elephant the same as Yankee Swap or Dirty Santa?",
    a: "Yes, same game, different names depending on where you grew up. Steal-a-Gift is another one. The house rules change from group to group, so agree on them out loud before the first gift is opened.",
  },
  {
    q: "What's the difference from Secret Santa?",
    a: "In Secret Santa you buy for one specific person. In White Elephant nobody buys for anyone in particular: every gift goes in one pile and the stealing decides who takes what home. Plenty of groups do both.",
  },
  {
    q: "Is the game runner really free?",
    a: "Yes. No pass, no signup, no limit on players. The game saves on the device you start it on, so a refresh won't lose your place.",
  },
];

export default function WhiteElephantPage() {
  return (
    <div className="min-h-dvh bg-background pb-24">
      <JsonLd data={breadcrumbJsonLd([{ name: "White Elephant", path: "/white-elephant" }])} />
      <PageHero
        title="White Elephant Gift Exchange"
        eyebrow="🐘 Steal-a-gift"
        emojis={["🐘", "🎁", "🎩"]}
        width="max-w-2xl"
      >
        <p className="mt-4 text-pretty text-base text-muted sm:text-lg">
          Everyone brings a wrapped gift, takes a number, and on their turn
          opens a new one or steals one already open. Shuffle the order, draw
          from a hat, or run the whole game here, free.
        </p>
      </PageHero>

      <section id="we-tool" className="mx-auto max-w-2xl scroll-mt-24 px-4 pb-6 pt-4 sm:px-6">
        <WhiteElephant />
      </section>

      <section className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <SectionHeading title="How to play" />
        <ol className="mt-5 flex flex-col gap-3">
          {STEPS.map((s, i) => (
            <li key={i} className="glass-card flex items-start gap-4 p-4 sm:p-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-extrabold text-white">
                {i + 1}
              </span>
              <p className="pt-1.5 text-sm leading-relaxed text-muted sm:text-base">{s}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <SectionHeading title="How to run a great swap" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {TIPS.map((t) => (
            <div key={t.title} className="glass-card p-4 sm:p-5">
              <h3 className="font-extrabold text-foreground">{t.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{t.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <SectionHeading title="Variations to try" />
        <ul className="mt-4 space-y-3 text-base leading-relaxed text-muted">
          <li>
            <strong className="text-foreground">Keep it wrapped.</strong> Nothing gets
            opened until the last turn, so every steal is a gamble on the box.
          </li>
          <li>
            <strong className="text-foreground">Coin flip.</strong> Heads, open a new
            gift. Tails, you must steal. Great for big groups and indecisive uncles.
          </li>
          <li>
            <strong className="text-foreground">Dice swap.</strong> Everyone opens a
            gift first, then roll: each number means pass left, pass right, steal or
            skip. Easy for younger kids.
          </li>
          <li>
            <strong className="text-foreground">One steal per turn.</strong> Stops
            chains running for ten minutes when the group is large.
          </li>
        </ul>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <SectionHeading title="Frequently asked questions" />
        <div className="mt-4 space-y-2">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl border border-border bg-surface/60 px-4 py-3 transition-colors hover:border-accent open:border-accent [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-foreground">
                {item.q}
                <span aria-hidden className="text-lg leading-none text-muted transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-muted group-open:animate-fade-up">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <SectionHeading title="More for the holidays" />
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {[
            { href: "/secret-santa", label: "Secret Santa generator", emoji: "🎅" },
            { href: "/secret-santa/questionnaire", label: "Santa questionnaire", emoji: "📝" },
            { href: "/christmas-party-games", label: "Christmas party games", emoji: "🎄" },
          ].map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="glass-card flex items-center gap-2 px-4 py-3 text-sm font-bold text-foreground transition-transform hover:-translate-y-0.5"
            >
              <span aria-hidden>{t.emoji}</span>
              {t.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { SecretSantaDraw } from "@/components/SecretSantaDraw";
import { shareMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/site";

const TITLE = "Secret Santa Generator: Free Name Draw";
const DESCRIPTION =
  "Free Secret Santa generator. Add names, keep couples apart, set a budget and share one link. Everyone taps their name to see who they're buying for. No email, no signup.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | OffLimits` },
  description: DESCRIPTION,
  alternates: { canonical: "/secret-santa" },
  ...shareMetadata(TITLE, DESCRIPTION, "/secret-santa"),
};

const STEPS = [
  {
    title: "Add everyone's names",
    body: "One per line. You need at least three people, and big groups work just as well.",
  },
  {
    title: "Set any rules",
    body: "Keep partners or siblings apart, pick a budget and currency, and add the swap date.",
  },
  {
    title: "Share one link",
    body: "Drop it in the group chat. Each person taps their own name and sees only their match.",
  },
];

const FAQ = [
  {
    q: "Is this Secret Santa generator free?",
    a: "Yes. No signup, no app and no email addresses. You add names, draw, and share a link.",
  },
  {
    q: "How does everyone find out who they got?",
    a: "Send the one link to your group. Each person opens it, taps their name, confirms it's them, and opens a gift to see who they're buying for.",
  },
  {
    q: "Can the organiser see who got who?",
    a: "No. The matching happens on our server and the organiser page only shows who has opened their name, never the pairings, so whoever sets it up can take part without spoiling their own surprise.",
  },
  {
    q: "Can two people open the same name?",
    a: "No. The first phone to open a name claims it, and it locks for everyone else. That same phone can come back to the link any time to see its match again.",
  },
  {
    q: "What if someone taps the wrong name?",
    a: "Open your organiser page and tap Reset next to that name. It unlocks so the right person can open it, and nobody sees any pairings along the way.",
  },
  {
    q: "Can I stop couples drawing each other?",
    a: "Yes. Add a keep-apart rule for any two people and they'll never get each other, in either direction. If the rules can't all work for your group, we'll tell you before drawing.",
  },
  {
    q: "Can someone draw themselves?",
    a: "Never. The draw checks every pairing before the link is made.",
  },
  {
    q: "How long does the draw stay available?",
    a: "About five months, long enough for the whole gifting season. After that it's deleted. There are no accounts, so save your organiser link somewhere safe.",
  },
  {
    q: "What if I need to change the names?",
    a: "Tap Edit and redraw. That makes a brand new draw, so send the new link and tell people to ignore the old one.",
  },
];

const MORE_TOOLS = [
  { href: "/christmas-party-games", label: "Christmas party games", emoji: "🎄" },
  { href: "/office-party-games", label: "Office party games", emoji: "💼" },
  { href: "/pickers/name", label: "Random name picker", emoji: "🎯" },
  { href: "/pickers/teams", label: "Team generator", emoji: "👥" },
  { href: "/wheel", label: "Spin the wheel", emoji: "🎡" },
];

export default function SecretSantaPage() {
  return (
    <div className="min-h-dvh bg-background pb-24">
      <JsonLd data={breadcrumbJsonLd([{ name: "Secret Santa Generator", path: "/secret-santa" }])} />
      <PageHero
        title="Secret Santa Generator"
        eyebrow="🎁 Gift swap"
        emojis={["🎁", "🎄", "🎅"]}
        width="max-w-3xl"
      >
        <p className="mt-4 text-pretty text-base text-muted sm:text-lg">
          Draw names for your group in under a minute. One link, no signup, no
          email addresses, and not even the organiser sees who got who.
        </p>
      </PageHero>

      <section id="santa-tool" className="mx-auto max-w-5xl scroll-mt-24 px-4 pb-6 sm:px-6">
        <div className="mt-6">
          <SecretSantaDraw />
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <SectionHeading title="How it works" />
        <ol className="mt-5 flex flex-col gap-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="glass-card flex items-start gap-4 p-4 sm:p-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-extrabold text-white">
                {i + 1}
              </span>
              <div>
                <h3 className="font-extrabold text-foreground">{s.title}</h3>
                <p className="mt-0.5 text-sm leading-relaxed text-muted">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <SectionHeading title="Why draw names online instead of from a hat" />
        <div className="mt-4 space-y-4 text-base leading-relaxed text-muted">
          <p>
            Pulling names from a hat has two flaws. Someone always picks their
            own name and you start again with everyone watching, and it only
            works when the whole group is in one room. For families spread
            across cities and teams that work from home, that rarely happens.
          </p>
          <p>
            An online draw fixes both. Every pairing is checked before anyone
            looks, so nobody gets themselves, and people can join from their
            phone wherever they are. Keep-apart rules go one better than a hat
            ever could: partners who share a house won&apos;t end up shopping
            for each other.
          </p>
          <p>
            The one thing to agree up front is the budget. Mismatched spending
            causes more awkward moments than any bad match, so set a number
            when you make the draw and everyone sees it when they open their
            name.
          </p>
        </div>
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
                <span
                  aria-hidden
                  className="text-lg leading-none text-muted transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-muted group-open:animate-fade-up">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <SectionHeading title="More for the holidays" />
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {MORE_TOOLS.map((t) => (
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

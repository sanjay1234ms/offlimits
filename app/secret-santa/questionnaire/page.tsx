import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { SantaQuestionnaire } from "@/components/SantaQuestionnaire";
import { shareMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/site";

const TITLE = "Secret Santa Questionnaire: Free Fill-In Form";
const DESCRIPTION =
  "Free Secret Santa questionnaire. Answer 12 quick questions about snacks, colours, sizes and what to avoid, then share it as a link, copy it as text or print it.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | OffLimits` },
  description: DESCRIPTION,
  alternates: { canonical: "/secret-santa/questionnaire" },
  ...shareMetadata(TITLE, DESCRIPTION, "/secret-santa/questionnaire"),
};

const FAQ = [
  {
    q: "What is a Secret Santa questionnaire?",
    a: "A short form everyone fills in before shopping: favourite snacks, colours, hobbies, sizes and anything to avoid. It gives whoever drew your name enough to pick something good without you having to spell out a specific gift.",
  },
  {
    q: "How do I send my answers?",
    a: "Tap Copy share link and paste it into your group chat or send it to the organiser. Whoever opens it sees your answers. You can also copy everything as plain text or print it.",
  },
  {
    q: "Are my answers stored anywhere?",
    a: "No. There's no account and no database. Your answers are packed into the link itself, so if you never share it, nobody sees them.",
  },
  {
    q: "Which question matters most?",
    a: "Allergies and things to avoid. A nut allergy, a scent sensitivity or a dietary need rules out more bad gifts than any wishlist, so answer that one even if you skip the rest.",
  },
  {
    q: "Is it rude to say what I don't want?",
    a: "Not at all. Your Santa would much rather know about the mug collection now than find out in January. It saves them money and saves you a polite smile.",
  },
  {
    q: "Can I print it for an office exchange?",
    a: "Yes. The Print button prints just the form, without the rest of the site, so you can fill it in by hand or pin it up.",
  },
];

export default function SantaQuestionnairePage() {
  return (
    <div className="min-h-dvh bg-background pb-24">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Secret Santa Generator", path: "/secret-santa" },
          { name: "Questionnaire", path: "/secret-santa/questionnaire" },
        ])}
      />
      <PageHero
        title="Secret Santa Questionnaire"
        eyebrow="📝 Help your Santa"
        emojis={["📝", "🎁", "🧦"]}
        width="max-w-2xl"
      >
        <p className="mt-4 text-pretty text-base text-muted sm:text-lg">
          Twelve quick questions so whoever drew your name doesn&apos;t have to
          guess. Share it as a link, copy it as text or print it.
        </p>
      </PageHero>

      <section className="mx-auto max-w-2xl px-4 pb-6 pt-4 sm:px-6">
        <SantaQuestionnaire />
      </section>

      <section className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <SectionHeading title="Why fill one in?" />
        <div className="mt-4 space-y-4 text-base leading-relaxed text-muted">
          <p>
            Most underwhelming Secret Santa gifts don&apos;t come from people
            who didn&apos;t care. They come from someone who got handed a name,
            knew almost nothing about that person, and had to guess. A few
            honest answers turn the guess into a good pick.
          </p>
          <p>
            The best answers are specific without being a shopping list.
            &quot;Dark chocolate with sea salt&quot; or &quot;anything for my
            plants&quot; gives your Santa a direction and still leaves room for
            a surprise.
          </p>
          <p>
            Organising the swap? Send the questionnaire out with the{" "}
            <Link href="/secret-santa" className="font-semibold text-accent hover:underline">
              Secret Santa draw link
            </Link>{" "}
            and ask for answers a week before anyone starts shopping.
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
        <SectionHeading title="More for the gift swap" />
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {[
            { href: "/secret-santa", label: "Draw Secret Santa names", emoji: "🎅" },
            { href: "/white-elephant", label: "White Elephant game", emoji: "🐘" },
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

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
  "Free Secret Santa generator. Type everyone's names, draw, and pass the phone so each person privately sees who they're buying for. No email, no signup.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | OffLimits` },
  description: DESCRIPTION,
  alternates: { canonical: "/secret-santa" },
  ...shareMetadata(TITLE, DESCRIPTION, "/secret-santa"),
};

const STEPS = [
  "Type everyone's name, one per line, and add a budget if you like.",
  "Tap Draw names. Nobody can draw themselves.",
  "Pass the phone. Each person taps their own name, sees who they're buying for, then hides it.",
  "Once everyone has looked, you're done. Nothing is saved or sent anywhere.",
];

const FAQ = [
  {
    q: "Is this Secret Santa generator free?",
    a: "Yes. No signup, no emails and no app. It runs entirely on the phone you're holding.",
  },
  {
    q: "Can someone draw themselves?",
    a: "No. The draw always gives everyone someone else.",
  },
  {
    q: "Are the names saved anywhere?",
    a: "No. Names stay on this phone and disappear when you close or refresh the page.",
  },
  {
    q: "How many people can take part?",
    a: "Three or more. There's no upper limit.",
  },
];

export default function SecretSantaPage() {
  return (
    <div className="min-h-dvh bg-background pb-24">
      <JsonLd data={breadcrumbJsonLd([{ name: "Secret Santa Generator", path: "/secret-santa" }])} />
      <PageHero
        title="Secret Santa Generator"
        eyebrow="🎁 Gift swap"
        emojis={["🎁", "🎄", "🎅"]}
        width="max-w-2xl"
      >
        <p className="mt-4 text-pretty text-base text-muted sm:text-lg">
          Draw Secret Santa names in seconds on one phone. No emails, no
          accounts, and nobody can draw themselves.
        </p>
      </PageHero>
      <section className="mx-auto max-w-2xl px-4 pb-6 sm:px-6">
        <div className="mt-6">
          <SecretSantaDraw />
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <SectionHeading title="How it works" />
        <ol className="mt-4 list-decimal space-y-2 pl-6 text-sm leading-relaxed text-muted sm:text-base">
          {STEPS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
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
        <p className="mt-8 text-sm text-muted">
          Planning the party too? See our{" "}
          <Link
            href="/christmas-party-games"
            className="font-semibold text-accent hover:underline"
          >
            Christmas party games
          </Link>
          .
        </p>
      </section>
    </div>
  );
}

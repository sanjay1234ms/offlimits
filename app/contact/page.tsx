import type { Metadata } from "next";
import { shareMetadata } from "@/lib/seo";
import Link from "next/link";
import { Bug, CreditCard, Handshake, Lightbulb } from "lucide-react";
import { ContactForm, CONTACT_EMAIL } from "./ContactForm";
import { PageHero } from "@/components/PageHero";

const TITLE = "Contact OffLimits: Card Ideas, Bugs & Party Pass Help";
const DESCRIPTION =
  "Contact the OffLimits team: send a card idea, report a bug, ask about the 24-Hour Party Pass or pitch a custom event. Real people read and answer every note.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/contact" },
  ...shareMetadata(TITLE, DESCRIPTION, "/contact"),
};

const CATEGORY_CARDS: {
  Icon: typeof Lightbulb;
  title: string;
  body: string;
}[] = [
  {
    Icon: Lightbulb,
    title: "Card idea submissions",
    body: "Got a prompt, dare, or trivia question so good it belongs in the game? Send it in.",
  },
  {
    Icon: Bug,
    title: "Bug reports and device feedback",
    body: "Hit a weird UI glitch or an adjudication dispute? Tell us your device and browser and what happened.",
  },
  {
    Icon: CreditCard,
    title: "Party Pass and billing",
    body: "Need help with a 24-Hour Party Pass access code or a payment receipt? We can sort it out.",
  },
  {
    Icon: Handshake,
    title: "Partnerships and custom events",
    body: "Looking for branded trivia, private company happy hours, or custom game packs? Let us know the shape of it.",
  },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "How fast do you reply?",
    a: "Within 24 to 48 hours, usually sooner. Every note goes to a person, not a ticket queue.",
  },
  {
    q: "Can I suggest uncensored 18+ decks?",
    a: "Yes. Adult prompt and dare submissions are welcome, and we review the pile every week.",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-dvh bg-slate-50 text-slate-800 dark:bg-[#060814] dark:text-slate-100">
      <PageHero
        title="Contact the team"
        eyebrow="👋 Say hi"
        emojis={["💌", "👋", "💬"]}
        width="max-w-3xl"
      >
        <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
          No ticket maze, no chatbot, no canned auto-reply. Real humans read and
          answer every note, usually within a day.
        </p>
      </PageHero>
      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 sm:pb-24">
        {/* Category grid */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CATEGORY_CARDS.map(({ Icon, title, body }) => (
            <div
              key={title}
              className="group rounded-3xl border border-slate-200 bg-white/80 p-6 backdrop-blur-sm transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-slate-400 hover:shadow-[0_20px_40px_-24px_rgba(0,0,0,0.5)] dark:border-white/10 dark:bg-slate-900/60 dark:hover:border-white/25"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-900 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110 dark:border-white/10 dark:bg-white/[0.04] dark:text-white">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                {title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {body}
              </p>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="mt-12">
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            Send a note
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Fill this in and it opens a pre-written email in your own client.
            Nothing is stored on a server.
          </p>
          <div className="mt-5">
            <ContactForm />
          </div>
        </div>

        {/* FAQ mini-block */}
        <div className="mt-14">
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            Quick answers
          </h2>
          <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FAQ.map(({ q, a }) => (
              <div
                key={q}
                className="rounded-3xl border border-slate-200 bg-white/80 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60"
              >
                <dt className="text-sm font-bold text-slate-900 dark:text-white">
                  {q}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {a}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Direct mail fallback + back link */}
        <div className="mt-14 border-t border-slate-200 pt-6 dark:border-white/10">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Rather just email us?{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-bold text-accent hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-sm font-bold text-accent hover:underline"
          >
            Back to OffLimits
          </Link>
        </div>
      </div>
    </div>
  );
}

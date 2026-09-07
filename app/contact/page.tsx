import type { Metadata } from "next";
import Link from "next/link";
import { Bug, CreditCard, Handshake, Lightbulb } from "lucide-react";
import { ContactForm, CONTACT_EMAIL } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact the Team",
  description:
    "Real humans read and answer every note. Send a card idea, report a bug, ask about a 24-Hour Party Pass, or pitch a custom event.",
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
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Header */}
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          Contact the team
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
          No ticket maze, no chatbot, no canned auto-reply. Real humans read and
          answer every note, usually within a day.
        </p>

        {/* Category grid */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CATEGORY_CARDS.map(({ Icon, title, body }) => (
            <div
              key={title}
              className="rounded-3xl border border-slate-200 bg-white/80 p-6 backdrop-blur-sm transition-colors dark:border-white/10 dark:bg-slate-900/60"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white">
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

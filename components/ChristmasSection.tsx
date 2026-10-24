import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  ChristmasCountdown,
  JiggleBadge,
  SecretSantaGift,
  Snowfall,
} from "./HolidayFx";

const SIDE_CARDS = [
  {
    href: "/christmas-party-games",
    emoji: "🎄",
    badge: "bg-emerald-300",
    title: "Christmas party games",
    blurb: "Festive Would You Rather, charades and trivia for the whole family.",
  },
  {
    href: "/office-party-games",
    emoji: "🥂",
    badge: "bg-sky-300",
    title: "Office holiday party",
    blurb: "Icebreakers that get the team laughing, and nobody called into HR.",
  },
];

const CARD =
  "rounded-[1.75rem] border-[3px] border-slate-900 bg-white text-slate-900 shadow-[6px_6px_0_#0f172a] transition-[transform,box-shadow] duration-200 ease-out hover:-translate-x-0.5 hover:-translate-y-1 hover:shadow-[9px_9px_0_#0f172a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[3px_3px_0_#0f172a]";

/** Seasonal homepage band: a big interactive Secret Santa card plus quick
 * links to the Christmas and office party pages, over falling snow. */
export function ChristmasSection() {
  return (
    <section
      id="christmas"
      aria-labelledby="christmas-heading"
      className="relative scroll-mt-24 overflow-hidden border-y-[3px] border-slate-900 bg-gradient-to-br from-rose-500 via-rose-600 to-red-700"
    >
      <Snowfall />
      <div className="relative mx-auto max-w-content px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-fit -rotate-2 rounded-full border-2 border-slate-900 bg-yellow-300 px-3 py-0.5 text-xs font-black uppercase tracking-wider text-slate-900 shadow-[3px_3px_0_#0f172a]">
            ❄️ In season
          </span>
          <ChristmasCountdown />
        </div>
        <h2
          id="christmas-heading"
          className="mt-3 text-balance text-3xl font-black tracking-tight text-white [text-shadow:3px_3px_0_#0f172a] sm:text-5xl"
        >
          Christmas &amp; holidays
        </h2>
        <p className="mt-2 max-w-xl text-pretty text-sm font-medium text-rose-50 sm:text-base">
          Sort the gift swap, then keep the party going. Everything runs on one
          phone, free, with nothing to sign up for.
        </p>

        <div className="mt-7 grid gap-5 lg:grid-cols-[1.35fr_1fr]">
          <div className={`${CARD} relative flex flex-col items-center gap-4 p-6 sm:flex-row sm:p-8`}>
            <div className="flex-1 self-stretch sm:self-center">
              <span className="text-xs font-black uppercase tracking-wider text-rose-600">
                🎁 Gift swap
              </span>
              <h3 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
                Secret Santa
              </h3>
              <p className="mt-2 max-w-xs text-sm text-slate-600 sm:text-base">
                Type the names, hit draw, pass the phone. Nobody gets
                themselves and nobody else sees who you got.
              </p>
              <Link
                href="/secret-santa"
                className="mt-5 inline-flex items-center gap-2 rounded-full border-[3px] border-slate-900 bg-rose-400 px-5 py-2.5 text-sm font-black text-slate-900 shadow-[4px_4px_0_#0f172a] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#0f172a] active:translate-y-0.5 active:shadow-[2px_2px_0_#0f172a]"
              >
                Draw names
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <SecretSantaGift />
          </div>

          <div className="grid gap-5">
            {SIDE_CARDS.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className={`${CARD} group flex items-center gap-4 p-5 sm:p-6`}
              >
                <JiggleBadge emoji={card.emoji} className={card.badge} />
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-black tracking-tight">
                    {card.title}
                  </span>
                  <span className="mt-0.5 block text-sm text-slate-600">
                    {card.blurb}
                  </span>
                </span>
                <ArrowRight
                  className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-slate-900"
                  aria-hidden
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

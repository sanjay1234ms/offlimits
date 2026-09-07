import Link from "next/link";
import { ArrowRight, Smartphone, Tv } from "lucide-react";

interface WayCard {
  emoji: string;
  Icon: typeof Smartphone;
  heading: string;
  body: string;
  cta: string;
  href: string;
  primary?: boolean;
}

const WAYS: WayCard[] = [
  {
    emoji: "📱",
    Icon: Smartphone,
    heading: "Pass one phone",
    body: "One phone goes round the table. Read the prompt out, argue about it, tap for the next one. There is nothing to set up, because the page is the game.",
    cta: "Find a game",
    href: "/games",
  },
  {
    emoji: "📺",
    Icon: Tv,
    heading: "Open a party room",
    body: "Put a code on the biggest screen in the house and everyone joins on their own phone. The room sees the question. Only you see your answer.",
    cta: "Create a room",
    href: "/party",
    primary: true,
  },
];

/** Homepage section explaining the two play modes, right under the hero. */
export function TwoWaysToPlay() {
  return (
    <section className="mx-auto max-w-content px-4 pb-4 pt-2 sm:px-6">
      <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
        Two ways to play
      </h2>
      <p className="mt-2 max-w-2xl text-pretty text-sm text-muted sm:text-base">
        Pick a game, then pick how you play it. Both are free, and neither one
        asks anybody to sign up, install anything, or hand over an email
        address.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {WAYS.map((way) => (
          <div
            key={way.heading}
            className="tactile-card group flex flex-col gap-4 rounded-3xl border-2 border-white/10 bg-white/[0.03] p-6 backdrop-blur transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:border-white/25 hover:shadow-[0_28px_60px_-24px_rgba(0,0,0,0.6)] sm:p-7"
          >
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/5 text-3xl ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-110">
              {way.emoji}
            </span>

            <div>
              <h3 className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-foreground">
                <way.Icon className="h-4 w-4 text-accent" aria-hidden />
                {way.heading}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {way.body}
              </p>
            </div>

            <Link
              href={way.href}
              className={`mt-auto self-start ${way.primary ? "btn-primary" : "btn-ghost"}`}
            >
              {way.cta}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

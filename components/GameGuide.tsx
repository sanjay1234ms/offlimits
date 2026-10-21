"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SpinWheel } from "./SpinWheel";
import { GAME_GUIDES } from "@/data/gameGuides";
import { CATALOG } from "@/data/catalog";
import { shuffle } from "@/lib/shuffle";
import { faqJsonLd } from "@/lib/site";
import { JsonLd } from "./JsonLd";

interface GameGuideProps {
  /** Catalog slug (engine games) or `?game=` key (pass-the-phone) or "wheel". */
  slug: string;
}

function Block({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
        <span className="text-accent">{n}.</span> {title}
      </h2>
      <div className="mt-3 text-sm leading-relaxed text-muted">{children}</div>
    </div>
  );
}

/** The standardised 7-section editorial guide shown beneath every game and the
 * wheel. Sections are the same everywhere but headings name the game, so each
 * page's outline is specific to it; copy comes from data/gameGuides. */
export function GameGuide({ slug }: GameGuideProps) {
  const pool = useMemo(() => {
    const games = CATALOG.filter((g) => !g.adult && g.slug !== slug).map(
      (g) => ({
        href: g.href,
        emoji: g.emoji,
        title: g.title,
        blurb: g.blurb,
      }),
    );
    return slug === "wheel"
        ? games
        : [
            ...games,
            {
              href: "/wheel",
              emoji: "🎡",
              title: "Spin the Wheel",
              blurb: "Add anything, spin, and let it decide.",
            },
          ];
  }, [slug]);

  // Server and first client render show the same three picks; the shuffle
  // happens after mount so hydration matches.
  const [playNext, setPlayNext] = useState(() => pool.slice(0, 3));
  useEffect(() => {
    setPlayNext(shuffle(pool).slice(0, 3));
  }, [pool]);

  const guide = GAME_GUIDES[slug];
  if (!guide) return null;
  const name =
    slug === "wheel"
      ? "Spin the Wheel"
      : (CATALOG.find((g) => g.slug === slug)?.title ?? "this game");

  return (
    <section className="mx-auto max-w-2xl px-4 pb-16 pt-6 sm:px-6">
      <JsonLd data={faqJsonLd(guide.faq)} />
      <div className="my-8 h-px bg-border" />

      <div className="flex flex-col gap-10">
        <Block n={1} title={`How to Play ${name}`}>
          <ol className="list-decimal space-y-2 pl-5 marker:font-extrabold marker:text-accent">
            {guide.howToPlay.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </Block>

        <Block n={2} title={`How to Host ${name}`}>
          <ul className="space-y-2">
            {guide.hostPlaybook.map((tip, i) => (
              <li key={i} className="flex gap-2.5">
                <span
                  aria-hidden
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </Block>

        <Block n={3} title={`${name} Features and Twists`}>
          <ul className="space-y-2">
            {guide.features.map((feat, i) => (
              <li key={i} className="flex gap-2.5">
                <span
                  aria-hidden
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </Block>

        <Block n={4} title={`Playing ${name} with Your Group`}>
          <div className="space-y-3">
            {guide.rosterSharing.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </Block>

        <Block n={5} title={guide.wheel.title}>
          <p className="mb-4">
            Spin the{" "}
            <span className="font-bold text-foreground">
              {guide.wheel.title}
            </span>
            . Every slice below is editable, so tweak it to fit your group.
          </p>
          <SpinWheel
            initialOptions={guide.wheel.options}
            initialTitle={guide.wheel.title}
          />
        </Block>

        <Block n={6} title={`${name} FAQ`}>
          <div className="space-y-2">
            {guide.faq.map((item, i) => (
              <details
                key={i}
                className="group rounded-xl border border-border bg-surface/60 px-4 py-3 [&_summary::-webkit-details-marker]:hidden"
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
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </Block>

        <Block n={7} title="Play Next">
          <div className="grid gap-3 sm:grid-cols-3">
            {playNext.map((card) => (
              <Link
                key={card.href + card.title}
                href={card.href}
                className="glass-card flex flex-col gap-1.5 p-4 transition-transform duration-200 hover:-translate-y-1"
              >
                <span className="text-2xl" aria-hidden>
                  {card.emoji}
                </span>
                <span className="font-extrabold tracking-tight text-foreground">
                  {card.title}
                </span>
                <span className="line-clamp-2 text-xs text-muted">
                  {card.blurb}
                </span>
              </Link>
            ))}
          </div>
        </Block>
      </div>
    </section>
  );
}

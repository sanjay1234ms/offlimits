import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { CatalogCard } from "./CatalogCard";
import { SectionHeading } from "./SectionHeading";
import { catalogBySlug, type CatalogGame } from "@/data/catalog";
import type { LandingPage as LandingPageData } from "@/data/landingPages";
import { shareMetadata } from "@/lib/seo";

export function landingMetadata(page: LandingPageData): Metadata {
  return {
    title: { absolute: `${page.title} | OffLimits` },
    description: page.description,
    alternates: { canonical: page.path },
    ...shareMetadata(page.title, page.description, page.path),
  };
}

/** Seasonal / occasion landing page: intro, game picks with one-tap play,
 * ready-to-read prompts, host tips and an FAQ (also emitted as JSON-LD). */
export function LandingPage({ page }: { page: LandingPageData }) {
  const picks = page.picks
    .map((p) => ({ game: catalogBySlug(p.slug), why: p.why }))
    .filter((p): p is { game: CatalogGame; why: string } => !!p.game);
  const first = picks[0]?.game;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <div className="min-h-dvh bg-background pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="mx-auto max-w-content px-4 pb-6 pt-12 sm:px-6 sm:pt-16">
        <h1 className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          {page.h1}
        </h1>
        <div className="mt-4 flex max-w-2xl flex-col gap-3 text-pretty text-base text-muted sm:text-lg">
          {page.intro.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        {page.note ? (
          <p className="mt-3 max-w-2xl text-sm font-semibold text-foreground">
            {page.note}
          </p>
        ) : null}
        <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          {first ? (
            <Link href={first.href} className="btn-primary w-full sm:w-auto">
              Play {first.title} now
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          ) : null}
          {page.occasionHref ? (
            <Link href={page.occasionHref} className="btn-ghost w-full sm:w-auto">
              Play the curated deck
            </Link>
          ) : null}
          <Link href="/party" className="btn-ghost w-full sm:w-auto">
            Open a party room
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-content px-4 py-6 sm:px-6">
        <SectionHeading title={page.picksHeading} />
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {picks.map(({ game, why }) => (
            <div key={game.slug} className="flex flex-col gap-2">
              <CatalogCard game={game} />
              <p className="px-1 text-sm text-muted">{why}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <SectionHeading title={page.promptsHeading} />
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted marker:font-extrabold marker:text-accent sm:text-base">
          {page.prompts.map((prompt) => (
            <li key={prompt}>{prompt}</li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <SectionHeading title={page.tipsHeading} />
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted sm:text-base">
          {page.tips.map((tip) => (
            <li key={tip} className="flex gap-2.5">
              <span
                aria-hidden
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
              />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <SectionHeading title="Frequently asked questions" />
        <div className="mt-4 space-y-2">
          {page.faq.map((item) => (
            <details
              key={item.q}
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
      </section>
    </div>
  );
}

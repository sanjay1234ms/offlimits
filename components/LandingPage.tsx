import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { CatalogCard } from "./CatalogCard";
import { SectionHeading } from "./SectionHeading";
import { catalogBySlug, type CatalogGame } from "@/data/catalog";
import type { LandingPage as LandingPageData } from "@/data/landingPages";
import { shareMetadata } from "@/lib/seo";
import { PageHero } from "./PageHero";
import { RandomPick } from "./RandomPick";
import { Reveal } from "./Reveal";
import { JsonLd } from "./JsonLd";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/site";

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
export function LandingPage({
  page,
  children,
}: {
  page: LandingPageData;
  /** Interactive games shown right under the hero. */
  children?: React.ReactNode;
}) {
  const picks = page.picks
    .map((p) => ({ game: catalogBySlug(p.slug), why: p.why }))
    .filter((p): p is { game: CatalogGame; why: string } => !!p.game);
  const first = picks[0]?.game;
  const ideaNames = (page.ideas ?? []).flatMap((g) => g.items.map((i) => i.name));

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
      <JsonLd
        data={[
          faqJsonLd,
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: page.h1,
            url: absoluteUrl(page.path),
            numberOfItems: picks.length + ideaNames.length,
            itemListElement: [
              ...picks.map(({ game }, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: game.title,
                url: absoluteUrl(game.href),
              })),
              ...ideaNames.map((name, i) => ({
                "@type": "ListItem",
                position: picks.length + i + 1,
                name,
              })),
            ],
          },
          breadcrumbJsonLd([{ name: page.h1, path: page.path }]),
        ]}
      />

      <PageHero
        title={page.h1}
        eyebrow="🎉 Party guide"
        emojis={picks.slice(0, 3).map((p) => p.game.emoji)}
      >
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
            <Link
              href={page.occasionHref}
              className="btn-ghost w-full sm:w-auto"
            >
              Play the curated deck
            </Link>
          ) : null}
          <Link href="/party" className="btn-ghost w-full sm:w-auto">
            Open a party room
          </Link>
        </div>
        <div className="pb-6" />
      </PageHero>

      {children ? (
        <section id="play" className="mx-auto max-w-content scroll-mt-24 px-4 pb-4 pt-2 sm:px-6">
          {children}
        </section>
      ) : null}

      <section className="mx-auto max-w-content px-4 py-6 sm:px-6">
        <SectionHeading title={page.picksHeading} />
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {picks.map(({ game, why }, i) => (
            <Reveal key={game.slug} delay={(i % 3) * 90}>
              <div className="flex h-full flex-col gap-2">
                <CatalogCard game={game} />
                <p className="px-1 text-sm text-muted">{why}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {page.ideas?.map((group, gi) => (
        <section key={group.heading} className="mx-auto max-w-content px-4 py-6 sm:px-6">
          <SectionHeading title={group.heading} />
          {group.intro ? <p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">{group.intro}</p> : null}
          <ol className="mt-5 grid gap-3 sm:grid-cols-2">
            {group.items.map((idea, i) => {
              const n = group.plain
                ? i + 1
                : (page.ideas ?? []).slice(0, gi).filter((g) => !g.plain).reduce((k, g) => k + g.items.length, 0) + i + 1;
              return (
                <li key={idea.name}>
                  <Reveal delay={(i % 2) * 80}>
                    <div className="glass-card flex h-full gap-3 p-4 transition-transform duration-200 hover:-translate-y-0.5 sm:p-5">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-sm font-extrabold text-white">
                        {n}
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-extrabold text-foreground">{idea.name}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted">{idea.how}</p>
                        {group.plain ? null : (
                        <p className="mt-2 flex flex-wrap gap-1.5 text-[11px] font-bold">
                          {idea.players ? (
                            <span className="rounded-full bg-white/5 px-2 py-0.5 text-muted ring-1 ring-border">👥 {idea.players}</span>
                          ) : null}
                          <span className="rounded-full bg-white/5 px-2 py-0.5 text-muted ring-1 ring-border">
                            🧰 {idea.needs ?? "Nothing needed"}
                          </span>
                        </p>
                        )}
                      </div>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </section>
      ))}

      <section
        id="landing-prompts"
        className="mx-auto max-w-2xl px-4 py-8 sm:px-6"
      >
        <SectionHeading title={page.promptsHeading} />
        <RandomPick target="landing-prompts" />
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted marker:font-extrabold marker:text-accent sm:text-base">
          {page.prompts.map((prompt) => (
            <li key={prompt} className="rounded-lg px-2 py-1 transition-colors">
              {prompt}
            </li>
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

      {page.related?.length ? (
        <section className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
          <SectionHeading title="Keep the party going" />
          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {page.related.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="flex items-center gap-2 rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm font-semibold text-foreground transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-accent"
                >
                  <span aria-hidden>{r.emoji}</span>
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

import type { Metadata } from "next";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import { GameRunner } from "@/components/games/GameRunner";
import { CompetitiveShell } from "@/components/games/CompetitiveShell";
import { GameGuide } from "@/components/GameGuide";
import { PlayScreen } from "@/components";
import { catalogBySlug, ENGINE_SLUGS } from "@/data/catalog";
import { COMPETITIVE_ENGINE_SLUGS } from "@/data/competitive";
import {
  CORE_GAME_PAGES,
  ENGINE_GAME_SEO,
  corePageBySlug,
} from "@/data/corePages";
import { shareMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, webApplicationJsonLd } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { logoMotion } from "@/data/logoMotion";

interface GamePageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return [...CORE_GAME_PAGES.map((p) => p.slug), ...ENGINE_SLUGS].map(
    (slug) => ({ slug }),
  );
}

export function generateMetadata({ params }: GamePageProps): Metadata {
  const core = corePageBySlug(params.slug);
  if (core) {
    return {
      title: { absolute: `${core.title} | OffLimits` },
      description: core.description,
      alternates: { canonical: `/games/${core.slug}` },
      ...shareMetadata(core.title, core.description, `/games/${core.slug}`),
    };
  }
  const game = catalogBySlug(params.slug);
  if (!game) return {};
  const seo = ENGINE_GAME_SEO[params.slug];
  return {
    title: seo ? { absolute: `${seo.title} | OffLimits` } : game.title,
    description: seo?.description ?? game.blurb,
    alternates: { canonical: `/games/${params.slug}` },
    ...(seo
      ? shareMetadata(seo.title, seo.description, `/games/${params.slug}`)
      : {}),
  };
}

const PLAY_REDIRECTS: Record<string, string> = {
  "18plus": "/play?game=18plus",
  "18-uncensored": "/play?game=18plus",
  would_you_rather: "/games/would-you-rather",
  never_have_i_ever: "/games/never-have-i-ever",
  most_likely_to: "/games/most-likely-to",
  this_or_that: "/games/this-or-that",
  truth_or_dare: "/games/truth-or-dare",
};

export default function GamePage({ params }: GamePageProps) {
  const redirectTo = PLAY_REDIRECTS[params.slug];
  if (redirectTo) {
    // Old underscore URLs moved for good; the 18+ aliases just hop to /play.
    if (redirectTo.startsWith("/games/")) permanentRedirect(redirectTo);
    redirect(redirectTo);
  }

  // The five pass-the-phone games each get their own page on the /play engine.
  const core = corePageBySlug(params.slug);
  if (core) {
    const path = `/games/${core.slug}`;
    return (
      <>
        <JsonLd
          data={[
            webApplicationJsonLd({
              name: core.h1,
              description: core.description,
              path,
            }),
            breadcrumbJsonLd([
              { name: "Games", path: "/games" },
              { name: core.h1, path },
            ]),
          ]}
        />
        <PlayScreen
          key={core.slug}
          initialGame={core.game}
          heading={core.h1}
          intro={core.intro}
          linkTabs
        />
      </>
    );
  }

  const game = catalogBySlug(params.slug);
  if (!game || !game.engine) notFound();

  const competitive = COMPETITIVE_ENGINE_SLUGS.includes(params.slug);
  const path = `/games/${params.slug}`;

  return (
    <div className="min-h-dvh bg-background pb-24">
      <JsonLd
        data={[
          webApplicationJsonLd({
            name: game.title,
            description: ENGINE_GAME_SEO[params.slug]?.description ?? game.blurb,
            path,
          }),
          breadcrumbJsonLd([
            { name: "Games", path: "/games" },
            { name: game.title, path },
          ]),
        ]}
      />
      <PageHero
        title={ENGINE_GAME_SEO[params.slug]?.h1 ?? game.title}
        icon={
          <span
            aria-hidden
            data-motion={logoMotion(game.slug)}
            className="game-logo is-playing inline-block"
          >
            {game.emoji}
          </span>
        }
        eyebrow={`🎮 ${game.players} · ${game.time}`}
        emojis={[game.emoji, "🎉"]}
        width="max-w-2xl"
      >
        <p className="mt-3 max-w-xl text-sm text-muted sm:text-base">
          {game.blurb}
        </p>
      </PageHero>
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="mt-8">
          {competitive ? (
            <CompetitiveShell gameTitle={game.title} gameSlug={params.slug}>
              <GameRunner slug={params.slug} />
            </CompetitiveShell>
          ) : (
            <GameRunner slug={params.slug} />
          )}
        </div>
      </div>

      <GameGuide slug={params.slug} />
    </div>
  );
}

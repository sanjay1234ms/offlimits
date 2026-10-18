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
      openGraph: { title: core.title, description: core.description },
    };
  }
  const game = catalogBySlug(params.slug);
  if (!game) return {};
  const seo = ENGINE_GAME_SEO[params.slug];
  return {
    title: seo ? { absolute: `${seo.title} | OffLimits` } : game.title,
    description: seo?.description ?? game.blurb,
    alternates: { canonical: `/games/${params.slug}` },
    openGraph: seo
      ? { title: seo.title, description: seo.description }
      : undefined,
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
    return (
      <PlayScreen
        key={core.slug}
        initialGame={core.game}
        heading={core.h1}
        intro={core.intro}
        linkTabs
      />
    );
  }

  const game = catalogBySlug(params.slug);
  if (!game || !game.engine) notFound();

  const competitive = COMPETITIVE_ENGINE_SLUGS.includes(params.slug);

  return (
    <div className="min-h-dvh bg-background pb-24">
      <div className="mx-auto max-w-2xl px-4 pt-10 sm:px-6">
        <h1
          className={`flex items-center gap-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl`}
        >
          <span aria-hidden>{game.emoji}</span>
          {game.title}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted sm:text-base">
          {game.blurb}
        </p>
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

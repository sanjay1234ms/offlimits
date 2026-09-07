import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { GameRunner } from "@/components/games/GameRunner";
import { CompetitiveShell } from "@/components/games/CompetitiveShell";
import { GameGuide } from "@/components/GameGuide";
import { catalogBySlug, ENGINE_SLUGS } from "@/data/catalog";
import { COMPETITIVE_ENGINE_SLUGS } from "@/data/competitive";

interface GamePageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return ENGINE_SLUGS.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: GamePageProps): Metadata {
  const game = catalogBySlug(params.slug);
  if (!game) return {};
  return { title: game.title, description: game.blurb };
}

const PLAY_REDIRECTS: Record<string, string> = {
  "18plus": "/play?game=18plus",
  "18-uncensored": "/play?game=18plus",
  "this-or-that": "/play?game=this_or_that",
  this_or_that: "/play?game=this_or_that",
  "truth-or-dare": "/play?game=truth_or_dare",
  truth_or_dare: "/play?game=truth_or_dare",
};

export default function GamePage({ params }: GamePageProps) {
  // Games that live on the main /play tab bar rather than a local engine.
  const redirectTo = PLAY_REDIRECTS[params.slug];
  if (redirectTo) redirect(redirectTo);

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

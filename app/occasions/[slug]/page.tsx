import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlayScreen } from "@/components";
import { occasionBySlug, occasionSlugs } from "@/data/filters";

interface OccasionPageProps {
  params: { slug: string };
}

/** Pre-render a static page for each known occasion slug. */
export function generateStaticParams() {
  return occasionSlugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: OccasionPageProps): Metadata {
  const occasion = occasionBySlug(params.slug);
  if (!occasion) return {};
  return {
    title: `${occasion} party games`,
    description: `Pass-the-phone games picked for ${occasion.toLowerCase()}.`,
  };
}

export default function OccasionPage({ params }: OccasionPageProps) {
  const occasion = occasionBySlug(params.slug);
  if (!occasion) notFound();
  return <PlayScreen initialOccasion={occasion} />;
}

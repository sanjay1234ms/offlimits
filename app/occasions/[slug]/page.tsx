import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlayScreen } from "@/components";
import { occasionBySlug, occasionSlugs } from "@/data/filters";
import { shareMetadata } from "@/lib/seo";

/** Titles per occasion, so each page reads differently in search. */
const OCCASION_TITLES: Record<string, string> = {
  "office-party": "Office Party Questions: Work-Safe Games on One Phone",
  "game-night": "Game Night Questions: Free Party Games on One Phone",
  "road-trip": "Road Trip Games: Free Car Questions on One Phone",
  "date-night": "Date Night Questions: Free Couples Games on One Phone",
  birthday: "Birthday Party Games: Free Questions for Any Age",
  holidays: "Holiday Party Games: Free Festive Questions for Groups",
};

/** Meta descriptions per occasion, so each page reads differently in search. */
const OCCASION_DESCRIPTIONS: Record<string, string> = {
  "office-party":
    "Office party games on one phone: work-safe Would You Rather, Most Likely To and Never Have I Ever questions filtered for coworkers. Free, no signup or download.",
  "game-night":
    "Game night questions on one phone: Would You Rather, Most Likely To, Never Have I Ever and more, for a night in with friends. Free, no signup or download.",
  "road-trip":
    "Road trip games for the car: Would You Rather, This or That and Most Likely To questions to read out from one phone. No props, no pen, free and no signup.",
  "date-night":
    "Date night questions for couples on one phone: Would You Rather, Never Have I Ever and This or That, from cute to deep. Free, no signup and no app to download.",
  birthday:
    "Birthday party games on one phone: Would You Rather, Most Likely To and Never Have I Ever questions for birthdays of any age. Free, no signup or download.",
  holidays:
    "Holiday party games on one phone: festive Would You Rather, Most Likely To and Never Have I Ever questions for family and friends. Free, no signup or download.",
};

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
  const title =
    OCCASION_TITLES[params.slug] ??
    `${occasion} Party Games: Free Questions & Games`;
  const description =
    OCCASION_DESCRIPTIONS[params.slug] ??
    `Free ${occasion.toLowerCase()} party games on one phone: Would You Rather, Most Likely To, Never Have I Ever and more, filtered for ${occasion.toLowerCase()}. No signup, no download.`;
  return {
    title,
    description,
    alternates: { canonical: `/occasions/${params.slug}` },
    ...shareMetadata(title, description, `/occasions/${params.slug}`),
  };
}

export default function OccasionPage({ params }: OccasionPageProps) {
  const occasion = occasionBySlug(params.slug);
  if (!occasion) notFound();
  return (
    <PlayScreen
      initialOccasion={occasion}
      heading={`${occasion} Party Games`}
    />
  );
}

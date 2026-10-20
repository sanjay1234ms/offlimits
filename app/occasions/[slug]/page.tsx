import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlayScreen } from "@/components";
import { JsonLd } from "@/components/JsonLd";
import { occasionBySlug, occasionSlugs } from "@/data/filters";
import { shareMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/site";

/** Per-occasion copy, so each page reads differently in search and on screen. */
const OCCASION_COPY: Record<
  string,
  { title: string; description: string; h1: string; intro: string }
> = {
  "road-trip": {
    title: "Road Trip Games: Free Car Questions on One Phone",
    description:
      "Road trip games for the car: Would You Rather, This or That and Most Likely To questions to read out from one phone. No props, no pen, free and no signup.",
    h1: "Road Trip Games",
    intro:
      "Car games for long drives: the passenger reads each question out loud and everyone in the car answers, driver included. No props, no pens, no screens to pass around.",
  },
  birthday: {
    title: "Birthday Party Games: Free Questions for Any Age",
    description:
      "Birthday party games on one phone: Would You Rather, Most Likely To and Never Have I Ever questions for birthdays of any age. Free, no signup or download.",
    h1: "Birthday Party Games",
    intro:
      "Birthday questions that put the guest of honour in the spotlight: read one out, let the room answer, and keep the birthday person guessing. Works for kids' parties and grown-up birthdays alike.",
  },
};

interface OccasionPageProps {
  params: { slug: string };
}

export const dynamicParams = false;

/** Pre-render a static page for each known occasion slug. */
export function generateStaticParams() {
  return occasionSlugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: OccasionPageProps): Metadata {
  const occasion = occasionBySlug(params.slug);
  const copy = OCCASION_COPY[params.slug];
  if (!occasion || !copy) return {};
  return {
    title: copy.title,
    description: copy.description,
    alternates: { canonical: `/occasions/${params.slug}` },
    ...shareMetadata(copy.title, copy.description, `/occasions/${params.slug}`),
  };
}

export default function OccasionPage({ params }: OccasionPageProps) {
  const occasion = occasionBySlug(params.slug);
  const copy = OCCASION_COPY[params.slug];
  if (!occasion || !copy) notFound();
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: copy.h1, path: `/occasions/${params.slug}` },
        ])}
      />
      <PlayScreen
        initialOccasion={occasion}
        heading={copy.h1}
        intro={copy.intro}
      />
    </>
  );
}

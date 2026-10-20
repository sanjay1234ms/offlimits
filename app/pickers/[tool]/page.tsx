import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PickerRunner } from "@/components/pickers/PickerRunner";
import { PICKER_META, PICKER_SLUGS } from "@/data/pickers";
import { shareMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";

interface PickerPageProps {
  params: { tool: string };
}

export function generateStaticParams() {
  return PICKER_SLUGS.map((tool) => ({ tool }));
}

export function generateMetadata({ params }: PickerPageProps): Metadata {
  const meta = PICKER_META[params.tool];
  if (!meta) return {};
  return {
    title: meta.seoTitle,
    description: meta.description,
    alternates: { canonical: `/pickers/${params.tool}` },
    ...shareMetadata(
      meta.seoTitle,
      meta.description,
      `/pickers/${params.tool}`,
    ),
  };
}

export default function PickerPage({ params }: PickerPageProps) {
  const meta = PICKER_META[params.tool];
  if (!meta) notFound();

  return (
    <div className="min-h-dvh bg-background pb-24">
      <PageHero
        title={meta.title}
        eyebrow="🎲 Random picker"
        emojis={["🎲", "🙋", "✨"]}
        width="max-w-xl"
      >
        <p className="mt-3 text-sm text-muted sm:text-base">{meta.blurb}</p>
      </PageHero>
      <div className="mx-auto max-w-xl px-4 sm:px-6">
        <div className="mt-8">
          <PickerRunner tool={params.tool} />
        </div>
      </div>
    </div>
  );
}

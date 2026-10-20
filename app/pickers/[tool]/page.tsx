import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PickerRunner } from "@/components/pickers/PickerRunner";
import { PICKER_META, PICKER_SLUGS } from "@/data/pickers";
import { shareMetadata } from "@/lib/seo";

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
    ...shareMetadata(meta.seoTitle, meta.description, `/pickers/${params.tool}`),
  };
}

export default function PickerPage({ params }: PickerPageProps) {
  const meta = PICKER_META[params.tool];
  if (!meta) notFound();

  return (
    <div className="min-h-dvh bg-background pb-24">
      <div className="mx-auto max-w-xl px-4 pt-10 sm:px-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {meta.title}
        </h1>
        <p className="mt-2 text-sm text-muted sm:text-base">{meta.blurb}</p>
        <div className="mt-8">
          <PickerRunner tool={params.tool} />
        </div>
      </div>
    </div>
  );
}

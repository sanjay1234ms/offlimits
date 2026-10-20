import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PickerRunner } from "@/components/pickers/PickerRunner";
import { PICKER_META, PICKER_SLUGS } from "@/data/pickers";
import { shareMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  webApplicationJsonLd,
} from "@/lib/site";
import { PICKER_GUIDES } from "@/data/pickerGuides";

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
  const path = `/pickers/${params.tool}`;
  const guide = PICKER_GUIDES[params.tool];

  return (
    <div className="min-h-dvh bg-background pb-24">
      <JsonLd
        data={[
          webApplicationJsonLd({
            name: meta.title,
            description: meta.description,
            path,
            category: "UtilitiesApplication",
          }),
          breadcrumbJsonLd([{ name: meta.title, path }]),
          ...(guide ? [faqJsonLd(guide.faq)] : []),
        ]}
      />
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
      {guide ? (
        <section className="mx-auto max-w-xl px-4 pt-6 sm:px-6">
          <div className="my-8 h-px bg-border" />
          <div className="flex flex-col gap-10">
            <div>
              <h2 className="text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
                How to use the {meta.title}
              </h2>
              <div className="mt-3 text-sm leading-relaxed text-muted">
                <p>{guide.intro}</p>
                <ol className="mt-3 list-decimal space-y-2 pl-5 marker:font-extrabold marker:text-accent">
                  {guide.howTo.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
                {meta.title} FAQ
              </h2>
              <div className="mt-3 space-y-2">
                {guide.faq.map((item) => (
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
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

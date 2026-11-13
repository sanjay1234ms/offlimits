import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SpinWheel } from "@/components";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { WHEEL_PAGES, wheelPageBySlug } from "@/data/wheelPages";
import { shareMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, faqJsonLd, webApplicationJsonLd } from "@/lib/site";

interface Props {
  params: { preset: string };
}

export const dynamicParams = false;

export function generateStaticParams() {
  return WHEEL_PAGES.map((p) => ({ preset: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const page = wheelPageBySlug(params.preset);
  if (!page) return {};
  const path = `/wheel/${page.slug}`;
  return {
    title: { absolute: `${page.title} | OffLimits` },
    description: page.description,
    alternates: { canonical: path },
    ...shareMetadata(page.title, page.description, path),
  };
}

export default function WheelPresetPage({ params }: Props) {
  const page = wheelPageBySlug(params.preset);
  if (!page) notFound();
  const path = `/wheel/${page.slug}`;
  const others = WHEEL_PAGES.filter((p) => p.slug !== page.slug);

  return (
    <div className="min-h-dvh bg-background pb-24">
      <JsonLd
        data={[
          webApplicationJsonLd({
            name: page.h1,
            description: page.description,
            path,
            category: "UtilitiesApplication",
          }),
          faqJsonLd(page.faq),
          breadcrumbJsonLd([
            { name: "Spin the Wheel", path: "/wheel" },
            { name: page.h1, path },
          ]),
        ]}
      />
      <PageHero title={page.h1} eyebrow="🎡 Ready-made wheel" emojis={page.emojis}>
        <p className="mt-3 max-w-xl text-sm text-muted sm:text-base">{page.blurb}</p>
      </PageHero>

      <div className="mx-auto max-w-content px-4 sm:px-6">
        <div className="mt-8">
          <SpinWheel initialOptions={page.options} initialTitle={page.h1} />
        </div>
      </div>

      <section className="mx-auto max-w-xl px-4 pt-6 sm:px-6">
        <div className="my-8 h-px bg-border" />
        <div className="flex flex-col gap-10">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
              How to use the {page.h1.replace(/\?$/, "")}
            </h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted marker:font-extrabold marker:text-accent">
              {page.howTo.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-foreground sm:text-xl">FAQ</h2>
            <div className="mt-3 space-y-2">
              {page.faq.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-xl border border-border bg-surface/60 px-4 py-3 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-foreground">
                    {item.q}
                    <span aria-hidden className="text-lg leading-none text-muted transition-transform duration-200 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-foreground sm:text-xl">More ready-made wheels</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {others.map((p) => (
                <Link
                  key={p.slug}
                  href={`/wheel/${p.slug}`}
                  className="rounded-full border-2 border-border bg-surface/60 px-3 py-1.5 text-sm font-bold text-foreground transition-colors hover:border-accent"
                >
                  {p.h1}
                </Link>
              ))}
              <Link
                href="/wheel"
                className="rounded-full border-2 border-accent px-3 py-1.5 text-sm font-bold text-accent"
              >
                Make your own wheel
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

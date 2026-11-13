import type { Metadata } from "next";
import { shareMetadata } from "@/lib/seo";
import { GameGuide, SpinWheel } from "@/components";
import Link from "next/link";
import { WHEEL_PRESETS } from "@/data/wheelPresets";
import { WHEEL_PAGES } from "@/data/wheelPages";
import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, webApplicationJsonLd } from "@/lib/site";

interface WheelPageProps {
  searchParams?: { preset?: string };
}

const TITLE = "Spin the Wheel: Free Random Picker Wheel";
const DESCRIPTION =
  "Free spin the wheel picker: type in names or options, spin, and let it pick a random winner. Decide who goes first, what to eat or who buys the next round.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/wheel" },
  ...shareMetadata(TITLE, DESCRIPTION, "/wheel"),
};

export default function WheelPage({ searchParams }: WheelPageProps) {
  const preset = searchParams?.preset
    ? WHEEL_PRESETS[searchParams.preset]
    : undefined;

  return (
    <div className="min-h-dvh bg-background pb-24">
      <JsonLd
        data={[
          webApplicationJsonLd({
            name: "Spin the Wheel",
            description: DESCRIPTION,
            path: "/wheel",
          }),
          breadcrumbJsonLd([{ name: "Spin the Wheel", path: "/wheel" }]),
        ]}
      />
      <PageHero
        title="Spin the Wheel"
        eyebrow="🎡 Decide anything"
        emojis={["🎡", "🍕", "🎯"]}
      >
        <p className="mt-3 max-w-xl text-sm text-muted sm:text-base">
          Add names or options, give it a spin, and let the wheel pick. Great
          for deciding who goes first, what to eat, or who is buying the next
          round.
        </p>
      </PageHero>
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <div className="mt-8">
          <SpinWheel
            initialOptions={preset?.options}
            initialTitle={preset?.label}
          />
        </div>
      </div>

      <section className="mx-auto max-w-content px-4 pt-10 sm:px-6">
        <h2 className="text-lg font-extrabold tracking-tight text-foreground sm:text-xl">Ready-made wheels</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {WHEEL_PAGES.map((p) => (
            <Link
              key={p.slug}
              href={`/wheel/${p.slug}`}
              className="rounded-full border-2 border-border bg-surface/60 px-3 py-1.5 text-sm font-bold text-foreground transition-colors hover:border-accent"
            >
              {p.h1}
            </Link>
          ))}
        </div>
      </section>

      <GameGuide slug="wheel" />
    </div>
  );
}

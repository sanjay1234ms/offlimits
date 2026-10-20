import type { Metadata } from "next";
import { shareMetadata } from "@/lib/seo";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/site";

const TITLE = "Terms of Service: 18+ Rules and Party Pass";
const DESCRIPTION =
  "OffLimits terms of service: the party games are free and provided as-is for fun, 18+ content is for adults only, and the 24-Hour Party Pass is non-refundable.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/terms" },
  ...shareMetadata(TITLE, DESCRIPTION, "/terms"),
};

export default function TermsPage() {
  return (
    <div className="min-h-dvh bg-background">
      <JsonLd data={breadcrumbJsonLd([{ name: "Terms of Service", path: "/terms" }])} />
      <PageHero
        title="Terms of Service"
        eyebrow="📜 The fine print"
        emojis={["📜", "🤝"]}
        width="max-w-2xl"
      />
      <div className="mx-auto max-w-2xl px-4 pb-14 sm:px-6">
        <div className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-muted sm:text-base">
          <p>
            OffLimits is provided free of charge, as-is, for entertainment. We
            make no guarantee that any game, deck or feature will remain
            available, and we may change or remove content at any time.
          </p>
          <p>
            The 18+ content is for adults only. By entering it you confirm you
            are 18 years of age or older.
          </p>
          <p>
            Play responsibly. Hosts are responsible for keeping dares and
            forfeits safe, legal and consensual. Nothing in any game is a
            suggestion or instruction to do anything dangerous or illegal.
          </p>
          <p>
            The 24-Hour Party Pass unlocks 18+ content on the device it is
            activated on for 24 hours. It is non-refundable once activated.
          </p>
        </div>
        <div className="mt-10 border-t border-border pt-6">
          <Link
            href="/"
            className="text-sm font-bold text-accent hover:underline"
          >
            ← Back to OffLimits
          </Link>
        </div>
      </div>
    </div>
  );
}

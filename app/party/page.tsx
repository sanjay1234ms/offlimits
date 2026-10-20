import type { Metadata } from "next";
import { shareMetadata } from "@/lib/seo";
import { PartyForm, PartyInfo } from "@/components";
import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/site";

const TITLE = "Party Room: Everyone Plays on Their Own Phone";
const DESCRIPTION =
  "Open a free party room, put the code on the biggest screen, and everyone joins on their own phone. The room sees the question, only you see your answer.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/party" },
  ...shareMetadata(TITLE, DESCRIPTION, "/party"),
};

export default function PartyPage() {
  return (
    <div className="min-h-dvh bg-background pb-24">
      <JsonLd data={breadcrumbJsonLd([{ name: "Party room", path: "/party" }])} />
      <PageHero
        title="Party room"
        eyebrow="📺 Everyone on their own phone"
        emojis={["📺", "📱", "🎉"]}
      >
        <p className="mt-3 max-w-2xl text-pretty text-base text-muted sm:text-lg">
          Open a room, put the code on the biggest screen in the house, and
          everyone joins on their own phone. The room sees the question. Only
          you see your answer.
        </p>
      </PageHero>
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <div className="mt-8">
          <PartyForm />
        </div>

        <PartyInfo />
      </div>
    </div>
  );
}

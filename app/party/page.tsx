import type { Metadata } from "next";
import Link from "next/link";
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

        <Link
          href="/werewolf-game"
          className="group mt-8 flex items-center gap-4 overflow-hidden rounded-[2rem] border border-white/10 p-5 text-white transition-transform hover:-translate-y-0.5 sm:p-6"
          style={{ background: "radial-gradient(120% 120% at 90% 0%, rgba(220,38,38,0.4), transparent 60%), linear-gradient(135deg, #050816, #1b1446)" }}
        >
          <span className="text-5xl transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110">🐺</span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-black uppercase tracking-[0.18em] text-red-300">New · Party Room</span>
            <span className="block text-lg font-black sm:text-xl">Werewolf &amp; Mafia: secret roles on every phone</span>
            <span className="block text-sm text-white/70">The host&apos;s phone narrates the night. Everyone else gets their role, kills, saves and votes on their own screen.</span>
          </span>
          <span className="hidden rounded-full bg-white px-4 py-2 text-sm font-black text-slate-900 sm:block">Play</span>
        </Link>

        <PartyInfo />
      </div>
    </div>
  );
}

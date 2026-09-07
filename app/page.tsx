import Link from "next/link";
import { Dices } from "lucide-react";
import {
  CompetitiveGames,
  GameCatalog,
  Hero,
  OccasionStrip,
  RandomPickers,
  ReadyMadeWheels,
  SectionHeading,
  TwoWaysToPlay,
} from "@/components";

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-background">
      <main>
        <Hero />

        <section
          id="party-games"
          className="mx-auto max-w-content scroll-mt-24 px-4 pb-4 pt-6 sm:px-6"
        >
          <SectionHeading
            title="Pick your poison"
            subtitle="The full catalog, thirteen ways to make a room talk."
          />
          <div className="mt-5">
            <GameCatalog />
          </div>
        </section>

        <CompetitiveGames />

        <RandomPickers />

        <ReadyMadeWheels />

        <div id="how-it-works" className="scroll-mt-24 pt-2">
          <TwoWaysToPlay />
        </div>

        <section className="py-10">
          <div className="mx-auto max-w-content px-4 pb-3 sm:px-6">
            <SectionHeading
              title="Browse by occasion"
              subtitle="Matched to the room you're in."
            />
          </div>
          <div className="mt-3">
            <OccasionStrip />
          </div>
        </section>

        <section className="mx-auto max-w-content px-4 py-10 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800/40 to-slate-900/20 p-6 backdrop-blur sm:p-9">
            <div
              aria-hidden
              className="pointer-events-none absolute -left-20 -top-20 h-52 w-52 rounded-full bg-indigo-500/15 blur-3xl"
            />
            <div className="relative flex flex-col items-start gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-soft text-2xl ring-1 ring-white/10">
                <Dices className="h-6 w-6 text-accent" aria-hidden />
              </span>
              <h2 className="text-balance text-2xl font-extrabold tracking-tight text-foreground">
                Can&apos;t decide? Spin for it.
              </h2>
              <p className="max-w-lg text-sm text-muted sm:text-base">
                Drop in names or dares, hit spin, and let the wheel pick. No
                app, no sign-up, no setup.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/games" className="btn-primary">
                  Start playing
                </Link>
                <Link href="/wheel" className="btn-ghost">
                  Spin the wheel
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

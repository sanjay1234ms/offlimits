import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { breadcrumbJsonLd, faqJsonLd, webApplicationJsonLd } from "@/lib/site";
import { DAILY_GAMES, type DailyGame } from "@/data/daily/puzzles";

interface DailyGamePageProps {
  game: DailyGame;
  title: string;
  description: string;
  intro: string;
  steps: string[];
  tips: { title: string; body: string }[];
  faq: { q: string; a: string }[];
  children: React.ReactNode;
}

/** Shared page shell for each daily puzzle: header, the game, then how to
 * play, tips and FAQ for people (and search engines) who want the rules. */
export function DailyGamePage({ game, title, description, intro, steps, tips, faq, children }: DailyGamePageProps) {
  return (
    <div className="min-h-dvh bg-background pb-24">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Daily puzzles", path: "/daily" },
            { name: game.name, path: game.href },
          ]),
          webApplicationJsonLd({ name: `${game.name} by OffLimits`, description, path: game.href }),
          faqJsonLd(faq),
        ]}
      />
      <PageHero title={title} eyebrow={`${game.emoji} Daily ${game.genre.toLowerCase()} puzzle`} emojis={[game.emoji, "🏆", "📅"]}>
        <p className="mt-3 max-w-2xl text-pretty text-base text-muted sm:text-lg">{intro}</p>
        <p className="mt-2 text-sm font-semibold text-muted">
          1+ players · about {game.minutes} min · free, no signup · new puzzle at midnight
        </p>
      </PageHero>

      <div className="mx-auto max-w-content px-4 sm:px-6">
        <div className="mt-6">{children}</div>

        <section className="mx-auto mt-14 max-w-3xl">
          <SectionHeading eyebrow="📖 How to play" title={`How to play ${game.name}`} />
          <ol className="mt-5 space-y-3">
            {steps.map((s, i) => (
              <li key={i} className="flex gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-slate-900 bg-yellow-300 text-sm font-black text-slate-900">
                  {i + 1}
                </span>
                <p className="text-sm text-muted sm:text-base">{s}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mx-auto mt-12 max-w-3xl">
          <SectionHeading eyebrow="🧠 Get better" title="Tips from regular players" />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {tips.map((t) => (
              <div key={t.title} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
                <h3 className="font-extrabold text-foreground">{t.title}</h3>
                <p className="mt-1 text-sm text-muted">{t.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-3xl">
          <SectionHeading eyebrow="❓ FAQ" title="Common questions" />
          <div className="mt-5 space-y-2">
            {faq.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
                <summary className="cursor-pointer list-none font-extrabold text-foreground">
                  {f.q}
                  <span className="float-right transition-transform group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </summary>
                <p className="mt-2 text-sm text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-3xl">
          <SectionHeading eyebrow="▶️ Play next" title="More daily puzzles" />
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {DAILY_GAMES.filter((g) => g.id !== game.id).map((g) => (
              <Link
                key={g.id}
                href={g.href}
                className={`rounded-2xl border-[3px] border-slate-900 p-4 text-slate-900 shadow-[4px_4px_0_#0f172a] transition-transform hover:-translate-y-0.5 ${g.color}`}
              >
                <span className="text-2xl" aria-hidden>
                  {g.emoji}
                </span>
                <p className="mt-1 font-black">{g.name}</p>
                <p className="text-xs font-semibold text-slate-700">{g.tagline}</p>
              </Link>
            ))}
            <Link
              href="/party"
              className="rounded-2xl border-[3px] border-slate-900 bg-white p-4 text-slate-900 shadow-[4px_4px_0_#0f172a] transition-transform hover:-translate-y-0.5"
            >
              <span className="text-2xl" aria-hidden>
                📺
              </span>
              <p className="mt-1 font-black">Party Room</p>
              <p className="text-xs font-semibold text-slate-700">Got friends over? Everyone plays on their own phone.</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

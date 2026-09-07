import {
  ChevronDown,
  DoorOpen,
  Gauge,
  Megaphone,
  MessageSquare,
  Monitor,
  Timer,
  Trophy,
  Users,
} from "lucide-react";

const STEPS = [
  {
    n: 1,
    Icon: DoorOpen,
    title: "Open the room",
    body: "Pick your games and hit open. A six-letter code appears, put it on the TV, a laptop, or any screen everyone can see.",
  },
  {
    n: 2,
    Icon: Users,
    title: "Everyone joins",
    body: "Players open this page on their own phones and type the code. No app to download, no account to make.",
  },
  {
    n: 3,
    Icon: Trophy,
    title: "Play and keep score",
    body: "The shared screen shows the prompt. Everyone answers on their phone. Points tally up automatically between rounds.",
  },
];

const TIPS = [
  {
    Icon: Monitor,
    title: "Put the shared screen down",
    body: "Lay the laptop flat or angle the TV so nobody has to crane their neck. The shared screen is the board, treat it like one.",
  },
  {
    Icon: Megaphone,
    title: "Read the code out loud",
    body: "Don't just point at the screen. Say the six letters twice while people are still finding the join page.",
  },
  {
    Icon: Timer,
    title: "Close the round early",
    body: "If most people have answered and the room's gone quiet, end it. Momentum beats waiting for the last holdout.",
  },
  {
    Icon: MessageSquare,
    title: "The winning lie is boring",
    body: "In bluff rounds, the answer that sounds plausible and slightly dull fools the most people. Save the jokes for the reveal.",
  },
  {
    Icon: Users,
    title: "Nobody sits out",
    body: "Hand the quiet person the next prompt to read. Everyone should touch the game at least once a round.",
  },
  {
    Icon: Gauge,
    title: "If it goes quiet, shorten it",
    body: "Switch to a faster game, cut the timer, or call last round. A short great session beats a long flat one.",
  },
];

const FAQ = [
  {
    q: "How is this different from Jackbox?",
    a: "Same shape, one shared screen, everyone plays on their phone, but there's nothing to buy or install. It runs in the browser, it's free, and it's built around talking to the people in the room rather than watching a show.",
  },
  {
    q: "Does it work over Zoom or Teams?",
    a: "Yes. Share your screen the way you normally would and read the code out; remote players join on their phones exactly like people in the room. Anything that can share a screen works.",
  },
  {
    q: "What happens if someone refreshes or loses signal?",
    a: "They come back to the join page, type the same code, and drop back into their seat. Their score is held for the rest of the session, so a dropped phone doesn't end anyone's game.",
  },
  {
    q: "How many people can play?",
    a: "Three is enough to get going and it stays sharp up to about sixteen. Bigger rooms still work, but rounds run long, split into two rooms if you're over twenty.",
  },
];

/** Static "how it works / hosting tips / FAQ" content under the party form. */
export function PartyInfo() {
  return (
    <div className="mt-16 flex flex-col gap-14">
      <section>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          How it runs
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.n}
              className="rounded-3xl border-2 border-white/10 bg-white/[0.03] p-5 backdrop-blur"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-sm font-extrabold text-[color:var(--accent-contrast)]">
                  {step.n}
                </span>
                <step.Icon className="h-4 w-4 text-accent" aria-hidden />
              </div>
              <h3 className="mt-3 text-base font-extrabold text-foreground">
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          How to run a room well
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TIPS.map((tip) => (
            <div
              key={tip.title}
              className="rounded-3xl border-2 border-white/10 bg-white/[0.03] p-5 backdrop-blur transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-white/25"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10">
                <tip.Icon className="h-4 w-4 text-accent" aria-hidden />
              </span>
              <h3 className="mt-3 text-sm font-extrabold text-foreground">
                {tip.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {tip.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Common questions
        </h2>
        <div className="mt-5 flex flex-col gap-3">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group rounded-3xl border-2 border-white/10 bg-white/[0.03] p-5 backdrop-blur [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-extrabold text-foreground">
                {item.q}
                <ChevronDown
                  className="h-4 w-4 shrink-0 text-muted transition-transform duration-300 [[open]_&]:rotate-180"
                  aria-hidden
                />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

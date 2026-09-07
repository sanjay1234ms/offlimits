import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "OffLimits is a browser-based collection of party games and host tools. Zero signup, zero downloads.",
};

export default function AboutPage() {
  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          About OffLimits
        </h1>
        <div className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-muted sm:text-base">
          <p>
            OffLimits is a collection of party games, rapid-fire trivia, and
            host tools that run instantly in any browser. Pick a game, pass one
            phone around the room, and go. There is nothing to sign up for and
            nothing to install.
          </p>
          <p>
            It covers the classics: Would You Rather, Never Have I Ever, Most
            Likely To, Truth or Dare, This or That. It also has scored games
            like Trivia, Charades, Buzzkill, and Fast 5, a full spin-the-wheel
            picker, and an 18+ tier for groups that want it.
          </p>
          <p>
            Every game filters live by category, group size, vibe, and a
            one-to-five heat level, so the same deck works for an office lunch
            and a 2am house party. Scores, unlocks, and preferences stay on your
            device.
          </p>
        </div>
        <div className="mt-10 border-t border-border pt-6">
          <Link
            href="/games"
            className="text-sm font-bold text-accent hover:underline"
          >
            Browse all games
          </Link>
        </div>
      </div>
    </div>
  );
}

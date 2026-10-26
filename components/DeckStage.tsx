import type { GameThemeKey } from "@/lib/gameTheme";

/** Scene themes for the card stage. Game keys map to their deck colours;
 * "truth" / "dare" light up Truth or Dare per card; "18+" is the late-night
 * crimson room. */
export type StageTheme =
  | GameThemeKey
  | "truth"
  | "dare"
  | "bachelorette"
  | "couples"
  | "birthday"
  | "party";

interface Look {
  /** Base fill of the scene. */
  base: string;
  /** Two ambient glows (CSS colours). */
  glowA: string;
  glowB: string;
  /** Light burst behind the card. */
  burst: string;
  border: string;
}

const LOOKS: Record<StageTheme, Look> = {
  would_you_rather: { base: "#0f1030", glowA: "rgba(99,102,241,0.45)", glowB: "rgba(168,85,247,0.3)", burst: "rgba(129,140,248,0.35)", border: "border-indigo-400/25" },
  never_have_i_ever: { base: "#1a0d1f", glowA: "rgba(244,63,94,0.4)", glowB: "rgba(236,72,153,0.28)", burst: "rgba(251,113,133,0.32)", border: "border-rose-400/25" },
  most_likely_to: { base: "#1c1208", glowA: "rgba(245,158,11,0.4)", glowB: "rgba(249,115,22,0.3)", burst: "rgba(251,191,36,0.32)", border: "border-amber-400/25" },
  truth_or_dare: { base: "#170c1d", glowA: "rgba(244,63,94,0.38)", glowB: "rgba(56,189,248,0.25)", burst: "rgba(244,114,182,0.3)", border: "border-rose-400/25" },
  this_or_that: { base: "#1a0b22", glowA: "rgba(236,72,153,0.42)", glowB: "rgba(192,38,211,0.3)", burst: "rgba(244,114,182,0.32)", border: "border-pink-400/25" },
  truth: { base: "#081426", glowA: "rgba(56,189,248,0.42)", glowB: "rgba(99,102,241,0.3)", burst: "rgba(125,211,252,0.34)", border: "border-sky-400/30" },
  dare: { base: "#1f0a12", glowA: "rgba(244,63,94,0.45)", glowB: "rgba(249,115,22,0.3)", burst: "rgba(251,113,133,0.34)", border: "border-rose-400/30" },
  bachelorette: { base: "#1d0a1d", glowA: "rgba(236,72,153,0.45)", glowB: "rgba(217,70,239,0.3)", burst: "rgba(249,168,212,0.34)", border: "border-pink-400/25" },
  couples: { base: "#1f0a10", glowA: "rgba(239,68,68,0.38)", glowB: "rgba(236,72,153,0.3)", burst: "rgba(253,164,175,0.3)", border: "border-rose-400/25" },
  birthday: { base: "#0d0f2a", glowA: "rgba(139,92,246,0.42)", glowB: "rgba(56,189,248,0.28)", burst: "rgba(196,181,253,0.32)", border: "border-violet-400/25" },
  party: { base: "#10102a", glowA: "rgba(129,140,248,0.4)", glowB: "rgba(236,72,153,0.28)", burst: "rgba(165,180,252,0.3)", border: "border-indigo-400/25" },
  "18+": { base: "#0b0a14", glowA: "rgba(220,38,38,0.42)", glowB: "rgba(127,29,29,0.5)", burst: "rgba(239,68,68,0.28)", border: "border-red-500/30" },
};

/** The scene a card deck sits in: a dark themed room with ambient glows and
 * a slow light burst behind the card. Colours cross-fade when the theme
 * changes (truth → dare, cute → 18+). */
export function DeckStage({
  theme,
  children,
  className = "",
}: {
  theme: StageTheme;
  children: React.ReactNode;
  className?: string;
}) {
  const look = LOOKS[theme] ?? LOOKS.party;
  return (
    <div
      data-stage={theme}
      className={`relative isolate w-full overflow-hidden rounded-[2rem] border px-3 py-8 transition-colors duration-700 sm:px-8 sm:py-10 ${look.border} ${className}`}
      style={{
        backgroundColor: look.base,
        backgroundImage: `radial-gradient(120% 80% at 100% 0%, ${look.glowA}, transparent 60%), radial-gradient(90% 70% at 0% 100%, ${look.glowB}, transparent 65%)`,
        transition: "background-color 0.7s ease, background-image 0.7s ease",
      }}
    >
      {/* Light burst behind the card */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-[150%] -translate-x-1/2 -translate-y-1/2 motion-safe:animate-[spin_40s_linear_infinite]"
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, ${look.burst} 20deg, transparent 50deg, transparent 90deg, ${look.burst} 115deg, transparent 145deg, transparent 180deg, ${look.burst} 205deg, transparent 235deg, transparent 270deg, ${look.burst} 295deg, transparent 325deg)`,
          maskImage: "radial-gradient(circle, black 0%, transparent 55%)",
          WebkitMaskImage: "radial-gradient(circle, black 0%, transparent 55%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: look.burst }}
      />
      {/* Drifting sparkles */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {[12, 28, 46, 63, 81, 92].map((left, k) => (
          <span
            key={left}
            className="absolute h-1 w-1 rounded-full bg-white/50 motion-safe:animate-float-slow"
            style={{ left: `${left}%`, top: `${(k * 37) % 90 + 5}%`, animationDelay: `${k * 0.9}s` }}
          />
        ))}
      </div>
      {children}
    </div>
  );
}

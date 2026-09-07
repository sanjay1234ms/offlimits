import type { Prompt } from "@/types";
import { gameTheme, type GameThemeKey } from "@/lib/gameTheme";

interface PromptCardProps {
  prompt: Prompt;
  gameEmoji: string;
  gameTitle: string;
  /** Overrides the per-prompt game theme (the 18+ deck forces its own). */
  themeKey?: GameThemeKey;
}

/** The large, tactile face-up card showing the active question, with a
 * glowing edge that matches the active game type. */
export function PromptCard({
  prompt,
  gameEmoji,
  gameTitle,
  themeKey,
}: PromptCardProps) {
  const theme = gameTheme(themeKey ?? prompt.game);

  return (
    <div
      className={`glass-card animate-card-flip relative flex min-h-[17rem] w-full flex-col justify-between gap-6 overflow-hidden p-6 sm:min-h-[21rem] sm:p-9 ${theme.edgeShadow}`}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full opacity-50 blur-3xl ${theme.fill}`}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute -bottom-28 -left-20 h-52 w-52 rounded-full opacity-30 blur-3xl ${theme.fill}`}
      />

      <div className="relative flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-subtle">
          <span
            className={`grid h-7 w-7 place-items-center rounded-lg text-sm ${theme.badge}`}
            aria-hidden
          >
            {gameEmoji}
          </span>
          {gameTitle}
        </span>
        <span className="inline-flex items-center gap-1.5">
          {prompt.kind ? (
            <span
              className={`rounded-full border-2 px-2.5 py-1 text-[0.7rem] font-extrabold uppercase tracking-[0.15em] ${
                prompt.kind === "truth"
                  ? "border-sky-400/50 bg-sky-500/15 text-sky-300"
                  : "border-rose-400/60 bg-rose-500/20 text-rose-200"
              }`}
            >
              {prompt.kind}
            </span>
          ) : null}
          {prompt.isAdult ? (
            <span className="rounded-full border border-red-500/50 bg-red-950/50 px-2.5 py-1 text-[0.7rem] font-extrabold tracking-wide text-red-300">
              18+
            </span>
          ) : null}
        </span>
      </div>

      <p className="relative text-balance text-center text-[1.6rem] font-extrabold leading-[1.25] tracking-tight text-foreground sm:text-4xl sm:leading-[1.2]">
        {prompt?.text || ""}
      </p>

      <div className="relative flex flex-wrap items-center justify-center gap-2">
        <span
          className={`rounded-full border px-3 py-1 text-xs font-bold ${theme.border} ${theme.text}`}
        >
          {prompt.category}
        </span>
        {(prompt.vibe ?? []).map((vibe) => (
          <span
            key={vibe}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-muted backdrop-blur"
          >
            {vibe}
          </span>
        ))}
        {prompt.groupSize?.length ? (
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-muted backdrop-blur">
            {prompt.groupSize.join(" · ")} players
          </span>
        ) : null}
      </div>
    </div>
  );
}

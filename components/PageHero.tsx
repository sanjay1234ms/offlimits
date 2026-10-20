interface PageHeroProps {
  /** The page's h1 text, unchanged for SEO. */
  title: React.ReactNode;
  /** Small sticker label above the title, e.g. "🎡 Decide anything". */
  eyebrow?: string;
  /** Up to three emojis that drift around the header. */
  emojis?: string[];
  /** Max width of the text column; match the page body below. */
  width?: string;
  /** Intro copy, buttons etc. rendered under the title. */
  children?: React.ReactNode;
}

const FLOAT_SPOTS = [
  "right-[6%] top-6 text-5xl",
  "right-[22%] bottom-2 hidden text-3xl sm:block",
  "left-[2%] bottom-4 hidden text-3xl lg:block",
];

/** Shared animated page header: color blobs, drifting emojis, a sticker
 * eyebrow and a bold title that eases in. Gives inner pages the same
 * energy as the homepage hero. */
export function PageHero({
  title,
  eyebrow,
  emojis = [],
  width = "max-w-content",
  children,
}: PageHeroProps) {
  return (
    <section className="relative overflow-x-clip">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-[90px] animate-float-slow motion-reduce:animate-none"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-rose-500/15 blur-[90px] animate-float-slow [animation-delay:-3s] motion-reduce:animate-none"
      />
      {emojis.slice(0, FLOAT_SPOTS.length).map((emoji, i) => (
        <span
          key={emoji + i}
          aria-hidden
          style={{ animationDelay: `${i * -1.7}s` }}
          className={`pointer-events-none absolute select-none opacity-50 animate-float-slow motion-reduce:animate-none ${FLOAT_SPOTS[i]}`}
        >
          {emoji}
        </span>
      ))}

      <div
        className={`relative mx-auto px-4 pb-2 pt-10 sm:px-6 sm:pt-14 ${width}`}
      >
        {eyebrow ? (
          <span className="inline-block -rotate-1 animate-fade-up rounded-full border-2 border-slate-900 bg-yellow-300 px-3 py-0.5 text-xs font-black uppercase tracking-wider text-slate-900 shadow-[3px_3px_0_#0f172a]">
            {eyebrow}
          </span>
        ) : null}
        <h1 className="mt-3 max-w-3xl animate-fade-up text-balance text-3xl font-black tracking-tight text-foreground sm:text-5xl">
          {title}
        </h1>
        {children ? (
          <div className="animate-fade-up [animation-delay:90ms] [animation-fill-mode:both]">
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}

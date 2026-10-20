interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  id?: string;
  /** Small label above the title, e.g. "🎲 The games". */
  eyebrow?: string;
}

/** Consistent section title + supporting line used between game grids. */
export function SectionHeading({
  title,
  subtitle,
  id,
  eyebrow,
}: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {eyebrow ? (
        <span className="w-fit -rotate-1 rounded-full border-2 border-slate-900 bg-yellow-300 px-3 py-0.5 text-xs font-black uppercase tracking-wider text-slate-900 shadow-[3px_3px_0_#0f172a]">
          {eyebrow}
        </span>
      ) : null}
      <h2
        id={id}
        className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl"
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="max-w-2xl text-sm text-muted sm:text-base">{subtitle}</p>
      ) : null}
    </div>
  );
}

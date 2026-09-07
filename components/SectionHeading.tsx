interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  id?: string;
}

/** Consistent section title + supporting line used between game grids. */
export function SectionHeading({ title, subtitle, id }: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-1.5">
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

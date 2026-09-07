import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-content flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold text-foreground">Page not found</h1>
      <p className="max-w-md text-sm text-foreground/60">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link
        href="/"
        className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-[color:var(--accent-contrast)]"
      >
        Back home
      </Link>
    </main>
  );
}

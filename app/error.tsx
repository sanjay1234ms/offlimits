"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex max-w-content flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold text-foreground">
        Something went off the rails
      </h1>
      <p className="max-w-md text-sm text-foreground/60">
        An unexpected error occurred while loading this page.
      </p>
      <button
        onClick={reset}
        className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-[color:var(--accent-contrast)]"
      >
        Try again
      </button>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "OffLimits is provided free, as-is, for entertainment. 18+ content is for adults only.",
};

export default function TermsPage() {
  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Terms of Service
        </h1>
        <div className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-muted sm:text-base">
          <p>
            OffLimits is provided free of charge, as-is, for entertainment. We
            make no guarantee that any game, deck or feature will remain
            available, and we may change or remove content at any time.
          </p>
          <p>
            The 18+ content is for adults only. By entering it you confirm you
            are 18 years of age or older.
          </p>
          <p>
            Play responsibly. Hosts are responsible for keeping dares and
            forfeits safe, legal and consensual. Nothing in any game is a
            suggestion or instruction to do anything dangerous or illegal.
          </p>
          <p>
            The 24-Hour Party Pass unlocks 18+ content on the device it is
            activated on for 24 hours. It is non-refundable once activated.
          </p>
        </div>
        <div className="mt-10 border-t border-border pt-6">
          <Link
            href="/"
            className="text-sm font-bold text-accent hover:underline"
          >
            ← Back to OffLimits
          </Link>
        </div>
      </div>
    </div>
  );
}

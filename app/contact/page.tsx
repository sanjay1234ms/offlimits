import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Support",
  description: "Questions, bug reports, or a game idea for OffLimits.",
};

export default function ContactPage() {
  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Contact Support
        </h1>
        <div className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-muted sm:text-base">
          <p>
            Found a bug, hit a broken card, or have a game idea? Email{" "}
            <a
              href="mailto:hello@playofflimits.com"
              className="font-bold text-accent hover:underline"
            >
              hello@playofflimits.com
            </a>
            .
          </p>
          <p>
            For anything about a tip or the 24-Hour Party Pass, include the
            rough date and the device and browser you were on. Since there are
            no accounts, that is all we have to go on.
          </p>
          <p>We are a tiny team, so please allow a few days for a reply.</p>
        </div>
        <div className="mt-10 border-t border-border pt-6">
          <Link
            href="/"
            className="text-sm font-bold text-accent hover:underline"
          >
            Back to OffLimits
          </Link>
        </div>
      </div>
    </div>
  );
}

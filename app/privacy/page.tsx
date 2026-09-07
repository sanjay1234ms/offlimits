import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "OffLimits has no accounts and collects no personal data. Everything is stored in your own browser.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Privacy Policy
        </h1>
        <div className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-muted sm:text-base">
          <p>
            OffLimits does not have user accounts and does not collect personal
            data. There is no email capture, no profile, and no login.
          </p>
          <p>
            Everything the app remembers is stored in your own browser&apos;s
            local storage, on the device you are using. That means your theme,
            your player roster, your live scores, your 18+ unlock status, and
            your free-preview count. None of it is sent to a server, shared, or
            used for advertising.
          </p>
          <p>
            There are no analytics cookies and no third-party trackers. If you
            leave a tip, checkout runs on Stripe&apos;s own page and we never
            see your card details.
          </p>
          <p>
            Clearing your browser data, or using a private window, resets the
            app completely, including any active Party Pass.
          </p>
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

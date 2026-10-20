import type { Metadata } from "next";
import { shareMetadata } from "@/lib/seo";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/site";

const TITLE = "Privacy Policy: No Accounts, No Logins";
const DESCRIPTION =
  "OffLimits privacy policy: no accounts, no logins, no email capture. Game data stays in your browser; Google Analytics measures site usage.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/privacy" },
  ...shareMetadata(TITLE, DESCRIPTION, "/privacy"),
};

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-background">
      <JsonLd data={breadcrumbJsonLd([{ name: "Privacy Policy", path: "/privacy" }])} />
      <PageHero
        title="Privacy Policy"
        eyebrow="🔒 The fine print"
        emojis={["🔒", "🙈"]}
        width="max-w-2xl"
      />
      <div className="mx-auto max-w-2xl px-4 pb-14 sm:px-6">
        <div className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-muted sm:text-base">
          <p>
            OffLimits does not have user accounts. There is no email capture, no
            profile, and no login, and we never ask for your name.
          </p>
          <p>
            Everything the app remembers is stored in your own browser&apos;s
            local storage, on the device you are using. That means your theme,
            your player roster, your live scores, your 18+ unlock status, and
            your free-preview count. None of that is sent to our server, shared,
            or used for advertising.
          </p>
          <p>
            We use Google Analytics 4 to see usage stats, such as
            which pages are viewed and which games get played. Google Analytics
            sets cookies in your browser and Google processes this data under
            the{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-accent hover:underline"
            >
              Google Privacy Policy
            </a>
            . You can opt out with the{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-accent hover:underline"
            >
              Google Analytics opt-out browser add-on
            </a>
            , or by blocking cookies for this site.
          </p>
          <p>
            Our Google Analytics is also linked to Google Ads. That means Google
            may use this data and its cookies to measure how our ads perform and
            to show OffLimits ads to you on other sites (remarketing). You can
            read{" "}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-accent hover:underline"
            >
              how Google uses information from sites that use its services
            </a>
            , and turn off personalised ads in{" "}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-accent hover:underline"
            >
              Google Ads Settings
            </a>
            .
          </p>
          <p>
            If you leave a tip, checkout runs on Stripe&apos;s own page and we
            never see your card details.
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

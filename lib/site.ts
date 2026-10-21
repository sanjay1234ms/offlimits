/** Site-wide constants and JSON-LD builders. Plain module (no "use client"),
 * so server and client components can both import the real values. */

export const SITE_URL = "https://playofflimits.com";
export const SITE_NAME = "OffLimits";
export const CONTACT_EMAIL = "hello@playofflimits.com";

type JsonLd = Record<string, unknown>;

export function absoluteUrl(path: string): string {
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

/** One-line brand summary reused by the entity schema and /llms.txt. It
 * also separates OffLimits from the unrelated "Off Limits!" iOS word game. */
export const BRAND_DESCRIPTION =
  "OffLimits (playofflimits.com) is a free collection of browser-based party games for groups: Would You Rather, Never Have I Ever, Truth or Dare, Most Likely To, trivia, charades and more. Games run on one phone passed around the room, with no app download and no signup.";

/** Public profiles for the brand. Add each social account URL here as it is
 * created; Google uses these to connect the profiles to the site. */
export const BRAND_SAME_AS: string[] = [];

export const ORGANIZATION_JSON_LD: JsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: [
    "PlayOffLimits",
    "Play OffLimits",
    "OffLimits Party Games",
    "playofflimits.com",
  ],
  url: `${SITE_URL}/`,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/logo.png`,
    width: 512,
    height: 512,
  },
  description: BRAND_DESCRIPTION,
  disambiguatingDescription:
    "OffLimits is the website playofflimits.com, a free browser party game site. It is not the \"Off Limits! Word Party Game\" iOS app.",
  email: CONTACT_EMAIL,
  brand: { "@id": `${SITE_URL}/#brand` },
  ...(BRAND_SAME_AS.length ? { sameAs: BRAND_SAME_AS } : {}),
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: CONTACT_EMAIL,
    url: `${SITE_URL}/contact`,
  },
};

export const BRAND_JSON_LD: JsonLd = {
  "@context": "https://schema.org",
  "@type": "Brand",
  "@id": `${SITE_URL}/#brand`,
  name: SITE_NAME,
  alternateName: ["PlayOffLimits", "OffLimits Party Games"],
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/logo.png`,
  slogan: "Party games with no limits",
  description: BRAND_DESCRIPTION,
};

/** Breadcrumb trail; the homepage is prepended automatically. */
export function breadcrumbJsonLd(
  trail: { name: string; path: string }[],
): JsonLd {
  const items = [{ name: "Home", path: "/" }, ...trail];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** A free browser game or tool that runs on any device. */
export function webApplicationJsonLd(opts: {
  name: string;
  description: string;
  path: string;
  category?: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    applicationCategory: opts.category ?? "GameApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Works in any modern browser.",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/** An ordered list of text items, e.g. the questions on a list page. */
export function itemListJsonLd(opts: {
  name: string;
  path: string;
  items: string[];
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: opts.name,
    url: absoluteUrl(opts.path),
    numberOfItems: opts.items.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: opts.items.map((text, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: text,
    })),
  };
}

export function faqJsonLd(faq: { q: string; a: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

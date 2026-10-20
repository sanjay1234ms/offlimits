/** Site-wide constants and JSON-LD builders. Plain module (no "use client"),
 * so server and client components can both import the real values. */

export const SITE_URL = "https://playofflimits.com";
export const SITE_NAME = "OffLimits";
export const CONTACT_EMAIL = "hello@playofflimits.com";

type JsonLd = Record<string, unknown>;

export function absoluteUrl(path: string): string {
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

export const ORGANIZATION_JSON_LD: JsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: ["PlayOffLimits", "playofflimits.com"],
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/icon.svg`,
  email: CONTACT_EMAIL,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: CONTACT_EMAIL,
    url: `${SITE_URL}/contact`,
  },
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

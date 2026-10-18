import type { Metadata } from "next";

/** Link-preview image shown when a page is shared (WhatsApp, iMessage, etc.). */
export const OG_IMAGE = {
  url: "/og-image.png?v=3",
  width: 1200,
  height: 630,
  alt: "OffLimits Party Games Preview",
};

/** OpenGraph + Twitter card metadata for a page. Next.js replaces (rather
 * than merges) the layout's `openGraph` when a page sets its own, so every
 * page must carry the image itself or shared links lose their preview. */
export function shareMetadata(
  title: string,
  description: string,
  path?: string,
): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: {
      title,
      description,
      url: path,
      siteName: "OffLimits",
      images: [OG_IMAGE],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

import type { MetadataRoute } from "next";

/** Makes OffLimits installable ("Add to Home Screen"), so a group that played
 * once can open it in one tap at the next party. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OffLimits Party Games",
    short_name: "OffLimits",
    description:
      "Free party games on one phone: Would You Rather, Truth or Dare, Never Have I Ever, Werewolf and more.",
    start_url: "/?source=homescreen",
    scope: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#0f172a",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

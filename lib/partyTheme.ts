/** Optional accent/background skins layered on top of dark mode. They only
 * take effect while the site is in dark mode (`.dark[data-party="…"]` in CSS). */

export const PARTY_THEMES = [
  { id: "default", label: "OffLimits", swatch: "#818cf8" },
  { id: "velvet", label: "Dark Velvet", swatch: "#f472b6" },
  { id: "crimson", label: "Crimson Hazed", swatch: "#f43f5e" },
  { id: "midnight", label: "Midnight Club", swatch: "#22d3ee" },
] as const;

export type PartyThemeId = (typeof PARTY_THEMES)[number]["id"];

export const PARTY_THEME_KEY = "offlimits_party_theme";
export const PARTY_THEME_EVENT = "offlimits:party-theme";

const VALID = new Set<string>(PARTY_THEMES.map((t) => t.id));

export function isPartyThemeId(value: string | null): value is PartyThemeId {
  return value != null && VALID.has(value);
}

export function readPartyTheme(): PartyThemeId {
  if (typeof window === "undefined") return "default";
  try {
    const v = window.localStorage.getItem(PARTY_THEME_KEY);
    return isPartyThemeId(v) ? v : "default";
  } catch {
    return "default";
  }
}

export function applyPartyTheme(id: PartyThemeId): void {
  if (typeof document === "undefined") return;
  if (id === "default") {
    document.documentElement.removeAttribute("data-party");
  } else {
    document.documentElement.setAttribute("data-party", id);
  }
  try {
    window.localStorage.setItem(PARTY_THEME_KEY, id);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(PARTY_THEME_EVENT));
}

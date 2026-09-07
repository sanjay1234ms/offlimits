/**
 * Central config for the two monetization features. Swap the placeholder
 * Stripe / BuyMeACoffee URLs for real Payment Links before shipping.
 */

/** Default checkout URL used everywhere until real links are wired in. */
export const STRIPE_PLACEHOLDER = "https://buy.stripe.com/test_placeholder";

/** Floating tip-jar presets. */
export interface TipTier {
  id: string;
  label: string;
  href: string;
}

export const TIP_TIERS: TipTier[] = [
  { id: "coffee", label: "$2 (Coffee)", href: STRIPE_PLACEHOLDER },
  { id: "snack", label: "$5 (Snack)", href: STRIPE_PLACEHOLDER },
  { id: "mvp", label: "$10 (Party MVP)", href: STRIPE_PLACEHOLDER },
];

/** OffLimits 24-Hour Party Pass. */
export const UNLOCK_18_URL = STRIPE_PLACEHOLDER;
export const UNLOCK_18_PRICE = "$2.99";
export const ACCESS_CODE = "PARTY18";
export const PARTY_PASS_LABEL = "OffLimits 24-Hour Party Pass";
export const PARTY_PASS_BLURB =
  "Unlimited access to all 18+ decks, games, and tools for 24 hours.";
export const PARTY_PASS_DURATION_MS = 24 * 60 * 60 * 1000;

/** Free teaser cards shown before the 18+ paywall. */
export const FREE_ADULT_LIMIT = 3;

/** The prompt category that triggers the age gate + paywall. */
export const ADULT_CATEGORY = "18+" as const;

/** localStorage keys. */
export const STORAGE_KEYS = {
  /** JSON `{ is18PlusUnlocked, expiresAt }`, the global 24-hour Party Pass. */
  partyPass: "offlimits_party_pass",
  /** Legacy permanent unlock flags, migrated to a 24-hour pass on first read. */
  unlockedLegacy: "offlimits_18plus_unlocked",
  unlockedLegacyAntics: "antics_18plus_unlocked",
  ageConfirmed: "antics_age_confirmed",
  /** JSON array of the distinct 18+ items previewed for free (cap = FREE_ADULT_LIMIT). */
  previewIds: "offlimits_18plus_preview_ids",
} as const;

export interface PartyPassRecord {
  is18PlusUnlocked: boolean;
  expiresAt: number;
}

/** Fired after any 18+ monetization write, so hook instances in the same tab
 * re-sync (the native `storage` event only fires in other tabs). */
export const ADULT_STATE_EVENT = "offlimits:adult-state";

function notifyAdultState(): void {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new Event(ADULT_STATE_EVENT));
  } catch {
    /* ignore */
  }
}

/**
 * Reads the global Party Pass. Returns the record only while it is valid
 * (`is18PlusUnlocked && Date.now() < expiresAt`); an expired pass is deleted
 * and `null` is returned. A legacy permanent unlock is migrated into a fresh
 * 24-hour pass so every browser is on the same model.
 */
export function readPartyPass(): PartyPassRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.partyPass);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PartyPassRecord>;
      if (
        parsed &&
        parsed.is18PlusUnlocked === true &&
        typeof parsed.expiresAt === "number"
      ) {
        if (Date.now() < parsed.expiresAt) {
          return { is18PlusUnlocked: true, expiresAt: parsed.expiresAt };
        }
        window.localStorage.removeItem(STORAGE_KEYS.partyPass);
        notifyAdultState();
        return null;
      }
    }

    const legacy =
      window.localStorage.getItem(STORAGE_KEYS.unlockedLegacy) === "true" ||
      window.localStorage.getItem(STORAGE_KEYS.unlockedLegacyAntics) === "true";
    if (legacy) return activatePartyPass();

    return null;
  } catch {
    return null;
  }
}

/** True only if a valid, non-expired 18+ Party Pass is active. */
export function checkIs18PlusUnlocked(): boolean {
  return readPartyPass() !== null;
}

/** Activate the 24-hour Party Pass (checkout success / access code / trial). */
export function activatePartyPass(
  durationMs: number = PARTY_PASS_DURATION_MS,
): PartyPassRecord {
  const record: PartyPassRecord = {
    is18PlusUnlocked: true,
    expiresAt: Date.now() + durationMs,
  };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.partyPass,
        JSON.stringify(record),
      );
      window.localStorage.removeItem(STORAGE_KEYS.unlockedLegacy);
      window.localStorage.removeItem(STORAGE_KEYS.unlockedLegacyAntics);
    } catch {
      /* ignore write failures */
    }
  }
  notifyAdultState();
  return record;
}

/** End the Party Pass immediately (e.g. on manual expiry / testing). */
export function clearPartyPass(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEYS.partyPass);
    window.localStorage.removeItem(STORAGE_KEYS.unlockedLegacy);
    window.localStorage.removeItem(STORAGE_KEYS.unlockedLegacyAntics);
  } catch {
    /* ignore */
  }
  notifyAdultState();
}

/** True if the age check has been confirmed on this browser. */
export function readAgeConfirmed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEYS.ageConfirmed) === "true";
  } catch {
    return false;
  }
}

export function persistAgeConfirmed(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEYS.ageConfirmed, "true");
  } catch {
    /* ignore */
  }
}

/**
 * The distinct 18+ items this browser has previewed for free. Shared across
 * every 18+ surface, decks and the "Suggest a prompt" helpers, so previews
 * can never be an infinite free backdoor into adult content.
 */
export function readPreviewIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.previewIds);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string")
      : [];
  } catch {
    return [];
  }
}

export function writePreviewIds(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEYS.previewIds, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
  notifyAdultState();
}

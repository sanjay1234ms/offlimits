/**
 * Central config for the two monetization features. Swap the placeholder
 * Stripe / BuyMeACoffee URLs for real Payment Links before shipping.
 */

import { getDeviceId } from "./deviceId";

/** Default checkout URL used everywhere until real links are wired in. */
export const STRIPE_PLACEHOLDER = "https://buy.stripe.com/test_placeholder";

/** Floating tip-jar presets. Each tier is charged through a dynamic Stripe
 * Checkout Session created by `app/api/checkout/tip/route.ts`, which is
 * entirely separate from the Party Pass checkout. */
export interface TipTier {
  id: string;
  label: string;
  /** Charge amount in USD cents. */
  amountCents: number;
}

export const TIP_TIERS: TipTier[] = [
  { id: "coffee", label: "$2 (Coffee)", amountCents: 200 },
  { id: "snack", label: "$5 (Snack)", amountCents: 500 },
  { id: "mvp", label: "$10 (Party MVP)", amountCents: 1000 },
];

/** OffLimits 24-Hour Party Pass. Checkout now runs through the Stripe
 * Checkout Session created in `app/api/checkout/route.ts`; this legacy URL is
 * only a fallback for surfaces that have not been migrated. */
export const UNLOCK_18_URL = STRIPE_PLACEHOLDER;
export const UNLOCK_18_PRICE = "$3";
/** Party Pass price in the smallest currency unit (USD cents). */
export const PARTY_PASS_PRICE_CENTS = 300;

/** The canonical Party Pass access code, accepted in every environment. */
export const ACCESS_CODE = "PARTY18";

/**
 * Extra codes accepted only outside a production build, so local dev and QA
 * can unlock 18+ without a real pass. `next dev` sets NODE_ENV to
 * "development"; `next build` sets it to "production", where this list is
 * empty and only ACCESS_CODE works.
 */
export const DEV_ACCESS_CODES: readonly string[] =
  process.env.NODE_ENV === "production" ? [] : ["TEST18", "OFFLIMITS"];

/** All currently accepted access codes, already normalised to upper case. */
export const ACCEPTED_ACCESS_CODES: readonly string[] = [
  ACCESS_CODE,
  ...DEV_ACCESS_CODES,
].map((c) => c.toUpperCase());

/** True if `input` matches an accepted Party Pass access code. Trims and
 * upper-cases the input, so " party18 " and "Party18" both pass. */
export function isValidAccessCode(input: string): boolean {
  return ACCEPTED_ACCESS_CODES.includes(input.trim().toUpperCase());
}

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
  /** Set for passes bought through Stripe Checkout. When present, the pass is
   * only honoured on the browser whose device id matches (see readPartyPass). */
  deviceId?: string;
  /** Human-readable code returned by /api/verify-pass, shown on the success
   * screen so a buyer has a reference. */
  code?: string;
  /** How the pass was activated. */
  source?: "checkout" | "code" | "legacy";
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
        const boundToOtherDevice =
          typeof parsed.deviceId === "string" &&
          parsed.deviceId.length > 0 &&
          parsed.deviceId !== getDeviceId();

        if (!boundToOtherDevice && Date.now() < parsed.expiresAt) {
          return {
            is18PlusUnlocked: true,
            expiresAt: parsed.expiresAt,
            deviceId: parsed.deviceId,
            code: parsed.code,
            source: parsed.source,
          };
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

/**
 * Persist a pass that the server already verified against a paid Stripe
 * Checkout Session. The record carries its own `expiresAt` (anchored to
 * payment time by /api/verify-pass) and `deviceId`, so it is written as-is
 * rather than recomputed here. Returns the stored record, or null if the
 * payload is malformed.
 */
export function activateVerifiedPass(
  record: Partial<PartyPassRecord>,
): PartyPassRecord | null {
  if (
    record.is18PlusUnlocked !== true ||
    typeof record.expiresAt !== "number" ||
    record.expiresAt <= Date.now()
  ) {
    return null;
  }

  const stored: PartyPassRecord = {
    is18PlusUnlocked: true,
    expiresAt: record.expiresAt,
    deviceId:
      typeof record.deviceId === "string" ? record.deviceId : getDeviceId(),
    code: typeof record.code === "string" ? record.code : undefined,
    source: "checkout",
  };

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.partyPass,
        JSON.stringify(stored),
      );
      window.localStorage.removeItem(STORAGE_KEYS.unlockedLegacy);
      window.localStorage.removeItem(STORAGE_KEYS.unlockedLegacyAntics);
    } catch {
      /* ignore write failures */
    }
  }
  notifyAdultState();
  return stored;
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

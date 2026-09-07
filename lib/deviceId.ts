/*
 * A stable, anonymous identifier for this browser. It exists only to bind a
 * purchased 24-Hour Party Pass to the device it was bought on, so a pass
 * cannot be shared by copying a URL or a localStorage blob to another
 * machine. There is still no account and nothing is sent anywhere except the
 * checkout and verify calls.
 */

export const DEVICE_ID_KEY = "offlimits_device_id";

/** Accepted shape for a device id: UUIDs and the `dev_...` fallback ids this
 * module generates, nothing exotic. Used to validate ids that arrive over the
 * wire in the checkout / verify routes. */
const DEVICE_ID_RE = /^[A-Za-z0-9_-]{8,100}$/;

/** True if `value` is a well-formed device id string. */
export function isValidDeviceId(value: unknown): value is string {
  return typeof value === "string" && DEVICE_ID_RE.test(value);
}

function makeId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `dev_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
  }
}

/**
 * Reads this browser's device id, creating and persisting one on first call.
 * Returns a throwaway id when localStorage is unavailable (SSR, private mode)
 * so callers never have to null-check.
 */
export function getDeviceId(): string {
  if (typeof window === "undefined") return "server";
  try {
    const existing = window.localStorage.getItem(DEVICE_ID_KEY);
    if (existing) return existing;
    const fresh = makeId();
    window.localStorage.setItem(DEVICE_ID_KEY, fresh);
    return fresh;
  } catch {
    return makeId();
  }
}

/** Overwrite the stored device id, e.g. to adopt an id the server minted
 * during checkout so the success page verifies against the same value. No-op
 * on an invalid id or when localStorage is unavailable. */
export function persistDeviceId(id: string): void {
  if (typeof window === "undefined" || !isValidDeviceId(id)) return;
  try {
    window.localStorage.setItem(DEVICE_ID_KEY, id);
  } catch {
    /* ignore */
  }
}

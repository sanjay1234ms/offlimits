import Stripe from "stripe";

/*
 * Server-only Stripe helpers. Never import this from a client component.
 * The client is built lazily so a missing key fails loudly on the first
 * checkout call with a clear message, instead of crashing at import time
 * or during `next build`.
 */

let cached: Stripe | null = null;

/** Returns the shared Stripe client, or throws if STRIPE_SECRET_KEY is unset. */
export function getStripe(): Stripe {
  if (cached) return cached;

  const secret = process.env.STRIPE_SECRET_KEY ?? "";
  const looksLikePlaceholder =
    /replace|x{6,}|your[-_]?key|placeholder/i.test(secret) ||
    secret.length < 20;
  if (!secret || looksLikePlaceholder) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add your Stripe test key to .env.local (see .env.example).",
    );
  }

  // No apiVersion passed, so the SDK uses its own pinned version.
  cached = new Stripe(secret);
  return cached;
}

/** Absolute origin used to build Stripe success / cancel redirect URLs. */
export function getBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

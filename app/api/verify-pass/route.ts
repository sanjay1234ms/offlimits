import { getStripe } from "@/lib/stripe";
import { isValidDeviceId } from "@/lib/deviceId";
import { PARTY_PASS_DURATION_MS } from "@/lib/monetization";

export const dynamic = "force-dynamic";

/** A stable, readable code derived from the session id, so re-verifying the
 * same payment always yields the same reference code. Not a secret. */
function passCodeFor(sessionId: string): string {
  let h = 2166136261;
  for (let i = 0; i < sessionId.length; i++) {
    h ^= sessionId.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const a = (h >>> 0).toString(36).toUpperCase().padStart(7, "0").slice(-7);
  const b = ((h ^ 0x9e3779b9) >>> 0)
    .toString(36)
    .toUpperCase()
    .padStart(7, "0")
    .slice(-7);
  return `OL-${a}-${b}`;
}

/**
 * POST /api/verify-pass
 * Body: `{ sessionId: string, deviceId: string }`
 *
 * Confirms the Stripe Checkout Session was paid, checks it was bought on this
 * same device, and returns a 24-hour unlock payload for the client to drop
 * into localStorage. The 24-hour window is anchored to the payment time, so
 * reloading the success page cannot extend a pass.
 */
export async function POST(request: Request) {
  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (body === null || typeof body !== "object") {
    return Response.json(
      { error: "Request body must be a JSON object." },
      { status: 400 },
    );
  }

  const { sessionId: rawSessionId, deviceId: rawDeviceId } = body as {
    sessionId?: unknown;
    deviceId?: unknown;
  };

  const sessionId =
    typeof rawSessionId === "string" ? rawSessionId.trim() : "";
  const deviceId =
    typeof rawDeviceId === "string" ? rawDeviceId.trim() : "";

  if (!sessionId || !deviceId) {
    return Response.json(
      { error: "Missing sessionId or deviceId." },
      { status: 400 },
    );
  }

  // Stripe Checkout Session ids always start with "cs_"; reject junk before
  // spending a Stripe round-trip on it.
  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
    return Response.json(
      { error: "That is not a valid checkout session id." },
      { status: 400 },
    );
  }

  if (!isValidDeviceId(deviceId)) {
    return Response.json(
      { error: "Malformed deviceId." },
      { status: 400 },
    );
  }

  let stripe: ReturnType<typeof getStripe>;
  try {
    stripe = getStripe();
  } catch (err) {
    return Response.json(
      {
        error:
          err instanceof Error ? err.message : "Stripe is not configured.",
      },
      { status: 500 },
    );
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return Response.json(
      { error: "We could not find that checkout session." },
      { status: 404 },
    );
  }

  // Device lock first: a session may only be redeemed on the browser that
  // started it, regardless of its payment state. This fails closed when the
  // session carries no deviceId metadata.
  if (session.metadata?.deviceId !== deviceId) {
    return Response.json(
      {
        error:
          "This Party Pass was bought on another device and cannot be moved.",
      },
      { status: 403 },
    );
  }

  if (session.payment_status !== "paid") {
    return Response.json(
      { error: "This payment has not completed yet." },
      { status: 402 },
    );
  }

  const paidAtMs = (session.created ?? Math.floor(Date.now() / 1000)) * 1000;
  const expiresAt = paidAtMs + PARTY_PASS_DURATION_MS;

  if (Date.now() >= expiresAt) {
    return Response.json(
      { error: "This Party Pass has already expired." },
      { status: 410 },
    );
  }

  const code = passCodeFor(sessionId);

  return Response.json({
    code,
    pass: {
      is18PlusUnlocked: true as const,
      expiresAt,
      deviceId,
      code,
      source: "checkout" as const,
    },
  });
}

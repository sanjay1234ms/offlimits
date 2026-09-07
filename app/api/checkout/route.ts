import { getBaseUrl, getStripe } from "@/lib/stripe";
import { isValidDeviceId } from "@/lib/deviceId";
import {
  PARTY_PASS_BLURB,
  PARTY_PASS_LABEL,
  PARTY_PASS_PRICE_CENTS,
} from "@/lib/monetization";

export const dynamic = "force-dynamic";

/**
 * POST /api/checkout
 * Body: `{ deviceId?: string }`
 *
 * Creates a Stripe Checkout Session for the $3.00 24-Hour Party Pass. The
 * device id is stamped into the session metadata so /api/verify-pass can bind
 * the unlock to this browser. If the client did not send one, we mint it here
 * and return it for the client to persist.
 */
export async function POST(request: Request) {
  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    /* empty body is fine, a device id will be minted below */
  }

  if (body === null || typeof body !== "object") {
    return Response.json(
      { error: "Request body must be a JSON object." },
      { status: 400 },
    );
  }

  const rawDeviceId = (body as { deviceId?: unknown }).deviceId;

  // A device id is optional, but if one is supplied it must be well-formed.
  if (rawDeviceId !== undefined && !isValidDeviceId(rawDeviceId)) {
    return Response.json(
      {
        error:
          "Malformed deviceId. Expected 8 to 100 characters of letters, digits, hyphens or underscores.",
      },
      { status: 400 },
    );
  }

  const deviceId = isValidDeviceId(rawDeviceId)
    ? rawDeviceId
    : crypto.randomUUID();

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

  const base = getBaseUrl();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: PARTY_PASS_PRICE_CENTS,
            product_data: {
              name: PARTY_PASS_LABEL,
              description: PARTY_PASS_BLURB,
            },
          },
        },
      ],
      metadata: { deviceId },
      success_url: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/?pass=cancelled`,
    });

    return Response.json({ url: session.url, deviceId, id: session.id });
  } catch (err) {
    return Response.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Could not start checkout. Try again.",
      },
      { status: 502 },
    );
  }
}

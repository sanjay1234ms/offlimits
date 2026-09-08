import { getBaseUrl, getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

/*
 * POST /api/checkout/tip
 * Body: `{ amount: number }` where amount is 2 | 5 | 10 (dollars) or
 * 200 | 500 | 1000 (cents).
 *
 * A standalone one-off "Support the Dev" tip. Deliberately separate from the
 * Party Pass checkout in ../route.ts and its verification in
 * ../../verify-pass/route.ts: no device binding, no unlock payload, no
 * post-payment verification. The visitor just lands back on the origin they
 * came from.
 */

/** Cents a tip is allowed to be. */
const ALLOWED_TIP_CENTS = new Set([200, 500, 1000]);

/** Accepts dollars (2 / 5 / 10) or cents (200 / 500 / 1000); returns the
 * cents value if it is an allowed tier, otherwise null. */
function normalizeToCents(amount: unknown): number | null {
  if (typeof amount !== "number" || !Number.isFinite(amount)) return null;
  const rounded = Math.round(amount);
  const cents = rounded <= 100 ? rounded * 100 : rounded;
  return ALLOWED_TIP_CENTS.has(cents) ? cents : null;
}

/** A well-formed http(s) origin, or null. */
function cleanOrigin(value: unknown): string | null {
  return typeof value === "string" && /^https?:\/\/[^/\s]+$/.test(value)
    ? value
    : null;
}

/** The origin to return the visitor to: the request's own Origin header
 * first (so it works on whatever host the app is served from), then an
 * `origin` sent in the body, then the configured base URL. */
function returnOrigin(request: Request, bodyOrigin: unknown): string {
  return (
    cleanOrigin(request.headers.get("origin")) ??
    cleanOrigin(bodyOrigin) ??
    getBaseUrl()
  );
}

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

  const cents = normalizeToCents((body as { amount?: unknown }).amount);
  if (cents === null) {
    return Response.json(
      {
        error:
          "amount must be one of 2, 5 or 10 dollars (or 200, 500, 1000 cents).",
      },
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

  const origin = returnOrigin(request, (body as { origin?: unknown }).origin);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: cents,
            product_data: { name: "Support the Dev Tip" },
          },
        },
      ],
      metadata: { kind: "tip", amountCents: String(cents) },
      success_url: `${origin}/?tipped=true`,
      cancel_url: `${origin}/?tipped=cancelled`,
    });

    return Response.json({ url: session.url, amountCents: cents });
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

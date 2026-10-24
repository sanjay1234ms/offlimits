import { drawWithRules, parseNames, type KeepApart } from "@/lib/secretSanta";
import { insertDraw, randomId, santaStoreMode } from "@/lib/santaStore";

export const dynamic = "force-dynamic";

const LIFETIME_DAYS = 150;

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** POST /api/santa, the organiser creates a draw. The matching happens here,
 * so the pairings never reach the organiser's browser. */
export async function POST(request: Request) {
  if (santaStoreMode === "off") {
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad_json" }, { status: 400 });
  }

  const names = parseNames(
    (Array.isArray(body.names) ? body.names : [])
      .map((n) => str(n, 40))
      .join("\n"),
  ).slice(0, 200);
  if (names.length < 3) {
    return Response.json({ error: "need_three" }, { status: 400 });
  }

  const rules: KeepApart[] = (Array.isArray(body.rules) ? body.rules : [])
    .slice(0, 100)
    .filter((r): r is [string, string] => Array.isArray(r) && r.length === 2)
    .map(([a, b]) => [str(a, 40), str(b, 40)]);

  const receivers = drawWithRules(names, rules);
  if (!receivers) {
    return Response.json({ error: "impossible_rules" }, { status: 422 });
  }

  const date = str(body.date, 10);
  const now = new Date();
  const draw = {
    id: randomId(10),
    organiser_token: randomId(24),
    title: str(body.title, 60),
    names,
    receivers,
    currency: str(body.currency, 3).toUpperCase(),
    budget: str(body.budget, 12).replace(/[^\d.]/g, ""),
    exchange_date: /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : "",
    message: str(body.message, 200),
    opened: {},
    created_at: now.toISOString(),
    expires_at: new Date(now.getTime() + LIFETIME_DAYS * 86_400_000).toISOString(),
  };

  try {
    await insertDraw(draw);
  } catch (err) {
    console.error("[santa] create", err);
    return Response.json({ error: "store_failed" }, { status: 500 });
  }

  return Response.json(
    { id: draw.id, organiserToken: draw.organiser_token },
    { status: 201 },
  );
}

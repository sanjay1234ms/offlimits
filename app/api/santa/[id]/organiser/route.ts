import { clearOpened, getDraw, openedKey, sameToken } from "@/lib/santaStore";
import { ID_RE, TOKEN_RE } from "@/lib/santaView";

export const dynamic = "force-dynamic";

async function authorised(id: string, token: unknown) {
  if (!ID_RE.test(id) || typeof token !== "string" || !TOKEN_RE.test(token)) return null;
  const draw = await getDraw(id);
  return draw && sameToken(draw.organiser_token, token) ? draw : null;
}

/** GET /api/santa/[id]/organiser?t=TOKEN, who has opened their name. */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const draw = await authorised(params.id, new URL(request.url).searchParams.get("t"));
    if (!draw) return Response.json({ error: "not_found" }, { status: 404 });
    return Response.json({
      id: draw.id,
      title: draw.title,
      people: draw.names.map((name, i) => ({
        name,
        openedAt: draw.opened[openedKey(i)]?.at ?? null,
      })),
    });
  } catch (err) {
    console.error("[santa] organiser", err);
    return Response.json({ error: "store_failed" }, { status: 500 });
  }
}

/** POST /api/santa/[id]/organiser { t, index }, frees a name someone opened
 * by mistake so the right person can open it. */
export async function POST(request: Request, { params }: { params: { id: string } }) {
  let body: { t?: unknown; index?: unknown } = {};
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad_json" }, { status: 400 });
  }
  try {
    const draw = await authorised(params.id, body.t);
    if (!draw) return Response.json({ error: "not_found" }, { status: 404 });
    const index = Number(body.index);
    if (!Number.isInteger(index) || index < 0 || index >= draw.names.length) {
      return Response.json({ error: "bad_request" }, { status: 400 });
    }
    await clearOpened(draw.id, index);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[santa] reset", err);
    return Response.json({ error: "store_failed" }, { status: 500 });
  }
}

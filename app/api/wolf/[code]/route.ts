import { getWolfView, joinWolfRoom, wolfAct, wolfHost } from "@/lib/wolfStore";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

/** POST /api/wolf/[code] { op, p (player id), t (host token), ... }
 *  op "view" -> this player's view; "join" { name }; "act" { target };
 *  "host" { action, expect, setup }. Every op returns the fresh view. */
export async function POST(request: Request, { params }: { params: { code: string } }) {
  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad_json" }, { status: 400 });
  }
  const code = params.code.toLowerCase();
  try {
    let error: string | null = null;
    if (body.op === "join") {
      const r = await joinWolfRoom(code, body.p, body.name);
      if (r !== "ok") error = r;
    } else if (body.op === "act") {
      if (!(await wolfAct(code, body.p, body.target))) error = "rejected";
    } else if (body.op === "host") {
      const r = await wolfHost(code, body.t, body.action, body.expect, body.setup);
      if (r !== "ok") error = r;
    }
    const view = await getWolfView(code, body.p, body.t);
    if (!view) return Response.json({ error: "not_found" }, { status: 404, headers: NO_STORE });
    return Response.json({ ...view, error }, { headers: NO_STORE });
  } catch (err) {
    console.error("[wolf]", body.op, err);
    return Response.json({ error: "unavailable" }, { status: 503, headers: NO_STORE });
  }
}

import { createWolfRoom } from "@/lib/wolfStore";

export const dynamic = "force-dynamic";

/** POST /api/wolf { skin, pid, name } -> { code, hostToken } */
export async function POST(request: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad_json" }, { status: 400 });
  }
  try {
    const out = await createWolfRoom({ skin: body.skin, pid: body.pid, name: body.name });
    return out ? Response.json(out, { status: 201 }) : Response.json({ error: "invalid" }, { status: 400 });
  } catch (err) {
    console.error("[wolf] create", err);
    return Response.json({ error: "unavailable" }, { status: 503 });
  }
}

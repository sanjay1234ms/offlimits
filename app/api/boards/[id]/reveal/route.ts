import { revealPool } from "@/lib/boardStore";

export const dynamic = "force-dynamic";

/** POST /api/boards/[id]/reveal { t, result } (pool owner only) */
export async function POST(request: Request, { params }: { params: { id: string } }) {
  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad_json" }, { status: 400 });
  }
  try {
    const ok = await revealPool(params.id, body.t, body.result);
    return ok ? Response.json({ ok: true }) : Response.json({ error: "forbidden" }, { status: 403 });
  } catch (err) {
    console.error("[boards] reveal", err);
    return Response.json({ error: "unavailable" }, { status: 503 });
  }
}

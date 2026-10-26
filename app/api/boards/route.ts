import { createBoard } from "@/lib/boardStore";

export const dynamic = "force-dynamic";

/** POST /api/boards { kind, title, config } -> { id, ownerToken } */
export async function POST(request: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad_json" }, { status: 400 });
  }
  try {
    const out = await createBoard({ kind: body.kind, title: body.title, config: body.config });
    return out ? Response.json(out, { status: 201 }) : Response.json({ error: "invalid" }, { status: 400 });
  } catch (err) {
    console.error("[boards] create", err);
    return Response.json({ error: "unavailable" }, { status: 503 });
  }
}

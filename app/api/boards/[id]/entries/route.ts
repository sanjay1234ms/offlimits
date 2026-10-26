import { addEntry } from "@/lib/boardStore";

export const dynamic = "force-dynamic";

/** POST /api/boards/[id]/entries { name, payload } */
export async function POST(request: Request, { params }: { params: { id: string } }) {
  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad_json" }, { status: 400 });
  }
  try {
    const out = await addEntry(params.id, body.name, body.payload);
    return out ? Response.json(out) : Response.json({ error: "closed_or_missing" }, { status: 404 });
  } catch (err) {
    console.error("[boards] entry", err);
    return Response.json({ error: "unavailable" }, { status: 503 });
  }
}

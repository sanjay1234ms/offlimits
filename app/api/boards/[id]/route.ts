import { getBoard, isOwner } from "@/lib/boardStore";

export const dynamic = "force-dynamic";

/** GET /api/boards/[id]?t=TOKEN -> public view (+ owner flag). */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const view = await getBoard(params.id);
    if (!view) return Response.json({ error: "not_found" }, { status: 404 });
    const t = new URL(request.url).searchParams.get("t");
    return Response.json({ ...view, owner: t ? await isOwner(params.id, t) : false });
  } catch (err) {
    console.error("[boards] read", err);
    return Response.json({ error: "unavailable" }, { status: 503 });
  }
}

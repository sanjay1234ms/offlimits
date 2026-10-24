import { getDraw, openedKey } from "@/lib/santaStore";
import { ID_RE, type SantaPublicView } from "@/lib/santaView";

export const dynamic = "force-dynamic";

/** GET /api/santa/[id], what everyone with the group link may see: names and
 * who has opened theirs, never who got who. */
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  if (!ID_RE.test(params.id)) return Response.json({ error: "not_found" }, { status: 404 });
  try {
    const draw = await getDraw(params.id);
    if (!draw) return Response.json({ error: "not_found" }, { status: 404 });
    const view: SantaPublicView = {
      id: draw.id,
      title: draw.title,
      names: draw.names,
      opened: draw.names.map((_, i) => Boolean(draw.opened[openedKey(i)])),
      currency: draw.currency,
      budget: draw.budget,
      date: draw.exchange_date,
      message: draw.message,
    };
    return Response.json(view);
  } catch (err) {
    console.error("[santa] read", err);
    return Response.json({ error: "store_failed" }, { status: 500 });
  }
}

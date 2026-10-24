import { isValidDeviceId } from "@/lib/deviceId";
import { getDraw, markOpened, openedKey, sha256 } from "@/lib/santaStore";
import { ID_RE, type SantaOpenResult } from "@/lib/santaView";

export const dynamic = "force-dynamic";

/** POST /api/santa/[id]/open { index, deviceId }. The first phone to open a
 * name claims it; that same phone can reopen it later, anyone else gets 409. */
export async function POST(request: Request, { params }: { params: { id: string } }) {
  if (!ID_RE.test(params.id)) return Response.json({ error: "not_found" }, { status: 404 });

  let body: { index?: unknown; deviceId?: unknown } = {};
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad_json" }, { status: 400 });
  }
  const index = Number(body.index);
  if (!Number.isInteger(index) || !isValidDeviceId(body.deviceId)) {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  try {
    const draw = await getDraw(params.id);
    if (!draw) return Response.json({ error: "not_found" }, { status: 404 });
    if (index < 0 || index >= draw.names.length) {
      return Response.json({ error: "bad_request" }, { status: 400 });
    }

    const by = await sha256(`${draw.id}:${body.deviceId}`);
    const result: SantaOpenResult = {
      name: draw.names[index],
      receiver: draw.names[draw.receivers[index]],
    };

    const existing = draw.opened[openedKey(index)];
    if (existing) {
      return existing.by === by
        ? Response.json(result)
        : Response.json({ error: "taken" }, { status: 409 });
    }

    const claimed = await markOpened(draw.id, index, { by, at: new Date().toISOString() }, draw);
    if (!claimed) {
      // Lost a race; it's still ours if the winner was this same phone.
      const fresh = await getDraw(draw.id);
      if (fresh?.opened[openedKey(index)]?.by !== by) {
        return Response.json({ error: "taken" }, { status: 409 });
      }
    }
    return Response.json(result);
  } catch (err) {
    console.error("[santa] open", err);
    return Response.json({ error: "store_failed" }, { status: 500 });
  }
}

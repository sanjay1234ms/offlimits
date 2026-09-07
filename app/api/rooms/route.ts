import { createRoom } from "@/lib/roomStore";

export const dynamic = "force-dynamic";

/** POST /api/rooms, the host opens a new room. */
export async function POST(request: Request) {
  let body: { name?: string; games?: unknown; hostId?: string } = {};
  try {
    body = await request.json();
  } catch {
    /* empty body is fine */
  }

  const hostId =
    typeof body.hostId === "string" && body.hostId.length > 0
      ? body.hostId
      : crypto.randomUUID();

  const room = createRoom({ name: body.name, games: body.games, hostId });
  return Response.json(room, { status: 201 });
}

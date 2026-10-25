import {
  advanceRoom,
  getRoom,
  joinRoom,
  leaveRoom,
  resetRoomToLobby,
  startRoom,
} from "@/lib/roomStore";

export const dynamic = "force-dynamic";

interface Ctx {
  params: { code: string };
}

const notFound = () => Response.json({ error: "Room not found" }, { status: 404 });
const failed = (err: unknown) => {
  console.error("[rooms]", err);
  return Response.json({ error: "Room service unavailable" }, { status: 503 });
};

/** GET /api/rooms/[code]?p=<playerId>, poll room state (and heartbeat). */
export async function GET(request: Request, { params }: Ctx) {
  const code = params.code.toUpperCase();
  const playerId = new URL(request.url).searchParams.get("p");
  try {
    const room = await getRoom(code, playerId);
    return room ? Response.json(room) : notFound();
  } catch (err) {
    return failed(err);
  }
}

/** POST /api/rooms/[code], host/player actions. */
export async function POST(request: Request, { params }: Ctx) {
  const code = params.code.toUpperCase();

  let body: {
    action?: string;
    playerId?: string;
    name?: string;
    dir?: number;
  } = {};
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  try {
    switch (body.action) {
      case "join": {
        if (!body.playerId) {
          return Response.json({ error: "Missing playerId" }, { status: 400 });
        }
        const room = await joinRoom(code, body.playerId, body.name ?? "");
        return room ? Response.json(room) : notFound();
      }
      case "leave": {
        if (body.playerId) await leaveRoom(code, body.playerId);
        return Response.json({ ok: true });
      }
      case "start": {
        const room = await startRoom(code);
        return room ? Response.json(room) : notFound();
      }
      case "next": {
        const room = await advanceRoom(code, body.dir === -1 ? -1 : 1);
        return room ? Response.json(room) : notFound();
      }
      case "reset": {
        const room = await resetRoomToLobby(code);
        return room ? Response.json(room) : notFound();
      }
      default:
        return Response.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (err) {
    return failed(err);
  }
}

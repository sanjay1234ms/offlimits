import {
  advanceRoom,
  getRoom,
  joinRoom,
  leaveRoom,
  resetRoomToLobby,
  startRoom,
  touchPlayer,
} from "@/lib/roomStore";

export const dynamic = "force-dynamic";

interface Ctx {
  params: { code: string };
}

/** GET /api/rooms/[code]?p=<playerId>, poll room state (and heartbeat). */
export async function GET(request: Request, { params }: Ctx) {
  const code = params.code.toUpperCase();
  const playerId = new URL(request.url).searchParams.get("p");
  if (playerId) touchPlayer(code, playerId);

  const room = getRoom(code);
  if (!room) {
    return Response.json({ error: "Room not found" }, { status: 404 });
  }
  return Response.json(room);
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

  switch (body.action) {
    case "join": {
      if (!body.playerId) {
        return Response.json({ error: "Missing playerId" }, { status: 400 });
      }
      const room = joinRoom(code, body.playerId, body.name ?? "");
      if (!room) {
        return Response.json({ error: "Room not found" }, { status: 404 });
      }
      return Response.json(room);
    }
    case "leave": {
      if (body.playerId) leaveRoom(code, body.playerId);
      return Response.json({ ok: true });
    }
    case "start": {
      const room = startRoom(code);
      if (!room) {
        return Response.json({ error: "Room not found" }, { status: 404 });
      }
      return Response.json(room);
    }
    case "next": {
      const room = advanceRoom(code, body.dir === -1 ? -1 : 1);
      if (!room) {
        return Response.json({ error: "Room not found" }, { status: 404 });
      }
      return Response.json(room);
    }
    case "reset": {
      const room = resetRoomToLobby(code);
      if (!room) {
        return Response.json({ error: "Room not found" }, { status: 404 });
      }
      return Response.json(room);
    }
    default:
      return Response.json({ error: "Unknown action" }, { status: 400 });
  }
}

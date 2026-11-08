import { NextResponse } from "next/server";
import { isValidDeviceId } from "@/lib/deviceId";
import { getBoard, isBoardPuzzle, isOpenDay, renameScore, submitScore } from "@/lib/dailyStore";

export const dynamic = "force-dynamic";

/** GET /api/daily/word-heist?day=3&device=... -> today's table. */
export async function GET(req: Request, { params }: { params: { puzzle: string } }) {
  if (!isBoardPuzzle(params.puzzle)) return NextResponse.json({ error: "unknown puzzle" }, { status: 404 });
  const url = new URL(req.url);
  const day = Number(url.searchParams.get("day"));
  if (!Number.isInteger(day) || day < 0) return NextResponse.json({ error: "bad day" }, { status: 400 });
  const device = url.searchParams.get("device");
  try {
    const board = await getBoard(params.puzzle, day, isValidDeviceId(device) ? device : null);
    return NextResponse.json(board);
  } catch {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}

/** POST a finished puzzle. First finish per device per day counts. */
export async function POST(req: Request, { params }: { params: { puzzle: string } }) {
  if (!isBoardPuzzle(params.puzzle)) return NextResponse.json({ error: "unknown puzzle" }, { status: 404 });
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  const day = Number(body.day);
  if (body.action === "rename") {
    if (!Number.isInteger(day) || !isValidDeviceId(body.device)) {
      return NextResponse.json({ error: "bad request" }, { status: 400 });
    }
    try {
      await renameScore(params.puzzle, day, body.device, String(body.name ?? "").trim().slice(0, 20));
      return NextResponse.json({ ok: true });
    } catch {
      return NextResponse.json({ error: "unavailable" }, { status: 503 });
    }
  }
  const rank = Number(body.rank);
  const ms = Math.round(Number(body.ms));
  if (!isOpenDay(day)) return NextResponse.json({ error: "closed" }, { status: 409 });
  if (!isValidDeviceId(body.device)) return NextResponse.json({ error: "bad device" }, { status: 400 });
  if (!Number.isFinite(rank) || !Number.isFinite(ms) || ms < 0) {
    return NextResponse.json({ error: "bad score" }, { status: 400 });
  }
  try {
    await submitScore({
      puzzle: params.puzzle,
      day,
      device_id: body.device,
      name: String(body.name ?? "").trim().slice(0, 20),
      rank_value: rank,
      label: String(body.label ?? "").slice(0, 16),
      ms: Math.min(ms, 86_400_000),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}

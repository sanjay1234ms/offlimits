"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy, Crown, Download, Loader2, Share2 } from "lucide-react";
import { Modal } from "../Modal";
import { SocialShareRow } from "./SocialShareRow";
import type { Player } from "@/hooks/useScoreboard";
import { PODIUM_ROASTS } from "@/data/competitive";
import { sfx } from "@/lib/audio";
import { trackGameFinished } from "@/lib/analytics";

interface PodiumModalProps {
  open: boolean;
  onClose: () => void;
  players: Player[];
  gameTitle: string;
}

const W = 1080;
const H = 1920;
const MEDALS = ["🥇", "🥈", "🥉"];
const PLACE_COLOR = ["#fbbf24", "#cbd5e1", "#d97706"];

/** Per-place podium styling. Height is keyed to RANK, not screen position:
 * 1st is always the tallest bar. */
const STEP = {
  gold: {
    place: "1",
    badge: "👑 1ST",
    bar: "h-40",
    fill: "bg-gradient-to-t from-amber-600/40 via-amber-500/20 to-amber-400/30",
    edge: "border-t-2 border-amber-400",
    glow: "shadow-[0_0_28px_rgba(251,191,36,0.45)]",
    badgeCls:
      "border border-amber-400/50 bg-amber-500/15 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.7)]",
    score: "text-amber-300",
    num: "text-amber-200/25",
  },
  silver: {
    place: "2",
    badge: "🥈 2ND",
    bar: "h-28",
    fill: "bg-gradient-to-t from-slate-700/40 to-slate-500/20",
    edge: "border-t-2 border-slate-300",
    glow: "shadow-[0_0_18px_rgba(203,213,225,0.22)]",
    badgeCls: "border border-slate-300/40 bg-slate-500/15 text-slate-200",
    score: "text-slate-200",
    num: "text-slate-200/20",
  },
  bronze: {
    place: "3",
    badge: "🥉 3RD",
    bar: "h-20",
    fill: "bg-gradient-to-t from-amber-900/50 to-orange-700/25",
    edge: "border-t-2 border-orange-400",
    glow: "shadow-[0_0_16px_rgba(251,146,60,0.3)]",
    badgeCls: "border border-orange-400/40 bg-orange-500/15 text-orange-300",
    score: "text-orange-300",
    num: "text-orange-200/20",
  },
} as const;

function roastFor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return PODIUM_ROASTS[h % PODIUM_ROASTS.length];
}

/** End-game podium + a 9:16 story card. Two views in one modal. */
export function PodiumModal({
  open,
  onClose,
  players,
  gameTitle,
}: PodiumModalProps) {
  const [view, setView] = useState<"podium" | "card">("podium");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const ranked = [...players].sort((a, b) => b.score - a.score);
  const winner = ranked[0];
  const last = ranked[ranked.length - 1];
  const totalPoints = players.reduce((sum, p) => sum + Math.max(0, p.score), 0);

  // Screen order is 2nd · 1st · 3rd; each keeps its own rank-based height.
  const podium =
    ranked.length >= 3
      ? [
          { p: ranked[1], s: STEP.silver },
          { p: ranked[0], s: STEP.gold },
          { p: ranked[2], s: STEP.bronze },
        ]
      : ranked.length === 2
        ? [
            { p: ranked[0], s: STEP.gold },
            { p: ranked[1], s: STEP.silver },
          ]
        : ranked.length === 1
          ? [{ p: ranked[0], s: STEP.gold }]
          : [];
  const gridCols =
    podium.length === 3
      ? "grid-cols-3"
      : podium.length === 2
        ? "mx-auto max-w-xs grid-cols-2"
        : "mx-auto max-w-[10rem] grid-cols-1";

  useEffect(() => {
    if (open) {
      setView("podium");
      setCopied(false);
      if (players.length > 0) sfx.win();
      trackGameFinished(gameTitle);
    }
  }, [open, players.length, gameTitle]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "#1e1b4b");
    grad.addColorStop(0.55, "#4c1d95");
    grad.addColorStop(1, "#0b1020");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.globalAlpha = 0.5;
    const blob = ctx.createRadialGradient(880, 300, 0, 880, 300, 460);
    blob.addColorStop(0, "#fbbf24");
    blob.addColorStop(1, "transparent");
    ctx.fillStyle = blob;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;

    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.font = "800 58px system-ui, sans-serif";
    ctx.fillText("OFFLIMITS", W / 2, 170);
    ctx.fillStyle = "#c7d2fe";
    ctx.font = "700 34px system-ui, sans-serif";
    ctx.fillText(gameTitle.toUpperCase(), W / 2, 250);

    ctx.fillStyle = "#fde68a";
    ctx.font = "800 44px system-ui, sans-serif";
    ctx.fillText("🏆 FINAL STANDINGS", W / 2, 400);

    if (winner) {
      ctx.fillStyle = "#ffffff";
      ctx.font = "800 76px system-ui, sans-serif";
      ctx.fillText("👑 " + winner.name, W / 2, 560);
      ctx.fillStyle = "#fbbf24";
      ctx.font = "700 40px system-ui, sans-serif";
      ctx.fillText(`${winner.score} points`, W / 2, 625);
    }

    ctx.textAlign = "left";
    let y = 780;
    ranked.slice(0, 6).forEach((p, i) => {
      ctx.fillStyle =
        i < 3 ? PLACE_COLOR[i] : "rgba(255,255,255,0.85)";
      ctx.font = "800 46px system-ui, sans-serif";
      const badge = i < 3 ? MEDALS[i] : `${i + 1}.`;
      ctx.fillText(badge, 130, y);
      ctx.fillStyle = "#ffffff";
      const name = p.name.length > 16 ? p.name.slice(0, 15) + "…" : p.name;
      ctx.fillText(name, 240, y);
      ctx.textAlign = "right";
      ctx.fillStyle = i < 3 ? PLACE_COLOR[i] : "rgba(255,255,255,0.7)";
      ctx.fillText(String(p.score), W - 130, y);
      ctx.textAlign = "left";
      y += 92;
    });

    if (last && ranked.length > 1) {
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = "italic 600 30px system-ui, sans-serif";
      ctx.fillText(`${last.name}: ${roastFor(last.id)}`, W / 2, y + 40);
    }

    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = "700 30px system-ui, sans-serif";
    ctx.fillText("playofflimits.com", W / 2, H - 150);
  }, [gameTitle, ranked, winner, last]);

  useEffect(() => {
    if (open && view === "card") {
      const id = window.requestAnimationFrame(draw);
      return () => window.cancelAnimationFrame(id);
    }
  }, [open, view, draw]);

  const toBlob = () =>
    new Promise<Blob | null>((resolve) =>
      canvasRef.current?.toBlob((b) => resolve(b), "image/png"),
    );

  async function copyImage() {
    setBusy(true);
    try {
      const blob = await toBlob();
      if (
        blob &&
        typeof ClipboardItem !== "undefined" &&
        navigator.clipboard?.write
      ) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        setCopied(true);
      } else {
        await saveImage();
      }
    } catch {
      await saveImage();
    } finally {
      setBusy(false);
    }
  }

  async function saveImage() {
    const blob = await toBlob();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "offlimits-podium.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={view === "podium" ? "🏆 Final Standings" : "Share the podium"}
    >
      {view === "podium" ? (
        <div className="mt-2">
          {ranked.length === 0 ? (
            <p className="text-sm text-muted">
              No players on the board yet.
            </p>
          ) : (
            <>
              <p className="mt-1 text-center text-xs font-medium text-slate-400">
                {players.length} player{players.length === 1 ? "" : "s"} ·{" "}
                {totalPoints} round{totalPoints === 1 ? "" : "s"} scored
              </p>

              <div className={`mt-4 grid items-end gap-2 sm:gap-3 ${gridCols}`}>
                {podium.map(({ p, s }) => (
                  <div
                    key={p.id}
                    className="flex min-w-0 flex-col items-center gap-1.5"
                  >
                    <span
                      className={`rounded-full px-2 py-0.5 text-[0.7rem] font-black tracking-wide ${s.badgeCls}`}
                    >
                      {s.badge}
                    </span>
                    <span className="max-w-full truncate text-sm font-extrabold text-foreground">
                      {p.name}
                    </span>
                    <span
                      className={`text-lg font-black tabular-nums ${s.score}`}
                    >
                      {p.score} pts
                    </span>
                    <div
                      className={`relative w-full overflow-hidden rounded-t-2xl ${s.bar} ${s.fill} ${s.edge} ${s.glow}`}
                    >
                      <span
                        aria-hidden
                        className={`pointer-events-none absolute inset-x-0 bottom-1 select-none text-center text-6xl font-black leading-none ${s.num}`}
                      >
                        {s.place}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {ranked.length > 3 ? (
                <ul className="mt-4 space-y-1.5">
                  {ranked.slice(3).map((p, i) => (
                    <li
                      key={p.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-surface/60 px-3 py-1.5 text-sm"
                    >
                      <span className="font-semibold text-foreground">
                        {i + 4}. {p.name}
                      </span>
                      <span className="font-bold text-muted">{p.score}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {last && ranked.length > 1 ? (
                <p className="mt-4 rounded-xl border border-rose-500/30 bg-rose-950/40 px-4 py-2 text-xs font-medium text-rose-300">
                  {last.name}: {roastFor(last.id)}
                </p>
              ) : null}

              <button
                type="button"
                onClick={() => setView("card")}
                className="btn-primary mt-5 w-full py-3 transition-transform active:scale-95"
              >
                <Share2 className="h-4 w-4" aria-hidden />
                Share Podium Card
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="mt-2">
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              width={W}
              height={H}
              className="w-[220px] rounded-2xl border border-white/15 shadow-lg"
            />
          </div>
          <div className="mt-4">
            <SocialShareRow
              getBlob={toBlob}
              shareText={
                winner
                  ? `🏆 ${gameTitle}: ${winner.name} takes the crown with ${winner.score} pts! #OffLimits`
                  : `🏆 ${gameTitle} final standings, #OffLimits`
              }
              fileName="offlimits-podium.png"
            />
          </div>

          <div className="mt-3 flex flex-col gap-2.5 sm:flex-row">
            <button
              type="button"
              onClick={copyImage}
              disabled={busy}
              className="btn-primary flex-1 py-3"
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : copied ? (
                <Check className="h-4 w-4" aria-hidden />
              ) : (
                <Copy className="h-4 w-4" aria-hidden />
              )}
              {copied ? "Copied" : "Copy to Clipboard"}
            </button>
            <button
              type="button"
              onClick={saveImage}
              className="btn-ghost flex-1 py-3"
            >
              <Download className="h-4 w-4" aria-hidden />
              Download Card
            </button>
          </div>
          <button
            type="button"
            onClick={() => setView("podium")}
            className="mt-3 w-full text-center text-xs font-semibold text-muted hover:text-foreground"
          >
            ← Back to standings
          </button>
        </div>
      )}
    </Modal>
  );
}

/** Standalone crown badge, handy elsewhere. */
export function LeaderCrown() {
  return <Crown className="h-3 w-3 text-amber-400" aria-hidden />;
}

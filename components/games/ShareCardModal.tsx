"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy, Download, Loader2 } from "lucide-react";
import { Modal } from "../Modal";
import { SocialShareRow } from "./SocialShareRow";

interface ShareCardModalProps {
  open: boolean;
  onClose: () => void;
  prompt: string;
  /** Small line above the prompt, e.g. "Would You Rather". */
  gameLabel: string;
  /** Playful stamp at the bottom. */
  badge?: string;
  adult?: boolean;
}

const W = 1080;
const H = 1920;

function wrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** "Share the Carnage", renders a 9:16 story card to a canvas and offers a
 * one-tap copy or save. No external libraries; everything is drawn by hand. */
export function ShareCardModal({
  open,
  onClose,
  prompt,
  gameLabel,
  badge,
  adult,
}: ShareCardModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const grad = ctx.createLinearGradient(0, 0, W, H);
    if (adult) {
      grad.addColorStop(0, "#2a0a12");
      grad.addColorStop(0.5, "#7f1d3a");
      grad.addColorStop(1, "#120306");
    } else {
      grad.addColorStop(0, "#1e1b4b");
      grad.addColorStop(0.5, "#4c1d95");
      grad.addColorStop(1, "#0b1020");
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Soft glow blobs.
    ctx.globalAlpha = 0.5;
    const blob = ctx.createRadialGradient(880, 260, 0, 880, 260, 420);
    blob.addColorStop(0, adult ? "#f43f5e" : "#818cf8");
    blob.addColorStop(1, "transparent");
    ctx.fillStyle = blob;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;

    // Wordmark.
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.font = "800 58px system-ui, sans-serif";
    ctx.fillText("OFFLIMITS", W / 2, 180);
    ctx.fillStyle = adult ? "#fda4af" : "#c7d2fe";
    ctx.font = "600 30px system-ui, sans-serif";
    ctx.fillText("the party game with zero filter", W / 2, 230);

    // Game label.
    ctx.fillStyle = adult ? "#fecdd3" : "#a5b4fc";
    ctx.font = "700 40px system-ui, sans-serif";
    ctx.fillText(gameLabel.toUpperCase(), W / 2, 560);

    // Prompt body.
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 76px system-ui, sans-serif";
    const lines = wrap(ctx, prompt, W - 220);
    const lineHeight = 96;
    let y = H / 2 - ((lines.length - 1) * lineHeight) / 2;
    for (const l of lines) {
      ctx.fillText(l, W / 2, y);
      y += lineHeight;
    }

    // Badge.
    const stamp = badge ?? "OffLimits Late Night Confession";
    ctx.font = "700 32px system-ui, sans-serif";
    const bw = ctx.measureText(stamp).width + 72;
    const bx = (W - bw) / 2;
    const by = H - 320;
    ctx.fillStyle = adult ? "rgba(244,63,94,0.25)" : "rgba(129,140,248,0.22)";
    ctx.strokeStyle = adult ? "#fb7185" : "#a5b4fc";
    ctx.lineWidth = 3;
    if (typeof ctx.roundRect === "function") {
      ctx.beginPath();
      ctx.roundRect(bx, by, bw, 78, 39);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.fillRect(bx, by, bw, 78);
      ctx.strokeRect(bx, by, bw, 78);
    }
    ctx.fillStyle = "#ffffff";
    ctx.fillText(stamp, W / 2, by + 51);

    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = "600 28px system-ui, sans-serif";
    ctx.fillText("play at offlimits", W / 2, H - 150);
  }, [prompt, gameLabel, badge, adult]);

  useEffect(() => {
    if (open) {
      setCopied(false);
      // Wait a frame so the canvas is in the DOM.
      const id = window.requestAnimationFrame(draw);
      return () => window.cancelAnimationFrame(id);
    }
  }, [open, draw]);

  const toBlob = () =>
    new Promise<Blob | null>((resolve) => {
      canvasRef.current?.toBlob((b) => resolve(b), "image/png");
    });

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
        saveImage();
      }
    } catch {
      saveImage();
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
    a.download = "offlimits-card.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <Modal open={open} onClose={onClose} title="Share the carnage">
      <p className="mt-1 text-sm text-muted">
        A 9:16 card for your story. Copy it straight to the clipboard or save
        the image.
      </p>

      <div className="mt-4 flex justify-center">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="w-[220px] rounded-2xl border border-white/15 shadow-lg"
        />
      </div>

      <div className="mt-5">
        <SocialShareRow
          getBlob={toBlob}
          shareText={`${gameLabel} · ${prompt}, #OffLimits`}
          fileName="offlimits-card.png"
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
          {copied ? "Copied" : "Copy image"}
        </button>
        <button
          type="button"
          onClick={saveImage}
          className="btn-ghost flex-1 py-3"
        >
          <Download className="h-4 w-4" aria-hidden />
          Save card
        </button>
      </div>
    </Modal>
  );
}

"use client";

import { useCallback, useState } from "react";

interface SocialShareRowProps {
  /** Produces the 9:16 PNG (the drawn share canvas) to hand off. */
  getBlob: () => Promise<Blob | null>;
  /** Caption / score text carried into the share. */
  shareText: string;
  /** Link included in the share. */
  shareUrl?: string;
  /** Download filename for the fallback path. */
  fileName?: string;
}

const DEFAULT_URL = "https://playofflimits.com";

/* Pure inline brand marks, no icon packages. */
function FacebookMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
    </svg>
  );
}

function InstagramMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.06 1.8.25 2.23.42.56.21.96.47 1.38.9.43.42.69.82.9 1.38.17.42.36 1.05.42 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.06 1.17-.25 1.8-.42 2.23-.21.56-.47.96-.9 1.38-.42.43-.82.69-1.38.9-.42.17-1.05.36-2.23.42-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.06-1.8-.25-2.23-.42-.56-.21-.96-.47-1.38-.9-.43-.42-.69-.82-.9-1.38-.17-.42-.36-1.05-.42-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.06-1.17.25-1.8.42-2.23.21-.56.47-.96.9-1.38.42-.43.82-.69 1.38-.9.42-.17 1.05-.36 2.23-.42 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38A5.9 5.9 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13.67.66 1.34 1.08 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0Zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84Zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4Zm7.85-10.4a1.44 1.44 0 1 1-1.44-1.44 1.44 1.44 0 0 1 1.44 1.44Z" />
    </svg>
  );
}

function TikTokMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
      <path d="M16.6 5.82a4.28 4.28 0 0 1-1.05-2.82h-3.2v12.9a2.6 2.6 0 0 1-2.6 2.5 2.6 2.6 0 1 1 .77-5.08V7.99a5.8 5.8 0 0 0-.77-.05A5.83 5.83 0 1 0 15.4 13.8V8.35a7.5 7.5 0 0 0 4.4 1.4V6.55a4.3 4.3 0 0 1-3.2-.73Z" />
    </svg>
  );
}

const BASE_BTN =
  "inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 text-xs font-bold text-foreground transition-all duration-150 active:scale-95 disabled:opacity-50";

/** Facebook / Instagram / TikTok share buttons for any 9:16 share card. */
export function SocialShareRow({
  getBlob,
  shareText,
  shareUrl = DEFAULT_URL,
  fileName = "offlimits-card.png",
}: SocialShareRowProps) {
  const [toast, setToast] = useState<string | null>(null);
  const [busy, setBusy] = useState<"instagram" | "tiktok" | null>(null);

  const flash = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3500);
  }, []);

  function downloadBlob(blob: Blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function copyCaption() {
    try {
      await navigator.clipboard?.writeText(`${shareText}\n${shareUrl}`);
    } catch {
      /* clipboard blocked, the download + open still work */
    }
  }

  function shareFacebook() {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl,
    )}&quote=${encodeURIComponent(shareText)}`;
    window.open(
      url,
      "_blank",
      "noopener,noreferrer,width=626,height=436",
    );
  }

  async function shareNative(network: "instagram" | "tiktok") {
    if (busy) return;
    setBusy(network);
    try {
      const blob = await getBlob();
      const file = blob
        ? new File([blob], fileName, { type: "image/png" })
        : null;

      // Mobile / Web Share API with file support → native sheet.
      if (
        file &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] })
      ) {
        try {
          await navigator.share({
            files: [file],
            text: `${shareText}\n${shareUrl}`,
            title: "OffLimits",
          });
          return;
        } catch (err) {
          if ((err as Error)?.name === "AbortError") return;
          /* otherwise fall through to the download fallback */
        }
      }

      // Desktop / unsupported → download image, copy caption, open the app.
      if (blob) downloadBlob(blob);
      await copyCaption();
      window.open(
        network === "instagram"
          ? "https://www.instagram.com"
          : "https://www.tiktok.com",
        "_blank",
        "noopener,noreferrer",
      );
      flash(
        network === "instagram"
          ? "Card downloaded! Open Stories to post."
          : "Card downloaded! Open TikTok to post.",
      );
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="w-full">
      <p className="mb-1.5 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-subtle">
        Share to
      </p>
      <div className="flex items-stretch gap-2">
        <button
          type="button"
          onClick={shareFacebook}
          aria-label="Share to Facebook"
          className={`${BASE_BTN} hover:border-[#1877F2] hover:bg-[#1877F2]/10 hover:text-[#1877F2]`}
        >
          <FacebookMark />
          Facebook
        </button>
        <button
          type="button"
          onClick={() => shareNative("instagram")}
          disabled={busy === "instagram"}
          aria-label="Share to Instagram"
          className={`${BASE_BTN} hover:border-[#E1306C] hover:bg-gradient-to-br hover:from-[#833AB4]/15 hover:to-[#E1306C]/15 hover:text-[#E1306C]`}
        >
          <InstagramMark />
          Instagram
        </button>
        <button
          type="button"
          onClick={() => shareNative("tiktok")}
          disabled={busy === "tiktok"}
          aria-label="Share to TikTok"
          className={`${BASE_BTN} hover:border-[#25F4EE] hover:text-foreground hover:shadow-[0_0_12px_rgba(37,244,238,0.35)] dark:hover:bg-white/10`}
        >
          <TikTokMark />
          TikTok
        </button>
      </div>

      {toast ? (
        <div
          className="fixed inset-x-0 bottom-6 z-[90] flex justify-center px-4"
          role="status"
          aria-live="polite"
        >
          <div className="animate-fade-up rounded-full border border-white/15 bg-slate-900/95 px-4 py-2 text-xs font-bold text-white shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)] backdrop-blur">
            {toast}
          </div>
        </div>
      ) : null}
    </div>
  );
}

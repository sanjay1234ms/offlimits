"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Share2 } from "lucide-react";
import { track } from "@/lib/analytics";

const ORIGIN = "https://playofflimits.com";

/**
 * End-of-game nudge that turns one group into the next: guests get a
 * "host your own" link, everyone gets a share button. Shown only after a
 * game or round has finished, so it never gets in the way of play.
 */
export function ShareLoop({
  from,
  hostHref,
  hostLabel,
  sharePath,
  shareText,
  showHost = true,
  dark = true,
}: {
  /** Where it was shown, for analytics (e.g. "wolf_end", "room_lobby"). */
  from: string;
  hostHref: string;
  hostLabel: string;
  /** Page to share, e.g. "/werewolf-game". */
  sharePath: string;
  shareText: string;
  /** Hosts already have their own game; hide the host link for them. */
  showHost?: boolean;
  dark?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const url = `${ORIGIN}${sharePath}`;

  async function share() {
    track("loop_share", { from });
    try {
      if (navigator.share) {
        await navigator.share({ title: "OffLimits", text: shareText, url });
        return;
      }
      await navigator.clipboard.writeText(`${shareText} ${url}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* share sheet closed */
    }
  }

  return (
    <div
      className={`w-full rounded-2xl border-2 p-4 text-center ${
        dark ? "border-white/15 bg-white/[0.06]" : "border-slate-900/15 bg-white/70"
      }`}
    >
      <p className="text-sm font-extrabold">Had fun? Pass it on.</p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-center">
        {showHost ? (
          <Link
            href={hostHref}
            onClick={() => track("loop_host_click", { from })}
            className="btn-primary w-full sm:w-auto"
          >
            {hostLabel}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        ) : null}
        <button type="button" onClick={share} className="btn-ghost w-full sm:w-auto">
          {copied ? <Check className="h-4 w-4" aria-hidden /> : <Share2 className="h-4 w-4" aria-hidden />}
          {copied ? "Link copied" : "Share with friends"}
        </button>
      </div>
      <Link
        href="/daily"
        onClick={() => track("loop_daily_click", { from })}
        className="mt-3 inline-block text-xs font-bold underline-offset-2 opacity-80 hover:underline"
      >
        🧩 Play today&apos;s puzzles: Word Heist, Off the Map and Close Call
      </Link>
    </div>
  );
}

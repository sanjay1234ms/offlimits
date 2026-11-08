"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Share, Smartphone, X } from "lucide-react";
import { GAME_DONE_EVENT, track } from "@/lib/analytics";

/**
 * "Save OffLimits to your home screen" sheet, shown once right after a group
 * finishes a deck or a game (the moment they've just had fun). Party games get
 * played once per party, so a one-tap icon is what brings a group back.
 *
 * - Android / desktop Chrome: a real "Add" button (beforeinstallprompt).
 * - iPhone / iPad: Safari has no install API, so it shows the two taps.
 * - Never shown inside the installed app, and stays quiet for 14 days after
 *   "Not now". Add `?a2hs=1` to any URL to preview it.
 */

const STORE_KEY = "offlimits_a2hs";
const SNOOZE_DAYS = 14;
const SHOW_DELAY_MS = 1800;

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type Platform = "ios" | "android" | "desktop";

function readStore(): { snoozedAt?: number; installed?: boolean } {
  try {
    return JSON.parse(window.localStorage.getItem(STORE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeStore(value: { snoozedAt?: number; installed?: boolean }) {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(value));
  } catch {
    // Private mode: the sheet just may show again later.
  }
}

function isStandalone(): boolean {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true
  );
}

function detectPlatform(): Platform {
  const ua = window.navigator.userAgent;
  const iPadOS =
    window.navigator.platform === "MacIntel" &&
    window.navigator.maxTouchPoints > 1;
  if (/iPhone|iPad|iPod/i.test(ua) || iPadOS) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "desktop";
}

export function HomeScreenPrompt() {
  const [open, setOpen] = useState(false);
  const [platform, setPlatform] = useState<Platform>("desktop");
  const deferred = useRef<InstallPromptEvent | null>(null);
  const shownThisVisit = useRef(false);

  const show = useCallback((reason: string) => {
    if (shownThisVisit.current || isStandalone()) return;
    const p = detectPlatform();
    // Desktop only gets the sheet when the browser can actually install.
    if (p === "desktop" && !deferred.current) return;
    shownThisVisit.current = true;
    setPlatform(p);
    setOpen(true);
    track("a2hs_shown", { platform: p, reason, native: !!deferred.current });
  }, []);

  useEffect(() => {
    function onBeforeInstall(e: Event) {
      e.preventDefault(); // keep Chrome's mini-bar away; we ask at a better moment
      deferred.current = e as InstallPromptEvent;
    }
    function onInstalled() {
      writeStore({ ...readStore(), installed: true });
      track("a2hs_installed", { platform: detectPlatform() });
      setOpen(false);
    }
    function onGameDone(e: Event) {
      const store = readStore();
      if (store.installed) return;
      if (
        store.snoozedAt &&
        Date.now() - store.snoozedAt < SNOOZE_DAYS * 24 * 60 * 60 * 1000
      ) {
        return;
      }
      const game = (e as CustomEvent<{ game?: string }>).detail?.game ?? "";
      window.setTimeout(() => show(game || "game_done"), SHOW_DELAY_MS);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    window.addEventListener(GAME_DONE_EVENT, onGameDone);

    if (new URLSearchParams(window.location.search).get("a2hs") === "1") {
      window.setTimeout(() => show("preview"), 600);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
      window.removeEventListener(GAME_DONE_EVENT, onGameDone);
    };
  }, [show]);

  function notNow() {
    writeStore({ ...readStore(), snoozedAt: Date.now() });
    track("a2hs_dismissed", { platform });
    setOpen(false);
  }

  async function install() {
    const ev = deferred.current;
    if (!ev) return;
    track("a2hs_click", { platform });
    try {
      await ev.prompt();
      const choice = await ev.userChoice;
      track(choice.outcome === "accepted" ? "a2hs_accepted" : "a2hs_declined", {
        platform,
      });
      if (choice.outcome !== "accepted") {
        writeStore({ ...readStore(), snoozedAt: Date.now() });
      }
    } catch {
      // The browser refused; fall through and close.
    }
    deferred.current = null;
    setOpen(false);
  }

  if (!open) return null;

  const native = !!deferred.current;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[60] flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      role="dialog"
      aria-modal="false"
      aria-labelledby="a2hs-title"
    >
      <div className="relative w-full max-w-md animate-[a2hs-up_0.35s_ease-out] rounded-3xl border-2 border-accent bg-card p-5 text-foreground shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
        <button
          type="button"
          onClick={notNow}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-full p-1.5 text-muted transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>

        <div className="flex items-start gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icon-192.png"
            alt=""
            width={56}
            height={56}
            className="h-14 w-14 shrink-0 rounded-2xl shadow-lg"
          />
          <div className="min-w-0 pr-6">
            <p id="a2hs-title" className="text-lg font-extrabold leading-tight">
              Good game! Keep OffLimits for next time
            </p>
            <p className="mt-1 text-sm text-muted">
              Save it to your home screen and the next party starts in one tap.
              No app store, no signup.
            </p>
          </div>
        </div>

        {native ? (
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={install}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-extrabold text-white shadow-[0_0_24px_var(--accent-soft)] transition-transform active:scale-95"
            >
              <Smartphone className="h-4 w-4" aria-hidden />
              Add to home screen
            </button>
            <button
              type="button"
              onClick={notNow}
              className="rounded-full border-2 border-border px-4 py-3 text-sm font-bold text-muted transition-colors hover:text-foreground"
            >
              Not now
            </button>
          </div>
        ) : (
          <>
            <ol className="mt-4 space-y-2 text-sm font-semibold">
              {platform === "ios" ? (
                <>
                  <li className="flex items-center gap-3 rounded-2xl bg-[color:var(--accent-soft)] px-3 py-2.5">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-xs font-black text-white">1</span>
                    <span className="flex items-center gap-1.5">
                      Tap <Share className="h-4 w-4 text-accent" aria-label="Share" /> Share in Safari
                    </span>
                  </li>
                  <li className="flex items-center gap-3 rounded-2xl bg-[color:var(--accent-soft)] px-3 py-2.5">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-xs font-black text-white">2</span>
                    <span>Choose &ldquo;Add to Home Screen&rdquo;</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-center gap-3 rounded-2xl bg-[color:var(--accent-soft)] px-3 py-2.5">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-xs font-black text-white">1</span>
                    <span>Tap the &#8942; menu in your browser</span>
                  </li>
                  <li className="flex items-center gap-3 rounded-2xl bg-[color:var(--accent-soft)] px-3 py-2.5">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-xs font-black text-white">2</span>
                    <span>Choose &ldquo;Add to Home screen&rdquo;</span>
                  </li>
                </>
              )}
            </ol>
            <button
              type="button"
              onClick={notNow}
              className="mt-3 w-full rounded-full border-2 border-border py-2.5 text-sm font-bold text-muted transition-colors hover:text-foreground"
            >
              Got it
            </button>
          </>
        )}
      </div>
      <style>{`@keyframes a2hs-up{from{transform:translateY(24px);opacity:0}to{transform:none;opacity:1}}`}</style>
    </div>
  );
}

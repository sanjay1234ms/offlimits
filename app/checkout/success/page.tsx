"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Loader2, TriangleAlert } from "lucide-react";
import { getDeviceId } from "@/lib/deviceId";
import { activateVerifiedPass, type PartyPassRecord } from "@/lib/monetization";

type State =
  | { kind: "verifying" }
  | { kind: "done"; code: string; expiresAt: number }
  | { kind: "error"; message: string };

function formatExpiry(ts: number): string {
  try {
    return new Date(ts).toLocaleString(undefined, {
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "in 24 hours";
  }
}

function SuccessInner() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [state, setState] = useState<State>({ kind: "verifying" });
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    if (!sessionId) {
      setState({
        kind: "error",
        message: "This link is missing its checkout session id.",
      });
      return;
    }

    (async () => {
      try {
        const res = await fetch("/api/verify-pass", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ sessionId, deviceId: getDeviceId() }),
        });
        const data = (await res.json()) as {
          error?: string;
          code?: string;
          pass?: PartyPassRecord;
        };

        if (!res.ok || !data.pass) {
          setState({
            kind: "error",
            message: data.error || "We could not verify that payment.",
          });
          return;
        }

        const stored = activateVerifiedPass(data.pass);
        if (!stored) {
          setState({
            kind: "error",
            message: "The pass we got back was not valid. Contact support.",
          });
          return;
        }

        setState({
          kind: "done",
          code: data.code ?? data.pass.code ?? "",
          expiresAt: stored.expiresAt,
        });
      } catch {
        setState({
          kind: "error",
          message:
            "Something went wrong reaching the server. Refresh to try again.",
        });
      }
    })();
  }, [sessionId]);

  return (
    <div className="mx-auto max-w-lg px-4 py-20 sm:px-6 sm:py-28">
      {state.kind === "verifying" && (
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2
            className="h-8 w-8 animate-spin text-accent"
            aria-hidden
          />
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Confirming your payment
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            One moment while we check the receipt with Stripe.
          </p>
        </div>
      )}

      {state.kind === "done" && (
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 text-center backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
            <Check className="h-7 w-7" aria-hidden />
          </span>
          <h1 className="mt-5 text-2xl font-extrabold text-slate-900 dark:text-white">
            Party Pass is live
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Every 18+ deck, game, and tool is unlocked on this device until{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {formatExpiry(state.expiresAt)}
            </span>
            . It is tied to this browser and will not carry to another one.
          </p>

          {state.code && (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Reference code
              </p>
              <p className="mt-1 font-mono text-base font-bold tracking-wider text-slate-900 dark:text-white">
                {state.code}
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/games" className="btn-primary">
              Start playing
            </Link>
            <Link href="/" className="btn-ghost">
              Back home
            </Link>
          </div>
        </div>
      )}

      {state.kind === "error" && (
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 text-center backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
            <TriangleAlert className="h-7 w-7" aria-hidden />
          </span>
          <h1 className="mt-5 text-2xl font-extrabold text-slate-900 dark:text-white">
            We could not activate the pass
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {state.message}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/games" className="btn-ghost">
              Back to games
            </Link>
            <a href="mailto:hello@playofflimits.com" className="btn-primary">
              Contact support
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-dvh bg-slate-50 text-slate-800 dark:bg-[#060814] dark:text-slate-100">
      <Suspense
        fallback={
          <div className="mx-auto max-w-lg px-4 py-28 text-center">
            <Loader2
              className="mx-auto h-8 w-8 animate-spin text-accent"
              aria-hidden
            />
          </div>
        }
      >
        <SuccessInner />
      </Suspense>
    </div>
  );
}

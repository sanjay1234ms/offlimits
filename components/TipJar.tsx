"use client";

import { useEffect, useState } from "react";
import { Coffee, Heart } from "lucide-react";
import { TIP_TIERS } from "@/lib/monetization";
import { Modal } from "./Modal";

/** Event any component can dispatch to open the tip modal (e.g. the footer). */
export const OPEN_TIPJAR_EVENT = "offlimits:open-tipjar";

/** Floating "Support Dev" button + slide-up tipping modal. */
export function TipJar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openit = () => setOpen(true);
    window.addEventListener(OPEN_TIPJAR_EVENT, openit);
    return () => window.removeEventListener(OPEN_TIPJAR_EVENT, openit);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Support the developer"
        className="group fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-white/20 bg-accent px-4 py-3 text-sm font-bold text-[color:var(--accent-contrast)] shadow-[0_12px_36px_-8px_var(--accent-glow)] transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 hover:scale-105 active:scale-90 sm:bottom-6 sm:right-6"
      >
        <Coffee className="h-5 w-5 transition-transform group-hover:-rotate-12" aria-hidden />
        <span className="hidden sm:inline">Support Dev</span>
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Support Dev">
        <div className="mt-3 flex flex-col gap-4">
          <p className="flex items-start gap-2 text-sm text-muted">
            <Heart
              className="mt-0.5 h-4 w-4 shrink-0 text-accent"
              aria-hidden
            />
            Enjoying game night? Help keep the servers running ad-free!
          </p>

          <div className="flex flex-col gap-2.5">
            {TIP_TIERS.map((tier) => (
              <a
                key={tier.id}
                href={tier.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost w-full justify-between text-sm"
              >
                <span>{tier.label}</span>
                <span aria-hidden className="text-muted">
                  →
                </span>
              </a>
            ))}
          </div>

          <p className="text-xs text-subtle">
            Secure checkout via Stripe. You&apos;ll leave this site to
            complete your tip.
          </p>
        </div>
      </Modal>
    </>
  );
}

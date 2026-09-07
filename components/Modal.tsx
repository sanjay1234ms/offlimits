"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  /** Hide the corner close button (e.g. for a required choice). */
  hideClose?: boolean;
  /** Dismiss when the backdrop is clicked. Default true. */
  dismissable?: boolean;
  children: React.ReactNode;
}

/** Slide-up (mobile) / centered (desktop) dialog with a dimmed backdrop. */
export function Modal({
  open,
  onClose,
  title,
  hideClose = false,
  dismissable = true,
  children,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape" && dismissable) onClose();
    }
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose, dismissable]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 animate-fade-in bg-black/70 backdrop-blur-sm"
        onClick={dismissable ? onClose : undefined}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative z-10 max-h-[90vh] w-full max-w-md animate-slide-up overflow-y-auto rounded-t-3xl border border-white/10 bg-surface/95 p-6 shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.6)] outline-none backdrop-blur-xl sm:animate-pop-in sm:rounded-3xl sm:shadow-2xl"
      >
        {!hideClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        ) : null}
        {title ? (
          <h2 className="pr-8 text-lg font-bold tracking-tight text-foreground">
            {title}
          </h2>
        ) : null}
        {children}
      </div>
    </div>
  );
}

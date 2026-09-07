"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

interface NavLink {
  href: string;
  label: string;
}

/** Collapsed primary nav for narrow screens. Shows a menu button that opens
 * the same links the header lays out inline at `sm` and up. Hidden entirely
 * once there is room for the inline links. */
export function MobileNav({
  links,
  isActive,
}: {
  links: NavLink[];
  isActive: (href: string) => boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative shrink-0 sm:hidden" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border-strong text-foreground transition-colors hover:bg-surface"
      >
        {open ? (
          <X className="h-4 w-4" aria-hidden />
        ) : (
          <Menu className="h-4 w-4" aria-hidden />
        )}
      </button>

      {open ? (
        <div className="absolute right-0 top-11 z-50 w-44 rounded-2xl border border-white/10 bg-surface/95 p-2 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`rounded-xl px-3 py-2 text-sm font-bold transition-colors ${
                  isActive(link.href)
                    ? "bg-white/10 text-foreground"
                    : "text-muted hover:bg-white/5 hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

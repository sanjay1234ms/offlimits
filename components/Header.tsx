"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Lock, Zap } from "lucide-react";
import { usePartyPass } from "@/hooks/usePartyPass";
import { EffectsMenu } from "./EffectsMenu";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/games", label: "Games" },
  { href: "/party", label: "Party" },
  { href: "/wheel", label: "Wheel" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** App-wide minimalist header: wordmark, primary nav, the Party Pass badge,
 * and the theme toggle. */
export function Header() {
  const pathname = usePathname() ?? "/";
  const pass = usePartyPass();

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-content items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-foreground"
          aria-label="OffLimits, home"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-[color:var(--accent-contrast)] shadow-[0_0_24px_var(--accent-glow)] transition-transform duration-300 group-hover:scale-105">
            <Lock className="h-4 w-4" aria-hidden />
          </span>
          <span className="text-lg font-extrabold uppercase tracking-tight">
            Off<span className="text-accent">Limits</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {pass.hydrated && pass.active ? (
            <span
              title={`18+ unlocked · ${pass.remainingLabel}`}
              className="mr-1 inline-flex animate-flame-pulse items-center gap-1.5 rounded-full border-2 border-amber-400/50 bg-amber-500/15 px-2.5 py-1 text-[0.7rem] font-extrabold text-amber-300 sm:text-xs"
            >
              <Zap className="h-3 w-3" aria-hidden />
              <span className="hidden sm:inline">Party Pass Active: 18+ Unlocked</span>
              <span className="sm:hidden">18+</span>
              <span className="hidden font-bold text-amber-200/80 md:inline">
                · {pass.remainingLabel}
              </span>
            </span>
          ) : null}

          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(pathname, link.href) ? "page" : undefined}
              className={`rounded-full px-3 py-1.5 text-[0.8rem] font-bold transition-colors sm:text-sm ${
                isActive(pathname, link.href)
                  ? "border border-white/10 bg-white/10 text-foreground backdrop-blur"
                  : "text-muted hover:bg-white/5 hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <span className="mx-1 hidden h-5 w-px bg-white/10 sm:block" />
          <EffectsMenu />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

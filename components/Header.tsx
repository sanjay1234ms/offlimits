"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Flame, Lock, Zap } from "lucide-react";
import { usePartyPass } from "@/hooks/usePartyPass";
import { EffectsMenu } from "./EffectsMenu";
import { MobileNav } from "./MobileNav";
import { ScrollProgress } from "./ScrollProgress";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/games", label: "Games" },
  { href: "/questions", label: "Questions" },
  { href: "/party", label: "Party" },
  { href: "/wheel", label: "Wheel" },
];

/** Age-gated 18+ deck; styled apart from the regular links. */
const ADULT_LINK = { href: "/play?category=18-plus&vibe=wild", label: "18+" };

/** True once the page has scrolled past the very top. */
function useScrolled(threshold = 8): boolean {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let frame = 0;
    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() =>
        setScrolled(window.scrollY > threshold),
      );
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [threshold]);
  return scrolled;
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** App-wide minimalist header: wordmark, primary nav, the Party Pass badge,
 * and the theme toggle. */
export function Header() {
  const pathname = usePathname() ?? "/";
  const pass = usePartyPass();
  const scrolled = useScrolled();

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled
          ? "border-white/10 bg-background/90 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.55)]"
          : "border-transparent bg-background/60"
      }`}
    >
      <div
        className={`mx-auto flex max-w-content items-center justify-between gap-2 px-3 transition-[padding] duration-300 sm:gap-3 sm:px-6 ${
          scrolled ? "py-2" : "py-3"
        }`}
      >
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-2.5 text-foreground"
          aria-label="OffLimits, home"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent text-[color:var(--accent-contrast)] shadow-[0_0_24px_var(--accent-glow)] transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110">
            <Lock className="h-4 w-4" aria-hidden />
          </span>
          <span className="truncate text-lg font-extrabold uppercase tracking-tight">
            Off<span className="text-accent">Limits</span>
          </span>
        </Link>

        <nav className="flex shrink-0 items-center gap-1">
          {pass.hydrated && pass.active ? (
            <span
              title={`18+ unlocked Â· ${pass.remainingLabel}`}
              className="mr-1 inline-flex shrink-0 animate-flame-pulse items-center gap-1.5 rounded-full border-2 border-amber-400/50 bg-amber-500/15 px-2 py-1 text-[0.7rem] font-extrabold text-amber-300 sm:px-2.5 sm:text-xs"
            >
              <Zap className="h-3 w-3" aria-hidden />
              <span className="hidden sm:inline">
                Party Pass Active: 18+ Unlocked
              </span>
              <span className="sm:hidden">18+</span>
              <span className="hidden font-bold text-amber-200/80 md:inline">
                Â· {pass.remainingLabel}
              </span>
            </span>
          ) : null}

          <div className="hidden items-center gap-1 sm:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={
                  isActive(pathname, link.href) ? "page" : undefined
                }
                className={`rounded-full px-3 py-1.5 text-[0.8rem] font-bold transition-[color,background-color,transform] duration-200 hover:-translate-y-px sm:text-sm ${
                  isActive(pathname, link.href)
                    ? "border border-white/10 bg-white/10 text-foreground shadow-[inset_0_-2px_0_var(--accent)] backdrop-blur"
                    : "text-muted hover:bg-white/5 hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={ADULT_LINK.href}
              className="catalog-adult-badge ml-1 inline-flex items-center gap-1 rounded-full border-2 border-red-500/60 bg-red-950/40 px-2.5 py-1 text-[0.8rem] font-extrabold text-red-300 shadow-[0_0_16px_rgba(239,68,68,0.25)] transition-colors hover:bg-red-900/50 hover:text-red-200 sm:text-sm"
            >
              <Flame className="h-3.5 w-3.5" aria-hidden />
              {ADULT_LINK.label}
            </Link>
            <span className="mx-1 h-5 w-px bg-white/10" />
          </div>

          <MobileNav
            links={links}
            adultLink={ADULT_LINK}
            isActive={(href) => isActive(pathname, href)}
          />
          <EffectsMenu />
          <ThemeToggle />
        </nav>
      </div>
      <ScrollProgress />
    </header>
  );
}

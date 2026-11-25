"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import { runInkReveal } from "@/lib/inkReveal";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  /** Flip the theme. Pass the point that was tapped (viewport px) and the
   * new theme spreads out from there as an ink splash. */
  toggle: (origin?: { x: number; y: number }) => void;
  setTheme: (theme: Theme) => void;
}

const STORAGE_KEY = "antics-theme";

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Applies the theme class + color-scheme to <html> and persists the choice. */
function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Defaults to "dark" to match the no-flash script in layout.tsx; the stored
  // preference (if any) is read on mount.
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* storage unavailable, keep the default */
    }
    if (stored === "light" || stored === "dark") {
      setThemeState(stored);
      applyTheme(stored);
    }
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const busy = useRef(false);

  const toggle = useCallback(
    (origin?: { x: number; y: number }) => {
      if (busy.current) return;
      const next: Theme = document.documentElement.classList.contains("dark")
        ? "light"
        : "dark";
      const commit = () => flushSync(() => setTheme(next));
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const doc = document as Document & {
        startViewTransition?: (cb: () => void) => {
          ready: Promise<void>;
          finished: Promise<void>;
        };
      };

      // Ink-splash reveal (same as Yappr): the new theme bursts out of the
      // toggle and floods the page with a marbled ink edge.
      if (!reduce && doc.startViewTransition) {
        busy.current = true;
        const o = origin ?? { x: window.innerWidth - 60, y: 40 };
        const vt = doc.startViewTransition(commit);
        vt.ready.then(() => runInkReveal(o, next === "light")).catch(() => {});
        vt.finished.finally(() => {
          busy.current = false;
        });
        return;
      }
      // No View Transitions: short colour cross-fade. Reduced motion: instant.
      if (!reduce) {
        const root = document.documentElement;
        root.classList.add("theme-fading");
        window.setTimeout(() => root.classList.remove("theme-fading"), 500);
      }
      commit();
    },
    [setTheme],
  );

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within <ThemeProvider>");
  }
  return ctx;
}

"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

/** Dark / light switch. Renders a stable placeholder until mounted so the
 * icon never mismatches during hydration. */
export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border-strong text-foreground transition-colors hover:bg-surface"
    >
      {!mounted ? (
        <span className="h-4 w-4" />
      ) : isDark ? (
        <Moon className="h-4 w-4" aria-hidden />
      ) : (
        <Sun className="h-4 w-4" aria-hidden />
      )}
    </button>
  );
}

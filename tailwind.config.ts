import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic tokens, resolved from CSS variables so every surface
        // flips between the light and dark palettes automatically.
        background: "var(--background)",
        surface: "var(--surface)",
        "surface-raised": "var(--surface-raised)",
        card: "var(--card-bg)",
        border: "var(--border)",
        "border-strong": "var(--border-strong)",
        foreground: "var(--text)",
        muted: "var(--text-muted)",
        subtle: "var(--text-subtle)",
        accent: {
          DEFAULT: "var(--accent)",
          strong: "var(--accent-strong)",
          contrast: "var(--accent-contrast)",
          soft: "var(--accent-soft)",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "1.25rem",
        "3xl": "1.75rem",
      },
      maxWidth: {
        content: "72rem",
      },
      keyframes: {
        "card-in": {
          "0%": { opacity: "0", transform: "translateX(28px) scale(0.97)" },
          "100%": { opacity: "1", transform: "translateX(0) scale(1)" },
        },
        "card-flip": {
          "0%": { opacity: "0", transform: "rotateY(-90deg)" },
          "60%": { opacity: "1" },
          "100%": { opacity: "1", transform: "rotateY(0deg)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(100%)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pop-in": {
          "0%": { opacity: "0", transform: "translateY(14px) scale(0.94)" },
          "60%": { opacity: "1", transform: "translateY(-3px) scale(1.02)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "flame-pulse": {
          "0%, 100%": {
            boxShadow:
              "0 0 18px rgba(239,68,68,0.35), inset 0 0 12px rgba(239,68,68,0.12)",
            borderColor: "rgba(239,68,68,0.5)",
          },
          "50%": {
            boxShadow:
              "0 0 34px rgba(239,68,68,0.65), inset 0 0 18px rgba(239,68,68,0.2)",
            borderColor: "rgba(239,68,68,0.9)",
          },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg) scale(1.12)" },
          "25%": { transform: "rotate(-9deg) scale(1.16)" },
          "75%": { transform: "rotate(9deg) scale(1.16)" },
        },
        marquee: {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "100%": { transform: "translate3d(-50%, 0, 0)" },
        },
        "word-flip": {
          "0%": { opacity: "0", transform: "translateY(60%) rotateX(-80deg)" },
          "100%": { opacity: "1", transform: "translateY(0) rotateX(0deg)" },
        },
        sticker: {
          "0%, 84%, 100%": { transform: "rotate(-2deg) scale(1)" },
          "88%": { transform: "rotate(3deg) scale(1.08)" },
          "92%": { transform: "rotate(-5deg) scale(1.08)" },
          "96%": { transform: "rotate(1deg) scale(1.02)" },
        },
        "menu-in": {
          "0%": { opacity: "0", transform: "translateY(-6px) scale(0.94)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "pulse-subtle": {
          "0%, 100%": {
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.28), 0 6px 20px -4px rgba(244,63,94,0.45)",
          },
          "50%": {
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.45), 0 8px 30px -2px rgba(244,63,94,0.8)",
          },
        },
      },
      animation: {
        "card-in": "card-in 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
        "card-flip": "card-flip 0.42s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-up": "fade-up 0.3s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "slide-up": "slide-up 0.32s cubic-bezier(0.16, 1, 0.3, 1)",
        "pop-in": "pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "float-slow": "float-slow 6s ease-in-out infinite",
        "flame-pulse": "flame-pulse 2.2s ease-in-out infinite",
        "pulse-subtle": "pulse-subtle 2s ease-in-out infinite",
        wiggle: "wiggle 0.6s ease-in-out",
        marquee: "marquee 40s linear infinite",
        "marquee-reverse": "marquee 46s linear infinite reverse",
        "word-flip": "word-flip 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
        sticker: "sticker 5s ease-in-out infinite",
        "menu-in": "menu-in 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
export default config;

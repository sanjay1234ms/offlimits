import Link from "next/link";
import { CATALOG } from "@/data/catalog";

interface MarqueeItem {
  href: string;
  label: string;
  emoji: string;
}

const GAME_ITEMS: MarqueeItem[] = CATALOG.filter((g) => !g.adult).map((g) => ({
  href: g.href,
  label: g.title,
  emoji: g.emoji,
}));

const TONES = {
  yellow: {
    band: "-rotate-1 bg-yellow-300",
    link: "text-slate-900 hover:bg-slate-900 hover:text-yellow-300",
  },
  pink: {
    band: "rotate-1 bg-pink-400",
    link: "text-slate-900 hover:bg-slate-900 hover:text-pink-300",
  },
};

interface GameMarqueeProps {
  /** Defaults to every clean game. */
  items?: MarqueeItem[];
  tone?: keyof typeof TONES;
  /** Scroll right instead of left. */
  reverse?: boolean;
}

/** Endless ticker of links, tilted like a party banner. The second copy
 * only exists to make the loop seamless, so it is hidden from screen
 * readers and the tab order. */
export function GameMarquee({
  items = GAME_ITEMS,
  tone = "yellow",
  reverse = false,
}: GameMarqueeProps) {
  const t = TONES[tone];
  return (
    <div
      className={`relative border-y-[3px] border-slate-900 py-3 shadow-[0_6px_0_#0f172a] ${t.band}`}
    >
      <div className="group flex overflow-hidden">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1}
            className={`flex shrink-0 items-center gap-3 pr-3 group-hover:[animation-play-state:paused] motion-reduce:animate-none ${
              reverse ? "animate-marquee-reverse" : "animate-marquee"
            }`}
          >
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  tabIndex={copy === 1 ? -1 : undefined}
                  className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1 text-base font-black uppercase tracking-tight transition-colors ${t.link}`}
                >
                  <span aria-hidden>{item.emoji}</span>
                  {item.label}
                  <span aria-hidden className="ml-1 text-slate-900/40">
                    ✦
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

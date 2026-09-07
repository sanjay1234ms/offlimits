import Link from "next/link";
import {
  ArrowRight,
  Dices,
  Globe2,
  ListChecks,
  Sparkles,
  Ticket,
  Type,
  Users,
} from "lucide-react";
import { SectionHeading } from "./SectionHeading";

interface PickerCard {
  title: string;
  blurb: string;
  href: string;
  Icon: typeof Dices;
  border: string;
  grad: string;
  text: string;
}

const PICKERS: PickerCard[] = [
  {
    title: "Spin the Wheel",
    blurb: "Add anything, spin, let it decide.",
    href: "/wheel",
    Icon: Dices,
    border: "border-purple-500/40",
    grad: "from-purple-600/20 to-violet-600/10",
    text: "text-purple-300",
  },
  {
    title: "Random Name Picker",
    blurb: "Draw a name from your custom list, no repeats.",
    href: "/pickers/name",
    Icon: Sparkles,
    border: "border-teal-500/40",
    grad: "from-teal-600/20 to-cyan-600/10",
    text: "text-teal-300",
  },
  {
    title: "Team Generator",
    blurb: "Split any group into fair teams automatically.",
    href: "/pickers/teams",
    Icon: Users,
    border: "border-lime-500/40",
    grad: "from-lime-600/20 to-green-600/10",
    text: "text-lime-300",
  },
  {
    title: "Scavenger Hunt",
    blurb: "Pick a pack, get a checklist, tick things off.",
    href: "/pickers/scavenger",
    Icon: ListChecks,
    border: "border-green-500/40",
    grad: "from-green-500/20 to-emerald-600/10",
    text: "text-green-300",
  },
  {
    title: "Raffle",
    blurb: "Draw prize winners from any list, tickets and all.",
    href: "/pickers/raffle",
    Icon: Ticket,
    border: "border-yellow-500/40",
    grad: "from-yellow-500/20 to-amber-600/10",
    text: "text-yellow-300",
  },
  {
    title: "Random Word Generator",
    blurb: "Words to draw, act, describe, or write about.",
    href: "/pickers/word",
    Icon: Type,
    border: "border-sky-500/40",
    grad: "from-sky-600/20 to-blue-600/10",
    text: "text-sky-300",
  },
  {
    title: "Random Country",
    blurb: "Draw a country with its flag, capital, and region.",
    href: "/pickers/country",
    Icon: Globe2,
    border: "border-blue-500/40",
    grad: "from-blue-600/20 to-indigo-600/10",
    text: "text-blue-300",
  },
];

/** Homepage "Random pickers" utility-tool grid. */
export function RandomPickers() {
  return (
    <section className="mx-auto max-w-content px-4 py-10 sm:px-6">
      <SectionHeading
        title="Random pickers"
        subtitle="For when something has to be chosen and nobody wants to be blamed for it."
      />
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PICKERS.map((picker) => (
          <Link
            key={picker.title}
            href={picker.href}
            className={`tactile-card group flex flex-col gap-3 rounded-3xl border-2 bg-gradient-to-br p-5 transition-transform duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.02] ${picker.border} ${picker.grad}`}
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15 transition-transform duration-300 group-hover:scale-110">
              <picker.Icon className={`h-5 w-5 ${picker.text}`} aria-hidden />
            </span>
            <div>
              <h3 className="text-base font-extrabold tracking-tight text-foreground">
                {picker.title}
              </h3>
              <p className="mt-1 text-sm leading-snug text-muted">
                {picker.blurb}
              </p>
            </div>
            <span
              className={`mt-auto inline-flex items-center gap-1 pt-1 text-xs font-bold ${picker.text}`}
            >
              Open
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import {
  AUDIENCE_OPTIONS,
  GROUP_SIZE_OPTIONS,
  VIBE_OPTIONS,
  emptyCatalogFilters,
  filterCatalog,
  type CatalogFilters,
} from "@/data/catalog";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/monetization";
import { GROUP_SIZE_TO_COUNT } from "@/data/competitive";
import { AgeGateModal } from "./AgeGateModal";
import { CatalogCard } from "./CatalogCard";

function activeCount(f: CatalogFilters): number {
  return f.groupSize.length + f.audience.length + f.vibe.length;
}

/** The "What kind of game do you need?" selection screen, filterable game
 * catalog with a strict 18+ age gate. */
export function GameBrowser() {
  const [filters, setFilters] = useState<CatalogFilters>(emptyCatalogFilters);
  const [ageConfirmed, setAgeConfirmed] = useLocalStorage(
    STORAGE_KEYS.ageConfirmed,
    false,
  );
  const [ageGateOpen, setAgeGateOpen] = useState(false);

  const adultActive = filters.audience.includes("18+");
  const visible = useMemo(() => filterCatalog(filters), [filters]);

  // A group-size filter seeds the competitive game's default player count.
  const seedCount = filters.groupSize.length
    ? Math.min(...filters.groupSize.map((g) => GROUP_SIZE_TO_COUNT[g] ?? 4))
    : null;

  function toggle<K extends keyof CatalogFilters>(
    group: K,
    value: CatalogFilters[K][number],
  ) {
    const list = filters[group] as string[];
    const turningOn = !list.includes(value as string);

    // Strict gate: never apply the 18+ pill before age confirmation.
    if (group === "audience" && value === "18+" && turningOn && !ageConfirmed) {
      setAgeGateOpen(true);
      return;
    }

    setFilters((prev) => {
      const current = prev[group] as string[];
      const next = current.includes(value as string)
        ? current.filter((v) => v !== value)
        : [...current, value as string];
      return { ...prev, [group]: next } as CatalogFilters;
    });
  }

  function confirmAge() {
    setAgeConfirmed(true);
    setAgeGateOpen(false);
    setFilters((prev) =>
      prev.audience.includes("18+")
        ? prev
        : { ...prev, audience: [...prev.audience, "18+"] },
    );
  }

  function cancelAge() {
    setAgeGateOpen(false);
    // Stay in clean mode, make sure 18+ is not applied.
    setFilters((prev) => ({
      ...prev,
      audience: prev.audience.filter((a) => a !== "18+"),
    }));
  }

  return (
    <div>
      <div className="mt-6 flex flex-col gap-4 rounded-3xl border-2 border-white/10 bg-white/[0.03] p-4 backdrop-blur sm:p-5">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-foreground">
            <SlidersHorizontal className="h-4 w-4 text-accent" aria-hidden />
            Filters
            <span className="font-semibold text-muted">
              · {visible.length} {visible.length === 1 ? "game" : "games"}
            </span>
          </span>
          {activeCount(filters) > 0 ? (
            <button
              type="button"
              onClick={() => setFilters(emptyCatalogFilters)}
              className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-bold text-muted transition-colors hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
              Clear
            </button>
          ) : null}
        </div>

        <FilterRow label="Group size">
          {GROUP_SIZE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className="filter-chip"
              aria-pressed={filters.groupSize.includes(opt.value)}
              onClick={() => toggle("groupSize", opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </FilterRow>

        <FilterRow label="Who's playing">
          {AUDIENCE_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`filter-chip${opt === "18+" ? " is-adult" : ""}`}
              aria-pressed={filters.audience.includes(opt)}
              onClick={() => toggle("audience", opt)}
            >
              {opt}
            </button>
          ))}
        </FilterRow>

        <FilterRow label="Vibe">
          {VIBE_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              className="filter-chip"
              aria-pressed={filters.vibe.includes(opt)}
              onClick={() => toggle("vibe", opt)}
            >
              {opt}
            </button>
          ))}
        </FilterRow>
      </div>

      {adultActive ? (
        <p className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-red-500/50 bg-red-950/40 px-3.5 py-1.5 text-xs font-bold text-red-300 shadow-[0_0_18px_rgba(239,68,68,0.35)]">
          18+ mode, 3 free preview cards per game, then unlock.
        </p>
      ) : null}

      {visible.length === 0 ? (
        <div className="mt-8 rounded-3xl border-2 border-dashed border-white/15 bg-white/[0.02] p-10 text-center">
          <p className="text-lg font-bold text-foreground">
            No games match that combination
          </p>
          <button
            type="button"
            onClick={() => {
              setFilters(emptyCatalogFilters);
            }}
            className="btn-primary mt-4"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((game) => {
            const asAdult = adultActive && game.dualDeck;
            const href = asAdult
              ? `/play?game=${game.slug}&adult=1`
              : game.competitive && seedCount
                ? `${game.href}?players=${seedCount}`
                : undefined;
            return (
              <CatalogCard
                key={game.slug}
                game={game}
                href={href}
                ctaLabel={asAdult ? "Play 18+ deck" : undefined}
              />
            );
          })}
        </div>
      )}

      <AgeGateModal
        open={ageGateOpen}
        onConfirm={confirmAge}
        onCancel={cancelAge}
      />
    </div>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-subtle">
        {label}
      </span>
      <div className="-mx-1 flex flex-1 gap-2 overflow-x-auto px-1 pb-1 no-scrollbar sm:flex-wrap sm:overflow-visible">
        {children}
      </div>
    </div>
  );
}

import Link from "next/link";
import { SectionHeading } from "./SectionHeading";
import { WHEEL_PRESET_LIST } from "@/data/wheelPresets";

/** Homepage "Ready-made wheels" pill cloud, each routes to /wheel?preset=… */
export function ReadyMadeWheels() {
  return (
    <section className="mx-auto max-w-content px-4 py-10 sm:px-6">
      <SectionHeading
        title="Ready-made wheels"
        subtitle="One tap and the wheel is loaded and ready to spin."
      />
      <div className="mt-5 flex flex-wrap gap-2.5">
        {WHEEL_PRESET_LIST.map((preset) => (
          <Link
            key={preset.slug}
            href={`/wheel?preset=${preset.slug}`}
            className="rounded-full border-2 border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-foreground backdrop-blur transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 hover:border-accent hover:bg-white/10"
          >
            {preset.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

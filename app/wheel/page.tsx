import type { Metadata } from "next";
import { GameGuide, SpinWheel } from "@/components";
import { WHEEL_PRESETS } from "@/data/wheelPresets";

interface WheelPageProps {
  searchParams?: { preset?: string };
}

export const metadata: Metadata = {
  title: "Spin the Wheel",
  description:
    "Type in names or options, spin the wheel, and watch it decelerate to a random winner.",
};

export default function WheelPage({ searchParams }: WheelPageProps) {
  const preset = searchParams?.preset
    ? WHEEL_PRESETS[searchParams.preset]
    : undefined;

  return (
    <div className="min-h-dvh bg-background pb-24">
      <div className="mx-auto max-w-content px-4 pt-8 sm:px-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Spin the Wheel
        </h1>
        <p className="mt-1.5 max-w-xl text-sm text-muted sm:text-base">
          Add names or options, give it a spin, and let the wheel pick. Great
          for deciding who goes first, what to eat, or who is buying the next
          round.
        </p>

        <div className="mt-8">
          <SpinWheel
            initialOptions={preset?.options}
            initialTitle={preset?.label}
          />
        </div>
      </div>

      <GameGuide slug="wheel" />
    </div>
  );
}

import type { Metadata } from "next";
import { SecretSantaReveal } from "@/components/SecretSantaReveal";

export const metadata: Metadata = {
  title: { absolute: "Your Secret Santa | OffLimits" },
  description: "Tap your name to see who you're buying for.",
  // Every draw lives in the link's #hash, so this URL alone is an empty shell.
  robots: { index: false, follow: true },
};

export default function SecretSantaDrawPage() {
  return (
    <div className="min-h-dvh bg-background px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
      <SecretSantaReveal />
    </div>
  );
}

import type { Metadata } from "next";
import { SantaGroupPage } from "@/components/SantaOnline";

export const metadata: Metadata = {
  title: { absolute: "Your Secret Santa | OffLimits" },
  description: "Tap your name to see who you're buying for.",
  robots: { index: false, follow: false },
};

export default function SantaGroupRoute({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-dvh bg-background px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
      <SantaGroupPage id={params.id} />
    </div>
  );
}

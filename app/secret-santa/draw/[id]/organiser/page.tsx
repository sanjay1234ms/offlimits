import type { Metadata } from "next";
import { SantaOrganiserPage } from "@/components/SantaOnline";

export const metadata: Metadata = {
  title: { absolute: "Secret Santa organiser | OffLimits" },
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function SantaOrganiserRoute({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-dvh bg-background px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
      <SantaOrganiserPage id={params.id} />
    </div>
  );
}

import type { Metadata } from "next";
import { PoolPlay } from "@/components/party/PredictionPool";

export const metadata: Metadata = {
  title: { absolute: "Baby prediction pool | OffLimits" },
  description: "Add your guesses and see who wins after the big day.",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function PoolRoute({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-dvh bg-background px-4 pb-24 pt-8 sm:px-6 sm:pt-12">
      <PoolPlay id={params.id} />
    </div>
  );
}

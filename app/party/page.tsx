import type { Metadata } from "next";
import { PartyForm, PartyInfo } from "@/components";

export const metadata: Metadata = {
  title: "Party room",
  description:
    "Open a room, put the code on the biggest screen in the house, and everyone joins on their own phone. The room sees the question. Only you see your answer.",
};

export default function PartyPage() {
  return (
    <div className="min-h-dvh bg-background pb-24">
      <div className="mx-auto max-w-content px-4 pt-10 sm:px-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Party room
        </h1>
        <p className="mt-3 max-w-2xl text-pretty text-base text-muted sm:text-lg">
          Open a room, put the code on the biggest screen in the house, and
          everyone joins on their own phone. The room sees the question. Only
          you see your answer.
        </p>

        <div className="mt-8">
          <PartyForm />
        </div>

        <PartyInfo />
      </div>
    </div>
  );
}

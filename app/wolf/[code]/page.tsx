import type { Metadata } from "next";
import Link from "next/link";
import { WolfRoom } from "@/components/werewolf/WolfRoom";

export const metadata: Metadata = {
  title: { absolute: "Join my Werewolf game | OffLimits" },
  description: "You've been invited to a game of Werewolf. Open the link, add your name and get your secret role.",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function WolfRoomRoute({ params }: { params: { code: string } }) {
  return (
    <div className="min-h-dvh bg-background px-3 pb-24 pt-6 sm:px-6 sm:pt-10">
      <div className="mx-auto max-w-3xl">
        <WolfRoom code={params.code.toLowerCase()} />
        <p className="mt-4 text-center text-xs text-muted">
          New to the game?{" "}
          <Link href="/werewolf-game" className="font-bold text-accent hover:underline">
            How to play Werewolf
          </Link>
        </p>
      </div>
    </div>
  );
}

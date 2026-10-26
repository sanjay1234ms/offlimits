import type { Metadata } from "next";
import { QuizPlay } from "@/components/party/KnowQuiz";

export const metadata: Metadata = {
  title: { absolute: "How well do you know them? | OffLimits" },
  description: "Take the quiz and see where you land on the leaderboard.",
  robots: { index: false, follow: false },
};

export default function QuizRoute({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-dvh bg-background px-4 pb-24 pt-8 sm:px-6 sm:pt-12">
      <QuizPlay id={params.id} />
    </div>
  );
}

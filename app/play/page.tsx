import type { Metadata } from "next";
import { PlayScreen } from "@/components";

export const metadata: Metadata = {
  title: "Pass-the-Phone Party Games",
  description:
    "Would You Rather, Never Have I Ever, Most Likely To, Truth or Dare and This or That in one place. Free on any phone, no signup.",
  alternates: { canonical: "/play" },
};

interface PlayPageProps {
  searchParams?: {
    game?: string;
    adult?: string;
    category?: string;
    vibe?: string;
  };
}

export default function PlayPage({ searchParams }: PlayPageProps) {
  return (
    <PlayScreen
      initialGame={searchParams?.game}
      initialAdult={searchParams?.adult === "1"}
      initialCategory={searchParams?.category}
      initialVibe={searchParams?.vibe}
    />
  );
}

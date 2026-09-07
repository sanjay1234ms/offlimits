import { PlayScreen } from "@/components";

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

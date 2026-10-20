import type { Metadata } from "next";
import { shareMetadata } from "@/lib/seo";
import { PlayScreen } from "@/components";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/site";

const TITLE = "Pass-the-Phone Party Games: Free Question Games";
const DESCRIPTION =
  "Would You Rather, Never Have I Ever, Most Likely To, Truth or Dare and This or That in one place. Filter by group and vibe, pass the phone. Free, no signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/play" },
  ...shareMetadata(TITLE, DESCRIPTION, "/play"),
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
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Play", path: "/play" }])} />
      <PlayScreen
        initialGame={searchParams?.game}
        initialAdult={searchParams?.adult === "1"}
        initialCategory={searchParams?.category}
        initialVibe={searchParams?.vibe}
      />
    </>
  );
}

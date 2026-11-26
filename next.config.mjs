/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Occasion decks that duplicated stronger landing pages.
      {
        source: "/occasions/office-party",
        destination: "/office-party-games",
        permanent: true,
      },
      {
        source: "/occasions/date-night",
        destination: "/couples-games",
        permanent: true,
      },
      {
        source: "/occasions/holidays",
        destination: "/christmas-party-games",
        permanent: true,
      },
      { source: "/occasions/game-night", destination: "/games", permanent: true },
      { source: "/occasions/birthday", destination: "/birthday-party-games", permanent: true },
      // Old query-string wheel links now have their own pages (/wheel/<slug>).
      {
        source: "/wheel",
        has: [{ type: "query", key: "preset", value: "(?<preset>yes-or-no|what-should-i-eat|truth-or-dare|random-number-1-100|heads-or-tails|what-should-i-watch|who-goes-first|random-letter|would-you-rather|date-night-ideas|chore-wheel|workout-wheel|what-to-do-when-bored)" }],
        destination: "/wheel/:preset",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

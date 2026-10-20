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
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Sanity-Bilder laufen durch /_next/image und werden dadurch von der eigenen Domain
    // ausgeliefert — im Browser entsteht keine Verbindung zu cdn.sanity.io.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
    formats: ["image/avif", "image/webp"],
  },

  // Die Adressen der alten WordPress-Seite bleiben erreichbar.
  async redirects() {
    return [
      { source: "/dokumente", destination: "/verein", permanent: true },
      { source: "/vereinssatzung-und-ordnungen", destination: "/verein#dokumente", permanent: true },
      { source: "/dokumente/mitglied-werden", destination: "/mitglied-werden", permanent: true },
      // Die FAQ gibt es nicht mehr; die Seite beantwortet das im Ablauf.
      { source: "/faq", destination: "/mitglied-werden", permanent: true },
      { source: "/trainingsstatte", destination: "/trainingsstaette", permanent: true },
      { source: "/kontakt/coaches-im-verein", destination: "/team#coaches", permanent: true },
      { source: "/kontakt/aemter-im-verein", destination: "/team", permanent: true },
      { source: "/kontakt/impressum", destination: "/impressum", permanent: true },
      { source: "/kontakt/datenschutzerklarung", destination: "/datenschutz", permanent: true },
      { source: "/neuigkeiten", destination: "/news", permanent: true },
      { source: "/neuigkeiten/2025-2", destination: "/news#2025", permanent: true },
      { source: "/neuigkeiten/2024-2", destination: "/news#2024", permanent: true },
      { source: "/neuigkeiten/2023-2", destination: "/news#2023", permanent: true },
      { source: "/neuigkeiten/2022-2", destination: "/news#2022", permanent: true },
      { source: "/neuigkeiten/2021-2", destination: "/news#2021", permanent: true },
      // WordPress lieferte die Beiträge direkt unter der Wurzel aus.
      { source: "/:slug(q[1-4]-20\\d\\d)", destination: "/news/:slug", permanent: true },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;

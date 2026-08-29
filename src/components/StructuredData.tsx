import type { Settings } from "@/lib/types";

/**
 * Strukturierte Daten für Suchmaschinen. Statisch gerendert, kein externes Skript —
 * der JSON-LD-Block ist reiner Text im HTML.
 */
export function SportsClubSchema({ settings }: { settings: Settings }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "SportsClub",
    name: settings.clubName,
    alternateName: settings.shortName,
    description: settings.intro,
    url: "https://schwerathletik-mannheim.de",
    logo: "https://schwerathletik-mannheim.de/img/brand/logo-bildmarke.png",
    foundingDate: String(settings.founded),
    sport: ["Kraftdreikampf", "Gewichtheben"],
    email: settings.emails[0]?.address,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address.street,
      postalCode: settings.address.zip,
      addressLocality: settings.address.city,
      addressCountry: "DE",
    },
    location: {
      "@type": "Place",
      name: settings.gym.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: settings.gym.street,
        postalCode: settings.gym.zip,
        addressLocality: settings.gym.city,
        addressCountry: "DE",
      },
    },
    sameAs: settings.social.map((s) => s.url),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

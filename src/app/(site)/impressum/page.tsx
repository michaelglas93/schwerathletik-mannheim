import type { Metadata } from "next";

import { PageHeader, Section } from "@/components/ui";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum der Schwerathletik Mannheim 2018 e.V.",
  robots: { index: false },
};

export default async function ImpressumPage() {
  const settings = await getSettings();
  const vorstand = settings.emails.find((m) => m.label === "Vorstand")?.address;

  return (
    <>
      <PageHeader eyebrow="Rechtliches" title="Impressum" />

      <Section>
        <div className="max-w-2xl space-y-10">
          <div>
            <h2 className="text-xl">Angaben gemäß § 5 TMG</h2>
            <address className="prose-club mt-4 not-italic">
              {settings.clubName}
              <br />
              {settings.address.co}
              <br />
              {settings.address.street}
              <br />
              {settings.address.zip} {settings.address.city}
            </address>
          </div>

          <div>
            <h2 className="text-xl">Register</h2>
            <p className="prose-club mt-4">
              Vereinsregister: {settings.register.number}
              <br />
              Registergericht: {settings.register.court}
            </p>
          </div>

          <div>
            <h2 className="text-xl">Vertreten durch</h2>
            <ul className="prose-club mt-4 space-y-1">
              {settings.board.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl">Kontakt</h2>
            <p className="prose-club mt-4">
              E-Mail: <a href={`mailto:${vorstand}`}>{vorstand}</a>
            </p>
          </div>

          <div>
            <h2 className="text-xl">Verantwortlich für den Inhalt</h2>
            <p className="prose-club mt-4">
              Der geschäftsführende Vorstand, Anschrift wie oben.
            </p>
          </div>

          <div>
            <h2 className="text-xl">Bildnachweis</h2>
            <p className="prose-club mt-4">
              Sämtliche Fotos stammen aus dem Vereinsarchiv und von Wettkämpfen, an denen
              Mitglieder teilgenommen haben.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}

import type { Metadata } from "next";

import { PageHeader, Section } from "@/components/ui";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum der Schwerathletik Mannheim 2018 e.V.",
};

export default async function ImpressumPage() {
  const settings = await getSettings();
  const vorstand = settings.emails.find((m) => m.label === "Vorstand")?.address;
  // § 18 Abs. 2 MStV verlangt für den redaktionellen Teil — hier die News — eine
  // benannte natürliche Person mit Anschrift. Das ist der oder die 1. Vorsitzende.
  const verantwortlich = settings.board[0];

  return (
    <>
      <PageHeader eyebrow="Rechtliches" title="Impressum" />

      <Section>
        <div className="max-w-2xl space-y-10">
          <div>
            <h2 className="text-xl">Angaben gemäß § 5 DDG</h2>
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
            <h2 className="text-xl">
              Redaktionell verantwortlich nach § 18 Abs. 2 MStV
            </h2>
            <address className="prose-club mt-4 not-italic">
              {verantwortlich}
              <br />
              {settings.clubName}
              <br />
              {settings.address.street}
              <br />
              {settings.address.zip} {settings.address.city}
            </address>
          </div>

          <div>
            <h2 className="text-xl">Bildnachweis</h2>
            <p className="prose-club mt-4">
              Die Fotos stammen aus dem Vereinsarchiv sowie von Wettkämpfen, an denen
              Mitglieder teilgenommen haben. Wer meint, dass ein Bild seine Rechte
              verletzt, schreibt uns bitte an <a href={`mailto:${vorstand}`}>{vorstand}</a> —
              wir nehmen es dann umgehend herunter.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}

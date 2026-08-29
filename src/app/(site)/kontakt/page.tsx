import type { Metadata } from "next";

import { ArrowUpRight, Button, PageHeader, Section, SectionHeading } from "@/components/ui";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Kontakt zur Schwerathletik Mannheim 2018 e.V. — Vorstand, Abteilungen Kraftdreikampf " +
    "und Gewichtheben, Schlichtung, Anschrift und Social Media.",
};

export default async function KontaktPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHeader
        eyebrow="Kontakt"
        title="Schreib uns"
        lead="Für ein Probetraining wendest du dich am besten direkt an die Abteilung, die dich interessiert. Alles andere beantwortet der Vorstand."
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div>
            <h2 className="text-xl">E-Mail</h2>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {settings.emails.map((mail) => (
                <li key={mail.address}>
                  <a
                    href={`mailto:${mail.address}`}
                    className="group flex items-center justify-between gap-6 py-5 transition-colors hover:text-accent-hot"
                  >
                    <span>
                      <span className="block text-xs uppercase tracking-[0.14em] text-faint">
                        {mail.label}
                      </span>
                      <span className="mt-1 block font-display text-lg uppercase tracking-[0.02em]">
                        {mail.address}
                      </span>
                    </span>
                    <ArrowUpRight className="size-4 shrink-0 text-accent" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-12">
            <div>
              <h2 className="text-xl">Anschrift</h2>
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
              <h2 className="text-xl">Trainingsstätte</h2>
              <address className="prose-club mt-4 not-italic">
                {settings.gym.name}
                <br />
                {settings.gym.street}
                <br />
                {settings.gym.zip} {settings.gym.city}
              </address>
              <p className="mt-3 text-sm text-faint">
                Probetraining nur nach vorheriger Vereinbarung.
              </p>
            </div>

            <div>
              <h2 className="text-xl">Social Media</h2>
              <ul className="mt-4 space-y-2">
                {settings.social.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-accent-hot"
                    >
                      {s.label}
                      <ArrowUpRight className="size-3" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading
          eyebrow="Weiterführend"
          title="Vielleicht suchst du das"
          lead="Die häufigsten Anliegen stehen schon auf der Seite."
        />
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="/mitglied-werden" variant="outline">
            Mitglied werden
          </Button>
          <Button href="/mitglied-werden#faq" variant="outline">
            Häufige Fragen
          </Button>
          <Button href="/team" variant="outline">
            Ämter und Coaches
          </Button>
          <Button href="/verein#dokumente" variant="outline">
            Satzung und Ordnungen
          </Button>
        </div>
      </Section>
    </>
  );
}

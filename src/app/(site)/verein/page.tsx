import type { Metadata } from "next";

import { ArrowUpRight, Button, PageHeader, Section, SectionHeading } from "@/components/ui";
import { getDocuments, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Verein",
  description:
    "Schwerathletik Mannheim 2018 e.V. — Förderung des Kraftsports, eigene Trainingsstätte " +
    "seit 2021, Mitglied im BWG und BVDK. Satzung und Ordnungen zum Nachlesen.",
};

export default async function VereinPage() {
  const [settings, documents] = await Promise.all([getSettings(), getDocuments()]);

  const timeline = [
    {
      year: settings.founded,
      title: "Gründung",
      text: "Der Verein wird als Schwerathletik Mannheim 2018 e.V. ins Vereinsregister eingetragen.",
    },
    {
      year: settings.gymSince,
      title: "Eigene Trainingsstätte",
      text: `In Zusammenarbeit mit dem SKV Sandhofen entsteht in einer der Hallen eine eigene Trainingsstätte — Racks, Hebeplattformen, Wettkampfbank.`,
    },
    {
      year: 2023,
      title: "Eigene Wettkämpfe",
      text: "Seither richten wir in der Halle regelmäßig Wettkämpfe aus, darunter den Nordbaden Cup.",
    },
  ];

  return (
    <>
      <PageHeader eyebrow="Der Verein" title="Wer wir sind" lead={settings.intro} />

      <Section>
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div className="prose-club space-y-5">
            <p>
              Der Verein wurde {settings.founded} gegründet. Seit {settings.gymSince} haben wir
              eine eigene Trainingsstätte beim SKV Sandhofen. Neben dem Training der Mitglieder
              nutzen wir sie auch zum Ausrichten von Wettkämpfen.
            </p>
            <p>{settings.introSecond}</p>
            <p>
              Auch die Suche und Förderung von Talenten sind Teil des Vereins — genauso wie das
              gemeinsame Wettkampfwochenende, bei dem am Ende alle mit anpacken.
            </p>
          </div>

          <ol className="relative space-y-9 border-l border-line pl-8">
            {timeline.map((entry) => (
              <li key={entry.year} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-[2.06rem] top-2 h-0.5 w-4 bg-accent"
                  style={{ transform: "skewX(var(--skew-brand))" }}
                />
                <p className="font-display text-3xl font-semibold leading-none text-accent">
                  {entry.year}
                </p>
                <h3 className="mt-2 text-lg">{entry.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{entry.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* Verbände und Partner */}
      <Section tone="surface">
        <SectionHeading
          eyebrow="Verbände & Partner"
          title="Wo wir angebunden sind"
          lead="Über unsere Verbandsmitgliedschaft können Mitglieder bei offiziellen Wettkämpfen starten."
        />
        <ul className="mt-12 grid gap-px bg-line md:grid-cols-3">
          {settings.partners.map((partner) => (
            <li key={partner.url} className="bg-surface p-8">
              <a
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 font-display text-xl uppercase transition-colors hover:text-accent-hot"
              >
                {partner.label}
                <ArrowUpRight className="size-3.5 text-accent" />
              </a>
              <p className="mt-3 text-sm leading-relaxed text-muted">{partner.note}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Dokumente */}
      <Section id="dokumente">
        <SectionHeading
          eyebrow="Satzung & Ordnungen"
          title="Vereinsdokumente"
          lead="Hier findest du alle relevanten Dokumente rund um unseren Verein."
        />
        <ul className="mt-12 divide-y divide-line border-y border-line">
          {documents.map((doc) => (
            <li key={doc._id}>
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-6 py-5 transition-colors hover:text-accent-hot"
              >
                <span>
                  <span className="font-display text-lg uppercase tracking-[0.03em]">
                    {doc.title}
                  </span>
                  {doc.subtitle && (
                    <span className="mt-0.5 block text-sm text-faint">{doc.subtitle}</span>
                  )}
                </span>
                <ArrowUpRight className="size-4 shrink-0 text-accent" />
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-faint">
          Die Dokumente liegen derzeit in Google Drive und öffnen sich in einem neuen Tab.
        </p>

        <div className="mt-12 flex flex-wrap gap-3">
          <Button href="/mitglied-werden">Mitglied werden</Button>
          <Button href="/team" variant="outline">
            Ämter und Coaches
          </Button>
        </div>
      </Section>
    </>
  );
}

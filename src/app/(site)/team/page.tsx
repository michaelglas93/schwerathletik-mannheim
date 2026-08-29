import type { Metadata } from "next";

import { PersonCard } from "@/components/PersonCard";
import { PageHeader, Section, SectionHeading } from "@/components/ui";
import { byDepartment, getPeople, getSettings } from "@/lib/content";
import type { Department } from "@/lib/types";

export const metadata: Metadata = {
  title: "Team",
  description:
    "Vorstand, Abteilungsleitungen, Schlichtung und die Coaches der Schwerathletik " +
    "Mannheim 2018 e.V.",
};

const GROUPS: {
  id: string;
  department: Department;
  title: string;
  email?: string;
  lead?: string;
}[] = [
  {
    id: "vorstand",
    department: "vorstand",
    title: "Geschäftsführender Vorstand",
    email: "vorstand@schwerathletik-mannheim.de",
  },
  {
    id: "gewichtheben",
    department: "gewichtheben",
    title: "Abteilung Gewichtheben",
    email: "gewichtheben@schwerathletik-mannheim.de",
  },
  {
    id: "kdk",
    department: "kdk",
    title: "Abteilung Kraftdreikampf",
    email: "kdk@schwerathletik-mannheim.de",
  },
  {
    id: "schlichtung",
    department: "schlichtung",
    title: "Schlichtung",
    email: "schlichtung@schwerathletik-mannheim.de",
  },
];

export default async function TeamPage() {
  const [people, settings] = await Promise.all([getPeople(), getSettings()]);
  const coaches = byDepartment(people, "coach");

  return (
    <>
      <PageHeader
        eyebrow="Kontakt"
        title="Ämter und Coaches"
        lead="Der Vorstand, die Abteilungsleitungen und die Coaches, die im Verein trainieren und betreuen."
      />

      {GROUPS.map((group, i) => {
        const members = byDepartment(people, group.department);
        if (!members.length) return null;

        return (
          <Section key={group.id} id={group.id} tone={i % 2 === 0 ? "ink" : "surface"}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="brand-rule text-[clamp(1.5rem,3vw,2.1rem)] leading-tight">
                {group.title}
              </h2>
              {group.email && (
                <a
                  href={`mailto:${group.email}`}
                  className="text-sm text-muted transition-colors hover:text-accent-hot"
                >
                  {group.email}
                </a>
              )}
            </div>
            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {members.map((person) => (
                <PersonCard key={person._id} person={person} />
              ))}
            </div>
          </Section>
        );
      })}

      <Section id="coaches" tone="charcoal">
        <SectionHeading
          eyebrow="Coaching"
          title="Coaches im Verein"
          lead={
            <>
              Innerhalb des Vereins arbeiten mehrere Coaches nach unterschiedlichen Konzepten
              und bieten unter anderem Online-Coaching für Training und Ernährung sowie
              Personaltraining an. Für Vereinsmitglieder gelten vergünstigte Konditionen.
            </>
          }
        />
        <p className="prose-club mt-5 max-w-3xl">
          Hauptsächlich vertreten unsere Coaches den Bereich Kraftdreikampf. Mit Stani haben
          wir zusätzlich einen sehr engagierten Coach für das olympische Gewichtheben an
          unserer Seite. Details zu Konzept und Angebot stehen in den Steckbriefen — oder du
          schreibst direkt der Abteilung.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {coaches.map((person) => (
            <PersonCard key={person._id} person={person} />
          ))}
        </div>

        <ul className="mt-12 flex flex-wrap gap-x-10 gap-y-3">
          {settings.emails
            .filter((m) => m.label.startsWith("Abteilung"))
            .map((mail) => (
              <li key={mail.address}>
                <a
                  href={`mailto:${mail.address}`}
                  className="text-sm text-muted transition-colors hover:text-accent-hot"
                >
                  <span className="block text-[0.6875rem] uppercase tracking-[0.12em] text-faint">
                    {mail.label}
                  </span>
                  {mail.address}
                </a>
              </li>
            ))}
        </ul>
      </Section>
    </>
  );
}

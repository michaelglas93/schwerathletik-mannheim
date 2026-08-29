import type { Metadata } from "next";

import { Gallery } from "@/components/Gallery";
import { Button, PageHeader, Section, SectionHeading } from "@/components/ui";
import { getGallery, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Trainingsstätte",
  description:
    "Unsere Trainingsstätte in der Halle des SKV Sandhofen: Racks, Hebeplattformen, " +
    "Wettkampfbank und Freihantelbereich in Mannheim-Sandhofen.",
};

const EQUIPMENT = [
  "3 Racks",
  "1 Wettkampfbank",
  "Je 2 Flach- und Schrägbänke",
  "Hebeplattformen",
  "Wettkampf- und Trainingshanteln",
  "Reichlich Scheibengewicht",
];

export default async function TrainingsstaettePage() {
  const [gallery, settings] = await Promise.all([getGallery(), getSettings()]);

  return (
    <>
      <PageHeader
        eyebrow="Trainingsstätte"
        title="Unsere Halle in Sandhofen"
        lead={`Seit ${settings.gymSince} betreiben wir gemeinsam mit dem SKV Sandhofen eine eigene Trainingsstätte. Der Bereich der Schwerathletik ist genau auf unsere Bedürfnisse ausgestattet — daneben liegt der Fitnessbereich des SKV mit Maschinen und Kabelzügen.`}
      />

      <Section>
        <div className="grid gap-12 md:grid-cols-3 md:gap-10">
          <div>
            <h2 className="text-xl">Adresse</h2>
            <address className="prose-club mt-4 not-italic">
              {settings.gym.name}
              <br />
              {settings.gym.street}
              <br />
              {settings.gym.zip} {settings.gym.city}
            </address>
          </div>

          <div>
            <h2 className="text-xl">Zugang</h2>
            <p className="prose-club mt-4">
              Mitglieder kommen per App in die Halle. Für ein Probetraining meldest du dich
              vorher bei uns, damit jemand vor Ort ist und dir alles zeigt. Probetrainings sind
              nur nach vorheriger Vereinbarung möglich.
            </p>
          </div>

          <div>
            <h2 className="text-xl">Ausstattung</h2>
            <ul className="mt-4 space-y-2">
              {EQUIPMENT.map((item) => (
                <li
                  key={item}
                  className="relative pl-5 text-[0.9375rem] leading-relaxed text-muted before:absolute before:left-0 before:top-[0.7em] before:h-[3px] before:w-2.5 before:bg-accent before:content-['']"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Button href="/mitglied-werden" className="mt-12">
          Probetraining vereinbaren
        </Button>
      </Section>

      <Section tone="surface">
        <SectionHeading
          eyebrow="Galerie"
          title="Ein Blick in die Halle"
          lead={`${gallery.length} Aufnahmen aus unserer Trainingsstätte.`}
        />
        <div className="mt-12">
          <Gallery images={gallery} />
        </div>
      </Section>
    </>
  );
}

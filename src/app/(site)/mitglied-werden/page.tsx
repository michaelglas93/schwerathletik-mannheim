import type { Metadata } from "next";

import { Accordion } from "@/components/Accordion";
import { ArrowUpRight, Button, PageHeader, Section, SectionHeading } from "@/components/ui";
import { getFaq, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Mitglied werden",
  description:
    "Probetraining, Aufnahmeantrag und Beiträge der Schwerathletik Mannheim 2018 e.V. " +
    "Anfänger sind ausdrücklich willkommen.",
};

export default async function MitgliedWerdenPage() {
  const [settings, faq] = await Promise.all([getSettings(), getFaq()]);

  const steps = [
    {
      title: "Probetraining vereinbaren",
      text:
        "Schreib der Abteilung, die dich interessiert. Probetrainings finden ausschließlich " +
        "nach Vereinbarung statt, damit jemand vor Ort ist und dir die Übungen zeigt.",
      action: { label: "Kraftdreikampf", href: "mailto:kdk@schwerathletik-mannheim.de" },
      action2: { label: "Gewichtheben", href: "mailto:gewichtheben@schwerathletik-mannheim.de" },
    },
    {
      title: "Aufnahmeantrag ausfüllen",
      text:
        "Hat es gepasst, füllst du den Aufnahmeantrag online aus. Das dauert ein paar Minuten " +
        "und läuft über DocuSeal.",
      action: { label: "Aufnahmeantrag öffnen", href: settings.membershipFormUrl, external: true },
    },
    {
      title: "Mitglied im SKV Sandhofen werden",
      text:
        "Unsere Trainingsstätte läuft in Kooperation mit dem Partnerverein SKV Sandhofen. Um " +
        "sie zu nutzen, wirst du zusätzlich dort Mitglied — relevant sind die Abteilungen " +
        "„Schwerathletik“ und „SKVfit“.",
      action: { label: "Zur SKV-Mitgliedschaft", href: settings.skvMembershipUrl, external: true },
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Mitgliedschaft"
        title="So wirst du Mitglied"
        lead="Bei uns kann jeder Mitglied werden, der Interesse am Kraftsport hat. Auch Anfänger sind herzlich willkommen — wichtiger als dein Leistungsstand ist deine Bereitschaft, am Vereinsleben teilzunehmen und mitzuhelfen."
      />

      {/* Ablauf */}
      <Section>
        <SectionHeading eyebrow="Ablauf" title="In drei Schritten" />
        <ol className="mt-12 grid gap-px bg-line lg:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title} className="flex flex-col bg-ink p-8">
              <span className="font-display text-5xl font-semibold leading-none text-line-strong">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-xl leading-tight">{step.title}</h3>
              <p className="prose-club mt-3 flex-1">{step.text}</p>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                {[step.action, step.action2].filter(Boolean).map((action) => (
                  <a
                    key={action!.href}
                    href={action!.href}
                    {...("external" in action! && action!.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="inline-flex items-center gap-1.5 font-display text-sm uppercase tracking-[0.1em] text-accent transition-colors hover:text-accent-hot"
                  >
                    {action!.label}
                    <ArrowUpRight className="size-3" />
                  </a>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Beiträge */}
      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <SectionHeading
            eyebrow="Beiträge"
            title="Was es kostet"
            lead="Mitgliedschaft und Hallennutzung werden getrennt abgerechnet — wer woanders trainiert, zahlt die Halle nicht mit."
          />
          <ul className="divide-y divide-line border-y border-line">
            {settings.fees.map((fee) => (
              <li key={fee.label} className="flex items-baseline justify-between gap-6 py-5">
                <span className="text-[0.9375rem] text-muted">{fee.label}</span>
                <span className="whitespace-nowrap text-right">
                  <span className="font-display text-2xl font-semibold text-accent">
                    {fee.amount}
                  </span>
                  <span className="ml-2 text-sm text-faint">{fee.period}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq">
        <SectionHeading eyebrow="FAQ" title="Häufige Fragen" />
        <div className="mt-12">
          <Accordion items={faq} />
        </div>

        <div className="mt-14 flex flex-wrap gap-3">
          <Button href={settings.membershipFormUrl} external>
            Aufnahmeantrag
          </Button>
          <Button href="/kontakt" variant="outline">
            Noch Fragen? Schreib uns
          </Button>
        </div>
      </Section>
    </>
  );
}

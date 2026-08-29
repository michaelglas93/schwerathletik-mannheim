import Image from "next/image";
import Link from "next/link";

import { PostCard } from "@/components/PostCard";
import { SportsClubSchema } from "@/components/StructuredData";
import { Button, Section, SectionHeading, Stat } from "@/components/ui";
import { getGallery, getPosts, getSettings } from "@/lib/content";
import { imageSrc } from "@/lib/image";

const SPORTS = [
  {
    name: "Kraftdreikampf",
    lead: "Kniebeuge, Bankdrücken, Kreuzheben — drei Versuche, ein Maximum.",
    text:
      "Alle drei Disziplinen werden mit der Langhantel ausgeführt. Ziel ist es, für eine " +
      "einzige Wiederholung möglichst viel Gewicht zu bewegen. Unsere größte Abteilung, " +
      "mit Startern auf Landes- und Deutschen Meisterschaften.",
  },
  {
    name: "Gewichtheben",
    lead: "Reißen und Stoßen — die Hantel über den Kopf.",
    text:
      "Technisch anspruchsvoller als der Kraftdreikampf und mindestens ebenso reizvoll. " +
      "Mit Stani steht ein erfahrener Trainer für das olympische Gewichtheben bereit.",
  },
];

export default async function HomePage() {
  const [settings, posts, gallery] = await Promise.all([
    getSettings(),
    getPosts(),
    getGallery(),
  ]);

  const latest = posts.slice(0, 3);
  const teaser = gallery.slice(0, 4);
  const years = new Date().getFullYear() - settings.founded;

  return (
    <>
      <SportsClubSchema settings={settings} />

      {/* Hero */}
      <section className="relative isolate flex min-h-[78svh] items-end overflow-hidden border-b border-line">
        <Image
          src={imageSrc(settings.heroImage) ?? "/img/hero/home-hero-dark.jpg"}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-center"
        />
        {/*
          Zwei Ebenen: eine leichte Grundabdunklung, damit das Foto überall ruhig bleibt,
          und ein Verlauf von unten, der nur den Textbereich trägt. Oben bleibt das Bild
          fast unangetastet.
        */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-ink/20" />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-linear-to-t from-ink from-12% via-ink/65 via-45% to-transparent"
        />

        <div className="shell pb-20 pt-32 md:pb-28">
          {/* Im Hero weiß statt orange — auf dem Foto trägt das Orange zu wenig,
              und die Zeile steht direkt über der ohnehin orangen Headline-Hälfte. */}
          <p className="eyebrow text-bone">Seit {settings.founded} in Mannheim</p>
          <h1 className="mt-4 max-w-4xl text-[clamp(2.75rem,9vw,6rem)] font-bold leading-[0.92]">
            Kraftdreikampf
            <span className="block text-accent">und Gewichtheben</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-[#ddd8d5]">
            {settings.tagline}. Vom ersten Probetraining bis zur Deutschen Meisterschaft —
            wichtiger als dein Leistungsstand ist, dass du mit anpackst.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button href="/mitglied-werden">Probetraining vereinbaren</Button>
            <Button href="/verein" variant="outline">
              Den Verein kennenlernen
            </Button>
          </div>
        </div>
      </section>

      {/* Über uns */}
      <Section>
        <div className="grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <div>
            <SectionHeading eyebrow="Über uns" title="Ein Verein für den Kraftsport" />
            <div className="prose-club mt-7 space-y-5">
              <p>{settings.intro}</p>
              <p>{settings.introSecond}</p>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-x-8 gap-y-10 self-start pt-2">
            <Stat value={String(settings.founded)} label="Gegründet" />
            <Stat value={`${years}`} label="Jahre Verein" />
            <Stat value={String(settings.gymSince)} label="Eigene Halle" />
            <Stat value="2" label="Sportarten" />
          </dl>
        </div>
      </Section>

      {/* Sportarten */}
      <Section tone="surface">
        <SectionHeading eyebrow="Was wir machen" title="Zwei Sportarten, eine Hantel" />
        <div className="mt-12 grid gap-px bg-line md:grid-cols-2">
          {SPORTS.map((sport) => (
            <div key={sport.name} className="bg-surface p-8 md:p-10">
              <h3 className="text-2xl leading-tight">{sport.name}</h3>
              <p className="mt-3 font-display text-base uppercase tracking-[0.04em] text-accent">
                {sport.lead}
              </p>
              <p className="prose-club mt-5">{sport.text}</p>
            </div>
          ))}
        </div>
        <p className="prose-club mt-10 max-w-2xl">
          Darüber hinaus sind wir für alle Kraftsportarten offen — in der Vergangenheit haben
          wir an Highland Games teilgenommen und gemeinsam Strongman-Disziplinen geübt.
        </p>
      </Section>

      {/* Trainingsstätte */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Trainingsstätte"
              title="Racks, Plattformen, ordentlich Gewicht"
              lead={`Seit ${settings.gymSince} haben wir eine eigene Halle beim ${settings.gym.name.replace("Halle des ", "")} in Mannheim-Sandhofen — mit Racks, Hebeplattformen, Wettkampfbank und allem, was der Kraftsport braucht. Dort trainieren wir und richten unsere Wettkämpfe aus.`}
            />
            <Button href="/trainingsstaette" variant="outline" className="mt-8">
              Halle ansehen
            </Button>
          </div>

          <ul className="grid grid-cols-2 gap-2">
            {teaser.map((image, i) => {
              const src = imageSrc(image.image ?? { path: image.path, alt: "" });
              if (!src) return null;
              return (
                <li key={image._id} className="relative aspect-square overflow-hidden bg-charcoal">
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, 45vw"
                    loading={i < 2 ? "eager" : "lazy"}
                    className="object-cover"
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </Section>

      {/* Neuigkeiten */}
      <Section tone="surface">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Neuigkeiten" title="Aus dem Verein" className="mb-0" />
          <Link
            href="/news"
            className="font-display text-sm uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent-hot"
          >
            Alle Beiträge →
          </Link>
        </div>
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </Section>

      {/* Abschluss-CTA */}
      <section className="border-t border-line bg-charcoal py-20 md:py-24">
        <div className="shell flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <h2 className="brand-rule text-[clamp(1.9rem,4.2vw,2.75rem)] leading-tight">
              Komm zum Probetraining
            </h2>
            <p className="prose-club mt-5">
              Anfänger sind ausdrücklich willkommen. Probetrainings finden nur nach
              Vereinbarung statt — schreib uns kurz, dann ist jemand vor Ort und zeigt dir
              die Übungen.
            </p>
          </div>
          <Button href="/mitglied-werden" className="shrink-0">
            So wirst du Mitglied
          </Button>
        </div>
      </section>
    </>
  );
}

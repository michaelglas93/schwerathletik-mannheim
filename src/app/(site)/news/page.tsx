import type { Metadata } from "next";

import { PostCard } from "@/components/PostCard";
import { ArrowUpRight, PageHeader, Section } from "@/components/ui";
import { getPosts, getSettings, groupByYear } from "@/lib/content";

export const metadata: Metadata = {
  title: "News",
  description:
    "Wettkampfberichte, Ergebnisse und Neuigkeiten aus der Schwerathletik Mannheim " +
    "2018 e.V. — von 2018 bis heute.",
};

export default async function NewsPage() {
  const [posts, settings] = await Promise.all([getPosts(), getSettings()]);
  const years = groupByYear(posts);

  return (
    <>
      <PageHeader
        eyebrow="Neuigkeiten"
        title="Aus dem Verein"
        lead="Wettkampfberichte, Ergebnisse und alles andere rund um den Verein."
      />

      {/* Jahresnavigation — statt fünf getrennter Jahresseiten wie bisher. */}
      <nav
        aria-label="Nach Jahr springen"
        className="sticky top-18 z-40 border-b border-line bg-ink/95 backdrop-blur-sm"
      >
        <div className="shell flex items-center gap-1 overflow-x-auto py-3">
          <span className="mr-2 shrink-0 text-xs uppercase tracking-[0.16em] text-faint">
            Jahr
          </span>
          {years.map(({ year, posts: entries }) => (
            <a
              key={year}
              href={`#${year}`}
              className="shrink-0 px-3 py-1.5 font-display text-sm uppercase tracking-[0.1em] text-muted transition-colors hover:text-accent-hot"
            >
              {year}
              <span className="ml-1.5 text-xs text-faint">{entries.length}</span>
            </a>
          ))}
        </div>
      </nav>

      {years.map(({ year, posts: entries }, groupIndex) => (
        <Section key={year} id={String(year)} tone={groupIndex % 2 === 0 ? "ink" : "surface"}>
          <h2 className="brand-rule text-[clamp(2rem,5vw,3.25rem)] leading-none">{year}</h2>
          <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map((post, i) => (
              <PostCard key={post._id} post={post} priority={groupIndex === 0 && i === 0} />
            ))}
          </div>
        </Section>
      ))}

      <Section tone="charcoal">
        <h2 className="brand-rule text-2xl">Mehr Einblicke</h2>
        <p className="prose-club mt-4 max-w-xl">
          Zwischen den Berichten posten wir Kurzes und Alltägliches auf unseren Kanälen.
        </p>
        <ul className="mt-7 flex flex-wrap gap-x-8 gap-y-3">
          {settings.social.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-display text-lg uppercase tracking-[0.06em] transition-colors hover:text-accent-hot"
              >
                {s.label}
                <ArrowUpRight className="size-3.5 text-accent" />
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

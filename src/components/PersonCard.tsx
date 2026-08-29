import { Picture } from "./Picture";
import { ArrowUpRight } from "./ui";
import type { Person } from "@/lib/types";

/**
 * Porträt mit Rolle. Coaches zeigen zusätzlich ihre Schwerpunkte und den Steckbrief.
 * Die Bildausrichtung sitzt bewusst oben — auf den Vereinsfotos steht der Kopf hoch.
 */
export function PersonCard({ person }: { person: Person }) {
  const image = person.image ?? (person.photo ? { path: person.photo, alt: person.name } : null);

  return (
    <article className="group">
      <div className="cut-corner relative aspect-3/4 w-full overflow-hidden bg-charcoal">
        {image ? (
          <Picture
            image={{ ...image, alt: image.alt || person.name }}
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
            position="center 25%"
            className="object-cover grayscale-[0.35] transition duration-500 group-hover:grayscale-0"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-5xl text-line-strong">
            {person.name.charAt(0)}
          </div>
        )}
      </div>

      <h3 className="mt-4 text-lg leading-tight">{person.name}</h3>
      <p className="mt-1 text-sm text-accent">{person.role}</p>

      {person.disciplines?.length ? (
        <ul className="mt-3 space-y-1">
          {person.disciplines.map((d) => (
            <li key={d} className="text-sm text-muted">
              {d}
            </li>
          ))}
        </ul>
      ) : null}

      {person.profileUrl && (
        <a
          href={person.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent-hot"
        >
          Steckbrief
          <ArrowUpRight className="size-3" />
        </a>
      )}
    </article>
  );
}

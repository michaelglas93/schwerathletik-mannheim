import { PortableText } from "@portabletext/react";

import type { FaqItem } from "@/lib/types";

/**
 * FAQ auf Basis von <details>/<summary>: ohne JavaScript, mit Tastaturbedienung
 * und Suchtreffern im Browser („find in page“ öffnet geschlossene Einträge).
 */
export function Accordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <details key={item._id} className="group">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 font-display text-lg font-medium uppercase tracking-[0.04em] transition-colors hover:text-accent-hot [&::-webkit-details-marker]:hidden">
            {item.question}
            <span
              aria-hidden
              className="mt-1 shrink-0 text-accent transition-transform duration-200 group-open:rotate-45"
            >
              <svg viewBox="0 0 16 16" className="size-4" fill="none" strokeWidth="2">
                <path d="M8 1v14M1 8h14" stroke="currentColor" />
              </svg>
            </span>
          </summary>
          <div className="prose-club pb-7 pr-10">
            <PortableText
              value={item.answer}
              components={{ block: { normal: ({ children }) => <p className="mb-4 last:mb-0">{children}</p> } }}
            />
          </div>
        </details>
      ))}
    </div>
  );
}

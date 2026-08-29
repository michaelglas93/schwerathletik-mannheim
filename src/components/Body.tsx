import { PortableText, type PortableTextComponents } from "@portabletext/react";

import { ResultsTable } from "./ResultsTable";
import { Picture } from "./Picture";
import type { BodyNode, ImageBlock, ResultsTable as ResultsTableData } from "@/lib/types";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-5">{children}</p>,
    h2: ({ children }) => (
      <h2 className="mb-4 mt-12 text-[1.75rem] leading-tight first:mt-0">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 mt-10 text-xl leading-tight text-accent first:mt-0">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-3 mt-8 text-lg leading-tight first:mt-0">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-2 border-accent pl-5 text-lg italic text-bone">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mb-6 space-y-2">{children}</ul>,
    number: ({ children }) => <ol className="mb-6 list-decimal space-y-2 pl-5">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="relative pl-5 before:absolute before:left-0 before:top-[0.7em] before:h-[3px] before:w-2.5 before:bg-accent before:content-['']">
        {children}
      </li>
    ),
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    underline: ({ children }) => <span className="underline underline-offset-2">{children}</span>,
    link: ({ children, value }) => {
      const href = (value as { href?: string })?.href ?? "";
      const external = /^https?:\/\//.test(href) && !href.includes("schwerathletik-mannheim.de");
      return (
        <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {children}
        </a>
      );
    },
  },
  types: {
    resultsTable: ({ value }) => <ResultsTable {...(value as ResultsTableData)} />,
    imageBlock: ({ value }) => {
      const image = value as ImageBlock;
      return (
        <figure className="not-prose my-9">
          <div className="relative aspect-4/3 w-full overflow-hidden bg-charcoal">
            <Picture image={image} sizes="(min-width: 768px) 720px, 100vw" />
          </div>
          {image.caption && (
            <figcaption className="mt-3 text-sm text-faint">{image.caption}</figcaption>
          )}
        </figure>
      );
    },
  },
};

/** Rendert den Beitragstext inklusive Ergebnistabellen und eingebetteter Bilder. */
export function Body({ value }: { value: BodyNode[] }) {
  return (
    <div className="prose-club">
      <PortableText value={value} components={components} />
    </div>
  );
}

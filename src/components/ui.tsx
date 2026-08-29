import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/** Kantige Schaltfläche. `variant` steuert Gewicht, nicht Form — Radien bleiben bei 0. */
export function Button({
  href,
  children,
  variant = "solid",
  external,
  className = "",
  ...rest
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline" | "ghost";
  external?: boolean;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "children" | "className">) {
  const base =
    "inline-flex items-center gap-2.5 px-6 py-3.5 font-display text-sm font-semibold " +
    "uppercase tracking-[0.12em] transition-colors duration-150";
  const variants = {
    solid: "bg-accent text-white hover:bg-accent-hot",
    outline: "border border-line-strong text-bone hover:border-accent hover:text-accent-hot",
    ghost: "text-muted hover:text-bone",
  } as const;

  const props = external ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`} {...props} {...rest}>
      {children}
      {external && <ArrowUpRight />}
    </Link>
  );
}

export function ArrowUpRight({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden className={className}>
      <path d="M3.5 10.5 10.5 3.5M4.7 3.5h5.8v5.8" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

/** Sektion mit einheitlichem vertikalem Rhythmus. */
export function Section({
  children,
  className = "",
  id,
  tone = "ink",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: "ink" | "surface" | "charcoal";
}) {
  const tones = {
    ink: "bg-ink",
    surface: "bg-surface",
    charcoal: "bg-charcoal",
  } as const;

  return (
    <section id={id} className={`${tones[tone]} py-20 md:py-28 ${className}`}>
      <div className="shell">{children}</div>
    </section>
  );
}

/** Überschrift mit schrägem Akzentbalken und optionaler Vorzeile. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  as: Tag = "h2",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <header className={`max-w-3xl ${className}`}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <Tag
        className={
          Tag === "h1"
            ? "brand-rule text-[clamp(2.5rem,7vw,4.75rem)] leading-[0.95]"
            : "brand-rule text-[clamp(1.9rem,4.2vw,3rem)] leading-[1.02]"
        }
      >
        {title}
      </Tag>
      {lead && <p className="prose-club mt-6">{lead}</p>}
    </header>
  );
}

/** Einheitlicher Seitenkopf aller Unterseiten. */
export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: ReactNode;
}) {
  return (
    <div className="border-b border-line bg-surface">
      <div className="shell py-16 md:py-24">
        <SectionHeading as="h1" eyebrow={eyebrow} title={title} lead={lead} />
      </div>
    </div>
  );
}

/** Zahl mit Beschriftung — für „Verein in Zahlen“. */
export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-t border-line pt-5">
      <div className="font-display text-5xl font-semibold leading-none text-accent md:text-6xl">
        {value}
      </div>
      <div className="mt-2.5 text-sm uppercase tracking-[0.14em] text-muted">{label}</div>
    </div>
  );
}

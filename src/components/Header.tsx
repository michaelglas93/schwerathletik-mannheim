"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const NAV = [
  { href: "/verein", label: "Verein" },
  { href: "/team", label: "Team" },
  { href: "/trainingsstaette", label: "Trainingsstätte" },
  { href: "/mitglied-werden", label: "Mitglied werden" },
  { href: "/news", label: "News" },
  { href: "/kontakt", label: "Kontakt" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Beim Seitenwechsel schließt sich das Menü, sonst bliebe es über der neuen Seite stehen.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/95 backdrop-blur-sm">
      <div className="shell flex h-18 items-center justify-between gap-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
          aria-label="Schwerathletik Mannheim — zur Startseite"
        >
          <Image
            src="/img/brand/logo-bildmarke-white.png"
            alt=""
            width={142}
            height={83}
            priority
            className="h-8 w-auto"
          />
          <span className="hidden font-display text-[0.9375rem] font-semibold uppercase leading-tight tracking-[0.06em] sm:block">
            Schwerathletik
            <span className="block text-muted">Mannheim</span>
          </span>
        </Link>

        <nav aria-label="Hauptnavigation" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`relative block px-3.5 py-2 font-display text-sm font-medium uppercase tracking-[0.1em] transition-colors ${
                    isActive(item.href) ? "text-accent" : "text-muted hover:text-bone"
                  }`}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <span
                      aria-hidden
                      className="absolute inset-x-3 -bottom-px h-0.5 bg-accent"
                      style={{ transform: "skewX(var(--skew-brand))" }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="-mr-2 flex size-11 items-center justify-center text-bone lg:hidden"
        >
          <span className="sr-only">{open ? "Menü schließen" : "Menü öffnen"}</span>
          <svg viewBox="0 0 24 24" aria-hidden className="size-6" fill="none" strokeWidth="1.8">
            {open ? (
              <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Hauptnavigation"
          className="border-t border-line bg-ink lg:hidden"
        >
          <ul className="shell divide-y divide-line py-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`flex items-center justify-between py-4 font-display text-lg font-medium uppercase tracking-[0.08em] ${
                    isActive(item.href) ? "text-accent" : "text-bone"
                  }`}
                >
                  {item.label}
                  <span aria-hidden className="text-faint">
                    ›
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

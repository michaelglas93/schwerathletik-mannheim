import Image from "next/image";
import Link from "next/link";

import { getSettings } from "@/lib/content";
import { ArrowUpRight } from "./ui";

const SITEMAP = [
  { href: "/verein", label: "Verein" },
  { href: "/team", label: "Team" },
  { href: "/trainingsstaette", label: "Trainingsstätte" },
  { href: "/mitglied-werden", label: "Mitglied werden" },
  { href: "/news", label: "News" },
  { href: "/kontakt", label: "Kontakt" },
];

export async function Footer() {
  const settings = await getSettings();

  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="shell grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div className="lg:col-span-1">
          <Image
            src="/img/brand/logo-bildmarke-white.png"
            alt=""
            width={142}
            height={83}
            className="h-10 w-auto"
          />
          <p className="mt-5 font-display text-lg font-semibold uppercase leading-tight">
            {settings.shortName}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{settings.tagline}</p>
        </div>

        <nav aria-label="Seitenübersicht">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-faint">
            Seiten
          </h2>
          <ul className="mt-4 space-y-2.5">
            {SITEMAP.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-muted transition-colors hover:text-bone">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-faint">
            Kontakt
          </h2>
          <ul className="mt-4 space-y-2.5">
            {settings.emails.map((mail) => (
              <li key={mail.address}>
                <a
                  href={`mailto:${mail.address}`}
                  className="text-sm text-muted transition-colors hover:text-bone"
                >
                  <span className="block text-[0.6875rem] uppercase tracking-[0.12em] text-faint">
                    {mail.label}
                  </span>
                  {mail.address}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-faint">
            Trainingsstätte
          </h2>
          <address className="mt-4 text-sm not-italic leading-relaxed text-muted">
            {settings.gym.name}
            <br />
            {settings.gym.street}
            <br />
            {settings.gym.zip} {settings.gym.city}
          </address>

          <ul className="mt-6 flex gap-4">
            {settings.social.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent-hot"
                >
                  {s.label}
                  <ArrowUpRight className="size-3" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="shell flex flex-col gap-4 py-6 text-sm text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {settings.clubName}
          </p>
          <ul className="flex gap-6">
            <li>
              <Link href="/impressum" className="transition-colors hover:text-bone">
                Impressum
              </Link>
            </li>
            <li>
              <Link href="/datenschutz" className="transition-colors hover:text-bone">
                Datenschutz
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

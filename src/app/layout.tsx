import type { Metadata } from "next";

import { inter, oswald } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://schwerathletik-mannheim.de"),
  title: {
    default: "Schwerathletik Mannheim — Kraftdreikampf & Gewichtheben",
    template: "%s | Schwerathletik Mannheim",
  },
  description:
    "Schwerathletikverein in Mannheim-Sandhofen. Kraftdreikampf, Gewichtheben und " +
    "Freizeitsport — für Anfänger wie für Wettkampfathleten.",
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "Schwerathletik Mannheim",
    url: "https://schwerathletik-mannheim.de",
  },
  alternates: { canonical: "/" },
};

/**
 * Nur Grundgerüst und Schriften. Kopf- und Fußzeile sitzen im Layout der Gruppe
 * `(site)`, damit das Studio unter /studio ohne sie auskommt.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" className={`${oswald.variable} ${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}

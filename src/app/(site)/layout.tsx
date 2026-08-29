import type { ReactNode } from "react";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

/** Rahmen aller öffentlichen Seiten — das Studio unter /studio bleibt davon unberührt. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#inhalt"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-100 focus:bg-accent focus:px-5 focus:py-3 focus:font-display focus:text-sm focus:uppercase focus:tracking-widest focus:text-white"
      >
        Zum Inhalt springen
      </a>
      <Header />
      <main id="inhalt" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}

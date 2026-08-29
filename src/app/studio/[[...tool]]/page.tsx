import { NextStudio } from "next-sanity/studio";

import config from "../../../../sanity.config";
import { hasSanity } from "@/sanity/env";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

/**
 * Das Redaktions-Backend läuft unter derselben Domain wie die Website. Ohne
 * konfiguriertes Sanity-Projekt zeigt die Route eine Anleitung statt eines Fehlers.
 */
export default function StudioPage() {
  if (!hasSanity) return <StudioSetupHint />;
  return <NextStudio config={config} />;
}

function StudioSetupHint() {
  return (
    <div className="shell py-24">
      <p className="eyebrow">Studio</p>
      <h1 className="brand-rule mt-4 text-4xl">Noch kein Sanity-Projekt verbunden</h1>
      <p className="prose-club mt-6 max-w-xl">
        Die Website läuft gerade aus <code>content/seed.json</code>. Um das Redaktions-Backend
        zu aktivieren, legt ihr ein Sanity-Projekt an und tragt die Zugangsdaten in{" "}
        <code>.env.local</code> ein:
      </p>
      <pre className="mt-6 max-w-xl overflow-x-auto border border-line bg-surface p-5 text-sm text-muted">
        {`npx sanity@latest login
npx sanity@latest init --project-plan free

# .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=…
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_WRITE_TOKEN=…`}
      </pre>
      <p className="prose-club mt-6 max-w-xl">
        Anschließend überträgt <code>npm run migrate</code> alle Inhalte aus dem Seed nach
        Sanity.
      </p>
    </div>
  );
}

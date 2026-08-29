export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-10-01";

/**
 * Ohne Projekt-ID läuft die Seite aus content/seed.json. Damit lässt sich alles lokal
 * bauen und ansehen, bevor das Sanity-Projekt existiert.
 */
export const hasSanity = projectId.length > 0;

export const studioTitle = "Schwerathletik Mannheim";

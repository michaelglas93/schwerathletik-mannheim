import { createClient, type QueryParams } from "next-sanity";

import { apiVersion, dataset, hasSanity, projectId } from "./env";

export { hasSanity };

export const client = hasSanity
  ? createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: "published" })
  : null;

/**
 * Query gegen Sanity. Fällt bei fehlender Konfiguration oder einem Netzwerkfehler auf
 * `null` zurück, damit content.ts den lokalen Seed nutzen kann statt den Build abzubrechen.
 */
export async function sanityFetch<T>(
  query: string,
  params: QueryParams = {},
): Promise<T | null> {
  if (!client) return null;
  try {
    return await client.fetch<T>(query, params, {
      next: { revalidate: 60, tags: ["content"] },
    });
  } catch (error) {
    console.error("[sanity] Query fehlgeschlagen, nutze lokalen Seed:", error);
    return null;
  }
}

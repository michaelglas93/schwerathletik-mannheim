"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId, studioTitle } from "@/sanity/env";
import { schemaTypes } from "@/sanity/schemas";
import { structure } from "@/sanity/structure";

export default defineConfig({
  basePath: "/studio",
  title: studioTitle,
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    // Vision ist die GROQ-Konsole — nur beim Entwickeln nützlich.
    ...(process.env.NODE_ENV === "development" ? [visionTool({ defaultApiVersion: apiVersion })] : []),
  ],
  document: {
    // Vereinsdaten gibt es nur einmal; „Duplizieren“ und „Löschen“ würden Schaden anrichten.
    actions: (prev, { schemaType }) =>
      schemaType === "siteSettings"
        ? prev.filter(({ action }) => action !== "duplicate" && action !== "delete" && action !== "unpublish")
        : prev,
  },
});

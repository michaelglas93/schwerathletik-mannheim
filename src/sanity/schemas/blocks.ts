import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Wettkampfergebnisse. Bewusst kein freies Tabellen-Plugin: Kopfzeile und Zeilen sind
 * getrennt, damit das Frontend die Werte auf dem Handy als Karten mit Beschriftung
 * ausgeben kann.
 */
export const resultsTable = defineType({
  name: "resultsTable",
  title: "Ergebnistabelle",
  type: "object",
  fields: [
    defineField({
      name: "headers",
      title: "Spaltenüberschriften",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      initialValue: ["Name", "Gewichtsklasse", "Total in kg", "Kniebeuge", "Bankdrücken", "Kreuzheben"],
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: "rows",
      title: "Zeilen",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "row",
          fields: [
            defineField({
              name: "cells",
              title: "Werte",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
            }),
          ],
          preview: {
            select: { cells: "cells" },
            prepare: ({ cells }) => ({ title: (cells ?? []).join(" · ") || "Leere Zeile" }),
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { rows: "rows" },
    prepare: ({ rows }) => ({
      title: "Ergebnistabelle",
      subtitle: `${rows?.length ?? 0} Zeilen`,
    }),
  },
});

/** Bild im Fließtext eines Beitrags. */
export const imageBlock = defineType({
  name: "imageBlock",
  title: "Bild",
  type: "object",
  fields: [
    defineField({
      name: "asset",
      title: "Bild",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alternativtext",
      type: "string",
      description: "Beschreibt das Bild für Screenreader. Leer lassen, wenn rein dekorativ.",
    }),
    defineField({ name: "caption", title: "Bildunterschrift", type: "string" }),
  ],
  preview: {
    select: { media: "asset", title: "caption", subtitle: "alt" },
    prepare: ({ media, title, subtitle }) => ({ media, title: title || "Bild", subtitle }),
  },
});

/** Link-Annotation für Fließtext. Als eigener Typ registriert, damit die Validierung greift. */
export const link = defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({
      name: "href",
      title: "Adresse",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https", "mailto", "tel"] }),
    }),
  ],
});

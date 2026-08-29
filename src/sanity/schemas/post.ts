import { defineArrayMember, defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Beitrag",
  type: "document",
  groups: [
    { name: "content", title: "Inhalt", default: true },
    { name: "meta", title: "Einordnung" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Adresse",
      type: "slug",
      group: "meta",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Datum",
      type: "date",
      group: "meta",
      options: { dateFormat: "DD.MM.YYYY" },
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "year",
      title: "Jahr",
      type: "number",
      group: "meta",
      description: "Bestimmt, unter welcher Jahresüberschrift der Beitrag auf /news steht.",
      initialValue: () => new Date().getFullYear(),
      validation: (rule) => rule.required().integer().min(2018),
    }),
    defineField({
      name: "showDate",
      title: "Datum anzeigen",
      type: "boolean",
      group: "meta",
      description:
        "Ausschalten, wenn das Datum nicht zum berichteten Zeitraum passt — dann zeigt " +
        "die Seite nur die Jahreszahl.",
      initialValue: true,
    }),
    defineField({
      name: "excerpt",
      title: "Anriss",
      type: "text",
      rows: 3,
      group: "content",
      description: "Erscheint auf der Übersicht und in Suchergebnissen. Zwei bis drei Sätze.",
      validation: (rule) => rule.required().max(320),
    }),
    defineField({
      name: "cover",
      title: "Titelbild",
      type: "object",
      group: "content",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: "image", title: "Bild", type: "image", options: { hotspot: true } }),
        defineField({ name: "alt", title: "Alternativtext", type: "string" }),
      ],
    }),
    defineField({
      name: "body",
      title: "Text",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Absatz", value: "normal" },
            { title: "Überschrift", value: "h2" },
            { title: "Zwischenüberschrift", value: "h3" },
            { title: "Kleine Überschrift", value: "h4" },
            { title: "Zitat", value: "blockquote" },
          ],
          lists: [
            { title: "Aufzählung", value: "bullet" },
            { title: "Nummeriert", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Fett", value: "strong" },
              { title: "Kursiv", value: "em" },
              { title: "Unterstrichen", value: "underline" },
            ],
            annotations: [{ name: "link", title: "Link", type: "link" }],
          },
        }),
        defineArrayMember({ type: "imageBlock" }),
        defineArrayMember({ type: "resultsTable" }),
      ],
    }),
  ],
  orderings: [
    { name: "dateDesc", title: "Neueste zuerst", by: [{ field: "date", direction: "desc" }] },
    { name: "dateAsc", title: "Älteste zuerst", by: [{ field: "date", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title", year: "year", date: "date", media: "cover.image" },
    prepare: ({ title, year, date, media }) => ({
      title,
      subtitle: date ? `${year} · ${date.split("-").reverse().join(".")}` : String(year),
      media,
    }),
  },
});

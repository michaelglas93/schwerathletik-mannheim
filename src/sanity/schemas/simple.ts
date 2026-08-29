import { defineArrayMember, defineField, defineType } from "sanity";

export const faqItem = defineType({
  name: "faqItem",
  title: "FAQ-Eintrag",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Frage",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Antwort",
      type: "array",
      of: [defineArrayMember({ type: "block", styles: [{ title: "Absatz", value: "normal" }] })],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Reihenfolge",
      type: "number",
      initialValue: 100,
    }),
  ],
  orderings: [{ name: "manual", title: "Reihenfolge", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "question", subtitle: "order" } },
});

export const galleryImage = defineType({
  name: "galleryImage",
  title: "Galeriebild",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Bild",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "caption", title: "Bildunterschrift", type: "string" }),
    defineField({ name: "order", title: "Reihenfolge", type: "number", initialValue: 100 }),
  ],
  orderings: [{ name: "manual", title: "Reihenfolge", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { media: "image", title: "caption", order: "order" },
    prepare: ({ media, title, order }) => ({
      media,
      title: title || `Bild ${order ?? ""}`.trim(),
    }),
  },
});

export const clubDocument = defineType({
  name: "clubDocument",
  title: "Vereinsdokument",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "subtitle", title: "Zusatz", type: "string" }),
    defineField({
      name: "file",
      title: "PDF",
      type: "file",
      description: "Datei hochladen — hat Vorrang vor dem Link.",
      options: { accept: ".pdf" },
    }),
    defineField({
      name: "externalUrl",
      title: "Externer Link",
      type: "url",
      description: "Nur nötig, wenn kein PDF hochgeladen wird.",
    }),
    defineField({ name: "order", title: "Reihenfolge", type: "number", initialValue: 100 }),
  ],
  orderings: [{ name: "manual", title: "Reihenfolge", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "subtitle" } },
});

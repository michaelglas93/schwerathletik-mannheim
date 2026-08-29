import { defineArrayMember, defineField, defineType } from "sanity";

export const DEPARTMENTS = [
  { title: "Geschäftsführender Vorstand", value: "vorstand" },
  { title: "Abteilung Gewichtheben", value: "gewichtheben" },
  { title: "Abteilung Kraftdreikampf", value: "kdk" },
  { title: "Schlichtung", value: "schlichtung" },
  { title: "Coach", value: "coach" },
] as const;

export const person = defineType({
  name: "person",
  title: "Person",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Funktion",
      type: "string",
      description: 'Zum Beispiel „1. Vorstand“, „Abteilungsleitung“ oder „Coach“.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "department",
      title: "Bereich",
      type: "string",
      options: { list: [...DEPARTMENTS], layout: "radio" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "photo",
      title: "Foto",
      type: "object",
      fields: [
        defineField({ name: "image", title: "Bild", type: "image", options: { hotspot: true } }),
        defineField({ name: "alt", title: "Alternativtext", type: "string" }),
      ],
    }),
    defineField({
      name: "order",
      title: "Reihenfolge",
      type: "number",
      description: "Kleinere Zahl steht weiter vorn.",
      initialValue: 100,
    }),
    defineField({
      name: "disciplines",
      title: "Trainingsbereiche",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description: "Nur bei Coaches — zum Beispiel „KDK/Powerlifting“ oder „Gewichtheben“.",
      hidden: ({ parent }) => parent?.department !== "coach",
    }),
    defineField({
      name: "profileUrl",
      title: "Steckbrief",
      type: "url",
      description: "Link zum Coaching-Steckbrief.",
      hidden: ({ parent }) => parent?.department !== "coach",
    }),
  ],
  orderings: [
    { name: "manual", title: "Reihenfolge", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo.image" },
  },
});

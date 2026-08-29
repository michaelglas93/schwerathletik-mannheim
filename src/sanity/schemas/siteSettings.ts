import { defineArrayMember, defineField, defineType } from "sanity";

const labelledUrl = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "array",
    of: [
      defineArrayMember({
        type: "object",
        fields: [
          defineField({ name: "label", title: "Bezeichnung", type: "string" }),
          defineField({ name: "url", title: "Adresse", type: "url" }),
          defineField({ name: "note", title: "Beschreibung", type: "string" }),
        ],
        preview: { select: { title: "label", subtitle: "url" } },
      }),
    ],
  });

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Vereinsdaten",
  type: "document",
  groups: [
    { name: "general", title: "Allgemein", default: true },
    { name: "contact", title: "Kontakt" },
    { name: "membership", title: "Mitgliedschaft" },
  ],
  fields: [
    defineField({ name: "clubName", title: "Vollständiger Name", type: "string", group: "general" }),
    defineField({ name: "shortName", title: "Kurzname", type: "string", group: "general" }),
    defineField({ name: "tagline", title: "Untertitel", type: "string", group: "general" }),
    defineField({ name: "intro", title: "Einleitung", type: "text", rows: 5, group: "general" }),
    defineField({
      name: "introSecond",
      title: "Zweiter Absatz",
      type: "text",
      rows: 2,
      group: "general",
    }),
    defineField({ name: "founded", title: "Gründungsjahr", type: "number", group: "general" }),
    defineField({
      name: "gymSince",
      title: "Trainingsstätte seit",
      type: "number",
      group: "general",
    }),
    defineField({
      name: "heroImage",
      title: "Bild der Startseite",
      type: "image",
      options: { hotspot: true },
      group: "general",
    }),

    defineField({
      name: "address",
      title: "Anschrift",
      type: "object",
      group: "contact",
      fields: [
        defineField({ name: "co", title: "c/o", type: "string" }),
        defineField({ name: "street", title: "Straße", type: "string" }),
        defineField({ name: "zip", title: "PLZ", type: "string" }),
        defineField({ name: "city", title: "Ort", type: "string" }),
      ],
    }),
    defineField({
      name: "gym",
      title: "Trainingsstätte",
      type: "object",
      group: "contact",
      fields: [
        defineField({ name: "name", title: "Bezeichnung", type: "string" }),
        defineField({ name: "street", title: "Straße", type: "string" }),
        defineField({ name: "zip", title: "PLZ", type: "string" }),
        defineField({ name: "city", title: "Ort", type: "string" }),
      ],
    }),
    defineField({
      name: "register",
      title: "Vereinsregister",
      type: "object",
      group: "contact",
      fields: [
        defineField({ name: "number", title: "Nummer", type: "string" }),
        defineField({ name: "court", title: "Registergericht", type: "string" }),
      ],
    }),
    defineField({
      name: "board",
      title: "Vertretungsberechtigt",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      group: "contact",
    }),
    defineField({
      name: "emails",
      title: "E-Mail-Adressen",
      type: "array",
      group: "contact",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Bezeichnung", type: "string" }),
            defineField({ name: "address", title: "Adresse", type: "string" }),
          ],
          preview: { select: { title: "label", subtitle: "address" } },
        }),
      ],
    }),
    { ...labelledUrl("social", "Social Media"), group: "contact" },
    { ...labelledUrl("partners", "Verbände und Partner"), group: "general" },

    defineField({
      name: "fees",
      title: "Beiträge",
      type: "array",
      group: "membership",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Bezeichnung", type: "string" }),
            defineField({ name: "amount", title: "Betrag", type: "string" }),
            defineField({ name: "period", title: "Zeitraum", type: "string" }),
          ],
          preview: { select: { title: "label", subtitle: "amount" } },
        }),
      ],
    }),
    defineField({
      name: "membershipFormUrl",
      title: "Aufnahmeantrag",
      type: "url",
      group: "membership",
    }),
    defineField({
      name: "skvMembershipUrl",
      title: "SKV-Mitgliedschaft",
      type: "url",
      group: "membership",
    }),
  ],
  preview: { prepare: () => ({ title: "Vereinsdaten" }) },
});

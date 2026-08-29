import type { StructureResolver } from "sanity/structure";

/**
 * Menü des Studios auf Deutsch. Die Vereinsdaten sind ein einzelnes Dokument und
 * erscheinen deshalb ohne „Neu“-Schaltfläche.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Inhalte")
    .items([
      S.listItem()
        .title("Beiträge")
        .schemaType("post")
        .child(S.documentTypeList("post").title("Beiträge")),
      S.divider(),
      S.listItem()
        .title("Personen")
        .schemaType("person")
        .child(S.documentTypeList("person").title("Personen")),
      S.listItem()
        .title("FAQ")
        .schemaType("faqItem")
        .child(S.documentTypeList("faqItem").title("FAQ")),
      S.listItem()
        .title("Galerie Trainingsstätte")
        .schemaType("galleryImage")
        .child(S.documentTypeList("galleryImage").title("Galerie")),
      S.listItem()
        .title("Vereinsdokumente")
        .schemaType("clubDocument")
        .child(S.documentTypeList("clubDocument").title("Vereinsdokumente")),
      S.divider(),
      S.listItem()
        .title("Vereinsdaten")
        .schemaType("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
    ]);

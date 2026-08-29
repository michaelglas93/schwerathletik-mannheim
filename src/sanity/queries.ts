import { defineQuery } from "next-sanity";

/**
 * Die Projektionen liefern exakt die Form aus src/lib/types.ts, damit Seiten nicht
 * unterscheiden müssen, ob die Daten aus Sanity oder aus content/seed.json stammen.
 */

/**
 * Bildprojektion für ein Objektfeld mit `image` und `alt` — anzuwenden als
 * `cover${nestedPicture}`. Innerhalb der Projektion ist der Scope bereits dieses
 * Objekt, die Pfade sind deshalb relativ.
 */
const nestedPicture = `{
  "asset": image.asset->{ "_ref": _id, url },
  "alt": coalesce(alt, ""),
  "width": image.asset->metadata.dimensions.width,
  "height": image.asset->metadata.dimensions.height
}`;

/** Bildprojektion für ein reines Bildfeld ohne umgebendes Objekt. */
const plainPicture = (field: string) => `{
  "asset": ${field}.asset->{ "_ref": _id, url },
  "alt": coalesce(${field}.alt, ""),
  "width": ${field}.asset->metadata.dimensions.width,
  "height": ${field}.asset->metadata.dimensions.height
}`;

/**
 * Beitragstext. Die Ergebnistabelle wird flachgeklopft: im Studio ist jede Zeile ein
 * Objekt mit `cells`, das Frontend erwartet reine Wertelisten.
 */
const body = `body[]{
  ...,
  _type == "imageBlock" => {
    _type, _key, alt, caption,
    "asset": asset.asset->{ "_ref": _id, url },
    "width": asset.asset->metadata.dimensions.width,
    "height": asset.asset->metadata.dimensions.height
  },
  _type == "resultsTable" => {
    _type, _key, headers,
    "rows": rows[].cells
  }
}`;

const postFields = `
  _id,
  title,
  "slug": slug.current,
  date,
  year,
  "showDate": coalesce(showDate, true),
  excerpt,
  "cover": select(defined(cover.image.asset) => cover${nestedPicture}, null)
`;

export const postsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc) {
    ${postFields},
    "body": []
  }
`);

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    ${postFields},
    ${body}
  }
`);

export const peopleQuery = defineQuery(`
  *[_type == "person"] | order(order asc) {
    _id, name, role, department, order, disciplines, profileUrl,
    "image": select(defined(photo.image.asset) => photo${nestedPicture}, null)
  }
`);

export const faqQuery = defineQuery(`
  *[_type == "faqItem"] | order(order asc) { _id, question, answer, order }
`);

export const galleryQuery = defineQuery(`
  *[_type == "galleryImage"] | order(order asc) {
    _id, order, caption,
    "image": ${plainPicture("image")}
  }
`);

export const documentsQuery = defineQuery(`
  *[_type == "clubDocument"] | order(order asc) {
    _id, title, subtitle, order,
    "url": coalesce(file.asset->url, externalUrl)
  }
`);

export const settingsQuery = defineQuery(`
  *[_type == "siteSettings"][0] {
    clubName, shortName, tagline, intro, introSecond, founded, gymSince,
    address, gym, register, board, emails, social, fees, partners,
    membershipFormUrl, skvMembershipUrl,
    "heroImage": heroImage.asset->url
  }
`);

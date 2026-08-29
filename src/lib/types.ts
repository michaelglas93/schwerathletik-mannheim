/** Gemeinsame Form der Inhalte — egal ob sie aus content/seed.json oder aus Sanity kommen. */

export type PortableSpan = {
  _type: "span";
  _key: string;
  text: string;
  marks: string[];
};

export type PortableBlock = {
  _type: "block";
  _key: string;
  style: "normal" | "h2" | "h3" | "h4" | "blockquote";
  listItem?: "bullet" | "number";
  level?: number;
  markDefs: { _key: string; _type: "link"; href: string }[];
  children: PortableSpan[];
};

/** Bild im Fließtext. `path` kommt aus dem Seed, `asset` aus Sanity. */
export type ImageBlock = {
  _type: "imageBlock";
  _key: string;
  path?: string;
  asset?: SanityAsset;
  alt: string;
  caption?: string;
  width?: number | null;
  height?: number | null;
};

/** Wettkampfergebnisse. Am Desktop eine Tabelle, am Handy gestapelte Karten. */
export type ResultsTable = {
  _type: "resultsTable";
  _key: string;
  headers: string[];
  rows: string[][];
};

export type BodyNode = PortableBlock | ImageBlock | ResultsTable;

export type SanityAsset = { _ref?: string; url?: string };

export type Picture = {
  path?: string;
  asset?: SanityAsset;
  alt: string;
  width?: number | null;
  height?: number | null;
  caption?: string;
};

export type Post = {
  _id: string;
  title: string;
  slug: string;
  /** ISO-Datum. Kann bei nachträglich angelegten Beiträgen vom Jahr abweichen. */
  date: string;
  /** Maßgebliches Jahr für Filter und Anzeige. */
  year: number;
  /** Falsch, wenn das Datum nicht zum Jahr passt — dann nur die Jahreszahl zeigen. */
  showDate: boolean;
  excerpt: string;
  cover: Picture | null;
  body: BodyNode[];
};

export type Department = "vorstand" | "gewichtheben" | "kdk" | "schlichtung" | "coach";

export type Person = {
  _id: string;
  name: string;
  role: string;
  department: Department;
  photo?: string;
  image?: Picture;
  order: number;
  disciplines?: string[];
  profileUrl?: string;
};

export type FaqItem = {
  _id: string;
  question: string;
  answer: PortableBlock[];
  order: number;
};

export type GalleryImage = {
  _id: string;
  path?: string;
  image?: Picture;
  caption?: string;
  order: number;
  width?: number | null;
  height?: number | null;
};

export type ClubDocument = {
  _id: string;
  title: string;
  subtitle?: string;
  url: string;
  order: number;
};

export type Settings = {
  clubName: string;
  shortName: string;
  tagline: string;
  intro: string;
  introSecond: string;
  founded: number;
  gymSince: number;
  heroImage: string;
  address: { street: string; zip: string; city: string; co: string };
  gym: { name: string; street: string; zip: string; city: string };
  register: { number: string; court: string };
  board: string[];
  emails: { label: string; address: string }[];
  social: { label: string; url: string }[];
  fees: { label: string; amount: string; period: string }[];
  partners: { label: string; url: string; note: string }[];
  membershipFormUrl: string;
  skvMembershipUrl: string;
};

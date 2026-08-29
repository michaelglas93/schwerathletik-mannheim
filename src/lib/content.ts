/**
 * Zugriff auf die Inhalte.
 *
 * Solange kein Sanity-Projekt konfiguriert ist, liest das Frontend content/seed.json —
 * die Datei, die scripts/extract.py aus dem WordPress-Scrape erzeugt. Sobald
 * NEXT_PUBLIC_SANITY_PROJECT_ID gesetzt ist, kommen dieselben Strukturen aus Sanity.
 * Alle Seiten sprechen nur mit diesem Modul, nie direkt mit einer Quelle.
 */
import "server-only";

import seed from "../../content/seed.json";
import { hasSanity, sanityFetch } from "@/sanity/client";
import * as q from "@/sanity/queries";
import type {
  ClubDocument,
  FaqItem,
  GalleryImage,
  Person,
  Post,
  Settings,
} from "./types";

const local = seed as unknown as {
  settings: Settings;
  posts: Post[];
  people: Person[];
  faq: FaqItem[];
  gallery: GalleryImage[];
  documents: ClubDocument[];
};

export async function getSettings(): Promise<Settings> {
  if (hasSanity) {
    const fromSanity = await sanityFetch<Settings | null>(q.settingsQuery);
    if (fromSanity) return { ...local.settings, ...fromSanity };
  }
  return local.settings;
}

export async function getPosts(): Promise<Post[]> {
  if (hasSanity) {
    const posts = await sanityFetch<Post[]>(q.postsQuery);
    if (posts?.length) return posts;
  }
  return local.posts;
}

export async function getPost(slug: string): Promise<Post | null> {
  if (hasSanity) {
    const post = await sanityFetch<Post | null>(q.postQuery, { slug });
    if (post) return post;
  }
  return local.posts.find((p) => p.slug === slug) ?? null;
}

export async function getPeople(): Promise<Person[]> {
  if (hasSanity) {
    const people = await sanityFetch<Person[]>(q.peopleQuery);
    if (people?.length) return people;
  }
  return local.people;
}

export async function getFaq(): Promise<FaqItem[]> {
  if (hasSanity) {
    const faq = await sanityFetch<FaqItem[]>(q.faqQuery);
    if (faq?.length) return faq;
  }
  return local.faq;
}

export async function getGallery(): Promise<GalleryImage[]> {
  if (hasSanity) {
    const gallery = await sanityFetch<GalleryImage[]>(q.galleryQuery);
    if (gallery?.length) return gallery;
  }
  return local.gallery;
}

export async function getDocuments(): Promise<ClubDocument[]> {
  if (hasSanity) {
    const docs = await sanityFetch<ClubDocument[]>(q.documentsQuery);
    if (docs?.length) return docs;
  }
  return local.documents;
}

/** Beiträge nach Jahr gruppiert, neuestes Jahr zuerst. */
export function groupByYear(posts: Post[]): { year: number; posts: Post[] }[] {
  const years = new Map<number, Post[]>();
  for (const post of posts) {
    const bucket = years.get(post.year);
    if (bucket) bucket.push(post);
    else years.set(post.year, [post]);
  }
  return [...years.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, entries]) => ({ year, posts: entries }));
}

/** Personen eines Bereichs in der gepflegten Reihenfolge. */
export function byDepartment(people: Person[], department: Person["department"]): Person[] {
  return people
    .filter((p) => p.department === department)
    .sort((a, b) => a.order - b.order);
}

/**
 * Überträgt content/seed.json nach Sanity — Bilder inklusive.
 *
 *   npm run migrate          # überträgt alles
 *   npm run migrate -- --dry # zeigt nur, was passieren würde
 *
 * Der Lauf ist wiederholbar: Dokumente bekommen feste IDs und werden per
 * createOrReplace geschrieben, hochgeladene Bilder landen in scripts/.asset-map.json
 * und werden beim nächsten Mal wiederverwendet statt erneut hochgeladen.
 *
 * Voraussetzung in .env.local:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN
 */
import { createClient } from "@sanity/client";
import { createReadStream, existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");
const ASSET_MAP = join(ROOT, "scripts", ".asset-map.json");

// ── Umgebung ────────────────────────────────────────────────────────────────

function loadEnv() {
  const file = join(ROOT, ".env.local");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (!match) continue;
    const value = match[2].replace(/^["']|["']$/g, "");
    if (!process.env[match[1]]) process.env[match[1]] = value;
  }
}
loadEnv();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "Fehlende Konfiguration. In .env.local werden NEXT_PUBLIC_SANITY_PROJECT_ID und\n" +
      "SANITY_API_WRITE_TOKEN erwartet. Ein Token mit der Rolle „Editor“ legst du im\n" +
      "Sanity-Dashboard unter API → Tokens an.",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-10-01",
  useCdn: false,
});

// ── Seed ────────────────────────────────────────────────────────────────────

type Span = { _type: "span"; _key: string; text: string; marks: string[] };
type Block = { _type: "block"; _key: string; style: string; markDefs: unknown[]; children: Span[] };
type SeedImage = { _type: "imageBlock"; _key: string; path: string; alt: string; caption?: string };
type SeedTable = { _type: "resultsTable"; _key: string; headers: string[]; rows: string[][] };
type SeedNode = Block | SeedImage | SeedTable;

type Seed = {
  settings: Record<string, unknown> & { heroImage: string };
  posts: {
    _id: string;
    title: string;
    slug: string;
    date: string;
    year: number;
    showDate: boolean;
    excerpt: string;
    cover: { path: string; alt: string } | null;
    body: SeedNode[];
  }[];
  people: {
    _id: string;
    name: string;
    role: string;
    department: string;
    photo?: string;
    order: number;
    disciplines?: string[];
    profileUrl?: string;
  }[];
  faq: { _id: string; question: string; answer: Block[]; order: number }[];
  gallery: { _id: string; path: string; caption?: string; order: number }[];
  documents: { _id: string; title: string; subtitle?: string; url: string; order: number }[];
};

const seed: Seed = JSON.parse(readFileSync(join(ROOT, "content", "seed.json"), "utf8"));

// ── Bilder ──────────────────────────────────────────────────────────────────

const assetMap: Record<string, string> = existsSync(ASSET_MAP)
  ? JSON.parse(readFileSync(ASSET_MAP, "utf8"))
  : {};
let uploaded = 0;
let reused = 0;

/** Lädt eine Datei aus public/ hoch und merkt sich die Asset-ID für spätere Läufe. */
async function uploadImage(path: string): Promise<string | null> {
  if (!path) return null;
  if (assetMap[path]) {
    reused += 1;
    return assetMap[path];
  }

  const file = join(ROOT, "public", path.replace(/^\//, ""));
  if (!existsSync(file)) {
    console.warn(`  ! Datei fehlt, übersprungen: ${path}`);
    return null;
  }
  if (DRY) {
    uploaded += 1;
    return "dry-run";
  }

  const asset = await client.assets.upload("image", createReadStream(file), {
    filename: basename(file),
  });
  assetMap[path] = asset._id;
  uploaded += 1;
  writeFileSync(ASSET_MAP, JSON.stringify(assetMap, null, 1));
  return asset._id;
}

const imageRef = (id: string) => ({ _type: "image", asset: { _type: "reference", _ref: id } });

// ── Umformen ────────────────────────────────────────────────────────────────

async function convertBody(nodes: SeedNode[]) {
  const out: unknown[] = [];
  for (const node of nodes) {
    if (node._type === "imageBlock") {
      const id = await uploadImage(node.path);
      if (!id) continue;
      out.push({
        _type: "imageBlock",
        _key: node._key,
        asset: imageRef(id),
        alt: node.alt,
        ...(node.caption ? { caption: node.caption } : {}),
      });
    } else if (node._type === "resultsTable") {
      out.push({
        _type: "resultsTable",
        _key: node._key,
        headers: node.headers,
        rows: node.rows.map((cells, i) => ({ _type: "row", _key: `${node._key}r${i}`, cells })),
      });
    } else {
      out.push(node);
    }
  }
  return out;
}

async function buildDocuments() {
  const docs: Record<string, unknown>[] = [];

  for (const post of seed.posts) {
    const coverId = post.cover ? await uploadImage(post.cover.path) : null;
    docs.push({
      _id: post._id,
      _type: "post",
      title: post.title,
      slug: { _type: "slug", current: post.slug },
      date: post.date,
      year: post.year,
      showDate: post.showDate,
      excerpt: post.excerpt,
      ...(coverId
        ? { cover: { image: imageRef(coverId), alt: post.cover?.alt ?? post.title } }
        : {}),
      body: await convertBody(post.body),
    });
  }

  for (const person of seed.people) {
    const photoId = person.photo ? await uploadImage(person.photo) : null;
    docs.push({
      _id: person._id,
      _type: "person",
      name: person.name,
      role: person.role,
      department: person.department,
      order: person.order,
      ...(photoId ? { photo: { image: imageRef(photoId), alt: person.name } } : {}),
      ...(person.disciplines ? { disciplines: person.disciplines } : {}),
      ...(person.profileUrl ? { profileUrl: person.profileUrl } : {}),
    });
  }

  for (const item of seed.faq) {
    docs.push({
      _id: item._id,
      _type: "faqItem",
      question: item.question,
      answer: item.answer,
      order: item.order,
    });
  }

  for (const image of seed.gallery) {
    const id = await uploadImage(image.path);
    if (!id) continue;
    docs.push({
      _id: image._id,
      _type: "galleryImage",
      image: imageRef(id),
      ...(image.caption ? { caption: image.caption } : {}),
      order: image.order,
    });
  }

  for (const doc of seed.documents) {
    docs.push({
      _id: doc._id,
      _type: "clubDocument",
      title: doc.title,
      subtitle: doc.subtitle,
      externalUrl: doc.url,
      order: doc.order,
    });
  }

  const heroId = await uploadImage(seed.settings.heroImage);
  const { _id: _ignored, heroImage: _hero, ...settings } = seed.settings as Record<string, unknown>;
  docs.push({
    _id: "siteSettings",
    _type: "siteSettings",
    ...settings,
    ...(heroId ? { heroImage: imageRef(heroId) } : {}),
  });

  return docs;
}

// ── Lauf ────────────────────────────────────────────────────────────────────

async function main() {
  console.log(
    `${DRY ? "Probelauf" : "Übertragung"} nach Sanity — Projekt ${projectId}, Dataset ${dataset}\n`,
  );

  const docs = await buildDocuments();
  const counts = docs.reduce<Record<string, number>>((acc, doc) => {
    const type = doc._type as string;
    acc[type] = (acc[type] ?? 0) + 1;
    return acc;
  }, {});

  console.log("Bilder:", `${uploaded} hochgeladen`, `${reused} wiederverwendet`);
  for (const [type, count] of Object.entries(counts)) console.log(`  ${type.padEnd(14)} ${count}`);

  if (DRY) {
    console.log("\nProbelauf — es wurde nichts geschrieben.");
    return;
  }

  // In Blöcken schreiben, damit eine Transaktion nicht zu groß wird.
  const SIZE = 20;
  for (let i = 0; i < docs.length; i += SIZE) {
    const tx = client.transaction();
    for (const doc of docs.slice(i, i + SIZE)) tx.createOrReplace(doc as never);
    await tx.commit();
    console.log(`  geschrieben ${Math.min(i + SIZE, docs.length)}/${docs.length}`);
  }

  console.log("\nFertig. Die Inhalte stehen jetzt im Studio unter /studio.");
}

main().catch((error) => {
  console.error("\nMigration fehlgeschlagen:", error);
  process.exit(1);
});

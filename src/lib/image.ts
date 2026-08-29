import { createImageUrlBuilder } from "@sanity/image-url";

import { client } from "@/sanity/client";
import type { Picture } from "./types";

const builder = client ? createImageUrlBuilder(client) : null;

/**
 * Löst eine Bildreferenz zu einer URL auf — lokaler Pfad aus dem Seed oder Sanity-Asset.
 * Sanity-Bilder gehen anschließend durch next/image und werden dadurch von der eigenen
 * Domain ausgeliefert, nicht von cdn.sanity.io.
 */
export function imageSrc(image?: Picture | string | null): string | null {
  if (!image) return null;
  if (typeof image === "string") return image;
  if (image.path) return image.path;

  const asset = image.asset;
  if (!asset) return null;
  if (asset._ref && builder) return builder.image(asset._ref).auto("format").url();
  return asset.url ?? null;
}

/** Seitenverhältnis eines Bildes, sofern die Maße bekannt sind. */
export function aspectRatio(image?: Picture | null): number | null {
  if (!image?.width || !image?.height) return null;
  return image.width / image.height;
}

/** Bequemer Weg von einem reinen Pfad aus dem Seed zu einer Picture-Struktur. */
export function fromPath(path: string | undefined, alt: string): Picture | null {
  return path ? { path, alt } : null;
}

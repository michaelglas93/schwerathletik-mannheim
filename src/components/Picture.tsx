import Image from "next/image";

import { imageSrc } from "@/lib/image";
import type { Picture as PictureData } from "@/lib/types";

type Props = {
  image?: PictureData | null;
  /** Fallback-Alt, falls im Bild selbst keiner gepflegt ist. */
  alt?: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  /** Objektposition, z.B. für Porträts, deren Kopf oben sitzt. */
  position?: string;
};

/**
 * Ein Bild, das seine Quelle sowohl aus dem lokalen Seed (`path` unter public/) als auch
 * aus Sanity (`asset`) beziehen kann. Füllt immer den Elternkasten, der die Proportion
 * vorgibt — so bleibt das Layout stabil, auch wenn Maße fehlen.
 */
export function Picture({ image, alt, sizes, className, priority, position }: Props) {
  const src = imageSrc(image);
  if (!src) return null;

  return (
    <Image
      src={src}
      alt={image?.alt || alt || ""}
      fill
      sizes={sizes}
      priority={priority}
      className={className ?? "object-cover"}
      style={position ? { objectPosition: position } : undefined}
    />
  );
}

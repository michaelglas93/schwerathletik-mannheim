"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { imageSrc } from "@/lib/image";
import type { GalleryImage } from "@/lib/types";

type Item = { src: string; caption?: string; alt: string };

/**
 * Raster aus quadratischen Ausschnitten mit einer schlanken eigenen Lightbox —
 * bewusst ohne Bibliothek, damit kein zusätzliches JavaScript ausgeliefert wird.
 * Bedienbar per Klick, Pfeiltasten und Escape.
 */
export function Gallery({ images }: { images: GalleryImage[] }) {
  const items: Item[] = images.flatMap((g) => {
    const src = imageSrc(g.image ?? { path: g.path, alt: g.caption ?? "" });
    if (!src) return [];
    return [{ src, caption: g.caption, alt: g.caption || "Trainingsstätte" }];
  });

  const [index, setIndex] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setIndex(null);
    openerRef.current?.focus();
  }, []);

  const step = useCallback(
    (delta: number) => setIndex((i) => (i === null ? i : (i + delta + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (index === null) return;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, close, step]);

  const open = items[index ?? -1];

  return (
    <>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item, i) => (
          <li key={item.src}>
            <button
              type="button"
              onClick={(e) => {
                openerRef.current = e.currentTarget;
                setIndex(i);
              }}
              className="group relative block aspect-square w-full overflow-hidden bg-charcoal"
            >
              <span className="sr-only">Bild {i + 1} von {items.length} vergrößern</span>
              <Image
                src={item.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 30vw, 45vw"
                loading={i < 8 ? "eager" : "lazy"}
                className="object-cover transition duration-300 group-hover:scale-105 group-hover:brightness-110"
              />
            </button>
          </li>
        ))}
      </ul>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Bildansicht"
          className="fixed inset-0 z-100 flex flex-col bg-ink/97 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <p className="font-display text-sm uppercase tracking-[0.14em] text-muted">
              {(index ?? 0) + 1} / {items.length}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              className="flex size-11 items-center justify-center text-bone hover:text-accent-hot"
            >
              <span className="sr-only">Schließen</span>
              <svg viewBox="0 0 24 24" aria-hidden className="size-6" fill="none" strokeWidth="1.8">
                <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" />
              </svg>
            </button>
          </div>

          <div className="relative flex-1">
            <Image
              src={open.src}
              alt={open.alt}
              fill
              sizes="100vw"
              className="object-contain p-4 md:p-10"
            />
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-line px-5 py-4">
            <button
              type="button"
              onClick={() => step(-1)}
              className="px-4 py-2 font-display text-sm uppercase tracking-[0.12em] text-muted hover:text-bone"
            >
              ‹ Zurück
            </button>
            {open.caption && (
              <p className="hidden truncate text-sm text-faint sm:block">{open.caption}</p>
            )}
            <button
              type="button"
              onClick={() => step(1)}
              className="px-4 py-2 font-display text-sm uppercase tracking-[0.12em] text-muted hover:text-bone"
            >
              Weiter ›
            </button>
          </div>
        </div>
      )}
    </>
  );
}

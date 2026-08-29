import Link from "next/link";

import { Picture } from "./Picture";
import { formatPostDate } from "@/lib/format";
import type { Post } from "@/lib/types";

/**
 * Beitragskarte. Ohne Titelbild tritt die Jahreszahl an dessen Stelle — sechs der
 * migrierten Beiträge haben keins, und ein leerer Rahmen sähe nach Fehler aus.
 */
export function PostCard({ post, priority }: { post: Post; priority?: boolean }) {
  return (
    <article className="group flex flex-col">
      <Link href={`/news/${post.slug}`} className="flex flex-1 flex-col">
        <div className="cut-corner relative aspect-16/10 w-full overflow-hidden bg-charcoal">
          {post.cover ? (
            <Picture
              image={{ ...post.cover, alt: post.cover.alt || post.title }}
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
              priority={priority}
              className="object-cover transition duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="font-display text-6xl font-semibold text-line-strong">
                {post.year}
              </span>
            </div>
          )}
        </div>

        <p className="mt-5 font-display text-xs uppercase tracking-[0.16em] text-accent">
          {formatPostDate(post)}
        </p>
        <h3 className="mt-2 text-xl leading-snug transition-colors group-hover:text-accent-hot">
          {post.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-[0.9375rem] leading-relaxed text-muted">
          {post.excerpt}
        </p>
      </Link>
    </article>
  );
}

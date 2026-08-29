import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Body } from "@/components/Body";
import { Picture } from "@/components/Picture";
import { PostCard } from "@/components/PostCard";
import { getPost, getPosts } from "@/lib/content";
import { formatDateAttribute, formatPostDate } from "@/lib/format";
import { imageSrc } from "@/lib/image";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/news/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const image = imageSrc(post.cover);
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/news/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.showDate ? post.date : undefined,
      images: image ? [image] : undefined,
    },
  };
}

export default async function PostPage({ params }: PageProps<"/news/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const all = await getPosts();
  const index = all.findIndex((p) => p.slug === post.slug);
  const more = all.filter((p) => p.slug !== post.slug).slice(index === 0 ? 1 : 0, 3);

  return (
    <article>
      <div className="border-b border-line bg-surface">
        <div className="shell py-14 md:py-20">
          <Link
            href={`/news#${post.year}`}
            className="inline-flex items-center gap-2 font-display text-sm uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent-hot"
          >
            ← News {post.year}
          </Link>

          <h1 className="brand-rule mt-7 max-w-4xl text-[clamp(2rem,5.5vw,3.5rem)] leading-[1.02]">
            {post.title}
          </h1>

          <time
            dateTime={formatDateAttribute(post)}
            className="mt-6 block font-display text-sm uppercase tracking-[0.16em] text-accent"
          >
            {formatPostDate(post)}
          </time>
        </div>
      </div>

      {post.cover && (
        <div className="relative aspect-16/9 w-full overflow-hidden border-b border-line bg-charcoal md:aspect-21/9">
          <Picture
            image={{ ...post.cover, alt: post.cover.alt || post.title }}
            sizes="100vw"
            priority
          />
        </div>
      )}

      <div className="shell py-16 md:py-20">
        <div className="max-w-3xl">
          <Body value={post.body} />
        </div>
      </div>

      {more.length > 0 && (
        <section className="border-t border-line bg-surface py-16 md:py-20">
          <div className="shell">
            <h2 className="brand-rule text-2xl">Weitere Beiträge</h2>
            <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((p) => (
                <PostCard key={p._id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}

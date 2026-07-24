import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { prisma } from "@/lib/prisma";
import { formatDate, readingTime } from "@/lib/format";
import { site } from "@/lib/site";
import { JsonLd } from "@/components/site/JsonLd";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post || !post.published) return { title: "Post not found" };
  const ogImage = `/api/og?tag=Blog&title=${encodeURIComponent(post.title)}&subtitle=${encodeURIComponent(post.excerpt ?? "")}`;
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", images: [ogImage] },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: true },
  });
  if (!post || !post.published) notFound();

  return (
    <article className="container-page max-w-3xl py-14">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt ?? undefined,
          datePublished: post.publishedAt?.toISOString(),
          dateModified: post.updatedAt.toISOString(),
          author: { "@type": "Person", name: post.author?.name ?? site.name },
          url: `${site.url}/blog/${post.slug}`,
          keywords: post.tags.join(", "),
        }}
      />
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
      >
        <FiArrowLeft className="h-4 w-4" /> All posts
      </Link>

      <header className="mt-6 border-b border-[var(--color-border)] pb-8">
        <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--color-faint)]">
          {post.publishedAt && <time>{formatDate(post.publishedAt)}</time>}
          <span>·</span>
          <span>{readingTime(post.content)}</span>
          {post.author?.name && (
            <>
              <span>·</span>
              <span>{post.author.name}</span>
            </>
          )}
        </div>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-3 text-lg text-[var(--color-muted)]">{post.excerpt}</p>
        )}
        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {post.tags.map((t) => (
              <span key={t} className="chip">
                #{t}
              </span>
            ))}
          </div>
        )}
      </header>

      {post.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImage}
          alt={post.title}
          className="mt-8 w-full rounded-xl border border-[var(--color-border)] object-cover"
        />
      )}

      <div
        className="prose prose-invert mt-8 max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}

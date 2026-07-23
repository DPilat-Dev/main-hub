import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { prisma } from "@/lib/prisma";
import { formatDate, readingTime } from "@/lib/format";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post || !post.published) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: { title: post.title, description: post.excerpt ?? undefined },
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

      <div
        className="prose prose-invert mt-8 max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}

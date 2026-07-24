import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import type { Post } from "@prisma/client";
import { formatDate, readingTime } from "@/lib/format";

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="card card-hover group flex flex-col overflow-hidden"
    >
      {post.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImage}
          alt={post.title}
          loading="lazy"
          className="aspect-[16/9] w-full border-b border-[var(--color-border)] object-cover"
        />
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-[var(--color-faint)]">
          {post.publishedAt && <time>{formatDate(post.publishedAt)}</time>}
          <span>·</span>
          <span>{readingTime(post.content)}</span>
        </div>

        <h3 className="mt-2 text-lg font-semibold text-[var(--color-foreground)] transition-colors group-hover:text-[var(--color-accent-soft)]">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-muted)]">
            {post.excerpt}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((t) => (
              <span key={t} className="chip">
                #{t}
              </span>
            ))}
          </div>
          <FiArrowRight className="h-4 w-4 text-[var(--color-faint)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--color-accent-soft)]" />
        </div>
      </div>
    </Link>
  );
}

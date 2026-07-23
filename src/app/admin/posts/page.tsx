import Link from "next/link";
import { FiPlus, FiEdit2, FiTrash2, FiExternalLink } from "react-icons/fi";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { deletePost } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blog posts</h1>
          <p className="text-sm text-[var(--color-muted)]">
            {posts.length} total
          </p>
        </div>
        <Link href="/admin/posts/new" className="btn btn-primary">
          <FiPlus className="h-4 w-4" /> New post
        </Link>
      </header>

      {posts.length === 0 ? (
        <div className="card p-10 text-center text-[var(--color-muted)]">
          No posts yet.{" "}
          <Link href="/admin/posts/new" className="text-[var(--color-accent-soft)]">
            Write your first one →
          </Link>
        </div>
      ) : (
        <div className="card divide-y divide-[var(--color-border)]">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between gap-4 p-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="truncate font-medium hover:text-[var(--color-accent-soft)]"
                  >
                    {post.title}
                  </Link>
                  <span
                    className={`chip shrink-0 ${
                      post.published
                        ? "!text-emerald-300 !border-emerald-500/30"
                        : ""
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="mt-0.5 truncate text-xs text-[var(--color-faint)]">
                  /{post.slug} · updated {formatDate(post.updatedAt)}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                {post.published && (
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="grid h-8 w-8 place-items-center rounded-md text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-foreground)]"
                    title="View"
                  >
                    <FiExternalLink className="h-4 w-4" />
                  </Link>
                )}
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className="grid h-8 w-8 place-items-center rounded-md text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-foreground)]"
                  title="Edit"
                >
                  <FiEdit2 className="h-4 w-4" />
                </Link>
                <form action={deletePost}>
                  <input type="hidden" name="id" value={post.id} />
                  <button
                    type="submit"
                    className="grid h-8 w-8 place-items-center rounded-md text-[var(--color-muted)] hover:bg-red-500/10 hover:text-red-300"
                    title="Delete"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

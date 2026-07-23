import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/site/PostCard";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description: "Writing on .NET, cloud, CI/CD, and building reliable software.",
};

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="container-page py-14">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Blog</h1>
        <p className="mt-2 max-w-2xl text-[var(--color-muted)]">
          Notes on .NET, cloud, CI/CD, and keeping production boring.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-[var(--color-muted)]">
          No posts published yet. Check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}

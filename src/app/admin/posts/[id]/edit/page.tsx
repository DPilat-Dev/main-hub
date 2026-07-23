import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { prisma } from "@/lib/prisma";
import { PostForm } from "@/components/admin/PostForm";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/posts"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
      >
        <FiArrowLeft className="h-4 w-4" /> Posts
      </Link>
      <h1 className="text-2xl font-bold tracking-tight">Edit post</h1>
      <PostForm post={post} />
    </div>
  );
}

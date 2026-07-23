import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { PostForm } from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/posts"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
      >
        <FiArrowLeft className="h-4 w-4" /> Posts
      </Link>
      <h1 className="text-2xl font-bold tracking-tight">New post</h1>
      <PostForm />
    </div>
  );
}

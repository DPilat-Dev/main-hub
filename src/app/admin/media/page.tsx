import { MediaLibrary } from "@/components/admin/MediaLibrary";

export default function AdminMediaPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Media</h1>
        <p className="text-sm text-[var(--color-muted)]">
          Upload and manage images. Use them as cover images or drop them into
          posts.
        </p>
      </header>

      <MediaLibrary embedded />
    </div>
  );
}

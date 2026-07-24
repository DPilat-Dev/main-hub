"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FiUploadCloud, FiX, FiTrash2, FiCheck } from "react-icons/fi";

export type MediaImage = {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
};

export function MediaLibrary({
  open = false,
  onClose = () => {},
  onSelect,
  embedded = false,
}: {
  open?: boolean;
  onClose?: () => void;
  onSelect?: (url: string) => void;
  embedded?: boolean;
}) {
  const [images, setImages] = useState<MediaImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      setImages(data.images ?? []);
    } catch {
      setError("Failed to load media");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open || embedded) refresh();
  }, [open, embedded, refresh]);

  const upload = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setUploading(true);
      setError(null);
      try {
        for (const file of Array.from(files)) {
          const form = new FormData();
          form.append("file", file);
          const res = await fetch("/api/admin/media", {
            method: "POST",
            body: form,
          });
          if (!res.ok) {
            const d = await res.json().catch(() => ({}));
            throw new Error(d.error ?? "Upload failed");
          }
        }
        await refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [refresh],
  );

  const remove = useCallback(async (url: string) => {
    setImages((prev) => prev.filter((i) => i.url !== url));
    await fetch(`/api/admin/media?url=${encodeURIComponent(url)}`, {
      method: "DELETE",
    });
  }, []);

  if (!embedded && !open) return null;

  return (
    <div
      className={
        embedded
          ? "contents"
          : "fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      }
      onClick={embedded ? undefined : onClose}
    >
      <div
        className={`flex w-full flex-col overflow-hidden rounded-xl border bg-[var(--color-surface)] ${
          embedded
            ? "border-[var(--color-border)]"
            : "max-h-[85vh] max-w-3xl border-[var(--color-border-strong)]"
        }`}
        onClick={embedded ? undefined : (e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border)] p-4">
          <h2 className="font-semibold">Media library</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="btn btn-primary text-sm disabled:opacity-60"
            >
              <FiUploadCloud className="h-4 w-4" />
              {uploading ? "Uploading…" : "Upload"}
            </button>
            {!embedded && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid h-9 w-9 place-items-center rounded-lg text-[var(--color-muted)] hover:bg-[var(--color-surface-2)]"
              >
                <FiX className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => upload(e.target.files)}
        />

        {error && (
          <p className="border-b border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <div className="min-h-[200px] flex-1 overflow-y-auto p-4">
          {loading ? (
            <p className="py-10 text-center text-sm text-[var(--color-faint)]">
              Loading…
            </p>
          ) : images.length === 0 ? (
            <div
              className="grid place-items-center rounded-lg border border-dashed border-[var(--color-border)] py-16 text-center text-sm text-[var(--color-faint)]"
              onClick={() => inputRef.current?.click()}
              role="button"
            >
              <div>
                <FiUploadCloud className="mx-auto mb-2 h-8 w-8" />
                No images yet — click Upload to add one.
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {images.map((img) => (
                <div
                  key={img.url}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.pathname}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                    {onSelect && (
                      <button
                        type="button"
                        onClick={() => onSelect(img.url)}
                        className="btn btn-primary text-xs"
                      >
                        <FiCheck className="h-3.5 w-3.5" /> Select
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => remove(img.url)}
                      aria-label="Delete image"
                      className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-red-300"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

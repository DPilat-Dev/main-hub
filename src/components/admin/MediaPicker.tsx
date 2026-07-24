"use client";

import { useState } from "react";
import { FiImage, FiX } from "react-icons/fi";
import { MediaLibrary } from "./MediaLibrary";

export function MediaPicker({
  name,
  defaultValue = "",
}: {
  name: string;
  defaultValue?: string;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <input type="hidden" name={name} value={url} />

      {url ? (
        <div className="relative w-full max-w-xs overflow-hidden rounded-lg border border-[var(--color-border)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="Cover"
            className="aspect-[16/9] w-full object-cover"
          />
          <div className="flex items-center justify-between gap-2 border-t border-[var(--color-border)] bg-[var(--color-surface)] p-2">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="text-sm text-[var(--color-accent-soft)] hover:underline"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => setUrl("")}
              className="inline-flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-red-300"
            >
              <FiX className="h-4 w-4" /> Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex aspect-[16/9] w-full max-w-xs flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)] text-sm text-[var(--color-muted)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-foreground)]"
        >
          <FiImage className="h-6 w-6" />
          Choose image
        </button>
      )}

      <MediaLibrary
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(selected) => {
          setUrl(selected);
          setOpen(false);
        }}
      />
    </div>
  );
}

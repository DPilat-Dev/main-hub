"use client";

import { useState } from "react";
import { FiGlobe } from "react-icons/fi";

export function ProjectPreview({
  src,
  title,
}: {
  src: string | null;
  title: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const showImage = src && !errored;

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-surface-2)]">
      {/* Placeholder / skeleton (also the fallback on error) */}
      <div
        className={`absolute inset-0 grid place-items-center bg-gradient-to-br from-[var(--color-surface-2)] to-[var(--color-surface)] transition-opacity duration-500 ${
          showImage && loaded ? "opacity-0" : "opacity-100"
        }`}
      >
        <FiGlobe className="h-8 w-8 text-[var(--color-faint)]" />
      </div>

      {showImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`Preview of ${title}`}
          loading="eager"
          decoding="async"
          // If the image finished loading before React hydrated, onLoad never
          // fires — so also check `complete` when the element mounts.
          ref={(node) => {
            if (!node) return;
            if (node.complete) {
              if (node.naturalWidth === 0) setErrored(true);
              else setLoaded(true);
            }
          }}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={`h-full w-full object-cover object-top transition-opacity duration-500 group-hover:scale-[1.02] motion-safe:transition-transform ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}

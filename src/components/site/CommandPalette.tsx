"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiCornerDownLeft, FiCommand } from "react-icons/fi";

type Item = { type: string; title: string; href: string; hint: string };

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const openPalette = useCallback(() => {
    setQuery("");
    setActive(0);
    setOpen(true);
    // Lazy-load the search index the first time it's needed.
    setItems((prev) => {
      if (prev.length === 0) {
        fetch("/api/search-index")
          .then((r) => r.json())
          .then((d) => setItems(d.items ?? []))
          .catch(() => {});
      }
      return prev;
    });
    setTimeout(() => inputRef.current?.focus(), 20);
  }, []);

  // Toggle with ⌘K / Ctrl+K; Escape closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) setOpen(false);
        else openPalette();
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, openPalette]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.type.toLowerCase().includes(q) ||
        i.hint.toLowerCase().includes(q),
    );
  }, [query, items]);

  const go = useCallback(
    (item?: Item) => {
      const target = item ?? results[active];
      if (!target) return;
      setOpen(false);
      router.push(target.href);
    },
    [results, active, router],
  );

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go();
    }
  };

  return (
    <>
      {/* Trigger button (navbar-friendly) */}
      <button
        onClick={openPalette}
        aria-label="Open command menu"
        className="hidden items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 text-xs text-[var(--color-muted)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-foreground)] md:inline-flex"
      >
        <FiSearch className="h-3.5 w-3.5" />
        <span>Search</span>
        <kbd className="inline-flex items-center gap-0.5 rounded border border-[var(--color-border)] px-1 font-mono text-[10px]">
          <FiCommand className="h-2.5 w-2.5" />K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 p-4 pt-[15vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={onListKey}
          >
            <div className="flex items-center gap-2.5 border-b border-[var(--color-border)] px-4">
              <FiSearch className="h-4 w-4 text-[var(--color-faint)]" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                placeholder="Search pages, projects, posts…"
                className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-[var(--color-faint)]"
              />
            </div>

            <ul className="max-h-[320px] overflow-y-auto p-2">
              {results.length === 0 && (
                <li className="px-3 py-6 text-center text-sm text-[var(--color-faint)]">
                  No results
                </li>
              )}
              {results.map((item, i) => (
                <li key={item.href}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(item)}
                    className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm ${
                      i === active
                        ? "bg-[var(--color-surface-2)]"
                        : "hover:bg-[var(--color-surface-2)]"
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span className="shrink-0 rounded bg-[var(--color-bg)] px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-[var(--color-faint)]">
                        {item.type}
                      </span>
                      <span className="truncate text-[var(--color-foreground)]">
                        {item.title}
                      </span>
                    </span>
                    {i === active && (
                      <FiCornerDownLeft className="h-3.5 w-3.5 shrink-0 text-[var(--color-faint)]" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

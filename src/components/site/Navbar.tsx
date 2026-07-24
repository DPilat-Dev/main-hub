"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiX, FiTerminal } from "react-icons/fi";
import { site } from "@/lib/site";
import { SocialLinks } from "./SocialLinks";
import { CommandPalette } from "./CommandPalette";

type Socials = { github: string; linkedin: string; email: string };

export function Navbar({
  siteName = site.name,
  socials = site.socials,
}: {
  siteName?: string;
  socials?: Socials;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Hide the public chrome inside the admin area.
  if (pathname.startsWith("/admin")) return null;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)]/70 bg-[var(--color-bg)]/80 backdrop-blur-xl">
      <nav className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="group flex items-center gap-2 font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)] text-white">
            <FiTerminal className="h-4 w-4" />
          </span>
          <span className="tracking-tight">{siteName}</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "text-[var(--color-foreground)]"
                  : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="mx-2 h-5 w-px bg-[var(--color-border)]" />
          <CommandPalette />
          <SocialLinks socials={socials} />
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--color-border)] text-[var(--color-foreground)] md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)] md:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive(item.href)
                    ? "bg-[var(--color-surface-2)] text-[var(--color-foreground)]"
                    : "text-[var(--color-muted)]"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="px-3 pt-3">
              <SocialLinks socials={socials} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

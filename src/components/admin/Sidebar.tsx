"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiGrid,
  FiFileText,
  FiFolder,
  FiLink,
  FiImage,
  FiSettings,
  FiExternalLink,
  FiLogOut,
} from "react-icons/fi";
import { doSignOut } from "@/app/admin/actions";

const links = [
  { href: "/admin", label: "Overview", Icon: FiGrid, exact: true },
  { href: "/admin/posts", label: "Blog posts", Icon: FiFileText },
  { href: "/admin/projects", label: "Projects", Icon: FiFolder },
  { href: "/admin/media", label: "Media", Icon: FiImage },
  { href: "/admin/links", label: "Dashboard links", Icon: FiLink },
  { href: "/admin/settings", label: "Site settings", Icon: FiSettings },
];

export function Sidebar({ userName }: { userName?: string | null }) {
  const pathname = usePathname();
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="flex h-full flex-col gap-1">
      <Link href="/" className="mb-4 flex items-center gap-2 px-2 font-semibold">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)] text-white text-xs">
          DP
        </span>
        Admin
      </Link>

      <nav className="flex flex-col gap-1">
        {links.map(({ href, label, Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive(href, exact)
                ? "bg-[var(--color-surface-2)] text-[var(--color-foreground)]"
                : "text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)]"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto space-y-1 border-t border-[var(--color-border)] pt-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
        >
          <FiExternalLink className="h-4 w-4" /> View site
        </Link>
        <form action={doSignOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[var(--color-muted)] hover:text-red-300"
          >
            <FiLogOut className="h-4 w-4" /> Sign out
            {userName ? (
              <span className="ml-auto truncate text-xs text-[var(--color-faint)]">
                {userName}
              </span>
            ) : null}
          </button>
        </form>
      </div>
    </aside>
  );
}

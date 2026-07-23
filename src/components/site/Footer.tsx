import Link from "next/link";
import { site } from "@/lib/site";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-[var(--color-border)]">
      <div className="container-page flex flex-col items-center justify-between gap-6 py-10 sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="font-semibold">{site.name}</p>
          <p className="text-sm text-[var(--color-faint)]">
            {site.role} · {site.location}
          </p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <SocialLinks />
      </div>
      <div className="container-page pb-8 text-center text-xs text-[var(--color-faint)]">
        © {new Date().getFullYear()} {site.name}. Built with Next.js &amp; Tailwind.
      </div>
    </footer>
  );
}

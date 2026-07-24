import Link from "next/link";
import { FiLock } from "react-icons/fi";
import { site } from "@/lib/site";
import { SocialLinks } from "./SocialLinks";

type Socials = { github: string; linkedin: string; email: string };

export function Footer({
  siteName = site.name,
  role = site.role,
  location = site.location,
  socials = site.socials,
}: {
  siteName?: string;
  role?: string;
  location?: string;
  socials?: Socials;
}) {
  return (
    <footer className="mt-20 border-t border-[var(--color-border)]">
      <div className="container-page flex flex-col items-center justify-between gap-6 py-10 sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="font-semibold">{siteName}</p>
          <p className="text-sm text-[var(--color-faint)]">
            {role} · {location}
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

        <SocialLinks socials={socials} />
      </div>
      <div className="container-page flex flex-col items-center justify-between gap-3 pb-8 text-xs text-[var(--color-faint)] sm:flex-row">
        <span>
          © {new Date().getFullYear()} {siteName}. Built with Next.js &amp;
          Tailwind.
        </span>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-[var(--color-faint)] transition-colors hover:text-[var(--color-foreground)]"
        >
          <FiLock className="h-3.5 w-3.5" /> Login
        </Link>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { site } from "@/lib/site";

const items = [
  { href: site.socials.github, label: "GitHub", Icon: FiGithub },
  { href: site.socials.linkedin, label: "LinkedIn", Icon: FiLinkedin },
  { href: site.socials.email, label: "Email", Icon: FiMail },
];

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {items.map(({ href, label, Icon }) => (
        <Link
          key={label}
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel="noreferrer"
          aria-label={label}
          className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-foreground)]"
        >
          <Icon className="h-[18px] w-[18px]" />
        </Link>
      ))}
    </div>
  );
}

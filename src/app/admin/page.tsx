import Link from "next/link";
import {
  FiFileText,
  FiFolder,
  FiLink,
  FiPlus,
  FiExternalLink,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const [postCount, publishedCount, projectCount, links] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.project.count(),
    prisma.dashboardLink.findMany({
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    }),
  ]);

  const stats = [
    {
      label: "Blog posts",
      value: postCount,
      sub: `${publishedCount} published`,
      href: "/admin/posts",
      Icon: FiFileText,
    },
    {
      label: "Projects",
      value: projectCount,
      sub: "in showcase",
      href: "/admin/projects",
      Icon: FiFolder,
    },
    {
      label: "Dashboard links",
      value: links.length,
      sub: "private",
      href: "/admin/links",
      Icon: FiLink,
    },
  ];

  // Group links by category for the private dashboard.
  const grouped = links.reduce<Record<string, typeof links>>((acc, l) => {
    (acc[l.category] ??= []).push(l);
    return acc;
  }, {});

  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
          <p className="text-sm text-[var(--color-muted)]">
            Manage content and your private dashboard.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/posts/new" className="btn btn-primary">
            <FiPlus className="h-4 w-4" /> New post
          </Link>
        </div>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, sub, href, Icon }) => (
          <Link key={label} href={href} className="card card-hover p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--color-muted)]">{label}</span>
              <Icon className="h-4 w-4 text-[var(--color-accent-soft)]" />
            </div>
            <div className="mt-2 text-3xl font-bold">{value}</div>
            <div className="text-xs text-[var(--color-faint)]">{sub}</div>
          </Link>
        ))}
      </section>

      {/* Private dashboard */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiEyeOff className="h-4 w-4 text-[var(--color-accent-soft)]" />
            <h2 className="text-lg font-semibold">Private dashboard</h2>
          </div>
          <Link
            href="/admin/links"
            className="text-sm text-[var(--color-accent-soft)] hover:underline"
          >
            Manage links
          </Link>
        </div>

        {links.length === 0 ? (
          <div className="card p-6 text-sm text-[var(--color-muted)]">
            No links yet.{" "}
            <Link href="/admin/links" className="text-[var(--color-accent-soft)]">
              Add your server &amp; subdomain links →
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-faint)]">
                  {category}
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((l) => (
                    <a
                      key={l.id}
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="card card-hover group flex items-start justify-between gap-3 p-4"
                    >
                      <div className="min-w-0">
                        <div className="truncate font-medium">{l.title}</div>
                        {l.description && (
                          <div className="truncate text-xs text-[var(--color-muted)]">
                            {l.description}
                          </div>
                        )}
                      </div>
                      <FiExternalLink className="h-4 w-4 shrink-0 text-[var(--color-faint)] group-hover:text-[var(--color-accent-soft)]" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <p className="flex items-center gap-1.5 text-xs text-[var(--color-faint)]">
        <FiEye className="h-3.5 w-3.5" /> This area is protected and hidden from
        the public site &amp; search engines.
      </p>
    </div>
  );
}

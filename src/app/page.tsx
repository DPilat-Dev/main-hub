import Link from "next/link";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiFileText,
  FiMapPin,
} from "react-icons/fi";
import { prisma, safeQuery } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { resume } from "@/lib/resume";
import { SocialLinks } from "@/components/site/SocialLinks";
import { Typewriter } from "@/components/site/Typewriter";
import { ProjectCard } from "@/components/site/ProjectCard";
import { PostCard } from "@/components/site/PostCard";
import { HomelabStatus } from "@/components/site/HomelabStatus";
import { GitHubSection } from "@/components/site/GitHubSection";

export const revalidate = 60;

export default async function HomePage() {
  const settings = await getSettings();
  const [projects, posts] = await Promise.all([
    safeQuery(
      () =>
        prisma.project.findMany({
          where: { featured: true },
          orderBy: { sortOrder: "asc" },
          take: 3,
        }),
      [],
    ),
    safeQuery(
      () =>
        prisma.post.findMany({
          where: { published: true },
          orderBy: { publishedAt: "desc" },
          take: 3,
        }),
      [],
    ),
  ]);

  const stats = [
    { value: "8+", label: "Years building SaaS" },
    { value: "$40M", label: "Revenue stream protected" },
    { value: "10%", label: "Retention lift shipped" },
  ];

  return (
    <div className="container-page">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="flex flex-col items-start gap-6 pt-16 pb-14 sm:pt-24">
        {settings.availableForWork && (
          <span className="chip">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Available for new opportunities
          </span>
        )}

        <h1 className="max-w-3xl text-4xl font-bold leading-[1.15] tracking-tight sm:text-6xl">
          Hi, I&apos;m {settings.name.split(" ")[0]} — I build{" "}
          <Typewriter
            phrases={settings.heroPhrases}
            className="accent-gradient-text"
          />
        </h1>

        <p className="max-w-2xl text-lg leading-relaxed text-[var(--color-muted)]">
          {settings.intro}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/resume" className="btn btn-primary">
            <FiFileText className="h-4 w-4" /> View résumé
          </Link>
          <Link href="/projects" className="btn btn-ghost">
            See projects <FiArrowRight className="h-4 w-4" />
          </Link>
          <SocialLinks className="ml-1" socials={settings.socials} />
        </div>

        <div className="flex items-center gap-1.5 text-sm text-[var(--color-faint)]">
          <FiMapPin className="h-4 w-4" /> {settings.location}
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────── */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="card p-6">
            <div className="text-3xl font-bold accent-gradient-text">
              {s.value}
            </div>
            <div className="mt-1 text-sm text-[var(--color-muted)]">
              {s.label}
            </div>
          </div>
        ))}
      </section>

      {/* ── Skills strip ─────────────────────────────────── */}
      <section className="mt-14">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-faint)]">
          Tools I work with
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {resume.skills.flatMap((g) => g.skills).map((skill) => (
            <span key={skill} className="chip">
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* ── Featured projects ────────────────────────────── */}
      <section className="mt-20">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="section-title">Featured projects</h2>
            <p className="mt-1 text-[var(--color-muted)]">
              A few things I&apos;ve designed, built, and shipped.
            </p>
          </div>
          <Link
            href="/projects"
            className="hidden items-center gap-1 text-sm text-[var(--color-accent-soft)] hover:underline sm:inline-flex"
          >
            All projects <FiArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>

      {/* ── Homelab ──────────────────────────────────────── */}
      <HomelabStatus />

      {/* ── Recent writing ───────────────────────────────── */}
      {posts.length > 0 && (
        <section className="mt-20">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="section-title">Latest writing</h2>
              <p className="mt-1 text-[var(--color-muted)]">
                Notes on .NET, CI/CD, and keeping production boring.
              </p>
            </div>
            <Link
              href="/blog"
              className="hidden items-center gap-1 text-sm text-[var(--color-accent-soft)] hover:underline sm:inline-flex"
            >
              All posts <FiArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}

      {/* ── GitHub ───────────────────────────────────────── */}
      <GitHubSection />

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="my-24">
        <div className="card relative overflow-hidden p-10 text-center">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/15 to-[var(--color-accent-2)]/10" />
          <div className="relative">
            <h2 className="section-title">Let&apos;s build something reliable.</h2>
            <p className="mx-auto mt-2 max-w-xl text-[var(--color-muted)]">
              I&apos;m open to software engineering roles and interesting
              projects. The fastest way to reach me is email.
            </p>
            <div className="mt-6 flex justify-center">
              <a href={settings.socials.email} className="btn btn-primary">
                Get in touch <FiArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

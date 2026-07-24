import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft, FiExternalLink, FiGithub } from "react-icons/fi";
import { prisma } from "@/lib/prisma";
import { getProjectPreview } from "@/lib/preview";
import { ProjectPreview } from "@/components/site/ProjectPreview";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) return { title: "Project not found" };
  const ogImage = `/api/og?tag=Project&title=${encodeURIComponent(project.title)}&subtitle=${encodeURIComponent(project.summary)}`;
  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", images: [ogImage] },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) notFound();

  const preview = getProjectPreview(project);

  return (
    <article className="container-page max-w-3xl py-14">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
      >
        <FiArrowLeft className="h-4 w-4" /> All projects
      </Link>

      <header className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {project.title}
        </h1>
        <p className="mt-2 text-lg text-[var(--color-muted)]">
          {project.summary}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              <FiExternalLink className="h-4 w-4" /> Visit site
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost"
            >
              <FiGithub className="h-4 w-4" /> Source
            </a>
          )}
        </div>

        {project.tech.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
        )}
      </header>

      {preview && (
        <div className="group mt-8 overflow-hidden rounded-xl border border-[var(--color-border)]">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${project.title} in a new tab`}
              className="block"
            >
              <ProjectPreview src={preview} title={project.title} />
            </a>
          ) : (
            <ProjectPreview src={preview} title={project.title} />
          )}
        </div>
      )}

      {project.description && (
        <div
          className="prose prose-invert mt-8 max-w-none"
          dangerouslySetInnerHTML={{ __html: project.description }}
        />
      )}
    </article>
  );
}

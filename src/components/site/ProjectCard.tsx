import Link from "next/link";
import { FiArrowUpRight, FiGithub, FiExternalLink } from "react-icons/fi";
import type { Project } from "@prisma/client";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="card card-hover group flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <Link href={`/projects/${project.slug}`} className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-[var(--color-foreground)]">
            {project.title}
          </h3>
        </Link>
        <Link
          href={`/projects/${project.slug}`}
          aria-label={`View ${project.title}`}
          className="text-[var(--color-faint)] transition-colors group-hover:text-[var(--color-accent-soft)]"
        >
          <FiArrowUpRight className="h-5 w-5" />
        </Link>
      </div>

      <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-muted)]">
        {project.summary}
      </p>

      {project.tech.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.slice(0, 4).map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-4 text-sm">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
          >
            <FiExternalLink className="h-4 w-4" /> Live
          </a>
        )}
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
          >
            <FiGithub className="h-4 w-4" /> Code
          </a>
        )}
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProjectCard } from "@/components/site/ProjectCard";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Projects",
  description: "A showcase of software and web projects I've designed and shipped.",
};

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="container-page py-14">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Projects</h1>
        <p className="mt-2 max-w-2xl text-[var(--color-muted)]">
          A selection of things I&apos;ve designed, built, and shipped — from
          client sites to product features.
        </p>
      </header>

      {projects.length === 0 ? (
        <p className="text-[var(--color-muted)]">
          Projects are on the way. Check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import { FiPlus, FiEdit2, FiTrash2, FiStar } from "react-icons/fi";
import { prisma } from "@/lib/prisma";
import { deleteProject } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-sm text-[var(--color-muted)]">
            {projects.length} total
          </p>
        </div>
        <Link href="/admin/projects/new" className="btn btn-primary">
          <FiPlus className="h-4 w-4" /> New project
        </Link>
      </header>

      {projects.length === 0 ? (
        <div className="card p-10 text-center text-[var(--color-muted)]">
          No projects yet.{" "}
          <Link
            href="/admin/projects/new"
            className="text-[var(--color-accent-soft)]"
          >
            Add your first one →
          </Link>
        </div>
      ) : (
        <div className="card divide-y divide-[var(--color-border)]">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between gap-4 p-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {project.featured && (
                    <FiStar
                      className="h-3.5 w-3.5 shrink-0 text-[var(--color-accent-soft)]"
                      title="Featured"
                    />
                  )}
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="truncate font-medium hover:text-[var(--color-accent-soft)]"
                  >
                    {project.title}
                  </Link>
                </div>
                <div className="mt-0.5 truncate text-xs text-[var(--color-faint)]">
                  {project.summary}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <Link
                  href={`/admin/projects/${project.id}/edit`}
                  className="grid h-8 w-8 place-items-center rounded-md text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-foreground)]"
                  title="Edit"
                >
                  <FiEdit2 className="h-4 w-4" />
                </Link>
                <form action={deleteProject}>
                  <input type="hidden" name="id" value={project.id} />
                  <button
                    type="submit"
                    className="grid h-8 w-8 place-items-center rounded-md text-[var(--color-muted)] hover:bg-red-500/10 hover:text-red-300"
                    title="Delete"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

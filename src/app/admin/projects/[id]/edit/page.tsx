import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
      >
        <FiArrowLeft className="h-4 w-4" /> Projects
      </Link>
      <h1 className="text-2xl font-bold tracking-tight">Edit project</h1>
      <ProjectForm project={project} />
    </div>
  );
}

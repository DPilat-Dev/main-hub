import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
      >
        <FiArrowLeft className="h-4 w-4" /> Projects
      </Link>
      <h1 className="text-2xl font-bold tracking-tight">New project</h1>
      <ProjectForm />
    </div>
  );
}

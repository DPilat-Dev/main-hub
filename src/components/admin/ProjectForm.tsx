import Link from "next/link";
import type { Project } from "@prisma/client";
import { saveProject } from "@/app/admin/actions";
import { Editor } from "./Editor";
import { MediaPicker } from "./MediaPicker";
import { Field, Input, Textarea, Toggle, SubmitButton } from "./fields";

export function ProjectForm({ project }: { project?: Project }) {
  return (
    <form action={saveProject} className="space-y-6">
      {project && <input type="hidden" name="id" value={project.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title">
          <Input name="title" defaultValue={project?.title} required />
        </Field>
        <Field label="Slug" hint="Leave blank to generate from the title.">
          <Input name="slug" defaultValue={project?.slug} />
        </Field>
      </div>

      <Field label="Summary" hint="One-line description shown on cards.">
        <Textarea name="summary" defaultValue={project?.summary} rows={2} required />
      </Field>

      <Field label="Description">
        <Editor name="description" defaultValue={project?.description ?? ""} />
      </Field>

      <Field
        label="Cover image"
        hint="Optional — overrides the auto-generated site screenshot."
      >
        <MediaPicker name="coverImage" defaultValue={project?.coverImage ?? ""} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tech" hint="Comma-separated, e.g. Next.js, TypeScript">
          <Input name="tech" defaultValue={project?.tech.join(", ")} />
        </Field>
        <Field label="Sort order" hint="Lower numbers appear first.">
          <Input
            name="sortOrder"
            type="number"
            defaultValue={project?.sortOrder ?? 0}
          />
        </Field>
        <Field label="Live URL">
          <Input name="liveUrl" defaultValue={project?.liveUrl ?? ""} />
        </Field>
        <Field label="Repo URL">
          <Input name="repoUrl" defaultValue={project?.repoUrl ?? ""} />
        </Field>
      </div>

      <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-5">
        <Toggle
          name="featured"
          label="Featured on home"
          defaultChecked={project?.featured}
        />
        <div className="flex gap-2">
          <Link href="/admin/projects" className="btn btn-ghost">
            Cancel
          </Link>
          <SubmitButton>
            {project ? "Save changes" : "Create project"}
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}

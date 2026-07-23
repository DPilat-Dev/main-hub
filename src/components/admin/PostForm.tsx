import Link from "next/link";
import type { Post } from "@prisma/client";
import { savePost } from "@/app/admin/actions";
import { Editor } from "./Editor";
import { Field, Input, Textarea, Toggle, SubmitButton } from "./fields";

export function PostForm({ post }: { post?: Post }) {
  return (
    <form action={savePost} className="space-y-6">
      {post && <input type="hidden" name="id" value={post.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title">
          <Input name="title" defaultValue={post?.title} required />
        </Field>
        <Field label="Slug" hint="Leave blank to generate from the title.">
          <Input
            name="slug"
            defaultValue={post?.slug}
            placeholder="my-post-title"
          />
        </Field>
      </div>

      <Field label="Excerpt" hint="Short summary shown on cards and previews.">
        <Textarea name="excerpt" defaultValue={post?.excerpt ?? ""} rows={2} />
      </Field>

      <Field label="Content">
        <Editor name="content" defaultValue={post?.content ?? ""} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tags" hint="Comma-separated, e.g. dotnet, ci-cd">
          <Input name="tags" defaultValue={post?.tags.join(", ")} />
        </Field>
        <Field label="Cover image URL" hint="Optional.">
          <Input name="coverImage" defaultValue={post?.coverImage ?? ""} />
        </Field>
      </div>

      <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-5">
        <Toggle
          name="published"
          label="Published"
          defaultChecked={post?.published}
        />
        <div className="flex gap-2">
          <Link href="/admin/posts" className="btn btn-ghost">
            Cancel
          </Link>
          <SubmitButton>{post ? "Save changes" : "Create post"}</SubmitButton>
        </div>
      </div>
    </form>
  );
}

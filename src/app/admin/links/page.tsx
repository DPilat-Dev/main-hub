import { FiTrash2, FiPlus, FiExternalLink } from "react-icons/fi";
import { prisma } from "@/lib/prisma";
import { saveLink, deleteLink } from "@/app/admin/actions";
import { Field, Input, SubmitButton } from "@/components/admin/fields";

export const dynamic = "force-dynamic";

export default async function AdminLinksPage() {
  const links = await prisma.dashboardLink.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard links</h1>
        <p className="text-sm text-[var(--color-muted)]">
          Private links to your server, subdomains, and tools. Shown only on the
          protected overview.
        </p>
      </header>

      {/* Add new */}
      <section className="card p-5">
        <h2 className="mb-4 flex items-center gap-2 font-semibold">
          <FiPlus className="h-4 w-4 text-[var(--color-accent-soft)]" /> Add link
        </h2>
        <form action={saveLink} className="grid gap-4 sm:grid-cols-2">
          <Field label="Title">
            <Input name="title" required placeholder="Home server" />
          </Field>
          <Field label="URL">
            <Input name="url" required placeholder="https://…" />
          </Field>
          <Field label="Category">
            <Input name="category" placeholder="Servers" defaultValue="General" />
          </Field>
          <Field label="Sort order">
            <Input name="sortOrder" type="number" defaultValue={0} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Description">
              <Input name="description" placeholder="Optional note" />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <SubmitButton>Add link</SubmitButton>
          </div>
        </form>
      </section>

      {/* Existing */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-faint)]">
          {links.length} link{links.length === 1 ? "" : "s"}
        </h2>
        {links.map((link) => (
          <div key={link.id} className="card p-4">
            <form
              action={saveLink}
              className="grid items-end gap-3 sm:grid-cols-[1fr_1fr_140px_90px_auto]"
            >
              <input type="hidden" name="id" value={link.id} />
              <Field label="Title">
                <Input name="title" defaultValue={link.title} required />
              </Field>
              <Field label="URL">
                <Input name="url" defaultValue={link.url} required />
              </Field>
              <Field label="Category">
                <Input name="category" defaultValue={link.category} />
              </Field>
              <Field label="Order">
                <Input
                  name="sortOrder"
                  type="number"
                  defaultValue={link.sortOrder}
                />
              </Field>
              <div className="flex gap-1.5">
                <SubmitButton>Save</SubmitButton>
              </div>
              <div className="sm:col-span-5">
                <Field label="Description">
                  <Input name="description" defaultValue={link.description ?? ""} />
                </Field>
              </div>
            </form>

            <div className="mt-3 flex items-center justify-between border-t border-[var(--color-border)] pt-3">
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
              >
                <FiExternalLink className="h-3.5 w-3.5" /> {link.url}
              </a>
              <form action={deleteLink}>
                <input type="hidden" name="id" value={link.id} />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 text-xs text-[var(--color-muted)] hover:text-red-300"
                >
                  <FiTrash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

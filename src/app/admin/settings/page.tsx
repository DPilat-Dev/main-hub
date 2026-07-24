import { getSettings } from "@/lib/settings";
import { saveSettings } from "@/app/admin/actions";
import { Field, Input, Textarea, Toggle, SubmitButton } from "@/components/admin/fields";
import { MediaPicker } from "@/components/admin/MediaPicker";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const s = await getSettings();

  return (
    <div className="max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Site settings</h1>
        <p className="text-sm text-[var(--color-muted)]">
          These control the hero, footer, and contact links across the site.
        </p>
      </header>

      <form action={saveSettings} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <Input name="name" defaultValue={s.name} required />
          </Field>
          <Field label="Role">
            <Input name="role" defaultValue={s.role} required />
          </Field>
        </div>

        <Field label="Tagline" hint="Short one-liner.">
          <Textarea name="tagline" defaultValue={s.tagline} rows={2} />
        </Field>

        <Field label="Intro" hint="The paragraph under the hero heading.">
          <Textarea name="intro" defaultValue={s.intro} rows={4} />
        </Field>

        <Field
          label="Hero phrases"
          hint="One per line — these cycle in the typing animation after “I build”."
        >
          <Textarea
            name="heroPhrases"
            defaultValue={s.heroPhrases.join("\n")}
            rows={4}
          />
        </Field>

        <Field
          label="Hero image"
          hint="Optional — shows beside the hero. Leave empty to keep the current full-width layout."
        >
          <MediaPicker name="heroImage" defaultValue={s.heroImage} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email">
            <Input name="email" type="email" defaultValue={s.email} />
          </Field>
          <Field label="Location">
            <Input name="location" defaultValue={s.location} />
          </Field>
          <Field label="GitHub URL">
            <Input name="githubUrl" defaultValue={s.githubUrl} />
          </Field>
          <Field label="LinkedIn URL">
            <Input name="linkedinUrl" defaultValue={s.linkedinUrl} />
          </Field>
        </div>

        <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-5">
          <Toggle
            name="availableForWork"
            label="Show “available for work” badge"
            defaultChecked={s.availableForWork}
          />
          <SubmitButton>Save settings</SubmitButton>
        </div>
      </form>
    </div>
  );
}

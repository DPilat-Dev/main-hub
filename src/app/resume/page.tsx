import type { Metadata } from "next";
import {
  FiDownload,
  FiBriefcase,
  FiBookOpen,
  FiMail,
  FiMapPin,
} from "react-icons/fi";
import { resume } from "@/lib/resume";
import { site } from "@/lib/site";
import { SocialLinks } from "@/components/site/SocialLinks";

export const metadata: Metadata = {
  title: "Resume",
  description: `${resume.name} — ${resume.title}. ${resume.summary}`,
};

export default function ResumePage() {
  return (
    <div className="container-page max-w-4xl py-14">
      {/* Header */}
      <header className="flex flex-col gap-5 border-b border-[var(--color-border)] pb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {resume.name}
          </h1>
          <p className="mt-1 text-lg accent-gradient-text font-semibold">
            {resume.title}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--color-muted)]">
            <span className="inline-flex items-center gap-1.5">
              <FiMapPin className="h-4 w-4" /> {site.location}
            </span>
            <a
              href={site.socials.email}
              className="inline-flex items-center gap-1.5 hover:text-[var(--color-foreground)]"
            >
              <FiMail className="h-4 w-4" /> {site.email}
            </a>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 sm:items-end">
          <a href="/David-Pilat-Resume.pdf" download className="btn btn-primary">
            <FiDownload className="h-4 w-4" /> Download PDF
          </a>
          <SocialLinks />
        </div>
      </header>

      {/* Summary */}
      <section className="py-8">
        <p className="text-lg leading-relaxed text-[var(--color-muted)]">
          {resume.summary}
        </p>
      </section>

      <div className="grid gap-10 lg:grid-cols-[1fr_260px]">
        {/* Main column */}
        <div className="order-2 lg:order-1">
          {/* Experience */}
          <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
            <FiBriefcase className="h-5 w-5 text-[var(--color-accent-soft)]" />
            Experience
          </h2>

          <div className="relative space-y-8 border-l border-[var(--color-border)] pl-6">
            {resume.experience.map((job, i) => (
              <div key={i} className="relative">
                <span className="absolute -left-[29px] top-1.5 h-3 w-3 rounded-full border-2 border-[var(--color-bg)] bg-[var(--color-accent)]" />
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <h3 className="text-lg font-semibold">
                    {job.title}{" "}
                    <span className="text-[var(--color-accent-soft)]">
                      · {job.company}
                    </span>
                  </h3>
                  <span className="text-sm text-[var(--color-faint)]">
                    {job.start} – {job.end}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-faint)]">
                  {job.location}
                </p>
                <p className="mt-2 text-[var(--color-muted)]">{job.summary}</p>
                <ul className="mt-3 space-y-1.5">
                  {job.highlights.map((h, j) => (
                    <li
                      key={j}
                      className="flex gap-2.5 text-sm text-[var(--color-muted)]"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--color-accent-soft)]" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Education */}
          <h2 className="mt-12 mb-6 flex items-center gap-2 text-xl font-bold">
            <FiBookOpen className="h-5 w-5 text-[var(--color-accent-soft)]" />
            Education
          </h2>
          <div className="space-y-4">
            {resume.education.map((ed, i) => (
              <div key={i} className="card p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <h3 className="font-semibold">{ed.credential}</h3>
                  <span className="text-sm text-[var(--color-faint)]">
                    {ed.date}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-accent-soft)]">
                  {ed.school} · {ed.location}
                </p>
                {ed.detail && (
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    {ed.detail}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: skills */}
        <aside className="order-1 lg:order-2">
          <div className="lg:sticky lg:top-24">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-faint)]">
              Skills
            </h2>
            <div className="space-y-5">
              {resume.skills.map((group) => (
                <div key={group.label}>
                  <h3 className="mb-2 text-sm font-medium text-[var(--color-foreground)]">
                    {group.label}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {group.skills.map((s) => (
                      <span key={s} className="chip">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

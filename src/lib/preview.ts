import type { Project } from "@prisma/client";

/**
 * Returns an image URL to preview a project:
 *  1. an explicit coverImage if set (manual override), else
 *  2. an auto-generated screenshot of the live site, else
 *  3. null (the UI shows a placeholder).
 *
 * The screenshot provider base is overridable via NEXT_PUBLIC_SCREENSHOT_BASE
 * so you can swap services or self-host later without touching components.
 */
export function getProjectPreview(
  project: Pick<Project, "coverImage" | "liveUrl">,
): string | null {
  if (project.coverImage) return project.coverImage;
  if (!project.liveUrl) return null;

  const base =
    process.env.NEXT_PUBLIC_SCREENSHOT_BASE ??
    "https://image.thum.io/get/width/1000/crop/750/noanimate";

  // thum.io expects the target URL appended raw (not query-encoded).
  return `${base}/${project.liveUrl}`;
}

import { prisma, safeQuery } from "./prisma";
import { site } from "./site";

export type SiteSettings = {
  name: string;
  role: string;
  tagline: string;
  intro: string;
  heroPhrases: string[];
  email: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
  heroImage: string;
  heroImageShape: "square" | "circle" | "portrait";
  heroImagePosition: "left" | "right";
  heroImageRing: boolean;
  availableForWork: boolean;
  socials: { github: string; linkedin: string; email: string };
};

// Reads the singleton settings row, falling back to the code defaults in
// site.ts for any blank field — so the site works before anything is saved.
export async function getSettings(): Promise<SiteSettings> {
  const row = await safeQuery(
    () => prisma.siteSettings.findUnique({ where: { id: 1 } }),
    null,
  );

  const email = row?.email || site.email;
  const github = row?.githubUrl || site.socials.github;
  const linkedin = row?.linkedinUrl || site.socials.linkedin;

  return {
    name: row?.name || site.name,
    role: row?.role || site.role,
    tagline: row?.tagline || site.tagline,
    intro: row?.intro || site.intro,
    heroPhrases:
      row?.heroPhrases && row.heroPhrases.length > 0
        ? row.heroPhrases
        : [...site.heroPhrases],
    email,
    location: row?.location || site.location,
    githubUrl: github,
    linkedinUrl: linkedin,
    heroImage: row?.heroImage || "",
    heroImageShape:
      (row?.heroImageShape as SiteSettings["heroImageShape"]) || "square",
    heroImagePosition:
      (row?.heroImagePosition as SiteSettings["heroImagePosition"]) || "right",
    heroImageRing: row?.heroImageRing ?? false,
    availableForWork: row?.availableForWork ?? true,
    socials: { github, linkedin, email: `mailto:${email}` },
  };
}

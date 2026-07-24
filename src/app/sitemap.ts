import type { MetadataRoute } from "next";
import { prisma, safeQuery } from "@/lib/prisma";
import { site } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url;

  const [projects, posts] = await Promise.all([
    safeQuery(
      () =>
        prisma.project.findMany({ select: { slug: true, updatedAt: true } }),
      [],
    ),
    safeQuery(
      () =>
        prisma.post.findMany({
          where: { published: true },
          select: { slug: true, updatedAt: true },
        }),
      [],
    ),
  ]);

  const staticRoutes = ["", "/resume", "/projects", "/uses", "/blog"].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    }),
  );

  const projectRoutes = projects.map((p) => ({
    url: `${base}/projects/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const postRoutes = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes, ...postRoutes];
}

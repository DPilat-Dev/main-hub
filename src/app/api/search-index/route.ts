import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { site } from "@/lib/site";

export const revalidate = 60;

export async function GET() {
  const [projects, posts] = await Promise.all([
    prisma.project.findMany({
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
      select: { title: true, slug: true, summary: true },
    }),
    prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      select: { title: true, slug: true, excerpt: true },
    }),
  ]);

  const items = [
    ...site.nav.map((n) => ({
      type: "Page",
      title: n.label,
      href: n.href,
      hint: "",
    })),
    ...projects.map((p) => ({
      type: "Project",
      title: p.title,
      href: `/projects/${p.slug}`,
      hint: p.summary ?? "",
    })),
    ...posts.map((p) => ({
      type: "Post",
      title: p.title,
      href: `/blog/${p.slug}`,
      hint: p.excerpt ?? "",
    })),
  ];

  return NextResponse.json({ items });
}

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  const name = process.env.ADMIN_NAME ?? "Admin";

  // ── Admin user ────────────────────────────────────────────
  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await prisma.user.upsert({
    where: { email },
    update: { name, passwordHash },
    create: { email, name, passwordHash, role: "ADMIN" },
  });
  console.log(`✔ Admin user ready: ${admin.email}`);

  // ── Projects (showcase) ───────────────────────────────────
  const projects = [
    {
      slug: "ondemand-restoration",
      title: "OnDemand Restoration",
      summary:
        "Marketing and lead-generation site for a restoration services company.",
      tech: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
      liveUrl: "https://www.ondemandrs.com/",
      featured: true,
      sortOrder: 1,
      description:
        "<p>A fast, modern marketing site built to convert visitors into leads for a restoration services business, with clear service breakdowns and contact flows.</p>",
    },
    {
      slug: "glossa-babel",
      title: "Glossa Babel",
      summary: "Language-focused web application deployed on Vercel.",
      tech: ["Next.js", "React", "TypeScript", "Vercel"],
      liveUrl: "https://glossa-babel.vercel.app/",
      featured: true,
      sortOrder: 2,
      description:
        "<p>A language-oriented web app exploring translation and learning workflows, shipped continuously on Vercel.</p>",
    },
    {
      slug: "genuine-flooring",
      title: "Genuine Flooring",
      summary: "Business website for a flooring company.",
      tech: ["Next.js", "React", "Tailwind CSS"],
      liveUrl: "https://genuine-flooring.com/",
      featured: true,
      sortOrder: 3,
      description:
        "<p>A clean, responsive business site showcasing flooring services and portfolio work, optimized for local search and conversions.</p>",
    },
  ];

  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log(`✔ Seeded ${projects.length} projects`);

  // ── Welcome blog post ─────────────────────────────────────
  await prisma.post.upsert({
    where: { slug: "hello-world" },
    update: {},
    create: {
      slug: "hello-world",
      title: "Building My Hub: Resume, Projects, and Writing",
      excerpt:
        "Why I built this site, the stack behind it, and what I plan to write about.",
      tags: ["meta", "nextjs", "dotnet"],
      published: true,
      publishedAt: new Date(),
      authorId: admin.id,
      content: `
        <p>Welcome to my corner of the internet. This site is my hub — a place for my
        resume, the projects I've shipped, and writing about building reliable software.</p>
        <h2>Why build it from scratch?</h2>
        <p>After years stabilizing SaaS platforms, I wanted one place I fully control:
        a dark, fast, modern site with a real content engine behind it rather than a
        static template.</p>
        <h2>The stack</h2>
        <ul>
          <li><strong>Next.js</strong> (App Router) + TypeScript</li>
          <li><strong>Tailwind CSS</strong> for the design system</li>
          <li><strong>PostgreSQL</strong> + Prisma for content</li>
          <li><strong>Auth.js</strong> for the admin area and a custom WYSIWYG editor</li>
        </ul>
        <p>More posts coming on .NET, CI/CD, and keeping production boring.</p>
      `,
    },
  });
  console.log("✔ Seeded welcome post");

  // ── Private dashboard links ───────────────────────────────
  const links = [
    {
      title: "GitHub",
      url: "https://github.com/DPilat-Dev",
      category: "Accounts",
      description: "Source repositories",
      sortOrder: 1,
    },
    {
      title: "Vercel Dashboard",
      url: "https://vercel.com/dashboard",
      category: "Hosting",
      description: "Deployments & domains",
      sortOrder: 2,
    },
  ];
  for (const l of links) {
    const existing = await prisma.dashboardLink.findFirst({
      where: { title: l.title },
    });
    if (!existing) await prisma.dashboardLink.create({ data: l });
  }
  console.log(`✔ Seeded dashboard links`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

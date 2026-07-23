"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/format";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session;
}

function toStr(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

function parseTags(v: FormDataEntryValue | null): string[] {
  return toStr(v)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

/* ─────────────────────────── Posts ─────────────────────────── */

export async function savePost(formData: FormData) {
  const session = await requireAdmin();

  const id = toStr(formData.get("id"));
  const title = toStr(formData.get("title"));
  const slug = slugify(toStr(formData.get("slug")) || title);
  const excerpt = toStr(formData.get("excerpt"));
  const content = toStr(formData.get("content"));
  const coverImage = toStr(formData.get("coverImage"));
  const tags = parseTags(formData.get("tags"));
  const published = formData.get("published") === "on";

  if (!title) throw new Error("Title is required");

  const data = {
    title,
    slug,
    excerpt: excerpt || null,
    content,
    coverImage: coverImage || null,
    tags,
    published,
    publishedAt: published ? new Date() : null,
  };

  if (id) {
    // Preserve original publishedAt if it was already published.
    const existing = await prisma.post.findUnique({ where: { id } });
    await prisma.post.update({
      where: { id },
      data: {
        ...data,
        publishedAt: published
          ? (existing?.publishedAt ?? new Date())
          : null,
      },
    });
  } else {
    await prisma.post.create({
      data: { ...data, authorId: session.user.id },
    });
  }

  revalidatePath("/blog");
  revalidatePath("/");
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function deletePost(formData: FormData) {
  await requireAdmin();
  const id = toStr(formData.get("id"));
  if (id) await prisma.post.delete({ where: { id } });
  revalidatePath("/blog");
  revalidatePath("/admin/posts");
}

/* ────────────────────────── Projects ───────────────────────── */

export async function saveProject(formData: FormData) {
  await requireAdmin();

  const id = toStr(formData.get("id"));
  const title = toStr(formData.get("title"));
  const slug = slugify(toStr(formData.get("slug")) || title);
  const summary = toStr(formData.get("summary"));
  const description = toStr(formData.get("description"));
  const coverImage = toStr(formData.get("coverImage"));
  const tech = parseTags(formData.get("tech"));
  const liveUrl = toStr(formData.get("liveUrl"));
  const repoUrl = toStr(formData.get("repoUrl"));
  const featured = formData.get("featured") === "on";
  const sortOrder = parseInt(toStr(formData.get("sortOrder")) || "0", 10) || 0;

  if (!title) throw new Error("Title is required");

  const data = {
    title,
    slug,
    summary,
    description,
    coverImage: coverImage || null,
    tech,
    liveUrl: liveUrl || null,
    repoUrl: repoUrl || null,
    featured,
    sortOrder,
  };

  if (id) {
    await prisma.project.update({ where: { id }, data });
  } else {
    await prisma.project.create({ data });
  }

  revalidatePath("/projects");
  revalidatePath("/");
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function deleteProject(formData: FormData) {
  await requireAdmin();
  const id = toStr(formData.get("id"));
  if (id) await prisma.project.delete({ where: { id } });
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
}

/* ──────────────────────── Dashboard links ──────────────────── */

export async function saveLink(formData: FormData) {
  await requireAdmin();

  const id = toStr(formData.get("id"));
  const title = toStr(formData.get("title"));
  const url = toStr(formData.get("url"));
  const description = toStr(formData.get("description"));
  const category = toStr(formData.get("category")) || "General";
  const sortOrder = parseInt(toStr(formData.get("sortOrder")) || "0", 10) || 0;

  if (!title || !url) throw new Error("Title and URL are required");

  const data = { title, url, description: description || null, category, sortOrder };

  if (id) {
    await prisma.dashboardLink.update({ where: { id }, data });
  } else {
    await prisma.dashboardLink.create({ data });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/links");
}

export async function deleteLink(formData: FormData) {
  await requireAdmin();
  const id = toStr(formData.get("id"));
  if (id) await prisma.dashboardLink.delete({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/admin/links");
}

/* ─────────────────────────── Auth ──────────────────────────── */

export async function doSignOut() {
  await signOut({ redirectTo: "/" });
}

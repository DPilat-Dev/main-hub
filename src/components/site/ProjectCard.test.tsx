import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Project } from "@prisma/client";
import { ProjectCard } from "./ProjectCard";

function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    id: "p1",
    slug: "glossa-babel",
    title: "Glossa Babel",
    summary: "A language-focused web app.",
    description: "",
    coverImage: null,
    tech: ["Next.js", "TypeScript", "Vercel"],
    liveUrl: "https://glossa-babel.vercel.app/",
    repoUrl: null,
    featured: true,
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe("ProjectCard", () => {
  it("renders title, summary, and tech chips", () => {
    render(<ProjectCard project={makeProject()} />);
    expect(screen.getByText("Glossa Babel")).toBeInTheDocument();
    expect(screen.getByText("A language-focused web app.")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
  });

  it("shows a Live link when liveUrl is set, hides Code when repoUrl is null", () => {
    render(<ProjectCard project={makeProject()} />);
    const live = screen.getByRole("link", { name: /live/i });
    expect(live).toHaveAttribute("href", "https://glossa-babel.vercel.app/");
    expect(screen.queryByText(/code/i)).not.toBeInTheDocument();
  });

  it("links to the project detail page", () => {
    render(<ProjectCard project={makeProject()} />);
    const detail = screen.getByRole("link", { name: "Glossa Babel" });
    expect(detail).toHaveAttribute("href", "/projects/glossa-babel");
  });

  it("caps displayed tech chips at four", () => {
    render(
      <ProjectCard
        project={makeProject({ tech: ["a", "b", "c", "d", "e", "f"] })}
      />,
    );
    expect(screen.getByText("a")).toBeInTheDocument();
    expect(screen.queryByText("e")).not.toBeInTheDocument();
  });
});

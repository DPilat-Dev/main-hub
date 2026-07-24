import { FiGithub, FiStar, FiGitBranch, FiArrowUpRight } from "react-icons/fi";
import { getGitHub } from "@/lib/github";
import { site } from "@/lib/site";

// Small language → color map for the repo dot.
const langColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  "C#": "#178600",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Go: "#00ADD8",
  Rust: "#dea584",
};

export async function GitHubSection() {
  const data = await getGitHub(site.githubUser);
  if (!data) return null;

  const stats = [
    { label: "Repositories", value: data.publicRepos },
    { label: "Followers", value: data.followers },
    { label: "Following", value: data.following },
  ];

  return (
    <section className="mt-20">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="section-title">On GitHub</h2>
          <p className="mt-1 text-[var(--color-muted)]">
            What I&apos;ve been building in the open.
          </p>
        </div>
        <a
          href={data.htmlUrl}
          target="_blank"
          rel="noreferrer"
          className="hidden items-center gap-1 text-sm text-[var(--color-accent-soft)] hover:underline sm:inline-flex"
        >
          @{data.login} <FiArrowUpRight className="h-4 w-4" />
        </a>
      </div>

      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        {/* Profile stats */}
        <div className="card flex flex-col justify-center gap-3 p-5">
          <FiGithub className="h-6 w-6 text-[var(--color-foreground)]" />
          {stats.map((s) => (
            <div key={s.label} className="flex items-baseline justify-between">
              <span className="text-sm text-[var(--color-muted)]">
                {s.label}
              </span>
              <span className="text-lg font-semibold">{s.value}</span>
            </div>
          ))}
        </div>

        {/* Top repos */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {data.repos.map((repo) => (
            <a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="card card-hover group flex flex-col p-4"
            >
              <div className="flex items-center justify-between">
                <span className="truncate font-medium text-[var(--color-foreground)] group-hover:text-[var(--color-accent-soft)]">
                  {repo.name}
                </span>
                <FiArrowUpRight className="h-4 w-4 shrink-0 text-[var(--color-faint)] group-hover:text-[var(--color-accent-soft)]" />
              </div>
              {repo.description && (
                <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-[var(--color-muted)]">
                  {repo.description}
                </p>
              )}
              <div className="mt-3 flex items-center gap-4 text-xs text-[var(--color-faint)]">
                {repo.language && (
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          langColors[repo.language] ?? "var(--color-faint)",
                      }}
                    />
                    {repo.language}
                  </span>
                )}
                {repo.stars > 0 && (
                  <span className="inline-flex items-center gap-1">
                    <FiStar className="h-3.5 w-3.5" /> {repo.stars}
                  </span>
                )}
                {repo.forks > 0 && (
                  <span className="inline-flex items-center gap-1">
                    <FiGitBranch className="h-3.5 w-3.5" /> {repo.forks}
                  </span>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// Lightweight GitHub fetch — cached for an hour. Works unauthenticated;
// set GITHUB_TOKEN for a higher rate limit and private counts.

const API = "https://api.github.com";

export type GitHubRepo = {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  pushedAt: string;
};

export type GitHubData = {
  login: string;
  name: string | null;
  avatarUrl: string;
  htmlUrl: string;
  publicRepos: number;
  followers: number;
  following: number;
  repos: GitHubRepo[];
};

async function gh<T>(path: string): Promise<T | null> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "main-hub",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  try {
    const res = await fetch(`${API}${path}`, {
      headers,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

type RawUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
};

type RawRepo = {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
};

export async function getGitHub(user: string): Promise<GitHubData | null> {
  const [profile, repos] = await Promise.all([
    gh<RawUser>(`/users/${user}`),
    gh<RawRepo[]>(`/users/${user}/repos?per_page=100&sort=updated`),
  ]);
  if (!profile) return null;

  const top = (repos ?? [])
    .filter((r) => !r.fork && !r.archived)
    .sort(
      (a, b) =>
        b.stargazers_count - a.stargazers_count ||
        new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime(),
    )
    .slice(0, 6)
    .map<GitHubRepo>((r) => ({
      name: r.name,
      description: r.description,
      url: r.html_url,
      language: r.language,
      stars: r.stargazers_count,
      forks: r.forks_count,
      pushedAt: r.pushed_at,
    }));

  return {
    login: profile.login,
    name: profile.name,
    avatarUrl: profile.avatar_url,
    htmlUrl: profile.html_url,
    publicRepos: profile.public_repos,
    followers: profile.followers,
    following: profile.following,
    repos: top,
  };
}

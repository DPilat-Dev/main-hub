// Content for the /uses page. Hardware specs live in lib/hardware.ts; this file
// holds the self-hosted services and the software stack as simple grouped lists.

export type Group = { label: string; items: string[] };

// Self-hosted on the Proxmox homelab.
export const selfHosted: Group[] = [
  { label: "Media", items: ["Jellyfin", "Plex", "Emby", "Wizarr"] },
  {
    label: "Monitoring",
    items: ["Grafana", "Prometheus", "Blackbox Exporter", "PVE Exporter"],
  },
  {
    label: "Networking",
    items: ["Nginx Proxy Manager", "Cloudflare Tunnel", "Pi-hole"],
  },
  {
    label: "Apps & Dashboards",
    items: ["Homarr", "AMP Game Servers", "Docker", "Neko Browser"],
  },
];

// Languages, frameworks, and tools I build with.
export const stack: Group[] = [
  {
    label: "Languages",
    items: ["C#", "TypeScript", "JavaScript", "Java", "SQL", "HTML/CSS"],
  },
  {
    label: "Frameworks & Runtime",
    items: [".NET", "ASP.NET", "Entity Framework", "React", "Next.js", "Node.js"],
  },
  {
    label: "Data",
    items: ["SQL Server", "PostgreSQL", "Prisma", "ETL / Data Engineering", "NoSQL"],
  },
  {
    label: "Cloud & DevOps",
    items: ["Azure", "AWS", "Docker", "GitHub Actions", "CI/CD", "Proxmox"],
  },
  {
    label: "Editors & AI",
    items: ["Visual Studio", "VS Code", "Claude Code", "Git / GitHub"],
  },
];

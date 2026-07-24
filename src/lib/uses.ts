// Content for the /uses page. Edit freely — it's just data.
// Inspired by https://uses.tech

export type UsesItem = {
  name: string;
  description: string;
  url?: string;
};

export type UsesCategory = {
  label: string;
  icon: "cpu" | "server" | "code" | "monitor";
  items: UsesItem[];
};

export const uses: UsesCategory[] = [
  {
    label: "Homelab & Self-hosting",
    icon: "server",
    items: [
      {
        name: "Proxmox VE",
        description:
          "Hypervisor running my homelab — VMs and LXC containers for the apps and services I self-host.",
        url: "https://www.proxmox.com/",
      },
      {
        name: "Docker & Docker Compose",
        description:
          "How I package and run most self-hosted services, with reproducible setups.",
      },
      {
        name: "Reverse proxy + subdomains",
        description:
          "A reverse proxy fronts my services and maps them to subdomains behind HTTPS.",
      },
    ],
  },
  {
    label: "Workstation & Hardware",
    icon: "cpu",
    items: [
      {
        name: "Primary dev machine",
        description:
          "My daily driver for .NET and web development. (Update with your exact specs.)",
      },
      {
        name: "Displays & peripherals",
        description:
          "Multi-monitor setup with a mechanical keyboard. (Swap in your real gear.)",
      },
    ],
  },
  {
    label: "Software & Dev Tools",
    icon: "code",
    items: [
      {
        name: "Visual Studio / VS Code",
        description: "Primary editors for C#/.NET and TypeScript work.",
      },
      {
        name: "Claude Code",
        description:
          "AI in my engineering loop — including building this very site.",
        url: "https://claude.com/claude-code",
      },
      {
        name: ".NET, Next.js, PostgreSQL",
        description:
          "The stack I reach for most, from enterprise SaaS to personal projects.",
      },
      {
        name: "Git & GitHub Actions",
        description: "Version control and CI/CD for reliable, repeatable releases.",
      },
    ],
  },
];

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
    label: "Homelab — Server (zeus)",
    icon: "server",
    items: [
      {
        name: "Proxmox VE 8.4",
        description:
          "Hypervisor running my homelab on an Intel Core i7-14700K (20 cores / 28 threads) with 94 GB RAM — VMs and LXC containers for everything I self-host.",
        url: "https://www.proxmox.com/",
      },
      {
        name: "Docker & Docker Compose",
        description:
          "How I package and run most self-hosted services, with reproducible setups.",
      },
      {
        name: "Nginx Proxy Manager + Cloudflare Tunnel",
        description:
          "Fronts my services and maps them to subdomains over HTTPS — no ports exposed.",
      },
      {
        name: "Prometheus + Grafana + Blackbox",
        description:
          "Monitoring stack for metrics, dashboards, and real uptime/latency probes (which power the live status on my homepage).",
      },
      {
        name: "Media & apps",
        description:
          "Jellyfin, Plex, Emby, Pi-hole, Homarr, AMP game servers, and more — all in isolated LXC containers.",
      },
    ],
  },
  {
    label: "Storage — Synology NAS",
    icon: "server",
    items: [
      {
        name: "Volume 1 — 27.93 TB",
        description: "RAID 5 array of 8 TB drives.",
      },
      {
        name: "Volume 3 — 52.36 TB",
        description:
          "SHR with 1-drive fault tolerance, 4 × 20 TB drives.",
      },
      {
        name: "Volume 2 — 1.8 TB",
        description: "SHR, a single 2 TB drive.",
      },
    ],
  },
  {
    label: "Workstation",
    icon: "cpu",
    items: [
      {
        name: "AMD Ryzen 9 5900X",
        description: "12 cores / 24 threads — my daily driver for development.",
      },
      {
        name: "AMD Radeon RX 9070 XT",
        description: "Handles graphics, encoding, and the occasional game.",
      },
      {
        name: "64 GB RAM · 1 TB NVMe",
        description: "Plenty of headroom for containers, VMs, and builds.",
      },
      {
        name: "Arch Linux",
        description: "A fast, minimal, rolling-release setup I control end to end.",
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

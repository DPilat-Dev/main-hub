// Reads a sanitized status feed from your homelab (served by the collector in
// scripts/homelab-status). Set HOMELAB_STATUS_URL to enable live data; without
// it, the section shows a tasteful static "self-hosted on Proxmox" card.

export type HomelabService = {
  name: string;
  category: string;
  status: "running" | "stopped" | "down" | string;
  responseMs?: number | null;
  httpStatus?: number | null;
  sslDaysLeft?: number | null;
  uptimePct?: number | null; // 24h availability
};

export type HomelabStatus = {
  updatedAt: string;
  source?: "blackbox" | "proxmox" | string;
  node: {
    name: string;
    status: string;
    uptimeSeconds: number;
    cpu: number; // 0..1
    memUsed: number; // GiB
    memTotal: number; // GiB
    cpuHistory?: number[]; // 24h, percent
    memHistory?: number[]; // 24h, percent
  };
  services: HomelabService[];
  counts: { running: number; total: number };
  nas?: {
    totalTb: number;
    volumes: {
      name: string;
      usedTb: number;
      totalTb: number;
      pct: number;
    }[];
  } | null;
};

export async function getHomelabStatus(): Promise<HomelabStatus | null> {
  const url = process.env.HOMELAB_STATUS_URL;
  if (!url) return null;
  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
      headers: process.env.HOMELAB_STATUS_TOKEN
        ? { Authorization: `Bearer ${process.env.HOMELAB_STATUS_TOKEN}` }
        : undefined,
    });
    if (!res.ok) return null;
    return (await res.json()) as HomelabStatus;
  } catch {
    return null;
  }
}

export function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  if (d > 0) return `${d}d ${h}h`;
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

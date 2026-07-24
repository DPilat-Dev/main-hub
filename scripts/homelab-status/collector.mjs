#!/usr/bin/env node
// Homelab status collector
// ------------------------------------------------------------------
// Runs on your LAN and serves a small sanitized JSON for your website.
//   • Node stats (uptime, CPU, RAM) come from the Proxmox API (read-only).
//   • Service health comes from your Blackbox exporter if BLACKBOX_URL is set
//     (real up/down + response time + SSL expiry). Otherwise it falls back to
//     "is the LXC running" from Proxmox.
//
// Run:
//   PVE_HOST=192.168.1.24 \
//   PVE_TOKEN='root@pam!claude-readonly=YOUR-SECRET' \
//   BLACKBOX_URL='http://192.168.1.66:9115' \
//   node collector.mjs

import http from "node:http";
import https from "node:https";

const PVE_HOST = process.env.PVE_HOST ?? "192.168.1.24";
const PVE_PORT = Number(process.env.PVE_PORT ?? 8006);
const PVE_TOKEN = process.env.PVE_TOKEN ?? ""; // USER@REALM!ID=SECRET
const LISTEN_PORT = Number(process.env.LISTEN_PORT ?? 8787);
const STATUS_TOKEN = process.env.STATUS_TOKEN ?? ""; // optional bearer to protect the endpoint
const BLACKBOX_URL = process.env.BLACKBOX_URL ?? ""; // e.g. http://192.168.1.66:9115

// ── Blackbox probe targets ─────────────────────────────────────────
// The real URLs to check. Edit freely — only these are exposed publicly.
const PROBE_MODULE = process.env.PROBE_MODULE ?? "http_2xx";

// ── Service allowlist ──────────────────────────────────────────────
// Every container here is reported with its Proxmox running status.
// Add an optional `url` to also get live response time + SSL expiry from
// Blackbox. Key = Proxmox vmid. Remove anything you don't want public.
const SERVICES = {
  100: { name: "Homarr", category: "Dashboard" },
  101: { name: "Jellyfin", category: "Media" },
  102: { name: "AMP Game Servers", category: "Apps" },
  103: { name: "Nginx Proxy Manager", category: "Networking" },
  104: { name: "Cloudflare Tunnel", category: "Networking" },
  105: { name: "Emby", category: "Media" },
  106: { name: "OnDemand Restoration", category: "Sites", url: "https://www.ondemandrs.com" },
  107: { name: "Pi-hole", category: "Networking" },
  108: { name: "Plex", category: "Media" },
  109: { name: "Docker", category: "Apps" },
  110: { name: "Blackbox Exporter", category: "Monitoring" },
  111: { name: "Grafana", category: "Monitoring" },
  112: { name: "Prometheus", category: "Monitoring" },
  113: { name: "PVE Exporter", category: "Monitoring" },
  114: { name: "Neko Browser", category: "Apps" },
  115: { name: "Wizarr", category: "Media" },
};

// ── HTTP helpers ───────────────────────────────────────────────────
function get(url, { headers = {}, insecure = false } = {}) {
  const lib = url.startsWith("https") ? https : http;
  return new Promise((resolve, reject) => {
    const req = lib.request(
      url,
      { method: "GET", headers, rejectUnauthorized: !insecure, timeout: 10000 },
      (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () => resolve(body));
      },
    );
    req.on("error", reject);
    req.on("timeout", () => req.destroy(new Error("request timed out")));
    req.end();
  });
}

async function pveGet(path) {
  const body = await get(
    `https://${PVE_HOST}:${PVE_PORT}/api2/json${path}`,
    { headers: { Authorization: `PVEAPIToken=${PVE_TOKEN}` }, insecure: true },
  );
  return JSON.parse(body).data;
}

// Parse a single metric value out of Blackbox's text exposition.
function metric(text, name) {
  const m = text.match(new RegExp(`^${name}\\s+([0-9.e+-]+)`, "m"));
  return m ? Number(m[1]) : null;
}

// Ask Blackbox for a URL's health (latency + SSL expiry). Best-effort.
async function probeUrl(url) {
  try {
    const text = await get(
      `${BLACKBOX_URL}/probe?target=${encodeURIComponent(url)}&module=${PROBE_MODULE}`,
    );
    const success = metric(text, "probe_success");
    const duration = metric(text, "probe_duration_seconds");
    const certExpiry = metric(text, "probe_ssl_earliest_cert_expiry");
    return {
      ok: success === 1,
      responseMs: duration != null ? Math.round(duration * 1000) : null,
      sslDaysLeft:
        certExpiry && certExpiry > 0
          ? Math.round((certExpiry * 1000 - Date.now()) / 86400000)
          : null,
    };
  } catch {
    return null;
  }
}

async function buildStatus() {
  const resources = await pveGet("/cluster/resources");
  const node = resources.find((r) => r.type === "node");
  const guests = resources.filter((r) => r.type === "lxc" || r.type === "qemu");

  // Every allowlisted container, with its Proxmox running status.
  const services = await Promise.all(
    guests
      .filter((g) => SERVICES[g.vmid])
      .map(async (g) => {
        const cfg = SERVICES[g.vmid];
        const svc = { name: cfg.name, category: cfg.category, status: g.status };
        // Enrich with live response time where a public URL is configured.
        if (cfg.url && BLACKBOX_URL && g.status === "running") {
          const p = await probeUrl(cfg.url);
          if (p) {
            svc.responseMs = p.responseMs;
            svc.sslDaysLeft = p.sslDaysLeft;
            if (!p.ok) svc.status = "down";
          }
        }
        return svc;
      }),
  );

  services.sort(
    (a, b) =>
      a.category.localeCompare(b.category) || a.name.localeCompare(b.name),
  );

  const running = services.filter((s) => s.status === "running").length;

  return {
    updatedAt: new Date().toISOString(),
    source: BLACKBOX_URL ? "blackbox" : "proxmox",
    node: {
      name: node?.node ?? "unknown",
      status: node?.status ?? "unknown",
      uptimeSeconds: node?.uptime ?? 0,
      cpu: node?.cpu ?? 0,
      memUsed: Math.round((node?.mem ?? 0) / 1024 ** 3),
      memTotal: Math.round((node?.maxmem ?? 1) / 1024 ** 3),
    },
    services,
    counts: { running, total: services.length },
  };
}

http
  .createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=30");

    if (STATUS_TOKEN) {
      if ((req.headers.authorization ?? "") !== `Bearer ${STATUS_TOKEN}`) {
        res.writeHead(401).end("Unauthorized");
        return;
      }
    }

    try {
      const status = await buildStatus();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(status));
    } catch (e) {
      res.writeHead(502, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: String(e) }));
    }
  })
  .listen(LISTEN_PORT, () => {
    console.log(`Homelab status collector on :${LISTEN_PORT}`);
    console.log(`Proxmox: https://${PVE_HOST}:${PVE_PORT}`);
    console.log(BLACKBOX_URL ? `Blackbox: ${BLACKBOX_URL}` : "Blackbox: (not set — using Proxmox LXC status)");
  });

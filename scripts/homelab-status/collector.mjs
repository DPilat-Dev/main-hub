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
const PROBES = [
  { name: "OnDemand Restoration", category: "Sites", url: "https://www.ondemandrs.com" },
  { name: "Glossa Babel", category: "Sites", url: "https://glossa-babel.vercel.app" },
  { name: "Genuine Flooring", category: "Sites", url: "https://genuine-flooring.com" },
  // Add your homelab subdomains (fronted by Nginx Proxy Manager), e.g.:
  // { name: "Grafana", category: "Monitoring", url: "https://grafana.yourdomain.com" },
  // { name: "Jellyfin", category: "Media", url: "https://jellyfin.yourdomain.com" },
];
const PROBE_MODULE = process.env.PROBE_MODULE ?? "http_2xx";

// ── Fallback: expose "is the LXC running" from Proxmox ─────────────
// Used only when BLACKBOX_URL is not set. Key = Proxmox vmid.
const SERVICES = {
  100: { name: "Homarr", category: "Dashboard" },
  101: { name: "Jellyfin", category: "Media" },
  102: { name: "AMP Game Servers", category: "Apps" },
  103: { name: "Nginx Proxy Manager", category: "Networking" },
  104: { name: "Cloudflare Tunnel", category: "Networking" },
  105: { name: "Emby", category: "Media" },
  107: { name: "Pi-hole", category: "Networking" },
  108: { name: "Plex", category: "Media" },
  109: { name: "Docker", category: "Apps" },
  111: { name: "Grafana", category: "Monitoring" },
  112: { name: "Prometheus", category: "Monitoring" },
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

async function probeOne({ name, category, url }) {
  try {
    const text = await get(
      `${BLACKBOX_URL}/probe?target=${encodeURIComponent(url)}&module=${PROBE_MODULE}`,
    );
    const success = metric(text, "probe_success");
    const duration = metric(text, "probe_duration_seconds");
    const httpCode = metric(text, "probe_http_status_code");
    const certExpiry = metric(text, "probe_ssl_earliest_cert_expiry");
    return {
      name,
      category,
      status: success === 1 ? "running" : "down",
      responseMs: duration != null ? Math.round(duration * 1000) : null,
      httpStatus: httpCode ?? null,
      sslDaysLeft:
        certExpiry && certExpiry > 0
          ? Math.round((certExpiry * 1000 - Date.now()) / 86400000)
          : null,
    };
  } catch {
    return { name, category, status: "down", responseMs: null };
  }
}

async function buildStatus() {
  const resources = await pveGet("/cluster/resources");
  const node = resources.find((r) => r.type === "node");
  const guests = resources.filter((r) => r.type === "lxc" || r.type === "qemu");

  let services;
  if (BLACKBOX_URL) {
    services = await Promise.all(PROBES.map(probeOne));
  } else {
    services = guests
      .filter((g) => SERVICES[g.vmid])
      .map((g) => ({
        name: SERVICES[g.vmid].name,
        category: SERVICES[g.vmid].category,
        status: g.status,
      }));
  }
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

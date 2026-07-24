#!/usr/bin/env node
// Homelab status collector
// ------------------------------------------------------------------
// Runs on your LAN, reads the Proxmox API with a READ-ONLY token, and
// serves a small sanitized JSON for your website to consume. Proxmox
// itself never gets exposed — only the curated data below.
//
// Run:
//   PVE_HOST=192.168.1.24 \
//   PVE_TOKEN='root@pam!claude-readonly=YOUR-SECRET' \
//   node collector.mjs
//
// Then point Nginx Proxy Manager at http://<this-host>:8787
// and set HOMELAB_STATUS_URL on Vercel to the public URL.

import http from "node:http";
import https from "node:https";

const PVE_HOST = process.env.PVE_HOST ?? "192.168.1.24";
const PVE_PORT = Number(process.env.PVE_PORT ?? 8006);
const PVE_TOKEN = process.env.PVE_TOKEN ?? ""; // USER@REALM!ID=SECRET
const LISTEN_PORT = Number(process.env.LISTEN_PORT ?? 8787);
const STATUS_TOKEN = process.env.STATUS_TOKEN ?? ""; // optional bearer to protect the endpoint

// Allowlist: only these guests are exposed publicly, with friendly names.
// Key = Proxmox vmid. Edit freely — remove anything you don't want public.
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

function pveGet(path) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        host: PVE_HOST,
        port: PVE_PORT,
        path: `/api2/json${path}`,
        method: "GET",
        headers: { Authorization: `PVEAPIToken=${PVE_TOKEN}` },
        rejectUnauthorized: false, // Proxmox self-signed cert on your LAN
        timeout: 10000,
      },
      (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () => {
          try {
            resolve(JSON.parse(body).data);
          } catch (e) {
            reject(e);
          }
        });
      },
    );
    req.on("error", reject);
    req.on("timeout", () => req.destroy(new Error("Proxmox request timed out")));
    req.end();
  });
}

async function buildStatus() {
  const resources = await pveGet("/cluster/resources");
  const node = resources.find((r) => r.type === "node");
  const guests = resources.filter(
    (r) => r.type === "lxc" || r.type === "qemu",
  );

  const services = guests
    .filter((g) => SERVICES[g.vmid])
    .map((g) => ({
      name: SERVICES[g.vmid].name,
      category: SERVICES[g.vmid].category,
      status: g.status,
    }))
    .sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));

  const running = guests.filter((g) => g.status === "running").length;

  return {
    updatedAt: new Date().toISOString(),
    node: {
      name: node?.node ?? "unknown",
      status: node?.status ?? "unknown",
      uptimeSeconds: node?.uptime ?? 0,
      cpu: node?.cpu ?? 0,
      memUsed: Math.round((node?.mem ?? 0) / 1024 ** 3),
      memTotal: Math.round((node?.maxmem ?? 1) / 1024 ** 3),
    },
    services,
    counts: { running, total: guests.length },
  };
}

http
  .createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=30");

    if (STATUS_TOKEN) {
      const auth = req.headers.authorization ?? "";
      if (auth !== `Bearer ${STATUS_TOKEN}`) {
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
    console.log(`Reading Proxmox at https://${PVE_HOST}:${PVE_PORT}`);
  });

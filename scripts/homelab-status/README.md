# Homelab status collector

A tiny, dependency-free Node service that reads your **Proxmox** API with a
**read-only** token and serves a sanitized JSON for the website's Homelab
section. Proxmox is never exposed to the internet — only the curated data in
`collector.mjs` (`SERVICES` allowlist) is public.

You only need the files in **this folder** — not the whole website repo.

## 1. Run it on your LAN

### Option A — Docker (recommended; use your existing `docker` LXC)

Get this folder onto the server (either clone the repo and `cd` in, or copy the
four files: `collector.mjs`, `Dockerfile`, `docker-compose.yml`, `README.md`):

```bash
git clone https://github.com/DPilat-Dev/main-hub.git
cd main-hub/scripts/homelab-status

# Put your read-only Proxmox token in a .env file (gitignored):
echo "PVE_TOKEN=root@pam!claude-readonly=YOUR-SECRET" > .env

docker compose up -d --build
curl http://localhost:8787 | jq          # test
```

Edit `PVE_HOST` in `docker-compose.yml` if your Proxmox IP differs.

### Option B — plain Node (systemd)

Copy just `collector.mjs` to the server (Node 18+):

```bash
PVE_HOST=192.168.1.24 \
PVE_TOKEN='root@pam!claude-readonly=YOUR-SECRET' \
LISTEN_PORT=8787 \
node collector.mjs

curl http://localhost:8787 | jq          # test
```

### Keep it running (systemd)

`/etc/systemd/system/homelab-status.service`:

```ini
[Unit]
Description=Homelab status collector
After=network.target

[Service]
Environment=PVE_HOST=192.168.1.24
Environment=PVE_TOKEN=root@pam!claude-readonly=YOUR-SECRET
Environment=LISTEN_PORT=8787
ExecStart=/usr/bin/node /opt/homelab-status/collector.mjs
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
systemctl enable --now homelab-status
```

## 2. Expose it via Nginx Proxy Manager

In NPM, add a **Proxy Host**:

- **Domain:** `status.yourdomain.com`
- **Forward Hostname/IP:** the collector's LAN IP
- **Forward Port:** `8787`
- **Block Common Exploits:** on
- **SSL:** request a Let's Encrypt cert (or use your Cloudflare Tunnel)

Since Cloudflared already runs in your homelab, you can instead route
`status.yourdomain.com` through the tunnel to the collector — no ports opened.

## 3. Point the website at it

Set an env var on Vercel (Production + Preview):

```
HOMELAB_STATUS_URL = https://status.yourdomain.com
```

Optionally protect the endpoint: set `STATUS_TOKEN=some-secret` on the collector
**and** `HOMELAB_STATUS_TOKEN=some-secret` on Vercel — the site sends it as a
Bearer token.

Redeploy (or wait for revalidation) and the Homelab section switches from the
static card to **live** node uptime, CPU/RAM, and running services.

## Live service uptime via Blackbox (recommended)

If you run a **Prometheus Blackbox exporter**, the collector can report real
service health — up/down, response time, and SSL cert expiry — instead of just
"is the LXC running".

1. Set `BLACKBOX_URL` (e.g. `http://192.168.1.66:9115`) — already wired in
   `docker-compose.yml`.
2. Edit the `PROBES` list in `collector.mjs` with the URLs you want checked
   (your public sites and homelab subdomains fronted by Nginx Proxy Manager).

The collector calls Blackbox's `/probe` endpoint directly, so **no Prometheus
scrape config is required**. Without `BLACKBOX_URL` it falls back to the Proxmox
`SERVICES` allowlist.

## 24h history via Prometheus (optional)

Set `PROM_URL` (e.g. `http://192.168.1.242:9090`) and the collector adds:

- **Node CPU + memory sparklines** over the last 24h (`pve_cpu_usage_ratio`,
  `pve_memory_usage_bytes`).
- **Per-service 24h uptime %** (`avg_over_time(pve_up[24h])`).

This reuses the `prometheus-pve-exporter` data you already scrape — no extra
Prometheus config needed.

## Live Synology NAS capacity via SNMP (optional)

1. On DSM: **Control Panel → Terminal & SNMP → SNMP** → enable **SNMPv2c** and
   set a read-only **Community** string. Keep it LAN-only.
2. Set `SYNO_HOST` (NAS IP) and `SYNO_COMMUNITY` — already wired in
   `docker-compose.yml`.

The collector reads `hrStorageTable` and reports used/total per `/volumeN`. The
Docker image installs the `net-snmp` dependency automatically; for the plain
Node path, run `npm install` in this folder first.

## Security notes

- The Proxmox token must be **read-only** (`PVEAuditor`). The collector only
  ever issues GET requests.
- Edit the `SERVICES` allowlist in `collector.mjs` to control exactly which
  containers appear publicly. Anything not listed is hidden.
- Rotate the Proxmox token any time from **Datacenter → Permissions → API
  Tokens**.

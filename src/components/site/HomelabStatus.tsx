import { FiServer, FiActivity, FiCircle } from "react-icons/fi";
import { getHomelabStatus, formatUptime } from "@/lib/homelab";

// Curated services shown in the static fallback (before live data is wired up).
const fallbackServices = [
  { name: "Jellyfin", category: "Media" },
  { name: "Plex", category: "Media" },
  { name: "Grafana", category: "Monitoring" },
  { name: "Prometheus", category: "Monitoring" },
  { name: "Pi-hole", category: "Networking" },
  { name: "Nginx Proxy Manager", category: "Networking" },
  { name: "Homarr", category: "Dashboard" },
  { name: "Docker", category: "Apps" },
];

function Meter({ label, value, display }: { label: string; value: number; display: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-[var(--color-muted)]">
        <span>{label}</span>
        <span className="font-mono">{display}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)]"
          style={{ width: `${Math.min(100, Math.max(2, value))}%` }}
        />
      </div>
    </div>
  );
}

export async function HomelabStatus() {
  const status = await getHomelabStatus();
  const live = !!status;

  const services = status?.services ?? fallbackServices;
  const nodeName = status?.node.name ?? "zeus";

  return (
    <section className="mt-20">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="section-title">Homelab</h2>
          <p className="mt-1 text-[var(--color-muted)]">
            I self-host my apps on my own server — {nodeName}, running Proxmox VE.
          </p>
        </div>
        <span className="chip">
          <FiServer className="h-3.5 w-3.5" /> Proxmox VE
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        {/* Node card */}
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm font-semibold">{nodeName}</span>
            <span className="inline-flex items-center gap-1.5 text-xs">
              <span
                className={`h-2 w-2 rounded-full ${
                  live ? "bg-emerald-400" : "bg-[var(--color-faint)]"
                }`}
              />
              {live ? status!.node.status : "online"}
            </span>
          </div>

          {live ? (
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
                <FiActivity className="h-4 w-4 text-[var(--color-accent-soft)]" />
                Uptime {formatUptime(status!.node.uptimeSeconds)}
              </div>
              <Meter
                label="CPU"
                value={status!.node.cpu * 100}
                display={`${Math.round(status!.node.cpu * 100)}%`}
              />
              <Meter
                label="Memory"
                value={(status!.node.memUsed / status!.node.memTotal) * 100}
                display={`${status!.node.memUsed}/${status!.node.memTotal} GB`}
              />
              <div className="pt-1 text-xs text-[var(--color-faint)]">
                {status!.counts.running}/{status!.counts.total} services running
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-[var(--color-muted)]">
              A dedicated server hosting my apps, media, monitoring, and
              networking stack in isolated LXC containers.
            </p>
          )}
        </div>

        {/* Services grid */}
        <div className="card p-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-3">
            {services.map((s) => {
              const running = !("status" in s) || s.status === "running";
              return (
                <div key={s.name} className="flex items-center gap-2 text-sm">
                  <FiCircle
                    className={`h-2 w-2 shrink-0 ${
                      running
                        ? "fill-emerald-400 text-emerald-400"
                        : "fill-[var(--color-faint)] text-[var(--color-faint)]"
                    }`}
                  />
                  <span className="truncate text-[var(--color-foreground)]">
                    {s.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

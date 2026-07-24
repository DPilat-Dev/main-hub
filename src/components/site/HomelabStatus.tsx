import type { IconType } from "react-icons";
import { FiServer, FiActivity, FiCircle } from "react-icons/fi";
import {
  LuServer,
  LuCpu,
  LuMemoryStick,
  LuHardDrive,
  LuMonitor,
  LuTerminal,
} from "react-icons/lu";
import {
  getHomelabStatus,
  formatUptime,
  type HomelabService,
} from "@/lib/homelab";
import { hardware } from "@/lib/hardware";

// Curated services shown in the static fallback (before live data is wired up).
const fallbackServices: HomelabService[] = [
  { name: "Jellyfin", category: "Media", status: "running" },
  { name: "Plex", category: "Media", status: "running" },
  { name: "Grafana", category: "Monitoring", status: "running" },
  { name: "Prometheus", category: "Monitoring", status: "running" },
  { name: "Pi-hole", category: "Networking", status: "running" },
  { name: "Nginx Proxy Manager", category: "Networking", status: "running" },
  { name: "Homarr", category: "Dashboard", status: "running" },
  { name: "Docker", category: "Apps", status: "running" },
];

type Spec = { Icon: IconType; label: string; value: string };

function SpecCard({
  Icon,
  name,
  role,
  specs,
  headerRight,
  children,
}: {
  Icon: IconType;
  name: string;
  role: string;
  specs: Spec[];
  headerRight?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="card card-hover flex flex-col p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-accent-2)]/10 text-[var(--color-accent-soft)]">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <div className="font-semibold leading-tight">{name}</div>
            <div className="text-xs text-[var(--color-faint)]">{role}</div>
          </div>
        </div>
        {headerRight}
      </div>

      <dl className="space-y-2.5">
        {specs.map((s) => (
          <div
            key={s.label}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <dt className="inline-flex items-center gap-2 text-[var(--color-muted)]">
              <s.Icon className="h-3.5 w-3.5 text-[var(--color-faint)]" />
              {s.label}
            </dt>
            <dd className="text-right font-medium text-[var(--color-foreground)]">
              {s.value}
            </dd>
          </div>
        ))}
      </dl>

      {children}
    </div>
  );
}

function Meter({
  label,
  value,
  display,
}: {
  label: string;
  value: number;
  display: string;
}) {
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

function StatusBadge({ live, label }: { live: boolean; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-2 py-0.5 text-xs">
      <span
        className={`h-2 w-2 rounded-full ${
          live ? "bg-emerald-400" : "bg-[var(--color-faint)]"
        }`}
      />
      {label}
    </span>
  );
}

export async function HomelabStatus() {
  const status = await getHomelabStatus();
  const live = !!status;
  const services = status?.services ?? fallbackServices;

  const { server, workstation, nas } = hardware;

  return (
    <section className="mt-20">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="section-title">Homelab</h2>
          <p className="mt-1 text-[var(--color-muted)]">
            I self-host my apps on my own hardware — no third parties.
          </p>
        </div>
        <span className="chip">
          <FiServer className="h-3.5 w-3.5" /> Proxmox VE
        </span>
      </div>

      {/* Hardware spec cards */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Server (live) */}
        <SpecCard
          Icon={LuServer}
          name={server.name}
          role={server.role}
          headerRight={
            <StatusBadge live={live} label={live ? status!.node.status : "online"} />
          }
          specs={[
            { Icon: LuCpu, label: "CPU", value: server.cpu },
            { Icon: LuCpu, label: "Cores", value: server.cores },
            { Icon: LuMemoryStick, label: "Memory", value: server.ram },
            { Icon: LuTerminal, label: "OS", value: server.os },
          ]}
        >
          <div className="mt-4 space-y-3 border-t border-[var(--color-border)] pt-4">
            {live ? (
              <>
                <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
                  <FiActivity className="h-4 w-4 text-[var(--color-accent-soft)]" />
                  Uptime {formatUptime(status!.node.uptimeSeconds)}
                </div>
                <Meter
                  label="CPU load"
                  value={status!.node.cpu * 100}
                  display={`${Math.round(status!.node.cpu * 100)}%`}
                />
                <Meter
                  label="Memory used"
                  value={(status!.node.memUsed / status!.node.memTotal) * 100}
                  display={`${status!.node.memUsed}/${status!.node.memTotal} GB`}
                />
                <div className="text-xs text-[var(--color-faint)]">
                  {status!.counts.running}/{status!.counts.total} services running
                </div>
              </>
            ) : (
              <p className="text-sm text-[var(--color-muted)]">
                Apps, media, monitoring, and networking in isolated LXC
                containers.
              </p>
            )}
          </div>
        </SpecCard>

        {/* Workstation */}
        <SpecCard
          Icon={LuMonitor}
          name={workstation.name}
          role={workstation.role}
          specs={[
            { Icon: LuCpu, label: "CPU", value: workstation.cpu },
            { Icon: LuCpu, label: "Cores", value: workstation.cores },
            { Icon: LuMemoryStick, label: "Memory", value: workstation.ram },
            { Icon: LuMonitor, label: "GPU", value: workstation.gpu },
            { Icon: LuHardDrive, label: "Storage", value: workstation.storage },
            { Icon: LuTerminal, label: "OS", value: workstation.os },
          ]}
        />

        {/* NAS */}
        <SpecCard
          Icon={LuHardDrive}
          name={nas.name}
          role={nas.role}
          headerRight={
            <span className="rounded-full border border-[var(--color-border)] px-2 py-0.5 font-mono text-xs text-[var(--color-accent-soft)]">
              ~{nas.totalTb} TB
            </span>
          }
          specs={[]}
        >
          <div className="space-y-2.5">
            {nas.volumes.map((v) => (
              <div
                key={v.name}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-2.5"
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-medium">{v.name}</span>
                  <span className="font-mono text-sm text-[var(--color-accent-soft)]">
                    {v.size}
                  </span>
                </div>
                <div className="mt-0.5 text-xs text-[var(--color-faint)]">
                  {v.type} · {v.drives}
                </div>
              </div>
            ))}
          </div>
        </SpecCard>
      </div>

      {/* Live services (Blackbox probes) */}
      <div className="card mt-4 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">Services</h3>
          {live && status!.source === "blackbox" && (
            <span className="text-xs text-[var(--color-faint)]">
              Live uptime &amp; latency via Blackbox
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const up = s.status === "running";
            const down = s.status === "down";
            const ms = s.responseMs ?? null;
            return (
              <div
                key={s.name}
                className="flex items-center justify-between gap-2 text-sm"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <FiCircle
                    className={`h-2 w-2 shrink-0 ${
                      up
                        ? "fill-emerald-400 text-emerald-400"
                        : down
                          ? "fill-red-400 text-red-400"
                          : "fill-[var(--color-faint)] text-[var(--color-faint)]"
                    }`}
                  />
                  <span className="truncate text-[var(--color-foreground)]">
                    {s.name}
                  </span>
                </span>
                {ms != null ? (
                  <span className="shrink-0 font-mono text-xs text-[var(--color-faint)]">
                    {ms}ms
                  </span>
                ) : down ? (
                  <span className="shrink-0 text-xs text-red-400">down</span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

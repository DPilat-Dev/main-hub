import type { Metadata } from "next";
import type { IconType } from "react-icons";
import { FiServer, FiCode, FiHardDrive } from "react-icons/fi";
import {
  LuServer,
  LuMonitor,
  LuCpu,
  LuMemoryStick,
  LuHardDrive,
  LuTerminal,
  LuGauge,
} from "react-icons/lu";
import { hardware } from "@/lib/hardware";
import { selfHosted, stack, type Group } from "@/lib/uses";

export const metadata: Metadata = {
  title: "Uses",
  description:
    "The hardware, homelab, and software I use — my Proxmox server, workstation, Synology NAS, and dev stack.",
};

type Spec = { Icon: IconType; label: string; value: string };

function SpecCard({
  Icon,
  name,
  role,
  badge,
  specs,
}: {
  Icon: IconType;
  name: string;
  role: string;
  badge?: string;
  specs: Spec[];
}) {
  return (
    <div className="card card-hover p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-accent-2)]/10 text-[var(--color-accent-soft)]">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <div className="font-semibold leading-tight">{name}</div>
            <div className="text-xs text-[var(--color-faint)]">{role}</div>
          </div>
        </div>
        {badge && (
          <span className="rounded-full border border-[var(--color-border)] px-2.5 py-0.5 font-mono text-xs text-[var(--color-accent-soft)]">
            {badge}
          </span>
        )}
      </div>

      <dl className="divide-y divide-[var(--color-border)]">
        {specs.map((s) => (
          <div
            key={s.label}
            className="flex items-center justify-between gap-3 py-2.5 text-sm"
          >
            <dt className="inline-flex items-center gap-2 text-[var(--color-muted)]">
              <s.Icon className="h-4 w-4 text-[var(--color-faint)]" />
              {s.label}
            </dt>
            <dd className="text-right font-medium text-[var(--color-foreground)]">
              {s.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ChipSection({
  title,
  Icon,
  groups,
}: {
  title: string;
  Icon: IconType;
  groups: Group[];
}) {
  return (
    <section>
      <h2 className="mb-5 flex items-center gap-2 text-xl font-bold">
        <Icon className="h-5 w-5 text-[var(--color-accent-soft)]" />
        {title}
      </h2>
      <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {groups.map((group) => (
          <div key={group.label}>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-faint)]">
              {group.label}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <span key={item} className="chip">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function UsesPage() {
  const { server, workstation, streamingPc, nas } = hardware;

  return (
    <div className="container-page max-w-5xl py-14">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Uses</h1>
        <p className="mt-2 max-w-2xl text-[var(--color-muted)]">
          The gear, homelab, and tools behind my work. I self-host most of what I
          build — here&apos;s what runs it.
        </p>
      </header>

      <div className="space-y-14">
        {/* Hardware */}
        <section>
          <h2 className="mb-5 flex items-center gap-2 text-xl font-bold">
            <FiServer className="h-5 w-5 text-[var(--color-accent-soft)]" />
            Hardware
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <SpecCard
              Icon={LuServer}
              name={server.name}
              role={server.role}
              specs={[
                { Icon: LuCpu, label: "CPU", value: server.cpu },
                { Icon: LuCpu, label: "Cores", value: server.cores },
                { Icon: LuMemoryStick, label: "Memory", value: server.ram },
                { Icon: LuMonitor, label: "GPU", value: server.gpu },
                { Icon: LuTerminal, label: "OS", value: server.os },
              ]}
            />
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
            <SpecCard
              Icon={LuMonitor}
              name={streamingPc.name}
              role={streamingPc.role}
              specs={[
                { Icon: LuCpu, label: "CPU", value: streamingPc.cpu },
                { Icon: LuCpu, label: "Cores", value: streamingPc.cores },
                { Icon: LuMemoryStick, label: "Memory", value: streamingPc.ram },
                { Icon: LuMonitor, label: "GPU", value: streamingPc.gpu },
                { Icon: LuHardDrive, label: "Storage", value: streamingPc.storage },
                { Icon: LuTerminal, label: "OS", value: streamingPc.os },
              ]}
            />
            <SpecCard
              Icon={LuHardDrive}
              name={nas.name}
              role={nas.role}
              badge={`~${nas.totalTb} TB`}
              specs={nas.volumes.map((v) => ({
                Icon: LuGauge,
                label: v.name,
                value: `${v.size} · ${v.type}`,
              }))}
            />
          </div>
        </section>

        {/* Self-hosted services */}
        <ChipSection
          title="Self-hosted services"
          Icon={FiHardDrive}
          groups={selfHosted}
        />

        {/* Software stack */}
        <ChipSection title="Software & tools" Icon={FiCode} groups={stack} />
      </div>
    </div>
  );
}

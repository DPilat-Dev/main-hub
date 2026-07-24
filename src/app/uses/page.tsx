import type { Metadata } from "next";
import { FiExternalLink, FiCpu, FiServer, FiCode, FiMonitor } from "react-icons/fi";
import type { IconType } from "react-icons";
import { uses } from "@/lib/uses";

export const metadata: Metadata = {
  title: "Uses",
  description:
    "The hardware, homelab, and software I use every day — from my Proxmox server to my dev stack.",
};

const icons: Record<string, IconType> = {
  cpu: FiCpu,
  server: FiServer,
  code: FiCode,
  monitor: FiMonitor,
};

export default function UsesPage() {
  return (
    <div className="container-page max-w-4xl py-14">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Uses</h1>
        <p className="mt-2 max-w-2xl text-[var(--color-muted)]">
          The gear, homelab, and tools behind my work. I self-host a lot of what
          I build — this is what runs it.
        </p>
      </header>

      <div className="space-y-10">
        {uses.map((category) => {
          const Icon = icons[category.icon] ?? FiCode;
          return (
            <section key={category.label}>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                <Icon className="h-5 w-5 text-[var(--color-accent-soft)]" />
                {category.label}
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {category.items.map((item) => (
                  <div key={item.name} className="card p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold">{item.name}</h3>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Visit ${item.name}`}
                          className="text-[var(--color-faint)] transition-colors hover:text-[var(--color-accent-soft)]"
                        >
                          <FiExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-muted)]">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

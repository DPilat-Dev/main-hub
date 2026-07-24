// Real hardware specs — used by the homepage Homelab section and /uses.
// Server + workstation pulled live from Proxmox / lscpu; NAS provided manually.

export const hardware = {
  server: {
    name: "zeus",
    role: "Proxmox VE host",
    cpu: "Intel Core i7-14700K",
    cores: "20 cores / 28 threads",
    ram: "94 GB",
    gpu: "NVIDIA Quadro P2000",
    os: "Proxmox VE 8.4",
    specLine: "i7-14700K · 94 GB · Quadro P2000",
  },
  workstation: {
    name: "Primary workstation",
    role: "Daily driver",
    cpu: "AMD Ryzen 9 5900X",
    cores: "12 cores / 24 threads",
    ram: "64 GB",
    gpu: "AMD Radeon RX 9070 XT",
    storage: "1 TB NVMe",
    os: "Arch Linux",
    specLine: "Ryzen 9 5900X · 64 GB · RX 9070 XT",
  },
  nas: {
    name: "Synology NAS",
    role: "Network storage",
    totalTb: 82, // 27.93 + 1.8 + 52.36 ≈ 82 TB usable
    volumes: [
      {
        name: "Volume 1",
        size: "27.93 TB",
        type: "RAID 5",
        drives: "8 TB drives",
      },
      {
        name: "Volume 2",
        size: "1.8 TB",
        type: "SHR",
        drives: "1 × 2 TB",
      },
      {
        name: "Volume 3",
        size: "52.36 TB",
        type: "SHR (1-drive fault tolerance)",
        drives: "4 × 20 TB",
      },
    ],
  },
} as const;

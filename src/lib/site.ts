export const site = {
  name: "David Pilat",
  role: "Software Engineer",
  tagline: "I build and stabilize SaaS platforms that protect revenue and ship faster.",
  description:
    "Software Engineer with 8+ years building and stabilizing SaaS platforms. Resume, projects, and writing on .NET, cloud, and reliable delivery.",
  url: "https://davidpilat.dev",
  location: "Lynnwood, WA",
  email: "david.j.pilat@gmail.com",
  socials: {
    github: "https://github.com/DPilat-Dev",
    linkedin: "https://www.linkedin.com/in/dpilat-dev/",
    email: "mailto:david.j.pilat@gmail.com",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Resume", href: "/resume" },
    { label: "Projects", href: "/projects" },
    { label: "Blog", href: "/blog" },
  ],
} as const;

export type Site = typeof site;

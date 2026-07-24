export const site = {
  name: "David Pilat",
  role: "Software Engineer",
  tagline: "I build and stabilize SaaS platforms that protect revenue and ship faster.",
  intro:
    "Software Engineer with 8+ years shipping SaaS that protects revenue and speeds delivery. Off the clock I run my own server and self-host the apps I build — I'm as into hardware as I am software — and I treat AI as a real engineering tool, not just a feature to bolt onto a product. I care about resilient deployments, structured logging, and shipping faster across .NET and the modern web.",
  // Rotating phrases for the hero typewriter — each completes "…I build ___".
  heroPhrases: [
    "reliable software that protects revenue.",
    "and host my own apps on my own server.",
    "with AI in the engineering loop.",
    "across software and hardware.",
  ],
  description:
    "Software Engineer with 8+ years building and stabilizing SaaS platforms. Self-hoster, hardware tinkerer, and AI-assisted builder. Resume, projects, and writing on .NET, cloud, and reliable delivery.",
  url: "https://davidpilat.dev",
  location: "Lynnwood, WA",
  email: "david.j.pilat@gmail.com",
  socials: {
    github: "https://github.com/DPilat-Dev",
    linkedin: "https://www.linkedin.com/in/dpilat-dev/",
    email: "mailto:david.j.pilat@gmail.com",
  },
  githubUser: "DPilat-Dev",
  nav: [
    { label: "Home", href: "/" },
    { label: "Resume", href: "/resume" },
    { label: "Projects", href: "/projects" },
    { label: "Uses", href: "/uses" },
    { label: "Blog", href: "/blog" },
  ],
} as const;

export type Site = typeof site;

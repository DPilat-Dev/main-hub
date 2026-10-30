import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  const name = process.env.ADMIN_NAME ?? "Admin";

  // ── Admin user ────────────────────────────────────────────
  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await prisma.user.upsert({
    where: { email },
    update: { name, passwordHash },
    create: { email, name, passwordHash, role: "ADMIN" },
  });
  console.log(`✔ Admin user ready: ${admin.email}`);

  // ── Projects (showcase) ───────────────────────────────────
  const projects = [
    {
      slug: "apollo",
      title: "Apollo",
      summary: "A modern, Netflix-style web client for Jellyfin.",
      tech: ["React 19", "TypeScript", "Vite", "Tailwind CSS", "TanStack Query", "hls.js"],
      repoUrl: "https://github.com/DPilat-Dev/Apollo",
      featured: true,
      sortOrder: 0,
      description: `
        <p>Apollo is a modern, Netflix-style web client for Jellyfin — a full-bleed
        hero, hover-expand cards, a real player, and a complete admin dashboard. It's
        unofficial: it talks to the standard Jellyfin REST API and runs alongside (or
        instead of) the official web UI. Built against Jellyfin 10.11.8, with endpoints
        verified against the server's own OpenAPI document.</p>
        <h3>Highlights</h3>
        <ul>
          <li><strong>Real per-user match scores</strong> — a taste profile built from
          your recently played titles and favourites (genres, studios, tags), not a
          relabelled community rating.</li>
          <li><strong>Proper playback</strong> — direct play, direct stream, or
          transcode via hls.js, with start/progress/stopped reporting.</li>
          <li><strong>One-command Proxmox install</strong> — a script that provisions an
          unprivileged LXC, installs Node, builds Apollo, and runs it under systemd.</li>
          <li><strong>Admin dashboard</strong> and Jellyseerr integration for requests.</li>
        </ul>
        <h3>Stack</h3>
        <p>Vite + React 19 + TypeScript, Tailwind CSS v4, TanStack Query for caching and
        infinite scroll, and hls.js for playback. The Jellyfin SDK's generated DTOs
        provide types, but HTTP goes through a hand-rolled <code>fetch</code> client for
        full control of URL shape and auth headers.</p>
        <p>Self-hosted and open source on
        <a href="https://github.com/DPilat-Dev/Apollo">GitHub</a>.</p>
      `,
    },
    {
      slug: "ondemand-restoration",
      title: "OnDemand Restoration",
      summary:
        "Marketing and lead-generation site for a restoration services company.",
      tech: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
      liveUrl: "https://www.ondemandrs.com/",
      featured: true,
      sortOrder: 1,
      description:
        "<p>A fast, modern marketing site built to convert visitors into leads for a restoration services business, with clear service breakdowns and contact flows.</p>",
    },
    {
      slug: "glossa-babel",
      title: "Glossa Babel",
      summary: "Language-focused web application deployed on Vercel.",
      tech: ["Next.js", "React", "TypeScript", "Vercel"],
      liveUrl: "https://glossa-babel.vercel.app/",
      featured: true,
      sortOrder: 2,
      description:
        "<p>A language-oriented web app exploring translation and learning workflows, shipped continuously on Vercel.</p>",
    },
    {
      slug: "genuine-flooring",
      title: "Genuine Flooring",
      summary: "Business website for a flooring company.",
      tech: ["Next.js", "React", "Tailwind CSS"],
      liveUrl: "https://genuine-flooring.com/",
      featured: true,
      sortOrder: 3,
      description:
        "<p>A clean, responsive business site showcasing flooring services and portfolio work, optimized for local search and conversions.</p>",
    },
  ];

  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: {}, // don't overwrite edits made in the admin
      create: p,
    });
  }
  console.log(`✔ Seeded ${projects.length} projects`);

  // ── Welcome blog post ─────────────────────────────────────
  await prisma.post.upsert({
    where: { slug: "hello-world" },
    update: {},
    create: {
      slug: "hello-world",
      title: "Building My Hub: Resume, Projects, and Writing",
      excerpt:
        "Why I built this site, the stack behind it, and what I plan to write about.",
      tags: ["meta", "nextjs", "dotnet"],
      published: true,
      publishedAt: new Date(),
      authorId: admin.id,
      content: `
        <p>Welcome to my corner of the internet. This site is my hub — a place for my
        resume, the projects I've shipped, and writing about building reliable software.</p>
        <h2>Why build it from scratch?</h2>
        <p>After years stabilizing SaaS platforms, I wanted one place I fully control:
        a dark, fast, modern site with a real content engine behind it rather than a
        static template.</p>
        <h2>The stack</h2>
        <ul>
          <li><strong>Next.js</strong> (App Router) + TypeScript</li>
          <li><strong>Tailwind CSS</strong> for the design system</li>
          <li><strong>PostgreSQL</strong> + Prisma for content</li>
          <li><strong>Auth.js</strong> for the admin area and a custom WYSIWYG editor</li>
        </ul>
        <p>More posts coming on .NET, CI/CD, and keeping production boring.</p>
      `,
    },
  });
  console.log("✔ Seeded welcome post");

  // ── Post: building this site with AI ──────────────────────
  await prisma.post.upsert({
    where: { slug: "building-this-site-with-claude-code" },
    update: {},
    create: {
      slug: "building-this-site-with-claude-code",
      title: "How I Built This Site with Claude Code",
      excerpt:
        "This whole site — resume, blog engine, admin, and a live homelab status page — was built with an AI agent in the loop. Here's what that actually looked like.",
      tags: ["ai", "nextjs", "engineering"],
      published: true,
      publishedAt: new Date("2026-07-24T00:00:00Z"),
      authorId: admin.id,
      content: `
        <p>I talk a lot about treating AI as a real engineering tool rather than a
        feature you bolt onto a product. This site is my proof of that: I built it
        end to end with <strong>Claude Code</strong> driving the terminal, and I want
        to be honest about what that looked like — the good parts and the boring parts.</p>

        <h2>What I actually built</h2>
        <ul>
          <li>A Next.js (App Router) + TypeScript site with a Tailwind design system</li>
          <li>A PostgreSQL + Prisma content engine with a custom admin and WYSIWYG editor</li>
          <li>Auth.js for the protected dashboard</li>
          <li>A <strong>live homelab status page</strong> wired to my Proxmox server and Blackbox exporter</li>
          <li>Vitest tests, a GitHub Actions CI pipeline, and Vercel deploys</li>
        </ul>

        <h2>AI as a pair, not an autopilot</h2>
        <p>The useful mental model wasn't "generate an app." It was a tight loop:
        I set direction and constraints, the agent scaffolded and wired things up, and
        I reviewed every diff, ran the tests, and pushed back when something was off.
        The parts that went fastest were the ones I'd normally find tedious — boilerplate,
        config, wiring a WYSIWYG editor, writing a dependency-free status collector.</p>

        <h2>Where the human still matters</h2>
        <p>Plenty. Deciding to pin Prisma to a stable major instead of chasing a brand-new
        release. Catching a layout shift from a typing animation. Noticing that a build
        kept failing because my serverless database was auto-suspending, and hardening the
        prerender queries with a retry-and-fallback. None of that is "prompt magic" — it's
        engineering judgment, and the AI is only as good as the person reviewing it.</p>

        <h2>The takeaway</h2>
        <p>Used well, an AI agent compresses the distance between an idea and a working,
        tested, deployed feature. It didn't replace the thinking — it removed the friction
        around it. That's the version of "AI for engineering" I care about.</p>
      `,
    },
  });
  console.log("✔ Seeded 'building this site' post");

  // ── Post: homelab live status ─────────────────────────────
  await prisma.post.upsert({
    where: { slug: "live-status-for-my-proxmox-homelab" },
    update: {},
    create: {
      slug: "live-status-for-my-proxmox-homelab",
      title: "A Live Status Page for My Proxmox Homelab",
      excerpt:
        "How the homepage shows real uptime, response times, and running services from my own server — without exposing Proxmox to the internet.",
      tags: ["homelab", "proxmox", "monitoring"],
      published: true,
      publishedAt: new Date("2026-07-24T01:00:00Z"),
      authorId: admin.id,
      content: `
        <p>The homepage of this site has a Homelab section that shows my server in real
        time: node uptime, CPU and memory, and which services are up — with live response
        times on the public ones. It runs on my own hardware, and I wanted to share how
        it's wired without exposing anything I shouldn't.</p>

        <h2>The hardware</h2>
        <p>Everything runs on a single Proxmox VE node — an Intel i7-14700K with 94 GB of
        RAM — hosting around sixteen LXC containers: media, a Prometheus + Grafana +
        Blackbox monitoring stack, Nginx Proxy Manager, a Cloudflare Tunnel, Pi-hole, and
        more. Storage lives on a Synology NAS with about 82 TB usable across three volumes.</p>

        <h2>The problem: how do you show this safely?</h2>
        <p>My site is hosted on Vercel, which can't reach my LAN — and I definitely don't
        want to put the Proxmox API or the Blackbox exporter on the public internet. The
        answer is a small middle layer.</p>

        <h2>A tiny collector</h2>
        <p>I wrote a dependency-free Node service that runs on the LAN. It reads the Proxmox
        API with a <strong>read-only</strong> token for node stats and container status, and
        asks the Blackbox exporter to probe my public URLs for response time and SSL expiry.
        It outputs one sanitized JSON document — only the data I choose to expose.</p>

        <h2>Getting it public, safely</h2>
        <p>I front the collector with Nginx Proxy Manager on a subdomain, routed through my
        existing Cloudflare Tunnel — so no ports are opened and Proxmox stays private. The
        site fetches that JSON on a short revalidation interval and renders the cards.</p>

        <h2>Why I like it</h2>
        <p>It turns a static "I have a homelab" line into something live and verifiable, and
        it reuses the monitoring I already run. Same pattern scales to anything with an API:
        collect internally, sanitize, expose the minimum.</p>
      `,
    },
  });
  console.log("✔ Seeded homelab post");

  // ── Post: Apollo ──────────────────────────────────────────
  await prisma.post.upsert({
    where: { slug: "apollo-a-netflix-style-jellyfin-client" },
    update: {},
    create: {
      slug: "apollo-a-netflix-style-jellyfin-client",
      title: "Apollo: Building a Netflix-Style Client for Jellyfin",
      excerpt:
        "I built a modern web client for my Jellyfin server — real per-user match scores, a proper player, and a one-command Proxmox install. Here are the engineering bits worth sharing.",
      tags: ["jellyfin", "react", "self-hosted", "typescript"],
      published: true,
      publishedAt: new Date("2026-08-08T00:00:00Z"),
      authorId: admin.id,
      content: `
        <p>I run Jellyfin on my homelab, and while the official web UI is capable, I
        wanted something that felt like the streaming apps I actually use — a full-bleed
        hero, hover-expand cards, and a player that just works. So I built
        <strong>Apollo</strong>: a modern, Netflix-style web client for Jellyfin. It's
        unofficial, talks to the standard Jellyfin REST API, and runs alongside (or
        instead of) the official UI.</p>

        <h2>The stack</h2>
        <p>Apollo is a static SPA — Vite + React 19 + TypeScript, styled with Tailwind
        CSS v4. TanStack Query handles caching, dedupe, and infinite scroll for large
        libraries; hls.js covers transcoded streams while direct play uses the native
        video element.</p>
        <p>One deliberate choice: I don't use the Jellyfin SDK's generated axios client.
        I kept its generated DTOs for types but hand-rolled a thin <code>fetch</code>
        wrapper, because the image and streaming URLs depend on precise control of URL
        shape and auth headers.</p>

        <h2>Match scores that actually mean something</h2>
        <p>The percentage on each card is a <em>real per-user score</em>, not a
        relabelled community rating. Once per session Apollo builds a taste profile from
        your 150 most recently played titles plus your favourites, counting genres,
        studios, and tags. Favourites weigh 3× a play, rewatches get a bonus, and recent
        viewing counts about double the oldest in the window.</p>
        <p>Raw counts are square-root damped and normalised against your strongest term,
        so one heavily-watched genre doesn't flatten everything else to zero. Scoring a
        candidate blends its facet affinities (75%) with the community rating as a prior
        (25%), and only scores facets the item actually carries — otherwise a title with
        no tags would be punished for the omission rather than judged on what it has.</p>
        <p>A few honest details: there's no artificial floor (real scores run 1–99, not a
        flattering 50–99), and under five watched items there's no profile at all, so the
        UI shows the community rating instead of inventing a match.</p>

        <h2>The bug that looked like everything and nothing</h2>
        <p>The most confusing bug I hit wasn't really my logic being wrong.
        Unauthenticated calls succeeded — the server connected and reported its version —
        but every <em>authenticated</em> call, including sign-in, silently never fired.</p>
        <p>The culprit: <code>crypto.randomUUID</code>, which I used to label the browser
        in Jellyfin's device list, is <strong>undefined on plain HTTP over a LAN
        address</strong> because it's a secure-context-only API. It's called while
        building the <code>Authorization</code> header, so it threw before any
        authenticated request was even sent. Development on <code>localhost</code> never
        sees this — localhost counts as a secure context. The fix was falling back to
        <code>getRandomValues</code>, which has no such restriction. Lesson: test on a
        real LAN address, not just localhost.</p>

        <h2>Mixed content will ruin your day</h2>
        <p>A related trap: the browser talks to Jellyfin directly. Serve Apollo over
        HTTPS while pointing it at a plain <code>http://</code> LAN Jellyfin, and the
        browser blocks every request as mixed content — the app looks completely broken,
        with CORS-looking console errors that never say "mixed content." The answer is to
        keep the scheme consistent: HTTPS Jellyfin, or plain-HTTP Apollo on the LAN, or
        both behind one reverse proxy.</p>

        <h2>Deploying it</h2>
        <p>Apollo ships with Docker Compose, but the part I'm happiest with is the
        one-command Proxmox installer — run it on the Proxmox host and it prompts for a
        container ID, resources, storage, network, and your Jellyfin address, then creates
        an unprivileged Debian LXC, installs Node, builds Apollo, and starts it under
        systemd.</p>

        <h2>Why bother?</h2>
        <p>Because self-hosting should feel as good as the commercial thing it replaces.
        Apollo is open source on
        <a href="https://github.com/DPilat-Dev/Apollo">GitHub</a> — the kind of project
        that scratches a real itch on my own homelab and handed me a few genuinely
        interesting problems to solve.</p>
      `,
    },
  });
  console.log("✔ Seeded Apollo post");

  // ── Private dashboard links ───────────────────────────────
  const links = [
    {
      title: "GitHub",
      url: "https://github.com/DPilat-Dev",
      category: "Accounts",
      description: "Source repositories",
      sortOrder: 1,
    },
    {
      title: "Vercel Dashboard",
      url: "https://vercel.com/dashboard",
      category: "Hosting",
      description: "Deployments & domains",
      sortOrder: 2,
    },
  ];
  for (const l of links) {
    const existing = await prisma.dashboardLink.findFirst({
      where: { title: l.title },
    });
    if (!existing) await prisma.dashboardLink.create({ data: l });
  }
  console.log(`✔ Seeded dashboard links`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

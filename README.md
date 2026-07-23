# Main Hub

My personal hub — a **résumé site, project showcase, and blog**, with a private,
authenticated admin dashboard for managing content and quick links to my server
and subdomains. Dark, modern, and fast.

**Live:** _add your domain here_ · **Author:** [David Pilat](https://github.com/DPilat-Dev)

<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-17-4169E1?logo=postgresql&logoColor=white" />
</p>

---

## Features

- **Résumé** — a structured, always-in-sync résumé page with a downloadable PDF.
- **Project showcase** — featured + full project listings with live/repo links.
- **Blog** — database-backed posts written in a custom **WYSIWYG editor** (Tiptap),
  with drafts, tags, slugs, and reading-time estimates.
- **Private admin** — authenticated area (`/admin`) to create/edit/delete posts &
  projects and manage a **private dashboard** of links to servers and subdomains.
  Hidden from the public site and search engines.
- **Auth** — email/password sign-in via [Auth.js](https://authjs.dev) (Credentials),
  protected by edge middleware.
- **Dark, modern design** — custom Tailwind design system, `react-icons`, responsive.

## Tech stack

| Area       | Choice                                             |
| ---------- | -------------------------------------------------- |
| Framework  | Next.js 16 (App Router, Server Actions)            |
| Language   | TypeScript                                         |
| Styling    | Tailwind CSS 4 + `@tailwindcss/typography`         |
| Icons      | `react-icons`                                      |
| Database   | PostgreSQL 17 (Docker for local dev)               |
| ORM        | Prisma 6                                           |
| Auth       | Auth.js (NextAuth v5) — Credentials + JWT sessions |
| Editor     | Tiptap                                             |
| Testing    | Vitest + Testing Library                           |
| Deployment | Vercel                                             |

## Getting started

### Prerequisites

- Node.js 20+
- Docker (for the local Postgres database)

### 1. Install & configure

```bash
npm install
cp .env.example .env.local
```

Then edit `.env.local`:

- Generate `AUTH_SECRET` with `openssl rand -base64 32`.
- Set `ADMIN_EMAIL` / `ADMIN_PASSWORD` — these bootstrap your admin login.

### 2. Start the database & migrate

```bash
npm run db:up        # start Postgres in Docker (port 5442)
npm run db:migrate   # apply schema migrations
npm run db:seed      # create admin user + sample content
```

### 3. Run the app

```bash
npm run dev          # http://localhost:3000
```

- Public site: `/`, `/resume`, `/projects`, `/blog`
- Admin: sign in at `/login`, then manage everything at `/admin`

## Scripts

| Script               | Description                                  |
| -------------------- | -------------------------------------------- |
| `npm run dev`        | Start the dev server                         |
| `npm run build`      | Production build (runs `prisma generate`)    |
| `npm run start`      | Start the production server                  |
| `npm test`           | Run the Vitest suite                         |
| `npm run test:watch` | Run tests in watch mode                      |
| `npm run lint`       | Lint with ESLint                             |
| `npm run db:up`      | Start the Postgres container                 |
| `npm run db:down`    | Stop the Postgres container                  |
| `npm run db:migrate` | Create/apply a migration                     |
| `npm run db:seed`    | Seed the database                            |
| `npm run db:studio`  | Open Prisma Studio                           |
| `npm run db:reset`   | Reset the database (drops data) and re-seed  |

## Project structure

```
src/
├─ app/
│  ├─ (public)          # home, resume, projects, blog
│  ├─ login/            # admin sign-in (server action + form)
│  ├─ admin/            # protected dashboard + content CRUD
│  └─ api/auth/         # Auth.js route handler
├─ components/
│  ├─ site/             # public UI (navbar, footer, cards)
│  └─ admin/            # editor, forms, sidebar
├─ lib/                 # prisma client, site config, resume data, helpers
├─ auth.ts              # Auth.js (Node) config with Credentials provider
├─ auth.config.ts       # edge-safe auth config (used by proxy)
└─ proxy.ts             # route protection for /admin
prisma/
├─ schema.prisma        # User, Post, Project, DashboardLink
└─ seed.ts              # admin user + sample data
```

## Editing your résumé

The résumé is a single source of truth in [`src/lib/resume.ts`](src/lib/resume.ts).
Update it there and both the `/resume` page and home hero update. Replace
`public/David-Pilat-Resume.pdf` to change the downloadable PDF.

## Deployment (Vercel)

1. Push to GitHub (already at [`DPilat-Dev/main-hub`](https://github.com/DPilat-Dev/main-hub)).
2. Import the repo in Vercel.
3. Add a Postgres database (Vercel Postgres/Neon) and set env vars:
   `DATABASE_URL`, `AUTH_SECRET`, `AUTH_TRUST_HOST=true`, and the `ADMIN_*` vars.
4. Run `npx prisma migrate deploy` and the seed once against the production DB.

> **Note:** this repo is public — never commit secrets. Keep all credentials in
> `.env.local` (git-ignored) and in Vercel's environment settings.

## Testing

```bash
npm test
```

Unit tests cover the content helpers (slugify, reading-time, date formatting)
and component rendering (project cards). CI runs lint, tests, and a build on
every push (see `.github/workflows/ci.yml`).

## License

Personal project — all rights reserved.

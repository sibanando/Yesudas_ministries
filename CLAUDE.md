@AGENTS.md

# Project: Fr. Yesudas Ministries Website

Next.js 16.2.1, React 19, TypeScript, Tailwind CSS 4, App Router.

---

## Next.js 16 Critical Notes

- Route protection file is **`proxy.ts`** at project root — NOT `middleware.ts` (renamed in Next.js 16). See `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`.
- All DB-backed public pages must have `export const dynamic = "force-dynamic"` — DB is not available at build time, so `generateStaticParams` cannot query it.
- Do NOT use `use cache` on admin pages — they need fresh data always.
- `unstable_cache` in `lib/youtube.ts` still works in Next.js 16.2.1 — do not touch it.

---

## Database

**PostgreSQL** — Prisma 7.6.0, generator `prisma-client-js`, client generated to `lib/generated/prisma/`, import from `@/lib/generated/prisma`.

- Prisma 7 requires a **driver adapter** — both generators use WASM, no Rust binary. Use `@prisma/adapter-pg` with `pg`:
  ```typescript
  import { PrismaPg } from "@prisma/adapter-pg";
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  new (PrismaClient as any)({ adapter })
  ```
- Import path: `@/lib/generated/prisma` (no `/client` suffix).
- `(PrismaClient as any)` cast needed to suppress TS errors from `@ts-nocheck` generated files.
- Prisma-generated files use `@ts-nocheck` — return types come back as `any`. Always annotate mapped results with explicit TS types from `@/types/*`.
- `tags` fields are stored as `Json` in DB — `lib/mappers.ts` casts them to `string[]`.
- `date` fields on `BlogPost` and `ChurchEvent` are `String` (format `"YYYY-MM-DD"`) to match existing TypeScript types.
- `Donation.amount` is stored in smallest currency unit (paise/cents) — divide by 100 for display.
- Connection: `postgresql://USER:PASSWORD@HOST:5432/yesudas_ministries`
- Seed: `npx prisma db seed` (runs `prisma/seed.ts` via `tsx`)
- `prisma.config.ts` at project root — Prisma 7 config file defining schema path, migrations path, and seed command.

---

## Auth

- `lib/session.ts` (`server-only`) — JWT via `jose` (HS256, pure JS, Turbopack-safe). Cookie name: `admin_session`, httpOnly, 7-day expiry.
- `lib/dal.ts` (`server-only`) — `verifyAdminSession()` redirects to `/admin/login`; `verifyAdminSessionForApi()` returns null. Both use React `cache()` for per-request memoization.
- `lib/actions/auth.ts` (`"use server"`) — `loginAction` and `logoutAction` Server Actions.
- **`bcryptjs`** not `bcrypt` — pure JS, no native bindings, Turbopack-safe.
- Single admin user — no RBAC needed.

---

## Admin Panel

### Pages (`app/admin/`)
- `layout.tsx` — standalone shell with `AdminSidebar` + `AdminHeader`, no public Nav/Footer.
- `login/page.tsx` — `"use client"`, uses `useActionState(loginAction, initialState)`.
- All other admin pages: first call is `await verifyAdminSession()` (double-checks auth beyond proxy).
- Dashboard (`page.tsx`) — uses `Promise.all` for parallel Prisma counts.

### API Routes (`app/api/admin/`)
All 16 routes call `verifyAdminSessionForApi()` first, return 401 if null:
`stats`, `blog`, `blog/[id]`, `events`, `events/[id]`, `ministries`, `ministries/[id]`, `team`, `team/[id]`, `newsletter`, `newsletter/export` (CSV download), `contacts`, `contacts/[id]` (PATCH mark-read), `donations`, `sermons`, `sermons/[id]`.

### Admin UI Components (`components/admin/`)
All forms: `"use client"`, `react-hook-form` + `zodResolver`, `useRouter` for redirect after save, `sonner` toast for feedback.
Tags fields use comma-separated string input with `.transform(s => s.split(",").map(t => t.trim()).filter(Boolean))`.
`sortOrder` on `TeamMemberForm`: use `z.number().int()` (no `.default()`) + `register("sortOrder", { valueAsNumber: true })`.

---

## Public Pages

| Page | Data source |
|------|-------------|
| `/blog` | `prisma.blogPost.findMany({ where: { published: true } })` → `mapBlogPost()` |
| `/blog/[slug]` | `prisma.blogPost.findUnique({ where: { slug, published: true } })` |
| `/events` | `prisma.churchEvent.findMany()` → `mapEvent()` |
| `/ministries` | `prisma.ministry.findMany()` → `mapMinistry()` |
| `/sermons` | `prisma.sermon.findMany({ where: { published: true } })` → `mapSermon()` — now DB-backed like other pages |

---

## Existing API Routes (data persistence added)

- `app/api/contact/route.ts` — saves to `ContactSubmission` (non-blocking `.catch`), then sends email.
- `app/api/newsletter/route.ts` — upserts `NewsletterSubscriber` (non-blocking `.catch`), then sends email.
- `app/api/razorpay/verify-payment/route.ts` — creates `Donation` record after signature verification.
- `app/api/stripe/webhook/route.ts` — creates `Donation` record in `checkout.session.completed` handler.

Non-blocking DB writes pattern:
```typescript
prisma.someModel.create({ data: { ... } })
  .catch((err: unknown) => console.error("[Route] DB write failed:", err));
```

---

## Key Packages

| Package | Purpose |
|---------|---------|
| `prisma` + `@prisma/client` 7.6.0 | ORM — PostgreSQL |
| `jose` 6.x | JWT sign/verify — pure JS, Turbopack-safe |
| `bcryptjs` | Password hashing — pure JS, NOT native `bcrypt` |
| `server-only` | Prevents `lib/session.ts` and `lib/dal.ts` from being imported in client components |
| `react-hook-form` + `@hookform/resolvers` | All admin forms |
| `zod` 4.x | Validation schemas in `lib/validations/admin.ts` |
| `sonner` | Toast notifications |
| `date-fns` | Date formatting |
| `razorpay` + `stripe` | Payment gateways |
| `nodemailer` | Contact + newsletter emails |

---

## lib/data.ts

**Do NOT delete.** `mockSermons` is still used by `lib/youtube.ts` as API fallback. All content (blog, events, ministries, team, sermons) has been migrated to the database.

---

## Docker (preferred)

Files: `Dockerfile`, `docker-compose.yml`, `.dockerignore`, `docker-entrypoint.sh`, `DOCKER_NOTES.md` (detailed setup and troubleshooting).

- `next.config.ts` has `output: "standalone"` — produces a minimal self-contained server in `.next/standalone/`.
- `prisma/schema.prisma` has `binaryTargets = ["native", "linux-musl-openssl-3.0.x"]` — required for Alpine Linux containers.
- `Dockerfile` builds the app *inside Docker* (portable; no need to pre-build `.next` on the host).
- Docker Compose:
  - `postgres` service (postgres:16-alpine)
  - `migrate` one-shot service (runs `prisma migrate deploy`; optional seed)
  - `app` service (depends on `postgres` healthy + `migrate` completed)
- All env vars are passed from a `.env` file at the project root (copy `.env.docker` → `.env` and fill in values).

```bash
# First time — create .env and fill in required values
touch .env
# Edit .env — set POSTGRES_PASSWORD, ADMIN_SESSION_SECRET, etc.
# See DOCKER_NOTES.md for full variable reference and step-by-step setup.

# Build and run (includes migrations)
docker compose up -d --build

# Optional seed (first time only) — set SEED_DB=true in .env, then:
# docker compose up -d --build

# Stop
docker compose down

# Stop and delete all data
docker compose down -v
```

App runs at `http://localhost:4500`. Admin at `/admin`.

---

## Local Dev Setup (without Docker)

```bash
# 1. Create PostgreSQL database
psql -U postgres -c "CREATE DATABASE yesudas_ministries;"

# 2. Set credentials in .env.local
# DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/yesudas_ministries"

# 3. Run migration and seed
npx prisma migrate dev --name init
npx prisma db seed

# 4. Start dev server
npm run dev
```

Admin login: `admin@fryesudasministries.com` / `ChangeMe123!` (change before production).
Generate session secret: `openssl rand -base64 32`.

# Docker setup and troubleshooting

This project ships as Docker images, but it still needs runtime configuration, a working PostgreSQL container, successful Prisma migrations, and optional seeding for the admin user.

The Docker Compose stack contains three services:

- `postgres` - PostgreSQL database
- `migrate` - one-shot container that runs `prisma migrate deploy` and optional seeding
- `app` - Next.js app on port `4500`

## Ports and service behavior

- App: `http://localhost:4500`
- Admin: `http://localhost:4500/admin`
- PostgreSQL from the host machine: `localhost:5433`
- PostgreSQL inside Docker Compose: host name `postgres`, port `5432`

The `app` container does not start until:

1. `postgres` is healthy
2. `migrate` finishes successfully

If the site does not come up, check the `migrate` container first.

## Step 1: create `.env`

Create a root `.env` file for Docker Compose.

```bash
touch .env
```

Add at least these values:

```env
POSTGRES_PASSWORD=
ADMIN_SESSION_SECRET=
SEED_DB=false
ADMIN_SEED_EMAIL=admin@fryesudasministries.com
ADMIN_SEED_PASSWORD=ChangeMe123!
NEXT_PUBLIC_SITE_URL=http://localhost:4500
```

You can also add optional values later for SMTP, YouTube, Razorpay, and Stripe.

## Step 2: generate `POSTGRES_PASSWORD`

Use a URL-safe password with no special escaping problems:

```bash
openssl rand -hex 24
```

Copy the output into:

```env
POSTGRES_PASSWORD=<paste-generated-value>
```

Why hex is recommended here:

- safe inside `.env`
- safe inside the Compose-generated `DATABASE_URL`
- no `/`, `+`, or `=` characters to worry about

## Step 3: generate `ADMIN_SESSION_SECRET`

Generate the admin session secret with:

```bash
openssl rand -base64 32
```

Copy the output into:

```env
ADMIN_SESSION_SECRET=<paste-generated-value>
```

This secret is required for signing and verifying the admin JWT session cookie.

## Step 4: choose seed settings

`SEED_DB` controls whether the `migrate` container also runs `prisma/seed.ts`.

### First run

Use:

```env
SEED_DB=true
```

This creates the default admin user.

### Later runs

After the first successful seed, change it back to:

```env
SEED_DB=false
```

This avoids reseeding on every startup.

### Admin seed credentials

These values are used only by the seed step:

```env
ADMIN_SEED_EMAIL=admin@fryesudasministries.com
ADMIN_SEED_PASSWORD=ChangeMe123!
```

Change them before the first seeded run if you do not want to use the defaults.

## Step 5: start the stack

For first-time setup:

```bash
docker compose up --build
```

If you want it in the background:

```bash
docker compose up -d --build
```

## Step 6: verify startup

Check container status:

```bash
docker compose ps
```

Check logs:

```bash
docker compose logs --tail=100 postgres
docker compose logs --tail=100 migrate
docker compose logs --tail=100 app
```

Expected result:

- `postgres` is healthy
- `migrate` exits successfully
- `app` stays running

## Step 7: sign in to admin

If `SEED_DB=true` was used on the first run, the admin login is:

- Email: value from `ADMIN_SEED_EMAIL`
- Password: value from `ADMIN_SEED_PASSWORD`

Open:

```text
http://localhost:4500/admin
```

## Common fixes

## Issue: app container never starts

Cause:

- `migrate` failed, so `app` is blocked by `depends_on`

Fix:

```bash
docker compose logs --tail=100 migrate
```

Resolve the migration error, then restart:

```bash
docker compose up --build
```

## Issue: database authentication fails after changing `POSTGRES_PASSWORD`

Cause:

- PostgreSQL keeps the old password inside the existing Docker volume

Fix:

```bash
docker compose down -v
docker compose up --build
```

Warning: `down -v` deletes the Postgres data volume.

## Issue: admin login does not work

Possible causes:

1. `SEED_DB` was `false` on the first run, so no admin user was created
2. `ADMIN_SESSION_SECRET` is missing or invalid
3. you changed seed credentials after the user had already been created

Fix for missing admin user on a fresh setup:

```bash
docker compose down -v
```

Set in `.env`:

```env
SEED_DB=true
ADMIN_SEED_EMAIL=admin@fryesudasministries.com
ADMIN_SEED_PASSWORD=your-admin-password
```

Then start again:

```bash
docker compose up --build
```

After seeding succeeds, change `SEED_DB=false`.

## Issue: app is up but cannot talk to the database

Cause:

- using `localhost` instead of `postgres` inside containers

Fix:

- do not change the Compose `DATABASE_URL`
- inside Docker Compose, the DB host must stay `postgres`

This repository already sets:

```text
postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/yesudas_ministries
```

## Issue: site opens on the wrong port

Fix:

- use `http://localhost:4500` for the app
- use `localhost:5433` only if connecting to PostgreSQL from the host machine

## Issue: seed does not run

Cause:

- `SEED_DB` is not exactly `true`

Fix:

Use:

```env
SEED_DB=true
```

Not:

```env
SEED_DB=True
SEED_DB=TRUE
SEED_DB=1
```

The Compose command checks specifically for the string `true`.

## Clean restart procedure

Use this when Docker state is inconsistent, passwords changed, or the DB should be recreated from scratch:

```bash
docker compose down -v
docker compose up --build
```

If you need the admin user recreated too, make sure `.env` contains:

```env
SEED_DB=true
```

## Minimal `.env` example

```env
POSTGRES_PASSWORD=replace-with-openssl-rand-hex-24
ADMIN_SESSION_SECRET=replace-with-openssl-rand-base64-32
SEED_DB=true
ADMIN_SEED_EMAIL=admin@fryesudasministries.com
ADMIN_SEED_PASSWORD=ChangeMe123!
NEXT_PUBLIC_SITE_URL=http://localhost:4500
```

After the first successful run, change:

```env
SEED_DB=false
```

## Quick command reference

Generate values:

```bash
openssl rand -hex 24
openssl rand -base64 32
```

Start:

```bash
docker compose up --build
```

Start in background:

```bash
docker compose up -d --build
```

Check status:

```bash
docker compose ps
```

Check logs:

```bash
docker compose logs --tail=100 postgres
docker compose logs --tail=100 migrate
docker compose logs --tail=100 app
```

Reset everything:

```bash
docker compose down -v
docker compose up --build
```

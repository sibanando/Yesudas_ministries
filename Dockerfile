#
# Portable Docker setup:
# - Builds Next.js inside the container (produces `.next/standalone`)
# - Adds a `migrator` build target for running `prisma migrate deploy` + optional seeding
#

FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Install devDependencies too, because the migrator uses `tsx` for `prisma/seed.ts`.
ENV NODE_ENV=development

# Prisma `defineConfig` expects DATABASE_URL at generate time (prisma generate runs in `postinstall`).
ENV DATABASE_URL=postgresql://postgres:changeme@localhost:5432/yesudas_ministries

COPY package*.json ./
COPY prisma ./prisma
COPY lib ./lib
COPY tsconfig.json ./tsconfig.json
COPY prisma.config.ts ./prisma.config.ts

RUN npm ci

FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time defaults for `NEXT_PUBLIC_*` used in a few places.
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENV NEXT_PUBLIC_RAZORPAY_KEY_ID=
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

RUN npm run build

FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Standalone output + static assets
COPY --chown=nextjs:nodejs --from=builder /app/.next/standalone ./
COPY --chown=nextjs:nodejs --from=builder /app/.next/static     ./.next/static
COPY --chown=nextjs:nodejs --from=builder /app/public           ./public

# Entrypoint
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

USER nextjs
EXPOSE 3000

ENTRYPOINT ["/bin/sh", "docker-entrypoint.sh"]

FROM deps AS migrator
WORKDIR /app

FROM runner AS app


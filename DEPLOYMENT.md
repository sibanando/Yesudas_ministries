# Deployment Guide — Fr. Yesudas Ministries

This project is fully containerised and portable. Any machine with **Docker** and **Docker Compose** can run it.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Environment Variables](#environment-variables)
4. [Local Development (without Docker)](#local-development-without-docker)
5. [Docker Setup (recommended)](#docker-setup-recommended)
6. [Deploy to a Linux VPS](#deploy-to-a-linux-vps)
7. [Deploy to Railway](#deploy-to-railway)
8. [Deploy to Render](#deploy-to-render)
9. [Deploy to Fly.io](#deploy-to-flyio)
10. [Deploy to Google Cloud Run](#deploy-to-google-cloud-run)
11. [Nginx + SSL (production)](#nginx--ssl-production)
12. [Database Management](#database-management)
13. [Admin Panel](#admin-panel)
14. [Troubleshooting](#troubleshooting)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.1 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database | PostgreSQL 16 |
| ORM | Prisma 7.6.0 (WASM, no native binary) |
| Auth | JWT via `jose` (pure JS) |
| Payments | Razorpay + Stripe |
| Email | Nodemailer (SMTP) |
| Runtime | Node.js 20 on Alpine Linux |
| Container | Docker + Docker Compose |

---

## Project Structure

```
Yesudas_ministries/
├── app/                    # Next.js App Router pages & API routes
│   ├── admin/              # Admin panel pages
│   ├── api/                # REST API routes
│   ├── blog/               # Public blog pages
│   ├── events/             # Public events pages
│   ├── ministries/         # Public ministries pages
│   └── sermons/            # Public sermons pages
├── components/             # React components
│   └── admin/              # Admin-specific components
├── lib/                    # Server utilities (db, auth, mappers)
├── prisma/                 # Database schema & migrations
├── public/                 # Static assets
├── Dockerfile              # Multi-stage Docker build
├── docker-compose.yml      # App + PostgreSQL + migration services
└── .env                    # Environment variables (copy from below)
```

---

## Environment Variables

Create a `.env` file at the project root with the following variables:

```env
# ── Database ──────────────────────────────────────────────────────
POSTGRES_PASSWORD=your_strong_password_here

# ── Auth ──────────────────────────────────────────────────────────
# Generate with: openssl rand -base64 32
ADMIN_SESSION_SECRET=your_secret_here

# ── Admin Seed (first-time setup) ─────────────────────────────────
ADMIN_SEED_EMAIL=admin@fryesudasministries.com
ADMIN_SEED_PASSWORD=ChangeMe123!

# ── Site URL ──────────────────────────────────────────────────────
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# ── YouTube API (optional — falls back to mock data) ──────────────
YOUTUBE_API_KEY=
YOUTUBE_CHANNEL_ID=
YOUTUBE_CHANNEL_HANDLE=@fryesudasministries

# ── Email / SMTP ──────────────────────────────────────────────────
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
CONTACT_EMAIL_TO=admin@fryesudasministries.com

# ── Razorpay (Indian payments) ────────────────────────────────────
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=

# ── Stripe (international payments) ──────────────────────────────
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# ── Seeding ───────────────────────────────────────────────────────
# Set to true only on first deploy to seed the database
SEED_DB=false
```

> **Security tip:** Generate `ADMIN_SESSION_SECRET` with:
> ```bash
> openssl rand -base64 32
> ```

---

## Local Development (without Docker)

### Prerequisites
- Node.js 20+
- PostgreSQL 16 running locally

```bash
# 1. Clone the repo
git clone https://github.com/sibanando/Yesudas_ministries.git
cd Yesudas_ministries

# 2. Install dependencies
npm install

# 3. Create a PostgreSQL database
psql -U postgres -c "CREATE DATABASE yesudas_ministries;"

# 4. Create .env.local with your local settings
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/yesudas_ministries"
ADMIN_SESSION_SECRET="any-random-string-for-dev"

# 5. Run database migrations
npx prisma migrate dev --name init

# 6. Seed the database (first time only)
npx prisma db seed

# 7. Start the dev server
npm run dev
```

App runs at `http://localhost:3000`
Admin at `http://localhost:3000/admin`

---

## Docker Setup (recommended)

### Prerequisites
- Docker 20+
- Docker Compose v2

### First-time setup

```bash
# 1. Clone the repo
git clone https://github.com/sibanando/Yesudas_ministries.git
cd Yesudas_ministries

# 2. Create your .env file
cp .env.example .env
# Edit .env — fill in POSTGRES_PASSWORD, ADMIN_SESSION_SECRET, SMTP_*, etc.

# 3. Build and start (includes DB migrations)
docker compose up -d --build

# 4. Seed the database (first time only)
SEED_DB=true docker compose up -d --build
```

App runs at `http://localhost:4500`
Admin at `http://localhost:4500/admin`

### Common commands

```bash
# Start
docker compose up -d

# Stop
docker compose down

# Rebuild after code changes
docker compose up -d --build

# View logs
docker compose logs -f app

# Stop and delete all data (irreversible)
docker compose down -v
```

---

## Deploy to a Linux VPS

Works on **DigitalOcean**, **Linode**, **Hetzner**, **AWS EC2**, **Azure VM**, etc.

### Step 1 — Install Docker on the server

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# Log out and back in
```

### Step 2 — Clone and configure

```bash
git clone https://github.com/sibanando/Yesudas_ministries.git
cd Yesudas_ministries
nano .env   # Fill in all required variables
```

### Step 3 — Run

```bash
docker compose up -d --build
```

### Step 4 — Set up firewall

```bash
# Allow HTTP and HTTPS traffic
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 4500   # or remove once Nginx is set up
sudo ufw enable
```

App is live at `http://YOUR_SERVER_IP:4500`

> Follow the [Nginx + SSL](#nginx--ssl-production) section to serve on port 80/443 with HTTPS.

---

## Deploy to Railway

[Railway](https://railway.app) supports Docker Compose deployments directly.

1. Push your code to GitHub
2. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
3. Select your repository
4. Railway auto-detects the `Dockerfile`
5. Go to **Variables** tab and add all env vars from the [Environment Variables](#environment-variables) section
6. Add a **PostgreSQL** plugin from Railway's dashboard
7. Set `DATABASE_URL` to the Railway-provided connection string
8. Deploy

---

## Deploy to Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → **New** → **Web Service**
3. Connect your GitHub repository
4. Set:
   - **Environment**: Docker
   - **Dockerfile path**: `./Dockerfile`
5. Add all env vars in the **Environment** tab
6. Create a **PostgreSQL** database from Render's dashboard
7. Set `DATABASE_URL` to the Render-provided connection string
8. Deploy

---

## Deploy to Fly.io

### Prerequisites
```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh
fly auth login
```

### Deploy

```bash
# From the project root
fly launch   # follow the prompts, select region

# Set secrets (env vars)
fly secrets set POSTGRES_PASSWORD=your_password
fly secrets set ADMIN_SESSION_SECRET=your_secret
fly secrets set SMTP_HOST=smtp.gmail.com
# ... add all other env vars

# Create a Postgres database on Fly
fly postgres create --name yesudas-db
fly postgres attach yesudas-db

# Deploy
fly deploy
```

App runs at `https://your-app-name.fly.dev`

---

## Deploy to Google Cloud Run

### Prerequisites
- Google Cloud SDK installed and authenticated
- A GCP project with billing enabled

```bash
# 1. Build and push image to Google Container Registry
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/yesudas-ministries

# 2. Deploy to Cloud Run
gcloud run deploy yesudas-ministries \
  --image gcr.io/YOUR_PROJECT_ID/yesudas-ministries \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL=your_db_url,ADMIN_SESSION_SECRET=your_secret

# 3. Use Cloud SQL (PostgreSQL) for the database
# Create a Cloud SQL instance and connect via DATABASE_URL
```

---

## Nginx + SSL (production)

Once your app is running on a VPS, use Nginx as a reverse proxy with Let's Encrypt SSL.

### Step 1 — Install Nginx and Certbot

```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx -y
```

### Step 2 — Create Nginx config

```bash
sudo nano /etc/nginx/sites-available/fryesudasministries.com
```

Paste:

```nginx
server {
    server_name fryesudasministries.com www.fryesudasministries.com;

    location / {
        proxy_pass http://localhost:4500;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Step 3 — Enable and get SSL certificate

```bash
sudo ln -s /etc/nginx/sites-available/fryesudasministries.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Get SSL certificate (free, auto-renews)
sudo certbot --nginx -d fryesudasministries.com -d www.fryesudasministries.com
```

Site is now live at `https://fryesudasministries.com`

---

## Database Management

### Run migrations manually

```bash
# Inside Docker
docker compose exec app npx prisma migrate deploy

# Locally
npx prisma migrate deploy
```

### Seed the database

```bash
# First time only — sets up admin user and sample data
SEED_DB=true docker compose up -d --build
```

### Access the database directly

```bash
# Connect via psql (Docker)
docker compose exec postgres psql -U postgres -d yesudas_ministries

# View tables
\dt

# Exit
\q
```

### Backup the database

```bash
docker compose exec postgres pg_dump -U postgres yesudas_ministries > backup_$(date +%Y%m%d).sql
```

### Restore from backup

```bash
cat backup_20260422.sql | docker compose exec -T postgres psql -U postgres -d yesudas_ministries
```

---

## Admin Panel

| URL | Description |
|-----|-------------|
| `/admin` | Dashboard |
| `/admin/login` | Admin login |
| `/admin/blog` | Manage blog posts |
| `/admin/events` | Manage events |
| `/admin/sermons` | Manage sermons |
| `/admin/ministries` | Manage ministries |
| `/admin/team` | Manage team members |
| `/admin/contacts` | View contact submissions |
| `/admin/donations` | View donations |
| `/admin/newsletter` | View & export subscribers |

**Default credentials** (change immediately after first login):
- Email: `admin@fryesudasministries.com`
- Password: `ChangeMe123!`

---

## Troubleshooting

### App won't start — "Missing required environment variable"
Ensure `DATABASE_URL` and `ADMIN_SESSION_SECRET` are set in your `.env` file.

### Database connection refused
Make sure the `postgres` container is healthy before the `app` container starts. Docker Compose handles this automatically via `depends_on: condition: service_healthy`.

```bash
docker compose ps   # check status of all containers
docker compose logs postgres   # check DB logs
```

### Port 4500 already in use
Change the port mapping in `docker-compose.yml`:
```yaml
ports:
  - "8080:3000"   # change 4500 to any free port
```

### Prisma migration failed
```bash
docker compose logs migrate   # view migration logs
docker compose run --rm migrate sh -c "npx prisma migrate status"
```

### Stripe webhook not working locally
Use the Stripe CLI to forward webhooks to your local server:
```bash
stripe listen --forward-to localhost:4500/api/stripe/webhook
```

### YouTube API not loading sermons
The app falls back to mock sermon data if `YOUTUBE_API_KEY` is not set or the API quota is exceeded. Set `YOUTUBE_API_KEY` and `YOUTUBE_CHANNEL_ID` in `.env` to load real sermons.

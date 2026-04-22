# Deployment Guide — Fr. Yesudas Ministries

This project supports **two deployment paths** — both use the same Docker image:

| | Docker Compose | Kubernetes |
|-|---------------|------------|
| **Best for** | Local dev, single VPS | Production clusters, auto-scaling |
| **Start** | `make compose-up` | `make k8s-deploy` |
| **Scale** | Manual (one server) | Auto (2–10 pods via HPA) |
| **TLS** | Nginx + Certbot (manual) | cert-manager + Let's Encrypt (auto) |
| **Complexity** | Simple | More setup, more control |

A `Makefile` at the project root manages both paths — see [all commands](#makefile-commands).

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
11. [Deploy to Kubernetes](#deploy-to-kubernetes)
12. [Nginx + SSL (production)](#nginx--ssl-production)
13. [Database Management](#database-management)
14. [Admin Panel](#admin-panel)
15. [Troubleshooting](#troubleshooting)

---

## Makefile Commands

Run `make help` to see all commands. Quick reference:

```bash
# ── Build ──────────────────────────────────────────────────────────
make build              # Build app + migrator Docker images locally
make push               # Build and push both images to registry

# ── Docker Compose (local / single server) ─────────────────────────
make compose-up         # Start everything
make compose-down       # Stop
make compose-restart    # Rebuild and restart
make compose-seed       # Seed database (first time only)
make compose-logs       # Tail app logs
make compose-clean      # Remove containers + all data (irreversible)

# ── Kubernetes (production cluster) ────────────────────────────────
make k8s-deploy         # Deploy all manifests to cluster
make k8s-restart        # Rolling restart — zero downtime
make k8s-migrate        # Re-run Prisma migrations
make k8s-status         # Show pods, services, ingress
make k8s-logs           # Tail app logs
make k8s-release        # push + migrate + restart (full release)
```

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
touch .env
# Edit .env — fill in POSTGRES_PASSWORD, ADMIN_SESSION_SECRET, SMTP_*, etc.
# See DOCKER_NOTES.md for full variable reference and step-by-step setup.

# 3. Build and start (includes DB migrations)
docker compose up -d --build

# 4. Seed the database (first time only)
SEED_DB=true docker compose up -d --build
```

App runs at `http://localhost:4500`
Admin at `http://localhost:4500/admin`

> PostgreSQL is also exposed on the host at `localhost:5433` (for external DB tools). Inside Compose, the DB host is `postgres:5432`.

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

## Deploy to Kubernetes

The same Docker image that runs locally via Docker Compose deploys directly to any Kubernetes cluster — **no changes to the image needed**.

All manifest files are in the `k8s/` directory.

### K8s Files Overview

| File | Purpose |
|------|---------|
| `k8s/namespace.yaml` | Dedicated namespace `yesudas-ministries` |
| `k8s/secret.yaml` | Sensitive values (passwords, API keys) |
| `k8s/configmap.yaml` | Non-sensitive config (URLs, SMTP host) |
| `k8s/postgres.yaml` | PostgreSQL Deployment + PVC + Service |
| `k8s/migrate-job.yaml` | One-shot Job to run Prisma migrations |
| `k8s/app.yaml` | App Deployment (2 replicas) + ClusterIP Service |
| `k8s/ingress.yaml` | Nginx Ingress + Let's Encrypt TLS |
| `k8s/hpa.yaml` | Horizontal Pod Autoscaler (2–10 pods) |

---

### Prerequisites

```bash
# A running Kubernetes cluster (any of the below)
# - Local:  minikube, kind, k3s
# - Cloud:  GKE (Google), AKS (Azure), EKS (AWS)

kubectl version --client

# Install nginx ingress controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.0/deploy/static/provider/cloud/deploy.yaml

# Install cert-manager (for automatic SSL)
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.14.4/cert-manager.yaml
```

---

### Step 1 — Push your image to a registry

Kubernetes pulls images from a container registry. Push to GitHub Container Registry (free):

```bash
# Login to GHCR
echo $GITHUB_TOKEN | docker login ghcr.io -u sibanando --password-stdin

# Build and tag
docker build -t ghcr.io/sibanando/yesudas-ministries:latest .

# Push
docker push ghcr.io/sibanando/yesudas-ministries:latest
```

Update the `image:` field in `k8s/app.yaml` and `k8s/migrate-job.yaml` to your registry URL.

---

### Step 2 — Fill in secrets

Edit `k8s/secret.yaml` — encode each value with:

```bash
echo -n "your_actual_value" | base64
```

Example:
```bash
echo -n "my-strong-password" | base64
# Output: bXktc3Ryb25nLXBhc3N3b3Jk
```

Replace every `<base64-encoded-value>` placeholder in `k8s/secret.yaml`.

> Never commit real secrets to git. Use [Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets) or your cloud provider's secret manager in production.

---

### Step 3 — Deploy

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Apply secrets and config
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/configmap.yaml

# Start PostgreSQL
kubectl apply -f k8s/postgres.yaml

# Wait for PostgreSQL to be ready
kubectl wait --for=condition=ready pod -l app=postgres -n yesudas-ministries --timeout=60s

# Run database migrations
kubectl apply -f k8s/migrate-job.yaml
kubectl wait --for=condition=complete job/prisma-migrate -n yesudas-ministries --timeout=120s

# Deploy the app
kubectl apply -f k8s/app.yaml

# Set up ingress + TLS
kubectl apply -f k8s/ingress.yaml

# Enable autoscaling
kubectl apply -f k8s/hpa.yaml
```

Or apply everything at once:

```bash
kubectl apply -f k8s/
```

---

### Step 4 — Verify

```bash
# Check all pods are running
kubectl get pods -n yesudas-ministries

# Check services
kubectl get svc -n yesudas-ministries

# Check ingress (shows assigned IP)
kubectl get ingress -n yesudas-ministries

# Watch pod logs
kubectl logs -f deployment/yesudas-app -n yesudas-ministries
```

Expected output:
```
NAME                             READY   STATUS      RESTARTS
postgres-xxx                     1/1     Running     0
prisma-migrate-xxx               0/1     Completed   0
yesudas-app-xxx                  1/1     Running     0
yesudas-app-yyy                  1/1     Running     0
```

---

### Updating the app

```bash
# Build and push new image
docker build -t ghcr.io/sibanando/yesudas-ministries:latest .
docker push ghcr.io/sibanando/yesudas-ministries:latest

# Rolling restart (zero downtime — 2 replicas means one stays up)
kubectl rollout restart deployment/yesudas-app -n yesudas-ministries

# Run migrations if schema changed
kubectl delete job prisma-migrate -n yesudas-ministries
kubectl apply -f k8s/migrate-job.yaml
```

---

### Cluster options

| Cluster | Free tier | Notes |
|---------|-----------|-------|
| **Minikube** | Yes (local) | Best for testing K8s locally |
| **k3s** | Yes (VPS) | Lightweight, runs on a $5 VPS |
| **GKE Autopilot** | $74/mo | Google-managed, no node management |
| **AKS** | Free control plane | Pay only for VMs |
| **EKS** | $0.10/hr control plane | AWS managed |
| **DigitalOcean K8s** | $12/mo | Simplest managed K8s |

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

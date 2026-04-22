REGISTRY   ?= ghcr.io/sibanando
IMAGE_APP  := $(REGISTRY)/yesudas-ministries:latest
IMAGE_MIG  := $(REGISTRY)/yesudas-ministries:migrator
NAMESPACE  := yesudas-ministries

# ─────────────────────────────────────────────
#  BUILD
# ─────────────────────────────────────────────

## Build both Docker images locally
build:
	docker build --target app      -t $(IMAGE_APP) .
	docker build --target migrator -t $(IMAGE_MIG) .

## Push both images to the container registry
push: build
	docker push $(IMAGE_APP)
	docker push $(IMAGE_MIG)

# ─────────────────────────────────────────────
#  DOCKER COMPOSE  (local / single-server)
# ─────────────────────────────────────────────

## Start with Docker Compose (build if needed)
compose-up:
	docker compose up -d --build

## Stop Docker Compose
compose-down:
	docker compose down

## Rebuild and restart Docker Compose
compose-restart:
	docker compose up -d --build --force-recreate

## Seed the database (first time only)
compose-seed:
	SEED_DB=true docker compose up -d --build

## Tail app logs
compose-logs:
	docker compose logs -f app

## Remove containers AND all data volumes (irreversible)
compose-clean:
	docker compose down -v

# ─────────────────────────────────────────────
#  KUBERNETES  (production cluster)
# ─────────────────────────────────────────────

## Apply all K8s manifests (deploy everything)
k8s-deploy:
	kubectl apply -f k8s/namespace.yaml
	kubectl apply -f k8s/secret.yaml
	kubectl apply -f k8s/configmap.yaml
	kubectl apply -f k8s/postgres.yaml
	kubectl wait --for=condition=ready pod -l app=postgres -n $(NAMESPACE) --timeout=90s
	kubectl apply -f k8s/migrate-job.yaml
	kubectl wait --for=condition=complete job/prisma-migrate -n $(NAMESPACE) --timeout=120s
	kubectl apply -f k8s/app.yaml
	kubectl apply -f k8s/ingress.yaml
	kubectl apply -f k8s/hpa.yaml

## Rolling restart the app (zero downtime)
k8s-restart:
	kubectl rollout restart deployment/yesudas-app -n $(NAMESPACE)
	kubectl rollout status  deployment/yesudas-app -n $(NAMESPACE)

## Re-run migrations (after schema changes)
k8s-migrate:
	kubectl delete job prisma-migrate -n $(NAMESPACE) --ignore-not-found
	kubectl apply -f k8s/migrate-job.yaml
	kubectl wait --for=condition=complete job/prisma-migrate -n $(NAMESPACE) --timeout=120s

## Show pod status
k8s-status:
	kubectl get pods,svc,ingress -n $(NAMESPACE)

## Tail app logs
k8s-logs:
	kubectl logs -f deployment/yesudas-app -n $(NAMESPACE)

## Delete all K8s resources (keeps persistent volumes)
k8s-delete:
	kubectl delete namespace $(NAMESPACE)

## Full K8s release: push new image + run migrations + rolling restart
k8s-release: push k8s-migrate k8s-restart

# ─────────────────────────────────────────────
#  HELP
# ─────────────────────────────────────────────

help:
	@echo ""
	@echo "  Fr. Yesudas Ministries — Deployment Commands"
	@echo ""
	@echo "  BUILD"
	@echo "    make build            Build app + migrator Docker images"
	@echo "    make push             Build and push both images to registry"
	@echo ""
	@echo "  DOCKER COMPOSE  (local / single server)"
	@echo "    make compose-up       Start with Docker Compose"
	@echo "    make compose-down     Stop"
	@echo "    make compose-restart  Rebuild and restart"
	@echo "    make compose-seed     Seed the database (first time only)"
	@echo "    make compose-logs     Tail app logs"
	@echo "    make compose-clean    Remove containers + all data (irreversible)"
	@echo ""
	@echo "  KUBERNETES  (production cluster)"
	@echo "    make k8s-deploy       Deploy all manifests to cluster"
	@echo "    make k8s-restart      Rolling restart (zero downtime)"
	@echo "    make k8s-migrate      Re-run Prisma migrations"
	@echo "    make k8s-status       Show pods, services, ingress"
	@echo "    make k8s-logs         Tail app logs"
	@echo "    make k8s-delete       Remove all K8s resources"
	@echo "    make k8s-release      push + migrate + restart (full release)"
	@echo ""

.PHONY: build push \
        compose-up compose-down compose-restart compose-seed compose-logs compose-clean \
        k8s-deploy k8s-restart k8s-migrate k8s-status k8s-logs k8s-delete k8s-release \
        help

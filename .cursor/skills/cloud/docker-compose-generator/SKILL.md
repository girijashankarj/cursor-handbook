---
name: docker-compose-generator
description: Generate docker-compose.yml files for local development with application services, databases, caches, and queues. Use when the user asks to set up a local dev environment or create docker-compose configuration.
---

# Skill: Docker Compose Generator

Generate a complete `docker-compose.yml` for local development with all required services, health checks, and networking.

## Trigger
When the user asks to create a docker-compose file, set up a local dev environment, or add services to an existing compose config.

## Prerequisites
- [ ] Application services identified
- [ ] Dependencies identified (database, cache, queue, etc.)
- [ ] Port requirements known

## Steps

### Step 1: Identify Required Services

| Service | Image | Default Port |
|---------|-------|-------------|
| **PostgreSQL** | `postgres:16-alpine` | 5432 |
| **MySQL** | `mysql:8.0` | 3306 |
| **MongoDB** | `mongo:7` | 27017 |
| **Redis** | `redis:7-alpine` | 6379 |
| **OpenSearch** | `opensearchproject/opensearch:2` | 9200 |
| **RabbitMQ** | `rabbitmq:3-management-alpine` | 5672, 15672 |
| **Kafka** | `confluentinc/cp-kafka:7.5.0` | 9092 |
| **LocalStack** | `localstack/localstack:latest` | 4566 |
| **Mailhog** | `mailhog/mailhog` | 1025, 8025 |
| **MinIO** | `minio/minio` | 9000, 9001 |

### Step 2: Generate Base Compose File

```yaml
version: "3.9"

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: deps
    volumes:
      - .:/app
      - /app/node_modules
    ports:
      - "${APP_PORT:-3000}:3000"
    environment:
      - NODE_ENV=development
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_NAME=${DB_NAME:-myapp}
      - DB_USERNAME=${DB_USERNAME:-postgres}
      - DB_PASSWORD=${DB_PASSWORD:-postgres}
      - REDIS_URL=redis://redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped
```

### Step 3: Add Database Service

```yaml
  postgres:
    image: postgres:16-alpine
    ports:
      - "${DB_PORT:-5432}:5432"
    environment:
      POSTGRES_DB: ${DB_NAME:-myapp}
      POSTGRES_USER: ${DB_USERNAME:-postgres}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-postgres}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped
```

### Step 4: Add Cache Service

```yaml
  redis:
    image: redis:7-alpine
    ports:
      - "${REDIS_PORT:-6379}:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped
```

### Step 5: Add Queue / Search / Other Services
- [ ] Add services based on project requirements
- [ ] Include health checks for every service
- [ ] Use environment variables for configurable ports
- [ ] Add management UIs where available (RabbitMQ, OpenSearch Dashboards)

### Step 6: Add Volumes and Networks

```yaml
volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local

networks:
  default:
    name: ${COMPOSE_PROJECT_NAME:-myapp}_network
```

### Step 7: Create Helper Scripts
- [ ] `docker-compose up -d` wrapper with health check waiting
- [ ] Database seed script
- [ ] Reset script (destroy volumes, recreate)

```bash
# scripts/dev-setup.sh
#!/usr/bin/env bash
set -euo pipefail

echo "Starting services..."
docker compose up -d

echo "Waiting for database..."
until docker compose exec postgres pg_isready -U postgres; do
  sleep 2
done

echo "Running migrations..."
npm run migrate

echo "Dev environment ready!"
```

### Step 8: Create .env for Docker
```bash
# .env.docker (for docker-compose)
COMPOSE_PROJECT_NAME=myapp
APP_PORT=3000
DB_PORT=5432
DB_NAME=myapp
DB_USERNAME=postgres
DB_PASSWORD=postgres
REDIS_PORT=6379
```

### Step 9: Update .dockerignore
```
node_modules
.git
.env
.env.*
dist
coverage
*.log
```

## Rules
- **ALWAYS** pin image versions (no `:latest` except for dev-only tools)
- **ALWAYS** include health checks for every service
- **ALWAYS** use named volumes for data persistence
- **ALWAYS** use environment variables for ports and credentials
- **NEVER** use production credentials in compose files
- **NEVER** expose management ports in production compose files
- Use `depends_on` with `condition: service_healthy` for startup ordering
- Add `restart: unless-stopped` for resilient local dev

## Completion
Complete `docker-compose.yml` with all services, health checks, volumes, and helper scripts. Ready to run with `docker compose up`.

## If a Step Fails
- **Port conflict:** Use environment variables to override ports
- **Image pull fails:** Check network, verify image name and tag exist
- **Health check fails:** Increase timeout/retries, check service logs
- **Volume permission issues:** Set appropriate `user:` in the service or fix ownership

---
name: docker-compose
description: Generate a docker-compose.yml snippet for a service (database, cache, queue, search, etc.).
---

# Command: Docker Compose

## Invocation
`/docker-compose`

## Description
Generate a docker-compose service definition with health checks, volumes, and environment configuration for common development dependencies.

## Parameters
- `service`: Service type — `postgres`, `mysql`, `mongo`, `redis`, `opensearch`, `rabbitmq`, `kafka`, `localstack`, `mailhog`, `minio`
- `port`: Override default port (optional)

## Action
1. Generate a compose service block with:
   - Pinned image version (no `:latest`)
   - Port mapping with env var override
   - Health check
   - Named volume for persistence
   - Environment variables for configuration
   - `restart: unless-stopped`
2. Include the volumes section.
3. Note the connection string/URL for the application config.

## When to Use
- Adding a new dependency to the local dev environment
- Setting up a project's docker-compose from scratch
- Replacing a cloud service with a local equivalent for development

## Token Cost
~1–3K tokens

## Expected Output
- Copy-paste ready YAML service block
- Volume definition
- Connection string for application config
- Health check included

## Troubleshooting
- **Port conflict:** Use the `port` parameter to override defaults
- **Full compose file needed:** Use the `docker-compose-generator` skill instead
- **Platform-specific images:** Notes ARM64 compatibility where relevant

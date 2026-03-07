# Command: Docker Build

## Invocation
`/docker-build`

## Description
Build and tag Docker image for the current project.

## Action
```bash
docker build -t {{CONFIG.project.name}}:latest .
docker build -t {{CONFIG.project.name}}:$(git rev-parse --short HEAD) .
```

## When to Use
- Testing Docker build locally
- Before pushing to container registry
- After Dockerfile changes

## Expected Output
- Successfully built image
- Image size report
- Layer analysis

# Mermaid Theme Reference

Standardize Mermaid diagrams across your docs and AI-generated architecture notes.

## Recommended theme

Use the `neutral` theme for clean, professional diagrams that work in both light and dark modes:

```mermaid
%%{init: {'theme': 'neutral'}}%%
flowchart LR
    A[Request] --> B[Handler]
    B --> C[Service]
    C --> D[Database]
```

## Available themes

| Theme | Best for | Look |
|-------|----------|------|
| `default` | General use | Blue/purple palette |
| `neutral` | Documentation, PRs | Grayscale, professional |
| `dark` | Dark-mode docs/IDEs | Dark background |
| `forest` | Presentations | Green palette |

## Common diagram types

### Architecture / data flow

```mermaid
%%{init: {'theme': 'neutral'}}%%
flowchart TD
    subgraph API Layer
        A[API Gateway]
        B[Auth Middleware]
    end
    subgraph Service Layer
        C[Order Service]
        D[Payment Service]
        E[Notification Service]
    end
    subgraph Data Layer
        F[(PostgreSQL)]
        G[(Redis Cache)]
    end
    A --> B --> C
    C --> D
    C --> E
    C --> F
    C --> G
```

### Sequence diagram (request flow)

```mermaid
%%{init: {'theme': 'neutral'}}%%
sequenceDiagram
    participant Client
    participant Handler
    participant Service
    participant DB

    Client->>Handler: POST /api/v1/orders
    Handler->>Handler: Validate input
    Handler->>Service: createOrder(data)
    Service->>DB: INSERT INTO orders
    DB-->>Service: order record
    Service-->>Handler: order result
    Handler-->>Client: 201 Created
```

### State diagram (entity lifecycle)

```mermaid
%%{init: {'theme': 'neutral'}}%%
stateDiagram-v2
    [*] --> PENDING: Order created
    PENDING --> CONFIRMED: Payment received
    PENDING --> CANCELLED: User cancels
    CONFIRMED --> SHIPPED: Dispatched
    CONFIRMED --> CANCELLED: Admin cancels
    SHIPPED --> DELIVERED: Delivery confirmed
    DELIVERED --> [*]
    CANCELLED --> [*]
```

### CI/CD pipeline

```mermaid
%%{init: {'theme': 'neutral'}}%%
flowchart LR
    A[Lint] --> B[Type Check]
    B --> C[Unit Tests]
    C --> D[Build]
    D --> E[Integration Tests]
    E --> F[Security Scan]
    F --> G[Deploy]
```

## Configuration

### In MkDocs (`mkdocs.yml`)

```yaml
markdown_extensions:
  - pymdownx.superfences:
      custom_fences:
        - name: mermaid
          class: mermaid
          format: !!python/name:pymdownx.superfences.fence_code_format

extra_javascript:
  - https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js

extra:
  mermaid:
    theme: neutral
```

### In Docusaurus

```javascript
module.exports = {
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],
  themeConfig: {
    mermaid: {
      theme: { light: 'neutral', dark: 'dark' },
    },
  },
};
```

### Inline (per diagram)

Add a theme directive at the top of any diagram:

```
%%{init: {'theme': 'neutral'}}%%
```

## Conventions for cursor-handbook

- Use `neutral` theme by default for all docs
- Use `flowchart` for architecture and data flow
- Use `sequenceDiagram` for request/response flows
- Use `stateDiagram-v2` for entity lifecycles
- Use `flowchart LR` (left-to-right) for pipelines and processes
- Keep diagrams under 15 nodes for readability
- Use subgraphs to group related components

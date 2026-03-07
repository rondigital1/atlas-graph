# AtlasGraph

AtlasGraph is a production-oriented TypeScript monorepo for a future travel-planning product. The repository currently includes foundational workspace setup and `T-002: Set up database and ORM`.

## What this repo includes

- `pnpm` workspaces with one web app and four shared packages
- Strict TypeScript configuration shared across the workspace
- Next.js App Router app with a minimal placeholder shell
- Prisma 7 configured for PostgreSQL with migrations under `prisma/migrations`
- Generated Prisma client wiring owned by `packages/db`
- Local PostgreSQL development setup via Docker Compose
- Execution-focused planner-run persistence schema with JSON payload storage
- ESLint, Prettier, and Vitest wired for repo-wide use

## What is intentionally not implemented yet

- Travel-planning logic
- Agent orchestration or workflows
- Prompt content
- Provider/API integrations
- Feature-level planner services or repositories beyond minimal DB scaffolding
- API routes or UI flows that depend on persistence

## Repository structure

```text
.
├── apps/
│   └── web/                  # Thin Next.js shell
├── packages/
│   ├── agent/                # Future agent modules
│   ├── config/               # Shared env parsing
│   ├── core/                 # Shared types and schemas
│   └── db/                   # Prisma client, health, repository helpers
├── prisma/
│   ├── migrations/           # Prisma migrations
│   └── schema.prisma
├── compose.yaml              # Local PostgreSQL service
├── prisma.config.ts          # Prisma 7 datasource and migration config
└── package.json
```

## Package overview

### `apps/web`

Presentation layer only. It does not own business logic or direct database access.

### `packages/core`

Shared domain-adjacent types and schemas.

### `packages/agent`

Reserved for future planner, prompt, tool, and service modules.

### `packages/config`

Shared environment validation. `DATABASE_URL` is required here because Prisma and `packages/db` depend on it.

### `packages/db`

Owns database concerns:

- generated Prisma client consumption
- Prisma singleton wiring for Node/dev
- DB health helper
- minimal planner-run repository helpers
- execution-focused planner run tables for inputs, tool results, outputs, and errors

## Getting started

### Prerequisites

- Node.js `20.11+`
- `pnpm` `10.30.3+`
- Docker with Compose support

### Install dependencies

```bash
pnpm install
```

### Configure environment

```bash
cp .env.example .env
```

`DATABASE_URL` is required for Prisma commands and any runtime code that imports `packages/db`.

### Start local PostgreSQL

```bash
pnpm db:up
```

This starts a PostgreSQL container at `localhost:5433` with:

- database: `atlas_graph`
- user: `postgres`
- password: `postgres`

### Generate the Prisma client

```bash
pnpm prisma:generate
```

The generated client is written to `packages/db/generated/prisma`.

### Run migrations

For the initial local setup:

```bash
pnpm prisma:migrate:dev
```

Prisma will prompt for a migration name.

For applying committed migrations:

```bash
pnpm prisma:migrate:deploy
```

### Check database connectivity and schema availability

```bash
pnpm db:check
```

### Run the app

```bash
pnpm dev
```

## Workspace commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm format
```

## Notes for future tickets

- Planner inputs, tool results, outputs, and error details are stored as JSON payloads for now to avoid premature over-modeling.
- `PlannerRun` includes top-level searchable execution metadata such as destination, prompt version, and orchestrator version.
- `packages/db` intentionally stops at infrastructure, health checks, and minimal repository helpers.
- Travel-planning behavior, agent logic, and provider integrations should land in later tickets.

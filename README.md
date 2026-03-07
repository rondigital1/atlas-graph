# AtlasGraph

AtlasGraph is a production-oriented TypeScript monorepo scaffold for a future travel-planning product. This repository only covers ticket `T-001: Initialize repo and workspace`.

## What this repo includes

- `pnpm` workspaces with one web app and four shared packages
- Strict TypeScript configuration shared across the workspace
- Next.js App Router app with Tailwind CSS and a minimal placeholder shell
- Shared package boundaries for core types, agent modules, database wiring, and config/env utilities
- ESLint, Prettier, and Vitest wired for repo-wide use
- Prisma installed with a placeholder schema and client output path

## What is intentionally not implemented yet

- Travel planning logic
- Agent orchestration or workflows
- Prompt content
- API provider integrations
- Real Prisma models or database behavior
- Server actions, API routes, or business rules beyond placeholders

## Repository structure

```text
.
├── apps/
│   └── web/              # Next.js web shell
├── packages/
│   ├── agent/            # Future agent modules and boundaries
│   ├── config/           # Shared env/config helpers
│   ├── core/             # Shared types, schemas, and domain primitives
│   └── db/               # Prisma and repository wiring placeholders
├── prisma/               # Placeholder Prisma schema
├── prisma.config.ts      # Prisma 7 datasource configuration
├── eslint.config.mjs
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── vitest.config.ts
```

## Package overview

### `apps/web`

Thin presentation layer only. It renders a branded shell and placeholder sections for future travel planner UI work.

### `packages/core`

Shared domain-adjacent primitives, types, and Zod schemas. This is where cross-app schemas and canonical shared types should live.

### `packages/agent`

Reserved for planner, prompt, tool, and service modules. The package exists now to establish boundaries, not to implement behavior.

### `packages/db`

Reserved for Prisma client wiring and repository access patterns. The included schema and generated-client path are placeholders only.

### `packages/config`

Shared environment and configuration helpers. This keeps env parsing out of the UI layer and makes future server packages consistent.

## Getting started

### Prerequisites

- Node.js `20.11+`
- `pnpm` `10.30.3` or newer

### Install

```bash
pnpm install
```

### Run the web app

```bash
pnpm dev
```

The app will start from `apps/web`.

### Workspace commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm format
```

### Prisma placeholder commands

```bash
pnpm prisma:validate
pnpm prisma:generate
```

`prisma generate` is wired to output into `packages/db/generated/prisma`, but the generated client is not relied on yet because T-001 stops at scaffolding.

## Notes for the next ticket

- Tighten env validation from optional placeholders to required values once runtime entry points exist.
- Replace Prisma placeholder models with a real schema when data requirements are defined.
- Implement actual agent and domain behavior in the shared packages rather than in `apps/web`.

# AtlasGraph — AGENTS.md

## Purpose

AtlasGraph is a TypeScript/Node.js AI travel planner.

Current product direction:
- start with one planner agent
- use tool-fed context, not raw model guesswork
- use LangChain first
- migrate core orchestration to LangGraph later

This repository is optimized for:
- clean service boundaries
- strong runtime validation with Zod
- deterministic provider normalization
- typed planner output validation
- incremental ticket-based delivery

## How to work in this repo

When working on a task:
1. Stay within the requested ticket scope.
2. Prefer small, reviewable diffs.
3. Do not refactor unrelated code.
4. Do not “helpfully” implement future tickets unless explicitly asked.
5. If a task requires broader architectural changes, stop and report that clearly.

Codex should optimize for:
- correctness
- clean boundaries
- minimal scope drift
- testability
- deterministic behavior

## Architecture boundaries

### apps/web
Contains UI and route wiring only.

Do not place core business logic here.

### packages/core
Contains shared schemas, types, and domain-safe contracts.

Examples:
- Zod schemas
- inferred TypeScript types
- shared enums
- domain-level data contracts

### packages/agent
Contains agent-side orchestration and planning logic.

Examples:
- provider interfaces
- mock providers
- normalization utilities
- planner prompt assets
- planner chain
- service orchestration

### packages/db
Contains Prisma, DB client wiring, and persistence helpers.

Do not place planner/business logic here.

## Core design rules

### 1. Keep the planner grounded
The model should reason only over shaped, validated context.

Do not pass raw provider payloads directly into the planner if normalized forms exist.

### 2. Validate at boundaries
Use Zod schemas at important boundaries:
- incoming trip request
- provider normalization outputs
- planning context
- planner output

### 3. Prefer deterministic code around nondeterministic model behavior
Use normal code for:
- validation
- normalization
- deduplication
- context assembly
- post-generation checks

Use the model for:
- itinerary reasoning
- synthesis
- narrative planning decisions

### 4. Keep service orchestration explicit
Favor readable orchestration over hidden framework magic.

### 5. Do not over-model too early
Early persistence is run-centric, not full product-domain modeling.

## Coding conventions

- TypeScript everywhere possible
- Fully braced if-statements
- Clear naming over clever naming
- Prefer small focused files
- Avoid large utility dumping grounds
- Avoid premature abstractions
- Keep exports tidy
- Keep tests deterministic

## Ticket execution guidance

### Good task shape
A task should usually affect one bounded concern and a small set of files.

Good examples:
- implement mock providers
- add normalization utilities
- add planner prompt v1
- add planner chain tests

Bad examples:
- build the whole backend
- make the app production ready
- implement several tickets at once without being asked

### Scope control
If asked to implement one ticket:
- do that ticket only
- do not implement neighboring tickets unless explicitly requested
- if a missing prerequisite blocks progress, report it clearly

## Current important contracts

The most important shared contracts live in `packages/core`.

Examples include:
- TripRequest
- DestinationSummary
- WeatherSummary
- PlaceCandidate
- PlanningContext
- TripPlan
- ToolResult

When possible, infer TypeScript types from Zod schemas instead of duplicating interfaces.

## Planner architecture

The intended planning flow is:

TripRequest
-> provider calls
-> normalization
-> deduplication
-> PlanningContext
-> planner prompt construction
-> model call
-> JSON parse
-> TripPlanSchema validation
-> result

Keep these concerns separated.

## Model abstraction rule

Planner logic should depend on small internal abstractions, not directly on concrete SDKs.

Examples:
- `PlannerModel`
- `PlannerRunner`

Concrete adapters, such as LangChain-based model adapters, should stay behind those interfaces.

## Testing expectations

For code changes, add or update focused tests when appropriate.

Priority test areas:
- schema validation
- normalization behavior
- deduplication behavior
- planner output parsing/validation
- service orchestration
- error handling

Avoid:
- giant snapshots
- brittle formatting assertions
- unnecessary integration complexity

## Persistence expectations

Current persistence is execution-focused.

Important DB concepts:
- planner runs
- inputs
- tool results
- outputs
- errors

Do not introduce users, saved trips, places catalogs, or other full product tables unless explicitly requested.

## Commands

Prefer running targeted checks for the area you changed.

Typical commands:
- `pnpm install`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`

If working in a package, prefer scoped commands where available.

Before finishing:
1. run relevant tests
2. run typecheck for changed code
3. avoid unrelated breakage

## File placement guidance

Examples of where code should go:

- shared Zod schemas:
  - `packages/core/src/schemas/*`

- shared inferred types:
  - `packages/core/src/types/*`

- planning service:
  - `packages/agent/src/services/*`

- planner chain:
  - `packages/agent/src/planner/*`

- prompt assets:
  - `packages/agent/src/prompts/*`

- mock providers:
  - `packages/agent/src/providers/mock/*`

- normalization:
  - `packages/agent/src/normalization/*`

- prisma/db:
  - `packages/db/*`

## What to avoid

Do not:
- put business logic in `apps/web`
- couple service code directly to concrete LLM SDK types
- skip validation because mock data “looks clean”
- let one malformed provider item crash a whole normalized array
- silently broaden ticket scope
- rewrite architecture without being asked

## If unsure

If a change seems to require:
- touching many unrelated files
- changing architecture boundaries
- implementing a future ticket
- adding a new core abstraction

stop and explain the concern instead of guessing.
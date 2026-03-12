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

---

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

---

## Hard architecture rules

These are non-negotiable unless explicitly instructed otherwise.

### 1. Do not overload service classes
If a service starts handling:
- planning logic
- persistence lifecycle
- error serialization
- output summarization
- helper utilities
- request metadata cleanup

then it is doing too much.

Split responsibilities into focused modules/services instead of growing one large class.

### 2. TravelPlanningService must stay planning-focused
`TravelPlanningService` should own only:
- TripRequest validation
- provider calls
- normalization usage
- PlanningContext assembly
- plannerRunner.run(context)
- generatePlan(input: TripRequest)

It must NOT own:
- repository lifecycle
- planner run persistence
- output summary persistence
- persistence error mapping
- request/session/user metadata normalization
- duration/timestamp bookkeeping beyond direct planning needs

### 3. Persistence workflow belongs in a separate workflow service
If a ticket introduces planner run persistence, create a separate service such as:
- `PlanTripWorkflowService`

That workflow service may wrap `TravelPlanningService`, but must not collapse into it.

### 4. Composition belongs in factories, not core services
Concrete wiring such as:
- mock vs real providers
- dev vs real planner model
- LangChain adapter instantiation
- planner runner composition

must live in factory/composition code, not inside core services.

Good locations:
- `packages/agent/src/factories/*`
- `apps/web/src/server/*`

### 5. Planner logic must stay model-agnostic
Planner and service code should depend on small internal abstractions such as:
- `PlannerModel`
- `PlannerRunner`

Do not couple service code directly to concrete SDK types.

### 6. If a class needs many private helper methods, stop
If a class gains many helpers for unrelated concerns, extract them into:
- helper module
- mapper
- summary builder
- factory
- dedicated service

Large classes are a smell in this repo.

### 7. Do not hide cross-ticket work inside one file
If a ticket starts adding logic from future tickets, stop.
Do not mix:
- planning
- persistence
- repair loop
- observability
- LangGraph
in one implementation unless explicitly requested.

---

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
- planning-focused services
- workflow services only when explicitly needed

### packages/db
Contains Prisma, DB client wiring, and persistence helpers.

Do not place planner/business logic here.

---

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

### 4. Keep orchestration explicit
Favor readable orchestration over hidden framework magic.

### 5. Do not over-model too early
Early persistence is run-centric, not full product-domain modeling.

---

## Service design rules

### Planning service vs workflow service
Use this split consistently:

#### Planning service
Owns:
- planning context creation
- planner execution
- returning `TripPlan`

#### Workflow service
Owns:
- repository lifecycle
- run creation / success / failure updates
- persistence metadata
- output summary building
- persistence-safe error mapping

Do not merge these concerns unless explicitly instructed.

### Good service shape
A good service usually has:
- one main public responsibility
- a few focused methods
- minimal helper methods
- no mixed infrastructure concerns

### Bad service shape
A bad service:
- touches planner, DB, error mapping, and metadata normalization at once
- has many private helper methods for unrelated concerns
- becomes a “god service”

Avoid that.

---

## Coding conventions

- TypeScript everywhere possible
- Fully braced if-statements
- Clear naming over clever naming
- Prefer small focused files
- Avoid large utility dumping grounds
- Avoid premature abstractions
- Keep exports tidy
- Keep tests deterministic

---

## Ticket execution guidance

### Good task shape
A task should usually affect one bounded concern and a small set of files.

Good examples:
- implement mock providers
- add normalization utilities
- add planner prompt v1
- add planner chain tests
- add workflow service for persistence

Bad examples:
- build the whole backend
- make the app production ready
- implement several tickets at once without being asked
- put multiple concerns into one service because it is “convenient”

### Scope control
If asked to implement one ticket:
- do that ticket only
- do not implement neighboring tickets unless explicitly requested
- if a missing prerequisite blocks progress, report it clearly

### Stop conditions
Stop and report instead of guessing if a change requires:
- touching many unrelated files
- changing architecture boundaries
- implementing a future ticket
- adding a new core abstraction
- moving planning logic into persistence code
- moving persistence logic into planning code

---

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

---

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

---

## Model abstraction rule

Planner logic should depend on small internal abstractions, not directly on concrete SDKs.

Examples:
- `PlannerModel`
- `PlannerRunner`

Concrete adapters, such as LangChain-based model adapters, should stay behind those interfaces.

Development-only stubs should be clearly marked and chosen in composition/factory code, not hardcoded inside core services.

---

## Testing expectations

For code changes, add or update focused tests when appropriate.

Priority test areas:
- schema validation
- normalization behavior
- deduplication behavior
- planner output parsing/validation
- service orchestration
- workflow persistence behavior when applicable
- error handling

Avoid:
- giant snapshots
- brittle formatting assertions
- unnecessary integration complexity

---

## Persistence expectations

Current persistence is execution-focused.

Important DB concepts:
- planner runs
- inputs
- tool results
- outputs
- errors

Do not introduce users, saved trips, places catalogs, or other full product tables unless explicitly requested.

Persistence-specific mapping/helpers should live outside planning-only services.

---

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

---

## File placement guidance

Examples of where code should go:

- shared Zod schemas:
  - `packages/core/src/schemas/*`

- shared inferred types:
  - `packages/core/src/types/*`

- planning service:
  - `packages/agent/src/services/travel-planning-service.ts`

- planner workflow/persistence wrapper:
  - `packages/agent/src/services/plan-trip-workflow-service.ts`

- planner chain:
  - `packages/agent/src/planner/*`

- prompt assets:
  - `packages/agent/src/prompts/*`

- mock providers:
  - `packages/agent/src/providers/mock/*`

- normalization:
  - `packages/agent/src/normalization/*`

- composition/factories:
  - `packages/agent/src/factories/*`
  - `apps/web/src/server/*`

- prisma/db:
  - `packages/db/*`

---

## What to avoid

Do not:
- put business logic in `apps/web`
- couple service code directly to concrete LLM SDK types
- skip validation because mock data “looks clean”
- let one malformed provider item crash a whole normalized array
- silently broaden ticket scope
- rewrite architecture without being asked
- put persistence lifecycle into planning-only services
- add many unrelated helper methods into one service class
- hide environment-based implementation selection inside core planning services

---

## If unsure

If a change seems to require:
- touching many unrelated files
- changing architecture boundaries
- implementing a future ticket
- adding a new core abstraction
- combining planning and persistence responsibilities

stop and explain the concern instead of guessing.
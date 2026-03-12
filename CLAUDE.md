# CLAUDE.md — AtlasGraph AI Travel Planner

## Commands

```bash
# Dev
pnpm install
pnpm dev

# Quality checks (run before finishing any task)
pnpm lint                       # ESLint with max-warnings=0
pnpm typecheck                  # tsc --noEmit across all packages
pnpm test                       # Vitest across all packages
pnpm vitest run packages/agent/src/services/travel-planning-service.test.ts

# Database
pnpm db:up                      # Start local PostgreSQL (Docker)
pnpm db:down
pnpm db:check
pnpm prisma:generate            # → packages/db/generated/prisma
pnpm prisma:migrate:dev
pnpm prisma:migrate:deploy

pnpm format
```

---

## Monorepo Structure

```
apps/web/                   Next.js App Router — UI and route wiring only
  src/
    lib/                    App-level utilities (env, site config)
    server/                 Server-side factories: wires planner models, runners, services
    server/api/             Response shaping helpers for route handlers

packages/agent/src/         Planning and orchestration logic
  services/                 TravelPlanningService, PlanTripWorkflowService, repositories
  planner/                  PlannerModel/PlannerRunner abstractions + LangChain/dev impls
  prompts/                  System prompt construction, versioning
  normalization/            Provider output → normalized domain types
  providers/mock/           Mock provider implementations
  evals/                    Planner eval harness and fixtures
  tools/                    Tool definitions (reserved)

packages/core/src/          Shared Zod schemas and inferred TypeScript types
  schemas/                  TripRequest, PlanningContext, TripPlan, etc.
  types/                    Type exports (z.infer<> only — no hand-written interfaces)
  domain/                   Domain-level shared types

packages/db/src/            Prisma client, DB health, run persistence
packages/config/            Shared env parsing
prisma/                     schema.prisma + migrations/
```

---

## Architecture Rules

**Package boundaries are hard:**
- `apps/web` — presentation and route wiring only; no business logic
- `packages/agent` — all planning, orchestration, provider interaction
- `packages/core` — Zod schemas and inferred types; no side effects
- `packages/db` — Prisma client, health, run persistence; no planning logic

**Service split — do not merge these:**
- `TravelPlanningService` — provider calls → normalization → `PlanningContext` → `plannerRunner.run()` → `TripPlan`
- `PlanTripWorkflowService` — repository lifecycle, run create/success/failure, error mapping

**Composition in factories only:**
- `apps/web/src/server/create-*.ts` — all implementation selection (dev vs real planner, DB vs in-memory)
- Never select implementations inside service constructors

**Model abstraction:**
- Service code depends on `PlannerModel` / `PlannerRunner` interfaces only — never raw LangChain types
- `DevelopmentPlannerModel` is dev-only; selected via `ATLASGRAPH_USE_DEV_PLANNER` in factory code

**Zod at all boundaries:**
- Validate: incoming `TripRequest`, provider normalization outputs, `PlanningContext`, `TripPlan`
- Infer TS types from schemas — never duplicate with manual `interface` definitions

---

## Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | Yes | Prisma / `packages/db` |
| `ATLASGRAPH_USE_DEV_PLANNER` | No | `true` uses stub planner (local dev default) |
| `OPENAI_API_KEY` | When dev planner off | Real LangChain/OpenAI path |
| `ATLASGRAPH_OPENAI_MODEL` | No | Override default OpenAI model |

Copy `.env.example` → `.env` for local setup.

---

## Prisma Notes

- Generated client: `packages/db/generated/prisma` (non-default path)
- Always pass `--config prisma.config.ts` — required by Prisma 7
- After editing `schema.prisma` → run `pnpm prisma:generate` before typechecking

---

## Frontend Stack

| Package | Version |
|---|---|
| Next.js | `16.1.6` (App Router) |
| React | `19.2.4` |
| Tailwind CSS | `4.2.1` via PostCSS |
| Zod | `4.3.6` |
| Framer Motion | latest |
| Lucide React | latest |

### Tailwind v4 — Critical Syntax
Token definitions moved from `tailwind.config.js` to CSS. Use `@theme` in `globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-sand-50:  #faf8f4;
  --color-teal-500: #0d7377;
  --font-display:   "Playfair Display", serif;
}
```

- No `tailwind.config.js` for tokens
- No `theme()` CSS function — use CSS variables directly
- Arbitrary values: `bg-[var(--color-sand-50)]` ✓

---

## Design System

### Aesthetic
**Lush editorial.** High-end travel magazine energy — rich destination photography, expressive display type, warm earth tones. Aspirational and inviting. Imagery is first-class; every layout should frame photos beautifully.

### Color Tokens (`globals.css`)

```css
@theme {
  --color-sand-50:   #faf8f4;
  --color-sand-100:  #f3ede2;
  --color-sand-200:  #e6d9c5;
  --color-teal-500:  #0d7377;
  --color-teal-600:  #0a5c60;
  --color-stone-900: #1c1917;
  --color-stone-600: #57534e;
  --color-stone-300: #d6d3d1;
  --color-amber-400: #fbbf24;

  /* Semantic */
  --color-bg-page:      var(--color-sand-50);
  --color-bg-surface:   #ffffff;
  --color-text-primary: var(--color-stone-900);
  --color-text-muted:   var(--color-stone-600);
  --color-border:       var(--color-stone-300);
  --color-accent:       var(--color-teal-500);
  --color-accent-hover: var(--color-teal-600);
}
```

### Typography

```css
@theme {
  --font-display: "Playfair Display", Georgia, serif;  /* Headlines */
  --font-sans:    "DM Sans", sans-serif;               /* Body / UI */
  --font-mono:    "JetBrains Mono", monospace;         /* Times, codes */
}
```

Load via `next/font/google`. Use `font-display` for headlines, `font-sans` for body.

### Layout
- Max width: `max-w-7xl` (1280px) · Section padding: `py-16 md:py-24` · Card gap: `gap-6`

---

## UI Patterns

**Preference cards** — large tap-target cards (icon + label), not dropdowns. Selected: teal border + sand tint + checkmark. Multi-select per category; Zod-validate before proceeding.

**Destination picker** — full-bleed image cards, gradient name scrim. Hover: `scale-[1.03] brightness-110`. Selected: teal ring + checkmark badge. Keyboard: `Enter`/`Space` toggles.

**Itinerary output** — vertical timeline, left border, day numerals as large type. Each item: time chip + title + body + optional photo. Stream AI content progressively — don't wait for full response.

**Loading states** — skeleton screens only (no spinners). Step-based progress indicator during generation ("Planning route… Finding restaurants…").

---

## Frontend Component Conventions

```
apps/web/src/components/
  common/       # Button, Card, Badge, Skeleton, Input
  preferences/  # PreferenceCard, CategorySection, PreferenceGrid
  destination/  # DestinationCard, DestinationGrid, DestinationPicker
  itinerary/    # ItineraryTimeline, ItineraryDay, ItineraryItem
  layout/       # Header, Footer, PageShell, Section
```

- One component per file, PascalCase
- Explicit `interface Props` — no implicit `any`
- Types derived from `packages/core` Zod schemas — never hand-written separately
- No hardcoded colors — `@theme` variables only
- All interactive elements: hover + focus-visible + disabled states
- Use `cn()` (clsx + tailwind-merge) for conditional classes

---

## Accessibility
- WCAG AA contrast on all text
- Keyboard-navigable with visible `focus-visible` rings
- `aria-label` on icon-only buttons
- Preference cards: `role="checkbox"` (multi) or `role="radio"` (single)
- Semantic HTML: `<nav>`, `<main>`, `<section>`, `<article>`, `<time>`

---

## Animation (Framer Motion)
- Page entry: staggered fade-up (`y: 16→0`, `opacity: 0→1`, stagger `0.08s`)
- Card select: spring (`scale: 0.96→1.03→1`)
- Itinerary: items enter sequentially as stream arrives
- Respect `prefers-reduced-motion` — gate animations behind a check

---

## What NOT To Do
- No Inter, Roboto, Arial, or system-ui as display fonts
- No purple/blue gradients — warm earth-tone palette only
- No identical card grids — vary image sizes and aspect ratios
- No spinners — skeletons only
- No `style={{}}` inline — CSS variables via `@theme` or Tailwind utilities
- No TS interfaces that duplicate Zod schemas from `packages/core`
- No business logic in `apps/web` — belongs in `packages/agent`

---

## Before Writing Any UI Component
1. One sentence: state the aesthetic direction
2. List all states: default, hover, focus, selected, loading, error, empty
3. If data involved: schema lives in `packages/core/schemas/`, type is `z.infer<>`
4. Write `interface Props` before the component body
5. Mobile-first, then `md:` / `lg:`

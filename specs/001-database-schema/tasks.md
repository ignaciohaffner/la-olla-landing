---
description: "Task list for Database Schema & Seed"
---

# Tasks: Database Schema & Seed

**Input**: Design documents from `specs/001-database-schema/`
**Prerequisites**: plan.md ✅, spec.md ✅, data-model.md ✅, contracts/prisma-client-types.md ✅

**Tests**: Not requested — no test tasks included.

**Organization**: Tasks grouped by user story to enable independent delivery and verification.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2)
- All file paths are relative to the repository root

## Path Conventions

- Backend project root: `backend/`
- Schema: `backend/prisma/schema.prisma`
- Seed: `backend/prisma/seed.ts`
- Prisma client singleton: `backend/src/lib/prisma.ts`

---

## Phase 1: Setup

**Purpose**: Initialize the `backend/` Node.js project with the required tooling.

- [x] T001 Create `backend/` directory and run `npm init -y` to create `backend/package.json`
- [x] T002 [P] Configure `backend/tsconfig.json` for Node.js TypeScript (target: ES2022, module: CommonJS, strict: true, outDir: dist)
- [x] T003 [P] Install dependencies in `backend/`: `prisma`, `@prisma/client`, `bcrypt`, `@types/bcrypt`, `ts-node`, `typescript`, `@types/node`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Scaffold Prisma and provide a working DATABASE_URL before any schema work begins.

**⚠️ CRITICAL**: US1 cannot start until T004 and T005 are complete.

- [x] T004 Create `backend/.env` with `DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/laolla_dev"` (placeholder values; developer fills in real credentials)
- [x] T005 Run `npx prisma init` inside `backend/` to scaffold the initial `backend/prisma/schema.prisma` (this also appends DATABASE_URL to `.env` if not present — review and keep only one copy)

**Checkpoint**: `backend/prisma/schema.prisma` exists and `backend/.env` has DATABASE_URL.

---

## Phase 3: User Story 1 — Schema completo y migraciones (Priority: P1) 🎯 MVP

**Goal**: A developer runs `prisma migrate dev` and gets all 9 tables with correct constraints.

**Independent Test**: Run `prisma migrate dev --name init` in a clean PostgreSQL instance
and verify all 9 tables exist via `\dt` in psql or Prisma Studio.

### Implementation for User Story 1

- [x] T006 [US1] Replace `backend/prisma/schema.prisma` with the complete schema per `specs/001-database-schema/data-model.md`: datasource (postgresql), generator (prisma-client-js), all 9 models (Admin, Category, MenuItem, PizzaPartyConfig, PizzaPartyRequest, Offer, Schedule, WeeklyMenuDay, ContactMessage) and PizzaPartyStatus enum
- [x] T007 [US1] Run `npx prisma validate` inside `backend/` and fix any errors in `backend/prisma/schema.prisma`
- [x] T008 [US1] Create `backend/src/lib/prisma.ts` with the PrismaClient singleton pattern per `specs/001-database-schema/contracts/prisma-client-types.md` (globalThis guard for dev, named export `prisma`)
- [x] T009 [US1] Run `npx prisma migrate dev --name init` inside `backend/` to generate `backend/prisma/migrations/` with the initial migration SQL
- [x] T010 [US1] Run `npx prisma generate` inside `backend/` and confirm it completes without errors

**Checkpoint**: All 9 tables exist in the database; `@prisma/client` is generated and importable.

---

## Phase 4: User Story 2 — Seed con datos reales (Priority: P2)

**Goal**: Running `prisma db seed` populates the database with all real La Olla business data.

**Independent Test**: After seed, query each table with `npx prisma studio` or direct SQL
and verify counts and values match the tables in `specs/001-database-schema/data-model.md`.

### Implementation for User Story 2

- [x] T011 [US2] Add `"prisma": { "seed": "ts-node prisma/seed.ts" }` block to `backend/package.json`
- [x] T012 [US2] Create `backend/prisma/seed.ts` with: PrismaClient import, bcrypt import, async `main()` function, `main().catch(console.error).finally(() => prisma.$disconnect())`
- [x] T013 [US2] Implement Admin upsert in `backend/prisma/seed.ts`: `where: { email: 'admin@laolla.com' }`, hash `'admin123'` with bcrypt (10 rounds) and store as `passwordHash`
- [x] T014 [US2] Implement 6 Category upserts in `backend/prisma/seed.ts` per the Categories table in data-model.md: Comidas/comidas/1, Pizzas/pizzas/2, Tartas/tartas/3, Empanadas/empanadas/4, Pastas/pastas/5, Guarnición/guarnicion/6 — `where: { slug: ... }`
- [x] T015 [US2] Implement 8 Empanada MenuItem upserts in `backend/prisma/seed.ts` (price=0, available=true, sortOrder 1–8, categoryId from Empanadas category) — `where: { name: ... }` inside the Empanadas category; names per data-model.md Empanadas table
- [x] T016 [US2] Implement 12 Pasta MenuItem upserts in `backend/prisma/seed.ts` (price=1500, available=true, sortOrder 1–12, categoryId from Pastas) — 4 tipos × 3 salsas per data-model.md Pastas table; names follow pattern `"{Tipo} {salsa}"`
- [x] T017 [US2] Implement PizzaPartyConfig upsert in `backend/prisma/seed.ts` (`where: { id: 1 }`) with values per data-model.md: pricePerPerson=1200, minimumGuests=20, baseHours=3, extraHourPrice=800, mozzoPrice=600, serviceDetails as specified
- [x] T018 [US2] Implement 7 Schedule upserts in `backend/prisma/seed.ts` (`where: { dayOfWeek: n }`) per data-model.md Schedule table: dayOfWeek 0 (isOpen=false), dayOfWeek 1–6 (isOpen=true, openTime="11:00", closeTime="22:00")
- [x] T019 [US2] Run `npx prisma db seed` inside `backend/` and verify: 1 Admin, 6 Categories, 20 MenuItems, 1 PizzaPartyConfig, 7 Schedule rows — running it a second time must produce no errors and no duplicates

**Checkpoint**: All seed data present; `prisma db seed` is idempotent.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [x] T020 [P] Add `backend/node_modules`, `backend/.env`, `backend/dist` to `.gitignore` at the repo root (create if absent)
- [x] T021 Validate end-to-end setup from scratch per `specs/001-database-schema/quickstart.md`: fresh clone → `npm install` → `prisma migrate dev` → `prisma db seed` → confirm Prisma Studio shows correct data

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (T001–T003) — **blocks US1**
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion — blocks US2
- **User Story 2 (Phase 4)**: Depends on Phase 3 completion (migrated DB required for seed)
- **Polish (Phase 5)**: Depends on both US1 and US2 being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational — no dependency on US2
- **US2 (P2)**: Depends on US1 (migrated database required; FK constraints in schema must exist before seed can run)

### Within Each User Story

- **US1**: T006 (schema) → T007 (validate) → T008 (singleton, parallel) + T009 (migrate) → T010 (generate)
- **US2**: T011 (config) → T012 (scaffold) → T013 (admin) → T014 (categories) → T015+T016 (menu items, depend on T014) → T017+T018 (config + schedule, parallel with each other) → T019 (run + verify)

### Parallel Opportunities

- T002 and T003 can run in parallel (different files, no dependencies between them)
- T008 (prisma.ts singleton) can start once T006+T007 are done, parallel to T009 (migrate)
- T017 and T018 in the seed can be written in parallel (different model sections in seed.ts)
- T020 (gitignore) can be done at any point in Phase 5

---

## Parallel Example: User Story 1

```bash
# After T007 passes prisma validate:
Task: "Create backend/src/lib/prisma.ts singleton"         # T008
Task: "Run prisma migrate dev --name init"                 # T009
# Both can proceed without blocking each other
```

## Parallel Example: Phase 1 Setup

```bash
# After T001 creates backend/ directory:
Task: "Configure backend/tsconfig.json"                    # T002
Task: "Install npm dependencies"                           # T003
# Both can run in parallel
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks schema work)
3. Complete Phase 3: User Story 1 (schema + migration)
4. **STOP and VALIDATE**: Run `prisma migrate dev` in a clean DB; verify 9 tables exist
5. Proceed to US2 once schema is confirmed

### Incremental Delivery

1. Phase 1 + Phase 2 → project initialized
2. Phase 3 (US1) → database schema ready; backend services can begin development
3. Phase 4 (US2) → seed ready; frontend can display real data in development
4. Phase 5 → setup verified; team onboarding is frictionless

---

## Notes

- [P] tasks = different files or non-blocking steps that can run concurrently
- US1 checkpoint must pass (9 tables, `prisma generate` succeeds) before US2 begins
- Seed upsert keys: `email` for Admin, `slug` for Category, `name` (scoped to category) for MenuItem, `id=1` for PizzaPartyConfig, `dayOfWeek` for Schedule
- MenuItem upsert-by-name is safe only because names within each category are unique in this seed; if the admin renames items later, seed idempotency relies on the slug-based category lookup, not a name-based item lookup — this is acceptable for a one-time seed
- All seed amounts (pricePerPerson, pasta prices) are placeholders to be updated via the admin panel before launch

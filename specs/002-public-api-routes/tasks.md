# Tasks: Public API Routes

**Input**: Design documents from `specs/002-public-api-routes/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/api-endpoints.md ✅

**Architecture**: Controller-Service-Repository (CSR)
- **Repository**: pure Prisma queries, no logic
- **Service**: business logic (price calc, isOpenNow, weekStart, email)
- **Controller**: HTTP layer (parse request, call service, send response, next(err))
- **Route**: Express Router wiring only

**Tests**: Not requested — no test tasks generated.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no shared state)
- **[Story]**: User story this task belongs to (US1–US6)

---

## Phase 1: Setup

- [x] T001 Install express, zod, nodemailer + @types in `backend/` via npm
- [x] T002 Create `backend/src/repositories/`, `backend/src/services/`, `backend/src/controllers/`, `backend/src/routes/`, `backend/src/middleware/` directories

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T003 [P] Create `backend/src/middleware/errorHandler.ts` — ZodError → 400 with `{ error, fields }`; all others → 500; suppress stack in production
- [x] T004 [P] Create `backend/src/lib/mailer.ts` — Nodemailer singleton; `sendMail()` guards on `OWNER_EMAIL` unset
- [x] T005 [P] Create `backend/src/controllers/health.controller.ts` + `backend/src/routes/health.ts`
- [x] T006 Create `backend/src/app.ts` — registers all routers + errorHandler
- [x] T007 Create `backend/src/index.ts` — `app.listen(PORT)`

**Checkpoint**: `GET /api/health` → `{ "status": "ok" }`

---

## Phase 3: User Story 1 — Visitante explora el menú (P1) 🎯 MVP

**Independent Test**: `GET /api/menu` returns grouped items; price=0 included; available=false excluded. `GET /api/categories` returns all sorted.

- [x] T008 [P] [US1] Create `backend/src/repositories/menu.repository.ts` — `findAvailableMenuWithCategories()`
- [x] T009 [P] [US1] Create `backend/src/repositories/category.repository.ts` — `findAllCategories()`
- [x] T010 [US1] Create `backend/src/services/menu.service.ts` — `getGroupedMenu()` (filter + map), `getCategories()`
- [x] T011 [US1] Create `backend/src/controllers/menu.controller.ts` — `getMenu`, `listCategories`
- [x] T012 [US1] Create `backend/src/routes/menu.ts` — wire `GET /menu` + `GET /categories`

**Checkpoint**: `/api/menu` and `/api/categories` return correct data.

---

## Phase 4: User Story 2 — Cliente solicita cotización de pizza party (P1)

**Independent Test**: `GET /api/pizza-party/config` returns config without id. `POST /api/pizza-party/request` returns `{ id, totalPrice }` calculated server-side. Invalid body → 400.

- [x] T013 [P] [US2] Create `backend/src/repositories/pizzaParty.repository.ts` — `getPizzaPartyConfig()`, `createPizzaPartyRequest()`
- [x] T014 [US2] Create `backend/src/services/pizzaParty.service.ts` — `getConfig()` (strips id), `submitRequest()` (calc totalPrice + email)
- [x] T015 [US2] Create `backend/src/controllers/pizzaParty.controller.ts` — Zod schema + `getPizzaPartyConfig`, `createPizzaPartyRequest` handlers
- [x] T016 [US2] Create `backend/src/routes/pizzaParty.ts` — wire `GET /pizza-party/config` + `POST /pizza-party/request`

**Checkpoint**: Price is always recalculated server-side; email sent to `OWNER_EMAIL`.

---

## Phase 5: User Story 3 — Visitante consulta si el local está abierto (P2)

**Independent Test**: `GET /api/schedule` returns 7 rows with correct `isOpenNow` for current Argentina time.

- [x] T017 [P] [US3] Create `backend/src/repositories/schedule.repository.ts` — `findAllSchedule()`
- [x] T018 [US3] Create `backend/src/services/schedule.service.ts` — `getScheduleWithOpenNow()` (UTC-3 calc)
- [x] T019 [US3] Create `backend/src/controllers/schedule.controller.ts` + `backend/src/routes/schedule.ts`

**Checkpoint**: `isOpenNow` flips correctly based on Argentina time.

---

## Phase 6: User Story 4 — Visitante consulta el menú semanal (P2)

**Independent Test**: `GET /api/weekly-menu` returns current week's rows or `[]`.

- [x] T020 [P] [US4] Create `backend/src/repositories/weeklyMenu.repository.ts` — `findWeeklyMenuByWeekStart()`
- [x] T021 [US4] Create `backend/src/services/weeklyMenu.service.ts` — `getCurrentWeekMenu()` (weekStart calc)
- [x] T022 [US4] Create `backend/src/controllers/weeklyMenu.controller.ts` + `backend/src/routes/weeklyMenu.ts`

**Checkpoint**: Returns current week only; `[]` when no data.

---

## Phase 7: User Story 5 — Visitante envía mensaje de contacto (P2)

**Independent Test**: `POST /api/contact` saves message and returns `{ success: true }`. Missing message → 400.

- [x] T023 [P] [US5] Create `backend/src/repositories/contact.repository.ts` — `createContactMessage()`
- [x] T024 [US5] Create `backend/src/services/contact.service.ts` — `submitContact()` (save + email)
- [x] T025 [US5] Create `backend/src/controllers/contact.controller.ts` — Zod schema + handler
- [x] T026 [US5] Create `backend/src/routes/contact.ts`

**Checkpoint**: Contact saved + owner notified.

---

## Phase 8: User Story 6 — Visitante consulta ofertas vigentes (P3)

**Independent Test**: `GET /api/offers` returns only active + date-valid offers, newest first.

- [x] T027 [P] [US6] Create `backend/src/repositories/offer.repository.ts` — `findActiveOffers(now)`
- [x] T028 [US6] Create `backend/src/services/offer.service.ts` — `getActiveOffers()`
- [x] T029 [US6] Create `backend/src/controllers/offer.controller.ts` + `backend/src/routes/offers.ts`

**Checkpoint**: Expired/inactive offers excluded.

---

## Phase 9: Polish

- [x] T030 Add `dev`, `build`, `start` scripts to `backend/package.json`
- [ ] T031 Smoke test all endpoints per `specs/002-public-api-routes/quickstart.md`

---

## Dependencies & Execution Order

- **Phase 1 → Phase 2**: Setup must complete first
- **Phase 2 → Phases 3–8**: Foundational blocks all stories
- **Phases 3–8**: Independent of each other after Phase 2
- **Within each phase**: repositories [P] → service → controller → route (sequential after repos)

---

## Notes

- Repositories: no logic, only Prisma queries
- Services: no HTTP (no req/res), only business logic
- Controllers: no Prisma imports, only service calls + Zod parsing
- Routes: no logic, only `router.METHOD(path, controller)`
- `mailer.ts` shared by US2 and US5 — created once in Phase 2

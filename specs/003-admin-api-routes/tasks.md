---
description: "Task list for admin API routes implementation"
---

# Tasks: Admin API Routes

**Input**: Design documents from `specs/003-admin-api-routes/`
**Prerequisites**: Features 001 (database) and 002 (public routes) complete.
**Tests**: Not requested — no test tasks included.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story this task belongs to
- No story label → Setup or Foundational phase task

## Path Conventions

Web app: `backend/src/` and `frontend/src/`

---

## Phase 1: Setup (Dependencies & Infrastructure)

**Purpose**: Install new packages and create shared type scaffolding before any business logic.

- [x] T001 Install jsonwebtoken, @types/jsonwebtoken, and sharp in `backend/` (`npm install jsonwebtoken sharp && npm install --save-dev @types/jsonwebtoken`)
- [x] T002 Add `JWT_SECRET=<value>` to `backend/.env`
- [x] T003 [P] Create Express Request type extension for `req.admin` in `backend/src/types/express.d.ts`
- [x] T004 [P] Create stub admin router barrel `backend/src/routes/admin/index.ts` (empty Express Router, no routes yet)

---

## Phase 2: Foundational (Auth Infrastructure)

**Purpose**: JWT middleware and admin router mount — blocks every protected admin route.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T005 Implement JWT auth middleware in `backend/src/middleware/auth.ts` — reads `Authorization: Bearer`, calls `jwt.verify`, sets `req.admin`, returns 401 on failure (depends on T003)
- [x] T006 [P] Create admin repository `backend/src/repositories/admin.repository.ts` with `findByEmail(email: string)` method
- [x] T007 Mount admin router + auth middleware in `backend/src/app.ts`: `app.use('/api/admin', authMiddleware, adminRouter)` (depends on T004, T005)

**Checkpoint**: Auth infrastructure ready — protected routes will return 401 until login is wired.

---

## Phase 3: User Story 1 — Admin Inicia Sesión (Priority: P1) 🎯 MVP

**Goal**: Admin can obtain a JWT token via email/password login and access any protected route.

**Independent Test**: `POST /api/admin/login` with valid credentials returns `{ token }`. Same call with wrong password returns 401. Any protected route returns 401 without token and 200 with valid token.

- [x] T008 [US1] Implement `loginHandler` in `backend/src/controllers/admin/auth.controller.ts` — validates body with Zod, calls admin repo, bcrypt.compare, signs JWT with 7-day expiry (depends on T006)
- [x] T009 [US1] Register `POST /api/admin/login` in `backend/src/app.ts` using loginHandler (depends on T007, T008)

**Checkpoint**: Login works end-to-end. Auth middleware tested with real token.

---

## Phase 4: User Story 2 — Admin Gestiona el Menú (Priority: P1)

**Goal**: Admin can list all items (including unavailable), create, edit, delete items, and bulk-update prices. Admin can list, create, edit, and delete categories (with 409 guard).

**Independent Test**: Create a category, create an item in it, update the item's price via bulk endpoint, verify `GET /api/admin/menu` shows the updated item with `available=false` after patching it.

- [x] T010 [P] [US2] Add `getAllMenuItems()` (includes `available=false`) and `bulkUpdatePrices(items: {id, price}[])` to `backend/src/repositories/menu.repository.ts`
- [x] T011 [P] [US2] Add `createCategory`, `patchCategory`, `deleteCategory` (with item-count check → 409) to `backend/src/repositories/category.repository.ts`
- [x] T012 [US2] Implement admin menu controller in `backend/src/controllers/admin/menu.controller.ts`: `getAdminMenu`, `createItem`, `patchItem`, `deleteItem`, `bulkUpdatePrices` (depends on T010)
- [x] T013 [US2] Implement admin categories controller in `backend/src/controllers/admin/categories.controller.ts`: `listCategories`, `createCategory`, `patchCategory`, `deleteCategory` (depends on T011)
- [x] T014 [P] [US2] Create admin menu routes `backend/src/routes/admin/menu.ts`: GET `/menu`, POST `/menu/items`, PATCH `/menu/items/:id`, DELETE `/menu/items/:id`, PATCH `/menu/prices` (depends on T012)
- [x] T015 [P] [US2] Create admin categories routes `backend/src/routes/admin/categories.ts`: GET/POST `/categories`, PATCH/DELETE `/categories/:id` (depends on T013)
- [x] T016 [US2] Register menu and categories routers in `backend/src/routes/admin/index.ts` (depends on T014, T015)

**Checkpoint**: Full menu and category management operational.

---

## Phase 5: User Story 3 — Admin Gestiona Pizza Party (Priority: P1)

**Goal**: Admin can view/update pizza party pricing config and manage requests (list with status filter, update status + admin notes).

**Independent Test**: `GET /api/admin/pizza-party/config` returns current config. `PATCH` with new `pricePerPerson` updates only that field. `GET /api/admin/pizza-party/requests?status=pending` returns only pending requests. `PATCH` on a request ID updates its status to `confirmed`.

- [x] T017 [US3] Add admin pizza party methods to `backend/src/repositories/pizzaParty.repository.ts`: `getConfig`, `patchConfig`, `listRequests(status?: string)`, `patchRequest(id, data)` (depends on T016)
- [x] T018 [US3] Implement admin pizza party controller in `backend/src/controllers/admin/pizzaParty.controller.ts`: `getConfig`, `patchConfig`, `listRequests`, `patchRequest` (depends on T017)
- [x] T019 [US3] Create admin pizza party routes `backend/src/routes/admin/pizzaParty.ts`: GET/PATCH `/pizza-party/config`, GET `/pizza-party/requests`, PATCH `/pizza-party/requests/:id` (depends on T018)
- [x] T020 [US3] Register pizza party router in `backend/src/routes/admin/index.ts` (depends on T019)

**Checkpoint**: Pizza party management fully operational.

---

## Phase 6: User Story 4 — Admin Gestiona Ofertas (Priority: P2)

**Goal**: Admin can view all offers (active and inactive), create new ones, edit any field, and delete.

**Independent Test**: Create an offer with `active=false`, verify it appears in `GET /api/admin/offers` but NOT in `GET /api/offers` (public). Activate it via PATCH, verify it now appears publicly if within date range.

- [x] T021 [US4] Add admin offer methods to `backend/src/repositories/offer.repository.ts`: `getAllOffers()` (no date/active filter), `createOffer`, `patchOffer`, `deleteOffer`
- [x] T022 [US4] Implement admin offers controller in `backend/src/controllers/admin/offers.controller.ts`: `listOffers`, `createOffer`, `patchOffer`, `deleteOffer` (depends on T021)
- [x] T023 [US4] Create admin offers routes `backend/src/routes/admin/offers.ts`: GET/POST `/offers`, PATCH/DELETE `/offers/:id` (depends on T022)
- [x] T024 [US4] Register offers router in `backend/src/routes/admin/index.ts` (depends on T023)

**Checkpoint**: Offers CRUD operational; public endpoint unchanged.

---

## Phase 7: User Story 5 — Admin Gestiona Horarios y Menú Semanal (Priority: P2)

**Goal**: Admin can view and replace the weekly schedule (all 7 days via upsert) and view/replace the current week's daily menu (upsert by weekStart + dayOfWeek).

**Independent Test**: `PATCH /api/admin/schedule` with 7 days updates all records. Verify `GET /api/schedule` (public) reflects the change with `isOpenNow` recalculated. `PUT /api/admin/weekly-menu` with 5 days; verify `GET /api/weekly-menu` returns the new dishes.

- [x] T025 [P] [US5] Add `getScheduleRaw()` (no `isOpenNow` calculation) and `upsertSchedule(days[])` to `backend/src/repositories/schedule.repository.ts`
- [x] T026 [P] [US5] Add `upsertWeeklyMenuDay(weekStart, dayOfWeek, dishes)` to `backend/src/repositories/weeklyMenu.repository.ts`
- [x] T027 [US5] Implement admin schedule controller in `backend/src/controllers/admin/schedule.controller.ts`: `getSchedule`, `patchSchedule` (depends on T025)
- [x] T028 [US5] Implement admin weekly menu controller in `backend/src/controllers/admin/weeklyMenu.controller.ts`: `getWeeklyMenu`, `putWeeklyMenu` with server-side weekStart calculation (depends on T026)
- [x] T029 [P] [US5] Create admin schedule routes `backend/src/routes/admin/schedule.ts`: GET/PATCH `/schedule` (depends on T027)
- [x] T030 [P] [US5] Create admin weekly menu routes `backend/src/routes/admin/weeklyMenu.ts`: GET `/weekly-menu`, PUT `/weekly-menu` (depends on T028)
- [x] T031 [US5] Register schedule and weekly menu routers in `backend/src/routes/admin/index.ts` (depends on T029, T030)

**Checkpoint**: Schedule and weekly menu management operational.

---

## Phase 8: User Story 6 — Admin Gestiona Mensajes de Contacto (Priority: P2)

**Goal**: Admin can list all contact messages (newest first), mark individual messages as read, and see unread count.

**Independent Test**: Submit a contact message via `POST /api/contact` (public). Verify it appears in `GET /api/admin/contact` with `read=false`. `PATCH /api/admin/contact/:id/read` with `{ read: true }`. Verify `GET /api/admin/contact/unread-count` decreases by 1.

- [x] T032 [US6] Add admin contact methods to `backend/src/repositories/contact.repository.ts`: `getAllMessages()`, `markRead(id)`, `unreadCount()`
- [x] T033 [US6] Implement admin contact controller in `backend/src/controllers/admin/contact.controller.ts`: `listMessages`, `markRead`, `unreadCount` (depends on T032)
- [x] T034 [US6] Create admin contact routes `backend/src/routes/admin/contact.ts`: GET `/contact`, PATCH `/contact/:id/read`, GET `/contact/unread-count` (depends on T033)
- [x] T035 [US6] Register contact router in `backend/src/routes/admin/index.ts` (depends on T034)

**Checkpoint**: Contact message management operational.

---

## Phase 9: User Story 7 — Admin Descarga Imagen de Lista de Precios (Priority: P3)

**Goal**: Admin can download a PNG price list image with all available menu items grouped by category, including the business logo.

**Independent Test**: `GET /api/admin/price-list/image` returns a binary response with `Content-Type: image/png`. The PNG opens correctly and shows all `available=true`, `price>0` items grouped by category.

- [ ] T036 [US7] Add business logo file to `backend/src/assets/logo.png` (manual step — copy the actual logo file)
- [x] T037 [US7] Implement `generatePriceListImage` in `backend/src/controllers/admin/priceList.controller.ts`: fetch menu items from repo, build SVG string with items grouped by category + embedded base64 logo, convert with Sharp to PNG buffer, respond with `Content-Type: image/png` (depends on T036)
- [x] T038 [US7] Create admin price list route `backend/src/routes/admin/priceList.ts`: GET `/price-list/image` (depends on T037)
- [x] T039 [US7] Register price list router in `backend/src/routes/admin/index.ts` (depends on T038)

**Checkpoint**: Price list image downloads correctly with current menu data.

---

## Phase 10: Polish & Verification

**Purpose**: End-to-end smoke test and auth hardening verification.

- [x] T040 Run smoke test sequence from `specs/003-admin-api-routes/quickstart.md` — login, access protected route, verify 401 without token, download price list image
- [x] T041 [P] Verify every admin route in `backend/src/routes/admin/index.ts` is behind auth middleware (no unprotected route leaks)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on T003, T004 from Setup
- **US1 (Phase 3)**: Depends on Foundational complete
- **US2–US7 (Phases 4–9)**: All depend on Foundational complete; can proceed in parallel after US1 (login must work to test them)
- **Polish (Phase 10)**: Depends on all desired stories complete

### User Story Dependencies

- **US1 (P1)**: Must come first — needed to test all other stories
- **US2 (P1)**: Independent after foundational; extends existing repositories
- **US3 (P1)**: Independent after foundational; extends existing repositories
- **US4 (P2)**: Independent after foundational
- **US5 (P2)**: Independent after foundational; schedule repo already exists
- **US6 (P2)**: Independent after foundational; contact repo already exists
- **US7 (P3)**: Depends on menu repository being populated (US2 helps but not required)

### Within Each User Story

- Repository extension → controller → route file → register in barrel
- Zod schemas defined inline in controller files (per research Decision 3 pattern from feature 002)

### Parallel Opportunities

- T003 and T004 (Phase 1) can run in parallel
- T005, T006 (Phase 2) can run in parallel
- T010, T011 (US2 repos) can run in parallel
- T014, T015 (US2 routes) can run in parallel
- T025, T026 (US5 repos) can run in parallel
- T029, T030 (US5 routes) can run in parallel
- Once Foundational complete: US2, US3, US4, US5, US6 can progress in parallel

---

## Parallel Example: User Story 2 (Menu)

```bash
# Run in parallel (different files):
Task T010: "Add getAllMenuItems + bulkUpdatePrices to menu.repository.ts"
Task T011: "Add createCategory + patchCategory + deleteCategory to category.repository.ts"

# Then in parallel after T010/T011:
Task T012: "Implement menu controller"   # needs T010
Task T013: "Implement categories controller"  # needs T011

# Then in parallel after T012/T013:
Task T014: "Create admin menu routes"    # needs T012
Task T015: "Create admin categories routes"  # needs T013

# Finally:
Task T016: "Register both in barrel"    # needs T014, T015
```

---

## Implementation Strategy

### MVP First (Auth only — US1)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: US1 (Login)
4. **STOP and VALIDATE**: Login returns token, protected routes return 401 without it
5. Continue to US2

### Incremental Delivery

1. Setup + Foundational → Auth infrastructure ready
2. US1 → Login and token validation working
3. US2 → Menu management (most used admin feature)
4. US3 → Pizza party management (highest business value)
5. US4 → Offers management
6. US5 → Schedule + weekly menu
7. US6 → Contact messages
8. US7 → Price list image (convenience feature)

---

## Notes

- [P] tasks = different files, no shared state dependencies
- [Story] label maps each task to its user story for traceability
- Zod validation schemas go inline at the top of each controller file (per research.md Decision 3)
- Each `routes/admin/*.ts` file exports a single `Router` and is imported by `routes/admin/index.ts`
- The barrel `index.ts` is updated incrementally — each story phase ends by registering its router
- `req.admin` type from T003 enables TypeScript to know the admin payload in all controllers
- Logo file (T036) is a manual step — the controller handles gracefully if it's missing (logs warning, generates image without logo)

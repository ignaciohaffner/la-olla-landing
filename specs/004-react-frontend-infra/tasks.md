# Tasks: React Frontend Infrastructure

**Input**: Design documents from `specs/004-react-frontend-infra/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/module-api.md ✅

**Tests**: Not requested — no test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US4)
- All paths are relative to repo root

---

## Phase 1: Setup (Project Scaffold)

**Purpose**: Create the `frontend/` Vite project and install all dependencies defined in plan.md. No user story work begins until this phase is complete.

- [x] T001 Scaffold frontend/ project with Vite react-ts template by running `npm create vite@latest frontend -- --template react-ts` from repo root
- [x] T002 Install runtime dependencies in frontend/: `react-router-dom @tanstack/react-query react-hook-form zod`
- [x] T003 [P] Install and configure Tailwind CSS in frontend/: installed tailwindcss + @tailwindcss/vite (v4 setup), added plugin to vite.config.ts, updated index.css
- [x] T004 [P] Initialize shadcn/ui from inside frontend/ via `npx shadcn@latest init`, accepting defaults; components land in `frontend/src/components/ui/`
- [x] T005 [P] Create `frontend/.env.example` with content `VITE_API_URL=http://localhost:3000` and add `frontend/.env.local` to `.gitignore`

**Checkpoint**: `npm run dev` inside `frontend/` starts without errors; blank Vite page renders at `http://localhost:5173`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure shared by every user story: TypeScript types, API client, QueryClient. Must be complete before any user story begins.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T006 Define all TypeScript interfaces in `frontend/src/types/index.ts`: `ScheduleDay`, `ScheduleResponse`, `LoginRequest`, `LoginResponse`, `ApiError`, `JWTPayload`, `AuthState`, `CurrentScheduleState` (shapes match data-model.md)
- [x] T007 Implement `apiFetch<T>` in `frontend/src/lib/api.ts`: prepend `import.meta.env.VITE_API_URL`, inject `Authorization: Bearer` header for paths starting with `/api/admin/`, throw `Error` with JSON `message` body on `!response.ok`
- [x] T008 [P] Create `QueryClient` singleton in `frontend/src/lib/queryClient.ts` with `defaultOptions.queries.staleTime = 5 * 60 * 1000`
- [x] T009 Wrap app root in `QueryClientProvider` (using `queryClient` from T008) and `BrowserRouter` in `frontend/src/main.tsx`; import global CSS

**Checkpoint**: `apiFetch('/api/health')` called from browser console returns `{ status: 'ok' }` (backend must be running); no TypeScript errors on `tsc --noEmit`

---

## Phase 3: User Story 1 - Visitor Navigates the Site (Priority: P1) 🎯 MVP

**Goal**: Every public page renders inside a shared Layout with Navbar, Footer, and floating WhatsApp button. Mobile hamburger menu works.

**Independent Test**: Open `http://localhost:5173`, click all 5 nav links, verify pages load. Resize to 375px, open hamburger, click a link, verify menu closes. Verify WhatsApp button opens `https://wa.me/543446410459` in a new tab.

### Implementation for User Story 1

- [x] T010 [P] [US1] Create minimal page shells (div with page name only) for all 5 public pages: `frontend/src/pages/HomePage.tsx`, `MenuPage.tsx`, `ViandasPage.tsx`, `PizzaPartyPage.tsx`, `ContactoPage.tsx`
- [x] T011 [P] [US1] Implement `WhatsAppButton` in `frontend/src/components/layout/WhatsAppButton.tsx`: `fixed bottom-4 right-4 md:bottom-6 md:right-6`, links to `https://wa.me/543446410459`, `target="_blank" rel="noopener noreferrer"`, `min-h-[44px] min-w-[44px]`
- [x] T012 [P] [US1] Implement `Footer` in `frontend/src/components/layout/Footer.tsx`: `bg-green-800 text-white`, shows address and phone as text, external links to Facebook/Instagram/WhatsApp (all `target="_blank" rel="noopener noreferrer"`, `min-h-[44px]`)
- [x] T013 [US1] Implement `Navbar` in `frontend/src/components/layout/Navbar.tsx`: logo `<img src="/logo.png">` + "La Olla" heading; desktop (md:) shows 5 `<NavLink>` items inline with `hover:text-yellow-400`; mobile shows hamburger button that toggles dropdown; dropdown closes on navigation via `useEffect` watching `location.pathname`; all nav links and hamburger button `min-h-[44px]`; `bg-green-800 text-white`
- [x] T014 [US1] Implement `Layout` in `frontend/src/components/layout/Layout.tsx`: renders `<Navbar />`, `<main><Outlet /></main>`, `<Footer />`, `<WhatsAppButton />` (depends on T011, T012, T013)
- [x] T015 [US1] Define public routes in `frontend/src/App.tsx`: wrap `/`, `/menu`, `/viandas`, `/pizza-party`, `/contacto` inside `<Route element={<Layout />}>` using page shells from T010 (depends on T010, T014)

**Checkpoint**: All 5 public pages render inside the green Navbar/Footer layout. Mobile hamburger opens/closes. WhatsApp button visible bottom-right. No Layout on `/admin` or `/admin/panel`.

---

## Phase 4: User Story 2 - Admin Logs In and Accesses the Panel (Priority: P2)

**Goal**: `/admin` shows a login form; valid credentials redirect to `/admin/panel`; `/admin/panel` redirects unauthenticated users back to `/admin`.

**Independent Test**: Visit `/admin/panel` without a token — verify redirect to `/admin`. Submit valid credentials on `/admin` — verify redirect to `/admin/panel`. Submit invalid credentials — verify error message shown, no redirect.

### Implementation for User Story 2

- [x] T016 [P] [US2] Create `PanelPage` shell in `frontend/src/pages/admin/PanelPage.tsx`: heading "Panel de Administración" and a logout button placeholder (button labeled "Cerrar sesión", `min-h-[44px]`)
- [x] T017 [US2] Implement `isAuthenticated` and `login` in `frontend/src/hooks/useAuth.ts`: `isAuthenticated` reads `laolla_token` from `localStorage` and returns `true` only if token exists and decoded `exp * 1000 > Date.now()` (using base64url decode with `atob`); `login(email, password)` calls `apiFetch<LoginResponse>('/api/admin/login', { method: 'POST', body: JSON.stringify({ email, password }), headers: { 'Content-Type': 'application/json' } })`, stores token in `localStorage.setItem('laolla_token', token)`, then navigates to `/admin/panel`
- [x] T018 [US2] Implement `ProtectedRoute` in `frontend/src/components/ProtectedRoute.tsx`: calls `useAuth().isAuthenticated`; returns `<Outlet />` if true, `<Navigate to="/admin" replace />` if false (depends on T017)
- [x] T019 [US2] Implement `LoginPage` in `frontend/src/pages/admin/LoginPage.tsx`: email + password fields using `useForm` (React Hook Form) with Zod schema (`z.object({ email: z.string().email(), password: z.string().min(1) })`), submit calls `useAuth().login`, catches thrown error and displays `error.message` in a visible error div; all inputs `min-h-[44px]`; no Navbar/Footer (depends on T017)
- [x] T020 [US2] Add admin routes to `frontend/src/App.tsx`: `/admin` renders `<LoginPage />` (no Layout); wrap `/admin/panel` inside `<Route element={<ProtectedRoute />}>` which renders `<PanelPage />`  (depends on T016, T018, T019)

**Checkpoint**: `/admin/panel` redirects to `/admin` without token. Login with valid credentials redirects to `/admin/panel`. Login with wrong credentials shows error message on `/admin`.

---

## Phase 5: User Story 3 - Admin Logs Out (Priority: P3)

**Goal**: Authenticated admin can log out from the panel, ending their session and returning to the login page.

**Independent Test**: Log in, navigate to `/admin/panel`, click "Cerrar sesión", verify redirect to `/admin` and that `/admin/panel` redirects again.

### Implementation for User Story 3

- [x] T021 [US3] Add `logout` function to `frontend/src/hooks/useAuth.ts`: `localStorage.removeItem('laolla_token')` then navigate to `/admin` (extends T017; no new file)
- [x] T022 [US3] Wire logout button in `frontend/src/pages/admin/PanelPage.tsx`: call `useAuth().logout` in `onClick`; button is `min-h-[44px]`, styled `bg-red-600 text-white` (depends on T021)

**Checkpoint**: Clicking "Cerrar sesión" on `/admin/panel` clears localStorage and redirects to `/admin`. Subsequent visit to `/admin/panel` redirects back to `/admin`.

---

## Phase 6: User Story 4 - Site Reflects Current Opening Hours (Priority: P4)

**Goal**: `useCurrentSchedule` hook fetches and caches schedule data; consuming components can show open/closed status without crashing on API failure.

**Independent Test**: Open browser DevTools Network tab, load any public page — verify `GET /api/schedule` fires once. Stay on page for 4 minutes and navigate — no second request. Check `useCurrentSchedule().isOpenNow` returns correct boolean per current time vs. seeded schedule.

### Implementation for User Story 4

- [x] T023 [US4] Implement `useCurrentSchedule` hook in `frontend/src/hooks/useCurrentSchedule.ts`: `useQuery({ queryKey: ['schedule'], queryFn: () => apiFetch<ScheduleResponse>('/api/schedule') })`; derive `isOpenNow` as `data?.some(day => day.isOpenNow) ?? false`; return `{ schedule: data, isOpenNow, isLoading, error: error as Error | null }`

**Checkpoint**: `useCurrentSchedule()` called in any component correctly returns schedule data and `isOpenNow` boolean; no network request fires within 5 minutes of a prior fetch.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases from spec, final validation, and accessibility.

- [x] T024 Add 404 catch-all route in `frontend/src/App.tsx`: `<Route path="*" element={<Navigate to="/" replace />}>`
- [x] T025 [P] Verify Tailwind `transition-all duration-200` applied to hamburger dropdown in `frontend/src/components/layout/Navbar.tsx` and confirm it does not obstruct desktop layout when viewport is resized
- [x] T026 [P] Audit all interactive elements in `frontend/src/components/layout/Navbar.tsx`, `Footer.tsx`, `WhatsAppButton.tsx`, and `frontend/src/pages/admin/LoginPage.tsx` — confirm every button and link has `min-h-[44px]` and `text-[16px]` or larger
- [x] T027 Run all quickstart.md smoke tests (sections 5.1–5.6) end-to-end and confirm all acceptance scenarios pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion — BLOCKS all user stories
- **User Stories (Phase 3–6)**: All depend on Phase 2; Phases 3–6 depend on each other only for logical completeness, not technical blocking
  - Phase 3 (US1) should complete first as it establishes the app shell and routing skeleton
  - Phase 4 (US2) can begin after Phase 2; depends on App.tsx routes existing (T015) for navigation
  - Phase 5 (US3) depends on Phase 4 (T017 must exist before T021)
  - Phase 6 (US4) depends on Phase 2 (apiFetch must exist)
- **Polish (Phase 7)**: Depends on all user story phases complete

### User Story Dependencies

| Story | Can start after | Notes |
|-------|----------------|-------|
| US1 (P1) | Phase 2 | Establishes Layout and routing; App.tsx must be created here |
| US2 (P2) | Phase 2 + T015 | Adds admin routes to existing App.tsx |
| US3 (P3) | T017 (US2) | Extends useAuth.ts created in US2 |
| US4 (P4) | Phase 2 | Standalone hook; no dependency on US1–US3 |

### Within Each User Story

- Parallel tasks ([P]) can be launched simultaneously
- Sequential tasks follow ID order within the phase
- Each checkpoint must pass before proceeding to the next phase

### Parallel Opportunities

- **Phase 1**: T003, T004, T005 can all run in parallel after T001+T002 complete
- **Phase 2**: T008 can run in parallel with T007; both depend on T006 types
- **Phase 3**: T010, T011, T012 can all start in parallel; T013 can also run in parallel with these (no shared files); T014 waits for T011+T012+T013; T015 waits for T010+T014
- **Phase 4**: T016 can run in parallel with T017; T018, T019 depend on T017; T020 waits for all
- **Phase 7**: T025 and T026 can run in parallel

---

## Parallel Example: Phase 3 (User Story 1)

```
# Can launch simultaneously after Phase 2 is complete:
Task T010: Create 5 public page shells
Task T011: Implement WhatsAppButton component
Task T012: Implement Footer component
Task T013: Implement Navbar component

# Then, after T011 + T012 + T013 complete:
Task T014: Implement Layout (uses all three above)

# Finally, after T010 + T014 complete:
Task T015: Wire public routes in App.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks everything)
3. Complete Phase 3: User Story 1 (T010–T015)
4. **STOP and VALIDATE**: All 5 public pages load with Navbar, Footer, WhatsApp button; mobile hamburger works
5. The public site shell is shippable as-is

### Incremental Delivery

1. Setup + Foundational → app compiles, apiFetch works
2. User Story 1 → public site navigation complete ✅ **Demo-ready**
3. User Story 2 → admin can log in and access panel ✅ **Admin login complete**
4. User Story 3 → admin can log out ✅ **Full auth lifecycle**
5. User Story 4 → schedule hook available for any page to consume ✅ **Infrastructure complete**
6. Polish → edge cases, audit, smoke tests

---

## Notes

- [P] tasks operate on different files — no merge conflicts when run in parallel
- `frontend/src/App.tsx` is touched by T015 (US1) and T020 (US2) — these must run sequentially
- `frontend/src/hooks/useAuth.ts` is touched by T017 (US2) and T021 (US3) — T021 extends T017
- The LoginPage (T019) intentionally includes a minimal working form using React Hook Form + Zod per constitution §IV — this is not "page content" but the auth mechanism
- Public page shells (T010) have no content by design; content specs follow in separate features
- Stop at any checkpoint to validate the story independently before continuing

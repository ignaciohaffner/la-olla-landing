# Tasks: 5 Public Pages — La Olla Website

**Input**: Design documents from `specs/005-public-pages/`  
**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/components.md ✅ | quickstart.md ✅

**Tests**: Not requested — no test tasks included.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1–US5)
- Every task includes an exact file path

---

## Phase 1: Setup (Image Assets + shadcn Components)

**Purpose**: One-time setup required before any page can be implemented. All tasks here are independent of each other and of user stories.

- [x] T001 Create `frontend/public/assets/` directory and copy the 6 food photos from root `/assets/`: `chuletaconpapas.jpeg`, `pizzapalmitos.jpeg`, `pizzaparty.jpg`, `pizzaparty2.jpeg`, `pizzaparty3.jpeg`, `pizzaparty4.jpeg`
- [x] T002 [P] Install shadcn Accordion component — run `npx shadcn add accordion` from inside `frontend/` (creates `frontend/src/components/ui/accordion.tsx`)
- [x] T003 [P] Install shadcn Badge component — run `npx shadcn add badge` from inside `frontend/` (creates `frontend/src/components/ui/badge.tsx`)
- [x] T004 [P] Install shadcn Tabs component — run `npx shadcn add tabs` from inside `frontend/` (creates `frontend/src/components/ui/tabs.tsx`)
- [x] T005 [P] Install shadcn Sonner component — run `npx shadcn add sonner` from inside `frontend/` (creates `frontend/src/components/ui/sonner.tsx`)
- [x] T006 Add `<Toaster richColors position="top-right" />` (from `@/components/ui/sonner`) to `frontend/src/components/layout/Layout.tsx` so toasts work on all pages

**Checkpoint**: Assets visible at `http://localhost:5173/assets/pizzaparty.jpg`; `frontend/src/components/ui/` contains accordion, badge, tabs, sonner

---

## Phase 2: Foundational (Types + Data-Fetching Hooks)

**Purpose**: TypeScript types and React Query hooks that ALL user stories depend on. MUST complete before any page implementation.

**⚠️ CRITICAL**: No page implementation can begin until this phase is complete.

- [x] T007 Add new types to `frontend/src/types/index.ts`: `MenuItem`, `MenuCategory`, `MenuResponse`, `Offer`, `OffersResponse`, `WeeklyMenuDay`, `WeeklyMenuResponse`, `PizzaPartyConfig`, `CalculatorValues`, `PizzaPartyRequestPayload`, `ContactPayload` (see data-model.md for exact field definitions)
- [x] T008 [P] Create `frontend/src/hooks/useMenu.ts` — `useQuery(['menu'], () => apiFetch<MenuResponse>('/api/menu'))`, returns `{ data, isLoading, error }`
- [x] T009 [P] Create `frontend/src/hooks/useOffers.ts` — `useQuery(['offers'], () => apiFetch<OffersResponse>('/api/offers'))`, returns `{ data, isLoading, error }`
- [x] T010 [P] Create `frontend/src/hooks/usePizzaPartyConfig.ts` — `useQuery(['pizza-party-config'], () => apiFetch<PizzaPartyConfig>('/api/pizza-party/config'))`, returns `{ data, isLoading, error }`
- [x] T011 [P] Create `frontend/src/hooks/useWeeklyMenu.ts` — `useQuery(['weekly-menu'], () => apiFetch<WeeklyMenuResponse>('/api/weekly-menu'))`, returns `{ data, isLoading, error }`

**Checkpoint**: All hooks compile with no TypeScript errors; `tsc --noEmit` passes in `frontend/`

---

## Phase 3: User Story 1 — Home Page (Priority: P1) 🎯 MVP

**Goal**: A visitor lands on `/`, sees the hero, current open/closed status, specialties, conditionally visible offers, and Pizza Party CTA. All sections have loading/error fallbacks.

**Independent Test**: Start the dev server, open `http://localhost:5173/` on a 375px viewport (Chrome DevTools), and verify all 5 sections render correctly. The page is fully functional without any other page existing.

### Implementation

- [x] T012 [P] [US1] Create `frontend/src/pages/sections/HeroSection.tsx` — full-height (100vh mobile, 80vh desktop via `md:h-[80vh]`) section with background image `/assets/chuletaconpapas.jpeg`, semi-transparent dark overlay (`bg-black/50`), centered content: logo image (`/logo.png`), h1 "Rotisería La Olla", subtitle text, two `<Link>` buttons ("Ver Menú" → `/menu`, "Pizza Party" → `/pizza-party`) each with `min-h-[44px]`
- [x] T013 [P] [US1] Create `frontend/src/pages/sections/ScheduleSection.tsx` — uses `useCurrentSchedule()` hook; shows green Badge "Abierto ahora" or red Badge "Cerrado" based on `isOpenNow`; renders a list of 7 days mapped from `ScheduleDay[]` using the day-name array `['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']`; shows `openTime–closeTime` if `isOpen=true`, "Cerrado" if `isOpen=false`; renders `specialNote` below the day row when present; shows loading skeleton and error fallback ("Verificá nuestros horarios por WhatsApp")
- [x] T014 [P] [US1] Create `frontend/src/pages/sections/SpecialtiesSection.tsx` — static section with three cards in a 1-column (mobile) / 3-column (md+) grid: card 1 (`/assets/chuletaconpapas.jpeg`, "Comidas Caseras", brief description, `<Link to="/menu">`), card 2 (`/assets/pizzapalmitos.jpeg`, "Pizzas Artesanales", brief description, `<Link to="/menu">`), card 3 (`/assets/pizzaparty2.jpeg`, "Pizza Party", brief description, `<Link to="/pizza-party">`); each card has `overflow-hidden rounded-xl` image, title, description, and a `min-h-[44px]` link button
- [x] T015 [P] [US1] Create `frontend/src/pages/sections/OffersSection.tsx` — uses `useOffers()`; returns `null` if `data` is undefined/loading-error OR if `data.length === 0`; when offers exist renders section heading "Ofertas" and one card per offer with: Badge (from `offer.badge`), h3 title, description, and formatted `validTo` date ("Válido hasta DD/MM/YYYY")
- [x] T016 [P] [US1] Create `frontend/src/pages/sections/PizzaPartyCTASection.tsx` — static banner with background image `/assets/pizzaparty.jpg`, dark overlay, centered text "Hacé tu Pizza Party con nosotros", `<Link to="/pizza-party">` CTA button with `min-h-[44px]`; banner height at least 200px on mobile
- [x] T017 [US1] Implement `frontend/src/pages/HomePage.tsx` — replace placeholder with full page: import and render HeroSection, ScheduleSection, SpecialtiesSection, OffersSection, PizzaPartyCTASection in order; no extra wrapper beyond a `<main>` fragment; no props needed

**Checkpoint**: Navigate to `/` — all 5 sections visible; open/closed badge reflects current time; offers section hidden when no active offers; all links navigable; no TypeScript errors

---

## Phase 4: User Story 2 — Menu Page (Priority: P1)

**Goal**: A visitor navigates to `/menu`, sees horizontally scrollable category tabs, selects a category, and reads item names + prices. Items with price=0 appear in a "Variedades disponibles" sub-list. Schedule indicator shows open/closed status.

**Independent Test**: Open `http://localhost:5173/menu` at 375px; verify tabs are scrollable without wrapping; click each tab and confirm only that category's items appear; confirm "Variedades disponibles" sub-list for price=0 items; schedule badge visible.

### Implementation

- [x] T018 [US2] Implement `frontend/src/pages/MenuPage.tsx` — replace placeholder with full implementation:
  - Use `useMenu()` to fetch `MenuResponse`; show loading state while fetching; show error message if fetch fails
  - Render `ScheduleSection` (imported from `frontend/src/pages/sections/ScheduleSection.tsx`) at top
  - Render shadcn `<Tabs>` with `defaultValue` set to `data[0].category.slug`; tab list uses `overflow-x-auto whitespace-nowrap` to enable horizontal scroll on mobile without wrapping
  - Each `<TabsTrigger>` renders the category name; each `<TabsContent>` renders two lists:
    1. Items with `price > 0`: each item as a row with `<span>name</span>` and `<span className="ml-auto">$price</span>` using flexbox
    2. Items with `price === 0`: rendered only when such items exist, under a "Variedades disponibles" sub-heading, without price column

**Checkpoint**: Tabs render all categories; switching tabs shows only that category's items; price=0 items appear in sub-list; 375px layout has no horizontal overflow on the tab bar

---

## Phase 5: User Story 3 — Pizza Party Page (Priority: P2)

**Goal**: A visitor browses photos in a carousel, reads what's included, calculates a price, and submits a request. Calculator values pre-fill the form. Success/error toasts appear after submission.

**Independent Test**: Open `http://localhost:5173/pizza-party` at 375px; verify carousel auto-advances, prev/next work, dots update; enter guest count above minimum → total updates instantly; click "Solicitar este servicio" → page scrolls to form; form fields show calculator values; submit form → toast appears.

### Implementation

- [x] T019 [P] [US3] Create `frontend/src/components/Carousel.tsx` — props: `images: {src: string; alt: string}[]`, `autoAdvanceMs = 5000`, `aspectRatio = '4/3'`; internal `useState<number>(0)` for `currentIndex`; `useEffect` sets an interval of `autoAdvanceMs` ms that increments index (wraps at `images.length`); prev/next `<button>` elements each `min-h-[44px]`; dots rendered as `<button>` elements with aria-label; on prev/next click: update index AND clear+reset the timer; image renders as `<img>` with `style={{ aspectRatio }}` and `w-full object-cover`
- [x] T020 [P] [US3] Create `frontend/src/pages/PriceCalculator.tsx` — props: `config: PizzaPartyConfig`, `values: CalculatorValues`, `onChange: (v: CalculatorValues) => void`, `onRequestClick: () => void`; renders three inputs:
  - Guest count: `<input type="number" inputMode="numeric" min={config.minimumGuests}>`; on change calls `onChange({...values, guests: Math.max(config.minimumGuests, value)})`
  - Extra hours: `<select>` with options 0, 1, 2; on change calls `onChange({...values, extraHours: value})`
  - Extra mozos: `<input type="number" inputMode="numeric" min={0}>`; on change calls `onChange({...values, extraMozzos: value})`
  - Computed total displayed prominently: `(values.guests * config.pricePerPerson) + (values.extraHours * config.extraHourPrice) + (values.extraMozzos * config.mozzoPrice)`; formatted with `toLocaleString('es-AR', {style:'currency', currency:'ARS'})`
  - CTA button "Solicitar este servicio" with `min-h-[44px]` calls `onRequestClick`
- [x] T021 [US3] Create `frontend/src/pages/RequestForm.tsx` — props: `calculatorValues: CalculatorValues`; uses React Hook Form with Zod schema (name required, email valid format, phone required, eventDate required, message optional); on valid submit: builds `PizzaPartyRequestPayload` by spreading form data + `calculatorValues`; calls `apiFetch('/api/pizza-party/request', {method:'POST', body: JSON.stringify(payload)})`; shows `toast.success('¡Solicitud enviada! Te contactamos pronto.')` on success; shows `toast.error('Hubo un error. Contactanos por WhatsApp.')` on any error; `isLoading` state disables submit button while in-flight; all inputs `min-h-[44px]`; date input uses `type="date"`
- [x] T022 [US3] Implement `frontend/src/pages/PizzaPartyPage.tsx` — replace placeholder:
  - `const [calcValues, setCalcValues] = useState<CalculatorValues>({ guests: config?.minimumGuests ?? 20, extraHours: 0, extraMozzos: 0 })`
  - `const formRef = useRef<HTMLDivElement>(null)` for scroll target
  - Render in order: `<Carousel>` (4 pizza party images), service description (static included/excluded/extras lists), `<PriceCalculator config={config} values={calcValues} onChange={setCalcValues} onRequestClick={() => formRef.current?.scrollIntoView({behavior:'smooth'})} />`, `<div ref={formRef}><RequestForm calculatorValues={calcValues} /></div>`
  - Handle loading/error states from `usePizzaPartyConfig()` before rendering PriceCalculator

**Checkpoint**: Carousel cycles 4 images every 5s; total recalculates on every input change; "Solicitar este servicio" scrolls to form; form is pre-filled; toasts appear on submit

---

## Phase 6: User Story 4 — Viandas Page (Priority: P2)

**Goal**: A visitor reads how Viandas work, sees the weekly menu accordion (or a WhatsApp fallback), reads benefits, and clicks a CTA.

**Independent Test**: Open `http://localhost:5173/viandas` at 375px; verify static sections visible; if backend returns weekly menu data → accordion with 5 weekday entries; if empty → WhatsApp fallback card with link button.

### Implementation

- [x] T023 [US4] Implement `frontend/src/pages/ViandasPage.tsx` — replace placeholder with four sections:
  1. **Cómo funciona** (static): heading, two info cards each with a Lucide icon (`Calendar` and `Clock`), brief description text explaining the viandas service
  2. **Menú de la semana**: uses `useWeeklyMenu()`; if `data` is empty array or fetch error → render a card with text "Consultá el menú de esta semana por WhatsApp" and `<a href="https://wa.me/543446410459" target="_blank" rel="noopener noreferrer">` button with `min-h-[44px]`; if `data` has entries → render shadcn `<Accordion type="single" collapsible>` with one `<AccordionItem>` per entry, trigger shows day name (map `dayOfWeek` 1–5 to `['Lunes','Martes','Miércoles','Jueves','Viernes']`), content shows `<ul>` of `day.dishes`
  3. **Beneficios** (static): list of 3–4 service benefits (e.g., "Menú variado", "Sin costo de envío en zona", "Podés pedir para varios días")
  4. **CTA**: `<Link to="/contacto">` button "Contactanos" with `min-h-[44px]` and a secondary `<a href="https://wa.me/543446410459">` WhatsApp link

**Checkpoint**: Accordion opens/closes each day; WhatsApp fallback shows when no weekly menu in DB; static sections always visible; page usable at 375px

---

## Phase 7: User Story 5 — Contacto Page (Priority: P2)

**Goal**: A visitor finds the restaurant's phone, address, and social links; submits a contact message; and views the embedded map.

**Independent Test**: Open `http://localhost:5173/contacto` at 375px; verify phone/address/Facebook/Instagram all visible; submit form with invalid email → inline error; submit valid form → success toast; map iframe loads and shows correct location; map is 300px tall on mobile.

### Implementation

- [x] T024 [US5] Implement `frontend/src/pages/ContactoPage.tsx` — replace placeholder with three sections:
  1. **Info de contacto**: Lucide `Phone` icon + "3446-410459" text; Lucide `MapPin` icon + "Doello Jurado 1050, Gualeguaychú"; Facebook link (`href="https://www.facebook.com/profile.php?id=100054471429554"`, `target="_blank"`, `rel="noopener noreferrer"`); Instagram link (`href="https://www.instagram.com/rotiserialaolla/"`, same attrs)
  2. **Formulario de contacto**: React Hook Form + Zod schema (name required, email valid format, phone optional, message min-10-chars); on submit: `apiFetch('/api/contact', {method:'POST', body:JSON.stringify(payload)})`; `toast.success('Mensaje enviado. Te respondemos pronto.')` on success; `toast.error('Ocurrió un error. Intentá de nuevo.')` on failure; submit `<button>` disabled while loading; all inputs `min-h-[44px]`; show inline field errors under each input
  3. **Mapa**: `<iframe src="https://www.google.com/maps/embed?pb=...Doello+Jurado+1050+Gualeguaychuú..." width="100%" className="h-[300px] md:h-[450px] border-0 rounded-xl" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Ubicación de Rotisería La Olla" />`

**Checkpoint**: Contact info shows correctly; form validates inline; success/error toasts appear; map iframe renders at 300px mobile / 450px desktop; Facebook and Instagram links open in new tab

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final verification across all 5 pages and cross-cutting quality checks.

- [x] T025 [P] Verify mobile layout at 375px for all 5 pages — check for horizontal overflow (`overflow-x: hidden` test), minimum 44px touch targets on all buttons and links, 16px minimum font size on all inputs (prevents iOS zoom), and no `sm:` Tailwind prefix used anywhere in the new code
- [x] T026 [P] Verify all loading and error states on all pages — temporarily disable network or mock API errors; confirm each data-fetching section shows a loading indicator and a user-friendly fallback (not a blank section or unhandled exception)
- [ ] T027 Run the full smoke test checklist from `specs/005-public-pages/quickstart.md` on both mobile (375px DevTools) and desktop (1280px) viewports

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Can start in parallel with Phase 1; T008–T011 depend on T007 (types must exist first)
- **Phase 3–7 (User Stories)**: All depend on Phase 1 AND Phase 2 being complete
  - User stories themselves are independent of each other (no cross-story imports)
  - Stories can proceed in any order or in parallel
- **Phase 8 (Polish)**: Depends on all desired user stories being complete

### User Story Dependencies

| Story | Page | Depends on |
|-------|------|------------|
| US1 (P1) | Home (`/`) | Phase 1 + Phase 2 complete |
| US2 (P1) | Menu (`/menu`) | Phase 1 + Phase 2 + T013 (ScheduleSection, shared with US1) |
| US3 (P2) | Pizza Party (`/pizza-party`) | Phase 1 + Phase 2 complete |
| US4 (P2) | Viandas (`/viandas`) | Phase 1 + Phase 2 complete |
| US5 (P2) | Contacto (`/contacto`) | Phase 1 + Phase 2 complete |

**Note**: US2 (MenuPage) reuses `ScheduleSection` created in US1 (T013). If implementing in parallel, ensure T013 is complete before starting T018, or implement an inline schedule indicator in MenuPage and refactor later.

### Within Each User Story

- [P]-marked tasks have no dependencies on each other and can be parallelized
- Non-[P] tasks within a story depend on the [P] tasks completing first
- Always run `tsc --noEmit` in `frontend/` after each phase

---

## Parallel Opportunities

### Phase 1 (all parallel)
```
T002 [accordion]  T003 [badge]  T004 [tabs]  T005 [sonner]
     └── all can run simultaneously after T001
```

### Phase 2 (T008–T011 parallel after T007)
```
T007 (types) → T008 [useMenu] + T009 [useOffers] + T010 [usePizzaPartyConfig] + T011 [useWeeklyMenu]
```

### Phase 3 (US1 — T012–T016 parallel)
```
T012 [HeroSection]
T013 [ScheduleSection]
T014 [SpecialtiesSection]    ← all 5 can be created in parallel
T015 [OffersSection]
T016 [PizzaPartyCTASection]
     └── T017 (HomePage) depends on all 5 above
```

### Phase 5 (US3)
```
T019 [Carousel] + T020 [PriceCalculator]  ← parallel
     └── T021 [RequestForm] can start in parallel too
          └── T022 (PizzaPartyPage) depends on T019 + T020 + T021
```

---

## Implementation Strategy

### MVP (User Stories 1 + 2 only)

1. Complete Phase 1 (Setup)
2. Complete Phase 2 (Foundational)
3. Complete Phase 3 (US1 — Home page)
4. **VALIDATE**: Visit `/` at 375px — all sections working
5. Complete Phase 4 (US2 — Menu page)
6. **VALIDATE**: Visit `/menu` — tabs, items, schedule indicator working
7. **Ship/demo** — two fully functional pages

### Full Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Phase 3 (US1) → Home page live ← **Demo here**
3. Phase 4 (US2) → Menu page live ← **Demo here**
4. Phase 5 (US3) → Pizza Party page live ← **Demo here**
5. Phase 6 (US4) → Viandas page live
6. Phase 7 (US5) → Contacto page live ← **All 5 pages done**
7. Phase 8 (Polish) → Production-ready

---

## Notes

- `[P]` tasks can be done in parallel — they touch different files with no shared state
- `[USN]` label maps each task to a specific user story for traceability
- `ScheduleSection` is shared between US1 (Home) and US2 (Menu) — created in T013, imported in T018
- The `<Toaster />` (T006) must be in the DOM before any form page is tested
- Carousel `useEffect` for the auto-advance timer is the **only** permitted `useEffect` in this feature — it drives animation, not data fetching
- Run `tsc --noEmit` in `frontend/` after each phase to catch type errors early
- Images must be in `frontend/public/assets/` (not `frontend/src/assets/`) to be served as static files

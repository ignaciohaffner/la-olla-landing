# Tasks: Admin Login y Panel de Administración

**Input**: Design documents from `specs/006-admin-panel/`  
**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅ contracts/api-admin.md ✅

**Tests**: Not requested — no test tasks generated.

**Organization**: Tasks by user story. Backend is fully implemented; all work is frontend except T003 (backend contact fix).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Maps to user story from spec.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Types and new UI component — unblocks all other phases.

- [x] T001 Add admin TypeScript types to `frontend/src/types/index.ts`: `AdminMenuItem` (id, name, price, description: string|null, available, sortOrder, categoryId), `AdminMenuCategory` ({category: {id, name, slug}, items: AdminMenuItem[]}), `AdminMenuResponse = AdminMenuCategory[]`, `AdminCategory` (id, name, slug, sortOrder), `AdminCategoriesResponse = AdminCategory[]`, `PizzaPartyRequest` (id, name, email, phone, eventDate: string, guests, extraHours, extraMozzos, message: string|null, totalPrice, status: 'pending'|'confirmed'|'rejected', adminNotes: string|null, createdAt: string), `PizzaPartyRequestsResponse = PizzaPartyRequest[]`, `AdminOffer` (id, title, description, badge: string|null, validFrom, validTo, active, createdAt: string), `AdminOffersResponse = AdminOffer[]`, `AdminScheduleDay` (dayOfWeek, openTime: string, closeTime: string, isOpen, specialNote: string|null), `AdminScheduleResponse = AdminScheduleDay[]`, `ContactMessage` (id, name, email, phone: string|null, message, read, createdAt: string), `ContactMessagesResponse = ContactMessage[]`, `WeeklyMenuPutDay` (dayOfWeek, dishes: string[]), `WeeklyMenuPutBody = WeeklyMenuPutDay[]`
- [x] T002 [P] Install shadcn Switch component: run `npx shadcn@latest add switch` from inside `frontend/`; verify `frontend/src/components/ui/switch.tsx` is created

**Checkpoint**: Types and Switch available — foundational work can begin.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Backend fix + PanelPage shell. ALL tab implementations depend on this phase.

**⚠️ CRITICAL**: No tab work can begin until PanelPage shell (T004) is complete.

- [x] T003 Fix contact read-toggle in backend — two files: (1) `backend/src/repositories/contact.repository.ts`: rename `markContactMessageRead` to `setContactMessageReadStatus(id: number, read: boolean)` and change body from `{ data: { read: true } }` to `{ data: { read } }`; (2) `backend/src/controllers/admin/contact.controller.ts`: change `MarkReadSchema` from `z.object({ read: z.literal(true) })` to `z.object({ read: z.boolean() })`, update the handler to call `setContactMessageReadStatus(id, data.read)`, keep the response `res.json({ id: message.id, read: message.read })`
- [x] T004 Create PanelPage.tsx shell replacing the current stub in `frontend/src/pages/admin/PanelPage.tsx`: header row with "La Olla" text logo left + "Panel de Administración" title center-left + "Cerrar sesión" button right (calls `logout()` from `useAuth()`); below header a `<Tabs defaultValue="menu">` with `<TabsList className="w-full overflow-x-auto flex-nowrap whitespace-nowrap">` for horizontal scroll on mobile; six `<TabsTrigger>` with values "menu", "pizza-party", "ofertas", "horarios", "menu-semanal", "mensajes" and labels "Menú", "Pizza Party", "Ofertas", "Horarios", "Menú Semanal", "Mensajes"; each `<TabsContent>` renders a `<div className="p-4">` placeholder with the tab name (to be replaced in later tasks); outer container `className="min-h-screen bg-gray-50"`

**Checkpoint**: Panel shell renders with 6 tabs — each tab can now be implemented independently.

---

## Phase 3: User Story 1 — Acceso Seguro al Panel (Priority: P1) 🎯 MVP

**Goal**: Authenticated users go directly to the panel; unauthenticated users see the login form.

**Independent Test**: Without a token → `/admin` shows the login form. After login → redirected to `/admin/panel`. Navigate back to `/admin` → goes straight to `/admin/panel` without showing the form.

- [x] T005 [US1] Fix `frontend/src/pages/admin/LoginPage.tsx` to redirect authenticated users: import `Navigate` from `react-router-dom`; at the top of `LoginPage` component body, destructure `isAuthenticated` from `useAuth()` alongside `login`; add `if (isAuthenticated) return <Navigate to="/admin/panel" replace />` before the return statement that renders the form; no other changes to the component

**Checkpoint**: Login redirect works end-to-end. Panel renders (with placeholders) after authentication.

---

## Phase 4: User Story 2 — Gestión del Menú (Priority: P1) 🎯 MVP Tab

**Goal**: Admin can view, edit, and manage all menu items and categories, update prices in bulk, and download the price list image.

**Independent Test**: Open MenuTab → items appear grouped by category → edit a price → "Guardar cambios de precio" enables → save → toast shows → button disables. Add new item → appears in list. Toggle available on an item → Switch updates. Delete item → inline confirm → removed. Download price list → PNG downloads.

- [x] T006 [P] [US2] Create `frontend/src/hooks/admin/useAdminMenu.ts`: export `useAdminMenu()` using React Query; query `GET /api/admin/menu` returns `AdminMenuResponse`, queryKey `['admin', 'menu']`; export four mutations each calling `apiFetch` and invalidating `['admin', 'menu']` on success: `createItem(body: {name, price, categoryId, description?, available?, sortOrder?})` → POST /api/admin/menu/items, `patchItem({id, data}: {id: number, data: Partial<AdminMenuItem>})` → PATCH /api/admin/menu/items/:id, `deleteItem(id: number)` → DELETE /api/admin/menu/items/:id (method: DELETE, no body), `bulkUpdatePrices(items: {id: number, price: number}[])` → PATCH /api/admin/menu/prices
- [x] T007 [P] [US2] Create `frontend/src/hooks/admin/useAdminCategories.ts`: export `useAdminCategories()` with query `GET /api/admin/categories` → `AdminCategoriesResponse`, queryKey `['admin', 'categories']`; `createCategory(body: {name, slug, sortOrder: 0})` mutation → POST, invalidates `['admin', 'categories']` AND `['admin', 'menu']`; `deleteCategory(id: number)` mutation → DELETE /api/admin/categories/:id, invalidates same two keys
- [x] T008 [US2] Create `frontend/src/pages/admin/tabs/MenuTab.tsx` and wire it into the "menu" TabsContent in PanelPage.tsx. The component has four sections: (1) **Items list**: call `useAdminMenu()` and `useAdminCategories()`; for each `AdminMenuCategory` render a `<h3>` with category name and below it each item as a row: `<input type="text">` for name (min-h-[44px], base text-base), `<input type="number" inputMode="numeric">` for price, `<Switch>` for available (on change → `patchItem` immediately, show toast), delete button (on first click show "¿Eliminar? Sí / No" inline; on Sí → `deleteItem` → toast); track dirty name+price changes in `useState<Map<number, {name?: string, price?: number}>>` initialized empty. (2) **"Guardar cambios de precio" button**: `disabled={dirtyMap.size === 0}`; on click: for each dirty entry call `patchItem` for name changes and collect price changes for `bulkUpdatePrices`; on all settled → clear dirtyMap → toast success. (3) **Add item form**: `<form>` with inputs: nombre (text), precio (number, inputMode="numeric"), categoría (`<select>` from categories data), descripción (text, optional); on submit → `createItem` → toast. (4) **Categories section**: list each `AdminCategory` with name and a delete button (disabled if that category has items — check `useAdminMenu` data to see if category has items; if yes disable and add title="Tiene ítems"); add-category form: nombre input (text) → on submit auto-derive slug: `name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')` → `createCategory({name, slug, sortOrder: 0})` → toast. (5) **"Descargar lista de precios" button**: on click fetch `GET /api/admin/price-list/image` with auth header as blob → `URL.createObjectURL(blob)` → create `<a href=... download="precios.png">` → click → revoke URL.

**Checkpoint**: Menu tab fully functional. Admin can manage the entire menu from mobile.

---

## Phase 5: User Story 3 — Gestión de Pizza Party (Priority: P2)

**Goal**: Admin can configure Pizza Party pricing and manage incoming event requests.

**Independent Test**: Open Pizza Party tab → Configuración sub-tab shows current config → change price per person → save → toast. Solicitudes sub-tab → filter by "pendiente" → only pending shown → change status to "confirmada" → save → toast.

- [x] T009 [P] [US3] Create `frontend/src/hooks/admin/useAdminPizzaParty.ts`: export `useAdminPizzaParty(statusFilter?: string)` with: config query `GET /api/admin/pizza-party/config` → `PizzaPartyConfig`, queryKey `['admin', 'pizza-party', 'config']`; `patchConfig(data: Partial<PizzaPartyConfig>)` mutation → PATCH /api/admin/pizza-party/config, invalidates config key; requests query `GET /api/admin/pizza-party/requests${statusFilter ? '?status=' + statusFilter : ''}` → `PizzaPartyRequestsResponse`, queryKey `['admin', 'pizza-party', 'requests', statusFilter ?? 'all']`; `patchRequest({id, data: {status?, adminNotes?}})` mutation → PATCH /api/admin/pizza-party/requests/:id, invalidates requests key
- [x] T010 [US3] Create `frontend/src/pages/admin/tabs/PizzaPartyTab.tsx` and wire it into the "pizza-party" TabsContent in PanelPage.tsx. Use nested shadcn Tabs with two sub-tabs: (1) **"Configuración"** sub-tab: React Hook Form + Zod schema `z.object({ pricePerPerson: z.number().positive(), minimumGuests: z.number().int().positive(), baseHours: z.number().int().positive(), extraHourPrice: z.number().positive(), mozzoPrice: z.number().positive(), serviceDetails: z.string().min(1) })`; pre-fill with `useAdminPizzaParty().config` data via `form.reset(config)` in a useEffect watching config; all number fields use `inputMode="numeric"`, `valueAsNumber: true` in register; serviceDetails uses `<textarea>`; submit → `patchConfig` → toast. (2) **"Solicitudes"** sub-tab: status filter at top — `<select>` with options "all"/"pending"/"confirmed"/"rejected" (labels: Todas/Pendientes/Confirmadas/Rechazadas) tracked in `useState`; call `useAdminPizzaParty(statusFilter === 'all' ? undefined : statusFilter)`; render each `PizzaPartyRequest` as a card showing: name, email, phone, eventDate (format with `new Date(req.eventDate).toLocaleDateString('es-AR')`), guests, `$${req.totalPrice.toLocaleString('es-AR')}`, status badge; below: `<select>` for status (pending/confirmed/rejected), `<textarea>` for adminNotes (rows=3); "Guardar" button per card → `patchRequest` → toast

**Checkpoint**: Pizza Party tab fully functional with config and request management.

---

## Phase 6: User Story 4 — Gestión de Ofertas (Priority: P2)

**Goal**: Admin can create, activate/deactivate, and delete promotions; list updates without page reload.

**Independent Test**: Create an offer with title, dates → appears immediately in list. Toggle active → updates. Delete → inline confirm → removed.

- [x] T011 [P] [US4] Create `frontend/src/hooks/admin/useAdminOffers.ts`: export `useAdminOffers()` with query `GET /api/admin/offers` → `AdminOffersResponse`, queryKey `['admin', 'offers']`; mutations: `createOffer(body)` → POST /api/admin/offers, `patchOffer({id, data})` → PATCH /api/admin/offers/:id, `deleteOffer(id)` → DELETE /api/admin/offers/:id; all mutations invalidate `['admin', 'offers']` on success
- [x] T012 [US4] Create `frontend/src/pages/admin/tabs/OffersTab.tsx` and wire it into the "ofertas" TabsContent in PanelPage.tsx. Two sections: (1) **Offers list**: for each `AdminOffer` show a card with title, `badge` rendered as shadcn `<Badge>` if non-null, date range (`validFrom` → `validTo` formatted as `toLocaleDateString('es-AR')`), `active` Switch (on toggle → `patchOffer({ id, data: { active: !offer.active } })` → toast), delete button (inline confirm pattern: first click → show "¿Eliminar? Sí / No"; Sí → `deleteOffer(id)` → toast). (2) **Create offer form**: React Hook Form + Zod: `z.object({ title: z.string().min(1,'Requerido'), description: z.string().min(1,'Requerido'), badge: z.string().optional(), validFrom: z.string().min(1,'Requerido'), validTo: z.string().min(1,'Requerido'), active: z.boolean().default(true) }).refine(d => d.validTo >= d.validFrom, { message:'Fecha fin debe ser ≥ fecha inicio', path:['validTo'] })`; inputs: title (text), description (textarea rows=2), badge (text, optional), validFrom (type="date"), validTo (type="date"), active (Switch); on submit: convert validFrom/validTo strings to ISO with `new Date(val).toISOString()` before sending; call `createOffer` → toast → `form.reset()`

**Checkpoint**: Offers tab fully functional. New offers appear instantly without reload.

---

## Phase 7: User Story 5 — Gestión de Horarios (Priority: P2)

**Goal**: Admin can update opening/closing hours for all 7 days and save them in one action.

**Independent Test**: Open Horarios tab → 7 days visible → mark Sunday as closed → time inputs disable → click "Guardar horarios" → toast success → reload → Sunday still closed.

- [x] T013 [P] [US5] Create `frontend/src/hooks/admin/useAdminSchedule.ts`: export `useAdminSchedule()` with query `GET /api/admin/schedule` → `AdminScheduleResponse`, queryKey `['admin', 'schedule']`; `saveSchedule(days: AdminScheduleDay[])` mutation → PATCH /api/admin/schedule (body: days), invalidates `['admin', 'schedule']` on success
- [x] T014 [US5] Create `frontend/src/pages/admin/tabs/ScheduleTab.tsx` and wire it into the "horarios" TabsContent in PanelPage.tsx. Initialize local state `const [localDays, setLocalDays] = useState<AdminScheduleDay[]>([])` and populate from query data via `useEffect(() => { if (data) setLocalDays(data) }, [data])`; day name labels array indexed by dayOfWeek: `['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']`; render 7 rows each containing: day name `<span>`, isOpen `<Switch>` (on toggle: update that day's `isOpen` in localDays, and if closing set openTime/closeTime to '00:00'), openTime `<input type="time">` (disabled when !isOpen, min-h-[44px]), closeTime `<input type="time">` (disabled when !isOpen, min-h-[44px]), specialNote `<input type="text">` (placeholder="Nota especial"); every change updates localDays immutably; single "Guardar horarios" `<button>` at bottom (min-h-[44px]) → `saveSchedule(localDays)` mutation → toast

**Checkpoint**: Schedule tab fully functional. All 7 days saved in one click.

---

## Phase 8: User Story 6 — Publicación del Menú Semanal (Priority: P2)

**Goal**: Admin can enter dishes per day for the current week and publish them.

**Independent Test**: Open Menú Semanal tab → if empty: aviso visible → type dishes in a day's textarea → click "Publicar" → toast → reload → dishes pre-filled.

- [x] T015 [P] [US6] Create `frontend/src/hooks/admin/useAdminWeeklyMenu.ts`: export `useAdminWeeklyMenu()` with query `GET /api/admin/weekly-menu` → `WeeklyMenuResponse`, queryKey `['admin', 'weekly-menu']`; `publishWeeklyMenu(body: WeeklyMenuPutBody)` mutation → PUT /api/admin/weekly-menu (body), invalidates `['admin', 'weekly-menu']` on success
- [x] T016 [US6] Create `frontend/src/pages/admin/tabs/WeeklyMenuTab.tsx` and wire it into the "menu-semanal" TabsContent in PanelPage.tsx. Day labels for dayOfWeek 1-5: `{1:'Lunes',2:'Martes',3:'Miércoles',4:'Jueves',5:'Viernes'}`; local state: `const [textareas, setTextareas] = useState<Record<number, string>>({1:'',2:'',3:'',4:'',5:''})` pre-filled from query data via `useEffect(() => { if (data?.length) { const map: Record<number,string>={}; data.forEach(d => { map[d.dayOfWeek] = d.dishes.join('\n') }); setTextareas(prev => ({...prev, ...map})) } }, [data])`; if `data` is empty array and query is done: show `<p className="text-amber-700">No hay menú publicado para esta semana.</p>`; render 5 `<textarea>` (rows=4, placeholder="Un plato por línea") each labeled with day name; "Publicar menú de esta semana" button (min-h-[44px]) → on click parse each textarea: `Object.entries(textareas).map(([day, text]) => ({ dayOfWeek: Number(day), dishes: text.split('\n').map(s => s.trim()).filter(Boolean) })).filter(d => d.dishes.length > 0)`; if empty → sonner warning "Ingresá al menos un plato"; else → `publishWeeklyMenu(body)` → toast success

**Checkpoint**: Weekly menu tab fully functional. Dishes publish and reload correctly.

---

## Phase 9: User Story 7 — Gestión de Mensajes de Contacto (Priority: P3)

**Goal**: Admin can read all contact messages, toggle read/unread, and reply by email. Unread count shows as badge on the tab.

**Independent Test**: Open Mensajes tab → messages listed newest first → badge shows unread count → click "Marcar como leído" → badge decreases → click "Marcar como no leído" → badge increases → click "Responder por email" → email client opens with correct recipient.

- [x] T017 [P] [US7] Create `frontend/src/hooks/admin/useAdminMessages.ts`: export `useAdminMessages()` with: `messages` query `GET /api/admin/contact` → `ContactMessagesResponse`, queryKey `['admin', 'contact']`; `unreadCount` query `GET /api/admin/contact/unread-count` → `{ count: number }`, queryKey `['admin', 'contact', 'unread']`, options `{ staleTime: 0, refetchOnWindowFocus: true }`; `setRead({ id, read }: { id: number; read: boolean })` mutation → PATCH /api/admin/contact/:id/read with body `JSON.stringify({ read })`, on success invalidates both `['admin', 'contact']` and `['admin', 'contact', 'unread']`; return all three
- [x] T018 [US7] Create `frontend/src/pages/admin/tabs/MessagesTab.tsx` and wire it into the "mensajes" TabsContent in PanelPage.tsx. Use `useAdminMessages()`; render each `ContactMessage` as a card (border, rounded, p-4, mb-3): top row with name (`font-semibold`) + date (`new Date(msg.createdAt).toLocaleString('es-AR')`); second row: email (text-sm text-gray-600) + phone if present; message text (mt-2, whitespace-pre-wrap); action row: toggle-read button (label "Marcar como leído" if !msg.read, "Marcar como no leído" if msg.read, min-h-[44px], calls `setRead({ id: msg.id, read: !msg.read })` → shows sonner toast); reply button rendered as `<a href={\`mailto:${msg.email}\`} className="...">Responder por email</a>` styled as a secondary button (min-h-[44px])
- [x] T019 [US7] Wire unread badge to Mensajes tab in `frontend/src/pages/admin/PanelPage.tsx`: import `useAdminMessages`; destructure `unreadCount` (the query result); in the "mensajes" `<TabsTrigger>`: render the label as `<span className="flex items-center gap-1">Mensajes{count > 0 && <span className="bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 leading-none">{count}</span>}</span>` where `count = unreadCount.data?.count ?? 0`

**Checkpoint**: All 6 tabs fully functional. Unread badge updates in real time.

---

## Phase 10: Polish & Cross-Cutting Concerns

- [x] T020 Run end-to-end smoke test per `specs/006-admin-panel/quickstart.md`: verify login redirect, all 6 tabs load without errors, mobile layout at 375px (all tabs scroll horizontally, all buttons ≥44px, no horizontal overflow on content), toast notifications appear on all save/delete actions, price list download triggers PNG file, email client opens on "Responder"

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on T001 (types must exist) — BLOCKS all tab phases
- **US1 (Phase 3)**: Depends on Phase 2 complete
- **US2–US7 (Phases 4–9)**: Depend on Phase 2 complete; can proceed in priority order or in parallel
- **Polish (Phase 10)**: Depends on all desired user stories complete

### User Story Dependencies

- **US1 (P1)**: Only needs Phase 2 done. No dependency on any other US.
- **US2 (P1)**: Only needs Phase 2 done. No dependency on any other US.
- **US3 (P2)**: Only needs Phase 2 done. Independent of US2.
- **US4 (P2)**: Only needs Phase 2 done. Independent of US2, US3.
- **US5 (P2)**: Only needs Phase 2 done. Independent of all others.
- **US6 (P2)**: Only needs Phase 2 done. Independent of all others.
- **US7 (P3)**: Only needs Phase 2 done (backend fix T003 is prereq). T019 needs T018.

### Within Each User Story

- Hook task [P] can run alongside PanelPage wiring prep
- Hook must complete before tab component is implemented (tab imports the hook)
- Tab component must complete before polish phase validates it

### Parallel Opportunities

- T001 and T002 can run in parallel (different tools/files)
- T003 and T004 can run in parallel (backend vs frontend)
- T006 and T007 can run in parallel (different hook files, both [US2])
- T009, T011, T013, T015, T017 can all run in parallel (different hook files, different stories)
- US3, US4, US5, US6 phases can run in parallel with each other (all P2, all independent)

---

## Parallel Example: US2 (Gestión del Menú)

```
# Step 1 — run in parallel:
T006: Create useAdminMenu.ts
T007: Create useAdminCategories.ts

# Step 2 — after T006 and T007 complete:
T008: Create MenuTab.tsx (imports both hooks)
```

## Parallel Example: P2 Tabs (after Phase 2 complete)

```
# All four P2 hook tasks can run simultaneously:
T009: useAdminPizzaParty.ts
T011: useAdminOffers.ts
T013: useAdminSchedule.ts
T015: useAdminWeeklyMenu.ts

# Then their respective tab components:
T010: PizzaPartyTab.tsx   (needs T009)
T012: OffersTab.tsx       (needs T011)
T014: ScheduleTab.tsx     (needs T013)
T016: WeeklyMenuTab.tsx   (needs T015)
```

---

## Implementation Strategy

### MVP (User Stories 1 + 2 only)

1. Complete Phase 1: Setup (T001, T002)
2. Complete Phase 2: Foundational (T003, T004)
3. Complete Phase 3: US1 (T005) — login redirect working
4. Complete Phase 4: US2 (T006, T007, T008) — menu tab fully functional
5. **STOP and VALIDATE**: login works, menu tab works, panel accessible from mobile
6. Ship MVP — admin can manage the most critical resource (menu + prices)

### Incremental Delivery

1. MVP above → admin has login + menu management
2. Phase 5 (US3) → add Pizza Party management
3. Phases 6–8 (US4, US5, US6) → add Offers, Schedule, Weekly Menu
4. Phase 9 (US7) → add Messages with unread badge
5. Phase 10 → polish and smoke test everything

---

## Notes

- [P] tasks = different files, no cross-task dependencies within the same phase
- All admin API calls automatically include the JWT via `apiFetch` (handles `/api/admin/` prefix)
- Mobile constraints from constitution: no `sm:` breakpoint, min-h-[44px] on all interactive elements, inputMode="numeric" on all number inputs, base font 16px
- All save actions must show a sonner toast (success or error) per SC-007
- The inline confirm delete pattern (button → Sí/No) avoids adding dialog components (per research D-003)
- Weekly menu textarea: each line = one dish; empty lines are filtered on save (per research D-002)

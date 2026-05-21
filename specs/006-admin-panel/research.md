# Research: Admin Login y Panel de Administración

**Branch**: `006-admin-panel` | **Date**: 2026-05-10

## Current State Audit

Everything in the backend is already implemented. This is a frontend-only feature plus one backend fix.

### Backend — fully implemented

- Auth middleware (`backend/src/middleware/auth.ts`) validates JWT on all `/api/admin/*` routes
- All admin controllers, repositories, and routes are live for: menu, categories, pizza party (config + requests), offers, schedule, weekly menu, contact messages, price list image
- `apiFetch` in `frontend/src/lib/api.ts` automatically injects the `Authorization: Bearer <token>` header for any path starting with `/api/admin/`

### Frontend — already exists

| File | Status |
|------|--------|
| `LoginPage.tsx` | Complete — form, validation, error message. **Missing**: redirect if already authenticated |
| `PanelPage.tsx` | Stub — renders a placeholder paragraph |
| `ProtectedRoute.tsx` | Complete |
| `useAuth.ts` | Complete — localStorage JWT, `isAuthenticated`, `login()`, `logout()` |
| `App.tsx` | Complete — routes `/admin` and `/admin/panel` wired correctly |
| `lib/api.ts` | Complete |
| `types/index.ts` | Partial — public types exist; admin-specific types missing |
| shadcn `tabs.tsx` | Installed |
| shadcn `badge.tsx` | Installed |
| shadcn `button.tsx` | Installed |
| shadcn `sonner.tsx` | Installed (toast notifications) |

---

## Decisions

### D-001: LoginPage redirect-if-authenticated

**Decision**: Add `if (isAuthenticated) return <Navigate to="/admin/panel" replace />` at the top of `LoginPage`, before rendering the form.

**Rationale**: `useAuth` already exposes `isAuthenticated` (computed from localStorage JWT + expiry check). One line of JSX is all that's needed. No new state, no hook, no effect.

**Alternatives considered**: `useEffect` + `navigate()` — rejected because it causes a flash of the login form before redirecting; the synchronous JSX return avoids it.

---

### D-002: Weekly menu editing — textarea per day

**Decision**: Each day (Mon–Fri) gets a `<textarea>` where each line is one dish. On save, split by newline, trim, filter empty strings → `dishes: string[]`.

**Rationale**: The backend stores `dishes: string[]`. A textarea is the most mobile-friendly editing surface for a list of short strings. The admin types one dish per line, which is natural and fast.

**Alternatives considered**: Row-per-dish with Add/Remove buttons — rejected because it adds component complexity and is slower on mobile keyboard; the spec explicitly lists "textarea" as an acceptable option.

---

### D-003: Delete confirmation — inline confirm pattern

**Decision**: When the admin clicks a delete button, the button is replaced inline with a "¿Eliminar? Confirmar / Cancelar" row tracked in component state. No dialog component needed.

**Rationale**: Avoids adding `dialog.tsx` or `alert-dialog.tsx` (new shadcn components). The inline pattern is fully accessible, works perfectly on mobile, and is YAGNI-compliant.

**Alternatives considered**: `window.confirm()` — rejected because it blocks the JS thread and looks out of place on mobile browsers. shadcn `AlertDialog` — rejected, not needed for this feature's scope.

---

### D-004: Switch component for toggles

**Decision**: Add `switch.tsx` via `npx shadcn@latest add switch` (run from inside `frontend/`).

**Rationale**: Used in three tabs (available per menu item, active per offer, isOpen per schedule day). A native `<input type="checkbox">` styled to look like a toggle adds friction; the shadcn Switch is already part of the approved ecosystem and gives proper mobile touch UX.

**Alternatives considered**: Native checkbox — rejected for UX reasons on mobile. Custom CSS toggle — rejected as over-engineering given shadcn Switch is available.

---

### D-005: Category slug auto-generation

**Decision**: When the admin creates a category, the UI auto-derives the slug from the name: lowercase, trim whitespace, replace spaces with hyphens, strip non-alphanumeric-hyphen characters. The slug field is not shown to the admin.

**Rationale**: The backend requires a unique `slug` but the admin doesn't need to know about slugs. Auto-generation avoids a confusing extra field and matches the convention already used in seed data.

**Alternatives considered**: Expose slug field — rejected because it's an internal implementation detail irrelevant to the business user.

---

### D-006: Contact mark-read/unread — backend fix required

**Decision**: Extend the backend to accept `{ read: boolean }` instead of `{ read: true }` only.

**Rationale**: `contact.controller.ts` uses `z.literal(true)`, which means the endpoint can only mark messages as read, never as unread. The spec requires a toggle. This is an incomplete implementation, not a design decision.

**Changes required**:
1. `backend/src/repositories/contact.repository.ts`: rename `markContactMessageRead` → `setContactMessageReadStatus(id, read)` that accepts a boolean
2. `backend/src/controllers/admin/contact.controller.ts`: change schema to `z.object({ read: z.boolean() })` and call the updated repository function

---

### D-007: Admin hook organization

**Decision**: Admin hooks live in `frontend/src/hooks/admin/` as a subdirectory, separate from public hooks.

**Rationale**: Keeps admin-specific React Query hooks (which use mutations and admin endpoints) clearly separated from the public read-only hooks. Naming convention: `useAdmin<Resource>.ts`.

---

### D-008: Toast notifications for save actions

**Decision**: Use `sonner` (already installed) to show success/error toasts after all save/create/delete mutations.

**Rationale**: The spec requires "confirmación visual de éxito o error" for all save actions (SC-007). Sonner is already in the project. The `<Toaster>` is already mounted in the app.

**Alternatives considered**: Inline success messages per section — rejected because they add layout complexity and sonner is already available.

---

### D-009: Unread message count — refetch strategy

**Decision**: `useAdminMessages` fetches the unread count with `staleTime: 0` and `refetchOnWindowFocus: true`. The list refetches on window focus too.

**Rationale**: Messages are the most time-sensitive data in the panel. The admin returning to the browser tab after checking their phone should see fresh counts. Zero staleTime ensures the badge reflects reality.

**Alternatives considered**: Manual refetch button — rejected as unnecessary complexity given React Query's built-in window focus refetch.

---

### D-010: Offers `active` field in types

**Decision**: Introduce a separate `AdminOffer` type that extends the public `Offer` with the `active: boolean` field. The existing `Offer` type (used by public pages) remains unchanged.

**Rationale**: The public `/api/offers` endpoint may filter by active status server-side. The admin endpoint returns all offers including `active`. Separate types prevent confusion.

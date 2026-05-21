# Implementation Plan: Admin Login y Panel de Administración

**Branch**: `006-admin-panel` | **Date**: 2026-05-10 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `specs/006-admin-panel/spec.md`

## Summary

Implement the admin login page redirect-if-authenticated behavior and replace the `PanelPage.tsx` stub with a full six-tab admin panel. The backend API for all admin operations is already fully implemented (all routes, controllers, repositories, and auth middleware are in place). This feature is exclusively a frontend build, plus one backend fix: the contact mark-read endpoint currently only accepts `{ read: true }`; it must be extended to accept `{ read: boolean }` to support the toggle-read/unread requirement. The panel is organized using shadcn `Tabs` (already installed) and introduces one new shadcn component (`Switch`). All server state is managed via seven new React Query admin hooks. No new pages, routes, or backend routes are added.

## Technical Context

**Language/Version**: TypeScript 5 / React 18 (Vite, as per constitution §I)  
**Primary Dependencies**: React Query v5 (mutations + invalidation), React Hook Form v7 + Zod v4 (forms in config/create panels), shadcn/ui Tabs (existing) + Switch (new), Lucide React (icons)  
**Storage**: JWT token in `localStorage` under key `laolla_token` (already in use by `useAuth.ts`)  
**Testing**: No test framework (consistent with project pattern)  
**Target Platform**: Web browser, mobile-first at 375px; breakpoints `md:` (768px+), `lg:` (1024px+) only  
**Project Type**: SPA — additions within `frontend/` + one fix in `backend/`  
**Performance Goals**: Panel tabs load data within 3 seconds on mobile; React Query default staleTime  
**Constraints**: No `sm:` breakpoint; 44px min touch targets; 16px base font; `any` prohibited; `useEffect` prohibited for data fetching; `inputMode="numeric"` on all numeric inputs  
**Scale/Scope**: 1 fixed page + 1 replaced stub; 6 tab components; 7 admin React Query hooks; 1 backend fix

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Stack Fijo | ✅ PASS | React + Vite + TypeScript + Tailwind + shadcn/ui + React Query. Adding `switch` from shadcn/ui is within the approved ecosystem. No new libraries. |
| II. Mobile-First | ✅ PASS | All tab layouts designed at 375px first. Tabs use `overflow-x-auto` for horizontal scroll on mobile. Numeric inputs use `inputMode="numeric"`. All buttons ≥ 44px. |
| III. Código Tipado | ✅ PASS | TypeScript throughout; no `any`; all server state via React Query hooks + mutations; no `useEffect` for data fetching. |
| IV. Formularios | ✅ PASS | Config forms (PizzaParty config, new offer, new category) use React Hook Form + Zod. Direct inline edits (price inputs per item) are controlled inputs tracked in local component state — not form library — because they are not submitted as a form; this is the right exception. |
| V. Simplicidad (YAGNI) | ✅ PASS | No dialog component added (inline confirm pattern used instead). Weekly menu editing uses textarea-per-day (each line = one dish) — simpler, equally functional, better on mobile. No speculative abstractions. |

**Constitution re-check post-design**: No violations found. The one backend fix (contact read toggle) is a correction to an incomplete implementation, not a new feature.

## Project Structure

### Documentation (this feature)

```text
specs/006-admin-panel/
├── plan.md              # This file
├── research.md          # Phase 0 — decisions
├── data-model.md        # Phase 1 — TypeScript types
├── quickstart.md        # Phase 1 — setup + smoke test
├── contracts/
│   └── api-admin.md     # Phase 1 — admin API endpoint contracts
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created here)
```

### Source Code Changes

```text
backend/
└── src/
    ├── repositories/
    │   └── contact.repository.ts     ← FIX: add setContactMessageRead(id, read)
    └── controllers/admin/
        └── contact.controller.ts     ← FIX: accept { read: boolean } in MarkReadSchema

frontend/
└── src/
    ├── types/
    │   └── index.ts                  ← ADD: AdminMenuItem, AdminMenuCategory,
    │                                         AdminMenuResponse, AdminCategory,
    │                                         PizzaPartyRequest, AdminOffer,
    │                                         ContactMessage, ContactMessagesResponse,
    │                                         AdminOffersResponse, AdminScheduleDay
    ├── hooks/
    │   └── admin/                    ← NEW directory
    │       ├── useAdminMenu.ts       ← NEW (query + create/patch/delete/bulkPrices mutations)
    │       ├── useAdminCategories.ts ← NEW (query + create/delete mutations)
    │       ├── useAdminPizzaParty.ts ← NEW (config query+mutation, requests query+mutation)
    │       ├── useAdminOffers.ts     ← NEW (query + create/patch/delete mutations)
    │       ├── useAdminSchedule.ts   ← NEW (query + patch mutation)
    │       ├── useAdminWeeklyMenu.ts ← NEW (query + put mutation)
    │       └── useAdminMessages.ts   ← NEW (list query + unreadCount query + markRead mutation)
    ├── components/
    │   └── ui/
    │       └── switch.tsx            ← ADD via shadcn CLI
    └── pages/
        └── admin/
            ├── LoginPage.tsx         ← FIX: add redirect-if-authenticated at top
            ├── PanelPage.tsx         ← REPLACE: full implementation with 6 Tabs
            └── tabs/                 ← NEW directory
                ├── MenuTab.tsx       ← NEW
                ├── PizzaPartyTab.tsx ← NEW (2 sub-tabs: Configuración, Solicitudes)
                ├── OffersTab.tsx     ← NEW
                ├── ScheduleTab.tsx   ← NEW
                ├── WeeklyMenuTab.tsx ← NEW
                └── MessagesTab.tsx   ← NEW
```

## Complexity Tracking

No constitution violations found. No entries required.

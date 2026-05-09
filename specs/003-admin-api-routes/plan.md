# Implementation Plan: Admin API Routes

**Branch**: `003-admin-api-routes` | **Date**: 2026-05-09 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/003-admin-api-routes/spec.md`

## Summary

Add a complete set of authenticated admin endpoints to the existing Express backend. The admin
panel API provides CRUD operations for menu items and categories, pizza party configuration and
request management, offers, schedule, weekly menu, and contact messages. All routes (except
login) are protected by a JWT middleware. A final endpoint generates a downloadable PNG price
list using Sharp. Two new packages are required: `jsonwebtoken` and `sharp`.

## Technical Context

**Language/Version**: TypeScript 5 / Node.js 20+
**Primary Dependencies**: Express 5, Prisma 5 (PostgreSQL), Zod 4, bcrypt (existing), jsonwebtoken (new), nodemailer (existing), Sharp (new)
**Storage**: PostgreSQL via Prisma ORM — no schema changes required; all entities exist
**Testing**: No test framework configured (same as feature 002)
**Target Platform**: Linux server (same deployment as public API)
**Project Type**: web-service (REST API)
**Performance Goals**: < 500ms for all CRUD endpoints; < 5s for price list image with ≤100 items
**Constraints**: Single admin user; JWT HS256 with 7-day expiry; no schema migrations needed
**Scale/Scope**: Low-traffic admin API; one active session at a time

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Stack Fijo | ✅ PASS | Express + TypeScript + Prisma + JWT (constitution §I) + Sharp (constitution §I) |
| II. Mobile-First | ✅ N/A | Backend-only feature; no UI |
| III. Código Tipado | ✅ PASS | TypeScript throughout; `any` prohibited; `req.admin` typed via declaration merging |
| IV. Formularios y Validación | ✅ PASS | All request bodies validated with Zod schemas before reaching handlers |
| V. Simplicidad (YAGNI) | ✅ PASS | No speculative abstractions; repositories extended, not duplicated; SVG built with template literals |

**Constitution re-check post-design**: No violations. The admin router uses a barrel file
(`routes/admin/index.ts`) which constitution §V allows because 8 resource groups justify the
indirection over flat naming. All new dependencies are explicitly listed in constitution §I.

## Project Structure

### Documentation (this feature)

```text
specs/003-admin-api-routes/
├── plan.md              # This file
├── research.md          # Phase 0 — key decisions
├── data-model.md        # Phase 1 — request/response shapes + Zod schemas
├── contracts/
│   └── api-endpoints.md # Phase 1 — full REST contract with examples
├── quickstart.md        # Phase 1 — setup and smoke test guide
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created here)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── middleware/
│   │   └── auth.ts                      # JWT Bearer verification (new)
│   ├── routes/
│   │   ├── admin/
│   │   │   ├── index.ts                 # Admin router barrel (new)
│   │   │   ├── menu.ts                  # Menu item + bulk price routes (new)
│   │   │   ├── categories.ts            # Category CRUD routes (new)
│   │   │   ├── pizzaParty.ts            # Config + requests routes (new)
│   │   │   ├── offers.ts                # Offers CRUD routes (new)
│   │   │   ├── schedule.ts              # Schedule routes (new)
│   │   │   ├── weeklyMenu.ts            # Weekly menu routes (new)
│   │   │   ├── contact.ts               # Contact message routes (new)
│   │   │   └── priceList.ts             # Price list image route (new)
│   │   └── [existing public routes — unchanged]
│   ├── controllers/
│   │   ├── admin/
│   │   │   ├── auth.controller.ts       # loginHandler (new)
│   │   │   ├── menu.controller.ts       # getAdminMenu, createItem, patchItem, deleteItem, bulkUpdatePrices (new)
│   │   │   ├── categories.controller.ts # listCategories, createCategory, patchCategory, deleteCategory (new)
│   │   │   ├── pizzaParty.controller.ts # getConfig, patchConfig, listRequests, patchRequest (new)
│   │   │   ├── offers.controller.ts     # listOffers, createOffer, patchOffer, deleteOffer (new)
│   │   │   ├── schedule.controller.ts   # getSchedule, patchSchedule (new)
│   │   │   ├── weeklyMenu.controller.ts # getWeeklyMenu, putWeeklyMenu (new)
│   │   │   ├── contact.controller.ts    # listMessages, markRead, unreadCount (new)
│   │   │   └── priceList.controller.ts  # generatePriceListImage (new)
│   │   └── [existing public controllers — unchanged]
│   ├── repositories/
│   │   ├── menu.repository.ts           # Extended: getAllMenuItems (incl. unavailable), bulkUpdatePrices
│   │   ├── category.repository.ts       # Extended: createCategory, patchCategory, deleteCategory (409 check)
│   │   ├── pizzaParty.repository.ts     # Extended: getConfig, patchConfig, listRequests (filter), patchRequest
│   │   ├── offer.repository.ts          # Extended: getAllOffers (no filter), createOffer, patchOffer, deleteOffer
│   │   ├── schedule.repository.ts       # Extended: getScheduleRaw (no isOpenNow calc), upsertSchedule
│   │   ├── weeklyMenu.repository.ts     # Extended: upsertWeeklyMenuDay
│   │   └── contact.repository.ts        # Extended: getAllMessages, markRead, unreadCount
│   ├── assets/
│   │   └── logo.png                     # Business logo for price list (manual addition)
│   └── app.ts                           # Extended: login route + admin router with auth middleware
```

**Structure Decision**: Web application. `frontend/` is unchanged. `backend/` extended with
`admin/` subdirectory under `routes/` and `controllers/` to physically separate admin from
public code. Repositories extended in-place per constitution §V (no parallel structure).

## Complexity Tracking

No constitution violations.

# Implementation Plan: Public API Routes

**Branch**: `002-public-api-routes` | **Date**: 2026-05-07 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/002-public-api-routes/spec.md`

## Summary

Implement the public (unauthenticated) REST API for Rotisería La Olla's Express backend.
Nine endpoints under `/api/` expose menu data, schedules, offers, pizza party configuration,
and accept form submissions (pizza party requests and contact messages). Server-side price
calculation, Zod validation, Nodemailer email notifications, and a global error middleware
complete the feature.

## Technical Context

**Language/Version**: Node.js 20 LTS + TypeScript 6.x  
**Primary Dependencies**: Express 4.x, Zod 3.x, Nodemailer 6.x, `@prisma/client` 5.x (already installed)  
**Storage**: PostgreSQL via Prisma (schema already migrated from `001-database-schema`)  
**Testing**: Manual curl / Thunder Client against running server; Jest unit tests for `isOpenNow` and `totalPrice` logic  
**Target Platform**: Linux server (production) / macOS (development)  
**Project Type**: Web service — `backend/` Express API  
**Performance Goals**: All GET endpoints respond in < 500ms under single-request load  
**Constraints**: No auth on these routes. `OWNER_EMAIL` env var required for email; missing → log error, don't fail request. No stack traces in production responses.  
**Scale/Scope**: 9 routes, 2 POST endpoints with side effects, ~1–10 concurrent users expected at launch

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Stack Fijo | ✅ PASS | Express + TypeScript + Prisma + Nodemailer — all approved stack components. |
| II. Mobile-First | N/A | Backend API — no UI. |
| III. Código Tipado | ✅ PASS | TypeScript strict mode already configured; Zod schemas provide runtime + compile-time types; no `any`. |
| IV. Formularios y Validación | ✅ PASS | Both POST endpoints validated with Zod schemas server-side per constitution §IV. |
| V. Simplicidad (YAGNI) | ✅ PASS | Controller-Service-Repository applied consistently. No extra abstraction beyond the three layers; each layer has a single, clear responsibility. |

**Post-design re-check**: ✅ All applicable gates pass. No violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/002-public-api-routes/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output — request/response shapes
├── quickstart.md        # Phase 1 output — how to run and test the API
├── contracts/
│   └── api-endpoints.md # Phase 1 output — full endpoint contract
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── repositories/            # Data access — Prisma queries only
│   │   ├── category.repository.ts
│   │   ├── menu.repository.ts
│   │   ├── pizzaParty.repository.ts
│   │   ├── offer.repository.ts
│   │   ├── schedule.repository.ts
│   │   ├── weeklyMenu.repository.ts
│   │   └── contact.repository.ts
│   ├── services/                # Business logic — calculations, email, date logic
│   │   ├── menu.service.ts
│   │   ├── pizzaParty.service.ts
│   │   ├── offer.service.ts
│   │   ├── schedule.service.ts
│   │   ├── weeklyMenu.service.ts
│   │   └── contact.service.ts
│   ├── controllers/             # HTTP layer — parse request, call service, send response
│   │   ├── health.controller.ts
│   │   ├── menu.controller.ts
│   │   ├── pizzaParty.controller.ts
│   │   ├── offer.controller.ts
│   │   ├── schedule.controller.ts
│   │   ├── weeklyMenu.controller.ts
│   │   └── contact.controller.ts
│   ├── routes/                  # Express Router wiring only
│   │   ├── health.ts
│   │   ├── menu.ts              # mounts /menu + /categories
│   │   ├── pizzaParty.ts        # mounts /pizza-party/config + /pizza-party/request
│   │   ├── offers.ts
│   │   ├── schedule.ts
│   │   ├── weeklyMenu.ts
│   │   └── contact.ts
│   ├── middleware/
│   │   └── errorHandler.ts      # Global Express error middleware
│   ├── lib/
│   │   ├── prisma.ts            # PrismaClient singleton (unchanged)
│   │   └── mailer.ts            # Nodemailer transport singleton
│   └── app.ts                   # Express app setup, route registration
├── index.ts                     # HTTP server entry point
├── package.json
└── tsconfig.json
```

**Structure Decision**: Web application layout. Only `backend/` is modified. `frontend/` is not touched.

## Complexity Tracking

> No constitution violations — table left intentionally empty.

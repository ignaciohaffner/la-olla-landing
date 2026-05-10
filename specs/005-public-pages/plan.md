# Implementation Plan: 5 Public Pages — La Olla Website

**Branch**: `005-public-pages` | **Date**: 2026-05-09 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `specs/005-public-pages/spec.md`

## Summary

Implement the five public-facing pages of La Olla's website — Home, Menú, Viandas, Pizza Party, and Contacto — by replacing the existing placeholder page components with full implementations. All pages consume the already-implemented backend API (feature 002) via React Query hooks. The frontend infrastructure (router, layout, `apiFetch`, `useCurrentSchedule`, QueryClient) is already in place from feature 004. This feature adds page content, data-fetching hooks, reusable page-section components, the price calculator, two contact forms, an image carousel, and the required shadcn/ui components (Tabs, Accordion, Toast).

## Technical Context

**Language/Version**: TypeScript 5 / React 19 (installed; constitution says 18 but 19 is API-compatible)  
**Primary Dependencies**: React Query v5, React Hook Form v7, Zod v4, shadcn/ui (base-nova style via @base-ui/react), Lucide React, react-router-dom v7  
**Storage**: No client-side persistence for this feature; calculator state is ephemeral in-memory component state  
**Testing**: No test framework (consistent with project pattern established in feature 004)  
**Target Platform**: Web browser, mobile-first at 375px viewport width; breakpoints `md:` (768px+) and `lg:` (1024px+)  
**Project Type**: SPA — implementing page content within the existing `frontend/` project  
**Performance Goals**: All pages display primary content within 3 seconds on mobile; React Query staleTime inherited from global QueryClient (5 min)  
**Constraints**: No `sm:` breakpoint; 44px minimum interactive targets; 16px base font; `any` type prohibited; `useEffect` prohibited for data fetching; no new libraries beyond shadcn components (sonner for toast)  
**Scale/Scope**: 5 public routes; ~15 new components; 4 new React Query hooks; ~2 Zod schemas for forms

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Stack Fijo | ✅ PASS | React + Vite + TypeScript + Tailwind + shadcn/ui + React Query — all in constitution §I. Sonner (toast library) is part of the standard shadcn/ui ecosystem, not a novel addition. |
| II. Mobile-First | ✅ PASS | All sections designed at 375px first; only `md:` and `lg:` breakpoints used; all form inputs have `inputMode="numeric"` where applicable; `min-h-[44px]` on all interactive elements. |
| III. Código Tipado | ✅ PASS | TypeScript throughout; no `any`; all server state via React Query hooks; no `useEffect` for data fetching. |
| IV. Formularios | ✅ PASS | Both forms (Contact, PizzaParty Request) use React Hook Form + Zod. Validation logic lives in Zod schemas. |
| V. Simplicidad (YAGNI) | ✅ PASS | Carousel built from scratch (4 images, no complex library needed); no speculative abstractions; calculator state lifted minimally to page level only. |

**Constitution re-check post-design**: No violations found. Custom carousel avoids introducing Embla/Swiper. Calculator state lifted to page level is the minimum needed to share values with the form.

## Project Structure

### Documentation (this feature)

```text
specs/005-public-pages/
├── plan.md              # This file
├── research.md          # Phase 0 — decisions
├── data-model.md        # Phase 1 — TypeScript types
├── quickstart.md        # Phase 1 — setup + smoke test
├── contracts/
│   └── components.md    # Phase 1 — component prop contracts
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created here)
```

### Source Code Changes (within `frontend/`)

```text
frontend/
├── public/
│   └── assets/                         ← COPY from root /assets/ (food photos)
│       ├── chuletaconpapas.jpeg
│       ├── pizzapalmitos.jpeg
│       ├── pizzaparty.jpg
│       ├── pizzaparty2.jpeg
│       ├── pizzaparty3.jpeg
│       └── pizzaparty4.jpeg
└── src/
    ├── types/
    │   └── index.ts                    ← ADD: Offer, MenuCategory, MenuItem,
    │                                       WeeklyMenuDay, PizzaPartyConfig,
    │                                       PizzaPartyRequest, ContactFormData
    ├── hooks/
    │   ├── useCurrentSchedule.ts       ← EXISTS (no changes)
    │   ├── useMenu.ts                  ← NEW
    │   ├── useOffers.ts                ← NEW
    │   ├── usePizzaPartyConfig.ts      ← NEW
    │   └── useWeeklyMenu.ts            ← NEW
    ├── components/
    │   ├── ui/                         ← ADD via shadcn CLI:
    │   │   ├── accordion.tsx           ←   npx shadcn add accordion
    │   │   ├── badge.tsx               ←   npx shadcn add badge
    │   │   ├── tabs.tsx                ←   npx shadcn add tabs
    │   │   └── sonner.tsx              ←   npx shadcn add sonner
    │   └── Carousel.tsx                ← NEW: custom 4-image carousel
    └── pages/
        ├── HomePage.tsx                ← REPLACE stub with full implementation
        │   └── sections/
        │       ├── HeroSection.tsx
        │       ├── ScheduleSection.tsx
        │       ├── SpecialtiesSection.tsx
        │       ├── OffersSection.tsx
        │       └── PizzaPartyCTASection.tsx
        ├── MenuPage.tsx                ← REPLACE stub with full implementation
        ├── ViandasPage.tsx             ← REPLACE stub with full implementation
        ├── PizzaPartyPage.tsx          ← REPLACE stub with full implementation
        │   ├── PriceCalculator.tsx
        │   └── RequestForm.tsx
        └── ContactoPage.tsx            ← REPLACE stub with full implementation
```

**Structure Decision**: All changes are within the existing `frontend/` project. No new top-level directories, no new independent packages. Page-section components live co-located with their page (e.g., `pages/sections/` or inline) to avoid premature extraction into `components/`. Only truly reusable components (`Carousel.tsx`) go in `components/`.

## Complexity Tracking

No constitution violations requiring justification.

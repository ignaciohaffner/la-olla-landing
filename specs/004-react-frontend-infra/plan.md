# Implementation Plan: React Frontend Infrastructure

**Branch**: `004-react-frontend-infra` | **Date**: 2026-05-09 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/004-react-frontend-infra/spec.md`

## Summary

Scaffold the `frontend/` directory and implement all shared infrastructure consumed by every page: Vite + React 18 + TypeScript project setup, Tailwind CSS, shadcn/ui, React Query client, base API fetch function, auth hook with JWT decode, schedule hook, React Router v6 with a ProtectedRoute guard, and a Layout component (Navbar + Footer + floating WhatsApp button). Page-level content is out of scope; only placeholder shells are created for routes to compile.

## Technical Context

**Language/Version**: TypeScript 5 / React 18  
**Primary Dependencies**: Vite 5, React Router v6, TanStack Query v5, Tailwind CSS v3, shadcn/ui, Zod (for future forms; available via constitution)  
**Storage**: `localStorage` (JWT token under key `laolla_token`); no database access from frontend  
**Testing**: No test framework configured (consistent with project pattern)  
**Target Platform**: Web browser, mobile-first at 375px viewport width  
**Project Type**: SPA (single-page application)  
**Performance Goals**: Initial page render under 3s on 4G mobile; schedule data cached 5 minutes  
**Constraints**: No `sm:` Tailwind breakpoint; `min-h-[44px]` on all interactive targets; 16px base font; `any` type prohibited; `useEffect` prohibited for data fetching  
**Scale/Scope**: Single-restaurant public landing + admin panel; one authenticated admin user at a time

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Stack Fijo | ✅ PASS | Vite + React 18 + TypeScript + Tailwind + shadcn/ui + React Query — all explicitly listed in constitution §I |
| II. Mobile-First | ✅ PASS | 375px baseline; only `md:` and `lg:` breakpoints used; `min-h-[44px]` on all interactive targets; 16px base font |
| III. Código Tipado | ✅ PASS | TypeScript throughout; no `any`; all server state via React Query; no `useEffect` for fetching |
| IV. Formularios | ✅ N/A | No forms in this feature; login form uses React Hook Form + Zod in LoginPage spec |
| V. Simplicidad (YAGNI) | ✅ PASS | No speculative abstractions; page shells only; single `apiFetch` function handles both public and admin requests |

**Constitution re-check post-design**: No violations. The `apiFetch` path-prefix admin detection avoids a second function without adding complexity. `localStorage` is explicitly permitted by constitution §"Flujo de Desarrollo".

## Project Structure

### Documentation (this feature)

```text
specs/004-react-frontend-infra/
├── plan.md              # This file
├── research.md          # Phase 0 — key decisions
├── data-model.md        # Phase 1 — TypeScript interfaces
├── quickstart.md        # Phase 1 — setup and smoke test guide
├── contracts/
│   └── module-api.md    # Phase 1 — public hook/component signatures
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created here)
```

### Source Code (repository root)

```text
frontend/                               ← new top-level project (independent of backend/)
├── .env.example                        ← committed; VITE_API_URL placeholder
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── main.tsx                        ← QueryClientProvider + BrowserRouter entry
    ├── App.tsx                         ← Route definitions + ProtectedRoute usage
    ├── types/
    │   └── index.ts                    ← ScheduleDay, LoginRequest/Response, AuthState, etc.
    ├── lib/
    │   ├── api.ts                      ← apiFetch: base URL prefix + admin auth header + error throw
    │   └── queryClient.ts              ← QueryClient singleton (staleTime: 5 min)
    ├── hooks/
    │   ├── useAuth.ts                  ← login / logout / isAuthenticated (JWT exp decode)
    │   └── useCurrentSchedule.ts       ← useQuery(['schedule']) + isOpenNow derivation
    ├── components/
    │   ├── ProtectedRoute.tsx          ← isAuthenticated → Outlet or Navigate to /admin
    │   ├── layout/
    │   │   ├── Layout.tsx              ← Navbar + Outlet + Footer + WhatsAppButton
    │   │   ├── Navbar.tsx              ← logo, name, 5 nav links, mobile hamburger
    │   │   ├── Footer.tsx              ← address, phone, Facebook, Instagram, WhatsApp
    │   │   └── WhatsAppButton.tsx      ← fixed bottom-right, opens wa.me/543446410459
    │   └── ui/                         ← shadcn/ui generated components
    └── pages/
        ├── HomePage.tsx                ← placeholder shell
        ├── MenuPage.tsx                ← placeholder shell
        ├── ViandasPage.tsx             ← placeholder shell
        ├── PizzaPartyPage.tsx          ← placeholder shell
        ├── ContactoPage.tsx            ← placeholder shell
        └── admin/
            ├── LoginPage.tsx           ← placeholder shell (form content = separate spec)
            └── PanelPage.tsx           ← placeholder shell (content = separate spec)
```

**Structure Decision**: Option 2 (web application) — `frontend/` and `backend/` are independent top-level projects with separate `package.json` and `tsconfig.json`. No cross-directory imports. This matches constitution §"Restricciones de Stack y Estructura".

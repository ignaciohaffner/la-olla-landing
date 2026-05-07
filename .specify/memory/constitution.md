<!--
SYNC IMPACT REPORT
==================
Version change: N/A → 1.0.0 (initial ratification — all placeholders filled for the first time)

Principles defined:
  I.   Stack Fijo e Inamovible (new)
  II.  Mobile-First Obligatorio (new)
  III. Código Tipado y Limpio (new)
  IV.  Formularios y Validación Estándar (new)
  V.   Simplicidad (YAGNI) (new)

Sections added:
  - Core Principles (I–V)
  - Restricciones de Stack y Estructura
  - Flujo de Desarrollo
  - Governance

Templates reviewed and status:
  - .specify/templates/plan-template.md   ✅ Constitution Check uses dynamic reference — no update needed
  - .specify/templates/spec-template.md   ✅ No constitution-specific sections — no update needed
  - .specify/templates/tasks-template.md  ✅ Path conventions already cover frontend/backend layout — no update needed
  - .specify/templates/checklist-template.md ✅ No update needed

Deferred TODOs: None — all placeholders resolved.
-->

# Rotisería La Olla Constitution

## Core Principles

### I. Stack Fijo e Inamovible

The technology stack is decided and MUST NOT change without a formal constitution amendment.

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui + React Query (TanStack)
- **Backend**: Node.js + Express + TypeScript + Prisma ORM
- **Database**: PostgreSQL
- **Auth**: JWT with email/password — no Supabase, no third-party auth providers
- **Email**: Nodemailer
- **Image generation**: Sharp (server-side only)
- **Monorepo structure**: two independent top-level directories — `frontend/` and `backend/`

No new framework, ORM, auth provider, or build tool may be introduced without updating this document.
Any PR that imports Supabase, Next.js, or references the deleted prior codebase MUST be rejected.

### II. Mobile-First Obligatorio

All UI — public site and admin panel — MUST be designed at 375px first and scaled up.
The site reaches users primarily via Instagram on mobile; the admin panel is also used from mobile.

- Breakpoints in use: `mobile` (default), `md:` (768px+), `lg:` (1024px+). The `sm:` prefix MUST NOT be used.
- Buttons and interactive targets MUST have a minimum height of 44px.
- All numeric inputs MUST include `inputMode="numeric"` to trigger the numeric keyboard on mobile.
- Base font size MUST be at least 16px to prevent iOS automatic zoom on input focus.
- Every component is reviewed at 375px before any wider breakpoint is considered.

### III. Código Tipado y Limpio

- TypeScript `any` type is PROHIBITED. Use `unknown`, narrowed unions, or proper interfaces.
- `useEffect` MUST NOT be used for data fetching. All server state MUST go through React Query.
- Comments are written only when the WHY is non-obvious (a hidden constraint, a subtle invariant,
  a workaround for a specific external bug). Comments explaining WHAT code does are prohibited.
- No backwards-compatibility shims, unused `_` prefixes, or re-exports for deleted code.
- Dead code MUST be deleted, not commented out.

### IV. Formularios y Validación Estándar

- All forms MUST use React Hook Form together with Zod for schema validation.
- Validation logic MUST live in a Zod schema, not inside component event handlers.
- Custom form state management (manual `useState` per field) is prohibited when a form library covers the case.
- Server-side validation MUST also be performed via Zod schemas shared or mirrored in `backend/`.

### V. Simplicidad (YAGNI)

- Implement only what the current feature spec requires. No speculative abstractions.
- Three similar lines of code are preferable to a premature abstraction.
- No feature flags, no backwards-compat layers, no half-finished implementations.
- No error handling for scenarios that cannot happen. Trust internal code and framework guarantees.
- Validate only at system boundaries: user input and external API responses.

## Restricciones de Stack y Estructura

- `tailwind.config.ts` MUST exist only inside `frontend/`. A root-level Tailwind config is prohibited.
- `shadcn/ui` MUST be installed using its CLI run from inside `frontend/`. Components live in
  `frontend/src/components/ui/`.
- `frontend/` and `backend/` are independent projects: they have separate `package.json`,
  `tsconfig.json`, and dependency trees. Cross-directory imports are prohibited.
- Environment variables for secrets (DB URL, JWT secret) live in `backend/.env` only.
  Frontend `.env` files MUST contain only public, non-sensitive build-time variables.
- Prisma schema and migrations live in `backend/prisma/`. The frontend has no ORM dependency.

## Flujo de Desarrollo

- Every spec and plan MUST confirm alignment with this constitution before implementation begins
  (the "Constitution Check" gate in plan.md).
- New routes or endpoints MUST be defined in a contract document before implementation.
- Database schema changes MUST go through a Prisma migration — no manual SQL on production.
- JWT tokens are issued and validated exclusively in `backend/`. The frontend stores the token
  in memory or `localStorage`; it MUST NOT store it in a cookie unless explicitly specced.
- Image generation (e.g., price-list images) runs server-side via Sharp in `backend/`.
  The frontend requests a URL, it does not generate images client-side.

## Governance

This constitution supersedes all other coding conventions, READMEs, and prior codebase patterns.

**Amendment procedure**:
1. Propose the change with a rationale and migration plan in a PR description.
2. Update this file with the new content and increment the version (see versioning policy below).
3. Propagate changes to affected templates and update the Sync Impact Report comment above.

**Versioning policy**:
- MAJOR: backward-incompatible principle removal or redefinition (e.g., changing the auth stack).
- MINOR: new principle or section added, or materially expanded guidance.
- PATCH: clarifications, wording corrections, non-semantic refinements.

**Compliance review**:
- Every feature plan MUST include a Constitution Check section verifying all five principles.
- PRs introducing violations MUST document the violation in the Complexity Tracking table of plan.md
  with a justification — or the violation MUST be corrected before merge.

**Version**: 1.0.0 | **Ratified**: 2026-05-07 | **Last Amended**: 2026-05-07

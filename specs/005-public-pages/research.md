# Research: 5 Public Pages — La Olla Website

**Branch**: `005-public-pages` | **Date**: 2026-05-09

## Decision 1: Image Asset Strategy

**Decision**: Copy the 6 food-photo images from the root `/assets/` directory into `frontend/public/assets/`. Reference them in components via the URL path `/assets/<filename>` (e.g., `/assets/pizzaparty.jpg`).

**Rationale**: Vite's static file server only serves files from `public/`. Importing root-level files as modules would require configuring `vite.config.ts` with an extra `assetsInclude` or symlinking, which adds complexity. Copying to `frontend/public/assets/` keeps the solution simple and predictable. Files in `public/` are served as-is with their original filenames, which is exactly what hero/banner images need (no cache-busting hash required — they change rarely and the browser cache is acceptable).

**Alternatives considered**:
- Import images as ES modules from `../../assets/*.jpg` — rejected because the root `/assets/` is outside the Vite project root (`frontend/`), requiring `vite.config.ts` changes and still producing hashed filenames that make template strings harder to write.
- Symlink `frontend/public/assets` → `../assets` — rejected because symlinks break on Windows and in Docker builds; copying is more portable.

---

## Decision 2: Carousel Implementation

**Decision**: Build a custom `Carousel.tsx` component using React state (`currentIndex`) and `useEffect` for the auto-advance timer. No external carousel library.

**Rationale**: The spec requires exactly 4 images, auto-advance every 5s, prev/next buttons, and dot indicators. This is 40–60 lines of code and has no accessibility or complexity needs beyond what plain React provides. Adding Embla Carousel (~10 KB gzipped) or Swiper (~25 KB) would violate the YAGNI principle (Constitution §V).

**Alternatives considered**:
- `shadcn/ui` Carousel (built on Embla) — rejected as an unnecessary dependency for a 4-image use case.
- CSS-only carousel with scroll-snap — rejected because auto-advance and dot sync require JavaScript state regardless.

---

## Decision 3: Toast Notifications

**Decision**: Use `sonner` installed via `npx shadcn add sonner`. The `<Toaster />` component is added once to `App.tsx` (or `Layout.tsx`); individual toasts are triggered with `toast.success(...)` and `toast.error(...)`.

**Rationale**: Sonner is the canonical toast solution for shadcn/ui v4 projects and is already recommended in shadcn docs. It requires zero additional dependencies (sonner is the dependency), produces accessible toasts out of the box, and is the only toast pattern consistent with the rest of the shadcn ecosystem in this project.

**Alternatives considered**:
- shadcn `useToast` hook (old pattern) — rejected because the project uses shadcn v4 / base-nova style, which has migrated to sonner.
- `react-hot-toast` — rejected as a non-shadcn dependency without benefit over sonner.

---

## Decision 4: Calculator State Sharing Between PriceCalculator and RequestForm

**Decision**: Lift `guests`, `extraHours`, and `extraMozzos` into `PizzaPartyPage` state as a single `CalculatorValues` object. Pass it as props to both `PriceCalculator` (which can update via a setter callback) and `RequestForm` (which reads the values to pre-fill hidden/default fields).

**Rationale**: The simplest solution that satisfies FR-020 ("pre-filled from calculator"). No context, no Zustand, no URL params needed — the two components are siblings rendered on the same page. Three props per component is within YAGNI bounds.

**Alternatives considered**:
- React Context — rejected; overkill for two sibling components on a single page.
- URL search params — rejected; awkward UX (back/forward changes values) and leaks internal calculator state into the URL.

---

## Decision 5: shadcn Components to Install

The following components are required and must be installed via the shadcn CLI from inside `frontend/`:

| Component | Used by | Install command |
|-----------|---------|-----------------|
| `accordion` | ViandasPage (weekly menu) | `npx shadcn add accordion` |
| `badge` | OffersSection (offer badge), possibly schedule | `npx shadcn add badge` |
| `tabs` | MenuPage (category tabs) | `npx shadcn add tabs` |
| `sonner` | All forms (success/error toasts) | `npx shadcn add sonner` |

No other shadcn components are required. Buttons and inputs can be styled with Tailwind + shadcn base styles or the existing design system.

---

## Decision 6: WhatsApp Phone Number

**Decision**: Use `543446410459` as the WhatsApp number (already established in `WhatsAppButton.tsx`). The Viandas page fallback link opens `https://wa.me/543446410459`.

**Rationale**: The number is already committed in the existing codebase.

---

## Decision 7: Day-of-Week Display in Schedule

**Decision**: Map `dayOfWeek` integers (0 = Sunday ... 6 = Saturday) to Spanish day names using a local constant array: `['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']`.

**Rationale**: `Intl.DateTimeFormat` would work but adds locale complexity. A simple array lookup is zero-dependency, always correct, and immediately readable.

---

## Decision 8: Time Display in Schedule

**Decision**: Display `openTime` and `closeTime` as-is from the API (strings in "HH:MM" format). No formatting transformation needed.

**Rationale**: The backend already returns times in human-readable "HH:MM" format per the feature 002 API contract. Parsing and re-formatting would add complexity without benefit.

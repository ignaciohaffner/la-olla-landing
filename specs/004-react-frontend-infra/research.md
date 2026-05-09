# Research: React Frontend Infrastructure

**Branch**: `004-react-frontend-infra` | **Date**: 2026-05-09

## Decision 1: Frontend Scaffolding Tool

**Decision**: `npm create vite@latest frontend -- --template react-ts`

**Rationale**: Constitution §I mandates Vite as the build tool. The `react-ts` template gives TypeScript + React 18 out of the box with no extra setup. Minimal config surface.

**Alternatives considered**: Create React App (deprecated, removed from official docs), Next.js (explicitly prohibited by constitution §I).

---

## Decision 2: React Router Version and ProtectedRoute Pattern

**Decision**: React Router v6 with `<Navigate>` for redirect inside a `ProtectedRoute` wrapper component.

**Rationale**: v6 is the stable current major; v7 (Remix-based) is a different paradigm. The `ProtectedRoute` component checks `isAuthenticated` synchronously (localStorage read + JWT exp check); if false it returns `<Navigate to="/admin" replace />`. The `replace` flag avoids a redirect entry in browser history.

**Pattern**:
```tsx
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin" replace />
}
```

**Alternatives considered**: Loader-based guards (v6.4+ data API) — overkill for a single protected route with a sync auth check.

---

## Decision 3: JWT Decode Without External Library

**Decision**: Split JWT on `.`, base64url-decode the payload segment using `atob()` after normalizing padding, then parse with `JSON.parse()`. Read the `exp` claim (Unix seconds) and compare to `Date.now() / 1000`.

**Rationale**: Constitution §I prohibits adding auth providers or JWT libraries not already in the stack. The backend already handles signing (jsonwebtoken). Frontend only needs to read `exp` — one-liner decode is sufficient and avoids a dependency.

**Implementation**:
```ts
function isTokenValid(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}
```

**Alternatives considered**: `jwt-decode` npm package — rejected per YAGNI (constitution §V); the one-liner covers the only required use case.

---

## Decision 4: API Client Architecture

**Decision**: Single `apiFetch` function in `lib/api.ts` that accepts `(path: string, init?: RequestInit)`. Admin route detection: if `path` starts with `/api/admin/`, the function reads `localStorage` for the token and injects the `Authorization: Bearer` header. Error handling: if `!response.ok`, read response body as JSON (falling back to `{ message: response.statusText }`) and throw an `Error` with that message.

**Rationale**: A single function keeps the surface area minimal (constitution §V). Admin detection by path prefix avoids a separate `adminFetch` function and keeps call sites uniform.

**VITE_API_URL**: Prefixed via `import.meta.env.VITE_API_URL` which Vite replaces at build time. In dev, set to `http://localhost:3000` via `frontend/.env.local`. The env var MUST be present; if missing, requests go to relative path (same origin — acceptable for same-host deploys).

**Alternatives considered**: Axios interceptors — rejected (adds a dependency for no gain over native fetch + constitution §V).

---

## Decision 5: React Query v5 Setup and staleTime

**Decision**: `QueryClient` with global `defaultOptions.queries.staleTime = 5 * 60 * 1000` (5 minutes). `QueryClientProvider` wraps the entire app in `main.tsx`.

**Rationale**: Constitution §III mandates React Query for all server state. staleTime of 5 minutes matches spec FR-011. Global default avoids per-query repetition (constitution §V).

**Query key conventions**:
- `['schedule']` — schedule data (public)
- `['menu']` — menu items (public)
- `['admin', 'menu']` — admin menu (protected)
- Consistent array format enables targeted invalidation.

**Alternatives considered**: SWR — not in constitution stack. TanStack Query v4 — v5 is current; use latest per general principle.

---

## Decision 6: Tailwind and shadcn/ui Setup

**Decision**: `tailwind.config.ts` lives inside `frontend/` (constitution §I). shadcn/ui initialized via `npx shadcn@latest init` from within `frontend/`. Components land in `frontend/src/components/ui/`.

**Color conventions from spec**:
- Header/Footer background: `bg-green-800`
- CTA buttons: `bg-red-600`
- Nav link hover: `hover:text-yellow-400`
- Base font: 16px minimum (prevents iOS zoom on input focus — constitution §II)

**Breakpoints**: `md:` (768px) and `lg:` (1024px) only. No `sm:` prefix per constitution §II.

**Alternatives considered**: CSS Modules — rejected (not in constitution stack). Styled-components — rejected (constitution §I).

---

## Decision 7: localStorage Key for JWT

**Decision**: Store the JWT under the key `laolla_token` in `localStorage`.

**Rationale**: A namespaced key avoids collision if the browser runs other local apps on the same origin during development. Short and identifiable.

**Constitution alignment**: Constitution §"Flujo de Desarrollo" allows `localStorage` for the frontend token explicitly.

---

## Decision 8: Hamburger Menu State

**Decision**: `isMenuOpen: boolean` state in `Navbar` component. Each nav link `onClick` sets it to `false`. `useEffect` listening to `location.pathname` (from `useLocation()`) closes the menu on navigation. No animation library — `transition-all duration-200` Tailwind class for show/hide with `max-height` trick.

**Rationale**: Spec says "no complex animation, only show/hide with transition-all". useEffect on location ensures the menu closes even on browser back/forward.

**Alternatives considered**: Context-based open state — overkill for a single Navbar; local state is sufficient.

---

## Decision 9: Page Shells in Scope

**Decision**: Create minimal placeholder page components for all 7 routes (5 public + 2 admin). Each placeholder renders a `<div>` with the page name. Content is out of scope per spec Assumptions.

**Rationale**: App.tsx routing setup requires importable page components to compile and be testable end-to-end. Shells let the routing layer be fully verified without waiting for content specs.

**Alternatives considered**: Lazy-loaded pages with `React.lazy` — appropriate for final build, but the spec does not require code splitting at this phase. Can be added in page-level specs.

# Module Contract: React Frontend Infrastructure

**Version**: 1.0.0  
**Feature**: 004-react-frontend-infra  
**Type**: Frontend module public API surface

These contracts define what each infrastructure module exposes to the rest of the frontend codebase. Page-level components and future features import from these modules; the signatures below are binding.

---

## `lib/api.ts`

### `apiFetch`

```ts
function apiFetch<T = unknown>(
  path: string,
  init?: RequestInit
): Promise<T>
```

**Behavior**:
- Prepends `import.meta.env.VITE_API_URL` to `path` before calling `fetch`
- If `path` starts with `/api/admin/`, reads `localStorage.getItem('laolla_token')` and adds `Authorization: Bearer <token>` to request headers
- If `response.ok === false`, reads response body as JSON `{ message: string }` and throws `new Error(message)`; if JSON parse fails, throws `new Error(response.statusText)`
- Returns the parsed JSON body as `T` on success

**Usage**:
```ts
// Public endpoint
const menu = await apiFetch<MenuResponse[]>('/api/menu')

// Admin endpoint (token injected automatically)
const items = await apiFetch<AdminMenuItem[]>('/api/admin/menu')
```

---

## `lib/queryClient.ts`

### `queryClient`

```ts
const queryClient: QueryClient
```

Pre-configured `QueryClient` instance with `defaultOptions.queries.staleTime = 300_000` (5 minutes). Exported as a singleton; imported by `main.tsx` for `QueryClientProvider`.

---

## `hooks/useAuth.ts`

### `useAuth`

```ts
function useAuth(): AuthState

interface AuthState {
  isAuthenticated: boolean
  login:  (email: string, password: string) => Promise<void>
  logout: () => void
}
```

**`isAuthenticated`**: `true` if `localStorage.getItem('laolla_token')` is a non-null string whose decoded `exp` claim is in the future. Recomputed on each render (synchronous, no async).

**`login(email, password)`**:
- POSTs `{ email, password }` to `/api/admin/login` via `apiFetch`
- On success: stores returned `token` in `localStorage` under `laolla_token`, then navigates to `/admin/panel` using React Router's `useNavigate`
- On failure: throws the error (callers handle display)

**`logout()`**:
- Removes `laolla_token` from `localStorage`
- Navigates to `/admin` using `useNavigate`
- Does not call any API endpoint

---

## `hooks/useCurrentSchedule.ts`

### `useCurrentSchedule`

```ts
function useCurrentSchedule(): CurrentScheduleState

interface CurrentScheduleState {
  schedule:  ScheduleDay[] | undefined
  isOpenNow: boolean
  isLoading: boolean
  error:     Error | null
}
```

**`isOpenNow`**: Derived from the first element in `schedule` where `isOpenNow === true`. If `schedule` is undefined or loading, returns `false`.

**Query key**: `['schedule']`  
**Endpoint**: `GET /api/schedule`  
**staleTime**: global default (5 min)

---

## `components/ProtectedRoute.tsx`

### `ProtectedRoute`

```tsx
function ProtectedRoute(): JSX.Element
```

Used as a wrapper route element in `App.tsx`. Internally calls `useAuth().isAuthenticated`:
- If `true`: renders `<Outlet />` (child routes)
- If `false`: returns `<Navigate to="/admin" replace />`

**Usage in router**:
```tsx
<Route element={<ProtectedRoute />}>
  <Route path="/admin/panel" element={<PanelPage />} />
</Route>
```

---

## `components/layout/Layout.tsx`

### `Layout`

```tsx
function Layout(): JSX.Element
```

Renders `<Navbar />`, `<main>{children}</main>` via `<Outlet />`, `<Footer />`, and `<WhatsAppButton />`.

Used in `App.tsx` wrapping all public routes (`/`, `/menu`, `/viandas`, `/pizza-party`, `/contacto`). **NOT** used for `/admin` or `/admin/panel`.

---

## `components/layout/Navbar.tsx`

### `Navbar`

```tsx
function Navbar(): JSX.Element
```

**Desktop** (md:+): Horizontal logo + name + five nav links inline.  
**Mobile** (default): Logo + name + hamburger button. When open: full-width dropdown below the bar with the same five links.  
Closes on navigation (useEffect on `location.pathname`).  
All interactive elements meet `min-h-[44px]`.

Nav links:
| Label       | Path          |
|-------------|---------------|
| Inicio      | `/`           |
| Menú        | `/menu`       |
| Viandas     | `/viandas`    |
| Pizza Party | `/pizza-party`|
| Contacto    | `/contacto`   |

---

## `components/layout/Footer.tsx`

### `Footer`

```tsx
function Footer(): JSX.Element
```

Renders: address, phone number, Facebook link, Instagram link, WhatsApp link.  
Background: `bg-green-800`, text: `text-white`.  
All links open in a new tab (`target="_blank" rel="noopener noreferrer"`).

---

## `components/layout/WhatsAppButton.tsx`

### `WhatsAppButton`

```tsx
function WhatsAppButton(): JSX.Element
```

Floating `<a>` element anchored `fixed bottom-4 right-4` (or `bottom-6 right-6` on md:+).  
Links to `https://wa.me/543446410459`.  
Minimum size `min-h-[44px] min-w-[44px]` to satisfy touch target requirement.  
Opens in new tab.

---

## Route Map (`App.tsx`)

| Path            | Component       | Layout | Auth required |
|-----------------|-----------------|--------|---------------|
| `/`             | `HomePage`      | Yes    | No            |
| `/menu`         | `MenuPage`      | Yes    | No            |
| `/viandas`      | `ViandasPage`   | Yes    | No            |
| `/pizza-party`  | `PizzaPartyPage`| Yes    | No            |
| `/contacto`     | `ContactoPage`  | Yes    | No            |
| `/admin`        | `LoginPage`     | No     | No            |
| `/admin/panel`  | `PanelPage`     | No     | Yes           |

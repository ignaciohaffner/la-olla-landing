# Data Model: React Frontend Infrastructure

**Branch**: `004-react-frontend-infra` | **Date**: 2026-05-09

All types live in `frontend/src/types/` and are re-exported from an index barrel.

---

## API Response Types

### `ScheduleDay`

Shape returned by `GET /api/schedule` (one element per day).

```ts
interface ScheduleDay {
  dayOfWeek:   number          // 0 = Sunday … 6 = Saturday
  openTime:    string          // "HH:MM" 24h
  closeTime:   string          // "HH:MM" 24h
  isOpen:      boolean         // whether the restaurant operates this day
  specialNote: string | null
  isOpenNow:   boolean         // computed by server
}

type ScheduleResponse = ScheduleDay[]
```

### `LoginRequest` / `LoginResponse`

Used by `POST /api/admin/login`.

```ts
interface LoginRequest {
  email:    string
  password: string
}

interface LoginResponse {
  token: string   // JWT; HS256; contains `exp` (Unix seconds)
}
```

### `ApiError`

Shape of error body returned by the backend on non-2xx responses.

```ts
interface ApiError {
  message: string
}
```

---

## Internal / Client-side Types

### `JWTPayload`

Decoded from the JWT stored in `localStorage`. Only `exp` is required; additional claims are allowed but not read.

```ts
interface JWTPayload {
  exp: number            // Unix timestamp in seconds
  [key: string]: unknown // permit other claims without typing them
}
```

### `AuthState`

Returned by `useAuth` hook.

```ts
interface AuthState {
  isAuthenticated: boolean
  login:  (email: string, password: string) => Promise<void>
  logout: () => void
}
```

### `CurrentScheduleState`

Returned by `useCurrentSchedule` hook.

```ts
interface CurrentScheduleState {
  schedule:    ScheduleResponse | undefined
  isOpenNow:   boolean
  isLoading:   boolean
  error:       Error | null
}
```

---

## localStorage Schema

| Key            | Value          | Written by       | Read by                    |
|----------------|----------------|------------------|----------------------------|
| `laolla_token` | JWT string     | `useAuth.login`  | `useAuth`, `lib/api.ts`    |

Token is removed by `useAuth.logout`. No other keys are used by this feature.

---

## React Query Key Registry

| Query Key            | Endpoint              | staleTime  |
|----------------------|-----------------------|------------|
| `['schedule']`       | `GET /api/schedule`   | 5 min (global default) |

Admin queries are defined in their respective page specs. All follow the convention `['admin', '<resource>']`.

---

## Environment Variables

Declared in `frontend/.env.example` (committed). Actual values in `frontend/.env.local` (gitignored).

| Variable        | Required | Example                  | Purpose                             |
|-----------------|----------|--------------------------|-------------------------------------|
| `VITE_API_URL`  | Yes      | `http://localhost:3000`  | Base URL prepended to all API calls |

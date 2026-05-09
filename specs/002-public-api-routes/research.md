# Research: Public API Routes

**Feature**: 002-public-api-routes  
**Date**: 2026-05-07

## Decision 1: Express setup — app.ts vs index.ts split

**Decision**: Separate `app.ts` (Express app factory, route registration, middleware) from `index.ts` (server listen). `app.ts` exports the Express app; `index.ts` calls `app.listen()`.

**Rationale**: Standard Express pattern that makes the app testable without starting a real HTTP server. Consistent with constitution §V (YAGNI) — the split costs nothing and avoids a future refactor if tests are added.

**Alternatives considered**: Single `server.ts` file — rejected because it conflates app construction with server startup, making future unit tests harder without a refactor.

---

## Decision 2: Route organization — one file per route vs router index

**Decision**: One file per route group in `src/routes/`. No shared router index — each file exports a single Express `Router` and is registered in `app.ts`.

**Rationale**: Keeps each route self-contained. With 9 routes, a barrel index adds no value. Easy to locate and edit any route without cross-file side effects.

**Alternatives considered**: Single `routes/index.ts` barrel — rejected as unnecessary indirection per constitution §V.

---

## Decision 3: Zod validation placement

**Decision**: Zod schemas defined inline at the top of each POST route file. No shared schemas directory for this feature.

**Rationale**: There are exactly 2 POST endpoints. Sharing schemas with the frontend is not needed (monorepo has independent packages). Keeping schemas inline avoids premature abstraction per constitution §V.

**Alternatives considered**: Shared `src/schemas/` directory — viable if schemas grow or are shared with frontend, but out of scope for this feature.

---

## Decision 4: `isOpenNow` timezone calculation

**Decision**: Use JavaScript `Date` with UTC arithmetic only (no external timezone library). Argentina is UTC-3 with no DST. Subtract 3 hours from UTC to get Argentina time, then compare against `openTime`/`closeTime` strings.

**Rationale**: A fixed UTC-3 offset requires no library. `date-fns-tz` or `luxon` would add a dependency for a trivial calculation. Per spec assumption: no DST adjustment needed.

**Implementation detail**:
```
argentinaDate = new Date(utcNow.getTime() - 3 * 60 * 60 * 1000)
currentDay    = argentinaDate.getUTCDay()          // 0=Sun … 6=Sat
currentHH:MM  = HH:MM string from argentinaDate.getUTCHours/Minutes
isOpenNow     = schedule.isOpen && currentHH:MM >= openTime && currentHH:MM < closeTime
```

**Alternatives considered**: `date-fns-tz` / `luxon` — both handle DST correctly but are unnecessary for a fixed offset.

---

## Decision 5: `weekStart` calculation for weekly menu

**Decision**: Compute `weekStart` (Monday 00:00 UTC) server-side using UTC arithmetic. Find the most recent Monday: subtract `(today.getUTCDay() + 6) % 7` days from today, then zero out hours/minutes/seconds/ms.

**Rationale**: Consistent with spec FR-008. Server-side calculation ensures all clients see the same week regardless of their timezone.

**Alternatives considered**: Receiving weekStart from the client — rejected (spec explicitly says server calculates it).

---

## Decision 6: Nodemailer transport configuration

**Decision**: SMTP credentials read from env vars (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`). Transport created once in `src/lib/mailer.ts` and exported as a singleton. If `OWNER_EMAIL` is not set, `sendMail` logs an error and resolves without throwing.

**Rationale**: Separates transport configuration from route logic. Fails gracefully per spec edge case: missing `OWNER_EMAIL` must not fail the request.

**Alternatives considered**: Direct `nodemailer.createTransport` inside each route — rejected because it duplicates config and makes transport configuration harder to change.

---

## Decision 7: Error handling — global middleware vs try/catch per route

**Decision**: Each route handler wraps its body in a `try/catch` that calls `next(err)`. A single global error middleware in `src/middleware/errorHandler.ts` classifies errors (Zod → 400, everything else → 500) and formats responses.

**Rationale**: Centralized error formatting ensures consistent response shapes across all routes. Avoids duplicating `if (err instanceof ZodError)` in every handler per constitution §V.

**Alternatives considered**: `express-async-errors` package — would remove boilerplate, but adds a dependency for a straightforward pattern that can be written in < 20 lines.

---

## Decision 8: `totalPrice` formula for pizza party

**Decision**: `totalPrice = guests × pricePerPerson + extraHours × extraHourPrice + extraMozzos × mozzoPrice`. `minimumGuests` is informational (stored in config); the server does not reject requests below minimum (validation is left to the frontend per spec assumption).

**Rationale**: Formula is fully specified in spec Key Entities. No ambiguity. Server fetches fresh config from DB on each request — no risk of stale cached pricing.

**Alternatives considered**: Caching config in memory — rejected; pizza party requests are low frequency and stale pricing would be a business error.

---

## Resolved NEEDS CLARIFICATION items

None — spec had no unresolved clarifications.

# Research: Admin API Routes

**Feature**: 003-admin-api-routes
**Date**: 2026-05-09

## Decision 1: JWT library — `jsonwebtoken` vs. `jose`

**Decision**: Use `jsonwebtoken` (npm package `jsonwebtoken` + `@types/jsonwebtoken`).

**Rationale**: `jsonwebtoken` is the de facto standard for JWT in Node.js. `bcrypt` is already
installed in the project (same ecosystem, synchronous+async API). `jose` is a WebCrypto-based
alternative better suited for edge runtimes — not needed for a traditional Express/Node.js server.
`jsonwebtoken` signs with `HS256` by default and verifies in one call (`jwt.verify`), which is
sufficient for a single-server, single-admin setup.

**Alternatives considered**: `jose` — more modern but adds cognitive overhead with async keygen
and adds no value for this use case.

---

## Decision 2: Admin route organization

**Decision**: Admin routes live in `src/routes/admin/` subdirectory. Each resource gets its own
file (e.g., `admin/menu.ts`, `admin/categories.ts`, etc.). A barrel file `src/routes/admin/index.ts`
exports a single `adminRouter` that prefixes all subroutes under `/` and is mounted at `/api/admin`
in `app.ts`.

**Rationale**: Keeps admin routes physically separated from public routes. The barrel avoids
registering every admin subroute individually in `app.ts`. With 8 resource groups, a barrel is
worth the indirection (unlike feature 002 where 9 individual routes were simpler).

**Alternatives considered**: Flat `src/routes/` with `admin-menu.ts`, `admin-categories.ts`, etc.
— naming convention instead of directory. Rejected: more files at the same level makes navigation
harder as the project grows.

---

## Decision 3: Auth middleware placement

**Decision**: Single `src/middleware/auth.ts` that reads the `Authorization: Bearer <token>` header,
verifies the JWT with `JWT_SECRET`, and attaches `req.admin = { adminId, email }` to the request.
Returns 401 if token is missing, malformed, or expired. Applied as middleware to `adminRouter`
(all admin routes except login).

**Rationale**: Centralizing auth in one middleware avoids repeating JWT verification in every
handler. Applying it at the router level (not per-route) ensures no admin route can accidentally
be left unprotected. Login is registered on `app.ts` before the auth middleware is applied.

**Alternatives considered**: Per-route `auth` middleware parameter — more granular but error-prone
(easy to forget one route).

---

## Decision 4: Login endpoint registration

**Decision**: `POST /api/admin/login` is registered directly in `app.ts` (or as an unprotected
route before the auth middleware in `adminRouter`). The auth middleware is applied to the rest of
the admin router.

**Implementation pattern**:
```
app.post('/api/admin/login', loginController)
app.use('/api/admin', authMiddleware, adminRouter)
```

**Rationale**: This is the simplest Express pattern to have one unprotected route under a
protected prefix. No special casing needed inside the router.

**Alternatives considered**: Putting login inside `adminRouter` and excluding it from auth
middleware via `unless()` — adds a dependency (`express-unless`) for a trivial case.

---

## Decision 5: Bulk price update strategy

**Decision**: `PATCH /api/admin/menu/prices` runs `Promise.all` with one `prisma.menuItem.update()`
per item in the array. If an `id` doesn't exist, Prisma throws `P2025` (record not found). The
handler catches this and returns 404 with the failing id.

**Rationale**: Per spec: "Usa Promise.all." Prisma does not support bulk partial update in a
single query without raw SQL. `Promise.all` is the clean approach. Failing fast on unknown ids
is safer than silently ignoring them.

**Alternatives considered**: `prisma.$transaction([...])` — would wrap all updates in a DB
transaction (all-or-none). Simpler semantics for error handling but spec doesn't require atomicity.
`Promise.all` is sufficient and matches the spec intent.

---

## Decision 6: Weekly menu PUT — upsert vs. delete+insert

**Decision**: Use `Promise.all` of `prisma.weeklyMenuDay.upsert()` calls, keyed by
`[weekStart, dayOfWeek]` (the unique constraint already exists in the schema). `weekStart` is
computed server-side as the most recent Monday at 00:00 UTC (same logic as the public GET endpoint).

**Rationale**: Upsert avoids a race condition that could arise from delete+insert. The spec
explicitly says "upsert por [weekStart, dayOfWeek]". The unique compound index in the schema
(`@@unique([weekStart, dayOfWeek])`) makes this safe.

**Alternatives considered**: `deleteMany({ weekStart }) + createMany()` — simpler conceptually
but not atomic in Prisma without a transaction; also the spec explicitly specifies upsert.

---

## Decision 7: Schedule PATCH — upsert strategy

**Decision**: `PATCH /api/admin/schedule` accepts an array of all 7 days and runs
`Promise.all` of `prisma.schedule.upsert()` calls keyed by `dayOfWeek` (PK).

**Rationale**: `Schedule.dayOfWeek` is the `@id` field, making upsert trivial. Per spec: "Usa
upsert por dayOfWeek."

**Alternatives considered**: A single `prisma.$transaction` with all 7 upserts — functionally
equivalent, marginally safer (all-or-none), but adds verbosity without material benefit for
a 7-row table. `Promise.all` is spec-compliant and sufficient.

---

## Decision 8: Sharp SVG → PNG pipeline

**Decision**: Build the price list as an SVG string in memory (using template literals), embed
the logo as a base64 data URI inside the SVG `<image>` tag, then convert with
`sharp(Buffer.from(svgString)).png().toBuffer()`. Response headers:
`Content-Type: image/png`, `Content-Disposition: attachment; filename="price-list.png"`.

**Rationale**: Sharp's SVG input is well-documented and handles embedded base64 images correctly.
Building SVG programmatically (no SVG library needed) keeps the dependency surface small per
constitution §V. The logo file is read with `fs.readFileSync` once at module load time and cached
as base64.

**Logo path**: `backend/src/assets/logo.png` (or equivalent static asset). If the file doesn't
exist at startup, the route logs a warning and proceeds without a logo (graceful degradation).

**Alternatives considered**: `node-canvas` / `puppeteer` — much heavier for a simple price list.
`svg2img` — an additional dependency for something Sharp already handles.

---

## Decision 9: Repository pattern — reuse vs. extend

**Decision**: Admin routes reuse existing repositories (`menu.repository.ts`,
`category.repository.ts`, etc.) and add admin-specific methods to each file where needed
(e.g., `getAllMenuItems` that includes `available=false`, `bulkUpdatePrices`).

**Rationale**: Constitution §V (YAGNI) — no parallel repository structure. The existing
repositories are thin wrappers around Prisma; adding methods is trivial and keeps the
codebase cohesive.

**Alternatives considered**: Separate `src/repositories/admin/` — premature separation for
a single-admin system with no conflicting access patterns.

---

## Resolved NEEDS CLARIFICATION items

None — spec had no unresolved clarifications.

# Research: Database Schema & Seed

**Branch**: `001-database-schema` | **Date**: 2026-05-07

## Decision Log

### 1. Prisma single-row config table (PizzaPartyConfig)

**Decision**: Use `@id @default(1)` with a hardcoded `id = 1`. The application layer always
upserts on `where: { id: 1 }`.

**Rationale**: Simpler than adding a `@unique` singleton sentinel column. Idiomatic for
"settings" tables in Prisma. No risk of multiple rows because the schema constraint enforces
a single PK.

**Alternatives considered**:
- Separate `settings` key/value table: rejected — loses type safety.
- Check constraint (only one row allowed): not natively supported in Prisma without raw SQL.

---

### 2. `PizzaPartyRequest.status` — Prisma enum vs plain String

**Decision**: Prisma native `enum PizzaPartyStatus { pending confirmed rejected }`.

**Rationale**: Generates a PostgreSQL `ENUM` type + TypeScript union type. Zero runtime cost,
compile-time safety, no application-level guards needed. Fits Principle III (no `any` types).

**Alternatives considered**:
- `String` with app-level validation: rejected — loses DB-level constraint and TypeScript enum type.

---

### 3. `Schedule` primary key strategy

**Decision**: `dayOfWeek Int @id` — the day-of-week integer (0–6) is itself the PK.

**Rationale**: Removes a redundant surrogate id. There are exactly 7 rows and they're always
looked up by day. Prisma supports non-autoincrement `@id` fields cleanly.

**Alternatives considered**:
- `@id @default(autoincrement())` + `@unique` on `dayOfWeek`: adds unnecessary indirection.

---

### 4. `WeeklyMenuDay.dishes` — PostgreSQL native array

**Decision**: `String[]` in Prisma schema (no `@db.Text[]` annotation needed; Prisma maps
`String[]` to `text[]` automatically for PostgreSQL).

**Rationale**: Native PostgreSQL array avoids a join table for a simple ordered list of
dish name strings. No querying on individual dish items is required.

**Alternatives considered**:
- Separate `Dish` model with FK: over-engineered for a list of display strings.
- JSON string field: loses array semantics and type safety.

---

### 5. bcrypt rounds for admin password hash

**Decision**: 10 rounds (Prisma default; industry standard for non-PCI workloads).

**Rationale**: ~100ms per hash on a modern CPU — acceptable for a single-admin login. Does
not require tuning for this business scale.

---

### 6. Seed idempotency strategy

**Decision**: Use Prisma `upsert` with `where` on natural unique keys (`email` for Admin,
`slug` for Category, `name` for MenuItem within category, `dayOfWeek` for Schedule,
`id` for PizzaPartyConfig).

**Rationale**: Running `prisma db seed` twice must produce the same database state. `upsert`
is safer than `createMany + skipDuplicates` because it also updates fields if they changed.

---

### 7. Pasta combinations — naming convention

**Decision**: MenuItem names follow the pattern `"{Tipo} {salsa}"` (e.g., "Tallarines con Salsa",
"Ñoquis con Bolognesa"). 12 records (4 tipos × 3 salsas). Example price: ARS 1500 (uniform
placeholder; admin updates before launch).

**Rationale**: Each combination is a separate orderable item with its own price. Matches how
the business currently presents pastas.

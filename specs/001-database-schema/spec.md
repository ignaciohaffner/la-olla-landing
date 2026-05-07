# Feature Specification: Database Schema & Seed

**Feature Branch**: `001-database-schema`
**Created**: 2026-05-07
**Status**: Draft
**Input**: User description: "Crear la especificación para el módulo de base de datos del proyecto La Olla"

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Schema completo y migraciones iniciales (Priority: P1)

Un desarrollador hace `prisma migrate dev` y obtiene una base de datos PostgreSQL con todas las
tablas definidas, sus relaciones, índices únicos y valores por defecto, sin errores.

**Why this priority**: Es el cimiento de todos los demás módulos. Sin el schema correcto no puede
arrancarse ningún desarrollo de backend ni frontend.

**Independent Test**: Ejecutar `prisma migrate dev --name init` en un entorno limpio y verificar
que las 9 tablas existen con las columnas y constraints correctas.

**Acceptance Scenarios**:

1. **Given** una base de datos PostgreSQL vacía, **When** se ejecuta `prisma migrate dev`,
   **Then** se crean las tablas Admin, Category, MenuItem, PizzaPartyConfig, PizzaPartyRequest,
   Offer, Schedule, WeeklyMenuDay y ContactMessage sin errores.
2. **Given** el schema migrado, **When** se insertan dos registros en Category con el mismo `slug`,
   **Then** la base de datos rechaza la inserción con un error de constraint único.
3. **Given** el schema migrado, **When** se inserta un MenuItem sin `categoryId` válido,
   **Then** la base de datos rechaza la inserción con un error de foreign key.
4. **Given** el schema migrado, **When** se consulta WeeklyMenuDay con el mismo par
   `[weekStart, dayOfWeek]` dos veces, **Then** la segunda inserción es rechazada por constraint único.

---

### User Story 2 — Seed con datos reales del negocio (Priority: P2)

Un desarrollador hace `prisma db seed` y obtiene una base de datos con todos los datos reales de
La Olla listos para usar: un admin funcional, categorías completas, sabores de empanadas, combinaciones
de pastas, horarios y configuración de pizza party.

**Why this priority**: Permite arrancar el desarrollo de la API y el frontend con datos reales sin
tener que cargarlos manualmente en cada entorno.

**Independent Test**: Ejecutar `prisma db seed` en una base de datos ya migrada y verificar
cada grupo de datos con consultas SQL directas.

**Acceptance Scenarios**:

1. **Given** la base de datos migrada, **When** se ejecuta el seed, **Then** existe exactamente
   un Admin con email `admin@laolla.com` y su contraseña hashea correctamente el valor `admin123`
   (verificable con bcrypt.compare).
2. **Given** el seed ejecutado, **When** se consultan las categorías, **Then** existen exactamente
   6 registros: Comidas, Pizzas, Tartas, Empanadas, Pastas, Guarnición, en ese orden de `sortOrder`.
3. **Given** el seed ejecutado, **When** se consultan MenuItems de la categoría Empanadas,
   **Then** existen 8 ítems con `price = 0`: Carne salada, Carne dulce, Jamón y queso,
   Cebolla y queso, Verdura, Choclo, Pollo, Queso dulce.
4. **Given** el seed ejecutado, **When** se consultan MenuItems de la categoría Pastas,
   **Then** existen 12 ítems (4 tipos × 3 salsas) con precios de ejemplo mayores a 0.
5. **Given** el seed ejecutado, **When** se consultan los registros de Schedule,
   **Then** existen exactamente 7 filas (dayOfWeek 0–6), domingo con `isOpen = false`,
   lunes a sábado con `isOpen = true`, `openTime = "11:00"`, `closeTime = "22:00"`.
6. **Given** el seed ejecutado, **When** se consulta PizzaPartyConfig,
   **Then** existe exactamente 1 fila con todos los campos de configuración completados.

---

### Edge Cases

- El seed es idempotente: ejecutarlo dos veces no duplica registros (usar upsert).
- Los MenuItems con `price = 0` son válidos; no deben disparar errores de validación.
- `WeeklyMenuDay.dishes` es un array de strings vacío por defecto (no null).
- `Schedule` nunca se borra; solo se actualiza. El seed no hace delete de Schedule.
- `PizzaPartyConfig` es una tabla de una sola fila identificada por un id fijo (id = 1).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El schema DEBE definir los 9 modelos: Admin, Category, MenuItem, PizzaPartyConfig,
  PizzaPartyRequest, Offer, Schedule, WeeklyMenuDay, ContactMessage.
- **FR-002**: `Category.slug` y `Category.name` DEBEN tener constraint `@unique`.
- **FR-003**: `MenuItem.categoryId` DEBE ser una foreign key hacia `Category.id` con comportamiento
  de cascada en delete (`onDelete: Cascade`).
- **FR-004**: `MenuItem.available` DEBE tener valor por defecto `true`.
- **FR-005**: `MenuItem.price` es `Float`; el valor `0` es válido e indica ítem sin precio público
  (variante informativa, como sabores de empanada).
- **FR-006**: `PizzaPartyConfig` DEBE permitir solo una fila. Se garantiza a nivel de aplicación
  usando siempre upsert con `id = 1`.
- **FR-007**: `PizzaPartyRequest.status` DEBE restringirse a los valores `pending`, `confirmed`,
  `rejected` (enum de Prisma).
- **FR-008**: `Schedule.dayOfWeek` DEBE tener constraint `@unique` (0 = domingo, 6 = sábado).
- **FR-009**: `WeeklyMenuDay` DEBE tener constraint `@@unique([weekStart, dayOfWeek])`.
- **FR-010**: `WeeklyMenuDay.dayOfWeek` DEBE estar restringido a valores 1–5 (verificado en la
  capa de aplicación, no en la DB).
- **FR-011**: `WeeklyMenuDay.dishes` DEBE ser `String[]` (array nativo de PostgreSQL).
- **FR-012**: El seed DEBE ejecutarse de forma idempotente usando `upsert` en todos los modelos.
- **FR-013**: La contraseña del admin en el seed DEBE hashearse con bcrypt (mínimo 10 rounds)
  antes de almacenarse.

### Key Entities

- **Admin**: Cuenta de administrador. Un solo registro en producción. Campos: `id`, `email` (unique),
  `passwordHash`, `createdAt`.
- **Category**: Agrupación de ítems del menú. Campos: `id`, `name` (unique), `slug` (unique),
  `sortOrder` (entero), relación uno-a-muchos con MenuItem.
- **MenuItem**: Ítem individual del menú. Campos: `id`, `name`, `price` (Float, 0 = sin precio
  público), `categoryId` (FK), `description` (opcional), `available` (default true), `sortOrder`,
  `createdAt`, `updatedAt`.
- **PizzaPartyConfig**: Configuración del servicio de pizza party. Una sola fila. Campos:
  `id`, `pricePerPerson`, `minimumGuests` (default 20), `baseHours` (default 3),
  `extraHourPrice`, `mozzoPrice`, `serviceDetails` (texto largo).
- **PizzaPartyRequest**: Solicitud de cotización de pizza party. Campos: `id`, `name`, `email`,
  `phone`, `eventDate`, `guests`, `extraHours` (default 0), `extraMozzos` (default 0),
  `message` (opcional), `totalPrice`, `status` (enum: pending/confirmed/rejected, default pending),
  `adminNotes` (opcional), `createdAt`.
- **Offer**: Promoción o descuento. Campos: `id`, `title`, `description`, `badge` (opcional,
  texto corto ej. "20% OFF"), `validFrom`, `validTo`, `active` (default true), `createdAt`.
- **Schedule**: Horario por día de la semana. 7 filas fijas (0–6). Campos: `dayOfWeek` (unique),
  `openTime` (String "HH:MM"), `closeTime` (String "HH:MM"), `isOpen`, `specialNote` (opcional).
- **WeeklyMenuDay**: Platos del menú del día para una semana específica. Campos: `id`,
  `weekStart` (DateTime, lunes 00:00 UTC), `dayOfWeek` (1–5), `dishes` (String[]).
  Constraint único en `[weekStart, dayOfWeek]`.
- **ContactMessage**: Mensaje enviado por un usuario desde el formulario de contacto. Campos:
  `id`, `name`, `email`, `phone` (opcional), `message`, `read` (default false), `createdAt`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un entorno de desarrollo limpio queda completamente funcional (schema + seed) en menos
  de 2 minutos desde cero.
- **SC-002**: El seed ejecutado dos veces consecutivas produce exactamente el mismo estado final
  (cero duplicados, cero errores).
- **SC-003**: Las 9 tablas existen con sus constraints tras la migración, verificables sin inspección
  manual del código (solo SQL).
- **SC-004**: El admin creado por el seed puede autenticarse exitosamente usando `admin@laolla.com`
  / `admin123` (verificable con la lógica de auth del backend).
- **SC-005**: Los 20 ítems del menú del seed (8 empanadas + 12 pastas) están correctamente
  categorizados y accesibles en una sola consulta con join a Category.

## Assumptions

- La base de datos PostgreSQL ya está provisionada y accesible via `DATABASE_URL` en `backend/.env`.
- El proveedor de Prisma es `postgresql`. No se usa SQLite ni ninguna otra base de datos.
- Los precios de ejemplo para las pastas son valores aproximados (ej. ARS 1200–1800 por plato);
  el admin los actualizará desde el panel antes del lanzamiento.
- Los precios en `PizzaPartyConfig` del seed son valores de ejemplo; el admin los actualiza desde
  el panel.
- `WeeklyMenuDay.dayOfWeek` usa la convención ISO (1 = lunes, 5 = viernes). La validación del
  rango 1–5 la hace la capa de aplicación, no la DB.
- El seed no carga imágenes ni assets; eso está fuera del alcance de este módulo.
- Se asume que `@prisma/client` y `bcrypt` (con sus tipos `@types/bcrypt`) son dependencias de
  `backend/`.

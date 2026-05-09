# Feature Specification: Public API Routes

**Feature Branch**: `002-public-api-routes`
**Created**: 2026-05-07
**Status**: Draft
**Input**: User description: "Crear la especificación para las rutas públicas (sin autenticación) del backend Express del proyecto La Olla"

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Visitante explora el menú (Priority: P1)

Un visitante abre la web de La Olla y navega por el menú. El frontend solicita los ítems disponibles
agrupados por categoría y los muestra ordenados de manera coherente con la carga del negocio.

**Why this priority**: Es la funcionalidad central del sitio. Sin el menú disponible el sitio no
entrega valor al visitante.

**Independent Test**: Llamar `GET /api/menu` y verificar que la respuesta contiene los ítems
disponibles agrupados por categoría, ordenados correctamente, incluyendo ítems con precio 0.

**Acceptance Scenarios**:

1. **Given** la base de datos tiene categorías y MenuItems con `available=true`, **When** se llama
   `GET /api/menu`, **Then** la respuesta es un array de objetos `{ category, items }` ordenados
   por `sortOrder` de la categoría, con ítems internos ordenados por `sortOrder` del ítem.
2. **Given** un MenuItem con `price=0` y `available=true`, **When** se llama `GET /api/menu`,
   **Then** ese ítem aparece en la respuesta (los precios cero son sabores informativos, no errores).
3. **Given** un MenuItem con `available=false`, **When** se llama `GET /api/menu`,
   **Then** ese ítem NO aparece en la respuesta.
4. **Given** la base de datos tiene categorías sin ítems disponibles, **When** se llama `GET /api/menu`,
   **Then** esas categorías no aparecen en la respuesta (no se incluyen categorías vacías).

---

### User Story 2 — Cliente solicita cotización de pizza party (Priority: P1)

Un cliente llena el formulario de pizza party con sus datos, fecha del evento, cantidad de invitados
y extras (horas adicionales, mozzos). Al enviar, el sistema calcula el precio total usando la
configuración vigente, guarda la solicitud y notifica al dueño por email.

**Why this priority**: Es la principal fuente de ingresos del servicio de catering. Una cotización
errónea o no recibida representa pérdida directa de negocio.

**Independent Test**: Enviar `POST /api/pizza-party/request` con datos válidos y verificar que
la respuesta incluye un `id` y un `totalPrice` calculado correctamente, y que el dueño recibe
el email de notificación.

**Acceptance Scenarios**:

1. **Given** PizzaPartyConfig cargado en la base de datos, **When** se envía el formulario con
   `guests=30, extraHours=1, extraMozzos=2`, **Then** el `totalPrice` retornado es
   `(30 × pricePerPerson) + (1 × extraHourPrice) + (2 × mozzoPrice)`.
2. **Given** un envío con `guests=30`, **When** se recibe la respuesta, **Then** se guarda un
   registro en `PizzaPartyRequest` y se envía un email al `OWNER_EMAIL` con todos los datos del
   pedido.
3. **Given** un body sin el campo `name`, **When** se llama al endpoint, **Then** la respuesta es
   HTTP 400 con detalle del campo faltante.
4. **Given** un `eventDate` en formato inválido, **When** se llama al endpoint, **Then** la
   respuesta es HTTP 400 indicando el campo `eventDate`.

---

### User Story 3 — Visitante consulta si el local está abierto (Priority: P2)

El sitio muestra los horarios del local y un indicador de "¿Abierto ahora?" que refleja el horario
real de Argentina en ese momento.

**Why this priority**: Evita visitas o llamados innecesarios fuera de horario; mejora la experiencia
del visitante sin requerir autenticación.

**Independent Test**: Llamar `GET /api/schedule` y verificar que los 7 días se retornan con
`isOpenNow=true` exactamente para el día y hora actual de Argentina.

**Acceptance Scenarios**:

1. **Given** el día actual es lunes y la hora argentina es 14:00 y el lunes tiene `isOpen=true`,
   `openTime="11:00"`, `closeTime="22:00"`, **When** se llama `GET /api/schedule`, **Then** el
   registro de lunes tiene `isOpenNow=true`.
2. **Given** el día actual es domingo y `isOpen=false`, **When** se llama `GET /api/schedule`,
   **Then** el domingo tiene `isOpenNow=false`.
3. **Given** la hora argentina actual es 10:00 (antes de apertura), **When** se llama
   `GET /api/schedule`, **Then** el día actual tiene `isOpenNow=false`.
4. **Given** cualquier momento del día, **When** se llama `GET /api/schedule`, **Then** la
   respuesta contiene exactamente 7 registros ordenados por `dayOfWeek` (0=domingo al 6=sábado).

---

### User Story 4 — Visitante consulta el menú semanal (Priority: P2)

El sitio muestra los platos del día para la semana en curso. Si aún no se cargó el menú de esta
semana, el sitio maneja la situación sin errores.

**Why this priority**: Información útil para clientes habituales; el comportamiento vacío es
esperado y no debe romperse.

**Independent Test**: Llamar `GET /api/weekly-menu` con y sin datos de la semana actual en la
base de datos, verificando array con datos o array vacío respectivamente.

**Acceptance Scenarios**:

1. **Given** hay WeeklyMenuDays cargados para el lunes más reciente (00:00 UTC), **When** se llama
   `GET /api/weekly-menu`, **Then** se retornan esos registros.
2. **Given** no hay WeeklyMenuDays para la semana actual, **When** se llama `GET /api/weekly-menu`,
   **Then** la respuesta es `[]` (array vacío, no error).
3. **Given** hay datos de semanas anteriores, **When** se llama `GET /api/weekly-menu`,
   **Then** esos datos NO aparecen en la respuesta (solo la semana en curso).

---

### User Story 5 — Visitante envía mensaje de contacto (Priority: P2)

Un visitante completa el formulario de contacto con su nombre, email y mensaje. Al enviarlo, el
sistema guarda el mensaje y notifica al dueño por email.

**Why this priority**: Canal de comunicación secundario; importante para consultas que no son
cotizaciones de pizza party.

**Independent Test**: Enviar `POST /api/contact` con datos válidos y verificar que la respuesta
es `{ success: true }` y el dueño recibe el email.

**Acceptance Scenarios**:

1. **Given** datos válidos `{ name, email, message }`, **When** se llama `POST /api/contact`,
   **Then** la respuesta es HTTP 200 con `{ success: true }` y se guarda un ContactMessage.
2. **Given** datos válidos con `phone` opcional incluido, **When** se llama `POST /api/contact`,
   **Then** el teléfono se guarda junto al mensaje.
3. **Given** body sin `message`, **When** se llama `POST /api/contact`, **Then** la respuesta
   es HTTP 400 con detalle del campo faltante.

---

### User Story 6 — Visitante consulta ofertas vigentes (Priority: P3)

El sitio muestra las promociones activas y vigentes en la fecha actual.

**Why this priority**: Funcionalidad de marketing complementaria; no bloquea el uso del sitio si
no hay ofertas cargadas.

**Independent Test**: Llamar `GET /api/offers` con diferentes combinaciones de fechas y estados
de ofertas en la DB, verificando que solo aparecen las activas y dentro de rango.

**Acceptance Scenarios**:

1. **Given** una Offer con `active=true`, `validFrom` ayer, `validTo` mañana, **When** se llama
   `GET /api/offers`, **Then** aparece en la respuesta.
2. **Given** una Offer con `active=false`, **When** se llama `GET /api/offers`, **Then** NO
   aparece.
3. **Given** una Offer con `validTo` ayer, **When** se llama `GET /api/offers`, **Then** NO
   aparece.
4. **Given** múltiples ofertas vigentes, **When** se llama `GET /api/offers`, **Then** se
   retornan ordenadas por `createdAt` descendente.

---

### Edge Cases

- `GET /api/menu`: Sin categorías en la base de datos → array vacío, sin error.
- `GET /api/weekly-menu`: weekStart se calcula en el servidor; nunca depende de parámetros del cliente.
- `POST /api/pizza-party/request`: el `totalPrice` siempre se calcula en el servidor; cualquier
  total enviado por el cliente es ignorado.
- `POST /api/pizza-party/request`: si `OWNER_EMAIL` no está configurado, la solicitud se guarda
  de todas formas pero se loguea un error de envío (no se expone al cliente).
- Cualquier ruta no existente bajo `/api/` → 404 con JSON `{ error: "Not found" }`.
- Errores internos inesperados → 500 con JSON `{ error: "Internal server error" }` sin exponer
  el stack trace en producción.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El servidor DEBE exponer un endpoint `GET /api/health` que retorne `{ status: "ok" }`.
- **FR-002**: `GET /api/menu` DEBE retornar únicamente MenuItems con `available=true`, agrupados
  por categoría, ordenados por `Category.sortOrder` y dentro de cada categoría por `MenuItem.sortOrder`.
- **FR-003**: `GET /api/menu` DEBE incluir ítems con `price=0` (son sabores informativos válidos).
- **FR-004**: `GET /api/categories` DEBE retornar todas las categorías ordenadas por `sortOrder`.
- **FR-005**: `GET /api/pizza-party/config` DEBE retornar los campos públicos de PizzaPartyConfig
  (todos excepto `id`).
- **FR-006**: `GET /api/offers` DEBE retornar solo las Offers donde `active=true` AND
  `validFrom <= ahora` AND `validTo >= ahora`, ordenadas por `createdAt` descendente.
- **FR-007**: `GET /api/schedule` DEBE retornar los 7 registros de Schedule ordenados por
  `dayOfWeek`, incluyendo el campo calculado `isOpenNow: boolean` basado en la hora actual de
  Argentina (UTC-3).
- **FR-008**: `GET /api/weekly-menu` DEBE retornar los WeeklyMenuDays cuyo `weekStart` coincide
  con el lunes más reciente a 00:00 UTC. Si no existen, retorna `[]`.
- **FR-009**: `POST /api/pizza-party/request` DEBE validar el body con los campos:
  `name` (string), `email` (email válido), `phone` (string), `eventDate` (fecha válida),
  `guests` (entero positivo), `extraHours` (entero ≥ 0), `extraMozzos` (entero ≥ 0),
  `message` (string opcional).
- **FR-010**: `POST /api/pizza-party/request` DEBE calcular `totalPrice` en el servidor usando
  los valores de PizzaPartyConfig. El total enviado por el cliente es ignorado.
- **FR-011**: `POST /api/pizza-party/request` DEBE guardar el registro en `PizzaPartyRequest`
  y enviar un email al `OWNER_EMAIL` con los datos completos del pedido. Retorna `{ id, totalPrice }`.
- **FR-012**: `POST /api/contact` DEBE validar el body con los campos: `name` (string),
  `email` (email válido), `phone` (string opcional), `message` (string).
- **FR-013**: `POST /api/contact` DEBE guardar el ContactMessage y enviar email al `OWNER_EMAIL`.
  Retorna `{ success: true }`.
- **FR-014**: Errores de validación DEBEN retornar HTTP 400 con detalle de los campos inválidos.
- **FR-015**: Errores internos inesperados DEBEN retornar HTTP 500 con un mensaje genérico.
  En producción, el stack trace NO debe exponerse en la respuesta.
- **FR-016**: DEBE existir un middleware de error global que capture todos los errores no manejados
  y aplique FR-014 y FR-015 de forma centralizada.

### Key Entities

- **Respuesta de menú agrupado**: Array de `{ category: { id, name, slug }, items: [{ id, name, price, description }] }`.
- **isOpenNow**: Campo calculado en `GET /api/schedule`. `true` si `isOpen=true` Y la hora actual
  de Argentina está entre `openTime` y `closeTime` del día actual. Siempre `false` si `isOpen=false`.
- **totalPrice de pizza party**: `(guests × pricePerPerson) + (extraHours × extraHourPrice) + (extraMozzos × mozzoPrice)`.
- **weekStart**: El lunes más reciente a 00:00 UTC desde el momento de la solicitud. Se calcula
  en el servidor.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Todas las rutas GET retornan respuesta en menos de 500ms bajo carga normal (una
  solicitud a la vez en entorno de desarrollo).
- **SC-002**: `POST /api/pizza-party/request` con datos válidos retorna en menos de 3 segundos
  (incluyendo el envío de email, que puede ser asíncrono o sincrónico).
- **SC-003**: El 100% de las combinaciones de validación documentadas en los Acceptance Scenarios
  retorna el HTTP status code correcto (400 vs 200 vs 500).
- **SC-004**: `isOpenNow` es correcto al 100% para el día y hora de Argentina en el momento de
  la solicitud (verificable con tests unitarios que mockean la hora actual).
- **SC-005**: Un envío válido de `POST /api/pizza-party/request` produce exactamente 1 registro
  en `PizzaPartyRequest` y 1 email al `OWNER_EMAIL` (sin duplicados aunque se llame dos veces
  con los mismos datos).
- **SC-006**: Ninguna ruta expone información de stack trace o detalles internos en respuestas
  de error en entorno de producción.

## Assumptions

- El servidor Express ya existe en `backend/src/app.ts` o equivalente; este feature agrega las
  rutas al servidor existente.
- La base de datos ya fue migrada y seedeada según la feature `001-database-schema`.
- `OWNER_EMAIL` está configurado como variable de entorno. Si no está definida, el envío de email
  falla silenciosamente (log de error interno) pero la solicitud se guarda de todas formas.
- El servicio de email usa SMTP o un proveedor de transaccional (ej. Nodemailer); la elección
  concreta es decisión de implementación, no de este spec.
- Las rutas privadas (panel de administración) están fuera del alcance de este feature.
- La zona horaria de Argentina es UTC-3 fija (sin DST). No se requiere ajuste por horario de
  verano.
- `guests` para pizza party debe ser ≥ `PizzaPartyConfig.minimumGuests`; esta validación se
  implementa a nivel de aplicación pero no necesariamente en este endpoint (puede delegarse al
  frontend con mensajería de usuario, o retornar 400 — decisión de implementación).
- Todos los endpoints son públicos: no requieren autenticación ni CORS especial (se asume que
  el frontend y el backend comparten dominio o que CORS ya está configurado globalmente).

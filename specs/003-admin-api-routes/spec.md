# Feature Specification: Admin API Routes

**Feature Branch**: `003-admin-api-routes`
**Created**: 2026-05-09
**Status**: Draft
**Input**: User description: "Crear la especificación para las rutas de administración del backend Express del proyecto La Olla."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Administrador inicia sesión en el panel (Priority: P1)

El dueño del negocio abre el panel de administración en su celular, ingresa su email y contraseña, y
obtiene acceso a todas las funciones de gestión. Si las credenciales son incorrectas, recibe un
mensaje de error claro. La sesión es válida durante 7 días.

**Why this priority**: Sin autenticación no hay acceso a ninguna otra función del panel. Es el punto
de entrada obligatorio para todas las demás operaciones de administración.

**Independent Test**: Enviar `POST /api/admin/login` con credenciales válidas e inválidas y verificar
que el primero devuelve un token de sesión y el segundo devuelve error 401.

**Acceptance Scenarios**:

1. **Given** un Admin registrado con email `admin@laolla.com` y contraseña correcta,
   **When** se envía `POST /api/admin/login` con esas credenciales,
   **Then** la respuesta es HTTP 200 con un token de sesión válido por 7 días.
2. **Given** el mismo email pero contraseña incorrecta,
   **When** se envía `POST /api/admin/login`,
   **Then** la respuesta es HTTP 401 con mensaje de error.
3. **Given** un email que no existe en el sistema,
   **When** se envía `POST /api/admin/login`,
   **Then** la respuesta es HTTP 401 (sin revelar si el email existe o no).
4. **Given** un token de sesión válido,
   **When** se llama cualquier ruta protegida con ese token en el header `Authorization`,
   **Then** la respuesta es el recurso solicitado (no 401).
5. **Given** un token inválido, expirado, o ausente,
   **When** se llama cualquier ruta protegida,
   **Then** la respuesta es HTTP 401.

---

### User Story 2 — Administrador gestiona el menú (Priority: P1)

El dueño necesita agregar nuevos platos, actualizar precios (en bulk cuando sube la harina, por
ejemplo), editar descripciones, desactivar ítems sin borrarlos, y eliminar ítems que ya no se
ofrecen. También puede organizar las categorías y su orden de aparición en el menú público.

**Why this priority**: El menú es el contenido central del sitio. Sin capacidad de actualizarlo,
el panel de administración no tiene utilidad práctica.

**Independent Test**: Crear un item nuevo, actualizarlo, actualizar sus precios en bulk junto con
otros ítems, y eliminarlo. Verificar que cada operación persiste correctamente y que el menú público
refleja los cambios en los ítems disponibles.

**Acceptance Scenarios**:

1. **Given** un admin autenticado, **When** envía `POST /api/admin/menu/items` con nombre, precio,
   categoría y disponibilidad, **Then** el ítem se crea y aparece en `GET /api/admin/menu`.
2. **Given** un item existente, **When** el admin envía `PATCH /api/admin/menu/items/:id` con un
   nuevo precio, **Then** solo el precio se actualiza; los demás campos quedan iguales.
3. **Given** múltiples ítems, **When** el admin envía `PATCH /api/admin/menu/prices` con un array
   de `[{ id, price }]`, **Then** todos los precios se actualizan en una sola operación.
4. **Given** un item existente, **When** el admin envía `DELETE /api/admin/menu/items/:id`,
   **Then** el ítem se elimina y ya no aparece en ningún listado.
5. **Given** un admin autenticado, **When** llama `GET /api/admin/menu`,
   **Then** recibe TODOS los ítems (incluyendo `available=false`), agrupados por categoría.
6. **Given** una categoría sin ítems asociados, **When** el admin intenta eliminarla,
   **Then** la categoría se elimina correctamente.
7. **Given** una categoría con ítems asociados, **When** el admin intenta eliminarla,
   **Then** la respuesta es HTTP 409 y la categoría NO se elimina.

---

### User Story 3 — Administrador gestiona solicitudes de Pizza Party (Priority: P1)

El dueño recibe solicitudes de cotización de pizza party desde el sitio público. Necesita ver todas
las solicitudes ordenadas por fecha de llegada, filtrar por estado (pendiente, confirmada, rechazada),
cambiar el estado de cada solicitud, y dejar notas internas. También puede ajustar los precios
del servicio (precio por persona, hora extra, mozzo).

**Why this priority**: Es la principal fuente de ingresos del catering. La gestión de solicitudes
es la función más crítica del panel después del login.

**Independent Test**: Crear una solicitud desde el endpoint público, luego listarla desde el admin,
cambiar su estado a "confirmada" con una nota, y verificar que los cambios persisten.

**Acceptance Scenarios**:

1. **Given** solicitudes en distintos estados, **When** el admin llama `GET /api/admin/pizza-party/requests`,
   **Then** recibe todas las solicitudes ordenadas por fecha de creación descendente.
2. **Given** el mismo listado, **When** agrega el query param `?status=pending`,
   **Then** solo recibe las solicitudes con estado `pending`.
3. **Given** una solicitud existente, **When** el admin envía `PATCH /api/admin/pizza-party/requests/:id`
   con `{ status: "confirmed", adminNotes: "Confirmado para 40 personas" }`,
   **Then** el estado y las notas se actualizan correctamente.
4. **Given** un admin autenticado, **When** llama `GET /api/admin/pizza-party/config`,
   **Then** recibe la configuración actual de precios del servicio.
5. **Given** la config actual, **When** el admin envía `PATCH /api/admin/pizza-party/config` con
   un campo actualizado (ej. `pricePerPerson`), **Then** solo ese campo se actualiza.

---

### User Story 4 — Administrador gestiona ofertas (Priority: P2)

El dueño quiere publicar promociones con fecha de inicio y fin, activarlas o desactivarlas, editarlas
y eliminarlas. Desde el panel ve todas las ofertas (activas e inactivas), mientras el sitio público
solo muestra las vigentes y activas.

**Why this priority**: Funcionalidad de marketing importante pero no bloquea la operación del negocio.

**Independent Test**: Crear una oferta inactiva, verificar que no aparece en el sitio público,
activarla, verificar que sí aparece, y luego eliminarla.

**Acceptance Scenarios**:

1. **Given** un admin autenticado, **When** llama `GET /api/admin/offers`,
   **Then** recibe TODAS las ofertas (activas e inactivas), sin filtro de fecha.
2. **Given** un admin autenticado, **When** crea una oferta con `active=false`,
   **Then** la oferta aparece en `GET /api/admin/offers` pero NO en `GET /api/offers` (público).
3. **Given** una oferta existente, **When** el admin envía `PATCH /api/admin/offers/:id`
   con `{ active: true }`, **Then** la oferta pasa a activa.
4. **Given** una oferta existente, **When** el admin envía `DELETE /api/admin/offers/:id`,
   **Then** la oferta se elimina permanentemente.

---

### User Story 5 — Administrador gestiona horarios y menú semanal (Priority: P2)

El dueño actualiza los horarios del local (qué días abre, a qué hora) y carga los platos del día
para la semana en curso. Los cambios en horarios se reflejan inmediatamente en el indicador
"¿Abierto ahora?" del sitio público.

**Why this priority**: Información operativa necesaria para los visitantes, pero con frecuencia
de actualización baja.

**Independent Test**: Actualizar el horario del lunes, verificar que `GET /api/schedule` refleja
el cambio. Cargar el menú semanal y verificar que `GET /api/weekly-menu` lo muestra.

**Acceptance Scenarios**:

1. **Given** un admin autenticado, **When** envía `PATCH /api/admin/schedule` con los 7 días,
   **Then** todos los horarios se actualizan (crea o reemplaza cada día).
2. **Given** horarios actualizados, **When** se llama `GET /api/schedule` (público),
   **Then** los cambios se reflejan inmediatamente.
3. **Given** un admin autenticado, **When** envía `PUT /api/admin/weekly-menu` con platos para
   los días 1–5 de la semana actual, **Then** el menú semanal se reemplaza completamente.
4. **Given** el menú semanal cargado, **When** se llama `GET /api/weekly-menu` (público),
   **Then** se muestran los platos de la semana en curso.

---

### User Story 6 — Administrador gestiona mensajes de contacto (Priority: P2)

El dueño ve los mensajes enviados a través del formulario de contacto, marca como leídos los que
ya atendió, y consulta cuántos mensajes no ha leído todavía.

**Why this priority**: Canal de comunicación secundario; importante pero no urgente.

**Independent Test**: Enviar un mensaje desde el endpoint público, verificar que aparece en el
listado admin con `read=false`, marcarlo como leído, y verificar que el contador de no leídos
disminuye.

**Acceptance Scenarios**:

1. **Given** mensajes en la base de datos, **When** el admin llama `GET /api/admin/contact`,
   **Then** recibe todos los mensajes ordenados por fecha de creación descendente.
2. **Given** un mensaje con `read=false`, **When** el admin envía `PATCH /api/admin/contact/:id/read`
   con `{ read: true }`, **Then** el mensaje queda marcado como leído.
3. **Given** 3 mensajes no leídos, **When** el admin llama `GET /api/admin/contact/unread-count`,
   **Then** la respuesta es `{ count: 3 }`.

---

### User Story 7 — Administrador descarga imagen de lista de precios (Priority: P3)

El dueño quiere compartir la lista de precios por WhatsApp o Instagram. Desde el panel puede
descargar en un clic una imagen PNG actualizada con todos los ítems del menú agrupados por
categoría y el logo del negocio.

**Why this priority**: Funcionalidad de conveniencia. La lista de precios se puede compartir
manualmente si este endpoint no estuviera, pero automatizarla ahorra tiempo al dueño.

**Independent Test**: Llamar `GET /api/admin/price-list/image` y verificar que la respuesta es
un archivo PNG válido con el contenido del menú actual.

**Acceptance Scenarios**:

1. **Given** un admin autenticado con ítems de menú cargados,
   **When** llama `GET /api/admin/price-list/image`,
   **Then** la respuesta es un archivo de imagen PNG con todos los ítems del menú agrupados por
   categoría y el logo del negocio.
2. **Given** la imagen generada, **When** el frontend la recibe,
   **Then** puede ofrecerla como descarga directa al usuario sin redirección de URL externa.
3. **Given** un admin NO autenticado, **When** intenta llamar `GET /api/admin/price-list/image`,
   **Then** la respuesta es HTTP 401.

---

### Edge Cases

- `POST /api/admin/login`: Si el email no existe, la respuesta es 401 (igual que contraseña
  incorrecta) para no revelar qué emails están registrados.
- `DELETE /api/admin/categories/:id`: Si la categoría tiene ítems, devuelve 409 (Conflict).
  El admin debe eliminar o reasignar los ítems primero.
- `PATCH /api/admin/menu/prices`: Si algún id del array no existe, ese ítem se ignora o retorna
  error parcial — se documenta el comportamiento en el plan.
- `PATCH /api/admin/schedule`: Actualiza todos los días en una sola llamada (upsert). Si se omite
  un día, el comportamiento de ese día no cambia.
- `PUT /api/admin/weekly-menu`: Reemplaza la semana completa. Si se omite un día (ej. viernes),
  ese día queda sin platos para la semana en curso.
- Rutas protegidas sin token: siempre 401, sin importar si el recurso existe o no.
- Body inválido en cualquier endpoint de escritura: HTTP 400 con detalle de campos.

## Requirements *(mandatory)*

### Functional Requirements

**Autenticación**

- **FR-001**: El sistema DEBE permitir que un administrador inicie sesión con email y contraseña.
  Si las credenciales son válidas, retorna un token de sesión con 7 días de validez.
- **FR-002**: El sistema DEBE rechazar con HTTP 401 cualquier intento de acceso a rutas protegidas
  sin un token válido o con un token expirado.
- **FR-003**: El sistema NO DEBE revelar si un email existe o no en el sistema al rechazar un login.

**Menú — ítems**

- **FR-004**: El sistema DEBE permitir al admin ver todos los ítems del menú (incluyendo los
  no disponibles), agrupados por categoría.
- **FR-005**: El sistema DEBE permitir al admin crear un ítem de menú con nombre, precio,
  categoría, descripción opcional, disponibilidad y orden de visualización.
- **FR-006**: El sistema DEBE permitir al admin actualizar campos parciales de un ítem existente.
- **FR-007**: El sistema DEBE permitir al admin eliminar un ítem del menú.
- **FR-008**: El sistema DEBE permitir actualizar los precios de múltiples ítems en una sola
  operación, aceptando un array de `{ id, price }`.

**Menú — categorías**

- **FR-009**: El sistema DEBE permitir al admin listar, crear, editar (nombre, identificador de
  URL, orden) y eliminar categorías.
- **FR-010**: El sistema DEBE impedir la eliminación de una categoría que tenga ítems asociados,
  retornando HTTP 409.

**Pizza Party**

- **FR-011**: El sistema DEBE permitir al admin ver y actualizar parcialmente la configuración
  de precios del servicio de pizza party.
- **FR-012**: El sistema DEBE permitir al admin listar todas las solicitudes de pizza party
  ordenadas por fecha de recepción descendente, con filtro opcional por estado.
- **FR-013**: El sistema DEBE permitir al admin actualizar el estado y/o las notas internas
  de una solicitud de pizza party.

**Ofertas**

- **FR-014**: El sistema DEBE permitir al admin ver todas las ofertas (activas e inactivas).
- **FR-015**: El sistema DEBE permitir al admin crear, editar y eliminar ofertas con título,
  descripción, badge opcional, fechas de vigencia y estado activo/inactivo.

**Horarios**

- **FR-016**: El sistema DEBE permitir al admin ver y actualizar los horarios de los 7 días
  de la semana (apertura, cierre, abierto/cerrado, nota especial opcional).
- **FR-017**: La actualización de horarios DEBE ser una operación de reemplazo total (los 7 días
  se actualizan en una sola llamada).

**Menú semanal**

- **FR-018**: El sistema DEBE permitir al admin ver el menú semanal de la semana en curso
  (equivalente a la vista pública).
- **FR-019**: El sistema DEBE permitir al admin reemplazar completamente el menú semanal actual
  con un array de días (lunes a viernes) y sus platos del día.

**Mensajes de contacto**

- **FR-020**: El sistema DEBE permitir al admin ver todos los mensajes de contacto ordenados
  por fecha descendente.
- **FR-021**: El sistema DEBE permitir al admin marcar un mensaje como leído.
- **FR-022**: El sistema DEBE proveer un conteo de mensajes no leídos.

**Imagen de lista de precios**

- **FR-023**: El sistema DEBE generar y entregar una imagen PNG con la lista de precios actual,
  incluyendo todos los ítems del menú agrupados por categoría y el logo del negocio.
- **FR-024**: La imagen entregada DEBE poder descargarse directamente desde el frontend sin
  redirección a servicios externos.

### Key Entities

- **Token de sesión admin**: Credencial generada al login exitoso. Identifica al administrador
  en las rutas protegidas. Expira a los 7 días.
- **Ítem de menú**: Producto del menú con nombre, precio, categoría, descripción opcional,
  estado de disponibilidad y orden de visualización.
- **Categoría**: Agrupación de ítems del menú con nombre, identificador de URL y orden.
- **Configuración de Pizza Party**: Registro único con precios del servicio de catering.
- **Solicitud de Pizza Party**: Pedido de cotización recibido del sitio público, con estado
  (`pending` / `confirmed` / `rejected`) y notas del administrador.
- **Oferta**: Promoción con título, descripción, badge opcional, fechas de vigencia y estado activo.
- **Horario**: Configuración de apertura por día de la semana (7 registros fijos).
- **Menú semanal**: Lista de platos del día para cada día de la semana en curso (lunes a viernes).
- **Mensaje de contacto**: Mensaje enviado por un visitante, con estado de lectura.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un administrador puede iniciar sesión y acceder a cualquier ruta protegida en
  menos de 2 segundos desde que envía sus credenciales.
- **SC-002**: El 100% de las rutas protegidas rechaza correctamente peticiones sin token o con
  token inválido (verificable con tests que cubren todos los endpoints).
- **SC-003**: La actualización de precios en bulk para hasta 50 ítems se completa en menos de
  3 segundos.
- **SC-004**: La imagen de lista de precios se genera y descarga en menos de 5 segundos con
  un menú de hasta 100 ítems.
- **SC-005**: Los cambios en horarios y menú semanal se reflejan en el sitio público en la
  siguiente petición, sin delay adicional.
- **SC-006**: El 100% de las operaciones de escritura con datos inválidos retorna HTTP 400 con
  detalle del campo afectado.
- **SC-007**: Un intento de eliminar una categoría con ítems retorna HTTP 409 en el 100% de
  los casos.

## Assumptions

- Existe exactamente un administrador en el sistema (registro manual, sin endpoint de sign-up).
  El panel no requiere gestión multi-usuario en esta versión.
- El token de sesión se almacena en el frontend (localStorage o memoria). El servidor no
  mantiene estado de sesión; cualquier token válido y no expirado concede acceso.
- Los endpoints de administración comparten el mismo servidor Express que los públicos, bajo
  el prefijo `/api/admin/`.
- La configuración de Pizza Party es un registro único (siempre existe, solo se actualiza,
  nunca se crea ni elimina desde este panel).
- El horario semanal tiene exactamente 7 registros (uno por día). La operación de actualización
  hace upsert, no borra días faltantes del array.
- El menú semanal cubre solo días laborales (lunes a viernes, dayOfWeek 1–5). Los fines de
  semana no tienen menú diario.
- La imagen de lista de precios incluye solo ítems con `available=true` y price > 0 (ítems
  informativos de precio 0 se excluyen de la imagen por legibilidad).
- El logo del negocio está disponible como archivo estático en el servidor al momento de
  generar la imagen.
- La base de datos ya está migrada y seedeada según las features anteriores (001, 002).
- Las variables de entorno `JWT_SECRET` y `DATABASE_URL` están configuradas en el servidor.

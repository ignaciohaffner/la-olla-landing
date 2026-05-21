# Feature Specification: Admin Login y Panel de Administración

**Feature Branch**: `006-admin-panel`  
**Created**: 2026-05-10  
**Status**: Draft

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Acceso seguro al panel (Priority: P1)

El administrador del negocio necesita acceder al panel de gestión desde su celular o computadora. Si no tiene sesión activa, ve un formulario de login con el logo del negocio. Si ya tiene sesión válida, es redirigido directamente al panel sin necesidad de volver a ingresar sus credenciales.

**Why this priority**: Sin autenticación no existe acceso al panel. Es el punto de entrada de todo el sistema de administración y bloquea el resto de funcionalidades.

**Independent Test**: Puede probarse de forma completa mostrando el formulario de login, ingresando credenciales válidas e inválidas, y verificando la redirección automática cuando hay sesión activa.

**Acceptance Scenarios**:

1. **Given** el admin no tiene sesión activa, **When** accede a la ruta de login, **Then** ve el formulario con logo, campo de email y campo de contraseña
2. **Given** el admin ingresa credenciales válidas, **When** hace submit, **Then** es redirigido automáticamente al panel de administración
3. **Given** el admin ingresa credenciales inválidas, **When** hace submit, **Then** ve el mensaje "Email o contraseña incorrectos" sin recargar la página
4. **Given** el admin tiene una sesión válida activa, **When** accede a la ruta de login, **Then** es redirigido directamente al panel sin mostrar el formulario

---

### User Story 2 - Gestión del menú (Priority: P1)

El administrador puede ver, editar y gestionar todos los ítems del menú agrupados por categoría. Puede actualizar precios de múltiples ítems a la vez, agregar nuevos ítems, eliminar existentes, cambiar su disponibilidad y descargar una imagen de la lista de precios para compartir con clientes.

**Why this priority**: La gestión del menú es la operación más frecuente del negocio. Los precios cambian regularmente y la disponibilidad de platos varía día a día.

**Independent Test**: Puede probarse accediendo al tab Menú, editando un precio, guardando y verificando el cambio. Agrega valor inmediato al negocio sin depender de otras secciones.

**Acceptance Scenarios**:

1. **Given** el admin está en el tab Menú, **When** carga la sección, **Then** ve todos los ítems agrupados por categoría con nombre, precio y estado de disponibilidad
2. **Given** el admin modifica el precio de uno o más ítems, **When** hace click en "Guardar cambios de precio", **Then** los nuevos precios quedan guardados y el botón vuelve a estar deshabilitado
3. **Given** el admin no ha realizado ningún cambio, **When** ve el botón "Guardar cambios de precio", **Then** el botón está deshabilitado
4. **Given** el admin completa el formulario de nuevo ítem con nombre, precio y categoría, **When** lo guarda, **Then** el ítem aparece en la lista bajo la categoría seleccionada
5. **Given** el admin elimina un ítem, **When** confirma la acción, **Then** el ítem desaparece de la lista
6. **Given** el admin hace click en "Descargar lista de precios", **When** el sistema procesa la solicitud, **Then** se descarga una imagen PNG con la lista de precios actualizada

---

### User Story 3 - Gestión de Pizza Party (Priority: P2)

El administrador puede configurar las condiciones del servicio de Pizza Party (precios, mínimos, descripción del servicio) y gestionar las solicitudes entrantes cambiando su estado y agregando notas internas.

**Why this priority**: Es un servicio especial con solicitudes que requieren seguimiento manual y confirmación. Debe poder gestionarse rápidamente desde el celular.

**Independent Test**: Puede probarse configurando el precio por persona y cambiando el estado de una solicitud de pendiente a confirmada.

**Acceptance Scenarios**:

1. **Given** el admin está en el sub-tab Configuración de Pizza Party, **When** modifica el precio por persona y guarda, **Then** la configuración queda actualizada
2. **Given** el admin está en el sub-tab Solicitudes, **When** filtra por estado "pendiente", **Then** solo ve las solicitudes con ese estado
3. **Given** el admin selecciona una solicitud, **When** cambia su estado y agrega notas internas y guarda, **Then** los cambios quedan persistidos
4. **Given** hay solicitudes registradas, **When** el admin abre el sub-tab Solicitudes, **Then** las ve ordenadas de más reciente a más antigua

---

### User Story 4 - Gestión de Ofertas (Priority: P2)

El administrador puede crear, activar/desactivar y eliminar promociones con fechas de vigencia y un badge descriptivo opcional, que son visibles en el sitio público.

**Why this priority**: Las ofertas son una herramienta de comunicación frecuente con los clientes. Deben poder crearse y desactivarse rápidamente desde el celular.

**Independent Test**: Puede probarse creando una nueva oferta y verificando que aparece activa en la lista sin recargar la página.

**Acceptance Scenarios**:

1. **Given** el admin completa el formulario de nueva oferta con título, descripción y fechas, **When** guarda, **Then** la oferta aparece en la lista sin recargar la página
2. **Given** una oferta está activa, **When** el admin la desactiva con el toggle, **Then** la oferta queda inactiva
3. **Given** el admin elimina una oferta, **When** confirma la acción, **Then** la oferta desaparece de la lista

---

### User Story 5 - Gestión de Horarios (Priority: P2)

El administrador puede actualizar los horarios de apertura y cierre para cada día de la semana, incluyendo notas especiales por día (ej. "cerrado por feriado").

**Why this priority**: Los horarios cambian esporádicamente pero es crítico que el sitio público los muestre correctamente para no generar visitas en vano.

**Independent Test**: Puede probarse marcando un día como cerrado, guardando, y verificando que los campos de horario están deshabilitados para ese día.

**Acceptance Scenarios**:

1. **Given** el admin está en el tab Horarios, **When** carga la sección, **Then** ve los 7 días de la semana con sus horarios actuales
2. **Given** el admin marca un día como cerrado, **When** ve los campos de ese día, **Then** los inputs de apertura y cierre están deshabilitados
3. **Given** el admin modifica horarios de varios días, **When** hace click en "Guardar horarios", **Then** todos los cambios quedan guardados en una sola acción

---

### User Story 6 - Publicación del Menú Semanal (Priority: P2)

El administrador puede ingresar los platos disponibles para cada día hábil de la semana actual y publicarlos para que aparezcan en el sitio público.

**Why this priority**: El menú semanal se actualiza cada semana. Es una tarea recurrente que debe ser rápida de completar desde el celular.

**Independent Test**: Puede probarse ingresando platos para los días de la semana y verificando que el menú queda publicado tras presionar el botón correspondiente.

**Acceptance Scenarios**:

1. **Given** el admin está en el tab Menú Semanal y no hay menú publicado para la semana actual, **When** carga la sección, **Then** ve un aviso indicando que no hay menú esta semana
2. **Given** el admin ingresa platos para cada día, **When** hace click en "Publicar menú de esta semana", **Then** el menú queda disponible para el sitio público
3. **Given** el admin necesita corregir un plato, **When** edita la lista del día y vuelve a publicar, **Then** el menú se actualiza con los cambios

---

### User Story 7 - Gestión de Mensajes de Contacto (Priority: P3)

El administrador puede leer los mensajes enviados por clientes, marcarlos como leídos/no leídos y responder directamente por email con un solo click.

**Why this priority**: Los mensajes son comunicación entrante importante pero su urgencia es menor que la gestión operativa del negocio.

**Independent Test**: Puede probarse abriendo el tab Mensajes, verificando el badge de no leídos, marcando uno como leído y verificando que el contador se actualiza.

**Acceptance Scenarios**:

1. **Given** hay mensajes no leídos, **When** el admin ve el tab Mensajes, **Then** hay un badge rojo con el conteo de mensajes no leídos
2. **Given** el admin marca un mensaje como leído, **When** confirma la acción, **Then** el badge se actualiza y el mensaje queda marcado como leído
3. **Given** el admin quiere responder un mensaje, **When** hace click en "Responder por email", **Then** se abre su cliente de email con el destinatario ya cargado

---

### Edge Cases

- ¿Qué pasa si el admin intenta eliminar una categoría que aún tiene ítems? → El botón eliminar está deshabilitado para esa categoría mientras tenga ítems asociados.
- ¿Qué pasa si la sesión expira mientras el admin está en el panel? → El sistema redirige al login con un aviso apropiado.
- ¿Qué pasa si el admin pierde conectividad mientras guarda cambios? → Aparece un mensaje de error y los datos del formulario no se pierden.
- ¿Qué pasa si se intenta publicar el menú semanal sin platos? → El sistema permite publicar pero muestra advertencia si todos los días están vacíos.
- ¿Qué pasa si el admin deja el panel abierto por mucho tiempo sin actividad? → La sesión expira de forma segura y redirige al login.
- ¿Qué pasa si dos tabs del mismo navegador tienen el panel abierto simultáneamente? → Los cambios guardados en una tab se aplican correctamente; la otra tab refleja el estado actualizado al recargar.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE requerir autenticación con email y contraseña para acceder al panel de administración
- **FR-002**: El sistema DEBE redirigir automáticamente al panel cuando el administrador ya tiene sesión válida activa al intentar acceder al login
- **FR-003**: El sistema DEBE mostrar el mensaje "Email o contraseña incorrectos" cuando las credenciales son inválidas, sin revelar cuál de los dos campos es incorrecto
- **FR-004**: El sistema DEBE permitir al administrador cerrar sesión desde cualquier sección del panel
- **FR-005**: El panel DEBE ser completamente navegable y operable en dispositivos móviles (pantallas desde 320px de ancho)
- **FR-006**: El panel DEBE organizarse en tabs horizontales con desplazamiento lateral en mobile cuando los tabs no caben en pantalla
- **FR-007**: El sistema DEBE mostrar todos los ítems del menú agrupados por categoría con nombre, precio y estado de disponibilidad
- **FR-008**: El sistema DEBE permitir editar el nombre y precio de cada ítem del menú
- **FR-009**: El sistema DEBE permitir activar/desactivar la disponibilidad de cada ítem del menú mediante un toggle
- **FR-010**: El sistema DEBE habilitar el botón "Guardar cambios de precio" únicamente cuando haya cambios de precio pendientes sin guardar
- **FR-011**: El sistema DEBE permitir agregar nuevos ítems al menú con nombre, precio, categoría y descripción opcional
- **FR-012**: El sistema DEBE permitir eliminar ítems del menú
- **FR-013**: El sistema DEBE permitir crear nuevas categorías de menú
- **FR-014**: El sistema DEBE impedir eliminar una categoría que tiene ítems asociados (botón deshabilitado)
- **FR-015**: El sistema DEBE permitir descargar la lista de precios actual como archivo de imagen
- **FR-016**: El sistema DEBE permitir configurar los parámetros del servicio Pizza Party: precio por persona, mínimo de invitados, costo de hora extra, precio del servicio de mozo y descripción del servicio
- **FR-017**: El sistema DEBE mostrar todas las solicitudes de Pizza Party ordenadas de más reciente a más antigua
- **FR-018**: El sistema DEBE permitir filtrar las solicitudes de Pizza Party por estado (pendiente, confirmada, rechazada)
- **FR-019**: El sistema DEBE mostrar en cada solicitud: nombre del cliente, email, teléfono, fecha del evento, cantidad de invitados, total calculado, estado y campo de notas internas
- **FR-020**: El sistema DEBE permitir cambiar el estado de cada solicitud y agregar o editar notas internas
- **FR-021**: El sistema DEBE permitir crear nuevas ofertas con título, descripción, badge opcional, fechas de inicio y fin, y estado activo/inactivo
- **FR-022**: La lista de ofertas DEBE actualizarse de forma inmediata al guardar una nueva oferta, sin recargar la página
- **FR-023**: El sistema DEBE permitir activar/desactivar ofertas existentes mediante un toggle
- **FR-024**: El sistema DEBE permitir eliminar ofertas
- **FR-025**: El sistema DEBE mostrar y permitir editar los horarios de apertura y cierre para los 7 días de la semana, más un campo de nota especial por día
- **FR-026**: Los campos de horario de un día DEBEN deshabilitarse automáticamente cuando ese día está marcado como cerrado
- **FR-027**: El sistema DEBE permitir guardar los horarios de los 7 días en una única acción
- **FR-028**: El sistema DEBE mostrar el menú semanal de la semana en curso (lunes a viernes)
- **FR-029**: El sistema DEBE mostrar un aviso cuando no hay menú publicado para la semana actual
- **FR-030**: El sistema DEBE permitir ingresar y editar la lista de platos por día y publicar el menú completo de la semana
- **FR-031**: El sistema DEBE mostrar todos los mensajes de contacto ordenados de más reciente a más antiguo
- **FR-032**: El sistema DEBE mostrar un badge con el conteo de mensajes no leídos en el tab Mensajes
- **FR-033**: El sistema DEBE permitir marcar mensajes individuales como leídos o no leídos
- **FR-034**: El sistema DEBE permitir iniciar una respuesta por email al remitente del mensaje con un solo click

### Key Entities

- **Administrador**: Usuario único con credenciales (email + contraseña) que gestiona todo el contenido del negocio
- **Sesión**: Estado de autenticación del administrador con tiempo de expiración
- **Ítem de Menú**: Plato o producto con nombre, precio, categoría, descripción opcional y estado de disponibilidad
- **Categoría**: Agrupación de ítems del menú (ej. Entradas, Principales, Postres)
- **Configuración Pizza Party**: Parámetros del servicio: precio por persona, mínimo de invitados, costos adicionales y descripción del servicio
- **Solicitud Pizza Party**: Pedido de un cliente con datos de contacto, fecha del evento, cantidad de invitados, total calculado, estado y notas internas del administrador
- **Oferta**: Promoción con título, descripción, badge opcional, fechas de vigencia y estado activo/inactivo
- **Horario**: Configuración de apertura/cierre por día de la semana, con indicador de día cerrado y nota especial
- **Menú Semanal**: Conjunto de platos disponibles por día para la semana en curso (lunes a viernes)
- **Mensaje de Contacto**: Comunicación entrante de un cliente con nombre, email, teléfono, contenido del mensaje, fecha de envío y estado de lectura

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El administrador puede iniciar sesión y acceder al panel en menos de 10 segundos desde un dispositivo móvil
- **SC-002**: El administrador puede actualizar precios de múltiples ítems y guardar los cambios en menos de 2 minutos
- **SC-003**: El administrador puede publicar el menú semanal completo (5 días) en menos de 5 minutos
- **SC-004**: El 100% de las funcionalidades del panel son operables en dispositivos móviles sin necesidad de hacer zoom ni desplazamiento horizontal accidental
- **SC-005**: El 100% de las acciones de guardado muestran confirmación visual de éxito o mensaje de error claro
- **SC-006**: El badge de mensajes no leídos se actualiza de forma inmediata al marcar un mensaje como leído
- **SC-007**: El 100% de las rutas del panel que requieren autenticación redirigen al login cuando no hay sesión activa

## Assumptions

- El administrador es una única persona (dueño o encargado del negocio); no se requiere gestión de múltiples usuarios administradores
- El administrador accede frecuentemente desde su teléfono celular; el diseño prioriza mobile sobre desktop
- No se requiere sistema de recuperación de contraseña para la v1; el administrador puede contactar soporte técnico si pierde acceso
- Las categorías del menú se crean y eliminan con poca frecuencia
- El menú semanal aplica de lunes a viernes (no incluye fines de semana)
- El total calculado de una solicitud de Pizza Party es calculado automáticamente por el sistema y no es editable manualmente por el administrador
- Los mensajes de contacto no pueden eliminarse, solo marcarse como leídos/no leídos (se preserva el historial completo)
- El panel de administración no es accesible sin autenticación válida; no hay modo de vista de solo lectura público
- La lista de precios descargable refleja siempre el estado actual del menú al momento de la descarga

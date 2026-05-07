# Prompts para Speckit — La Olla

Usá estos prompts en orden en VS Code con GitHub Copilot.
Cada sección indica el comando a correr y el texto a pasarle como contexto.

---

## 1. `/speckit.constitution`

```
Estamos construyendo el sitio web y panel de administración de Rotisería La Olla,
una rotisería en Gualeguaychú, Argentina.

Stack decidido e inamovible:
- Frontend: React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui + React Query (TanStack)
- Backend: Node.js + Express + TypeScript
- ORM: Prisma
- Base de datos: PostgreSQL
- Auth: JWT con email/password (sin Supabase ni terceros)
- Email: Nodemailer
- Generación de imágenes: Sharp (server-side)

Estructura: monorepo con dos carpetas independientes, frontend/ y backend/.

Principios de diseño:
- Mobile-first obligatorio. El sitio llega principalmente desde Instagram.
  El admin también lo usa desde el celular. Todo se diseña en 375px primero.
- Breakpoints: mobile (default), md: (768px+), lg: (1024px+). No usar sm:.
- Inputs numéricos con inputMode="numeric". Botones mínimo 44px de alto.
- Fuentes: mínimo 16px base para que iOS no haga zoom automático.

Convenciones de código:
- Sin comentarios salvo que el WHY sea no obvio.
- Sin any types.
- Sin useEffect para fetch: usar React Query.
- Sin Supabase, Next.js, ni ninguna referencia al código anterior.
- Formularios con React Hook Form + Zod.
- Un solo tailwind.config.ts en frontend/.
- shadcn/ui instalado con CLI corrido desde frontend/.

El REBUILD.md en la raíz tiene el contexto completo del negocio y los datos reales.
```

---

## 2. `/speckit.specify` — Módulo: Base de datos

```
Crear la especificación para el módulo de base de datos del proyecto La Olla.

Este módulo cubre:
- El schema Prisma completo en backend/prisma/schema.prisma
- Las migraciones iniciales
- El seed con datos reales del negocio

Modelos requeridos:

Admin: id, email (unique), passwordHash, createdAt

Category: id, name (unique), slug (unique), sortOrder, relación con MenuItem

MenuItem: id, name, price (Float), categoryId (FK), description?, available (default true),
sortOrder, createdAt, updatedAt. Los items con price=0 son variantes informativas (sabores
de empanada) que se muestran sin precio en la UI pública.

PizzaPartyConfig: tabla de una sola fila. Campos: pricePerPerson, minimumGuests (default 20),
baseHours (default 3), extraHourPrice, mozzoPrice, serviceDetails (texto largo editable).

PizzaPartyRequest: id, name, email, phone, eventDate (DateTime), guests, extraHours (default 0),
extraMozzos (default 0), message?, totalPrice, status (default "pending", valores: pending/confirmed/rejected),
adminNotes?, createdAt.

Offer: id, title, description, badge? (texto corto: "20% OFF"), validFrom, validTo,
active (default true), createdAt.

Schedule: 7 filas fijas (una por día, dayOfWeek unique 0-6). Campos: dayOfWeek (unique),
openTime (String "HH:MM"), closeTime (String "HH:MM"), isOpen, specialNote?.
Estas filas se crean en el seed y nunca se borran, solo se actualizan.

WeeklyMenuDay: id, weekStart (DateTime, lunes de la semana a las 00:00 UTC), dayOfWeek (1-5),
dishes (String[]), unique en [weekStart, dayOfWeek].

ContactMessage: id, name, email, phone?, message, read (default false), createdAt.

Datos del seed:
- Admin: email admin@laolla.com, password "admin123" hasheado con bcrypt
- Categorías: Comidas (sortOrder 1), Pizzas (2), Tartas (3), Empanadas (4), Pastas (5), Guarnición (6)
- Sabores de empanadas como MenuItems con price=0: Carne salada, Carne dulce, Jamón y queso,
  Cebolla y queso, Verdura, Choclo, Pollo, Queso dulce
- Pastas: cada combinación tipo+salsa es un MenuItem. Tipos: Tallarines, Ñoquis, Ravioles, Sorrentinos.
  Salsas: con Salsa, con Bolognesa, con Estofado. Total: 12 items con precios de ejemplo.
- PizzaPartyConfig: una fila con valores de ejemplo
- Schedule: 7 filas (Dom cerrado, Lun-Sáb abierto 11:00-22:00)
```

---

## 3. `/speckit.specify` — Módulo: Backend API pública

```
Crear la especificación para las rutas públicas (sin autenticación) del backend Express
del proyecto La Olla.

Todas las rutas responden JSON. Prefijo: /api/

Rutas a implementar:

GET /api/health
  Respuesta: { status: "ok" }

GET /api/menu
  Devuelve todos los MenuItems con available=true, agrupados por categoría.
  Respuesta: [{ category: { id, name, slug }, items: [{ id, name, price, description }] }]
  Ordenado por Category.sortOrder, luego MenuItem.sortOrder dentro de cada categoría.
  Los items con price=0 se incluyen (son sabores informativos).

GET /api/categories
  Devuelve todas las categorías ordenadas por sortOrder.

GET /api/pizza-party/config
  Devuelve la única fila de PizzaPartyConfig (campos públicos: todos excepto id).

GET /api/offers
  Devuelve Offers donde active=true AND validFrom <= now() AND validTo >= now().
  Ordenadas por createdAt desc.

GET /api/schedule
  Devuelve los 7 días ordenados por dayOfWeek.
  Incluye un campo calculado `isOpenNow: boolean` basado en la hora actual de Argentina (UTC-3).

GET /api/weekly-menu
  Devuelve los WeeklyMenuDays de la semana actual (weekStart = lunes más reciente a 00:00 UTC).
  Si no hay menú cargado para esta semana, devuelve array vacío.

POST /api/pizza-party/request
  Body (validado con Zod): { name, email, phone, eventDate, guests, extraHours, extraMozzos, message? }
  Calcula totalPrice en el backend usando PizzaPartyConfig (no confiar en el total del cliente).
  Guarda el PizzaPartyRequest y envía email al OWNER_EMAIL con los datos del pedido.
  Respuesta: { id, totalPrice }

POST /api/contact
  Body: { name, email, phone?, message }
  Guarda ContactMessage y envía email al OWNER_EMAIL.
  Respuesta: { success: true }

Manejo de errores:
- Zod validation errors → 400 con detalle de campos
- Errores internos → 500 con mensaje genérico (sin exponer stack en producción)
- Middleware de error global en app.ts
```

---

## 4. `/speckit.specify` — Módulo: Backend API admin

```
Crear la especificación para las rutas de administración del backend Express del proyecto La Olla.
Todas requieren JWT válido en header Authorization: Bearer <token>.

Prefijo: /api/admin/

Auth:
POST /api/admin/login
  Body: { email, password }
  Verifica contra tabla Admin con bcrypt.compare.
  Respuesta: { token } (JWT con 7 días de expiración, payload: { adminId, email })

Middleware auth.ts:
  Lee header Authorization, verifica JWT con JWT_SECRET.
  Si inválido → 401. Disponible en request.admin para las rutas protegidas.

Menú:
GET    /api/admin/menu          → todos los items (incluyendo available=false), agrupados por categoría
POST   /api/admin/menu/items    → crear item. Body: { name, price, categoryId, description?, available?, sortOrder? }
PATCH  /api/admin/menu/items/:id → actualizar campos parciales de un item
DELETE /api/admin/menu/items/:id → eliminar item
PATCH  /api/admin/menu/prices   → actualizar precios en bulk. Body: [{ id, price }]. Usa Promise.all.

Categorías:
GET    /api/admin/categories         → listar todas
POST   /api/admin/categories         → crear. Body: { name, slug, sortOrder? }
PATCH  /api/admin/categories/:id     → actualizar nombre/slug/sortOrder
DELETE /api/admin/categories/:id     → eliminar (solo si no tiene items asociados, sino 409)

Pizza Party:
GET   /api/admin/pizza-party/config         → ver config actual
PATCH /api/admin/pizza-party/config         → actualizar config (campos parciales)
GET   /api/admin/pizza-party/requests       → listar solicitudes, ordenadas por createdAt desc
                                              Query params opcionales: status=pending|confirmed|rejected
PATCH /api/admin/pizza-party/requests/:id   → actualizar status y/o adminNotes

Ofertas:
GET    /api/admin/offers       → todas (activas e inactivas)
POST   /api/admin/offers       → crear. Body: { title, description, badge?, validFrom, validTo, active? }
PATCH  /api/admin/offers/:id   → actualizar campos parciales
DELETE /api/admin/offers/:id   → eliminar

Horarios:
GET   /api/admin/schedule      → los 7 días
PATCH /api/admin/schedule      → actualizar todos. Body: [{ dayOfWeek, openTime, closeTime, isOpen, specialNote? }]
                                  Usa upsert por dayOfWeek.

Menú semanal:
GET /api/admin/weekly-menu          → semana actual (igual que ruta pública)
PUT /api/admin/weekly-menu          → reemplazar semana actual completa.
                                      Body: [{ dayOfWeek, dishes: string[] }] (días 1-5)
                                      Calcula weekStart como el lunes de la semana actual.
                                      Usa upsert por [weekStart, dayOfWeek].

Mensajes de contacto:
GET   /api/admin/contact           → todos los mensajes, ordenados por createdAt desc
PATCH /api/admin/contact/:id/read  → marcar como leído. Body: { read: true }
GET   /api/admin/contact/unread-count → { count: number }

Generación de imagen de lista de precios:
GET /api/admin/price-list/image
  Genera un PNG con la lista de precios actual usando Sharp.
  Construye un SVG programáticamente con los items del menú agrupados por categoría.
  El logo del negocio se embebe como base64 en el SVG.
  Responde con Content-Type: image/png y el buffer como body.
  El frontend lo descarga con un link dinámico (URL.createObjectURL).
```

---

## 5. `/speckit.specify` — Módulo: Frontend Core

```
Crear la especificación para la infraestructura base del frontend React del proyecto La Olla.

Este módulo cubre lo que todas las páginas usan: configuración, routing, fetching, layout.

React Query setup (frontend/src/lib/queryClient.ts):
  QueryClient con staleTime: 1000 * 60 * 5 (5 minutos).
  QueryClientProvider en main.tsx wrapeando toda la app.

API client base (frontend/src/lib/api.ts):
  Función base fetch que:
  - Prefija todas las URLs con import.meta.env.VITE_API_URL
  - En rutas admin: lee el JWT de localStorage y agrega header Authorization: Bearer <token>
  - Lanza error si response.ok === false, con el mensaje del body JSON

Auth hook (frontend/src/hooks/useAuth.ts):
  - login(email, password): llama a POST /api/admin/login, guarda token en localStorage, redirige a /admin/panel
  - logout(): borra token de localStorage, redirige a /admin
  - isAuthenticated: boolean (hay token en localStorage y no está expirado — parsear el JWT sin librería)

Schedule hook (frontend/src/hooks/useCurrentSchedule.ts):
  - useQuery a GET /api/schedule
  - Devuelve isOpenNow: boolean y el schedule completo

Routing (frontend/src/App.tsx):
  Rutas públicas: / /menu /viandas /pizza-party /contacto
  Rutas admin: /admin (login), /admin/panel (protegida)
  ProtectedRoute: si no hay token válido, redirige a /admin

Layout (frontend/src/components/layout/Layout.tsx):
  - Navbar con logo local (public/logo.png), nombre "La Olla", hamburger en mobile
  - Links: Inicio, Menú, Viandas, Pizza Party, Contacto
  - Footer con dirección, teléfono, links reales a Facebook e Instagram, link a WhatsApp
  - WhatsAppButton: botón flotante bottom-right, abre https://wa.me/543446410459
  - El Layout no se usa en /admin ni /admin/panel (esas páginas tienen su propio layout)

Navbar mobile:
  - Hamburger abierto = menú desplegable con los 5 links
  - Se cierra al navegar
  - Sin animación compleja, solo show/hide con transition-all

Convenciones UI globales:
  - Colores primarios: verde (green-800 para header/footer), rojo (red-600 para CTAs)
  - Hover en links del nav: text-yellow-400
  - Fuente base: 16px mínimo
  - Todos los botones touch-friendly: min-h-[44px]
```

---

## 6. `/speckit.specify` — Módulo: Páginas públicas

```
Crear la especificación para las 5 páginas públicas del sitio de La Olla.
Todas mobile-first, diseñadas en 375px primero.

--- PÁGINA: Home (/) ---

Sección 1 — Hero:
  Fondo: imagen de fondo con overlay oscuro (una de las fotos de comida de /assets/).
  Contenido centrado: logo, "Rotisería La Olla", subtítulo, dos CTAs: "Ver Menú" → /menu y "Pizza Party" → /pizza-party.
  Alto: 100vh en mobile, 80vh en desktop.

Sección 2 — Horarios:
  Datos de GET /api/schedule con React Query.
  Si está abierto ahora: badge verde "Abierto ahora". Si no: badge rojo "Cerrado".
  Tabla/lista de días con horario. Si isOpen=false para el día: mostrar "Cerrado".
  Si hay specialNote: mostrarla debajo del horario del día.

Sección 3 — Especialidades:
  3 cards en columna (mobile) / fila de 3 (md+).
  Card 1: foto chuletaconpapas.jpeg → "Comidas Caseras" → /menu
  Card 2: foto pizzapalmitos.jpeg → "Pizzas Artesanales" → /menu
  Card 3: foto pizzaparty2.jpeg → "Pizza Party" → /pizza-party
  Cada card tiene imagen, título, descripción breve, link.

Sección 4 — Ofertas:
  Datos de GET /api/offers con React Query.
  Si no hay ofertas activas, NO mostrar la sección (ni el título).
  Si hay: título "Ofertas", cards por oferta con badge, título, descripción, fecha de vigencia.

Sección 5 — CTA Pizza Party:
  Banner con foto de fondo (pizzaparty.jpg), overlay oscuro.
  Texto: "Hacé tu Pizza Party con nosotros" + CTA → /pizza-party.

--- PÁGINA: Menú (/menu) ---

Datos de GET /api/menu con React Query.
Tabs de categorías horizontales scrolleables en mobile (sin wrapping).
Por defecto muestra la primera categoría.
Cada categoría: lista de items con nombre y precio a la derecha.
Items con price=0: se muestran en una sublista titulada "Variedades disponibles" sin precio.
Sin imágenes por item.
Indicador de horario (reusar useCurrentSchedule).

--- PÁGINA: Viandas (/viandas) ---

Sección 1 — Cómo funciona: texto + íconos (Calendar, Clock). Estático.
Sección 2 — Menú de la semana:
  Datos de GET /api/weekly-menu con React Query.
  Si hay datos: Accordion (shadcn) con un item por día (Lun-Vie), dentro la lista de platos.
  Si no hay datos: card con mensaje "Consultá el menú de esta semana por WhatsApp" + botón que abre wa.me link.
Sección 3 — Beneficios: lista estática.
Sección 4 — CTA: botón a /contacto o WhatsApp.

--- PÁGINA: Pizza Party (/pizza-party) ---

Sección 1 — Carousel de fotos:
  4 imágenes de /assets/ (pizzaparty.jpg, pizzaparty2.jpeg, pizzaparty3.jpeg, pizzaparty4.jpeg).
  Auto-avanza cada 5s. Botones prev/next. Dots indicadores.
  En mobile: ocupa el ancho completo, relación 4:3.

Sección 2 — Descripción del servicio:
  Datos de GET /api/pizza-party/config (campo serviceDetails).
  Incluye/no incluye/extras: hardcodeados (no van a cambiar seguido).
  Incluye: empanadas de copetín, 13 variedades de pizza, horno móvil, vajilla, 3 horas.
  No incluye: bebidas, mesas, sillas, vasos.
  Extras: hora adicional, mozos adicionales.

Sección 3 — Calculadora de precio (componente PriceCalculator):
  Datos de GET /api/pizza-party/config con React Query.
  Inputs:
    - Cantidad de invitados: input numérico (inputMode="numeric"), mínimo = config.minimumGuests
    - Horas extra: selector 0 / 1 / 2 horas adicionales (encima de las 3 base)
    - Mozos adicionales: input numérico (inputMode="numeric"), mínimo 0
  Cálculo en tiempo real:
    total = (guests * pricePerPerson) + (extraHours * extraHourPrice) + (extraMozzos * mozzoPrice)
  Mostrar el total grande y destacado.
  CTA: "Solicitar este servicio" → scroll a formulario de abajo.

Sección 4 — Formulario de solicitud (componente RequestForm):
  React Hook Form + Zod.
  Campos: Nombre, Email, Teléfono, Fecha del evento (date input), Mensaje (opcional).
  Los valores de guests/extraHours/extraMozzos se pre-llenan desde la calculadora (estado compartido o props).
  Submit → POST /api/pizza-party/request.
  Toast de éxito: "¡Solicitud enviada! Te contactamos pronto."
  Toast de error: "Hubo un error. Contactanos por WhatsApp."

--- PÁGINA: Contacto (/contacto) ---

Sección 1 — Info de contacto:
  Ícono Phone: 3446-410459
  Ícono MapPin: Doello Jurado 1050, Gualeguaychú
  Links reales: Facebook (https://www.facebook.com/profile.php?id=100054471429554),
                Instagram (https://www.instagram.com/rotiserialaolla/)

Sección 2 — Formulario funcional:
  React Hook Form + Zod.
  Campos: Nombre (required), Email (required, format), Teléfono (opcional), Mensaje (required, min 10 chars).
  Submit → POST /api/contact.
  Toast de éxito: "Mensaje enviado. Te respondemos pronto."
  Toast de error genérico.
  Deshabilitar botón de submit mientras loading.

Sección 3 — Mapa:
  Iframe de Google Maps embed de Rotisería La Olla (Doello Jurado 1050, Gualeguaychú).
  Ancho 100%, alto 300px en mobile, 450px en desktop.
```

---

## 7. `/speckit.specify` — Módulo: Panel de administración

```
Crear la especificación para el login y panel de administración del proyecto La Olla.
El admin accede desde el celular frecuentemente. Todo debe ser usable en mobile.

--- PÁGINA: Admin Login (/admin) ---

Formulario centrado en pantalla.
Logo del negocio arriba.
Campos: Email, Contraseña.
Submit → usa hook useAuth.login(email, password).
Si error: mostrar mensaje "Email o contraseña incorrectos".
Si no hay error: redirige automáticamente a /admin/panel.
Si ya hay token válido: redirigir directo a /admin/panel sin mostrar el form.

--- PÁGINA: Panel (/admin/panel) ---

Layout propio (sin el Layout público). Header con logo, nombre "Panel de Administración", botón "Cerrar sesión".
Navegación por tabs (shadcn Tabs). En mobile: tabs scrolleables horizontalmente.

Tabs:

1. MENÚ
  - Lista de items agrupados por categoría.
  - Cada item: nombre editable (input), precio editable (input numérico), toggle available, botón eliminar.
  - Botón "Guardar cambios de precio" (bulk update) que habilita solo cuando hay cambios pendientes.
  - Formulario inline para agregar nuevo item: nombre, precio, categoría (select), descripción opcional.
  - Sección de categorías: lista con botón eliminar (deshabilitado si tiene items), input para crear nueva.
  - Botón "Descargar lista de precios" → GET /api/admin/price-list/image, descarga el PNG.

2. PIZZA PARTY
  Sub-tab A — Configuración:
    Formulario con los campos de PizzaPartyConfig: precio por persona, mínimo de invitados,
    hora extra, precio mozo, texto de descripción del servicio (textarea).
    Guardar → PATCH /api/admin/pizza-party/config.
  Sub-tab B — Solicitudes:
    Lista de PizzaPartyRequests ordenadas por fecha desc.
    Cada solicitud: nombre, email, teléfono, fecha del evento, invitados, total calculado, status.
    Selector de status: pending/confirmed/rejected.
    Campo de notas internas (textarea).
    Guardar → PATCH /api/admin/pizza-party/requests/:id.
    Filtro por status en la parte superior.

3. OFERTAS
  Lista de Offers con título, badge, fechas, toggle active.
  Botón eliminar.
  Formulario para crear nueva oferta: título, descripción, badge (opcional), fecha desde, fecha hasta, activa.
  Al guardar, la lista se actualiza sin recargar la página.

4. HORARIOS
  Tabla de 7 días (Dom-Sáb).
  Por día: nombre del día, toggle isOpen, inputs openTime/closeTime (deshabilitados si isOpen=false),
  input specialNote.
  Un solo botón "Guardar horarios" al pie que manda los 7 días juntos.
  → PATCH /api/admin/schedule.

5. MENÚ SEMANAL
  Muestra la semana actual (Lun-Vie).
  Por día: lista de platos (textarea o lista editable con add/remove por plato).
  Botón "Publicar menú de esta semana" → PUT /api/admin/weekly-menu.
  Mensaje de ayuda: si no hay menú esta semana, mostrar aviso.

6. MENSAJES
  Lista de ContactMessages ordenados por fecha desc.
  Badge rojo con conteo de no leídos en el tab.
  Cada mensaje: nombre, email, teléfono, mensaje completo, fecha.
  Botón "Marcar como leído" / "Marcar como no leído".
  Botón "Responder por email" → abre mailto: con el email del remitente pre-cargado.
```

---

## Orden de ejecución recomendado

Correr estos prompts en secuencia, esperando que speckit genere cada spec antes de seguir:

1. `/speckit.constitution` → prompt 1
2. `/speckit.specify` → prompt 2 (Base de datos)
3. `/speckit.specify` → prompt 3 (API pública)
4. `/speckit.specify` → prompt 4 (API admin)
5. `/speckit.specify` → prompt 5 (Frontend core)
6. `/speckit.specify` → prompt 6 (Páginas públicas)
7. `/speckit.specify` → prompt 7 (Panel admin)
8. `/speckit.plan` → sin prompt extra, deja que lea los specs generados
9. `/speckit.tasks` → sin prompt extra
10. `/speckit.implement` → por módulo, en orden

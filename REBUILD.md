# La Olla — Reconstrucción desde cero

Rotisería La Olla, Gualeguaychú. Sitio web + panel de administración.

## Por qué se rehace

El código anterior fue generado con v0.dev y parcheado sin entender la base. Problemas irrecuperables: Next.js instalado en un proyecto Vite, Supabase como único backend sin control de lógica, formularios sin handler, features comentadas, logo hardcodeado a una URL externa de Vercel que puede desaparecer, doble carpeta de components, dos configs de Tailwind en conflicto.

Se borra todo y se rehace bien, con backend propio.

## Stack

- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui + React Query
- **Backend:** Node.js + Express + TypeScript + Prisma ORM
- **Base de datos:** PostgreSQL
- **Auth:** JWT (email/password, sin Supabase)
- **Email:** Nodemailer
- **Generación de imágenes:** Sharp (server-side, reemplaza html2canvas)

## Principio de diseño: Mobile-First

El sitio llega principalmente desde Instagram en celular. El admin también lo usa desde el celular. Cada componente se diseña en 375px primero y se escala hacia arriba. Sin excepciones.

## Módulos

| # | Módulo | Archivo |
|---|--------|---------|
| 01 | Setup e infraestructura | [specs/01-setup.md](specs/01-setup.md) |
| 02 | Base de datos | [specs/02-database.md](specs/02-database.md) |
| 03 | Backend — API pública | [specs/03-backend-public-api.md](specs/03-backend-public-api.md) |
| 04 | Backend — API admin | [specs/04-backend-admin-api.md](specs/04-backend-admin-api.md) |
| 05 | Frontend — Core | [specs/05-frontend-core.md](specs/05-frontend-core.md) |
| 06 | Frontend — Páginas públicas | [specs/06-frontend-public-pages.md](specs/06-frontend-public-pages.md) |
| 07 | Frontend — Panel admin | [specs/07-frontend-admin.md](specs/07-frontend-admin.md) |

## Assets disponibles

Las imágenes reales del negocio están en `/assets/`:
- `logolaolla.ico` — logo del negocio (conseguir versión PNG)
- `chuletaconpapas.jpeg`, `empanadas.jpg`, `carneensalada.jpg`, `napoconpapas.jpg`, `noquisestofado.jpg` — fotos de comidas
- `pizzapalmitos.jpeg` — pizza con palmitos
- `pizzaparty.jpg`, `pizzaparty2.jpeg`, `pizzaparty3.jpeg`, `pizzaparty4.jpeg` — fotos del servicio de pizza party

## Información del negocio

- **Nombre:** Rotisería La Olla
- **Dirección:** Doello Jurado 1050, Gualeguaychú
- **Teléfono / WhatsApp:** +54 3446 410459 → `https://wa.me/543446410459`
- **Facebook:** `https://www.facebook.com/profile.php?id=100054471429554`
- **Instagram:** `https://www.instagram.com/rotiserialaolla/`
- **Google Maps embed:** el iframe de `Contact.tsx` anterior funcionaba bien, reutilizar

## Categorías del menú (datos reales)

- Comidas (platos principales del día)
- Pizzas
- Tartas
- Empanadas (sabores: Carne salada, Carne dulce, Jamón y queso, Cebolla y queso, Verdura, Choclo, Pollo, Queso dulce)
- Pastas (tipos: Tallarines, Ñoquis, Ravioles, Sorrentinos × salsas: con Salsa, con Bolognesa, con Estofado)
- Guarnición

## Pizza Party — info real del servicio

**Incluye:** empanadas de copetín de entrada, 13 variedades de pizza, horno móvil, platos/servilletas/cubiertos, 3 horas de duración  
**No incluye:** bebidas, mesas, sillas, vasos  
**Extras:** hora adicional, mozos adicionales

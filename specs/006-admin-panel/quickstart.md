# Quickstart: Admin Panel

**Branch**: `006-admin-panel`

## Prerequisites

- PostgreSQL running with the database seeded (`cd backend && npx prisma db seed`)
- Backend running: `cd backend && npm run dev` (port 3000)
- Frontend running: `cd frontend && npm run dev` (port 5173)

## shadcn Switch component

Before implementing, add the Switch component (run from inside `frontend/`):

```bash
cd frontend
npx shadcn@latest add switch
```

This creates `frontend/src/components/ui/switch.tsx`.

## Smoke Test

### 1. Login redirect-if-authenticated

1. Ensure no token in localStorage (open DevTools → Application → Local Storage → delete `laolla_token`)
2. Navigate to `http://localhost:5173/admin`
3. Should see the login form
4. Enter valid admin credentials (from seed: `admin@laolla.com` / check `backend/prisma/seed.ts` for the password)
5. After submit → should redirect to `/admin/panel`
6. Navigate back to `/admin` → should redirect straight to `/admin/panel` (no login form shown)

### 2. Panel loads all tabs

1. At `/admin/panel`, verify 6 tabs are visible: Menú, Pizza Party, Ofertas, Horarios, Menú Semanal, Mensajes
2. On a narrow viewport (375px in DevTools), verify tabs scroll horizontally without wrapping

### 3. Menu tab

1. Verify items appear grouped by category
2. Change a price → "Guardar cambios de precio" button enables
3. Save → toast de éxito, button disables
4. Add a new item → appears in the list
5. Toggle available on an item → PATCH fires, toast shown
6. Delete an item → inline confirm appears → confirm → item removed

### 4. Pizza Party tab

1. Config sub-tab: change `pricePerPerson` → save → toast
2. Solicitudes sub-tab: if seed data exists, filter by status works
3. Expand a request → change status → save → toast

### 5. Offers tab

1. Create an offer with dates and badge → appears instantly in list
2. Toggle active → updates
3. Delete → inline confirm → removed

### 6. Schedule tab

1. All 7 days visible
2. Mark a day as closed → openTime/closeTime inputs disable
3. "Guardar horarios" → saves all 7 at once → toast

### 7. Weekly menu tab

1. If no menu for current week → aviso visible
2. Enter dishes in each day's textarea (one per line) → "Publicar menú" → toast
3. Reload → dishes pre-filled from saved data

### 8. Messages tab

1. Badge with unread count visible on the tab (if unread messages exist)
2. Expand a message → "Marcar como leído" → badge count decreases
3. "Marcar como no leído" → badge count increases
4. "Responder por email" → opens email client with recipient pre-filled

### 9. Logout

- "Cerrar sesión" button → redirects to `/admin` → login form visible

## Seed admin credentials

Check `backend/prisma/seed.ts` for the seeded admin email and password. The password is hashed with bcrypt; use the plain-text version from the seed script.

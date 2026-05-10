# Quickstart: 5 Public Pages — La Olla Website

**Branch**: `005-public-pages` | **Date**: 2026-05-09

## Prerequisites

- Feature 004 (React Frontend Infrastructure) fully implemented — `frontend/` is scaffolded with routing, layout, hooks, and stub pages.
- Feature 002 (Public API Routes) fully implemented — backend serves all required endpoints.
- `frontend/` dependencies already installed (`node_modules/` present).
- PostgreSQL running locally and seeded (per feature 001 / backend README).

## Step 1 — Copy image assets

From the repo root:

```bash
cp assets/chuletaconpapas.jpeg frontend/public/assets/
cp assets/pizzapalmitos.jpeg    frontend/public/assets/
cp assets/pizzaparty.jpg        frontend/public/assets/
cp assets/pizzaparty2.jpeg      frontend/public/assets/
cp assets/pizzaparty3.jpeg      frontend/public/assets/
cp assets/pizzaparty4.jpeg      frontend/public/assets/
```

Verify they are accessible at `http://localhost:5173/assets/pizzaparty.jpg` after starting the dev server.

## Step 2 — Install shadcn/ui components

Run from inside `frontend/`:

```bash
cd frontend
npx shadcn add accordion
npx shadcn add badge
npx shadcn add tabs
npx shadcn add sonner
```

Each command adds the component to `frontend/src/components/ui/`.

## Step 3 — Add Toaster to layout

In `frontend/src/components/layout/Layout.tsx` (or `App.tsx`), import and render `<Toaster />` from `sonner` once:

```tsx
import { Toaster } from '@/components/ui/sonner'

// Inside the JSX:
<Toaster richColors position="top-right" />
```

## Step 4 — Start the dev server

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:3000`

## Step 5 — Smoke test checklist

Visit each URL and verify:

### Home (`/`)
- [ ] Hero section visible, full viewport height on mobile
- [ ] Schedule section shows either green "Abierto ahora" or red "Cerrado" badge
- [ ] Day table lists Mon–Sun with hours or "Cerrado"
- [ ] Three specialty cards (Comidas Caseras, Pizzas Artesanales, Pizza Party)
- [ ] Offers section: visible if active offers exist in DB, hidden if none
- [ ] Pizza Party CTA banner visible at bottom

### Menú (`/menu`)
- [ ] Category tabs render and are horizontally scrollable on 375px
- [ ] Clicking a tab filters items correctly
- [ ] Items with price > 0 show name + price
- [ ] Items with price = 0 appear in "Variedades disponibles" sub-list
- [ ] Schedule open/closed indicator visible

### Viandas (`/viandas`)
- [ ] "Cómo funciona" section with Calendar + Clock icons
- [ ] If weekly menu seeded: accordion with Mon–Fri entries
- [ ] If no weekly menu: WhatsApp fallback card visible
- [ ] Benefits list visible
- [ ] CTA button at bottom

### Pizza Party (`/pizza-party`)
- [ ] Carousel shows 4 images, auto-advances every 5s
- [ ] Prev/next buttons work; dots update
- [ ] Included / not included / extras lists visible
- [ ] Price calculator: changing guests/hours/mozos updates total in real time
- [ ] Minimum guest enforcement works
- [ ] "Solicitar este servicio" scrolls to form
- [ ] Form pre-fills from calculator values
- [ ] Submit form → success toast appears (backend must be running)
- [ ] Force a network error → error toast appears

### Contacto (`/contacto`)
- [ ] Phone, address, Facebook link, Instagram link visible
- [ ] Contact form: empty submit → validation errors appear
- [ ] Submit with valid data → success toast appears
- [ ] Map iframe loads and shows correct location
- [ ] Map is 300px tall on mobile

## Common Issues

**Images not loading (404)**: Ensure files were copied to `frontend/public/assets/` (not `frontend/src/assets/`).

**shadcn component not found**: Make sure you ran `npx shadcn add <component>` from inside `frontend/`, not from the repo root.

**API calls failing (CORS or 404)**: Check that `VITE_API_URL` is set in `frontend/.env.local` if the backend runs on a different port, or leave it empty to use the proxy/same-origin default.

**Toast not appearing**: Verify `<Toaster />` is rendered in the layout and `sonner` is installed.

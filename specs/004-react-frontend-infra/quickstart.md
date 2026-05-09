# Quickstart: React Frontend Infrastructure

**Branch**: `004-react-frontend-infra`

## Prerequisites

- Node.js 20+ installed
- Backend running on `http://localhost:3000` (see `backend/` setup)
- Repo root: `/Users/ignaciohaffner/repos/la-olla-landing`

---

## 1. Scaffold the Frontend

From the **repo root**:

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
```

## 2. Install Dependencies

```bash
# Core routing and server state
npm install react-router-dom @tanstack/react-query

# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# shadcn/ui initialization (run from within frontend/)
npx shadcn@latest init
```

Follow the shadcn/ui prompts:
- Style: Default
- Base color: neutral or green (adjust to match La Olla palette)
- CSS variables: Yes

## 3. Environment Variables

Create `frontend/.env.local` (gitignored):

```env
VITE_API_URL=http://localhost:3000
```

The committed `frontend/.env.example` contains:

```env
VITE_API_URL=http://localhost:3000
```

## 4. Run the Development Server

```bash
# From frontend/
npm run dev
```

App available at `http://localhost:5173`.

## 5. Smoke Tests

### 5.1 Public navigation
1. Open `http://localhost:5173`
2. Verify Navbar shows logo, "La Olla", and five nav links
3. Click each link — all routes render without crash
4. On mobile viewport (375px): hamburger appears; tapping it shows dropdown; tapping a link navigates and closes menu

### 5.2 Protected route redirect
1. Visit `http://localhost:5173/admin/panel` in a fresh session (no token in localStorage)
2. Verify automatic redirect to `http://localhost:5173/admin`

### 5.3 Auth flow
1. Start backend (`cd backend && npm run dev`)
2. Visit `http://localhost:5173/admin`
3. Submit valid admin credentials (seeded: `admin@laolla.com` / password from `backend/.env`)
4. Verify redirect to `/admin/panel`
5. Click logout
6. Verify redirect to `/admin` and that `/admin/panel` redirects back again

### 5.4 Schedule hook
1. On any public page, open browser DevTools → Network
2. Verify a request to `GET /api/schedule` succeeds (200)
3. Wait 30 seconds and navigate — no duplicate request within the 5-minute stale window
4. `useCurrentSchedule().isOpenNow` should match current time vs. seeded schedule

### 5.5 WhatsApp button
1. On any public page, verify the floating WhatsApp button is visible in the bottom-right corner
2. Tap/click it — verify `https://wa.me/543446410459` opens in a new tab

### 5.6 Admin pages have no Navbar/Footer
1. Visit `/admin` and `/admin/panel` (after login)
2. Verify the green Navbar and Footer do NOT appear on these pages

---

## File Structure After Completion

```
frontend/
├── .env.example
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── types/
    │   └── index.ts
    ├── lib/
    │   ├── api.ts
    │   └── queryClient.ts
    ├── hooks/
    │   ├── useAuth.ts
    │   └── useCurrentSchedule.ts
    ├── components/
    │   ├── ProtectedRoute.tsx
    │   ├── layout/
    │   │   ├── Layout.tsx
    │   │   ├── Navbar.tsx
    │   │   ├── Footer.tsx
    │   │   └── WhatsAppButton.tsx
    │   └── ui/          ← shadcn/ui components land here
    └── pages/
        ├── HomePage.tsx
        ├── MenuPage.tsx
        ├── ViandasPage.tsx
        ├── PizzaPartyPage.tsx
        ├── ContactoPage.tsx
        ├── admin/
        │   ├── LoginPage.tsx
        │   └── PanelPage.tsx
```

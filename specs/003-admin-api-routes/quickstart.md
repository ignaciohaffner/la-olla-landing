# Quickstart: Admin API Routes

**Feature**: 003-admin-api-routes
**Date**: 2026-05-09
**Prerequisites**: Feature 001 (database) and 002 (public routes) must be complete.

---

## New Dependencies

Install before implementation:

```bash
cd backend
npm install jsonwebtoken sharp
npm install --save-dev @types/jsonwebtoken
```

`bcrypt` and `@types/bcrypt` are already installed from the public routes feature.

---

## Environment Variables

Add to `backend/.env`:

```env
JWT_SECRET=your-secret-key-here-change-in-production
```

`DATABASE_URL` is already set from the previous feature.

---

## File Structure

New files for this feature (all inside `backend/src/`):

```text
backend/src/
├── middleware/
│   └── auth.ts                          # JWT verification middleware (new)
├── routes/
│   ├── admin/
│   │   ├── index.ts                     # Admin router barrel (new)
│   │   ├── menu.ts                      # Menu + prices routes (new)
│   │   ├── categories.ts                # Category routes (new)
│   │   ├── pizzaParty.ts                # Pizza party config + requests (new)
│   │   ├── offers.ts                    # Offers routes (new)
│   │   ├── schedule.ts                  # Schedule routes (new)
│   │   ├── weeklyMenu.ts                # Weekly menu routes (new)
│   │   ├── contact.ts                   # Contact message routes (new)
│   │   └── priceList.ts                 # Price list image route (new)
│   └── [existing public routes]
├── controllers/
│   ├── admin/
│   │   ├── auth.controller.ts           # Login handler (new)
│   │   ├── menu.controller.ts           # Admin menu handlers (new)
│   │   ├── categories.controller.ts     # Category handlers (new)
│   │   ├── pizzaParty.controller.ts     # Pizza party handlers (new)
│   │   ├── offers.controller.ts         # Offer handlers (new)
│   │   ├── schedule.controller.ts       # Schedule handlers (new)
│   │   ├── weeklyMenu.controller.ts     # Weekly menu handlers (new)
│   │   ├── contact.controller.ts        # Contact message handlers (new)
│   │   └── priceList.controller.ts      # Price list image handler (new)
│   └── [existing public controllers]
├── repositories/
│   ├── [existing repos — extended with admin methods]
│   └── admin.repository.ts             # Any admin-only queries (new if needed)
└── assets/
    └── logo.png                         # Business logo for price list image (add manually)
```

---

## app.ts Integration

Add to `backend/src/app.ts`:

```ts
import adminLoginRouter from './routes/admin/auth'   // unprotected
import adminRouter from './routes/admin/index'        // protected
import { authMiddleware } from './middleware/auth'

// After public routes:
app.post('/api/admin/login', loginController)
app.use('/api/admin', authMiddleware, adminRouter)
```

---

## Auth Middleware Pattern

`src/middleware/auth.ts`:
```ts
// Reads Authorization: Bearer <token>
// Sets req.admin = { adminId, email } on success
// Returns 401 if token missing, malformed, or expired
```

TypeScript: extend Express `Request` type in `src/types/express.d.ts` or `src/@types/express/index.d.ts`:
```ts
declare namespace Express {
  interface Request {
    admin?: { adminId: number; email: string };
  }
}
```

---

## Price List Image: Logo Setup

Place the business logo at `backend/src/assets/logo.png` before running.

The handler reads this file once at startup, converts to base64, and embeds in the SVG.
If the file doesn't exist, the image is generated without a logo.

---

## Smoke Test Sequence

```bash
# 1. Start server
cd backend && npm run dev

# 2. Login
TOKEN=$(curl -s -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@laolla.com","password":"admin123"}' | jq -r .token)

# 3. Verify auth works
curl http://localhost:3000/api/admin/menu \
  -H "Authorization: Bearer $TOKEN"

# 4. Test auth rejection
curl http://localhost:3000/api/admin/menu
# Expect: 401

# 5. Download price list
curl http://localhost:3000/api/admin/price-list/image \
  -H "Authorization: Bearer $TOKEN" \
  --output price-list.png
```

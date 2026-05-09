# Quickstart: Public API Routes

**Feature**: 002-public-api-routes  
**Date**: 2026-05-07

## Prerequisites

- Node.js 20 LTS installed
- PostgreSQL running with `DATABASE_URL` set in `backend/.env`
- Database migrated and seeded (feature `001-database-schema` complete)

## 1. Install new dependencies

```bash
cd backend
npm install express zod nodemailer
npm install --save-dev @types/express @types/nodemailer
```

## 2. Configure environment variables

Add to `backend/.env`:

```env
# Server
PORT=3000
NODE_ENV=development

# Email (SMTP)
OWNER_EMAIL=owner@laolla.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password
```

For development without email delivery, leave `OWNER_EMAIL` unset — requests will still succeed
and a warning will be logged.

## 3. Run the server

```bash
cd backend
npx ts-node src/index.ts
```

Server starts on `http://localhost:3000`.

## 4. Smoke test all endpoints

```bash
# Health
curl http://localhost:3000/api/health

# Menu
curl http://localhost:3000/api/menu

# Categories
curl http://localhost:3000/api/categories

# Pizza Party config
curl http://localhost:3000/api/pizza-party/config

# Offers
curl http://localhost:3000/api/offers

# Schedule (with isOpenNow)
curl http://localhost:3000/api/schedule

# Weekly menu
curl http://localhost:3000/api/weekly-menu

# Pizza party request
curl -X POST http://localhost:3000/api/pizza-party/request \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","phone":"1234","eventDate":"2026-07-01","guests":25,"extraHours":0,"extraMozzos":1}'

# Contact
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Hola"}'
```

## 5. Verify `isOpenNow` logic

`GET /api/schedule` should return `isOpenNow: true` for today's row if the current
Argentina time (UTC-3) is within `openTime`–`closeTime` and `isOpen = true`.

Check during business hours (11:00–22:00 Argentina time, Mon–Sat based on seed data).

## 6. Test validation errors

```bash
# Missing required field → 400
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"not-an-email"}'

# Expected response:
# { "error": "Validation error", "fields": [...] }
```

# Quickstart: Database Schema & Seed

## Prerequisites

- Docker (for the PostgreSQL instance)
- Node.js 20+
- `backend/.env` with `DATABASE_URL` set

## Setup steps

```bash
# 1. Start PostgreSQL (repo root)
docker compose up -d

# 2. Enter the backend project
cd backend

# 3. Install dependencies (first time only)
npm install

# 4. Run migrations
npx prisma migrate dev --name init

# 5. Run seed
npx prisma db seed
```

## Verify

```bash
# Open Prisma Studio to inspect data
npx prisma studio

# Or run a quick SQL check
psql $DATABASE_URL -c "SELECT COUNT(*) FROM \"Category\";"
# Expected: 6
```

## Reset (dev only)

```bash
# Wipe and re-seed (destroys all data)
npx prisma migrate reset
```

## Environment variable

```env
# backend/.env  (credentials match docker-compose.yml)
DATABASE_URL="postgresql://laolla:laolla_dev@localhost:5432/laolla_dev"
```

## Idempotency

Running `npx prisma db seed` multiple times is safe. All seed operations use `upsert`
and produce the same final state.

# Data Model: Database Schema & Seed

**Branch**: `001-database-schema` | **Date**: 2026-05-07

## Prisma Schema

File: `backend/prisma/schema.prisma`

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ─── Auth ──────────────────────────────────────────────────────────────────

model Admin {
  id           Int      @id @default(autoincrement())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
}

// ─── Menu ──────────────────────────────────────────────────────────────────

model Category {
  id        Int        @id @default(autoincrement())
  name      String     @unique
  slug      String     @unique
  sortOrder Int
  items     MenuItem[]
}

model MenuItem {
  id          Int      @id @default(autoincrement())
  name        String
  price       Float
  categoryId  Int
  category    Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  description String?
  available   Boolean  @default(true)
  sortOrder   Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// ─── Pizza Party ───────────────────────────────────────────────────────────

model PizzaPartyConfig {
  id             Int    @id @default(1)
  pricePerPerson Float
  minimumGuests  Int    @default(20)
  baseHours      Int    @default(3)
  extraHourPrice Float
  mozzoPrice     Float
  serviceDetails String
}

enum PizzaPartyStatus {
  pending
  confirmed
  rejected
}

model PizzaPartyRequest {
  id          Int              @id @default(autoincrement())
  name        String
  email       String
  phone       String
  eventDate   DateTime
  guests      Int
  extraHours  Int              @default(0)
  extraMozzos Int              @default(0)
  message     String?
  totalPrice  Float
  status      PizzaPartyStatus @default(pending)
  adminNotes  String?
  createdAt   DateTime         @default(now())
}

// ─── Offers ────────────────────────────────────────────────────────────────

model Offer {
  id          Int      @id @default(autoincrement())
  title       String
  description String
  badge       String?
  validFrom   DateTime
  validTo     DateTime
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
}

// ─── Operations ────────────────────────────────────────────────────────────

model Schedule {
  dayOfWeek   Int     @id
  openTime    String
  closeTime   String
  isOpen      Boolean
  specialNote String?
}

model WeeklyMenuDay {
  id        Int      @id @default(autoincrement())
  weekStart DateTime
  dayOfWeek Int
  dishes    String[]

  @@unique([weekStart, dayOfWeek])
}

model ContactMessage {
  id        Int      @id @default(autoincrement())
  name      String
  email     String
  phone     String?
  message   String
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

## Entity Relationships

```
Category (1) ──────────────── (*) MenuItem
                               cascade delete
```

All other models are standalone (no FK relationships between them).

## Seed Data Summary

### Admin (1 record)

| field       | value                        |
|-------------|------------------------------|
| email       | admin@laolla.com             |
| passwordHash| bcrypt("admin123", rounds=10)|

### Categories (6 records)

| name       | slug       | sortOrder |
|------------|------------|-----------|
| Comidas    | comidas    | 1         |
| Pizzas     | pizzas     | 2         |
| Tartas     | tartas     | 3         |
| Empanadas  | empanadas  | 4         |
| Pastas     | pastas     | 5         |
| Guarnición | guarnicion | 6         |

### MenuItems — Empanadas (8 records, price=0)

All belong to category `empanadas`, sortOrder 1–8.

| name             | price |
|------------------|-------|
| Carne salada     | 0     |
| Carne dulce      | 0     |
| Jamón y queso    | 0     |
| Cebolla y queso  | 0     |
| Verdura          | 0     |
| Choclo           | 0     |
| Pollo            | 0     |
| Queso dulce      | 0     |

### MenuItems — Pastas (12 records, price=1500 placeholder)

All belong to category `pastas`. Name pattern: `"{Tipo} {salsa}"`.

| name                        |
|-----------------------------|
| Tallarines con Salsa        |
| Tallarines con Bolognesa    |
| Tallarines con Estofado     |
| Ñoquis con Salsa            |
| Ñoquis con Bolognesa        |
| Ñoquis con Estofado         |
| Ravioles con Salsa          |
| Ravioles con Bolognesa      |
| Ravioles con Estofado       |
| Sorrentinos con Salsa       |
| Sorrentinos con Bolognesa   |
| Sorrentinos con Estofado    |

### PizzaPartyConfig (1 record, id=1)

| field          | value                                                                 |
|----------------|-----------------------------------------------------------------------|
| pricePerPerson | 1200                                                                  |
| minimumGuests  | 20                                                                    |
| baseHours      | 3                                                                     |
| extraHourPrice | 800                                                                   |
| mozzoPrice     | 600                                                                   |
| serviceDetails | Incluye: empanadas de copetín de entrada, 13 variedades de pizza, horno móvil, platos/servilletas/cubiertos, 3 horas de duración. No incluye: bebidas, mesas, sillas, vasos. |

### Schedule (7 records)

| dayOfWeek | isOpen | openTime | closeTime |
|-----------|--------|----------|-----------|
| 0 (dom)   | false  | 11:00    | 22:00     |
| 1 (lun)   | true   | 11:00    | 22:00     |
| 2 (mar)   | true   | 11:00    | 22:00     |
| 3 (mié)   | true   | 11:00    | 22:00     |
| 4 (jue)   | true   | 11:00    | 22:00     |
| 5 (vie)   | true   | 11:00    | 22:00     |
| 6 (sáb)   | true   | 11:00    | 22:00     |

## Validation Rules

| Model            | Field       | Rule                                           |
|------------------|-------------|------------------------------------------------|
| Category         | slug        | unique, lowercase, no spaces (app-generated)  |
| MenuItem         | price       | >= 0 (0 = informative variant, no public price)|
| MenuItem         | sortOrder   | >= 1                                           |
| MenuItem         | name+cat    | @@unique([name, categoryId]) — enables idempotent seed upsert |
| PizzaPartyConfig | id          | always 1 (enforced via upsert in app layer)   |
| PizzaPartyRequest| status      | enum: pending \| confirmed \| rejected         |
| WeeklyMenuDay    | dayOfWeek   | 1–5 (Mon–Fri, enforced in app layer)           |
| Schedule         | dayOfWeek   | 0–6 (DB PK constraint)                        |
| Schedule         | openTime    | "HH:MM" format (enforced in app layer)        |
| Schedule         | closeTime   | "HH:MM" format (enforced in app layer)        |

# Data Model: Public API Routes

**Feature**: 002-public-api-routes  
**Date**: 2026-05-07

This document describes the request/response shapes for every public endpoint.
All responses are `Content-Type: application/json`.

---

## Response Shapes

### `GET /api/health`

```ts
// Response 200
{ status: "ok" }
```

---

### `GET /api/menu`

```ts
// Response 200
Array<{
  category: {
    id:   number;
    name: string;
    slug: string;
  };
  items: Array<{
    id:          number;
    name:        string;
    price:       number;   // 0 = informational flavor, not an error
    description: string | null;
  }>;
}>
```

Ordering: array sorted by `category.sortOrder` ASC. Items within each category sorted by
`item.sortOrder` ASC. Only items where `available = true` are included.

---

### `GET /api/categories`

```ts
// Response 200
Array<{
  id:        number;
  name:      string;
  slug:      string;
  sortOrder: number;
}>
```

Ordering: `sortOrder` ASC.

---

### `GET /api/pizza-party/config`

```ts
// Response 200
{
  pricePerPerson: number;
  minimumGuests:  number;
  baseHours:      number;
  extraHourPrice: number;
  mozzoPrice:     number;
  serviceDetails: string;
}
```

Note: `id` is excluded (internal DB field).

---

### `GET /api/offers`

```ts
// Response 200
Array<{
  id:          number;
  title:       string;
  description: string;
  badge:       string | null;
  validFrom:   string;  // ISO 8601
  validTo:     string;  // ISO 8601
  createdAt:   string;  // ISO 8601
}>
```

Filter: `active = true` AND `validFrom <= now` AND `validTo >= now`.  
Ordering: `createdAt` DESC.

---

### `GET /api/schedule`

```ts
// Response 200
Array<{
  dayOfWeek:   number;    // 0 = Sunday … 6 = Saturday
  openTime:    string;    // "HH:MM"
  closeTime:   string;    // "HH:MM"
  isOpen:      boolean;
  specialNote: string | null;
  isOpenNow:   boolean;   // calculated: isOpen && current Argentina time within [openTime, closeTime)
}>
```

Ordering: `dayOfWeek` ASC (0–6).

**`isOpenNow` calculation** (server-side, no library):
1. `argNow` = UTC timestamp − 3 hours (fixed UTC-3, no DST)
2. `currentDay` = `argNow.getUTCDay()` (0 = Sunday)
3. `currentTime` = `"HH:MM"` string from `argNow.getUTCHours()` and `argNow.getUTCMinutes()`
4. For each row: `isOpenNow = row.isOpen && currentTime >= row.openTime && currentTime < row.closeTime`

---

### `GET /api/weekly-menu`

```ts
// Response 200
Array<{
  id:        number;
  weekStart: string;  // ISO 8601, Monday 00:00 UTC
  dayOfWeek: number;  // 1–5 (Mon–Fri)
  dishes:    string[];
}>
```

Filter: `weekStart = <most recent Monday at 00:00 UTC>`.  
Returns `[]` if no rows found for the current week.

**`weekStart` calculation** (server-side):
```
today    = new Date() truncated to start of UTC day
daysBack = (today.getUTCDay() + 6) % 7   // 0 if Monday, 1 if Tuesday, …
weekStart = today - daysBack days
```

---

### `POST /api/pizza-party/request`

```ts
// Request body (validated with Zod)
{
  name:        string;          // required, non-empty
  email:       string;          // required, valid email format
  phone:       string;          // required, non-empty
  eventDate:   string;          // required, parseable as Date (ISO 8601 or YYYY-MM-DD)
  guests:      number;          // required, integer > 0
  extraHours:  number;          // required, integer >= 0
  extraMozzos: number;          // required, integer >= 0
  message?:    string;          // optional
}

// Response 200
{
  id:         number;
  totalPrice: number;
}

// Response 400 (validation error)
{
  error:  "Validation error";
  fields: Array<{ path: string; message: string }>;
}

// Response 500
{
  error: "Internal server error";
}
```

**`totalPrice` formula**:
```
totalPrice = guests × pricePerPerson + extraHours × extraHourPrice + extraMozzos × mozzoPrice
```
Values of `pricePerPerson`, `extraHourPrice`, `mozzoPrice` fetched from `PizzaPartyConfig` (id=1)
on each request. Any `totalPrice` sent by the client is ignored.

---

### `POST /api/contact`

```ts
// Request body (validated with Zod)
{
  name:    string;   // required, non-empty
  email:   string;   // required, valid email format
  phone?:  string;   // optional
  message: string;   // required, non-empty
}

// Response 200
{
  success: true;
}

// Response 400 (validation error)
{
  error:  "Validation error";
  fields: Array<{ path: string; message: string }>;
}

// Response 500
{
  error: "Internal server error";
}
```

---

## Zod Schema Definitions

### PizzaPartyRequestSchema

```ts
import { z } from 'zod';

export const PizzaPartyRequestSchema = z.object({
  name:        z.string().min(1),
  email:       z.string().email(),
  phone:       z.string().min(1),
  eventDate:   z.coerce.date(),
  guests:      z.number().int().positive(),
  extraHours:  z.number().int().min(0),
  extraMozzos: z.number().int().min(0),
  message:     z.string().optional(),
});
```

### ContactSchema

```ts
export const ContactSchema = z.object({
  name:    z.string().min(1),
  email:   z.string().email(),
  phone:   z.string().optional(),
  message: z.string().min(1),
});
```

---

## Error Middleware Shape

```ts
// ZodError → 400
{
  error:  "Validation error",
  fields: [{ path: "guests", message: "Expected number, received string" }, ...]
}

// Any other error → 500
{
  error: "Internal server error"
}
```

Stack trace is logged server-side but never included in the response body in production
(`NODE_ENV === 'production'` check in error middleware).

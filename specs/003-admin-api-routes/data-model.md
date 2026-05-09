# Data Model: Admin API Routes

**Feature**: 003-admin-api-routes
**Date**: 2026-05-09

This document describes the request/response shapes for every admin endpoint.
All responses are `Content-Type: application/json` except `GET /api/admin/price-list/image`.
All routes except `POST /api/admin/login` require `Authorization: Bearer <token>`.

---

## Auth

### `POST /api/admin/login`

```ts
// Request body (validated with Zod)
{
  email:    string;  // required
  password: string;  // required
}

// Response 200
{ token: string }  // JWT, expires in 7 days

// Response 401
{ error: "Invalid credentials" }

// Response 400 (missing fields)
{
  error:  "Validation error";
  fields: Array<{ path: string; message: string }>;
}
```

**JWT payload**:
```ts
{ adminId: number; email: string; iat: number; exp: number }
```

---

## Menu

### `GET /api/admin/menu`

```ts
// Response 200
Array<{
  category: {
    id:        number;
    name:      string;
    slug:      string;
    sortOrder: number;
  };
  items: Array<{
    id:          number;
    name:        string;
    price:       number;
    description: string | null;
    available:   boolean;       // includes available=false (unlike public endpoint)
    sortOrder:   number;
    createdAt:   string;        // ISO 8601
    updatedAt:   string;        // ISO 8601
  }>;
}>
```

Ordering: categories by `sortOrder` ASC; items within category by `sortOrder` ASC.
Includes ALL items regardless of `available` flag.

---

### `POST /api/admin/menu/items`

```ts
// Request body
{
  name:        string;           // required, non-empty
  price:       number;           // required, >= 0
  categoryId:  number;           // required, must exist
  description?: string;          // optional
  available?:   boolean;         // optional, defaults to true
  sortOrder?:   number;          // optional, defaults to 0
}

// Response 201
{
  id:          number;
  name:        string;
  price:       number;
  categoryId:  number;
  description: string | null;
  available:   boolean;
  sortOrder:   number;
  createdAt:   string;
  updatedAt:   string;
}

// Response 400
{ error: "Validation error"; fields: [...] }

// Response 404 (categoryId not found)
{ error: "Category not found" }
```

---

### `PATCH /api/admin/menu/items/:id`

```ts
// Request body (all fields optional, at least one required)
{
  name?:        string;
  price?:       number;   // >= 0
  categoryId?:  number;
  description?: string | null;
  available?:   boolean;
  sortOrder?:   number;
}

// Response 200 — updated item (same shape as POST 201)

// Response 404
{ error: "Menu item not found" }

// Response 400
{ error: "Validation error"; fields: [...] }
```

---

### `DELETE /api/admin/menu/items/:id`

```ts
// Response 204 (no body)

// Response 404
{ error: "Menu item not found" }
```

---

### `PATCH /api/admin/menu/prices`

```ts
// Request body
Array<{
  id:    number;   // required
  price: number;   // required, >= 0
}>

// Response 200
{ updated: number }  // count of successfully updated items

// Response 400
{ error: "Validation error"; fields: [...] }

// Response 404 (if any id not found)
{ error: "Menu item not found"; id: number }
```

---

## Categories

### `GET /api/admin/categories`

```ts
// Response 200
Array<{
  id:        number;
  name:      string;
  slug:      string;
  sortOrder: number;
}>
```

Ordering: `sortOrder` ASC. (Same as public endpoint — all categories always visible to admin.)

---

### `POST /api/admin/categories`

```ts
// Request body
{
  name:       string;   // required, non-empty
  slug:       string;   // required, non-empty, URL-safe
  sortOrder?: number;   // optional, defaults to 0
}

// Response 201
{ id: number; name: string; slug: string; sortOrder: number }

// Response 400
{ error: "Validation error"; fields: [...] }

// Response 409 (name or slug already exists)
{ error: "Category already exists" }
```

---

### `PATCH /api/admin/categories/:id`

```ts
// Request body (all optional, at least one required)
{
  name?:       string;
  slug?:       string;
  sortOrder?:  number;
}

// Response 200 — updated category
{ id: number; name: string; slug: string; sortOrder: number }

// Response 404
{ error: "Category not found" }

// Response 409 (name/slug conflict)
{ error: "Category already exists" }
```

---

### `DELETE /api/admin/categories/:id`

```ts
// Response 204 (no body)

// Response 404
{ error: "Category not found" }

// Response 409 (has associated items)
{ error: "Category has items; remove or reassign them first" }
```

---

## Pizza Party

### `GET /api/admin/pizza-party/config`

```ts
// Response 200
{
  id:             number;   // exposed in admin (unlike public endpoint)
  pricePerPerson: number;
  minimumGuests:  number;
  baseHours:      number;
  extraHourPrice: number;
  mozzoPrice:     number;
  serviceDetails: string;
}
```

---

### `PATCH /api/admin/pizza-party/config`

```ts
// Request body (all optional, at least one required)
{
  pricePerPerson?: number;   // > 0
  minimumGuests?:  number;   // integer > 0
  baseHours?:      number;   // integer > 0
  extraHourPrice?: number;   // > 0
  mozzoPrice?:     number;   // > 0
  serviceDetails?: string;
}

// Response 200 — full updated config (same shape as GET)

// Response 400
{ error: "Validation error"; fields: [...] }
```

---

### `GET /api/admin/pizza-party/requests`

```ts
// Query params
// ?status=pending|confirmed|rejected   (optional)

// Response 200
Array<{
  id:          number;
  name:        string;
  email:       string;
  phone:       string;
  eventDate:   string;    // ISO 8601
  guests:      number;
  extraHours:  number;
  extraMozzos: number;
  message:     string | null;
  totalPrice:  number;
  status:      "pending" | "confirmed" | "rejected";
  adminNotes:  string | null;
  createdAt:   string;    // ISO 8601
}>
```

Ordering: `createdAt` DESC.

---

### `PATCH /api/admin/pizza-party/requests/:id`

```ts
// Request body (at least one required)
{
  status?:     "pending" | "confirmed" | "rejected";
  adminNotes?: string | null;
}

// Response 200 — updated request (same shape as GET item above)

// Response 404
{ error: "Pizza party request not found" }

// Response 400
{ error: "Validation error"; fields: [...] }
```

---

## Offers

### `GET /api/admin/offers`

```ts
// Response 200
Array<{
  id:          number;
  title:       string;
  description: string;
  badge:       string | null;
  validFrom:   string;    // ISO 8601
  validTo:     string;    // ISO 8601
  active:      boolean;   // includes inactive (unlike public endpoint)
  createdAt:   string;    // ISO 8601
}>
```

No date/active filter — returns everything. Ordering: `createdAt` DESC.

---

### `POST /api/admin/offers`

```ts
// Request body
{
  title:       string;           // required, non-empty
  description: string;           // required, non-empty
  badge?:      string;           // optional
  validFrom:   string;           // required, ISO 8601 date
  validTo:     string;           // required, ISO 8601 date, must be >= validFrom
  active?:     boolean;          // optional, defaults to true
}

// Response 201 — created offer (full shape above)

// Response 400
{ error: "Validation error"; fields: [...] }
```

---

### `PATCH /api/admin/offers/:id`

```ts
// Request body (all optional)
{
  title?:       string;
  description?: string;
  badge?:       string | null;
  validFrom?:   string;
  validTo?:     string;
  active?:      boolean;
}

// Response 200 — updated offer

// Response 404
{ error: "Offer not found" }
```

---

### `DELETE /api/admin/offers/:id`

```ts
// Response 204 (no body)

// Response 404
{ error: "Offer not found" }
```

---

## Schedule

### `GET /api/admin/schedule`

```ts
// Response 200
Array<{
  dayOfWeek:   number;    // 0 = Sunday … 6 = Saturday
  openTime:    string;    // "HH:MM"
  closeTime:   string;    // "HH:MM"
  isOpen:      boolean;
  specialNote: string | null;
}>
```

No `isOpenNow` field (admin view — calculation not needed here).
Ordering: `dayOfWeek` ASC.

---

### `PATCH /api/admin/schedule`

```ts
// Request body — array of all 7 days
Array<{
  dayOfWeek:    number;           // required, 0–6
  openTime:     string;           // required, "HH:MM"
  closeTime:    string;           // required, "HH:MM"
  isOpen:       boolean;          // required
  specialNote?: string | null;    // optional
}>

// Response 200
Array<{ dayOfWeek: number; openTime: string; closeTime: string; isOpen: boolean; specialNote: string | null }>

// Response 400
{ error: "Validation error"; fields: [...] }
```

Uses upsert keyed by `dayOfWeek`.

---

## Weekly Menu

### `GET /api/admin/weekly-menu`

Same response as public `GET /api/weekly-menu`:

```ts
// Response 200
Array<{
  id:        number;
  weekStart: string;   // ISO 8601, Monday 00:00 UTC
  dayOfWeek: number;   // 1–5 (Mon–Fri)
  dishes:    string[];
}>
```

Returns `[]` if no data for current week.

---

### `PUT /api/admin/weekly-menu`

```ts
// Request body — days 1–5
Array<{
  dayOfWeek: number;     // required, 1–5
  dishes:    string[];   // required, array of strings (can be empty [])
}>

// Response 200
Array<{
  id:        number;
  weekStart: string;
  dayOfWeek: number;
  dishes:    string[];
}>

// Response 400
{ error: "Validation error"; fields: [...] }
```

`weekStart` calculated server-side (most recent Monday at 00:00 UTC).
Uses upsert keyed by `[weekStart, dayOfWeek]`.

---

## Contact Messages

### `GET /api/admin/contact`

```ts
// Response 200
Array<{
  id:        number;
  name:      string;
  email:     string;
  phone:     string | null;
  message:   string;
  read:      boolean;
  createdAt: string;   // ISO 8601
}>
```

Ordering: `createdAt` DESC.

---

### `PATCH /api/admin/contact/:id/read`

```ts
// Request body
{ read: true }   // only true is accepted (messages cannot be un-read)

// Response 200
{ id: number; read: boolean }

// Response 404
{ error: "Contact message not found" }

// Response 400
{ error: "Validation error"; fields: [...] }
```

---

### `GET /api/admin/contact/unread-count`

```ts
// Response 200
{ count: number }
```

---

## Price List Image

### `GET /api/admin/price-list/image`

```
Content-Type: image/png
Content-Disposition: attachment; filename="price-list.png"
Body: PNG binary buffer
```

- Includes all menu items with `available=true` and `price > 0`, grouped by category.
- Logo embedded as base64 from `backend/src/assets/logo.png`.
- If logo file not found: image generated without logo (warning logged server-side).
- On error (e.g., Sharp failure): HTTP 500 with `{ error: "Internal server error" }`.

---

## Common Error Shapes

```ts
// 400 Validation
{ error: "Validation error"; fields: [{ path: string; message: string }] }

// 401 Unauthorized
{ error: "Unauthorized" }

// 404 Not Found
{ error: "<Resource> not found" }

// 409 Conflict
{ error: "<Reason for conflict>" }

// 500 Internal
{ error: "Internal server error" }
```

---

## Zod Schema Definitions

### LoginSchema
```ts
z.object({ email: z.string().email(), password: z.string().min(1) })
```

### CreateMenuItemSchema
```ts
z.object({
  name:        z.string().min(1),
  price:       z.number().min(0),
  categoryId:  z.number().int().positive(),
  description: z.string().optional(),
  available:   z.boolean().optional().default(true),
  sortOrder:   z.number().int().optional().default(0),
})
```

### PatchMenuItemSchema
```ts
z.object({
  name:        z.string().min(1).optional(),
  price:       z.number().min(0).optional(),
  categoryId:  z.number().int().positive().optional(),
  description: z.string().nullable().optional(),
  available:   z.boolean().optional(),
  sortOrder:   z.number().int().optional(),
}).refine(data => Object.keys(data).length > 0, { message: "At least one field required" })
```

### BulkPriceSchema
```ts
z.array(z.object({ id: z.number().int().positive(), price: z.number().min(0) })).min(1)
```

### CreateCategorySchema
```ts
z.object({
  name:      z.string().min(1),
  slug:      z.string().min(1).regex(/^[a-z0-9-]+$/),
  sortOrder: z.number().int().optional().default(0),
})
```

### PizzaPartyConfigPatchSchema
```ts
z.object({
  pricePerPerson: z.number().positive().optional(),
  minimumGuests:  z.number().int().positive().optional(),
  baseHours:      z.number().int().positive().optional(),
  extraHourPrice: z.number().positive().optional(),
  mozzoPrice:     z.number().positive().optional(),
  serviceDetails: z.string().optional(),
}).refine(data => Object.keys(data).length > 0)
```

### PizzaPartyRequestPatchSchema
```ts
z.object({
  status:     z.enum(["pending", "confirmed", "rejected"]).optional(),
  adminNotes: z.string().nullable().optional(),
}).refine(data => Object.keys(data).length > 0)
```

### CreateOfferSchema
```ts
z.object({
  title:       z.string().min(1),
  description: z.string().min(1),
  badge:       z.string().optional(),
  validFrom:   z.coerce.date(),
  validTo:     z.coerce.date(),
  active:      z.boolean().optional().default(true),
}).refine(data => data.validTo >= data.validFrom, {
  message: "validTo must be >= validFrom",
  path: ["validTo"],
})
```

### SchedulePatchSchema
```ts
z.array(z.object({
  dayOfWeek:   z.number().int().min(0).max(6),
  openTime:    z.string().regex(/^\d{2}:\d{2}$/),
  closeTime:   z.string().regex(/^\d{2}:\d{2}$/),
  isOpen:      z.boolean(),
  specialNote: z.string().nullable().optional(),
})).length(7)
```

### WeeklyMenuPutSchema
```ts
z.array(z.object({
  dayOfWeek: z.number().int().min(1).max(5),
  dishes:    z.array(z.string()),
})).min(1).max(5)
```

### MarkReadSchema
```ts
z.object({ read: z.literal(true) })
```

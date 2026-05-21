# Admin API Contracts

**Branch**: `006-admin-panel` | **Date**: 2026-05-10  
**Base path**: All endpoints are under `/api/admin/`  
**Auth**: All endpoints (except `POST /login`) require `Authorization: Bearer <jwt>` header. The `apiFetch` utility in `frontend/src/lib/api.ts` injects this header automatically for paths starting with `/api/admin/`.

---

## Auth

### POST /api/admin/login

Login with email and password.

**Request body**
```json
{ "email": "string", "password": "string" }
```

**Response 200**
```json
{ "token": "string" }
```

**Response 401** — wrong credentials
```json
{ "message": "Invalid credentials" }
```

---

## Menu

### GET /api/admin/menu

Returns all categories with their items (including unavailable items).

**Response 200** → `AdminMenuResponse`
```json
[
  {
    "category": { "id": 1, "name": "Principales", "slug": "principales" },
    "items": [
      { "id": 1, "name": "Milanesa napolitana", "price": 2500, "description": null, "available": true, "sortOrder": 0, "categoryId": 1 }
    ]
  }
]
```

### POST /api/admin/menu/items

Create a new menu item.

**Request body**
```json
{ "name": "string", "price": 0, "categoryId": 1, "description": "string|omit", "available": true, "sortOrder": 0 }
```

**Response 201** → `AdminMenuItem`

### PATCH /api/admin/menu/items/:id

Update a menu item (partial update — send only changed fields).

**Request body** (at least one field required)
```json
{ "name": "string", "price": 0, "available": true, "description": "string|null", "sortOrder": 0 }
```

**Response 200** → `AdminMenuItem`

### DELETE /api/admin/menu/items/:id

**Response 204** (no body)

### PATCH /api/admin/menu/prices

Bulk update prices for multiple items.

**Request body** (array, min 1)
```json
[{ "id": 1, "price": 2800 }, { "id": 2, "price": 1500 }]
```

**Response 200**
```json
{ "updated": 2 }
```

---

## Categories

### GET /api/admin/categories

**Response 200** → `AdminCategoriesResponse`
```json
[{ "id": 1, "name": "Principales", "slug": "principales", "sortOrder": 0 }]
```

### POST /api/admin/categories

**Request body**
```json
{ "name": "string", "slug": "string (a-z0-9- only)", "sortOrder": 0 }
```

**Response 201** → `AdminCategory`

### PATCH /api/admin/categories/:id

**Request body** (at least one field required)
```json
{ "name": "string", "slug": "string", "sortOrder": 0 }
```

**Response 200** → `AdminCategory`

### DELETE /api/admin/categories/:id

**Response 204** — deleted successfully  
**Response 409** — category has items, cannot delete  
```json
{ "error": "Category has items; remove or reassign them first" }
```
**Response 404** — not found

---

## Pizza Party

### GET /api/admin/pizza-party/config

**Response 200** → `PizzaPartyConfig`
```json
{ "pricePerPerson": 3500, "minimumGuests": 20, "baseHours": 3, "extraHourPrice": 800, "mozzoPrice": 1500, "serviceDetails": "string" }
```

### PATCH /api/admin/pizza-party/config

**Request body** (at least one field required)
```json
{ "pricePerPerson": 3500, "minimumGuests": 20, "extraHourPrice": 800, "mozzoPrice": 1500, "serviceDetails": "string" }
```

**Response 200** → `PizzaPartyConfig`

### GET /api/admin/pizza-party/requests

**Query params**: `?status=pending|confirmed|rejected` (optional; omit for all)

**Response 200** → `PizzaPartyRequestsResponse`
```json
[
  {
    "id": 1,
    "name": "Juan García",
    "email": "juan@example.com",
    "phone": "1122334455",
    "eventDate": "2026-06-15T00:00:00.000Z",
    "guests": 30,
    "extraHours": 1,
    "extraMozzos": 1,
    "message": "string|null",
    "totalPrice": 120000,
    "status": "pending",
    "adminNotes": "string|null",
    "createdAt": "2026-05-10T12:00:00.000Z"
  }
]
```

### PATCH /api/admin/pizza-party/requests/:id

**Request body** (at least one field required)
```json
{ "status": "confirmed|rejected|pending", "adminNotes": "string|null" }
```

**Response 200** → `PizzaPartyRequest`

---

## Offers

### GET /api/admin/offers

**Response 200** → `AdminOffersResponse`
```json
[
  { "id": 1, "title": "2x1 en pizzas", "description": "...", "badge": "HOT", "validFrom": "2026-05-01T00:00:00.000Z", "validTo": "2026-05-31T00:00:00.000Z", "active": true, "createdAt": "..." }
]
```

### POST /api/admin/offers

**Request body**
```json
{ "title": "string", "description": "string", "badge": "string|omit", "validFrom": "ISO date", "validTo": "ISO date", "active": true }
```

**Response 201** → `AdminOffer`

### PATCH /api/admin/offers/:id

**Request body** (any subset of offer fields)
```json
{ "active": false }
```

**Response 200** → `AdminOffer`

### DELETE /api/admin/offers/:id

**Response 204** (no body)

---

## Schedule

### GET /api/admin/schedule

**Response 200** → `AdminScheduleResponse`
```json
[
  { "dayOfWeek": 0, "openTime": "00:00", "closeTime": "00:00", "isOpen": false, "specialNote": null },
  { "dayOfWeek": 1, "openTime": "12:00", "closeTime": "21:00", "isOpen": true, "specialNote": null }
]
```

### PATCH /api/admin/schedule

Replaces all 7 days atomically.

**Request body** (exactly 7 items, dayOfWeek 0–6)
```json
[
  { "dayOfWeek": 0, "openTime": "00:00", "closeTime": "00:00", "isOpen": false, "specialNote": null },
  { "dayOfWeek": 1, "openTime": "12:00", "closeTime": "21:00", "isOpen": true, "specialNote": "Feriado" }
]
```

**Response 200** → `AdminScheduleResponse`

---

## Weekly Menu

### GET /api/admin/weekly-menu

Returns the current week's menu (Mon–Fri). Empty array if nothing published.

**Response 200** → `WeeklyMenuResponse`
```json
[
  { "id": 1, "weekStart": "2026-05-11T00:00:00.000Z", "dayOfWeek": 1, "dishes": ["Milanesa", "Arroz con pollo"] }
]
```

### PUT /api/admin/weekly-menu

Upserts the current week's menu. Days not included are untouched.

**Request body** (1–5 items, dayOfWeek 1–5)
```json
[
  { "dayOfWeek": 1, "dishes": ["Milanesa", "Arroz con pollo"] },
  { "dayOfWeek": 2, "dishes": ["Pascualina"] }
]
```

**Response 200** → `WeeklyMenuResponse`

---

## Contact Messages

### GET /api/admin/contact/unread-count

**Response 200**
```json
{ "count": 3 }
```

### GET /api/admin/contact

Returns all messages, newest first.

**Response 200** → `ContactMessagesResponse`
```json
[
  { "id": 1, "name": "Ana López", "email": "ana@example.com", "phone": "1144556677", "message": "Quisiera saber...", "read": false, "createdAt": "2026-05-10T09:00:00.000Z" }
]
```

### PATCH /api/admin/contact/:id/read

**(Backend fix required)**: Currently only accepts `{ read: true }`. After fix, accepts boolean.

**Request body**
```json
{ "read": true }
```
or
```json
{ "read": false }
```

**Response 200**
```json
{ "id": 1, "read": true }
```

---

## Price List Image

### GET /api/admin/price-list/image

Returns a PNG image of the current price list.

**Response 200** — `Content-Type: image/png` (binary)  
The frontend triggers a download by creating a temporary `<a>` element with `download` attribute pointing to a blob URL from the response.

# API Contract: Admin Endpoints

**Version**: 1.0.0
**Base URL**: `http://localhost:3000` (dev) / `https://api.laolla.com` (prod)
**Prefix**: `/api/admin`
**Auth**: `Authorization: Bearer <token>` required on all endpoints except `POST /api/admin/login`
**Content-Type**: `application/json` for all requests and responses (except price-list image)

---

## Authentication

### `POST /api/admin/login`

Log in as administrator and obtain a session token.

| Field         | Value              |
|---------------|--------------------|
| Auth          | None               |
| Content-Type  | `application/json` |
| Response      | `200 OK`           |

**Request body**:
```json
{ "email": "admin@laolla.com", "password": "secret" }
```

**Response 200**:
```json
{ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

**Response 401**:
```json
{ "error": "Invalid credentials" }
```

---

## Menu — Items

### `GET /api/admin/menu`

List all menu items (including unavailable ones), grouped by category.

| Field  | Value  |
|--------|--------|
| Auth   | Bearer |
| Response | `200 OK` |

**Response 200**:
```json
[
  {
    "category": { "id": 1, "name": "Pizzas", "slug": "pizzas", "sortOrder": 1 },
    "items": [
      {
        "id": 5, "name": "Mozzarella", "price": 1500, "description": null,
        "available": true, "sortOrder": 1,
        "createdAt": "2026-01-01T00:00:00.000Z", "updatedAt": "2026-01-01T00:00:00.000Z"
      },
      {
        "id": 6, "name": "Napolitana (INACTIVO)", "price": 1600, "description": null,
        "available": false, "sortOrder": 2,
        "createdAt": "2026-01-01T00:00:00.000Z", "updatedAt": "2026-04-01T00:00:00.000Z"
      }
    ]
  }
]
```

---

### `POST /api/admin/menu/items`

Create a new menu item.

| Field         | Value              |
|---------------|--------------------|
| Auth          | Bearer             |
| Content-Type  | `application/json` |
| Response      | `201 Created`      |

**Request body**:
```json
{
  "name": "Muzza grande",
  "price": 2000,
  "categoryId": 1,
  "description": "Pizza mozzarella grande",
  "available": true,
  "sortOrder": 10
}
```

**Response 201**:
```json
{
  "id": 42, "name": "Muzza grande", "price": 2000, "categoryId": 1,
  "description": "Pizza mozzarella grande", "available": true, "sortOrder": 10,
  "createdAt": "2026-05-09T12:00:00.000Z", "updatedAt": "2026-05-09T12:00:00.000Z"
}
```

---

### `PATCH /api/admin/menu/items/:id`

Update one or more fields of an existing menu item.

| Field  | Value  |
|--------|--------|
| Auth   | Bearer |
| Response | `200 OK` |

**Request body** (partial update):
```json
{ "price": 2200, "available": false }
```

**Response 200**: updated item (same shape as POST 201 response).

**Response 404**:
```json
{ "error": "Menu item not found" }
```

---

### `DELETE /api/admin/menu/items/:id`

Delete a menu item permanently.

| Field  | Value         |
|--------|---------------|
| Auth   | Bearer        |
| Response | `204 No Content` |

**Response 404**:
```json
{ "error": "Menu item not found" }
```

---

### `PATCH /api/admin/menu/prices`

Update prices for multiple items in a single operation.

| Field  | Value  |
|--------|--------|
| Auth   | Bearer |
| Response | `200 OK` |

**Request body**:
```json
[
  { "id": 5, "price": 1800 },
  { "id": 6, "price": 1900 },
  { "id": 7, "price": 2100 }
]
```

**Response 200**:
```json
{ "updated": 3 }
```

**Response 404** (id not found):
```json
{ "error": "Menu item not found", "id": 99 }
```

---

## Categories

### `GET /api/admin/categories`

List all categories.

| Field  | Value  |
|--------|--------|
| Auth   | Bearer |
| Response | `200 OK` |

**Response 200**:
```json
[
  { "id": 1, "name": "Comidas", "slug": "comidas", "sortOrder": 1 },
  { "id": 2, "name": "Pizzas",  "slug": "pizzas",  "sortOrder": 2 }
]
```

---

### `POST /api/admin/categories`

Create a new category.

| Field  | Value         |
|--------|---------------|
| Auth   | Bearer        |
| Response | `201 Created` |

**Request body**:
```json
{ "name": "Empanadas", "slug": "empanadas", "sortOrder": 3 }
```

**Response 201**:
```json
{ "id": 3, "name": "Empanadas", "slug": "empanadas", "sortOrder": 3 }
```

**Response 409**:
```json
{ "error": "Category already exists" }
```

---

### `PATCH /api/admin/categories/:id`

Update a category.

| Field  | Value  |
|--------|--------|
| Auth   | Bearer |
| Response | `200 OK` |

**Request body**: `{ "sortOrder": 5 }`

**Response 200**: updated category.

---

### `DELETE /api/admin/categories/:id`

Delete a category (only if it has no items).

| Field  | Value            |
|--------|------------------|
| Auth   | Bearer           |
| Response | `204 No Content` |

**Response 409**:
```json
{ "error": "Category has items; remove or reassign them first" }
```

---

## Pizza Party

### `GET /api/admin/pizza-party/config`

Get current pizza party pricing configuration.

| Field  | Value  |
|--------|--------|
| Auth   | Bearer |
| Response | `200 OK` |

**Response 200**:
```json
{
  "id": 1,
  "pricePerPerson": 3500,
  "minimumGuests": 20,
  "baseHours": 3,
  "extraHourPrice": 5000,
  "mozzoPrice": 4000,
  "serviceDetails": "Incluye mozarella, faina y gaseosas..."
}
```

---

### `PATCH /api/admin/pizza-party/config`

Update pizza party pricing (partial update).

| Field  | Value  |
|--------|--------|
| Auth   | Bearer |
| Response | `200 OK` |

**Request body**: `{ "pricePerPerson": 4000 }`

**Response 200**: full updated config.

---

### `GET /api/admin/pizza-party/requests`

List all pizza party requests.

| Field  | Value  |
|--------|--------|
| Auth   | Bearer |
| Query  | `?status=pending\|confirmed\|rejected` (optional) |
| Response | `200 OK` |

**Response 200**:
```json
[
  {
    "id": 1, "name": "María García", "email": "maria@example.com",
    "phone": "+54 9 11 1234-5678", "eventDate": "2026-06-15T00:00:00.000Z",
    "guests": 30, "extraHours": 1, "extraMozzos": 2,
    "message": "Corporativo", "totalPrice": 118000,
    "status": "pending", "adminNotes": null,
    "createdAt": "2026-05-01T10:00:00.000Z"
  }
]
```

---

### `PATCH /api/admin/pizza-party/requests/:id`

Update status and/or admin notes for a request.

| Field  | Value  |
|--------|--------|
| Auth   | Bearer |
| Response | `200 OK` |

**Request body**: `{ "status": "confirmed", "adminNotes": "Confirmado para 40 personas" }`

**Response 200**: updated request (same shape as list item).

---

## Offers

### `GET /api/admin/offers`

List all offers (active and inactive, regardless of date).

| Field  | Value  |
|--------|--------|
| Auth   | Bearer |
| Response | `200 OK` |

**Response 200**:
```json
[
  {
    "id": 1, "title": "Promo verano", "description": "20% off pizzas grandes",
    "badge": "20% OFF", "validFrom": "2026-01-01T00:00:00.000Z",
    "validTo": "2026-03-31T23:59:59.000Z", "active": false,
    "createdAt": "2025-12-15T10:00:00.000Z"
  }
]
```

---

### `POST /api/admin/offers`

Create a new offer.

| Field  | Value         |
|--------|---------------|
| Auth   | Bearer        |
| Response | `201 Created` |

**Request body**:
```json
{
  "title": "Promo invierno",
  "description": "2x1 en pizzas los miércoles",
  "badge": "2x1",
  "validFrom": "2026-06-01",
  "validTo": "2026-08-31",
  "active": true
}
```

**Response 201**: created offer.

---

### `PATCH /api/admin/offers/:id`

Update an offer (partial).

| Field  | Value  |
|--------|--------|
| Auth   | Bearer |
| Response | `200 OK` |

**Request body**: `{ "active": true }`

---

### `DELETE /api/admin/offers/:id`

Delete an offer permanently.

| Field  | Value            |
|--------|------------------|
| Auth   | Bearer           |
| Response | `204 No Content` |

---

## Schedule

### `GET /api/admin/schedule`

Get the weekly schedule (no `isOpenNow` field).

| Field  | Value  |
|--------|--------|
| Auth   | Bearer |
| Response | `200 OK` |

**Response 200**:
```json
[
  { "dayOfWeek": 0, "openTime": "11:00", "closeTime": "22:00", "isOpen": false, "specialNote": null },
  { "dayOfWeek": 1, "openTime": "11:00", "closeTime": "22:00", "isOpen": true,  "specialNote": null }
]
```

---

### `PATCH /api/admin/schedule`

Replace the weekly schedule (all 7 days in one call).

| Field  | Value  |
|--------|--------|
| Auth   | Bearer |
| Response | `200 OK` |

**Request body** (7 elements):
```json
[
  { "dayOfWeek": 0, "openTime": "11:00", "closeTime": "22:00", "isOpen": false },
  { "dayOfWeek": 1, "openTime": "11:00", "closeTime": "22:00", "isOpen": true },
  { "dayOfWeek": 2, "openTime": "11:00", "closeTime": "22:00", "isOpen": true },
  { "dayOfWeek": 3, "openTime": "11:00", "closeTime": "22:00", "isOpen": true },
  { "dayOfWeek": 4, "openTime": "11:00", "closeTime": "22:00", "isOpen": true },
  { "dayOfWeek": 5, "openTime": "11:00", "closeTime": "23:00", "isOpen": true },
  { "dayOfWeek": 6, "openTime": "11:00", "closeTime": "23:00", "isOpen": true }
]
```

**Response 200**: same shape as GET.

---

## Weekly Menu

### `GET /api/admin/weekly-menu`

Get the weekly menu for the current week (same as public endpoint).

| Field  | Value  |
|--------|--------|
| Auth   | Bearer |
| Response | `200 OK` |

---

### `PUT /api/admin/weekly-menu`

Replace the entire weekly menu for the current week.

| Field  | Value  |
|--------|--------|
| Auth   | Bearer |
| Response | `200 OK` |

**Request body**:
```json
[
  { "dayOfWeek": 1, "dishes": ["Milanesa con papas", "Pollo al horno"] },
  { "dayOfWeek": 2, "dishes": ["Lentejas", "Ravioles"] },
  { "dayOfWeek": 3, "dishes": ["Estofado"] },
  { "dayOfWeek": 4, "dishes": ["Fideos con tuco", "Canelones"] },
  { "dayOfWeek": 5, "dishes": [] }
]
```

**Response 200**: saved weekly menu records.

---

## Contact Messages

### `GET /api/admin/contact`

List all contact messages, newest first.

| Field  | Value  |
|--------|--------|
| Auth   | Bearer |
| Response | `200 OK` |

**Response 200**:
```json
[
  {
    "id": 1, "name": "Juan López", "email": "juan@example.com",
    "phone": "+54 9 11 9876-5432", "message": "¿Tienen servicio a domicilio?",
    "read": false, "createdAt": "2026-05-08T15:00:00.000Z"
  }
]
```

---

### `PATCH /api/admin/contact/:id/read`

Mark a contact message as read.

| Field  | Value  |
|--------|--------|
| Auth   | Bearer |
| Response | `200 OK` |

**Request body**: `{ "read": true }`

**Response 200**: `{ "id": 1, "read": true }`

---

### `GET /api/admin/contact/unread-count`

Get the count of unread messages.

| Field  | Value  |
|--------|--------|
| Auth   | Bearer |
| Response | `200 OK` |

**Response 200**: `{ "count": 3 }`

---

## Price List Image

### `GET /api/admin/price-list/image`

Generate and download a PNG price list image.

| Field  | Value           |
|--------|-----------------|
| Auth   | Bearer          |
| Response | `200 OK`      |
| Content-Type | `image/png` |
| Content-Disposition | `attachment; filename="price-list.png"` |

**Response**: PNG binary buffer.

**Response 500**:
```json
{ "error": "Internal server error" }
```

---

## Error Response Contract

All JSON error responses use one of these shapes:

### 400 Validation Error
```json
{ "error": "Validation error", "fields": [{ "path": "price", "message": "Number must be >= 0" }] }
```

### 401 Unauthorized
```json
{ "error": "Unauthorized" }
```

### 404 Not Found
```json
{ "error": "<Resource> not found" }
```

### 409 Conflict
```json
{ "error": "<Reason>" }
```

### 500 Internal Server Error
```json
{ "error": "Internal server error" }
```

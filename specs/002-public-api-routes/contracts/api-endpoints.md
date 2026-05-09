# API Contract: Public Endpoints

**Version**: 1.0.0  
**Base URL**: `http://localhost:3000` (dev) / `https://api.laolla.com` (prod)  
**Prefix**: `/api`  
**Auth**: None (all endpoints are public)  
**Content-Type**: `application/json` for all requests and responses

---

## Endpoints

### `GET /api/health`

Health check. Returns immediately without touching the database.

| Field     | Value          |
|-----------|----------------|
| Auth      | None           |
| Response  | `200 OK`       |

**Response body**:
```json
{ "status": "ok" }
```

---

### `GET /api/menu`

Returns all available menu items grouped by category.

| Field     | Value    |
|-----------|----------|
| Auth      | None     |
| Response  | `200 OK` |

**Response body**:
```json
[
  {
    "category": { "id": 1, "name": "Pizzas", "slug": "pizzas" },
    "items": [
      { "id": 5, "name": "Mozzarella", "price": 1500, "description": null },
      { "id": 6, "name": "Napolitana", "price": 1600, "description": "Con tomate fresco" }
    ]
  }
]
```

Guarantees:
- `price: 0` items are included (informational flavors)
- Items with `available: false` are excluded
- Sorted: categories by `sortOrder` ASC, items within category by `sortOrder` ASC

---

### `GET /api/categories`

Returns all categories.

| Field     | Value    |
|-----------|----------|
| Auth      | None     |
| Response  | `200 OK` |

**Response body**:
```json
[
  { "id": 1, "name": "Comidas", "slug": "comidas", "sortOrder": 1 },
  { "id": 2, "name": "Pizzas",  "slug": "pizzas",  "sortOrder": 2 }
]
```

---

### `GET /api/pizza-party/config`

Returns pizza party pricing and service details (single config row).

| Field     | Value    |
|-----------|----------|
| Auth      | None     |
| Response  | `200 OK` |

**Response body**:
```json
{
  "pricePerPerson": 3500,
  "minimumGuests":  20,
  "baseHours":      3,
  "extraHourPrice": 5000,
  "mozzoPrice":     4000,
  "serviceDetails": "Incluye mozarella, faina y gaseosas..."
}
```

---

### `GET /api/offers`

Returns currently active and date-valid promotions.

| Field     | Value    |
|-----------|----------|
| Auth      | None     |
| Response  | `200 OK` |

**Response body**:
```json
[
  {
    "id": 1,
    "title": "Promo verano",
    "description": "20% de descuento en pizzas grandes",
    "badge": "20% OFF",
    "validFrom": "2026-01-01T00:00:00.000Z",
    "validTo":   "2026-03-31T23:59:59.000Z",
    "createdAt": "2025-12-15T10:00:00.000Z"
  }
]
```

Filter applied server-side: `active = true AND validFrom <= now AND validTo >= now`.

---

### `GET /api/schedule`

Returns the 7-day weekly schedule with a calculated `isOpenNow` field.

| Field     | Value    |
|-----------|----------|
| Auth      | None     |
| Response  | `200 OK` |

**Response body**:
```json
[
  {
    "dayOfWeek":   0,
    "openTime":    "11:00",
    "closeTime":   "22:00",
    "isOpen":      false,
    "specialNote": null,
    "isOpenNow":   false
  },
  {
    "dayOfWeek":   1,
    "openTime":    "11:00",
    "closeTime":   "22:00",
    "isOpen":      true,
    "specialNote": null,
    "isOpenNow":   true
  }
]
```

`isOpenNow`: Calculated using current time in Argentina (UTC-3, no DST).
`true` only when `isOpen = true` AND `openTime <= currentTime < closeTime`.

---

### `GET /api/weekly-menu`

Returns the daily dish list for the current week.

| Field     | Value    |
|-----------|----------|
| Auth      | None     |
| Response  | `200 OK` |

**Response body** (data available):
```json
[
  {
    "id": 1,
    "weekStart": "2026-05-05T00:00:00.000Z",
    "dayOfWeek": 1,
    "dishes": ["Milanesa con papas", "Pollo al horno"]
  }
]
```

**Response body** (no data for current week):
```json
[]
```

`weekStart` is always the most recent Monday at 00:00 UTC, calculated server-side.

---

### `POST /api/pizza-party/request`

Submit a pizza party inquiry. Price is calculated server-side.

| Field        | Value              |
|--------------|--------------------|
| Auth         | None               |
| Content-Type | `application/json` |
| Response     | `200 OK`           |

**Request body**:
```json
{
  "name":        "María García",
  "email":       "maria@example.com",
  "phone":       "+54 9 11 1234-5678",
  "eventDate":   "2026-06-15",
  "guests":      30,
  "extraHours":  1,
  "extraMozzos": 2,
  "message":     "Evento corporativo, necesitamos menú vegetariano"
}
```

**Response body** `200 OK`:
```json
{
  "id":         42,
  "totalPrice": 118000
}
```

**Response body** `400 Bad Request`:
```json
{
  "error": "Validation error",
  "fields": [
    { "path": "email",  "message": "Invalid email" },
    { "path": "guests", "message": "Number must be greater than 0" }
  ]
}
```

**Side effects**:
1. Inserts a `PizzaPartyRequest` row with `status = pending`.
2. Sends an email to `OWNER_EMAIL` with all request details.

**`totalPrice` formula**:
```
totalPrice = guests × pricePerPerson + extraHours × extraHourPrice + extraMozzos × mozzoPrice
```
Config values fetched from `PizzaPartyConfig` (id = 1). Any `totalPrice` sent by the client is silently ignored.

---

### `POST /api/contact`

Submit a contact message.

| Field        | Value              |
|--------------|--------------------|
| Auth         | None               |
| Content-Type | `application/json` |
| Response     | `200 OK`           |

**Request body**:
```json
{
  "name":    "Juan López",
  "email":   "juan@example.com",
  "phone":   "+54 9 11 9876-5432",
  "message": "Quisiera saber si tienen servicio a domicilio"
}
```

**Response body** `200 OK`:
```json
{ "success": true }
```

**Response body** `400 Bad Request`:
```json
{
  "error": "Validation error",
  "fields": [
    { "path": "message", "message": "Required" }
  ]
}
```

**Side effects**:
1. Inserts a `ContactMessage` row with `read = false`.
2. Sends an email to `OWNER_EMAIL` with the message details.

---

## Error Response Contract

All endpoints return errors in one of two shapes:

### 400 Validation Error

```json
{
  "error":  "Validation error",
  "fields": [{ "path": "<field_name>", "message": "<reason>" }]
}
```

### 500 Internal Error

```json
{
  "error": "Internal server error"
}
```

Stack traces are never included in responses (suppressed in `errorHandler.ts` when `NODE_ENV=production`).

# Data Model: 5 Public Pages — La Olla Website

**Branch**: `005-public-pages` | **Date**: 2026-05-09  
**File to update**: `frontend/src/types/index.ts`

All types below are additions to the existing `types/index.ts`. Existing types (`ScheduleDay`, `ScheduleResponse`, `CurrentScheduleState`, `LoginRequest`, `LoginResponse`, `ApiError`, `JWTPayload`, `AuthState`) are unchanged.

---

## API Response Types

### Menu

```typescript
export interface MenuItem {
  id: number
  name: string
  price: number          // 0 = "variedad disponible" (no fixed price)
  description: string | null
}

export interface MenuCategory {
  category: {
    id: number
    name: string
    slug: string
  }
  items: MenuItem[]
}

export type MenuResponse = MenuCategory[]
```

### Offers

```typescript
export interface Offer {
  id: number
  title: string
  description: string
  badge: string
  validFrom: string      // ISO 8601 date string
  validTo: string        // ISO 8601 date string
  createdAt: string
}

export type OffersResponse = Offer[]
```

### Pizza Party Config

```typescript
export interface PizzaPartyConfig {
  pricePerPerson: number
  minimumGuests: number
  baseHours: number       // always 3 per spec
  extraHourPrice: number
  mozzoPrice: number
  serviceDetails: string
}
```

### Weekly Menu

```typescript
export interface WeeklyMenuDay {
  id: number
  weekStart: string       // ISO 8601 date string (Monday 00:00 UTC)
  dayOfWeek: number       // 1=Monday … 5=Friday
  dishes: string[]
}

export type WeeklyMenuResponse = WeeklyMenuDay[]
```

---

## Form Data Types

### Pizza Party Request (POST /api/pizza-party/request)

```typescript
export interface PizzaPartyRequestPayload {
  name: string
  email: string
  phone: string
  eventDate: string        // ISO date string (YYYY-MM-DD)
  guests: number
  extraHours: number       // 0 | 1 | 2
  extraMozzos: number
  message?: string
}
```

### Contact Form (POST /api/contact)

```typescript
export interface ContactPayload {
  name: string
  email: string
  phone?: string
  message: string          // min 10 chars validated by Zod schema
}
```

---

## Component State Types

### Calculator values shared between PriceCalculator and RequestForm

```typescript
export interface CalculatorValues {
  guests: number
  extraHours: 0 | 1 | 2
  extraMozzos: number
}
```

---

## Zod Schemas (live in component files, not in types/index.ts)

### PizzaPartyRequestSchema (in `RequestForm.tsx`)

```typescript
const PizzaPartyRequestSchema = z.object({
  name:       z.string().min(1, 'Nombre requerido'),
  email:      z.email('Email inválido'),
  phone:      z.string().min(1, 'Teléfono requerido'),
  eventDate:  z.string().min(1, 'Fecha requerida'),
  message:    z.string().optional(),
})
```

Note: `guests`, `extraHours`, `extraMozzos` are sourced from the calculator state (props) and appended to the payload before submission — they are not part of the form's registered fields.

### ContactSchema (in `ContactoPage.tsx` or `ContactForm.tsx`)

```typescript
const ContactSchema = z.object({
  name:    z.string().min(1, 'Nombre requerido'),
  email:   z.email('Email inválido'),
  phone:   z.string().optional(),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
})
```

---

## Relationships

```
MenuResponse
  └── MenuCategory[]
        └── items: MenuItem[]

PizzaPartyPage (state: CalculatorValues)
  ├── PriceCalculator (reads config: PizzaPartyConfig, writes CalculatorValues)
  └── RequestForm (reads CalculatorValues, submits PizzaPartyRequestPayload)

ScheduleSection / MenuPage
  └── useCurrentSchedule() → CurrentScheduleState (existing)
```

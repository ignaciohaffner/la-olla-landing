# Data Model: Admin Login y Panel de Administración

**Branch**: `006-admin-panel` | **Date**: 2026-05-10

All types below are additions to `frontend/src/types/index.ts`. Existing public types (`Offer`, `MenuItem`, `MenuCategory`, etc.) are preserved unchanged.

---

## Auth (existing, no changes)

```typescript
// Already in types/index.ts — no changes needed
interface LoginRequest { email: string; password: string }
interface LoginResponse { token: string }
interface JWTPayload { exp: number; [key: string]: unknown }
```

---

## Menu (admin)

```typescript
// Full menu item with availability — admin endpoint returns all items including unavailable
export interface AdminMenuItem {
  id: number
  name: string
  price: number
  description: string | null
  available: boolean
  sortOrder: number
  categoryId: number
}

export interface AdminMenuCategory {
  category: {
    id: number
    name: string
    slug: string
  }
  items: AdminMenuItem[]
}

export type AdminMenuResponse = AdminMenuCategory[]
```

---

## Categories (admin)

```typescript
export interface AdminCategory {
  id: number
  name: string
  slug: string
  sortOrder: number
}

export type AdminCategoriesResponse = AdminCategory[]
```

---

## Pizza Party (admin)

```typescript
// PizzaPartyConfig already exists in types/index.ts — no changes needed
// PizzaPartyConfig { pricePerPerson, minimumGuests, baseHours, extraHourPrice, mozzoPrice, serviceDetails }

export interface PizzaPartyRequest {
  id: number
  name: string
  email: string
  phone: string
  eventDate: string        // ISO 8601 datetime string
  guests: number
  extraHours: number
  extraMozzos: number
  message: string | null
  totalPrice: number
  status: 'pending' | 'confirmed' | 'rejected'
  adminNotes: string | null
  createdAt: string        // ISO 8601 datetime string
}

export type PizzaPartyRequestsResponse = PizzaPartyRequest[]
```

---

## Offers (admin)

```typescript
// Separate from the public Offer type — includes the `active` field
export interface AdminOffer {
  id: number
  title: string
  description: string
  badge: string | null
  validFrom: string        // ISO 8601 datetime string
  validTo: string          // ISO 8601 datetime string
  active: boolean
  createdAt: string
}

export type AdminOffersResponse = AdminOffer[]

// Zod schema for create form (lives in OffersTab.tsx)
// z.object({
//   title: z.string().min(1, 'Requerido'),
//   description: z.string().min(1, 'Requerido'),
//   badge: z.string().optional(),
//   validFrom: z.string().min(1, 'Requerido'),   // <input type="date"> value
//   validTo: z.string().min(1, 'Requerido'),
//   active: z.boolean().default(true),
// })
```

---

## Schedule (admin)

```typescript
// Admin version — no isOpenNow field (that's a computed public field)
export interface AdminScheduleDay {
  dayOfWeek: number        // 0 = Sunday … 6 = Saturday
  openTime: string         // "HH:MM"
  closeTime: string        // "HH:MM"
  isOpen: boolean
  specialNote: string | null
}

export type AdminScheduleResponse = AdminScheduleDay[]
```

---

## Weekly Menu (admin)

```typescript
// WeeklyMenuDay already exists in types/index.ts — no changes needed
// WeeklyMenuDay { id, weekStart, dayOfWeek, dishes: string[] }
// WeeklyMenuResponse = WeeklyMenuDay[]

// PUT body shape sent by the frontend
export interface WeeklyMenuPutDay {
  dayOfWeek: number        // 1 = Monday … 5 = Friday
  dishes: string[]
}

export type WeeklyMenuPutBody = WeeklyMenuPutDay[]
```

---

## Contact Messages (admin)

```typescript
export interface ContactMessage {
  id: number
  name: string
  email: string
  phone: string | null
  message: string
  read: boolean
  createdAt: string        // ISO 8601 datetime string
}

export type ContactMessagesResponse = ContactMessage[]
```

---

## Backend Fix: Contact Repository

The following change is required in `backend/src/repositories/contact.repository.ts`:

```typescript
// REMOVE:
export const markContactMessageRead = (id: number) =>
  prisma.contactMessage.update({ where: { id }, data: { read: true } });

// ADD:
export const setContactMessageReadStatus = (id: number, read: boolean) =>
  prisma.contactMessage.update({ where: { id }, data: { read } });
```

And in `backend/src/controllers/admin/contact.controller.ts`:

```typescript
// REMOVE:
const MarkReadSchema = z.object({ read: z.literal(true) });

// ADD:
const MarkReadSchema = z.object({ read: z.boolean() });

// UPDATE the handler to pass req.body.read (boolean) to the repository
```

---

## React Query Cache Keys

Consistent query keys used across all admin hooks:

| Resource | Query Key |
|----------|-----------|
| Admin menu | `['admin', 'menu']` |
| Admin categories | `['admin', 'categories']` |
| Pizza party config | `['admin', 'pizza-party', 'config']` |
| Pizza party requests | `['admin', 'pizza-party', 'requests']` |
| Admin offers | `['admin', 'offers']` |
| Admin schedule | `['admin', 'schedule']` |
| Admin weekly menu | `['admin', 'weekly-menu']` |
| Contact messages | `['admin', 'contact']` |
| Unread count | `['admin', 'contact', 'unread']` |

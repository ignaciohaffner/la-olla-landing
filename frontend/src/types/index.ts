export interface ScheduleDay {
  dayOfWeek: number
  isOpen: boolean
  openTime: string
  closeTime: string
  openTime2: string | null
  closeTime2: string | null
  specialNote: string | null
  isOpenNow: boolean
}

export type ScheduleResponse = ScheduleDay[]

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
}

export interface ApiError {
  message: string
}

export interface JWTPayload {
  exp: number
  [key: string]: unknown
}

export interface AuthState {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export interface CurrentScheduleState {
  schedule: ScheduleResponse | undefined
  isOpenNow: boolean
  isLoading: boolean
  error: Error | null
}

// Menu
export interface MenuItem {
  id: number
  name: string
  price: number
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

// Offers
export interface Offer {
  id: number
  title: string
  description: string
  badge: string
  validFrom: string
  validTo: string
  createdAt: string
}

export type OffersResponse = Offer[]

// Pizza Party
export interface PizzaPartyConfig {
  pricePerPerson: number
  minimumGuests: number
  baseHours: number
  extraHourPrice: number
  mozzoPrice: number
  serviceDetails: string
}

export interface CalculatorValues {
  guests: number
  extraHours: 0 | 1 | 2
  extraMozzos: number
}

export interface PizzaPartyRequestPayload {
  name: string
  email: string
  phone: string
  eventDate: string
  guests: number
  extraHours: number
  extraMozzos: number
  message?: string
}

// Weekly Menu
export interface WeeklyMenuDay {
  id: number
  weekStart: string
  dayOfWeek: number
  dishes: string[]
}

export type WeeklyMenuResponse = WeeklyMenuDay[]

// Contact
export interface ContactPayload {
  name: string
  email: string
  phone?: string
  message: string
}

// ─── Admin types ───────────────────────────────────────────────────────────

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
  id: number
  name: string
  slug: string
  sortOrder: number
  items: AdminMenuItem[]
}

export type AdminMenuResponse = AdminMenuCategory[]

export interface AdminCategory {
  id: number
  name: string
  slug: string
  sortOrder: number
}

export type AdminCategoriesResponse = AdminCategory[]

export interface PizzaPartyRequest {
  id: number
  name: string
  email: string
  phone: string
  eventDate: string
  guests: number
  extraHours: number
  extraMozzos: number
  message: string | null
  totalPrice: number
  status: 'pending' | 'confirmed' | 'rejected'
  adminNotes: string | null
  createdAt: string
}

export type PizzaPartyRequestsResponse = PizzaPartyRequest[]

export interface AdminOffer {
  id: number
  title: string
  description: string
  badge: string | null
  validFrom: string
  validTo: string
  active: boolean
  createdAt: string
}

export type AdminOffersResponse = AdminOffer[]

export interface AdminScheduleDay {
  dayOfWeek: number
  isOpen: boolean
  openTime: string
  closeTime: string
  openTime2: string | null
  closeTime2: string | null
  specialNote: string | null
}

export type AdminScheduleResponse = AdminScheduleDay[]

export interface ContactMessage {
  id: number
  name: string
  email: string
  phone: string | null
  message: string
  read: boolean
  createdAt: string
}

export type ContactMessagesResponse = ContactMessage[]

export interface WeeklyMenuPutDay {
  dayOfWeek: number
  dishes: string[]
}

export type WeeklyMenuPutBody = WeeklyMenuPutDay[]

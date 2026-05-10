export interface ScheduleDay {
  dayOfWeek: number
  openTime: string
  closeTime: string
  isOpen: boolean
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

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

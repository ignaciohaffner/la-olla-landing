import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../lib/api'
import type { LoginResponse, JWTPayload } from '../types'

const TOKEN_KEY = 'laolla_token'

function isTokenValid(token: string): boolean {
  try {
    const payloadB64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(payloadB64)) as JWTPayload
    return payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

export function useAuth() {
  const navigate = useNavigate()

  const token = localStorage.getItem(TOKEN_KEY)
  const isAuthenticated = token !== null && isTokenValid(token)

  async function login(email: string, password: string): Promise<void> {
    const { token } = await apiFetch<LoginResponse>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    localStorage.setItem(TOKEN_KEY, token)
    navigate('/admin/panel')
  }

  function logout(): void {
    localStorage.removeItem(TOKEN_KEY)
    navigate('/admin')
  }

  return { isAuthenticated, login, logout }
}

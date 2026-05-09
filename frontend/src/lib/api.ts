const BASE_URL = import.meta.env.VITE_API_URL ?? ''

export async function apiFetch<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string>),
  }

  if (path.startsWith('/api/admin/')) {
    const token = localStorage.getItem('laolla_token')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  const response = await fetch(`${BASE_URL}${path}`, { ...init, headers })

  if (!response.ok) {
    let message = response.statusText
    try {
      const body = await response.json()
      if (typeof body?.message === 'string') {
        message = body.message
      }
    } catch {
      // keep statusText as fallback
    }
    throw new Error(message)
  }

  return response.json() as Promise<T>
}

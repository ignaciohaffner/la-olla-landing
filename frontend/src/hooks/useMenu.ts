import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../lib/api'
import type { MenuResponse } from '../types'

export function useMenu() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['menu'],
    queryFn: () => apiFetch<MenuResponse>('/api/menu'),
  })

  return { data, isLoading, error: error as Error | null }
}

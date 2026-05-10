import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../lib/api'
import type { WeeklyMenuResponse } from '../types'

export function useWeeklyMenu() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['weekly-menu'],
    queryFn: () => apiFetch<WeeklyMenuResponse>('/api/weekly-menu'),
  })

  return { data, isLoading, error: error as Error | null }
}

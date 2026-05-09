import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../lib/api'
import type { ScheduleResponse, CurrentScheduleState } from '../types'

export function useCurrentSchedule(): CurrentScheduleState {
  const { data, isLoading, error } = useQuery({
    queryKey: ['schedule'],
    queryFn: () => apiFetch<ScheduleResponse>('/api/schedule'),
  })

  const isOpenNow = data?.some((day) => day.isOpenNow) ?? false

  return {
    schedule: data,
    isOpenNow,
    isLoading,
    error: error as Error | null,
  }
}

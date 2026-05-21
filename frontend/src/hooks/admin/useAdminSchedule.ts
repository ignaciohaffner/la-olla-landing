import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../../lib/api'
import type { AdminScheduleDay, AdminScheduleResponse } from '../../types'

export function useAdminSchedule() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'schedule'],
    queryFn: () => apiFetch<AdminScheduleResponse>('/api/admin/schedule'),
  })

  const saveSchedule = useMutation({
    mutationFn: (days: AdminScheduleDay[]) =>
      apiFetch<AdminScheduleResponse>('/api/admin/schedule', {
        method: 'PATCH',
        body: JSON.stringify(days.map(d => ({
          ...d,
          openTime2: d.openTime2 ?? null,
          closeTime2: d.closeTime2 ?? null,
        }))),
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['admin', 'schedule'] }),
  })

  return { data, isLoading, saveSchedule }
}

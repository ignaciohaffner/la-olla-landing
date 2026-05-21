import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../../lib/api'
import type { WeeklyMenuResponse, WeeklyMenuPutBody } from '../../types'

export function useAdminWeeklyMenu() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'weekly-menu'],
    queryFn: () => apiFetch<WeeklyMenuResponse>('/api/admin/weekly-menu'),
  })

  const publishWeeklyMenu = useMutation({
    mutationFn: (body: WeeklyMenuPutBody) =>
      apiFetch<WeeklyMenuResponse>('/api/admin/weekly-menu', {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['admin', 'weekly-menu'] }),
  })

  return { data, isLoading, publishWeeklyMenu }
}

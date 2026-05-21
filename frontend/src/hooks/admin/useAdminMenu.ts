import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../../lib/api'
import type { AdminMenuResponse, AdminMenuItem } from '../../types'

export function useAdminMenu() {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'menu'] })

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'menu'],
    queryFn: () => apiFetch<AdminMenuResponse>('/api/admin/menu'),
  })

  const createItem = useMutation({
    mutationFn: (body: {
      name: string
      price: number
      categoryId: number
      description?: string
      available?: boolean
      sortOrder?: number
    }) =>
      apiFetch<AdminMenuItem>('/api/admin/menu/items', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    onSuccess: invalidate,
  })

  const patchItem = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<AdminMenuItem> }) =>
      apiFetch<AdminMenuItem>(`/api/admin/menu/items/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: invalidate,
  })

  const deleteItem = useMutation({
    mutationFn: (id: number) =>
      apiFetch<void>(`/api/admin/menu/items/${id}`, { method: 'DELETE' }),
    onSuccess: invalidate,
  })

  const bulkUpdatePrices = useMutation({
    mutationFn: (items: { id: number; price: number }[]) =>
      apiFetch<{ updated: number }>('/api/admin/menu/prices', {
        method: 'PATCH',
        body: JSON.stringify(items),
      }),
    onSuccess: invalidate,
  })

  return { data, isLoading, createItem, patchItem, deleteItem, bulkUpdatePrices }
}

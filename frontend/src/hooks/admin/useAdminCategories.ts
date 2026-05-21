import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../../lib/api'
import type { AdminCategory, AdminCategoriesResponse } from '../../types'

export function useAdminCategories() {
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] })
    queryClient.invalidateQueries({ queryKey: ['admin', 'menu'] })
  }

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: () => apiFetch<AdminCategoriesResponse>('/api/admin/categories'),
  })

  const createCategory = useMutation({
    mutationFn: (body: { name: string; slug: string; sortOrder: number }) =>
      apiFetch<AdminCategory>('/api/admin/categories', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    onSuccess: invalidate,
  })

  const deleteCategory = useMutation({
    mutationFn: (id: number) =>
      apiFetch<void>(`/api/admin/categories/${id}`, { method: 'DELETE' }),
    onSuccess: invalidate,
  })

  return { data, isLoading, createCategory, deleteCategory }
}

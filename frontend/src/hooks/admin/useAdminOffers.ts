import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../../lib/api'
import type { AdminOffer, AdminOffersResponse } from '../../types'

export function useAdminOffers() {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'offers'] })

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'offers'],
    queryFn: () => apiFetch<AdminOffersResponse>('/api/admin/offers'),
  })

  const createOffer = useMutation({
    mutationFn: (body: {
      title: string
      description: string
      badge?: string
      validFrom: string
      validTo: string
      active: boolean
    }) =>
      apiFetch<AdminOffer>('/api/admin/offers', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    onSuccess: invalidate,
  })

  const patchOffer = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<AdminOffer> }) =>
      apiFetch<AdminOffer>(`/api/admin/offers/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: invalidate,
  })

  const deleteOffer = useMutation({
    mutationFn: (id: number) =>
      apiFetch<void>(`/api/admin/offers/${id}`, { method: 'DELETE' }),
    onSuccess: invalidate,
  })

  return { data, isLoading, createOffer, patchOffer, deleteOffer }
}

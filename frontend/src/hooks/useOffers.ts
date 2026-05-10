import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../lib/api'
import type { OffersResponse } from '../types'

export function useOffers() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['offers'],
    queryFn: () => apiFetch<OffersResponse>('/api/offers'),
  })

  return { data, isLoading, error: error as Error | null }
}
